import React, { useEffect } from 'react';
import HeroSlider from './HeroSlider';
import ServiceFeatures from './ServiceFeatures';
import FlashSale from './FlashSale';
import DailyDiscover from './DailyDiscover';
import OurgoodsStock from './OurgoodsStock';
import OurgoodsPreOrder from './OurgoodsPreOrder';
import OurgoodsWholesale from './OurgoodsWholesale';
import { useHomepageLayout } from '../utils/MockData';

const HomePage = () => {
  const homepageLayout = useHomepageLayout();

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scroll_${window.location.pathname}`);
    if (savedScroll) {
      // Small timeout to allow DOM to render before scrolling
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        // Also scroll any swipe-pages if they exist
        const swipePages = document.querySelectorAll('.swipe-page');
        swipePages.forEach(page => {
          page.scrollTop = parseInt(savedScroll, 10);
        });
        sessionStorage.removeItem(`scroll_${window.location.pathname}`);
      }, 50);
    } else {
      // Ensure scroll is at absolute top when Home page renders newly
      const swipePages = document.querySelectorAll('.swipe-page');
      swipePages.forEach(page => {
        page.scrollTop = 0;
      });
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="content-container" style={{ paddingBottom: '0' }}>
      {homepageLayout.heroSlider && <HeroSlider />}
      <div className="three-col-desktop">
        {(homepageLayout.sections || []).map(section => {
          if (!section.visible) return null;
          if (section.id === 'flashSale') return <FlashSale key="flashSale" />;
          if (section.id === 'globalShop') return <OurgoodsPreOrder key="globalShop" />;
          if (section.id === 'factoryDirect') return <OurgoodsWholesale key="factoryDirect" />;
          return null;
        })}
      </div>
      <DailyDiscover />
    </div>
  );
};

export default HomePage;
