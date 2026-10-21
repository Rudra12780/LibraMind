const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const loansRoutes = require('./routes/loans');
const reservationsRoutes = require('./routes/reservations');
const seatsRoutes = require('./routes/seats');
const notificationsRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const wishlistRoutes = require('./routes/wishlist');
const visitPlannerRoutes = require('./routes/visitPlanner');
const { startScheduler, runSchedulerCycle } = require('./scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/visit-planner', visitPlannerRoutes);

// On-demand scheduler trigger endpoint for testing or manual cron invocation
app.post('/api/notifications/run-cron', (req, res) => {
  const result = runSchedulerCycle();
  res.json({
    message: 'Scheduled reminder and expiry cycle completed',
    result
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'LibraMind AI Smart Library System',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`LibraMind Backend Server listening on http://localhost:${PORT}`);
  // Start the background scheduler
  startScheduler(3 * 60 * 1000);
});
