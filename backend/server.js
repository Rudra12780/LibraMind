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

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure local uploads directory exists for offline image storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) 
  : ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:5001', 'http://127.0.0.1:5001', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5175'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly fallback
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static local uploads serving (allows full offline image access without internet)
app.use('/uploads', express.static(uploadsDir));

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

// Direct PowerPoint Presentation (.pptx) Download Endpoint
app.get('/api/download-presentation', (req, res) => {
  const pptxUploads = path.join(uploadsDir, 'LibraMind_Design_Thinking_Presentation.pptx');
  const pptxRoot = path.join(__dirname, '..', 'LibraMind_Design_Thinking_Presentation.pptx');
  const targetFile = fs.existsSync(pptxUploads) ? pptxUploads : pptxRoot;
  if (fs.existsSync(targetFile)) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.download(targetFile, 'LibraMind_Design_Thinking_Presentation.pptx');
  } else {
    res.status(404).json({ error: 'Presentation file not found' });
  }
});

// Direct Complete Blueprints Offline Package (.zip) Download Endpoint
app.get('/api/download-blueprints', (req, res) => {
  const zipUploads = path.join(uploadsDir, 'LibraMind_Complete_Blueprints_Offline_Bundle.zip');
  const zipRoot = path.join(__dirname, '..', 'LibraMind_Complete_Blueprints_Offline_Bundle.zip');
  const targetZip = fs.existsSync(zipUploads) ? zipUploads : zipRoot;
  if (fs.existsSync(targetZip)) {
    res.setHeader('Content-Type', 'application/zip');
    res.download(targetZip, 'LibraMind_Complete_Blueprints_Offline_Bundle.zip');
  } else {
    res.status(404).json({ error: 'Blueprints bundle file not found' });
  }
});

// Standalone Offline Website & Blueprint Viewer Download Endpoint
app.get('/api/download-offline-viewer', (req, res) => {
  const htmlRoot = path.join(__dirname, '..', 'LibraMind_Offline_Website_&_Blueprints.html');
  const htmlPublic = path.join(__dirname, '..', 'frontend', 'public', 'LibraMind_Offline_Website_&_Blueprints.html');
  const targetHtml = fs.existsSync(htmlRoot) ? htmlRoot : htmlPublic;
  if (fs.existsSync(targetHtml)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.download(targetHtml, 'LibraMind_Offline_Website_&_Blueprints.html');
  } else {
    res.status(404).json({ error: 'Offline viewer file not found' });
  }
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

// Serve frontend build if dist exists (so http://localhost:5000/ and /admin@1234 work seamlessly)
const staticPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      return res.sendFile(path.join(staticPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`LibraMind Backend Server listening on http://localhost:${PORT}`);
  // Start the background scheduler
  startScheduler(3 * 60 * 1000);
});
