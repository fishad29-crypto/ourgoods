import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getChoiceProducts } from '../utils/MockData';

const ChoiceSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load top 20 Choice products
    const choiceItems = getChoiceProducts();
    setProducts(choiceItems.slice(0, 20));
  }, []);

  if (products.length === 0) return null;

  return (
    <div style={{ background: '#111', padding: '20px 0', marginBottom: '10px' }}>
      <div style={{ padding: '0 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="las la-crown" style={{ color: '#FFD700' }}></i>
            OURGOODS Choice
          </h2>
          <p style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>Top-rated products selected by OURGOODS.</p>
        </div>
        <button style={{ background: 'transparent', color: '#FFD700', border: 'none', fontSize: '12px', fontWeight: 700 }}>
          View All <i className="las la-angle-right"></i>
        </button>
      </div>

      <div className="no-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '12px', padding: '0 15px', scrollSnapType: 'x mandatory' }}>
        {products.map(product => (
          <div key={product.id} style={{ minWidth: '150px', maxWidth: '150px', scrollSnapAlign: 'start' }}>
            <ProductCard product={product} />
          </div>
        ))}
        
        <div style={{ minWidth: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button style={{ 
            background: 'transparent', 
            border: '1px solid #444', 
            color: '#fff', 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px'
          }}>
            <i className="las la-arrow-right" style={{ fontSize: '24px' }}></i>
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoiceSlider;
