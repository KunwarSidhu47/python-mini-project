const { test, expect } = require('@playwright/test');
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:8080/');
  await page.waitForLoadState('networkidle');
  
  // Click Explore
  await page.locator('#exploreBtn').click();
  
  const firstCardPlayBtn = page.locator('.project-card .btn-play').first();
  await firstCardPlayBtn.focus();
  await firstCardPlayBtn.click();
  
  await page.waitForSelector('#projectModal.active');
  
  // Tab to inside
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  
  // Close
  await page.keyboard.press('Escape');
  
  await page.waitForSelector('#projectModal:not(.active)');
  await page.waitForTimeout(500); // Wait 500ms instead of 50ms to be absolutely sure
  
  // Check active element
  const activeHTML = await page.evaluate(() => document.activeElement.outerHTML);
  console.log("ACTIVE ELEMENT HTML:", activeHTML);
  
  // Wait another 500ms
  await page.waitForTimeout(500);
  const activeHTML2 = await page.evaluate(() => document.activeElement.outerHTML);
  console.log("ACTIVE ELEMENT HTML LATER:", activeHTML2);
  
  await browser.close();
})();
