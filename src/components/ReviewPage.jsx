import React from 'react';

const reviewsData = [
  {
    id: 1,
    name: 'Rahim U.',
    rating: 5,
    date: '10 Jun 2026',
    text: 'Product quality is very good. অনেক ভালো প্রোডাক্ট, price অনুযায়ী বেস্ট। Delivery was fast too!',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=200'],
    avatar: 'R'
  },
  {
    id: 2,
    name: 'Sadia M.',
    rating: 4,
    date: '08 Jun 2026',
    text: 'Dress টা সুন্দর কিন্তু size একটু বড় হয়ে গেছে। Otherwise quality is perfect and comfortable.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200'],
    avatar: 'S'
  },
  {
    id: 3,
    name: 'Imran H.',
    rating: 5,
    date: '05 Jun 2026',
    text: 'আমি smartwatch টা নিয়েছি, যেমন টা picture এ ছিলো ঠিক তেমনই পেয়েছি। Very satisfied with Ourgoods.',
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=200'],
    avatar: 'I'
  },
  {
    id: 4,
    name: 'Nusrat J.',
    rating: 5,
    date: '01 Jun 2026',
    text: 'Bag এর material টা খুবই premium. Highly recommended for daily use.',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200'],
    avatar: 'N'
  },
  {
    id: 5,
    name: 'Fahim A.',
    rating: 3,
    date: '28 May 2026',
    text: 'Headphone এর sound quality ভালো but packaging আরও ভালো হতে পারতো। Box একটু damaged ছিলো।',
    images: ['https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=200'],
    avatar: 'F'
  },
  {
    id: 6,
    name: 'Sumaiya A.',
    rating: 5,
    date: '25 May 2026',
    text: 'Skincare products are authentic! কোনো doubt নাই। I will definitely order again from here.',
    images: ['https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=200'],
    avatar: 'S'
  },
  {
    id: 7,
    name: 'Kamrul I.',
    rating: 5,
    date: '20 May 2026',
    text: 'Wallet টা আসলেই অনেক সুন্দর। Finishing is top notch. Thank you!',
    images: ['https://images.unsplash.com/photo-1606511634568-d0ce8520bf21?auto=format&fit=crop&q=80&w=200'],
    avatar: 'K'
  },
  {
    id: 8,
    name: 'Tania R.',
    rating: 4,
    date: '18 May 2026',
    text: 'Perfume এর ঘ্রাণ অনেক strong and long-lasting. আমার কাছে ভালোই লেগেছে।',
    images: ['https://images.unsplash.com/photo-1595532588147-3d17967bd59c?auto=format&fit=crop&q=80&w=200'],
    avatar: 'T'
  },
  {
    id: 9,
    name: 'Hasan M.',
    rating: 5,
    date: '15 May 2026',
    text: 'Home decor item টা living room এর সৌন্দর্য বাড়িয়ে দিয়েছে। Looks exactly like the picture.',
    images: ['https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=200'],
    avatar: 'H'
  },
  {
    id: 10,
    name: 'Ayesha S.',
    rating: 5,
    date: '12 May 2026',
    text: 'Makeup set টা outstanding. Colors are very pigmented. এক কথায় দারুণ!',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200'],
    avatar: 'A'
  },
  {
    id: 11,
    name: 'Rakib K.',
    rating: 4,
    date: '10 May 2026',
    text: 'Shoes are comfortable but delivery নিতে ৩ দিন লেট করেছে। Overall product ভালো।',
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=200'],
    avatar: 'R'
  },
  {
    id: 12,
    name: 'Sanjida B.',
    rating: 5,
    date: '05 May 2026',
    text: 'Necklace টা exactly যা চেয়েছি তাই। It looks very elegant and premium.',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200'],
    avatar: 'S'
  },
  {
    id: 13,
    name: 'Mehedi H.',
    rating: 5,
    date: '02 May 2026',
    text: 'Backpack এর চেইন and cloth material exceptional. খুব durable মনে হচ্ছে।',
    images: ['https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=200'],
    avatar: 'M'
  },
  {
    id: 14,
    name: 'Fatima Z.',
    rating: 5,
    date: '28 Apr 2026',
    text: 'Heels are perfectly sized and looking gorgeous. সঠিক সাইজ দেওয়ার জন্য অনেক ধন্যবাদ।',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200'],
    avatar: 'F'
  },
  {
    id: 15,
    name: 'Tarek R.',
    rating: 4,
    date: '25 Apr 2026',
    text: 'Sunglasses ভালো, quality ও ঠিক আছে। But sunglass এর কভার টা একটু low quality.',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=200'],
    avatar: 'T'
  },
  {
    id: 16,
    name: 'Nadia A.',
    rating: 5,
    date: '20 Apr 2026',
    text: 'অনেক ভয় এ ছিলাম কিন্তু product হাতে পেয়ে সব ভয় কেটে গেছে। 10/10 from me.',
    images: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=200'],
    avatar: 'N'
  },
  {
    id: 17,
    name: 'Jahid M.',
    rating: 5,
    date: '15 Apr 2026',
    text: 'Boots look very stylish. Leather quality ও এই price range এ বেশ impressive.',
    images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=200'],
    avatar: 'J'
  },
  {
    id: 18,
    name: 'Mitu P.',
    rating: 3,
    date: '10 Apr 2026',
    text: 'Product ঠিক আছে but color টা একটু deep মনে হলো ছবির থেকে। Anyway, usable.',
    images: ['https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&q=80&w=200'],
    avatar: 'M'
  },
  {
    id: 19,
    name: 'Saif K.',
    rating: 5,
    date: '05 Apr 2026',
    text: 'Original watch. Packing was very secure. আমাকে অনেক ভালো service দিয়েছে তাদের customer care.',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200'],
    avatar: 'S'
  },
  {
    id: 20,
    name: 'Riya T.',
    rating: 5,
    date: '01 Apr 2026',
    text: 'Just wow! Decor item টা এত সুন্দর আমি ভাবতেই পারিনি। আমার রুম টা এখন অনেক cozy লাগে।',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=200'],
    avatar: 'R'
  }
];

