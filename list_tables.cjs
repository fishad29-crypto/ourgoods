const fs = require('fs');
const sql = fs.readFileSync('D:\\OURGOODS ALGORITHM\\extracted_new\\shop.sql', 'utf8');
const tables = new Set();
for (const match of sql.matchAll(/^INSERT INTO `([^`]+)`/gm)) {
  tables.add(match[1]);
}
console.log(Array.from(tables).join(', '));
