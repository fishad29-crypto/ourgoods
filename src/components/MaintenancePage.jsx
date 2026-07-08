import React from 'react';
import { ShoppingBag, Wrench } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#fdfdfd',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 99999,
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '40px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        border: '1px solid #f0f0f0'
      }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <ShoppingBag size={36} color="#E43292" />
          <h1 style={{ color: '#000', fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
            OUR<span style={{ color: '#E43292' }}>GOODS</span>
          </h1>
        </div>
        
        <div style={{ height: '2px', width: '40px', backgroundColor: '#E43292', borderRadius: '2px', marginBottom: '40px' }}></div>
        
        {/* Maintenance Icon & Message */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: '#fff0f6', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '24px',
          color: '#E43292'
        }}>
          <Wrench size={40} />
        </div>
        
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
          We'll be right back
        </h2>
        
        <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', margin: '0 0 32px 0' }}>
          Our website is currently undergoing scheduled maintenance to improve your shopping experience. 
          Please check back shortly!
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eaeaea' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E43292', animation: 'pulse 2s infinite' }}></div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Expected downtime: ~30 minutes</span>
        </div>
        
        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.5; }
          }
        `}</style>

      </div>
    </div>
  );
};

export default MaintenancePage;
