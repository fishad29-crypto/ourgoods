import React from 'react';
import HeroSlider from './HeroSlider';
import CategoryOccasions from './CategoryOccasions';
import CategorySubcategories from './CategorySubcategories';
import CategoryTrends from './CategoryTrends';
import BestSeller from './BestSeller';
import ProductCard from './ProductCard';

const categoryProducts = {
  'Women': [
    { id: 1, title: 'Summer Floral Maxi Dress with Ruffles', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=90&w=400', price: 1850, discount: 25, soldCount: 4200 },
    { id: 2, title: 'Classic High-Waist Denim Jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=90&w=400', price: 2100, discount: 15, soldCount: 8500 },
    { id: 3, title: 'Elegant Evening Gown for Parties', image: 'https://images.unsplash.com/photo-1566160980424-df3a093226db?auto=format&fit=crop&q=90&w=400', price: 4500, discount: 40, soldCount: 1200 },
    { id: 4, title: 'Casual Cotton V-Neck T-Shirt', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=90&w=400', price: 450, discount: 10, soldCount: 15600 },
    { id: 5, title: 'Professional Blazer for Women', image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=90&w=400', price: 3200, discount: 30, soldCount: 3400 },
    { id: 6, title: 'Comfortable Yoga Pants / Leggings', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=90&w=400', price: 1100, discount: 20, soldCount: 9800 },
    { id: 7, title: 'Chic Summer Romper Jumpsuit', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=90&w=400', price: 1650, discount: 35, soldCount: 2700 },
    { id: 8, title: 'Warm Winter Knitted Sweater', image: 'https://images.unsplash.com/photo-1611042553365-9b101441c135?auto=format&fit=crop&q=90&w=400', price: 2400, discount: 15, soldCount: 5100 },
    { id: 9, title: 'Trendy Leather Moto Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=90&w=400', price: 5500, discount: 20, soldCount: 1900 },
    { id: 10, title: 'Boho Style Pleated Midi Skirt', image: 'https://images.unsplash.com/photo-1583496920315-9922e9e2bf40?auto=format&fit=crop&q=90&w=400', price: 1350, discount: 25, soldCount: 4100 },
  ],
  'Jewelry & Accessories': [
    { id: 1, title: 'Classic Silver Diamond Ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=90&w=400', price: 8500, discount: 15, soldCount: 3200 },
    { id: 2, title: 'Elegant Pendant Necklace', image: 'https://images.unsplash.com/photo-1599643478514-4a11011c77f0?auto=format&fit=crop&q=90&w=400', price: 3200, discount: 20, soldCount: 1500 },
    { id: 3, title: 'Vintage Style Wrist Watch', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=90&w=400', price: 5600, discount: 10, soldCount: 2800 },
    { id: 4, title: 'UV Protection Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=90&w=400', price: 1200, discount: 30, soldCount: 5400 }
  ],
  'Purse & Bags': [
    { id: 1, title: 'Premium Leather Tote Bag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=90&w=400', price: 4200, discount: 15, soldCount: 2100 },
    { id: 2, title: 'Casual Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=90&w=400', price: 2800, discount: 25, soldCount: 1800 },
    { id: 3, title: 'Travel Friendly Backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=90&w=400', price: 3500, discount: 10, soldCount: 3600 },
    { id: 4, title: 'Designer Evening Clutch', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=90&w=400', price: 5500, discount: 20, soldCount: 900 }
  ],
  'Sneakers & Shoes': [
    { id: 1, title: 'Athletic Running Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=400', price: 3800, discount: 15, soldCount: 4500 },
    { id: 2, title: 'Classic Leather Boots', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=90&w=400', price: 5200, discount: 20, soldCount: 1200 },
    { id: 3, title: 'Comfortable Daily Flats', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=90&w=400', price: 1500, discount: 30, soldCount: 3800 },
    { id: 4, title: 'Formal Oxford Shoes', image: 'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?auto=format&fit=crop&q=90&w=400', price: 4600, discount: 10, soldCount: 2200 }
  ],
  'Beauty & Health': [
    { id: 1, title: 'Organic Vitamin C Serum', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=90&w=400', price: 1800, discount: 25, soldCount: 5200 },
    { id: 2, title: 'Long Lasting Matte Lipstick', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=90&w=400', price: 850, discount: 15, soldCount: 8900 },
    { id: 3, title: 'Luxury Floral Perfume', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=90&w=400', price: 4200, discount: 10, soldCount: 2100 },
    { id: 4, title: 'Hydrating Body Lotion', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=90&w=400', price: 950, discount: 20, soldCount: 4600 }
  ],
  'Home & Decor': [
    { id: 1, title: 'Modern Living Room Sofa', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=90&w=400', price: 15000, discount: 15, soldCount: 2100 },
    { id: 2, title: 'Soft Cotton Bedding Set', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=90&w=400', price: 3500, discount: 25, soldCount: 1800 },
    { id: 3, title: 'Geometric Ceramic Vase', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=90&w=400', price: 850, discount: 10, soldCount: 3600 },
    { id: 4, title: 'Woven Floor Rug', image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=90&w=400', price: 5500, discount: 20, soldCount: 900 }
  ]
};


const CategoryPage = ({ title }) => {
  return (
    <div className="content-container" style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      {/* Category Specific Hero Slider */}
      <HeroSlider category={title} />
      
      {/* Category Sections (Reusing the layout across all categories for now) */}
      <>
        <CategoryOccasions category={title} />
        <CategorySubcategories category={title} />
        <div className="two-col-desktop">
          <div>
            <BestSeller category={title} />
          </div>
          <div>
            <CategoryTrends category={title} />
          </div>
        </div>
      </>
      
      <div style={{ padding: '0 15px 20px 15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#111', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="las la-tshirt" style={{ color: 'var(--brand-pink)', fontSize: '22px' }}></i> All {title}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          {(categoryProducts[title] || categoryProducts['Women']).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
