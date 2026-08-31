import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpCenterPage = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: "How do I track my order?", a: "You can track your order in the 'My Orders' section of your profile." },
    { q: "What is your return policy?", a: "We offer a 7-day easy return policy for defective or incorrect items." },
    { q: "How can I contact support?", a: "You can reach us at support@ourgoods.com.bd or call our hotline." }
  ];

  return (
    <div style={{ background: '#f5f5f5', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 10 }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}></i>
        <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Help Center</h2>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ background: 'var(--brand-pink)', borderRadius: '12px', padding: '25px', color: '#fff', textAlign: 'center', marginBottom: '25px' }}>
          <i className="las la-headset" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
          <h3 style={{ fontSize: '20px', margin: '0 0 10px 0', fontWeight: 700 }}>How can we help?</h3>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search for help..." style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: 'none', outline: 'none', color: '#333' }} />
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', color: '#333' }}>Frequently Asked Questions</h3>
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ padding: '15px', borderBottom: index < faqs.length - 1 ? '1px solid #eaeaea' : 'none' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '5px' }}>{faq.q}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>{faq.a}</div>
            </div>
          ))}
        </div>
        
        <button style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '25px', cursor: 'pointer' }}>
          Contact Customer Service
        </button>
      </div>
    </div>
  );
};

export default HelpCenterPage;
