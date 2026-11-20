// scratch/test_api_endpoints.js – HTTP route simulation against Express app with MongoDB
const http = require('http');
const app = require('../backend/server');
const { connect, mongoose } = require('../backend/db/mongoose');
const User = require('../backend/models/User');
const Book = require('../backend/models/Book');
const bcrypt = require('../backend/node_modules/bcryptjs');

async function testHttpEndpoints() {
  console.log('Testing Express API endpoints with live server...');
  await connect();

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  try {
    // 1. Health check
    const health = await makeRequest('GET', '/api/health');
    console.log('GET /api/health:', health.status, health.body?.status, health.body?.database);
    if (health.status !== 200 || health.body?.database !== 'MongoDB') {
      throw new Error('Health check failed');
    }

    // 2. Public Catalog
    const catalog = await makeRequest('GET', '/api/books?limit=5');
    console.log('GET /api/books:', catalog.status, 'books count:', catalog.body?.books?.length, 'categories:', catalog.body?.categories?.length);
    if (catalog.status !== 200) throw new Error('Catalog retrieval failed');

    // 3. User Register & Login Flow
    const testRegEmail = `http_patron_${Date.now()}@libramind.edu`;
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'HTTP Test Student',
      email: testRegEmail,
      password: 'password@123',
      interests: 'Distributed Systems'
    });
    console.log('POST /api/auth/register:', regRes.status, regRes.body?.message);
    if (regRes.status !== 201 || !regRes.body?.token) throw new Error('Registration failed');

    const token = regRes.body.token;

    // 4. Authenticated /me
    const meRes = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${token}`
    });
    console.log('GET /api/auth/me:', meRes.status, meRes.body?.name, meRes.body?.membership_id);
    if (meRes.status !== 200 || meRes.body?.email !== testRegEmail) throw new Error('/api/auth/me failed');

    // 5. Authenticated notifications
    const notifs = await makeRequest('GET', '/api/notifications', null, {
      'Authorization': `Bearer ${token}`
    });
    console.log('GET /api/notifications:', notifs.status, 'count:', notifs.body?.length);
    if (notifs.status !== 200) throw new Error('Notifications failed');

    // 6. Clean up created test user
    await User.deleteOne({ email: testRegEmail });
    console.log('Cleaned up test registration.');

    console.log('\nAll HTTP Route tests PASSED successfully.');
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('HTTP test failed:', err);
    server.close();
    if (mongoose.connection.readyState) await mongoose.disconnect();
    process.exit(1);
  }
}

testHttpEndpoints();

