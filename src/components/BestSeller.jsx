import React from 'react';
import { useNavigate } from 'react-router-dom';
import { saveScrollAndNavigate } from '../utils/navigation';

const categoryBestSellers = {
  'Women': [
    { id: 99, rank: 1, image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=90&w=600', title: 'Brooklyn Ringer T-Shirt', price: '৳550', originalPrice: '৳900', sold: '2.5k Sold' },
    { id: 1, rank: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=90&w=600', title: 'Minimalist T-Shirt', price: '৳450', originalPrice: '৳800', sold: '12.5k Sold' },
    { id: 2, rank: 3, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=90&w=600', title: 'Classic Pumps', price: '৳1,200', originalPrice: '৳2,500', sold: '9.2k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=90&w=600', title: 'Wireless Headphones', price: '৳3,500', originalPrice: '৳5,000', sold: '8.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&q=90&w=600', title: 'Matte Lipstick Set', price: '৳650', originalPrice: '৳1,200', sold: '7.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=90&w=600', title: 'Oversized Sunglasses', price: '৳850', originalPrice: '৳1,500', sold: '6.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=90&w=600', title: 'Leather Wallet', price: '৳950', originalPrice: '৳1,800', sold: '5.9k Sold' },
    { id: 7, rank: 7, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=90&w=600', title: 'Smart Watch', price: '৳2,100', originalPrice: '৳3,500', sold: '4.7k Sold' },
    { id: 8, rank: 8, image: 'https://images.unsplash.com/photo-1599643478524-fb66f4568e71?auto=format&fit=crop&q=90&w=600', title: 'Denim Jacket', price: '৳1,800', originalPrice: '৳2,600', sold: '4.2k Sold' }
  ],
  'Jewelry & Accessories': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=90&w=600', title: 'Gold Ring', price: '৳4,500', originalPrice: '৳6,000', sold: '5.5k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1599643478514-4a11011c77f0?auto=format&fit=crop&q=90&w=600', title: 'Pendant Necklace', price: '৳1,200', originalPrice: '৳2,500', sold: '4.2k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=90&w=600', title: 'Stud Earrings', price: '৳3,500', originalPrice: '৳5,000', sold: '3.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=90&w=600', title: 'Charm Bracelet', price: '৳650', originalPrice: '৳1,200', sold: '7.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=90&w=600', title: 'Analog Watch', price: '৳2,850', originalPrice: '৳3,500', sold: '6.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=90&w=600', title: 'Retro Sunglasses', price: '৳950', originalPrice: '৳1,800', sold: '5.9k Sold' }
  ],
  'Purse & Bags': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=90&w=600', title: 'Everyday Tote', price: '৳2,450', originalPrice: '৳3,800', sold: '6.5k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=90&w=600', title: 'Leather Crossbody', price: '৳3,200', originalPrice: '৳4,500', sold: '5.2k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=90&w=600', title: 'Travel Backpack', price: '৳4,500', originalPrice: '৳6,000', sold: '4.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=90&w=600', title: 'Party Clutch', price: '৳1,650', originalPrice: '৳2,200', sold: '3.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=90&w=600', title: 'Slim Wallet', price: '৳850', originalPrice: '৳1,500', sold: '8.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=600', title: 'Work Satchel', price: '৳5,950', originalPrice: '৳7,800', sold: '2.9k Sold' }
  ],
  'Sneakers & Shoes': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=600', title: 'Running Sneakers', price: '৳3,450', originalPrice: '৳5,800', sold: '11.5k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=90&w=600', title: 'Ankle Boots', price: '৳4,200', originalPrice: '৳6,500', sold: '4.2k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=90&w=600', title: 'Classic Pumps', price: '৳2,500', originalPrice: '৳4,000', sold: '7.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=90&w=600', title: 'Comfort Flats', price: '৳1,650', originalPrice: '৳2,200', sold: '6.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1603487742131-4160c9993020?auto=format&fit=crop&q=90&w=600', title: 'Beach Sandals', price: '৳850', originalPrice: '৳1,500', sold: '9.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=90&w=600', title: 'Casual Loafers', price: '৳3,950', originalPrice: '৳5,800', sold: '3.9k Sold' }
  ],
  'Beauty & Health': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=90&w=600', title: 'Vitamin C Serum', price: '৳1,450', originalPrice: '৳2,800', sold: '15.5k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=90&w=600', title: 'Red Lipstick', price: '৳800', originalPrice: '৳1,500', sold: '14.2k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=90&w=600', title: 'Floral Perfume', price: '৳4,500', originalPrice: '৳6,000', sold: '8.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=90&w=600', title: 'Argan Hair Oil', price: '৳1,250', originalPrice: '৳2,200', sold: '9.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=90&w=600', title: 'Shea Body Butter', price: '৳950', originalPrice: '৳1,500', sold: '11.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=600', title: 'Makeup Sponge Set', price: '৳450', originalPrice: '৳800', sold: '25.9k Sold' }
  ],
  'Home & Decor': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=90&w=600', title: 'Minimalist Chair', price: '৳4,500', originalPrice: '৳6,000', sold: '12.5k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=90&w=600', title: 'Throw Pillows', price: '৳1,200', originalPrice: '৳2,500', sold: '9.2k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=90&w=600', title: 'Ceramic Planter', price: '৳3,500', originalPrice: '৳5,000', sold: '8.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=90&w=600', title: 'Table Lamp', price: '৳2,650', originalPrice: '৳3,200', sold: '7.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=90&w=600', title: 'Wall Clock', price: '৳1,850', originalPrice: '৳2,500', sold: '6.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=90&w=600', title: 'Woven Basket', price: '৳950', originalPrice: '৳1,800', sold: '5.9k Sold' }
  ]
};

const BestSeller = ({ category }) => {
  const navigate = useNavigate();
  const bestSellerProducts = categoryBestSellers[category] || categoryBestSellers['Women'];
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px', height: '100%' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="las la-globe" style={{ color: '#fff', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>International Market</span>
              </div>
            </div>
            
            {/* Delivery text */}
            <div style={{ paddingLeft: '30px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px', fontWeight: 600 }}>
              Standard: 21-28 Days • Express: 4-7 Business Days
            </div>
          </div>

          <div 
            onClick={() => saveScrollAndNavigate(navigate, '/market/international-market')}
            style={{ color: 'var(--brand-pink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            View All <i className="las la-angle-right" style={{ fontSize: '14px' }}></i>
          </div>
        </div>

        {/* Product Row */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px' }}>
          {bestSellerProducts.map((product) => (
            <div key={product.id} style={{ minWidth: '110px', width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              
              {/* Image Box */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', marginBottom: '8px', border: '1px solid #eaeaea' }}>
                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Ranking Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '0', 
                  background: 'var(--brand-pink)', 
                  color: '#fff', 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomRightRadius: '8px' 
                }}>
                  #{product.rank}
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

export default BestSeller;
