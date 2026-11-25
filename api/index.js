const { connect } = require('../backend/db/mongoose');
const { ensureDemoAccounts } = require('../backend/db/demoAccounts');
const app = require('../backend/server');

let bootstrapPromise = null;

function bootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        await connect();
      } catch (err) {
        console.error('Vercel Serverless MongoDB connection error:', err.message);
      }
      try {
        await ensureDemoAccounts();
      } catch (err) {
        console.error('Vercel demo account bootstrap error:', err.message);
      }
    })();
  }
  return bootstrapPromise;
}

module.exports = async (req, res) => {
  // Handle CORS preflight immediately — prevents Vercel from returning 405
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Range');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  await bootstrap();
  return app(req, res);
};
