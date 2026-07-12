import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
await page.goto('http://localhost:5173/admin/products/add', {waitUntil: 'networkidle2'}).catch(e => console.log(e.message));
await browser.close();
