const fs = require('fs');
const sql = fs.readFileSync('D:\\OURGOODS ALGORITHM\\extracted_new\\shop.sql', 'utf8');
const regex = /INSERT INTO `categories`([^\n]+)/;
const match = sql.match(regex);
console.log(match ? match[1] : 'not found');
