import React from 'react';

const megaDealsData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=300',
    price: '৳1,250',
    oldPrice: '৳2,499',
    discount: '-50%'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300',
    price: '৳420',
    oldPrice: '৳899',
    discount: '-53%'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=300',
    price: '৳950',
    oldPrice: '৳1,999',
    discount: '-52%'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300',
    price: '৳680',
    oldPrice: '৳1,299',
    discount: '-47%'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=300',
    price: '৳380',
    oldPrice: '৳799',
    discount: '-52%'
  }
];

const MegaDeals = () => {
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
        
        {/* Title Card */}
        <div style={{
          minWidth: '100px',
          background: 'linear-gradient(to bottom, #fff, #FFDFEB)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          boxShadow: '0 2px 5px rgba(255, 0, 85, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background sparkles */}
          <div style={{ position: 'absolute', right: '10px', top: '15px', color: '#FFB3C6', fontSize: '12px' }}>✨</div>
          <div style={{ position: 'absolute', left: '10px', bottom: '25px', color: '#FFB3C6', fontSize: '10px' }}>✨</div>
          
          <h3 style={{ 
            color: 'var(--brand-pink)', 
            fontSize: '22px', 
            fontWeight: 900, 
            fontStyle: 'italic', 
            lineHeight: 1.1, 
            textAlign: 'center',
            margin: 0
          }}>
            Mega<br/>Deals
          </h3>
        </div>

        {/* Product Cards */}
        {megaDealsData.map(product => (
          <div key={product.id} style={{
            minWidth: '110px',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #FFEBF3',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            cursor: 'pointer'
          }}>
            <div style={{ width: '100%', height: '100px', background: '#F9F9F9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={product.image} alt="Mega Deal" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            
            <div style={{ padding: '8px 5px', display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ color: 'var(--brand-pink)', fontWeight: 900, fontSize: '12px' }}>{product.price}</span>
              <span style={{ color: '#999', fontWeight: 500, fontSize: '9px', textDecoration: 'line-through' }}>{product.oldPrice}</span>
              <span style={{ color: 'var(--brand-pink)', fontWeight: 800, fontSize: '9px' }}>{product.discount}</span>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default MegaDeals;
