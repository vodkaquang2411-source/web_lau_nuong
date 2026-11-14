/**
 * LẨU NƯỚNG VN - RESERVATION FEATURE LOGIC
 * Kiểm tra ràng buộc dữ liệu (Validation), Ngăn chọn ngày quá khứ,
 * Lưu trữ đặt bàn vào hệ thống và hiển thị hóa đơn xác nhận.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const dateInput = document.getElementById('reservationDate');
  const branchSelect = document.getElementById('branchSelect');
  const receiptModal = document.getElementById('receiptModalOverlay');
  const receiptCloseBtn = document.getElementById('receiptModalCloseBtn');
  const btnContinueMenu = document.getElementById('btnContinueMenu');
  const receiptDetails = document.getElementById('receiptDetails');

  if (!form || !window.AppState) return;

  // 1. Chống chọn ngày trong quá khứ (Set min date = hôm nay)
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    dateInput.min = minDateStr;
    dateInput.value = minDateStr; // Mặc định chọn ngày hôm nay
  }

  // 2. Tự động chọn chi nhánh nếu URL có tham số (?branch=id)
  const urlParams = new URLSearchParams(window.location.search);
  const branchParam = urlParams.get('branch');
  if (branchParam && branchSelect) {
    branchSelect.value = branchParam;
  }

  // 3. Tự động điền thông tin nếu khách hàng đã đăng nhập
  const currentUser = window.AppState.getCurrentUser();
  if (currentUser) {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const emailInput = document.getElementById('customerEmail');
    if (nameInput && currentUser.fullName) nameInput.value = currentUser.fullName;
    if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;
    if (emailInput && currentUser.email) emailInput.value = currentUser.email;
  }

  // 4. Validate & Submit Form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const branchId = branchSelect.value;
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const date = dateInput.value;
    const time = document.getElementById('reservationTime').value;
    const guests = document.getElementById('guestCount').value;
    const note = document.getElementById('reservationNote').value.trim();

    let isValid = true;

    // Validate Branch
    if (!branchId) {
      document.getElementById('errorBranch').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('errorBranch').style.display = 'none';
    }

    // Validate Name
    if (!name || name.length < 3) {
      document.getElementById('errorName').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('errorName').style.display = 'none';
    }

    // Validate Phone (Vietnam 10 digits)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
      document.getElementById('errorPhone').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('errorPhone').style.display = 'none';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('errorEmail').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('errorEmail').style.display = 'none';
    }

    // Validate Date (Không được chọn ngày quá khứ)
    if (!date) {
      document.getElementById('errorDate').style.display = 'block';
      isValid = false;
    } else {
      const selectedDate = new Date(date + 'T00:00:00');
      const todayDate = new Date();
      todayDate.setHours(0,0,0,0);
      if (selectedDate < todayDate) {
        document.getElementById('errorDate').textContent = 'Không thể chọn ngày trong quá khứ.';
        document.getElementById('errorDate').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorDate').style.display = 'none';
      }
    }

    // Validate Time
    if (!time) {
      document.getElementById('errorTime').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('errorTime').style.display = 'none';
    }

    // Validate Guests
    if (!guests || Number(guests) < 1 || Number(guests) > 50) {
      document.getElementById('errorGuests').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('errorGuests').style.display = 'none';
    }

    if (!isValid) {
      if (window.showToast) {
        window.showToast('Vui lòng kiểm tra lại các trường thông tin báo đỏ.', 'error', 'Thông tin chưa hợp lệ');
      }
      return;
    }

    // 5. Lưu vào AppState
    const reservationData = {
      branchId: Number(branchId),
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      date: date,
      time: time,
      guestCount: Number(guests),
      note: note
    };

    const savedRecord = window.AppState.saveReservation(reservationData);

    // 6. Hiển thị thông báo Toast
    if (window.showToast) {
      window.showToast(`Đặt bàn thành công! Mã số đặt bàn của bạn là ${savedRecord.code}.`, 'success', 'Thành công', 5000);
    }

    // 7. Hiển thị Modal Phiếu Đặt Bàn (Receipt)
    if (receiptDetails && receiptModal) {
      receiptDetails.innerHTML = `
        <div style="border-bottom: 1px dashed var(--color-gray-300); padding-bottom: 10px; margin-bottom: 10px;">
          <div>Mã đặt bàn: <strong style="color: var(--color-brand); font-size: 1.1rem;">${savedRecord.code}</strong></div>
          <div>Trạng thái: <span class="badge" style="background: #FEF3C7; color: #92400E;">Chờ xác nhận</span></div>
        </div>
        <div>Khách hàng: <strong>${savedRecord.customerName}</strong></div>
        <div>Số điện thoại: <strong>${savedRecord.customerPhone}</strong></div>
        <div>Chi nhánh: <strong>${savedRecord.branchName}</strong></div>
        <div>Thời gian: <strong>${savedRecord.time} - Ngày ${savedRecord.date}</strong></div>
        <div>Số lượng khách: <strong>${savedRecord.guestCount} người</strong></div>
        ${savedRecord.note ? `<div>Ghi chú: <em>${savedRecord.note}</em></div>` : ''}
        <div style="margin-top: 12px; font-size: 0.8rem; color: var(--color-gray-500); border-top: 1px solid var(--color-gray-200); padding-top: 8px;">
          Lưu ý: Nhà hàng sẽ liên hệ xác nhận trong vòng 10 phút. Bàn được giữ tối đa 15 phút.
        </div>
      `;

      receiptModal.classList.add('active');
    }

    form.reset();
  });

  // Modal close handlers
  if (receiptCloseBtn) {
    receiptCloseBtn.addEventListener('click', () => {
      receiptModal.classList.remove('active');
    });
  }

  if (btnContinueMenu) {
    btnContinueMenu.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  }

  if (receiptModal) {
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) {
        receiptModal.classList.remove('active');
      }
    });
  }
});
