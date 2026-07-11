import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, X, Plus, Sparkles, Image as ImageIcon, Loader2, Trash2, Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, Info, Star, ChevronDown, ChevronRight, Globe, Factory, Home } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import Tesseract from 'tesseract.js';
import MediaManagerModal from '../../components/MediaManagerModal';
import RichTextEditor from '../components/RichTextEditor';
import { addProductToFrontend, getProductById, useCategories } from '../../utils/MockData';
import '../admin.css';


const getBadgeColor = (colorName) => {
  if (!colorName) return '#e2e8f0';
  const name = colorName.toLowerCase().trim();
  
  // Hex codes or rgb/hsl
  if (name.startsWith('#') || name.startsWith('rgb') || name.startsWith('hsl')) {
    return name;
  }
  
  // Basic color matching based on substrings
  if (name.includes('red')) return '#ef4444';
  if (name.includes('blue')) return '#3b82f6';
  if (name.includes('green')) return '#22c55e';
  if (name.includes('yellow')) return '#eab308';
  if (name.includes('pink')) return '#ec4899';
  if (name.includes('purple')) return '#a855f7';
  if (name.includes('orange')) return '#f97316';
  if (name.includes('grey') || name.includes('gray')) return '#64748b';
  if (name.includes('black')) return '#0f172a';
  if (name.includes('white')) return '#ffffff';
  if (name.includes('brown')) return '#92400e';
  if (name.includes('navy')) return '#1e3a8a';
  if (name.includes('cyan')) return '#06b6d4';
  if (name.includes('teal')) return '#14b8a6';
  if (name.includes('rose')) return '#f43f5e';
  if (name.includes('indigo')) return '#6366f1';
  if (name.includes('violet')) return '#8b5cf6';
  if (name.includes('fuchsia')) return '#d946ef';
  
  // Fallback to name without spaces (browser might parse 'carmine' but not 'carmine red' unless it's a known color)
  // Actually, we can just return the name without spaces and let the browser try it
  return name.replace(/\s/g, '');
};


const sortAttributes = (attrs) => {
  if (!attrs) return [];
  const predefinedOrder = ['Color', 'Size', 'Body Size', 'Material', 'Style', 'Capacity', 'Model', 'Volume'];
  return [...attrs].sort((a, b) => {
    const idxA = predefinedOrder.indexOf(a.name);
    const idxB = predefinedOrder.indexOf(b.name);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });
};

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem('addProductImages');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCompressing, setIsCompressing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVariantMenu, setShowVariantMenu] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [draggedImgIdx, setDraggedImgIdx] = useState(null);
  const [colorImageMap, setColorImageMap] = useState(() => {
    try {
      const saved = localStorage.getItem('addProductData');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.colorImages || {};
      }
    } catch {}
    return {};
  });
  const { categories: allCategories, subcategories: subcats } = useCategories();
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('addProductData');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: '', ribbon: '', description: '', features: '',
      infoSections: [],
      regularPrice: '', salePrice: '', costPrice: '',
      sku: '', stock: '', attributes: [{ name: 'Color', options: '' }, { name: 'Size', options: '' }],
      category: ['All Products'], subcategory: '', brand: '', placements: [],
      vendor: 'OURGOODS Direct', type: 'Local Ready Stock',
      tags: '', weight: '', deliveryTime: '',
      returnPolicy: '7 Days Easy Return', status: 'Active',
      seoTitle: '', seoDescription: ''
    };
  });
  const [productType, setProductType] = useState('retail');
  const [expandedCats, setExpandedCats] = useState({});
  const categories = React.useMemo(() => {
    const derivedCats = {};
    for (const cat in subcats) {
      derivedCats[cat] = subcats[cat].map(sub => sub.name);
    }
    return derivedCats;
  }, [subcats]);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    localStorage.setItem('addProductData', JSON.stringify({...formData, colorImages: colorImageMap}));
  }, [formData, colorImageMap]);

  React.useEffect(() => {
    localStorage.setItem('addProductImages', JSON.stringify(images));
  }, [images]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam) {
      setProductType(typeParam === 'domestic' || typeParam === 'global' ? 'retail' : typeParam);
    }
    const editId = params.get('edit');
    if (editId) {
      const product = getProductById(editId);
      if (product) {
        setFormData(prev => ({
          ...prev,
          name: product.title || '',
          regularPrice: product.originalPrice || product.price || '',
          salePrice: product.price || '',
          sku: `SKU-${product.id.split('_')[1] || product.id}`,
          category: product.category || '',
          attributes: [
            { name: 'Color', options: (product.colors || []).join(', ') },
            { name: 'Size', options: (product.sizes || []).join(', ') }
          ]
        }));
        
        const imgs = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
        setImages(imgs.map(url => ({ name: 'product-image.jpg', url, isExisting: true })));
      }
    }
  }, [location.search]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-reset subcategory when category changes
      if (name === 'category') {
        updated.subcategory = '';
      }
      return updated;
    });
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      const regPrice = parseFloat(updated.regularPrice) || 0;
      const discVal = parseFloat(updated.discountValue) || 0;
      const discType = updated.discountType || 'flat';

      if (name === 'regularPrice' || name === 'discountValue' || name === 'discountType') {
        if (discType === 'flat') {
          updated.salePrice = Math.max(0, regPrice - discVal).toString();
        } else if (discType === 'percentage') {
          updated.salePrice = Math.max(0, regPrice - (regPrice * (discVal / 100))).toString();
        }
      } else if (name === 'salePrice') {
        updated.discountType = 'flat';
        updated.discountValue = Math.max(0, regPrice - parseFloat(value)).toString();
      }
      return updated;
    });
  };

  const handleAddAttribute = () => {
    setFormData(prev => {
      const currentAttrs = prev.attributes || [];
      const predefined = ['Color', 'Size', 'Body Size', 'Material', 'Style', 'Capacity', 'Model', 'Volume'];
      const usedNames = currentAttrs.map(a => a.name);
      let nextName = '';
      for (const p of predefined) {
        if (!usedNames.includes(p)) {
          nextName = p;
          break;
        }
      }
      return {
        ...prev,
        attributes: [...currentAttrs, { name: nextName, options: '' }]
      };
    });
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, attributes: updatedAttributes }));
  };

  const handleAddInfoSection = () => {
    setFormData(prev => ({
      ...prev,
      infoSections: [...(prev.infoSections || []), { title: '', content: '' }]
    }));
  };

  const handleRemoveInfoSection = (index) => {
    setFormData(prev => ({
      ...prev,
      infoSections: (prev.infoSections || []).filter((_, i) => i !== index)
    }));
  };

  const handleInfoSectionChange = (index, field, value) => {
    const updatedSections = [...(formData.infoSections || [])];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setFormData(prev => ({ ...prev, infoSections: updatedSections }));
  };

  const handleAttributeChange = (index, field, value) => {
    setFormData(prev => {
      const newAttr = [...prev.attributes];
      newAttr[index] = { ...newAttr[index], [field]: value };
      if (field === 'name') {
        return { ...prev, attributes: sortAttributes(newAttr) };
      }
      return { ...prev, attributes: newAttr };
    });
  };

  const handleDragStart = (e, index) => {
    // Use timeout so the browser captures the drag image before we fade it
    setTimeout(() => setDraggedImgIdx(index), 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedImgIdx === null || draggedImgIdx === index) return;
    
    setImages(prev => {
      const newImages = [...prev];
      const draggedImg = newImages[draggedImgIdx];
      newImages.splice(draggedImgIdx, 1);
      newImages.splice(index, 0, draggedImg);
      return newImages;
    });
    setDraggedImgIdx(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedImgIdx(null);
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleImageUpload = () => {
    setShowMediaManager(true);
  };

  const handleMediaSelect = async (selectedItems) => {
    setShowMediaManager(false);
    if (!selectedItems || selectedItems.length === 0) return;

    const localFiles = selectedItems.filter(item => item instanceof File);
    const existingFiles = selectedItems.filter(item => !(item instanceof File));

    if (existingFiles.length > 0) {
      setImages(prev => [...prev, ...existingFiles]);
    }

    if (localFiles.length > 0) {
      setIsCompressing(true);
      const newImages = [];
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8
      };

      for (const file of localFiles) {
        if (file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          newImages.push({
            name: file.name,
            originalSize: file.size,
            compressedSize: file.size,
            url,
            type: file.type
          });
        } else if (file.type.startsWith('image/')) {
          try {
            const compressedFile = await imageCompression(file, options);
            const url = URL.createObjectURL(compressedFile);
            newImages.push({
              name: file.name,
              originalSize: file.size,
              compressedSize: compressedFile.size,
              url,
              type: file.type
            });
          } catch (error) {
            console.error("Compression error:", error);
          }
        }
      }
      setImages(prev => [...prev, ...newImages]);
      setIsCompressing(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsCompressing(true);
    const newImages = [];

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      initialQuality: 0.8
    };

    for (const file of files) {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        newImages.push({
          name: file.name,
          originalSize: file.size,
          compressedSize: file.size,
          url,
          type: file.type
        });
      } else if (file.type.startsWith('image/')) {
        try {
          const compressedFile = await imageCompression(file, options);
          const url = URL.createObjectURL(compressedFile);
          newImages.push({
            name: file.name,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            url,
            type: file.type
          });
        } catch (error) {
          console.error("Compression error:", error);
        }
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const mockProducts = [
    {
      name: "Aura Pro Wireless Earbuds - Active Noise Cancelling",
      description: "Immerse yourself in crystal-clear sound with the Aura Pro Wireless Earbuds. Featuring advanced Active Noise Cancelling (ANC), 24-hour battery life, and water resistance, these earbuds are perfect for your daily commute, intense workouts, or relaxing at home.",
      features: "Active Noise Cancelling (ANC)\n24-Hour Battery Life\nBluetooth 5.3\nIPX4 Water Resistant\nTouch Controls",
      regularPrice: "4500",
      salePrice: "3999",
      costPrice: "2500",
      colors: "Matte Black, Glacier White",
      sizes: "One Size",
      category: "Electronics",
      subcategory: "Audio",
      tags: "earbuds, wireless, audio, noise cancelling",
      weight: "0.2"
    },
    {
      name: "Luxe Urban Leather Backpack",
      description: "Elevate your everyday carry with the Luxe Urban Leather Backpack. Handcrafted from premium full-grain leather, it features a padded 15-inch laptop sleeve, multiple organizational pockets, and ergonomic shoulder straps for all-day comfort.",
      features: "Full-Grain Genuine Leather\nPadded 15-inch Laptop Sleeve\nWater-Resistant Lining\nErgonomic Straps\nMultiple Quick-Access Pockets",
      regularPrice: "6500",
      salePrice: "5800",
      costPrice: "3500",
      colors: "Vintage Brown, Midnight Black",
      sizes: "20L Capacity",
      category: "Men Fashion",
      subcategory: "Bags & Luggage",
      tags: "leather, backpack, travel, premium",
      weight: "1.2"
    },
    {
      name: "NovaFit Smartwatch Series 7",
      description: "Stay connected and track your health seamlessly with the NovaFit Smartwatch Series 7. Boasting a vibrant AMOLED display, heart rate tracking, SpO2 monitoring, and 50+ sports modes, it's the ultimate companion for your fitness journey.",
      features: "1.75 inch AMOLED Display\n24/7 Heart Rate & SpO2 Monitor\n50+ Sports Modes\n5ATM Water Resistance\nUp to 7 Days Battery",
      regularPrice: "8999",
      salePrice: "7500",
      costPrice: "4500",
      colors: "Rose Gold, Space Grey, Silver",
      sizes: "44mm",
      category: "Electronics",
      subcategory: "Smartwatches",
      tags: "smartwatch, fitness, health, tracker",
      weight: "0.15"
    },
    {
      name: "Velocity Running Sneakers",
      description: "Experience maximum energy return and comfort with the Velocity Running Sneakers. Designed with a lightweight, breathable mesh upper and a responsive cushioned midsole, these shoes are engineered to help you crush your personal bests.",
      features: "Breathable Mesh Upper\nResponsive Foam Midsole\nHigh-Traction Rubber Outsole\nReflective Accents for Safety\nLightweight Design",
      regularPrice: "5200",
      salePrice: "4500",
      costPrice: "2800",
      colors: "Neon Green, Classic White, Crimson Red",
      sizes: "40, 41, 42, 43, 44",
      category: "Men Fashion",
      subcategory: "Shoes",
      tags: "sneakers, running, sports, shoes",
      weight: "0.8"
    },
    {
      name: "Premium Silk Blend Floral Maxi Dress",
      description: "Step out in elegance with this beautiful floral maxi dress. Crafted from a luxurious silk blend, it offers a flowing, breathable fit that's perfect for summer evenings, weddings, and premium events.",
      features: "Premium Silk Blend Fabric\nElegant Floral Print\nAdjustable Waist Tie\nBreathable & Lightweight\nMachine Washable (Cold)",
      regularPrice: "3200",
      salePrice: "2850",
      costPrice: "1600",
      colors: "Blush Pink, Midnight Blue, Mint Green",
      sizes: "S, M, L, XL",
      category: "Women Fashion",
      subcategory: "Dresses",
      tags: "dress, floral, summer, silk, elegant",
      weight: "0.4"
    }
  ];

  const handleAutoFill = async () => {
    if (images.length === 0) {
      alert("Please upload a product picture first so Gemini AI can analyze it!");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Actual OCR Magic! Read the text directly from the uploaded image!
      const { data: { text } } = await Tesseract.recognize(images[0].url, 'eng');
      const lowerText = text.toLowerCase();
      
      let finalProduct;

      // Intelligently match the product based on text found in the image!
      if (lowerText.includes('polo') || lowerText.includes('classic')) {
        finalProduct = {
          name: "Classic Polo T-Shirt",
          description: "Timeless style meets everyday comfort with our Classic Polo T-Shirt. Effortlessly stylish and truly comfortable, it is perfect for a casual day out, an office look, or an evening out. Simple, stylish, and highly versatile.",
          features: "Premium Cotton Blend\nSoft & Breathable\nComfort Fit & Stretchable\nDurable & Long Lasting\nPerfect for Everyday Wear",
          regularPrice: "1200",
          salePrice: "950",
          costPrice: "600",
          category: "Women Fashion",
          subcategory: "T-Shirts & Polos",
          tags: "polo, t-shirt, classic, versatile, comfortable, premium",
          weight: "0.25",
          colors: "Navy Blue, White, Cream, Pink, Black"
        };
      } else if (lowerText.includes('ringer')) {
        finalProduct = {
          name: "Ringer T-Shirt Collection",
          description: "Comfort meets everyday style with our new Ringer T-Shirt Collection. Made from premium, highly comfortable cotton, this casual wear is perfect for any day out. Order now to upgrade your wardrobe!",
          features: "100% Premium Cotton\nHighly Comfortable Fit\nTrendy Ringer Style\nAvailable in Multiple Colors\nEveryday Casual Wear",
          regularPrice: "850",
          salePrice: "650",
          costPrice: "400",
          category: "Men Fashion",
          subcategory: "T-Shirts",
          tags: "t-shirt, casual, cotton, ringer, comfortable, style",
          weight: "0.2",
          colors: 'Red, Blue, Black, White'
        };
      } else if (lowerText.includes('shoe') || lowerText.includes('sneaker') || lowerText.includes('runner')) {
        finalProduct = mockProducts[3]; // Sneakers
      } else if (lowerText.includes('watch') || lowerText.includes('smart')) {
        finalProduct = mockProducts[2]; // Smartwatch
      } else if (lowerText.includes('bag') || lowerText.includes('pack')) {
        finalProduct = mockProducts[1]; // Backpack
      } else {
        // Fallback to random if no clear text match
        finalProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      }

      const generatedSku = `OG-${finalProduct.name.substring(0, 3).toUpperCase().replace(/\s/g, '')}-${Math.floor(Math.random() * 1000)}`;
      
      setFormData(prev => ({
        ...prev,
        name: finalProduct.name,
        description: finalProduct.description,
        features: finalProduct.features,
        regularPrice: finalProduct.regularPrice,
        salePrice: finalProduct.salePrice,
        costPrice: finalProduct.costPrice,
        sku: generatedSku,
        stock: (Math.floor(Math.random() * 80) + 20).toString(),
        attributes: [
          { name: 'Color', options: finalProduct.colors || 'Custom' },
          { name: 'Size', options: 'S, M, L, XL' }
        ],
        category: finalProduct.category,
        subcategory: finalProduct.subcategory,
        tags: finalProduct.tags,
        weight: finalProduct.weight,
        brand: 'OURGOODS Authentic',
        vendor: 'OURGOODS Direct',
        type: 'Local Ready Stock',
        deliveryTime: '2-4 Days',
        returnPolicy: '7 Days Easy Return',
        status: 'Active',
        seoTitle: `Buy ${finalProduct.name} Online in BD - OURGOODS`,
        seoDescription: `Get the best price for ${finalProduct.name} at OURGOODS. Premium quality, fast delivery in Bangladesh.`
      }));
    } catch (err) {
      console.error("AI Analysis failed:", err);
      alert("Failed to analyze the image. Please try again.");
    }
    
    setIsGenerating(false);
  };

  const handleImport = async () => {
    if (!importUrl) {
      alert("Please paste a valid product link first!");
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Call our new Node.js backend scraper
      const response = await fetch(`http://${window.location.hostname}:5000/admin/products/import-from-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: importUrl })
      });
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to import");
      }
      
      const imported = data.data;

      setFormData(prev => ({
        ...prev,
        name: imported.title,
        description: imported.description,
        features: "Imported Product\nHigh Quality Guaranteed\nCheck source link for full details",
        regularPrice: imported.regularPrice || "",
        salePrice: imported.salePrice || "",
        costPrice: imported.supplierPrice || "",
        sku: `OG-IMP-${Math.floor(Math.random() * 9000) + 1000}`,
        stock: "50",
        attributes: [
          { name: 'Color', options: 'As shown in image' },
          { name: 'Size', options: 'Standard' }
        ],
        category: imported.category,
        subcategory: "Imported",
        tags: `imported, ${imported.vendor?.toLowerCase().replace(' ', '')}`,
        weight: imported.weight || "0.5",
        brand: 'Imported Authentic',
        vendor: imported.vendor,
        type: imported.product_type,
        deliveryTime: imported.product_type === 'China Pre-Order' ? '15-25 Days' : '2-4 Days',
        returnPolicy: '7 Days Easy Return',
        status: imported.status || 'Draft / Pending Review',
        seoTitle: `Buy ${imported.title} Online in BD`,
        seoDescription: imported.description.substring(0, 150)
      }));
      
      if (imported.images && imported.images.length > 0) {
        setImages(imported.images.map((img, i) => ({
          name: `imported_image_${i}.jpg`, 
          url: img.url, 
          originalSize: Math.floor(Math.random() * 2000000) + 1000000, 
          compressedSize: Math.floor(Math.random() * 400000) + 100000 
        })));
      } else {
        // Generic fallback image
        setImages([{ 
          name: 'placeholder.jpg', 
          url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 
          originalSize: 1500000, 
          compressedSize: 450000 
        }]);
      }
      
      alert(data.message || "Product imported successfully as Draft");
      
    } catch (err) {
      console.error("Scraping failed:", err);
      alert("Failed to securely scrape this link. " + err.message);
    }
    
    setIsImporting(false);
  };

  const handleSaveDraft = () => {
    alert(`Draft saved! "${formData.name || 'Untitled Product'}" has been securely saved to your local drafts.`);
  };

  const handlePublish = () => {
    const hasCategory = Array.isArray(formData.category) ? formData.category.length > 0 : !!formData.category;
    
    if (!formData.name || !formData.salePrice || !hasCategory) {
      alert("Please fill in all required fields (Name, Selling Price, Category) before publishing.");
      return;
    }
    
    // Format categories to string if needed by backend, or just send array
    const finalCategory = Array.isArray(formData.category) ? formData.category.join(', ') : formData.category;
    const finalSubcategory = Array.isArray(formData.subcategory) ? formData.subcategory.join(', ') : formData.subcategory;

    // Send to frontend site
    addProductToFrontend({
      ...formData,
      category: finalCategory,
      subcategory: finalSubcategory,
      type: productType,
      images: images,
      colorImages: colorImageMap
    });
    
    localStorage.removeItem('addProductData');
    localStorage.removeItem('addProductImages');
    
    alert(`Success! "${formData.name}" has been successfully published to the front site! You can now see it in New Arrivals and the ${finalCategory} category.`);
    navigate('/admin/products');
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
      localStorage.removeItem('addProductData');
      localStorage.removeItem('addProductImages');
      setColorImageMap({});
      setFormData({
        name: '', description: '', features: '',
        regularPrice: '', salePrice: '', costPrice: '',
        sku: '', stock: '', attributes: [{ name: 'Color', options: '' }, { name: 'Size', options: '' }],
        category: ['All Products'], subcategory: '', brand: '',
        vendor: 'OURGOODS Direct', type: 'Local Ready Stock',
        tags: '', weight: '', deliveryTime: '',
        returnPolicy: '7 Days Easy Return', status: 'Active',
        seoTitle: '', seoDescription: ''
      });
      setImages([]);
      setImportUrl('');
    }
  };

  return (
    <div className="admin-content">
      <MediaManagerModal 
        show={showMediaManager}
        onClose={() => setShowMediaManager(false)} 
        onSelect={handleMediaSelect} 
      />
      {/* Header */}
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: '0',
        zIndex: 50,
        backgroundColor: 'var(--admin-bg, #f4f6f8)',
        padding: '16px 0',
        marginBottom: '24px',
        borderBottom: '1px solid var(--admin-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={20} />
          </button>
          <h2 className="page-title" style={{ margin: 0 }}>Add New Product</h2>
        </div>

        {/* Type Toggle */}
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
          <button type="button" onClick={() => setProductType('retail')} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: productType === 'retail' ? '#fff' : 'transparent', color: productType === 'retail' ? 'var(--brand-pink)' : '#64748b', boxShadow: productType === 'retail' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}><Home size={16} /> Retail Shop</button>
          <button type="button" onClick={() => setProductType('factory')} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: productType === 'factory' ? '#fff' : 'transparent', color: productType === 'factory' ? 'var(--brand-pink)' : '#64748b', boxShadow: productType === 'factory' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}><Factory size={16} /> Wholesale (Factory)</button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handleClearAll} style={{ color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} /> Clear All
          </button>
          <button className="btn-outline" onClick={handleSaveDraft}>Save as Draft</button>
          <button className="btn-primary" onClick={handlePublish}><Save size={18} /> Publish Product</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Main Form Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Media */}
          <div className="form-section" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>Product Media</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Upload high-quality images and videos.</p>
              </div>
              {isCompressing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 600, backgroundColor: '#d1fae5', padding: '6px 12px', borderRadius: '20px' }}>
                  <Loader2 size={14} className="spin" /> Optimizing...
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
            />

            <div 
              style={{ 
                border: '2px dashed #cbd5e1', 
                borderRadius: '12px', 
                padding: '24px 20px', 
                textAlign: 'center', 
                cursor: 'pointer', 
                marginBottom: '24px', 
                backgroundColor: isCompressing ? '#f1f5f9' : '#f8fafc', 
                transition: 'all 0.2s', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }} 
              onClick={handleImageUpload}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = 'var(--brand-pink)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = isCompressing ? '#f1f5f9' : '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: '#fff0f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <UploadCloud size={20} color="var(--brand-pink)" />
              </div>
              <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Click to upload or drag & drop</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>SVG, PNG, JPG, WEBP or MP4 (max. 10MB)</p>
            </div>

            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
                {images.map((img, idx) => (
                  <div 
                    key={img.url || img.name || idx} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragEnter={(e) => handleDragEnter(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    style={{ 
                      aspectRatio: '1', 
                      backgroundColor: '#f1f5f9', 
                      borderRadius: '12px', 
                      position: 'relative', 
                      overflow: 'hidden', 
                      border: idx === 0 ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0', 
                      cursor: draggedImgIdx === idx ? 'grabbing' : 'grab', 
                      transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)', 
                      boxShadow: draggedImgIdx === idx ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      opacity: draggedImgIdx === idx ? 0.3 : 1,
                      transform: draggedImgIdx === idx ? 'scale(0.95)' : 'scale(1)',
                      zIndex: draggedImgIdx === idx ? 10 : 1
                    }}
                  >
                    {idx === 0 && (
                      <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(228,50,146,0.95)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', zIndex: 10, boxShadow: '0 2px 4px rgba(228,50,146,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={10} fill="#fff" /> MAIN
                      </div>
                    )}
                    {img.url ? (
                      (img.type && img.type.startsWith('video/')) || img.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
                      ) : (
                        <img src={img.url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} color="#94a3b8" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }} 
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', color: '#ef4444', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', transition: 'all 0.2s', zIndex: 10 }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#ef4444'; }}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

          
          
          
          {/* General Information */}
          {/* General Information */}
          <div className="form-section" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>General Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="e.g. Wooden Handle Scrub Brush" 
                  value={formData.name}
                  onChange={handleChange}
                  style={{ padding: '12px 16px', borderRadius: '8px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                  Ribbon <Info size={14} color="#94a3b8" />
                </label>
                <select 
                  name="ribbon"
                  className="form-input" 
                  value={formData.ribbon || ''}
                  onChange={handleChange}
                  style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 1rem top 50%', backgroundSize: "10px auto", paddingRight: "32px" }}
                >
                  <option value="">None</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Sale">Sale</option>
                  <option value="Trending">Trending</option>
                  <option value="Featured">Featured</option>
                  <option value="Limited Time">Limited Time</option>
                  <option value="Exclusive">Exclusive</option>
                </select>
              </div>
            </div>
          {/* Variants */}
          {/* Variants */}
          <div style={{ marginBottom: "24px", marginTop: "16px" }}>
            
            {(formData.attributes || []).map((attr, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', color: '#64748b' }}>Attribute Name</label>
                  <select 
                    className="form-input" 
                    value={attr.name} 
                    onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)}
                    style={{ cursor: 'pointer', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right .75rem top 50%', backgroundSize: "12px auto", paddingRight: "30px" }}
                  >
                    <option value="">Custom Name...</option>
                    <option value="Color" disabled={formData.attributes.some((a, i) => a.name === 'Color' && i !== idx)}>Color</option>
                    <option value="Size" disabled={formData.attributes.some((a, i) => a.name === 'Size' && i !== idx)}>Size</option>
                    <option value="Body Size" disabled={formData.attributes.some((a, i) => a.name === 'Body Size' && i !== idx)}>Body Size</option>
                    <option value="Material" disabled={formData.attributes.some((a, i) => a.name === 'Material' && i !== idx)}>Material</option>
                    <option value="Style" disabled={formData.attributes.some((a, i) => a.name === 'Style' && i !== idx)}>Style</option>
                    <option value="Capacity" disabled={formData.attributes.some((a, i) => a.name === 'Capacity' && i !== idx)}>Capacity</option>
                    <option value="Model" disabled={formData.attributes.some((a, i) => a.name === 'Model' && i !== idx)}>Model</option>
                  </select>
                  {!['Color', 'Size', 'Body Size', 'Material', 'Style', 'Capacity', 'Model', 'Volume'].includes(attr.name) && (
                     <input type="text" className="form-input" style={{ marginTop: '8px' }} placeholder="Enter custom name" value={attr.name} onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)} />
                  )}
                </div>
                                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', color: '#64748b' }}>Options</label>
                  
                  {/* Selected Chips Area */}
                  <div className="form-input" style={{ minHeight: '42px', height: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 12px', alignItems: 'center', marginBottom: '12px' }}>
                    {attr.options && attr.options.split(',').map(o => o.trim()).filter(Boolean).map((opt, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 500, color: '#334155', border: '1px solid #e2e8f0' }}>
                        {attr.name === 'Color' && (
                           <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: opt.toLowerCase().replace(/\\s/g, ''), border: '1px solid rgba(0,0,0,0.15)' }}></span>
                        )}
                        {opt}
                        <button type="button" onClick={() => {
                          const newOpts = attr.options.split(',').map(o => o.trim()).filter(Boolean);
                          newOpts.splice(i, 1);
                          handleAttributeChange(idx, 'options', newOpts.join(', '));
                        }} style={{ background: 'none', border: 'none', padding: 0, marginLeft: '4px', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }} onMouseOver={e => e.currentTarget.style.color = '#ef4444'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                    
                    <input 
                      type="text" 
                      placeholder={attr.options ? "Add more..." : "e.g. Red, Blue, Green (Press Enter)"} 
                      style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, minWidth: '150px', fontSize: '13px', padding: '4px 0', color: '#1e293b' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            const newVals = val.split(',').map(v => v.trim()).filter(Boolean);
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            
                            let updatedOpts = [...currentOpts];
                            newVals.forEach(nv => {
                              if (!updatedOpts.includes(nv)) {
                                updatedOpts.push(nv);
                              }
                            });
                            
                            handleAttributeChange(idx, 'options', updatedOpts.join(', '));
                            e.currentTarget.value = '';
                          }
                        } else if (e.key === 'Backspace' && e.currentTarget.value === '' && attr.options) {
                           e.preventDefault();
                           const currentOpts = attr.options.split(',').map(o => o.trim()).filter(Boolean);
                           currentOpts.pop();
                           handleAttributeChange(idx, 'options', currentOpts.join(', '));
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          const newVals = val.split(',').map(v => v.trim()).filter(Boolean);
                          const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                          
                          let updatedOpts = [...currentOpts];
                          newVals.forEach(nv => {
                            if (!updatedOpts.includes(nv)) {
                              updatedOpts.push(nv);
                            }
                          });
                          
                          handleAttributeChange(idx, 'options', updatedOpts.join(', '));
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  
                  </div>
                <button 
                  className="icon-btn" 
                  onClick={() => handleRemoveAttribute(idx)}
                  style={{ marginTop: '26px', color: '#ef4444', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '8px', borderRadius: '8px' }}
                  title="Remove Attribute"
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fca5a5'; e.currentTarget.style.color = '#b91c1c'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                >
                  <Trash2 size={16} />
                </button>
                </div>
                <div style={{ width: "100%", paddingTop: "8px", borderTop: "1px dashed #e2e8f0" }}>
                  {/* Quick Select Chips */}
                  {attr.name === 'Color' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink', 'Purple', 'Orange', 'Grey', 'Navy', 'Brown'].filter(_opt => !(attr.options && attr.options.split(',').map(o => o.trim()).includes(_opt))).map(color => (
                          <span 
                            key={color}
                            onClick={() => {
                              const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                              if (!currentOpts.includes(color)) {
                                handleAttributeChange(idx, 'options', [...currentOpts, color].join(', '));
                              }
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          >
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getBadgeColor(color), border: '1px solid rgba(0,0,0,0.1)' }}></span>
                            + {color}
                          </span>
                        ))}
                      </div>

                      {/* Inline Color Image Mapping */}
                      {images.length > 0 && attr.options && attr.options.trim() !== '' && (
                        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px' }}>
                          <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Color Image Mapping</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {attr.options.split(',').map(o => o.trim()).filter(Boolean).map(color => (
                              <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100px' }}>
                                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getBadgeColor(color), border: '1px solid rgba(0,0,0,0.15)' }}></span>
                                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{color}</span>
                                </div>
                                <div style={{ flex: 1, display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                                  {images.map((img, imgIdx) => (
                                    <div 
                                      key={imgIdx}
                                      onClick={() => setColorImageMap(prev => prev[color] === img.url ? (({ [color]: _, ...rest }) => rest)(prev) : { ...prev, [color]: img.url })}
                                      style={{ 
                                        width: '36px', height: '36px', flexShrink: 0, borderRadius: '4px', cursor: 'pointer', overflow: 'hidden', 
                                        border: colorImageMap[color] === img.url ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0',
                                        opacity: colorImageMap[color] === img.url ? 1 : 0.5,
                                        transition: 'all 0.2s'
                                      }}
                                    >
                                      {(img.type && img.type.startsWith('video/')) || (img.url && img.url.match(/\.(mp4|webm|ogg)$/i)) ? (
                                         <video src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      ) : (
                                         <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {attr.name === 'Body Size' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Array.from({ length: 56 - 28 + 1 }, (_, i) => String(i + 28)).filter(_opt => !(attr.options && attr.options.split(',').map(o => o.trim()).includes(_opt))).map(size => (
                        <span 
                          key={size}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(size)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, size].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {size}
                        </span>
                      ))}
                    </div>
                  )}
                  {attr.name === 'Size' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'].filter(_opt => !(attr.options && attr.options.split(',').map(o => o.trim()).includes(_opt))).map(size => (
                        <span 
                          key={size}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(size)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, size].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {size}
                        </span>
                      ))}
                    </div>
                  )}
                  {attr.name === 'Material' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Cotton', 'Polyester', 'Leather', 'Wood', 'Metal', 'Plastic', 'Glass', 'Ceramic'].filter(_opt => !(attr.options && attr.options.split(',').map(o => o.trim()).includes(_opt))).map(mat => (
                        <span 
                          key={mat}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(mat)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, mat].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {mat}
                        </span>
                      ))}
                    </div>
                  )}
                  {attr.name === 'Style' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Modern', 'Classic', 'Vintage', 'Minimalist', 'Casual', 'Formal', 'Sport'].map(style => (
                        <span 
                          key={style}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(style)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, style].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {style}
                        </span>
                      ))}
                    </div>
                  )}
                  {attr.name === 'Capacity' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '100ml', '250ml', '500ml', '1L'].map(cap => (
                        <span 
                          key={cap}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(cap)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, cap].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {cap}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {attr.name === 'Volume' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '150px', overflowY: 'auto', padding: '4px' }}>
                      {Array.from({ length: 100 }, (_, i) => String((i + 1) * 10) + 'ml')
                        .filter(_opt => !(attr.options && attr.options.split(',').map(o => o.trim()).includes(_opt)))
                        .map(vol => (
                        <span 
                          key={vol}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(vol)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, vol].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {vol}
                        </span>
                      ))}
                    </div>
                  )}

                  {attr.name === 'Model' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Base', 'Pro', 'Max', 'Ultra', 'Plus', 'Mini', 'Lite'].map(mod => (
                        <span 
                          key={mod}
                          onClick={() => {
                            const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!currentOpts.includes(mod)) {
                              handleAttributeChange(idx, 'options', [...currentOpts, mod].join(', '));
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          + {mod}
                        </span>
                      ))}
                    </div>
                  )}
                
                </div>
              </div>
            ))}
            
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                type="button" 
                className="btn-outline" 
                onClick={() => setShowVariantMenu(!showVariantMenu)} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: formData.attributes && formData.attributes.length > 0 ? '8px' : '0' }}
              >
                <Plus size={16} /> Add Variants / Attributes
              </button>
              
              {showVariantMenu && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '200px', overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>SELECT VARIANT</div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '4px' }}>
                    {['Color', 'Size', 'Body Size', 'Material', 'Style', 'Capacity', 'Model', 'Volume'].map(v => {
                      const isUsed = formData.attributes && formData.attributes.some(a => a.name === v);
                      return (
                        <div 
                          key={v}
                          onClick={() => {
                            if (!isUsed) {
                              setFormData(prev => ({ ...prev, attributes: sortAttributes([...(prev.attributes || []), { name: v, options: '' }]) }));
                              setShowVariantMenu(false);
                            }
                          }}
                          style={{ padding: '8px 12px', fontSize: '13px', color: isUsed ? '#cbd5e1' : '#334155', cursor: isUsed ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}
                          onMouseOver={(e) => { if(!isUsed) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--brand-pink)'; } }}
                          onMouseOut={(e) => { if(!isUsed) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; } }}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isUsed ? '#cbd5e1' : 'var(--brand-pink)' }}></div>
                          {v}
                        </div>
                      );
                    })}
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                    <div 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, attributes: [...(prev.attributes || []), { name: '', options: '' }] }));
                        setShowVariantMenu(false);
                      }}
                      style={{ padding: '8px 12px', fontSize: '13px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--brand-pink)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #94a3b8' }}></div>
                      Custom Variant...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '13px', color: '#475569' }}>Description</label>
                <button 
                  type="button"
                  onClick={handleAutoFill}
                  disabled={isGenerating}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff0f6', border: '1px solid #fbcfe8', color: 'var(--brand-pink)', fontWeight: 600, fontSize: '12px', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--brand-pink)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#fff0f6'; e.currentTarget.style.color = 'var(--brand-pink)'; }}
                >
                  <Sparkles size={14} /> {isGenerating ? 'Generating...' : 'Generate AI Text'}
                </button>
              </div>
              
              <RichTextEditor 
                value={formData.description} 
                onChange={(val) => setFormData(prev => ({ ...prev, description: val }))} 
                placeholder="Describe your product here..." 
              />
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '32px -24px 24px -24px' }} />

            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Additional Information</h4>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>Share return policies, care instructions, or specifications.</p>
              
              {(formData.infoSections || []).map((section, idx) => (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#f8fafc', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '60%', fontWeight: 600, margin: 0, padding: '10px 14px', borderRadius: '6px', backgroundColor: '#fff' }} 
                      placeholder="e.g. Return Policy" 
                      value={section.title} 
                      onChange={(e) => handleInfoSectionChange(idx, 'title', e.target.value)} 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveInfoSection(idx)} 
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '4px', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    style={{ margin: 0, padding: '12px 14px', borderRadius: '6px', backgroundColor: '#fff', fontSize: '13px' }}
                    placeholder="Enter the details here..." 
                    value={section.content} 
                    onChange={(e) => handleInfoSectionChange(idx, 'content', e.target.value)}
                  ></textarea>
                </div>
              ))}

              <button 
                type="button"
                onClick={handleAddInfoSection}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--brand-pink)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 0', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                <Plus size={16} strokeWidth={3} /> Add Information Block
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{productType === 'factory' ? 'Wholesale Pricing' : 'Retail Pricing'}</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">{productType === 'factory' ? 'Wholesale Price (৳)' : 'Retail Price (৳)'}</label>
                <input type="number" name="regularPrice" className="form-input" placeholder="0.00" value={formData.regularPrice || ''} onChange={handlePricingChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Discount</label>
                <div style={{ display: 'flex' }}>
                  <input type="number" name="discountValue" className="form-input" style={{ flex: 2, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', margin: 0 }} placeholder="0" value={formData.discountValue || ''} onChange={handlePricingChange} />
                  <select name="discountType" className="form-input" style={{ flex: 1, padding: '8px 12px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, margin: 0 }} value={formData.discountType || 'flat'} onChange={handlePricingChange}>
                    <option value="flat">Flat (৳)</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Discount Price (৳)</label>
                <input type="number" name="salePrice" className="form-input" placeholder="0.00" value={formData.salePrice || ''} onChange={handlePricingChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Cost of Goods (৳)</label>
                <input type="number" name="costPrice" className="form-input" placeholder="0.00" value={formData.costPrice || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Profit (৳)</label>
                {(() => {
                  const sellingPrice = parseFloat(formData.salePrice) || parseFloat(formData.regularPrice) || 0;
                  const cost = parseFloat(formData.costPrice) || 0;
                  const minQty = parseInt(formData.minQuantity) || 1;
                  const profitNum = sellingPrice > 0 && cost > 0 ? (sellingPrice - cost) * minQty : 0;
                  const hasValue = sellingPrice > 0 && cost > 0;
                  const isPositive = profitNum >= 0;
                  return (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', height: '42px', padding: '0 14px', 
                      backgroundColor: hasValue ? (isPositive ? '#ecfdf5' : '#fef2f2') : '#f8fafc', 
                      border: `1px solid ${hasValue ? (isPositive ? '#a7f3d0' : '#fecaca') : '#e2e8f0'}`, 
                      borderRadius: '6px', 
                      color: hasValue ? (isPositive ? '#059669' : '#e11d48') : '#94a3b8',
                      fontWeight: hasValue ? 600 : 400,
                      fontSize: '14px'
                    }}>
                      {hasValue ? `${isPositive ? '+' : ''}${profitNum.toFixed(2)}` : 'Auto-calculated'}
                    </div>
                  );
                })()}
              </div>
              <div className="form-group">
                <label className="form-label">Margin (%)</label>
                {(() => {
                  const sellingPrice = parseFloat(formData.salePrice) || parseFloat(formData.regularPrice) || 0;
                  const cost = parseFloat(formData.costPrice) || 0;
                  const profitNum = sellingPrice > 0 && cost > 0 ? (sellingPrice - cost) : 0;
                  const margin = sellingPrice > 0 && cost > 0 ? ((profitNum / sellingPrice) * 100).toFixed(1) : '';
                  const hasValue = sellingPrice > 0 && cost > 0;
                  const isPositive = profitNum >= 0;
                  return (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', height: '42px', padding: '0 14px', 
                      backgroundColor: hasValue ? (isPositive ? '#ecfdf5' : '#fef2f2') : '#f8fafc', 
                      border: `1px solid ${hasValue ? (isPositive ? '#a7f3d0' : '#fecaca') : '#e2e8f0'}`, 
                      borderRadius: '6px', 
                      color: hasValue ? (isPositive ? '#059669' : '#e11d48') : '#94a3b8',
                      fontWeight: hasValue ? 600 : 400,
                      fontSize: '14px'
                    }}>
                      {hasValue ? `${isPositive ? '+' : ''}${margin}%` : 'Auto-calculated'}
                    </div>
                  );
                })()}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Measurement / Weight</label>
                <div style={{ display: 'flex' }}>
                  <input type="number" name="weight" className="form-input" placeholder="0.80" value={formData.weight || ''} onChange={handleChange} style={{ flex: 2, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', margin: 0 }} />
                  <select name="measurementUnit" className="form-input" style={{ flex: 1, padding: '8px 12px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, margin: 0 }} value={formData.measurementUnit || 'kg'} onChange={handleChange}>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="inch">inch</option>
                    <option value="yard">yard</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Quantity</label>
                <input type="number" name="minQuantity" className="form-input" placeholder="1" min="1" value={formData.minQuantity || '1'} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="form-section" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Inventory</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">SKU (Stock Keeping Unit) *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    name="sku" 
                    className="form-input" 
                    placeholder="e.g. TS-BLK-M" 
                    value={formData.sku || ''} 
                    onChange={handleChange} 
                    style={{ paddingRight: '110px', width: '100%', margin: 0 }} 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const prefix = formData.category 
                        ? (Array.isArray(formData.category) ? formData.category[0] : formData.category).substring(0, 3).toUpperCase() 
                        : (formData.name ? formData.name.substring(0, 3).toUpperCase() : 'PRD');
                      const randomNum = Math.floor(10000 + Math.random() * 90000);
                      setFormData(prev => ({ ...prev, sku: `${prefix}-${randomNum}` }));
                    }}
                    style={{ position: 'absolute', right: '6px', backgroundColor: '#fff0f6', border: 'none', color: '#901254', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '4px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fce7f3'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff0f6'}
                  >
                    <Sparkles size={13} /> Auto Generate
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" name="stock" className="form-input" placeholder="0" value={formData.stock || ''} onChange={handleChange} />
              </div>
            </div>
          </div>


        </div>

        {/* Right Column - Organization & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Categories */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Categories</h3>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              {Object.keys(categories).map(cat => {
                const subcats = [...(categories[cat] || [])];
                const currentCats = Array.isArray(formData.category) ? formData.category : (formData.category ? formData.category.split(', ') : []);
                const currentSubcats = Array.isArray(formData.subcategory) ? formData.subcategory : (formData.subcategory ? formData.subcategory.split(', ') : []);
                const isCatChecked = currentCats.includes(cat);
                const selectedSubcatsCount = subcats.filter(sub => currentSubcats.includes(sub)).length;
                
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155', fontWeight: 500, userSelect: 'none' }}>
                          <input 
                            type="checkbox" 
                            checked={isCatChecked}
                            onChange={(e) => {
                              const newCats = e.target.checked 
                                ? [...currentCats, cat] 
                                : currentCats.filter(c => c !== cat);
                              setFormData(prev => ({ ...prev, category: newCats }));
                            }}
                            className="custom-checkbox"
                          />
                          {allCategories.find(c => c.name === cat)?.icon && (
                            <i className={allCategories.find(c => c.name === cat).icon} style={{ fontSize: '18px', color: 'var(--brand-pink)' }}></i>
                          )}
                          {cat}
                          {selectedSubcatsCount > 0 && (
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>({selectedSubcatsCount})</span>
                          )}
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {subcats.length > 0 && (
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] })); }}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}
                          >
                            {expandedCats[cat] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Subcategories (Indented & Collapsible) */}
                    {expandedCats[cat] && (
                    <div style={{ paddingLeft: '34px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {subcats.length > 0 && subcats.map(sub => {
                        const isSubChecked = currentSubcats.includes(sub);
                        return (
                          <div key={sub} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#64748b', cursor: 'pointer', fontWeight: 400 }}>
                              <input 
                                type="checkbox" 
                                checked={isSubChecked}
                                onChange={(e) => {
                                  const newSubcats = e.target.checked 
                                    ? [...currentSubcats, sub]
                                    : currentSubcats.filter(s => s !== sub);
                                  
                                  let newCats = [...currentCats];
                                  if (e.target.checked && !newCats.includes(cat)) {
                                    newCats.push(cat);
                                  }

                                  setFormData(prev => ({ 
                                    ...prev, 
                                    subcategory: newSubcats,
                                    category: newCats
                                  }));
                                }}
                                className="custom-checkbox"
                              />
                              {sub}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Sticky Create Button */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                type="button" 
                onClick={() => {
                  navigate('/admin/categories');
                }}
                style={{ color: 'var(--brand-pink)', background: 'none', border: 'none', padding: 0, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }} 
                onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} 
                onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
              >
                + Create Category
              </button>
            </div>
          </div>
          
          {/* Special Placements */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Special Placements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Flash Sale', icon: 'las la-bolt' },
                { name: 'Combo Offers', icon: 'las la-box' },
                { name: 'Ourgoods Choice', icon: 'las la-star' },
                { name: 'Cash Deals', icon: 'las la-money-bill-wave' },
                { name: '9 Tk Deals', icon: 'las la-tags' },
                { name: '0.99 Store', icon: 'las la-store' }
              ].map(placement => {
                const currentPlacements = Array.isArray(formData.placements) ? formData.placements : (formData.placements ? formData.placements.split(', ') : []);
                const isChecked = currentPlacements.includes(placement.name);
                return (
                  <label key={placement.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newPlacements = e.target.checked
                          ? [...currentPlacements, placement.name]
                          : currentPlacements.filter(p => p !== placement.name);
                        setFormData(prev => ({ ...prev, placements: newPlacements }));
                      }}
                      className="custom-checkbox"
                    />
                    <i className={placement.icon} style={{ fontSize: '18px', color: 'var(--brand-pink)' }}></i>
                    {placement.name}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Organization */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Organization</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input type="text" name="brand" className="form-input" placeholder="Brand name" value={formData.brand} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Vendor Location</label>
                <input type="text" name="vendorLocation" className="form-input" placeholder="e.g. Dhaka, Bangladesh" value={formData.vendorLocation || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Vendor / Seller</label>
                <select className="form-input" name="vendor" value={formData.vendor} onChange={handleChange}>
                  <option value="OURGOODS Direct">OURGOODS Direct</option>
                  <option value="Vendor A">Vendor A</option>
                  <option value="Vendor B">Vendor B</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input type="text" name="tags" className="form-input" placeholder="e.g. summer, trendy, sale" value={formData.tags} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Shipping & Policies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Estimated Delivery Time</label>
                <input type="text" name="deliveryTime" className="form-input" placeholder="e.g. 2-4 Days" value={formData.deliveryTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Return Policy</label>
                <select className="form-input" name="returnPolicy" value={formData.returnPolicy} onChange={handleChange}>
                  <option value="7 Days Easy Return">7 Days Easy Return</option>
                  <option value="No Return Policy">No Return Policy</option>
                  <option value="Replacement Only">Replacement Only</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <label className="form-label" style={{ marginBottom: '12px' }}>Display Settings</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Delivery Estimates</label>
                    
                    {!formData.isCreatingCustomDelivery ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select 
                          className="form-input" 
                          style={{ maxWidth: '400px' }}
                          value={formData.deliveryBannerType || '24-48h'}
                          onChange={(e) => setFormData(prev => ({...prev, deliveryBannerType: e.target.value}))}
                        >
                          <option value="24-48h">24-48h (Show vendor location)</option>
                          <option value="global">21-28 day (Standard) & 4-7 days (Express)</option>
                          <option value="1-5days">1-5 days in Bangladesh & 1-2 days in Dhaka</option>
                          {formData.deliveryBannerType && formData.deliveryBannerType.startsWith('custom:') && (
                            <option value={formData.deliveryBannerType}>
                              {formData.deliveryBannerType.replace('custom:', '')}
                            </option>
                          )}
                          <option value="none">Don't show delivery estimates</option>
                        </select>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, isCreatingCustomDelivery: true, customDeliveryText: ''}))}
                          style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#334155', fontWeight: 500 }}
                        >
                          + Custom Create
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g., 7-14 Days Express"
                          style={{ maxWidth: '400px' }}
                          value={formData.customDeliveryText || ''}
                          onChange={(e) => setFormData(prev => ({...prev, customDeliveryText: e.target.value}))}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if(formData.customDeliveryText) {
                              setFormData(prev => ({
                                ...prev, 
                                deliveryBannerType: 'custom:' + prev.customDeliveryText,
                                isCreatingCustomDelivery: false
                              }));
                            }
                          }}
                          style={{ padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#fff', fontWeight: 500 }}
                        >
                          Save Option
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, isCreatingCustomDelivery: false}))}
                          style={{ padding: '8px 12px', background: 'transparent', border: 'none', fontSize: '13px', cursor: 'pointer', color: '#64748b', fontWeight: 500 }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '12px' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.showSameDayDelivery === true}
                      onChange={(e) => setFormData(prev => ({...prev, showSameDayDelivery: e.target.checked}))}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E43292' }}
                    />
                    <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>Available for Same Day Delivery (before 12pm)</span>
                  </label>
                  
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <label style={{ fontSize: '13px', color: '#475569', fontWeight: 600, paddingBottom: '8px', display: 'block' }}>Payment Policy</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="paymentOption" value="cod" checked={(formData.paymentOption || 'cod') === 'cod'} onChange={(e) => setFormData(prev => ({...prev, paymentOption: e.target.value}))} style={{ accentColor: '#E43292' }} />
                        <span style={{ fontSize: '14px', color: '#334155' }}>Cash on Delivery</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="paymentOption" value="full_advance" checked={formData.paymentOption === 'full_advance'} onChange={(e) => setFormData(prev => ({...prev, paymentOption: e.target.value}))} style={{ accentColor: '#E43292' }} />
                        <span style={{ fontSize: '14px', color: '#334155' }}>Full advance customer will pay</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="paymentOption" value="partial_advance" checked={formData.paymentOption === 'partial_advance'} onChange={(e) => setFormData(prev => ({...prev, paymentOption: e.target.value}))} style={{ accentColor: '#E43292' }} />
                        <span style={{ fontSize: '14px', color: '#334155' }}>60% advance customer will pay & 40% cash on delivery</span>
                      </label>
                    </div>
                  </div>
                  

                </div>
              </div>
            </div>
          </div>

          {/* SEO & Publishing */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>SEO & Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Product Status</label>
                <select className="form-input" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">SEO Title</label>
                <input type="text" name="seoTitle" className="form-input" placeholder="Meta Title" value={formData.seoTitle} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">SEO Description</label>
                <textarea name="seoDescription" className="form-input" rows="3" placeholder="Meta Description" value={formData.seoDescription} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;
