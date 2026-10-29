const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'libramind-biophilic-secret-key-2026';
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('[SECURITY WARNING] JWT_SECRET is not set in environment variables! Using default secret in production is unsafe.');
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
}

function logAudit(userId, action, details, ipAddress = null) {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_id, action, details, ip_address)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(userId || null, action, details, ipAddress);
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole,
  logAudit
};
