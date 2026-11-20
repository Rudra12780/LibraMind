import http from 'http';
import app from '../backend/server.js';
import { connect } from '../backend/db/mongoose.js';

await connect();

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  const accounts = [
    { role: 'Student', email: 'student@libramind.edu', password: 'Student@123' },
    { role: 'Librarian', email: 'librarian@libramind.edu', password: 'Librarian@123' },
    { role: 'Admin', email: 'admin@libramind.edu', password: 'Admin@123' }
  ];

  for (const acc of accounts) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email, password: acc.password })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ [${acc.role}] Login successful! User: ${data.user.name} (${data.user.email}), Role: ${data.user.role}, Token: ${!!data.token}`);
      } else {
        console.log(`❌ [${acc.role}] Login failed! Status: ${res.status}, Error:`, data);
      }
    } catch (err) {
      console.log(`❌ [${acc.role}] Error:`, err.message);
    }
  }

  server.close(() => {
    process.exit(0);
  });
});
