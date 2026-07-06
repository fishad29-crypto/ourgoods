import React, { useRef, useEffect } from 'react';

const features = [
  { icon: 'las la-truck', title: 'Free Shipping' },
  { icon: 'las la-box-open', title: 'Free Returns' },
  { icon: 'las la-shield-alt', title: 'Secure Payment' },
  { icon: 'las la-money-bill-wave', title: 'Cash on Delivery' },
  { icon: 'las la-award', title: 'Authentic Products' },
  // Duplicate for smooth continuous scrolling feel
  { icon: 'las la-truck', title: 'Free Shipping' },
  { icon: 'las la-box-open', title: 'Free Returns' },
  { icon: 'las la-shield-alt', title: 'Secure Payment' },
];

const ServiceFeatures = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let intervalId;
    let isPaused = false;

    const startScroll = () => {
      intervalId = setInterval(() => {
        if (!isPaused && el) {
          // If we hit the absolute right, jump back to the start
          if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
            el.scrollLeft = 0;
          } else {
            el.scrollLeft += 1; // slide towards the left
          }
        }
      }, 30); // Scrolling speed
    };

    startScroll();

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });

    return () => {
      clearInterval(intervalId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff', 
        border: '1px solid #f2e6e6',
        borderRadius: '6px',
        padding: '12px 15px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(228, 27, 35, 0.04)' // subtle brand-tinted shadow
      }}>
        <div 
          ref={scrollRef}
          className="no-scrollbar" 
          style={{ 
            display: 'flex', 
            gap: '15px', 
            overflowX: 'auto', 
            whiteSpace: 'nowrap',
            width: '100%',
            alignItems: 'center'
          }}
        >
          {features.map((feature, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#333',
                fontWeight: 600,
                fontSize: '13px',
                flexShrink: 0
              }}>
                <i className={feature.icon} style={{ fontSize: '18px', color: 'var(--brand-pink)' }}></i>
                <span>{feature.title}</span>
              </div>
              <div style={{ width: '1px', height: '14px', background: '#eaeaea', flexShrink: 0 }}></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatures;
