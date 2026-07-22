import React, { useState } from 'react';
import { Package, Clock, Truck, CheckCircle2, Search, Filter, MoreVertical, Bell, Mail, Download, AlertTriangle } from 'lucide-react';
import '../admin.css';

const MOCK_PREORDERS = [
  { id: 'PRE-001', orderId: '#ORD-1045', customer: 'Faisal Mahmud', product: 'PS5 Pro Console', price: 65000, advance: 10000, orderDate: '2026-07-01', expectedDate: '2026-08-15', status: 'Awaiting Stock' },
  { id: 'PRE-002', orderId: '#ORD-1046', customer: 'Sadia Islam', product: 'Iphone 16 Pro Max', price: 145000, advance: 50000, orderDate: '2026-07-05', expectedDate: '2026-09-20', status: 'Awaiting Stock' },
  { id: 'PRE-003', orderId: '#ORD-1020', customer: 'Tanvir Ahmed', product: 'Sony Alpha A7 IV', price: 210000, advance: 210000, orderDate: '2026-06-15', expectedDate: '2026-07-16', status: 'Ready to Ship' },
  { id: 'PRE-004', orderId: '#ORD-1011', customer: 'Rahim Uddin', product: 'Samsung Galaxy S24 Ultra', price: 135000, advance: 20000, orderDate: '2026-06-10', expectedDate: '2026-07-12', status: 'Shipped' },
  { id: 'PRE-005', orderId: '#ORD-1055', customer: 'Karim Hasan', product: 'DJI Mini 4 Pro', price: 85000, advance: 15000, orderDate: '2026-07-10', expectedDate: '2026-08-01', status: 'Delayed' },
];

const PreOrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = MOCK_PREORDERS.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Pre-Order Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track global sourcing, estimated arrivals, and advance payments.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Download size={16} /> Export List
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Bell size={16} /> Notify Customers
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Active Pre-Orders</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>45</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Awaiting Stock</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>32</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Ready to Ship</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>13</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fce7f3', color: 'var(--brand-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>৳</span>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Deposits Holding</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>৳4.2M</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search pre-order ID, customer, product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter by Status
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Pre-Order ID & Order</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Product & Customer</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Timeline</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Financials</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const dueAmount = order.price - order.advance;
                const progressPercent = (order.advance / order.price) * 100;
                
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{order.id}</div>
                      <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '4px', fontWeight: 500 }}>{order.orderId}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{order.product}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>By: {order.customer}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Ordered: {order.orderDate}</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                         ETA: {order.expectedDate}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Total: ৳{order.price.toLocaleString()}</div>
                      <div style={{ marginTop: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                          <span>Paid: ৳{order.advance.toLocaleString()}</span>
                          <span style={{ color: dueAmount > 0 ? '#ef4444' : '#10b981' }}>Due: ৳{dueAmount.toLocaleString()}</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
                          <div style={{ height: '100%', background: dueAmount === 0 ? '#10b981' : 'var(--brand-pink)', borderRadius: '2px', width: `${progressPercent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {order.status === 'Awaiting Stock' && <Clock size={16} color="#f59e0b" />}
                        {order.status === 'Ready to Ship' && <CheckCircle2 size={16} color="#10b981" />}
                        {order.status === 'Shipped' && <Truck size={16} color="#3b82f6" />}
                        {order.status === 'Delayed' && <AlertTriangle size={16} color="#ef4444" />}
                        <span style={{ 
                          fontSize: '13px', fontWeight: 600, 
                          color: order.status === 'Awaiting Stock' ? '#f59e0b' : 
                                 order.status === 'Ready to Ship' ? '#10b981' : 
                                 order.status === 'Shipped' ? '#3b82f6' : '#ef4444' 
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', color: '#475569', cursor: 'pointer' }} title="Email Customer">
                          <Mail size={16} />
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No pre-orders found matching "{searchTerm}"
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

export default PreOrderManagement;