import React from 'react';
import { statCards, dailySalesData, topCategoriesData, ordersData } from '../mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const COLORS = ['var(--brand-pink)', '#10b981', '#f59e0b', '#3b82f6'];

const DashboardHome = () => {
  return (
    <div className="admin-content">
      <div className="page-header">
        <h2 className="page-title">Dashboard Overview</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="header-search" style={{ width: '150px' }}>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="btn-primary"><DownloadIcon /> Export Report</button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="card-grid">
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Total Revenue</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}><DollarSign size={20} /></div>
          </div>
          <span className="stat-value">{statCards.totalRevenue}</span>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>+12.5% this month</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Today's Revenue</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><TrendingUp size={20} /></div>
          </div>
          <span className="stat-value">{statCards.todayRevenue}</span>
          <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600 }}>+5.2% vs yesterday</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Total Orders</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><ShoppingBag size={20} /></div>
          </div>
          <span className="stat-value">{statCards.totalOrders}</span>
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>{statCards.todayOrders} today</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Active Vendors</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(228,27,35,0.1)', color: 'var(--admin-primary)' }}><Users size={20} /></div>
          </div>
          <span className="stat-value">{statCards.activeVendors}</span>
          <span style={{ fontSize: '12px', color: 'var(--admin-primary)', fontWeight: 600 }}>3 pending approval</span>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Sales Chart */}
        <div style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Sales Overview (Last 7 Days)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-muted)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="sales" stroke="var(--admin-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--admin-primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div style={{ backgroundColor: 'var(--admin-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--admin-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>Top Categories</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategoriesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {topCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {topCategoriesData.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: COLORS[idx], borderRadius: '50%' }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table Row */}
      <div className="table-container">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Recent Orders</h3>
          <a href="/admin/orders" style={{ color: 'var(--admin-primary)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>View All</a>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.slice(0, 5).map((order) => (
              <tr key={order.orderId}>
                <td style={{ fontWeight: 600 }}>{order.orderId}</td>
                <td>{order.customerName}</td>
                <td>{order.date}</td>
                <td style={{ fontWeight: 600 }}>৳ {order.totalAmount}</td>
                <td>
                  <span className={`badge ${order.orderStatus === 'Pending' ? 'badge-warning' : order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-info'}`}>
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SVG Icon definition to avoid extra import
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export default DashboardHome;