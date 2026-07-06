const fs = require('fs');

const sqlContent = fs.readFileSync('d:/OURGOODS ALGORITHM/extracted_all/public/demo.sql', 'utf8');

// Find the INSERT INTO `products` statement
const insertProductsIndex = sqlContent.indexOf('INSERT INTO `products`');
if (insertProductsIndex === -1) {
    console.error('Products insert not found');
    process.exit(1);
}

// Find the start of VALUES
const valuesStartIndex = sqlContent.indexOf('VALUES', insertProductsIndex) + 'VALUES'.length;
// Find the end of the statement (the semicolon)
const valuesEndIndex = sqlContent.indexOf(';\n', valuesStartIndex);

let valuesString = sqlContent.substring(valuesStartIndex, valuesEndIndex).trim();

// Very basic regex to extract tuples - this is fragile but might work for simple data
// A better way is to split by `),\n(`
if (valuesString.startsWith('(')) {
    valuesString = valuesString.substring(1);
}
if (valuesString.endsWith(')')) {
    valuesString = valuesString.substring(0, valuesString.length - 1);
}

const rawRows = valuesString.split(/\),\n\s*\(/);

const products = rawRows.map((row, index) => {
    // split by comma but ignore commas inside quotes.
    // this is a known complex problem, using a simple regex for now:
    const fields = [];
    let currentField = '';
    let insideQuotes = false;
    let escapeNext = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (escapeNext) {
            currentField += char;
            escapeNext = false;
        } else if (char === '\\') {
            escapeNext = true;
        } else if (char === "'") {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            fields.push(currentField.trim());
            currentField = '';
        } else {
            currentField += char;
        }
    }
    fields.push(currentField.trim());

    // The fields map to:
    // 0: name, 1: added_by, 2: user_id, 3: category_id, 4: brand_id, 5: photos, 6: thumbnail_img
    // 7: video_provider, 8: video_link, 9: tags, 10: description, 11: unit_price, 12: purchase_price
    // ... we just need name, price, description, images
    
    const cleanString = (str) => {
        if (!str) return '';
        if (str.startsWith("'") && str.endsWith("'")) return str.substring(1, str.length - 1).replace(/\\'/g, "'");
        return str;
    };

    return {
        id: 'real_' + (index + 1),
        title: cleanString(fields[0]),
        category: 'Imported', // we can map category_id later if needed
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=90&w=800', // placeholder for now
        originalPrice: parseFloat(fields[11]) || 0,
        price: parseFloat(fields[11]) || 0,
        discount: 0,
        rating: 4.5,
        soldCount: 150,
        brand: 'OURGOODS',
        vendor: 'OURGOODS Official',
        isFlashSale: false,
        rawThumbnailId: cleanString(fields[6])
    };
});

fs.writeFileSync('d:/OURGOODS ALGORITHM/products.json', JSON.stringify(products, null, 2));
console.log(`Extracted ${products.length} products`);
