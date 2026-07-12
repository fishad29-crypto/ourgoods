import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronRight, Layers, Image as ImageIcon } from 'lucide-react';
import { useCategories, addCategory, updateCategory, deleteCategory, updateSubcategory, deleteSubcategory, addSubcategory, getAllProducts } from '../../utils/MockData';
import MediaManagerModal from '../../components/MediaManagerModal';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, subcategories } = useCategories();
  const [expandedCats, setExpandedCats] = useState({});
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    setLocalProducts(getAllProducts());
  }, []);

  const [addingToCategory, setAddingToCategory] = useState(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubImage, setNewSubImage] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);

  const handleMediaSelect = (files) => {
    if (files && files.length > 0) {
      setNewSubImage(files[0].url);
    }
    setShowMediaModal(false);
  };

  const toggleExpand = (catName) => {
    setExpandedCats(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const filtered = categories
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => c.id !== -1 && c.name !== 'All Products')
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddCategory = () => {
    const name = window.prompt("Enter new category name:");
    if (name) {
      addCategory({ name, icon: 'las la-box' });
    }
  };

  const handleEditCategory = (cat) => {
    const name = window.prompt("Edit category name:", cat.name);
    if (name && name !== cat.name) {
      updateCategory(cat.name, { name });
    }
  };

  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.name);
    }
  };

  const toggleCategoryStatus = (cat) => {
    updateCategory(cat.name, { isActive: cat.isActive === false ? true : false });
  };

  const toggleSubcategoryStatus = (catName, sub) => {
    updateSubcategory(catName, sub.name, { isActive: sub.isActive === false ? true : false });
  };

  const handleEditSubcategory = (catName, sub) => {
    const name = window.prompt(`Edit subcategory name for "${sub.name}":`, sub.name);
    if (name && name !== sub.name) {
      const img = window.prompt("Edit subcategory image URL:", sub.img || '');
      updateSubcategory(catName, sub.name, { name, img: img || sub.img });
    }
  };

  const handleDeleteSubcategory = (catName, sub) => {
    if (window.confirm(`Are you sure you want to delete "${sub.name}"?`)) {
      deleteSubcategory(catName, sub.name);
    }
  };

  const submitAddSubcategory = (catName) => {
    if (newSubName.trim()) {
      addSubcategory(catName, { name: newSubName.trim(), img: newSubImage || '', isActive: true });
      setAddingToCategory(null);
      setNewSubName('');
      setNewSubImage('');
    }
  };

  const handleEditCategoryIcon = (e, cat) => {
    e.stopPropagation();
    const icon = window.prompt("Edit category icon class (e.g. las la-home):", cat.icon || '');
    if (icon !== null) {
      updateCategory(cat.name, { icon });
    }
  };

  // Helper to count products
  const getProductsCountForSub = (catName, subName) => {
    return localProducts.filter(p => {
      const matchCat = Array.isArray(p.category) ? p.category.includes(catName) : p.category === catName;
      const matchSub = Array.isArray(p.subcategory) ? p.subcategory.includes(subName) : p.subcategory === subName;
      return matchCat && (matchSub || (!p.subcategory && subName === 'Uncategorized'));
    }).length;
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2 className="page-title">Category Management</h2>
        <button className="btn-primary" onClick={handleAddCategory}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="table-container" style={{ padding: '24px', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-search" style={{ width: '300px', backgroundColor: 'white' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(cat => {
            const subs = [...(subcategories[cat.name] || [])].sort((a, b) => a.name.localeCompare(b.name));
            const catProducts = localProducts.filter(p => Array.isArray(p.category) ? p.category.includes(cat.name) : p.category === cat.name);
            const isCatExpanded = expandedCats[cat.name] || searchTerm;
            const isActive = cat.isActive !== false;

            return (
              <div key={cat.id} style={{ 
                border: '1px solid var(--admin-border)', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                backgroundColor: 'white', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                opacity: isActive ? 1 : 0.6
              }}>
                {/* Category Header */}
                <div 
                  onClick={() => toggleExpand(cat.name)}
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
                    {cat.icon && <i className={cat.icon} style={{ fontSize: '20px', color: 'var(--brand-pink)' }}></i>}
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>{cat.name}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '16px', fontWeight: 500 }}>
                      {catProducts.length} Products
                    </span>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleCategoryStatus(cat); }}
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'var(--status-success)' : '#f1f5f9',
                        color: isActive ? 'white' : '#64748b',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </button>
                    
                    <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                      <button className="icon-btn" title="Edit Category" onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}><Edit size={16} /></button>
                      <button className="icon-btn" style={{ color: 'var(--status-danger)' }} title="Delete Category" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>

                {/* Subcategories List */}
                {isCatExpanded && (
                  <div style={{ padding: '0' }}>
                    {subs.map((sub, idx) => {
                      const subProductsCount = getProductsCountForSub(cat.name, sub.name);
                      const isSubActive = sub.isActive !== false;

                      return (
                        <div key={idx} style={{ 
                          borderBottom: idx < subs.length - 1 ? '1px solid #f1f5f9' : 'none',
                          opacity: isSubActive ? 1 : 0.6
                        }}>
                          <div 
                            style={{ 
                              padding: '12px 24px 12px 48px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              backgroundColor: 'white',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              {sub.img ? (
                                <img src={sub.img} alt={sub.name} style={{ width: '30px', height: '30px', borderRadius: '6px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Layers size={14} color="#94a3b8" />
                                </div>
                              )}
                              <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155', textDecoration: isSubActive ? 'none' : 'line-through' }}>{sub.name}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>{subProductsCount} Items</span>
                              
                              <button
                                onClick={() => toggleSubcategoryStatus(cat.name, sub)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  backgroundColor: isSubActive ? 'var(--status-success)' : '#f1f5f9',
                                  color: isSubActive ? 'white' : '#64748b',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {isSubActive ? 'ON' : 'OFF'}
                              </button>
                              
                              <div style={{ display: 'flex', gap: '12px', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                                <button className="icon-btn" title="Edit Subcategory" onClick={() => handleEditSubcategory(cat.name, sub)}><Edit size={16} /></button>
                                <button className="icon-btn" style={{ color: 'var(--status-danger)' }} title="Delete Subcategory" onClick={() => handleDeleteSubcategory(cat.name, sub)}><Trash2 size={16} /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Subcategory Inline UI */}
                    <div style={{ 
                      padding: '16px 24px 24px 48px', 
                      backgroundColor: '#fafafa', 
                      borderTop: subs.length > 0 ? '1px solid #f1f5f9' : 'none' 
                    }}>
                      {!addingToCategory || addingToCategory !== cat.name ? (
                        <button 
                          onClick={() => setAddingToCategory(cat.name)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--brand-pink)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                        >
                          <Plus size={16} /> Add Subcategory
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', maxWidth: '600px' }}>
                          <div 
                            onClick={() => setShowMediaModal(true)} 
                            style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            title="Select Icon/Image"
                          >
                            {newSubImage ? <img src={newSubImage} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Icon" /> : <ImageIcon size={20} color="#94a3b8" />}
                          </div>
                          <input 
                            type="text" 
                            placeholder="Enter Subcategory Name" 
                            value={newSubName} 
                            onChange={(e) => setNewSubName(e.target.value)} 
                            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', flex: 1, fontSize: '13px' }}
                            autoFocus
                          />
                          <button className="btn-primary" onClick={() => submitAddSubcategory(cat.name)} style={{ padding: '6px 16px', fontSize: '13px' }}>Save</button>
                          <button className="btn-outline" onClick={() => { setAddingToCategory(null); setNewSubName(''); setNewSubImage(''); }} style={{ padding: '6px 16px', fontSize: '13px' }}>Cancel</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No categories found.</div>
          )}
        </div>
      </div>
      
      {showMediaModal && (
        <MediaManagerModal 
          onClose={() => setShowMediaModal(false)}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
};

export default Categories;
