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

  const cached = localStorage.getItem('mockProductsCache');
  if (cached) {
    try {
      // Clear cache once so we don't serve old fake data
      localStorage.removeItem('mockProductsCache');
    } catch (e) {
      // ignore
    }
  }

  // Evaluate choice logic for the real products
  let products = realProducts.map(product => {
      // Setup base metrics
      const returnRate = parseFloat((Math.random() * 8).toFixed(1)); // 0 to 8%
      const cancellationRate = parseFloat((Math.random() * 5).toFixed(1)); // 0 to 5%
      const sellerPerformance = randomInt(60, 100);
      const shippingDays = randomInt(1, 14);
      const priceCompetitiveness = randomInt(40, 100);
      const qualityScore = randomInt(50, 100);
      const stock = randomInt(0, 500);

      const enhancedProduct = {
          ...product,
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
    filtered = all.filter(p => p.category === category);
  }
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
    id: productData.sku || 'gen_new_' + Date.now(),
    title: productData.name || 'New Product',
    category: productData.category || 'Women', // default category
    image: productData.images && productData.images.length > 0 ? productData.images[0].url : "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    choiceReason: 'New manually added product'
  };

  if (newProduct.originalPrice > newProduct.price) {
    newProduct.discount = Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100);
  }

  // Push to the very beginning of the cache so it shows up first everywhere
  globalProductsCache.unshift(newProduct);
};

