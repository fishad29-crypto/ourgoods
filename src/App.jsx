import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerApp from './CustomerApp';
import ProductDetailsPage from './components/ProductDetailsPage';
import ReviewsPage from './components/ReviewsPage';
import CheckoutPage from './components/CheckoutPage';
import AdminLayout from './admin/AdminLayout';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import DashboardHome from './admin/pages/DashboardHome';
import Orders from './admin/pages/Orders';
import ProductsCatalog from './admin/pages/ProductsCatalog';
import AddProduct from './admin/pages/AddProduct';
import OurgoodsDirect from './admin/pages/OurgoodsDirect';
import VendorManagement from './admin/pages/VendorManagement';
import Customers from './admin/pages/Customers';
import PreOrderManagement from './admin/pages/PreOrderManagement';
import Inventory from './admin/pages/Inventory';
import ShippingCourier from './admin/pages/ShippingCourier';
import Payments from './admin/pages/Payments';
import ReturnsRefunds from './admin/pages/ReturnsRefunds';
import Marketing from './admin/pages/Marketing';
import WebsiteCMS from './admin/pages/WebsiteCMS';
import ReviewsQA from './admin/pages/ReviewsQA';
import ReportsAnalytics from './admin/pages/ReportsAnalytics';
import CustomerSupport from './admin/pages/CustomerSupport';
import StaffManagement from './admin/pages/StaffManagement';
import Notifications from './admin/pages/Notifications';
import ImportExport from './admin/pages/ImportExport';
import Settings from './admin/pages/Settings';
import ActivityLogs from './admin/pages/ActivityLogs';

import WishlistPage from './components/WishlistPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we just loaded the page
    const hasLoaded = sessionStorage.getItem('hasLoadedApp');
    if (hasLoaded) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasLoadedApp', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ffffff', position: 'fixed', top: 0, left: 0, zIndex: 99999 }}>
        <img src="/images/logo.png" alt="Ourgoods Logo" className="floating-logo" style={{ maxWidth: '300px', height: 'auto' }} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<CustomerApp />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/product/:id/reviews" element={<ReviewsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<ProductsCatalog />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="ourgoods-direct" element={<OurgoodsDirect />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="customers" element={<Customers />} />
        <Route path="pre-orders" element={<PreOrderManagement />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="shipping" element={<ShippingCourier />} />
        <Route path="payments" element={<Payments />} />
        <Route path="returns" element={<ReturnsRefunds />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="cms" element={<WebsiteCMS />} />
        <Route path="reviews" element={<ReviewsQA />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="import-export" element={<ImportExport />} />
        <Route path="settings" element={<Settings />} />
        <Route path="logs" element={<ActivityLogs />} />
      </Route>
    </Routes>
  );
}

export default App;
