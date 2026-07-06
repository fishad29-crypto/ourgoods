import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from './ProductCard';

function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems, clearWishlist, toggleWishlist } = useWishlist();

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* Header */}
      <header style={{ background: '#fff', padding: '15px 20px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}></i>
        <h1 style={{ fontSize: '18px', margin: 0, flex: 1, fontWeight: 700 }}>My Wishlist ({wishlistItems.length})</h1>
        {wishlistItems.length > 0 && (
          <span style={{ fontSize: '14px', color: '#e573a4', cursor: 'pointer', fontWeight: 600 }} onClick={clearWishlist}>
            Clear All
          </span>
        )}
      </header>

      <div className="content-container" style={{ padding: '15px' }}>
        {wishlistItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#888' }}>
            <i className="lar la-heart" style={{ fontSize: '60px', marginBottom: '15px', color: '#ddd' }}></i>
            <h2 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#333' }}>Your Wishlist is Empty</h2>
            <p style={{ fontSize: '14px', margin: '0 0 20px 0' }}>Looks like you haven't saved any items yet.</p>
            <button 
              onClick={() => navigate('/')}
              style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
            {wishlistItems.map((product) => (
              <div key={product.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <ProductCard product={product} />
                <button 
                  onClick={() => toggleWishlist(product)} 
                  style={{ marginTop: '8px', background: '#fff', color: '#666', border: '1px solid #e0e0e0', padding: '6px', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <i className="las la-trash-alt" style={{ fontSize: '16px' }}></i> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
