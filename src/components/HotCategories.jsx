import React from 'react';

const categories = [
  { id: 1, name: 'Women Cloth...', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=90&w=600' },
  { id: 2, name: 'Crop-Top', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=90&w=600' },
  { id: 3, name: 'Purse & Bags', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=600' },
  { id: 4, name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=90&w=600' },
  { id: 5, name: 'Beauty & Hea...', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=600' },
  { id: 6, name: 'Sunscreen', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=90&w=600' },
  { id: 7, name: 'Polo T-Shirt', image: 'https://images.unsplash.com/photo-1622445272461-c6580cab8755?auto=format&fit=crop&q=90&w=600' },
  { id: 8, name: 'Men Fashion', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=90&w=600' },
  { id: 9, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=600' },
  { id: 10, name: 'Watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=90&w=600' },
  { id: 11, name: 'Kids Wear', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=90&w=600' },
  { id: 12, name: 'Gadgets', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=90&w=600' }
];

const HotCategories = () => {
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ 
          padding: '12px 15px', 
          borderBottom: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <i className="las la-fire" style={{ color: 'var(--brand-pink)', fontSize: '18px' }}></i>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111', margin: 0 }}>
            Hot Categories
          </h2>
        </div>

        {/* 1-row horizontal scroll layout */}
        <div className="no-scrollbar" style={{ 
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '15px',
        }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              flexShrink: 0,
              width: '70px', 
              cursor: 'pointer' 
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f8f8f8',
                overflow: 'hidden',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #f0f0f0'
              }}>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }} 
                />
              </div>
              <span style={{ 
                fontSize: '11px', 
                color: '#444', 
                textAlign: 'center', 
                fontWeight: 600, 
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%'
              }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default HotCategories;
