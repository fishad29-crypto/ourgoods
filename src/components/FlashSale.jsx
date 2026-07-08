import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveScrollAndNavigate } from '../utils/navigation';

const flashSaleProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=90&w=400',
    discount: '-45%',
    price: '৳599',
    originalPrice: '৳1,099',
    sold: '2.3k Sold',
    categories: ['Women', 'All']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=90&w=400',
    discount: '-40%',
    price: '৳899',
    originalPrice: '৳1,499',
    sold: '1.7k Sold',
    categories: ['Women', 'All']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=400',
    discount: '-35%',
    price: '৳1,299',
    originalPrice: '৳1,999',
    sold: '3.1k Sold',
    categories: ['Women', 'Purse & Bags', 'All']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1622445272461-c6580cab8755?auto=format&fit=crop&q=90&w=400',
    discount: '-30%',
    price: '৳499',
    originalPrice: '৳799',
    sold: '1.2k Sold'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=90&w=400',
    discount: '-50%',
    price: '৳299',
    originalPrice: '৳599',
    sold: '4.5k Sold'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=400',
    discount: '-25%',
    price: '৳1,599',
    originalPrice: '৳2,100',
    sold: '900 Sold'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1599643478524-fb66f4568e71?auto=format&fit=crop&q=90&w=400',
    discount: '-60%',
    price: '৳399',
    originalPrice: '৳999',
    sold: '5.2k Sold'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=90&w=400',
    discount: '-20%',
    price: '৳2,499',
    originalPrice: '৳3,100',
    sold: '450 Sold'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1615397323226-0e3f05c08d2f?auto=format&fit=crop&q=90&w=400',
    discount: '-70%',
    price: '৳199',
    originalPrice: '৳699',
    sold: '8.1k Sold'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=90&w=400',
    discount: '-15%',
    price: '৳3,299',
    originalPrice: '৳3,899',
    sold: '230 Sold',
    categories: ['All']
  }
];

const FlashSale = ({ category }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 13,
    seconds: 5
  });
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };


  const displayProducts = category 
    ? flashSaleProducts.filter(p => p.categories && p.categories.includes(category))
    : flashSaleProducts;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Timer done, just stick at 0 or restart
              hours = 2;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, '0');

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
        background: '#111',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Flash Icon & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="las la-bolt" style={{ color: '#fff', fontSize: '24px' }}></i>
              <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Flash Sale</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '30px', marginTop: '2px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px', fontWeight: 600, marginRight: '2px' }}>Ends in</span>
            
            <div style={{ background: '#222', border: 'none', color: 'var(--brand-pink)', borderRadius: '4px', padding: '1px 4px', fontSize: '10px', fontWeight: 800 }}>
              {formatTime(timeLeft.hours)}
            </div>
            <span style={{ color: 'var(--brand-pink)', fontSize: '10px', fontWeight: 900 }}>:</span>
            
            <div style={{ background: '#222', border: 'none', color: 'var(--brand-pink)', borderRadius: '4px', padding: '1px 4px', fontSize: '10px', fontWeight: 800 }}>
              {formatTime(timeLeft.minutes)}
            </div>
            <span style={{ color: 'var(--brand-pink)', fontSize: '10px', fontWeight: 900 }}>:</span>
            
            <div style={{ background: '#222', border: 'none', color: 'var(--brand-pink)', borderRadius: '4px', padding: '1px 4px', fontSize: '10px', fontWeight: 800 }}>
              {formatTime(timeLeft.seconds)}
            </div>
          </div>
        </div>

        {/* View All */}
        <div 
          onClick={() => saveScrollAndNavigate(navigate, '/market/flash-sale')}
          style={{ color: 'var(--brand-pink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
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
          {displayProducts.map((product) => (
          <div key={product.id} style={{ minWidth: '110px', width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* Image Box */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', marginBottom: '8px' }}>
              <img src={product.image} alt="Flash Sale Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Discount Badge */}
              <div style={{ position: 'absolute', top: '0', left: '0', background: 'var(--brand-pink)', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '3px 6px', borderBottomRightRadius: '8px' }}>
                {product.discount}
              </div>
              
              {/* Heart Icon */}
              <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa', fontSize: '14px' }}>
                <i className="lar la-heart"></i>
              </div>
            </div>

            {/* Prices */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
              <span style={{ color: 'var(--brand-pink)', fontWeight: 900, fontSize: '14px' }}>{product.price}</span>
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

export default FlashSale;
