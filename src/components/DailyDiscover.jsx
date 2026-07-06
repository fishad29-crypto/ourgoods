import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { generateProducts } from '../utils/MockData';

// Module-level cache to persist shuffled products across unmounts
// It naturally resets on a full page refresh.
const dailyDiscoverCache = {};

const TABS = [
  { label: 'For You', icon: <i className="las la-heart" style={{ fontSize: '16px', color: 'var(--brand-pink)' }}></i> },
  { label: 'Combo Deals', icon: <i className="las la-layer-group" style={{ fontSize: '16px' }}></i> },
  { label: 'Choice', icon: <i className="las la-award" style={{ fontSize: '16px' }}></i> },
  { label: 'New Arrival', icon: <i className="las la-star" style={{ fontSize: '16px' }}></i> },
  { label: 'Best Seller', icon: <i className="las la-trophy" style={{ fontSize: '16px' }}></i> },
  { label: 'QuickShip (24h)', icon: <i className="las la-bolt" style={{ fontSize: '16px' }}></i> },
  { label: 'International', icon: <i className="las la-globe-americas" style={{ fontSize: '16px' }}></i> }
];

const TabPage = ({ tabLabel }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dailyDiscoverCache[tabLabel]) {
      setProducts(dailyDiscoverCache[tabLabel]);
    } else {
      const newProducts = generateProducts(tabLabel === 'For You' ? 'recommended' : tabLabel, 50);
      dailyDiscoverCache[tabLabel] = newProducts;
      setProducts(newProducts);
    }
  }, [tabLabel]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const moreProducts = generateProducts(tabLabel === 'For You' ? 'recommended' : tabLabel, 10);
      const updatedProducts = [...products, ...moreProducts];
      dailyDiscoverCache[tabLabel] = updatedProducts;
      setProducts(updatedProducts);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {loading ? (
          <i className="las la-spinner la-spin text-pink" style={{ fontSize: '30px' }}></i>
        ) : (
          <button 
            onClick={loadMore}
            style={{
              background: '#fff', border: '1px solid #ddd', padding: '10px 20px', 
              borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#333'
            }}
          >
            Load More Products
          </button>
        )}
      </div>
    </div>
  );
};

const DailyDiscover = () => {
  const [activeTab, setActiveTab] = useState('For You');
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);
  const scrollRef = useRef(null);
  const isSyncing = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const tabRefs = useRef({});

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleSetTab = (e) => {
      const newTab = e.detail;
      setActiveTab(newTab);
      
      // Scroll to the new tab page
      if (scrollRef.current) {
        const tabIndex = TABS.findIndex(t => t.label === newTab);
        if (tabIndex !== -1) {
          const pageWidth = scrollRef.current.clientWidth;
          isSyncing.current = true;
          scrollRef.current.scrollTo({ left: pageWidth * tabIndex, behavior: 'smooth' });
          setTimeout(() => { isSyncing.current = false; }, 500);
        }
      }
    };
    window.addEventListener('setDailyDiscoverTab', handleSetTab);
    return () => window.removeEventListener('setDailyDiscoverTab', handleSetTab);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dailyDiscoverSync', { detail: activeTab }));
  }, [activeTab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAbove = entry.boundingClientRect.top < 100;
        if (isAbove) {
          setIsSticky(true);
          window.dispatchEvent(new CustomEvent('dailyDiscoverSticky', { detail: true }));
        } else {
          setIsSticky(false);
          window.dispatchEvent(new CustomEvent('dailyDiscoverSticky', { detail: false }));
        }
      },
      { root: null, rootMargin: '-100px 0px 0px 0px', threshold: [0, 1] }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (isSyncing.current || !scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const pageWidth = scrollRef.current.clientWidth;
    const activeIndex = Math.round(scrollLeft / pageWidth);
    if (activeIndex >= 0 && activeIndex < TABS.length) {
      const newTab = TABS[activeIndex].label;
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    }
  };

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    if (scrollRef.current) {
      const tabIndex = TABS.findIndex(t => t.label === tabLabel);
      if (tabIndex !== -1) {
        const pageWidth = scrollRef.current.clientWidth;
        isSyncing.current = true;
        scrollRef.current.scrollTo({ left: pageWidth * tabIndex, behavior: 'smooth' });
        setTimeout(() => { isSyncing.current = false; }, 500);
      }
    }
  };

  // Touch event handlers to prevent outer .swipe-container from scrolling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const dx = Math.abs(touchX - touchStartX.current);
    const dy = Math.abs(touchY - touchStartY.current);

    // If scrolling horizontally, stop propagation to prevent outer container swipe
    if (dx > dy && dx > 5) {
      e.stopPropagation();
    }
  };

  return (
    <div style={{ padding: '10px 8px', background: '#fdf2f7' }}>

      <div ref={sentinelRef} style={{ height: '1px', width: '100%' }}></div>
      {/* Product Filter Tabs */}
      {/* Product Filter Tabs - Segmented Design */}
      <div className="no-scrollbar" style={{ display: 'flex', overflowX: 'auto', marginBottom: '15px', paddingBottom: '5px', paddingLeft: '8px', paddingRight: '8px', opacity: isSticky ? 0 : 1, pointerEvents: isSticky ? 'none' : 'auto' }}>
        <div style={{ display: 'flex', border: '1px solid #eaeaea', borderRadius: '6px', background: '#fdf2f7', minWidth: 'max-content', alignItems: 'stretch' }}>
          {TABS.map((tab, idx, arr) => (
            <div key={idx} 
              ref={el => tabRefs.current[tab.label] = el}
              onClick={() => handleTabClick(tab.label)}
              style={{
              position: 'relative',
              background: activeTab === tab.label ? '#000' : '#fdf2f7',
              color: activeTab === tab.label ? '#fff' : '#111',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRight: idx !== arr.length - 1 ? '1px solid #eaeaea' : 'none',
              borderRadius: activeTab === tab.label ? '5px' : '0',
            }}>
              {tab.icon && React.cloneElement(tab.icon, { style: { ...tab.icon.props.style, color: activeTab === tab.label ? '#fff' : '#111' } })}
              {tab.label}
              {activeTab === tab.label && (
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
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

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="no-scrollbar"
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          overscrollBehaviorX: 'contain'
        }}
      >
        {TABS.map((tab, idx) => (
          <div key={idx} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', width: '100%', minWidth: '100%' }}>
            <TabPage tabLabel={tab.label} />
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default DailyDiscover;
