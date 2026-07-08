const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, 'products.json');
const uploadsFile = path.join(__dirname, 'uploads.json');
const categoriesFile = path.join(__dirname, 'categories.json');
const outFile = path.join(__dirname, 'src/utils/realProducts.json');

async function processJson() {
    if (!fs.existsSync(productsFile) || !fs.existsSync(uploadsFile)) {
        console.log("Waiting for JSON files...");
        return;
    }

    const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    const uploadsData = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
    let categoriesData = [];
    if (fs.existsSync(categoriesFile)) {
        categoriesData = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    }
    
    // Some JSON exports from phpMyAdmin wrap tables in an object array e.g. [{ type: "table", name: "products", data: [...] }]
    // Others just export the data array directly. Let's normalize it:
    let products = Array.isArray(productsData) && productsData[0]?.data ? productsData[0].data : productsData;
    let uploads = Array.isArray(uploadsData) && uploadsData[0]?.data ? uploadsData[0].data : uploadsData;
    let categories = Array.isArray(categoriesData) && categoriesData[0]?.data ? categoriesData[0].data : categoriesData;
    
    if (products.length > 0 && products[0].type === 'header') products = products.slice(1);
    if (uploads.length > 0 && uploads[0].type === 'header') uploads = uploads.slice(1);
    
    // Wait, phpMyAdmin JSON export actually looks like:
    // [ { "id": "1", "name": "...", "photos": "1,2,3" } ]
    // Let's assume it's a flat array of objects (if exported correctly).
    // Let's check structure just in case it's wrapped.
    if (products.find(p => p.type === 'table')) {
        products = products.find(p => p.type === 'table').data;
        uploads = uploads.find(p => p.type === 'table').data;
        if(categories.find(p => p.type === 'table')) categories = categories.find(p => p.type === 'table').data;
    }

    console.log(`Extracted ${uploads.length} uploads, ${products.length} products, ${categories.length} categories.`);
    
    const uploadIdMap = {};
    uploads.forEach(row => {
        if (row.id && row.file_name) {
            uploadIdMap[row.id] = "https://ourgoods.com.bd/public/" + row.file_name;
        }
    });

    const categoryMap = {};
    categories.forEach(row => {
        if (row.id && row.name) {
            categoryMap[row.id] = row.name;
        }
    });

    const categoriesList = ['Home', 'Women', 'Jewelry & Accessories', 'Purse & Bags', 'Sneakers & Shoes', 'Beauty & Health', 'Home & Decor', 'Combo Deals'];
    
    const frontendProducts = products.map((row, index) => {
        const idStr = row.id;
        const title = row.name;
        const catId = row.category_id;
        
        let thumbnailId = row.thumbnail_img;
        if (!thumbnailId || thumbnailId === 'NULL') thumbnailId = row.photos ? row.photos.split(',')[0] : null;
        let image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=90&w=800"; 
        if (uploadIdMap[thumbnailId]) image = uploadIdMap[thumbnailId];
        
        // Gallery Images
        const photosStr = row.photos;
        let galleryImages = [image]; // always include main image first
        if (photosStr && photosStr !== 'NULL') {
            const pIds = photosStr.split(',');
            pIds.forEach(pId => {
                if (uploadIdMap[pId.trim()] && uploadIdMap[pId.trim()] !== image) {
                    galleryImages.push(uploadIdMap[pId.trim()]);
                }
            });
        }
        
        let price = parseFloat(row.unit_price);
        if (isNaN(price)) price = Math.floor(Math.random() * 50) + 10;
        
        let discount = parseFloat(row.discount);
        if (isNaN(discount)) discount = 0;
        
        let originalPrice = price;
        let finalPrice = price;
        const discountType = row.discount_type;
        if (discount > 0) {
            if (discountType === 'percent') {
                finalPrice = price - (price * (discount / 100));
            } else if (discountType === 'amount' || discountType === 'flat') {
                finalPrice = finalPrice - discount;
            }
        }
        
        let description = row.description;
        
        let colors = [];
        try {
            if (row.colors && row.colors !== 'NULL') colors = JSON.parse(row.colors);
        } catch(e) {}
        
        let sizes = [];
        try {
            if (row.choice_options && row.choice_options !== 'NULL') {
                const opts = JSON.parse(row.choice_options);
                if (opts && opts.length > 0) {
                    sizes = opts[0].values;
                }
            }
        } catch(e) {}
        
        let assignedCategory = categoryMap[catId];
        if (!assignedCategory || !categoriesList.includes(assignedCategory)) {
            assignedCategory = categoriesList[index % categoriesList.length];
        }
        
        return {
            id: "prod_" + idStr,
            title,
            category: assignedCategory,
            image,
            images: galleryImages, // Exact gallery mapping
            originalPrice: originalPrice,
            price: finalPrice > 0 ? finalPrice : originalPrice,
            discount: discountType === 'percent' ? discount : (discount > 0 ? Math.round((discount/originalPrice)*100) : 0),
            colors: colors,
            sizes: sizes,
            rating: 4.8,
            soldCount: Math.floor(Math.random() * 500) + 50,
            brand: "OurGoods",
            vendor: "Verified Seller",
            isFlashSale: false,
            description
        };
    }).filter(Boolean);

    fs.writeFileSync(outFile, JSON.stringify(frontendProducts, null, 2));
    console.log(`Saved ${frontendProducts.length} fully detailed products to realProducts.json`);
}

processJson().catch(console.error);
