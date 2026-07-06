import React, { useState, useEffect, useRef } from 'react';
import { categorySubcategories } from './CategorySubcategories';

const allCategories = [
  // Regular Categories
  { id: 1, name: 'Women', icon: 'las la-female', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=90&w=150' },
  { id: 3, name: 'Jewelry & Accessories', icon: 'las la-gem', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=90&w=150' },
  { id: 4, name: 'Purse & Bags', icon: 'las la-shopping-bag', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=90&w=150' },
  { id: 5, name: 'Sneakers & Shoes', icon: 'las la-shoe-prints', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=150' },
  { id: 6, name: 'Beauty & Health', icon: 'las la-spa', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=90&w=150' },
  { id: 7, name: 'Home & Decor', icon: 'las la-home', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=90&w=150' }
];

const AllCategorySection = ({ onCategorySelect, onClose }) => {
  const [activeCat, setActiveCat] = useState(allCategories[0].name);
  const sectionRefs = useRef({});
  const isClickingRef = useRef(false);

  const handleCategoryClick = (catName) => {
    setActiveCat(catName);
    isClickingRef.current = true;
    const element = sectionRefs.current[catName];
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 106;
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      setTimeout(() => {
        isClickingRef.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (isClickingRef.current) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCat(entry.target.getAttribute('data-cat'));
        }
      });
    }, {
      rootMargin: '-107px 0px -70% 0px',
      threshold: 0
    });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div className="content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ 
          padding: '15px', 
          borderBottom: '1px solid #eaeaea', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#fcfcfc',
          position: 'sticky',
          top: '56px',
          zIndex: 900,
          height: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111', margin: 0 }}>
              All Categories
            </h2>
          </div>
          
          {/* Close Button */}
          {onClose && (
            <div onClick={onClose} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-pink)', color: '#fff', transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(228, 50, 146, 0.25)' }}>
              <i className="las la-times" style={{ fontSize: '20px', fontWeight: 'bold' }}></i>
            </div>
          )}
        </div>

        {/* Split View */}
        <div style={{ display: 'flex', flex: 1, background: '#f7f7f7' }}>
          
          {/* Left Sidebar */}
          <div className="no-scrollbar" style={{ 
            width: '135px', 
            flexShrink: 0, 
            background: '#f7f7f7', 
            position: 'sticky', 
            top: '106px',
            height: 'calc(100vh - 106px - 80px)',
            overflowY: 'auto' 
          }}>
            {allCategories.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat.name)}
                style={{
                  padding: '10px',
                  fontSize: '11px',
                  color: activeCat === cat.name ? '#fff' : '#333',
                  fontWeight: activeCat === cat.name ? 800 : 500,
                  background: activeCat === cat.name ? 'var(--brand-pink)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  borderRadius: '0 8px 8px 0',
                  marginRight: '8px'
                }}
              >
                {cat.icon && <i className={cat.icon} style={{ fontSize: '16px', color: activeCat === cat.name ? '#fff' : '#666' }}></i>}
                <span style={{ lineHeight: '1.2' }}>{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Right Content */}
          <div style={{ flex: 1, padding: '0 15px 80px 15px', background: '#fff' }}>
             {allCategories.map(cat => (
               <div key={cat.id} ref={el => sectionRefs.current[cat.name] = el} data-cat={cat.name} style={{ marginBottom: '30px' }}>
                 {/* Subcategories Grid Header */}
                 <div style={{ 
                   display: 'flex', 
                   justifyContent: 'space-between', 
                   alignItems: 'center', 
                   marginBottom: '20px',
                   position: 'sticky',
                   top: '106px',
                   background: '#fff',
                   zIndex: 800,
                   padding: '10px 0',
                   borderBottom: '1px solid #eaeaea'
                 }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#111' }}>{cat.name}</h3>
                    <div onClick={() => onCategorySelect && onCategorySelect(cat.name)} style={{ fontSize: '11px', color: 'var(--brand-pink)', fontWeight: 'bold', cursor: 'pointer' }}>
                      View All <i className="las la-angle-right"></i>
                    </div>
                 </div>

                 {/* Subcategories Grid */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 15px' }}>
                    {(categorySubcategories[cat.name] || []).map((sub, i) => (
                       <div key={i} onClick={() => onCategorySelect && onCategorySelect(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <img src={sub.img} alt={sub.name} style={{ width: '100%', maxWidth: '65px', aspectRatio: '1/1', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} />
                          <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: '600', color: '#444', lineHeight: '1.2' }}>{sub.name}</span>
                       </div>
                    ))}
                 </div>
               </div>
             ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AllCategorySection;
