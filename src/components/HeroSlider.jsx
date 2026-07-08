import React, { useState, useEffect, useRef } from 'react';

const banners = [
  {
    id: 1,
    categories: ['All'],
    image: '/images/slider1.jpg',
    title: "Luxury Handbags",
    subtitle: "New Collection",
    discount: "SHOP NOW",
    color: "var(--brand-pink)"
  },
  {
    id: 2,
    categories: ['All'],
    image: '/images/slider2.jpg',
    title: "Elegant Jewelry",
    subtitle: "Shine Bright",
    discount: "DISCOVER",
    color: "#333333"
  },
  {
    id: 3,
    categories: ['All'],
    image: '/images/slider3.jpg',
    title: "Summer Vibes",
    subtitle: "Trending Now",
    discount: "EXPLORE",
    color: "#27AE60"
  },
  {
    id: 4,
    categories: ['All'],
    image: '/images/slider4.jpg',
    title: "Summer Sale",
    subtitle: "Up to 85% OFF",
    discount: "SHOP SALE",
    color: "#1d61d1"
  },
  {
    id: 5,
    categories: ['All'],
    image: '/images/slider5.jpg',
    title: "Designer Bags",
    subtitle: "Premium Looks",
    discount: "PREMIUM",
    color: "#111111"
  }
];

const deliveryFeatures = [
  { icon: 'las la-hand-holding-usd', title: 'Cash on Delivery', iconColor: '#27ae60', bgColor: '#eafaf1' },
  { icon: 'las la-clock', title: 'Pre-Order', iconColor: '#2980b9', bgColor: '#ebf5fb' },
  { icon: 'las la-industry', title: 'Factory', iconColor: '#d35400', bgColor: '#fdf2e9' },
  { icon: 'las la-boxes', title: 'Wholesale', iconColor: '#8e44ad', bgColor: '#f4ecf7' },
  { icon: 'las la-map-marker-alt', title: '24h in Dhaka', iconColor: 'var(--brand-pink)', bgColor: '#fcecf2' },
  { icon: 'las la-shipping-fast', title: '48h in Bangladesh', iconColor: '#f59e0b', bgColor: '#fff3e0' }
];

const scrollingFeatures = deliveryFeatures;

const HeroSlider = ({ category = 'All' }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeMobileGroup, setActiveMobileGroup] = useState(0);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveMobileGroup(prev => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(featureInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setActiveIndex(index);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    
    // Auto slide
    const interval = setInterval(() => {
      if (scrollRef.current) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= bannersToRender.length) nextIndex = 0;
        
        scrollRef.current.scrollTo({
          left: nextIndex * scrollRef.current.clientWidth,
          behavior: 'smooth'
        });
      }
    }, 4000);

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
      clearInterval(interval);
    };
  }, [activeIndex]);

  const activeBanners = banners.filter(b => b.categories && b.categories.includes(category));
  const bannersToRender = activeBanners.length > 0 ? activeBanners : banners.filter(b => b.categories && b.categories.includes('All'));

  return (
    <div style={{ position: 'relative', width: '100%', padding: '10px 0', boxSizing: 'border-box' }}>
      <style>{`
        .delivery-info-row {
          justify-content: space-between;
        }
        .delivery-feature-wrapper {
          display: none;
          align-items: center;
          flex: 1;
          justify-content: center;
        }
        .delivery-feature-wrapper.active-mobile {
          display: flex;
        }
        @media (max-width: 1023px) {
          .delivery-feature-wrapper { border-right: none; }
          .delivery-feature-wrapper.border-mobile { border-right: 1px solid #eaeaea; }
        }
        @media (min-width: 1024px) {
          .delivery-feature-wrapper {
            display: flex !important;
            border-right: none;
          }
          .delivery-feature-wrapper.border-laptop {
            border-right: 1px solid #eaeaea;
          }
        }
      `}</style>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #f2e6e6',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative' }}>
          <div 
            ref={scrollRef}
            className="no-scrollbar"
            style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory', 
              scrollBehavior: 'smooth'
            }}
          >
        {bannersToRender.map((banner) => (
          <div 
            key={banner.id} 
            className="hero-banner-slide"
            style={{ 
              minWidth: '100%', 
              position: 'relative', 
              scrollSnapAlign: 'start',
              backgroundImage: banner.customRender ? 'none' : `url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: banner.customRender ? '0' : '20px',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            {banner.customRender ? banner.customRender() : (
              <>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 1, color: '#fff', maxWidth: '60%' }}>
                  <div className="hero-banner-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{banner.subtitle}</div>
                  <div className="hero-banner-title" style={{ fontWeight: 900, marginBottom: '8px', lineHeight: 1.1 }}>{banner.title}</div>
                  <div className="hero-banner-discount" style={{ 
                    background: banner.color, 
                    display: 'inline-block', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontWeight: 900 
                  }}>
                    {banner.discount}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Dots Indicator Overlay */}
      <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {bannersToRender.map((_, idx) => (
          <div 
            key={idx} 
            style={{ 
              width: activeIndex === idx ? '16px' : '6px', 
              height: '6px', 
              borderRadius: '3px', 
              background: activeIndex === idx ? 'var(--brand-pink)' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s ease'
            }}
          ></div>
        ))}
      </div>
      </div>
      
      {/* Delivery Info Layer directly attached */}
      <div 
        className="no-scrollbar delivery-info-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 15px',
          background: '#fff',
          borderTop: '1px solid #f2e6e6',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
      }}>
        {scrollingFeatures.map((feature, idx) => {
          const group = Math.floor(idx / 2);
          const hasMobileBorder = idx % 2 === 0;
          const hasLaptopBorder = idx !== scrollingFeatures.length - 1;
          const isActive = activeMobileGroup === group;
          
          return (
            <div 
              key={idx} 
              className={`delivery-feature-wrapper ${isActive ? 'active-mobile' : ''} ${hasLaptopBorder ? 'border-laptop' : ''} ${hasMobileBorder ? 'border-mobile' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: feature.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className={feature.icon} style={{ fontSize: '16px', color: feature.iconColor }}></i>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#333' }}>{feature.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
};

export default HeroSlider;
