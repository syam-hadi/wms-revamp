const http = require('http');

const data = JSON.stringify({ code: 'TMP', name: 'Temporary Country' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/countries',
  method: 'POST',
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
