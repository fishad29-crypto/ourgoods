import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const NewUserPromoModal = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState('23:59:42');

  useEffect(() => {
    // Just a mock countdown effect
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const parts = prev.split(':');
        let h = parseInt(parts[0], 10);
        let m = parseInt(parts[1], 10);
        let s = parseInt(parts[2], 10);
        
        s--;
        if (s < 0) {
          s = 59;
          m--;
          if (m < 0) {
            m = 59;
            h--;
          }
        }
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const coupons = [
    { discount: '30%', minOrder: 'Orders $15+', cap: 'Capped at $23' },
    { discount: '25%', minOrder: 'Orders $75+', cap: 'Capped at $30' },
    { discount: '20%', minOrder: 'Orders $100+', cap: 'Capped at $40' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        background: 'linear-gradient(to bottom, #fff5eb 0%, #ffffff 20%)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 20px 20px',
        marginTop: '40px' // Space for the top decoration
      }}>
        
        {/* Top Decoration */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '70px',
          filter: 'drop-shadow(0px 4px 10px rgba(255, 165, 0, 0.5))',
          zIndex: 1
        }}>
          🎁
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{
          color: '#d35400',
          fontSize: '22px',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Arial, sans-serif',
          marginTop: '15px'
        }}>
          Use your new user deals NOW!
        </h2>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {coupons.map((c, i) => (
            <div key={i} style={{
              position: 'relative',
              display: 'flex',
              border: '1px solid #fbe6d3',
              borderRadius: '8px',
              backgroundColor: '#fffcf9',
              overflow: 'hidden'
            }}>
              {/* New User Tag */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '#ff4d4f',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderBottomRightRadius: '8px'
              }}>
                New User
              </div>

              {/* Left Side (Discount) */}
              <div style={{
                flex: '0 0 40%',
                borderRight: '1px dashed #fcd8b8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px 10px'
              }}>
                <div style={{ color: '#ff4d4f', fontWeight: 900, fontSize: '28px', lineHeight: 1, display: 'flex', alignItems: 'baseline' }}>
                  {c.discount.split('%')[0]}<span style={{ fontSize: '14px' }}>%OFF</span>
                </div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>{c.minOrder}</div>
              </div>

              {/* Right Side (Details) */}
              <div style={{
                flex: '1',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>
                  Sitewide Coupon
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>
                  {c.cap}
                </div>
                <div style={{ color: '#888', fontSize: '11px' }}>
                  Expires in {timeLeft}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#ffe3c8',
            color: '#a04000',
            fontWeight: 800,
            fontSize: '18px',
            border: 'none',
            borderRadius: '25px',
            padding: '15px',
            marginTop: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}
        >
          Got it
        </button>

      </div>
      
      <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} style={{
        color: '#ccc',
        textDecoration: 'underline',
        fontSize: '14px',
        marginTop: '20px',
        cursor: 'pointer'
      }}>
        View coupon details
      </a>
    </div>
  );
};

export default NewUserPromoModal;
