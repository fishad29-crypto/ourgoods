import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentlyViewedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f5f5f5', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 10 }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}></i>
        <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Recently Viewed</h2>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
          <i className="las la-history" style={{ fontSize: '60px', color: '#ccc', marginBottom: '15px' }}></i>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>No recent history</h3>
          <p style={{ fontSize: '14px', maxWidth: '250px', margin: '0 auto' }}>You haven't viewed any products recently. Start browsing to see them here.</p>
          <button 
            onClick={() => navigate('/')}
            style={{ marginTop: '20px', background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedPage;
