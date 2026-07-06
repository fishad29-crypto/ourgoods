import React from 'react';
import { useNavigate } from 'react-router-dom';

const directProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=600',
    title: 'Nike Air Max (Pre-Order)',
    price: '৳8,500',
    originalPrice: '৳10,000',
    sold: '120 Sold'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=90&w=600',
    title: 'Smart Watch Pro',
    price: '৳2,100',
    originalPrice: '৳3,500',
    sold: '4.7k Sold'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=90&w=600',
    title: 'Wireless Headphones',
    price: '৳3,500',
    originalPrice: '৳5,000',
    sold: '8.1k Sold'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=90&w=600',
    title: 'Oversized Sunglasses',
    price: '৳850',
    originalPrice: '৳1,500',
    sold: '6.4k Sold'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=90&w=600',
    title: 'Ourgoods Essential Tee',
    price: '৳450',
    originalPrice: '৳800',
    sold: '12.5k Sold'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=90&w=600',
    title: 'Running Shoes (Pre-Order)',
    price: '৳4,200',
    originalPrice: '৳5,500',
    sold: '230 Sold'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=90&w=600',
    title: 'Minimalist Backpack',
    price: '৳1,200',
    originalPrice: '৳1,800',
    sold: '3.4k Sold'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=90&w=600',
    title: 'Classic Leather Wallet',
    price: '৳950',
    originalPrice: '৳1,400',
    sold: '5.1k Sold'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=90&w=600',
    title: 'Portable Charger 10k',
    price: '৳1,500',
    originalPrice: '৳2,200',
    sold: '9.2k Sold'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b06b3848?auto=format&fit=crop&q=90&w=600',
    title: 'Premium Yoga Mat',
    price: '৳1,100',
    originalPrice: '৳1,600',
    sold: '2.8k Sold'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=90&w=600',
    title: 'Mechanical Keyboard',
    price: '৳4,500',
    originalPrice: '৳6,000',
    sold: '1.5k Sold'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=90&w=600',
    title: 'Scented Soy Candle',
    price: '৳600',
    originalPrice: '৳900',
    sold: '4.2k Sold'
  },
  {
    id: 13,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=90&w=600',
    title: 'Retro Polaroid (Pre-Order)',
    price: '৳5,500',
    originalPrice: '৳7,000',
    sold: '850 Sold'
  },
  {
    id: 14,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=90&w=600',
    title: 'Aesthetic Desk Lamp',
    price: '৳1,800',
    originalPrice: '৳2,500',
    sold: '2.1k Sold'
  },
  {
    id: 15,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=90&w=600',
    title: 'Insulated Water Bottle',
    price: '৳750',
    originalPrice: '৳1,200',
    sold: '6.7k Sold'
  },
  {
    id: 16,
    image: 'https://images.unsplash.com/photo-1527814050087-379381547962?auto=format&fit=crop&q=90&w=600',
    title: 'Pro Gaming Mouse',
    price: '৳2,300',
    originalPrice: '৳3,200',
    sold: '3.9k Sold'
  },
  {
    id: 17,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=90&w=600',
    title: 'Canvas Tote Bag',
    price: '৳300',
    originalPrice: '৳500',
    sold: '15k+ Sold'
  },
  {
    id: 18,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=90&w=600',
    title: 'Skincare Serum Set',
    price: '৳1,400',
    originalPrice: '৳2,000',
    sold: '5.5k Sold'
  },
  {
    id: 19,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=90&w=600',
    title: 'Summer Maxi Dress',
    price: '৳1,600',
    originalPrice: '৳2,400',
    sold: '4.8k Sold'
  },
  {
    id: 20,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aecb492021?auto=format&fit=crop&q=90&w=600',
    title: 'Noise Cancel Earbuds',
    price: '৳2,800',
    originalPrice: '৳4,000',
    sold: '7.3k Sold'
  }
];

const OurgoodsMart = () => {
  const navigate = useNavigate();
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
          borderBottom: 'none'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="las la-gem" style={{ color: 'var(--brand-pink)', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#111', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>OURGOODS DIRECT</span>
              </div>
            </div>
            
            {/* Delivery text */}
            <div style={{ paddingLeft: '30px', fontSize: '10px', color: 'rgba(17, 17, 17, 0.4)', marginTop: '2px', fontWeight: 600 }}>
              Exclusive Ourgoods collection & international pre-orders
            </div>
          </div>

          <div style={{ color: 'var(--brand-pink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            View All <i className="las la-angle-right" style={{ fontSize: '14px' }}></i>
          </div>
        </div>

        {/* Product Row */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px' }}>
          {directProducts.map((product) => (
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
  );
};

export default OurgoodsMart;
