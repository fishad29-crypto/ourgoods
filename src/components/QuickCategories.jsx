import React from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { 
    id: 1, 
    name: "Flash Sale", 
    renderIcon: () => (
      <div style={{ background: 'var(--brand-pink)', color: '#fff', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 900, lineHeight: 1.1 }}>
        <div style={{ fontSize: '11px' }}>LIMITED</div>
        <div style={{ fontSize: '11px' }}>TIME</div>
        <div style={{ width: '22px', height: '4px', background: '#fff', borderRadius: '2px', marginTop: '4px', opacity: 0.9 }}></div>
      </div>
    )
  },
  { 
    id: 3, 
    name: "Cash Deals", 
    renderIcon: () => (
      <div style={{ background: 'var(--brand-pink)', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', color: 'var(--brand-pink)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>৳</div>
      </div>
    )
  },
  { 
    id: 4, 
    name: "Store", 
    renderIcon: () => (
      <div style={{ background: '#fff', border: '1.5px solid var(--brand-pink)', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-pink)', fontWeight: 900, lineHeight: 1.1 }}>
        <div style={{ fontSize: '14px' }}>0.99<span style={{fontSize: '10px'}}>৳</span></div>
        <div style={{ fontSize: '11px' }}>Store</div>
      </div>
    )
  },
  { 
    id: 5, 
    name: "9 Tk Deals", 
    renderIcon: () => (
      <div style={{ background: 'var(--brand-pink)', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative' }}>
        <i className="las la-map-marker" style={{ fontSize: '34px' }}></i>
        <span style={{ position: 'absolute', fontSize: '13px', fontWeight: 'bold', top: '10px' }}>9</span>
      </div>
    )
  },
  { 
    id: 6, 
    name: "Combo & Choice", 
    renderIcon: () => (
      <div style={{ background: '#7b41d9', color: '#fff', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="las la-box" style={{ fontSize: '32px' }}></i>
      </div>
    )
  },
  { 
    id: 7, 
    name: "More", 
    renderIcon: () => (
      <div style={{ background: '#ff8c00', color: '#fff', borderRadius: '18px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="las la-th-large" style={{ fontSize: '32px' }}></i>
      </div>
    )
  }
];

const QuickCategories = () => {
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '15px',
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '15px', 
        alignItems: 'center'
      }}>
        
        {/* Full width icons since banner is gone */}
        <div className="no-scrollbar" style={{ flex: '1 1 100%', minWidth: 0, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '20px', minWidth: 'max-content', width: 'fit-content', margin: '0 auto', alignItems: 'center', height: '100%' }}>
            {quickLinks.map(link => (
              <div key={link.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px', cursor: 'pointer' }}>
                <div style={{ marginBottom: '8px' }}>
                  {link.renderIcon()}
                </div>
                <span style={{ fontSize: '12px', color: '#333', textAlign: 'center', fontWeight: 600, lineHeight: 1.2 }}>{link.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickCategories;
