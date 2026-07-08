import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  
  // New States
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const shippingCost = shippingMethod === 'express' ? 120 : 60;
  const finalTotal = cartTotal + shippingCost - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'WELCOME10') {
      const discount = cartTotal * 0.1;
      setDiscountAmount(discount);
      setPromoError('');
    } else {
      setDiscountAmount(0);
      setPromoError('Invalid promo code');
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="checkout-success">
        <i className="las la-check-circle success-icon"></i>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with OURGOODS.</p>
        <button className="primary-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-header">
        <i className="las la-arrow-left" onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '24px' }}></i>
        <h2>Checkout</h2>
        <div style={{ width: '24px' }}></div> {/* Spacer */}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="las la-shopping-cart" style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }}></i>
          <h3>Your cart is empty</h3>
          <button className="primary-btn" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="checkout-main">
            {/* Express Checkout Options */}
            <div className="express-checkout">
               <h3>Express Checkout</h3>
               <div className="express-buttons">
                 <button type="button" className="apple-pay-btn"><i className="lab la-apple"></i> Pay</button>
                 <button type="button" className="google-pay-btn"><i className="lab la-google"></i> Pay</button>
               </div>
               <div className="divider"><span>OR</span></div>
            </div>

            <form className="checkout-form" id="checkoutForm" onSubmit={handlePlaceOrder}>
              <div className="form-section">
                <h3>Contact & Shipping</h3>
                <div className="form-grid">
                  <div className="form-group half">
                    <label>First Name</label>
                    <input type="text" placeholder="First Name" required />
                  </div>
                  <div className="form-group half">
                    <label>Last Name</label>
                    <input type="text" placeholder="Last Name" required />
                  </div>
                  <div className="form-group full">
                    <label>Email Address</label>
                    <input type="email" placeholder="Email Address" required />
                  </div>
                  <div className="form-group full">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Phone Number" required />
                  </div>
                  <div className="form-group full">
                    <label>Address</label>
                    <input type="text" placeholder="Street Address" required />
                  </div>
                  <div className="form-group half">
                    <label>City</label>
                    <input type="text" placeholder="City" required />
                  </div>
                  <div className="form-group half">
                    <label>Postal Code</label>
                    <input type="text" placeholder="Postal Code" required />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Shipping Method</h3>
                <div className="shipping-options">
                  <label className={`shipping-card ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                    <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                    <div className="shipping-info">
                      <span className="shipping-title">Standard Delivery</span>
                      <span className="shipping-time">3-5 Business Days</span>
                    </div>
                    <span className="shipping-price">৳60</span>
                  </label>
                  <label className={`shipping-card ${shippingMethod === 'express' ? 'selected' : ''}`}>
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <div className="shipping-info">
                      <span className="shipping-title">Express Delivery</span>
                      <span className="shipping-time">1-2 Business Days</span>
                    </div>
                    <span className="shipping-price">৳120</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-card ${paymentMethod === 'credit' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} />
                    <div className="payment-info">
                      <i className="las la-credit-card"></i>
                      <span>Credit Card</span>
                    </div>
                  </label>
                  <label className={`payment-card ${paymentMethod === 'bkash' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
                    <div className="payment-info">
                      <i className="las la-mobile-alt"></i>
                      <span>bKash</span>
                    </div>
                  </label>
                  <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <div className="payment-info">
                      <i className="las la-money-bill"></i>
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                {/* Credit Card Form Expand */}
                {paymentMethod === 'credit' && (
                  <div className="credit-card-form">
                    <div className="form-group full" style={{ position: 'relative' }}>
                      <input type="text" placeholder="Card Number" maxLength="19" style={{ paddingLeft: '40px' }} />
                      <i className="las la-credit-card input-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#999' }}></i>
                    </div>
                    <div className="form-grid">
                      <div className="form-group half">
                        <input type="text" placeholder="MM/YY" maxLength="5" />
                      </div>
                      <div className="form-group half">
                        <input type="text" placeholder="CVC" maxLength="4" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="checkout-sidebar">
            <div className="cart-section">
              <h3>Order Summary ({cartItems.length})</h3>
              <div className="cart-items small">
                {cartItems.map((item) => {
                  let displayPrice = item.price;
                  if (typeof displayPrice === 'number') {
                    displayPrice = `৳${displayPrice.toLocaleString()}`;
                  }
                  return (
                    <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="cart-item-image-wrapper">
                         <img src={item.image} alt={item.title} className="cart-item-image" />
                         <span className="item-badge">{item.quantity}</span>
                      </div>
                      <div className="cart-item-details" style={{ flex: 1, paddingLeft: '12px' }}>
                        <div className="cart-item-title" style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{item.title}</div>
                        <div className="cart-item-price" style={{ fontSize: '13px', color: '#E91E63', fontWeight: 'bold', marginTop: '2px' }}>{displayPrice}</div>
                        {item.infoSections && item.infoSections.length > 0 && (
                          <div style={{ marginTop: '8px', padding: '6px', background: '#f9f9f9', borderRadius: '4px', border: '1px dashed #eee' }}>
                            {item.infoSections.map((sec, idx) => (
                              <div key={idx} style={{ marginBottom: idx < item.infoSections.length - 1 ? '4px' : '0' }}>
                                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>{sec.title}</div>
                                <div style={{ fontSize: '10px', color: '#777', whiteSpace: 'pre-line', lineHeight: '1.3' }}>{sec.content}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div 
                        onClick={() => removeFromCart(item.id)} 
                        style={{ cursor: 'pointer', padding: '8px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Remove item"
                      >
                        <i className="las la-trash-alt" style={{ fontSize: '20px' }}></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="promo-section">
              <div className="promo-input-group">
                <input 
                  type="text" 
                  placeholder="Discount code (try WELCOME10)" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)} 
                />
                <button type="button" onClick={handleApplyPromo} className={promoCode ? 'active' : ''}>Apply</button>
              </div>
              {promoError && <div className="promo-error">{promoError}</div>}
              {discountAmount > 0 && <div className="promo-success">Discount applied!</div>}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>৳{shippingCost}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>৳{finalTotal.toLocaleString()}</span>
              </div>
              
              <button type="submit" form="checkoutForm" className="place-order-btn">
                Place Order • ৳{finalTotal.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
