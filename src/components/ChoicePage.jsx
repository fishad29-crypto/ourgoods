import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getChoiceProducts } from '../utils/MockData';

const ChoicePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Recommended');

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scroll_${window.location.pathname}`);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem(`scroll_${window.location.pathname}`);
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
    const choiceItems = getChoiceProducts();
    setProducts(choiceItems);
    setFilteredProducts(choiceItems);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    switch (sort) {
      case 'Recommended':
        result.sort((a, b) => b.choiceScore - a.choiceScore);
        break;
      case 'Best Selling':
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'Highest Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        // Mock newest by random
        result.sort(() => 0.5 - Math.random());
        break;
      case 'Price Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Most Discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'Most Reviewed':
        // Approximation of reviews based on soldCount
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [category, sort, products]);

  const categories = ['All', 'Home', 'Women', 'Jewelry & Accessories', 'Purse & Bags', 'Sneakers & Shoes', 'Beauty & Health', 'Combo Deals'];
  const sorts = ['Recommended', 'Best Selling', 'Highest Rated', 'Newest', 'Price Low to High', 'Price High to Low', 'Most Discount', 'Most Reviewed'];

  return (
    <div className="content-container" style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '30px' }}>
      
      {/* Header */}
      <div style={{ background: '#111', color: '#fff', padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '28px' }}>
          <i className="las la-crown" style={{ color: '#FFD700' }}></i> OURGOODS Choice
        </h1>
        <p style={{ color: '#ccc', fontSize: '14px', marginTop: '10px', maxWidth: '400px', margin: '10px auto 0' }}>
          Handpicked products with the best quality, ratings, value, and delivery.
        </p>
      </div>

      {/* Filters & Sorting */}
      <div style={{ background: '#fff', padding: '15px', position: 'sticky', top: '50px', zIndex: 99, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '15px' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid ' + (category === c ? '#111' : '#ddd'),
              background: category === c ? '#111' : '#fff',
              color: category === c ? '#fff' : '#333',
              fontSize: '13px',
              whiteSpace: 'nowrap'
            }}>
              {c}
            </button>
          ))}
        </div>

        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#666', paddingRight: '10px' }}>
            <i className="las la-sort"></i> Sort by:
          </div>
          {sorts.map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: 'none',
              background: sort === s ? '#f0f0f0' : 'transparent',
              color: sort === s ? 'var(--brand-pink)' : '#666',
              fontSize: '12px',
              fontWeight: sort === s ? 700 : 500,
              whiteSpace: 'nowrap'
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ padding: '20px 15px' }}>
        <div style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
          Showing <strong>{filteredProducts.length}</strong> premium choice products
        </div>
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ChoicePage;
