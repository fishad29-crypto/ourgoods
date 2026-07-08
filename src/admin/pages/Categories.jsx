import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import realProducts from '../../utils/realProducts.json';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // derive unique categories from realProducts
  const categoriesList = [...new Set(realProducts.map(p => p.category).filter(Boolean))].map((cat, i) => ({
    id: i + 1,
    name: cat,
    productCount: realProducts.filter(p => p.category === cat).length
  }));

  const filtered = categoriesList.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2 className="page-title">Category Management</h2>
        <button className="btn-primary">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="table-container">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)' }}>
          <div className="header-search" style={{ width: '300px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Total Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(cat => (
              <tr key={cat.id}>
                <td>#{cat.id}</td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td>
                  <span style={{ backgroundColor: 'var(--admin-bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {cat.productCount} Items
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" title="Edit"><Edit size={18} /></button>
                    <button className="icon-btn" style={{ color: 'var(--status-danger)' }} title="Delete"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
