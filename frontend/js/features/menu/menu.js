/**
 * LẨU NƯỚNG VN - MENU PAGE LOGIC
 * Tìm kiếm món ăn tức thời, Lọc theo danh mục, Sắp xếp theo giá, Modal chi tiết món & Yêu thích
 */

const CATEGORY_NAMES = {
  'lau': 'Món Lẩu',
  'nuong': 'Đồ Nướng',
  'thit-bo': 'Thịt Bò Mỹ',
  'hai-san': 'Hải Sản',
  'rau-kem': 'Rau & Nấm',
  'combo': 'Combo Tiết Kiệm',
  'do-uong': 'Đồ Uống'
};

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('menuProductGrid');
  const searchInput = document.getElementById('menuSearchInput');
  const sortSelect = document.getElementById('menuSortSelect');
  const categoryTabs = document.querySelectorAll('.category-pill');
  const counterElement = document.getElementById('productCount');
  const emptyState = document.getElementById('emptyMenuState');
  const btnReset = document.getElementById('btnResetFilters');

  if (!gridContainer || !window.AppState) return;

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'default';

  function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  }

  // Cập nhật số đếm động trên từng Tab Danh Mục
  function updateCategoryCounts() {
    const allProducts = window.AppState.getProducts();
    const counts = {};
    allProducts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    categoryTabs.forEach(tab => {
      const cat = tab.getAttribute('data-category');
      if (cat === 'all') {
        tab.textContent = `Tất Cả Món (${allProducts.length})`;
      } else {
        const catName = CATEGORY_NAMES[cat] || cat;
        tab.textContent = `${catName} (${counts[cat] || 0})`;
      }
    });
  }

  function renderMenu() {
    let list = window.AppState.getProducts();

    // 1. Filter by category
    if (currentCategory !== 'all') {
      list = list.filter(item => item.category === currentCategory);
    }

    // 2. Filter by search query (accent-insensitive search)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    if (currentSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    // Update counter
    if (counterElement) {
      counterElement.textContent = list.length;
    }

    // Empty state handling
    if (list.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    // Render items
    gridContainer.innerHTML = list.map(product => {
      const isFav = window.AppState.isFavorite(product.id);
      const catTitle = CATEGORY_NAMES[product.category] || product.category;
      return `
        <article class="product-card">
          <div class="card-img-wrap">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            <div class="card-badges">
              ${product.isFeatured ? '<span class="badge badge-hot">Nổi Bật</span>' : ''}
              ${!product.isAvailable ? '<span class="badge badge-soldout">Hết món</span>' : ''}
            </div>
            <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${product.id}" title="${isFav ? 'Bỏ thích' : 'Yêu thích món'}" aria-label="Yêu thích món">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-brand)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
          <div class="card-body">
            <span class="card-category">${catTitle}</span>
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

    // Attach modal open
    gridContainer.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        if (prod && window.openProductDetailModal) {
          window.openProductDetailModal(prod);
        }
      });
    });

    // Attach favorite toggle
    gridContainer.querySelectorAll('.btn-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const nowFav = window.AppState.toggleFavorite(id);
        const prod = window.AppState.getProductById(id);

        btn.classList.toggle('active', nowFav);
        const svg = btn.querySelector('svg');
        if (nowFav) {
          svg.setAttribute('fill', 'var(--color-brand)');
          if (window.showToast) window.showToast(`Đã lưu "${prod.name}" vào danh sách yêu thích!`, 'success', 'Yêu thích');
        } else {
          svg.setAttribute('fill', 'none');
          if (window.showToast) window.showToast(`Đã bỏ yêu thích món "${prod.name}".`, 'info');
        }
      });
    });
  }

  // Search event with instant update
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderMenu();
    });
  }

  // Sort change event
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderMenu();
    });
  }

  // Category Tabs filter
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderMenu();
    });
  });

  // Reset filter button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      currentCategory = 'all';
      currentSort = 'default';
      if (sortSelect) sortSelect.value = 'default';
      categoryTabs.forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-category') === 'all');
      });
      renderMenu();
    });
  }

  // Initial render & count update
  updateCategoryCounts();
  renderMenu();
});
