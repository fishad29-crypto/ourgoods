const fs = require('fs');

function unquote(val) {
    if (!val) return val;
    val = val.trim();
    if (val.startsWith("'") && val.endsWith("'")) {
        return val.slice(1, -1);
    }
    return val;
}

function splitRows(str) {
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (escapeNext) { currentVal += char; escapeNext = false; continue; }
        if (char === '\\') { escapeNext = true; continue; }
        if (char === "'") { inString = !inString; currentVal += char; continue; }
        
        if (!inString) {
            if (char === '(' && currentRow.length === 0 && currentVal.trim() === '') continue;
            if ((char === ')' && i === str.length - 1) || (char === ')' && str.substr(i, 3) === '),(')) {
                currentRow.push(currentVal.trim());
                rows.push(currentRow);
                currentRow = [];
                currentVal = '';
                if (char === ')') i++; 
                if (str[i+1] === '(') i++; 
                continue;
            }
            if (char === ',') {
                currentRow.push(currentVal.trim());
                currentVal = '';
                continue;
            }
        }
        currentVal += char;
    }
    return rows;
}

try {
    const data = fs.readFileSync('D:\\OURGOODS ALGORITHM\\ourg_ourgoodsecommerce.sql', 'utf8');
    const startIdx = data.indexOf('INSERT INTO `products`');
    if (startIdx !== -1) {
        let valStart = data.indexOf('VALUES', startIdx);
        let valEnd = data.indexOf(';', valStart);
        let valuesStr = data.substring(valStart + 6, valEnd).trim();
        const rows = splitRows(valuesStr);
        const firstRow = rows[0].map(unquote);
        console.log("Total Columns:", firstRow.length);
        firstRow.forEach((val, idx) => {
            console.log(`[${idx}]: ${val.substring(0, 100)}`);
        });
    } else {
        console.log("Could not find INSERT INTO products");
    }
} catch(e) {
    console.log("Error:", e);
}
