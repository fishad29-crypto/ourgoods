const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  
  console.log("Logging in...");
  await page.goto('https://br.codecraftbd.info/', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'fishad');
  await page.fill('input[name="password"]', 'ourgoodS137');
  await page.press('input[name="password"]', 'Enter');
  
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  console.log("Logged in. Navigating to phpMyAdmin...");
  await page.goto('https://br.codecraftbd.info/dataBases/phpMyAdmin', { waitUntil: 'networkidle' });
  
  // Function to export a table as JSON
  async function exportTableJSON(tableName) {
    console.log(`Exporting table ${tableName} as JSON...`);
    // Navigate to export page for the specific table
    await page.goto(`https://br.codecraftbd.info/phpmyadmin/index.php?route=/table/export&db=ourg_ourgoodsecommerce&table=${tableName}`, { waitUntil: 'networkidle' });
    
    // Select JSON format from dropdown
    await page.selectOption('select[name="what"]', 'JSON');
    
    // Wait a brief moment for UI to update
    await page.waitForTimeout(500);
    
    // Click Export
    const [ download ] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('input#buttonGo, button#buttonGo')
    ]);
    
    const downloadPath = path.join('D:\\OURGOODS ALGORITHM', `${tableName}.json`);
    if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
    await download.saveAs(downloadPath);
    console.log(`Downloaded ${tableName}.json`);
  }
  
  await exportTableJSON('products');
  await exportTableJSON('uploads');
  await exportTableJSON('categories');
  
  await browser.close();
  console.log("All tables exported successfully!");
})();
