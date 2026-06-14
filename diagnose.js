const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function run() {
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
    console.error("Chrome executable not found on Windows standard paths.");
    process.exit(1);
  }
  
  console.log("Found Chrome at:", executablePath);
  
  const browser = await puppeteer.launch({
    executablePath: executablePath,
    headless: true
  });
  
  const page = await browser.newPage();
  
  // Set viewport to simulate a mobile device
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  
  console.log("Navigating to https://nova0816.github.io/LearnFrench/ ...");
  await page.goto('https://nova0816.github.io/LearnFrench/', { waitUntil: 'networkidle2' });
  
  console.log("Inspecting layout dimensions...");
  
  const report = await page.evaluate(() => {
    const getDetails = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return { selector, exists: false };
      
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      
      return {
        selector,
        exists: true,
        width: rect.width,
        height: rect.height,
        clientHeight: el.clientHeight,
        offsetHeight: el.offsetHeight,
        scrollHeight: el.scrollHeight,
        display: style.display,
        position: style.position,
        overflow: style.overflow,
        overflowY: style.overflowY,
        flex: style.flex,
        heightStyle: style.height,
        maxHeight: style.maxHeight,
        minHeight: style.minHeight
      };
    };
    
    return {
      html: getDetails('html'),
      body: getDetails('body'),
      container: getDetails('.app-container'),
      header: getDetails('.app-header'),
      categoryBar: getDetails('#category-bar-container'),
      mainContent: getDetails('.main-content'),
      viewExplore: getDetails('#view-explore'),
      grid: getDetails('.sentences-grid'),
      navbar: getDetails('.app-navbar')
    };
  });
  
  console.log("\n================ LAYOUT REPORT ================");
  console.log(JSON.stringify(report, null, 2));
  console.log("================================================\n");
  
  // Analyze scroll feasibility
  const main = report.mainContent;
  const grid = report.grid;
  
  if (main.exists && grid.exists) {
    console.log(`Main Content height: ${main.height}px (scrollHeight: ${main.scrollHeight}px)`);
    console.log(`Grid height: ${grid.height}px`);
    
    if (main.scrollHeight > main.clientHeight) {
      console.log("✅ Main Content reports scrollable overflow (scrollHeight > clientHeight).");
    } else {
      console.log("❌ Main Content has NO scrollable overflow. It matches grid height!");
    }
    
    if (report.container.height < report.html.height) {
      console.log("✅ App Container is smaller than viewport height.");
    } else if (report.container.height > report.html.height) {
      console.log("❌ App Container is TALLER than viewport height! Scroll is spilling to body.");
    } else {
      console.log("✅ App Container height matches viewport height exactly.");
    }
  } else {
    console.log("Could not find main content or grid items.");
  }
  
  await browser.close();
}

run().catch(console.error);
