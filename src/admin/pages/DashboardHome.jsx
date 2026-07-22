import React from 'react';
import { statCards, dailySalesData, topCategoriesData, ordersData } from '../mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Download } from 'lucide-react';

const COLORS = ['#e91e63', '#10b981', '#f59e0b', '#3b82f6']; // brand-pink adjusted for hardcoded hex

const DashboardHome = () => {
  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', color: '#475569', outline: 'none', cursor: 'pointer' }}
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Revenue</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{statCards.totalRevenue}</div>
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <TrendingUp size={14} /> +12.5% this month
            </span>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Today's Revenue</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{statCards.todayRevenue}</div>
            <span style={{ fontSize: '13px', color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <TrendingUp size={14} /> +5.2% vs yesterday
            </span>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Orders</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{statCards.totalOrders}</div>
            <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              {statCards.todayOrders} today
            </span>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Active Vendors</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{statCards.activeVendors}</div>
            <span style={{ fontSize: '13px', color: '#db2777', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              3 pending approval
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Sales Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Sales Overview (Last 7 Days)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="sales" stroke="#db2777" strokeWidth={3} dot={{ r: 4, fill: '#db2777', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#db2777', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Top Categories</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategoriesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {topCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {topCategoriesData.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: COLORS[idx], borderRadius: '3px' }}></span>
                  {entry.name}
                </div>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table Row */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Recent Orders</h3>
          <a href="/admin/orders" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>View All Orders</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.slice(0, 5).map((order) => (
                <tr key={order.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{order.orderId}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{order.customerName}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{order.date}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#10b981' }}>৳ {order.totalAmount}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: ['Delivered', 'Completed'].includes(order.orderStatus) ? '#dcfce7' : ['Cancelled', 'Returned'].includes(order.orderStatus) ? '#fee2e2' : order.orderStatus === 'Pending' ? '#fef3c7' : '#e0f2fe',
                      color: ['Delivered', 'Completed'].includes(order.orderStatus) ? '#16a34a' : ['Cancelled', 'Returned'].includes(order.orderStatus) ? '#ef4444' : order.orderStatus === 'Pending' ? '#d97706' : '#0284c7'
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;