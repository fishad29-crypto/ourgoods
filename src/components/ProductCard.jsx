import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, showChoiceTag = false }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Rotating Badge State
  const [showBestseller, setShowBestseller] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBestseller(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate a consistent pseudo-random rank based on product title length
  const bestsellerRank = (product.title?.length % 20) + 1;

  // Pseudo-random generator for consistent numbers per product
  const pseudoRandom = (seed) => {
    let hash = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = pseudoRandom(product.id || product.title || 'default');
  const randomSoldCount = product.soldCount || ((hash % 15000) + 500); // 500 to 15500
  const randomReviewCount = product.reviewCount || ((hash % 2000) + 50); // 50 to 2050
  const randomRating = (4.0 + (hash % 11) / 10).toFixed(1); // 4.0 to 5.0

  const formatSoldCount = (count) => {
    if (count >= 1000000000) return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return count.toLocaleString();
  };
  
  const soldText = formatSoldCount(randomSoldCount);
  
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play prevented", e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Format price into integer and decimal
  const priceNum = Number(product.price || 0).toFixed(2);
  const [integerPart, decimalPart] = priceNum.split('.');

  // Extract colors from product, fallback to empty
  const extractColors = () => {
    if (!product.colors) return [];
    if (Array.isArray(product.colors)) return product.colors;
    
    // If it's a string like "Matte Black, White"
    const colorMap = {
      'black': '#000000', 'white': '#ffffff', 'maroon': '#800000', 'olive': '#808000',
      'navy': '#000080', 'red': '#ff0000', 'blue': '#0000ff', 'green': '#008000',
      'yellow': '#ffff00', 'purple': '#800080', 'pink': '#ffc0cb', 'grey': '#808080',
      'gray': '#808080', 'silver': '#c0c0c0', 'gold': '#ffd700', 'brown': '#a52a2a'
    };
    
    return product.colors.split(',').map(c => {
      const name = c.trim().toLowerCase();
      // Try to find a matching color in the map
      for (const [key, hex] of Object.entries(colorMap)) {
        if (name.includes(key)) return hex;
      }
      return '#cccccc'; // Default fallback dot color
    }).slice(0, 6); // Max 6 colors
  };

  const productColors = extractColors();

  return (
    <div className="product-card-hover" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }} onClick={(e) => {
        const scrollContainer = e.currentTarget.closest('.swipe-page') || e.currentTarget.closest('.content-container');
        const scrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
        sessionStorage.setItem(`scroll_${window.location.pathname}`, scrollY);
        navigate(`/product/${product.id}`);
      }}>
      
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#f9f9f9', overflow: 'hidden' }}>
        
        {/* Wishlist Button */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{ 
            position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', 
            background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)',
            borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', 
            fontSize: '16px', color: isWishlisted ? 'var(--brand-pink)' : '#666', zIndex: 10,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
          <i className={isWishlisted ? "las la-heart" : "lar la-heart"} style={{ transform: isWishlisted ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s' }}></i>
        </div>

        {/* Choice Badge (Optional, Bottom Left) */}
        {product.isChoice && showChoiceTag && (
          <div style={{ 
            position: 'absolute', bottom: '8px', left: '8px', 
            background: 'linear-gradient(135deg, #FFD700, #FDB931)', color: '#000', 
            fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '4px', 
            zIndex: 10, display: 'flex', alignItems: 'center', gap: '3px', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
          }}>
            <i className="las la-crown" style={{ fontSize: '14px' }}></i>
            CHOICE
          </div>
        )}

        {/* Product Color Dots (Bottom Right) */}
        {productColors.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px', zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
          }}>
            {productColors.map((color, idx) => (
              <div key={idx} style={{
                width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color,
                border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            ))}
          </div>
        )}

        {/* Image/Video */}
        {(() => {
          const imgUrl = (product.images && product.images.length > 0) 
            ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || product.images[0].src || product.image))
            : product.image;
          const safeUrl = typeof imgUrl === 'string' ? imgUrl : "https://via.placeholder.com/500x500.png?text=Broken+Image";
          
          if (
            safeUrl.match(/\.(mp4|webm|ogg)$/i) || 
            safeUrl.startsWith('data:video/') || 
            (product.imageType && product.imageType.startsWith('video/'))
          ) {
            return (
              <video 
                ref={videoRef}
                src={safeUrl} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                muted 
                loop 
                playsInline 
              />
            );
          } else {
            return (
              <img 
                src={safeUrl} 
                alt={product.title} 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/500x500.png?text=Image+Load+Error"; }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            );
          }
        })()}
      </div>
      
      {/* Content Area */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#fff' }}>
        
        {/* Trends & Vendor Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(236, 72, 153, 0.08)', 
          borderRadius: '4px', 
          marginBottom: '8px',
          width: 'fit-content' 
        }}>
          {/* Vendor Name */}
          <div style={{
            color: 'var(--brand-pink)',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <i className="las la-store" style={{ fontSize: '12px', flexShrink: 0 }}></i>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(product.vendor || product.brand || 'OURGOODS').split(' ')[0]}
            </span>
          </div>

          {/* Trends Badge */}
          <div style={{
            background: 'var(--brand-pink)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '0 4px 4px 0',
            fontSize: '10px',
            fontWeight: 800,
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <i className="las la-chart-line" style={{ fontSize: '12px' }}></i>
            trends
            <i className="las la-angle-right" style={{ fontSize: '10px', marginLeft: '2px', flexShrink: 0 }}></i>
          </div>
        </div>

        {/* Title & Ribbon */}
        <div style={{ 
          fontSize: '13px', 
          lineHeight: '1.4', 
          marginBottom: '6px', 
          color: '#111',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word'
        }}>
          {(product.deliveryBannerType === 'global' || product.ribbon === 'Global') && (
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px', 
              background: '#222', 
              color: '#fff', 
              fontSize: '10px', 
              fontWeight: 700, 
              padding: '2px 6px', 
              borderRadius: '4px',
              marginRight: '6px', 
              verticalAlign: 'text-bottom',
            }}>
              <i className="las la-industry" style={{ fontSize: '11px' }}></i>
              Factory
            </span>
          )}
          {product.ribbon && product.ribbon !== 'None' && product.ribbon !== 'Local' && product.ribbon !== 'Global' ? (
            <span style={{ 
              display: 'inline-block', 
              background: '#10b981', 
              color: '#fff', 
              fontSize: '10px', 
              fontWeight: 700, 
              padding: '2px 6px', 
              borderRadius: '4px', 
              marginRight: '6px', 
              verticalAlign: 'text-bottom',
            }}>
              {product.ribbon}
            </span>
          ) : (
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px', 
              background: 'rgba(0, 0, 0, 0.05)', 
              color: '#555', 
              fontSize: '10px', 
              fontWeight: 700, 
              padding: '2px 6px', 
              borderRadius: '4px',
              marginRight: '6px', 
              verticalAlign: 'text-bottom',
            }}>
              {product.deliveryBannerType === 'global' || product.ribbon === 'Global' ? (
                <><img src="https://flagcdn.com/w20/cn.png" alt="China" style={{ width: '12px', height: 'auto', borderRadius: '1px', marginRight: '3px' }} /> China</>
              ) : (
                <><img src="https://flagcdn.com/w20/bd.png" alt="Bangladesh" style={{ width: '12px', height: 'auto', borderRadius: '1px', marginRight: '3px' }} /> Local</>
              )}
            </span>
          )}
          <span style={{ fontWeight: 500 }}>{product.title}</span>
        </div>

        {/* Dynamic Rotating Badges */}
        <div style={{ height: '16px', marginBottom: '4px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: showBestseller ? 'translateY(0)' : 'translateY(-16px)'
          }}>
            <div style={{ height: '16px', display: 'flex', alignItems: 'center', color: '#d97706', fontSize: '11px', fontWeight: 600, gap: '4px', whiteSpace: 'nowrap' }}>
              <span>#{bestsellerRank} Bestseller</span>
            </div>
            <div style={{ height: '16px', display: 'flex', alignItems: 'center', color: '#ef4444', fontSize: '11px', fontWeight: 600, gap: '4px' }}>
              <i className="las la-hourglass-half"></i>
              <span>Almost sold out!</span>
            </div>
          </div>
        </div>

        {/* Sold & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span>{soldText}+ sold</span>
          <span style={{ color: '#e0e0e0', margin: '0 6px' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ color: '#f59e0b', fontSize: '12px', lineHeight: 1 }}>★</span>
            <span style={{ color: '#111', fontWeight: 700, fontSize: '11px' }}>{randomRating}</span>
          </div>
        </div>
        
        {/* Price & Discount Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', marginTop: 'auto' }}>
          <div style={{ 
            color: 'var(--brand-pink, #ff4d4f)', 
            display: 'flex',
            alignItems: 'baseline',
            fontWeight: 800,
            lineHeight: 1
          }}>
            <span style={{ fontSize: '12px', marginRight: '2px' }}>৳</span>
            <span style={{ fontSize: '20px' }}>{integerPart}</span>
          </div>
          
          {(product.discount > 0 || product.discount === undefined) && (
            <div style={{ 
              background: 'rgba(236, 72, 153, 0.1)', 
              color: 'var(--brand-pink, #ff4d4f)', 
              fontSize: '11px', 
              fontWeight: 800, 
              padding: '2px 5px', 
              borderRadius: '4px' 
            }}>
              -{product.discount || 50}%
            </div>
          )}
        </div>

        {/* Free Shipping Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '11px',
          fontWeight: 700,
          gap: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', gap: '4px', flexShrink: 0 }}>
            <i className="las la-truck" style={{ fontSize: '14px' }}></i>
            <span>Free Shipping</span>
          </div>
          <span style={{ color: '#888', fontWeight: 500, fontSize: '10px', marginLeft: '2px' }}>
            • {(() => {
              const type = product.deliveryBannerType || '';
              if (type.includes('24-48') || type === '24-48h') return '24-48h';
              if (type.includes('1-5') || type === '1-5days') return '1-5D';
              if (type === 'global') return '14-28D';
              if (type.includes('7-12')) return '7-12D';
              if (type.includes('15-30')) return '15-30D';
              return '24-48h'; // Default if none is set
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
