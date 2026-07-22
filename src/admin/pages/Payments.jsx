import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Search, Download, Filter, CheckCircle2, Clock, XCircle } from 'lucide-react';
import '../admin.css';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', orderId: '#ORD-1002', customer: 'Rahim Uddin', date: '2026-07-14 10:30 AM', amount: 4500, method: 'bKash', status: 'Completed', type: 'Credit' },
  { id: 'TXN-002', orderId: '#ORD-1003', customer: 'Karim Hasan', date: '2026-07-14 11:15 AM', amount: 1200, method: 'COD', status: 'Pending', type: 'Credit' },
  { id: 'TXN-003', orderId: '#ORD-0998', customer: 'Sadia Islam', date: '2026-07-13 04:20 PM', amount: 350, method: 'Nagad', status: 'Refunded', type: 'Debit' },
  { id: 'TXN-004', orderId: '#ORD-1005', customer: 'Tanvir Ahmed', date: '2026-07-13 02:10 PM', amount: 8900, method: 'Card', status: 'Completed', type: 'Credit' },
  { id: 'TXN-005', orderId: '#ORD-1006', customer: 'Nusrat Jahan', date: '2026-07-12 09:45 AM', amount: 2100, method: 'bKash', status: 'Failed', type: 'Credit' },
];

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTxns = MOCK_TRANSACTIONS.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Payments & Settlements</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage transactions, refunds, and vendor settlements.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Download size={16} /> Export Statement
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--brand-pink)', padding: '20px', borderRadius: '12px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9 }}>Available Balance</span>
            <Wallet size={20} style={{ opacity: 0.8 }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>৳84,500</div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button style={{ padding: '6px 12px', background: '#fff', color: 'var(--brand-pink)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Withdraw Funds</button>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Processed (30d)</span>
            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} /> +12.5%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>৳342,800</div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Across 1,245 transactions</span>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Pending Settlements</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>৳12,450</div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Waiting to be cleared (1-2 days)</span>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Refunds & Disputes</span>
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={14} /> -1.2%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>৳4,200</div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>12 active refund requests</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Recent Transactions</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="search-bar" style={{ width: '250px', margin: 0 }}>
              <Search size={18} className="search-icon" style={{ left: '12px' }} />
              <input 
                type="text" 
                placeholder="Search Txn ID, Order..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Transaction ID</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Order & Customer</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Method</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((txn) => (
                <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{txn.id}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#3b82f6' }}>{txn.orderId}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{txn.customer}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b' }}>{txn.date}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CreditCard size={12} /> {txn.method}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: txn.type === 'Credit' ? '#10b981' : '#ef4444' }}>
                    {txn.type === 'Credit' ? '+' : '-'}৳{txn.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {txn.status === 'Completed' && <CheckCircle2 size={16} color="#10b981" />}
                      {txn.status === 'Pending' && <Clock size={16} color="#f59e0b" />}
                      {txn.status === 'Refunded' && <ArrowDownRight size={16} color="#64748b" />}
                      {txn.status === 'Failed' && <XCircle size={16} color="#ef4444" />}
                      <span style={{ fontSize: '13px', fontWeight: 500, color: txn.status === 'Completed' ? '#10b981' : txn.status === 'Pending' ? '#f59e0b' : txn.status === 'Failed' ? '#ef4444' : '#64748b' }}>
                        {txn.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredTxns.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No transactions found matching "{searchTerm}"
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

export default Payments;