import React, { useState } from 'react';
import { ordersData } from '../mockData';
import { Search, Filter, Eye, Edit, Trash2, Printer, Download, ShoppingBag, CheckCircle, Clock, Truck } from 'lucide-react';
import '../admin.css';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Orders Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>View and manage all customer orders.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Orders</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{ordersData.length}</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Pending</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{ordersData.filter(o => o.orderStatus === 'Pending').length}</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Processing/Shipped</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{ordersData.filter(o => ['Processing', 'Shipped', 'Packed', 'Out for Delivery'].includes(o.orderStatus)).length}</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Delivered</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{ordersData.filter(o => o.orderStatus === 'Delivered').length}</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '300px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#475569', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Order Info</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Payment</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{order.orderId}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{order.date}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{order.customerName}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>৳ {order.totalAmount}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#334155' }}>{order.paymentMethod}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: order.paymentStatus === 'Paid' ? '#16a34a' : '#d97706' }}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                        background: ['Delivered', 'Completed'].includes(order.orderStatus) ? '#dcfce7' : ['Cancelled', 'Returned'].includes(order.orderStatus) ? '#fee2e2' : order.orderStatus === 'Pending' ? '#fef3c7' : '#e0f2fe',
                        color: ['Delivered', 'Completed'].includes(order.orderStatus) ? '#16a34a' : ['Cancelled', 'Returned'].includes(order.orderStatus) ? '#ef4444' : order.orderStatus === 'Pending' ? '#d97706' : '#0284c7'
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="View">
                          <Eye size={18} />
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Edit">
                          <Edit size={18} />
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Print Invoice">
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Showing {filteredOrders.length} of {ordersData.length} entries</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Previous</button>
            <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;