const ReviewPage = ({ onClose }) => {
  return (
    <div style={{ height: 'calc(100vh - 60px)', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <div className="content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#fff' }}>
        
        {/* Header */}
        <div style={{ 
          padding: '15px', 
          borderBottom: '1px solid #eaeaea', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#fcfcfc',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="las la-star" style={{ color: 'var(--brand-pink)', fontSize: '20px' }}></i>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111', margin: 0 }}>
              Customer Reviews
            </h2>
          </div>
          
          {/* Close Button (if needed) */}
          {onClose && (
            <div onClick={onClose} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#eaeaea', color: '#111', transition: 'background 0.2s' }}>
              <i className="las la-times" style={{ fontSize: '20px', fontWeight: 'bold' }}></i>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '15px 15px 80px 15px' }}>
          
          {/* Summary Box */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', marginBottom: '20px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#111', lineHeight: '1' }}>4.8</span>
                <span style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Out of 5.0</span>
             </div>
             <div style={{ width: '1px', height: '40px', background: '#eaeaea' }}></div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', color: '#ffb800', fontSize: '14px' }}>
                   <i className="las la-star"></i><i className="las la-star"></i><i className="las la-star"></i><i className="las la-star"></i><i className="las la-star-half-alt"></i>
                </div>
                <span style={{ fontSize: '11px', color: '#666', fontWeight: 600 }}>Based on 20 Reviews</span>
             </div>
          </div>

          {/* Individual Reviews */}
          <div className="review-grid">
            {reviewsData.map((review) => (
              <div key={review.id} style={{ display: 'flex', flexDirection: 'column', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                
                {/* Review Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                   <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', flexShrink: 0, borderRadius: '50%', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>
                         {review.avatar}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontSize: '11px', fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>{review.name}</span>
                         <div style={{ display: 'flex', color: '#ffb800', fontSize: '10px', marginTop: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                               <i key={i} className={i < review.rating ? "las la-star" : "lar la-star"}></i>
                            ))}
                         </div>
                      </div>
                   </div>
                   <span style={{ fontSize: '9px', color: '#888', whiteSpace: 'nowrap' }}>{review.date}</span>
                </div>

                {/* Review Text */}
                <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.4', marginBottom: '12px', flex: 1 }}>
                   {review.text}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                   <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {review.images.map((img, idx) => (
                         <div key={idx} style={{ width: '45px', height: '45px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eaeaea' }}>
                            <img src={img} alt="Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         </div>
                      ))}
                   </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
