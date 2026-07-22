import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, AlertTriangle, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import '../admin.css';

const MOCK_REVIEWS = [
  { id: 'REV-101', customer: 'Faisal Mahmud', product: 'PS5 Pro Console', rating: 5, comment: 'Absolutely amazing! Delivered on time and works perfectly.', date: '2026-07-14', status: 'Pending Approval' },
  { id: 'REV-102', customer: 'Sadia Islam', product: 'Iphone 16 Pro Max', rating: 4, comment: 'Great phone, but the packaging was a bit dented.', date: '2026-07-13', status: 'Approved' },
  { id: 'REV-103', customer: 'Tanvir Ahmed', product: 'Sony Alpha A7 IV', rating: 1, comment: 'Very bad service. Product arrived broken.', date: '2026-07-10', status: 'Flagged' },
  { id: 'REV-104', customer: 'Rahim Uddin', product: 'Samsung Galaxy S24 Ultra', rating: 5, comment: 'Best purchase ever! Highly recommended.', date: '2026-07-09', status: 'Approved' },
];

const ReviewsQA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredReviews = MOCK_REVIEWS.filter(r => 
    r.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={14} fill={i < rating ? '#f59e0b' : 'transparent'} color={i < rating ? '#f59e0b' : '#cbd5e1'} />
    ));
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Reviews & Q&A</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Moderate customer reviews, answer product questions, and manage reputation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Average Rating</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>4.8 <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 400 }}>/ 5.0</span></div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Pending Approval</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>24</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Flagged Reviews</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>3</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Customer & Date</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Review</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => (
                <tr key={rev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{rev.customer}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{rev.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{rev.product}</div>
                  </td>
                  <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                      {renderStars(rev.rating)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#334155', maxWidth: '300px', lineHeight: '1.4' }}>"{rev.comment}"</div>
                  </td>
                  <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: rev.status === 'Pending Approval' ? '#fef3c7' : rev.status === 'Approved' ? '#dcfce7' : '#fee2e2',
                      color: rev.status === 'Pending Approval' ? '#d97706' : rev.status === 'Approved' ? '#16a34a' : '#ef4444'
                    }}>
                      {rev.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', verticalAlign: 'top' }}>
                    {rev.status === 'Pending Approval' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '6px', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Approve">
                          <CheckCircle2 size={16} />
                        </button>
                        <button style={{ padding: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Reject">
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <button style={{ padding: '6px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Reply</button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewsQA;