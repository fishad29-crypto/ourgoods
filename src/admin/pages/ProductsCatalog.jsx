import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../../utils/MockData';
import { Search, Filter, Plus, Edit, Trash2, Image as ImageIcon, X, UploadCloud, Download } from 'lucide-react';

const ProductsCatalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [localProds, setLocalProds] = useState(() => getAllProducts());

  // Dynamic unique filters
  const uniqueCategories = [...new Set(localProds.map(p => p.category || 'Uncategorized'))].filter(Boolean);
  const uniqueVendors = [...new Set(localProds.map(p => p.vendor || 'Ourgoods Direct'))].filter(Boolean);

  // Map real products to catalog format
  const catalogData = localProds.map(p => ({
    id: p.id || p.sku,
    name: p.title || p.name,
    brand: p.brand || 'Ourgoods',
    sku: p.sku || `SKU-${(p.id + '').split('_')[1] || p.id}`,
    category: p.category || 'Uncategorized',
    vendor: p.vendor || 'Ourgoods Direct',
    type: p.type || 'Local Stock',
    price: p.price || p.salePrice || p.originalPrice,
    stock: p.stock || 100, // mock stock
    status: p.status || 'Active',
    image: p.image || (p.images && p.images[0] ? p.images[0].url : '')
  }));

  const filteredProducts = catalogData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesVendor = vendorFilter === 'All' || product.vendor === vendorFilter;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, vendorFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setLocalProds(getAllProducts());
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2 className="page-title">Products & Catalog ({filteredProducts.length})</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => setShowBulkModal(true)}>Bulk Upload</button>

          
          <button className="btn-primary" onClick={() => navigate('/admin/products/add')}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="table-container">
        {/* Filters Bar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '250px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search by Name or SKU" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="header-search" 
            style={{ width: '200px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="header-search" 
            style={{ width: '180px' }}
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          >
            <option value="All">All Vendors</option>
            {uniqueVendors.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>
          
          <button className="btn-outline" onClick={() => alert('Advanced filters coming soon!')}>
            <Filter size={18} /> More Filters
          </button>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Type</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--admin-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)', overflow: 'hidden' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{product.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>{product.vendor}</td>
                  <td>
                    <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: 'var(--admin-bg)', borderRadius: '4px' }}>
                      {product.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>৳ {product.price}</td>
                  <td>
                    <span style={{ color: product.stock === 0 ? 'var(--status-danger)' : product.stock < 10 ? 'var(--status-warning)' : 'inherit' }}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" title="Edit" onClick={() => navigate(`/admin/products/add?edit=${product.id}`)}><Edit size={18} /></button>
                      <button className="icon-btn" title="Delete" onClick={() => handleDelete(product.id)} style={{ color: 'var(--status-danger)' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                  No products found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)' }}>
          <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            Showing {paginatedProducts.length} of {filteredProducts.length} entries (Page {currentPage} of {totalPages})
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-outline" 
              style={{ padding: '6px 12px' }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button 
              className="btn-outline" 
              style={{ padding: '6px 12px' }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--admin-surface)', borderRadius: '12px', padding: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}
              onClick={() => setShowBulkModal(false)}
            >
              <X size={24} />
            </button>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 600 }}>Bulk Upload Products</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--admin-bg)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '14px' }}>Step 1: Download Template</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>Get the CSV template with all required headers.</p>
              </div>
              <button className="btn-outline" style={{ fontSize: '13px', padding: '8px 16px' }}><Download size={16} /> Template</button>
            </div>

            <div>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: '14px' }}>Step 2: Upload Completed File</p>
              <div style={{ border: '2px dashed var(--admin-border)', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--admin-bg)' }}>
                <UploadCloud size={32} color="var(--admin-text-muted)" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: '0 0 8px', fontWeight: 500 }}>Click to browse or drag CSV file here</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>Only .csv files are supported</p>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setShowBulkModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                alert('File uploaded successfully!');
                setShowBulkModal(false);
              }}>Start Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCatalog;