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
  await bootstrap();
  return app(req, res);
};
