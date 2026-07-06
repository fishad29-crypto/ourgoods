const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('d:/OURGOODS ALGORITHM/extracted_all/shop.sql');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
const out = fs.createWriteStream('d:/OURGOODS ALGORITHM/inserts.txt');

let lineNum = 0;
rl.on('line', (line) => {
    lineNum++;
    if (line.match(/^INSERT INTO/i)) {
        out.write(`Line ${lineNum}: ${line.substring(0, 80)}...\n`);
    }
});
rl.on('close', () => out.end());
