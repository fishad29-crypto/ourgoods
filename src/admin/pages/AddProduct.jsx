import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, X, Plus, Sparkles, Image as ImageIcon, Loader2, Trash2, Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, Info, Star, ChevronDown, ChevronRight, Globe, Factory, Home, PlayCircle, Check, Edit, Book, ChevronUp, Settings2, Bookmark, Search } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import Tesseract from 'tesseract.js';
import MediaManagerModal from '../../components/MediaManagerModal';
import RichTextEditor from '../components/RichTextEditor';
import { addProductToFrontend, getProductById, useCategories, getAllProducts, useVendors } from '../../utils/MockData';
import '../admin.css';


const getBadgeColor = (colorName) => {
  if (!colorName) return '#e2e8f0';
  if (colorName.includes('|')) return colorName.split('|')[1].trim();
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

const getPaymentStyle = (opt, label) => {
  const palettes = [
    { bg: '#e8f5e9', color: '#4caf50', icon: 'las la-money-bill-wave' },
    { bg: '#e3f2fd', color: '#2196f3', icon: 'las la-credit-card' },
    { bg: '#fff3e0', color: '#ff9800', icon: 'las la-wallet' },
    { bg: '#f3e5f5', color: '#9c27b0', icon: 'las la-gift' },
    { bg: '#e0f2f1', color: '#009688', icon: 'las la-money-check' },
    { bg: '#ffebee', color: '#f44336', icon: 'las la-receipt' },
    { bg: '#fff8e1', color: '#ffc107', icon: 'las la-coins' },
    { bg: '#ede7f6', color: '#673ab7', icon: 'las la-tags' }
  ];
  let hash = 0;
  for (let i = 0; i < opt.length; i++) hash = opt.charCodeAt(i) + ((hash << 5) - hash);
  const fallbackPalette = palettes[Math.abs(hash) % palettes.length];

  const labelLower = (label || '').toLowerCase();
  if (opt === 'cod' || labelLower.includes('cash on delivery')) {
    return { bg: '#e8f5e9', color: '#4caf50', icon: 'las la-money-bill-wave' };
  } else if (opt === 'pay_now' || opt === 'full_advance' || labelLower.includes('pay now') || labelLower.includes('full advance')) {
    return { bg: '#e3f2fd', color: '#2196f3', icon: 'las la-credit-card' };
  } else if (opt === 'partial_advance' || labelLower.includes('partial advance')) {
    return { bg: '#fff3e0', color: '#ff9800', icon: 'las la-wallet' };
  } else {
    return fallbackPalette;
  }
};

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendorsList = useVendors();
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem('addProductImages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(img => {
            if (typeof img === 'string' && img.startsWith('blob:')) return null;
            if (img && typeof img === 'object' && img.url && img.url.startsWith('blob:')) return null;
            return img;
          }).filter(Boolean);
        }
      }
      return [];
    } catch { return []; }
  });
  const [isCompressing, setIsCompressing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVariantMenu, setShowVariantMenu] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [draggedImgIdx, setDraggedImgIdx] = useState(null);
  const [removingIdx, setRemovingIdx] = useState(null);
  const [ribbons, setRibbons] = useState(() => {
    try {
      const saved = localStorage.getItem('customRibbons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { value: '', label: 'None' },
      { value: 'Best Seller', label: 'Best Seller' },
      { value: 'Exclusive', label: 'Exclusive' },
      { value: 'Featured', label: 'Featured' },
      { value: 'Limited Time', label: 'Limited Time' },
      { value: 'New Arrival', label: 'New Arrival' },
      { value: 'Sale', label: 'Sale' },
      { value: 'Trending', label: 'Trending' }
    ];
  });
  const [showRibbonMenu, setShowRibbonMenu] = useState(false);
  const [newRibbonText, setNewRibbonText] = useState('');
  const [editingRibbon, setEditingRibbon] = useState(null);
  
  const saveRibbons = (newRibbons) => {
    setRibbons(newRibbons);
    try {
      localStorage.setItem('customRibbons', JSON.stringify(newRibbons));
    } catch (e) {
      console.warn('Could not save custom ribbons to localStorage', e);
    }
  };

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
  const [activeColorMapping, setActiveColorMapping] = useState(null);
  const { categories: allCategories, subcategories: subcats } = useCategories();
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('addProductData');
      if (saved) {
        const parsed = JSON.parse(saved);
        const editId = new URLSearchParams(window.location.search).get('edit');
        if (editId) {
          // If editing, ONLY use draft if it's for the SAME product. Otherwise, return fresh state so useEffect can load it.
          if (parsed.id === editId) {
            return parsed;
          }
        } else {
          // If not editing, it's a new product draft
          delete parsed.id;
          parsed.category = [];
          parsed.subcategory = [];
          return parsed;
        }
      }
    } catch {}
    return {
      name: '', ribbon: '', description: '', features: '',
      infoSections: [],
      regularPrice: '', salePrice: '', costPrice: '',
      sku: '', stock: '', attributes: [{ name: 'Color', options: '' }, { name: 'Size', options: '' }],
      category: [], subcategory: [], brand: '', placements: [],
      vendor: 'OURGOODS', type: 'Local Ready Stock',
      tags: '', weight: '', deliveryTime: '',
      returnPolicy: '7 Days Easy Return', status: 'Active',
      seoTitle: '', seoDescription: '',
      deliveryBannerType: '24-48h',
      paymentOption: 'cod',
      freeShipping: false,
      volumeTiers: [{ min: '', max: '', price: '' }, { min: '', max: '', price: '' }, { min: '', max: '', price: '' }],
      comboTiers: [{ minQty: '', discountType: 'percentage', discountValue: '' }],
      variations: []
    };
  });
  const [productType, setProductType] = useState('retail');
  const [sameDayDeliveryLabel, setSameDayDeliveryLabel] = useState(() => localStorage.getItem('sameDayDeliveryLabel') || 'Available for Same Day Delivery (before 12pm)');
  const [isEditingSameDay, setIsEditingSameDay] = useState(false);
  const [tempSameDayLabel, setTempSameDayLabel] = useState(sameDayDeliveryLabel);
  const [variantFilters, setVariantFilters] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  

  const [showShippingPresetsModal, setShowShippingPresetsModal] = useState(false);
  const [savedShippingPresets, setSavedShippingPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('savedShippingPresets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showComboPresetsModal, setShowComboPresetsModal] = useState(false);
  const [savedComboPresets, setSavedComboPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('savedComboPresets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showInventoryPresetsModal, setShowInventoryPresetsModal] = useState(false);
  const [savedInventoryPresets, setSavedInventoryPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('savedInventoryPresets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedCustomColors, setSavedCustomColors] = useState(() => {
    try {
      const saved = localStorage.getItem('savedCustomColors');
      let parsed = saved ? JSON.parse(saved) : [];
      
      const migratedFlag = localStorage.getItem('migratedDefaultColors');
      if (!migratedFlag) {
         const defaults = ['Red|#EF4444', 'Blue|#3B82F6', 'Green|#22C55E', 'Black|#000000', 'White|#FFFFFF', 'Yellow|#EAB308', 'Pink|#EC4899', 'Purple|#A855F7', 'Orange|#F97316', 'Grey|#64748B', 'Navy|#1E3A8A', 'Brown|#78350F'];
         defaults.forEach(d => {
             const dName = d.split('|')[0].toLowerCase();
             if (!parsed.some(p => (p.includes('|') ? p.split('|')[0] : p).toLowerCase() === dName)) {
                 parsed.push(d);
             }
         });
         try {
           localStorage.setItem('savedCustomColors', JSON.stringify(parsed));
           localStorage.setItem('migratedDefaultColors', 'true');
         } catch(e) {}
      }
      return parsed;
    } catch {
      return [];
    }
  });
  const [showColorLibraryModal, setShowColorLibraryModal] = useState(false);
  const [colorLibraryIndex, setColorLibraryIndex] = useState(null);
  const [colorSearchQuery, setColorSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const [savedBrands, setSavedBrands] = useState(() => {
    try {
      const saved = localStorage.getItem('savedBrands');
      return saved ? JSON.parse(saved) : ['OURGOODS', 'Nike', 'Adidas', 'Zara', 'Gucci'];
    } catch {
      return ['OURGOODS', 'Nike', 'Adidas', 'Zara', 'Gucci'];
    }
  });

  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('savedLocations');
      return saved ? JSON.parse(saved) : ['Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Global Warehouse'];
    } catch {
      return ['Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Global Warehouse'];
    }
  });

  const [presetTags] = useState(['Summer', 'Trendy', 'New Arrival', 'Sale', 'Bestseller', 'Limited Edition', 'Premium']);
  
  const [orgPresets, setOrgPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('orgPresets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showSaveOrgPresetModal, setShowSaveOrgPresetModal] = useState(false);
  const [newOrgPresetName, setNewOrgPresetName] = useState('');
  const [showManageOrgPresetsModal, setShowManageOrgPresetsModal] = useState(false);

  // Variant Presets
  const [variantPresets, setVariantPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('variantPresets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showManageVariantPresetsModal, setShowManageVariantPresetsModal] = useState(false);

  const saveVariantPreset = () => {
    if (!formData.attributes || formData.attributes.length === 0) {
      alert('Please add at least one attribute before saving a preset.'); return;
    }
    const name = window.prompt('Enter a name for this Variant Preset:', 'My Variant Setup');
    if (name && name.trim()) {
      const newPreset = { id: Date.now().toString(), name: name.trim(), attributes: formData.attributes };
      const updated = [...variantPresets, newPreset];
      setVariantPresets(updated);
      localStorage.setItem('variantPresets', JSON.stringify(updated));
    }
  };

  const applyVariantPreset = (preset) => {
    setFormData(prev => ({ ...prev, attributes: preset.attributes }));
  };

  // Description Presets
  const [descPresets, setDescPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('descPresets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showManageDescPresetsModal, setShowManageDescPresetsModal] = useState(false);

  const saveDescPreset = () => {
    if (!formData.description || formData.description.trim() === '' || formData.description === '<p><br></p>') {
      alert('Please write a description before saving a preset.'); return;
    }
    const name = window.prompt('Enter a name for this Description Preset:', 'My Description Template');
    if (name && name.trim()) {
      const newPreset = { id: Date.now().toString(), name: name.trim(), description: formData.description };
      const updated = [...descPresets, newPreset];
      setDescPresets(updated);
      localStorage.setItem('descPresets', JSON.stringify(updated));
    }
  };

  const applyDescPreset = (preset) => {
    setFormData(prev => ({ ...prev, description: preset.description }));
  };

  const clearOrgData = () => {
    if(window.confirm('Clear all Organization fields?')) {
      setFormData(prev => ({ ...prev, brand: '', vendorLocation: '', vendor: '', tags: '' }));
    }
  };

  // Placement Presets
  const ALL_PLACEMENTS = ['Flash Sale','Daily Discover','Bangladesh Market','International Market','Ourgoods Direct','Ourgoods Stock','Global Shop','Factory Direct','New Arrival','Pre-Order','Choice','Combo Offer','Cash on Delivery','Free Shipping','24h Delivery','Top Trends','Hot Categories'];

  const [placementPresets, setPlacementPresets] = useState(() => {
    try { const s = localStorage.getItem('placementPresets'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [showManagePlacementPresetsModal, setShowManagePlacementPresetsModal] = useState(false);

  const savePlacementPreset = () => {
    const current = Array.isArray(formData.placements) ? formData.placements : (formData.placements ? formData.placements.split(', ') : []);
    if (current.length === 0) { alert('Select at least one placement before saving a preset.'); return; }
    const name = window.prompt('Preset name:', 'My Placement Set');
    if (name && name.trim()) {
      const updated = [...placementPresets, { id: Date.now().toString(), name: name.trim(), placements: current }];
      setPlacementPresets(updated);
      localStorage.setItem('placementPresets', JSON.stringify(updated));
    }
  };

  const applyPlacementPreset = (preset) => {
    setFormData(prev => ({ ...prev, placements: preset.placements }));
  };

  // Category Presets
  const [categoryPresets, setCategoryPresets] = useState(() => {
    try { const s = localStorage.getItem('categoryPresets'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [showManageCategoryPresetsModal, setShowManageCategoryPresetsModal] = useState(false);

  const saveCategoryPreset = () => {
    const currentCats = Array.isArray(formData.category) ? formData.category : (formData.category ? formData.category.split(', ') : []);
    const currentSubcats = Array.isArray(formData.subcategory) ? formData.subcategory : (formData.subcategory ? formData.subcategory.split(', ') : []);
    if (currentCats.length === 0) { alert('Select at least one category before saving a preset.'); return; }
    const name = window.prompt('Preset name:', 'My Category Set');
    if (name && name.trim()) {
      const updated = [...categoryPresets, { id: Date.now().toString(), name: name.trim(), category: currentCats, subcategory: currentSubcats }];
      setCategoryPresets(updated);
      localStorage.setItem('categoryPresets', JSON.stringify(updated));
    }
  };

  const applyCategoryPreset = (preset) => {
    setFormData(prev => ({ ...prev, category: preset.category || [], subcategory: preset.subcategory || [] }));
  };

  const handleSaveOrgPreset = (e) => {
    e.preventDefault();
    if (!newOrgPresetName.trim()) return;
    const newPreset = {
      name: newOrgPresetName.trim(),
      brand: formData.brand,
      vendorLocation: formData.vendorLocation,
      vendor: formData.vendor,
      tags: formData.tags
    };
    const updated = [...orgPresets, newPreset];
    setOrgPresets(updated);
    localStorage.setItem('orgPresets', JSON.stringify(updated));
    setShowSaveOrgPresetModal(false);
    setNewOrgPresetName('');
  };

  const applyOrgPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      brand: preset.brand || '',
      vendorLocation: preset.vendorLocation || '',
      vendor: preset.vendor || '',
      tags: preset.tags || ''
    }));
    setShowManageOrgPresetsModal(false);
  };

  const deleteOrgPreset = (idx) => {
    if(window.confirm('Delete this preset?')) {
      const updated = orgPresets.filter((_, i) => i !== idx);
      setOrgPresets(updated);
      localStorage.setItem('orgPresets', JSON.stringify(updated));
    }
  };
  
  // Policies Library States
  const [deliveryLibrary, setDeliveryLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('deliveryLibraryV4');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '24-48h', label: '24-48 Hours (Nationwide)', type: 'domestic' },
      { id: '1-5days', label: '1-3 Days (Standard)', type: 'domestic' },
      { id: 'global', label: '14-28 Days (Standard) / 4-10 Days (Express)', type: 'global' },
      { id: 'none', label: "Don't show delivery estimates", type: 'other' }
    ];
  });
  
  const [paymentLibraryLocal, setPaymentLibraryLocal] = useState(() => {
    try {
      const saved = localStorage.getItem('paymentLibraryLocalV4');
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('paymentLibraryV4');
      if (legacy) return JSON.parse(legacy).filter(p => p.id !== 'partial_advance');
    } catch {}
    return [
      { id: 'cod', label: 'Cash on Delivery' },
      { id: 'pay_now', label: 'Pay Now' }
    ];
  });

  const [paymentLibraryGlobal, setPaymentLibraryGlobal] = useState(() => {
    try {
      const saved = localStorage.getItem('paymentLibraryGlobalV4');
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('paymentLibraryV4');
      if (legacy) return JSON.parse(legacy).filter(p => p.id !== 'cod');
    } catch {}
    return [
      { id: 'pay_now', label: 'Full Payment' },
      { id: 'partial_advance', label: 'Partial Advance (60% Advance, 40% COD)' }
    ];
  });
  
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [policiesModalType, setPoliciesModalType] = useState('delivery'); // 'delivery' or 'payment'
  const [newPolicyLabel, setNewPolicyLabel] = useState('');
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [draggedPolicyId, setDraggedPolicyId] = useState(null);
  const [editPolicyLabel, setEditPolicyLabel] = useState('');

  // Generic Attribute Library States
  const [showAttrLibraryModal, setShowAttrLibraryModal] = useState(false);
  const [attrLibraryIndex, setAttrLibraryIndex] = useState(null);
  const [attrLibraryType, setAttrLibraryType] = useState('');
  const [attrSearchQuery, setAttrSearchQuery] = useState('');
  
  const [savedCustomAttributes, setSavedCustomAttributes] = useState(() => {
    const defaultAttributesData = {
      'Body Size': Array.from({ length: 54 - 28 + 1 }, (_, i) => String(i + 28)),
      'Size': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'],
      'Material': ['Cotton', 'Polyester', 'Leather', 'Wood', 'Metal', 'Plastic', 'Glass', 'Ceramic'],
      'Style': ['Modern', 'Classic', 'Vintage', 'Minimalist', 'Casual', 'Formal', 'Sport'],
      'Capacity': ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '100ml', '250ml', '500ml', '1L'],
      'Volume': Array.from({ length: 100 }, (_, i) => String((i + 1) * 10) + 'ml')
    };
    try {
      const saved = localStorage.getItem('savedCustomAttributes');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean up 'Size' library from any accidentally merged Body Size numbers (28-56)
        if (parsed['Size']) {
          parsed['Size'] = parsed['Size'].filter(opt => {
            const num = parseInt(opt);
            return isNaN(num) || num < 28 || num > 56;
          });
        }
        // Force reset 'Body Size' to strictly 28-54 as requested
        parsed['Body Size'] = Array.from({ length: 54 - 28 + 1 }, (_, i) => String(i + 28));
        try { localStorage.setItem('savedCustomAttributes', JSON.stringify(parsed)); } catch(e) {}
        return parsed;
      }
      try {
        localStorage.setItem('savedCustomAttributes', JSON.stringify(defaultAttributesData));
      } catch(e) {}
      return defaultAttributesData;
    } catch {
      return defaultAttributesData;
    }
  });

  const addSavedCustomAttribute = (type, val) => {
    setSavedCustomAttributes(prev => {
      const currentList = prev[type] || [];
      if (currentList.some(item => item.toLowerCase() === val.toLowerCase())) return prev;
      const newList = [val, ...currentList].slice(0, 100);
      const newState = { ...prev, [type]: newList };
      try {
        localStorage.setItem('savedCustomAttributes', JSON.stringify(newState));
      } catch(e) {}
      return newState;
    });
  };

  const removeSavedCustomAttribute = (type, val) => {
    setSavedCustomAttributes(prev => {
      const currentList = prev[type] || [];
      const newList = currentList.filter(item => item.toLowerCase() !== val.toLowerCase());
      const newState = { ...prev, [type]: newList };
      try {
        localStorage.setItem('savedCustomAttributes', JSON.stringify(newState));
      } catch(e) {}
      return newState;
    });
  };

  const editSavedCustomAttribute = (type, oldVal, newVal) => {
    setSavedCustomAttributes(prev => {
      const currentList = prev[type] || [];
      const newList = currentList.map(item => item.toLowerCase() === oldVal.toLowerCase() ? newVal : item);
      const newState = { ...prev, [type]: newList };
      try {
        localStorage.setItem('savedCustomAttributes', JSON.stringify(newState));
      } catch(e) {}
      return newState;
    });
  };
  
  const [recentSelectedColors, setRecentSelectedColors] = useState(() => {
    try {
      const saved = localStorage.getItem('recentSelectedColors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const recordRecentColor = (colorStr) => {
      setRecentSelectedColors(prev => {
          const name = colorStr.includes('|') ? colorStr.split('|')[0].trim().toLowerCase() : colorStr.trim().toLowerCase();
          const filtered = prev.filter(c => (c.includes('|') ? c.split('|')[0] : c).trim().toLowerCase() !== name);
          const newRecent = [colorStr, ...filtered].slice(0, 10);
          try {
            localStorage.setItem('recentSelectedColors', JSON.stringify(newRecent));
          } catch(e) {}
          return newRecent;
      });
  };

  const addSavedCustomColor = (colorStr) => {
    setSavedCustomColors(prev => {
      const name = colorStr.includes('|') ? colorStr.split('|')[0].trim().toLowerCase() : colorStr.trim().toLowerCase();
      const filtered = prev.filter(c => {
         const cName = c.includes('|') ? c.split('|')[0].trim().toLowerCase() : c.trim().toLowerCase();
         return cName !== name;
      });
      // Keep max 100 custom colors to prevent localStorage bloat
      const newColors = [colorStr, ...filtered].slice(0, 100);
      try {
        localStorage.setItem('savedCustomColors', JSON.stringify(newColors));
      } catch(e) {}
      return newColors;
    });
  };

  // Description Library States
  const [showDescLibraryModal, setShowDescLibraryModal] = useState(false);
  const [descSearchQuery, setDescSearchQuery] = useState('');
  const [editingDescId, setEditingDescId] = useState(null);
  const [editingDescTitle, setEditingDescTitle] = useState('');
  const [editingDescContent, setEditingDescContent] = useState('');
  const [savedDescriptions, setSavedDescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('savedDescriptions');
      if (saved) return JSON.parse(saved);
      // Initialize with some dummy templates
      const defaults = [
        { id: '1', title: 'Standard Electronics', content: '<div><h4>Product Overview</h4><p>Experience the ultimate performance with our latest electronics. Designed with cutting-edge technology.</p><ul><li>High Quality Build</li><li>1 Year Warranty</li></ul></div>' },
        { id: '2', title: 'Basic Fashion Apparel', content: '<div><h4>Style & Comfort</h4><p>Upgrade your wardrobe with our premium fabrics. Soft, breathable, and perfectly stitched for all-day wear.</p><ul><li>100% Premium Cotton</li><li>Machine Washable</li></ul></div>' }
      ];
      localStorage.setItem('savedDescriptions', JSON.stringify(defaults));
      return defaults;
    } catch {
      return [];
    }
  });

  const saveDescriptionTemplate = (title, content) => {
    setSavedDescriptions(prev => {
      const newDesc = { id: Date.now().toString(), title, content };
      const newList = [newDesc, ...prev].slice(0, 50); // keep up to 50 templates
      try {
        localStorage.setItem('savedDescriptions', JSON.stringify(newList));
      } catch(e) {}
      return newList;
    });
  };

  const deleteDescriptionTemplate = (id) => {
    setSavedDescriptions(prev => {
      const newList = prev.filter(d => d.id !== id);
      try {
        localStorage.setItem('savedDescriptions', JSON.stringify(newList));
      } catch(e) {}
      return newList;
    });
  };

  // Pricing States
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);
  const [pricingPresets, setPricingPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('pricingPresets');
      if (saved) return JSON.parse(saved);
      return [];
    } catch { return []; }
  });

  const savePricingPreset = () => {
    const presetName = prompt("Enter a name for this pricing preset (e.g. '50% Margin Tier 1'):");
    if (!presetName) return;
    
    const newPreset = {
      id: Date.now().toString(),
      name: presetName,
      data: {
        regularPrice: formData.regularPrice,
        discountValue: formData.discountValue,
        discountType: formData.discountType,
        salePrice: formData.salePrice,
        costPrice: formData.costPrice,
        weight: formData.weight,
        measurementUnit: formData.measurementUnit,
        minQuantity: formData.minQuantity,
      }
    };
    setPricingPresets(prev => {
      const newList = [newPreset, ...prev].slice(0, 20);
      try {
        localStorage.setItem('pricingPresets', JSON.stringify(newList));
      } catch (e) {}
      return newList;
    });
  };

  const applyPricingPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      regularPrice: preset.data.regularPrice || '',
      discountValue: preset.data.discountValue || '',
      discountType: preset.data.discountType || 'flat',
      salePrice: preset.data.salePrice || '',
      costPrice: preset.data.costPrice || '',
      weight: preset.data.weight || '',
      measurementUnit: preset.data.measurementUnit || 'kg',
      minQuantity: preset.data.minQuantity || '1',
    }));
  };

  const [showPricingPresetsModal, setShowPricingPresetsModal] = useState(false);

  const deletePricingPreset = (id) => {
    if (window.confirm("Are you sure you want to delete this pricing preset?")) {
      setPricingPresets(prev => {
        const newList = prev.filter(p => p.id !== id);
        try { localStorage.setItem('pricingPresets', JSON.stringify(newList)); } catch (e) {}
        return newList;
      });
    }
  };

  const renamePricingPreset = (id) => {
    const preset = pricingPresets.find(p => p.id === id);
    if (!preset) return;
    const newName = prompt("Enter a new name for this pricing preset:", preset.name);
    if (!newName) return;
    
    setPricingPresets(prev => {
      const newList = prev.map(p => p.id === id ? { ...p, name: newName } : p);
      try { localStorage.setItem('pricingPresets', JSON.stringify(newList)); } catch (e) {}
      return newList;
    });
  };

  const categories = React.useMemo(() => {
    const derivedCats = {};
    for (const cat in subcats) {
      derivedCats[cat] = subcats[cat].map(sub => sub.name);
    }
    return derivedCats;
  }, [subcats]);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    try {
      localStorage.setItem('addProductData', JSON.stringify({...formData, colorImages: colorImageMap}));
    } catch (error) {
      console.warn('Could not save product data to localStorage (quota exceeded).', error);
    }
  }, [formData, colorImageMap]);

  React.useEffect(() => {
    try {
      localStorage.setItem('addProductImages', JSON.stringify(images));
    } catch (error) {
      console.warn('Could not save product images to localStorage (quota exceeded).', error);
    }
  }, [images]);

  React.useEffect(() => {
    localStorage.setItem('deliveryLibraryV4', JSON.stringify(deliveryLibrary));
  }, [deliveryLibrary]);

  React.useEffect(() => {
    const selectedDelivery = deliveryLibrary.find(d => d.id === formData.deliveryBannerType);
    const isLocal = !formData.deliveryBannerType || (selectedDelivery && selectedDelivery.type === 'domestic') || formData.deliveryBannerType === '24-48h' || formData.deliveryBannerType === '1-5days';
    const currentOptions = Array.isArray(formData.paymentOption) ? formData.paymentOption : [formData.paymentOption].filter(Boolean);
    
    if (isLocal) {
      const validOptions = currentOptions.filter(opt => paymentLibraryLocal.some(p => p.id === opt));
      if (validOptions.length === 0 && paymentLibraryLocal.length > 0) {
        setFormData(prev => ({ ...prev, paymentOption: [paymentLibraryLocal[0].id] }));
      } else if (validOptions.length !== currentOptions.length) {
        setFormData(prev => ({ ...prev, paymentOption: validOptions }));
      }
    } else {
      const validOptions = currentOptions.filter(opt => paymentLibraryGlobal.some(p => p.id === opt));
      if (validOptions.length === 0 && paymentLibraryGlobal.length > 0) {
        setFormData(prev => ({ ...prev, paymentOption: [paymentLibraryGlobal[0].id] }));
      } else if (validOptions.length !== currentOptions.length) {
        setFormData(prev => ({ ...prev, paymentOption: validOptions }));
      }
    }
  }, [formData.deliveryBannerType, formData.paymentOption, paymentLibraryLocal, paymentLibraryGlobal]);

  React.useEffect(() => {
    localStorage.setItem('paymentLibraryLocalV4', JSON.stringify(paymentLibraryLocal));
  }, [paymentLibraryLocal]);

  React.useEffect(() => {
    localStorage.setItem('paymentLibraryGlobalV4', JSON.stringify(paymentLibraryGlobal));
  }, [paymentLibraryGlobal]);

  React.useEffect(() => {
    if (!formData.attributes) return;
    
    // Get all attributes that have non-empty options
    const activeAttributes = formData.attributes.filter(a => a.name && a.options && a.options.trim() !== '');
    
    let combinations = [];
    
    if (activeAttributes.length > 0) {
      // Create an array of arrays of options
      const optionsLists = activeAttributes.map(attr => {
        return attr.options.split(',').map(o => {
          let val = o.trim();
          // Extract the color name if it's a color attribute format (e.g. "Red|#FF0000")
          if (val.includes('|')) val = val.split('|')[0];
          return val;
        }).filter(Boolean);
      });
      
      // Helper to generate Cartesian product
      const cartesian = (arrays) => {
        return arrays.reduce((a, b) => {
          return a.map(x => b.map(y => x.concat([y]))).reduce((c, d) => c.concat(d), []);
        }, [[]]);
      };
      
      const rawCombinations = cartesian(optionsLists);
      // Join combinations with ' / '
      combinations = rawCombinations.map(combo => combo.join(' / '));
    }

    if (combinations.length > 0) {
      setFormData(prev => {
        const currentVariants = prev.variants || [];
        const newVariants = combinations.map(combo => {
          const existing = currentVariants.find(v => v.name === combo);
          return existing || { name: combo, sku: '', stock: '' };
        });
        
        // Only update if changed to avoid infinite loops
        if (JSON.stringify(currentVariants.map(v => v.name)) !== JSON.stringify(newVariants.map(v => v.name))) {
          return { ...prev, variants: newVariants };
        }
        return prev;
      });
    } else {
      setFormData(prev => {
        if (prev.variants && prev.variants.length > 0) {
          return { ...prev, variants: [] };
        }
        return prev;
      });
    }
  }, [formData.attributes]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam) {
      setProductType(typeParam === 'domestic' || typeParam === 'global' ? 'retail' : typeParam);
    }
    const editId = params.get('edit');
    if (editId) {
      const product = getProductById(editId);
      // Only load product data if we don't already have a draft for this specific product
      if (product && formData.id !== editId) {
        setFormData(prev => ({
          ...prev,
          id: product.id,
          name: product.title || '',
          regularPrice: product.originalPrice || product.price || '',
          salePrice: product.price || '',
          costPrice: product.costPrice || '',
          sku: product.sku || product.id || '',
          category: product.category || [],
          subcategory: product.subcategory || [],
          brand: product.brand || '',
          vendor: product.vendor || 'OURGOODS Direct',
          vendorLocation: product.vendorLocation || '',
          type: product.type || 'Local Ready Stock',
          tags: product.tags || '',
          weight: product.weight || '',
          deliveryTime: product.deliveryTime || '',
          returnPolicy: product.returnPolicy || '7 Days Easy Return',
          status: product.status || 'Active',
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          description: product.description || '',
          features: product.features || '',
          infoSections: product.infoSections || [],
          ribbon: product.ribbon || '',
          showSameDayDelivery: product.showSameDayDelivery || false,
          stock: product.stock || '',
          placements: product.placements || [],
          deliveryBannerType: product.deliveryBannerType || '24-48h',
          paymentOption: product.paymentOption || 'cod',
          volumeTiers: product.volumeTiers || [{ min: '', max: '', price: '' }, { min: '', max: '', price: '' }, { min: '', max: '', price: '' }],
          attributes: Array.isArray(product.attributes) && product.attributes.length > 0 ? product.attributes : [
            { name: 'Color', options: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || '') },
            { name: 'Size', options: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || '') }
          ]
        }));
        
        const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
        setImages(imgs.map(img => typeof img === 'string' ? { name: 'product-image.jpg', url: img, type: 'image/jpeg', isExisting: true } : { ...img, isExisting: true }));
        setColorImageMap(product.colorImages || {});
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
    
    // Instead of appending, we want the Media Manager to completely dictate the selection.
    // If the user unselected something in the Media Manager, it will be removed here.
    if (!selectedItems) return;

    // Filter out local files which need to be compressed
    const localFiles = selectedItems.filter(item => item instanceof File || item.rawFile);
    // Note: our updated MediaManagerModal returns rawFile inside the object if it's local
    
    // Keep items that don't need compression (existing Site Files)
    const existingFiles = selectedItems.filter(item => !item.rawFile && !(item instanceof File));

    // We fully replace the state so two-way sync works
    setImages(existingFiles);

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
          const url = await fileToBase64(file);
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
            const url = await fileToBase64(compressedFile);
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

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsCompressing(true);
    const newImages = [];

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.7
    };

    for (const file of files) {
      if (file.type.startsWith('video/')) {
        const url = await fileToBase64(file);
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
          const url = await fileToBase64(compressedFile);
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
    // Trigger animation
    setRemovingIdx(index);
    
    // Actually remove the image after the animation completes
    setTimeout(() => {
      setImages(prev => prev.filter((_, i) => i !== index));
      setRemovingIdx(null);
    }, 200);
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

  const handleInsertAllImages = () => {
    if (images.length === 0) {
      alert("Please upload some product images first!");
      return;
    }
    
    let imagesHtml = '<div class="product-details-images" style="display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">';
    let added = 0;
    images.forEach(img => {
      if (img.url && !img.url.match(/\.(mp4|webm|ogg)$/i)) { // only images
        imagesHtml += `<img src="${img.url}" alt="Product Detail" style="width: 100%; max-width: 800px; border-radius: 8px; margin: 0 auto; display: block;" />`;
        added++;
      }
    });
    imagesHtml += '</div>';

    if (added === 0) {
      alert("No valid images found to insert.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      description: (prev.description || '') + imagesHtml
    }));
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
    } finally {
      setIsImporting(false);
    }
  };

  const clearVariantsData = () => {
    if (window.confirm("Are you sure you want to clear all SKU and Stock data for your variants?")) {
      setFormData(prev => ({
        ...prev,
        variants: (prev.variants || []).map(v => ({
          ...v,
          sku: '',
          barcode: '',
          stock: '',
          lowStockThreshold: '',
          backorders: 'no'
        }))
      }));
    }
  };

  // ---------------------------------------------


  const saveInventoryPreset = () => {
    const name = window.prompt('Enter a name for this Inventory Preset (e.g., "T-Shirts (Colors & Sizes)"):');
    if (name && name.trim() !== '') {
      const newPreset = {
        id: Date.now().toString(),
        name: name.trim(),
        attributes: formData.attributes || [],
      };
      const updatedPresets = [...savedInventoryPresets, newPreset];
      setSavedInventoryPresets(updatedPresets);
      try {
        localStorage.setItem('savedInventoryPresets', JSON.stringify(updatedPresets));
        alert(`Inventory Preset "${name}" saved successfully!`);
      } catch (e) {
        console.error('Failed to save preset', e);
      }
    }
  };

  const [formErrors, setFormErrors] = useState({});

  const handleSaveDraft = () => {
    alert(`Draft saved! "${formData.name || 'Untitled Product'}" has been securely saved to your local drafts.`);
  };

  const handlePublish = () => {
    const hasCategory = Array.isArray(formData.category) ? formData.category.length > 0 : !!formData.category;
    
    const errors = {};
    if (!formData.name) errors.name = true;
    if (!formData.regularPrice) errors.regularPrice = true;
    if (!formData.salePrice) errors.salePrice = true;
    if (!hasCategory) errors.category = true;
    if (images.length === 0) errors.images = true;
    if (!formData.description || formData.description.replace(/<[^>]*>?/gm, '').trim() === '') errors.description = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields (Name, Regular Price, Selling Price, Category, Description, Product Media) before publishing. Missing sections have been highlighted in red.");
      
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.error-section');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setFormErrors({});
    
    const originalId = formData.id || new URLSearchParams(location.search).get('edit');

    // Send to frontend site
    addProductToFrontend({
      ...formData,
      category: formData.category, // Keep as array
      subcategory: formData.subcategory, // Keep as array
      type: productType,
      images: images,
      colorImages: colorImageMap,
      originalId: originalId // Pass the original ID to ensure correct replacement
    });
    
    localStorage.removeItem('addProductData');
    localStorage.removeItem('addProductImages');
    
    // For the alert, we can join the array
    const displayCategory = Array.isArray(formData.category) ? formData.category.join(', ') : formData.category;
    alert(`Success! "${formData.name}" has been successfully published to the front site! You can now see it in New Arrivals and the ${displayCategory} category.`);
    // Only clear form and redirect if we are adding a NEW product
    if (!location.search.includes('edit=')) {
      setColorImageMap({});
      setFormData({
        name: '', description: '', features: '',
        regularPrice: '', salePrice: '', costPrice: '',
        sku: '', stock: '', attributes: [{ name: 'Color', options: '' }, { name: 'Size', options: '' }],
        category: [], subcategory: [], brand: '',
        vendor: 'OURGOODS Direct', type: 'Local Ready Stock',
        tags: '', weight: '', deliveryTime: '',
        returnPolicy: '7 Days Easy Return', status: 'Active',
        seoTitle: '', seoDescription: '',
        deliveryBannerType: '24-48h', paymentOption: 'cod'
      });
      setImages([]);
      setImportUrl('');
      setRibbons([]);
      setProductType('retail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If editing, just scroll to top to show it was successful
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
      localStorage.removeItem('addProductData');
      localStorage.removeItem('addProductImages');
      setColorImageMap({});
      setFormData({
        name: '', ribbon: '', description: '', features: '',
        infoSections: [],
        regularPrice: '', salePrice: '', costPrice: '',
        sku: '', stock: '', attributes: [{ name: 'Color', options: '' }, { name: 'Size', options: '' }],
        category: [], subcategory: [], brand: '', placements: [],
        vendor: 'OURGOODS Direct', type: 'Local Ready Stock',
        tags: '', weight: '', deliveryTime: '',
        returnPolicy: '7 Days Easy Return', status: 'Active',
        seoTitle: '', seoDescription: '',
        deliveryBannerType: '24-48h',
        paymentOption: 'cod',
        volumeTiers: [{ min: '', max: '', price: '' }, { min: '', max: '', price: '' }, { min: '', max: '', price: '' }]
      });
      setImages([]);
      setImportUrl('');
      setRibbons([]);
      setProductType('retail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        top: 'var(--header-height, 70px)',
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



        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-pink)', borderColor: 'var(--brand-pink)' }} onClick={() => alert('Bulk upload functionality coming soon!')}>
            <UploadCloud size={18} /> Bulk Upload
          </button>
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
          <div className={`form-section ${formErrors.images ? 'error-section' : ''}`} style={{ backgroundColor: formErrors.images ? '#fef2f2' : '#ffffff', padding: '24px', borderRadius: '8px', border: formErrors.images ? '1px solid #ef4444' : '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
                    key={`${img.url || img.name}-${idx}`} 
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
                      transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)', 
                      boxShadow: draggedImgIdx === idx ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      opacity: draggedImgIdx === idx ? 0.3 : (removingIdx === idx ? 0 : 1),
                      transform: draggedImgIdx === idx ? 'scale(0.95)' : (removingIdx === idx ? 'scale(0)' : 'scale(1)'),
                      transformOrigin: 'center center',
                      zIndex: draggedImgIdx === idx ? 10 : 1
                    }}
                  >
                    {idx === 0 && (
                      <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(228,50,146,0.95)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', zIndex: 10, boxShadow: '0 2px 4px rgba(228,50,146,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={10} fill="#fff" /> MAIN
                      </div>
                    )}
                    {idx === 0 && formData.ribbon && formData.ribbon !== 'None' && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#334155', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {formData.ribbon}
                      </div>
                    )}
                    {img.url ? (
                      (img.type && img.type.startsWith('video/')) || (img.url && img.url.match(/\.(mp4|webm|ogg)$/i)) ? (
                        <>
                          <video src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PlayCircle size={16} color="#fff" />
                          </div>
                        </>
                      ) : (
                        <img src={img.url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} color="#94a3b8" />
                      </div>
                    )}
                    <button 
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(idx); }} 
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
          <div className={`form-section ${(formErrors.name || formErrors.description) ? 'error-section' : ''}`} style={{ backgroundColor: (formErrors.name || formErrors.description) ? '#fef2f2' : '#ffffff', padding: '24px', borderRadius: '8px', border: (formErrors.name || formErrors.description) ? '1px solid #ef4444' : '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setShowRibbonMenu(!showRibbonMenu)}
                    style={{
                      padding: '10px 14px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                      color: '#334155'
                    }}
                  >
                    <span>{ribbons.find(r => r.value === (formData.ribbon || ''))?.label || 'None'}</span>
                    <ChevronDown size={16} />
                  </div>
                  
                  {showRibbonMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      marginTop: '4px',
                      backgroundColor: '#fff',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {ribbons.map(option => (
                        <div 
                          key={option.value}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: (formData.ribbon || '') === option.value ? '#f8fafc' : '#fff',
                          }}
                        >
                          {editingRibbon === option.value && option.value !== '' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                              <input 
                                type="text"
                                autoFocus
                                value={newRibbonText}
                                onChange={(e) => setNewRibbonText(e.target.value)}
                                style={{ flex: 1, padding: '4px 8px', border: '1px solid var(--admin-border)', borderRadius: '4px' }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newRibbonText.trim()) {
                                    const updated = ribbons.map(r => r.value === option.value ? { value: newRibbonText.trim(), label: newRibbonText.trim() } : r);
                                    saveRibbons(updated);
                                    if (formData.ribbon === option.value) {
                                      setFormData(prev => ({ ...prev, ribbon: newRibbonText.trim() }));
                                    }
                                    setEditingRibbon(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingRibbon(null);
                                  }
                                }}
                              />
                              <button type="button" onClick={() => {
                                if(newRibbonText.trim()) {
                                  const updated = ribbons.map(r => r.value === option.value ? { value: newRibbonText.trim(), label: newRibbonText.trim() } : r);
                                  saveRibbons(updated);
                                  if (formData.ribbon === option.value) {
                                    setFormData(prev => ({ ...prev, ribbon: newRibbonText.trim() }));
                                  }
                                }
                                setEditingRibbon(null);
                              }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-pink)' }}><Check size={16}/></button>
                              <button type="button" onClick={() => setEditingRibbon(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={16}/></button>
                            </div>
                          ) : (
                            <>
                              <div 
                                style={{ flex: 1, cursor: 'pointer', color: (formData.ribbon || '') === option.value ? 'var(--brand-pink)' : '#334155', fontSize: '14px' }}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, ribbon: option.value }));
                                  setShowRibbonMenu(false);
                                }}
                              >
                                {option.label}
                              </div>
                              {option.value !== '' && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button type="button" onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRibbon(option.value);
                                    setNewRibbonText(option.label);
                                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Edit size={14}/></button>
                                  <button type="button" onClick={(e) => {
                                    e.stopPropagation();
                                    if(window.confirm('Delete this ribbon?')) {
                                      const updated = ribbons.filter(r => r.value !== option.value);
                                      saveRibbons(updated);
                                      if (formData.ribbon === option.value) {
                                        setFormData(prev => ({ ...prev, ribbon: '' }));
                                      }
                                    }
                                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-danger)' }}><Trash2 size={14}/></button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                      
                      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--admin-border)', backgroundColor: '#fafafa' }}>
                        {editingRibbon === 'NEW' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                              type="text"
                              autoFocus
                              placeholder="New ribbon..."
                              value={newRibbonText}
                              onChange={(e) => setNewRibbonText(e.target.value)}
                              style={{ flex: 1, padding: '6px 8px', border: '1px solid var(--admin-border)', borderRadius: '4px', fontSize: '13px' }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newRibbonText.trim()) {
                                  const text = newRibbonText.trim();
                                  if(!ribbons.some(r => r.value === text)) {
                                    saveRibbons([...ribbons, { value: text, label: text }]);
                                  }
                                  setEditingRibbon(null);
                                  setNewRibbonText('');
                                } else if (e.key === 'Escape') {
                                  setEditingRibbon(null);
                                }
                              }}
                            />
                            <button type="button" onClick={() => {
                              if(newRibbonText.trim()) {
                                const text = newRibbonText.trim();
                                if(!ribbons.some(r => r.value === text)) {
                                  saveRibbons([...ribbons, { value: text, label: text }]);
                                }
                              }
                              setEditingRibbon(null);
                              setNewRibbonText('');
                            }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-pink)' }}><Check size={16}/></button>
                            <button type="button" onClick={() => { setEditingRibbon(null); setNewRibbonText(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={16}/></button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setEditingRibbon('NEW'); setNewRibbonText(''); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-pink)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', width: '100%', padding: '4px 0' }}
                          >
                            <Plus size={14} /> Add New Ribbon
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          {/* Variants */}
          {/* Variants */}
          <div style={{ marginBottom: "24px", marginTop: "16px" }}>

            {/* Variant Presets Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Variants &amp; Attributes</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {variantPresets.filter(p => p.isSticky).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyVariantPreset(preset)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  >
                    <Bookmark size={14} fill="currentColor" /> {preset.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={saveVariantPreset}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fce7f3'}
                  onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}
                >
                  <Bookmark size={14} /> Save Preset
                </button>
                <button
                  type="button"
                  onClick={() => setShowManageVariantPresetsModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  <Settings2 size={14} /> Manage Presets
                </button>
              </div>
            </div>

            {(formData.attributes || []).map((attr, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', padding: '16px', borderRadius: '8px', background: ['#eff6ff', '#f0fdf4', '#fef2f2', '#fffbeb', '#faf5ff'][idx % 5], border: '1px solid ' + ['#bfdbfe', '#bbf7d0', '#fecaca', '#fde68a', '#e9d5ff'][idx % 5], borderLeft: '4px solid ' + ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#a855f7'][idx % 5] }}>
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
                  
                  <div className="form-input" style={{ minHeight: '42px', height: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 12px', alignItems: 'center', marginBottom: '12px' }}>
                    {attr.options && attr.options.split(',').map(o => o.trim()).filter(Boolean).map((opt, i) => (
                      <span key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 500, color: '#334155', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        {attr.name === 'Color' ? (
                           <>
                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getBadgeColor(opt), border: '1px solid rgba(0,0,0,0.15)', zIndex: 1 }}></span>
                             <span style={{ zIndex: 1, pointerEvents: 'none' }}>{opt.includes('|') ? opt.split('|')[0] : opt}</span>
                             <input 
                               type="color" 
                               value={getBadgeColor(opt)}
                               title="Click to change color code"
                               onChange={(e) => {
                                 const newHex = e.target.value.toUpperCase();
                                 const currentName = opt.includes('|') ? opt.split('|')[0] : opt;
                                 const newOpts = attr.options.split(',').map(o => o.trim()).filter(Boolean);
                                 newOpts[i] = `${currentName}|${newHex}`;
                                 handleAttributeChange(idx, 'options', newOpts.join(', '));
                                 addSavedCustomColor(`${currentName}|${newHex}`);
                               }}
                               style={{ position: 'absolute', top: 0, left: 0, width: 'calc(100% - 24px)', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }} 
                             />
                           </>
                        ) : (
                           <span>{opt.includes('|') ? opt.split('|')[0] : opt}</span>
                        )}
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
                            
                            newVals.forEach(nv => {
                              if (!updatedOpts.includes(nv)) {
                                updatedOpts.push(nv);
                                if (attr.name === 'Color') {
                                  addSavedCustomColor(nv);
                                  recordRecentColor(nv);
                                }
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
                      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', overflowX: 'auto', alignItems: 'center', paddingBottom: '4px' }}>
                        {/* Custom Color Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', padding: '4px 10px', transition: 'all 0.2s', flexShrink: 0 }}>
                          <input 
                            type="color" 
                            id={`custom-color-picker-${idx}`}
                            defaultValue="#000000"
                            title="Pick a custom color"
                            style={{ width: '18px', height: '18px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
                            onChange={(e) => {
                              const hexInput = document.getElementById(`custom-color-hex-${idx}`);
                              if (hexInput) hexInput.value = e.target.value.toUpperCase();
                            }}
                          />
                          <input 
                            id={`custom-color-hex-${idx}`}
                            type="text" 
                            placeholder="#HexCode"
                            defaultValue="#000000"
                            style={{ fontSize: '11px', border: 'none', outline: 'none', width: '60px', background: 'transparent', color: '#64748b', fontWeight: 500, borderRight: '1px solid #e2e8f0', paddingRight: '6px' }}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                                const picker = document.getElementById(`custom-color-picker-${idx}`);
                                if (picker) picker.value = val;
                              }
                            }}
                          />
                          <input 
                            id={`custom-color-name-${idx}`}
                            type="text" 
                            placeholder="Color Name..." 
                            style={{ fontSize: '11px', border: 'none', outline: 'none', width: '85px', background: 'transparent', color: '#334155', fontWeight: 500 }}
                            onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                   e.preventDefault();
                                   const nameVal = e.target.value.trim(); // Maintains exact capitalization
                                   const hexInput = document.getElementById(`custom-color-hex-${idx}`);
                                   const pickerInput = document.getElementById(`custom-color-picker-${idx}`);
                                   const hexVal = (hexInput && hexInput.value.trim()) ? hexInput.value.trim() : pickerInput.value;
                                   
                                   if (nameVal && hexVal.startsWith('#')) {
                                      const combined = `${nameVal}|${hexVal}`;
                                      addSavedCustomColor(combined);
                                      recordRecentColor(combined);
                                      const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                                      if (!currentOpts.includes(combined)) {
                                        handleAttributeChange(idx, 'options', [...currentOpts, combined].join(', '));
                                      }
                                      e.target.value = '';
                                   }
                               }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                               const nameInput = document.getElementById(`custom-color-name-${idx}`);
                               const hexInput = document.getElementById(`custom-color-hex-${idx}`);
                               const pickerInput = document.getElementById(`custom-color-picker-${idx}`);
                               if (nameInput) {
                                   const nameVal = nameInput.value.trim(); // Maintains exact capitalization
                                   const hexVal = (hexInput && hexInput.value.trim()) ? hexInput.value.trim() : pickerInput.value;
                                   
                                   if (nameVal && hexVal.startsWith('#')) {
                                      const combined = `${nameVal}|${hexVal}`;
                                      addSavedCustomColor(combined);
                                      recordRecentColor(combined);
                                      const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                                      if (!currentOpts.includes(combined)) {
                                        handleAttributeChange(idx, 'options', [...currentOpts, combined].join(', '));
                                      }
                                      nameInput.value = '';
                                   }
                               }
                            }}
                            style={{ background: 'var(--brand-pink)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', padding: '2px', flexShrink: 0 }}
                            title="Add Custom Color"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          type="button" 
                          onClick={() => { setShowColorLibraryModal(true); setColorLibraryIndex(idx); }}
                          style={{ background: '#fff', border: '1px dashed #cbd5e1', padding: '4px 12px', height: '34px', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flexShrink: 0 }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#fff'; }}
                        >
                          <span style={{ color: '#E91E63' }}>✦</span> Browse Color Library
                        </button>
                      </div>
                      
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Recent Suggestions */}
                        {recentSelectedColors
                          .filter(_opt => !(attr.options && attr.options.split(',').map(o => (o.includes('|') ? o.split('|')[0] : o).trim().toLowerCase()).includes((_opt.includes('|') ? _opt.split('|')[0] : _opt).trim().toLowerCase())))
                          .map(color => (
                          <span 
                            key={`recent-${color}`}
                            onClick={() => {
                              const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                              handleAttributeChange(idx, 'options', [...currentOpts, color].join(', '));
                              recordRecentColor(color);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '5px 12px', background: '#f1f5f9', borderRadius: '16px', cursor: 'pointer', color: '#475569', fontWeight: 500, transition: 'all 0.2s', border: '1px dashed #cbd5e1' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#334155'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                            title="Recent Color"
                          >
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getBadgeColor(color), border: '1px solid rgba(0,0,0,0.1)' }}></span>
                            {color.includes('|') ? color.split('|')[0] : color}
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
                                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{color.includes('|') ? color.split('|')[0] : color}</span>
                                </div>
                                <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  {colorImageMap[color] ? (
                                    <div 
                                      style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer' }} 
                                      onClick={() => setActiveColorMapping(activeColorMapping === color ? null : color)}
                                      onMouseOver={(e) => e.currentTarget.lastChild.style.opacity = 1}
                                      onMouseOut={(e) => e.currentTarget.lastChild.style.opacity = (activeColorMapping === color ? 1 : 0)}
                                    >
                                      {colorImageMap[color].match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video src={colorImageMap[color]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      ) : (
                                        <img src={colorImageMap[color]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      )}
                                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeColorMapping === color ? 1 : 0, transition: 'opacity 0.2s' }}>
                                        <i className="las la-pen" style={{ color: '#fff', fontSize: '18px' }}></i>
                                      </div>
                                    </div>
                                  ) : (
                                    <button 
                                      type="button"
                                      onClick={() => setActiveColorMapping(activeColorMapping === color ? null : color)}
                                      style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}
                                    >
                                      <i className="las la-image"></i> Select Picture
                                    </button>
                                  )}

                                  {activeColorMapping === color && (
                                    <div style={{ display: 'flex', gap: '6px', padding: '6px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap', alignItems: 'center' }}>
                                      {images.length > 0 ? images.map((img, imgIdx) => (
                                        <div 
                                          key={imgIdx}
                                          onClick={() => { setColorImageMap(prev => ({ ...prev, [color]: img.url })); setActiveColorMapping(null); }}
                                          style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '4px', cursor: 'pointer', overflow: 'hidden', border: colorImageMap[color] === img.url ? '2px solid var(--brand-pink)' : '1px solid transparent', transition: 'all 0.2s', background: '#fff' }}
                                        >
                                          {(img.type && img.type.startsWith('video/')) || (img.url && img.url.match(/\.(mp4|webm|ogg)$/i)) ? (
                                            <video src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          ) : (
                                            <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          )}
                                        </div>
                                      )) : (
                                        <span style={{ fontSize: '12px', color: '#64748b', padding: '0 8px' }}>No product images available</span>
                                      )}
                                      {colorImageMap[color] && (
                                        <button type="button" onClick={() => { setColorImageMap(prev => { const newMap = {...prev}; delete newMap[color]; return newMap; }); setActiveColorMapping(null); }} style={{ background: '#fee2e2', border: '1px solid #fca5a5', height: '36px', width: '36px', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove mapping">
                                          <i className="las la-trash-alt" style={{ fontSize: '16px' }}></i>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {['Body Size', 'Size', 'Material', 'Style', 'Capacity', 'Volume', 'Model'].includes(attr.name) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => { setShowAttrLibraryModal(true); setAttrLibraryIndex(idx); setAttrLibraryType(attr.name); }}
                          style={{ background: '#fff', border: '1px dashed #cbd5e1', padding: '4px 12px', height: '34px', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flexShrink: 0 }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#fff'; }}
                        >
                          <span style={{ color: '#E91E63' }}>✦</span> Browse {attr.name} Library
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: attr.name === 'Volume' ? '150px' : 'auto', overflowY: attr.name === 'Volume' ? 'auto' : 'visible', padding: attr.name === 'Volume' ? '4px' : '0' }}>
                        {(() => {
                          const allOpts = savedCustomAttributes[attr.name] || [];
                          const currentOpts = attr.options ? attr.options.split(',').map(o => o.trim()).filter(Boolean) : [];
                          const unselectedOpts = allOpts.filter(_opt => !currentOpts.includes(_opt));
                          
                          return (
                            <>
                              {unselectedOpts.length > 0 && (
                                <span 
                                  onClick={() => handleAttributeChange(idx, 'options', [...new Set([...currentOpts, ...allOpts])].join(', '))}
                                  style={{ fontSize: '11px', padding: '4px 10px', background: '#fff', borderRadius: '16px', cursor: 'pointer', color: '#e43292', fontWeight: 600, transition: 'all 0.2s', border: '1px dashed #e43292' }}
                                  onMouseOver={(e) => { e.currentTarget.style.background = '#fdf2f8'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}
                                >
                                  + Select All ({unselectedOpts.length})
                                </span>
                              )}
                              {unselectedOpts.map(opt => (
                                <span 
                                  key={opt}
                                  onClick={() => {
                                    if (!currentOpts.includes(opt)) {
                                      handleAttributeChange(idx, 'options', [...currentOpts, opt].join(', '));
                                    }
                                  }}
                                  style={{ fontSize: '11px', padding: '4px 10px', background: '#e2e8f0', borderRadius: '16px', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s', border: '1px solid #cbd5e1' }}
                                  onMouseOver={(e) => { e.currentTarget.style.background = '#cbd5e1'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                >
                                  + {opt}
                                </span>
                              ))}
                            </>
                          );
                        })()}
                      </div>
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



            <div className={`form-section ${formErrors.description ? 'error-section' : ''}`} style={{ backgroundColor: formErrors.description ? '#fef2f2' : '#ffffff', padding: '24px', borderRadius: '8px', border: formErrors.description ? '1px solid #ef4444' : '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '13px', color: formErrors.description ? '#dc2626' : '#475569' }}>Description</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    type="button"
                    onClick={handleInsertAllImages}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '12px', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <ImageIcon size={14} /> Insert Images
                  </button>

                  <button 
                    type="button"
                    onClick={() => setShowDescLibraryModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '12px', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <Book size={14} /> Description Library
                  </button>

                  {/* Description Preset buttons */}
                  {descPresets.filter(p => p.isSticky).map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyDescPreset(preset)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                      onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                    >
                      <Bookmark size={13} fill="currentColor" /> {preset.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={saveDescPreset}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#db2777', fontWeight: 600, fontSize: '12px', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fce7f3'}
                    onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}
                  >
                    <Bookmark size={13} /> Save Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManageDescPresetsModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: '12px', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <Settings2 size={13} /> Manage Presets
                  </button>

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
              </div>
              
              <div style={formErrors.description ? { border: '1px solid #ef4444', borderRadius: '4px' } : {}}>
                <RichTextEditor 
                  value={formData.description} 
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val }))} 
                  placeholder="Describe your product here..." 
                />
              </div>
              {formErrors.description && <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>Please enter a product description.</p>}
            </div>
            

          </div>

          {/* Pricing */}
          <div className={`form-section ${(formErrors.salePrice || formErrors.regularPrice) ? 'error-section' : ''}`} style={{ backgroundColor: (formErrors.salePrice || formErrors.regularPrice) ? '#fef2f2' : '#ffffff', padding: '24px', borderRadius: '8px', border: (formErrors.salePrice || formErrors.regularPrice) ? '1px solid #ef4444' : '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{productType === 'factory' ? 'Wholesale Pricing' : 'Retail Pricing'}</h3>
              
              {/* Presets Dropdown & Save */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {pricingPresets.filter(p => p.isSticky).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPricingPreset(preset)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  >
                    <Bookmark size={14} fill="currentColor" /> {preset.name}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={savePricingPreset}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <Bookmark size={14} /> Save Preset
                </button>
                <button
                  type="button"
                  onClick={() => setShowPricingPresetsModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <Settings2 size={14} /> Manage Presets
                </button>
              </div>
            </div>
            
            {/* Standard Pricing Line */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '8px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{productType === 'factory' ? 'Wholesale Price (৳)' : 'Retail Price (৳)'}</label>
                <input type="number" name="regularPrice" className="form-input" placeholder="0.00" value={formData.regularPrice || ''} onChange={handlePricingChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Discount</label>
                <div style={{ display: 'flex' }}>
                  <input type="number" name="discountValue" className="form-input" style={{ flex: 2, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', margin: 0 }} placeholder="0" value={formData.discountValue || ''} onChange={handlePricingChange} />
                  <select name="discountType" className="form-input" style={{ flex: 1, padding: '8px 12px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, margin: 0 }} value={formData.discountType || 'flat'} onChange={handlePricingChange}>
                    <option value="flat">Flat (৳)</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Final Sale Price (৳)</label>
                <input type="number" name="salePrice" className="form-input" placeholder="0.00" value={formData.salePrice || ''} onChange={handlePricingChange} />
              </div>
            </div>

            {/* Savings Display */}
            {(() => {
              const regular = parseFloat(formData.regularPrice) || 0;
              const sale = parseFloat(formData.salePrice) || 0;
              if (regular > 0 && sale < regular && sale > 0) {
                const savingsAmt = regular - sale;
                const savingsPct = ((savingsAmt / regular) * 100).toFixed(0);
                return (
                  <div style={{ fontSize: '13px', color: '#059669', fontWeight: 500, marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    Customer saves: ৳{savingsAmt.toFixed(2)} ({savingsPct}%)
                  </div>
                );
              }
              return <div style={{ marginBottom: '24px' }}></div>;
            })()}


            {/* Advanced Options Block */}
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Cost of Goods (৳) <span style={{ fontSize: '11px', color: '#888', fontWeight: 'normal', marginLeft: '4px' }}>(Internal)</span></label>
                    <input type="number" name="costPrice" className="form-input" placeholder="0.00" value={formData.costPrice || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
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
                          backgroundColor: hasValue ? (isPositive ? '#ecfdf5' : '#fef2f2') : '#fff', 
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
                  <div className="form-group" style={{ marginBottom: 0 }}>
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
                          backgroundColor: hasValue ? (isPositive ? '#ecfdf5' : '#fef2f2') : '#fff', 
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Weight</label>
                    <div style={{ display: 'flex' }}>
                      <input 
                        type="number" 
                        name="weight" 
                        className="form-input" 
                        placeholder="0.80" 
                        value={formData.weight || ''} 
                        onChange={handleChange} 
                        onBlur={(e) => {
                          if (e.target.value && e.target.value.startsWith('.')) {
                            setFormData(prev => ({...prev, weight: '0' + e.target.value}));
                          }
                        }}
                        style={{ flex: 2, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', margin: 0 }} 
                      />
                      <select name="measurementUnit" className="form-input" style={{ flex: 1, padding: '8px 12px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, margin: 0 }} value={formData.measurementUnit || 'g'} onChange={handleChange}>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
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
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Minimum Quantity</label>
                    <div style={{ display: 'flex' }}>
                      <select 
                        value={!(formData.minQuantity || '1').includes('-') ? 'exact' : 'range'} 
                        onChange={(e) => setFormData(prev => ({...prev, minQuantity: e.target.value === 'exact' ? '1' : '5-10'}))}
                        className="form-input" 
                        style={{ width: '85px', padding: '8px', borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, margin: 0, borderRight: 'none', outline: 'none' }}
                      >
                        <option value="exact">Exact</option>
                        <option value="range">Range</option>
                      </select>
                      
                      {!(formData.minQuantity || '1').includes('-') ? (
                        <input type="number" name="minQuantity" className="form-input" placeholder="1" value={formData.minQuantity || '1'} onChange={handleChange} style={{ flex: 1, margin: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} />
                      ) : (
                        <div style={{ display: 'flex', flex: 1 }}>
                          <input type="number" className="form-input" placeholder="Min" value={(formData.minQuantity || '5-10').split('-')[0] || ''} onChange={(e) => setFormData(prev => ({...prev, minQuantity: `${e.target.value}-${(prev.minQuantity || '5-10').split('-')[1] || ''}`}))} style={{ margin: 0, borderRadius: 0, width: '50%', borderRight: 'none' }} />
                          <input type="number" className="form-input" placeholder="Max" value={(formData.minQuantity || '5-10').split('-')[1] || ''} onChange={(e) => setFormData(prev => ({...prev, minQuantity: `${(prev.minQuantity || '5-10').split('-')[0] || ''}-${e.target.value}`}))} style={{ margin: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '50%' }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tax Settings</label>
                    <select className="form-input" style={{ margin: 0, backgroundColor: '#fff' }}>
                      <option value="included">Tax Included</option>
                      <option value="excluded">Tax Excluded</option>
                      <option value="exempt">No Tax</option>
                    </select>
                  </div>
                </div>

                {(formData.minQuantity || '1').includes('-') && (
                  <div style={{ marginTop: '24px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Wholesale / Tiered Pricing</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Set optional price breaks for bulk purchases (e.g., 5-50 pcs: ৳400)</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(formData.volumeTiers || []).map((tier, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', width: '45px' }}>Tier {index + 1}</span>
                          
                          <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="Min Qty" 
                              value={tier.min || ''} 
                              onChange={(e) => {
                                const newTiers = [...(formData.volumeTiers || [])];
                                newTiers[index] = { ...newTiers[index], min: e.target.value };
                                setFormData(prev => ({ ...prev, volumeTiers: newTiers }));
                              }}
                              style={{ margin: 0, flex: 1 }}
                            />
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>to</span>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="Max Qty" 
                              value={tier.max || ''} 
                              onChange={(e) => {
                                const newTiers = [...(formData.volumeTiers || [])];
                                newTiers[index] = { ...newTiers[index], max: e.target.value };
                                setFormData(prev => ({ ...prev, volumeTiers: newTiers }));
                              }}
                              style={{ margin: 0, flex: 1 }}
                            />
                            <span style={{ color: '#475569', fontSize: '13px', marginLeft: '4px', width: '24px' }}>pcs</span>
                          </div>

                          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 4px' }}></div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <span style={{ padding: '0 12px', border: '1px solid #e2e8f0', borderRight: 'none', borderRadius: '6px 0 0 6px', background: '#f8fafc', color: '#64748b', height: '38px', display: 'flex', alignItems: 'center' }}>৳</span>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="Price per piece" 
                              value={tier.price || ''} 
                              onChange={(e) => {
                                const newTiers = [...(formData.volumeTiers || [])];
                                newTiers[index] = { ...newTiers[index], price: e.target.value };
                                setFormData(prev => ({ ...prev, volumeTiers: newTiers }));
                              }}
                              style={{ margin: 0, flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newTiers = [...(formData.volumeTiers || [])];
                              newTiers.splice(index, 1);
                              setFormData(prev => ({ ...prev, volumeTiers: newTiers }));
                            }}
                            style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}
                            title="Delete Tier"
                            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => {
                          const newTiers = [...(formData.volumeTiers || [])];
                          newTiers.push({ min: '', max: '', price: '' });
                          setFormData(prev => ({ ...prev, volumeTiers: newTiers }));
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                      >
                        <Plus size={16} /> Add Price Tier
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Inventory */}
          <div className="form-section" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Inventory</h3>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {savedInventoryPresets.filter(p => p.isSticky).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      const newAttributes = preset.attributes || [];
                      setFormData(prev => {
                        const newData = { ...prev, attributes: newAttributes };
                        let newVariants = [];
                        if (newAttributes.length > 0 && newAttributes.some(a => a.name && a.options && a.options.trim() !== '')) {
                          const activeAttrs = newAttributes.filter(a => a.name && a.options && a.options.trim() !== '');
                          const optionsList = activeAttrs.map(a => a.options.split(',').map(o => o.trim()).filter(Boolean));
                          const generateCombinations = (lists) => {
                            if (lists.length === 0) return [];
                            if (lists.length === 1) return lists[0].map(item => [item]);
                            const result = [];
                            const rest = generateCombinations(lists.slice(1));
                            for (let i = 0; i < lists[0].length; i++) {
                              for (let j = 0; j < rest.length; j++) {
                                result.push([lists[0][i], ...rest[j]]);
                              }
                            }
                            return result;
                          };
                          const combinations = generateCombinations(optionsList);
                          newVariants = combinations.map(combo => {
                            const cleanName = combo.map(c => c.includes('|') ? c.split('|')[0] : c).join(' / ');
                            return { name: cleanName, sku: '', stock: '' };
                          });
                        }
                        newData.variants = newVariants;
                        return newData;
                      });
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  >
                    <Bookmark size={14} fill="currentColor" /> {preset.name}
                  </button>
                ))}
                {(formData.variants && formData.variants.length > 0) && (
                  <button
                    type="button"
                    onClick={clearVariantsData}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef2f2', border: '1px solid #f87171', color: '#ef4444', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#f87171'; }}
                  >
                    <Trash2 size={14} /> Clear Data
                  </button>
                )}
                <button
                  type="button"
                  onClick={saveInventoryPreset}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <Bookmark size={14} /> Save Preset
                </button>
                <button
                  type="button"
                  onClick={() => setShowInventoryPresetsModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <Settings2 size={14} /> Manage Presets
                </button>
              </div>
            </div>
            
            {(!formData.variants || formData.variants.length === 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <label className="form-label">Barcode (ISBN, UPC, GTIN, etc.)</label>
                    <input 
                      type="text" 
                      name="barcode" 
                      className="form-input" 
                      placeholder="e.g. 0123456789012" 
                      value={formData.barcode || ''} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input 
                      type="number" 
                      name="stock" 
                      className="form-input" 
                      placeholder="0" 
                      value={formData.stock || ''} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Low Stock Threshold</label>
                    <input 
                      type="number" 
                      name="lowStockThreshold" 
                      className="form-input" 
                      placeholder="5" 
                      value={formData.lowStockThreshold || ''} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Allow Backorders</label>
                    <select 
                      name="backorders" 
                      className="form-input" 
                      value={formData.backorders || 'no'} 
                      onChange={handleChange}
                    >
                      <option value="no">Do not allow</option>
                      <option value="notify">Allow, but notify customer</option>
                      <option value="yes">Allow</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Filter Variants:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                     {(() => {
                        const activeAttributes = formData.attributes?.filter(a => a.name && a.options && a.options.trim() !== '') || [];
                        if (activeAttributes.length === 0) return <span style={{ fontSize: '13px', color: '#94a3b8' }}>No attributes</span>;
                        return activeAttributes.map(attr => (
                          <select
                            key={attr.name}
                            value={variantFilters[attr.name] || ''}
                            onChange={(e) => setVariantFilters(prev => ({ ...prev, [attr.name]: e.target.value }))}
                            className="form-input"
                            style={{ margin: 0, width: 'auto', minWidth: '120px', padding: '6px 28px 6px 12px' }}
                          >
                            <option value="">Any {attr.name}</option>
                            {attr.options.split(',').map(o => {
                              let val = o.trim();
                              if (val.includes('|')) val = val.split('|')[0];
                              if (!val) return null;
                              return <option key={val} value={val}>{val}</option>;
                            })}
                          </select>
                        ));
                     })()}
                     {Object.values(variantFilters).some(Boolean) && (
                       <button
                         type="button"
                         onClick={() => setVariantFilters({})}
                         style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#ef4444', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '4px 8px', marginLeft: '4px' }}
                       >
                         Clear
                       </button>
                     )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Bulk Actions:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                        <input type="number" id="bulk-stock-input" placeholder="Stock Qty" style={{ border: 'none', width: '90px', padding: '6px 12px', fontSize: '13px', outline: 'none' }} />
                        <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }}></div>
                        <input type="number" id="bulk-low-stock-input" placeholder="Low Stock" style={{ border: 'none', width: '90px', padding: '6px 12px', fontSize: '13px', outline: 'none' }} />
                        <button 
                          type="button" 
                          onClick={() => {
                            const stockVal = document.getElementById('bulk-stock-input').value;
                            const lowStockVal = document.getElementById('bulk-low-stock-input').value;
                            if (stockVal || lowStockVal) {
                              setFormData(prev => ({
                                ...prev,
                                variants: prev.variants.map(v => {
                                  const passesFilter = Object.entries(variantFilters).every(([key, value]) => {
                                    if (!value) return true;
                                    const parts = v.name.split(' / ').map(p => p.trim());
                                    return parts.includes(value);
                                  });
                                  if (!passesFilter) return v;
                                  return { 
                                    ...v, 
                                    ...(stockVal && { stock: stockVal }),
                                    ...(lowStockVal && { lowStockThreshold: lowStockVal })
                                  };
                                })
                              }));
                            }
                          }}
                          style={{ background: '#f1f5f9', borderLeft: '1px solid #cbd5e1', borderTop: 'none', borderRight: 'none', borderBottom: 'none', padding: '6px 16px', color: '#475569', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}
                        >Apply</button>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => {
                          let prefix = 'PRD';
                          if (Array.isArray(formData.category) && formData.category.length > 0) {
                            prefix = formData.category[0].substring(0, 3).toUpperCase();
                          } else if (typeof formData.category === 'string' && formData.category.trim() !== '') {
                            prefix = formData.category.substring(0, 3).toUpperCase();
                          } else if (formData.name && formData.name.trim() !== '') {
                            prefix = formData.name.substring(0, 3).toUpperCase();
                          }
                          
                          setFormData(prev => ({
                            ...prev,
                            variants: prev.variants.map(v => {
                              const smartName = v.name.split(' / ').map(p => p.trim().replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()).join('-');
                              const randomNum = Math.floor(100 + Math.random() * 900);
                              return { ...v, sku: `${prefix}-${smartName}-${randomNum}` };
                            })
                          }));
                        }}
                        style={{ padding: '6px 16px', backgroundColor: '#fff0f6', color: '#901254', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      ><Sparkles size={14} /> Auto Generate SKUs</button>
                    </div>
                  </div>
                </div>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Variant</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>SKU</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, width: '130px' }}>Stock Qty</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, width: '130px' }}>Low Stock</th>
                      </tr>
                    </thead>
                  <tbody>
                    {(() => {
                      const colorMap = {};
                      const colorAttr = formData.attributes?.find(a => a.name.toLowerCase().includes('color'));
                      if (colorAttr && colorAttr.options) {
                        colorAttr.options.split(',').forEach(o => {
                          const parts = o.split('|');
                          if (parts.length > 1) {
                             colorMap[parts[0].trim().toLowerCase()] = parts[1].trim();
                          }
                        });
                      }

                      return formData.variants.map((variant, index) => {
                        const passesFilter = Object.entries(variantFilters).every(([key, value]) => {
                          if (!value) return true;
                          const parts = variant.name.split(' / ').map(p => p.trim());
                          return parts.includes(value);
                        });
                        if (!passesFilter) return null;
                        
                        const variantParts = variant.name.split(' / ').map(p => p.trim().toLowerCase());
                        const matchedColorHex = variantParts.map(p => colorMap[p]).find(Boolean);
                        
                        return (
                          <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px' }}>
                            {matchedColorHex && (
                              <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: matchedColorHex, border: '1px solid rgba(0,0,0,0.1)', display: 'inline-block', flexShrink: 0 }}></span>
                            )}
                            {variant.name}
                          </td>
                          <td style={{ padding: '8px 16px' }}>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. TS-BLK-M" 
                            value={variant.sku || ''}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[index].sku = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            style={{ margin: 0, padding: '8px' }}
                          />
                        </td>
                        <td style={{ padding: '8px 16px' }}>
                          <input 
                            type="number" 
                            className="form-input" 
                            placeholder="0" 
                            value={variant.stock || ''}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[index].stock = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            style={{ margin: 0, padding: '8px' }}
                          />
                        </td>
                        <td style={{ padding: '8px 16px' }}>
                          <input 
                            type="number" 
                            className="form-input" 
                            placeholder="5" 
                            value={variant.lowStockThreshold || ''}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[index].lowStockThreshold = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            style={{ margin: 0, padding: '8px' }}
                          />
                        </td>
                      </tr>
                      );
                    })})()}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>


        </div>

        {/* Right Column - Organization & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Categories */}
          <div className={`form-section ${formErrors.category ? 'error-section' : ''}`} style={{ backgroundColor: formErrors.category ? '#fef2f2' : 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: formErrors.category ? '1px solid #ef4444' : '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Categories</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Pinned preset chips */}
                {categoryPresets.filter(p => p.isSticky).map(preset => (
                  <button key={preset.id} type="button" onClick={() => applyCategoryPreset(preset)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  ><Bookmark size={12} fill="currentColor" /> {preset.name}</button>
                ))}
                {(() => {
                  const allCatNames = allCategories.filter(c => c.isActive !== false).map(c => c.name);
                  const currentCats = Array.isArray(formData.category) ? formData.category : (formData.category ? formData.category.split(', ') : []);
                  const isAllSelected = currentCats.length === allCatNames.length && allCatNames.length > 0;
                  const isNoneSelected = currentCats.length === 0;

                  return (
                    <>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (isAllSelected) {
                            setFormData(prev => ({ ...prev, category: [], subcategory: [] }));
                          } else {
                            const allSubcatNames = Object.values(subcategories).flat();
                            setFormData(prev => ({ ...prev, category: allCatNames, subcategory: allSubcatNames }));
                          }
                        }}
                        style={{ 
                          background: isAllSelected ? '#fff0f6' : '#f8fafc', 
                          border: isAllSelected ? '1px solid #fbcfe8' : '1px solid #e2e8f0', 
                          borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', 
                          color: isAllSelected ? 'var(--brand-pink)' : '#475569', fontWeight: 500, transition: 'all 0.2s' 
                        }}
                        onMouseOver={(e) => {
                          if (!isAllSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseOut={(e) => {
                          if (!isAllSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                      >
                        Select All
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (isNoneSelected) {
                            const allSubcatNames = Object.values(subcategories).flat();
                            setFormData(prev => ({ ...prev, category: allCatNames, subcategory: allSubcatNames }));
                          } else {
                            setFormData(prev => ({ ...prev, category: [], subcategory: [] }));
                          }
                        }}
                        style={{ 
                          background: isNoneSelected ? '#fff0f6' : '#f8fafc', 
                          border: isNoneSelected ? '1px solid #fbcfe8' : '1px solid #e2e8f0', 
                          borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', 
                          color: isNoneSelected ? 'var(--brand-pink)' : '#475569', fontWeight: 500, transition: 'all 0.2s' 
                        }}
                        onMouseOver={(e) => {
                          if (!isNoneSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseOut={(e) => {
                          if (!isNoneSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                      >
                        Unselect All
                      </button>
                      {/* Save Preset */}
                      <button type="button" onClick={saveCategoryPreset}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#db2777', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        onMouseOver={e => e.currentTarget.style.background = '#fce7f3'}
                        onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}
                      ><Bookmark size={12} /> Save Preset</button>
                      {/* Manage Presets */}
                      <button type="button" onClick={() => setShowManageCategoryPresetsModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                      ><Settings2 size={12} /> Manage</button>
                    </>
                  );
                })()}
              </div>
            </div>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              {allCategories.filter(c => c.isActive !== false).map(catObj => {
                const cat = catObj.name;
                const subcatsList = categories[cat] || [];
                const currentCats = Array.isArray(formData.category) ? formData.category : (formData.category ? formData.category.split(', ') : []);
                const currentSubcats = Array.isArray(formData.subcategory) ? formData.subcategory : (formData.subcategory ? formData.subcategory.split(', ') : []);
                const isCatChecked = currentCats.includes(cat);
                const allProducts = getAllProducts();
                const catProductCount = allProducts.filter(p => Array.isArray(p.category) ? p.category.includes(cat) : p.category === cat).length;
                
                return (
                  <div key={cat}>
                    <div 
                      onClick={(e) => {
                        if (subcatsList.length > 0) {
                          setExpandedCats(prev => {
                            if (prev[cat]) return { ...prev, [cat]: false };
                            return { [cat]: true }; // close others, open this
                          });
                        } else {
                          const newCats = !isCatChecked 
                            ? [...currentCats, cat] 
                            : currentCats.filter(c => c !== cat);
                          setFormData(prev => ({ ...prev, category: newCats }));
                        }
                      }}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: isCatChecked ? '1px solid var(--brand-pink)' : '1px solid transparent',
                        backgroundColor: isCatChecked ? '#fff0f6' : 'transparent',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        boxSizing: 'border-box'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isCatChecked ? '#fff0f6' : '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = isCatChecked ? '#fff0f6' : 'transparent'}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '14px',
                        color: isCatChecked ? 'var(--brand-pink)' : '#334155',
                        fontWeight: isCatChecked ? 600 : 500
                      }}>
                        <input 
                          type="checkbox" 
                          checked={isCatChecked}
                          onChange={(e) => {
                            const newCats = e.target.checked 
                              ? [...currentCats, cat] 
                              : currentCats.filter(c => c !== cat);
                            setFormData(prev => ({ ...prev, category: newCats }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="custom-checkbox"
                          style={{ cursor: 'pointer' }}
                        />
                        {catObj.icon && (
                          <i className={catObj.icon} style={{ fontSize: '18px', color: isCatChecked ? 'var(--brand-pink)' : '#94a3b8' }}></i>
                        )}
                        {cat}
                        <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '4px' }}>({subcatsList.filter(s => s.isActive !== false).length})</span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
                        {catProductCount} {catProductCount === 1 ? 'Product' : 'Products'}
                      </div>
                    </div>
                    
                    {/* Subcategories (Indented & Collapsible) */}
                    {expandedCats[cat] && (
                    <div style={{ paddingLeft: '34px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {subcatsList.filter(s => s.isActive !== false).length > 0 && subcatsList.filter(s => s.isActive !== false).map(sub => {
                        const subName = sub.name || sub; // fallback if sub is just a string
                        const isSubChecked = currentSubcats.includes(subName);
                        const subProductCount = allProducts.filter(p => Array.isArray(p.subcategory) ? p.subcategory.includes(subName) : p.subcategory === subName).length;
                        return (
                          <div key={subName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div 
                              onClick={(e) => {
                                const newSubcats = !isSubChecked 
                                  ? [...currentSubcats, subName]
                                  : currentSubcats.filter(s => s !== subName);
                                
                                let newCats = [...currentCats];
                                if (!isSubChecked && !newCats.includes(cat)) {
                                  newCats.push(cat);
                                }

                                setFormData(prev => ({ 
                                  ...prev, 
                                  subcategory: newSubcats,
                                  category: newCats
                                }));
                              }}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                fontSize: '13.5px', 
                                color: isSubChecked ? 'var(--brand-pink)' : '#64748b', 
                                cursor: 'pointer', 
                                fontWeight: isSubChecked ? 500 : 400,
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: isSubChecked ? '1px solid var(--brand-pink)' : '1px solid transparent',
                                backgroundColor: isSubChecked ? '#fff0f6' : 'transparent',
                                width: '100%',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = isSubChecked ? '#fff0f6' : '#f8fafc'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = isSubChecked ? '#fff0f6' : 'transparent'}
                            >
                              <input 
                                type="checkbox" 
                                checked={isSubChecked}
                                onChange={(e) => {
                                  const newSubcats = e.target.checked 
                                    ? [...currentSubcats, subName]
                                    : currentSubcats.filter(s => s !== subName);
                                  
                                  let newCats = [...currentCats];
                                  if (e.target.checked && !newCats.includes(cat)) {
                                    newCats.push(cat);
                                  } else if (!e.target.checked) {
                                    const hasOtherSubcatsChecked = subcatsList.some(s => {
                                      const sName = s.name || s;
                                      return sName !== subName && newSubcats.includes(sName);
                                    });
                                    if (!hasOtherSubcatsChecked) {
                                      newCats = newCats.filter(c => c !== cat);
                                    }
                                  }

                                  setFormData(prev => ({ 
                                    ...prev, 
                                    subcategory: newSubcats,
                                    category: newCats
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="custom-checkbox"
                                style={{ cursor: 'pointer' }}
                              />
                              {subName}
                              <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: 'auto' }}>{subProductCount} {subProductCount === 1 ? 'Product' : 'Products'}</span>
                            </div>
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
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Special Placements</h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Sticky preset chips */}
                {placementPresets.filter(p => p.isSticky).map(preset => (
                  <button key={preset.id} type="button" onClick={() => applyPlacementPreset(preset)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  ><Bookmark size={12} fill="currentColor" /> {preset.name}</button>
                ))}
                {/* Select All */}
                <button type="button"
                  onClick={() => setFormData(prev => ({ ...prev, placements: [...ALL_PLACEMENTS] }))}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseOver={e => e.currentTarget.style.background = '#dcfce7'}
                  onMouseOut={e => e.currentTarget.style.background = '#f0fdf4'}
                ><i className="las la-check-double" style={{ fontSize: '14px' }} /> Select All</button>
                {/* Clear All */}
                <button type="button"
                  onClick={() => setFormData(prev => ({ ...prev, placements: [] }))}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#fff'; }}
                ><i className="las la-times-circle" style={{ fontSize: '14px' }} /> Clear All</button>
                {/* Save Preset */}
                <button type="button" onClick={savePlacementPreset}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#db2777', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fce7f3'}
                  onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}
                ><Bookmark size={12} /> Save Preset</button>
                {/* Manage Presets */}
                <button type="button" onClick={() => setShowManagePlacementPresetsModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                ><Settings2 size={12} /> Manage</button>
              </div>
            </div>

            {(() => {
              const currentPlacements = Array.isArray(formData.placements) ? formData.placements : (formData.placements ? formData.placements.split(', ') : []);
              const toggle = (name) => {
                const newPlacements = currentPlacements.includes(name)
                  ? currentPlacements.filter(p => p !== name)
                  : [...currentPlacements, name];
                setFormData(prev => ({ ...prev, placements: newPlacements }));
              };
              const Chip = ({ name, icon, emoji, imgSrc }) => {
                const isChecked = currentPlacements.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggle(name)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '7px 14px', borderRadius: '20px',
                      border: isChecked ? '2px solid #E43292' : '1px solid #e2e8f0',
                      background: isChecked ? '#fdf2f8' : '#fff',
                      color: isChecked ? '#E43292' : '#475569',
                      fontSize: '13px', fontWeight: isChecked ? 700 : 500,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      boxShadow: isChecked ? '0 2px 8px rgba(228,50,146,0.12)' : '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                    onMouseOver={e => { if (!isChecked) { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#1e293b'; } }}
                    onMouseOut={e => { if (!isChecked) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; } }}
                  >
                    {imgSrc ? (
                      <img src={imgSrc} alt="" style={{ width: '16px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                    ) : emoji ? (
                      <span style={{ fontSize: '15px', lineHeight: 1 }}>{emoji}</span>
                    ) : icon && (
                      <i className={icon} style={{ fontSize: '15px' }} />
                    )}
                    {name}
                  </button>
                );
              };
              return (
                <>
                  {/* Sub-section 1: Publish In — actual homepage sections */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                        <i className="las la-map-marker" style={{ fontSize: '13px', marginRight: '4px' }} />
                        Publish In
                      </span>
                      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <Chip name="All Products"    icon="las la-shopping-bag" />
                      <Chip name="Free Shipping"   icon="las la-truck" />
                      <Chip name="Choice"          icon="las la-check-circle" />
                      <Chip name="Cash on Delivery" icon="las la-money-bill-wave" />
                      <Chip name="24h Delivery"    icon="las la-clock" />
                      <Chip name="Flash Sale"      icon="las la-bolt" />
                      <Chip name="Global Shop"     icon="las la-globe" />
                      <Chip name="Factory Direct"  icon="las la-industry" />
                    </div>
                  </div>

                  {/* Sub-section 2: Product Tags — badges shown on product cards */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                        <i className="las la-tag" style={{ fontSize: '13px', marginRight: '4px' }} />
                        Product Tags
                      </span>
                      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <Chip name="Top Trends"  icon="las la-chart-line" />
                      <Chip name="Global Shop" icon="las la-globe" />
                      <Chip name="Local"       imgSrc="https://flagcdn.com/w20/bd.png" />
                      <Chip name="Factory"     icon="las la-industry" />
                      <Chip name="China"       imgSrc="https://flagcdn.com/w20/cn.png" />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Advanced Combo Offer */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: formData.enableComboOffer ? '20px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="las la-boxes" style={{ fontSize: '20px', color: '#E43292' }}></i>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Combo Offer (Advanced)</h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {formData.enableComboOffer && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {savedComboPresets.filter(p => p.isSticky).map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, comboTitle: preset.comboTitle, comboLinkedProducts: preset.comboLinkedProducts, comboDescription: preset.comboDescription, comboTiers: preset.comboTiers || [] }))}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                        onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                      >
                        <Bookmark size={14} fill="currentColor" /> {preset.name}
                      </button>
                    ))}
                    <button type="button" onClick={() => {
                       const name = window.prompt("Enter a name for this Combo Preset:", "My Combo Offer");
                       if (name && name.trim()) {
                         const newPreset = {
                           id: Date.now().toString(),
                           name: name.trim(),
                           comboTiers: formData.comboTiers
                         };
                         const updated = [...savedComboPresets, newPreset];
                         setSavedComboPresets(updated);
                         localStorage.setItem('savedComboPresets', JSON.stringify(updated));
                       }
                    }} style={{ background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#fce7f3'} onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}>
                      <Bookmark size={14} /> Save Preset
                    </button>
                    <button type="button" onClick={() => setShowComboPresetsModal(true)} style={{ background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                      <Settings2 size={14} /> Manage Presets
                    </button>
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Enable Combo Offer</span>
                  <input
                    type="checkbox"
                    checked={formData.enableComboOffer || false}
                    onChange={e => setFormData(prev => ({ ...prev, enableComboOffer: e.target.checked }))}
                    style={{ width: '16px', height: '16px', accentColor: '#E43292', cursor: 'pointer' }}
                  />
                </label>
              </div>
            </div>
            
            {formData.enableComboOffer && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discount Tiers</label>
                  {(formData.comboTiers || []).map((tier, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr auto', gap: '12px', alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px', display: 'block' }}>Min. Quantity</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 2"
                          value={tier.minQty || ''}
                          onChange={e => {
                            const newTiers = [...(formData.comboTiers || [])];
                            newTiers[idx].minQty = e.target.value;
                            setFormData(prev => ({ ...prev, comboTiers: newTiers }));
                          }}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px', display: 'block' }}>Discount Type</span>
                        <select
                          className="form-control"
                          value={tier.discountType || 'percentage'}
                          onChange={e => {
                            const newTiers = [...(formData.comboTiers || [])];
                            newTiers[idx].discountType = e.target.value;
                            setFormData(prev => ({ ...prev, comboTiers: newTiers }));
                          }}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', appearance: 'auto' }}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (৳)</option>
                          <option value="free_shipping">Free Shipping</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px', display: 'block' }}>Discount Value</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 10"
                          value={tier.discountValue || ''}
                          onChange={e => {
                            const newTiers = [...(formData.comboTiers || [])];
                            newTiers[idx].discountValue = e.target.value;
                            setFormData(prev => ({ ...prev, comboTiers: newTiers }));
                          }}
                          disabled={tier.discountType === 'free_shipping'}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', background: tier.discountType === 'free_shipping' ? '#f1f5f9' : '#fff' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newTiers = (formData.comboTiers || []).filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, comboTiers: newTiers }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                          onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseOut={e => e.currentTarget.style.background = 'none'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newTiers = [...(formData.comboTiers || []), { minQty: '', discountType: 'percentage', discountValue: '' }];
                      setFormData(prev => ({ ...prev, comboTiers: newTiers }));
                    }}
                    style={{ alignSelf: 'flex-start', background: '#fff', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#475569'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <Plus size={14} /> Add Another Tier
                  </button>
                </div>

                <div style={{ marginTop: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apply Combo Offer To</label>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="comboTarget" 
                        checked={formData.comboTarget === 'this_product' || !formData.comboTarget}
                        onChange={() => setFormData(prev => ({ ...prev, comboTarget: 'this_product' }))}
                        style={{ accentColor: '#E43292', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      This Product Only
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="comboTarget" 
                        checked={formData.comboTarget === 'all_products'}
                        onChange={() => setFormData(prev => ({ ...prev, comboTarget: 'all_products' }))}
                        style={{ accentColor: '#E43292', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      All Products in Store
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="comboTarget" 
                        checked={formData.comboTarget === 'specific_products'}
                        onChange={() => setFormData(prev => ({ ...prev, comboTarget: 'specific_products' }))}
                        style={{ accentColor: '#E43292', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Specific Products...
                    </label>
                  </div>
                  
                  {formData.comboTarget === 'specific_products' && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ position: 'relative' }}>
                        <i className="las la-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '18px' }}></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search products to link or enter Product IDs (e.g. #1042, #1043)"
                          value={formData.comboLinkedProducts || ''}
                          onChange={e => setFormData(prev => ({ ...prev, comboLinkedProducts: e.target.value }))}
                          style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = '#E43292'}
                          onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                        />
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#64748b' }}>Selected products will also share this tiered discount.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shipping & Delivery */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Shipping & Policies</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {savedShippingPresets.filter(p => p.isSticky).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                          ...prev,
                          deliveryBannerType: preset.deliveryBannerType,
                          paymentOption: preset.paymentOption || 'cod',
                          showSameDayDelivery: preset.showSameDayDelivery || false
                      }));
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  >
                    <Bookmark size={14} fill="currentColor" /> {preset.name}
                  </button>
                ))}
                <button type="button" onClick={() => {
                   const name = window.prompt("Enter a name for this Shipping Preset:", "My Shipping Setup");
                   if (name && name.trim()) {
                     const newPreset = {
                       id: Date.now().toString(),
                       name: name.trim(),
                       deliveryBannerType: formData.deliveryBannerType,
                       paymentOption: formData.paymentOption,
                       showSameDayDelivery: formData.showSameDayDelivery
                     };
                     const updated = [...savedShippingPresets, newPreset];
                     setSavedShippingPresets(updated);
                     localStorage.setItem('savedShippingPresets', JSON.stringify(updated));
                   }
                }} style={{ background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#fce7f3'} onMouseOut={e => e.currentTarget.style.background = '#fdf2f8'}>
                  <Bookmark size={14} /> Save Preset
                </button>
                <button type="button" onClick={() => setShowShippingPresetsModal(true)} style={{ background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                  <Settings2 size={14} /> Manage Presets
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(() => {
                const selectedDeliveryForSameDay = deliveryLibrary.find(d => d.id === formData.deliveryBannerType);
                const isLocalDeliveryActive = !formData.deliveryBannerType || (selectedDeliveryForSameDay && selectedDeliveryForSameDay.type === 'domestic') || formData.deliveryBannerType === '24-48h' || formData.deliveryBannerType === '1-5days';
                const isOn = formData.showSameDayDelivery === true && isLocalDeliveryActive;
                return (
                  <div
                    style={{
                      opacity: isLocalDeliveryActive ? 1 : 0.4,
                      pointerEvents: isLocalDeliveryActive ? 'auto' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '24px',
                      padding: '14px 18px',
                      border: isOn ? '2px solid #E43292' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      background: isOn ? '#fdf2f8' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      userSelect: 'none',
                      boxShadow: isOn ? '0 4px 12px rgba(228,50,146,0.12)' : '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onClick={(e) => {
                      if (isEditingSameDay) return;
                      setFormData(prev => ({ ...prev, showSameDayDelivery: !prev.showSameDayDelivery }));
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === ' ' || e.key === 'Enter') && !isEditingSameDay)
                        setFormData(prev => ({ ...prev, showSameDayDelivery: !prev.showSameDayDelivery }));
                    }}
                  >
                    {/* Pill switch */}
                    <div
                      style={{
                        width: '44px', height: '24px', borderRadius: '12px',
                        background: isOn ? '#E43292' : '#cbd5e1',
                        position: 'relative', transition: 'background 0.25s ease', flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute', top: '3px',
                          left: isOn ? '23px' : '3px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                          transition: 'left 0.25s ease'
                        }}
                      />
                    </div>

                    {/* Icon */}
                    <i
                      className="las la-clock"
                      style={{
                        fontSize: '20px',
                        color: isOn ? '#E43292' : '#94a3b8',
                        transition: 'color 0.25s ease'
                      }}
                    />

                    {/* Label */}
                    <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                      {isEditingSameDay ? (
                        <input
                          type="text"
                          value={tempSameDayLabel}
                          onChange={(e) => setTempSameDayLabel(e.target.value)}
                          style={{
                            width: '100%', padding: '4px 8px',
                            border: '1px solid #cbd5e1', borderRadius: '4px',
                            fontSize: '14px', fontWeight: 600, outline: 'none'
                          }}
                          autoFocus
                        />
                      ) : (
                        <>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: isOn ? '#831843' : '#334155', transition: 'color 0.25s ease' }}>
                            {sameDayDeliveryLabel}
                          </div>
                          <div style={{ fontSize: '12px', color: isOn ? '#E43292' : '#94a3b8', marginTop: '2px', transition: 'color 0.25s ease' }}>
                            {isOn ? 'Enabled — shown on domestic orders only' : 'Disabled — not shown to customers'}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Edit / Save / Cancel */}
                    {isEditingSameDay ? (
                      <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => {
                          setSameDayDeliveryLabel(tempSameDayLabel);
                          localStorage.setItem('sameDayDeliveryLabel', tempSameDayLabel);
                          setIsEditingSameDay(false);
                        }} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                        <button type="button" onClick={() => {
                          setTempSameDayLabel(sameDayDeliveryLabel);
                          setIsEditingSameDay(false);
                        }} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        {isOn && (
                          <span style={{
                            background: '#fce7f3', color: '#E43292',
                            fontSize: '11px', fontWeight: 700,
                            padding: '3px 8px', borderRadius: '20px',
                            letterSpacing: '0.5px', textTransform: 'uppercase', flexShrink: 0
                          }}>ON</span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setIsEditingSameDay(true); }}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', flexShrink: 0 }}
                        >
                          <Edit size={14} />
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Free Shipping Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  border: formData.freeShipping ? '2px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: formData.freeShipping ? '#f0fdf4' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  userSelect: 'none',
                  boxShadow: formData.freeShipping ? '0 4px 12px rgba(16,185,129,0.12)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onClick={() => setFormData(prev => ({ ...prev, freeShipping: !prev.freeShipping }))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setFormData(prev => ({ ...prev, freeShipping: !prev.freeShipping })); }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: formData.freeShipping ? '#10b981' : '#cbd5e1',
                    position: 'relative',
                    transition: 'background 0.25s ease',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: formData.freeShipping ? '23px' : '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                      transition: 'left 0.25s ease'
                    }}
                  />
                </div>
                <i
                  className="las la-shipping-fast"
                  style={{
                    fontSize: '20px',
                    color: formData.freeShipping ? '#10b981' : '#94a3b8',
                    transition: 'color 0.25s ease'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: formData.freeShipping ? '#065f46' : '#334155', transition: 'color 0.25s ease' }}>
                    Free Shipping
                  </div>
                  <div style={{ fontSize: '12px', color: formData.freeShipping ? '#10b981' : '#94a3b8', marginTop: '2px', transition: 'color 0.25s ease' }}>
                    {formData.freeShipping ? 'Enabled — displayed as a badge on the product' : 'Disabled — standard shipping charges apply'}
                  </div>
                </div>
                {formData.freeShipping && (
                  <span style={{
                    background: '#dcfce7',
                    color: '#16a34a',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    flexShrink: 0
                  }}>ON</span>
                )}
              </div>


                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {(() => {
                    const domestic = deliveryLibrary.filter(p => p.type === 'domestic' || p.id === '24-48h' || p.id === '1-5days');
                    const global = deliveryLibrary.filter(p => p.type === 'global' || p.id === 'global');
                    const selectedDelivery = deliveryLibrary.find(d => d.id === formData.deliveryBannerType);
                    const isLocal = !formData.deliveryBannerType || (selectedDelivery && selectedDelivery.type === 'domestic') || formData.deliveryBannerType === '24-48h' || formData.deliveryBannerType === '1-5days';
                    
                    const renderPaymentPolicies = (isLocalBlock) => (
                      <div style={{ marginTop: '16px', paddingLeft: '16px', borderLeft: '2px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Policy ({isLocalBlock ? 'Local' : 'International'})</div>
                          <button type="button" onClick={() => { setPoliciesModalType('payment'); setShowPoliciesModal(true); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} title="Manage Options"><Settings2 size={16}/></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {paymentLibrary.map(policy => {
                            if (isLocalBlock && policy.id === 'partial_advance') return null;
                            if (!isLocalBlock && policy.id === 'cod') return null;

                            const currentOptions = Array.isArray(formData.paymentOption) ? formData.paymentOption : [formData.paymentOption].filter(Boolean);
                            const isSelected = currentOptions.includes(policy.id) || (currentOptions.length === 0 && (isLocalBlock ? policy.id === 'cod' : policy.id === 'pay_now'));
                            
                            return (
                              <label key={policy.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px', border: isSelected ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0', borderRadius: '12px', background: isSelected ? '#fff0f6' : '#fff', transition: 'all 0.2s ease', boxShadow: isSelected ? '0 4px 12px rgba(228, 50, 146, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <input 
                                   type="checkbox" 
                                   name="paymentOption" 
                                   value={policy.id} 
                                   checked={isSelected} 
                                   onChange={(e) => {
                                     const val = e.target.value;
                                     setFormData(prev => {
                                       let current = Array.isArray(prev.paymentOption) ? prev.paymentOption : [prev.paymentOption].filter(Boolean);
                                       if (e.target.checked) {
                                         return { ...prev, paymentOption: [...current, val] };
                                       } else {
                                         return { ...prev, paymentOption: current.filter(item => item !== val) };
                                       }
                                     });
                                   }} 
                                   style={{ accentColor: '#E43292', width: '18px', height: '18px' }} 
                                />
                                <span style={{ fontSize: '14px', color: isSelected ? '#1e293b' : '#475569', fontWeight: isSelected ? 600 : 500 }}>{policy.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
                        {domestic.length > 0 && (
                          <div style={{ border: isLocal ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: isLocal ? '#fff' : '#f8fafc', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', opacity: isLocal ? 1 : 0.7, boxShadow: isLocal ? '0 8px 24px rgba(228, 50, 146, 0.08)' : 'none' }}>
                            {isLocal && <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--brand-pink)' }}></div>}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isLocal ? 'var(--brand-pink)' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', boxShadow: isLocal ? '0 4px 10px rgba(228, 50, 146, 0.2)' : 'none' }}>1</div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: isLocal ? '#1e293b' : '#64748b' }}>Domestic Shipping & Payment Policy</h4>
                              </div>
                              <button type="button" onClick={() => { setPoliciesModalType('delivery_domestic'); setShowPoliciesModal(true); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} title="Manage Options" onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'none'}><Settings2 size={20}/></button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '52px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Method</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {domestic.map(policy => {
                                  const isSelected = formData.deliveryBannerType === policy.id || (!formData.deliveryBannerType && policy.id === '24-48h');
                                  return (
                                    <label key={policy.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px', border: isSelected ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0', borderRadius: '12px', background: isSelected ? '#fff0f6' : '#fff', transition: 'all 0.2s ease', boxShadow: isSelected ? '0 4px 12px rgba(228, 50, 146, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)' }}>
                                      <input type="radio" name="deliveryBannerType" value={policy.id} checked={isSelected} onChange={(e) => setFormData(prev => ({...prev, deliveryBannerType: e.target.value, isCreatingCustomDelivery: false}))} style={{ accentColor: '#E43292', width: '20px', height: '20px' }} />
                                      <span style={{ fontSize: '15px', color: isSelected ? '#1e293b' : '#475569', fontWeight: isSelected ? 600 : 500 }}>{policy.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              
                              {isLocal && (
                                <>
                                  <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Policy (Local)</div>
                                    <button type="button" onClick={() => { setPoliciesModalType('payment_local'); setShowPoliciesModal(true); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Manage Options"><Settings2 size={16}/></button>
                                  </div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {paymentLibraryLocal.map(policy => {
                                      const currentOptions = Array.isArray(formData.paymentOption) ? formData.paymentOption : [formData.paymentOption].filter(Boolean);
                                      const isSelected = currentOptions.includes(policy.id) || (currentOptions.length === 0 && policy.id === 'cod');
                                      const pStyle = getPaymentStyle(policy.id, policy.label);
                                      return (
                                        <label key={policy.id} style={{ flex: '1 1 120px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 14px', border: isSelected ? `2px solid ${pStyle.color}` : '1px solid #e2e8f0', borderRadius: '10px', background: isSelected ? pStyle.bg : '#fff', transition: 'all 0.2s ease', boxShadow: isSelected ? `0 4px 12px ${pStyle.color}40` : '0 2px 4px rgba(0,0,0,0.02)' }}>
                                          <input 
                                            type="checkbox" 
                                            name="paymentOption" 
                                            value={policy.id} 
                                            checked={isSelected} 
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setFormData(prev => {
                                                let current = Array.isArray(prev.paymentOption) ? prev.paymentOption : [prev.paymentOption].filter(Boolean);
                                                if (e.target.checked) {
                                                  return { ...prev, paymentOption: [...current, val] };
                                                } else {
                                                  return { ...prev, paymentOption: current.filter(item => item !== val) };
                                                }
                                              });
                                            }} 
                                            style={{ display: 'none' }} 
                                          />
                                          <i className={pStyle.icon} style={{ fontSize: '18px', color: isSelected ? pStyle.color : '#94a3b8' }}></i>
                                          <span style={{ fontSize: '13px', color: isSelected ? pStyle.color : '#475569', fontWeight: isSelected ? 600 : 500, lineHeight: '1.2' }}>{policy.label}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {global.length > 0 && (
                          <div style={{ border: !isLocal ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: !isLocal ? '#fff' : '#f8fafc', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', opacity: !isLocal ? 1 : 0.7, boxShadow: !isLocal ? '0 8px 24px rgba(228, 50, 146, 0.08)' : 'none' }}>
                            {!isLocal && <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--brand-pink)' }}></div>}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: !isLocal ? 'var(--brand-pink)' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', boxShadow: !isLocal ? '0 4px 10px rgba(228, 50, 146, 0.2)' : 'none' }}>2</div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: !isLocal ? '#1e293b' : '#64748b' }}>International Shipping & Payment Policy</h4>
                              </div>
                              <button type="button" onClick={() => { setPoliciesModalType('delivery_global'); setShowPoliciesModal(true); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} title="Manage Options" onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'none'}><Settings2 size={20}/></button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '52px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Method</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {global.map(policy => {
                                  const isSelected = formData.deliveryBannerType === policy.id;
                                  return (
                                    <label key={policy.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px', border: isSelected ? '2px solid var(--brand-pink)' : '1px solid #e2e8f0', borderRadius: '12px', background: isSelected ? '#fff0f6' : '#fff', transition: 'all 0.2s ease', boxShadow: isSelected ? '0 4px 12px rgba(228, 50, 146, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)' }}>
                                      <input type="radio" name="deliveryBannerType" value={policy.id} checked={isSelected} onChange={(e) => setFormData(prev => ({...prev, deliveryBannerType: e.target.value, isCreatingCustomDelivery: false}))} style={{ accentColor: '#E43292', width: '20px', height: '20px' }} />
                                      <span style={{ fontSize: '15px', color: isSelected ? '#1e293b' : '#475569', fontWeight: isSelected ? 600 : 500 }}>{policy.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              
                              {!isLocal && (
                                <>
                                  <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Policy (International)</div>
                                    <button type="button" onClick={() => { setPoliciesModalType('payment_global'); setShowPoliciesModal(true); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Manage Options"><Settings2 size={16}/></button>
                                  </div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {paymentLibraryGlobal.map(policy => {
                                      const currentOptions = Array.isArray(formData.paymentOption) ? formData.paymentOption : [formData.paymentOption].filter(Boolean);
                                      const isSelected = currentOptions.includes(policy.id) || (currentOptions.length === 0 && policy.id === 'pay_now');
                                      const pStyle = getPaymentStyle(policy.id, policy.label);
                                      return (
                                        <label key={policy.id} style={{ flex: '1 1 120px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 14px', border: isSelected ? `2px solid ${pStyle.color}` : '1px solid #e2e8f0', borderRadius: '10px', background: isSelected ? pStyle.bg : '#fff', transition: 'all 0.2s ease', boxShadow: isSelected ? `0 4px 12px ${pStyle.color}40` : '0 2px 4px rgba(0,0,0,0.02)' }}>
                                          <input 
                                            type="checkbox" 
                                            name="paymentOption" 
                                            value={policy.id} 
                                            checked={isSelected} 
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setFormData(prev => {
                                                let current = Array.isArray(prev.paymentOption) ? prev.paymentOption : [prev.paymentOption].filter(Boolean);
                                                if (e.target.checked) {
                                                  return { ...prev, paymentOption: [...current, val] };
                                                } else {
                                                  return { ...prev, paymentOption: current.filter(item => item !== val) };
                                                }
                                              });
                                            }} 
                                            style={{ display: 'none' }} 
                                          />
                                          <i className={pStyle.icon} style={{ fontSize: '18px', color: isSelected ? pStyle.color : '#94a3b8' }}></i>
                                          <span style={{ fontSize: '13px', color: isSelected ? pStyle.color : '#475569', fontWeight: isSelected ? 600 : 500, lineHeight: '1.2' }}>{policy.label}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
            </div>
          </div>

          {/* Organization */}
          <div className="form-section" style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Organization</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {orgPresets.filter(p => p.isSticky).map((preset, idx) => (
                  <button
                    key={preset.name || idx}
                    type="button"
                    onClick={() => applyOrgPreset(preset)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                  >
                    <Bookmark size={14} fill="currentColor" /> {preset.name}
                  </button>
                ))}
                <button 
                  type="button" 
                  onClick={clearOrgData}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef2f2', border: '1px solid #f87171', color: '#ef4444', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#f87171'; }}
                >
                  <Trash2 size={14} /> Clear Data
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowSaveOrgPresetModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <Bookmark size={14} /> Save Preset
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowManageOrgPresetsModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <Settings2 size={14} /> Manage Presets
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">
                  Brand
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="las la-tag" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '18px' }}></i>
                  <input type="text" list="brands-list" name="brand" className="form-input" placeholder="Select or type brand name" value={formData.brand} onChange={(e) => {
                    handleChange(e);
                    if (e.target.value && !savedBrands.includes(e.target.value)) {
                      const newBrands = [...savedBrands, e.target.value];
                      setSavedBrands(newBrands);
                      localStorage.setItem('savedBrands', JSON.stringify(newBrands));
                    }
                  }} style={{ paddingLeft: '38px', borderRadius: '8px' }} />
                  <datalist id="brands-list">
                    {savedBrands.map(b => <option key={b} value={b} />)}
                  </datalist>
                </div>
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Vendor Location</label>
                <div style={{ position: 'relative' }}>
                  <i className="las la-map-marker-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '18px' }}></i>
                  <input type="text" list="locations-list" name="vendorLocation" className="form-input" placeholder="e.g. Dhaka, Bangladesh" value={formData.vendorLocation || ''} onChange={(e) => {
                    handleChange(e);
                    if (e.target.value && !savedLocations.includes(e.target.value)) {
                      const newLocs = [...savedLocations, e.target.value];
                      setSavedLocations(newLocs);
                      localStorage.setItem('savedLocations', JSON.stringify(newLocs));
                    }
                  }} style={{ paddingLeft: '38px', borderRadius: '8px' }} />
                  <datalist id="locations-list">
                    {savedLocations.map(l => <option key={l} value={l} />)}
                  </datalist>
                </div>
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">
                  Vendor / Seller
                </label>

                {/* Quick-select vendor chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {[
                    { id: 'ourgoods', name: 'OURGOODS' },
                    ...vendorsList.map(v => ({ id: v.id || v.name, name: v.name }))
                  ]
                    .filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i)
                    .map(vendor => {
                      const isActive = formData.vendor === vendor.name;
                      return (
                        <button
                          key={vendor.id}
                          type="button"
                          onClick={() => {
                            const selected = vendorsList.find(v => v.name === vendor.name);
                            setFormData(prev => ({
                              ...prev,
                              vendor: vendor.name,
                              ...(selected ? { vendorLocation: 'Dhaka, Bangladesh', brand: selected.name } : {})
                            }));
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isActive ? '2px solid #E43292' : '1px solid #e2e8f0',
                            background: isActive ? '#fdf2f8' : '#fff',
                            color: isActive ? '#E43292' : '#475569',
                            fontSize: '13px',
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isActive ? '0 2px 8px rgba(228,50,146,0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
                          }}
                          onMouseOver={e => { if (!isActive) { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#1e293b'; } }}
                          onMouseOut={e => { if (!isActive) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; } }}
                        >
                          <i className="las la-store" style={{ fontSize: '15px' }} />
                          {vendor.name}
                        </button>
                      );
                    })
                  }
                </div>

                <div style={{ position: 'relative' }}>
                  <i className="las la-store" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '18px', zIndex: 1 }}></i>
                  <input 
                    type="text"
                    list="vendors-list"
                    className="form-input" 
                    name="vendor" 
                    placeholder="e.g. OURGOODS, Zara, TechHaven"
                    value={formData.vendor || ''} 
                    onChange={(e) => {
                      handleChange(e);
                      const selected = vendorsList.find(v => v.name === e.target.value);
                      if (selected) {
                        setFormData(prev => ({
                          ...prev,
                          vendorLocation: 'Dhaka, Bangladesh',
                          brand: selected.name,
                        }));
                      }
                    }}
                    style={{ paddingLeft: '38px', borderRadius: '8px' }}
                  />
                  <datalist id="vendors-list">
                    <option value="OURGOODS" />
                    {vendorsList.map(vendor => (
                      <option key={vendor.id || vendor.name} value={vendor.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  Tags
                </label>
                
                {/* Preset Tags Library */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {presetTags.filter(ptag => {
                    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                    return !currentTags.includes(ptag);
                  }).map(ptag => (
                    <button 
                      key={ptag}
                      type="button"
                      onClick={() => {
                        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                        if (!currentTags.includes(ptag)) {
                          setFormData(prev => ({ ...prev, tags: [...currentTags, ptag].join(', ') }));
                        }
                      }}
                      style={{ 
                        fontSize: '11px', padding: '4px 8px', borderRadius: '4px', 
                        border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      + {ptag}
                    </button>
                  ))}
                </div>

                <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '8px', minHeight: '44px', display: 'flex', flexWrap: 'wrap', gap: '8px', backgroundColor: '#fff', alignItems: 'center' }}>
                  {formData.tags && formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).map((tag, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {tag}
                      <i className="las la-times" style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => {
                        const newTags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tag).join(', ');
                        setFormData(prev => ({ ...prev, tags: newTags }));
                      }}></i>
                    </div>
                  ))}
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        if (tagInput.trim()) {
                          const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                          if (!currentTags.includes(tagInput.trim())) {
                            setFormData(prev => ({ ...prev, tags: [...currentTags, tagInput.trim()].join(', ') }));
                          }
                          setTagInput('');
                        }
                      }
                    }}
                    placeholder={!formData.tags ? "Type a custom tag and press Enter" : "Add more tags..."}
                    style={{ border: 'none', outline: 'none', flex: 1, minWidth: '120px', fontSize: '13px', background: 'transparent' }}
                  />
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
                <label className="form-label">SEO Title <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '8px' }}>(Not connected to frontend yet)</span></label>
                <input type="text" name="seoTitle" className="form-input" placeholder="Meta Title" value={formData.seoTitle} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">SEO Description <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '8px' }}>(Not connected to frontend yet)</span></label>
                <textarea name="seoDescription" className="form-input" rows="3" placeholder="Meta Description" value={formData.seoDescription} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showMediaManager && (
        <MediaManagerModal 
          show={true}
          onClose={() => setShowMediaManager(false)}
          onSelect={handleMediaSelect}
          initialSelected={images.map(img => typeof img === 'string' ? img : (img.id || img.url)).filter(Boolean)}
        />
      )}

      {showPoliciesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPoliciesModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>
                {policiesModalType === 'delivery_domestic' ? 'Domestic Delivery Options' : 
                 policiesModalType === 'delivery_global' ? 'Global Delivery Options' : 
                 policiesModalType === 'delivery_other' ? 'Other Delivery Options' : 'Payment Policy Library'}
              </h3>
              <button onClick={() => setShowPoliciesModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder={policiesModalType.startsWith('delivery') ? "e.g., Express 3-5 days" : "e.g., 50% Advance Payment"} 
                  value={newPolicyLabel}
                  onChange={(e) => setNewPolicyLabel(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', color: '#334155' }}
                />
              </div>
              <button 
                onClick={() => {
                  if (newPolicyLabel.trim()) {
                    const isDelivery = policiesModalType.startsWith('delivery');
                    let id, newPolicy;
                    if (policiesModalType === 'delivery_domestic') {
                      id = 'dom_' + newPolicyLabel.trim().replace(/\s+/g, '_').toLowerCase();
                      newPolicy = { id, label: newPolicyLabel.trim(), type: 'domestic' };
                    } else if (policiesModalType === 'delivery_global') {
                      id = 'global_' + newPolicyLabel.trim().replace(/\s+/g, '_').toLowerCase();
                      newPolicy = { id, label: newPolicyLabel.trim(), type: 'global' };
                    } else if (policiesModalType === 'delivery_other') {
                      id = 'custom:' + newPolicyLabel.trim().replace(/\s+/g, '_').toLowerCase();
                      newPolicy = { id, label: newPolicyLabel.trim(), type: 'other' };
                    } else if (policiesModalType === 'payment_local') {
                      id = 'custom_pay_local:' + newPolicyLabel.trim().replace(/\s+/g, '_').toLowerCase();
                      newPolicy = { id, label: newPolicyLabel.trim() };
                    } else {
                      id = 'custom_pay_global:' + newPolicyLabel.trim().replace(/\s+/g, '_').toLowerCase();
                      newPolicy = { id, label: newPolicyLabel.trim() };
                    }
                    
                    if (isDelivery) {
                      setDeliveryLibrary(prev => [...prev, newPolicy]);
                    } else if (policiesModalType === 'payment_local') {
                      setPaymentLibraryLocal(prev => [...prev, newPolicy]);
                    } else {
                      setPaymentLibraryGlobal(prev => [...prev, newPolicy]);
                    }
                    setNewPolicyLabel('');
                  }
                }}
                disabled={!newPolicyLabel.trim()}
                style={{ background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: newPolicyLabel.trim() ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', opacity: newPolicyLabel.trim() ? 1 : 0.6 }}
              >
                <Plus size={16} /> Add Option
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(() => {
                  let library = [];
                  if (policiesModalType === 'delivery_domestic') {
                    library = deliveryLibrary.filter(p => p.type === 'domestic' || p.id === '24-48h' || p.id === '1-5days');
                  } else if (policiesModalType === 'delivery_global') {
                    library = deliveryLibrary.filter(p => p.type === 'global' || p.id === 'global');
                  } else if (policiesModalType === 'delivery_other') {
                    const domestic = deliveryLibrary.filter(p => p.type === 'domestic' || p.id === '24-48h' || p.id === '1-5days');
                    const global = deliveryLibrary.filter(p => p.type === 'global' || p.id === 'global');
                    library = deliveryLibrary.filter(p => p.type === 'other' || p.id === 'none' || (!domestic.includes(p) && !global.includes(p)));
                  } else if (policiesModalType === 'payment_local') {
                    library = paymentLibraryLocal;
                  } else if (policiesModalType === 'payment_global') {
                    library = paymentLibraryGlobal;
                  }
                  return library.map(policy => (
                  <div 
                    key={policy.id} 
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggedPolicyId(policy.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!draggedPolicyId || draggedPolicyId === policy.id) {
                        setDraggedPolicyId(null);
                        return;
                      }
                      const reorder = (arr) => {
                        const dIdx = arr.findIndex(p => p.id === draggedPolicyId);
                        const tIdx = arr.findIndex(p => p.id === policy.id);
                        if (dIdx === -1 || tIdx === -1) return arr;
                        const newArr = [...arr];
                        const [item] = newArr.splice(dIdx, 1);
                        newArr.splice(tIdx, 0, item);
                        return newArr;
                      };
                      if (policiesModalType.startsWith('delivery')) {
                        setDeliveryLibrary(prev => reorder(prev));
                      } else if (policiesModalType === 'payment_local') {
                        setPaymentLibraryLocal(prev => reorder(prev));
                      } else {
                        setPaymentLibraryGlobal(prev => reorder(prev));
                      }
                      setDraggedPolicyId(null);
                    }}
                    onDragEnd={() => setDraggedPolicyId(null)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px 16px', 
                      background: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      cursor: 'grab',
                      opacity: draggedPolicyId === policy.id ? 0.5 : 1,
                      transform: draggedPolicyId === policy.id ? 'scale(0.98)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {editingPolicyId === policy.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <input 
                          type="text" 
                          value={editPolicyLabel} 
                          onChange={(e) => setEditPolicyLabel(e.target.value)} 
                          style={{ flex: 1, padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', fontSize: '13px' }} 
                        />
                        <button 
                          onClick={() => {
                            if (editPolicyLabel.trim()) {
                              if (policiesModalType.startsWith('delivery')) {
                                setDeliveryLibrary(prev => prev.map(p => p.id === policy.id ? { ...p, label: editPolicyLabel.trim() } : p));
                              } else if (policiesModalType === 'payment_local') {
                                setPaymentLibraryLocal(prev => prev.map(p => p.id === policy.id ? { ...p, label: editPolicyLabel.trim() } : p));
                              } else {
                                setPaymentLibraryGlobal(prev => prev.map(p => p.id === policy.id ? { ...p, label: editPolicyLabel.trim() } : p));
                              }
                            }
                            setEditingPolicyId(null);
                          }}
                          style={{ background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                        >Save</button>
                        <button 
                          onClick={() => setEditingPolicyId(null)}
                          style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                        >Cancel</button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>{policy.label}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              setEditingPolicyId(policy.id);
                              setEditPolicyLabel(policy.label);
                            }}
                            style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                            title="Edit Option"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if (policiesModalType.startsWith('delivery')) {
                                setDeliveryLibrary(prev => prev.filter(p => p.id !== policy.id));
                              } else if (policiesModalType === 'payment_local') {
                                setPaymentLibraryLocal(prev => prev.filter(p => p.id !== policy.id));
                              } else {
                                setPaymentLibraryGlobal(prev => prev.filter(p => p.id !== policy.id));
                              }
                            }}
                            style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div style={{ marginLeft: '4px', display: 'flex', alignItems: 'center', color: '#cbd5e1', cursor: 'grab' }} title="Drag to reorder">
                            <ListOrdered size={16} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  ));
                })()}
                {(() => {
                  let library = [];
                  if (policiesModalType === 'delivery_domestic') {
                    library = deliveryLibrary.filter(p => p.type === 'domestic' || p.id === '24-48h' || p.id === '1-5days');
                  } else if (policiesModalType === 'delivery_global') {
                    library = deliveryLibrary.filter(p => p.type === 'global' || p.id === 'global');
                  } else if (policiesModalType === 'delivery_other') {
                    const domestic = deliveryLibrary.filter(p => p.type === 'domestic' || p.id === '24-48h' || p.id === '1-5days');
                    const global = deliveryLibrary.filter(p => p.type === 'global' || p.id === 'global');
                    library = deliveryLibrary.filter(p => p.type === 'other' || p.id === 'none' || (!domestic.includes(p) && !global.includes(p)));
                  } else if (policiesModalType === 'payment_local') {
                    library = paymentLibraryLocal;
                  } else if (policiesModalType === 'payment_global') {
                    library = paymentLibraryGlobal;
                  }
                  return library.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
                    No custom options found. Add one above.
                  </div>
                  );
                })()}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowPoliciesModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showColorLibraryModal && colorLibraryIndex !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowColorLibraryModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Color Management Library</h3>
              <button onClick={() => setShowColorLibraryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', flex: 1, minWidth: '200px' }}>
                <span style={{ color: '#94a3b8', marginRight: '8px' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search colors..." 
                  value={colorSearchQuery}
                  onChange={(e) => setColorSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', color: '#334155' }}
                />
              </div>

              {/* Create New Color directly in modal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', padding: '4px 10px' }}>
                <input 
                  type="color" 
                  id="modal-custom-color-picker"
                  defaultValue="#000000"
                  title="Pick a custom color"
                  style={{ width: '18px', height: '18px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
                  onChange={(e) => {
                    const hexInput = document.getElementById('modal-custom-color-hex');
                    if (hexInput) hexInput.value = e.target.value.toUpperCase();
                  }}
                />
                <input 
                  id="modal-custom-color-hex"
                  type="text" 
                  placeholder="#HexCode"
                  defaultValue="#000000"
                  style={{ fontSize: '11px', border: 'none', outline: 'none', width: '60px', background: 'transparent', color: '#64748b', fontWeight: 500, borderRight: '1px solid #e2e8f0', paddingRight: '6px' }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                      const picker = document.getElementById('modal-custom-color-picker');
                      if (picker) picker.value = val;
                    }
                  }}
                />
                <input 
                  id="modal-custom-color-name"
                  type="text" 
                  placeholder="New Color Name..." 
                  style={{ fontSize: '11px', border: 'none', outline: 'none', width: '95px', background: 'transparent', color: '#334155', fontWeight: 500 }}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                         e.preventDefault();
                         const nameVal = e.target.value.trim();
                         const hexInput = document.getElementById('modal-custom-color-hex');
                         const pickerInput = document.getElementById('modal-custom-color-picker');
                         const hexVal = (hexInput && hexInput.value.trim()) ? hexInput.value.trim() : pickerInput.value;
                         if (nameVal && hexVal.startsWith('#')) {
                            addSavedCustomColor(`${nameVal}|${hexVal}`);
                            e.target.value = '';
                         }
                     }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                     const nameInput = document.getElementById('modal-custom-color-name');
                     const hexInput = document.getElementById('modal-custom-color-hex');
                     const pickerInput = document.getElementById('modal-custom-color-picker');
                     if (nameInput) {
                         const nameVal = nameInput.value.trim();
                         const hexVal = (hexInput && hexInput.value.trim()) ? hexInput.value.trim() : pickerInput.value;
                         if (nameVal && hexVal.startsWith('#')) {
                            addSavedCustomColor(`${nameVal}|${hexVal}`);
                            nameInput.value = '';
                         }
                     }
                  }}
                  style={{ background: 'var(--brand-pink)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', padding: '2px', flexShrink: 0 }}
                  title="Save New Color"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...savedCustomColors]
                  .filter((v, i, a) => a.findIndex(item => (item.includes('|') ? item.split('|')[0] : item).trim().toLowerCase() === (v.includes('|') ? v.split('|')[0] : v).trim().toLowerCase()) === i)
                  .filter(c => {
                    if (!colorSearchQuery) return true;
                    const cName = (c.includes('|') ? c.split('|')[0] : c).toLowerCase();
                    return cName.includes(colorSearchQuery.toLowerCase());
                  })
                  .sort((a, b) => {
                     const nameA = (a.includes('|') ? a.split('|')[0] : a).trim().toLowerCase();
                     const nameB = (b.includes('|') ? b.split('|')[0] : b).trim().toLowerCase();
                     return nameA.localeCompare(nameB);
                  })
                  .map(color => {
                     const isSelected = formData.attributes[colorLibraryIndex]?.options && formData.attributes[colorLibraryIndex].options.split(',').map(o => (o.includes('|') ? o.split('|')[0] : o).trim().toLowerCase()).includes((color.includes('|') ? color.split('|')[0] : color).trim().toLowerCase());
                     return (
                      <div 
                        key={color}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: isSelected ? '#FFEDEE' : '#fff', borderRadius: '8px', border: `1px solid ${isSelected ? '#fbcfe8' : '#e2e8f0'}`, transition: 'all 0.2s' }}
                      >
                        <div 
                          onClick={() => {
                            const currentOpts = formData.attributes[colorLibraryIndex].options ? formData.attributes[colorLibraryIndex].options.split(',').map(o => o.trim()).filter(Boolean) : [];
                            if (!isSelected) {
                              handleAttributeChange(colorLibraryIndex, 'options', [...currentOpts, color].join(', '));
                              recordRecentColor(color);
                            } else {
                              const newOpts = currentOpts.filter(o => (o.includes('|') ? o.split('|')[0] : o).trim().toLowerCase() !== (color.includes('|') ? color.split('|')[0] : color).trim().toLowerCase());
                              handleAttributeChange(colorLibraryIndex, 'options', newOpts.join(', '));
                            }
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                        >
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: getBadgeColor(color), border: '1px solid rgba(0,0,0,0.1)' }}></span>
                          <span style={{ fontSize: '14px', color: isSelected ? '#E91E63' : '#334155', fontWeight: 500 }}>
                            {color.includes('|') ? color.split('|')[0] : color}
                          </span>
                          {isSelected && <Check size={16} color="#E91E63" />}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentName = color.includes('|') ? color.split('|')[0] : color;
                                const currentHex = getBadgeColor(color);
                                const newName = prompt(`Edit Color Name for ${currentName}:`, currentName);
                                if (newName && newName.trim()) {
                                   const newHex = prompt(`Edit Hex Code for ${newName.trim()} (e.g. #FF0000):`, currentHex);
                                   if (newHex && newHex.trim().startsWith('#')) {
                                     const finalName = newName.trim();
                                     const finalHex = newHex.trim().toUpperCase();
                                     // Delete old, add new
                                     setSavedCustomColors(prev => {
                                        const filtered = prev.filter(c => (c.includes('|') ? c.split('|')[0] : c).trim().toLowerCase() !== currentName.toLowerCase());
                                        const newColors = [`${finalName}|${finalHex}`, ...filtered];
                                        localStorage.setItem('savedCustomColors', JSON.stringify(newColors));
                                        return newColors;
                                     });
                                     
                                     // Automatically update the selected options in product if this color was selected
                                     if (isSelected) {
                                        const currentOpts = formData.attributes[colorLibraryIndex].options ? formData.attributes[colorLibraryIndex].options.split(',').map(o => o.trim()).filter(Boolean) : [];
                                        const updatedOpts = currentOpts.map(o => {
                                            if ((o.includes('|') ? o.split('|')[0] : o).trim().toLowerCase() === currentName.toLowerCase()) {
                                               return `${finalName}|${finalHex}`;
                                            }
                                            return o;
                                        });
                                        handleAttributeChange(colorLibraryIndex, 'options', updatedOpts.join(', '));
                                     }
                                   }
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Edit Color"
                              onMouseOver={e => e.currentTarget.style.color = '#3b82f6'}
                              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentName = color.includes('|') ? color.split('|')[0] : color;
                                if (window.confirm(`Are you sure you want to delete ${currentName} from your library?`)) {
                                   setSavedCustomColors(prev => {
                                      const filtered = prev.filter(c => (c.includes('|') ? c.split('|')[0] : c).trim().toLowerCase() !== currentName.toLowerCase());
                                      localStorage.setItem('savedCustomColors', JSON.stringify(filtered));
                                      return filtered;
                                   });
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Delete Color"
                              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                      </div>
                     );
                  })}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowColorLibraryModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showAttrLibraryModal && attrLibraryIndex !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAttrLibraryModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{attrLibraryType} Management Library</h3>
              <button onClick={() => setShowAttrLibraryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', flex: 1, minWidth: '200px' }}>
                <span style={{ color: '#94a3b8', marginRight: '8px' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder={`Search ${attrLibraryType.toLowerCase()}...`}
                  value={attrSearchQuery}
                  onChange={(e) => setAttrSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', color: '#334155' }}
                />
              </div>

              {/* Create New Attribute directly in modal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', padding: '4px 10px' }}>
                <input 
                  id="modal-custom-attr-name"
                  type="text" 
                  placeholder={`New ${attrLibraryType}...`}
                  style={{ fontSize: '12px', border: 'none', outline: 'none', width: '140px', background: 'transparent', color: '#334155', fontWeight: 500 }}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                         e.preventDefault();
                         const nameVal = e.target.value.trim();
                         if (nameVal) {
                            addSavedCustomAttribute(attrLibraryType, nameVal);
                            e.target.value = '';
                         }
                     }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                     const nameInput = document.getElementById('modal-custom-attr-name');
                     if (nameInput) {
                         const nameVal = nameInput.value.trim();
                         if (nameVal) {
                            addSavedCustomAttribute(attrLibraryType, nameVal);
                            nameInput.value = '';
                         }
                     }
                  }}
                  style={{ background: 'var(--brand-pink)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', padding: '2px', flexShrink: 0 }}
                  title={`Save New ${attrLibraryType}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(savedCustomAttributes[attrLibraryType] || [])
                  .filter(c => {
                    if (!attrSearchQuery) return true;
                    return c.toLowerCase().includes(attrSearchQuery.toLowerCase());
                  })
                  .map(opt => {
                     const currentOpts = formData.attributes[attrLibraryIndex]?.options ? formData.attributes[attrLibraryIndex].options.split(',').map(o => o.trim()).filter(Boolean) : [];
                     const isSelected = currentOpts.map(o => o.toLowerCase()).includes(opt.toLowerCase());
                     return (
                      <div 
                        key={opt}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: isSelected ? '#FFEDEE' : '#fff', borderRadius: '8px', border: `1px solid ${isSelected ? '#fbcfe8' : '#e2e8f0'}`, transition: 'all 0.2s' }}
                      >
                        <div 
                          onClick={() => {
                            if (!isSelected) {
                              handleAttributeChange(attrLibraryIndex, 'options', [...currentOpts, opt].join(', '));
                            } else {
                              const newOpts = currentOpts.filter(o => o.toLowerCase() !== opt.toLowerCase());
                              handleAttributeChange(attrLibraryIndex, 'options', newOpts.join(', '));
                            }
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                        >
                          <span style={{ fontSize: '14px', color: isSelected ? '#E91E63' : '#334155', fontWeight: 500 }}>
                            {opt}
                          </span>
                          {isSelected && <Check size={16} color="#E91E63" />}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newName = prompt(`Edit ${attrLibraryType} Name for ${opt}:`, opt);
                                if (newName && newName.trim() && newName.trim().toLowerCase() !== opt.toLowerCase()) {
                                   editSavedCustomAttribute(attrLibraryType, opt, newName.trim());
                                   
                                   if (isSelected) {
                                      const updatedOpts = currentOpts.map(o => o.toLowerCase() === opt.toLowerCase() ? newName.trim() : o);
                                      handleAttributeChange(attrLibraryIndex, 'options', updatedOpts.join(', '));
                                   }
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Edit Option"
                              onMouseOver={e => e.currentTarget.style.color = '#3b82f6'}
                              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete ${opt} from your ${attrLibraryType} library?`)) {
                                   removeSavedCustomAttribute(attrLibraryType, opt);
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Delete Option"
                              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                      </div>
                     );
                  })}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowAttrLibraryModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showDescLibraryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDescLibraryModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Book size={20} color="var(--brand-pink)" />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Description Templates Library</h3>
              </div>
              <button onClick={() => setShowDescLibraryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', flex: 1, minWidth: '200px' }}>
                <i className="fi fi-rr-search" style={{ color: '#94a3b8', fontSize: '14px', marginRight: '8px', display: 'flex' }}></i>
                <input 
                  type="text" 
                  placeholder="Search saved templates..." 
                  value={descSearchQuery}
                  onChange={(e) => setDescSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#1e293b' }}
                />
              </div>

              <button 
                type="button"
                onClick={() => {
                  if (!formData.description || formData.description.replace(/<[^>]*>?/gm, '').trim() === '') {
                    alert("The description is currently empty. Please write something first before saving!");
                    return;
                  }
                  const title = prompt("Enter a name for this template:");
                  if (title && title.trim()) {
                    saveDescriptionTemplate(title.trim(), formData.description);
                    alert("Template saved successfully!");
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 4px rgba(233, 30, 99, 0.2)' }}
              >
                <Save size={16} /> Save Current Description
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savedDescriptions
                .filter(desc => desc.title.toLowerCase().includes(descSearchQuery.toLowerCase()) || desc.content.toLowerCase().includes(descSearchQuery.toLowerCase()))
                .map((desc) => (
                  <div key={desc.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'} onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    {editingDescId === desc.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={editingDescTitle}
                            onChange={(e) => setEditingDescTitle(e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}
                          />
                          <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                            <button 
                              onClick={() => {
                                if (editingDescTitle.trim()) {
                                  setSavedDescriptions(prev => {
                                    const updated = prev.map(d => d.id === desc.id ? { ...d, title: editingDescTitle.trim(), content: editingDescContent } : d);
                                    localStorage.setItem('savedDescriptions', JSON.stringify(updated));
                                    return updated;
                                  });
                                  setEditingDescId(null);
                                }
                              }}
                              style={{ background: 'var(--brand-pink)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingDescId(null)}
                              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                          <RichTextEditor 
                            value={editingDescContent} 
                            onChange={(val) => setEditingDescContent(val)} 
                            placeholder="Edit your template content here..." 
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>{desc.title}</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => {
                                if (!formData.description || window.confirm("This will replace your current description. Continue?")) {
                                  setFormData(prev => ({ ...prev, description: desc.content }));
                                  setShowDescLibraryModal(false);
                                }
                              }}
                              style={{ background: '#fff0f6', border: '1px solid #fbcfe8', color: 'var(--brand-pink)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                            >
                              Insert
                            </button>
                            <button 
                              onClick={() => {
                                setFormData(prev => ({ ...prev, description: (prev.description || '') + desc.content }));
                                setShowDescLibraryModal(false);
                              }}
                              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                            >
                              Append
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDescId(desc.id);
                                setEditingDescTitle(desc.title);
                                setEditingDescContent(desc.content);
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}
                              title="Edit Template"
                              onMouseOver={e => e.currentTarget.style.color = '#3b82f6'}
                              onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the template "${desc.title}"?`)) {
                                  deleteDescriptionTemplate(desc.id);
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Delete Template"
                              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                              onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                          <div dangerouslySetInnerHTML={{ __html: desc.content }} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {savedDescriptions.filter(desc => desc.title.toLowerCase().includes(descSearchQuery.toLowerCase()) || desc.content.toLowerCase().includes(descSearchQuery.toLowerCase())).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <Book size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#334155' }}>No templates found</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>Save your current description to start building your library!</p>
                  </div>
                )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowDescLibraryModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showPricingPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPricingPresetsModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings2 size={20} color="var(--brand-pink)" />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Manage Pricing Presets</h3>
              </div>
              <button onClick={() => setShowPricingPresetsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {pricingPresets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <Bookmark size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#334155' }}>No presets saved yet</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>Save your current pricing to start building your presets!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pricingPresets.map(preset => (
                    <div key={preset.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>{preset.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                          Price: ৳{preset.data.regularPrice || 0} | Cost: ৳{preset.data.costPrice || 0}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = pricingPresets.map(p => p.id === preset.id ? { ...p, isSticky: !p.isSticky } : p);
                            setPricingPresets(updated);
                            localStorage.setItem('pricingPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#fef08a' : '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#ca8a04' : '#64748b' }}
                          title={preset.isSticky ? "Unpin" : "Pin to Section"}
                          onMouseOver={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#fff'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={preset.isSticky ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            applyPricingPreset(preset);
                            setShowPricingPresetsModal(false);
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}
                          onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => renamePricingPreset(preset.id)}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                          title="Rename"
                          onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePricingPreset(preset.id)}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete"
                          onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowPricingPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showInventoryPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowInventoryPresetsModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings2 size={20} color="var(--brand-pink)" />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Manage Inventory Presets</h3>
              </div>
              <button onClick={() => setShowInventoryPresetsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {savedInventoryPresets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <Bookmark size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#334155' }}>No presets saved yet</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>Save your current inventory and variants to start building your presets!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {savedInventoryPresets.map(preset => (
                    <div key={preset.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>{preset.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                          Attributes: {preset.attributes?.map(a => a.name).join(', ') || 'None'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = savedInventoryPresets.map(p => p.id === preset.id ? { ...p, isSticky: !p.isSticky } : p);
                            setSavedInventoryPresets(updated);
                            localStorage.setItem('savedInventoryPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#fef08a' : '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#ca8a04' : '#64748b' }}
                          title={preset.isSticky ? "Unpin" : "Pin to Section"}
                          onMouseOver={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#fff'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={preset.isSticky ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Apply Preset
                            const newAttributes = preset.attributes || [];
                            setFormData(prev => {
                              const newData = { ...prev, attributes: newAttributes };
                              // Try to regenerate variants
                              let newVariants = [];
                              if (newAttributes.length > 0 && newAttributes.some(a => a.name && a.options && a.options.trim() !== '')) {
                                const activeAttrs = newAttributes.filter(a => a.name && a.options && a.options.trim() !== '');
                                const optionsList = activeAttrs.map(a => a.options.split(',').map(o => o.trim()).filter(Boolean));
                                
                                const generateCombinations = (lists) => {
                                  if (lists.length === 0) return [];
                                  if (lists.length === 1) return lists[0].map(item => [item]);
                                  const result = [];
                                  const rest = generateCombinations(lists.slice(1));
                                  for (let i = 0; i < lists[0].length; i++) {
                                    for (let j = 0; j < rest.length; j++) {
                                      result.push([lists[0][i], ...rest[j]]);
                                    }
                                  }
                                  return result;
                                };

                                const combinations = generateCombinations(optionsList);
                                newVariants = combinations.map(combo => {
                                  const rawName = combo.join(' / ');
                                  const cleanName = combo.map(c => c.includes('|') ? c.split('|')[0] : c).join(' / ');
                                  return { name: cleanName, sku: '', stock: '' };
                                });
                              }
                              newData.variants = newVariants;
                              return newData;
                            });
                            setShowInventoryPresetsModal(false);
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}
                          onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newName = window.prompt("Rename this preset:", preset.name);
                            if (newName && newName.trim()) {
                              const updated = savedInventoryPresets.map(p => p.id === preset.id ? { ...p, name: newName.trim() } : p);
                              setSavedInventoryPresets(updated);
                              localStorage.setItem('savedInventoryPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                          title="Rename"
                          onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete preset "${preset.name}"?`)) {
                              const updated = savedInventoryPresets.filter(p => p.id !== preset.id);
                              setSavedInventoryPresets(updated);
                              localStorage.setItem('savedInventoryPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete"
                          onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowInventoryPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showShippingPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowShippingPresetsModal(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings2 size={20} color="var(--brand-pink)" />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Manage Shipping Presets</h3>
              </div>
              <button onClick={() => setShowShippingPresetsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {savedShippingPresets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <Bookmark size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#334155' }}>No presets saved yet</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>Save your current shipping and payment setup to start building your presets!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {savedShippingPresets.map(preset => (
                    <div key={preset.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b', fontWeight: 600 }}>{preset.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                          Delivery: {deliveryLibrary.find(d => d.id === preset.deliveryBannerType)?.label || 'Default'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = savedShippingPresets.map(p => p.id === preset.id ? { ...p, isSticky: !p.isSticky } : p);
                            setSavedShippingPresets(updated);
                            localStorage.setItem('savedShippingPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#fef08a' : '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#ca8a04' : '#64748b' }}
                          title={preset.isSticky ? "Unpin" : "Pin to Section"}
                          onMouseOver={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#fff'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={preset.isSticky ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Apply Preset
                            setFormData(prev => ({
                                ...prev,
                                deliveryBannerType: preset.deliveryBannerType,
                                paymentOption: preset.paymentOption || 'cod',
                                showSameDayDelivery: preset.showSameDayDelivery || false
                            }));
                            setShowShippingPresetsModal(false);
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}
                          onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          Apply
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newName = window.prompt("Rename this preset:", preset.name);
                            if (newName && newName.trim()) {
                              const updated = savedShippingPresets.map(p => p.id === preset.id ? { ...p, name: newName.trim() } : p);
                              setSavedShippingPresets(updated);
                              localStorage.setItem('savedShippingPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                          title="Rename Preset"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete preset "${preset.name}"?`)) {
                              const updated = savedShippingPresets.filter(p => p.id !== preset.id);
                              setSavedShippingPresets(updated);
                              localStorage.setItem('savedShippingPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete Preset"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowShippingPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Organization Preset Modal */}
      {showSaveOrgPresetModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Save Organization Preset</h3>
              <button onClick={() => setShowSaveOrgPresetModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveOrgPreset} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Preset Name</label>
                <input 
                  type="text" 
                  value={newOrgPresetName} 
                  onChange={e => setNewOrgPresetName(e.target.value)}
                  className="form-input" 
                  placeholder="e.g. Summer Collection Defaults"
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowSaveOrgPresetModal(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Save Preset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Organization Presets Modal */}
      {showManageOrgPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Manage Organization Presets</h3>
              <button onClick={() => setShowManageOrgPresetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {orgPresets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No presets saved yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orgPresets.map((preset, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', marginBottom: '4px' }}>{preset.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {preset.brand && <span><strong>Brand:</strong> {preset.brand}</span>}
                          {preset.vendor && <span><strong>Vendor:</strong> {preset.vendor}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = orgPresets.map((p, i) => i === idx ? { ...p, isSticky: !p.isSticky } : p);
                            setOrgPresets(updated);
                            localStorage.setItem('orgPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#fef08a' : '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#ca8a04' : '#64748b' }}
                          title={preset.isSticky ? "Unpin" : "Pin to Section"}
                          onMouseOver={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.background = preset.isSticky ? '#fef08a' : '#fff'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={preset.isSticky ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                        </button>
                        <button 
                          onClick={() => applyOrgPreset(preset)}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', fontWeight: '500', fontSize: '13px' }}
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => deleteOrgPreset(idx)}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete Preset"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowManageOrgPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Variant Presets Modal */}
      {showManageVariantPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '540px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Variant Presets</h3>
              <button onClick={() => setShowManageVariantPresetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              {variantPresets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No variant presets saved yet. Set up your attributes and click "Save Preset".</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {variantPresets.map((preset, idx) => (
                    <div key={preset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: `1px solid ${preset.isSticky ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '8px', background: preset.isSticky ? '#eff6ff' : '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', marginBottom: '4px' }}>{preset.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {preset.attributes.map(a => `${a.name}: ${a.options ? a.options.split(',').slice(0,3).map(o=>o.trim()).join(', ') + (a.options.split(',').length > 3 ? '...' : '') : 'none'}`).join(' · ')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => {
                            const updated = variantPresets.map((p, i) => i === idx ? { ...p, isSticky: !p.isSticky } : p);
                            setVariantPresets(updated);
                            localStorage.setItem('variantPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#dbeafe' : '#fff', border: `1px solid ${preset.isSticky ? '#93c5fd' : '#cbd5e1'}`, padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#2563eb' : '#64748b', fontSize: '12px', fontWeight: 600 }}
                          title={preset.isSticky ? 'Unpin from toolbar' : 'Pin to toolbar'}
                        ><Bookmark size={14} fill={preset.isSticky ? 'currentColor' : 'none'} /></button>
                        <button
                          onClick={() => applyVariantPreset(preset)}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', fontWeight: 500, fontSize: '13px' }}
                        >Apply</button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete preset "${preset.name}"?`)) {
                              const updated = variantPresets.filter((_, i) => i !== idx);
                              setVariantPresets(updated);
                              localStorage.setItem('variantPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete Preset"
                        ><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowManageVariantPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Description Presets Modal */}
      {showManageDescPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '580px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Description Presets</h3>
              <button onClick={() => setShowManageDescPresetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              {descPresets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No description presets saved yet. Write a description and click "Save Preset".</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {descPresets.map((preset, idx) => (
                    <div key={preset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 16px', border: `1px solid ${preset.isSticky ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '8px', background: preset.isSticky ? '#eff6ff' : '#f8fafc' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', marginBottom: '4px' }}>{preset.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}
                          dangerouslySetInnerHTML={{ __html: preset.description.replace(/<[^>]*>/g, ' ').trim().substring(0, 100) + '...' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                        <button
                          onClick={() => {
                            const updated = descPresets.map((p, i) => i === idx ? { ...p, isSticky: !p.isSticky } : p);
                            setDescPresets(updated);
                            localStorage.setItem('descPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#dbeafe' : '#fff', border: `1px solid ${preset.isSticky ? '#93c5fd' : '#cbd5e1'}`, padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#2563eb' : '#64748b', fontSize: '12px', fontWeight: 600 }}
                          title={preset.isSticky ? 'Unpin from toolbar' : 'Pin to toolbar'}
                        ><Bookmark size={14} fill={preset.isSticky ? 'currentColor' : 'none'} /></button>
                        <button
                          onClick={() => { applyDescPreset(preset); setShowManageDescPresetsModal(false); }}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', fontWeight: 500, fontSize: '13px' }}
                        >Apply</button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete preset "${preset.name}"?`)) {
                              const updated = descPresets.filter((_, i) => i !== idx);
                              setDescPresets(updated);
                              localStorage.setItem('descPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete Preset"
                        ><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowManageDescPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Placement Presets Modal */}
      {showManagePlacementPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Placement Presets</h3>
              <button onClick={() => setShowManagePlacementPresetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              {placementPresets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>No presets saved yet. Select placements and click "Save Preset".</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {placementPresets.map((preset, idx) => (
                    <div key={preset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: `1px solid ${preset.isSticky ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '8px', background: preset.isSticky ? '#eff6ff' : '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', marginBottom: '4px' }}>{preset.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {preset.placements.map(p => (
                            <span key={p} style={{ background: '#fdf2f8', color: '#E43292', border: '1px solid #fbcfe8', borderRadius: '10px', padding: '1px 7px', fontSize: '11px' }}>{p}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                        <button
                          onClick={() => {
                            const updated = placementPresets.map((p, i) => i === idx ? { ...p, isSticky: !p.isSticky } : p);
                            setPlacementPresets(updated);
                            localStorage.setItem('placementPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#dbeafe' : '#fff', border: `1px solid ${preset.isSticky ? '#93c5fd' : '#cbd5e1'}`, padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#2563eb' : '#64748b' }}
                          title={preset.isSticky ? 'Unpin from toolbar' : 'Pin to toolbar'}
                        ><Bookmark size={14} fill={preset.isSticky ? 'currentColor' : 'none'} /></button>
                        <button
                          onClick={() => { applyPlacementPreset(preset); setShowManagePlacementPresetsModal(false); }}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', fontWeight: 500, fontSize: '13px' }}
                        >Apply</button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${preset.name}"?`)) {
                              const updated = placementPresets.filter((_, i) => i !== idx);
                              setPlacementPresets(updated);
                              localStorage.setItem('placementPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete"
                        ><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowManagePlacementPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Category Presets Modal */}
      {showManageCategoryPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '560px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Category Presets</h3>
              <button onClick={() => setShowManageCategoryPresetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              {categoryPresets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>No presets saved yet. Select categories and click "Save Preset".</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryPresets.map((preset, idx) => (
                    <div key={preset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 16px', border: `1px solid ${preset.isSticky ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '8px', background: preset.isSticky ? '#eff6ff' : '#f8fafc' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', marginBottom: '6px' }}>{preset.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                          {(preset.category || []).map(c => (
                            <span key={c} style={{ background: '#fdf2f8', color: '#E43292', border: '1px solid #fbcfe8', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 600 }}>{c}</span>
                          ))}
                        </div>
                        {(preset.subcategory || []).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                            {(preset.subcategory || []).map(s => (
                              <span key={s} style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            const updated = categoryPresets.map((p, i) => i === idx ? { ...p, isSticky: !p.isSticky } : p);
                            setCategoryPresets(updated);
                            localStorage.setItem('categoryPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#dbeafe' : '#fff', border: `1px solid ${preset.isSticky ? '#93c5fd' : '#cbd5e1'}`, padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#2563eb' : '#64748b' }}
                          title={preset.isSticky ? 'Unpin from toolbar' : 'Pin to toolbar'}
                        ><Bookmark size={14} fill={preset.isSticky ? 'currentColor' : 'none'} /></button>
                        <button
                          onClick={() => { applyCategoryPreset(preset); setShowManageCategoryPresetsModal(false); }}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', fontWeight: 500, fontSize: '13px' }}
                        >Apply</button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${preset.name}"?`)) {
                              const updated = categoryPresets.filter((_, i) => i !== idx);
                              setCategoryPresets(updated);
                              localStorage.setItem('categoryPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete"
                        ><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowManageCategoryPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Combo Presets Modal */}
      {showComboPresetsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '560px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Combo Presets</h3>
              <button onClick={() => setShowComboPresetsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              {savedComboPresets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>No presets saved yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedComboPresets.map((preset, idx) => (
                    <div key={preset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 16px', border: `1px solid ${preset.isSticky ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '8px', background: preset.isSticky ? '#eff6ff' : '#f8fafc' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', marginBottom: '6px' }}>{preset.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}><strong>Title:</strong> {preset.comboTitle}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}><strong>Tiers:</strong> {preset.comboTiers?.length || 0} configured</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            const updated = savedComboPresets.map((p, i) => i === idx ? { ...p, isSticky: !p.isSticky } : p);
                            setSavedComboPresets(updated);
                            localStorage.setItem('savedComboPresets', JSON.stringify(updated));
                          }}
                          style={{ background: preset.isSticky ? '#dbeafe' : '#fff', border: `1px solid ${preset.isSticky ? '#93c5fd' : '#cbd5e1'}`, padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: preset.isSticky ? '#2563eb' : '#64748b' }}
                          title={preset.isSticky ? 'Unpin from toolbar' : 'Pin to toolbar'}
                        ><Bookmark size={14} fill={preset.isSticky ? 'currentColor' : 'none'} /></button>
                        <button
                          onClick={() => { 
                            setFormData(prev => ({ ...prev, comboTitle: preset.comboTitle, comboLinkedProducts: preset.comboLinkedProducts, comboDescription: preset.comboDescription, comboTiers: preset.comboTiers || [] }));
                            setShowComboPresetsModal(false); 
                          }}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', fontWeight: 500, fontSize: '13px' }}
                        >Apply</button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${preset.name}"?`)) {
                              const updated = savedComboPresets.filter((_, i) => i !== idx);
                              setSavedComboPresets(updated);
                              localStorage.setItem('savedComboPresets', JSON.stringify(updated));
                            }
                          }}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                          title="Delete"
                        ><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
              <button type="button" onClick={() => setShowComboPresetsModal(false)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddProduct;
