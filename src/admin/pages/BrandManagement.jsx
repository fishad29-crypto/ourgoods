import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Plus, Trash2, Edit, Save, X, Search, CheckCircle, Package } from 'lucide-react';

// Helper to get a consistent color based on string
const getStringColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + ('00000'.substring(0, 6 - c.length) + c);
};

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedBrands');
    if (saved) {
      setBrands(JSON.parse(saved));
    } else {
      setBrands(['OURGOODS', 'Nike', 'Adidas', 'Zara', 'Gucci']);
    }
  }, []);

  const saveBrands = (newBrands) => {
    setBrands(newBrands);
    localStorage.setItem('savedBrands', JSON.stringify(newBrands));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    if (brands.some(b => b.toLowerCase() === newBrand.trim().toLowerCase())) {
      alert('Brand already exists');
      return;
    }
    saveBrands([newBrand.trim(), ...brands]);
    setNewBrand('');
    setShowAddModal(false);
  };

  const handleDelete = (indexToDelete) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      const newBrands = brands.filter((_, i) => i !== indexToDelete);
      saveBrands(newBrands);
      setSelectedBrands(selectedBrands.filter(b => b !== brands[indexToDelete]));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBrands.length} brands?`)) {
      const newBrands = brands.filter(b => !selectedBrands.includes(b));
      saveBrands(newBrands);
      setSelectedBrands([]);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditValue(brands[index]);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      handleDelete(editingIndex);
      setEditingIndex(null);
      return;
    }
    if (brands.some((b, i) => b.toLowerCase() === editValue.trim().toLowerCase() && i !== editingIndex)) {
      alert('Brand already exists');
      return;
    }
    const newBrands = [...brands];
    // Rename selected brand if it was in the selection list
    if (selectedBrands.includes(brands[editingIndex])) {
        setSelectedBrands(prev => prev.map(sb => sb === brands[editingIndex] ? editValue.trim() : sb));
    }
    newBrands[editingIndex] = editValue.trim();
    saveBrands(newBrands);
    setEditingIndex(null);
  };

  const filteredBrands = useMemo(() => {
    return brands.filter(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [brands, searchTerm]);

  const toggleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(filteredBrands);
    }
  };

  const toggleSelect = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  return (
    <div className="admin-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
            <h2 className="page-title" style={{ marginBottom: '4px' }}>Brand Library</h2>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', margin: 0 }}>Manage all vendor brands available for your products</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(228, 50, 146, 0.25)', fontWeight: '600' }}>
          <Plus size={18} /> Add New Brand
        </button>
      </div>

      <div className="card-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fff, #fdf2f8)', border: '1px solid #fce7f3' }}>
          <div className="flex-between">
            <span className="stat-title" style={{ color: '#be185d' }}>Total Brands</span>
            <div className="icon-btn" style={{ backgroundColor: '#fbcfe8', color: '#db2777' }}><Tag size={20} /></div>
          </div>
          <span className="stat-value" style={{ color: '#9d174d' }}>{brands.length}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Active</span>
            <div className="icon-btn" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}><CheckCircle size={20} /></div>
          </div>
          <span className="stat-value">{brands.length}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-title">Products Linked</span>
            <div className="icon-btn" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}><Package size={20} /></div>
          </div>
          <span className="stat-value">{(brands.length * 14) + 8}</span>
        </div>
      </div>

      <div className="table-container" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--admin-border)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
          <div className="header-search" style={{ width: '300px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search brands by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
          
          {selectedBrands.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.2s' }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{selectedBrands.length} selected</span>
                <button 
                    onClick={handleBulkDelete}
                    style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseOut={e => e.currentTarget.style.background = '#fef2f2'}
                >
                    <Trash2 size={16} /> Bulk Delete
                </button>
            </div>
          )}
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                    type="checkbox" 
                    checked={filteredBrands.length > 0 && selectedBrands.length === filteredBrands.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--brand-pink)' }}
                />
              </th>
              <th>Brand Name</th>
              <th>Products Linked</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => {
              const originalIndex = brands.indexOf(brand);
              const isSelected = selectedBrands.includes(brand);
              const brandColor = getStringColor(brand);
              const initials = brand.substring(0, 2).toUpperCase();
              // Mock product count for visual flair
              const mockProducts = (brand.length * 3) % 24 + 1;
              
              return (
                <tr key={brand} style={{ backgroundColor: isSelected ? '#fdf2f8' : 'transparent', transition: 'all 0.2s' }}>
                  <td>
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(brand)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--brand-pink)' }}
                    />
                  </td>
                  <td>
                    {editingIndex === originalIndex ? (
                      <input 
                        type="text" 
                        className="form-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                        style={{ border: '2px solid var(--brand-pink)', boxShadow: '0 0 0 3px rgba(228,50,146,0.1)' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: brandColor + '20', color: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: `1px solid ${brandColor}40` }}>
                            {initials}
                        </div>
                        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{brand}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                        <Package size={14} /> {mockProducts} items
                    </span>
                  </td>
                  <td>
                    <span className="status-badge status-active" style={{ padding: '4px 10px', borderRadius: '20px' }}>Active</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {editingIndex === originalIndex ? (
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button className="action-btn" title="Save" onClick={handleSaveEdit} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                          <Save size={16} />
                        </button>
                        <button className="action-btn" title="Cancel" onClick={() => setEditingIndex(null)} style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button className="action-btn" title="Edit" onClick={() => startEdit(originalIndex)}>
                          <Edit size={16} color="#3b82f6" />
                        </button>
                        <button className="action-btn" title="Delete" onClick={() => handleDelete(originalIndex)}>
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={32} color="#94a3b8" />
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#334155' }}>No brands found</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Try adjusting your search or add a new brand.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', width: '90%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'scaleIn 0.2s ease-out' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: '#fce7f3', padding: '6px', borderRadius: '8px', color: '#db2777' }}><Tag size={18} /></div>
                        Add New Brand
                    </h3>
                    <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleAdd} style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Brand Name</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Nike, Apple, Sony" 
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                            autoFocus
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> Save Brand
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      <style>{`
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default BrandManagement;
