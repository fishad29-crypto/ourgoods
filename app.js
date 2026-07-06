document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid');
  
  try {
    const response = await fetch('realProducts.json');
    if (!response.ok) throw new Error('Failed to load products');
    const products = await response.json();
    
    grid.innerHTML = '';
    
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      const ratingHtml = product.rating ? `<div class="rating"><span class="star">★</span> ${product.rating.toFixed(1)}</div>` : '';
      const soldHtml = product.soldCount ? `<div>${product.soldCount} sold</div>` : '';
      const originalPriceHtml = product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
      
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy" />
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <div class="product-title">${product.title}</div>
          <div class="product-price-row">
            <span class="price">$${product.price.toFixed(2)}</span>
            ${originalPriceHtml}
          </div>
          <div class="product-footer">
            ${ratingHtml}
            ${soldHtml}
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });
    
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<div class="loading">Error loading products. Make sure realProducts.json exists and you are running a local server.</div>';
  }
});
