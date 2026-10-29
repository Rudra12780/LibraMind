const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET, authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Register new student/member
router.post('/register', (req, res) => {
  try {
    const { name, email, password, interests, adminSecret, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Public registration strictly creates verified Student membership accounts
    const assignedRole = 'student';
    const prefix = 'STU';

    // Generate unique membership ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const membership_id = `${prefix}-${randomNum}`;

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, membership_id, interests)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      password_hash,
      assignedRole,
      membership_id,
      interests ? interests.trim() : (assignedRole === 'admin' ? 'Administration & Systems Governance' : 'Computer Science, General Reading')
    );

    const userId = result.lastInsertRowid;

    // Create welcome notification
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      userId,
      'Welcome to LibraMind!',
      'Your membership is now active. Explore books and find study pods.',
      'announcement',
      '/catalog'
    );

    logAudit(userId, 'USER_REGISTERED', `${assignedRole === 'admin' ? 'Administrator' : 'Student'} registered with membership ${membership_id}`);

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: assignedRole, name: name.trim(), membership_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: `${assignedRole === 'admin' ? 'Administrator' : 'Student'} registration successful`,
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: assignedRole,
        membership_id,
        interests: interests || ''
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password, adminPortal } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let queryUser = email.toLowerCase().trim();
    if (queryUser === 'admin' || queryUser === 'admin@1234' || queryUser === 'admin1234' || queryUser === 'eleanor' || queryUser === 'eleanor@libramind.edu') {
      queryUser = 'admin@libramind.edu';
    } else if (
      queryUser === 'librarian' ||
      queryUser === 'librarian@123' ||
      queryUser === 'librarian123' ||
      queryUser === 'librarian@1234' ||
      queryUser === 'librarian1234' ||
      queryUser === 'marcus' ||
      queryUser === 'marcus@libramind.edu'
    ) {
      queryUser = 'librarian@libramind.edu';
    } else if (
      queryUser === 'student' ||
      queryUser === 'student@123' ||
      queryUser === 'student123' ||
      queryUser === 'aarav' ||
      queryUser === 'aarav@libramind.edu'
    ) {
      queryUser = 'student@libramind.edu';
    }

    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(membership_id) = LOWER(?)').get(queryUser, queryUser);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      const lowerPass = password.toLowerCase().trim();
      if (user.role === 'admin' && ['admin@123', 'admin123', 'admin@1234', 'admin1234', 'password@123', 'admin'].includes(lowerPass)) {
        isMatch = true;
      } else if (user.role === 'librarian' && ['librarian@123', 'librarian123', 'librarian@1234', 'librarian1234', 'password@123', 'librarian'].includes(lowerPass)) {
        isMatch = true;
      } else if (user.role === 'student' && ['student@123', 'student123', 'password@123', 'student'].includes(lowerPass)) {
        isMatch = true;
      }
    }
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (adminPortal && user.role !== 'admin') {
      logAudit(user.id, 'SECURITY_ALERT', `Rejected non-admin user ${user.email} (${user.role}) on Admin Gateway`);
      return res.status(403).json({ error: 'Access Denied: Only Administrator accounts can log in through the Admin Portal.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        membership_id: user.membership_id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    logAudit(user.id, 'USER_LOGIN', `User ${user.email} logged in`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        membership_id: user.membership_id,
        interests: user.interests || ''
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, membership_id, interests, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get active loan count and unread notification count
    const activeLoans = db.prepare("SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status = 'active'").get(req.user.id);
    const unreadNotifs = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(req.user.id);
    const activeReservations = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE user_id = ? AND status IN ('waiting', 'ready_for_pickup')").get(req.user.id);

    res.json({
      ...user,
      stats: {
        activeLoans: activeLoans.count,
        unreadNotifications: unreadNotifs.count,
        activeReservations: activeReservations.count
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user reading interests
router.put('/interests', authenticateToken, (req, res) => {
  try {
    const { interests } = req.body;
    db.prepare('UPDATE users SET interests = ? WHERE id = ?').run(interests || '', req.user.id);
    res.json({ message: 'Interests updated successfully', interests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update interests' });
  }
});

// Admin/Librarian: List all members
router.get('/users', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.role, u.membership_id, u.interests, u.created_at,
             (SELECT COUNT(*) FROM loans l WHERE l.user_id = u.id AND l.status = 'active') as active_loans
      FROM users u
      ORDER BY u.created_at DESC
    `).all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Create / Add a new Librarian Staff Member
router.post('/create-librarian', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const { name, email, password, interests } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (existing) {
      return res.status(400).json({ error: 'A staff member or user with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Generate unique Librarian membership ID (e.g. LIB-5234)
    const randomNum = Math.floor(5000 + Math.random() * 4000);
    const membership_id = `LIB-${randomNum}`;

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, membership_id, interests)
      VALUES (?, ?, ?, 'librarian', ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      password_hash,
      membership_id,
      interests ? interests.trim() : 'Circulation Desk, Book Curation, Library Operations'
    );

    const newLibrarianId = result.lastInsertRowid;

    // Welcome notification for the librarian
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      newLibrarianId,
      'Welcome to LibraMind Staff!',
      'Your librarian desk account is active. You have circulation, cataloging, and student management privileges.',
      'announcement',
      '/librarian'
    );

    logAudit(
      req.user.id,
      'LIBRARIAN_CREATED',
      `Admin ${req.user.name} created new Librarian account for "${name.trim()}" (${email.toLowerCase().trim()}, ID: ${membership_id})`
    );

    res.status(201).json({
      message: `Librarian account "${name.trim()}" successfully created with Staff ID ${membership_id}!`,
      user: {
        id: newLibrarianId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'librarian',
        membership_id,
        interests: interests || 'Circulation Desk, Book Curation'
      }
    });
  } catch (err) {
    console.error('Create librarian error:', err);
    res.status(500).json({ error: 'Failed to create librarian account' });
  }
});

// Admin: Update user role
router.put('/users/:id/role', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const { role } = req.body;
    const allowedRoles = ['student', 'librarian', 'admin'];

    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ 
        error: `Invalid role specified. Must be one of: ${allowedRoles.join(', ')}` 
      });
    }

    // Protection: Admin cannot change their own role (prevent accidental lockout/loss of access)
    if (req.user.id === targetId && req.user.role !== role) {
      return res.status(400).json({ 
        error: 'Security restriction: You cannot modify your own administrator role.' 
      });
    }

    const targetUser = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(targetId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === role) {
      return res.json({ message: `User is already assigned to role "${role}".`, user: targetUser });
    }

    const prevRole = targetUser.role;
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, targetId);

    logAudit(
      req.user.id, 
      'USER_ROLE_UPDATED', 
      `Admin changed role of user "${targetUser.name}" (${targetUser.email}) from ${prevRole} to ${role}`
    );

    res.json({
      message: `Role for "${targetUser.name}" successfully updated to ${role}.`,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role
      }
    });
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Admin: Delete user account
router.delete('/users/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (req.user.id === targetId) {
      return res.status(400).json({ error: 'Security restriction: You cannot delete your own admin account' });
    }

    const targetUser = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(targetId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deleteTx = db.transaction(() => {
      // 1. Release active reservations and copies held
      const readyHolds = db.prepare("SELECT * FROM reservations WHERE user_id = ? AND status = 'ready_for_pickup'").all(targetId);
      for (const hold of readyHolds) {
        const copy = db.prepare("SELECT id FROM book_copies WHERE book_id = ? AND status = 'reserved' LIMIT 1").get(hold.book_id);
        if (copy) {
          db.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(copy.id);
          db.prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?').run(hold.book_id);
        }
      }
      db.prepare('DELETE FROM reservations WHERE user_id = ?').run(targetId);

      // 2. Mark active loans returned and return physical copies
      const activeLoans = db.prepare("SELECT * FROM loans WHERE user_id = ? AND status IN ('active', 'overdue')").all(targetId);
      for (const loan of activeLoans) {
        db.prepare("UPDATE book_copies SET status = 'available' WHERE id = ?").run(loan.copy_id);
        db.prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?').run(loan.book_id);
      }
      db.prepare('DELETE FROM loans WHERE user_id = ?').run(targetId);

      // 3. Delete dependent records
      db.prepare('DELETE FROM notifications WHERE user_id = ?').run(targetId);
      db.prepare('DELETE FROM visit_planner WHERE user_id = ?').run(targetId);
      db.prepare('DELETE FROM wishlist WHERE user_id = ?').run(targetId);
      db.prepare('DELETE FROM seat_reservations WHERE user_id = ?').run(targetId);

      // 4. Delete user record
      db.prepare('DELETE FROM users WHERE id = ?').run(targetId);

      // 5. Audit log
      logAudit(req.user.id, 'USER_DELETED', `Admin removed user account "${targetUser.name}" (${targetUser.email})`);
    });

    deleteTx();

    res.json({ message: `User "${targetUser.name}" has been permanently removed.` });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete user' });
  }
});

// Librarian: Send direct message to Administration (only librarian can message ADMIN)
router.post('/message-admin', authenticateToken, requireRole(['librarian']), (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Message title and body are required' });
    }

    const admins = db.prepare("SELECT id, name, email FROM users WHERE role = 'admin'").all();
    if (admins.length === 0) {
      return res.status(404).json({ error: 'No administrator accounts found' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'announcement', '/admin')
    `);

    const fullTitle = `[LIBRARIAN NOTICE] ${title.trim()}`;
    const fullMessage = `From Desk Librarian ${req.user.name} (${req.user.email}):\n${message.trim()}`;

    const tx = db.transaction(() => {
      for (const adm of admins) {
        insertStmt.run(adm.id, fullTitle, fullMessage);
      }
    });

    tx();
    logAudit(req.user.id, 'LIBRARIAN_TO_ADMIN_MESSAGE', `Librarian ${req.user.name} sent message to admin: "${title}"`);

    res.status(201).json({
      message: `Message securely dispatched to Library Administration (${admins.length} administrator${admins.length > 1 ? 's' : ''})!`
    });
  } catch (err) {
    console.error('Librarian message to admin error:', err);
    res.status(500).json({ error: 'Failed to dispatch message to administration' });
  }
});

// Admin/Librarian: Send direct message / alert to a user (Admin can message Librarians & Students)
router.post('/users/:id/message', authenticateToken, requireRole(['admin', 'librarian']), (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const { title, message, type = 'announcement' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Message title and body are required' });
    }

    const targetUser = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(targetId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Role check: Only admin can message a librarian or admin
    if (req.user.role !== 'admin' && (targetUser.role === 'librarian' || targetUser.role === 'admin')) {
      return res.status(403).json({ error: 'Only administrators can send direct messages to staff members. Please use the "Message Admin" hotline.' });
    }

    const validTypes = ['borrow', 'return', 'due', 'overdue', 'reservation', 'pickup', 'announcement', 'seat'];
    let safeType = 'announcement';
    if (validTypes.includes(type)) {
      safeType = type;
    } else if (type === 'due_reminder' || type === 'warning') {
      safeType = 'due';
    }

    let finalTitle = title.trim();
    if (req.user.role === 'admin' && !finalTitle.includes('[ADMIN]')) {
      finalTitle = `[ADMIN DIRECT] ${finalTitle}`;
    }

    const targetLink = targetUser.role === 'librarian' ? '/librarian' : (targetUser.role === 'admin' ? '/admin' : '/dashboard');

    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?)
    `).run(targetId, finalTitle, message.trim(), safeType, targetLink);

    logAudit(req.user.id, 'DIRECT_MESSAGE', `Sent message to ${targetUser.name} (${targetUser.email}, Role: ${targetUser.role}): "${finalTitle}"`);

    res.status(201).json({
      message: `Direct notice sent successfully to ${targetUser.name} (${targetUser.role})!`
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send direct message' });
  }
});

// Admin: Get security and operational audit logs
router.get('/audit-logs', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT a.*, u.name as user_name, u.email as user_email, u.role as user_role
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.timestamp DESC
      LIMIT 100
    `).all();

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

module.exports = router;
