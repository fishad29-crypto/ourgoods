import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronRight, Layers, Image as ImageIcon, Eye, EyeOff, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { useCategories, addCategory, updateCategory, deleteCategory, updateSubcategory, deleteSubcategory, addSubcategory, getAllProducts, useHomepageLayout, updateHomepageLayout } from '../../utils/MockData';
import MediaManagerModal from '../../components/MediaManagerModal';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, subcategories } = useCategories();
  const homepageLayout = useHomepageLayout();
  const [expandedCats, setExpandedCats] = useState({});
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    setLocalProducts(getAllProducts());
  }, []);

  const [addingToCategory, setAddingToCategory] = useState(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubImage, setNewSubImage] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingMediaFor, setEditingMediaFor] = useState(null);

  const handleMediaSelect = (files) => {
    if (files && files.length > 0) {
      const url = files[0].url;
      if (editingMediaFor) {
        if (editingMediaFor.type === 'category_edit') {
          setEditingCategory(prev => ({ ...prev, image: url }));
        } else if (editingMediaFor.type === 'subcategory_edit') {
          setEditingSubcategory(prev => ({ ...prev, img: url }));
        } else if (editingMediaFor.type === 'category') {
          updateCategory(editingMediaFor.catName, { image: url });
        } else if (editingMediaFor.type === 'subcategory') {
          updateSubcategory(editingMediaFor.catName, editingMediaFor.subName, { img: url });
        }
        setEditingMediaFor(null);
      } else {
        setNewSubImage(url);
      }
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

  const [editingCategory, setEditingCategory] = useState(null); // { name: '...', originalName: '...' }
  const [editingSubcategory, setEditingSubcategory] = useState(null); // { catName: '...', originalName: '...', name: '...', img: '...' }

  const handleEditCategory = (cat) => {
    setEditingCategory({ name: cat.name, originalName: cat.name, icon: cat.icon || '', image: cat.image || '' });
  };

  const saveEditCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateCategory(editingCategory.originalName, { 
        name: editingCategory.name.trim(), 
        icon: editingCategory.icon, 
        image: editingCategory.image 
      });
      setEditingCategory(null);
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
    setEditingSubcategory({
      catName: catName,
      originalName: sub.name,
      name: sub.name,
      img: sub.img || ''
    });
  };

  const saveEditSubcategory = () => {
    if (editingSubcategory && editingSubcategory.name.trim()) {
      updateSubcategory(editingSubcategory.catName, editingSubcategory.originalName, { 
        name: editingSubcategory.name.trim(), 
        img: editingSubcategory.img 
      });
      setEditingSubcategory(null);
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Category Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Organize your products into categories and subcategories.</p>
        </div>
        <button 
          onClick={handleAddCategory}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Homepage Layout Visibility</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>Show or hide sections and tabs on the customer storefront.</p>
        
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Main Banners */}
          <div style={{ flex: '1', minWidth: '340px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h4 style={{ margin: '0', fontSize: '15px', color: '#334155', fontWeight: '600' }}>Main Banners</h4>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Order & Visibility</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GripVertical size={16} color="#cbd5e1" style={{ cursor: 'grab' }} />
                  <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>Hero Slider (Homepage)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', padding: '4px' }}>
                      <ArrowUp size={16} />
                    </button>
                    <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', padding: '4px' }}>
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div 
                    onClick={() => updateHomepageLayout({ heroSlider: !homepageLayout.heroSlider })}
                    style={{
                      width: '40px', height: '22px', borderRadius: '11px', 
                      backgroundColor: homepageLayout.heroSlider ? '#db2777' : '#cbd5e1', 
                      position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff',
                      position: 'absolute', top: '2px', left: homepageLayout.heroSlider ? '20px' : '2px',
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
              </div>

              {categories.map((cat) => {
                const isVisible = homepageLayout.categoryHeroSliders?.[cat.name] !== false;
                return (
                  <div key={`hero-slider-${cat.name}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <GripVertical size={16} color="#cbd5e1" style={{ cursor: 'grab' }} />
                      <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>Hero Slider ({cat.name})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', padding: '4px' }}>
                          <ArrowUp size={16} />
                        </button>
                        <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', padding: '4px' }}>
                          <ArrowDown size={16} />
                        </button>
                      </div>
                      <div 
                        onClick={() => updateHomepageLayout({ 
                          categoryHeroSliders: { 
                            ...(homepageLayout.categoryHeroSliders || {}), 
                            [cat.name]: !isVisible 
                          } 
                        })}
                        style={{
                          width: '40px', height: '22px', borderRadius: '11px', 
                          backgroundColor: isVisible ? '#db2777' : '#cbd5e1', 
                          position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                        }}
                      >
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff',
                          position: 'absolute', top: '2px', left: isVisible ? '20px' : '2px',
                          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {(homepageLayout.sections || []).map((section, idx) => (
                <div key={section.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <GripVertical size={16} color="#cbd5e1" style={{ cursor: 'grab' }} />
                    <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>{section.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => {
                        if (idx > 0) {
                          const newSections = [...homepageLayout.sections];
                          [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
                          updateHomepageLayout({ sections: newSections });
                        }
                      }} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#cbd5e1' : '#64748b', padding: '4px' }}>
                        <ArrowUp size={16} />
                      </button>
                      <button onClick={() => {
                        if (idx < homepageLayout.sections.length - 1) {
                          const newSections = [...homepageLayout.sections];
                          [newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]];
                          updateHomepageLayout({ sections: newSections });
                        }
                      }} disabled={idx === homepageLayout.sections.length - 1} style={{ background: 'none', border: 'none', cursor: idx === homepageLayout.sections.length - 1 ? 'not-allowed' : 'pointer', color: idx === homepageLayout.sections.length - 1 ? '#cbd5e1' : '#64748b', padding: '4px' }}>
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div 
                      onClick={() => {
                        const newSections = [...homepageLayout.sections];
                        newSections[idx].visible = !newSections[idx].visible;
                        updateHomepageLayout({ sections: newSections });
                      }}
                      style={{
                        width: '40px', height: '22px', borderRadius: '11px', 
                        backgroundColor: section.visible ? '#db2777' : '#cbd5e1', 
                        position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff',
                        position: 'absolute', top: '2px', left: section.visible ? '20px' : '2px',
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Discover Tabs */}
          <div style={{ flex: '1', minWidth: '340px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h4 style={{ margin: '0', fontSize: '15px', color: '#334155', fontWeight: '600' }}>Daily Discover Tabs</h4>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Order & Visibility</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(homepageLayout.tabs || []).map((tab, idx) => (
                <div key={tab.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <GripVertical size={14} color="#cbd5e1" style={{ cursor: 'grab' }} />
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{tab.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button onClick={() => {
                        if (idx > 0) {
                          const newTabs = [...homepageLayout.tabs];
                          [newTabs[idx - 1], newTabs[idx]] = [newTabs[idx], newTabs[idx - 1]];
                          updateHomepageLayout({ tabs: newTabs });
                        }
                      }} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#cbd5e1' : '#64748b', padding: '2px' }}>
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => {
                        if (idx < homepageLayout.tabs.length - 1) {
                          const newTabs = [...homepageLayout.tabs];
                          [newTabs[idx + 1], newTabs[idx]] = [newTabs[idx], newTabs[idx + 1]];
                          updateHomepageLayout({ tabs: newTabs });
                        }
                      }} disabled={idx === homepageLayout.tabs.length - 1} style={{ background: 'none', border: 'none', cursor: idx === homepageLayout.tabs.length - 1 ? 'not-allowed' : 'pointer', color: idx === homepageLayout.tabs.length - 1 ? '#cbd5e1' : '#64748b', padding: '2px' }}>
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <div 
                      onClick={() => {
                        const newTabs = [...homepageLayout.tabs];
                        newTabs[idx].visible = !newTabs[idx].visible;
                        updateHomepageLayout({ tabs: newTabs });
                      }}
                      style={{
                        width: '32px', height: '18px', borderRadius: '9px', 
                        backgroundColor: tab.visible ? '#db2777' : '#cbd5e1', 
                        position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{
                        width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff',
                        position: 'absolute', top: '2px', left: tab.visible ? '16px' : '2px',
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-bar" style={{ width: '300px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
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
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                backgroundColor: '#fff', 
                opacity: isActive ? 1 : 0.6
              }}>
                {/* Category Header */}
                <div 
                  onClick={() => { if (!editingCategory) toggleExpand(cat.name); }}
                  style={{ 
                    padding: '16px 24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: editingCategory?.originalName === cat.name ? 'default' : 'pointer',
                    backgroundColor: isCatExpanded ? '#f8fafc' : '#fff',
                    borderBottom: isCatExpanded ? '1px solid #e2e8f0' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {editingCategory && editingCategory.originalName === cat.name ? (
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                      <div 
                        onClick={(e) => { e.stopPropagation(); setEditingMediaFor({ type: 'category_edit' }); setShowMediaModal(true); }}
                        style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        title="Click to change category image"
                      >
                        {editingCategory.image ? <img src={editingCategory.image} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Icon" /> : <ImageIcon size={20} color="#94a3b8" />}
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                          <Edit size={16} color="#fff" />
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={editingCategory.name} 
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', flex: 1, fontSize: '14px' }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      <button style={{ padding: '6px 16px', fontSize: '13px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); saveEditCategory(); }}>Save</button>
                      <button style={{ padding: '6px 16px', fontSize: '13px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setEditingCategory(null); }}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div 
                          onClick={(e) => { e.stopPropagation(); setEditingMediaFor({ type: 'category', catName: cat.name }); setShowMediaModal(true); }}
                          style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                          title="Click to change category image"
                        >
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            cat.icon ? <i className={cat.icon} style={{ fontSize: '20px', color: '#db2777' }}></i> : <Layers size={18} color="#94a3b8" />
                          )}
                          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                            <Edit size={16} color="#fff" />
                          </div>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{cat.name}</h3>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontSize: '13px', color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '16px', fontWeight: 500 }}>
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
                            backgroundColor: isActive ? '#dcfce7' : '#fef2f2',
                            color: isActive ? '#16a34a' : '#ef4444',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isActive ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                        </button>
                        
                        <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Edit Category" onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}><Edit size={16} /></button>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete Category" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </>
                  )}
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
                              backgroundColor: '#fff',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            {editingSubcategory && editingSubcategory.originalName === sub.name && editingSubcategory.catName === cat.name ? (
                              <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                                <div 
                                  onClick={(e) => { e.stopPropagation(); setEditingMediaFor({ type: 'subcategory_edit' }); setShowMediaModal(true); }}
                                  style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                  title="Select Icon/Image"
                                >
                                  {editingSubcategory.img ? <img src={editingSubcategory.img} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Icon" /> : <ImageIcon size={16} color="#94a3b8" />}
                                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                                    <Edit size={14} color="#fff" />
                                  </div>
                                </div>
                                <input 
                                  type="text" 
                                  value={editingSubcategory.name} 
                                  onChange={(e) => setEditingSubcategory({...editingSubcategory, name: e.target.value})}
                                  style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', flex: 1, fontSize: '13px' }}
                                  autoFocus
                                />
                                <button style={{ padding: '4px 12px', fontSize: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={saveEditSubcategory}>Save</button>
                                <button style={{ padding: '4px 12px', fontSize: '12px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setEditingSubcategory(null)}>Cancel</button>
                              </div>
                            ) : (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <div 
                                    onClick={(e) => { e.stopPropagation(); setEditingMediaFor({ type: 'subcategory', catName: cat.name, subName: sub.name }); setShowMediaModal(true); }}
                                    style={{ position: 'relative', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0' }}
                                    title="Click to change subcategory image"
                                  >
                                    {sub.img ? (
                                      <img src={sub.img} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Layers size={14} color="#94a3b8" />
                                      </div>
                                    )}
                                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                                      <Edit size={14} color="#fff" />
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155', textDecoration: isSubActive ? 'none' : 'line-through' }}>{sub.name}</span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                  <span style={{ fontSize: '13px', color: '#64748b' }}>{subProductsCount} Items</span>
                                  
                                  <button
                                    onClick={() => toggleSubcategoryStatus(cat.name, sub)}
                                    style={{
                                      padding: '4px 12px',
                                      borderRadius: '20px',
                                      border: 'none',
                                      fontSize: '11px',
                                      fontWeight: 'bold',
                                      cursor: 'pointer',
                                      backgroundColor: isSubActive ? '#dcfce7' : '#fef2f2',
                                      color: isSubActive ? '#16a34a' : '#ef4444',
                                      transition: 'all 0.2s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    {isSubActive ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                                  </button>
                                  
                                  <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Edit Subcategory" onClick={() => handleEditSubcategory(cat.name, sub)}><Edit size={16} /></button>
                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete Subcategory" onClick={() => handleDeleteSubcategory(cat.name, sub)}><Trash2 size={16} /></button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Subcategory Inline UI */}
                    <div style={{ 
                      padding: '16px 24px 24px 48px', 
                      backgroundColor: '#f8fafc', 
                      borderTop: subs.length > 0 ? '1px solid #f1f5f9' : 'none' 
                    }}>
                      {!addingToCategory || addingToCategory !== cat.name ? (
                        <button 
                          onClick={() => setAddingToCategory(cat.name)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#db2777', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                        >
                          <Plus size={16} /> Add Subcategory
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
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
                            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', flex: 1, fontSize: '13px' }}
                            autoFocus
                          />
                          <button style={{ padding: '6px 16px', fontSize: '13px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => submitAddSubcategory(cat.name)}>Save</button>
                          <button style={{ padding: '6px 16px', fontSize: '13px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }} onClick={() => { setAddingToCategory(null); setNewSubName(''); setNewSubImage(''); }}>Cancel</button>
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
          onClose={() => { setShowMediaModal(false); setEditingMediaFor(null); }}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
};

export default Categories;
