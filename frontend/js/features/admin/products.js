/**
 * LẨU NƯỚNG VN - ADMIN PRODUCTS CRUD LOGIC
 * Thao tác Thêm (Create), Đọc (Read), Sửa (Update), Xóa (Delete) món ăn thực đơn
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
  const tableBody = document.getElementById('adminProductsTableBody');
  const searchInput = document.getElementById('adminProductSearch');
  const categoryFilter = document.getElementById('adminProductCategoryFilter');
  const modal = document.getElementById('productFormModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddProductModal');
  const btnCloseModal = document.getElementById('closeProductFormModal');
  const btnCancelModal = document.getElementById('btnCancelProductModal');
  const form = document.getElementById('productCrudForm');
  const modalTitle = document.getElementById('modalProductTitle');

  if (!tableBody || !window.AppState) return;

  let searchQuery = '';
  let selectedCategory = 'all';

  function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  }

  // 1. Render Table
  function renderProductsTable() {
    let list = window.AppState.getProducts();

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #888;">Không tìm thấy món ăn nào phù hợp.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(item => `
      <tr>
        <td><strong>#${item.id}</strong></td>
        <td>
          <img src="${item.imageUrl}" alt="${item.name}" class="table-img" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'">
        </td>
        <td>
          <strong>${item.name}</strong>
          <div style="font-size: 0.8rem; color: #777; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.description || ''}</div>
        </td>
        <td><span class="badge" style="background: #E5E7EB; color: #374151; font-weight: 600;">${CATEGORY_NAMES[item.category] || item.category}</span></td>
        <td><strong style="color: var(--color-brand);">${formatPrice(item.price)}</strong></td>
        <td>${item.isFeatured ? '<span class="status-pill status-active">★ Nổi bật</span>' : '<span style="color:#999;">Thường</span>'}</td>
        <td>
          <button class="status-pill ${item.isAvailable ? 'status-active' : 'status-cancelled'} btn-toggle-avail" data-id="${item.id}" style="border:none; cursor:pointer;" title="Nhấn để đổi trạng thái">
            ${item.isAvailable ? '● Còn món' : '○ Tạm hết'}
          </button>
        </td>
        <td style="text-align: right;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-action-edit" data-id="${item.id}" title="Chỉnh sửa">
              ✎
            </button>
            <button class="btn-action btn-action-delete" data-id="${item.id}" title="Xóa món">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach Toggle Availability
    tableBody.querySelectorAll('.btn-toggle-avail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        if (prod) {
          prod.isAvailable = !prod.isAvailable;
          window.AppState.saveProduct(prod);
          if (window.showToast) {
            window.showToast(`Đã chuyển trạng thái món sang: ${prod.isAvailable ? 'Còn món' : 'Hết món'}`, 'info');
          }
          renderProductsTable();
        }
      });
    });

    // Attach Edit Action
    tableBody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        if (prod) {
          openEditModal(prod);
        }
      });
    });

    // Attach Delete Action
    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.AppState.getProductById(id);
        if (confirm(`Bạn có chắc chắn muốn xóa món "${prod ? prod.name : id}" không?`)) {
          window.AppState.deleteProduct(id);
          if (window.showToast) {
            window.showToast(`Đã xóa món ăn thành công!`, 'success');
          }
          renderProductsTable();
        }
      });
    });
  }

  // 2. Modal Handlers
  function openAddModal() {
    form.reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('formProductAvailable').checked = true;
    if (modalTitle) modalTitle.textContent = 'Thêm Món Ăn Mới';
    if (modal) modal.classList.add('active');
  }

  function openEditModal(prod) {
    document.getElementById('editProductId').value = prod.id;
    document.getElementById('formProductName').value = prod.name;
    document.getElementById('formProductCategory').value = prod.category;
    document.getElementById('formProductPrice').value = prod.price;
    document.getElementById('formProductImage').value = prod.imageUrl;
    document.getElementById('formProductDesc').value = prod.description || '';
    document.getElementById('formProductFeatured').checked = !!prod.isFeatured;
    document.getElementById('formProductAvailable').checked = !!prod.isAvailable;

    if (modalTitle) modalTitle.textContent = `Chỉnh Sửa: ${prod.name}`;
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', openAddModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  // 3. Save Product Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('editProductId').value;
      const name = document.getElementById('formProductName').value.trim();
      const category = document.getElementById('formProductCategory').value;
      const price = Number(document.getElementById('formProductPrice').value);
      const imageUrl = document.getElementById('formProductImage').value.trim();
      const description = document.getElementById('formProductDesc').value.trim();
      const isFeatured = document.getElementById('formProductFeatured').checked;
      const isAvailable = document.getElementById('formProductAvailable').checked;

      if (!name || isNaN(price) || price <= 0 || !imageUrl) {
        if (window.showToast) window.showToast('Vui lòng điền đầy đủ các thông tin hợp lệ!', 'error');
        return;
      }

      const productPayload = {
        name,
        category,
        price,
        imageUrl,
        description,
        isFeatured,
        isAvailable
      };

      if (id) {
        productPayload.id = Number(id);
      }

      window.AppState.saveProduct(productPayload);

      if (window.showToast) {
        window.showToast(id ? 'Đã cập nhật thông tin món ăn thành công!' : 'Đã thêm món ăn mới vào thực đơn!', 'success');
      }

      closeModal();
      renderProductsTable();
    });
  }

  // 4. Filters & Search listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProductsTable();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      renderProductsTable();
    });
  }

  // Check URL param if ?action=new
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'new') {
    openAddModal();
  }

  // Initial table render
  renderProductsTable();
});
