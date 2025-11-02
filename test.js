const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('✅ Test Passed: Server is healthy');
    process.exit(0);
  } else {
    console.log('❌ Test Failed: Server not healthy');
    process.exit(1);
  }
});

req.on('error', (e) => {
  console.log('❌ Test Failed: Server not reachable');
  process.exit(1);
});

req.end();