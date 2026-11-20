const { connect, mongoose } = require('../backend/db/mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  try {
    const conn = await connect();
    console.log('Successfully connected to MongoDB:', conn.name || conn.connection?.name);
    console.log('Host:', conn.host || mongoose.connection.host);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections count:', collections.length);
    console.log('Collections:', collections.map(c => c.name).join(', '));
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();

