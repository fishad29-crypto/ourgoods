import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import '../admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@ourgoods.com.bd');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
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
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', outline: 'none' }}
                placeholder="••••••••"
              />
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
    </div>
  );
};

export default AdminLogin;
