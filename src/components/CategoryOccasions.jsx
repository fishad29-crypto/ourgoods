import React from 'react';

const categoryOccasions = {
  'Women': [
    { name: 'Everyday', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200' },
    { name: 'Work', img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=200' },
    { name: 'Vacation', img: 'https://images.unsplash.com/photo-1523359276341-3836173004bb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Party', img: 'https://images.unsplash.com/photo-1568252542512-9fe8df9c64fa?auto=format&fit=crop&q=80&w=200' },
    { name: 'Date', img: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=200' },
    { name: 'Street', img: 'https://images.unsplash.com/photo-1550614000-4b95d4669830?auto=format&fit=crop&q=80&w=200' },
    { name: 'Boutiques', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200' },
    { name: 'Modest', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ageless', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Wedding', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b277?auto=format&fit=crop&q=80&w=200' },
    { name: 'Maternity', img: 'https://images.unsplash.com/photo-1515234839739-c184c8e7cb41?auto=format&fit=crop&q=80&w=200' }
  ],
  'Jewelry & Accessories': [
    { name: 'Bridal', img: 'https://images.unsplash.com/photo-1599643478514-4a11011c77f0?auto=format&fit=crop&q=80&w=200' },
    { name: 'Everyday', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200' },
    { name: 'Party', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200' },
    { name: 'Gift', img: 'https://images.unsplash.com/photo-1574738520281-229bb1f6c4be?auto=format&fit=crop&q=80&w=200' }
  ],
  'Purse & Bags': [
    { name: 'Work', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=200' },
    { name: 'Travel', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200' },
    { name: 'Evening', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Casual', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200' }
  ],
  'Sneakers & Shoes': [
    { name: 'Running', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' },
    { name: 'Casual', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=200' },
    { name: 'Formal', img: 'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sports', img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=200' }
  ],
  'Beauty & Health': [
    { name: 'Skincare', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200' },
    { name: 'Makeup', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=200' },
    { name: 'Haircare', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=200' },
    { name: 'Wellness', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200' }
  ],
  'Home & Decor': [
    { name: 'Living Room', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=200' },
    { name: 'Bedroom', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=200' },
    { name: 'Kitchen', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Bathroom', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' },
    { name: 'Outdoor', img: 'https://images.unsplash.com/photo-1499803270242-467f73115822?auto=format&fit=crop&q=80&w=200' }
  ]
};

const CategoryOccasions = ({ category }) => {
  const occasions = categoryOccasions[category] || categoryOccasions['Women'];

  return (
    <div style={{ padding: '0 15px', marginBottom: '10px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        padding: '15px 0'
      }}>
        <div 
          className="no-scrollbar"
          style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            padding: '0 15px',
            scrollSnapType: 'x mandatory' 
          }}
        >
        {occasions.map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              minWidth: '95px', 
              display: 'flex', 
              flexDirection: 'column', 
              cursor: 'pointer',
              scrollSnapAlign: 'start',
              border: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ width: '100%', height: '125px', backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}></div>
            <div style={{ 
              backgroundColor: '#000', 
              color: '#fff', 
              padding: '6px 4px', 
              textAlign: 'center', 
              fontSize: '11px', 
              fontWeight: '700',
              fontFamily: 'Inter, sans-serif'
            }}>
              {item.name}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryOccasions;
