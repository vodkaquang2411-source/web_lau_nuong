/**
 * LẨU NƯỚNG VN - ADMIN RESERVATIONS CRUD LOGIC
 * Quản lý quy trình duyệt đơn đặt bàn: Chờ xác nhận -> Đã xác nhận -> Hoàn thành / Hủy
 */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('adminReservationsTableBody');
  const searchInput = document.getElementById('adminReservationSearch');
  const statusFilter = document.getElementById('adminReservationStatusFilter');
  const modal = document.getElementById('reservationDetailModal');
  const modalClose = document.getElementById('closeReservationDetailModal');
  const btnCancelModal = document.getElementById('btnCancelResDetailModal');
  const btnRefresh = document.getElementById('btnRefreshReservations');
  const formUpdateStatus = document.getElementById('updateReservationStatusForm');

  if (!tableBody || !window.AppState) return;

  let searchQuery = '';
  let selectedStatus = 'all';

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  function renderReservationsTable() {
    let list = window.AppState.getReservations();

    if (selectedStatus !== 'all') {
      list = list.filter(r => r.status === selectedStatus);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        r.customerName.toLowerCase().includes(q) || 
        r.customerPhone.includes(q) || 
        (r.code && r.code.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: #888;">Không tìm thấy lịch đặt bàn nào.</td></tr>`;
      return;
    }

    const statusPillMap = {
      pending: '<span class="status-pill status-pending">Chờ xác nhận</span>',
      confirmed: '<span class="status-pill status-confirmed">Đã xác nhận</span>',
      completed: '<span class="status-pill status-completed">Đã hoàn thành</span>',
      cancelled: '<span class="status-pill status-cancelled">Đã hủy</span>'
    };

    tableBody.innerHTML = list.map(item => `
      <tr>
        <td><strong style="color: var(--color-brand);">${item.code || '#' + item.id}</strong></td>
        <td><strong>${item.customerName}</strong></td>
        <td>${item.customerPhone}</td>
        <td>${item.branchName || 'Chi nhánh ' + item.branchId}</td>
        <td>${item.date}</td>
        <td><strong>${item.time}</strong></td>
        <td>${item.guestCount} khách</td>
        <td>
          ${item.paymentStatus === 'paid' ? `
            <span class="badge" style="background: #DCFCE7; color: #166534; padding: 3px 8px; border-radius: 10px; font-size: 0.74rem; font-weight: 700; white-space: nowrap;">
              ✓ Đã TT (${formatPrice(item.paymentAmount || 0)})
            </span>
          ` : `
            <span class="badge" style="background: #FEF3C7; color: #92400E; padding: 3px 8px; border-radius: 10px; font-size: 0.74rem; font-weight: 700; white-space: nowrap;">
              Chưa TT (TT sau)
            </span>
          `}
        </td>
        <td>${statusPillMap[item.status] || item.status}</td>
        <td style="text-align: right;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-action-view" data-id="${item.id}" title="Xem chi tiết & Cập nhật trạng thái">
              👁
            </button>
            <button class="btn-action btn-action-delete" data-id="${item.id}" title="Xóa lịch hẹn">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach View Detail
    tableBody.querySelectorAll('.btn-action-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const res = window.AppState.getReservations().find(r => r.id === Number(id));
        if (res) openDetailModal(res);
      });
    });

    // Attach Delete
    tableBody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Bạn có chắc muốn xóa yêu cầu đặt bàn #${id} không?`)) {
          window.AppState.deleteReservation(id);
          if (window.showToast) window.showToast(`Đã xóa đơn đặt bàn #${id}.`, 'info');
          renderReservationsTable();
        }
      });
    });
  }

  function openDetailModal(res) {
    document.getElementById('modalResId').value = res.id;
    document.getElementById('modalResCode').textContent = res.code || '#' + res.id;
    document.getElementById('modalResStatusSelect').value = res.status;

    const paymentSelect = document.getElementById('modalResPaymentSelect');
    if (paymentSelect) {
      paymentSelect.value = res.paymentStatus || 'unpaid';
    }

    const isPaid = res.paymentStatus === 'paid';
    const isDirect = res.paymentMethod === 'pay_now';

    const detailsBox = document.getElementById('modalResDetailsContent');
    detailsBox.innerHTML = `
      <div>Khách hàng: <strong>${res.customerName}</strong></div>
      <div>Điện thoại: <strong>${res.customerPhone}</strong></div>
      <div>Email: <strong>${res.customerEmail || 'Chưa cung cấp'}</strong></div>
      <div>Địa điểm: <strong>${res.branchName}</strong></div>
      <div>Thời gian đặt: <strong>${res.time} ngày ${res.date}</strong></div>
      <div>Số khách tham dự: <strong>${res.guestCount} người</strong></div>
      <div style="border-top: 1px dashed #dcd0bc; padding-top: 6px; margin-top: 6px;">
        <div>Hình thức thanh toán: <strong>${isDirect ? 'Thanh toán trước (VietQR)' : 'Thanh toán sau tại nhà hàng'}</strong></div>
        <div>Trạng thái thanh toán: <strong style="color: ${isPaid ? '#166534' : '#92400E'};">${isPaid ? '✓ Đã thanh toán' : 'Chưa thanh toán (Thanh toán sau)'}</strong></div>
        ${res.paymentAmount ? `<div>Số tiền thanh toán: <strong style="color: var(--color-brand);">${formatPrice(res.paymentAmount)}</strong></div>` : ''}
        ${res.paidAt ? `<div style="font-size: 0.8rem; color: #166534;">Thời điểm thanh toán: ${res.paidAt}</div>` : ''}
      </div>
      <div style="margin-top: 6px;">Ghi chú của khách: <em>${res.note || 'Không có yêu cầu đặc biệt'}</em></div>
      <div style="margin-top: 8px; font-size: 0.8rem; color: #888;">Thời điểm tạo yêu cầu: ${res.createdAt || 'Vừa xong'}</div>
    `;

    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (formUpdateStatus) {
    formUpdateStatus.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('modalResId').value;
      const newStatus = document.getElementById('modalResStatusSelect').value;
      const paymentSelect = document.getElementById('modalResPaymentSelect');
      const newPaymentStatus = paymentSelect ? paymentSelect.value : null;

      window.AppState.updateReservationStatus(id, newStatus, newPaymentStatus);
      if (window.showToast) {
        window.showToast(`Đã cập nhật trạng thái đơn đặt bàn #${id} thành công!`, 'success');
      }

      closeModal();
      renderReservationsTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderReservationsTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      selectedStatus = e.target.value;
      renderReservationsTable();
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      renderReservationsTable();
      if (window.showToast) window.showToast('Đã làm mới dữ liệu đặt bàn!', 'info');
    });
  }

  renderReservationsTable();
});
