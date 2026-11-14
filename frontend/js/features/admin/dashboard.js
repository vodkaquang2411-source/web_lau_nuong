/**
 * LẨU NƯỚNG VN - ADMIN DASHBOARD LOGIC
 * Tính toán số liệu thống kê thời gian thực và Quản lý danh sách đặt bàn mới nhất
 */

document.addEventListener('DOMContentLoaded', () => {
  const statProducts = document.getElementById('statTotalProducts');
  const statCategories = document.getElementById('statTotalCategories');
  const statReservations = document.getElementById('statTotalReservations');
  const statPending = document.getElementById('statPendingReservations');
  const tableBody = document.getElementById('dashboardReservationTable');
  const btnLogout = document.getElementById('btnAdminLogout');
  const adminName = document.getElementById('adminUserName');

  if (!window.AppState) return;

  // 1. Cập nhật thông tin Admin đang đăng nhập
  const currentUser = window.AppState.getCurrentUser();
  if (currentUser && adminName) {
    adminName.textContent = currentUser.fullName;
  }

  // 2. Xử lý Đăng xuất
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      window.AppState.logout();
      if (window.showToast) {
        window.showToast('Đã đăng xuất khỏi tài khoản Quản trị viên.', 'info');
      }
      setTimeout(() => {
        window.location.href = '../pages/login.html';
      }, 700);
    });
  }

  // 3. Render số liệu thống kê
  function updateDashboardStats() {
    const products = window.AppState.getProducts();
    const categories = window.AppState.getCategories();
    const reservations = window.AppState.getReservations();
    const pendingCount = reservations.filter(r => r.status === 'pending').length;

    if (statProducts) statProducts.textContent = products.length;
    if (statCategories) statCategories.textContent = categories.length;
    if (statReservations) statReservations.textContent = reservations.length;
    if (statPending) statPending.textContent = pendingCount;
  }

  // 4. Render danh sách đặt bàn mới nhất (tối đa 5 lượt)
  function renderRecentReservations() {
    if (!tableBody) return;
    const reservations = window.AppState.getReservations().slice(0, 5);

    if (reservations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color: #999;">Chưa có lượt đặt bàn nào.</td></tr>`;
      return;
    }

    tableBody.innerHTML = reservations.map(item => {
      const statusMap = {
        pending: '<span class="status-pill status-pending">Chờ xác nhận</span>',
        confirmed: '<span class="status-pill status-confirmed">Đã xác nhận</span>',
        completed: '<span class="status-pill status-completed">Đã hoàn thành</span>',
        cancelled: '<span class="status-pill status-cancelled">Đã hủy</span>'
      };

      return `
        <tr>
          <td><strong style="color: var(--color-brand);">${item.code || '#' + item.id}</strong></td>
          <td><strong>${item.customerName}</strong></td>
          <td>${item.customerPhone}</td>
          <td>${item.branchName || 'Chi nhánh ' + item.branchId}</td>
          <td>${item.date} lúc ${item.time}</td>
          <td><strong>${item.guestCount}</strong> khách</td>
          <td>${statusMap[item.status] || item.status}</td>
          <td>
            <div class="action-btns">
              ${item.status === 'pending' ? `
                <button class="btn-action btn-action-confirm" data-id="${item.id}" title="Xác nhận lịch hẹn" style="color: var(--color-success); border-color: var(--color-success);">
                  ✓
                </button>
              ` : ''}
              <button class="btn-action btn-action-delete" data-id="${item.id}" title="Xóa lịch hẹn">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Confirm Actions
    tableBody.querySelectorAll('.btn-action-confirm').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.AppState.updateReservationStatus(id, 'confirmed');
        if (window.showToast) {
          window.showToast(`Đã xác nhận lượt đặt bàn ID #${id}!`, 'success', 'Cập nhật thành công');
        }
        updateDashboardStats();
        renderRecentReservations();
      });
    });

    // Attach Delete Actions
    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Bạn có chắc chắn muốn xóa lượt đặt bàn này không?')) {
          window.AppState.deleteReservation(id);
          if (window.showToast) {
            window.showToast(`Đã xóa lượt đặt bàn #${id}.`, 'info');
          }
          updateDashboardStats();
          renderRecentReservations();
        }
      });
    });
  }

  // Initial call
  updateDashboardStats();
  renderRecentReservations();
});
