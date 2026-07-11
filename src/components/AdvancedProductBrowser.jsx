import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { generateProducts } from '../utils/MockData';
import { useCategories } from '../utils/MockData';

const AdvancedProductBrowser = ({ tabLabel = 'All Products' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest'); // newest, price_asc, price_desc, rating
  
  // Mobile Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch all products for this tab to allow client-side filtering and sorting
    const categoryToFetch = tabLabel === 'All Products' ? 'All' : tabLabel;
    const fetchedProds = generateProducts(categoryToFetch, 500);
    setProducts(fetchedProds);
    setLoading(false);
  }, [tabLabel]);

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        const pCats = Array.isArray(p.category) ? p.category : (p.category ? p.category.split(', ') : []);
        // Check if any selected category matches product categories
        return selectedCategories.some(cat => pCats.includes(cat) || p.category === cat);
      });
    }

    // Filter by Price Range
    if (priceRange.min !== '') {
      result = result.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategories, priceRange, sortBy]);

  // Extract categories except 'All Products' for the filter sidebar
  const { categories: allCategories } = useCategories();
  const filterCategories = allCategories.filter(c => c.name !== 'All Products');

  const FilterContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Categories Filter */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#111' }}>Categories</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filterCategories.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#444' }}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat.name)}
                onChange={() => handleCategoryToggle(cat.name)}
                style={{ accentColor: 'var(--brand-pink)' }}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#111' }}>Price Range (৳)</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Min" 
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
          />
          <span style={{ color: '#888' }}>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
          />
        </div>
      </div>
      
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <i className="las la-spinner la-spin text-pink" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }} className="no-scrollbar">
      <div style={{ display: 'flex', gap: '20px', padding: '15px 15px' }}>
        
        {/* Desktop Sidebar */}
      <div className="hide-on-mobile" style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #eaeaea', paddingRight: '15px' }}>
        <div style={{ position: 'sticky', top: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="las la-filter" style={{ color: 'var(--brand-pink)' }}></i> Filters
            </h3>
            {(selectedCategories.length > 0 || priceRange.min || priceRange.max) && (
              <span 
                onClick={() => { setSelectedCategories([]); setPriceRange({min: '', max: ''}); }}
                style={{ fontSize: '12px', color: 'var(--brand-pink)', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear All
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Bar (Sorting & Mobile Filter Button) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Showing <strong>{filteredAndSortedProducts.length}</strong> products
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="hide-on-desktop" onClick={() => setIsFilterOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}>
              <i className="las la-filter" style={{ color: 'var(--brand-pink)' }}></i> Filters
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="product-grid">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <i className="las la-search" style={{ fontSize: '40px', marginBottom: '10px', color: '#ccc' }}></i>
            <h3 style={{ fontSize: '16px', margin: 0 }}>No products found</h3>
            <p style={{ fontSize: '13px', marginTop: '5px' }}>Try adjusting your filters.</p>
          </div>
        )}

      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setIsFilterOpen(false)}></div>
          <div style={{ backgroundColor: '#fff', height: '70vh', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Filters</h3>
              <i className="las la-times" onClick={() => setIsFilterOpen(false)} style={{ fontSize: '20px', cursor: 'pointer' }}></i>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <FilterContent />
            </div>
            
            <div style={{ padding: '15px 20px', borderTop: '1px solid #eaeaea', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => { setSelectedCategories([]); setPriceRange({min: '', max: ''}); }}
                style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '8px', fontWeight: 600, color: '#333' }}
              >
                Clear
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                style={{ flex: 2, padding: '10px', backgroundColor: 'var(--brand-pink)', border: 'none', borderRadius: '8px', fontWeight: 600, color: '#fff' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default AdvancedProductBrowser;
