import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveScrollAndNavigate } from '../utils/navigation';

const sliderImages = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?auto=format&fit=crop&q=80&w=800'
];

const OurgoodsStock = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 15px',
          background: '#111', // Premium dark background
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="las la-box" style={{ color: '#fff', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Ourgoods Stock</span>
              </div>
            </div>
            
            {/* Delivery text */}
            <div style={{ paddingLeft: '30px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px', fontWeight: 600 }}>
              Ready stock available in Bangladesh
            </div>
          </div>

          <div 
            onClick={() => saveScrollAndNavigate(navigate, '/ourgoods-stock')}
            style={{ color: 'var(--brand-pink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>
            View All <i className="las la-angle-right" style={{ fontSize: '14px' }}></i>
          </div>
        </div>

        {/* Slider Row */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/7', // Adjusted for mobile banner proportions
            overflow: 'hidden',
            background: '#f5f5f5'
          }}>
            <div style={{
              display: 'flex',
              width: `${sliderImages.length * 100}%`,
              height: '100%',
              transform: `translateX(-${(currentSlide * 100) / sliderImages.length}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}>
              {sliderImages.map((img, index) => (
                <div key={index} style={{ width: `${100 / sliderImages.length}%`, height: '100%', flexShrink: 0 }}>
                  <img src={img} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            {/* Banner Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: '15px',
              pointerEvents: 'none',
              background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 80%)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#fff', marginBottom: '2px', letterSpacing: '0.5px', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>Trending Products</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--brand-pink)', lineHeight: 1.1, marginBottom: '2px', textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.4)', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>Cash On Delivery</div>
              <div style={{ fontSize: '10px', fontWeight: 900, color: '#fef08a', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Delivery within 24h</div>
              <button onClick={() => navigate('/market/trending')} style={{
                background: '#fff',
                color: 'var(--brand-pink)',
                border: 'none',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800,
                width: 'fit-content',
                pointerEvents: 'auto',
                cursor: 'pointer',
                fontStyle: 'italic',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Shop <i className="las la-arrow-right" style={{ fontSize: '12px' }}></i>
              </button>
            </div>
            
            {/* Dots */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '6px'
            }}>
              {sliderImages.map((_, index) => (
                <div key={index} style={{
                  width: currentSlide === index ? '12px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: currentSlide === index ? 'var(--brand-pink)' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Info Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 15px',
          background: '#fff',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: 'rgba(228, 50, 146, 0.1)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
              <i className="las la-map-marker-alt" style={{ color: 'var(--brand-pink)', fontSize: '14px' }}></i>
            </div>
            <span style={{ fontSize: '11px', color: '#444', fontWeight: 600 }}>24h in Dhaka</span>
          </div>
          
          <div style={{ height: '15px', width: '1px', background: '#eaeaea' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.15)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
              <i className="las la-truck" style={{ color: '#f59e0b', fontSize: '14px' }}></i>
            </div>
            <span style={{ fontSize: '11px', color: '#444', fontWeight: 600 }}>48h in Bangladesh</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurgoodsStock;
