/**
 * LẨU NƯỚNG VN - HOME PAGE LOGIC
 * Render món ăn nổi bật, tương tác yêu thích và mở modal chi tiết món
 */

document.addEventListener('DOMContentLoaded', () => {
  const featuredContainer = document.getElementById('homeFeaturedList');
  if (!featuredContainer || !window.AppState) return;

  function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  }

  function renderFeaturedProducts() {
    const products = window.AppState.getProducts();
    // Lấy tối đa 4 món có cờ isFeatured
    const featured = products.filter(p => p.isFeatured).slice(0, 4);

    featuredContainer.innerHTML = featured.map(product => {
      const isFav = window.AppState.isFavorite(product.id);
      return `
        <article class="product-card">
          <div class="card-img-wrap">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            <div class="card-badges">
              <span class="badge badge-hot">Nổi Bật</span>
              ${!product.isAvailable ? '<span class="badge badge-soldout">Hết món</span>' : ''}
            </div>
            <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${product.id}" title="${isFav ? 'Bỏ thích' : 'Yêu thích món'}" aria-label="Yêu thích món">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-brand)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
          <div class="card-body">
            <span class="card-category">${product.category.toUpperCase()}</span>
            <h3 class="card-title">${product.name}</h3>
            <p class="card-desc">${product.description}</p>
            <div class="card-footer">
              <div class="card-price">${formatPrice(product.price)}</div>
              <button class="btn btn-sm btn-primary view-detail-btn" data-id="${product.id}">Chi tiết</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach event listeners for detail modal
    featuredContainer.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        if (prod && window.openProductDetailModal) {
          window.openProductDetailModal(prod);
        }
      });
    });

    // Attach event listeners for favorites
    featuredContainer.querySelectorAll('.btn-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const nowFav = window.AppState.toggleFavorite(id);
        const prod = window.AppState.getProductById(id);

        btn.classList.toggle('active', nowFav);
        const svg = btn.querySelector('svg');
        if (nowFav) {
          svg.setAttribute('fill', 'var(--color-brand)');
          if (window.showToast) window.showToast(`Đã lưu "${prod.name}" vào danh sách món yêu thích!`, 'success', 'Yêu thích');
        } else {
          svg.setAttribute('fill', 'none');
          if (window.showToast) window.showToast(`Đã bỏ yêu thích món "${prod.name}".`, 'info');
        }
      });
    });
  }

  renderFeaturedProducts();
});
