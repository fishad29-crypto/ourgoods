import React, { useState, useEffect } from 'react';
import { getAllProducts, useCategories, updateProduct } from '../../utils/MockData';
import { Search, Plus, Minus, Filter, Box, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../admin.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  
  const { categories } = useCategories();

  useEffect(() => {
    // Load products on mount
    setProducts(getAllProducts());
  }, []);

  const handleStockChange = (productId, newStock) => {
    if (newStock < 0) newStock = 0;
    const stockVal = parseInt(newStock) || 0;
    
    // Update local component state
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: stockVal };
      }
      return p;
    });
    setProducts(updated);
    
    // Update globally in MockData cache & localStorage
    updateProduct(productId, { stock: stockVal });
  };

  const incrementStock = (productId) => {
    const p = products.find(p => p.id === productId);
    if(p) handleStockChange(productId, (p.stock || 0) + 1);
  };

  const decrementStock = (productId) => {
    const p = products.find(p => p.id === productId);
    if(p) handleStockChange(productId, (p.stock || 0) - 1);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selId => selId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkZeroStock = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to set stock to 0 for ${selectedIds.length} items?`)) {
      const updated = products.map(p => {
        if (selectedIds.includes(p.id)) {
          return { ...p, stock: 0 };
        }
        return p;
      });
      saveToLocal(updated);
      setSelectedIds([]);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter || (Array.isArray(p.category) && p.category.includes(categoryFilter));
    
    let matchesStatus = true;
    if (statusFilter === 'In Stock') matchesStatus = p.stock > 10;
    if (statusFilter === 'Low Stock') matchesStatus = p.stock > 0 && p.stock <= 10;
    if (statusFilter === 'Out of Stock') matchesStatus = p.stock === 0;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'status-danger', icon: <AlertCircle size={14}/> };
    if (stock <= 10) return { label: 'Low Stock', class: 'status-warning', icon: <AlertCircle size={14}/> };
    return { label: 'In Stock', class: 'status-success', icon: <CheckCircle2 size={14}/> };
  };

  const activeCategories = categories.filter(c => c.isActive !== false && c.id !== -1);

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Inventory Management</h2>
          <p className="page-subtitle">Track and update stock levels for all your products in real-time.</p>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by SKU or Title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-select-wrapper">
            <Filter size={16} className="filter-icon" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {activeCategories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrapper">
            <Box size={16} className="filter-icon" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock (&gt;10)</option>
              <option value="Low Stock">Low Stock (1-10)</option>
              <option value="Out of Stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bulk-actions-toolbar">
          <span>{selectedIds.length} product(s) selected</span>
          <button className="btn-danger-outline btn-sm" onClick={handleBulkZeroStock}>
            Mark as Out of Stock
          </button>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table inventory-table">
          <thead>
            <tr>
              <th width="40">
                <input 
                  type="checkbox" 
                  onChange={selectAll} 
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length} 
                />
              </th>
              <th width="60">Image</th>
              <th>Product Info</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Status</th>
              <th width="150" style={{textAlign: 'center'}}>Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-muted">
                  No products match your filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const status = getStockStatus(product.stock || 0);
                const imageUrl = Array.isArray(product.images) && product.images.length > 0 
                  ? (product.images[0].url || product.images[0]) 
                  : (product.image || "https://via.placeholder.com/50");

                return (
                  <tr key={product.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </td>
                    <td>
                      <img src={imageUrl} alt={product.title} className="table-img" />
                    </td>
                    <td>
                      <div className="product-title-cell">{product.title}</div>
                      <div className="product-category-cell">{Array.isArray(product.category) ? product.category.join(', ') : product.category}</div>
                    </td>
                    <td className="text-muted">{product.sku || product.id.substring(0,8)}</td>
                    <td className="font-medium">${product.price?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${status.class}`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="stock-adjust-cell">
                        <button className="stock-btn" onClick={() => decrementStock(product.id)}>
                          <Minus size={14} />
                        </button>
                        <input 
                          type="number" 
                          className="stock-input" 
                          value={product.stock || 0}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                        />
                        <button className="stock-btn" onClick={() => incrementStock(product.id)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;