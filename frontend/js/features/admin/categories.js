/**
 * LẨU NƯỚNG VN - ADMIN CATEGORIES CRUD LOGIC
 * Quản lý các nhóm danh mục thực đơn (Thêm, Sửa, Xóa)
 */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('adminCategoriesTableBody');
  const modal = document.getElementById('categoryFormModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddCategoryModal');
  const btnCloseModal = document.getElementById('closeCategoryFormModal');
  const btnCancelModal = document.getElementById('btnCancelCategoryModal');
  const form = document.getElementById('categoryCrudForm');
  const modalTitle = document.getElementById('modalCategoryTitle');

  if (!tableBody || !window.AppState) return;

  function renderCategoriesTable() {
    const list = window.AppState.getCategories();

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #888;">Chưa có danh mục nào.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(item => `
      <tr>
        <td><strong>#${item.id}</strong></td>
        <td><strong style="color: var(--color-primary);">${item.name}</strong></td>
        <td><code>${item.slug}</code></td>
        <td style="color: #666; max-width: 300px;">${item.description || ''}</td>
        <td><strong>${item.sortOrder || 1}</strong></td>
        <td><span class="status-pill status-active">Hoạt động</span></td>
        <td style="text-align: right;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-action-edit" data-id="${item.id}" title="Chỉnh sửa">✎</button>
            <button class="btn-action btn-action-delete" data-id="${item.id}" title="Xóa danh mục">✕</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach Edit
    tableBody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cat = window.AppState.getCategories().find(c => c.id === Number(id));
        if (cat) openEditModal(cat);
      });
    });

    // Attach Delete
    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Bạn có chắc muốn xóa danh mục này không?`)) {
          window.AppState.deleteCategory(id);
          if (window.showToast) window.showToast('Đã xóa danh mục thành công!', 'info');
          renderCategoriesTable();
        }
      });
    });
  }

  function openAddModal() {
    form.reset();
    document.getElementById('editCategoryId').value = '';
    if (modalTitle) modalTitle.textContent = 'Thêm Danh Mục Mới';
    if (modal) modal.classList.add('active');
  }

  function openEditModal(cat) {
    document.getElementById('editCategoryId').value = cat.id;
    document.getElementById('formCategoryName').value = cat.name;
    document.getElementById('formCategorySlug').value = cat.slug;
    document.getElementById('formCategoryDesc').value = cat.description || '';
    document.getElementById('formCategoryOrder').value = cat.sortOrder || 1;
    if (modalTitle) modalTitle.textContent = `Chỉnh Sửa Danh Mục: ${cat.name}`;
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', openAddModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editCategoryId').value;
      const name = document.getElementById('formCategoryName').value.trim();
      const slug = document.getElementById('formCategorySlug').value.trim();
      const description = document.getElementById('formCategoryDesc').value.trim();
      const sortOrder = Number(document.getElementById('formCategoryOrder').value);

      if (!name || !slug) {
        if (window.showToast) window.showToast('Vui lòng nhập tên và mã slug!', 'error');
        return;
      }

      const payload = { name, slug, description, sortOrder };
      if (id) payload.id = Number(id);

      window.AppState.saveCategory(payload);
      if (window.showToast) window.showToast(id ? 'Cập nhật danh mục thành công!' : 'Đã thêm danh mục mới!', 'success');

      closeModal();
      renderCategoriesTable();
    });
  }

  renderCategoriesTable();
});
