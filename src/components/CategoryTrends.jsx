import React from 'react';

const categoryTrends = {
  'Women': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=90&w=400', title: 'Summer Floral Maxi', price: '৳1,850', originalPrice: '৳2,500', sold: '4.2k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=90&w=400', title: 'High-Waist Denim', price: '৳2,100', originalPrice: '৳2,800', sold: '8.5k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1566160980424-df3a093226db?auto=format&fit=crop&q=90&w=400', title: 'Elegant Evening Gown', price: '৳4,500', originalPrice: '৳6,000', sold: '1.2k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=90&w=400', title: 'Cotton V-Neck Tee', price: '৳450', originalPrice: '৳700', sold: '15.6k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=90&w=400', title: 'Professional Blazer', price: '৳3,200', originalPrice: '৳4,500', sold: '3.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=90&w=400', title: 'Yoga Leggings', price: '৳1,100', originalPrice: '৳1,500', sold: '9.8k Sold' }
  ],
  'Jewelry & Accessories': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1599643478514-4a11011c77f0?auto=format&fit=crop&q=90&w=400', title: 'Diamond Necklace', price: '৳12,000', originalPrice: '৳15,000', sold: '1.2k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=90&w=400', title: 'Gold Hoop Earrings', price: '৳3,500', originalPrice: '৳5,000', sold: '5.5k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=90&w=400', title: 'Engagement Ring', price: '৳25,000', originalPrice: '৳30,000', sold: '800 Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=90&w=400', title: 'Classic Watch', price: '৳8,500', originalPrice: '৳11,000', sold: '2.4k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=90&w=400', title: 'Aviator Sunglasses', price: '৳1,200', originalPrice: '৳2,000', sold: '7.8k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=90&w=400', title: 'Silver Bracelet', price: '৳2,800', originalPrice: '৳4,000', sold: '3.1k Sold' }
  ],
  'Purse & Bags': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=90&w=400', title: 'Leather Tote', price: '৳4,500', originalPrice: '৳6,000', sold: '3.2k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=90&w=400', title: 'Mini Crossbody', price: '৳2,100', originalPrice: '৳3,500', sold: '6.5k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=90&w=400', title: 'Canvas Backpack', price: '৳1,800', originalPrice: '৳2,500', sold: '4.8k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=90&w=400', title: 'Evening Clutch', price: '৳3,200', originalPrice: '৳4,500', sold: '1.5k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=90&w=400', title: 'Zip Wallet', price: '৳850', originalPrice: '৳1,200', sold: '9.1k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=400', title: 'Designer Satchel', price: '৳7,500', originalPrice: '৳10,000', sold: '800 Sold' }
  ],
  'Sneakers & Shoes': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=400', title: 'Sport Sneakers', price: '৳2,500', originalPrice: '৳4,000', sold: '8.2k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=90&w=400', title: 'Leather Boots', price: '৳4,800', originalPrice: '৳6,500', sold: '2.5k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=90&w=400', title: 'Stiletto Heels', price: '৳3,200', originalPrice: '৳4,500', sold: '4.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=90&w=400', title: 'Casual Flats', price: '৳1,200', originalPrice: '৳1,800', sold: '6.7k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1603487742131-4160c9993020?auto=format&fit=crop&q=90&w=400', title: 'Summer Sandals', price: '৳950', originalPrice: '৳1,500', sold: '11.2k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=90&w=400', title: 'Suede Loafers', price: '৳2,800', originalPrice: '৳3,800', sold: '1.8k Sold' }
  ],
  'Beauty & Health': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=90&w=400', title: 'Hydrating Serum', price: '৳1,800', originalPrice: '৳2,500', sold: '7.2k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=90&w=400', title: 'Matte Lipstick', price: '৳650', originalPrice: '৳950', sold: '12.5k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=90&w=400', title: 'Luxury Perfume', price: '৳5,500', originalPrice: '৳7,000', sold: '2.1k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=90&w=400', title: 'Hair Mask', price: '৳1,200', originalPrice: '৳1,800', sold: '4.8k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=90&w=400', title: 'Body Lotion', price: '৳850', originalPrice: '৳1,200', sold: '8.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=400', title: 'Makeup Brushes', price: '৳2,100', originalPrice: '৳3,000', sold: '3.6k Sold' }
  ],
  'Home & Decor': [
    { id: 1, rank: 1, image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=90&w=400', title: 'Modern Sofa', price: '৳15,000', originalPrice: '৳20,000', sold: '2.5k Sold' },
    { id: 2, rank: 2, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=90&w=400', title: 'Cozy Comforter', price: '৳3,500', originalPrice: '৳5,000', sold: '8.1k Sold' },
    { id: 3, rank: 3, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=90&w=400', title: 'Pendant Light', price: '৳1,200', originalPrice: '৳1,800', sold: '4.2k Sold' },
    { id: 4, rank: 4, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=90&w=400', title: 'Abstract Art', price: '৳2,800', originalPrice: '৳4,000', sold: '1.9k Sold' },
    { id: 5, rank: 5, image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=90&w=400', title: 'Persian Rug', price: '৳5,500', originalPrice: '৳8,000', sold: '3.4k Sold' },
    { id: 6, rank: 6, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=90&w=400', title: 'Ceramic Vase', price: '৳850', originalPrice: '৳1,200', sold: '6.7k Sold' }
  ]
};

const CategoryTrends = ({ category }) => {
  const trendProducts = categoryTrends[category] || categoryTrends['Women'];

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
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 15px',
        borderBottom: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ 
            fontWeight: 900, 
            fontSize: '18px', 
            color: '#111', 
            fontStyle: 'italic',
            letterSpacing: '-0.5px'
          }}>
            Top
          </span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '2px', paddingTop: '4px' }}>
            <i className="las la-location-arrow" style={{ 
              color: '#a855f7', 
              fontSize: '16px', 
              position: 'absolute',
              top: '-2px',
              left: '-8px',
              transform: 'rotate(45deg)'
            }}></i>
            <span style={{ 
              fontWeight: 900, 
              fontSize: '18px', 
              color: '#111', 
              fontStyle: 'italic',
              letterSpacing: '-1px',
              whiteSpace: 'nowrap'
            }}>
              trends
            </span>
          </div>
        </div>
        <i className="las la-angle-right" style={{ fontSize: '14px', fontWeight: 'bold', color: '#111' }}></i>
      </div>

      {/* Product Row */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px' }}>
        {trendProducts.map((product) => (
          <div key={product.id} style={{ minWidth: '110px', width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* Image Box */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', marginBottom: '8px', border: '1px solid #eaeaea' }}>
              <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Ranking Badge */}
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                left: '0', 
                background: '#a855f7', 
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

export default CategoryTrends;
