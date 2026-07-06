import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../utils/MockData';
import './ReviewsPage.css';

const ReviewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getAllProducts().find(p => p.id === parseInt(id));

  if (!product) return <div style={{ padding: '20px', textAlign: 'center' }}>Product not found</div>;

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <i className="las la-arrow-left" onClick={() => navigate(-1)}></i>
        <h2>All Reviews</h2>
      </div>
      
      <div className="reviews-summary">
        <div className="rating-big">4.9</div>
        <div className="rating-stars">
          <i className="las la-star"></i><i className="las la-star"></i><i className="las la-star"></i><i className="las la-star"></i><i className="las la-star-half-alt"></i>
        </div>
        <div className="rating-count">Based on 488 reviews</div>
      </div>

      <div className="review-tags-container">
        <span className="pdd-review-tag" style={{ background: '#000', color: '#fff' }}><i className="las la-check-circle"></i> Good Service</span>
        <span className="pdd-review-tag">Returning Customers</span>
        <span className="pdd-review-tag">Looks Good</span>
        <span className="pdd-review-tag">Cheap</span>
        <span className="pdd-review-tag">Great Quality</span>
        <span className="pdd-review-tag">Perfect Color</span>
      </div>

      <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', color: '#999' }}>
        <i className="las la-clock" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Coming Soon</h3>
        <p style={{ textAlign: 'center', margin: 0 }}>Detailed reviews are currently being updated.</p>
      </div>
    </div>
  );
};

export default ReviewsPage;
