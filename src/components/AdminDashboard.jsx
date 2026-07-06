import React, { useState, useEffect } from 'react';
import { getAllProducts, updateProductChoiceStatus } from '../utils/MockData';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Choice Products');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const all = getAllProducts();
    setProducts(all);
    
    const choice = all.filter(p => p.isChoice);
    setStats({
      totalChoice: choice.length,
      salesToday: '৳ ' + (choice.length * 1500).toLocaleString(),
      salesMonth: '৳ ' + (choice.length * 45000).toLocaleString(),
      avgRating: (choice.reduce((acc, p) => acc + p.rating, 0) / (choice.length || 1)).toFixed(1),
      avgReturn: (choice.reduce((acc, p) => acc + p.returnRate, 0) / (choice.length || 1)).toFixed(1) + '%',
      avgDelivery: (choice.reduce((acc, p) => acc + p.shippingDays, 0) / (choice.length || 1)).toFixed(1) + ' days',
      conversionRate: '4.8%'
    });
  };

  const handleToggleChoice = (id, currentStatus) => {
    updateProductChoiceStatus(id, !currentStatus);
    loadData();
  };

  const filteredProducts = products.filter(p => {
    if (activeTab === 'Choice Products') return p.isChoice;
    if (activeTab === 'Eligible Products') return p.choiceScore >= 85 && !p.isChoice && !p.adminRemovedChoice;
    if (activeTab === 'Removed Products') return p.adminRemovedChoice;
    return true; // All
  });

  return (
    <div className="content-container" style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin Panel - Choice Management</h1>

      {/* Statistics */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'Total Choice', value: stats.totalChoice },
            { label: 'Sales Today', value: stats.salesToday },
            { label: 'Sales This Month', value: stats.salesMonth },
            { label: 'Avg Rating', value: stats.avgRating },
            { label: 'Avg Return Rate', value: stats.avgReturn },
            { label: 'Avg Delivery', value: stats.avgDelivery },
            { label: 'Conversion Rate', value: stats.conversionRate },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>{stat.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto' }} className="no-scrollbar">
        {['Choice Products', 'Eligible Products', 'Removed Products', 'All Products'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '20px',
            background: activeTab === tab ? '#111' : '#ddd',
            color: activeTab === tab ? '#fff' : '#333',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', textAlign: 'left', borderBottom: '2px solid #eaeaea' }}>
              <th style={{ padding: '12px 15px' }}>Product</th>
              <th style={{ padding: '12px 15px' }}>Vendor</th>
              <th style={{ padding: '12px 15px' }}>Score</th>
              <th style={{ padding: '12px 15px' }}>Rating</th>
              <th style={{ padding: '12px 15px' }}>Return Rate</th>
              <th style={{ padding: '12px 15px' }}>Status</th>
              <th style={{ padding: '12px 15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.slice(0, 100).map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                <td style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.title}
                  </div>
                </td>
                <td style={{ padding: '12px 15px' }}>{p.vendor}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={{ fontWeight: 700, color: p.choiceScore >= 85 ? '#00A651' : 'var(--brand-pink)' }}>{p.choiceScore}</span>
                </td>
                <td style={{ padding: '12px 15px' }}>{p.rating}</td>
                <td style={{ padding: '12px 15px' }}>{p.returnRate}%</td>
                <td style={{ padding: '12px 15px' }}>
                  {p.isChoice ? 
                    <span style={{ background: '#e6f4ea', color: '#1e8e3e', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Active Choice</span> : 
                    <span style={{ background: '#fce8e6', color: '#d93025', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Not Choice</span>
                  }
                </td>
                <td style={{ padding: '12px 15px' }}>
                  <button onClick={() => handleToggleChoice(p.id, p.isChoice)} style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: p.isChoice ? '#333' : '#FFD700',
                    color: p.isChoice ? '#fff' : '#000',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {p.isChoice ? 'Lock (Remove)' : 'Unlock (Approve)'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
        Showing top 100 results for performance
      </div>
    </div>
  );
};

export default AdminDashboard;
