const puppeteer = require('puppeteer-core');
const fs = require('fs');
const http = require('http');
const path = require('path');

// Create a simple local static file server
const PORT = 9000;
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  let contentType = 'text/html';
  if (ext === '.css') contentType = 'text/css';
  else if (ext === '.js') contentType = 'text/javascript';
  else if (ext === '.json') contentType = 'application/json';
  else if (ext === '.mp3') contentType = 'audio/mpeg';
  else if (ext === '.png') contentType = 'image/png';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

async function run() {
  server.listen(PORT);
  console.log(`Local static server started on http://localhost:${PORT}`);

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
  ];
  
  let executablePath = null;
  for (const path of chromePaths) {
    if (fs.existsSync(path)) {
      executablePath = path;
      break;
    }
  }
  
  if (!executablePath) {
    console.error("Chrome executable not found.");
    server.close();
    process.exit(1);
  }
  
  const browser = await puppeteer.launch({
    executablePath: executablePath,
    headless: true
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  
  console.log(`Navigating to http://localhost:${PORT}/index.html ...`);
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2' });
  
  // Test Scrolling behavior
  console.log("Checking initial scroll position...");
  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log("Initial Scroll Y:", initialScrollY);

  console.log("Attempting vertical scroll: window.scrollTo(0, 500) ...");
  await page.evaluate(() => {
    window.scrollTo(0, 500);
  });
  
  // Wait a moment for any render/scroll updates
  await new Promise(r => setTimeout(r, 500));
  
  const afterScrollY = await page.evaluate(() => window.scrollY);
  console.log("Scroll Y after scroll operation:", afterScrollY);

  if (afterScrollY > 0) {
    console.log("✅ SUCCESS: The page scrolls vertically! Scroll Y changed to", afterScrollY);
  } else {
    console.log("❌ FAILURE: Scroll Y position remains 0. Scrolling is BLOCKED!");
  }

  await browser.close();
  server.close();
}

run().catch(err => {
  console.error(err);
  server.close();
});
