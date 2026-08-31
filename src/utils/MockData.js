import { evaluateChoiceQualification } from './ChoiceLogic';
import realProducts from './realProducts.json';

const images = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=90&w=800", 
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=90&w=800", 
  "https://images.unsplash.com/photo-1599643478524-fb66f4568e71?auto=format&fit=crop&q=90&w=800", 
  "https://images.unsplash.com/photo-1599643477877-530e556bb162?auto=format&fit=crop&q=90&w=800", 
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1622445272461-c6580cab8755?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1615397323226-0e3f05c08d2f?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=90&w=800"
];

const brands = ['SHEIN', 'Temu', 'Zara', 'OURGOODS', 'LocalBrand', 'Nike', 'Adidas', 'Loreal', 'Maybelline', 'Apple'];
const localVendors = Array.from({length: 100}, (_, i) => `Vendor ${i+1} Store`);
const categoriesList = ['Home', 'Women', 'Jewelry & Accessories', 'Purse & Bags', 'Sneakers & Shoes', 'Beauty & Health', 'Home & Decor', 'Combo Deals'];

const productTitles = [
  'Premium Cotton T-Shirt', 'Luxury Leather Handbag', 'Wireless Noise-Canceling Earbuds', 
  'Hydrating Facial Serum', 'Men\'s Casual Sneakers', 'Women\'s Summer Crop Top',
  'Diamond Pendant Necklace', 'Classic Analog Watch', 'Sports Running Shoes',
  'SPF 50 Sunscreen Lotion', 'Designer Sunglasses', 'Smart Fitness Band',
  'Matte Lipstick Set', 'Organic Face Wash', 'Waterproof Travel Backpack',
  'Men\'s Slim Fit Jeans', 'Women\'s Floral Dress', 'Kids Winter Jacket',
  'Leather Wallet', 'Bluetooth Portable Speaker', 'Professional Makeup Brush Set',
  'Anti-Aging Night Cream', 'Casual Polo Shirt', 'Yoga Leggings'
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const comboTitles = [
  'T-Shirt & Jeans Combo', 'Skincare 3-Piece Set', 'Backpack + Wallet Bundle', 
  '2x Casual Shirts Deal', 'Watch & Bracelet Set', 'Buy 1 Get 1 Sneakers',
  'Makeup Full Kit Combo', 'Shampoo & Conditioner Duo', 'Home Decor 5-Piece Set',
  'Winter Jacket + Beanie'
];

let globalProductsCache = null;

export const getAllProducts = () => {
  if (globalProductsCache) return globalProductsCache;

  const cached = localStorage.getItem('userProductsCache');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip out expired blob URLs from previous session
        const DEFAULT_IMAGE = "https://via.placeholder.com/500x500.png?text=Default+Image";
        parsed.forEach(p => {
          if (typeof p.image === 'string' && p.image.startsWith('blob:')) {
            p.image = DEFAULT_IMAGE; 
          }
          if (Array.isArray(p.images)) {
            p.images = p.images.map(img => {
              if (typeof img === 'string' && img.startsWith('blob:')) return null;
              if (img && typeof img === 'object' && img.url && img.url.startsWith('blob:')) return null;
              return img;
            }).filter(Boolean);
            
            // Re-assign main image if it was cleared or invalid
            if (p.images.length > 0) {
                const firstImg = p.images[0];
                p.image = typeof firstImg === 'string' ? firstImg : (firstImg.url || firstImg.src || DEFAULT_IMAGE);
            } else {
                p.image = DEFAULT_IMAGE;
            }
          } 
          
          if (!p.image || typeof p.image !== 'string') {
             p.image = DEFAULT_IMAGE;
          }
        });
        globalProductsCache = parsed;
        // Save cleaned cache back to storage
        localStorage.setItem('userProductsCache', JSON.stringify(globalProductsCache));
        return globalProductsCache;
      }
    } catch (e) {
      console.error("Failed to parse userProductsCache", e);
    }
  }

  // Evaluate choice logic for the real products
  let products = realProducts.map((product, index) => {
      // Setup base metrics
      const returnRate = parseFloat((Math.random() * 8).toFixed(1)); // 0 to 8%
      const cancellationRate = parseFloat((Math.random() * 5).toFixed(1)); // 0 to 5%
      const sellerPerformance = randomInt(60, 100);
      const shippingDays = randomInt(1, 14);
      const priceCompetitiveness = randomInt(40, 100);
      const qualityScore = randomInt(50, 100);
      const stock = randomInt(0, 500);
      
      const newDiscount = randomChoice([15, 20, 30]);
      const newOriginalPrice = Math.ceil(product.price / (1 - (newDiscount / 100)));

      const enhancedProduct = {
          ...product,
          discount: newDiscount,
          originalPrice: newOriginalPrice,
          vendor: index % 3 === 0 ? 'OURGOODS Direct' : (product.vendor || 'OURGOODS Store'),
          returnRate,
          cancellationRate,
          sellerPerformance,
          shippingDays,
          priceCompetitiveness,
          qualityScore,
          stock,
          adminApproved: true,
          sellerActive: true,
          adminRemovedChoice: false,
          createdAt: Date.now() - randomInt(0, 30 * 24 * 60 * 60 * 1000)
      };

      const { isChoice, score, reason } = evaluateChoiceQualification(enhancedProduct);
      enhancedProduct.isChoice = isChoice;
      enhancedProduct.choiceScore = score;
      enhancedProduct.choiceReason = reason;

      return enhancedProduct;
  });

  globalProductsCache = products;
  localStorage.setItem('userProductsCache', JSON.stringify(globalProductsCache));
  return products;
};

