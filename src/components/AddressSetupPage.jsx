import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressSetupPage = () => {
  const navigate = useNavigate();
  const defaultAddresses = [
    {
      id: 1,
      name: 'Home',
      recipient: 'Fishad Mohammad',
      phone: '159****5575',
      addressLine: 'House 12, Road 4, Block C, Banani',
      city: 'Dhaka',
      isDefault: true
    },
    {
      id: 2,
      name: 'Work',
      recipient: 'Fishad Mohammad',
      phone: '159****5575',
      addressLine: 'Level 8, Tech Park, Gulshan 1',
      city: 'Dhaka',
      isDefault: false
    }
  ];

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('userAddresses');
    return saved ? JSON.parse(saved) : defaultAddresses;
  });

  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: 'Home',
    recipient: '',
    phone: '',
    addressLine: '',
    city: 'Dhaka',
    isDefault: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    
    let updatedAddresses = [...addresses];
    
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    
    if (editingId) {
      updatedAddresses = updatedAddresses.map(a => a.id === editingId ? { ...newAddress, id: editingId } : a);
    } else {
      updatedAddresses = [...updatedAddresses, { ...newAddress, id: Date.now() }];
    }
    
    setAddresses(updatedAddresses);
    setShowAddForm(false);
    setEditingId(null);
    setNewAddress({ name: 'Home', recipient: '', phone: '', addressLine: '', city: 'Dhaka', isDefault: false });
  };

  const handleEdit = (address) => {
    setNewAddress(address);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 10 }}>
        <i className="las la-arrow-left" style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px' }} onClick={() => {
          if (showAddForm) {
            setShowAddForm(false);
            setEditingId(null);
          } else {
            navigate(-1);
          }
        }}></i>
        <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Shipping Addresses</h2>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        
        {/* Address List */}
        {!showAddForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {addresses.map(address => (
              <div key={address.id} style={{ 
                background: '#fff', borderRadius: '12px', padding: '20px', 
                border: address.isDefault ? '1px solid var(--brand-pink)' : '1px solid #eaeaea', 
                boxShadow: address.isDefault ? '0 4px 15px rgba(233, 30, 99, 0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
                position: 'relative', transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      background: address.name === 'Home' ? '#f0f9ff' : (address.name === 'Work' ? '#f5f3ff' : '#f8fafc'), 
                      color: address.name === 'Home' ? '#0ea5e9' : (address.name === 'Work' ? '#8b5cf6' : '#64748b'),
                      width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <i className={`las ${address.name === 'Home' ? 'la-home' : (address.name === 'Work' ? 'la-briefcase' : 'la-map-marker')}`} style={{ fontSize: '18px' }}></i>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <span style={{ background: 'var(--brand-pink)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <i className="las la-pen" style={{ fontSize: '20px', color: '#888', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#333'} onMouseOut={(e) => e.target.style.color = '#888'} onClick={() => handleEdit(address)}></i>
                    <i className="las la-trash" style={{ fontSize: '20px', color: '#888', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#e74c3c'} onMouseOut={(e) => e.target.style.color = '#888'} onClick={() => handleDelete(address.id)}></i>
                  </div>
                </div>
                
                <div style={{ marginLeft: '42px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                    {address.recipient} <span style={{ fontSize: '13px', color: '#888', fontWeight: 400, marginLeft: '5px' }}>{address.phone}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {address.addressLine}<br />
                    {address.city}, Bangladesh
                  </div>
                  
                  {!address.isDefault && (
                    <div 
                      onClick={() => handleSetDefault(address.id)}
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px',
                        color: 'var(--brand-pink)', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <i className="las la-check-circle" style={{ fontSize: '18px' }}></i> Set as Default
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => {
                setEditingId(null);
                setNewAddress({ name: 'Home', recipient: '', phone: '', addressLine: '', city: 'Dhaka', isDefault: false });
                setShowAddForm(true);
              }}
              style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
            >
              <i className="las la-plus" style={{ fontSize: '20px' }}></i> Add New Address
            </button>
          </div>
        )}

        {/* Add Address Form */}
        {showAddForm && (
          <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: 700, color: '#111' }}>{editingId ? 'Edit Address' : 'New Address'}</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Label</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Home', 'Work', 'Other'].map(label => (
                  <button 
                    type="button"
                    key={label}
                    onClick={() => setNewAddress({...newAddress, name: label})}
                    style={{ 
                      flex: 1, padding: '12px', borderRadius: '8px', 
                      border: newAddress.name === label ? '1.5px solid var(--brand-pink)' : '1px solid #eaeaea', 
                      background: newAddress.name === label ? '#fff5f8' : '#fafafa', 
                      color: newAddress.name === label ? 'var(--brand-pink)' : '#555', 
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' 
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recipient Name</label>
              <input 
                type="text" 
                required
                value={newAddress.recipient}
                onChange={(e) => setNewAddress({...newAddress, recipient: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px', background: '#fafafa', boxSizing: 'border-box' }}
                placeholder="Full Name"
                onFocus={(e) => e.target.style.border = '1px solid var(--brand-pink)'}
                onBlur={(e) => e.target.style.border = '1px solid #eaeaea'}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
              <input 
                type="tel" 
                required
                value={newAddress.phone}
                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px', background: '#fafafa', boxSizing: 'border-box' }}
                placeholder="e.g. 01700000000"
                onFocus={(e) => e.target.style.border = '1px solid var(--brand-pink)'}
                onBlur={(e) => e.target.style.border = '1px solid #eaeaea'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>City / District</label>
              <select 
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px', background: '#fafafa', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.border = '1px solid var(--brand-pink)'}
                onBlur={(e) => e.target.style.border = '1px solid #eaeaea'}
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Barisal">Barisal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Address</label>
              <textarea 
                required
                rows="3"
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #eaeaea', outline: 'none', fontSize: '15px', background: '#fafafa', boxSizing: 'border-box', resize: 'none' }}
                placeholder="House no, Road no, Area"
                onFocus={(e) => e.target.style.border = '1px solid var(--brand-pink)'}
                onBlur={(e) => e.target.style.border = '1px solid #eaeaea'}
              ></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <input 
                type="checkbox" 
                id="isDefault" 
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-pink)', cursor: 'pointer' }}
              />
              <label htmlFor="isDefault" style={{ marginLeft: '10px', fontSize: '14px', color: '#333', cursor: 'pointer', fontWeight: 500 }}>
                Set as default shipping address
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setNewAddress({ name: 'Home', recipient: '', phone: '', addressLine: '', city: 'Dhaka', isDefault: false });
                }}
                style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ flex: 1, background: 'var(--brand-pink)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressSetupPage;
