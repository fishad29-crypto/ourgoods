import React from 'react';
import { useCategories } from '../utils/MockData';

const CategorySubcategories = ({ category }) => {
  const { subcategories: categorySubcategories } = useCategories();
  const allSubs = categorySubcategories[category] || categorySubcategories['Women'] || [];
  const subcategories = allSubs.filter(sub => sub.isActive !== false);

  return (
    <div style={{ padding: '0 15px', marginBottom: '15px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        padding: '15px 10px'
      }}>
        <div 
          className="no-scrollbar"
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, 1fr)',
            gridAutoFlow: 'column',
            gap: '15px 15px',
            justifyItems: 'center',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '5px'
          }}
        >
        {subcategories.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '70px', scrollSnapAlign: 'start' }}>
            <div style={{
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              backgroundImage: `url(${item.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              marginBottom: '6px',
              border: '1px solid #eaeaea',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}></div>
            <div style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#333',
              textAlign: 'center',
              lineHeight: '1.2',
              width: '100%'
            }}>
              {item.name}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySubcategories;
