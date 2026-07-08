import React from 'react';

const CreditRewardBanner = () => {
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: 'linear-gradient(90deg, #ff5b8e 0%, #e82c66 100%)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(232, 44, 102, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>🎁</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.5px' }}>NEW USER: ৳200 CREDIT REWARD</div>
            <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>Register now to claim your welcome gift!</div>
          </div>
        </div>
        <button style={{
          background: '#fff',
          color: '#e82c66',
          border: 'none',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '11px',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          CLAIM
        </button>
      </div>
    </div>
  );
};

export default CreditRewardBanner;
