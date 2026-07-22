import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Calendar, Download, ChevronDown, Filter } from 'lucide-react';
import '../admin.css';

const salesData = [
  { name: 'Mon', revenue: 4000, orders: 24, profit: 2400 },
  { name: 'Tue', revenue: 3000, orders: 18, profit: 1398 },
  { name: 'Wed', revenue: 2000, orders: 12, profit: 9800 },
  { name: 'Thu', revenue: 2780, orders: 19, profit: 3908 },
  { name: 'Fri', revenue: 1890, orders: 15, profit: 4800 },
  { name: 'Sat', revenue: 2390, orders: 14, profit: 3800 },
  { name: 'Sun', revenue: 3490, orders: 20, profit: 4300 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home', value: 300 },
  { name: 'Beauty', value: 200 },
];

const COLORS = ['#E43292', '#3b82f6', '#10b981', '#f59e0b'];

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Reports & Analytics</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Monitor your store's performance and revenue.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Calendar size={16} /> {timeRange} <ChevronDown size={14} />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Revenue</span>
            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +12.5%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>৳124,500</div>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Compared to last week</span>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Orders</span>
            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +8.2%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>342</div>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Compared to last week</span>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Active Customers</span>
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> -2.4%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>1,204</div>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Compared to last week</span>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Conversion Rate</span>
            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +1.1%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>3.8%</div>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Compared to last week</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Revenue Overview</h3>
            <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Filter size={18} /></button>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E43292" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E43292" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => `৳${val/1000}k`} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`৳${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E43292" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0' }}>Sales by Category</h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {categoryData.map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[idx] }}></div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0' }}>Top Performing Products</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Product Name</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Sold</th>
                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Premium Leather Jacket', cat: 'Clothing', price: '৳6,500', sold: 124, rev: '৳806,000' },
                { name: 'Wireless Noise-Cancelling Headphones', cat: 'Electronics', price: '৳12,000', sold: 98, rev: '৳1,176,000' },
                { name: 'Minimalist Ceramic Vase', cat: 'Home', price: '৳1,200', sold: 85, rev: '৳102,000' },
                { name: 'Organic Skincare Bundle', cat: 'Beauty', price: '৳3,500', sold: 72, rev: '৳252,000' },
              ].map((prod, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{prod.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{prod.cat}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{prod.price}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>{prod.sold}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#10b981', fontWeight: 600 }}>{prod.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;