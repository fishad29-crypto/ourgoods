import React from 'react';

const PromoBanners = () => {
  return (
    <div style={{ padding: '10px 15px', background: '#fff' }}>
      
      {/* OURGOODS Service Benefits */}
      <div className="no-scrollbar service-benefits-wrapper">
        {[
          { icon: 'la-truck', title: 'Delivery Within 48 Hours', sub: 'Local Stock Available' },
          { icon: 'la-money-bill-wave', title: 'Cash on Delivery', sub: 'Available Nationwide' },
          { icon: 'la-headset', title: 'Website Live Chat', sub: 'Customer Support' },
          { icon: 'la-shield-alt', title: '100% Secure Payment', sub: 'SSL Protected Checkout' },
          { icon: 'la-certificate', title: '100% Authentic Products', sub: 'Verified Sellers' },
          { icon: 'la-undo', title: '7-Day Easy Returns', sub: 'Eligible Products Only' },
          { icon: 'la-credit-card', title: 'Multiple Payment Options', sub: 'bKash • Nagad • Visa' },
          { icon: 'la-globe', title: 'Worldwide Pre-Order', sub: 'China • Korea • USA • UK' }
        ].map((feature, idx) => (
          <div key={idx} className="service-benefit-card">
            <i className={`las ${feature.icon} service-benefit-icon`}></i>
            <div className="service-benefit-title">{feature.title}</div>
            <div className="service-benefit-subtitle">{feature.sub}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PromoBanners;
