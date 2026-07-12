import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, useCategories, deleteProduct } from '../../utils/MockData';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronRight, Package, Layers, Image as ImageIcon } from 'lucide-react';

const AllProducts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCats, setExpandedCats] = useState({});
  const [expandedSubs, setExpandedSubs] = useState({});
  const [localProducts, setLocalProducts] = useState([]);
  
  const { categories, subcategories } = useCategories();

  useEffect(() => {
    setLocalProducts(getAllProducts());
  }, []);

  const toggleCategory = (catName) => {
    setExpandedCats(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const toggleSubcategory = (catName, subName) => {
    const key = `${catName}-${subName}`;
    setExpandedSubs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setLocalProducts(getAllProducts());
    }
  };

  // Filter Active Categories
  const activeCategories = categories.filter(c => c.isActive !== false && c.id !== -1);

  // Filter products for a specific subcategory
  const getProductsForSubcategory = (catName, subName) => {
    return localProducts.filter(p => {
      // If we don't have subcategory data on products, we might fallback.
      // But we check category first
      const matchesCategory = Array.isArray(p.category) ? p.category.includes(catName) : p.category === catName;
      // Ideally products have a `subcategory` field. If they don't, we might just show them if they match the category.
      // Actually, let's filter by subcategory if it exists, otherwise just category
      const matchesSubcategory = Array.isArray(p.subcategory) ? p.subcategory.includes(subName) : p.subcategory === subName || (!p.subcategory && subName === 'Uncategorized');
      
      const searchMatch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
                          
      return matchesCategory && matchesSubcategory && (searchTerm ? searchMatch : true);
    });
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2 className="page-title">Categorized Products</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => navigate('/admin/products/add')}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="table-container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-search" style={{ width: '300px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeCategories.map(cat => {
            const subs = subcategories[cat.name] || [];
            // Calculate how many products are in this category entirely
            const catProducts = localProducts.filter(p => (Array.isArray(p.category) ? p.category.includes(cat.name) : p.category === cat.name) && (searchTerm ? p.title?.toLowerCase().includes(searchTerm.toLowerCase()) : true));
            const isCatExpanded = expandedCats[cat.name] || searchTerm; // Auto expand if searching

            if (searchTerm && catProducts.length === 0) return null;

            return (
              <div key={cat.id} style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                {/* Category Header */}
                <div 
                  onClick={() => toggleCategory(cat.name)}
                  style={{ 
                    padding: '16px 24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isCatExpanded ? '#f8fafc' : 'white',
                    borderBottom: isCatExpanded ? '1px solid var(--admin-border)' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#64748b' }}>
                      {isCatExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {cat.icon && <i className={cat.icon} style={{ fontSize: '20px', color: 'var(--brand-pink)' }}></i>}
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>{cat.name}</h3>
                  </div>
                  <span style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '16px', fontWeight: 500 }}>
                    {catProducts.length} Products
                  </span>
                </div>

                {/* Subcategories List */}
                {isCatExpanded && (
                  <div style={{ padding: '0' }}>
                    {subs.map((sub, idx) => {
                      const subProducts = getProductsForSubcategory(cat.name, sub.name);
                      const subKey = `${cat.name}-${sub.name}`;
                      const isSubExpanded = expandedSubs[subKey] || searchTerm;

                      if (searchTerm && subProducts.length === 0) return null;

                      return (
                        <div key={idx} style={{ borderBottom: idx < subs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <div 
                            onClick={() => toggleSubcategory(cat.name, sub.name)}
                            style={{ 
                              padding: '12px 24px 12px 48px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              backgroundColor: isSubExpanded ? '#fafafa' : 'white',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ color: '#94a3b8' }}>
                                {isSubExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              </div>
                              {sub.img ? (
                                <img src={sub.img} alt={sub.name} style={{ width: '30px', height: '30px', borderRadius: '6px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Layers size={14} color="#94a3b8" />
                                </div>
                              )}
                              <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{sub.name}</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{subProducts.length} Items</span>
                          </div>

                          {/* Products Table for this Subcategory */}
                          {isSubExpanded && (
                            <div style={{ padding: '16px 24px 24px 80px', backgroundColor: '#fafafa', borderTop: '1px solid #f1f5f9' }}>
                              {subProducts.length > 0 ? (
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
                                  <table className="admin-table" style={{ margin: 0, width: '100%' }}>
                                    <thead style={{ backgroundColor: '#f8fafc' }}>
                                      <tr>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>Product Info</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>SKU</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>Price</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>Stock</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px', textAlign: 'right' }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {subProducts.map(product => {
                                        const pImage = product.image || (product.images && product.images[0]?.url);
                                        return (
                                        <tr key={product.id}>
                                          <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {pImage ? (
                                                  (pImage.match(/\.(mp4|webm|ogg)$/i) || pImage.startsWith('data:video/') || (product.imageType && product.imageType.startsWith('video/'))) ? (
                                                    <video src={pImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
                                                  ) : (
                                                    <img src={pImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                  )
                                                ) : <ImageIcon size={16} color="#94a3b8" />}
                                              </div>
                                              <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{product.title || product.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{product.brand || 'No Brand'}</div>
                                              </div>
                                            </div>
                                          </td>
                                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{product.sku || product.id}</td>
                                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>৳{product.price || product.salePrice}</td>
                                          <td style={{ padding: '12px 16px', fontSize: '13px', color: product.stock === 0 ? 'red' : 'inherit' }}>{product.stock}</td>
                                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                              <button className="icon-btn" title="Edit" onClick={() => navigate(`/admin/products/add?edit=${product.id}`)}><Edit size={16} /></button>
                                              <button className="icon-btn" style={{ color: 'var(--status-danger)' }} title="Delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                                            </div>
                                          </td>
                                        </tr>
                                      )})}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: 'white', color: '#94a3b8', fontSize: '13px' }}>
                                  No products found in this subcategory.
                                  <div style={{ marginTop: '8px' }}>
                                    <button 
                                      className="btn-outline" 
                                      style={{ padding: '6px 12px', fontSize: '12px' }}
                                      onClick={() => navigate('/admin/products/add')}
                                    >
                                      <Plus size={14} /> Add Product Here
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Uncategorized products for this category (if any product has the category but NO subcategory) */}
                    {(() => {
                      const uncategorizedProducts = getProductsForSubcategory(cat.name, 'Uncategorized');
                      if (uncategorizedProducts.length === 0) return null;
                      const subKey = `${cat.name}-Uncategorized`;
                      const isSubExpanded = expandedSubs[subKey] || searchTerm;

                      return (
                        <div style={{ borderTop: subs.length > 0 ? '1px solid #e2e8f0' : 'none' }}>
                          <div 
                            onClick={() => toggleSubcategory(cat.name, 'Uncategorized')}
                            style={{ 
                              padding: '12px 24px 12px 48px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              backgroundColor: isSubExpanded ? '#fafafa' : 'white',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ color: '#94a3b8' }}>
                                {isSubExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              </div>
                              <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={14} color="#94a3b8" />
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155', fontStyle: 'italic' }}>Other (No Subcategory)</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{uncategorizedProducts.length} Items</span>
                          </div>

                          {isSubExpanded && (
                            <div style={{ padding: '16px 24px 24px 80px', backgroundColor: '#fafafa', borderTop: '1px solid #f1f5f9' }}>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
                                  <table className="admin-table" style={{ margin: 0, width: '100%' }}>
                                    <thead style={{ backgroundColor: '#f8fafc' }}>
                                      <tr>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>Product Info</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>SKU</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px' }}>Price</th>
                                        <th style={{ padding: '12px 16px', fontSize: '12px', textAlign: 'right' }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {uncategorizedProducts.map(product => {
                                        const pImage = product.image || (product.images && product.images[0]?.url);
                                        return (
                                        <tr key={product.id}>
                                          <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {pImage ? (
                                                  (pImage.match(/\.(mp4|webm|ogg)$/i) || pImage.startsWith('data:video/') || (product.imageType && product.imageType.startsWith('video/'))) ? (
                                                    <video src={pImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
                                                  ) : (
                                                    <img src={pImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                  )
                                                ) : <ImageIcon size={16} color="#94a3b8" />}
                                              </div>
                                              <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{product.title || product.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{product.brand || 'No Brand'}</div>
                                              </div>
                                            </div>
                                          </td>
                                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{product.sku || product.id}</td>
                                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>৳{product.price || product.salePrice}</td>
                                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                              <button className="icon-btn" title="Edit" onClick={() => navigate(`/admin/products/add?edit=${product.id}`)}><Edit size={16} /></button>
                                              <button className="icon-btn" style={{ color: 'var(--status-danger)' }} title="Delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                                            </div>
                                          </td>
                                        </tr>
                                      )})}
                                    </tbody>
                                  </table>
                                </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
          
          {activeCategories.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No categories found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
