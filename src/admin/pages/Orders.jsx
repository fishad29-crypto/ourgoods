import React, { useState } from 'react';
import { ordersData } from '../mockData';
import { Search, Filter, Eye, Edit, Trash2, Printer, Download } from 'lucide-react';

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
      <div className="page-header">
        <h2 className="page-title">Orders Management</h2>
        <button className="btn-primary">Export CSV</button>
      </div>

      <div className="table-container">
        {/* Filters Bar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '250px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Phone" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="header-search" 
            style={{ width: '200px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
          
          <button className="btn-outline"><Filter size={18} /> More Filters</button>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td style={{ fontWeight: 600 }}>৳ {order.totalAmount}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{order.paymentMethod}</span>
                      <span style={{ fontSize: '11px', color: order.paymentStatus === 'Paid' ? 'var(--status-success)' : 'var(--status-warning)' }}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${['Delivered', 'Completed'].includes(order.orderStatus) ? 'badge-success' : ['Cancelled', 'Returned'].includes(order.orderStatus) ? 'badge-danger' : order.orderStatus === 'Pending' ? 'badge-warning' : 'badge-info'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" title="View"><Eye size={18} /></button>
                      <button className="icon-btn" title="Edit"><Edit size={18} /></button>
                      <button className="icon-btn" title="Print Invoice"><Printer size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  No orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination placeholder */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)' }}>
          <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>Showing {filteredOrders.length} of {ordersData.length} entries</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={{ padding: '6px 12px' }}>Previous</button>
            <button className="btn-outline" style={{ padding: '6px 12px' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;