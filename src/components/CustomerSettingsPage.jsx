import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f5f5f5', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 10 }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}></i>
        <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Settings</h2>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="las la-user-circle" style={{ fontSize: '22px', color: '#555' }}></i>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>Account Profile</span>
            </div>
            <i className="las la-angle-right" style={{ color: '#ccc' }}></i>
          </div>
          <div style={{ padding: '15px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="las la-lock" style={{ fontSize: '22px', color: '#555' }}></i>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>Privacy & Security</span>
            </div>
            <i className="las la-angle-right" style={{ color: '#ccc' }}></i>
          </div>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="las la-bell" style={{ fontSize: '22px', color: '#555' }}></i>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>Notification Preferences</span>
            </div>
            <i className="las la-angle-right" style={{ color: '#ccc' }}></i>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="las la-language" style={{ fontSize: '22px', color: '#555' }}></i>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>Language</span>
            </div>
            <span style={{ fontSize: '12px', color: '#888' }}>English <i className="las la-angle-right"></i></span>
          </div>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="las la-globe" style={{ fontSize: '22px', color: '#555' }}></i>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>Country / Region</span>
            </div>
            <span style={{ fontSize: '12px', color: '#888' }}>Bangladesh <i className="las la-angle-right"></i></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerSettingsPage;
