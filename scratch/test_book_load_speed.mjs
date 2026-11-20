import http from 'http';

function checkSpeed() {
  const start = Date.now();
  http.get('http://localhost:5000/api/books?limit=50', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const duration = Date.now() - start;
      console.log(`Status: ${res.statusCode}`);
      console.log(`Response time: ${duration}ms`);
      try {
        const parsed = JSON.parse(data);
        console.log(`Books returned: ${parsed.books?.length || 0}`);
        console.log(`Categories returned: ${parsed.categories?.length || 0}`);
        console.log(`Sample book: ${parsed.books?.[0]?.title}`);
      } catch (e) {
        console.log('Response body:', data.slice(0, 200));
      }
    });
  }).on('error', (err) => {
    console.log('Server not responding directly on port 5000 (might be off or different port):', err.message);
  });
}

checkSpeed();
