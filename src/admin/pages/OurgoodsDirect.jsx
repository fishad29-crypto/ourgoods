import React, { useState } from 'react';
import { Globe, PlaneTakeoff, Ship, Search, Filter, MessageSquare, ArrowRight, FileCheck, Anchor, Clock } from 'lucide-react';
import '../admin.css';

const MOCK_REQUESTS = [
  { id: 'SRC-2004', customer: 'Faisal Mahmud', item: 'Custom Industrial Machinery Parts', qty: '500 pcs', origin: 'Shenzhen, China', status: 'Quote Sent', date: '2026-07-14' },
  { id: 'SRC-2003', customer: 'Tanvir Ahmed', item: 'Bulk Unbranded Smart Watches', qty: '1000 pcs', origin: 'Guangzhou, China', status: 'Sourced', date: '2026-07-12' },
  { id: 'SRC-2002', customer: 'Rahim Uddin', item: 'Premium Silk Fabric Rolls', qty: '50 Rolls', origin: 'Hangzhou, China', status: 'Pending Review', date: '2026-07-10' },
  { id: 'SRC-2001', customer: 'Sadia Islam', item: 'Cosmetics Packaging Bottles', qty: '10,000 pcs', origin: 'Global', status: 'Rejected', date: '2026-07-05' },
];

const OurgoodsDirect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRequests = MOCK_REQUESTS.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">OURGOODS Direct Sourcing</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage custom sourcing requests from China and Global markets.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Globe size={16} /> Global Vendors
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Requests</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>342</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Pending Review</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>15</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlaneTakeoff size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Air Cargo Active</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>8</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ship size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Sea Cargo Active</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>12</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search request ID, customer, item..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter Status
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Request ID & Customer</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Item & Quantity</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Sourcing Origin</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{req.id}</div>
                    <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>{req.customer}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{req.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{req.item}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', display: 'inline-block', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{req.qty}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={14} color="#64748b" /> {req.origin}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: req.status === 'Quote Sent' ? '#e0e7ff' : req.status === 'Sourced' ? '#dcfce7' : req.status === 'Pending Review' ? '#fef3c7' : '#fee2e2',
                      color: req.status === 'Quote Sent' ? '#4f46e5' : req.status === 'Sourced' ? '#16a34a' : req.status === 'Pending Review' ? '#d97706' : '#ef4444'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ padding: '6px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      View Details <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No sourcing requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OurgoodsDirect;