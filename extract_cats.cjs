const fs = require('fs');
const path = require('path');

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
    const sqlFile = path.join(__dirname, 'extracted_all', 'shop.sql');
    const data = fs.readFileSync(sqlFile, 'utf8');
    
    // Parse categories
    const catStartIdx = data.indexOf('INSERT INTO `categories`');
    let categories = [];
    if (catStartIdx !== -1) {
        let valStart = data.indexOf('VALUES', catStartIdx);
        let valEnd = data.indexOf(';\n', valStart);
        if (valEnd === -1) valEnd = data.indexOf(';\r\n', valStart);
        let valuesStr = data.substring(valStart + 6, valEnd).trim();
        const rows = splitRows(valuesStr);
        rows.forEach((r) => {
            if (r.length > 3) {
                categories.push({
                    id: unquote(r[0]),
                    parent_id: unquote(r[1]),
                    level: unquote(r[2]),
                    name: unquote(r[3])
                });
            }
        });
        fs.writeFileSync('extracted_categories.json', JSON.stringify(categories, null, 2));
        console.log(`Saved ${categories.length} categories.`);
    } else {
        console.log("Could not find INSERT INTO categories");
    }

    // Parse products (just to see if we have them)
    const prodStartIdx = data.indexOf('INSERT INTO `products`');
    let products = [];
    if (prodStartIdx !== -1) {
        let valStart = data.indexOf('VALUES', prodStartIdx);
        let valEnd = data.indexOf(';\n', valStart);
        if (valEnd === -1) valEnd = data.indexOf(';\r\n', valStart);
        let valuesStr = data.substring(valStart + 6, valEnd).trim();
        const rows = splitRows(valuesStr);
        rows.forEach((r) => {
            if (r.length > 5) {
                products.push({
                    id: unquote(r[0]),
                    name: unquote(r[1]),
                    category_id: unquote(r[3]),
                    // just to map the ID
                });
            }
        });
        fs.writeFileSync('extracted_products.json', JSON.stringify(products, null, 2));
        console.log(`Saved ${products.length} products.`);
    } else {
        console.log("Could not find INSERT INTO products");
    }

} catch(e) {
    console.log("Error:", e.stack);
}
