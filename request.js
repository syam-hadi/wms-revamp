const http = require('http');

const data = JSON.stringify({ name: 'Indonesia Update Baru' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/countries/29d4c151-d54a-4ab5-8149-4ba0fe24ace9',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => { console.log(body); });
});

req.on('error', (error) => { console.error(error); });
req.write(data);
req.end();
