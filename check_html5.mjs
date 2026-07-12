import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
try {
  await page.goto('http://localhost:5173/admin/login', {waitUntil: 'networkidle2'});
  await page.waitForSelector('input[type="email"]', {timeout: 5000});
  await page.type('input[type="email"]', 'admin@ourgoods.com.bd');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 4000));
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT:", text.substring(0, 1000));
} catch (e) {
  console.log("SCRIPT ERROR:", e.message);
}
await browser.close();
