const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET, authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

// Register new student/member
router.post('/register', (req, res) => {
  try {
    const { name, email, password, interests } = req.body;

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

    // Generate unique membership ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const membership_id = `STU-${randomNum}`;

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, membership_id, interests)
      VALUES (?, ?, ?, 'student', ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      password_hash,
      membership_id,
      interests ? interests.trim() : 'Computer Science, General Reading'
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

    logAudit(userId, 'USER_REGISTERED', `Student registered with membership ${membership_id}`);

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: 'student', name: name.trim(), membership_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'student',
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
      SELECT u.id, u.name, u.email, u.role, u.membership_id, u.created_at,
             (SELECT COUNT(*) FROM loans l WHERE l.user_id = u.id AND l.status = 'active') as active_loans
      FROM users u
      ORDER BY u.created_at DESC
    `).all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Update user role
router.put('/users/:id/role', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'librarian', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
    logAudit(req.user.id, 'ROLE_UPDATED', `Changed user ${req.params.id} role to ${role}`);
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
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
