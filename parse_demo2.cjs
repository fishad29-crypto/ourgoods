const fs = require('fs');

const sqlContent = fs.readFileSync('d:/OURGOODS ALGORITHM/extracted_all/public/demo.sql', 'utf8');
const insertProductsIndex = sqlContent.indexOf('INSERT INTO `products`');
const valuesStartIndex = sqlContent.indexOf('VALUES\n', insertProductsIndex) + 'VALUES\n'.length;
const valuesEndIndex = sqlContent.indexOf(';\n', valuesStartIndex);
let valuesString = sqlContent.substring(valuesStartIndex, valuesEndIndex).trim();

// To properly split SQL values, we need to handle strings that contain `,` or `)`
const rows = [];
let currentRow = [];
let currentField = '';
let insideString = false;
let escapeNext = false;
let insideTuple = false;

for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i];

    if (escapeNext) {
        currentField += char;
        escapeNext = false;
        continue;
    }

    if (char === '\\') {
        escapeNext = true;
        currentField += char; // keep escape for now
        continue;
    }

    if (char === "'") {
        insideString = !insideString;
        currentField += char;
        continue;
    }

    if (!insideString) {
        if (char === '(' && !insideTuple) {
            insideTuple = true;
            currentRow = [];
            currentField = '';
            continue;
        } else if (char === ')' && insideTuple) {
            // Check if this is the end of the tuple
            // A tuple ends if the next chars are `,` or it's the end of string
            let nextChar = '';
            for (let j = i + 1; j < valuesString.length; j++) {
                if (valuesString[j].trim() !== '') {
                    nextChar = valuesString[j];
                    break;
                }
            }
            if (nextChar === ',' || nextChar === '' || i === valuesString.length - 1) {
                insideTuple = false;
                currentRow.push(currentField.trim());
                rows.push(currentRow);
                currentField = '';
                continue;
            }
        } else if (char === ',' && insideTuple) {
            currentRow.push(currentField.trim());
            currentField = '';
            continue;
        }
    }

    if (insideTuple) {
        currentField += char;
    }
}

const cleanString = (str) => {
    if (!str || str === 'NULL') return '';
    if (str.startsWith("'") && str.endsWith("'")) {
        return str.substring(1, str.length - 1).replace(/\\'/g, "'").replace(/\\n/g, '\n').replace(/\\r/g, '\r');
    }
    return str;
};

const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=90&w=800",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=90&w=800",
    "https://images.unsplash.com/photo-1599643478524-fb66f4568e71?auto=format&fit=crop&q=90&w=800",
    "https://images.unsplash.com/photo-1599643477877-530e556bb162?auto=format&fit=crop&q=90&w=800",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=90&w=800",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=90&w=800"
];

const categoriesList = ['Home', 'Women', 'Jewelry & Accessories', 'Purse & Bags', 'Sneakers & Shoes', 'Beauty & Health', 'Home & Decor', 'Combo Deals'];

const products = rows.map((fields, index) => {
    // According to the INSERT structure, the fields are:
    // 0: name, 1: added_by, 2: user_id, 3: category_id, 4: brand_id, 5: photos, 6: thumbnail_img
    // 7: video_provider, 8: video_link, 9: tags, 10: description, 11: unit_price, 12: purchase_price, 13: variant_product
    
    // Some values might be NULL, so we handle that in cleanString
    const catId = parseInt(cleanString(fields[3])) || 1;
    const category = categoriesList[catId % categoriesList.length];

    return {
        id: 'real_' + (index + 1),
        title: cleanString(fields[0]),
        category: category,
        image: images[index % images.length], // We use fallback images to ensure it works nicely
        originalPrice: parseFloat(fields[11]) || 0,
        price: parseFloat(fields[11]) || 0,
        discount: 0,
        rating: 4.5 + (Math.random() * 0.5),
        soldCount: Math.floor(Math.random() * 500) + 50,
        brand: 'OURGOODS',
        vendor: 'OURGOODS Store',
        isFlashSale: Math.random() > 0.8,
        description: cleanString(fields[10])
    };
});

fs.writeFileSync('d:/OURGOODS ALGORITHM/src/utils/realProducts.json', JSON.stringify(products, null, 2));
console.log(`Successfully extracted ${products.length} products to realProducts.json`);
