import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
await page.goto('http://localhost:5173', {waitUntil: 'networkidle2'});
await page.evaluate(() => {
  localStorage.setItem('adminAuth', 'true');
});
await page.goto('http://localhost:5173/admin', {waitUntil: 'networkidle2'});
await new Promise(r => setTimeout(r, 4000));
const text = await page.evaluate(() => document.body.innerText);
console.log("TEXT:", text.substring(0, 1000));
await browser.close();
