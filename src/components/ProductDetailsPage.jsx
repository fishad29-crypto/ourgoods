import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../utils/MockData';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetailsPage.css';

const bdMaleNames = ['Anisur Rahman', 'Mehedi Hasan', 'Rahim Uddin', 'Tarek Biswas', 'Hasan Mahmud', 'Kamrul Islam', 'Riyad Hossain', 'Shakil Ahmed', 'Imran Hossain', 'Rubel Mia', 'Arif Rahman', 'Rakib Hasan', 'Sabbir Rahman', 'Ashiq Mahmud', 'Faisal Karim'];
const bdFemaleNames = ['Sadia Islam', 'Fatema Akter', 'Jannat Ferdous', 'Sumaiya Akter', 'Nusrat Jahan', 'Ayesha Siddiqua', 'Farhana Akter', 'Sonia Akter', 'Mitu Sultana', 'Tania Mahmud', 'Lima Akter', 'Rupa Sultana', 'Nadia Hossain'];
const bdCities = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Chuadanga', 
  'Comilla', 'Cox\'s Bazar', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 
  'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 
  'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 
  'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 
  'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 
  'Sylhet', 'Tangail', 'Thakurgaon', 'Chapainawabganj'
];

const fakeGroupBuys = Array.from({ length: 50 }).map((_, i) => {
  const isMale = i % 2 === 0;
  const name = isMale ? bdMaleNames[(i / 2) % bdMaleNames.length] : bdFemaleNames[Math.floor(i / 2) % bdFemaleNames.length];
  const imageId = (Math.floor(i / 2) % 50) + 1; // 1-50 are safe IDs in randomuser.me
  return {
    name,
    location: `From ${bdCities[Math.floor(Math.random() * bdCities.length)]}`,
    msLeft: Math.floor(Math.random() * 45 * 60000) + 10000, // Random time between 10s and 45m
    avatar: `https://xsgames.co/randomusers/assets/avatars/${isMale ? 'male' : 'female'}/${imageId}.jpg`
  };
});

