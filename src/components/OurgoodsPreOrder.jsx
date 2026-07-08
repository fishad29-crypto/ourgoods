import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveScrollAndNavigate } from '../utils/navigation';

const preOrderProducts = [
  {
    id: 201,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=90&w=600',
    title: 'Running Shoes',
    price: '৳4,200',
    originalPrice: '৳5,500',
    sold: '230 Sold'
  },
  {
    id: 202,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=90&w=600',
    title: 'Minimalist Backpack',
    price: '৳1,200',
    originalPrice: '৳1,800',
    sold: '3.4k Sold'
  },
  {
    id: 203,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=90&w=600',
    title: 'Classic Leather Wallet',
    price: '৳950',
    originalPrice: '৳1,400',
    sold: '5.1k Sold'
  },
  {
    id: 204,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=90&w=600',
    title: 'Portable Charger 10k',
    price: '৳1,500',
    originalPrice: '৳2,200',
    sold: '9.2k Sold'
  }
];

const OurgoodsPreOrder = () => {
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
                <i className="las la-globe" style={{ color: '#fff', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Global Shop</span>
              </div>
            </div>
            
            {/* Delivery text */}
            <div style={{ paddingLeft: '28px', fontSize: '9px', letterSpacing: '-0.2px', whiteSpace: 'nowrap', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px', fontWeight: 600 }}>
              Standard: 21-28 Days • Express: 4-7 Days
            </div>
          </div>

          <div 
            onClick={() => saveScrollAndNavigate(navigate, '/ourgoods-pre-order')}
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
            {preOrderProducts.map((product) => (
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

export default OurgoodsPreOrder;
