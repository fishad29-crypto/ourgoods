import React, { useState } from 'react';
import { ShoppingCart, Box, Users, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'order',
    icon: ShoppingCart,
    title: 'New Order Received #4920',
    description: 'Customer John Doe placed an order for 3 items totaling ৳4,500.',
    time: '2 mins ago',
    read: false,
    color: '#3b82f6',
    bg: '#eff6ff'
  },
  {
    id: 2,
    type: 'inventory',
    icon: Box,
    title: 'Low Stock Alert: Running Shoes',
    description: 'Running Shoes (Black, Size 42) is running low on stock. Only 2 items left.',
    time: '1 hour ago',
    read: false,
    color: '#f59e0b',
    bg: '#fffbeb'
  },
  {
    id: 3,
    type: 'user',
    icon: Users,
    title: 'New User Registration',
    description: 'Sarah Smith created a new customer account.',
    time: '3 hours ago',
    read: false,
    color: '#10b981',
    bg: '#ecfdf5'
  },
  {
    id: 4,
    type: 'review',
    icon: MessageSquare,
    title: 'New Product Review',
    description: 'A 5-star review was left on "Classic Leather Wallet".',
    time: '5 hours ago',
    read: true,
    color: '#8b5cf6',
    bg: '#f5f3ff'
  },
  {
    id: 5,
    type: 'system',
    icon: AlertTriangle,
    title: 'Payment Gateway Issue',
    description: 'SSLCommerz reported a temporary delay in processing transactions.',
    time: '1 day ago',
    read: true,
    color: '#ef4444',
    bg: '#fef2f2'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Notifications</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Stay updated with store activities and alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', color: '#475569', outline: 'none', cursor: 'pointer' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </select>
          <button 
            onClick={markAllRead}
            style={{ padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#475569', fontSize: '14px' }}
          >
            Mark all read
          </button>
        </div>
      </div>
      
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id} 
                onClick={() => markAsRead(notif.id)}
                style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid #e2e8f0', 
                  display: 'flex', 
                  gap: '16px',
                  alignItems: 'flex-start',
                  background: notif.read ? '#fff' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: notif.bg, color: notif.color, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <Icon size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: notif.read ? '500' : '600', color: '#0f172a' }}>
                      {notif.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {notif.time}
                      </span>
                      {!notif.read && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#db2777' }}></div>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                    {notif.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <CheckCircle size={48} style={{ marginBottom: '16px', opacity: 0.5, color: '#94a3b8' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' }}>You're all caught up!</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>There are no notifications to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;