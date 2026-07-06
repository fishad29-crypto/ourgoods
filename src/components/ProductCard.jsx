import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const soldText = product.soldCount >= 1000000000 
    ? (product.soldCount / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B' 
    : product.soldCount >= 1000000 
      ? (product.soldCount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' 
      : product.soldCount.toLocaleString();
  
  return (
    <div className="product-card-hover" style={{
      width: '100%',
      background: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
    }} onClick={(e) => {
      const scrollContainer = e.currentTarget.closest('.swipe-page') || e.currentTarget.closest('.content-container');
      const scrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      sessionStorage.setItem(`scroll_${window.location.pathname}`, scrollY);
      navigate(`/product/${product.id}`);
    }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#f9f9f9', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5px', left: '5px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10 }}>
          <div style={{ background: 'var(--brand-pink)', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '3px 6px', borderRadius: '4px', alignSelf: 'flex-start' }}>
            -{product.discount}%
          </div>
          {product.category === 'Combo Deals' && (
            <div style={{ background: '#FF9900', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '2px 5px', borderRadius: '2px', alignSelf: 'flex-start', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Combo
            </div>
          )}
        </div>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{ position: 'absolute', top: '5px', right: '5px', width: '26px', height: '26px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', color: isWishlisted ? 'var(--brand-pink)' : '#666', zIndex: 10 }}>
          <i className={isWishlisted ? "las la-heart" : "lar la-heart"}></i>
        </div>
        {product.isChoice && (
          <div style={{ position: 'absolute', bottom: '5px', left: '5px', background: 'linear-gradient(135deg, #FFD700, #FDB931)', color: '#000', fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '4px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '3px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <i className="las la-crown" style={{ fontSize: '14px' }}></i>
            CHOICE
          </div>
        )}
        <img src={product.image} alt={product.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <div style={{ padding: '8px 8px 12px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '13px', lineHeight: '1.4', height: '37px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '6px', color: '#111' }}>
          {product.title}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
          {/* Green badge like Pinduoduo's Buy Now Pay Later */}
          <span style={{ fontSize: '9px', color: '#00A651', border: '1px solid #00A651', padding: '0px 3px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <i className="las la-check-circle" style={{ fontSize: '10px' }}></i> Pay Later
          </span>
          <span style={{ fontSize: '10px', color: '#999' }}>Fake 1 Pay 10</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 'auto', gap: '6px' }}>
          <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--brand-pink)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, marginRight: '1px' }}>৳</span>
            {product.price.toLocaleString()}
          </span>
          <span style={{ fontSize: '11px', color: '#999' }}>{soldText} Sold</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
