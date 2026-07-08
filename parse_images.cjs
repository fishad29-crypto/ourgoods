const fs = require('fs');

const sqlStr = fs.readFileSync('D:\\OURGOODS ALGORITHM\\extracted_new\\public\\demo.sql', 'utf8');

function parseInsert(sqlStr, tableName) {
    const regex = new RegExp(`INSERT INTO \\\`${tableName}\\\`.*?VALUES\\s*([\\s\\S]*)`, 'i');
    const match = sqlStr.match(regex);
    if (!match) return [];
    
    const valuesStr = match[1];
    const rows = [];
    let inString = false;
    let escapeNext = false;
    let currentRow = [];
    let currentVal = '';
    let inRow = false;
    
    for (let i = 0; i < valuesStr.length; i++) {
        const char = valuesStr[i];
        
        if (escapeNext) {
            currentVal += char;
            escapeNext = false;
            continue;
        }
        
        if (char === '\\') {
            escapeNext = true;
            continue;
        }
        
        if (char === "'") {
            inString = !inString;
            currentVal += char;
            continue;
        }
        
        if (!inString) {
            if (char === '(' && !inRow) {
                inRow = true;
                currentRow = [];
                currentVal = '';
                continue;
            }
            if (char === ')' && inRow) {
                currentRow.push(currentVal.trim());
                rows.push(currentRow);
                inRow = false;
                continue;
            }
            if (char === ';' && !inRow) {
                break;
            }
            if (char === ',' && inRow) {
                currentRow.push(currentVal.trim());
                currentVal = '';
                continue;
            }
        }
        
        if (inRow) {
            currentVal += char;
        }
    }
    
    return rows;
}

function unquote(val) {
    if (!val) return val;
    val = val.trim();
    if (val.startsWith("'") && val.endsWith("'")) {
        return val.slice(1, -1);
    }
    return val;
}

const uploadsData = parseInsert(sqlStr, 'uploads');
console.log(`Parsed ${uploadsData.length} uploads.`);

// Map ID sequentially (1-based index)
const uploadIdMap = {};
uploadsData.forEach((row, idx) => {
    // file_name is index 1
    const fileName = unquote(row[1]);
    uploadIdMap[idx + 1] = "https://ourgoods.com.bd/public/" + fileName; 
});

const productsData = parseInsert(sqlStr, 'products');
console.log(`Parsed ${productsData.length} products.`);

const categoriesList = ['Home', 'Women', 'Jewelry & Accessories', 'Purse & Bags', 'Sneakers & Shoes', 'Beauty & Health', 'Home & Decor', 'Combo Deals'];

const frontendProducts = productsData.map((row, index) => {
    if(row.length < 30) return null;
    
    const id = "ext_" + (index + 1);
    const title = unquote(row[0]);
    let imageIdStr = unquote(row[6]);
    let image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=90&w=800"; // fallback
    
    const imgId = parseInt(imageIdStr);
    if (!isNaN(imgId) && uploadIdMap[imgId]) {
        image = uploadIdMap[imgId];
    }
    
    let price = parseFloat(unquote(row[11]));
    if (isNaN(price)) price = Math.floor(Math.random() * 50) + 10;
    
    let description = unquote(row[10]);
    if (description === 'NULL') description = title;
    
    const assignedCategory = categoriesList[index % categoriesList.length];
    
    return {
        id,
        title,
        category: assignedCategory,
        image,
        originalPrice: price,
        price: price,
        discount: 0,
        rating: 4.8,
        soldCount: Math.floor(Math.random() * 500) + 50,
        brand: "ExtractedBrand",
        vendor: "Extracted Vendor",
        isFlashSale: false,
        description
    };
}).filter(Boolean);

console.log(`Successfully mapped ${frontendProducts.length} products with images`);

fs.writeFileSync('D:\\OURGOODS ALGORITHM\\src\\utils\\realProducts.json', JSON.stringify(frontendProducts, null, 2));
console.log('Saved to src/utils/realProducts.json');
