import React from 'react';

const CreditRewardBanner = () => {
  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff2f6', // Light pink background
        border: '1px solid #ffdeea', // Subtle pink border
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Left Side: Ticket Graphic */}
        <div style={{
          background: 'linear-gradient(135deg, #ff5b8e 0%, #e82c66 100%)', // Pink gradient
          borderRadius: '6px',
          width: '120px',
          height: '76px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(232, 44, 102, 0.2)'
        }}>
          {/* Ticket cutouts */}
          <div style={{ position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', background: '#fff2f6', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', background: '#fff2f6', borderRadius: '50%' }}></div>
          
          {/* Top and Bottom notch hints (optional, for more realistic ticket look) */}
          <div style={{ position: 'absolute', top: '-4px', left: '15%', width: '8px', height: '8px', background: '#fff2f6', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: '#fff2f6', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: '-4px', right: '15%', width: '8px', height: '8px', background: '#fff2f6', borderRadius: '50%' }}></div>
          
          <div style={{ position: 'absolute', bottom: '-4px', left: '15%', width: '8px', height: '8px', background: '#fff2f6', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: '#fff2f6', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-4px', right: '15%', width: '8px', height: '8px', background: '#fff2f6', borderRadius: '50%' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <span style={{ fontSize: '22px', fontWeight: '700', marginRight: '2px' }}>৳</span>
            <span style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1, letterSpacing: '-1px' }}>200</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', marginTop: '2px' }}>CREDIT</span>
        </div>

        {/* Vertical Separator Line */}
        <div style={{
          height: '60px',
          width: '1px',
          background: '#ffcce0',
          marginLeft: '12px',
          marginRight: '12px'
        }}></div>

        {/* Center: Text Content */}
        <div style={{ flex: 1, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#ff4d85', fontSize: '11px', fontWeight: 800, marginBottom: '2px' }}>New User Only</div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#111', lineHeight: 1.1 }}>OURGOODS CREDIT REWARD</div>
          <div style={{ fontSize: '9px', color: '#777', margin: '3px 0 8px 0' }}>*Condition applies</div>
          <button style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 16px',
            fontSize: '10px',
            fontWeight: 800,
            width: 'fit-content',
            cursor: 'pointer'
          }}>
            JOIN NOW
          </button>
        </div>

        {/* Right Background Graphic (3D Gift Box Placeholder) */}
        <div style={{
          position: 'absolute',
          right: '5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '90px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
           {/* Using emojis to simulate the 3D gift and coins since asset is unavailable */}
           <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <span style={{ position: 'absolute', fontSize: '50px', top: '15px', right: '15px', textShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>🎁</span>
              <span style={{ position: 'absolute', fontSize: '16px', top: '10px', left: '20px', transform: 'rotate(-20deg)' }}>🪙</span>
              <span style={{ position: 'absolute', fontSize: '12px', bottom: '20px', left: '10px', transform: 'rotate(15deg)' }}>🪙</span>
              <span style={{ position: 'absolute', fontSize: '18px', top: '5px', right: '5px', transform: 'rotate(30deg)' }}>🪙</span>
              <span style={{ position: 'absolute', fontSize: '14px', bottom: '15px', right: '5px', transform: 'rotate(-10deg)' }}>🪙</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CreditRewardBanner;
