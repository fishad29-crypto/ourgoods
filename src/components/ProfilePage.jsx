import React, { useState } from 'react';

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('main'); // 'main', 'login', 'register'

  // Dummy functions
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setView('main');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setView('main');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (view === 'login' || view === 'register') {
    return (
      <div style={{ padding: '20px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginBottom: '30px' }} onClick={() => setView('main')}></i>
        
        <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>
          {view === 'login' ? 'Welcome Back!' : 'Create an Account'}
        </h2>
        <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>
          {view === 'login' ? 'Login to continue shopping and track orders.' : 'Join Ourgoods for exclusive deals and combo offers.'}
        </p>

        <form onSubmit={view === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {view === 'register' && (
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              style={{ padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '14px', outline: 'none' }}
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '14px', outline: 'none' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '14px', outline: 'none' }}
          />
          
          <button type="submit" style={{ 
            background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', 
            fontSize: '16px', fontWeight: 600, marginTop: '10px', cursor: 'pointer' 
          }}>
            {view === 'login' ? 'Log In' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' }}>
          {view === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            style={{ color: 'var(--brand-pink)', fontWeight: 600, cursor: 'pointer' }}
          >
            {view === 'login' ? 'Register' : 'Log In'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', height: '100%', overflowY: 'auto' }}>
      
      {/* Header Profile Section */}
      <div style={{ background: '#000', padding: '40px 20px 30px', color: '#fff', borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px', position: 'relative' }}>
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
        <div style={{ padding: '20px', marginTop: '-20px', position: 'relative', zIndex: 2 }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <button onClick={() => setView('login')} style={{ flex: 1, background: '#111', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Log In
            </button>
            <button onClick={() => setView('register')} style={{ flex: 1, background: '#fff', color: 'var(--brand-pink)', border: '1px solid var(--brand-pink)', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
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
            { icon: 'la-map-marker-alt', label: 'Shipping Addresses', color: '#1da1f2' },
            { icon: 'la-heart', label: 'My Wishlist', color: 'var(--brand-pink)' },
            { icon: 'la-history', label: 'Recently Viewed', color: '#8e44ad' },
            { icon: 'la-headset', label: 'Help Center', color: '#00D166' },
            { icon: 'la-cog', label: 'Settings', color: '#555' }
          ].map((item, idx, arr) => (
            <div key={idx} style={{ 
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
