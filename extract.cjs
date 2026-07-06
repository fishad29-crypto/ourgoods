const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('d:/OURGOODS ALGORITHM/extracted_all/shop.sql');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let productsInsert = '';

rl.on('line', (line) => {
    if (line.startsWith("INSERT INTO `products`")) {
        productsInsert += line + '\n';
    } else if (productsInsert && line.startsWith("INSERT INTO")) {
        rl.close();
    } else if (productsInsert) {
        productsInsert += line + '\n';
    }
});

rl.on('close', () => {
    fs.writeFileSync('d:/OURGOODS ALGORITHM/scratch_products.sql', productsInsert);
    console.log('Done extracting products. Bytes:', productsInsert.length);
});
