const http = require('http');

const url = 'http://localhost:3000/api/v1/countries/bceca615-0032-4885-9a3b-c2eba7fc74d0';

const promises = [];
for (let i = 0; i < 20; i++) {
  promises.push(new Promise((resolve) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => resolve(res.statusCode));
    });
  }));
}

Promise.all(promises).then(console.log);
