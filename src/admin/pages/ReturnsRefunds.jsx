import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Search, Filter, MoreVertical, XCircle, ArrowRightLeft } from 'lucide-react';
import '../admin.css';

const MOCK_RETURNS = [
  { id: 'RET-1001', orderId: '#ORD-0892', customer: 'Faisal Mahmud', product: 'Wireless Noise-Cancelling Headphones', reason: 'Defective Item', date: '2026-07-14', status: 'Pending Approval', type: 'Refund' },
  { id: 'RET-1002', orderId: '#ORD-0915', customer: 'Sadia Islam', product: 'Premium Leather Jacket', reason: 'Wrong Size', date: '2026-07-13', status: 'Item Received', type: 'Exchange' },
  { id: 'RET-1003', orderId: '#ORD-0840', customer: 'Tanvir Ahmed', product: 'Minimalist Ceramic Vase', reason: 'Changed Mind', date: '2026-07-11', status: 'Refunded', type: 'Refund' },
  { id: 'RET-1004', orderId: '#ORD-0922', customer: 'Rahim Uddin', product: 'Organic Skincare Bundle', reason: 'Damaged in transit', date: '2026-07-10', status: 'Rejected', type: 'Refund' },
  { id: 'RET-1005', orderId: '#ORD-0955', customer: 'Karim Hasan', product: 'Smart Watch Series 7', reason: 'Not as described', date: '2026-07-14', status: 'Pending Approval', type: 'Refund' },
];

const ReturnsRefunds = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredReturns = MOCK_RETURNS.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Returns & Refunds</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage customer return requests and process refunds.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Pending Approval</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>12</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Items in Transit</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>8</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Refunded (This Month)</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>৳42,500</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Return Rate</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>2.4%</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search return ID, order, customer, product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Return ID & Order</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Customer & Product</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Reason</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((ret) => (
                <tr key={ret.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{ret.id}</div>
                    <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '4px', fontWeight: 500 }}>{ret.orderId}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{ret.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{ret.customer}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ret.product}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{ret.reason}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                    {ret.type}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {ret.status === 'Pending Approval' && <Clock size={16} color="#f59e0b" />}
                      {ret.status === 'Item Received' && <ArrowRightLeft size={16} color="#3b82f6" />}
                      {ret.status === 'Refunded' && <CheckCircle2 size={16} color="#10b981" />}
                      {ret.status === 'Rejected' && <XCircle size={16} color="#ef4444" />}
                      <span style={{ 
                        fontSize: '13px', fontWeight: 600, 
                        color: ret.status === 'Pending Approval' ? '#f59e0b' : 
                               ret.status === 'Item Received' ? '#3b82f6' : 
                               ret.status === 'Refunded' ? '#10b981' : '#ef4444' 
                      }}>
                        {ret.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {ret.status === 'Pending Approval' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '6px 12px', background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                        <button style={{ padding: '6px 12px', background: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                      </div>
                    ) : (
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No return requests found matching "{searchTerm}"
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

export default ReturnsRefunds;