import React, { useState } from 'react';
import { HeadphonesIcon, Ticket, Clock, CheckCircle2, MessageSquare, AlertCircle, Search, Filter, MoreVertical, Reply } from 'lucide-react';
import '../admin.css';

const MOCK_TICKETS = [
  { id: 'TKT-1042', customer: 'Rahim Uddin', email: 'rahim@example.com', subject: 'Where is my order?', status: 'Open', priority: 'High', date: 'Just now', assigned: 'Unassigned' },
  { id: 'TKT-1041', customer: 'Sadia Islam', email: 'sadia@example.com', subject: 'Received damaged item', status: 'In Progress', priority: 'High', date: '2 hours ago', assigned: 'Sarah Ahmed' },
  { id: 'TKT-1040', customer: 'Tanvir Ahmed', email: 'tanvir@example.com', subject: 'Cannot apply discount code', status: 'Pending', priority: 'Medium', date: '5 hours ago', assigned: 'Sarah Ahmed' },
  { id: 'TKT-1039', customer: 'Karim Hasan', email: 'karim@example.com', subject: 'Product restock query', status: 'Resolved', priority: 'Low', date: 'Yesterday', assigned: 'Admin User' },
];

const CustomerSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTickets = MOCK_TICKETS.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Customer Support</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage customer inquiries, tickets, and communications.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Ticket size={16} /> Create Ticket
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Open Tickets</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>12</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>In Progress</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>8</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Resolved (Today)</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>45</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search tickets by ID, customer, subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Ticket Info</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Subject</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Assigned To</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((tkt) => (
                <tr key={tkt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{tkt.id}</div>
                    <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>{tkt.customer}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{tkt.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{tkt.subject}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: tkt.priority === 'High' ? '#fef2f2' : tkt.priority === 'Medium' ? '#fef3c7' : '#f1f5f9',
                      color: tkt.priority === 'High' ? '#ef4444' : tkt.priority === 'Medium' ? '#d97706' : '#64748b'
                    }}>
                      {tkt.priority}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: tkt.status === 'Open' ? '#fee2e2' : tkt.status === 'In Progress' ? '#e0e7ff' : tkt.status === 'Resolved' ? '#dcfce7' : '#f1f5f9',
                      color: tkt.status === 'Open' ? '#ef4444' : tkt.status === 'In Progress' ? '#4f46e5' : tkt.status === 'Resolved' ? '#16a34a' : '#64748b'
                    }}>
                      {tkt.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: tkt.assigned === 'Unassigned' ? '#94a3b8' : '#334155', fontWeight: tkt.assigned === 'Unassigned' ? 400 : 500 }}>
                    {tkt.assigned}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ padding: '6px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Reply size={14} /> Reply
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No tickets found matching "{searchTerm}"
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

export default CustomerSupport;