// Backwards compatibility for existing components
export const generateProducts = (category, count = 50) => {
  if (category === 'Choice') {
    return getChoiceProducts().slice(0, count);
  }
  
  const all = getAllProducts();

  if (category === 'New Arrival') {
    const newest = [...all].sort((a, b) => b.createdAt - a.createdAt);
    return newest.slice(0, count);
  }

  let filtered = all;
  if (category && category !== 'All' && category !== 'recommended') {
    filtered = all.filter(p => {
      const pCats = Array.isArray(p.category) ? p.category : [p.category];
      const pPlacements = Array.isArray(p.placements) ? p.placements : (p.placements ? p.placements.split(', ') : []);
      return pCats.includes(category) || pPlacements.includes(category) || (category === 'Flash Sale' && p.isFlashSale);
    });
  }
  // Ensure newest products appear at the top
  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  return sorted.slice(0, count);
};

export const getChoiceProducts = () => {
  return getAllProducts().filter(p => p.isChoice).sort((a, b) => b.choiceScore - a.choiceScore);
};

export const updateProductChoiceStatus = (productId, overrideChoice) => {
  const product = globalProductsCache.find(p => p.id === productId);
  if (product) {
    product.isChoice = overrideChoice;
    product.adminRemovedChoice = !overrideChoice;
  }
};

