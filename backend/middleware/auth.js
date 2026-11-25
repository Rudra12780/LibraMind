const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');
const { buildIdFilter } = require('../utils/idHelper');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev_jwt_auth_token_key' : '');
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

async function logAudit(userId, action, details, ipAddress = null) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    let mongoUserId = null;
    let sqliteId = null;

    if (userId) {
      if (mongoose.Types.ObjectId.isValid(String(userId))) {
        mongoUserId = new mongoose.Types.ObjectId(String(userId));
      } else if (!isNaN(Number(userId))) {
        sqliteId = Number(userId);
      }
    }

    await AuditLog.create({
      user_id: mongoUserId,
      sqlite_user_id: sqliteId,
      action: action || 'UNKNOWN',
      details: details || '',
      ip_address: ipAddress || '',
      timestamp: new Date()
    });
  } catch (err) {
    // Non-blocking for audit logging
    console.error('Audit log failed:', err.message);
  }
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole,
  logAudit
};
