import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProducts } from '../utils/MockData';
import ProductCard from './ProductCard';

const StorePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const products = getAllProducts(); // In a real app, filter by store id

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* Header / Nav */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#fff', 
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate(-1)}></i>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Store Details</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <i className="las la-search" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
          <i className="las la-ellipsis-h" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
        </div>
      </div>

      {/* Store Banner & Info */}
      <div style={{ background: '#fff', padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fdf6ed', border: '2px solid #fae8d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="las la-store-alt" style={{ fontSize: '32px', color: '#b97a3a' }}></i>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
              OURGOODS <i className="las la-check-circle" style={{ color: '#4caf50', fontSize: '18px' }}></i>
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              <span style={{ color: '#E91E63', fontWeight: 'bold' }}>★ 4.8</span> Rating • 69.4k+ Followers
            </div>
          </div>
        </div>
        <button 
          style={{ background: '#E91E63', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)' }}
        >
          <i className="las la-plus"></i> Follow
        </button>
      </div>

      {/* Store Stats */}
      <div style={{ display: 'flex', background: '#fff', padding: '16px', marginBottom: '12px' }}>
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>98%</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Positive Feedback</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>12k+</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Items Sold</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>2.4 yrs</div>
          <div style={{ fontSize: '12px', color: '#666' }}>On OURGOODS</div>
        </div>
      </div>

      {/* All Products Grid */}
      <div style={{ padding: '0 16px', maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '16px 0', color: '#1f2937' }}>All Products</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
