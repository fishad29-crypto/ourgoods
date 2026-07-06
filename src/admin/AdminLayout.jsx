import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Store, Users, Plane, 
  Box, Truck, CreditCard, RefreshCcw, Megaphone, Globe, 
  Star, BarChart2, HeadphonesIcon, ShieldCheck, Bell, 
  DownloadCloud, Settings, Activity, Menu, Search, Sun, Moon,
  ChevronDown
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
      { path: 'products', icon: Package, label: 'Products & Catalog' },
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
  const navigate = useNavigate();

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
              {group.links.map((link) => (
                <NavLink 
                  key={link.path}
                  to={`/admin${link.path ? '/' + link.path : ''}`}
                  end={link.path === ''}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </NavLink>
              ))}
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
            <button className="icon-btn" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 4, right: 6, width: 8, height: 8, backgroundColor: 'var(--admin-primary)', borderRadius: '50%' }}></span>
            </button>
            
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
