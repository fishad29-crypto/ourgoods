import React, { useState, useMemo } from 'react';
import { 
  Users, Store, CheckCircle, Clock, Trash2, Edit, 
  Plus, Search, MoreVertical, Ban, Activity, DollarSign, X
} from 'lucide-react';
import { useVendors, addVendor, updateVendor, deleteVendor } from '../../utils/MockData';

const VendorManagement = () => {
  const vendors = useVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', contactName: '', email: '', phone: '', commission: 0 });

  // Stats
  const activeCount = vendors.filter(v => v.status === 'Active').length;
  const pendingCount = vendors.filter(v => v.status === 'Pending').length;
  const totalRevenue = vendors.reduce((sum, v) => sum + (v.revenue || 0), 0);

  // Filtered
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, statusFilter]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.email) {
      alert('Name and Email are required.');
      return;
    }
    addVendor({ ...newVendor, status: 'Pending' });
    setShowAddModal(false);
    setNewVendor({ name: '', contactName: '', email: '', phone: '', commission: 0 });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      deleteVendor(id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateVendor(id, { status: newStatus });
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title">Vendor Management</h2>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="card-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Total Vendors</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--brand-pink)' }}><Store size={20} /></div>
          </div>
          <span className="stat-value">{vendors.length}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Active Vendors</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}><CheckCircle size={20} /></div>
          </div>
          <span className="stat-value">{activeCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Pending Approvals</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}><Clock size={20} /></div>
          </div>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Total Revenue (Vendors)</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><DollarSign size={20} /></div>
          </div>
          <span className="stat-value"></span>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        {/* Filters Bar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '300px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search vendors by name or contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Contact</th>
                <th>Commission</th>
                <th>Products</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                    No vendors found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-pink)' }}>
                          <Store size={20} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{vendor.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>ID: {vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{vendor.contactName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{vendor.email}</p>
                      <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{vendor.phone}</p>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{vendor.commission}%</span>
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>{vendor.productsCount}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#10b981' }}></span>
                    </td>
                    <td>
                      <span className={`badge ${vendor.status === 'Active' ? 'badge-success' : vendor.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                      {vendor.joinedAt}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {vendor.status === 'Pending' && (
                          <button className="icon-btn" title="Approve Vendor" onClick={() => handleStatusChange(vendor.id, 'Active')} style={{ color: '#10b981' }}>
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {vendor.status === 'Active' && (
                          <button className="icon-btn" title="Suspend Vendor" onClick={() => handleStatusChange(vendor.id, 'Suspended')} style={{ color: '#ef4444' }}>
                            <Ban size={18} />
                          </button>
                        )}
                        {vendor.status === 'Suspended' && (
                          <button className="icon-btn" title="Re-activate Vendor" onClick={() => handleStatusChange(vendor.id, 'Active')} style={{ color: '#10b981' }}>
                            <Activity size={18} />
                          </button>
                        )}
                        <button className="icon-btn" title="Delete Vendor" onClick={() => handleDelete(vendor.id)} style={{ color: '#ef4444' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'var(--admin-surface)', width: '100%', maxWidth: '500px',
            borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Add New Vendor</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Company / Vendor Name *</label>
                <input type="text" required value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} className="form-input" placeholder="e.g., Apple Store" />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input type="text" value={newVendor.contactName} onChange={e => setNewVendor({...newVendor, contactName: e.target.value})} className="form-input" placeholder="e.g., Tim Cook" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" required value={newVendor.email} onChange={e => setNewVendor({...newVendor, email: e.target.value})} className="form-input" placeholder="vendor@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={newVendor.phone} onChange={e => setNewVendor({...newVendor, phone: e.target.value})} className="form-input" placeholder="+123456789" />
              </div>
              <div className="form-group">
                <label>Platform Commission Rate (%)</label>
                <input type="number" min="0" max="100" value={newVendor.commission} onChange={e => setNewVendor({...newVendor, commission: Number(e.target.value)})} className="form-input" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
