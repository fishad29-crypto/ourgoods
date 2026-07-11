import React, { useState } from 'react';
import { Search, Plus, Trash2, ChevronDown, ChevronRight, Image as ImageIcon, Edit2, MoreHorizontal } from 'lucide-react';
import { 
  useCategories,
  addCategory, 
  updateCategory,
  deleteCategory, 
  addSubcategory, 
  updateSubcategory,
  deleteSubcategory 
} from '../../utils/MockData';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, subcategories } = useCategories();
  const [activeTab, setActiveTab] = useState('categories');
  const [expandedCats, setExpandedCats] = useState({});

  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddSub, setShowAddSub] = useState(null);
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  
  const [newSubName, setNewSubName] = useState('');
  const [newSubImg, setNewSubImg] = useState('');

  const [editCat, setEditCat] = useState(null);
  const [editSub, setEditSub] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleExpand = (catName) => {
    setExpandedCats(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const handleAddCategory = () => {
    if (!newCatName) return alert('Category Name is required!');
    addCategory({ name: newCatName, image: newCatImg || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=150'
    });
    setNewCatName('');
    setNewCatIcon('');
    setNewCatImg('');
    setShowAddCat(false);
  };

  const handleUpdateCategory = () => {
    if (!editCat.name) return alert('Category Name is required!');
    updateCategory(editCat.oldName, { name: editCat.name, icon: editCat.icon, image: editCat.img || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=150' });
    setEditCat(null);
  };

  const handleDeleteCategory = (catName) => {
    if (window.confirm(`Are you sure you want to delete "${catName}"? This will also delete all subcategories inside it.`)) {
      deleteCategory(catName);
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubName) return alert('Subcategory Name is required!');
    addSubcategory(showAddSub, { name: newSubName, img: newSubImg || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=150'
    });
    setNewSubName('');
    setNewSubImg('');
    setShowAddSub(null);
  };

  const handleUpdateSubcategory = () => {
    if (!editSub.name) return alert('Subcategory Name is required!');
    updateSubcategory(editSub.parentCat, editSub.oldName, { name: editSub.name, img: editSub.img || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=150' });
    setEditSub(null);
  };

  const handleDeleteSubcategory = (catName, subName) => {
    if (window.confirm(`Are you sure you want to delete "${subName}" from "${catName}"?`)) {
      deleteSubcategory(catName, subName);
    }
  };

  return (
    <div className="admin-content" style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '32px' }} onClick={() => setOpenDropdown(null)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            Categories <span style={{ color: '#94a3b8', fontSize: '24px', fontWeight: 'normal' }}>{categories.length}</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Organize your products and manage how they're displayed. <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Learn how</a>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 16px 10px 38px', borderRadius: '24px', border: '1px solid #e2e8f0', outline: 'none', width: '200px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            />
          </div>
          <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '24px', padding: '10px 20px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }} onClick={() => activeTab === 'categories' ? setShowAddCat(true) : (categories.length === 0 ? alert('Add a category first!') : setShowAddSub(categories[0].name))}>
            <Plus size={18} /> New {activeTab === 'categories' ? 'Category' : 'Subcategory'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ padding: '12px 0', border: 'none', background: 'none', fontSize: '15px', fontWeight: activeTab === 'categories' ? 600 : 500, color: activeTab === 'categories' ? '#1e293b' : '#64748b', borderBottom: activeTab === 'categories' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('subcategories')}
          style={{ padding: '12px 0', border: 'none', background: 'none', fontSize: '15px', fontWeight: activeTab === 'subcategories' ? 600 : 500, color: activeTab === 'subcategories' ? '#1e293b' : '#64748b', borderBottom: activeTab === 'subcategories' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Subcategories
        </button>
      </div>

      {activeTab === 'categories' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredCategories.map(cat => {
            const subs = subcategories[cat.name] || [];
            return (
              <div key={cat.id} style={{ 
                height: '240px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                position: 'relative', 
                backgroundImage: cat.image ? `url(${cat.image})` : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)' }}></div>
                
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span style={{ backgroundColor: '#22c55e', color: 'white', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>ACTIVE</span>
                </div>

                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === `cat-${cat.name}` ? null : `cat-${cat.name}`); }} style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8 }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                    <MoreHorizontal size={24} />
                  </button>
                  
                  {openDropdown === `cat-${cat.name}` && (
                    <div style={{ position: 'absolute', top: '30px', right: 0, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', width: '160px', zIndex: 10, overflow: 'hidden' }}>
                      <button style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#334155' }} onClick={(e) => { e.stopPropagation(); setEditCat({ oldName: cat.name, name: cat.name, icon: cat.icon || '', img: cat.image || '' }); setOpenDropdown(null); }}>Edit Category</button>
                      <button style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#334155' }} onClick={(e) => { e.stopPropagation(); setShowAddSub(cat.name); setOpenDropdown(null); }}>Add Subcategory</button>
                      <button style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#ef4444' }} onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.name); setOpenDropdown(null); }}>Delete Category</button>
                    </div>
                  )}
                </div>

                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'white' }}>
                  <div style={{ fontSize: '20px', fontWeight: 500 }}>{cat.name}</div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>{subs.length}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {Object.entries(subcategories)
            .flatMap(([parentName, subs]) => subs.map(s => ({ ...s, parentName })))
            .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || sub.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((sub, idx) => (
              <div key={idx} style={{ 
                height: '240px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                position: 'relative', 
                backgroundImage: sub.img ? `url(${sub.img})` : 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)' }}></div>
                
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span style={{ backgroundColor: '#22c55e', color: 'white', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>ACTIVE</span>
                </div>

                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === `sub-${sub.name}` ? null : `sub-${sub.name}`); }} style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8 }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                    <MoreHorizontal size={24} />
                  </button>
                  
                  {openDropdown === `sub-${sub.name}` && (
                    <div style={{ position: 'absolute', top: '30px', right: 0, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', width: '160px', zIndex: 10, overflow: 'hidden' }}>
                      <button style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#334155' }} onClick={(e) => { e.stopPropagation(); setEditSub({ parentCat: sub.parentName, oldName: sub.name, name: sub.name, img: sub.img || '' }); setOpenDropdown(null); }}>Edit Subcategory</button>
                      <button style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#ef4444' }} onClick={(e) => { e.stopPropagation(); handleDeleteSubcategory(sub.parentName, sub.name); setOpenDropdown(null); }}>Delete Subcategory</button>
                    </div>
                  )}
                </div>

                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', color: 'white' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>{sub.parentName}</div>
                  <div style={{ fontSize: '20px', fontWeight: 500 }}>{sub.name}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
      {showAddCat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--admin-surface)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Add Category</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Category Name *</label>
              <input type="text" className="form-control" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="e.g. Electronics" />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Icon Class (Optional)</label>
              <input type="text" className="form-control" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} placeholder="e.g. las la-laptop" />
              <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Uses LineAwesome icon classes.</div>
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Image URL (Optional)</label>
              <input type="text" className="form-control" value={newCatImg} onChange={(e) => setNewCatImg(e.target.value)} placeholder="https://..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setShowAddCat(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddCategory}>Save Category</button>
            </div>
          </div>
        </div>
      )}

      {showAddSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--admin-surface)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Add Subcategory to {showAddSub}</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Subcategory Name *</label>
              <input type="text" className="form-control" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} placeholder="e.g. Smartphones" />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Image URL (Optional)</label>
              <input type="text" className="form-control" value={newSubImg} onChange={(e) => setNewSubImg(e.target.value)} placeholder="https://..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setShowAddSub(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddSubcategory}>Save Subcategory</button>
            </div>
          </div>
        </div>
      )}

      {editCat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--admin-surface)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Edit Category</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Category Name *</label>
              <input type="text" className="form-control" value={editCat.name} onChange={(e) => setEditCat({...editCat, name: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Icon Class (Optional)</label>
              <input type="text" className="form-control" value={editCat.icon} onChange={(e) => setEditCat({...editCat, icon: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Image URL (Optional)</label>
              <input type="text" className="form-control" value={editCat.img} onChange={(e) => setEditCat({...editCat, img: e.target.value})} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setEditCat(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateCategory}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {editSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--admin-surface)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Edit Subcategory</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Subcategory Name *</label>
              <input type="text" className="form-control" value={editSub.name} onChange={(e) => setEditSub({...editSub, name: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Image URL (Optional)</label>
              <input type="text" className="form-control" value={editSub.img} onChange={(e) => setEditSub({...editSub, img: e.target.value})} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setEditSub(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateSubcategory}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
