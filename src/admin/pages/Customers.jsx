import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Download, Mail, Users, UserPlus, Star } from 'lucide-react';
import '../admin.css';

const MOCK_CUSTOMERS = [
  { id: '#CUS-001', name: 'Rahim Uddin', email: 'rahim@example.com', phone: '+880 1711-234567', orders: 12, spent: 45000, lastOrder: '2026-07-10', status: 'Active', segment: 'VIP' },
  { id: '#CUS-002', name: 'Karim Hasan', email: 'karim@example.com', phone: '+880 1819-987654', orders: 3, spent: 12500, lastOrder: '2026-07-12', status: 'Active', segment: 'Regular' },
  { id: '#CUS-003', name: 'Sadia Islam', email: 'sadia@example.com', phone: '+880 1912-345678', orders: 1, spent: 4500, lastOrder: '2026-06-25', status: 'Inactive', segment: 'New' },
  { id: '#CUS-004', name: 'Tanvir Ahmed', email: 'tanvir@example.com', phone: '+880 1613-456789', orders: 8, spent: 32000, lastOrder: '2026-07-01', status: 'Active', segment: 'VIP' },
  { id: '#CUS-005', name: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '+880 1514-567890', orders: 5, spent: 18000, lastOrder: '2026-07-14', status: 'Active', segment: 'Regular' },
  { id: '#CUS-006', name: 'Faisal Mahmud', email: 'faisal@example.com', phone: '+880 1715-678901', orders: 0, spent: 0, lastOrder: 'N/A', status: 'Pending', segment: 'New' },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Customers Overview</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage your store's customers and view their purchase history.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
            <Download size={16} /> Export CSV
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <UserPlus size={16} /> Add Customer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Customers</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>4,209</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>New This Month</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>342</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>VIP Customers</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>156</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '300px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filters
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Mail size={16} /> Bulk Email
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Customer Info</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Contact Details</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Orders</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Total Spent</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 600, fontSize: '16px' }}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{customer.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', color: '#334155' }}>{customer.email}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{customer.phone}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{customer.orders} Orders</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Last: {customer.lastOrder}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#10b981' }}>
                    ৳{customer.spent.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                        background: customer.status === 'Active' ? '#dcfce7' : customer.status === 'Inactive' ? '#fee2e2' : '#fef3c7',
                        color: customer.status === 'Active' ? '#16a34a' : customer.status === 'Inactive' ? '#ef4444' : '#d97706'
                      }}>
                        {customer.status}
                      </span>
                      {customer.segment === 'VIP' && (
                        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: '#fce7f3', color: '#be185d' }}>VIP Member</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No customers found matching "{searchTerm}"
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

export default Customers;