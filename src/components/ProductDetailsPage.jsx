import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../utils/MockData';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import './ProductDetailsPage.css';

const bdMaleNames = ['Anisur R.', 'Mehedi H.', 'Rahim U.', 'Tarek B.', 'Hasan M.', 'Kamrul I.', 'Riyad H.', 'Shakil A.', 'Imran H.', 'Rubel M.', 'Arif R.', 'Rakib H.', 'Sabbir R.', 'Ashiq M.', 'Faisal K.'];
const bdFemaleNames = ['Sadia I.', 'Fatema A.', 'Jannat F.', 'Sumaiya A.', 'Nusrat J.', 'Ayesha S.', 'Farhana A.', 'Sonia A.', 'Mitu S.', 'Tania M.', 'Lima A.', 'Rupa S.', 'Nadia H.'];
const bdCities = ['Dhaka', 'Sylhet', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Comilla', 'Gazipur'];

const fakeGroupBuys = Array.from({ length: 50 }).map((_, i) => {
  const isMale = i % 2 === 0;
  const name = isMale ? bdMaleNames[(i / 2) % bdMaleNames.length] : bdFemaleNames[Math.floor(i / 2) % bdFemaleNames.length];
  const imageId = (Math.floor(i / 2) % 50) + 1; // 1-50 are safe IDs in randomuser.me
  return {
    name,
    location: `From ${bdCities[i % bdCities.length]}`,
    msLeft: Math.floor(Math.random() * 45 * 60000) + 10000, // Random time between 10s and 45m
    avatar: `https://randomuser.me/api/portraits/${isMale ? 'men' : 'women'}/${imageId}.jpg`
  };
});

const GroupBuyRow = ({ user }) => {
  const [timeLeft, setTimeLeft] = useState(user.msLeft);

  useEffect(() => {
    setTimeLeft(user.msLeft);
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(interval);
  }, [user]);

  const mins = Math.floor(timeLeft / 60000).toString().padStart(2, '0');
  const secs = Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0');
  const ms = Math.floor((timeLeft % 1000) / 100);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', width: '45px', height: '36px' }}>
          <img src={user.avatar} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', position: 'absolute', left: 0, zIndex: 2, border: '1px solid #fff' }} />
          <img src={fakeGroupBuys[(fakeGroupBuys.indexOf(user) + 2) % fakeGroupBuys.length].avatar} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', position: 'absolute', right: 0, top: '3px', zIndex: 1, border: '1px solid #fff', opacity: 0.8 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', color: '#333' }}>{user.name}</span>
          <span style={{ fontSize: '10px', color: '#E91E63', border: '1px solid #ffcce0', padding: '1px 4px', borderRadius: '2px', display: 'inline-block', width: 'fit-content', marginTop: '2px' }}>{user.location}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '12px', color: 'var(--brand-pink)' }}>Ending soon</span>
          <span style={{ fontSize: '12px', color: '#666' }}>00:{mins}:{secs}.{ms}</span>
        </div>
        <button style={{ position: 'relative', background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}>
          Join
          <span style={{ position: 'absolute', top: '-8px', right: '-4px', background: '#FFEDEE', color: 'var(--brand-pink)', fontSize: '9px', padding: '2px 4px', borderRadius: '10px', border: '1px solid var(--brand-pink)', whiteSpace: 'nowrap' }}>No wait</span>
        </button>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [viewingCount, setViewingCount] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('product');
  const [gbIndex, setGbIndex] = useState(() => Math.floor(Math.random() * fakeGroupBuys.length));
  const [flashSaleTimeLeft, setFlashSaleTimeLeft] = useState(43 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const gbInterval = setInterval(() => {
      setGbIndex(prev => (prev + 1) % fakeGroupBuys.length);
    }, 2000);
    return () => clearInterval(gbInterval);
  }, []);

  const visibleGroupBuys = [
    fakeGroupBuys[gbIndex % fakeGroupBuys.length],
    fakeGroupBuys[(gbIndex + 1) % fakeGroupBuys.length]
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
          <div className="pdd-breadcrumb" style={{ gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#000', fontWeight: '700' }} onClick={() => navigate(-1)}>
              <i className="las la-arrow-left"></i> Back
            </span>
            <span style={{ color: '#e0e0e0', margin: '0 2px', fontSize: '15px' }}>|</span>
            <span style={{ cursor: 'pointer', color: '#497092' }} onClick={() => navigate('/')}>Home</span>
            <i className="las la-angle-right" style={{ color: '#888', fontSize: '13px' }}></i>
            <span style={{ cursor: 'pointer', color: '#497092' }}>{product.category || 'Home & Decor'}</span>
            <i className="las la-angle-right" style={{ color: '#888', fontSize: '13px' }}></i>
            <span style={{ color: '#000', fontWeight: 600 }}>{product.title}</span>
          </div>
          {(() => {
            const productImages = [
              product.image,
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=800",
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=90&w=800",
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=90&w=800",
              "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=90&w=800"
            ];
            
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
                          <img src={img} alt={`Slide ${idx}`} />
                        </div>
                      ))}
                    </div>
                    <div className="pdp-image-pagination">{activeImageIndex + 1}/{productImages.length}</div>
                  </div>

                  {/* Desktop Gallery */}
                  <div className="pdp-desktop-gallery">
                    <div className="pdp-desktop-main-image">
                      <img src={productImages[activeImageIndex]} alt="Main product view" />
                    </div>
                    <div className="pdp-desktop-thumbnails">
                      {productImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`pdp-thumbnail ${activeImageIndex === idx ? 'active' : ''}`}
                          onMouseEnter={() => setActiveImageIndex(idx)}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img src={img} alt={`Thumbnail ${idx}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Right Column: Info & Details */}
        <div className="pdp-info-container">
          
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
            <span className="pdd-discount-tag" style={{ background: '#FFEDEE', color: '#E91E63', border: '1px solid #ffcce0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Limited Time</span>
            <span style={{ fontSize: '14px', color: 'var(--brand-pink)', fontWeight: 'bold' }}>
              {Math.floor(flashSaleTimeLeft / 3600).toString().padStart(2, '0')}:
              {Math.floor((flashSaleTimeLeft % 3600) / 60).toString().padStart(2, '0')}:
              {(flashSaleTimeLeft % 60).toString().padStart(2, '0')}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#E91E63', border: '1px solid #E91E63', padding: '2px 8px', borderRadius: '4px' }}>
              ৳100 Voucher <i className="las la-angle-right"></i>
            </span>
          </div>

          {/* Title & Services Card */}
          <div className="pdp-info-card" style={{ marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <div className="pdd-services-row">
              <i className="las la-shield-alt" style={{ fontSize: '16px' }}></i>
              <span>Pay After Delivery | Order with 0 upfront, pay after receiving</span>
            </div>
            
            <h1 style={{ fontSize: '18px', lineHeight: '1.4', fontWeight: 700, color: '#111', margin: '0 0 12px 0' }}>
              {product.title} <span style={{ background: '#000', color: '#fff', fontSize: '11px', padding: '2px 4px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '4px' }}>Free Return</span>
            </h1>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#b97a3a', background: '#fdf6ed', padding: '4px 8px', borderRadius: '4px' }}>99% Positive Reviews</span>
              <span style={{ fontSize: '12px', color: '#b97a3a', background: '#fdf6ed', padding: '4px 8px', borderRadius: '4px' }}>1.2k Favorites</span>
            </div>

            <div className="pdd-group-buy">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <i className="las la-dot-circle pdd-live-pulse-icon" style={{ color: '#E91E63', fontSize: '18px', marginRight: '8px' }}></i>
                <span style={{ fontSize: '14px', color: '#555' }}>
                  <strong style={{ color: '#333' }}>{viewingCount}</strong> People are viewing right now
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {visibleGroupBuys.map((user, idx) => (
                  <GroupBuyRow key={`${user.name}-${idx}`} user={user} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#666', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><i className="las la-check-circle" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i> Free Return</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><i className="las la-check-circle" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i> 7 Days Refund</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><i className="las la-check-circle" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i> Fast Shipping</span>
            </div>
          </div>

          {/* Reviews Card */}
          <div className="pdp-info-card" id="section-review">
            <div className="pdd-reviews-header">
              <span>Product Reviews (488)</span>
              <span 
                style={{ fontSize: '13px', color: '#999', fontWeight: 'normal', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product.id}/reviews`)}
              >
                View All <i className="las la-angle-right"></i>
              </span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="las la-user-circle" style={{ fontSize: '24px', color: '#ccc' }}></i>
                <span style={{ fontSize: '13px', color: '#333' }}>Anonymous User</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: '1.5' }}>Received the item, it's very good and fits perfectly. Will definitely buy again!</p>
            </div>
            
            <div className="pdd-group-buy">
              <div className="pdd-reviews-header" style={{ marginBottom: 0 }}>
                <span>Store Reviews (1.8k+)</span>
                <span 
                  style={{ fontSize: '13px', color: '#999', fontWeight: 'normal', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product.id}/reviews`)}
                >
                  View All <i className="las la-angle-right"></i>
                </span>
              </div>
              <div className="pdd-review-tags">
                <span className="pdd-review-tag" style={{ background: '#000', color: '#fff' }}><i className="las la-check-circle"></i> Good Service</span>
                <span className="pdd-review-tag">Returning Customers</span>
                <span className="pdd-review-tag">Looks Good</span>
                <span className="pdd-review-tag">Cheap</span>
                <span className="pdd-review-tag">Great Quality</span>
                <span className="pdd-review-tag">Perfect Color</span>
              </div>
            </div>
          </div>

          {/* Store Card */}
          <div className="pdp-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <i className="las la-store" style={{ fontSize: '24px', color: 'var(--brand-pink)' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{product.brand} Store</div>
                <div style={{ fontSize: '12px', color: 'var(--brand-pink)', marginTop: '4px' }}>17k New Positive Reviews <i className="las la-star"></i><i className="las la-star"></i><i className="las la-star"></i><i className="las la-star"></i><i className="las la-star-half-alt"></i></div>
              </div>
              <button style={{ background: 'transparent', border: '1px solid #ccc', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', color: '#333' }}>Enter Store</button>
            </div>
            
            <div className="pdd-store-stats">
              <div className="pdd-store-stat-item">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>2779 Sold</span>
                <span style={{ fontSize: '11px', color: '#999' }}>Last 30 Days</span>
              </div>
              <div className="pdd-store-stat-item">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>67 Items</span>
                <span style={{ fontSize: '11px', color: '#999' }}>New in 30 Days</span>
              </div>
              <div className="pdd-store-stat-item">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>2.8k Followers</span>
                <span style={{ fontSize: '11px', color: '#999' }}>Total Favorites</span>
              </div>
            </div>
          </div>

          {/* Specs / Details */}
          <div className="pdp-info-card" id="section-details">
            <div className="pdd-reviews-header">
              <span>Product Specs</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ width: '33%', padding: '12px 0', borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>Brand</span>
                <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', marginTop: '4px' }}>{product.brand}</span>
              </div>
              <div style={{ width: '33%', padding: '12px 0', borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>Category</span>
                <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', marginTop: '4px' }}>{product.category}</span>
              </div>
              <div style={{ width: '33%', padding: '12px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>Material</span>
                <span style={{ fontSize: '13px', color: '#333', fontWeight: 'bold', marginTop: '4px' }}>Premium</span>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="pdd-bottom-action-desktop">
            <button className="pdd-desktop-btn" style={{ background: '#000000' }} onClick={() => { addToCart(product); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }}>Add to Cart</button>
            <button className="pdd-desktop-btn" style={{ background: '#E91E63' }} onClick={() => { addToCart(product); navigate('/checkout'); }}>Group Buy for ৳{product.price.toLocaleString()}</button>
          </div>

        </div>
      </div>

      {/* Detailed Images Section (Mobile Only) */}
      <div className="pdp-mobile-detailed-images" style={{ width: '100%', maxWidth: '768px', margin: '16px auto 0', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ width: '30px', height: '1px', background: '#eee' }}></span>
          Product Details
          <span style={{ width: '30px', height: '1px', background: '#eee' }}></span>
        </div>
        <img src={product.image} style={{ width: '100%', display: 'block' }} alt="Detail 1" />
        <img src={product.image} style={{ width: '100%', display: 'block', filter: 'brightness(0.95)' }} alt="Detail 2" />
        <img src={product.image} style={{ width: '100%', display: 'block', filter: 'contrast(1.1)' }} alt="Detail 3" />
        <img src={product.image} style={{ width: '100%', display: 'block', filter: 'saturate(1.2)' }} alt="Detail 4" />
        <img src={product.image} style={{ width: '100%', display: 'block', filter: 'hue-rotate(5deg)' }} alt="Detail 5" />
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
        <div className="pdd-bottom-icon">
          <i className="las la-store"></i>
          <span>Store</span>
        </div>
        <div className="pdd-bottom-icon">
          <i className="lar la-heart"></i>
          <span>Favorite</span>
        </div>
        <div className="pdd-bottom-icon">
          <i className="lar la-comment-dots"></i>
          <span>Message</span>
        </div>
        <div className="pdd-bottom-action secondary" onClick={() => { addToCart(product); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }}>
          <span style={{ fontSize: '16px' }}>Add to Cart</span>
        </div>
        <div className="pdd-bottom-action" onClick={() => { addToCart(product); navigate('/checkout'); }}>
          <span>৳{product.price.toLocaleString()}</span>
          <span style={{ fontSize: '11px', fontWeight: 'normal' }}>Group Buy</span>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', zIndex: 10000, whiteSpace: 'nowrap' }}>
          Added to cart successfully
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;
