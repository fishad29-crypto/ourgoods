import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Loader2, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import '../admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@ourgoods.com.bd');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Password Reset States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('idle'); // idle, loading, success, error
  const [resetError, setResetError] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@ourgoods.com.bd' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus('error');
      setResetError('Please enter your email address');
      return;
    }
    setResetStatus('loading');
    setResetError('');
    
    // Simulate API call for advanced feel
    setTimeout(() => {
      if (resetEmail.includes('@')) {
        setResetStatus('success');
      } else {
        setResetStatus('error');
        setResetError('Please enter a valid email address');
      }
    }, 1500);
  };

  const closeResetModal = () => {
    setIsForgotPassword(false);
    setTimeout(() => {
      setResetStatus('idle');
      setResetEmail('');
      setResetError('');
    }, 300);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--brand-pink)', fontWeight: 900, fontSize: '24px', letterSpacing: '1.5px', margin: 0, textTransform: 'uppercase' }}>OURGOODS</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>Admin Dashboard Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '14px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', outline: 'none' }}
                placeholder="admin@ourgoods.com.bd"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Password</label>
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(true)}
                style={{ background: 'none', border: 'none', color: 'var(--brand-pink)', fontSize: '12px', cursor: 'pointer', padding: 0, fontWeight: 500 }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 40px 12px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', outline: 'none' }}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '14px', backgroundColor: 'var(--brand-pink)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c9171f'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--brand-pink)'}
          >
            Sign In to Dashboard
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          Demo Credentials: admin@ourgoods.com.bd / admin123
        </div>
      </div>

      {/* Forgot Password Modal Overlay */}
      {isForgotPassword && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', animation: 'fadeInUp 0.3s ease-out' }}>
            
            {resetStatus !== 'success' ? (
              <>
                <button 
                  onClick={closeResetModal}
                  style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                  onMouseOver={(e) => e.target.style.color = '#f8fafc'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(228, 50, 146, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <KeyRound size={24} color="var(--brand-pink)" />
                  </div>
                  <h2 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>Reset Password</h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {resetStatus === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '13px' }}>
                      <AlertCircle size={16} />
                      <span>{resetError}</span>
                    </div>
                  )}
                  
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
                    <input 
                      type="email" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', outline: 'none' }}
                      placeholder="admin@ourgoods.com.bd"
                      autoFocus
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={resetStatus === 'loading'}
                    style={{ width: '100%', padding: '14px', backgroundColor: 'var(--brand-pink)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: resetStatus === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.2s', opacity: resetStatus === 'loading' ? 0.7 : 1 }}
                    onMouseOver={(e) => { if(resetStatus !== 'loading') e.target.style.backgroundColor = '#c9171f' }}
                    onMouseOut={(e) => { if(resetStatus !== 'loading') e.target.style.backgroundColor = 'var(--brand-pink)' }}
                  >
                    {resetStatus === 'loading' ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending Link...</>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <CheckCircle2 size={32} color="#22c55e" />
                </div>
                <h2 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0' }}>Check your email</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                  We've sent a password reset link to <br/><strong style={{ color: '#f8fafc' }}>{resetEmail}</strong>
                </p>
                <button 
                  onClick={closeResetModal}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#334155', color: '#f8fafc', border: 'none', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#475569'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#334155'}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminLogin;
