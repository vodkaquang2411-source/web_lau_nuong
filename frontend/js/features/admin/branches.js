/**
 * LẨU NƯỚNG VN - ADMIN BRANCHES CRUD LOGIC
 * Quản lý thông tin chi nhánh nhà hàng (Thêm, Sửa, Đổi trạng thái, Xóa)
 */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('adminBranchesTableBody');
  const modal = document.getElementById('branchFormModal');
  const btnOpenAdd = document.getElementById('btnOpenAddBranchModal');
  const btnClose = document.getElementById('closeBranchFormModal');
  const btnCancel = document.getElementById('btnCancelBranchModal');
  const form = document.getElementById('branchCrudForm');
  const modalTitle = document.getElementById('modalBranchTitle');

  if (!tableBody || !window.AppState) return;

  function renderBranchesTable() {
    const list = window.AppState.getBranches();

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #888;">Chưa có chi nhánh nào.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(item => `
      <tr>
        <td><strong>#${item.id}</strong></td>
        <td><strong style="color: var(--color-primary);">${item.name}</strong></td>
        <td>${item.address}</td>
        <td><strong>${item.phone}</strong></td>
        <td>${item.hours || '10:00 - 23:00'}</td>
        <td>
          <button class="status-pill ${item.isActive ? 'status-active' : 'status-inactive'} btn-toggle-branch" data-id="${item.id}" style="border:none; cursor:pointer;">
            ${item.isActive ? 'Đang mở cửa' : 'Tạm dừng'}
          </button>
        </td>
        <td style="text-align: right;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-action-edit" data-id="${item.id}" title="Sửa chi nhánh">✎</button>
            <button class="btn-action btn-action-delete" data-id="${item.id}" title="Xóa chi nhánh">✕</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Toggle active
    tableBody.querySelectorAll('.btn-toggle-branch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const branch = window.AppState.getBranchById(id);
        if (branch) {
          branch.isActive = !branch.isActive;
          window.AppState.saveBranch(branch);
          if (window.showToast) window.showToast(`Đã đổi trạng thái chi nhánh: ${branch.name}`, 'info');
          renderBranchesTable();
        }
      });
    });

    // Edit
    tableBody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const branch = window.AppState.getBranchById(id);
        if (branch) openEditModal(branch);
      });
    });

    // Delete
    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Bạn có chắc muốn xóa chi nhánh này không?`)) {
          window.AppState.deleteBranch(id);
          if (window.showToast) window.showToast('Đã xóa chi nhánh.', 'info');
          renderBranchesTable();
        }
      });
    });
  }

  function openAddModal() {
    form.reset();
    document.getElementById('editBranchId').value = '';
    if (modalTitle) modalTitle.textContent = 'Thêm Chi Nhánh Mới';
    if (modal) modal.classList.add('active');
  }

  function openEditModal(b) {
    document.getElementById('editBranchId').value = b.id;
    document.getElementById('formBranchName').value = b.name;
    document.getElementById('formBranchAddress').value = b.address;
    document.getElementById('formBranchPhone').value = b.phone;
    document.getElementById('formBranchHours').value = b.hours || '10:00 - 23:00';
    document.getElementById('formBranchImage').value = b.imageUrl || '';
    if (modalTitle) modalTitle.textContent = `Chỉnh Sửa: ${b.name}`;
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (btnOpenAdd) btnOpenAdd.addEventListener('click', openAddModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editBranchId').value;
      const name = document.getElementById('formBranchName').value.trim();
      const address = document.getElementById('formBranchAddress').value.trim();
      const phone = document.getElementById('formBranchPhone').value.trim();
      const hours = document.getElementById('formBranchHours').value.trim();
      const imageUrl = document.getElementById('formBranchImage').value.trim();

      if (!name || !address || !phone) {
        if (window.showToast) window.showToast('Vui lòng điền đủ tên, địa chỉ và điện thoại!', 'error');
        return;
      }

      const payload = { name, address, phone, hours, imageUrl };
      if (id) payload.id = Number(id);

      window.AppState.saveBranch(payload);
      if (window.showToast) window.showToast(id ? 'Cập nhật chi nhánh thành công!' : 'Đã thêm chi nhánh mới!', 'success');

      closeModal();
      renderBranchesTable();
    });
  }

  renderBranchesTable();
});
