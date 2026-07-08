const fs = require('fs');
const readline = require('readline');

async function checkColumns() {
    const fileStream = fs.createReadStream('D:\\OURGOODS ALGORITHM\\extracted_new\\public\\demo.sql');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.startsWith('INSERT INTO `products`')) {
            console.log("PRODUCTS:", line.substring(0, 500));
        }
        if (line.startsWith('INSERT INTO `product_translations`')) {
            console.log("TRANSLATIONS:", line.substring(0, 500));
        }
        if (line.startsWith('INSERT INTO `product_stocks`')) {
            console.log("STOCKS:", line.substring(0, 500));
        }
    }
}
checkColumns();
