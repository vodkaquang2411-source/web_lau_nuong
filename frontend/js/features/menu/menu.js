/**
 * LẨU NƯỚNG VN - MENU PAGE LOGIC & SMART AUTO-SUGGEST
 * 1. Phân nhóm thực đơn theo quy trình gọi món logic (Lẩu -> Nướng -> Thịt Bò -> Hải Sản -> Rau Nấm -> Combo -> Đồ Uống)
 * 2. Thanh tìm kiếm gợi ý thông minh (Live Search Autocomplete + Từ khóa hot + Hỗ trợ tiếng Việt không dấu)
 * 3. Bộ lọc nhanh theo nhu cầu (Món bán chạy, Nhúng lẩu, Nướng than, Dưới 200k)
 * 4. Chuyển đổi linh hoạt giữa chế độ Xem theo nhóm (Grouped) và Xem dạng lưới (Grid)
 */

// Cấu trúc danh mục và mô tả gợi ý theo quy trình ẩm thực lẩu nướng
const MENU_SECTIONS = [
  {
    key: 'lau',
    name: 'Món Lẩu Gia Truyền',
    icon: '🍲',
    step: 'Bước 1: Chọn Nước Lẩu Đậm Vị',
    desc: 'Nước dùng ninh hầm từ xương ống và thảo mộc thiên nhiên hơn 8 tiếng, thanh ngọt trọn vị sum vầy.'
  },
  {
    key: 'nuong',
    name: 'Đồ Nướng Than Hoa',
    icon: '🔥',
    step: 'Bước 2: Chọn Món Nướng Xèo Xèo',
    desc: 'Các món nướng đặc chế tẩm ướp sốt tiêu đen, chao đỏ, hạt dổi mắc khén nướng trên than hoa đượm lửa.'
  },
  {
    key: 'thit-bo',
    name: 'Thịt Bò Mỹ Thượng Hạng',
    icon: '🥩',
    step: 'Bước 3: Chọn Thịt Nhúng & Nướng',
    desc: 'Ba chỉ bò, bắp bò hoa và gầu bò chọn lọc vân mỡ cẩm thạch, mềm mọng tan ngay nơi đầu lưỡi.'
  },
  {
    key: 'hai-san',
    name: 'Hải Sản Biển Tươi Sống',
    icon: '🦐',
    step: 'Bước 4: Hải Sản Tươi Rói Trong Ngày',
    desc: 'Tôm sú bật tanh tách, mực trứng Phú Quốc, bạch tuộc baby và hàu nướng mỡ hành đậu phộng.'
  },
  {
    key: 'rau-kem',
    name: 'Rau Xanh VietGAP & Nấm Quý',
    icon: '🥬',
    step: 'Bước 5: Rau Củ Organic & Nấm Tươi',
    desc: 'Set nấm tươi hảo hạng 6 loại, rau rừng sạch sục rửa Ozone và đậu phụ Mơ chiên lướt ván béo bùi.'
  },
  {
    key: 'combo',
    name: 'Combo Đại Tiệc Tiết Kiệm',
    icon: '🎉',
    step: 'Lựa Chọn Trọn Vị Cho Bàn Tiệc',
    desc: 'Đầy đủ món ngon tinh túy từ khai vị, lẩu nướng đến đồ uống cho nhóm 2 đến 8 khách với giá cực ưu đãi.'
  },
  {
    key: 'do-uong',
    name: 'Đồ Uống & Tráng Miệng Thanh Mát',
    icon: '🍹',
    step: 'Giải Nhiệt & Thưởng Thức Trọn Vẹn',
    desc: 'Trà đào cam sả hạt chia, trà mận Hậu Sapa đá tuyết và nước mơ Chùa Hương gừng phèn giải ngấy hoàn hảo.'
  }
];

