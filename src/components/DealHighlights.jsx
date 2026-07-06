import React from 'react';

const comboDealProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=90&w=600',
    title: 'Organic Skincare',
    tag: 'Deshi',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳830',
    originalPrice: '৳1,200',
    sold: '1.2k Sold'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1615397323226-0e3f05c08d2f?auto=format&fit=crop&q=90&w=600',
    title: 'Herbal Set',
    tag: 'Organic',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳749',
    originalPrice: '৳1,050',
    sold: '850 Sold'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=90&w=600',
    title: 'Nakshi Kantha',
    tag: 'Handloom',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳612',
    originalPrice: '৳999',
    sold: '3.4k Sold'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=90&w=600',
    title: 'Jamdani Saree',
    tag: 'Artisan',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳1,294',
    originalPrice: '৳1,800',
    sold: '2.1k Sold'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=600',
    title: 'Leather Wallet',
    tag: 'Local Brand',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳3,137',
    originalPrice: '৳4,500',
    sold: '430 Sold'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=600',
    title: 'Red Sneakers',
    tag: 'Any 3 @ ৳450',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳450',
    originalPrice: '৳899',
    sold: '5.5k Sold'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=90&w=600',
    title: 'Leather Tote',
    tag: 'Top Rated',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳1,899',
    originalPrice: '৳2,500',
    sold: '800 Sold'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=90&w=600',
    title: 'Formal Shoes',
    tag: 'Trending',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳2,150',
    originalPrice: '৳3,000',
    sold: '1.4k Sold'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=600',
    title: 'Luxury Purse',
    tag: 'Limited Stock',
    tagBg: '#111',
    tagColor: '#fff',
    price: '৳999',
    originalPrice: '৳1,400',
    sold: '2.5k Sold'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1599643477877-530e556bb162?auto=format&fit=crop&q=90&w=600',
    title: 'Elegant Necklace',
    tag: 'Gift Idea',
    tagBg: 'var(--brand-pink)',
    tagColor: '#fff',
    price: '৳3,450',
    originalPrice: '৳5,000',
    sold: '350 Sold'
  }
];

const DealHighlights = () => {
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <i className="las la-shopping-basket" style={{ color: 'var(--brand-pink)', fontSize: '24px' }}></i>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#111', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Bangladesh Market</span>
              </div>
            </div>
            <div style={{ paddingLeft: '28px', fontSize: '10px', color: 'rgba(17, 17, 17, 0.4)', marginTop: '2px', fontWeight: 600 }}>
              Standard: 1-3 Days • Express (Dhaka): 24h
            </div>
          </div>

          <div style={{ color: 'var(--brand-pink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            View All <i className="las la-angle-right" style={{ fontSize: '14px' }}></i>
          </div>
        </div>

        {/* Product Row */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px' }}>
          {comboDealProducts.map((product) => (
            <div key={product.id} style={{ minWidth: '110px', width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              
              {/* Image Box */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', marginBottom: '8px' }}>
                <img src={product.image} alt="Combo Deal Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Custom Tag Badge */}
                <div style={{ position: 'absolute', top: '0', left: '0', background: product.tagBg, color: product.tagColor, fontSize: '10px', fontWeight: 900, padding: '3px 6px', borderBottomRightRadius: '8px' }}>
                  {product.tag}
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
  );
};

export default DealHighlights;
