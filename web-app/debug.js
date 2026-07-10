const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log("Navigating...");
  await page.goto('http://localhost:8080');

  console.log("Waiting for search bar...");
  await page.waitForSelector('#searchBar');
  await page.fill('#searchBar', 'pathfinding visualizer');

  console.log("Waiting for project card...");
  await page.waitForSelector('.project-card:has-text("Pathfinding Visualizer")');
  await page.click('.project-card:has-text("Pathfinding Visualizer")');

  console.log("Waiting for modal...");
  await page.waitForSelector('#pfGrid');
  
  const html = await page.locator('#pfGrid').innerHTML();
  console.log("GRID HTML:", html.substring(0, 500));
  
  const count = await page.locator('#pfGrid td').count();
  console.log("CELL COUNT:", count);
  
  const box = await page.locator('#pfGrid').boundingBox();
  console.log("GRID BOUNDING BOX:", box);

  await browser.close();
})();