const CATEGORY_NAMES = {
  'lau': 'Món Lẩu',
  'nuong': 'Đồ Nướng',
  'thit-bo': 'Thịt Bò Mỹ',
  'hai-san': 'Hải Sản',
  'rau-kem': 'Rau & Nấm',
  'combo': 'Combo Tiết Kiệm',
  'do-uong': 'Đồ Uống'
};

const POPULAR_KEYWORDS = [
  'Lẩu riêu cua',
  'Bắp bò hoa',
  'Dẻ sườn nướng',
  'Nầm heo giòn',
  'Mực trứng Phú Quốc',
  'Tôm sú tươi',
  'Trà đào cam sả',
  'Combo sum vầy'
];

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm không dấu linh hoạt (ví dụ gõ 'lau' ra 'Lẩu')
function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return str.toLowerCase().trim();
}

// Kiểm tra chuỗi khớp từ khóa (hỗ trợ cả có dấu và không dấu)
function matchSearch(text, query) {
  if (!text || !query) return false;
  const rawText = text.toLowerCase();
  const rawQ = query.toLowerCase().trim();
  if (rawText.includes(rawQ)) return true;

  const noToneText = removeVietnameseTones(text);
  const noToneQ = removeVietnameseTones(query);
  return noToneText.includes(noToneQ);
}

