import { spawn } from 'child_process';
import http from 'http';

const PORT = 3099;

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
  });
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fetchUrl('/');
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('Server failed to start in time');
}

async function runTests() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });

  try {
    await waitForServer();
    console.log('Server is ready! Running tests...\n');

    // 1. Test /sitemap.xml
    const sitemapRes = await fetchUrl('/sitemap.xml');
    console.log('=== TEST 1: GET /sitemap.xml ===');
    console.log('HTTP Status Code:', sitemapRes.statusCode);
    console.log('Contains /gallery/undefined?:', sitemapRes.body.includes('undefined'));
    console.log('Contains /gallery/land-light?:', sitemapRes.body.includes('/gallery/land-light'));

    // 2. Test /gallery/undefined (should return HTTP 404)
    const invalidGalleryRes = await fetchUrl('/gallery/undefined');
    console.log('\n=== TEST 2: GET /gallery/undefined ===');
    console.log('HTTP Status Code:', invalidGalleryRes.statusCode, invalidGalleryRes.statusCode === 404 ? '✅ (PASS 404)' : '❌ (FAIL)');

    // 3. Test /gallery/land-light (should return HTTP 200)
    const validGalleryRes = await fetchUrl('/gallery/land-light');
    console.log('\n=== TEST 3: GET /gallery/land-light ===');
    console.log('HTTP Status Code:', validGalleryRes.statusCode, validGalleryRes.statusCode === 200 ? '✅ (PASS 200)' : '❌ (FAIL)');

  } finally {
    console.log('\nShutting down test server...');
    server.kill('SIGTERM');
  }
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
