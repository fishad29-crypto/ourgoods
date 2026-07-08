import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveScrollAndNavigate } from '../utils/navigation';

const wholesaleProducts = [
  {
    id: 301,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=90&w=600',
    title: 'Mechanical Keyboard (Bulk)',
    price: '৳3,500',
    originalPrice: '৳4,500',
    sold: '1.5k Sold'
  },
  {
    id: 302,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=90&w=600',
    title: 'Scented Soy Candle (x50)',
    price: '৳400',
    originalPrice: '৳600',
    sold: '4.2k Sold'
  },
  {
    id: 303,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=90&w=600',
    title: 'Aesthetic Desk Lamp (Box)',
    price: '৳1,200',
    originalPrice: '৳1,800',
    sold: '2.1k Sold'
  },
  {
    id: 304,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=90&w=600',
    title: 'Water Bottle (x100)',
    price: '৳500',
    originalPrice: '৳750',
    sold: '6.7k Sold'
  }
];

const OurgoodsWholesale = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        overflow: 'hidden',
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
                <i className="las la-industry" style={{ color: '#fff', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Factory Direct</span>
              </div>
            </div>
            
            {/* Delivery text */}
            <div style={{ paddingLeft: '28px', fontSize: '8.5px', letterSpacing: '-0.2px', whiteSpace: 'nowrap', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px', fontWeight: 600 }}>
              Domestic: 1-3 Days • International: 21-28 Days • Express: 4-7 Days
            </div>
          </div>

          <div 
            onClick={() => saveScrollAndNavigate(navigate, '/ourgoods-wholesale')}
            style={{ color: 'var(--brand-pink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>
            View All <i className="las la-angle-right" style={{ fontSize: '14px' }}></i>
          </div>
        </div>

        {/* Product Row */}
        <div style={{ position: 'relative' }}>
          <div className="desktop-slider-arrow" style={{ left: '5px' }} onClick={scrollLeft}>
            <i className="las la-angle-left"></i>
          </div>
          <div className="desktop-slider-arrow" style={{ right: '5px' }} onClick={scrollRight}>
            <i className="las la-angle-right"></i>
          </div>
          
          <div ref={scrollRef} className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px', scrollBehavior: 'smooth' }}>
            {wholesaleProducts.map((product) => (
            <div key={product.id} style={{ minWidth: '110px', width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
              
              {/* Image Box */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', marginBottom: '8px', border: '1px solid #eaeaea' }}>
                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Plus Button */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '4px', 
                  right: '4px', 
                  background: '#111', 
                  color: '#fff', 
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <i className="las la-plus"></i>
                </div>
              </div>

              {/* Title */}
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#333', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.title}
              </div>

              {/* Prices */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: 'var(--brand-pink)', fontWeight: 900, fontSize: '15px' }}>{product.price}</span>
                <span style={{ color: '#999', fontSize: '10px', textDecoration: 'line-through' }}>{product.originalPrice}</span>
              </div>

              {/* Sold Count */}
              <div style={{ color: '#888', fontSize: '10px', fontWeight: 500 }}>
                {product.sold}
              </div>

            </div>
          ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurgoodsWholesale;
