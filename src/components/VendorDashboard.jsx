import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../utils/MockData';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [vendorName, setVendorName] = useState('Vendor 1 Store'); // Mock active vendor

  useEffect(() => {
    const all = getAllProducts();
    setProducts(all.filter(p => p.vendor === vendorName));
  }, [vendorName]);

  const generateRecommendations = (p) => {
    let recs = [];
    if (p.rating < 4.6) recs.push('Increase rating to 4.6 (currently ' + p.rating + ')');
    if (p.returnRate >= 3) recs.push('Reduce return rate below 3% (currently ' + p.returnRate + '%)');
    if (p.cancellationRate >= 2) recs.push('Reduce cancellation rate below 2% (currently ' + p.cancellationRate + '%)');
    if (p.stock <= 0) recs.push('Restock inventory');
    if (p.soldCount < 30) recs.push('Get more orders (need 30, currently ' + p.soldCount + ')');
    if (p.choiceScore < 85) recs.push('Improve overall score to 85 (currently ' + p.choiceScore + ')');
    if (p.adminRemovedChoice) recs.push('Contact admin for manual unlock');
    
    if (recs.length === 0 && p.isChoice) return ['Maintain current excellent performance!'];
    return recs;
  };

  return (
    <div className="content-container" style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px' }}>Vendor Portal - Choice Eligibility</h1>
        <select value={vendorName} onChange={(e) => setVendorName(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          {/* Mock vendor switcher for testing */}
          <option value="Vendor 1 Store">Vendor 1 Store</option>
          <option value="Vendor 2 Store">Vendor 2 Store</option>
          <option value="Vendor 3 Store">Vendor 3 Store</option>
          <option value="Vendor 4 Store">Vendor 4 Store</option>
          <option value="Vendor 5 Store">Vendor 5 Store</option>
        </select>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Your Products</h2>
        
        {products.length === 0 ? (
          <p>No products found for this vendor.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {products.map(p => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src={p.image} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Score: <strong style={{ color: p.choiceScore >= 85 ? '#00A651' : 'var(--brand-pink)' }}>{p.choiceScore}</strong> / 100 | 
                      Rating: {p.rating} | Orders: {p.soldCount}
                    </div>
                  </div>
                  <div>
                    {p.isChoice ? 
                      <span style={{ background: 'linear-gradient(135deg, #FFD700, #FDB931)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>OURGOODS CHOICE</span> : 
                      <span style={{ background: '#f0f0f0', color: '#666', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>NOT QUALIFIED</span>
                    }
                  </div>
                </div>

                {!p.isChoice && (
                  <div style={{ background: '#fff9f9', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--brand-pink)', fontSize: '12px', color: '#333' }}>
                    <div style={{ fontWeight: 700, marginBottom: '5px', color: 'var(--brand-pink)' }}>Reason: {p.choiceReason}</div>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#555' }}>
                      {generateRecommendations(p).map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.isChoice && (
                  <div style={{ background: '#f6fdf8', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #00A651', fontSize: '12px', color: '#333' }}>
                    <div style={{ fontWeight: 700, color: '#00A651' }}>Congratulations!</div>
                    <div>Maintain your excellent rating and low return rates to keep your badge.</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
