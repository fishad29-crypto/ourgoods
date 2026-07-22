import React from 'react';
import { Layout, Image as ImageIcon, Link, FileText, Settings, Type, AlignLeft, MousePointerClick, ToggleRight } from 'lucide-react';
import '../admin.css';

const WebsiteCMS = () => {
  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Website CMS</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage storefront appearance, pages, banners, and navigation.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Link size={16} /> View Live Store
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
        {/* Left Sidebar Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 16px', background: 'var(--brand-pink)', color: '#fff', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <Layout size={18} /> Homepage Layout
          </div>
          <div style={{ padding: '12px 16px', background: '#fff', color: '#475569', borderRadius: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
            <ImageIcon size={18} /> Banners & Sliders
          </div>
          <div style={{ padding: '12px 16px', background: '#fff', color: '#475569', borderRadius: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
            <FileText size={18} /> Custom Pages
          </div>
          <div style={{ padding: '12px 16px', background: '#fff', color: '#475569', borderRadius: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
            <Link size={18} /> Navigation Menus
          </div>
          <div style={{ padding: '12px 16px', background: '#fff', color: '#475569', borderRadius: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
            <Settings size={18} /> Theme Settings
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Homepage Layout Configuration</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Section Builder Block */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ImageIcon size={20} color="#64748b" />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Hero Slider</span>
                </div>
                <ToggleRight size={24} color="#10b981" />
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>
                Currently displaying 3 slides. 
                <div style={{ marginTop: '8px' }}>
                  <button style={{ padding: '6px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Edit Slides</button>
                </div>
              </div>
            </div>

            {/* Section Builder Block */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlignLeft size={20} color="#64748b" />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Featured Categories Grid</span>
                </div>
                <ToggleRight size={24} color="#10b981" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', border: '1px dashed #cbd5e1' }}>Electronics</div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', border: '1px dashed #cbd5e1' }}>Clothing</div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', border: '1px dashed #cbd5e1' }}>Home</div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', border: '1px dashed #cbd5e1', color: 'var(--brand-pink)' }}>+ Add Grid</div>
              </div>
            </div>

            {/* Section Builder Block */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MousePointerClick size={20} color="#64748b" />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Trending Products Slider</span>
                </div>
                <ToggleRight size={24} color="#10b981" />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Section Title</label>
                  <input type="text" defaultValue="Trending Now" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Data Source</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <option>Most Sold (30 Days)</option>
                    <option>Manual Selection</option>
                    <option>New Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            <button style={{ width: '100%', padding: '16px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={20} /> Add New Section
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCMS;