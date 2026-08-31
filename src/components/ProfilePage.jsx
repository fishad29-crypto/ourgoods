import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreditRewardBanner from './CreditRewardBanner';
import { setupRecaptcha, sendOTP, verifyOTP, loginWithGoogle, loginWithFacebook, logoutUser } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('main'); // 'main', 'auth', 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { currentUser } = useAuth();

  React.useEffect(() => {
    // If we have a global logged-in user from Firebase, reflect it in the UI
    if (currentUser) {
      setIsLoggedIn(true);
      setView('main');
    } else {
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    let interval;
    if (view === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  // Real Firebase Phone Auth Functions
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (phoneNumber.length >= 10) {
      setErrorMsg('');
      setLoading(true);
      try {
        // Initialize recaptcha if it hasn't been already
        setupRecaptcha('recaptcha-container');
        const formattedNumber = `+880${phoneNumber}`;
        
        // Actually send the SMS via Firebase
        await sendOTP(formattedNumber, window.recaptchaVerifier);
        
        setView('otp');
        setTimer(60);
        setCanResend(false);
      } catch (error) {
        console.error("Error sending OTP", error);
        setErrorMsg('Failed to send SMS. Make sure Firebase keys are in .env');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setErrorMsg('');
      setLoading(true);
      try {
        await verifyOTP(otpCode);
        // On success, the AuthContext will automatically update currentUser and trigger the useEffect above
      } catch (error) {
        console.error("Invalid OTP", error);
        setErrorMsg('Invalid OTP code. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') await loginWithGoogle();
      if (provider === 'facebook') await loginWithFacebook();
    } catch (error) {
      console.error(`Error with ${provider} login`, error);
      setErrorMsg(`Failed to login with ${provider}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  if (view === 'auth') {
    return (
      <div style={{ padding: '20px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginBottom: '30px' }} onClick={() => setView('main')}></i>
        
        <h2 style={{ fontSize: '24px', marginBottom: '5px', fontWeight: 800 }}>Welcome to Ourgoods</h2>
        <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
          Enter your mobile number to log in or register.
        </p>
        
        {errorMsg && (
          <div style={{ background: '#ffeeee', color: '#e74c3c', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaea', borderRadius: '8px', padding: '5px 15px', background: '#fcfcfc', transition: 'border 0.2s' }}>
            <span style={{ fontWeight: 600, color: '#333', borderRight: '1px solid #eaeaea', paddingRight: '10px', marginRight: '10px' }}>+880</span>
            <input 
              type="tel" 
              placeholder="1XXXXXXXXX" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              required
              maxLength="10"
              style={{ flex: 1, padding: '10px 0', border: 'none', background: 'transparent', fontSize: '16px', outline: 'none' }}
            />
          </div>
          
          {/* This empty div is required by Firebase for the invisible reCAPTCHA */}
          <div id="recaptcha-container"></div>
          
          <button type="submit" disabled={loading} style={{ 
            background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', 
            fontSize: '16px', fontWeight: 600, marginTop: '10px', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Sending...' : 'Continue'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
          <span style={{ padding: '0 15px', color: '#888', fontSize: '12px', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => handleSocialLogin('google')} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: '#fff', color: '#333', border: '1px solid #eaeaea', padding: '14px', borderRadius: '8px', 
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s'
          }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Continue with Google
          </button>
          
          <button onClick={() => handleSocialLogin('facebook')} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: '#1877F2', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', 
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s'
          }}>
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
            Continue with Facebook
          </button>
        </div>
      </div>
    );
  }

  if (view === 'otp') {
    return (
      <div style={{ padding: '20px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginBottom: '30px' }} onClick={() => setView('auth')}></i>
        
        <h2 style={{ fontSize: '24px', marginBottom: '5px', fontWeight: 800 }}>Verify Mobile</h2>
        <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
          We've sent a 6-digit code to <strong>+880 {phoneNumber}</strong>
        </p>

        {errorMsg && (
          <div style={{ background: '#ffeeee', color: '#e74c3c', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {otp.map((data, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !data && e.target.previousSibling) {
                      e.target.previousSibling.focus();
                    }
                  }}
                  style={{
                    width: '45px', height: '50px', textAlign: 'center', fontSize: '20px', fontWeight: 700,
                    border: '1px solid #eaeaea', borderRadius: '8px', background: '#fcfcfc', outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--brand-pink)'}
                  onBlur={(e) => e.target.style.border = '1px solid #eaeaea'}
                />
              );
            })}
          </div>
          
          <button type="submit" disabled={loading} style={{ 
            background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', 
            fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: (otp.join('').length === 6 && !loading) ? 1 : 0.7
          }}>
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#555' }}>
          {timer > 0 ? (
            <span>Code expires in <strong style={{ color: 'var(--brand-pink)' }}>00:{timer.toString().padStart(2, '0')}</strong></span>
          ) : (
            <span>Didn't receive the code? <span onClick={handleSendOtp} style={{ color: 'var(--brand-pink)', fontWeight: 600, cursor: 'pointer' }}>Resend</span></span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', height: '100%', overflowY: 'auto' }}>
      
      {/* Header Profile Section */}
      <div style={{ background: 'var(--brand-pink)', padding: '40px 20px 30px', color: '#fff', borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', background: '#fff', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            fontSize: '30px', color: 'var(--brand-pink)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
          }}>
            <i className={isLoggedIn ? "las la-user-check" : "las la-user"}></i>
          </div>
          <div>
            {isLoggedIn ? (
              <>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>Fishad Mohammad</div>
                <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '5px' }}>
                  <i className="las la-crown" style={{ color: '#FFD700', marginRight: '4px' }}></i> Gold Member
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '5px' }}>Welcome to Ourgoods</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Login or Register to manage your orders</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Prompt if Logged Out */}
      {!isLoggedIn && (
        <div style={{ padding: '20px 20px 0', marginTop: '-20px', position: 'relative', zIndex: 2 }}>
          <CreditRewardBanner />
        </div>
      )}

      {/* Auth Prompt if Logged Out */}
      {!isLoggedIn && (
        <div style={{ padding: '0 20px 20px', position: 'relative', zIndex: 2 }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <button onClick={() => setView('auth')} style={{ flex: 1, background: '#111', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Log In
            </button>
            <button onClick={() => setView('auth')} style={{ flex: 1, background: '#fff', color: 'var(--brand-pink)', border: '1px solid var(--brand-pink)', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Register
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ padding: isLoggedIn ? '20px' : '0 20px 20px', marginTop: isLoggedIn ? '-20px' : '0', position: 'relative', zIndex: 2 }}>
        
        {/* Order Tracking Section */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>My Orders</div>
            <div style={{ fontSize: '12px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              View All <i className="las la-angle-right"></i>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
            {[
              { icon: 'la-wallet', label: 'To Pay', badge: isLoggedIn ? 1 : 0 },
              { icon: 'la-box', label: 'To Ship', badge: 0 },
              { icon: 'la-truck', label: 'To Receive', badge: isLoggedIn ? 2 : 0 },
              { icon: 'la-star', label: 'To Review', badge: 0 }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer', opacity: isLoggedIn ? 1 : 0.5 }}>
                <i className={`las ${item.icon}`} style={{ fontSize: '26px', color: '#333', marginBottom: '5px' }}></i>
                <span style={{ fontSize: '11px', color: '#555' }}>{item.label}</span>
                {item.badge > 0 && (
                  <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--brand-pink)', color: '#fff', fontSize: '9px', fontWeight: 900, minWidth: '16px', height: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #fff' }}>
                    {item.badge}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Order Tracker Widget */}
          {isLoggedIn && (
            <div style={{ marginTop: '20px', background: '#fcfcfc', borderRadius: '10px', padding: '15px', border: '1px solid #eaeaea', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#e6f7ef', color: '#00D166', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <i className="las la-shipping-fast" style={{ fontSize: '24px' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>Out for Delivery</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Your order #OG-9982 is arriving today.</div>
              </div>
              <button style={{ background: '#111', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                Track
              </button>
            </div>
          )}
        </div>

        {/* My Wallet / Services */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '15px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>Ourgoods Wallet</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', cursor: 'pointer', opacity: isLoggedIn ? 1 : 0.5 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-pink)' }}>{isLoggedIn ? '৳2,500' : '৳0'}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>Balance</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: '#eaeaea' }}></div>
            <div style={{ textAlign: 'center', cursor: 'pointer', opacity: isLoggedIn ? 1 : 0.5 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>{isLoggedIn ? '4' : '0'}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>Vouchers</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: '#eaeaea' }}></div>
            <div style={{ textAlign: 'center', cursor: 'pointer', opacity: isLoggedIn ? 1 : 0.5 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>{isLoggedIn ? '350' : '0'}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>Points</div>
            </div>
          </div>
        </div>

        {/* Tools and Settings */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '5px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          {[
            { icon: 'la-map-marker-alt', label: 'Shipping Addresses', color: '#1da1f2', action: () => navigate('/addresses') },
            { icon: 'la-heart', label: 'My Wishlist', color: 'var(--brand-pink)', action: () => navigate('/wishlist') },
            { icon: 'la-history', label: 'Recently Viewed', color: '#8e44ad', action: () => navigate('/recently-viewed') },
            { icon: 'la-headset', label: 'Help Center', color: '#00D166', action: () => navigate('/help') },
            { icon: 'la-cog', label: 'Settings', color: '#555', action: () => navigate('/settings') }
          ].map((item, idx, arr) => (
            <div key={idx} 
              onClick={item.action}
              style={{ 
              display: 'flex', alignItems: 'center', padding: '15px 0', 
              borderBottom: idx !== arr.length - 1 ? '1px solid #f5f5f5' : 'none',
              cursor: 'pointer'
            }}>
              <i className={`las ${item.icon}`} style={{ fontSize: '22px', color: item.color, marginRight: '15px', width: '25px', textAlign: 'center' }}></i>
              <div style={{ flex: 1, fontSize: '14px', color: '#333' }}>{item.label}</div>
              <i className="las la-angle-right" style={{ color: '#ccc' }}></i>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', background: '#fff', border: '1px solid #eaeaea', color: '#111', 
              padding: '15px', borderRadius: '16px', marginTop: '15px', fontSize: '14px', 
              fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            Log Out
          </button>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
