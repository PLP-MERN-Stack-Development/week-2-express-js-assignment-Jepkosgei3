async function loadProducts() {
  const container = document.getElementById('product-cards');
  
  try {
    // Show loading state
    container.innerHTML = '<div class="loading">Loading products...</div>';
    
    const response = await fetch('/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    if (!products || products.length === 0) {
      container.innerHTML = '<div class="empty">No products found</div>';
      return;
    }
    
    // Render products
    container.innerHTML = products.map(product => `
      <div class="card product-card">
        <h3>${product.name || 'Unnamed Product'}</h3>
        <p>Price: $${(product.price || 0).toFixed(2)}</p>
        <p class="stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
          ${product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Failed to load products:', error);
    container.innerHTML = `
      <div class="error">
        Failed to load products. <br>
        <small>${error.message}</small>
      </div>
    `;
  }
}

// Start loading when page loads
document.addEventListener('DOMContentLoaded', loadProducts);