export const addProductToFrontend = (productData) => {
  if (!globalProductsCache) {
    getAllProducts();
  }
  
  // Format the product to match the frontend expected structure
  const newProduct = {
    id: productData.id || productData.sku || 'gen_new_' + Date.now(),
    sku: productData.sku || productData.id || 'gen_new_' + Date.now(),
    title: productData.name || 'New Product',
    category: productData.category || 'Women', // default category
    originalPrice: parseFloat(productData.regularPrice) || 1000,
    price: parseFloat(productData.salePrice) || parseFloat(productData.regularPrice) || 800,
    discount: 0,
    rating: 5.0,
    soldCount: 0,
    brand: productData.brand || 'OURGOODS',
    vendor: productData.vendor || 'OURGOODS Direct',
    isFlashSale: false,
    returnRate: 0,
    cancellationRate: 0,
    sellerPerformance: 100,
    shippingDays: 2,
    priceCompetitiveness: 100,
    qualityScore: 100,
    stock: parseInt(productData.stock) || 100,
    adminApproved: true,
    sellerActive: true,
    adminRemovedChoice: false,
    createdAt: Date.now() + 100000, // Very fresh so it appears first in New Arrivals
    isChoice: true,
    choiceScore: 100,
    choiceReason: 'New manually added product',
    attributes: Array.isArray(productData.attributes) 
      ? productData.attributes
          .filter(attr => attr.name && attr.options)
          .map(attr => ({
            name: attr.name,
            options: attr.options.split(',').map(s => s.trim()).filter(Boolean)
          }))
      : [],
    placements: productData.placements || [],
    ...productData, // Spreading productData to ensure ribbon, description, and other custom fields are saved
    // Explicitly set these AFTER spreading productData so they can never be overwritten by stale keys
    image: productData.images && productData.images.length > 0 ? (typeof productData.images[0] === 'string' ? productData.images[0] : (productData.images[0].url || "https://via.placeholder.com/500x500.png?text=Default+Image")) : "https://via.placeholder.com/500x500.png?text=Default+Image",
    imageType: productData.images && productData.images.length > 0 ? (typeof productData.images[0] === 'object' ? productData.images[0].type : "image/jpeg") : "image/jpeg",
    images: productData.images || [],
  };

  if (newProduct.originalPrice > newProduct.price) {
    newProduct.discount = Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100);
  }

  // Extract colors and sizes for frontend compatibility
  const colorAttr = newProduct.attributes.find(a => a.name.toLowerCase() === 'color');
  const sizeAttr = newProduct.attributes.find(a => a.name.toLowerCase() === 'size');
  if (colorAttr) newProduct.colors = colorAttr.options;
  if (sizeAttr) newProduct.sizes = sizeAttr.options;

  // Check if product already exists (Edit Mode)
  let existingIndex = -1;
  if (productData.originalId) {
    // Exact match for the original product being edited, even if SKU changed
    existingIndex = globalProductsCache.findIndex(p => String(p.id) === String(productData.originalId) || String(p.sku) === String(productData.originalId));
  } else {
    existingIndex = globalProductsCache.findIndex(p => String(p.id) === String(newProduct.id) || (p.sku && String(p.sku) === String(newProduct.sku)));
  }
  
  if (existingIndex !== -1) {
    // Update existing
    globalProductsCache[existingIndex] = { ...globalProductsCache[existingIndex], ...newProduct };
  } else {
    // Push to the very beginning of the cache so it shows up first everywhere
    globalProductsCache.unshift(newProduct);
  }
  // Persist to local storage so they aren't lost on refresh
  try {
    localStorage.setItem('userProductsCache', JSON.stringify(globalProductsCache));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
      alert("WARNING: Local storage is full! The product was saved temporarily but may be lost if you refresh. Please upload smaller images or delete some old products to free up space.");
    } else {
      console.error("Failed to save to local storage", e);
    }
  }
};

