const { test, expect } = require('@playwright/test');
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:8080/');
  await page.waitForLoadState('networkidle');
  
  const exploreBtn = page.locator('#exploreBtn');
  await exploreBtn.click();
  
  const firstCardPlayBtn = page.locator('.project-card .btn-play').first();
  await firstCardPlayBtn.focus();
  await firstCardPlayBtn.click();
  
  const modal = page.locator('#projectModal');
  await page.waitForSelector('#projectModal.active');
  
  // Press tab to put focus inside
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  
  // Escape
  await page.keyboard.press('Escape');
  
  await page.waitForSelector('#projectModal:not(.active)');
  await page.waitForTimeout(100);
  
  // Check active element
  const activeHTML = await page.evaluate(() => document.activeElement.outerHTML);
  console.log("ACTIVE ELEMENT HTML:", activeHTML);
  
  await browser.close();
})();
