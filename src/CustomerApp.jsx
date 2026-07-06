import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import './index.css';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import AIChatbot from './components/AIChatbot';
import AllCategorySection from './components/AllCategorySection';
import ReviewPage from './components/ReviewPage';
import MessagePage from './components/MessagePage';
import ProfilePage from './components/ProfilePage';
import NewUserPromoModal from './components/NewUserPromoModal';

const searchSuggestions = [
  "summer dresses",
  "wireless earbuds",
  "leather bags",
  "korean skincare",
  "men sneakers",
  "diamond necklace",
  "crop tops",
  "home decor"
];

const categories = ['Home', 'Women', 'Jewelry & Accessories', 'Purse & Bags', 'Sneakers & Shoes', 'Beauty & Health', 'Home & Decor'];

function CustomerApp() {
  const navigate = useNavigate();
  const { cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNav, setActiveNav] = useState('Home');
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showPromoModal, setShowPromoModal] = useState(() => {
    return sessionStorage.getItem('promoShown') !== 'true';
  });
  const [messageCount, setMessageCount] = useState(2); // Mocking 2 unread messages
  const [userCity, setUserCity] = useState(() => {
    return localStorage.getItem('userCity') || null;
  });

  const [showDailyDiscoverTabs, setShowDailyDiscoverTabs] = useState(false);
  const [dailyDiscoverActiveTab, setDailyDiscoverActiveTab] = useState('For You');

  useEffect(() => {
    const handleDailyDiscoverSticky = (e) => {
      const isSticky = e.detail;
      setShowDailyDiscoverTabs(isSticky);
      if (!isSticky) {
        setActiveTab(0);
        setTimeout(() => {
          const el = document.getElementById('category-scroll');
          if (el) el.scrollTo({ left: 0, behavior: 'smooth' });
        }, 50);
      }
    };
    const handleSync = (e) => setDailyDiscoverActiveTab(e.detail);
    window.addEventListener('dailyDiscoverSticky', handleDailyDiscoverSticky);
    window.addEventListener('dailyDiscoverSync', handleSync);
    return () => {
      window.removeEventListener('dailyDiscoverSticky', handleDailyDiscoverSticky);
      window.removeEventListener('dailyDiscoverSync', handleSync);
    };
  }, []);

  const handleClosePromo = () => {
    setShowPromoModal(false);
    sessionStorage.setItem('promoShown', 'true');
  };

  const handleLocationClick = () => {
    const city = prompt("Enter your city name (e.g., Dhaka, BD):", userCity || "");
    if (city !== null) {
      if (city.trim() === "") {
        localStorage.removeItem('userCity');
        setUserCity(null);
      } else {
        localStorage.setItem('userCity', city.trim());
        setUserCity(city.trim());
      }
    }
  };

  const scrollRef = useRef(null);
  const tabRefs = useRef([]);
  const dailyDiscoverTabRefs = useRef({});

  useEffect(() => {
    if (showDailyDiscoverTabs && dailyDiscoverTabRefs.current[dailyDiscoverActiveTab]) {
      setTimeout(() => {
        if (dailyDiscoverTabRefs.current[dailyDiscoverActiveTab]) {
          dailyDiscoverTabRefs.current[dailyDiscoverActiveTab].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }, 50);
    } else if (!showDailyDiscoverTabs && dailyDiscoverTabRefs.current[dailyDiscoverActiveTab]) {
      dailyDiscoverTabRefs.current[dailyDiscoverActiveTab].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [dailyDiscoverActiveTab, showDailyDiscoverTabs]);

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeNav !== 'Message') {
      setHideBottomNav(false);
    }
    if (activeNav !== 'Home') {
      setShowAnnouncement(false);
    }
  }, [activeNav]);

  // Hide announcement on scroll
  useEffect(() => {
    const handleScrollEvent = (e) => {
      if (showAnnouncement) {
        if ((e.target && e.target.scrollTop > 10) || window.scrollY > 10) {
          setShowAnnouncement(false);
        }
      }
    };
    window.addEventListener('scroll', handleScrollEvent, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', handleScrollEvent, { capture: true });
  }, [showAnnouncement]);

  // Update browser theme color dynamically
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', showAnnouncement ? '#E43292' : '#ffffff');
    }
  }, [showAnnouncement]);

  // Restore scroll position on initial load
  useEffect(() => {
    // Disable automatic browser scroll restoration on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (activeNav === 'Home' && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: activeTab * window.innerWidth,
            behavior: 'instant'
          });
        }
        
        // Force scroll to absolute top on load/refresh for Home page
        window.scrollTo(0, 0);
        const swipePages = document.querySelectorAll('.swipe-page');
        swipePages.forEach(page => page.scrollTop = 0);
        
      }, 50);
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const windowWidth = window.innerWidth;
    const index = Math.round(scrollPosition / windowWidth);
    if (index !== activeTab) {
      setActiveTab(index);
    }
  };

  const handleTabClick = (index) => {
    setActiveNav('Home');
    setActiveTab(index);
    if (index === 0) {
      setShowDailyDiscoverTabs(false);
      window.scrollTo(0, 0);
      
      const resetCategoryScroll = () => {
        const catScroll = document.getElementById('category-scroll');
        if (catScroll) catScroll.scrollTo({ left: 0, behavior: 'instant' });
      };
      resetCategoryScroll();

      const swipePages = document.querySelectorAll('.swipe-page');
      swipePages.forEach(page => {
        page.scrollTop = 0;
      });
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        resetCategoryScroll();
        swipePages.forEach(page => {
          page.scrollTop = 0;
        });
      }, 50);
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        resetCategoryScroll();
        swipePages.forEach(page => {
          page.scrollTop = 0;
        });
      }, 150);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * window.innerWidth,
        behavior: 'instant'
      });
    }
  };

  const handleCategorySelect = (catName) => {
    setActiveNav('Home');
    const index = categories.indexOf(catName);
    if (index !== -1) {
      setTimeout(() => handleTabClick(index), 50); // slight delay to allow Home view to render first
    }
  };

  return (
    <div className="app-container">
      {/* New User Promo Modal */}
      {showPromoModal && <NewUserPromoModal onClose={handleClosePromo} />}
      {/* Header Exact Layout */}
      <header style={{ background: '#000', borderBottom: 'none', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        
        {/* Announcement Top Bar (Now Sticky) */}
        {showAnnouncement && (
          <div className="announcement-bar" style={{ background: '#000', color: '#fff', fontSize: '12px', textAlign: 'center', padding: '8px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', borderBottom: 'none' }}>
            <span>🎉 Download the Ourgoods App for exclusive discounts!</span>
            <a href="#" style={{ color: 'var(--brand-pink)', fontWeight: 'bold', textDecoration: 'underline' }}>Get App</a>
          </div>
        )}

        {/* Top Utility Bar removed per user request */}

        {/* Main Header (Logo, Search, Profile) */}
        <div className="content-container" style={{ padding: '12px 15px' }}>
          <div className="main-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
            {/* Left Group: Logo and Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
              {/* Logo */}
              <div className="hide-on-mobile" onClick={() => { navigate('/'); handleTabClick(0); }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '24px', margin: 0, letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' }}>OURGOODS</h1>
              </div>
              
              {/* Location Indicator (Mobile Only, Left Side) */}
              <div className="hide-on-desktop" onClick={handleLocationClick} style={{ display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer', gap: '4px' }}>
                <i className="las la-map-marker-alt" style={{ fontSize: '22px' }}></i>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>Deliver to</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{userCity || 'Select Location'}</span>
                </div>
              </div>
            </div>

            {/* Search and Icons Group */}
            <div className="search-icons-group" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              {/* Location Indicator (Desktop Only, Near Search Bar) */}
              <div className="hide-on-mobile" onClick={handleLocationClick} style={{ display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer', gap: '4px' }}>
                <i className="las la-map-marker-alt" style={{ fontSize: '22px' }}></i>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>Deliver to</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{userCity || 'Select Location'}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="search-container-mobile" style={{ flex: '0 1 330px', minWidth: '150px', display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden', height: '32px', alignItems: 'center', flex: 1, padding: '2px' }}>
                  <input type="text" onFocus={() => setShowAnnouncement(false)} onChange={() => setShowAnnouncement(false)} placeholder={searchSuggestions[placeholderIndex]} style={{ border: 'none', background: 'transparent', flex: 1, padding: '0 12px', fontSize: '13px', outline: 'none', color: '#333', width: '100%' }} />
                  
                  {/* Camera Icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999', padding: '0 8px', cursor: 'pointer', flexShrink: 0 }}>
                    <i className="las la-camera" style={{ fontSize: '18px' }}></i>
                  </div>
                  
                  {/* Search Button */}
                  <button style={{ background: '#000', border: 'none', width: '32px', height: '100%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', borderRadius: '4px' }}>
                    <i className="las la-search" style={{ fontSize: '16px', fontWeight: 'bold' }}></i>
                  </button>
                </div>
              </div>

              {/* Right Profile & Mobile Icons */}
              <div className="icons-container-mobile" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
                {/* Desktop-only Review Icon */}
                <div 
                  className="hide-on-mobile"
                  onClick={() => setActiveNav('Review')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', position: 'relative' }}>
                  <i className="las la-star" style={{ fontSize: '20px', marginBottom: '-2px' }}></i>
                  <span style={{ fontSize: '9px', fontWeight: '700' }}>Review</span>
                </div>
                
                {/* Desktop-only Message Icon */}
                <div 
                  className="hide-on-mobile"
                  onClick={() => {
                    setActiveNav('Message');
                    setMessageCount(0);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '-2px' }}>
                    {messageCount > 0 ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                      </svg>
                    ) : (
                      <i className="lar la-envelope" style={{ fontSize: '20px' }}></i>
                    )}
                    {messageCount > 0 && (
                      <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--brand-pink)', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '2px 5px', borderRadius: '10px', lineHeight: 1, border: '1px solid #000', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{messageCount}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '700' }}>Message</span>
                </div>
                
                {/* Wishlist Icon */}
                <div 
                  onClick={() => navigate('/wishlist')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '-2px' }}>
                    <i className={wishlistCount > 0 ? "las la-heart" : "lar la-heart"} style={{ fontSize: '20px' }}></i>
                    {wishlistCount > 0 && (
                      <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--brand-pink)', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '2px 5px', borderRadius: '10px', lineHeight: 1, border: '1px solid #000', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{wishlistCount}</span>
                    )}
                  </div>
                  <span className="hide-on-mobile" style={{ fontSize: '9px', fontWeight: '700' }}>Wishlist</span>
                </div>
                
                {/* Cart Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/checkout')}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '-2px' }}>
                    {cartCount > 0 ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"/>
                      </svg>
                    ) : (
                      <i className="las la-shopping-cart" style={{ fontSize: '20px' }}></i>
                    )}
                    {cartCount > 0 && (
                      <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--brand-pink)', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '2px 5px', borderRadius: '10px', lineHeight: 1, border: '1px solid #000', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{cartCount}</span>
                    )}
                  </div>
                  <span className="hide-on-mobile" style={{ fontSize: '9px', fontWeight: '700' }}>Cart</span>
                </div>
                
                {/* Removed Profile Icon from here to place it at the far right */}
              </div>
            </div>

            {/* Desktop-only Profile Icon with Text (Far Right) */}
            <div 
              className="hide-on-mobile"
              onClick={() => setActiveNav('Profile')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
              <i className="lar la-user" style={{ fontSize: '20px', marginBottom: '-2px' }}></i>
              <span style={{ fontSize: '9px', fontWeight: '700' }}>Profile</span>
            </div>

          </div>
        </div>

        {/* Bottom Nav Bar (Very Light Pink) */}
        {activeNav === 'Home' && (
          <div style={{ background: '#fdf2f7', borderBottom: '1px solid #f9e1ec' }}>
            <div className="content-container" style={{ display: 'flex', alignItems: 'stretch' }}>
            
            {/* Sticky Category Button */}
            <div 
              className="desktop-nav-py"
              onClick={() => setActiveNav(activeNav === 'Category' ? 'Home' : 'Category')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                color: '#fff', 
                padding: '8px 18px',
                background: 'var(--brand-pink)',
                boxShadow: '2px 0 8px rgba(228, 50, 146, 0.2)',
                borderBottom: activeNav === 'Category' ? '2px solid #000' : '2px solid transparent',
                flexShrink: 0,
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}>
              <i className="las la-bars hide-on-desktop" style={{ fontSize: '18px' }}></i>
              <span className="hide-on-mobile">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}>
                  <span style={{ fontWeight: '700' }}>Categories</span>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>(See All)</span>
                  <i className={activeNav === 'Category' ? "las la-angle-up" : "las la-angle-down"} style={{ marginLeft: '2px', fontSize: '14px', fontWeight: 'bold' }}></i>
                </div>
              </span>
            </div>



            {/* Dynamic Swipeable Categories (Desktop & Mobile) */}
            {showDailyDiscoverTabs ? (
              <div id="daily-discover-scroll" className="no-scrollbar" style={{ flex: 1, display: 'flex', overflowX: 'auto', alignItems: 'center', padding: '0 15px', scrollBehavior: 'smooth' }}>
                <div style={{ display: 'flex', border: '1px solid #eaeaea', borderRadius: '6px', background: '#fdf2f7', minWidth: 'max-content', alignItems: 'stretch' }}>
                  {[
                    { label: 'For You', icon: <i className="las la-heart" style={{ fontSize: '16px', color: 'var(--brand-pink)' }}></i> },
                    { label: 'Combo Deals', icon: <i className="las la-layer-group" style={{ fontSize: '16px' }}></i> },
                    { label: 'Choice', icon: <i className="las la-award" style={{ fontSize: '16px' }}></i> },
                    { label: 'New Arrival', icon: <i className="las la-star" style={{ fontSize: '16px' }}></i> },
                    { label: 'Best Seller', icon: <i className="las la-trophy" style={{ fontSize: '16px' }}></i> },
                    { label: 'QuickShip (24h)', icon: <i className="las la-bolt" style={{ fontSize: '16px' }}></i> },
                    { label: 'International', icon: <i className="las la-globe-americas" style={{ fontSize: '16px' }}></i> }
                  ].map((tab, idx, arr) => (
                    <div 
                      key={idx} 
                      ref={el => dailyDiscoverTabRefs.current[tab.label] = el}
                      onClick={() => {
                      setDailyDiscoverActiveTab(tab.label);
                      window.dispatchEvent(new CustomEvent('setDailyDiscoverTab', { detail: tab.label }));
                    }} style={{ 
                      position: 'relative',
                      background: dailyDiscoverActiveTab === tab.label ? '#000' : '#fdf2f7',
                      color: dailyDiscoverActiveTab === tab.label ? '#fff' : '#111',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRight: idx !== arr.length - 1 ? '1px solid #eaeaea' : 'none',
                      borderRadius: dailyDiscoverActiveTab === tab.label ? '5px' : '0',
                    }}>
                      {tab.icon && React.cloneElement(tab.icon, { style: { ...tab.icon.props.style, color: dailyDiscoverActiveTab === tab.label ? '#fff' : '#111' } })}
                      {tab.label}
                      {dailyDiscoverActiveTab === tab.label && (
                        <div style={{
                          position: 'absolute',
                          bottom: '3px',
                          left: '25%',
                          right: '25%',
                          height: '3px',
                          background: 'var(--brand-pink)',
                          borderRadius: '2px'
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div id="category-scroll" className="no-scrollbar" style={{ flex: 1, display: 'flex', overflowX: 'auto', alignItems: 'center', padding: '0 15px', scrollBehavior: 'smooth' }}>
                  <div style={{ display: 'flex', border: '1px solid #eaeaea', borderRadius: '6px', background: '#fdf2f7', minWidth: 'max-content', alignItems: 'stretch' }}>
                    {categories.map((cat, idx, arr) => (
                      <div 
                        key={idx}
                        className="desktop-nav-py"
                        ref={el => tabRefs.current[idx] = el}
                        onClick={() => {
                          handleTabClick(idx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ 
                          position: 'relative',
                          background: activeTab === idx ? '#000' : '#fdf2f7',
                          color: activeTab === idx ? '#fff' : '#111', 
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderRight: idx !== arr.length - 1 ? '1px solid #eaeaea' : 'none',
                          borderRadius: activeTab === idx ? '5px' : '0',
                        }}
                      >
                        {cat === 'Home' && <i className="las la-home" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat === 'Women' && <i className="las la-female" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat === 'Jewelry & Accessories' && <i className="las la-gem" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat === 'Purse & Bags' && <i className="las la-shopping-bag" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat === 'Sneakers & Shoes' && <i className="las la-shoe-prints" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat === 'Beauty & Health' && <i className="las la-spa" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat === 'Home & Decor' && <i className="las la-couch" style={{ fontSize: '16px', color: activeTab === idx ? '#fff' : '#111' }}></i>}
                        {cat}
                        {activeTab === idx && (
                          <div style={{
                            position: 'absolute',
                            bottom: '3px',
                            left: '25%',
                            right: '25%',
                            height: '3px',
                            background: 'var(--brand-pink)',
                            borderRadius: '2px'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
            )}


            {/* Cart Section - Desktop Only */}
            <div className="hide-on-mobile" style={{ background: 'var(--brand-pink)', color: '#fff', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: '180px', justifyContent: 'center' }} onClick={() => navigate('/checkout')}>
              <i className="las la-shopping-cart" style={{ fontSize: '24px' }}></i>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px' }}>৳{cartTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span style={{ fontSize: '11px', fontWeight: 400 }}>({cartCount} Items)</span>
              </div>
            </div>

            </div>
          </div>
        )}
      </header>

      {/* Main Content - Swipeable Pager */}
      {activeNav === 'Home' ? (
        <main 
          ref={scrollRef}
          onScroll={handleScroll}
          className="swipe-container no-scrollbar"
        >
          {categories.map((cat, idx) => (
            <div key={idx} className="swipe-page">
              {cat === 'Home' ? (
                <HomePage />
              ) : (
                <CategoryPage title={cat} />
              )}
            </div>
          ))}
        </main>
      ) : activeNav === 'Category' ? (
        <main className="content-container" style={{ marginTop: '0', flex: 1 }}>
          <AllCategorySection onCategorySelect={handleCategorySelect} onClose={() => setActiveNav('Home')} />
        </main>
      ) : activeNav === 'Review' ? (
        <main className="content-container" style={{ marginTop: '0', flex: 1 }}>
          <ReviewPage onClose={() => setActiveNav('Home')} />
        </main>
      ) : activeNav === 'Message' ? (
        <main className="content-container" style={{ marginTop: '0', flex: 1 }}>
          <MessagePage onClose={() => setActiveNav('Home')} onChatOpen={setHideBottomNav} />
        </main>
      ) : activeNav === 'Profile' ? (
        <main className="content-container" style={{ marginTop: '0', flex: 1 }}>
          <ProfilePage />
        </main>
      ) : (
        <main className="content-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
          <p>Coming Soon</p>
        </main>
      )}

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="hide-on-desktop" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#000', borderTop: 'none', display: 'flex', justifyContent: 'center', padding: '8px 0', boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.2)', zIndex: 1000 }}>
          <div className="content-container" style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            setActiveNav('Home');
            handleTabClick(0);
          }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', gap: '2px', textDecoration: 'none' }}>
            <i className="las la-home" style={{ fontSize: '22px', transform: activeNav === 'Home' ? 'scale(1.15) translateY(-2px)' : 'scale(1)', transition: 'all 0.2s ease' }}></i>
            <span style={{ fontSize: '9px', fontWeight: activeNav === 'Home' ? 800 : 600 }}>Home</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveNav('Category'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', gap: '2px', textDecoration: 'none' }}>
            <i className={activeNav === 'Category' ? 'las la-layer-group' : 'las la-shapes'} style={{ fontSize: '22px', transform: activeNav === 'Category' ? 'scale(1.15) translateY(-2px)' : 'scale(1)', transition: 'all 0.2s ease' }}></i>
            <span style={{ fontSize: '9px', fontWeight: activeNav === 'Category' ? 800 : 600 }}>Category</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveNav('Review'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', gap: '2px', textDecoration: 'none' }}>
            <i className={activeNav === 'Review' ? 'las la-award' : 'las la-star'} style={{ fontSize: '22px', transform: activeNav === 'Review' ? 'scale(1.15) translateY(-2px)' : 'scale(1)', transition: 'all 0.2s ease' }}></i>
            <span style={{ fontSize: '9px', fontWeight: activeNav === 'Review' ? 800 : 600 }}>Review</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveNav('Message'); setMessageCount(0); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', gap: '2px', textDecoration: 'none' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: activeNav === 'Message' ? 'scale(1.15) translateY(-2px)' : 'scale(1)', transition: 'all 0.2s ease' }}>
              {(activeNav === 'Message' || messageCount > 0) ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                </svg>
              ) : (
                <i className="las la-envelope" style={{ fontSize: '22px' }}></i>
              )}
              {messageCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-12px', background: 'var(--brand-pink)', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '2px 4px', borderRadius: '10px', lineHeight: 1, border: '1px solid #000', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{messageCount}</span>
              )}
            </div>
            <span style={{ fontSize: '9px', fontWeight: activeNav === 'Message' ? 800 : 600 }}>Message</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveNav('Profile'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', gap: '2px', textDecoration: 'none' }}>
            <i className={activeNav === 'Profile' ? 'las la-user-circle' : 'las la-user'} style={{ fontSize: '22px', transform: activeNav === 'Profile' ? 'scale(1.15) translateY(-2px)' : 'scale(1)', transition: 'all 0.2s ease' }}></i>
            <span style={{ fontSize: '9px', fontWeight: activeNav === 'Profile' ? 800 : 600 }}>Profile</span>
          </a>
          </div>
        </nav>
      )}

      {/* Floating Chatbot Widget Removed since we have a dedicated Message Page */}
    </div>
  );
}

export default CustomerApp;
