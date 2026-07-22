import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Users, Search, Filter, MoreVertical, Plus, Mail, Edit3, Trash2 } from 'lucide-react';
import '../admin.css';

const MOCK_STAFF = [
  { id: 'STF-001', name: 'Fishad Mohammad', email: 'fishad@ourgoods.com', role: 'Super Admin', department: 'Management', status: 'Active', lastActive: 'Just now' },
  { id: 'STF-002', name: 'Admin User', email: 'admin@ourgoods.com', role: 'Admin', department: 'Operations', status: 'Active', lastActive: '5 mins ago' },
  { id: 'STF-003', name: 'Sarah Ahmed', email: 'sarah@ourgoods.com', role: 'Support Agent', department: 'Customer Service', status: 'Active', lastActive: '1 hour ago' },
  { id: 'STF-004', name: 'Tarek Rahman', email: 'tarek@ourgoods.com', role: 'Content Editor', department: 'Marketing', status: 'Inactive', lastActive: '2 days ago' },
  { id: 'STF-005', name: 'Nusrat Jahan', email: 'nusrat@ourgoods.com', role: 'Vendor Manager', department: 'Operations', status: 'Pending', lastActive: 'Never' },
];

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStaff = MOCK_STAFF.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Staff & Permissions</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage admin users, roles, and access control levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Plus size={16} /> Add Staff Member
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Staff</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>12</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Active Admins</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>3</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Pending Invites</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>2</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '300px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search staff, email, role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter by Role
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Staff Member</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Role & Dept</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Last Active</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 600, fontSize: '16px' }}>
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{staff.name}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {staff.role === 'Super Admin' && <Shield size={14} color="#8b5cf6" />}
                      {staff.role === 'Admin' && <Shield size={14} color="#3b82f6" />}
                      <span style={{ fontSize: '14px', fontWeight: 600, color: staff.role.includes('Admin') ? '#0f172a' : '#475569' }}>
                        {staff.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{staff.department}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b' }}>
                    {staff.lastActive}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: staff.status === 'Active' ? '#dcfce7' : staff.status === 'Inactive' ? '#f1f5f9' : '#fef3c7',
                      color: staff.status === 'Active' ? '#16a34a' : staff.status === 'Inactive' ? '#64748b' : '#d97706'
                    }}>
                      {staff.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', color: '#475569', cursor: 'pointer' }} title="Email">
                        <Mail size={16} />
                      </button>
                      <button style={{ padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer' }} title="Edit Roles">
                        <Edit3 size={16} />
                      </button>
                      {staff.role !== 'Super Admin' && (
                        <button style={{ padding: '6px', background: '#fef2f2', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }} title="Revoke Access">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No staff found matching "{searchTerm}"
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

export default StaffManagement;