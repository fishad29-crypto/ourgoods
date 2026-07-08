import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../utils/MockData';
import './ReviewsPage.css';

const ReviewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getAllProducts().find(p => String(p.id) === String(id));

  const randomReviewCount = React.useMemo(() => {
    if (!product) return 488;
    const numId = parseInt(String(product.id).replace(/\D/g, '')) || 0;
    return 100 + (numId * 17) % 900;
  }, [product]);

  if (!product) return <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>Product not found (ID: {id})</div>;

  return (
    <div className="reviews-page-container">
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
        <div className="rating-count">Based on {randomReviewCount} reviews</div>
      </div>

      <div className="review-tags-container">
        <span className="pdd-review-tag" style={{ background: '#000', color: '#fff' }}><i className="las la-check-circle"></i> Good Service</span>
        <span className="pdd-review-tag">Returning Customers</span>
        <span className="pdd-review-tag">Looks Good</span>
        <span className="pdd-review-tag">Cheap</span>
        <span className="pdd-review-tag">Great Quality</span>
        <span className="pdd-review-tag">Perfect Color</span>
      </div>

      <div className="reviews-list">
        {Array.from({ length: 12 }).map((_, i) => {
          const mockTexts = [
            "Received the item, it's very good and fits perfectly. Will definitely buy again!",
            "Great quality for the price. Fast shipping.",
            "Looks exactly like the picture. Very satisfied with the purchase.",
            "The color is slightly different, but overall a good product.",
            "Highly recommended! The seller was very responsive.",
            "Good packaging and fast delivery. Product is 10/10.",
            "Value for money. I will buy another one for my sister.",
            "Quality is decent, but delivery took a bit longer than expected.",
            "Very comfortable and premium feel. Worth every taka.",
            "Authentic product. Really happy with the service."
          ];
          const text = mockTexts[(i + parseInt(id.replace(/\D/g, '') || 0)) % mockTexts.length];
          const rating = 4 + (i % 2); // 4 or 5 stars
          
          return (
            <div key={i} className="review-item">
              <div className="review-user-info">
                <i className="las la-user-circle"></i>
                <span>User***{Math.floor(Math.random() * 900) + 100}</span>
              </div>
              <div className="review-rating">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <i key={starIdx} className={starIdx < rating ? "las la-star" : "lar la-star"}></i>
                ))}
              </div>
              <p className="review-text">{text}</p>
              <div className="review-date">2026-06-{String((i * 3) % 28 + 1).padStart(2, '0')}</div>
            </div>
          );
        })}
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#666', fontSize: '14px' }}>
          Showing 12 of {randomReviewCount} reviews
        </div>
      </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
