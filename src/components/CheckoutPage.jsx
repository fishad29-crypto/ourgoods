import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Address pre-population from selectedAddress
  const savedAddress = (() => {
    try {
      const sel = localStorage.getItem('selectedAddress');
      if (sel) return JSON.parse(sel);
      const list = localStorage.getItem('userAddresses');
      if (list) {
        const parsed = JSON.parse(list);
        return parsed.find(a => a.isDefault) || parsed[0];
      }
    } catch {}
    return null;
  })();

  const [formData, setFormData] = useState({
    firstName: savedAddress?.recipient ? savedAddress.recipient.split(' ')[0] : 'Fishad',
    lastName: savedAddress?.recipient ? savedAddress.recipient.split(' ').slice(1).join(' ') : 'Mohammad',
    email: 'customer@ourgoods.com',
    phone: savedAddress?.phone || '01700000000',
    address: savedAddress?.addressLine || 'Banani Road 4',
    city: savedAddress?.city || 'Dhaka',
    postalCode: '1213'
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  // Payment option: bKash Merchant and Nagad Merchant first!
  const [paymentMethod, setPaymentMethod] = useState('bkash_merchant');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Gateways
  const [showBkashGateway, setShowBkashGateway] = useState(false);
  const [showNagadGateway, setShowNagadGateway] = useState(false);
  const [orderInvoiceId] = useState(() => `OG-${Math.floor(100000 + Math.random() * 900000)}`);
  const [bkashStep, setBkashStep] = useState(1);
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashOtp, setBkashOtp] = useState('');
  const [bkashPin, setBkashPin] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [bkashPayMethodType, setBkashPayMethodType] = useState('gateway');

  const [nagadStep, setNagadStep] = useState(1);
  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadOtp, setNagadOtp] = useState('');
  const [nagadPin, setNagadPin] = useState('');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [nagadPayMethodType, setNagadPayMethodType] = useState('gateway');

  const isDhaka = formData.city.toLowerCase().includes('dhaka');
  const shippingCost = shippingMethod === 'express' ? 120 : (isDhaka ? 0 : 130);

  // Cash out charge: 1.85% for bKash, 1.45% for Nagad
  let cashOutRate = 0;
  let cashOutName = '';
  if (paymentMethod === 'bkash_merchant' || paymentMethod === 'bkash') {
    cashOutRate = 0.0185;
    cashOutName = 'bKash Merchant';
  } else if (paymentMethod === 'nagad_merchant' || paymentMethod === 'nagad') {
    cashOutRate = 0.0145;
    cashOutName = 'Nagad Merchant';
  }
  const cashOutCharge = cashOutRate > 0 ? Math.round(cartTotal * cashOutRate) : 0;
  const finalTotal = cartTotal + shippingCost - discountAmount + cashOutCharge;

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

  const handleCompleteOrder = ({ method, trxId, status = 'Paid' }) => {
    const orderData = {
      orderId: `#OG-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: cartItems,
      shippingAddress: {
        recipient: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        addressLine: formData.address,
        city: formData.city
      },
      paymentMethod: method,
      paymentStatus: status,
      orderStatus: status === 'Paid' ? 'Processing' : 'Pending',
      transactionId: trxId || null,
      subtotal: cartTotal,
      discount: discountAmount,
      deliveryCharge: shippingCost,
      cashOutCharge,
      totalAmount: finalTotal
    };

    try {
      const existing = localStorage.getItem('userOrders');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('userOrders', JSON.stringify([orderData, ...list]));
      localStorage.setItem('recentOrder', JSON.stringify(orderData));
    } catch {}

    clearCart();
    setIsSuccess(true);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (paymentMethod === 'bkash_merchant' || paymentMethod === 'bkash') {
      setBkashStep(1);
      setShowBkashGateway(true);
      return;
    }
    if (paymentMethod === 'nagad_merchant' || paymentMethod === 'nagad') {
      setNagadStep(1);
      setShowNagadGateway(true);
      return;
    }
    
    // COD or other
    handleCompleteOrder({
      method: 'Cash on Delivery',
      status: 'Pending',
      trxId: null
    });
  };

  if (isSuccess) {
    return (
      <div className="checkout-success">
        <i className="las la-check-circle success-icon"></i>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with OURGOODS.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="primary-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button className="primary-btn" style={{ background: '#111' }} onClick={() => navigate('/profile')}>
            View My Orders
          </button>
        </div>
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
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      required 
                      value={formData.firstName}
                      onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group half">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      required 
                      value={formData.lastName}
                      onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      required 
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Address</label>
                    <input 
                      type="text" 
                      placeholder="Street Address" 
                      required 
                      value={formData.address}
                      onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                    />
                  </div>
                  <div className="form-group half">
                    <label>City / District</label>
                    <select 
                      value={formData.city} 
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', background: '#fff' }}
                    >
                      <option value="Dhaka">Dhaka (Free Delivery)</option>
                      <option value="Chattogram">Chattogram (৳130 Delivery)</option>
                      <option value="Sylhet">Sylhet (৳130 Delivery)</option>
                      <option value="Khulna">Khulna (৳130 Delivery)</option>
                      <option value="Rajshahi">Rajshahi (৳130 Delivery)</option>
                      <option value="Barisal">Barisal (৳130 Delivery)</option>
                      <option value="Rangpur">Rangpur (৳130 Delivery)</option>
                      <option value="Mymensingh">Mymensingh (৳130 Delivery)</option>
                      <option value="Comilla">Comilla (৳130 Delivery)</option>
                      <option value="Gazipur">Gazipur (৳130 Delivery)</option>
                      <option value="Narayanganj">Narayanganj (৳130 Delivery)</option>
                    </select>
                  </div>
                  <div className="form-group half">
                    <label>Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="Postal Code" 
                      required 
                      value={formData.postalCode}
                      onChange={e => setFormData(p => ({ ...p, postalCode: e.target.value }))}
                    />
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
                      <span className="shipping-time">2-4 Business Days</span>
                    </div>
                    <span className="shipping-price">{isDhaka ? 'FREE' : '৳130'}</span>
                  </label>
                  <label className={`shipping-card ${shippingMethod === 'express' ? 'selected' : ''}`}>
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <div className="shipping-info">
                      <span className="shipping-title">Express Delivery</span>
                      <span className="shipping-time">24-48 Hours</span>
                    </div>
                    <span className="shipping-price">৳120</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  {/* bKash Merchant */}
                  <label className={`payment-card ${paymentMethod === 'bkash_merchant' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="bkash_merchant" checked={paymentMethod === 'bkash_merchant'} onChange={() => setPaymentMethod('bkash_merchant')} />
                    <div className="payment-info">
                      <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/bkash.png" alt="bKash" style={{ height: '20px', objectFit: 'contain' }} />
                      <span>bKash Merchant <strong style={{ color: '#E2136E', fontSize: '11px' }}>(+1.85% Cash Out)</strong></span>
                    </div>
                  </label>

                  {/* Nagad Merchant */}
                  <label className={`payment-card ${paymentMethod === 'nagad_merchant' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="nagad_merchant" checked={paymentMethod === 'nagad_merchant'} onChange={() => setPaymentMethod('nagad_merchant')} />
                    <div className="payment-info">
                      <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/nagad.png" alt="Nagad" style={{ height: '20px', objectFit: 'contain' }} />
                      <span>Nagad Merchant <strong style={{ color: '#ED1C24', fontSize: '11px' }}>(+1.45% Cash Out)</strong></span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <div className="payment-info">
                      <i className="las la-money-bill"></i>
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                </div>
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
                <span>Shipping ({formData.city})</span>
                <span>{shippingCost === 0 ? 'FREE' : `৳${shippingCost}`}</span>
              </div>
              {cashOutCharge > 0 && (
                <div className="summary-row" style={{ color: paymentMethod === 'bkash_merchant' ? '#E2136E' : '#ED1C24', fontWeight: 600 }}>
                  <span>{cashOutName} Fee ({(cashOutRate * 100).toFixed(2)}%)</span>
                  <span>+৳{cashOutCharge.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>৳{finalTotal.toLocaleString()}</span>
              </div>
              
              <button type="submit" form="checkoutForm" className="place-order-btn">
                {paymentMethod === 'bkash_merchant' ? 'Proceed to bKash Payment' : paymentMethod === 'nagad_merchant' ? 'Proceed to Nagad Payment' : 'Place Order'} • ৳{finalTotal.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct bKash Gateway Modal */}
      {showBkashGateway && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 120000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowBkashGateway(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#E2136E', padding: '20px', color: '#fff', position: 'relative' }}>
              <button onClick={() => setShowBkashGateway(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="las la-times"></i>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '8px' }}>
                  <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/bkash.png" alt="bKash" style={{ height: '24px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>OURGOODS MERCHANT</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Invoice: #{orderInvoiceId}</div>
                </div>
              </div>
              <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Total with 1.85% Cash Out</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>৳{finalTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {bkashStep === 1 && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>Your bKash Number</label>
                  <input type="tel" placeholder="017XXXXXXXX" maxLength={11} value={bkashNumber} onChange={e => setBkashNumber(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1.5px solid #E2136E', fontSize: '16px', fontWeight: 600, outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                  <button onClick={() => { if(!bkashNumber || bkashNumber.length < 11) return alert('Enter valid 11-digit bKash number'); setBkashStep(2); }} style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>PROCEED</button>
                </div>
              )}
              {bkashStep === 2 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>Enter Verification Code (Default: 123456)</div>
                  <input type="text" placeholder="123456" maxLength={6} value={bkashOtp} onChange={e => setBkashOtp(e.target.value)} style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '4px', borderRadius: '8px', border: '1.5px solid #E2136E', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                  <button onClick={() => { if(!bkashOtp || bkashOtp.length < 4) return alert('Enter OTP'); setBkashStep(3); }} style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>CONFIRM CODE</button>
                </div>
              )}
              {bkashStep === 3 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>Enter bKash PIN</div>
                  <input type="password" placeholder="•••••" maxLength={5} value={bkashPin} onChange={e => setBkashPin(e.target.value)} style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '6px', borderRadius: '8px', border: '1.5px solid #E2136E', fontSize: '20px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                  <button onClick={() => {
                    if(!bkashPin || bkashPin.length < 4) return alert('Enter PIN');
                    setBkashStep(4);
                    setTimeout(() => {
                      const genTrx = `BK${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                      setShowBkashGateway(false);
                      handleCompleteOrder({ method: 'bKash Merchant', trxId: genTrx, status: 'Paid' });
                    }, 1200);
                  }} style={{ width: '100%', padding: '14px', background: '#E2136E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>CONFIRM PAYMENT</button>
                </div>
              )}
              {bkashStep === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <i className="las la-spinner la-spin" style={{ fontSize: '48px', color: '#E2136E' }}></i>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '16px' }}>Authorizing with bKash...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Direct Nagad Gateway Modal */}
      {showNagadGateway && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 120000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowNagadGateway(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#ED1C24', padding: '20px', color: '#fff', position: 'relative' }}>
              <button onClick={() => setShowNagadGateway(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="las la-times"></i>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '8px' }}>
                  <img src="https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/nagad.png" alt="Nagad" style={{ height: '24px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>OURGOODS MERCHANT</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Invoice: #{orderInvoiceId}</div>
                </div>
              </div>
              <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Total with 1.45% Cash Out</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>৳{finalTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {nagadStep === 1 && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>Your Nagad Number</label>
                  <input type="tel" placeholder="017XXXXXXXX" maxLength={11} value={nagadNumber} onChange={e => setNagadNumber(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1.5px solid #ED1C24', fontSize: '16px', fontWeight: 600, outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                  <button onClick={() => { if(!nagadNumber || nagadNumber.length < 11) return alert('Enter valid 11-digit Nagad number'); setNagadStep(2); }} style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>PROCEED</button>
                </div>
              )}
              {nagadStep === 2 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>Enter Verification Code (Default: 123456)</div>
                  <input type="text" placeholder="123456" maxLength={6} value={nagadOtp} onChange={e => setNagadOtp(e.target.value)} style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '4px', borderRadius: '8px', border: '1.5px solid #ED1C24', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                  <button onClick={() => { if(!nagadOtp || nagadOtp.length < 4) return alert('Enter OTP'); setNagadStep(3); }} style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>CONFIRM CODE</button>
                </div>
              )}
              {nagadStep === 3 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>Enter Nagad PIN</div>
                  <input type="password" placeholder="••••" maxLength={4} value={nagadPin} onChange={e => setNagadPin(e.target.value)} style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '6px', borderRadius: '8px', border: '1.5px solid #ED1C24', fontSize: '20px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                  <button onClick={() => {
                    if(!nagadPin || nagadPin.length < 4) return alert('Enter PIN');
                    setNagadStep(4);
                    setTimeout(() => {
                      const genTrx = `NG${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                      setShowNagadGateway(false);
                      handleCompleteOrder({ method: 'Nagad Merchant', trxId: genTrx, status: 'Paid' });
                    }, 1200);
                  }} style={{ width: '100%', padding: '14px', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>CONFIRM PAYMENT</button>
                </div>
              )}
              {nagadStep === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <i className="las la-spinner la-spin" style={{ fontSize: '48px', color: '#ED1C24' }}></i>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '16px' }}>Authorizing with Nagad...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
