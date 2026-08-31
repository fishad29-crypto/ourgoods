import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getAllProducts } from '../utils/MockData';

const GlobalShopPage = () => {
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // Filters state
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState('Popularity');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const productList = getAllProducts();
  
  // Filter for Global Shop products
  let globalProducts = productList.filter(p => p.type === 'global' || p.type === 'China Pre-Order' || p.product_type === 'Global Product');
  
  // Fallback if no mock products have the exact global type
  if (globalProducts.length === 0) {
    globalProducts = [...productList];
  }

  // Apply category and price filters
  let filteredProducts = globalProducts.filter(p => {
    let priceVal = 0;
    if (typeof p.price === 'string') {
      priceVal = parseInt(p.price.replace(/[^\d]/g, ''), 10);
    } else if (typeof p.price === 'number') {
      priceVal = p.price;
    }
    
    // Check if product category is array (mock data issue)
    const prodCategories = Array.isArray(p.category) ? p.category : [p.category];
    const matchesCategory = category === 'All' ? true : prodCategories.includes(category);
    
    const matchesPrice = priceVal >= priceRange.min && priceVal <= priceRange.max;
    return matchesCategory && matchesPrice;
  });

  // Apply sorting
  filteredProducts = filteredProducts.sort((a, b) => {
    let priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, ''), 10) : (a.price || 0);
    let priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, ''), 10) : (b.price || 0);
    
    if (sortBy === 'Price: Low to High') return priceA - priceB;
    if (sortBy === 'Price: High to Low') return priceB - priceA;
    if (sortBy === 'Newest') return b.id - a.id;
    return 0; // Default/Popularity
  });

  // Extract flattened categories
  let allCategories = [];
  globalProducts.forEach(p => {
    if (Array.isArray(p.category)) {
      allCategories.push(...p.category);
    } else if (p.category) {
      allCategories.push(p.category);
    }
  });
  const categories = ['All', ...new Set(allCategories)];

  const FilterPanel = () => (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', height: '100%', boxSizing: 'border-box' }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 800 }}>Filters</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700 }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {categories.map(cat => (
            <div 
              key={cat} 
              onClick={() => setCategory(cat)}
              style={{ 
                padding: '8px 12px', 
                cursor: 'pointer', 
                borderRadius: '8px',
                background: category === cat ? 'var(--brand-pink)' : 'transparent',
                color: category === cat ? '#fff' : '#333',
                fontWeight: category === cat ? 700 : 500,
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700 }}>Price Range (৳)</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="number" 
            value={priceRange.min} 
            onChange={(e) => setPriceRange(prev => ({...prev, min: Number(e.target.value) || 0}))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' }}
            placeholder="Min"
          />
          <span style={{ color: '#888' }}>-</span>
          <input 
            type="number" 
            value={priceRange.max} 
            onChange={(e) => setPriceRange(prev => ({...prev, max: Number(e.target.value) || 0}))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' }}
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700 }}>Sort By</h4>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#f9f9f9', cursor: 'pointer' }}
        >
          <option>Popularity</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>
      
      {isMobile && (
        <button 
          onClick={() => setShowMobileFilter(false)}
          style={{ width: '100%', padding: '12px', background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '20px', fontWeight: 700, fontSize: '16px' }}
        >
          Apply Filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '80px', boxSizing: 'border-box' }}>
      
      {/* Standard Header */}
      <div style={{ background: '#fff', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #eaeaea' }}>
        <div onClick={() => navigate(-1)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <i className="las la-arrow-left" style={{ fontSize: '20px' }}></i>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="las la-globe" style={{ color: 'var(--brand-pink)', fontSize: '24px' }}></i>
          <span style={{ fontWeight: 900, fontSize: '18px', color: '#111', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>GLOBAL SHOP</span>
        </div>
      </div>

      <div style={{ padding: isMobile ? '15px' : '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 800, margin: '0 0 4px 0' }}>Collection</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{filteredProducts.length} items found</p>
            </div>
            {isMobile && (
              <button 
                onClick={() => setShowMobileFilter(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}
              >
                <i className="las la-filter"></i> Filter
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
            
            {/* Desktop Sidebar Filter */}
            {!isMobile && (
              <div style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '90px' }}>
                <FilterPanel />
              </div>
            )}

            {/* Product Grid */}
            <div style={{ flex: 1, width: '100%' }}>
              {filteredProducts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? '10px' : '20px' }}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                  <i className="las la-box-open" style={{ fontSize: '64px', color: '#ddd', marginBottom: '15px' }}></i>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '18px' }}>No products found</h3>
                  <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Try adjusting your filters or search criteria.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {isMobile && showMobileFilter && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}>
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: '300px', background: '#fff', animation: 'slideInRight 0.3s forwards', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Filters</h3>
                <i className="las la-times" onClick={() => setShowMobileFilter(false)} style={{ fontSize: '24px', cursor: 'pointer' }}></i>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <FilterPanel />
              </div>
            </div>
          </div>
        )}

      </div>
  );
};

export default GlobalShopPage;
