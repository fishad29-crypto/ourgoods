import React, { useEffect } from 'react';
import HeroSlider from './HeroSlider';
import ServiceFeatures from './ServiceFeatures';
import CreditRewardBanner from './CreditRewardBanner';
import OurgoodsMart from './OurgoodsMart';
import FlashSale from './FlashSale';
import DealHighlights from './DealHighlights';
import BestSeller from './BestSeller';
import DailyDiscover from './DailyDiscover';

const HomePage = () => {
  useEffect(() => {
    // Ensure scroll is at absolute top when Home page renders
    const swipePages = document.querySelectorAll('.swipe-page');
    swipePages.forEach(page => {
      page.scrollTop = 0;
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="content-container" style={{ paddingBottom: '20px' }}>
      <HeroSlider />
      <ServiceFeatures />
      <CreditRewardBanner />
      <OurgoodsMart />
      <div className="three-col-desktop">
        <FlashSale />
        <DealHighlights />
        <BestSeller />
      </div>
      <DailyDiscover />
    </div>
  );
};

export default HomePage;
