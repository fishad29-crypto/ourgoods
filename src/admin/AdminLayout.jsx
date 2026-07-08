import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Store, Users, Plane, 
  Box, Truck, CreditCard, RefreshCcw, Megaphone, Globe, 
  Star, BarChart2, HeadphonesIcon, ShieldCheck, Bell, 
  DownloadCloud, Settings, Activity, Menu, Search, Sun, Moon,
  ChevronDown, Wrench
} from 'lucide-react';
import './admin.css';

const sidebarGroups = [
  {
    title: 'Main',
    links: [
      { path: '', icon: LayoutDashboard, label: 'Dashboard Home' }
    ]
  },
  {
    title: 'Sales & Orders',
    links: [
      { path: 'orders', icon: ShoppingCart, label: 'Orders' },
      { path: 'pre-orders', icon: Plane, label: 'Pre-Order Management' },
      { path: 'returns', icon: RefreshCcw, label: 'Returns & Refunds' }
    ]
  },
  {
    title: 'Catalog',
    links: [
      { 
        icon: Package, 
        label: 'Products & Catalog',
        subLinks: [
          { path: 'products', label: 'All Products' },
          { path: 'products/add', label: 'Add Product' }
        ]
      },
      { path: 'categories', icon: LayoutDashboard, label: 'Categories' },
      { path: 'ourgoods-direct', icon: Store, label: 'OURGOODS Direct' },
      { path: 'inventory', icon: Box, label: 'Inventory' }
    ]
  },
  {
    title: 'People',
    links: [
      { path: 'customers', icon: Users, label: 'Customers' },
      { path: 'vendors', icon: Users, label: 'Vendor Management' },
      { path: 'staff', icon: ShieldCheck, label: 'Staff Management' }
    ]
  },
  {
    title: 'Operations & Marketing',
    links: [
      { path: 'shipping', icon: Truck, label: 'Shipping & Courier' },
      { path: 'payments', icon: CreditCard, label: 'Payments' },
      { path: 'marketing', icon: Megaphone, label: 'Marketing' },
      { path: 'support', icon: HeadphonesIcon, label: 'Customer Support' },
      { path: 'reviews', icon: Star, label: 'Reviews & Q&A' }
    ]
  },
  {
    title: 'System',
    links: [
      { path: 'cms', icon: Globe, label: 'Website CMS' },
      { path: 'reports', icon: BarChart2, label: 'Reports & Analytics' },
      { path: 'import-export', icon: DownloadCloud, label: 'Import & Export' },
      { path: 'notifications', icon: Bell, label: 'Notifications' },
      { path: 'settings', icon: Settings, label: 'Settings' },
      { path: 'logs', icon: Activity, label: 'Activity Logs' }
    ]
  }
];

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isMaintenance, setIsMaintenance] = useState(localStorage.getItem('siteMaintenance') === 'true');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = window.location; // Use global window.location since useLocation might not be imported

  const toggleDropdown = (label, isCurrentlyOpen) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !isCurrentlyOpen }));
  };

  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const toggleMaintenance = () => {
    const newState = !isMaintenance;
    setIsMaintenance(newState);
    if (newState) {
      localStorage.setItem('siteMaintenance', 'true');
    } else {
      localStorage.removeItem('siteMaintenance');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>OURGOODS</Link>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="sidebar-group">
              <h4 className="sidebar-group-title">{group.title}</h4>
              {group.links.map((link) => {
                if (link.subLinks) {
                  const isAnySubActive = link.subLinks.some(sub => location.pathname === `/admin/${sub.path}` || location.pathname === `/admin/${sub.path}/`);
                  const isOpen = openDropdowns[link.label] ?? isAnySubActive;
                  
                  return (
                    <div key={link.label} className="sidebar-dropdown">
                      <div 
                        className={`sidebar-item ${isOpen || isAnySubActive ? 'active' : ''}`} 
                        onClick={() => toggleDropdown(link.label, isOpen)}
                        style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', paddingRight: '12px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <link.icon />
                          <span>{link.label}</span>
                        </div>
                        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                      {isOpen && (
                        <div style={{ paddingLeft: '44px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', marginBottom: '8px' }}>
                          {link.subLinks.map(sub => (
                            <NavLink 
                              key={sub.path}
                              to={`/admin/${sub.path}`}
                              end={sub.path === 'products'}
                              className={({ isActive }) => `sidebar-subitem ${isActive ? 'active' : ''}`}
                              style={({ isActive }) => ({
                                color: isActive ? 'var(--brand-pink)' : 'inherit',
                                textDecoration: 'none',
                                fontSize: '13px',
                                padding: '8px 0',
                                opacity: isActive ? 1 : 0.7,
                                fontWeight: isActive ? '600' : 'normal',
                                display: 'block'
                              })}
                            >
                              {sub.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <NavLink 
                    key={link.path}
                    to={`/admin${link.path ? '/' + link.path : ''}`}
                    end={link.path === ''}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="icon-btn hide-on-desktop" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu />
            </button>
            <div className="header-search hide-on-mobile">
              <Search size={18} color="var(--admin-text-muted)" />
              <input type="text" placeholder="Search orders, products..." />
            </div>
          </div>
          
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              className="icon-btn" 
              onClick={toggleMaintenance}
              title={isMaintenance ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
              style={{ color: isMaintenance ? 'var(--brand-pink)' : 'inherit' }}
            >
              <Wrench size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {hasUnread && <span style={{ position: 'absolute', top: 4, right: 6, width: 8, height: 8, backgroundColor: 'var(--brand-pink)', borderRadius: '50%' }}></span>}
              </button>
              
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  width: '320px',
                  background: 'var(--admin-surface)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid var(--admin-border)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Notifications</h3>
                    {hasUnread && (
                      <span 
                        onClick={() => setHasUnread(false)}
                        style={{ fontSize: '12px', color: 'var(--brand-pink)', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Mark all read
                      </span>
                    )}
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <div onClick={() => { navigate('/admin/orders'); setShowNotifications(false); }} style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', cursor: 'pointer', display: 'flex', gap: '12px' }} className="notification-item">
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e3f2fd', color: '#1976d2', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                        <ShoppingCart size={18} />
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600' }}>New Order Received #4920</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>2 mins ago</p>
                      </div>
                    </div>
                    
                    <div onClick={() => { navigate('/admin/products'); setShowNotifications(false); }} style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', cursor: 'pointer', display: 'flex', gap: '12px' }} className="notification-item">
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff3e0', color: '#f57c00', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                        <Box size={18} />
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600' }}>Low Stock Alert: Running Shoes</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>1 hour ago</p>
                      </div>
                    </div>
                    
                    <div onClick={() => { navigate('/admin/customers'); setShowNotifications(false); }} style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', cursor: 'pointer', display: 'flex', gap: '12px' }} className="notification-item">
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8f5e9', color: '#388e3c', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                        <Users size={18} />
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600' }}>New User Registration</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>3 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => { navigate('/admin/notifications'); setShowNotifications(false); }} 
                    style={{ padding: '12px', textAlign: 'center', background: 'var(--admin-bg)', borderTop: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: 'var(--brand-pink)' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'var(--admin-bg)'}
                  >
                    View All Notifications
                  </div>
                </div>
              )}
            </div>
            
            <div className="admin-profile" onClick={handleLogout} title="Click to Logout">
              <div className="admin-avatar">A</div>
              <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Admin User</span>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Logout</span>
              </div>
              <ChevronDown size={16} color="var(--admin-text-muted)" />
            </div>
          </div>
        </header>

        {/* Page Content Rendered Here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
