const fs = require('fs');

const sql = fs.readFileSync('D:\\OURGOODS ALGORITHM\\extracted_all\\shop.sql', 'utf8');

function extractTable(tableName) {
    const regex = new RegExp(`INSERT INTO \`${tableName}\`.*?VALUES\\s*([\\s\\S]*?);`, 'g');
    let match;
    let rawValues = '';
    while ((match = regex.exec(sql)) !== null) {
        rawValues += match[1] + ',';
    }
    return rawValues;
}

const catStr = extractTable('categories');
const prodStr = extractTable('products');

fs.writeFileSync('temp_categories.txt', catStr.substring(0, 5000));
fs.writeFileSync('temp_products.txt', prodStr.substring(0, 5000));
console.log('Done extracting samples.');