export const updateProduct = (productId, updates) => {
  if (!globalProductsCache) getAllProducts();
  const index = globalProductsCache.findIndex(p => String(p.id) === String(productId) || String(p.sku) === String(productId));
  if (index !== -1) {
    globalProductsCache[index] = { ...globalProductsCache[index], ...updates };
    try {
      localStorage.setItem('userProductsCache', JSON.stringify(globalProductsCache));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }
};

export const deleteProduct = (productId) => {
  if (globalProductsCache) {
    globalProductsCache = globalProductsCache.filter(p => String(p.id) !== String(productId) && String(p.sku) !== String(productId));
    localStorage.setItem('userProductsCache', JSON.stringify(globalProductsCache));
  }
};

export const getProductById = (productId) => {
  if (!globalProductsCache) getAllProducts();
  return globalProductsCache.find(p => String(p.id) === String(productId) || String(p.sku) === String(productId)) || null;
};

import { useState, useEffect } from 'react';

// CATEGORY DATA
const defaultCategories = [
  { id: 0, name: 'Ourgoods Stock', icon: 'las la-money-bill-wave', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=90&w=150' },
  { id: 1, name: 'Apparels', icon: 'las la-female', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=90&w=150' },
  { id: 3, name: 'Jewelry & Accessories', icon: 'las la-gem', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=90&w=150' },
  { id: 4, name: 'Purse & Bags', icon: 'las la-shopping-bag', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=150' },
  { id: 5, name: 'Sneakers & Shoes', icon: 'las la-shoe-prints', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=150' },
  { id: 6, name: 'Beauty & Health', icon: 'las la-spa', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=150' },
  { id: 7, name: 'Home & Decor', icon: 'las la-home', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=90&w=150' }
];

const defaultSubcategories = {
  'Ourgoods Stock': [
    { name: 'Trending Now', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=150' },
    { name: 'Flash Deals', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150' },
    { name: 'New Arrivals', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=150' },
    { name: 'Best Sellers', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=150' },
    { name: 'Under ৳999', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=150' },
    { name: 'Clearance', img: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=80&w=150' }
  ],
  'Apparels': [
    { name: 'Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150' },
    { name: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=150' },
    { name: 'T-shirts', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=150' },
    { name: 'Sweatshirts', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=150' },
    { name: 'Jeans', img: 'https://images.unsplash.com/photo-1542272604-780c8d47b096?auto=format&fit=crop&q=80&w=150' },
    { name: 'Bottoms', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=150' },
    { name: 'Knitwear', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=150' },
    { name: 'Co-ords', img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=150' },
    { name: 'Denim', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=150' },
    { name: 'Tank Tops', img: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=150' },
    { name: 'Coats/Jackets', img: 'https://images.unsplash.com/photo-1551028719-0c14bdf8820c?auto=format&fit=crop&q=80&w=150' },
    { name: 'Pants', img: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=150' },
    { name: 'Jumpsuits', img: 'https://images.unsplash.com/photo-1485231183945-fd66f1406e9d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Blouses', img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=150' },
    { name: 'Bikini Sets', img: 'https://images.unsplash.com/photo-1564205423856-42d715a31a98?auto=format&fit=crop&q=80&w=150' }
  ],
  'Jewelry & Accessories': [
    { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478514-4a11011c77f0?auto=format&fit=crop&q=80&w=150' },
    { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=150' },
    { name: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=80&w=150' },
    { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=150' },
    { name: 'Watches', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=150' },
    { name: 'Sunglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=150' },
    { name: 'Hats', img: 'https://images.unsplash.com/photo-1521369909029-2afed882259d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Belts', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=150' }
  ],
  'Purse & Bags': [
    { name: 'Totes', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=150' },
    { name: 'Crossbody', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=150' },
    { name: 'Backpacks', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=150' },
    { name: 'Clutches', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Wallets', img: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=80&w=150' },
    { name: 'Satchels', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=150' },
    { name: 'Duffles', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=150' }
  ],
  'Sneakers & Shoes': [
    { name: 'Sneakers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150' },
    { name: 'Boots', img: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=150' },
    { name: 'Heels', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=150' },
    { name: 'Flats', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=150' },
    { name: 'Sandals', img: 'https://images.unsplash.com/photo-1603487742131-4160c9993020?auto=format&fit=crop&q=80&w=150' },
    { name: 'Loafers', img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=80&w=150' },
    { name: 'Slippers', img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=150' }
  ],
  'Beauty & Health': [
    { name: 'Skincare', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=150' },
    { name: 'Makeup', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=150' },
    { name: 'Fragrance', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=150' },
    { name: 'Haircare', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=150' },
    { name: 'Bath & Body', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=150' },
    { name: 'Tools', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=150' },
    { name: 'Wellness', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=150' }
  ],
  'Home & Decor': [
    { name: 'Furniture', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=150' },
    { name: 'Bedding', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=150' },
    { name: 'Lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=150' },
    { name: 'Wall Art', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=150' },
    { name: 'Rugs', img: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=150' },
    { name: 'Decor', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=150' },
    { name: 'Kitchenware', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Storage', img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=150' }
  ]
};
const getInitialCategories = () => {
  const stored = localStorage.getItem('mockCategories');
  if (stored) {
    const parsed = JSON.parse(stored);
    const missing = defaultCategories.filter(dc => !parsed.find(pc => pc.name === dc.name));
    return [...parsed, ...missing].filter(c => c.name !== 'All Products');
  }
  return [...defaultCategories].filter(c => c.name !== 'All Products');
};

const getInitialSubcategories = () => {
  const stored = localStorage.getItem('mockSubcategories');
  if (stored) {
    const parsed = JSON.parse(stored);
    const merged = { ...parsed };
    for (const key in defaultSubcategories) {
      if (!merged[key]) {
        merged[key] = defaultSubcategories[key];
      }
    }
    if (merged['All Products']) {
      delete merged['All Products'];
    }
    return merged;
  }
  const defaults = {...defaultSubcategories};
  if (defaults['All Products']) {
    delete defaults['All Products'];
  }
  return defaults;
};

let globalCategories = getInitialCategories();
let globalSubcategories = getInitialSubcategories();

const saveCategories = () => {
  localStorage.setItem('mockCategories', JSON.stringify(globalCategories));
  localStorage.setItem('mockSubcategories', JSON.stringify(globalSubcategories));
  window.dispatchEvent(new Event('categories-updated'));
};

export const getAllCategories = () => [...globalCategories];
export const getCategorySubcategories = () => ({...globalSubcategories});

export const addCategory = (cat) => {
  const newId = Math.max(0, ...globalCategories.map(c => c.id)) + 1;
  const newCat = { ...cat, id: newId };
  globalCategories.push(newCat);
  globalSubcategories[newCat.name] = [];
  saveCategories();
};

export const updateCategory = (oldName, newCat) => {
  globalCategories = globalCategories.map(c => c.name === oldName ? { ...c, ...newCat } : c);
  if (newCat.name && oldName !== newCat.name) {
    globalSubcategories[newCat.name] = globalSubcategories[oldName] || [];
    delete globalSubcategories[oldName];
  }
  saveCategories();
};

export const deleteCategory = (catName) => {
  globalCategories = globalCategories.filter(c => c.name !== catName);
  delete globalSubcategories[catName];
  saveCategories();
};

export const addSubcategory = (catName, subcat) => {
  if (!globalSubcategories[catName]) globalSubcategories[catName] = [];
  globalSubcategories[catName].push(subcat);
  saveCategories();
};

export const updateSubcategory = (catName, oldSubName, newSub) => {
  if (globalSubcategories[catName]) {
    globalSubcategories[catName] = globalSubcategories[catName].map(s => s.name === oldSubName ? { ...s, ...newSub } : s);
    saveCategories();
  }
};

export const deleteSubcategory = (catName, subcatName) => {
  if (globalSubcategories[catName]) {
    globalSubcategories[catName] = globalSubcategories[catName].filter(s => s.name !== subcatName);
    saveCategories();
  }
};

export const useCategories = () => {
  const [categories, setCategories] = useState(getAllCategories());
  const [subcategories, setSubcategories] = useState(getCategorySubcategories());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(getAllCategories());
      setSubcategories(getCategorySubcategories());
    };
    
    window.addEventListener('categories-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'mockCategories' || e.key === 'mockSubcategories') {
        globalCategories = getInitialCategories();
        globalSubcategories = getInitialSubcategories();
        handleUpdate();
      }
    });

    return () => {
      window.removeEventListener('categories-updated', handleUpdate);
    };
  }, []);

  return { categories, subcategories };
};


// VENDOR DATA
const defaultVendors = [
  { id: 'v1', name: 'Ourgoods Direct', contactName: 'System Admin', email: 'admin@ourgoods.com', phone: '+1234567890', status: 'Active', commission: 0, joinedAt: '2023-01-15', revenue: 45000, productsCount: 120, tier: 'Official', rating: 4.9, location: 'Dhaka, Bangladesh', fulfillmentRate: 99, recentSales: [450, 520, 480, 610, 590, 750, 810] },
  { id: 'v2', name: 'TechHaven Electronics', contactName: 'John Doe', email: 'john@techhaven.com', phone: '+1987654321', status: 'Active', commission: 15, joinedAt: '2023-03-22', revenue: 12500, productsCount: 45, tier: 'Top Seller', rating: 4.6, location: 'Shenzhen, China', fulfillmentRate: 94, recentSales: [120, 150, 140, 180, 175, 200, 190] },
  { id: 'v3', name: 'StyleBoutique', contactName: 'Jane Smith', email: 'jane@styleboutique.com', phone: '+1555666777', status: 'Pending', commission: 18, joinedAt: '2023-11-05', revenue: 0, productsCount: 0, tier: 'New Vendor', rating: 0, location: 'Guangzhou, China', fulfillmentRate: 0, recentSales: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'v4', name: 'HomeEssentials', contactName: 'Robert Johnson', email: 'robert@homeessentials.com', phone: '+1444555666', status: 'Suspended', commission: 12, joinedAt: '2023-06-10', revenue: 8400, productsCount: 30, tier: 'Standard', rating: 3.2, location: 'Yiwu, China', fulfillmentRate: 81, recentSales: [50, 40, 60, 30, 20, 10, 0] }
];

const getInitialVendors = () => {
  const stored = localStorage.getItem('mockVendors');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch(e) {}
  }
  return [...defaultVendors];
};

let globalVendors = getInitialVendors();

const saveVendors = () => {
  localStorage.setItem('mockVendors', JSON.stringify(globalVendors));
  window.dispatchEvent(new Event('vendors-updated'));
};

export const getAllVendors = () => [...globalVendors];

export const addVendor = (vendor) => {
  const newId = 'v' + (Date.now() + Math.floor(Math.random() * 1000));
  const newVendor = { 
    tier: 'New Vendor', rating: 0, fulfillmentRate: 100, recentSales: [0, 0, 0, 0, 0, 0, 0], location: 'Not Specified',
    ...vendor, 
    id: newId, joinedAt: new Date().toISOString().split('T')[0], revenue: 0, productsCount: 0 
  };
  globalVendors.push(newVendor);
  saveVendors();
  return newVendor;
};

export const updateVendor = (id, updates) => {
  globalVendors = globalVendors.map(v => v.id === id ? { ...v, ...updates } : v);
  saveVendors();
};

export const deleteVendor = (id) => {
  globalVendors = globalVendors.filter(v => v.id !== id);
  saveVendors();
};

export const useVendors = () => {
  const [vendors, setVendors] = useState(getAllVendors());

  useEffect(() => {
    const handleUpdate = () => {
      setVendors(getAllVendors());
    };
    window.addEventListener('vendors-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'mockVendors') {
        globalVendors = getInitialVendors();
        handleUpdate();
      }
    });
    return () => window.removeEventListener('vendors-updated', handleUpdate);
  }, []);

  return vendors;
};

// ------------------------------------------------------------------
// Homepage Layout Controls
// ------------------------------------------------------------------
const defaultHomepageLayout = {
  heroSlider: true,
  categoryHeroSliders: {},
  sections: [
    { id: 'flashSale', title: 'Flash Sale', visible: true },
    { id: 'globalShop', title: 'Global Shop', visible: true },
    { id: 'factoryDirect', title: 'Factory Direct', visible: true }
  ],
  tabs: [
    { label: 'All Products', visible: true },
    { label: 'Free Shipping', visible: true },
    { label: 'Choice', visible: true },
    { label: 'Combo Offer', visible: true },
    { label: 'Cash on Delivery', visible: true },
    { label: '24h Delivery', visible: true }
  ]
};

const getInitialHomepageLayout = () => {
  const stored = localStorage.getItem('mockHomepageLayout');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migration from old object-based format to new array-based format
      if (!Array.isArray(parsed.sections) || !Array.isArray(parsed.tabs)) {
        return JSON.parse(JSON.stringify(defaultHomepageLayout));
      }
      // Force update tabs to default to ensure new requested tabs are shown instead of old cached ones
      parsed.tabs = JSON.parse(JSON.stringify(defaultHomepageLayout.tabs));
      return { ...defaultHomepageLayout, ...parsed };
    } catch (e) {
      console.error("Failed to parse homepage layout", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultHomepageLayout));
};

let globalHomepageLayout = getInitialHomepageLayout();

const saveHomepageLayout = () => {
  localStorage.setItem('mockHomepageLayout', JSON.stringify(globalHomepageLayout));
  window.dispatchEvent(new Event('layout-updated'));
};

export const getHomepageLayout = () => ({ ...globalHomepageLayout });

export const updateHomepageLayout = (newLayout) => {
  globalHomepageLayout = {
    ...globalHomepageLayout,
    ...newLayout
  };
  saveHomepageLayout();
};

export const useHomepageLayout = () => {
  const [layout, setLayout] = useState(getHomepageLayout());

  useEffect(() => {
    const handleUpdate = () => {
      setLayout(getHomepageLayout());
    };
    window.addEventListener('layout-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'mockHomepageLayout') {
        globalHomepageLayout = getInitialHomepageLayout();
        handleUpdate();
      }
    });
    return () => window.removeEventListener('layout-updated', handleUpdate);
  }, []);

  return layout;
};
