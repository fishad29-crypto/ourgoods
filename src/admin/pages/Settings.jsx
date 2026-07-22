import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, CreditCard, Truck, Bell, Link as LinkIcon, ShieldCheck, Database, Layout } from 'lucide-react';
import '../admin.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', icon: <Store size={18} /> },
    { id: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'Shipping & Taxes', icon: <Truck size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Social Links', icon: <LinkIcon size={18} /> },
    { id: 'Security', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Store Settings</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Configure your store, payments, shipping, and core preferences.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 600 }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        
        {/* Settings Navigation Sidebar */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
            Settings Menu
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '12px' }}>
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', background: activeTab === tab.id ? '#fce7f3' : 'transparent', color: activeTab === tab.id ? 'var(--brand-pink)' : '#475569', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: activeTab === tab.id ? 600 : 500, transition: 'all 0.2s'
                }}
              >
                {tab.icon} {tab.id}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
          
          {activeTab === 'General' && (
            <div>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>General Information</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Store Name</label>
                    <input type="text" defaultValue="OURGOODS" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Contact Email</label>
                    <input type="email" defaultValue="support@ourgoods.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Phone Number</label>
                    <input type="text" defaultValue="+880 1711-000000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Support WhatsApp</label>
                    <input type="text" defaultValue="+880 1711-000000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Store Description (SEO)</label>
                  <textarea rows="4" defaultValue="Premium e-commerce store offering top quality gadgets, clothing, and accessories." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', resize: 'vertical' }}></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Store Address (Shown on invoices)</label>
                  <textarea rows="3" defaultValue="Dhaka, Bangladesh" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', resize: 'vertical' }}></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Payments' && (
            <div>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Payment Gateways</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e2136e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>bK</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>bKash Payment Gateway</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Accept automated bKash payments</div>
                    </div>
                  </div>
                  <button style={{ padding: '6px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Manage</button>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#ed1c24', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>N</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Nagad Payment Gateway</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Accept automated Nagad payments</div>
                    </div>
                  </div>
                  <button style={{ padding: '6px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Manage</button>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Standard COD with optional advance</div>
                    </div>
                  </div>
                  <button style={{ padding: '6px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Manage</button>
                </div>
              </div>
            </div>
          )}
          
          {(activeTab !== 'General' && activeTab !== 'Payments') && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <SettingsIcon size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>{activeTab} Settings</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Configuration options for {activeTab.toLowerCase()} will appear here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;