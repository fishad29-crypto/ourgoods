import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Store, CheckCircle, Clock, Trash2, Edit, 
  Plus, Search, MoreVertical, Ban, Activity, DollarSign, X, 
  ChevronDown, ChevronUp, Download, Mail, Phone, MapPin, Star, Shield, TrendingUp, CheckSquare, Square
} from 'lucide-react';
import { useVendors, addVendor, updateVendor, deleteVendor } from '../../utils/MockData';

const VendorDrawer = ({ vendor, onClose, onUpdateStatus, onDelete }) => {
  if (!vendor) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000
      }}></div>
      <div className="vendor-drawer" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px',
        backgroundColor: 'var(--admin-surface)', zIndex: 1001,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', transform: 'translateX(0)', transition: 'transform 0.3s ease-out',
        display: 'flex', flexDirection: 'column', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(to right, rgba(236, 72, 153, 0.05), transparent)' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'var(--brand-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.3)' }}>
              <Store size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: 'var(--admin-text)' }}>{vendor.name}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`badge ${vendor.status === 'Active' ? 'badge-success' : vendor.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}`}>
                  {vendor.status}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={12} /> {vendor.tier || 'Standard'}
                </span>
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ backgroundColor: 'var(--admin-bg)' }}><X size={20} /></button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>Revenue <DollarSign size={14} /></div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>${(vendor.revenue || 0).toLocaleString()}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>Rating <Star size={14} color="#f59e0b" fill="#f59e0b" /></div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>{vendor.rating || 'N/A'}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>Products <Store size={14} /></div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>{vendor.productsCount || 0}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>Fulfillment <CheckCircle size={14} /></div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>{vendor.fulfillmentRate || 0}%</div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)' }}>Contact Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-pink)' }}><Users size={16} /></div>
                <div><div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Primary Contact</div><div style={{ fontWeight: 500 }}>{vendor.contactName}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Mail size={16} /></div>
                <div><div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Email Address</div><div style={{ fontWeight: 500 }}>{vendor.email}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}><Phone size={16} /></div>
                <div><div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Phone Number</div><div style={{ fontWeight: 500 }}>{vendor.phone}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}><MapPin size={16} /></div>
                <div><div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Location</div><div style={{ fontWeight: 500 }}>{vendor.location || 'Not Specified'}</div></div>
              </div>
            </div>
          </div>

          {/* Mini Chart (Mock) */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)' }}>Recent Sales (7 Days)</h4>
            <div style={{ height: '120px', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'flex-end', gap: '8px', justifyContent: 'space-between', backgroundColor: 'var(--admin-bg)' }}>
              {(vendor.recentSales || [0,0,0,0,0,0,0]).map((val, i) => {
                const max = Math.max(...(vendor.recentSales || [1]));
                const heightPct = max === 0 ? 10 : Math.max(10, (val / max) * 100);
                return (
                  <div key={i} style={{ flex: 1, backgroundColor: 'rgba(236, 72, 153, 0.1)', borderRadius: '4px', position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', backgroundColor: 'var(--brand-pink)', borderRadius: '4px', height: `${heightPct}%`, transition: 'height 0.5s ease-out' }}></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '12px' }}>
            {vendor.status !== 'Active' && (
              <button className="btn-primary" style={{ flex: 1, backgroundColor: '#10b981', borderColor: '#10b981' }} onClick={() => { onUpdateStatus(vendor.id, 'Active'); onClose(); }}>
                <CheckCircle size={18} /> Approve
              </button>
            )}
            {vendor.status === 'Active' && (
              <button className="btn-outline" style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444' }} onClick={() => { onUpdateStatus(vendor.id, 'Suspended'); onClose(); }}>
                <Ban size={18} /> Suspend
              </button>
            )}
            <button className="icon-btn" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0 16px' }} onClick={() => { onDelete(vendor.id); onClose(); }}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const VendorManagement = () => {
  const vendors = useVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Advanced States
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'joinedAt', direction: 'desc' });
  const [activeVendorId, setActiveVendorId] = useState(null);
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState('basic'); // basic, financial
  const [newVendor, setNewVendor] = useState({ name: '', contactName: '', email: '', phone: '', commission: 0, location: '', tier: 'Standard' });

  // Stats
  const activeCount = vendors.filter(v => v.status === 'Active').length;
  const pendingCount = vendors.filter(v => v.status === 'Pending').length;
  const totalRevenue = vendors.reduce((sum, v) => sum + (v.revenue || 0), 0);

  // Sorting & Filtering
  const processedVendors = useMemo(() => {
    let result = vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (v.id && v.id.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [vendors, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(processedVendors.map(v => v.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;
    
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedIds.length} vendors?`)) {
        selectedIds.forEach(id => deleteVendor(id));
        setSelectedIds([]);
      }
    } else if (action === 'activate') {
      selectedIds.forEach(id => updateVendor(id, { status: 'Active' }));
      setSelectedIds([]);
    } else if (action === 'suspend') {
      selectedIds.forEach(id => updateVendor(id, { status: 'Suspended' }));
      setSelectedIds([]);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Contact', 'Email', 'Phone', 'Status', 'Commission', 'Revenue', 'Products', 'Joined'];
    const rows = processedVendors.map(v => [
      v.id, `"${v.name}"`, `"${v.contactName}"`, v.email, v.phone, v.status, `${v.commission}%`, v.revenue, v.productsCount, v.joinedAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendors_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.email) {
      alert('Name and Email are required.');
      return;
    }
    addVendor({ ...newVendor, status: 'Pending' });
    setShowAddModal(false);
    setNewVendor({ name: '', contactName: '', email: '', phone: '', commission: 0, location: '', tier: 'Standard' });
    setModalTab('basic');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      deleteVendor(id);
      if (selectedIds.includes(id)) setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateVendor(id, { status: newStatus });
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title">Vendor Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={exportCSV}>
            <Download size={18} /> Export CSV
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add New Vendor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="card-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Total Vendors</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'var(--brand-pink)' }}><Store size={20} /></div>
          </div>
          <span className="stat-value">{vendors.length}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Active Vendors</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><CheckCircle size={20} /></div>
          </div>
          <span className="stat-value">{activeCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Pending Approvals</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Clock size={20} /></div>
          </div>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Total Revenue (Vendors)</span>
            <div className="icon-btn" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><DollarSign size={20} /></div>
          </div>
          <span className="stat-value">${totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container" style={{ position: 'relative' }}>
        {/* Bulk Actions Bar (Overlays filters when items are selected) */}
        {selectedIds.length > 0 && (
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(236, 72, 153, 0.05)', 
            borderBottom: '1px solid var(--brand-pink)', padding: '16px 20px', zIndex: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="icon-btn" style={{ padding: 0 }} onClick={() => setSelectedIds([])}><X size={18} color="var(--brand-pink)" /></button>
              <span style={{ fontWeight: 600, color: 'var(--brand-pink)' }}>{selectedIds.length} vendors selected</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ borderColor: '#10b981', color: '#10b981' }} onClick={() => handleBulkAction('activate')}>Approve All</button>
              <button className="btn-outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }} onClick={() => handleBulkAction('suspend')}>Suspend All</button>
              <button className="btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleBulkAction('delete')}>Delete All</button>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '300px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search vendors by name, ID, or contact..." 
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
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <div onClick={handleSelectAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedIds.length === processedVendors.length && processedVendors.length > 0 ? <CheckSquare size={18} color="var(--brand-pink)" /> : <Square size={18} color="var(--admin-text-muted)" />}
                  </div>
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Vendor {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                </th>
                <th>Contact Info</th>
                <th onClick={() => handleSort('commission')} style={{ cursor: 'pointer' }}>
                  Comm. {sortConfig.key === 'commission' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                </th>
                <th onClick={() => handleSort('productsCount')} style={{ cursor: 'pointer' }}>
                  Products {sortConfig.key === 'productsCount' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                </th>
                <th onClick={() => handleSort('revenue')} style={{ cursor: 'pointer' }}>
                  Revenue {sortConfig.key === 'revenue' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</th>
                <th onClick={() => handleSort('joinedAt')} style={{ cursor: 'pointer' }}>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedVendors.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-text-muted)' }}>
                    <Store size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p>No vendors found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                processedVendors.map(vendor => (
                  <tr key={vendor.id} className={selectedIds.includes(vendor.id) ? 'selected-row' : ''} style={{ backgroundColor: selectedIds.includes(vendor.id) ? 'rgba(236, 72, 153, 0.03)' : '' }}>
                    <td style={{ textAlign: 'center' }}>
                      <div onClick={() => handleSelectOne(vendor.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedIds.includes(vendor.id) ? <CheckSquare size={18} color="var(--brand-pink)" /> : <Square size={18} color="var(--admin-text-muted)" />}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveVendorId(vendor.id)}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-pink)' }}>
                          {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--admin-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {vendor.name}
                            {vendor.tier === 'Official' && <Shield size={14} color="#3b82f6" title="Official Store" />}
                            {vendor.tier === 'Top Seller' && <Star size={14} color="#f59e0b" fill="#f59e0b" title="Top Seller" />}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>ID: {vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{vendor.contactName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{vendor.email}</p>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text-muted)' }}>{vendor.commission}%</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>{vendor.productsCount}</span>
                        {/* Tiny capacity bar mock */}
                        <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--admin-border)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, vendor.productsCount)}%`, height: '100%', backgroundColor: 'var(--brand-pink)' }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ${(vendor.revenue || 0).toLocaleString()}
                        {vendor.revenue > 10000 && <TrendingUp size={14} style={{ opacity: 0.7 }} />}
                      </div>
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
                        <button className="icon-btn" title="View Details" onClick={() => setActiveVendorId(vendor.id)}>
                          <MoreVertical size={18} />
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

      {/* Slide-out Drawer */}
      <VendorDrawer 
        vendor={vendors.find(v => v.id === activeVendorId)} 
        onClose={() => setActiveVendorId(null)}
        onUpdateStatus={handleStatusChange}
        onDelete={handleDelete}
      />

      {/* Add Vendor Modal (Advanced) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'var(--admin-surface)', width: '100%', maxWidth: '600px',
            borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--admin-bg)' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Add New Vendor</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)' }}>
              <button 
                style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: modalTab === 'basic' ? '2px solid var(--brand-pink)' : '2px solid transparent', color: modalTab === 'basic' ? 'var(--brand-pink)' : 'var(--admin-text-muted)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setModalTab('basic')}
              >
                Basic Information
              </button>
              <button 
                style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: modalTab === 'financial' ? '2px solid var(--brand-pink)' : '2px solid transparent', color: modalTab === 'financial' ? 'var(--brand-pink)' : 'var(--admin-text-muted)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setModalTab('financial')}
              >
                Financial & Settings
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <form onSubmit={handleAddSubmit} id="add-vendor-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {modalTab === 'basic' ? (
                  <>
                    <div className="form-group">
                      <label>Company / Vendor Name *</label>
                      <input type="text" required value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} className="form-input" placeholder="e.g., Apple Store" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label>Contact Person</label>
                        <input type="text" value={newVendor.contactName} onChange={e => setNewVendor({...newVendor, contactName: e.target.value})} className="form-input" placeholder="e.g., Tim Cook" />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" value={newVendor.phone} onChange={e => setNewVendor({...newVendor, phone: e.target.value})} className="form-input" placeholder="+123456789" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" required value={newVendor.email} onChange={e => setNewVendor({...newVendor, email: e.target.value})} className="form-input" placeholder="vendor@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Location / Address</label>
                      <input type="text" value={newVendor.location} onChange={e => setNewVendor({...newVendor, location: e.target.value})} className="form-input" placeholder="e.g., Dhaka, Bangladesh" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Platform Commission Rate (%)</label>
                      <input type="number" min="0" max="100" value={newVendor.commission} onChange={e => setNewVendor({...newVendor, commission: Number(e.target.value)})} className="form-input" />
                      <small style={{ color: 'var(--admin-text-muted)', marginTop: '4px', display: 'block' }}>Default is 0% if left blank.</small>
                    </div>
                    <div className="form-group">
                      <label>Store Tier</label>
                      <select value={newVendor.tier} onChange={e => setNewVendor({...newVendor, tier: e.target.value})} className="form-input">
                        <option value="Standard">Standard</option>
                        <option value="Top Seller">Top Seller</option>
                        <option value="Official">Official</option>
                        <option value="New Vendor">New Vendor</option>
                      </select>
                    </div>
                  </>
                )}
              </form>
            </div>
            
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: 'var(--admin-bg)' }}>
              <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" form="add-vendor-form" className="btn-primary">Create Vendor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