// Bôi đậm từ khóa trong kết quả tìm kiếm
function highlightMatch(text, query) {
  if (!text || !query) return text;
  const cleanQ = query.trim();
  const idx = text.toLowerCase().indexOf(cleanQ.toLowerCase());
  if (idx !== -1) {
    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + cleanQ.length);
    const after = text.substring(idx + cleanQ.length);
    return `${before}<mark>${match}</mark>${after}`;
  }
  return text;
}

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('menuProductGrid');
  const searchInput = document.getElementById('menuSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchSuggestDropdown = document.getElementById('searchSuggestDropdown');
  const searchBoxWrap = document.getElementById('searchBoxWrap');
  const sortSelect = document.getElementById('menuSortSelect');
  const categoryTabs = document.querySelectorAll('.category-pill');
  const quickTags = document.querySelectorAll('.quick-tag');
  const btnViewGrouped = document.getElementById('btnViewGrouped');
  const btnViewGrid = document.getElementById('btnViewGrid');
  const counterElement = document.getElementById('productCount');
  const emptyState = document.getElementById('emptyMenuState');
  const btnReset = document.getElementById('btnResetFilters');

  if (!gridContainer || !window.AppState) return;

  // Trạng thái bộ lọc hiện tại
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'default';
  let currentQuickFilter = 'all';
  let viewMode = 'grouped'; // 'grouped' (theo nhóm) hoặc 'grid' (lưới phẳng)

  function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  }

  // Xác định nhãn gợi ý cách thưởng thức món (Lẩu / Nướng / Cả hai)
  function getDishUsageBadge(product) {
    if (product.category === 'lau') {
      return `<span class="dish-usage-badge dish-usage-lau">🍲 Chuyên Nhúng Lẩu</span>`;
    } else if (product.category === 'nuong') {
      return `<span class="dish-usage-badge dish-usage-nuong">🔥 Chuyên Đồ Nướng</span>`;
    } else if (product.category === 'thit-bo') {
      return `<span class="dish-usage-badge dish-usage-both">🥩 Cả Lẩu & Nướng</span>`;
    } else if (product.category === 'hai-san') {
      return `<span class="dish-usage-badge dish-usage-both">🦐 Cả Lẩu & Nướng</span>`;
    } else if (product.category === 'rau-kem') {
      return `<span class="dish-usage-badge dish-usage-lau">🥬 Nhúng Lẩu & Ăn Kèm</span>`;
    } else if (product.category === 'combo') {
      return `<span class="dish-usage-badge dish-usage-combo">🎉 Set Đại Tiệc</span>`;
    } else if (product.category === 'do-uong') {
      return `<span class="dish-usage-badge dish-usage-drink">🍹 Đồ Uống Mát Lạnh</span>`;
    }
    return '';
  }

  // Tạo HTML cho 1 thẻ sản phẩm chuẩn đẹp
  function createProductCardHTML(product) {
    const isFav = window.AppState.isFavorite(product.id);
    const catTitle = CATEGORY_NAMES[product.category] || product.category;
    const usageBadge = getDishUsageBadge(product);

    return `
      <article class="product-card">
        <div class="card-img-wrap">
          <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
          <div class="card-badges">
            ${product.isFeatured ? '<span class="badge badge-hot">Bán Chạy</span>' : ''}
            ${!product.isAvailable ? '<span class="badge badge-soldout">Hết món</span>' : ''}
          </div>
          <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${product.id}" title="${isFav ? 'Bỏ thích' : 'Yêu thích món'}" aria-label="Yêu thích món">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-brand)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="card-body">
          ${usageBadge}
          <span class="card-category">${catTitle}</span>
          <h3 class="card-title">${product.name}</h3>
          <p class="card-desc">${product.description || ''}</p>
          <div class="card-footer">
            <div class="card-price">${formatPrice(product.price)}</div>
            <button class="btn btn-sm btn-primary view-detail-btn" data-id="${product.id}">Chi tiết</button>
          </div>
        </div>
      </article>
    `;
  }

  // Cập nhật số lượng món trên các Tab danh mục
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

  // Áp dụng các bộ lọc dữ liệu
  function getFilteredProducts() {
    let list = window.AppState.getProducts();

    // 1. Lọc theo Danh mục
    if (currentCategory !== 'all') {
      list = list.filter(item => item.category === currentCategory);
    }

    // 2. Lọc theo Từ khóa tìm kiếm (hỗ trợ cả có dấu và không dấu)
    if (searchQuery.trim() !== '') {
      list = list.filter(item => 
        matchSearch(item.name, searchQuery) || 
        matchSearch(item.description, searchQuery)
      );
    }

    // 3. Lọc theo Quick Tags
    if (currentQuickFilter === 'featured') {
      list = list.filter(item => item.isFeatured);
    } else if (currentQuickFilter === 'usage-lau') {
      list = list.filter(item => ['lau', 'thit-bo', 'hai-san', 'rau-kem'].includes(item.category));
    } else if (currentQuickFilter === 'usage-nuong') {
      list = list.filter(item => ['nuong', 'thit-bo', 'hai-san'].includes(item.category));
    } else if (currentQuickFilter === 'under-200') {
      list = list.filter(item => item.price < 200000);
    }

    // 4. Sắp xếp
    if (currentSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return list;
  }

  // Hàm Render chính của Menu
  function renderMenu() {
    const list = getFilteredProducts();

    // Cập nhật số đếm
    if (counterElement) {
      counterElement.textContent = list.length;
    }

    // Trạng thái trống (Không tìm thấy món)
    if (list.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    // NẾU XEM THEO PHÂN NHÓM (GROUPED VIEW) VÀ KHÔNG ĐANG TÌM KIẾM CỤ THỂ HOẶC QUICK FILTER
    const isDefaultBrowsing = searchQuery.trim() === '' && currentQuickFilter === 'all';

    if (viewMode === 'grouped' && isDefaultBrowsing) {
      let sectionsHTML = '';

      MENU_SECTIONS.forEach(sec => {
        // Nếu đang chọn 1 tab cụ thể, chỉ render section đó
        if (currentCategory !== 'all' && currentCategory !== sec.key) return;

        const secProducts = list.filter(p => p.category === sec.key);
        if (secProducts.length === 0) return;

        sectionsHTML += `
          <section class="menu-section-group" id="sec-${sec.key}">
            <div class="menu-section-header">
              <div class="menu-section-title-wrap">
                <div class="menu-section-icon">${sec.icon}</div>
                <div>
                  <h2 class="menu-section-title">${sec.name}</h2>
                  <p class="menu-section-desc"><strong>${sec.step}:</strong> ${sec.desc}</p>
                </div>
              </div>
              <span class="menu-section-count">${secProducts.length} món</span>
            </div>
            <div class="grid-4">
              ${secProducts.map(createProductCardHTML).join('')}
            </div>
          </section>
        `;
      });

      gridContainer.innerHTML = sectionsHTML;
    } else {
      // XEM DẠNG LƯỚI PHẲNG (GRID VIEW) HOẶC KHI ĐANG CÓ KẾT QUẢ TÌM KIẾM / QUICK FILTER
      gridContainer.innerHTML = `
        <div class="grid-4">
          ${list.map(createProductCardHTML).join('')}
        </div>
      `;
    }

    // Gắn sự kiện mở modal chi tiết món
    gridContainer.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        if (prod && window.openProductDetailModal) {
          window.openProductDetailModal(prod);
        }
      });
    });

    // Gắn sự kiện toggle yêu thích
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

  // =========================================================================
  // BỘ MÁY GỢI Ý TÌM KIẾM THÔNG MINH (SEARCH SUGGESTION ENGINE)
  // =========================================================================
  function renderSearchSuggestions(query = '') {
    if (!searchSuggestDropdown) return;
    const allProducts = window.AppState.getProducts();
    const cleanQ = query.trim();

    // 1. KHI CHƯA GÕ GÌ: Hiển thị các từ khóa hot + Gợi ý món bán chạy
    if (cleanQ === '') {
      const topPicks = allProducts.filter(p => p.isFeatured).slice(0, 3);

      searchSuggestDropdown.innerHTML = `
        <div class="suggest-header">
          <span>🔥 Từ khóa tìm kiếm phổ biến</span>
        </div>
        <div class="suggest-keywords">
          ${POPULAR_KEYWORDS.map(kw => `
            <button class="suggest-tag-btn" data-keyword="${kw}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              ${kw}
            </button>
          `).join('')}
        </div>
        <div class="suggest-header">
          <span>👑 Món nổi bật được gọi nhiều nhất</span>
        </div>
        <div class="suggest-items-list">
          ${topPicks.map(p => `
            <div class="suggest-item" data-id="${p.id}">
              <img src="${p.imageUrl}" alt="${p.name}" class="suggest-thumb" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'">
              <div class="suggest-info">
                <div class="suggest-title">${p.name}</div>
                <div class="suggest-meta">
                  <span>${CATEGORY_NAMES[p.category] || p.category}</span>
                  <span class="suggest-price">${formatPrice(p.price)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      searchSuggestDropdown.classList.add('active');
      attachSuggestEvents();
      return;
    }

    // 2. KHI ĐANG GÕ TỪ KHÓA: Lọc món ăn khớp tức thời (hỗ trợ cả có dấu và không dấu)
    const matches = allProducts.filter(p => 
      matchSearch(p.name, cleanQ) || 
      matchSearch(p.description, cleanQ)
    ).slice(0, 6);

    if (matches.length === 0) {
      searchSuggestDropdown.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--color-gray-500); font-size: 0.9rem;">
          Không tìm thấy món nào với từ khóa "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      searchSuggestDropdown.classList.add('active');
      return;
    }

    searchSuggestDropdown.innerHTML = `
      <div class="suggest-header">
        <span>Gợi ý cho bạn (${matches.length} món)</span>
        <span style="font-size: 0.75rem; color: var(--color-gray-500); font-weight: normal;">Nhấp để xem chi tiết</span>
      </div>
      <div class="suggest-items-list">
        ${matches.map(p => `
          <div class="suggest-item" data-id="${p.id}">
            <img src="${p.imageUrl}" alt="${p.name}" class="suggest-thumb" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'">
            <div class="suggest-info">
              <div class="suggest-title">${highlightMatch(p.name, cleanQ)}</div>
              <div class="suggest-meta">
                <span>${CATEGORY_NAMES[p.category] || p.category}</span>
                <span class="suggest-price">${formatPrice(p.price)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="suggest-footer" id="suggestShowAllBtn">
        Xem tất cả kết quả cho "${escapeHtml(query)}" &rarr;
      </div>
    `;

    searchSuggestDropdown.classList.add('active');
    attachSuggestEvents();
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Gắn sự kiện click cho các item trong dropdown gợi ý
  function attachSuggestEvents() {
    if (!searchSuggestDropdown) return;

    // Click vào tag từ khóa phổ biến
    searchSuggestDropdown.querySelectorAll('.suggest-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const kw = btn.getAttribute('data-keyword');
        if (searchInput) {
          searchInput.value = kw;
          searchQuery = kw;
          if (searchClearBtn) searchClearBtn.classList.add('visible');
          hideSuggestDropdown();
          renderMenu();
        }
      });
    });

    // Click vào từng món gợi ý -> Mở ngay modal chi tiết
    searchSuggestDropdown.querySelectorAll('.suggest-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        hideSuggestDropdown();
        if (prod && window.openProductDetailModal) {
          window.openProductDetailModal(prod);
        }
      });
    });

    // Click vào footer "Xem tất cả kết quả"
    const btnShowAll = document.getElementById('suggestShowAllBtn');
    if (btnShowAll) {
      btnShowAll.addEventListener('click', () => {
        hideSuggestDropdown();
        renderMenu();
      });
    }
  }

  function hideSuggestDropdown() {
    if (searchSuggestDropdown) {
      searchSuggestDropdown.classList.remove('active');
    }
  }

  // =========================================================================
  // CÁC SỰ KIỆN TƯƠNG TÁC
  // =========================================================================

  // Input tìm kiếm
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
      }
      renderSearchSuggestions(searchQuery);
      renderMenu();
    });

    searchInput.addEventListener('focus', () => {
      renderSearchSuggestions(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideSuggestDropdown();
      } else if (e.key === 'Enter') {
        hideSuggestDropdown();
        renderMenu();
      }
    });
  }

  // Nút xóa tìm kiếm
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchQuery = '';
      searchClearBtn.classList.remove('visible');
      renderSearchSuggestions('');
      renderMenu();
    });
  }

  // Đóng dropdown khi click bên ngoài
  document.addEventListener('click', (e) => {
    if (searchBoxWrap && !searchBoxWrap.contains(e.target)) {
      hideSuggestDropdown();
    }
  });

  // Thay đổi kiểu sắp xếp
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderMenu();
    });
  }

  // Lọc theo Tab Danh mục
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderMenu();
    });
  });

  // Lọc theo Quick Tags (Món bán chạy, nhúng lẩu, nướng than, dưới 200k)
  quickTags.forEach(btn => {
    btn.addEventListener('click', () => {
      quickTags.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentQuickFilter = btn.getAttribute('data-filter');
      renderMenu();
    });
  });

  // Chuyển đổi View Mode (Nhóm vs Lưới)
  if (btnViewGrouped && btnViewGrid) {
    btnViewGrouped.addEventListener('click', () => {
      viewMode = 'grouped';
      btnViewGrouped.classList.add('active');
      btnViewGrid.classList.remove('active');
      renderMenu();
    });

    btnViewGrid.addEventListener('click', () => {
      viewMode = 'grid';
      btnViewGrid.classList.add('active');
      btnViewGrouped.classList.remove('active');
      renderMenu();
    });
  }

  // Nút thiết lập lại bộ lọc
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchClearBtn) searchClearBtn.classList.remove('visible');
      currentCategory = 'all';
      currentQuickFilter = 'all';
      currentSort = 'default';
      viewMode = 'grouped';

      if (sortSelect) sortSelect.value = 'default';
      if (btnViewGrouped) btnViewGrouped.classList.add('active');
      if (btnViewGrid) btnViewGrid.classList.remove('active');

      categoryTabs.forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-category') === 'all');
      });
      quickTags.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });

      hideSuggestDropdown();
      renderMenu();
    });
  }

  // Khởi chạy ban đầu
  updateCategoryCounts();
  renderMenu();
});
