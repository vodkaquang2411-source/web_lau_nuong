/**
 * LẨU NƯỚNG VN - ADMIN CUSTOMERS LOGIC
 * Quản lý danh sách tài khoản khách hàng và Phân quyền
 */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('adminCustomersTableBody');
  const searchInput = document.getElementById('adminCustomerSearch');

  if (!tableBody || !window.AppState) return;

  let searchQuery = '';

  function renderCustomersTable() {
    let list = window.AppState.getCustomers();

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.fullName.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.phone && c.phone.includes(q))
      );
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #888;">Không tìm thấy khách hàng nào.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(item => `
      <tr>
        <td><strong>#${item.id}</strong></td>
        <td><strong>${item.fullName}</strong></td>
        <td>${item.email}</td>
        <td>${item.phone || 'Chưa cập nhật'}</td>
        <td>
          <span class="badge" style="background: ${item.role === 'admin' ? 'var(--color-primary)' : '#E5E7EB'}; color: ${item.role === 'admin' ? 'var(--color-gold)' : '#374151'};">
            ${item.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
          </span>
        </td>
        <td><strong>${item.bookingCount || 0}</strong> lượt</td>
        <td>
          <span class="status-pill ${item.status === 'active' ? 'status-active' : 'status-cancelled'}">
            ${item.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
          </span>
        </td>
        <td style="text-align: right;">
          ${item.role !== 'admin' ? `
            <button class="btn-action btn-toggle-user-status" data-id="${item.id}" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt lại'}">
              ${item.status === 'active' ? '🔒' : '🔓'}
            </button>
          ` : '<span style="color: #999; font-size: 0.8rem;">Cố định</span>'}
        </td>
      </tr>
    `).join('');

    // Attach Toggle User Status
    tableBody.querySelectorAll('.btn-toggle-user-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const newStatus = window.AppState.toggleCustomerStatus(id);
        if (newStatus) {
          if (window.showToast) {
            window.showToast(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công!`, 'info');
          }
          renderCustomersTable();
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCustomersTable();
    });
  }

  renderCustomersTable();
});
