import React, { useState } from 'react';
import { Megaphone, Ticket, Zap, Mail, Plus, Search, Filter, MoreVertical, TrendingUp, Users } from 'lucide-react';
import '../admin.css';

const MOCK_CAMPAIGNS = [
  { id: 'CMP-001', name: 'Summer Clearance Sale', type: 'Flash Sale', status: 'Active', reach: '45.2K', conversions: 892, revenue: 1450000, date: 'Jul 15 - Jul 20' },
  { id: 'CMP-002', name: 'Eid Special Promo', type: 'Discount Code', status: 'Scheduled', reach: '-', conversions: '-', revenue: '-', date: 'Aug 01 - Aug 10' },
  { id: 'CMP-003', name: 'Welcome Email Flow', type: 'Email Campaign', status: 'Active', reach: '12.5K', conversions: 342, revenue: 420000, date: 'Ongoing' },
  { id: 'CMP-004', name: 'Winter Collection Launch', type: 'Banner Ad', status: 'Completed', reach: '89.4K', conversions: 1205, revenue: 2100000, date: 'Nov 01 - Nov 30 (Last Year)' },
];

const Marketing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCampaigns = MOCK_CAMPAIGNS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Marketing & Campaigns</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Create and manage promotional campaigns, discounts, and flash sales.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Ticket size={16} /> Create Discount
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fce7f3', color: 'var(--brand-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Active Campaigns</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>4</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Reach (30d)</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>142.5K</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Campaign Revenue</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>৳1.8M</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Campaign Name</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Type & Duration</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Reach</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Conversions</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Revenue</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{camp.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{camp.id}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {camp.type === 'Flash Sale' && <Zap size={14} color="#f59e0b" />}
                      {camp.type === 'Discount Code' && <Ticket size={14} color="#3b82f6" />}
                      {camp.type === 'Email Campaign' && <Mail size={14} color="#10b981" />}
                      {camp.type === 'Banner Ad' && <Megaphone size={14} color="#8b5cf6" />}
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                        {camp.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{camp.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                    {camp.reach}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                    {camp.conversions}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: camp.revenue !== '-' ? '#10b981' : '#64748b' }}>
                    {camp.revenue !== '-' ? `৳${camp.revenue.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: camp.status === 'Active' ? '#dcfce7' : camp.status === 'Scheduled' ? '#e0e7ff' : '#f1f5f9',
                      color: camp.status === 'Active' ? '#16a34a' : camp.status === 'Scheduled' ? '#4f46e5' : '#64748b'
                    }}>
                      {camp.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No campaigns found matching "{searchTerm}"
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

export default Marketing;