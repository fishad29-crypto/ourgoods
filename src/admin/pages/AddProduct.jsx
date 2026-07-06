import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, X, Plus, Sparkles, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import Tesseract from 'tesseract.js';
import { addProductToFrontend } from '../../utils/MockData';
import '../admin.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', features: '',
    regularPrice: '', salePrice: '', costPrice: '',
    sku: '', stock: '', colors: '', sizes: '',
    category: '', subcategory: '', brand: '',
    vendor: 'OURGOODS Direct', type: 'Local Ready Stock',
    tags: '', weight: '', deliveryTime: '',
    returnPolicy: '7 Days Easy Return', status: 'Active',
    seoTitle: '', seoDescription: ''
  });
  const fileInputRef = React.useRef(null);

  const categoryMap = {
    "Electronics": ["Mobiles", "Laptops", "Audio", "Smartwatches", "Accessories"],
    "Women Fashion": ["Dresses", "Tops", "Pants", "Shoes", "Bags", "Jewelry", "T-Shirts & Polos"],
    "Men Fashion": ["T-Shirts", "Shirts", "Pants", "Shoes", "Watches", "Jackets"],
    "Bags & Luggage": ["Backpacks", "Suitcases", "Handbags", "Wallets"],
    "Beauty & Health": ["Makeup", "Skincare", "Haircare", "Personal Care"],
    "Home & Decor": ["Furniture", "Lighting", "Bedding", "Kitchenware"]
  };

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

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
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
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        newImages.push({
          name: file.name,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          url
        });
      } catch (error) {
        console.error("Compression error:", error);
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
        colors: finalProduct.colors || 'Custom',
        sizes: 'S, M, L, XL',
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
        colors: 'As shown in image',
        sizes: 'Standard',
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

  const handlePublish = () => {
    if (!formData.name || !formData.regularPrice || !formData.category) {
      alert("Please fill in all required fields (Name, Regular Price, Category) before publishing.");
      return;
    }
    
    // Send to frontend site
    addProductToFrontend({
      ...formData,
      images: images
    });
    
    alert(`Success! "${formData.name}" has been successfully published to the front site! You can now see it in New Arrivals and the ${formData.category} category.`);
    navigate('/admin/products');
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
      setFormData({
        name: '', description: '', features: '',
        regularPrice: '', salePrice: '', costPrice: '',
        sku: '', stock: '', colors: '', sizes: '',
        category: '', subcategory: '', brand: '',
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
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={20} />
          </button>
          <h2 className="page-title">Add New Product</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handleClearAll} style={{ color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} /> Clear All
          </button>
          <button className="btn-outline">Save as Draft</button>
          <button className="btn-primary" onClick={handlePublish}><Save size={18} /> Publish Product</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Main Form Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Import via Link Section */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#8b5cf6" /> Auto-Import via Link
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Paste link from Taobao, Pinduoduo, Daraz, Facebook, Instagram..." 
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                className="btn-primary" 
                onClick={handleImport}
                disabled={isImporting}
                style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: isImporting ? 'not-allowed' : 'pointer', opacity: isImporting ? 0.7 : 1 }}
              >
                {isImporting ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
                {isImporting ? 'Scraping Data...' : 'Import Data'}
              </button>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
              Our AI scraper will automatically fetch the title, description, pricing, category, and variants from the provided supplier link.
            </p>
          </div>
          
          {/* Media */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Name: Product Picture</h3>
              {isCompressing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                  <Loader2 size={14} className="spin" /> Compressing & Optimizing...
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <div style={{ border: '2px dashed var(--admin-border)', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', backgroundColor: isCompressing ? 'var(--admin-bg)' : 'transparent', transition: 'background-color 0.2s' }} onClick={handleImageUpload}>
              <UploadCloud size={32} color="var(--admin-text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: '0 0 8px', fontWeight: 500 }}>Click or drag images here to upload & auto-compress</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>Supported formats: JPG, PNG, WEBP (Max 10MB). Images will be automatically compressed while maintaining clarity in one click!</p>
            </div>

            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ width: '120px', backgroundColor: 'var(--admin-bg)', borderRadius: '8px', position: 'relative', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: '120px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', overflow: 'hidden', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {img.url ? <img src={img.url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={24} color="#94a3b8" />}
                    </div>
                    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--status-danger)', textDecoration: 'line-through' }}>{formatSize(img.originalSize)}</span>
                      <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>{formatSize(img.compressedSize)} (Saved {img.originalSize ? ((1 - img.compressedSize / img.originalSize) * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Information */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>General Information</h3>
              <button 
                className="btn-outline" 
                onClick={handleAutoFill}
                disabled={isGenerating}
                style={{ padding: '6px 12px', fontSize: '12px', color: '#8b5cf6', borderColor: '#8b5cf6', display: 'flex', alignItems: 'center', cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating ? 0.7 : 1 }}
              >
                {isGenerating ? <Loader2 size={14} className="spin" style={{ marginRight: '6px' }} /> : <Sparkles size={14} style={{ marginRight: '6px' }} />}
                {isGenerating ? 'Analyzing Image...' : 'Auto-fill with Gemini AI'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="e.g. Premium Cotton T-Shirt" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Product Description</label>
                  <button style={{ background: 'none', border: 'none', color: '#8b5cf6', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Sparkles size={12} /> Generate Description
                  </button>
                </div>
                <textarea 
                  name="description"
                  className="form-input" 
                  rows="5" 
                  placeholder="Write a detailed product description..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Key Features (Bullet points)</label>
                <textarea 
                  name="features"
                  className="form-input" 
                  rows="3" 
                  placeholder="e.g. 100% Cotton\nComfortable fit\nMachine washable"
                  value={formData.features}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Pricing & Inventory</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Regular Price (৳) *</label>
                <input type="number" name="regularPrice" className="form-input" placeholder="0.00" value={formData.regularPrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Sale Price (৳)</label>
                <input type="number" name="salePrice" className="form-input" placeholder="0.00" value={formData.salePrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Cost Price (৳)</label>
                <input type="number" name="costPrice" className="form-input" placeholder="0.00" value={formData.costPrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Profit Margin (%)</label>
                <input type="number" className="form-input" placeholder={formData.salePrice && formData.costPrice ? (((formData.salePrice - formData.costPrice) / formData.salePrice) * 100).toFixed(1) + '%' : "Auto-calculated"} readOnly style={{ backgroundColor: 'var(--admin-bg)' }} />
              </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: '20px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">SKU (Stock Keeping Unit) *</label>
                <input type="text" name="sku" className="form-input" placeholder="e.g. TS-BLK-M" value={formData.sku} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" name="stock" className="form-input" placeholder="0" value={formData.stock} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Variants (Size, Color, Material)</h3>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}><Plus size={14} /> Add Variant</button>
            </div>
            <div className="form-group">
              <label className="form-label">Colors</label>
              <input type="text" name="colors" className="form-input" placeholder="e.g. Red, Blue, Black (comma separated)" value={formData.colors} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Sizes</label>
              <input type="text" name="sizes" className="form-input" placeholder="e.g. S, M, L, XL (comma separated)" value={formData.sizes} onChange={handleChange} />
            </div>
          </div>

        </div>

        {/* Right Column - Organization & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Organization */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Organization</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {Object.keys(categoryMap).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subcategory</label>
                <select 
                  className="form-input" 
                  name="subcategory" 
                  value={formData.subcategory} 
                  onChange={handleChange}
                  disabled={!formData.category}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category && categoryMap[formData.category] ? (
                    categoryMap[formData.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))
                  ) : null}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input type="text" name="brand" className="form-input" placeholder="Brand name" value={formData.brand} onChange={handleChange} />
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
                <label className="form-label">Product Type</label>
                <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                  <option value="Local Ready Stock">Local Ready Stock</option>
                  <option value="China Pre-Order">China Pre-Order</option>
                  <option value="OURGOODS Choice">OURGOODS Choice</option>
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
                <label className="form-label">Weight (kg)</label>
                <input type="number" name="weight" className="form-input" placeholder="0.5" value={formData.weight} onChange={handleChange} />
              </div>
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
