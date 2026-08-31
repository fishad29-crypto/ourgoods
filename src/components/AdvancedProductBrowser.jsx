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
    const fetchProducts = () => {
      setLoading(true);
      // Fetch all products for this tab to allow client-side filtering and sorting
      const categoryToFetch = tabLabel === 'All Products' ? 'All' : tabLabel;
      const fetchedProds = generateProducts(categoryToFetch, 500);
      setProducts(fetchedProds);
      setLoading(false);
    };

    fetchProducts();

    // Listen for cross-tab updates (e.g., when a product is published in Admin)
    const handleStorageChange = (e) => {
      if (e.key === 'userProductsCache') {
        fetchProducts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
  const filterCategories = allCategories.filter(c => c.name !== 'All Products' && c.isActive !== false);

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
        


      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        


        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="product-grid">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} showChoiceTag={tabLabel === 'Combo & Choice'} />
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



      </div>
    </div>
  );
};

export default AdvancedProductBrowser;