const GroupBuyRow = ({ user, nextUser, isAnimating, onJoin }) => {
  const [timeLeft1, setTimeLeft1] = useState(user.msLeft);
  const [timeLeft2, setTimeLeft2] = useState(nextUser?.msLeft || 0);

  useEffect(() => {
    setTimeLeft1(user.msLeft);
    setTimeLeft2(nextUser?.msLeft || 0);
    const interval = setInterval(() => {
      setTimeLeft1(prev => Math.max(0, prev - 100));
      setTimeLeft2(prev => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(interval);
  }, [user, nextUser]);

  const getFormat = (t) => {
    const mins = Math.floor(t / 60000).toString().padStart(2, '0');
    const secs = Math.floor((t % 60000) / 1000).toString().padStart(2, '0');
    const ms = Math.floor((t % 1000) / 100);
    return `00:${mins}:${secs}.${ms}`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '44px', overflow: 'hidden', flex: 1 }}>
        <div style={{ 
          display: 'flex', flexDirection: 'column', 
          transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none',
          transform: isAnimating ? 'translateY(-44px)' : 'translateY(0)',
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '44px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', color: '#333', lineHeight: '1', marginBottom: '4px' }}>{user.name}</span>
              <span style={{ fontSize: '10px', color: '#E91E63', border: '1px solid #ffcce0', padding: '2px 4px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '2px', width: 'fit-content', lineHeight: '1' }}>
                <i className="las la-map-marker-alt" style={{ fontSize: '12px' }}></i> {user.location}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--brand-pink)' }}>Ending soon</span>
              <span style={{ fontSize: '12px', color: '#666' }}>{getFormat(timeLeft1)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '44px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', color: '#333', lineHeight: '1', marginBottom: '4px' }}>{nextUser?.name}</span>
              <span style={{ fontSize: '10px', color: '#E91E63', border: '1px solid #ffcce0', padding: '2px 4px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '2px', width: 'fit-content', lineHeight: '1' }}>
                {nextUser && <i className="las la-map-marker-alt" style={{ fontSize: '12px' }}></i>} {nextUser?.location}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--brand-pink)' }}>Ending soon</span>
              <span style={{ fontSize: '12px', color: '#666' }}>{nextUser ? getFormat(timeLeft2) : ''}</span>
            </div>
          </div>
        </div>
      </div>
      <button onClick={onJoin} style={{ position: 'relative', background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', flexShrink: 0, cursor: 'pointer' }}>
        Join
        <span style={{ position: 'absolute', top: '-8px', right: '-4px', background: '#FFEDEE', color: 'var(--brand-pink)', fontSize: '9px', padding: '2px 4px', borderRadius: '10px', border: '1px solid var(--brand-pink)', whiteSpace: 'nowrap' }}>No wait</span>
      </button>
    </div>
  );
};

const RotatingSkuBanner = ({ product }) => {
  const [deliveryLibrary, setDeliveryLibrary] = useState([]);
  const [paymentLibrary, setPaymentLibrary] = useState([]);

  useEffect(() => {
    try {
      const dl = localStorage.getItem('deliveryLibrary');
      if (dl) setDeliveryLibrary(JSON.parse(dl));
      
      const pl_loc = localStorage.getItem('paymentLibraryLocalV4');
      const pl_glob = localStorage.getItem('paymentLibraryGlobalV4');
      const pl_leg = localStorage.getItem('paymentLibraryV4') || localStorage.getItem('paymentLibrary');
      
      let combined = [];
      if (pl_loc) combined = [...combined, ...JSON.parse(pl_loc)];
      if (pl_glob) combined = [...combined, ...JSON.parse(pl_glob)];
      if (pl_leg) {
        const legacy = JSON.parse(pl_leg);
        const combinedIds = new Set(combined.map(p => p.id));
        const missingLegacy = legacy.filter(p => !combinedIds.has(p.id));
        combined = [...combined, ...missingLegacy];
      }
      
      if (combined.length > 0) setPaymentLibrary(combined);
    } catch {}
  }, []);

  const isGlobalProduct = product?.type === 'global' || product?.type === 'Global Product' || product?.marketType === 'global' || product?.product_type === 'Global Product' || product?.product_type === 'China Pre-Order';
  
  let bannerType = product?.deliveryBannerType;
  if (!bannerType && product?.showDeliveryBanner !== false) {
    bannerType = isGlobalProduct ? 'global' : '24-48h';
  }

  let deliveryText = '';
  const customDeliveryMatch = deliveryLibrary.find(p => p.id === bannerType);
  
  if (customDeliveryMatch) deliveryText = customDeliveryMatch.label;
  else if (bannerType === '24-48h') deliveryText = '24-48h in Bangladesh';
  else if (bannerType === 'global') deliveryText = '21-28 day (Standard) & 4-7 days (Express)';
  else if (bannerType === '1-5days') deliveryText = '1-5 days in Bangladesh & 1-2 days in Dhaka';
  else if (bannerType?.startsWith('custom:')) deliveryText = bannerType.replace('custom:', '');

  let paymentText = 'Cash on Delivery Available';
  const paymentOpt = product?.paymentOption || 'cod';
  const customPaymentMatch = paymentLibrary.find(p => p.id === paymentOpt);
  
  if (customPaymentMatch) {
     paymentText = customPaymentMatch.label;
  } else if (paymentOpt === 'full_advance') {
     paymentText = 'Full Advance Payment Required';
  } else if (paymentOpt === 'partial_advance') {
     paymentText = '60% Advance, 40% Cash on Delivery';
  } else if (paymentOpt.startsWith('custom_payment:') || paymentOpt.startsWith('custom_pay_local:') || paymentOpt.startsWith('custom_pay_global:')) {
     let raw = paymentOpt.replace('custom_payment:', '').replace('custom_pay_local:', '').replace('custom_pay_global:', '');
     paymentText = raw.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const banners = [];
  if (isGlobalProduct && (!bannerType || bannerType === 'global')) {
    banners.push({ bg: '#fef5e7', color: '#f39c12', icon: 'las la-truck', titleColor: '#666', title: 'Standard Delivery', subtitleColor: '#333', subtitle: '21 - 28 Days' });
    banners.push({ bg: '#e3f2fd', color: '#2196f3', icon: 'las la-shipping-fast', titleColor: '#666', title: 'Express Delivery', subtitleColor: '#333', subtitle: '4 - 7 Business Days' });
  } else if (deliveryText && bannerType !== 'none') {
    banners.push({ bg: '#FFF7ED', color: '#D97706', icon: 'las la-truck', titleColor: '#92400E', title: 'Estimated Delivery Time', subtitleColor: '#000', subtitle: deliveryText });
  }

  if (paymentText) {
    banners.push({ bg: '#ECFDF5', color: '#059669', icon: 'las la-money-bill-wave', titleColor: '#000', title: paymentText, subtitleColor: '', subtitle: '' });
  }
  
  // fallback if somehow empty
  if (banners.length === 0) {
    banners.push({ bg: '#FFF7ED', color: '#D97706', icon: 'las la-truck', titleColor: '#92400E', title: 'Estimated Delivery Time', subtitleColor: '#000', subtitle: '24-48h in Bangladesh' });
  }

  const [active, setActive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % banners.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div style={{ height: '36px', position: 'relative', marginBottom: '16px', marginRight: '32px' }}>
      {banners.map((banner, idx) => (
        <div key={idx} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out',
          transform: active === idx ? 'translateY(0)' : (active === (idx - 1 + banners.length) % banners.length ? 'translateY(-10px)' : 'translateY(10px)'),
          opacity: active === idx ? 1 : 0,
          pointerEvents: active === idx ? 'auto' : 'none',
          background: banner.bg, padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: banner.color
        }}>
          <i className={banner.icon} style={{ fontSize: '18px' }}></i>
          {banner.subtitle ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: banner.titleColor, lineHeight: '1.2' }}>{banner.title}</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: banner.subtitleColor, lineHeight: '1.2' }}>{banner.subtitle}</span>
            </div>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: banner.titleColor }}>{banner.title}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const ActiveBuyersAvatars = () => {
  const [avatars, setAvatars] = useState([
    'https://xsgames.co/randomusers/assets/avatars/male/60.jpg',
    'https://xsgames.co/randomusers/assets/avatars/female/61.jpg',
    'https://xsgames.co/randomusers/assets/avatars/male/62.jpg'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatars(prev => {
        const newArr = [...prev];
        const isMale = Math.random() > 0.5;
        const id = Math.floor(Math.random() * 15) + 60; // 60-74 to avoid viewing overlap
        const newAvatar = `https://xsgames.co/randomusers/assets/avatars/${isMale ? 'male' : 'female'}/${id}.jpg`;
        newArr.unshift(newAvatar);
        newArr.pop();
        return newArr;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: '6px' }}>
      {avatars.map((url, i) => (
        <img 
          key={url + i} 
          src={url} 
          style={{
            width: '24px', height: '24px', borderRadius: '50%',
            border: '1px solid #E91E63',
            marginLeft: i === 0 ? 0 : '-10px',
            zIndex: 3 - i,
            position: 'relative',
            objectFit: 'cover',
            filter: 'blur(1.5px)'
          }}
          alt="buyer"
        />
      ))}
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [deliveryLibrary, setDeliveryLibrary] = useState([]);
  const [paymentLibrary, setPaymentLibrary] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [viewingCount, setViewingCount] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('product');
  const [gbIndex, setGbIndex] = useState(() => Math.floor(Math.random() * fakeGroupBuys.length));
  const [flashSaleTimeLeft, setFlashSaleTimeLeft] = useState(43 * 60 + 15);
  const [isAnimatingGroupBuy, setIsAnimatingGroupBuy] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState('available');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showSkuModal, setShowSkuModal] = useState(() => {
    return sessionStorage.getItem('productSkuModalOpen') === 'true';
  });
  
  useEffect(() => {
    sessionStorage.setItem('productSkuModalOpen', showSkuModal);
  }, [showSkuModal]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxTouchStartX, setLightboxTouchStartX] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [skuQuantity, setSkuQuantity] = useState(1);
  // Delivery Address & Location State
  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const savedSel = localStorage.getItem('selectedAddress');
      if (savedSel) return JSON.parse(savedSel);
      const savedList = localStorage.getItem('userAddresses');
      if (savedList) {
        const list = JSON.parse(savedList);
        const def = list.find(a => a.isDefault) || list[0];
        if (def) return def;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [savedAddressesList, setSavedAddressesList] = useState(() => {
    try {
      const saved = localStorage.getItem('userAddresses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    recipient: '',
    phone: '',
    city: 'Dhaka',
    addressLine: '',
    name: 'Home'
  });

  // Sync address changes across tabs/windows or after returning from /addresses
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedSel = localStorage.getItem('selectedAddress');
        if (savedSel) setSelectedAddress(JSON.parse(savedSel));
        const savedList = localStorage.getItem('userAddresses');
        if (savedList) setSavedAddressesList(JSON.parse(savedList));
      } catch (e) {}
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handleSelectOrSaveAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem('selectedAddress', JSON.stringify(addr));
    try {
      const existing = localStorage.getItem('userAddresses');
      let list = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex(a => a.id === addr.id || (a.phone === addr.phone && a.addressLine === addr.addressLine));
      if (idx === -1) {
        list = [...list, { ...addr, id: addr.id || Date.now() }];
      } else {
        list[idx] = { ...list[idx], ...addr };
      }
      localStorage.setItem('userAddresses', JSON.stringify(list));
      setSavedAddressesList(list);
    } catch (e) {}
    setShowAddressModal(false);
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!addressFormData.recipient.trim() || !addressFormData.phone.trim() || !addressFormData.addressLine.trim()) {
      alert('Please fill all required address fields.');
      return;
    }
    const newAddr = {
      id: Date.now(),
      name: addressFormData.name || 'Home',
      recipient: addressFormData.recipient.trim(),
      phone: addressFormData.phone.trim(),
      city: addressFormData.city || 'Dhaka',
      addressLine: addressFormData.addressLine.trim(),
      isDefault: true
    };
    handleSelectOrSaveAddress(newAddr);
    setAddressFormData({ recipient: '', phone: '', city: 'Dhaka', addressLine: '', name: 'Home' });
  };

  // Payment Options & Cashout Charge setup
  // Set payment options: bKash Merchant (1.85%) and Nagad Merchant (1.45%) first!
  const [paymentMode, setPaymentMode] = useState('bkash_merchant');
  
  // Payment Gateway & Order states
  const [showBkashGateway, setShowBkashGateway] = useState(false);
  const [showNagadGateway, setShowNagadGateway] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [orderInvoiceId] = useState(() => `OG-${Math.floor(100000 + Math.random() * 900000)}`);

  // bKash Gateway Steps
  const [bkashStep, setBkashStep] = useState(1);
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashOtp, setBkashOtp] = useState('');
  const [bkashPin, setBkashPin] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [bkashPayMethodType, setBkashPayMethodType] = useState('gateway');

  // Nagad Gateway Steps
  const [nagadStep, setNagadStep] = useState(1);
  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadOtp, setNagadOtp] = useState('');
  const [nagadPin, setNagadPin] = useState('');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [nagadPayMethodType, setNagadPayMethodType] = useState('gateway');

  // Location & Delivery Calculation
  const customerCity = selectedAddress?.city || 'Dhaka';
  const isDhakaCity = customerCity.toLowerCase().includes('dhaka');
  // Free delivery for Dhaka as pictured ("Free delivery (Dhaka)") or product freeShipping
  const isFreeDelivery = Boolean(product?.freeShipping || isDhakaCity);
  const deliveryCharge = isFreeDelivery ? 0 : 130;

  // Combo offer discounted price if applicable
  const rawSubtotal = (product?.price || 0) * skuQuantity;
  let comboDiscount = 0;
  if (product?.enableComboOffer && product?.comboTiers?.length > 0) {
    const matchedTier = [...product.comboTiers]
      .sort((a, b) => Number(b.minQty) - Number(a.minQty))
      .find(t => skuQuantity >= Number(t.minQty));
    if (matchedTier) {
      if (matchedTier.discountType === 'percentage') {
        comboDiscount = Math.round((rawSubtotal * Number(matchedTier.discountValue)) / 100);
      } else if (matchedTier.discountType === 'fixed') {
        comboDiscount = Number(matchedTier.discountValue);
      }
    }
  }
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - comboDiscount);

  // Cash Out Charge Calculation
  // bKash Merchant: 1.85%
  // Nagad Merchant: 1.45%
  // Cash on Delivery: 0%
  let cashOutRate = 0;
  let cashOutMethodName = '';
  if (paymentMode === 'bkash_merchant' || paymentMode === 'bkash') {
    cashOutRate = 0.0185;
    cashOutMethodName = 'bKash Merchant';
  } else if (paymentMode === 'nagad_merchant' || paymentMode === 'nagad') {
    cashOutRate = 0.0145;
    cashOutMethodName = 'Nagad Merchant';
  }

  const cashOutCharge = cashOutRate > 0 ? Math.round(subtotalAfterDiscount * cashOutRate) : 0;
  const finalOrderTotal = subtotalAfterDiscount + deliveryCharge + cashOutCharge;

  const handleCompleteOrder = ({ method, status, trxId }) => {
    const orderId = `#OG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: skuQuantity,
        selectedAttributes
      }],
      shippingAddress: selectedAddress,
      paymentMethod: method,
      paymentStatus: status,
      orderStatus: status === 'Paid' ? 'Processing' : 'Pending',
      transactionId: trxId || null,
      subtotal: rawSubtotal,
      discount: comboDiscount,
      deliveryCharge,
      cashOutCharge,
      totalAmount: finalOrderTotal
    };

    setLastPlacedOrder(newOrder);
    localStorage.setItem('recentOrder', JSON.stringify(newOrder));
    try {
      const existing = localStorage.getItem('userOrders');
      const ordersList = existing ? JSON.parse(existing) : [];
      localStorage.setItem('userOrders', JSON.stringify([newOrder, ...ordersList]));
    } catch (e) {
      console.error('Error saving userOrders', e);
    }

    setShowOrderSuccessModal(true);
  };
  const productAttributes = useMemo(() => {
    if (!product) return [];
    
    // First prefer the new attributes array format from AddProduct
    if (product.attributes && Array.isArray(product.attributes) && product.attributes.length > 0) {
      return product.attributes.map(attr => {
        let opts = attr.options;
        if (typeof opts === 'string') {
           opts = opts.split(',').map(o => o.trim()).filter(Boolean);
        }
        return { name: attr.name, options: opts || [] };
      }).filter(attr => attr.options.length > 0);
    }
    
    // Fallback to old colors/sizes format
    let attrs = [];
    if (product.colors && product.colors.length > 0) {
      attrs.push({ name: 'Color', options: typeof product.colors === 'string' ? product.colors.split(',').map(o=>o.trim()) : product.colors });
    }
    if (product.sizes && product.sizes.length > 0) {
      attrs.push({ name: 'Size', options: typeof product.sizes === 'string' ? product.sizes.split(',').map(o=>o.trim()) : product.sizes });
    }
    // Fallback if no variants
    if (attrs.length === 0) {
      attrs.push({ name: 'Size', options: ['Standard'] });
    }
    return attrs;
  }, [product]);

  // Lock background scroll when any modal is open
  useEffect(() => {
    try {
      const dl = localStorage.getItem('deliveryLibraryV4') || localStorage.getItem('deliveryLibrary');
      if (dl) setDeliveryLibrary(JSON.parse(dl));
      
      const pl_loc = localStorage.getItem('paymentLibraryLocalV4');
      const pl_glob = localStorage.getItem('paymentLibraryGlobalV4');
      const pl_leg = localStorage.getItem('paymentLibraryV4') || localStorage.getItem('paymentLibrary');
      
      let combined = [];
      if (pl_loc) combined = [...combined, ...JSON.parse(pl_loc)];
      if (pl_glob) combined = [...combined, ...JSON.parse(pl_glob)];
      if (pl_leg) {
        const legacy = JSON.parse(pl_leg);
        const combinedIds = new Set(combined.map(p => p.id));
        const missingLegacy = legacy.filter(p => !combinedIds.has(p.id));
        combined = [...combined, ...missingLegacy];
      }
      
      if (combined.length > 0) setPaymentLibrary(combined);
    } catch {}
  }, []);

  useEffect(() => {
    if (showSkuModal || showDiscountModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSkuModal, showDiscountModal]);

  const randomPositiveReviews = useMemo(() => {
    if (!product) return 99;
    const numId = parseInt(String(product.id).replace(/\D/g, '')) || 0;
    return 90 + (numId % 10); // 90 to 99
  }, [product]);

  const randomRating = useMemo(() => {
    if (!product) return "4.8";
    const numId = parseInt(String(product.id).replace(/\D/g, '')) || 0;
    return (4.2 + (numId % 8) / 10).toFixed(1); // 4.2 to 4.9
  }, [product]);

  const randomStoreRating = useMemo(() => {
    if (!product) return "4.9";
    const numId = parseInt(String(product.id).replace(/\D/g, '')) || 0;
    return (4.8 + (numId % 2) / 10).toFixed(1); // 4.8 to 4.9
  }, [product]);

  const randomReviewCount = useMemo(() => {
    if (!product) return 488;
    const numId = parseInt(String(product.id).replace(/\D/g, '')) || 0;
    return 100 + (numId * 17) % 900; // 100 to 999
  }, [product]);

  const randomFavorites = useMemo(() => {
    if (!product) return "85.4";
    const numId = parseInt(String(product.id).replace(/\D/g, '')) || 0;
    return (45 + (numId % 80) + (numId % 10) / 10).toFixed(1); // 45.0k to 124.9k
  }, [product]);

  const handleVoucherClick = () => {
    if (voucherStatus === 'available') {
      setVoucherStatus('applied');
      setTimeout(() => alert('৳100 Voucher Applied!'), 100);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const gbInterval = setInterval(() => {
      setIsAnimatingGroupBuy(true);
      setTimeout(() => {
        setIsAnimatingGroupBuy(false);
        setGbIndex(prev => (prev + 1) % fakeGroupBuys.length);
      }, 500); // Wait for transition
    }, 3000);
    return () => clearInterval(gbInterval);
  }, []);

  const visibleGroupBuys = [
    fakeGroupBuys[gbIndex % fakeGroupBuys.length],
    fakeGroupBuys[(gbIndex + 1) % fakeGroupBuys.length],
    fakeGroupBuys[(gbIndex + 2) % fakeGroupBuys.length]
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);

      const reviewEl = document.getElementById('section-review');
      const detailsEl = document.getElementById('section-details');
      
      if (detailsEl && window.scrollY >= detailsEl.offsetTop - 80) {
        setActiveTab('details');
      } else if (reviewEl && window.scrollY >= reviewEl.offsetTop - 80) {
        setActiveTab('review');
      } else {
        setActiveTab('product');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Keep initial viewing count persistent across refreshes
    const storageKey = `viewing_count_${id}`;
    const storedCount = localStorage.getItem(storageKey);
    let initialCount = storedCount ? parseInt(storedCount, 10) : Math.floor(Math.random() * 38) + 8;
    setViewingCount(initialCount);
    
    if (!storedCount) {
      localStorage.setItem(storageKey, initialCount.toString());
    }

    // Randomize viewing count roughly every 2 seconds
    const interval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = prev + change;
        const validCount = newCount < 8 ? 8 : (newCount > 45 ? 45 : newCount);
        localStorage.setItem(storageKey, validCount.toString());
        return validCount;
      });
    }, Math.floor(Math.random() * 1000) + 1500); // 1.5s to 2.5s
    
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scroll_${window.location.pathname}`);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem(`scroll_${window.location.pathname}`);
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
    
    // Find the product from global cache
    const allProducts = getAllProducts();
    const foundProduct = allProducts.find(p => p.id === id || p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <i className="las la-box-open" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
        <h3 style={{ margin: 0, color: '#333' }}>Product not found</h3>
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 24px', background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="pdp-page-wrapper">
      
      {/* Sticky Mobile Header */}
      <div className={`pdp-sticky-header ${isScrolled ? 'visible' : ''}`}>
        <div className="pdp-sticky-header-top">
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
            <i className="las la-angle-left" style={{ fontSize: '24px' }}></i>
          </div>
          <div style={{ fontSize: '15px', color: '#666' }}>
            Sold {formatNumber(product.soldCount)}
          </div>
          <div style={{ cursor: 'pointer' }}>
            <i className="las la-share-square" style={{ fontSize: '24px', color: '#666' }}></i>
          </div>
        </div>
        <div className="pdp-sticky-header-tabs">
          <div className={`pdp-sticky-tab ${activeTab === 'product' ? 'active' : ''}`} onClick={() => {
            setActiveTab('product');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>Product</div>
          <div className={`pdp-sticky-tab ${activeTab === 'review' ? 'active' : ''}`} onClick={() => {
            setActiveTab('review');
            const el = document.getElementById('section-review');
            if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
          }}>Review</div>
          <div className={`pdp-sticky-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => {
            setActiveTab('details');
            const el = document.getElementById('section-details');
            if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
          }}>Details</div>
        </div>
      </div>

      {/* Floating Mobile Header */}
      <div className="pdp-header-overlay" style={{ opacity: isScrolled ? 0 : 1, transition: 'opacity 0.2s ease', pointerEvents: isScrolled ? 'none' : 'none' }}>
        <div className="pdp-header-btn" onClick={() => navigate(-1)}>
          <i className="las la-angle-left" style={{ fontSize: '24px' }}></i>
        </div>
        <div className="pdp-header-actions">
          <div className="pdp-header-btn">
            <i className="las la-share-alt" style={{ fontSize: '20px' }}></i>
          </div>
          <div className="pdp-header-btn" style={{ position: 'relative' }} onClick={() => navigate('/checkout')}>
            <i className="las la-shopping-cart" style={{ fontSize: '20px' }}></i>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--brand-pink)', color: '#fff', fontSize: '10px', fontWeight: 900, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>{cartCount}</span>
            )}
          </div>
        </div>
      </div>

      <div className="pdp-main-content">
        {/* Left Column: Image Gallery */}
        <div className="pdp-image-container">
          <div className="pdd-breadcrumb" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '13px', marginBottom: '20px', padding: '0 4px' }}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#111', fontWeight: '600' }} onClick={() => navigate(-1)}>
              <i className="las la-arrow-left" style={{ fontSize: '16px' }}></i> Back
            </span>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ cursor: 'pointer', color: '#555' }} onClick={() => navigate('/')}>Home</span>
            <span style={{ color: '#ccc' }}>/</span>
            <span style={{ cursor: 'pointer', color: '#555' }}>
              {Array.isArray(product.category) ? product.category.join(' / ') : (product.category || 'Home & Decor')}
            </span>
            <span style={{ color: '#ccc' }}>/</span>
            <span title={product.title} style={{ color: 'var(--brand-pink)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{product.title}</span>
          </div>
          {(() => {
            const productImages = product.images && product.images.length > 0 
              ? product.images 
              : (product.image ? [{ url: product.image, type: product.imageType }] : []);
            
            const renderMedia = (imgObj, isMain = false) => {
              const url = typeof imgObj === 'object' && imgObj !== null ? (imgObj.url || imgObj.src || product.image) : imgObj;
              const safeUrl = typeof url === 'string' ? url : "https://via.placeholder.com/500x500.png?text=Broken+Image";
              
              const isVideo = (typeof imgObj === 'object' && imgObj !== null && imgObj.type && imgObj.type.startsWith('video/')) || 
                              (safeUrl.match(/\.(mp4|webm|ogg)$/i) || safeUrl.startsWith('data:video/'));
              
              if (isVideo) {
                return <video src={safeUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay={isMain} muted loop playsInline />;
              }
              return (
                <img 
                  src={safeUrl} 
                  alt="Product view" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/500x500.png?text=Image+Load+Error"; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              );
            };
            
            const handleScroll = (e) => {
              const scrollLeft = e.target.scrollLeft;
              const width = e.target.clientWidth;
              const index = Math.round(scrollLeft / width);
              setActiveImageIndex(index);
            };

            return (
              <>
                <div className="pdp-image-container-inner">
                  {/* Mobile Gallery */}
                  <div className="pdp-mobile-gallery-container">
                    <div className="pdp-mobile-gallery" onScroll={handleScroll}>
                      {productImages.map((img, idx) => (
                        <div key={idx} className="pdp-mobile-gallery-item">
                          {renderMedia(img, true)}
                        </div>
                      ))}
                    </div>
                    <div className="pdp-image-pagination">{activeImageIndex + 1}/{productImages.length}</div>
                  </div>

                  {/* Desktop Gallery */}
                  <div className="pdp-desktop-gallery">
                    <div className="pdp-desktop-main-image">
                      {renderMedia(productImages[activeImageIndex], true)}
                      
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1);
                        }}
                        style={{
                          position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)',
                          width: '24px', height: '24px', background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', zIndex: 10
                        }}
                      >
                        <i className="las la-angle-left" style={{ fontSize: '12px', color: '#000' }}></i>
                      </div>

                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1);
                        }}
                        style={{
                          position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)',
                          width: '24px', height: '24px', background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', zIndex: 10
                        }}
                      >
                        <i className="las la-angle-right" style={{ fontSize: '12px', color: '#000' }}></i>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      {productImages.length > 5 && (
                        <div 
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={(e) => { e.stopPropagation(); document.getElementById('thumb-scroll').scrollBy({ top: -150, behavior: 'smooth' }); }}
                        >
                          <i className="las la-angle-up" style={{ fontSize: '18px', color: '#555', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', padding: '4px', border: '1px solid #eee' }}></i>
                        </div>
                      )}
                      
                      <div id="thumb-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {productImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                              border: activeImageIndex === idx ? '2px solid var(--brand-pink)' : '2px solid transparent',
                              opacity: activeImageIndex === idx ? 1 : 0.6,
                              transition: 'all 0.2s', flexShrink: 0
                            }}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            {renderMedia(img)}
                          </div>
                        ))}
                      </div>

                      {productImages.length > 5 && (
                        <div 
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={(e) => { e.stopPropagation(); document.getElementById('thumb-scroll').scrollBy({ top: 150, behavior: 'smooth' }); }}
                        >
                          <i className="las la-angle-down" style={{ fontSize: '18px', color: '#555', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', padding: '4px', border: '1px solid #eee' }}></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </>
            );
          })()}
        </div>

        {/* Right Column: Info & Details */}
        <div className="pdp-info-container">
          <div className="pdp-info-scrollable">
          {/* Flash Sale Bar */}
          <div className="pdd-flash-bar">
            <div className="pdd-flash-price">
              <i className="las la-bolt" style={{ fontSize: '24px', marginRight: '4px' }}></i>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: '1' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>৳</span>
                  <span style={{ fontSize: '32px', fontWeight: 900 }}>{product.price.toLocaleString()}</span>
                </div>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '13px', textDecoration: 'line-through', color: 'rgba(255,255,255,0.7)', lineHeight: '1', marginTop: '2px' }}>
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <span className="pdd-flash-savings">
                  Saved ৳{(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>
            <div className="pdd-flash-sold">
              {formatNumber(product.soldCount)} Sold
            </div>
          </div>
          <div className="pdd-countdown-bar">
            {product.discount > 0 && (
              <span 
                className="pdd-discount-tag" 
                onClick={() => setShowDiscountModal(true)}
                style={{ background: 'var(--brand-pink)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginRight: '8px', cursor: 'pointer' }}>
                -{product.discount}%
              </span>
            )}
            <span className="pdd-discount-tag" style={{ background: '#FFEDEE', color: '#E91E63', border: '1px solid #ffcce0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Limited Time</span>
            <span style={{ fontSize: '14px', color: 'var(--brand-pink)', fontWeight: 'bold' }}>
              {Math.floor(flashSaleTimeLeft / 3600).toString().padStart(2, '0')}:
              {Math.floor((flashSaleTimeLeft % 3600) / 60).toString().padStart(2, '0')}:
              {(flashSaleTimeLeft % 60).toString().padStart(2, '0')}
            </span>
            <span 
              onClick={handleVoucherClick}
              style={{ 
                marginLeft: 'auto', 
                fontSize: '12px', 
                color: voucherStatus === 'applied' ? '#2e7d32' : '#E91E63', 
                border: `1px solid ${voucherStatus === 'applied' ? '#2e7d32' : '#E91E63'}`, 
                padding: '2px 8px', 
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: voucherStatus === 'applied' ? '#e8f5e9' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {voucherStatus === 'applied' ? (
                <><i className="las la-check-circle" style={{ fontSize: '14px' }}></i> Applied</>
              ) : (
                <>৳100 Voucher <i className="las la-angle-right"></i></>
              )}
            </span>
          </div>

          {/* Title & Services Card */}
          <div className="pdp-info-card" style={{ marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            
            <h1 style={{ fontSize: '18px', lineHeight: '1.4', fontWeight: 700, color: '#111', margin: '0 0 12px 0' }}>
              {product.ribbon && product.ribbon !== 'None' && (
                <span style={{ 
                  display: 'inline-block', 
                  background: 'var(--brand-pink, #E43292)', 
                  color: '#fff', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  marginRight: '8px', 
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: '-2px'
                }}>
                  {product.ribbon}
                </span>
              )}
              {product.title}
            </h1>

            {(() => {
              const isGlobalProduct = product?.type === 'global' || product?.type === 'Global Product' || product?.marketType === 'global' || product?.product_type === 'Global Product' || product?.product_type === 'China Pre-Order';
              
              let bannerType = product?.deliveryBannerType;
              if (!bannerType && product?.showDeliveryBanner !== false) {
                bannerType = isGlobalProduct ? 'global' : '24-48h';
              }
              
              let deliveryText = '';
              const customDeliveryMatch = deliveryLibrary.find(p => p.id === bannerType);
              
              if (customDeliveryMatch) deliveryText = customDeliveryMatch.label;
              else if (bannerType === '24-48h') deliveryText = '24-48h in Bangladesh';
              else if (bannerType === 'global') deliveryText = '21-28 day (Standard) & 4-7 days (Express)';
              else if (bannerType === '1-5days') deliveryText = '1-5 days in Bangladesh & 1-2 days in Dhaka';
              else if (bannerType?.startsWith('custom:')) deliveryText = bannerType.replace('custom:', '');

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {((bannerType && bannerType !== 'none') || product?.showSameDayDelivery) && (
                        <div style={{ display: 'flex', flexDirection: 'column', background: '#fef5e7', borderRadius: '8px', overflow: 'hidden' }}>
                          {bannerType && bannerType !== 'none' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px' }}>
                              <i className="las la-truck" style={{ fontSize: '22px', color: '#f39c12', marginTop: '2px' }}></i>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Estimated Delivery Time</span>
                                <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', lineHeight: '1.3' }}>{deliveryText}</span>
                                {product?.vendorLocation && (
                                  <span style={{ fontSize: '12px', color: '#666', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <i className="las la-map-marker" style={{ fontSize: '14px', color: '#999' }}></i>
                                    Ships from {product.vendorLocation}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {product?.showSameDayDelivery && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '8px 12px', background: '#fffbeb', borderTop: '1px dashed rgba(243, 156, 18, 0.4)' }}>
                              <i className="las la-bolt" style={{ fontSize: '16px', color: '#f59e0b', marginTop: '1px' }}></i>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 'bold' }}>Same Day Delivery in Dhaka:</span>
                                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 'bold' }}>{localStorage.getItem('sameDayDeliveryLabel') || 'Available for Same Day Delivery (before 12pm)'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  
                  {(() => {
                    const paymentOptsRaw = product?.paymentOption || 'cod';
                    const paymentOptsArray = Array.isArray(paymentOptsRaw) ? paymentOptsRaw : [paymentOptsRaw];
                    
                    if (paymentOptsArray.length === 0) return null;
                    
                    return (
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        {paymentOptsArray.map((opt, idx) => {
                          let paymentText = '';
                          let paymentBg = '#e8f5e9';
                          let paymentIconColor = '#4caf50';
                          let paymentIcon = 'las la-money-bill-wave';
                          
                          const customPaymentMatch = paymentLibrary.find(p => p.id === opt);
                          
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

                          if (customPaymentMatch) {
                             paymentText = customPaymentMatch.label;
                             const labelLower = paymentText.toLowerCase();
                             if (opt === 'cod' || labelLower.includes('cash on delivery')) {
                               paymentBg = '#e8f5e9'; paymentIconColor = '#4caf50'; paymentIcon = 'las la-money-bill-wave';
                             } else if (opt === 'pay_now' || opt === 'full_advance' || labelLower.includes('pay now') || labelLower.includes('full advance')) {
                               paymentBg = '#e3f2fd'; paymentIconColor = '#2196f3'; paymentIcon = 'las la-credit-card';
                             } else if (opt === 'partial_advance' || labelLower.includes('partial advance')) {
                               paymentBg = '#fff3e0'; paymentIconColor = '#ff9800'; paymentIcon = 'las la-wallet';
                             } else {
                               paymentBg = fallbackPalette.bg; paymentIconColor = fallbackPalette.color; paymentIcon = fallbackPalette.icon;
                             }
                          } else if (opt === 'pay_now' || opt === 'full_advance') {
                             paymentText = 'Pay Now';
                             paymentBg = '#e3f2fd'; paymentIconColor = '#2196f3'; paymentIcon = 'las la-credit-card';
                          } else if (opt === 'partial_advance') {
                             paymentText = 'Partial Advance (60% Advance, 40% COD)';
                             paymentBg = '#fff3e0'; paymentIconColor = '#ff9800'; paymentIcon = 'las la-wallet';
                          } else if (opt.startsWith && (opt.startsWith('custom_payment:') || opt.startsWith('custom_pay_local:') || opt.startsWith('custom_pay_global:'))) {
                             let raw = opt.replace('custom_payment:', '').replace('custom_pay_local:', '').replace('custom_pay_global:', '');
                             paymentText = raw.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                             paymentBg = fallbackPalette.bg; paymentIconColor = fallbackPalette.color; paymentIcon = fallbackPalette.icon;
                          } else {
                             paymentText = 'Cash on Delivery Available';
                          }
                          
                          if (!paymentText) return null;
                          
                          return (
                            <div key={idx} style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px', background: paymentBg, borderRadius: '8px', overflow: 'hidden' }}>
                              <i className={paymentIcon} style={{ fontSize: '18px', color: paymentIconColor, flexShrink: 0 }}></i>
                              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: '11px', color: '#333', fontWeight: 'bold', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{paymentText}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* Trust Badges on Main Page */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#111', background: '#fdf2f8', padding: '10px 12px', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                  <i className="las la-truck-return" style={{ fontSize: '18px', color: 'var(--brand-pink)' }}></i>
                  <span>Returns Accepted</span>
                </div>
                <i className="las la-angle-right" style={{ fontSize: '12px', color: '#999' }}></i>
              </div>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#111', background: '#f3e5f5', padding: '10px 12px', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                  <i className="las la-shield-alt" style={{ fontSize: '18px', color: '#9c27b0' }}></i>
                  <span>Safe Payments · Privacy Protection</span>
                </div>
                <i className="las la-angle-right" style={{ fontSize: '12px', color: '#999' }}></i>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div 
                className="clickable-pill"
                onClick={() => navigate(`/product/${product.id}/reviews`)}
                style={{ fontSize: '12px', color: '#111', background: '#fff4e5', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flex: '1', justifyContent: 'space-between' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <i className="las la-star" style={{ fontSize: '18px', color: '#f57c00' }}></i>
                  <span><span style={{ fontWeight: 800 }}>{randomRating}</span> Product Reviews ({randomReviewCount})</span>
                </div>
                <i className="las la-angle-right" style={{ fontSize: '12px', color: '#999' }}></i>
              </div>

              <div 
                className="clickable-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                style={{ fontSize: '12px', color: '#111', background: '#fff4e5', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s', flex: '1', justifyContent: 'center' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <i className="las la-heart" style={{ fontSize: '18px', color: isInWishlist(product.id) ? 'var(--brand-pink)' : '#f57c00' }}></i> 
                <span style={{ fontWeight: 600 }}>{randomFavorites}k Favorites</span>
              </div>
            </div>

            <div className="pdd-group-buy">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="las la-dot-circle pdd-live-pulse-icon" style={{ color: '#E91E63', fontSize: '18px', marginRight: '8px' }}></i>
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    <strong style={{ color: '#333' }}>{viewingCount}</strong> People are viewing right now
                  </span>
                </div>
                
                {/* Stacked Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {visibleGroupBuys.slice(0, 3).map((user, idx) => (
                    <img 
                      key={user.id || idx}
                      src={user.avatar} 
                      alt="Viewer" 
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        border: '2px solid #fff',
                        marginLeft: idx === 0 ? '0' : '-10px',
                        zIndex: 3 - idx,
                        filter: 'blur(1px)',
                        transition: 'all 0.8s ease-in-out'
                      }} 
                    />
                  ))}
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: '#f0f0f0', 
                    border: '2px solid #fff',
                    marginLeft: '-10px',
                    zIndex: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#666',
                    fontWeight: 'bold'
                  }}>
                    +
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {visibleGroupBuys.slice(0, 2).map((user, idx) => (
                  <GroupBuyRow 
                    key={idx} 
                    user={user} 
                    nextUser={visibleGroupBuys[idx + 1]} 
                    isAnimating={isAnimatingGroupBuy} 
                    onJoin={() => { addToCart(product); navigate('/checkout'); }}
                  />
                ))}
              </div>
            </div>


          </div>

          {/* Vendor / Store Card */}
          <div 
            className="pdp-info-card" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s ease' }} 
            onClick={() => navigate(`/store/1`)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fdf6ed', border: '1px solid #fae8d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="las la-store-alt" style={{ fontSize: '24px', color: '#b97a3a' }}></i>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  OURGOODS <i className="las la-check-circle" style={{ color: '#4caf50', fontSize: '14px' }}></i>
                </div>
                <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>
                  <span style={{ color: '#E91E63', fontWeight: 'bold' }}>★ {randomStoreRating}</span> Rating • {randomFavorites}k+ Followers
                </div>
              </div>
            </div>
            <button 
              style={{ background: '#fff', border: '1px solid #E91E63', color: '#E91E63', padding: '6px 16px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={(e) => { e.stopPropagation(); navigate(`/store/1`); }}
            >
              Visit Store <i className="las la-angle-right"></i>
            </button>
          </div>
          
          {/* Description */}
          {product.description && (
            <div style={{ marginTop: '16px', marginBottom: '8px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <i className="las la-file-alt" style={{ color: '#E91E63', fontSize: '22px' }}></i>
                  Product Details
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#6b7280' }}>Specifications, features, and everything you need to know</p>
              </div>
              <div 
                className="product-description-content"
                style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}


          {/* End of Info Card */}
          </div>

          {/* Desktop Actions */}
          <div className="pdd-bottom-action-desktop">
            <div style={{ display: 'flex', flex: 1, background: '#000000', borderRadius: '8px', padding: '8px 16px', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#fff', flex: 1 }} onClick={() => navigate('/store/1')}>
                <i className="las la-store" style={{ fontSize: '24px', color: '#fff', marginBottom: '2px' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Store</span>
              </div>
              <div style={{ width: '1px', height: '30px', background: '#333' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#fff', flex: 1 }} onClick={() => { addToCart(product); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }}>
                <i className="las la-shopping-cart" style={{ fontSize: '24px', color: '#fff', marginBottom: '2px' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Cart</span>
              </div>
              <div style={{ width: '1px', height: '30px', background: '#333' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#fff', flex: 1 }}>
                <i className="las la-comment-dots" style={{ fontSize: '24px', color: '#fff', marginBottom: '2px' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Chat</span>
              </div>
            </div>
            
            <button className="pdd-desktop-btn" style={{ flex: 1.2, background: '#E91E63', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowSkuModal(true)}>
              <ActiveBuyersAvatars />
              <span>Buy Now ৳{product?.price?.toLocaleString() || 0}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Detailed Info Section */}
      <div id="section-details" className="pdp-mobile-detailed-images" style={{ width: '100%', maxWidth: '768px', margin: '16px auto 0', display: 'flex', flexDirection: 'column', background: '#fff', padding: '16px' }}>
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ width: '30px', height: '1px', background: '#eee' }}></span>
          Product Details
          <span style={{ width: '30px', height: '1px', background: '#eee' }}></span>
        </div>
        


        {/* Additional Info Sections */}
        {product.infoSections && product.infoSections.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            {product.infoSections.map((section, idx) => (
              <div key={idx} style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#111' }}>{section.title}</h4>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products - Full Width */}
      <div className="pdp-recommendations-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <i className="las la-heart" style={{ color: '#E91E63', fontSize: '20px' }}></i>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>You may also like</span>
        </div>
        <div className="pdp-recommended-grid">
          {getAllProducts()
            .filter(p => p.id !== product.id)
            .slice(0, 10)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="pdp-bottom-bar">
        <div style={{ display: 'flex', flex: 1, backgroundColor: '#000000', justifyContent: 'space-evenly' }}>
          <div className="pdd-bottom-icon" onClick={() => navigate('/store/1')} style={{ maxWidth: 'none', flex: 1, cursor: 'pointer', color: '#fff' }}>
            <i className="las la-store" style={{ color: '#fff' }}></i>
            <span>Store</span>
          </div>
          <div className="pdd-bottom-icon" onClick={() => { addToCart(product); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }} style={{ maxWidth: 'none', flex: 1, cursor: 'pointer', color: '#fff' }}>
            <i className="las la-shopping-cart" style={{ color: '#fff' }}></i>
            <span>Cart</span>
          </div>
          <div className="pdd-bottom-icon" style={{ maxWidth: 'none', flex: 1, cursor: 'pointer', color: '#fff' }}>
            <i className="las la-comment-dots" style={{ color: '#fff' }}></i>
            <span>Chat</span>
          </div>
        </div>
        <div className="pdd-bottom-action" style={{ flex: 1.2, background: '#E91E63', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowSkuModal(true)}>
          <ActiveBuyersAvatars />
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Buy Now</span>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', zIndex: 10000, whiteSpace: 'nowrap' }}>
          Added to cart successfully
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 99999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }} onClick={() => setShowDiscountModal(false)}>
          <div style={{
            background: '#fff', width: '90%', maxWidth: '400px', borderRadius: '12px', overflow: 'hidden', padding: '24px 0 0 0', position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <i className="las la-times" 
               style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '24px', cursor: 'pointer', color: '#999' }}
               onClick={() => setShowDiscountModal(false)}
            ></i>
            
            <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '900', margin: '0 0 16px 0', color: '#111' }}>Details</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 24px' }}>
              <div style={{ background: '#FFEDEE', color: 'var(--brand-pink)', padding: '12px 24px', borderRadius: '8px', textAlign: 'center', position: 'relative', width: '100%' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  Estimated Price <span style={{ fontWeight: 'bold', fontSize: '16px' }}>৳{product.price.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '12px' }}>Last 3 hours</div>
                <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #FFEDEE' }}></div>
              </div>
            </div>

            <div style={{ background: '#F8F8F8', padding: '24px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                Buy now to enjoy the following benefits
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Original Price</span>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>৳{product.originalPrice.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--brand-pink)', fontSize: '14px', fontWeight: 'bold' }}>{product.discount}% OFF</span>
                <span style={{ color: 'var(--brand-pink)', fontSize: '14px', fontWeight: 'bold' }}>-৳{(product.originalPrice - product.price).toLocaleString()}</span>
              </div>
              
              <div style={{ borderBottom: '1px dashed #ddd', margin: '8px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Estimated Price 
                  <span style={{ color: 'var(--brand-pink)', border: '1px solid var(--brand-pink)', fontSize: '10px', padding: '0 4px', borderRadius: '2px', fontWeight: 'normal' }}>-{product.discount}%</span>
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>৳{product.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
            
      {/* SKU / Variant Selector Modal */}
      {showSkuModal && (
        <div className="sku-modal-overlay" onClick={() => setShowSkuModal(false)}>
          <div className="sku-modal-content" onClick={e => e.stopPropagation()}>
            <i className="las la-arrow-left" 
               style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '24px', cursor: 'pointer', color: '#111', zIndex: 1 }}
               onClick={() => setShowSkuModal(false)}
            ></i>
            <i className="las la-times" 
               style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '24px', cursor: 'pointer', color: '#999', zIndex: 1 }}
               onClick={() => setShowSkuModal(false)}
            ></i>
            
            {/* Address Row - Matching user picture */}
            <div 
              onClick={() => setShowAddressModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                background: '#F8F8F8', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                marginBottom: '16px', 
                marginLeft: '32px', 
                marginRight: '32px',
                border: '1px solid #EEEEEE',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#F8F8F8'}
            >
              <i className="las la-map-marker" style={{ fontSize: '22px', color: '#666', marginRight: '10px', flexShrink: 0 }}></i>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {selectedAddress ? (
                  <>
                    <div style={{ fontSize: '13px', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600' }}>
                      {selectedAddress.recipient} • {selectedAddress.phone}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {selectedAddress.addressLine}, {selectedAddress.city}
                    </div>
                    <div style={{ fontSize: '12px', color: '#E91E63', marginTop: '2px', fontWeight: 'bold' }}>
                      {isFreeDelivery ? `Free delivery (${customerCity})` : `Delivery: ৳${deliveryCharge} (${customerCity})`}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '14px', color: '#222', fontWeight: '600' }}>
                      Select delivery address
                    </div>
                    <div style={{ fontSize: '12px', color: '#E91E63', marginTop: '2px', fontWeight: 'bold' }}>
                      Free delivery (Dhaka)
                    </div>
                  </>
                )}
              </div>
              <i className="las la-angle-right" style={{ fontSize: '16px', color: '#bbb', marginLeft: '8px', flexShrink: 0 }}></i>
            </div>

            {/* Payment Selection - bKash & Nagad Merchant First */}
            <div style={{ marginBottom: '20px', marginLeft: '32px', marginRight: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Payment Method
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {/* 1. bKash Merchant */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('bkash_merchant')}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '8px',
                    border: `1.5px solid ${paymentMode === 'bkash_merchant' ? '#E2136E' : '#EAEAEA'}`,
                    background: paymentMode === 'bkash_merchant' ? '#FDF2F7' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                    transition: 'all 0.2s',
                    boxShadow: paymentMode === 'bkash_merchant' ? '0 2px 8px rgba(226, 19, 110, 0.15)' : 'none'
                  }}
                >
                  <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/bkash.png" alt="bKash" style={{ height: '18px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '12px', fontWeight: paymentMode === 'bkash_merchant' ? 700 : 600, color: paymentMode === 'bkash_merchant' ? '#E2136E' : '#333', textAlign: 'center' }}>
                    bKash Merchant
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#E2136E', background: '#ffe4ef', padding: '1px 5px', borderRadius: '4px' }}>
                    +1.85% Cash Out
                  </span>
                </button>

                {/* 2. Nagad Merchant */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('nagad_merchant')}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '8px',
                    border: `1.5px solid ${paymentMode === 'nagad_merchant' ? '#ED1C24' : '#EAEAEA'}`,
                    background: paymentMode === 'nagad_merchant' ? '#FFF5EE' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                    transition: 'all 0.2s',
                    boxShadow: paymentMode === 'nagad_merchant' ? '0 2px 8px rgba(237, 28, 36, 0.15)' : 'none'
                  }}
                >
                  <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/nagad.png" alt="Nagad" style={{ height: '18px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '12px', fontWeight: paymentMode === 'nagad_merchant' ? 700 : 600, color: paymentMode === 'nagad_merchant' ? '#ED1C24' : '#333', textAlign: 'center' }}>
                    Nagad Merchant
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#ED1C24', background: '#ffe6e6', padding: '1px 5px', borderRadius: '4px' }}>
                    +1.45% Cash Out
                  </span>
                </button>

                {/* 3. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('cod')}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '8px',
                    border: `1.5px solid ${paymentMode === 'cod' ? '#2E7D32' : '#EAEAEA'}`,
                    background: paymentMode === 'cod' ? '#F0FFF4' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                    transition: 'all 0.2s',
                    boxShadow: paymentMode === 'cod' ? '0 2px 8px rgba(46, 125, 50, 0.15)' : 'none'
                  }}
                >
                  <i className="las la-money-bill-wave" style={{ fontSize: '20px', color: '#2E7D32' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: paymentMode === 'cod' ? 700 : 600, color: paymentMode === 'cod' ? '#2E7D32' : '#333', textAlign: 'center' }}>
                    Cash on Delivery
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: '#2E7D32', background: '#e8f5e9', padding: '1px 5px', borderRadius: '4px' }}>
                    Standard COD
                  </span>
                </button>
              </div>
            </div>

            {/* Header: Image & Price */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div 
                style={{ position: 'relative', width: '100px', height: '100px', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
                onClick={() => setIsLightboxOpen(true)}
              >
                <img 
                  src={(() => {
                    const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                    const currentImg = productImages[activeImageIndex] || product.image;
                    return typeof currentImg === 'object' && currentImg !== null ? (currentImg.url || currentImg.src || product.image) : currentImg;
                  })()}
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #eee' }} 
                />
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  <i className="las la-search-plus" style={{ fontSize: '14px' }}></i>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#E91E63', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', marginRight: '2px' }}>৳</span>
                    {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice > product.price && (
                    <div style={{ background: '#f48fb1', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      Saved ৳{(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <div style={{ fontSize: '14px', color: '#888', textDecoration: 'line-through', marginTop: '-4px' }}>
                    ৳{product.originalPrice.toLocaleString()}
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#666', marginTop: product.originalPrice > product.price ? '2px' : '4px' }}>Please select options</div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
              {/* Attributes */}
              {productAttributes.map((attr, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '12px', gap: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#111', fontWeight: 800 }}>{attr.name}</h4>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {attr.options.map(option => (
                      <div 
                        key={option}
                        onClick={() => {
                          setSelectedAttributes(prev => ({ ...prev, [attr.name]: option }));
                          if (attr.name === 'Color') {
                            const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                            let imageIndex = -1;
                            
                            if (product.colorImages) {
                              const colorKey = Object.keys(product.colorImages).find(k => k.toLowerCase() === option.toLowerCase());
                              if (colorKey && product.colorImages[colorKey]) {
                                const imgData = product.colorImages[colorKey];
                                const imgUrl = typeof imgData === 'object' && imgData !== null ? (imgData.url || imgData.src) : imgData;
                                imageIndex = productImages.findIndex(img => {
                                  const url = typeof img === 'object' && img !== null ? (img.url || img.src) : img;
                                  return url === imgUrl;
                                });
                              }
                            }
                            
                            if (imageIndex === -1) {
                              // Fallback for mock products: select image by color option index
                              const optionIndex = attr.options.indexOf(option);
                              if (optionIndex !== -1 && optionIndex < productImages.length) {
                                imageIndex = optionIndex;
                              }
                            }
                            
                            if (imageIndex !== -1) {
                              setActiveImageIndex(imageIndex);
                            }
                          }
                        }}
                        style={{
                          padding: '8px 16px', background: selectedAttributes[attr.name] === option ? '#FFEDEE' : '#f5f5f5',
                          color: selectedAttributes[attr.name] === option ? '#E91E63' : '#333',
                          border: `1px solid ${selectedAttributes[attr.name] === option ? '#E91E63' : 'transparent'}`,
                          borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: selectedAttributes[attr.name] === option ? 'bold' : 'normal',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        {attr.name === 'Color' && (
                          <span style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            backgroundColor: option.includes('|') ? option.split('|')[0].toLowerCase().trim() : option.toLowerCase().trim(),
                            border: '1px solid #ddd', display: 'inline-block', flexShrink: 0
                          }}></span>
                        )}
                        {option.includes('|') ? option.split('|')[0] : option}
                      </div>
                    ))}
                  </div>
                  {attr.name.toLowerCase() === 'size' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#333', fontWeight: 600, marginTop: '12px' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#E91E63'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#333'}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E91E63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 21H3V3" />
                          <path d="M7 21V17" />
                          <path d="M11 21V17" />
                          <path d="M15 21V17" />
                          <path d="M19 21V17" />
                          <path d="M3 7H7" />
                          <path d="M3 11H7" />
                          <path d="M3 15H7" />
                        </svg>
                        <span>Size Guide</span>
                        <i className="las la-angle-right" style={{ fontSize: '10px', color: '#999' }}></i>
                      </div>
                      <span style={{ color: '#eaeaea' }}>|</span>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#E91E63'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#333'}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E91E63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        <span>Check My Size</span>
                        <i className="las la-angle-right" style={{ fontSize: '10px', color: '#999' }}></i>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Combo Offer in SKU Modal */}
              {product.enableComboOffer && product.comboTiers?.length > 0 && (
                <div className="pdp-combo-card" style={{ marginBottom: '20px', background: '#fff0f6', borderRadius: '12px', border: '1px solid #fbcfe8', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#E43292', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '4px 12px', borderBottomLeftRadius: '12px' }}>
                    COMBO OFFER
                  </div>

                  {product.comboTiers && product.comboTiers.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {product.comboTiers.map((tier, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px dashed #fbcfe8', cursor: 'pointer', transition: 'all 0.2s', boxShadow: skuQuantity >= tier.minQty ? '0 0 0 2px #E43292' : 'none' }} onClick={() => setSkuQuantity(Number(tier.minQty))}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                            Buy {tier.minQty} or more items
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#E43292', background: '#fdf2f8', padding: '4px 8px', borderRadius: '6px' }}>
                            Get {tier.discountType === 'percentage' ? `${tier.discountValue}% OFF` : tier.discountType === 'fixed' ? `৳${tier.discountValue} OFF` : 'FREE SHIPPING'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                  <button onClick={() => setSkuQuantity(q => Math.max(1, q - 1))} style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderRight: '1px solid #ddd', fontSize: '16px', color: skuQuantity <= 1 ? '#ccc' : '#333', cursor: 'pointer' }}>-</button>
                  <div style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: '#fff' }}>{skuQuantity}</div>
                  <button onClick={() => setSkuQuantity(q => q + 1)} style={{ width: '32px', height: '32px', background: '#f9f9f9', border: 'none', borderLeft: '1px solid #ddd', fontSize: '16px', cursor: 'pointer', color: '#333' }}>+</button>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '12px 16px', background: '#fff', borderTop: '1px solid #eee', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', padding: '0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                  <span>Subtotal ({skuQuantity} {skuQuantity > 1 ? 'items' : 'item'}):</span>
                  <span>৳{subtotalAfterDiscount.toLocaleString()}</span>
                </div>
                {comboDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                    <span>Combo Discount:</span>
                    <span>-৳{comboDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                  <span>Delivery ({customerCity}):</span>
                  <span>{deliveryCharge === 0 ? <strong style={{ color: '#E91E63' }}>FREE</strong> : `৳${deliveryCharge}`}</span>
                </div>
                {cashOutCharge > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: paymentMode === 'bkash_merchant' ? '#E2136E' : '#ED1C24', fontWeight: 700 }}>
                    <span>{cashOutMethodName} Cash Out Charge ({(cashOutRate * 100).toFixed(2)}%):</span>
                    <span>+৳{cashOutCharge.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', fontWeight: 'bold', color: '#111', borderTop: '1px dashed #eee', paddingTop: '6px', marginTop: '2px' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#E91E63' }}>৳{finalOrderTotal.toLocaleString()}</span>
                </div>
              </div>
              <button 
                style={{ width: '100%', padding: '14px 24px', background: '#E91E63', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)' }}
                onClick={() => {
                  if (Object.keys(selectedAttributes).length < productAttributes.length) {
                    alert('Please select all product options before proceeding');
                    return;
                  }
                  if (!selectedAddress || !selectedAddress.phone || !selectedAddress.addressLine) {
                    setShowAddressModal(true);
                    return;
                  }
                  // Direct payment access!
                  if (paymentMode === 'bkash_merchant' || paymentMode === 'bkash') {
                    setBkashStep(1);
                    setShowBkashGateway(true);
                  } else if (paymentMode === 'nagad_merchant' || paymentMode === 'nagad') {
                    setNagadStep(1);
                    setShowNagadGateway(true);
                  } else {
                    // Cash on Delivery
                    handleCompleteOrder({
                      method: 'Cash on Delivery',
                      status: 'Pending',
                      trxId: null
                    });
                  }
                }}
              >
                <i className={paymentMode === 'bkash_merchant' ? 'las la-bolt' : paymentMode === 'nagad_merchant' ? 'las la-wallet' : 'las la-check-circle'}></i>
                {paymentMode === 'bkash_merchant' ? 'Proceed to bKash Payment' : paymentMode === 'nagad_merchant' ? 'Proceed to Nagad Payment' : 'Confirm Order (COD)'} • ৳{finalOrderTotal.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={(e) => setLightboxTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (lightboxTouchStartX === null) return;
            const diff = lightboxTouchStartX - e.changedTouches[0].clientX;
            const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
            if (diff > 50) {
              setActiveImageIndex(prev => prev < productImages.length - 1 ? prev + 1 : 0);
            } else if (diff < -50) {
              setActiveImageIndex(prev => prev > 0 ? prev - 1 : productImages.length - 1);
            }
            setLightboxTouchStartX(null);
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <button 
              onClick={() => setIsLightboxOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="las la-times" style={{ fontSize: '24px' }}></i>
            </button>
            
            {(() => {
              const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
              const currentImg = productImages[activeImageIndex];
              const safeUrl = typeof currentImg === 'object' && currentImg !== null ? (currentImg.url || currentImg.src || product.image) : currentImg;
              const isVideo = (typeof currentImg === 'object' && currentImg !== null && currentImg.type && currentImg.type.startsWith('video/')) || 
                              (typeof safeUrl === 'string' && (safeUrl.match(/\.(mp4|webm|ogg)$/i) || safeUrl.startsWith('data:video/')));
              
              return (
                <>
                  {productImages.length > 1 && (
                    <>
                      <button onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : productImages.length - 1)} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="las la-angle-left" style={{ fontSize: '24px' }}></i>
                      </button>
                      <button onClick={() => setActiveImageIndex(prev => prev < productImages.length - 1 ? prev + 1 : 0)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="las la-angle-right" style={{ fontSize: '24px' }}></i>
                      </button>
                    </>
                  )}

                  {isVideo ? (
                    <video src={safeUrl} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} controls autoPlay loop playsInline />
                  ) : (
                    <img src={safeUrl} alt="Product Full" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', userSelect: 'none' }} />
                  )}
                  
                  {productImages.length > 1 && (
                    <div style={{ position: 'absolute', bottom: '20px', color: '#fff', fontSize: '14px', background: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: '20px', fontWeight: '500', letterSpacing: '1px' }}>
                      {activeImageIndex + 1} / {productImages.length}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
      {/* Address Selection & Fill-up Modal */}
      {showAddressModal && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', zIndex: 110000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowAddressModal(false)}
        >
          <div 
            style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="las la-map-marker-alt" style={{ fontSize: '24px', color: '#E91E63' }}></i>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111' }}>Select Delivery Address</h3>
              </div>
              <button onClick={() => setShowAddressModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888', padding: '4px' }}>
                <i className="las la-times"></i>
              </button>
            </div>

            {/* Saved addresses list */}
            {savedAddressesList && savedAddressesList.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Saved Addresses
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedAddressesList.map(addr => {
                    const isSelected = selectedAddress && (selectedAddress.id === addr.id || (selectedAddress.phone === addr.phone && selectedAddress.addressLine === addr.addressLine));
                    return (
                      <div 
                        key={addr.id || `${addr.phone}-${addr.recipient}`}
                        onClick={() => handleSelectOrSaveAddress(addr)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#E91E63' : '#eee'}`,
                          background: isSelected ? '#FFF0F5' : '#FAFAFA',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>
                            {addr.recipient} <span style={{ fontSize: '12px', color: '#666', fontWeight: 400 }}>({addr.phone})</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {addr.addressLine}, {addr.city}
                          </div>
                        </div>
                        {isSelected ? (
                          <i className="las la-check-circle" style={{ fontSize: '22px', color: '#E91E63' }}></i>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#E91E63', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: '#ffe4ef' }}>Use</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fill up new address */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                {savedAddressesList && savedAddressesList.length > 0 ? 'Or Fill Up New Address' : 'Enter Delivery Details'}
              </div>
              <form onSubmit={handleSaveNewAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>Recipient Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Fishad Mohammad"
                    value={addressFormData.recipient}
                    onChange={e => setAddressFormData(prev => ({ ...prev, recipient: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>Mobile Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 01700000000"
                    value={addressFormData.phone}
                    onChange={e => setAddressFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>City / District *</label>
                  <select 
                    value={addressFormData.city}
                    onChange={e => setAddressFormData(prev => ({ ...prev, city: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Dhaka">Dhaka (Free Delivery)</option>
                    <option value="Chattogram">Chattogram (৳130 Delivery)</option>
                    <option value="Sylhet">Sylhet (৳130 Delivery)</option>
                    <option value="Khulna">Khulna (৳130 Delivery)</option>
                    <option value="Rajshahi">Rajshahi (৳130 Delivery)</option>
                    <option value="Barisal">Barisal (৳130 Delivery)</option>
                    <option value="Rangpur">Rangpur (৳130 Delivery)</option>
                    <option value="Mymensingh">Mymensingh (৳130 Delivery)</option>
                    <option value="Comilla">Comilla (৳130 Delivery)</option>
                    <option value="Gazipur">Gazipur (৳130 Delivery)</option>
                    <option value="Narayanganj">Narayanganj (৳130 Delivery)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>Full Street Address *</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="House, Road, Area, Landmark"
                    value={addressFormData.addressLine}
                    onChange={e => setAddressFormData(prev => ({ ...prev, addressLine: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{ padding: '14px', background: '#E91E63', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}
                >
                  Save & Select This Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Direct bKash Merchant Payment Access Gateway */}
      {showBkashGateway && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 120000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowBkashGateway(false)}
        >
          <div 
            style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ background: '#E2136E', padding: '20px', color: '#fff', position: 'relative' }}>
              <button 
                onClick={() => setShowBkashGateway(false)} 
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="las la-times" style={{ fontSize: '18px' }}></i>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/bkash.png" alt="bKash" style={{ height: '24px', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>OURGOODS MERCHANT</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Invoice: #{orderInvoiceId}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount to Pay</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>৳{finalOrderTotal.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  Includes 1.85% Cash Out (৳{cashOutCharge})
                </div>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
              <button 
                onClick={() => { setBkashPayMethodType('gateway'); setBkashStep(1); }}
                style={{ flex: 1, padding: '12px', background: bkashPayMethodType === 'gateway' ? '#fff' : '#f9f9f9', border: 'none', borderBottom: bkashPayMethodType === 'gateway' ? '3px solid #E2136E' : 'none', fontWeight: 600, fontSize: '13px', color: bkashPayMethodType === 'gateway' ? '#E2136E' : '#666', cursor: 'pointer' }}
              >
                <i className="las la-bolt" style={{ marginRight: '6px' }}></i> Direct bKash Gateway
              </button>
              <button 
                onClick={() => setBkashPayMethodType('manual')}
                style={{ flex: 1, padding: '12px', background: bkashPayMethodType === 'manual' ? '#fff' : '#f9f9f9', border: 'none', borderBottom: bkashPayMethodType === 'manual' ? '3px solid #E2136E' : 'none', fontWeight: 600, fontSize: '13px', color: bkashPayMethodType === 'manual' ? '#E2136E' : '#666', cursor: 'pointer' }}
              >
                <i className="las la-wallet" style={{ marginRight: '6px' }}></i> Merchant Pay / App
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {bkashPayMethodType === 'gateway' ? (
                <div>
                  {bkashStep === 1 && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                        Your bKash Account Number
                      </label>
                      <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input 
                          type="tel"
                          placeholder="e.g. 017XXXXXXXX"
                          maxLength={11}
                          value={bkashNumber}
                          onChange={e => setBkashNumber(e.target.value)}
                          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1.5px solid #E2136E', fontSize: '16px', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#999' }}>11 digits</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#777', lineHeight: '1.4', margin: '0 0 20px 0' }}>
                        By clicking Proceed, a 6-digit verification code (OTP) will be verified for instant checkout.
                      </p>
                      <button 
                        onClick={() => {
                          if (!bkashNumber || bkashNumber.length < 11) return alert('Please enter valid 11-digit bKash number');
                          setBkashStep(2);
                        }}
                        style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        PROCEED
                      </button>
                    </div>
                  )}

                  {bkashStep === 2 && (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Verification Code Sent</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Code simulated to {bkashNumber} (Default: 123456)</div>
                      </div>
                      <input 
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={bkashOtp}
                        onChange={e => setBkashOtp(e.target.value)}
                        style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '4px', borderRadius: '8px', border: '1.5px solid #E2136E', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
                      />
                      <button 
                        onClick={() => {
                          if (!bkashOtp || bkashOtp.length < 4) return alert('Please enter verification code');
                          setBkashStep(3);
                        }}
                        style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        CONFIRM CODE
                      </button>
                    </div>
                  )}

                  {bkashStep === 3 && (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Enter bKash PIN</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Amount: ৳{finalOrderTotal.toLocaleString()}</div>
                      </div>
                      <input 
                        type="password"
                        placeholder="•••••"
                        maxLength={5}
                        value={bkashPin}
                        onChange={e => setBkashPin(e.target.value)}
                        style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '6px', borderRadius: '8px', border: '1.5px solid #E2136E', fontSize: '20px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
                      />
                      <button 
                        onClick={() => {
                          if (!bkashPin || bkashPin.length < 4) return alert('Please enter your 5-digit PIN');
                          setBkashStep(4);
                          setTimeout(() => {
                            const genTrx = `BK${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                            handleCompleteOrder({
                              method: 'bKash Merchant',
                              status: 'Paid',
                              trxId: genTrx
                            });
                            setShowBkashGateway(false);
                            setShowSkuModal(false);
                          }, 1200);
                        }}
                        style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        CONFIRM PAYMENT
                      </button>
                    </div>
                  )}

                  {bkashStep === 4 && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <i className="las la-spinner la-spin" style={{ fontSize: '48px', color: '#E2136E' }}></i>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '16px', color: '#111' }}>Authorizing with bKash...</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Please do not close this window</div>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual Merchant Payment */
                <div>
                  <div style={{ background: '#fdf2f7', border: '1px dashed #E2136E', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Merchant Number:</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#E2136E' }}>01712-345678</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Reference:</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>OG{orderInvoiceId.slice(-4)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Amount with Cash Out:</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#E2136E' }}>৳{finalOrderTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <ol style={{ fontSize: '12px', color: '#555', paddingLeft: '18px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    <li>Dial <strong>*247#</strong> or open <strong>bKash App</strong></li>
                    <li>Select <strong>Make Payment</strong></li>
                    <li>Enter Merchant Number: <strong>01712-345678</strong></li>
                    <li>Enter Amount: <strong>{finalOrderTotal}</strong></li>
                    <li>Enter Reference: <strong>OG{orderInvoiceId.slice(-4)}</strong> & Counter: <strong>1</strong></li>
                    <li>Enter your PIN to confirm payment</li>
                  </ol>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                      Enter Transaction ID (TrxID) *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9H72KL49X"
                      value={bkashTrxId}
                      onChange={e => setBkashTrxId(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (!bkashTrxId.trim()) return alert('Please enter bKash Transaction ID (TrxID)');
                      handleCompleteOrder({
                        method: 'bKash Merchant (Manual)',
                        status: 'Paid',
                        trxId: bkashTrxId.trim()
                      });
                      setShowBkashGateway(false);
                      setShowSkuModal(false);
                    }}
                    style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Verify & Complete Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Direct Nagad Merchant Payment Access Gateway */}
      {showNagadGateway && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 120000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowNagadGateway(false)}
        >
          <div 
            style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ background: '#ED1C24', padding: '20px', color: '#fff', position: 'relative' }}>
              <button 
                onClick={() => setShowNagadGateway(false)} 
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="las la-times" style={{ fontSize: '18px' }}></i>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/nagad.png" alt="Nagad" style={{ height: '24px', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>OURGOODS MERCHANT</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Invoice: #{orderInvoiceId}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount to Pay</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>৳{finalOrderTotal.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  Includes 1.45% Cash Out (৳{cashOutCharge})
                </div>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
              <button 
                onClick={() => { setNagadPayMethodType('gateway'); setNagadStep(1); }}
                style={{ flex: 1, padding: '12px', background: nagadPayMethodType === 'gateway' ? '#fff' : '#f9f9f9', border: 'none', borderBottom: nagadPayMethodType === 'gateway' ? '3px solid #ED1C24' : 'none', fontWeight: 600, fontSize: '13px', color: nagadPayMethodType === 'gateway' ? '#ED1C24' : '#666', cursor: 'pointer' }}
              >
                <i className="las la-bolt" style={{ marginRight: '6px' }}></i> Direct Nagad Gateway
              </button>
              <button 
                onClick={() => setNagadPayMethodType('manual')}
                style={{ flex: 1, padding: '12px', background: nagadPayMethodType === 'manual' ? '#fff' : '#f9f9f9', border: 'none', borderBottom: nagadPayMethodType === 'manual' ? '3px solid #ED1C24' : 'none', fontWeight: 600, fontSize: '13px', color: nagadPayMethodType === 'manual' ? '#ED1C24' : '#666', cursor: 'pointer' }}
              >
                <i className="las la-wallet" style={{ marginRight: '6px' }}></i> Merchant Pay / App
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {nagadPayMethodType === 'gateway' ? (
                <div>
                  {nagadStep === 1 && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                        Your Nagad Account Number
                      </label>
                      <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input 
                          type="tel"
                          placeholder="e.g. 017XXXXXXXX"
                          maxLength={11}
                          value={nagadNumber}
                          onChange={e => setNagadNumber(e.target.value)}
                          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1.5px solid #ED1C24', fontSize: '16px', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#999' }}>11 digits</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#777', lineHeight: '1.4', margin: '0 0 20px 0' }}>
                        By clicking Proceed, a 6-digit verification code (OTP) will be verified for instant checkout.
                      </p>
                      <button 
                        onClick={() => {
                          if (!nagadNumber || nagadNumber.length < 11) return alert('Please enter valid 11-digit Nagad number');
                          setNagadStep(2);
                        }}
                        style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        PROCEED
                      </button>
                    </div>
                  )}

                  {nagadStep === 2 && (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Verification Code Sent</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Code simulated to {nagadNumber} (Default: 123456)</div>
                      </div>
                      <input 
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={nagadOtp}
                        onChange={e => setNagadOtp(e.target.value)}
                        style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '4px', borderRadius: '8px', border: '1.5px solid #ED1C24', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
                      />
                      <button 
                        onClick={() => {
                          if (!nagadOtp || nagadOtp.length < 4) return alert('Please enter verification code');
                          setNagadStep(3);
                        }}
                        style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        CONFIRM CODE
                      </button>
                    </div>
                  )}

                  {nagadStep === 3 && (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Enter Nagad PIN</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Amount: ৳{finalOrderTotal.toLocaleString()}</div>
                      </div>
                      <input 
                        type="password"
                        placeholder="••••"
                        maxLength={4}
                        value={nagadPin}
                        onChange={e => setNagadPin(e.target.value)}
                        style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '6px', borderRadius: '8px', border: '1.5px solid #ED1C24', fontSize: '20px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
                      />
                      <button 
                        onClick={() => {
                          if (!nagadPin || nagadPin.length < 4) return alert('Please enter your 4-digit PIN');
                          setNagadStep(4);
                          setTimeout(() => {
                            const genTrx = `NG${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                            handleCompleteOrder({
                              method: 'Nagad Merchant',
                              status: 'Paid',
                              trxId: genTrx
                            });
                            setShowNagadGateway(false);
                            setShowSkuModal(false);
                          }, 1200);
                        }}
                        style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        CONFIRM PAYMENT
                      </button>
                    </div>
                  )}

                  {nagadStep === 4 && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <i className="las la-spinner la-spin" style={{ fontSize: '48px', color: '#ED1C24' }}></i>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '16px', color: '#111' }}>Authorizing with Nagad...</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Please do not close this window</div>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual Merchant Payment */
                <div>
                  <div style={{ background: '#FFF5EE', border: '1px dashed #ED1C24', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Merchant Number:</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#ED1C24' }}>01712-345678</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Reference:</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>OG{orderInvoiceId.slice(-4)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Amount with Cash Out:</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ED1C24' }}>৳{finalOrderTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <ol style={{ fontSize: '12px', color: '#555', paddingLeft: '18px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    <li>Dial <strong>*167#</strong> or open <strong>Nagad App</strong></li>
                    <li>Select <strong>Payment</strong></li>
                    <li>Enter Merchant Number: <strong>01712-345678</strong></li>
                    <li>Enter Amount: <strong>{finalOrderTotal}</strong></li>
                    <li>Enter Reference: <strong>OG{orderInvoiceId.slice(-4)}</strong> & Counter: <strong>1</strong></li>
                    <li>Enter your PIN to confirm payment</li>
                  </ol>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                      Enter Transaction ID (TrxID) *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 7K92ML38"
                      value={nagadTrxId}
                      onChange={e => setNagadTrxId(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (!nagadTrxId.trim()) return alert('Please enter Nagad Transaction ID (TrxID)');
                      handleCompleteOrder({
                        method: 'Nagad Merchant (Manual)',
                        status: 'Paid',
                        trxId: nagadTrxId.trim()
                      });
                      setShowNagadGateway(false);
                      setShowSkuModal(false);
                    }}
                    style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Verify & Complete Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Success Receipt Modal */}
      {showOrderSuccessModal && lastPlacedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 130000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '30px 24px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '36px' }}>
              <i className="las la-check"></i>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800, color: '#111' }}>
              Order Placed Successfully!
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#666' }}>
              Thank you for ordering with OURGOODS.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px', border: '1px solid #edf2f7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Order ID:</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{lastPlacedOrder.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Payment Method:</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{lastPlacedOrder.paymentMethod}</span>
              </div>
              {lastPlacedOrder.transactionId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Transaction ID:</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#16a34a' }}>{lastPlacedOrder.transactionId}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Deliver To:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: '200px' }}>
                  {lastPlacedOrder.shippingAddress?.recipient} ({lastPlacedOrder.shippingAddress?.phone})<br />
                  {lastPlacedOrder.shippingAddress?.addressLine}, {lastPlacedOrder.shippingAddress?.city}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Total Paid:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#E91E63' }}>৳{lastPlacedOrder.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowOrderSuccessModal(false);
                  setShowSkuModal(false);
                }}
                style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => {
                  setShowOrderSuccessModal(false);
                  setShowSkuModal(false);
                  navigate('/profile');
                }}
                style={{ flex: 1, padding: '12px', background: '#E91E63', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                View in Orders
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;
