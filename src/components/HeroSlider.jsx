import React, { useState, useEffect, useRef } from 'react';

const banners = [
  {
    id: 0,
    categories: ['All', 'Women', 'Home'],
    customRender: () => (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: 'linear-gradient(135deg, #ffd1df 0%, #ffb6c1 100%)', display: 'flex', overflow: 'hidden' }}>
        
        {/* Right Model Image (Using placeholder fashion image) */}
        <div style={{ position: 'absolute', right: '-20px', top: '10px', bottom: '0', width: '60%', backgroundImage: 'url(https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=90&w=800)', backgroundSize: 'cover', backgroundPosition: 'top center', borderRadius: '10px' }}></div>
        
        {/* Gradient Overlay for Text Readability */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '70%', background: 'linear-gradient(90deg, #ffd1df 60%, transparent 100%)' }}></div>

        {/* Content Layout */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '15px 20px', width: '70%' }}>
          
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--brand-pink)', lineHeight: 1, margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            Ringer<br/>
            <span style={{ color: '#111' }}>T-Shirt</span>
          </h2>
          
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-pink)', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
            — Collection —
          </div>

          <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#111', margin: '0 0 15px 0', fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
            Comfort Meets<br/>
            <span style={{ color: 'var(--brand-pink)' }}>Everyday Style</span>
          </p>
          
          <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
             <span style={{ background: 'var(--brand-pink)', color: '#fff', fontSize: '8px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '10px' }}>TRENDY</span>
             <span style={{ background: 'var(--brand-pink)', color: '#fff', fontSize: '8px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '10px' }}>COMFORTABLE</span>
          </div>

          <button style={{ 
            background: 'var(--brand-pink)', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 16px', 
            fontSize: '11px', 
            fontWeight: 900, 
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            boxShadow: '0 4px 10px rgba(228, 27, 35, 0.3)'
          }}>
            <i className="las la-shopping-cart" style={{ fontSize: '14px', marginRight: '5px' }}></i>
            ORDER NOW
          </button>

        </div>
      </div>
    )
  },
  {
    id: 1,
    categories: ['All', 'Women'],
    customRender: () => (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: 'linear-gradient(135deg, #1d61d1 0%, #10419c 100%)', display: 'flex', overflow: 'hidden', padding: '15px 20px' }}>
        
        {/* Background Bubbles & Sparkles */}
        <div style={{ position: 'absolute', width: '80px', height: '80px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', top: '20%', left: '-20px' }}></div>
        <div style={{ position: 'absolute', width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', top: '10%', right: '40%' }}></div>
        <div style={{ position: 'absolute', width: '120px', height: '120px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', bottom: '-40px', left: '10%' }}></div>
        <div style={{ position: 'absolute', width: '60px', height: '60px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', bottom: '-10px', right: '-10px' }}></div>
        <i className="las la-asterisk" style={{ position: 'absolute', color: 'rgba(255,255,255,0.4)', fontSize: '24px', top: '25%', left: '42%' }}></i>
        <i className="las la-asterisk" style={{ position: 'absolute', color: 'rgba(255,255,255,0.3)', fontSize: '18px', bottom: '15%', right: '15%' }}></i>
        <i className="las la-asterisk" style={{ position: 'absolute', color: 'rgba(255,255,255,0.2)', fontSize: '14px', top: '10%', right: '10%' }}></i>

        {/* Content Layout */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%', alignItems: 'center' }}>
          
          {/* Left Text Column */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '5px' }}>
            
            {/* Sizzling Badge */}
            <div style={{ 
              background: '#ebff00', 
              color: '#1d61d1', 
              padding: '2px 10px', 
              fontWeight: 900, 
              fontSize: '11px', 
              transform: 'skew(-10deg) rotate(-4deg)', 
              marginBottom: '5px',
              marginLeft: '10px',
              letterSpacing: '1px'
            }}>
              SIZZLING
            </div>

            <div style={{ color: '#fff', fontWeight: 900, lineHeight: 1, fontFamily: 'Arial, sans-serif' }}>
              <div style={{ fontSize: '22px', letterSpacing: '1px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>SUMMER</div>
              <div style={{ fontSize: '38px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>SALE</div>
              <div style={{ fontSize: '38px', display: 'flex', alignItems: 'center', gap: '5px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                SALE 
                {/* Price Tag Icon */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: '#fff', 
                  borderRadius: '3px', 
                  padding: '2px 6px', 
                  transform: 'rotate(15deg) translateY(-5px)',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <span style={{ color: '#ff5c8a', fontSize: '10px', fontWeight: 900 }}>%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Text Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '15px' }}>
            <div style={{ color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '2px', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
              - UP TO -
            </div>
            <div style={{ color: '#ebff00', fontWeight: 900, fontSize: '55px', lineHeight: 0.9, display: 'flex', alignItems: 'flex-start', textShadow: '3px 3px 6px rgba(0,0,0,0.2)' }}>
              80
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px', lineHeight: 1, marginLeft: '2px', marginTop: '6px' }}>
                <span>%</span>
                <span style={{ fontSize: '14px' }}>OFF</span>
              </div>
            </div>
            
            <button style={{ 
              background: '#fff', 
              color: '#111', 
              border: 'none', 
              padding: '6px 16px', 
              fontSize: '10px', 
              fontWeight: 900, 
              marginTop: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              SHOP NOW
            </button>
          </div>

        </div>
      </div>
    )
  },
  {
    id: 2,
    categories: ['All', 'Jewelry & Accessories'],
    customRender: () => (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff', display: 'flex', overflow: 'hidden' }}>
        {/* Jewellery Background */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', backgroundImage: 'url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=90&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center right' }}></div>
        
        {/* Left Curved Overlay */}
        <div style={{ position: 'relative', zIndex: 1, width: '65%', background: '#fff', borderRadius: '0 0 150px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px', paddingBottom: '20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1.1, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
            <span style={{ color: '#111' }}>Shine in</span><br />
            <span style={{ color: 'var(--brand-pink)', fontWeight: 500, fontStyle: 'italic' }}>Every Moment</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
            <div style={{ height: '1px', background: 'var(--brand-pink)', width: '30px' }}></div>
          </div>
          <p style={{ fontSize: '11px', color: '#333', marginBottom: '15px', fontWeight: 500, maxWidth: '80%' }}>Exquisite designs crafted to celebrate your unique sparkle.</p>
          <button style={{ background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '25px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', width: 'fit-content', cursor: 'pointer', marginBottom: '15px' }}>
            SHOP NOW <i className="las la-arrow-right" style={{ marginLeft: '5px', fontSize: '14px' }}></i>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '8px', color: '#111', fontWeight: 800 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <i className="las la-gem" style={{ color: 'var(--brand-pink)', fontSize: '16px' }}></i>
               <span>PREMIUM<br/>QUALITY</span>
             </div>
             <div style={{ width: '1px', height: '20px', background: '#ccc' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <i className="las la-hand-holding-heart" style={{ color: 'var(--brand-pink)', fontSize: '16px' }}></i>
               <span>CRAFTED<br/>WITH CARE</span>
             </div>
             <div style={{ width: '1px', height: '20px', background: '#ccc' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <i className="las la-award" style={{ color: 'var(--brand-pink)', fontSize: '16px' }}></i>
               <span>TRUSTED<br/>BRAND</span>
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    categories: ['All', 'Purse & Bags'],
    customRender: () => (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff', display: 'flex', overflow: 'hidden' }}>
        {/* Handbags Background */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', backgroundImage: 'url(https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=90&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center left' }}></div>
        
        {/* Black Curve Behind */}
        <div style={{ position: 'absolute', zIndex: 1, left: 0, top: 0, bottom: 0, width: '68%', background: '#111', borderRadius: '0 0 150px 0' }}></div>

        {/* Left Curved Overlay */}
        <div style={{ position: 'relative', zIndex: 2, width: '64%', background: '#fff', borderRadius: '0 0 150px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 15px', paddingBottom: '30px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
            <span style={{ color: '#111' }}>Elegance in</span><br />
            <span style={{ color: 'var(--brand-pink)', fontWeight: 500, fontStyle: 'italic' }}>Every Detail</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
            <div style={{ height: '1px', background: 'var(--brand-pink)', width: '30px' }}></div>
          </div>
          <p style={{ fontSize: '10px', color: '#333', marginBottom: '15px', fontWeight: 500, maxWidth: '85%' }}>Timeless designs that complement your style, every day.</p>
          <button style={{ background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '25px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', width: 'fit-content', cursor: 'pointer', marginBottom: '15px' }}>
            SHOP NOW <i className="las la-arrow-right" style={{ marginLeft: '5px', fontSize: '14px' }}></i>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '7px', color: '#111', fontWeight: 800 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
               <i className="las la-gem" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i>
               <span>PREMIUM<br/>QUALITY</span>
             </div>
             <div style={{ width: '1px', height: '20px', background: '#ccc' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
               <i className="las la-hand-holding-heart" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i>
               <span>CRAFTED<br/>WITH CARE</span>
             </div>
             <div style={{ width: '1px', height: '20px', background: '#ccc' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
               <i className="las la-award" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i>
               <span>TRUSTED<br/>BRAND</span>
             </div>
          </div>
        </div>
        
        {/* Bottom Pink Bar */}
        <div className="no-scrollbar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--brand-pink)', display: 'flex', alignItems: 'center', padding: '6px 15px', gap: '15px', zIndex: 3, fontSize: '9px', color: '#fff', fontWeight: 600, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="las la-gem" style={{ fontSize: '14px' }}></i> TIMELESS DESIGNS</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="las la-gift" style={{ fontSize: '14px' }}></i> PERFECT OCCASION</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="las la-sparkles" style={{ fontSize: '14px' }}></i> MADE TO BE CHERISHED</span>
        </div>
      </div>
    )
  },
  {
    id: 4,
    categories: ['All'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=90&w=1200',
    title: "Daily Groceries",
    subtitle: "Fresh & Organic",
    discount: "SPECIAL OFFER",
    color: "#333333"
  },
  {
    id: 5,
    categories: ['All'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=90&w=1200',
    title: "Home Decor",
    subtitle: "Modern Living",
    discount: "EXTRA 20% OFF",
    color: "#27AE60"
  },
  {
    id: 6,
    categories: ['All', 'Sneakers & Shoes'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=1200',
    title: "Sneaker Drops",
    subtitle: "New Arrivals",
    discount: "UP TO 40% OFF",
    color: "var(--brand-pink)"
  },
  {
    id: 7,
    categories: ['All', 'Beauty & Health'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=1200',
    title: "Beauty Essentials",
    subtitle: "Glow Everyday",
    discount: "BUY 1 GET 1",
    color: "var(--brand-pink)"
  },
  {
    id: 'w1',
    categories: ['Women'],
    image: '/images/chic_essentials.png',
    title: "Chic Essentials",
    subtitle: "New Collection",
    discount: "UP TO 50% OFF",
    color: "var(--brand-pink)"
  },
  {
    id: 'w2',
    categories: ['Women'],
    image: '/images/summer_vibes.png',
    title: "Summer Vibes",
    subtitle: "Trending Now",
    discount: "FLAT 30% OFF",
    color: "#ff007f"
  },
  {
    id: 'w3',
    categories: ['Women'],
    image: '/images/elegant_wear.png',
    title: "Elegant Wear",
    subtitle: "Premium Looks",
    discount: "NEW ARRIVALS",
    color: "#111111"
  },
  {
    id: 'w4',
    categories: ['Women'],
    image: '/images/street_style.png',
    title: "Street Style",
    subtitle: "Urban Fashion",
    discount: "BUY 1 GET 1",
    color: "#ff5c8a"
  }
];

const HeroSlider = ({ category = 'All' }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
    <div style={{ position: 'relative', width: '100%', padding: '10px 15px', boxSizing: 'border-box' }}>
      <div 
        ref={scrollRef}
        className="no-scrollbar"
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          scrollSnapType: 'x mandatory', 
          borderRadius: '12px',
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
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            {banner.customRender ? banner.customRender() : (
              <>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)', borderRadius: '12px' }}></div>
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
      
      {/* Dots Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
        {bannersToRender.map((_, idx) => (
          <div 
            key={idx} 
            style={{ 
              width: activeIndex === idx ? '16px' : '6px', 
              height: '6px', 
              borderRadius: '3px', 
              background: activeIndex === idx ? 'var(--brand-pink)' : '#ddd',
              transition: 'all 0.3s ease'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
