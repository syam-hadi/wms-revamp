const http = require('http');
const { execSync } = require('child_process');

const url = 'http://localhost:3000/api/v1/countries/29d4c151-d54a-4ab5-8149-4ba0fe24ace9';

function makeRequest() {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    http.get(url, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        resolve(performance.now() - start);
      });
    }).on('error', reject);
  });
}

async function runBenchmark() {
  console.log('--- CACHE MISS BENCHMARK ---');
  let missLatencies = [];
  for(let i=0; i<100; i++) {
    execSync('redis-cli flushall'); // Force cache miss
    const time = await makeRequest();
    missLatencies.push(time);
  }

  console.log('--- CACHE HIT BENCHMARK ---');
  let hitLatencies = [];
  // Populate cache first
  await makeRequest();
  
  for(let i=0; i<100; i++) {
    const time = await makeRequest();
    hitLatencies.push(time);
  }

  const calc = (arr) => {
    const avg = arr.reduce((a,b) => a+b, 0) / arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { avg, min, max };
  };

  const missStats = calc(missLatencies);
  const hitStats = calc(hitLatencies);

  console.log('Cache Miss:', missStats);
  console.log('Cache Hit:', hitStats);
  console.log(`Improvement: ${(((missStats.avg - hitStats.avg) / missStats.avg) * 100).toFixed(2)}%`);
}

runBenchmark().catch(console.error);
