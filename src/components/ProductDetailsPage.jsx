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
  const isGlobalProduct = product?.type === 'global' || product?.type === 'Global Product' || product?.marketType === 'global' || product?.product_type === 'Global Product' || product?.product_type === 'China Pre-Order';
  
  const banners = isGlobalProduct ? [
    {
      bg: '#fef5e7', color: '#f39c12', icon: 'las la-truck', titleColor: '#666', title: 'Standard Delivery', subtitleColor: '#333', subtitle: '21 - 28 Days'
    },
    {
      bg: '#e3f2fd', color: '#2196f3', icon: 'las la-shipping-fast', titleColor: '#666', title: 'Express Delivery', subtitleColor: '#333', subtitle: '4 - 7 Business Days'
    },
    {
      bg: '#e8f5e9', color: '#4caf50', icon: 'las la-money-bill-wave', titleColor: '#333', title: 'Cash on Delivery Available', subtitleColor: '', subtitle: ''
    }
  ] : [
    {
      bg: '#FFF7ED', color: '#D97706', icon: 'las la-truck', titleColor: '#92400E', title: 'Estimated Delivery', subtitleColor: '#000', subtitle: '24-48h in Bangladesh'
    },
    {
      bg: '#ECFDF5', color: '#059669', icon: 'las la-money-bill-wave', titleColor: '#000', title: 'Cash on Delivery Available', subtitleColor: '', subtitle: ''
    }
  ];

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
  const [showSkuModal, setShowSkuModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [skuQuantity, setSkuQuantity] = useState(1);
  const [customerLocationName, setCustomerLocationName] = useState('Dhaka');
  const [customerAddress, setCustomerAddress] = useState(`Fish..., 159****5575, ${customerLocationName}, Bangladesh...`);
  const [paymentMode, setPaymentMode] = useState('cod');
  const [selectedPayment, setSelectedPayment] = useState('bKash');
  const [savedPayments, setSavedPayments] = useState({ bKash: '', Nagad: '', Bank: '' });
  const [newPaymentInput, setNewPaymentInput] = useState('');
  const deliveryCharge = customerLocationName.toLowerCase() === 'dhaka' ? 60 : 130;
  const productAttributes = useMemo(() => {
    if (!product) return [];
    let attrs = [];
    if (product.colors && product.colors.length > 0) {
      attrs.push({ name: 'Color', options: product.colors });
    }
    if (product.sizes && product.sizes.length > 0) {
      attrs.push({ name: 'Size', options: product.sizes });
    }
    // Fallback if no variants
    if (attrs.length === 0) {
      attrs.push({ name: 'Size', options: ['Standard'] });
    }
    return attrs;
  }, [product]);

  // Lock background scroll when any modal is open
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
          <div className="pdd-breadcrumb" style={{ alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden', gap: '8px', fontSize: '12px', marginBottom: '16px' }}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#000', fontWeight: '700', flexShrink: 0 }} onClick={() => navigate(-1)}>
              <i className="las la-arrow-left"></i> Back
            </span>
            <span style={{ color: '#e0e0e0', margin: '0 2px', fontSize: '13px', flexShrink: 0 }}>|</span>
            <span style={{ cursor: 'pointer', color: '#000', flexShrink: 0 }} onClick={() => navigate('/')}>Home</span>
            <span style={{ color: '#888', margin: '0 4px', flexShrink: 0 }}>/</span>
            <span style={{ cursor: 'pointer', color: '#000', flexShrink: 0 }}>{product.category || 'Home & Decor'}</span>
            <span style={{ color: '#888', margin: '0 4px', flexShrink: 0 }}>/</span>
            <span title={product.title} style={{ color: 'var(--brand-pink)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</span>
          </div>
          {(() => {
            const productImages = product.images && product.images.length > 0 
              ? product.images 
              : (product.image ? [{ url: product.image, type: product.imageType }] : []);
            
            const renderMedia = (imgObj, isMain = false) => {
              const url = typeof imgObj === 'object' && imgObj !== null ? (imgObj.url || imgObj) : imgObj;
              const isVideo = (typeof imgObj === 'object' && imgObj !== null && imgObj.type && imgObj.type.startsWith('video/')) || 
                              (typeof url === 'string' && (url.match(/\.(mp4|webm|ogg)$/i) || url.startsWith('data:video/')));
              
              if (isVideo) {
                return <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay={isMain} muted loop playsInline />;
              }
              return <img src={url} alt="Product view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
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
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
                      {productImages.length > 5 && (
                        <div 
                          style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={(e) => { e.stopPropagation(); document.getElementById('thumb-scroll').scrollBy({ top: -150, behavior: 'smooth' }); }}
                        >
                          <i className="las la-angle-up" style={{ fontSize: '18px', color: '#555', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', padding: '2px', border: '1px solid #eee' }}></i>
                        </div>
                      )}
                      
                      <div id="thumb-scroll" className="pdp-desktop-thumbnails" style={{ position: 'relative', scrollBehavior: 'smooth' }}>
                        {productImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            className={`pdp-thumbnail ${activeImageIndex === idx ? 'active' : ''}`}
                            onMouseEnter={() => setActiveImageIndex(idx)}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            {renderMedia(img, false)}
                          </div>
                        ))}
                      </div>

                      {productImages.length > 5 && (
                        <div 
                          style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={(e) => { e.stopPropagation(); document.getElementById('thumb-scroll').scrollBy({ top: 150, behavior: 'smooth' }); }}
                        >
                          <i className="las la-angle-down" style={{ fontSize: '18px', color: '#555', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', padding: '2px', border: '1px solid #eee' }}></i>
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
              
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {bannerType === 'global' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#fef5e7', borderRadius: '8px' }}>
                        <i className="las la-truck" style={{ fontSize: '20px', color: '#f39c12' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Standard Delivery</span>
                            {product?.vendorLocation && (
                              <span style={{ fontSize: '11px', background: '#fff', border: '1px solid #f39c12', color: '#f39c12', padding: '1px 6px', borderRadius: '4px' }}>from {product.vendorLocation}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2', marginTop: '2px' }}>21 - 28 Days</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#e3f2fd', borderRadius: '8px' }}>
                        <i className="las la-shipping-fast" style={{ fontSize: '20px', color: '#2196f3' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Express Delivery</span>
                            {product?.vendorLocation && (
                              <span style={{ fontSize: '11px', background: '#fff', border: '1px solid #2196f3', color: '#2196f3', padding: '1px 6px', borderRadius: '4px' }}>from {product.vendorLocation}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2', marginTop: '2px' }}>4 - 7 Business Days</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {bannerType === '24-48h' && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: '#fef5e7', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="las la-truck" style={{ fontSize: '20px', color: '#f39c12' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Estimated Delivery</span>
                            {product?.vendorLocation && (
                              <span style={{ fontSize: '11px', background: '#fff', border: '1px solid #f39c12', color: '#f39c12', padding: '1px 6px', borderRadius: '4px' }}>from {product.vendorLocation}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>24-48h in Bangladesh</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bannerType === '1-5days' && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: '#fef5e7', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="las la-truck" style={{ fontSize: '20px', color: '#f39c12' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Estimated Delivery</span>
                            {product?.vendorLocation && (
                              <span style={{ fontSize: '11px', background: '#fff', border: '1px solid #f39c12', color: '#f39c12', padding: '1px 6px', borderRadius: '4px' }}>from {product.vendorLocation}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>1-5 Days in Bangladesh & 1-2 Days in Dhaka</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bannerType?.startsWith('custom:') && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: '#fef5e7', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="las la-truck" style={{ fontSize: '20px', color: '#f39c12' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Estimated Delivery</span>
                            {product?.vendorLocation && (
                              <span style={{ fontSize: '11px', background: '#fff', border: '1px solid #f39c12', color: '#f39c12', padding: '1px 6px', borderRadius: '4px' }}>from {product.vendorLocation}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>{bannerType.replace('custom:', '')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product?.showSameDayDelivery && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', background: '#fef5e7', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="las la-shipping-fast" style={{ fontSize: '20px', color: '#f39c12' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>Same Day Delivery</span>
                          </div>
                          <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>(before 12pm order)</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(!product?.paymentOption || product?.paymentOption === 'cod') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#e8f5e9', borderRadius: '8px' }}>
                      <i className="las la-money-bill-wave" style={{ fontSize: '20px', color: '#4caf50' }}></i>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>Cash on Delivery Available</span>
                      </div>
                    </div>
                  )}
                  {product?.paymentOption === 'full_advance' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#e3f2fd', borderRadius: '8px' }}>
                      <i className="las la-credit-card" style={{ fontSize: '20px', color: '#2196f3' }}></i>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>Full Advance Payment Required</span>
                      </div>
                    </div>
                  )}
                  {product?.paymentOption === 'partial_advance' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#fff3e0', borderRadius: '8px' }}>
                      <i className="las la-wallet" style={{ fontSize: '20px', color: '#ff9800' }}></i>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', lineHeight: '1.2' }}>60% Advance, 40% Cash on Delivery</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div 
                className="clickable-pill"
                onClick={() => navigate(`/product/${product.id}/reviews`)}
                style={{ fontSize: '12px', color: '#b97a3a', background: '#fdf6ed', border: '1px solid #f6e6d1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flex: '1', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="las la-star" style={{ fontSize: '14px' }}></i>
                  <span><span style={{ fontWeight: 700 }}>{randomRating}</span> Product Reviews ({randomReviewCount})</span>
                </div>
                <i className="las la-angle-right" style={{ fontSize: '12px' }}></i>
              </div>

              <div 
                className="clickable-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                style={{ fontSize: '12px', color: '#b97a3a', background: '#fdf6ed', border: '1px solid #f6e6d1', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <i className={isInWishlist(product.id) ? "las la-heart" : "lar la-heart"} style={{ fontSize: '14px', color: isInWishlist(product.id) ? 'var(--brand-pink)' : '#b97a3a' }}></i> 
                <span>{randomFavorites}k Favorites</span>
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
        
        {/* Description */}
        {product.description && (
          <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', marginBottom: '24px', whiteSpace: 'pre-line' }}>
            {product.description}
          </div>
        )}

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
            <i className="las la-times" 
               style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '24px', cursor: 'pointer', color: '#999', zIndex: 1 }}
               onClick={() => setShowSkuModal(false)}
            ></i>
            
            {/* Address Row */}
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#F8F8F8', padding: '12px', borderRadius: '8px', marginBottom: '16px', marginRight: '32px' }}>
              <i className="las la-map-marker" style={{ fontSize: '20px', color: '#999', marginRight: '6px' }}></i>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px', fontWeight: '500' }}>
                  {customerAddress}
                </div>
                <div style={{ fontSize: '12px', color: '#E91E63', marginTop: '2px', fontWeight: 'bold' }}>
                  Delivery Charge: ৳{deliveryCharge} ({customerLocationName})
                </div>
              </div>
              <i className="las la-angle-right" style={{ fontSize: '16px', color: '#bbb' }}></i>
            </div>

            {/* Payment Selection */}
            <div style={{ marginBottom: '24px', marginRight: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => setPaymentMode('cod')}
                  style={{ flex: 1, padding: '10px', border: `2px solid ${paymentMode === 'cod' ? '#E91E63' : '#eee'}`, background: paymentMode === 'cod' ? '#FFF0F5' : '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <i className="las la-money-bill-wave" style={{ fontSize: '20px', color: paymentMode === 'cod' ? '#E91E63' : '#666' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: paymentMode === 'cod' ? 'bold' : 'normal', color: paymentMode === 'cod' ? '#E91E63' : '#333' }}>Cash on Delivery</span>
                </button>
                <button
                  onClick={() => setPaymentMode('pay_now')}
                  style={{ flex: 1, padding: '10px', border: `2px solid ${paymentMode === 'pay_now' ? '#E91E63' : '#eee'}`, background: paymentMode === 'pay_now' ? '#FFF0F5' : '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <i className="las la-credit-card" style={{ fontSize: '20px', color: paymentMode === 'pay_now' ? '#E91E63' : '#666' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: paymentMode === 'pay_now' ? 'bold' : 'normal', color: paymentMode === 'pay_now' ? '#E91E63' : '#333' }}>Pay Now</span>
                </button>
              </div>

              {paymentMode === 'pay_now' && (
                <>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { name: 'bKash', iconUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/bkash.png' }, 
                      { name: 'Nagad', iconUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/nagad.png' }, 
                      { name: 'Bank', icon: 'las la-university' }
                    ].map(method => (
                      <button 
                        key={method.name}
                        onClick={() => { setSelectedPayment(method.name); setNewPaymentInput(''); }}
                        style={{ flex: 1, padding: '8px', border: `1px solid ${selectedPayment === method.name ? '#E91E63' : '#ddd'}`, background: selectedPayment === method.name ? '#FFF0F5' : '#fff', color: selectedPayment === method.name ? '#E91E63' : '#666', borderRadius: '6px', fontSize: '13px', fontWeight: selectedPayment === method.name ? 'bold' : 'normal', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        {method.iconUrl ? (
                          <img src={method.iconUrl} alt={method.name} style={{ height: '16px', objectFit: 'contain' }} />
                        ) : (
                          <>
                            <i className={method.icon} style={{ fontSize: '16px' }}></i>
                            {method.name}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div style={{ background: '#F8F8F8', padding: '12px', borderRadius: '8px' }}>
                    {savedPayments[selectedPayment] ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#333' }}>
                          <span style={{ color: '#888', marginRight: '4px' }}>Saved {selectedPayment}:</span> 
                          <span style={{ fontWeight: 'bold' }}>{savedPayments[selectedPayment]}</span>
                        </div>
                        <button 
                          onClick={() => setSavedPayments(prev => ({ ...prev, [selectedPayment]: '' }))}
                          style={{ background: 'none', border: 'none', color: '#E91E63', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder={`Enter ${selectedPayment} ${selectedPayment === 'Bank' ? 'account' : 'number'} to save`}
                          value={newPaymentInput}
                          onChange={e => setNewPaymentInput(e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                        />
                        <button 
                          onClick={() => {
                            if(newPaymentInput.trim()) {
                              setSavedPayments(prev => ({ ...prev, [selectedPayment]: newPaymentInput.trim() }));
                              setNewPaymentInput('');
                            }
                          }}
                          style={{ padding: '0 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {paymentMode === 'cod' && (
                <div style={{ background: '#FFF0F5', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px dashed #E91E63' }}>
                  <i className="las la-hand-holding-usd" style={{ color: '#E91E63', fontSize: '20px' }}></i>
                  <div style={{ fontSize: '13px', color: '#E91E63', fontWeight: '500' }}>Pay directly in cash when your order arrives.</div>
                </div>
              )}
            </div>

            {/* Header: Image & Price */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: '#E91E63', fontSize: '24px', fontWeight: 'bold' }}>৳{product.price.toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Please select options</div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
              {/* Attributes */}
              {productAttributes.map((attr, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333' }}>{attr.name}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {attr.options.map(option => (
                      <div 
                        key={option}
                        onClick={() => {
                          setSelectedAttributes(prev => ({ ...prev, [attr.name]: option }));
                          if (attr.name === 'Color' && product.colorImages && product.colorImages[option]) {
                            const imageUrl = product.colorImages[option];
                            const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                            const imageIndex = productImages.indexOf(imageUrl);
                            if (imageIndex !== -1) {
                              setActiveImageIndex(imageIndex);
                            }
                          }
                        }}
                        style={{
                          padding: '8px 16px', background: selectedAttributes[attr.name] === option ? '#FFEDEE' : '#f5f5f5',
                          color: selectedAttributes[attr.name] === option ? '#E91E63' : '#333',
                          border: `1px solid ${selectedAttributes[attr.name] === option ? '#E91E63' : 'transparent'}`,
                          borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: selectedAttributes[attr.name] === option ? 'bold' : 'normal'
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Subtotal ৳{(product.price * skuQuantity).toLocaleString()} + Delivery ৳{deliveryCharge}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#E91E63' }}>
                  Total: ৳{((product.price * skuQuantity) + deliveryCharge).toLocaleString()}
                </div>
              </div>
              <button 
                style={{ width: '100%', padding: '14px 24px', background: '#E91E63', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  if(Object.keys(selectedAttributes).length < productAttributes.length) {
                    alert('Please select all options before proceeding');
                    return;
                  }
                  if(paymentMode === 'pay_now' && !savedPayments[selectedPayment]) {
                    alert(`Please save your ${selectedPayment} payment details before confirming.`);
                    return;
                  }
                  addToCart({ 
                    ...product, 
                    selectedAttributes, 
                    paymentMethod: paymentMode === 'cod' ? 'Cash on Delivery' : selectedPayment, 
                    paymentDetails: paymentMode === 'cod' ? null : savedPayments[selectedPayment] 
                  }, skuQuantity);
                  setShowSkuModal(false);
                  navigate('/checkout');
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;
