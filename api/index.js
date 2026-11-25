const { connect } = require('../backend/db/mongoose');
const app = require('../backend/server');

module.exports = async (req, res) => {
  try {
    await connect();
  } catch (err) {
    console.error('Vercel Serverless MongoDB connection error:', err.message);
  }
  return app(req, res);
};
