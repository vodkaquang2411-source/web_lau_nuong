/**
 * LẨU NƯỚNG VN - RESERVATION FEATURE LOGIC
 * - Kiểm tra đăng nhập bắt buộc: Chỉ khi đăng nhập mới có thể đặt bàn
 * - Nhận diện và hiển thị set lẩu/combo người dùng đã chọn trước kèm món gọi thêm logic
 * - Kiểm tra ràng buộc dữ liệu (Validation), chống chọn ngày quá khứ
 * - Lưu trữ đặt bàn, tự động gắn món vào đơn và hiển thị phiếu xác nhận
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const dateInput = document.getElementById('reservationDate');
  const branchSelect = document.getElementById('branchSelect');
  const receiptModal = document.getElementById('receiptModalOverlay');
  const receiptCloseBtn = document.getElementById('receiptModalCloseBtn');
  const btnContinueMenu = document.getElementById('btnContinueMenu');
  const receiptDetails = document.getElementById('receiptDetails');
  const btnSubmitReservation = document.getElementById('btnSubmitReservation');
  const authNoticeContainer = document.getElementById('reservationAuthNotice');
  const preselectedContainer = document.getElementById('reservationPreselectedCombo');

  if (!form || !window.AppState) return;

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  // ========================================================
  // 1. KIỂM TRA ĐĂNG NHẬP BẮT BUỘC ĐỂ ĐẶT BÀN (AUTH GUARD)
  // ========================================================
  function initReservationAuthGuard() {
    const currentUser = window.AppState.getCurrentUser();
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const emailInput = document.getElementById('customerEmail');

    if (!currentUser) {
      // Chưa đăng nhập: Khóa form, đổi nút submit, hiển thị thông báo trang trọng
      if (authNoticeContainer) {
        authNoticeContainer.innerHTML = `
          <div style="background: #FFFBEB; border: 1.5px solid #F59E0B; border-radius: var(--radius-md); padding: 18px 20px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08);">
            <div style="display: flex; align-items: flex-start; gap: 14px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; font-size: 1.05rem; color: #92400E; font-weight: 700;">Yêu cầu đăng nhập để đặt bàn</h4>
                <p style="margin: 0 0 12px 0; font-size: 0.88rem; color: #78350F; line-height: 1.5;">
                  Để bảo vệ quyền lợi tích điểm hội viên, áp dụng ưu đãi giảm 10% và xác nhận giữ chỗ chính xác, quý khách vui lòng đăng nhập hoặc tạo tài khoản mới trước khi gửi phiếu đặt bàn.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <a href="login.html?redirect=reservation.html" class="btn btn-primary btn-sm" style="font-size: 0.85rem; padding: 8px 18px; display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                    Đăng nhập ngay
                  </a>
                  <a href="register.html?redirect=reservation.html" class="btn btn-secondary btn-sm" style="font-size: 0.85rem; padding: 8px 18px;">
                    Đăng ký tài khoản mới
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // Khóa tương tác của form
      form.style.opacity = '0.55';
      form.style.pointerEvents = 'none';
      form.style.userSelect = 'none';

      if (btnSubmitReservation) {
        btnSubmitReservation.disabled = true;
        btnSubmitReservation.style.background = '#9CA3AF';
        btnSubmitReservation.style.borderColor = '#9CA3AF';
        btnSubmitReservation.style.cursor = 'not-allowed';
        btnSubmitReservation.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Vui lòng đăng nhập để đặt bàn
        `;
      }
    } else {
      // Đã đăng nhập: Mở khóa form và hiển thị thẻ xác nhận tài khoản
      form.style.opacity = '1';
      form.style.pointerEvents = 'auto';
      form.style.userSelect = 'auto';

      if (btnSubmitReservation) {
        btnSubmitReservation.disabled = false;
        btnSubmitReservation.style.background = '';
        btnSubmitReservation.style.borderColor = '';
        btnSubmitReservation.style.cursor = 'pointer';
        btnSubmitReservation.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Xác nhận đặt bàn ngay
        `;
      }

      if (authNoticeContainer) {
        authNoticeContainer.innerHTML = `
          <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: var(--radius-md); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.06);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <div style="font-size: 0.92rem; color: #166534; font-weight: 700;">
                  Tài khoản đặt bàn: <span style="color: var(--color-brand);">${currentUser.fullName || 'Khách hàng thân thiết'}</span>
                </div>
                <div style="font-size: 0.82rem; color: #15803D; margin-top: 2px;">
                  Email: ${currentUser.email || 'N/A'} ${currentUser.phone ? ` • Số điện thoại: ${currentUser.phone}` : ''}
                </div>
              </div>
            </div>
            <div>
              <button type="button" id="btnChangeAccount" class="btn btn-ghost btn-sm" style="font-size: 0.82rem; padding: 6px 12px; color: #166534; text-decoration: underline; cursor: pointer;">
                Đổi tài khoản
              </button>
            </div>
          </div>
        `;

        const btnChange = document.getElementById('btnChangeAccount');
        if (btnChange) {
          btnChange.addEventListener('click', () => {
            window.AppState.logout();
            window.location.href = 'login.html?redirect=reservation.html';
          });
        }
      }

      // Tự động điền thông tin (Pre-fill) từ tài khoản đang đăng nhập
      if (nameInput && (!nameInput.value || nameInput.value.trim() === '')) {
        nameInput.value = currentUser.fullName || '';
      }
      if (phoneInput && (!phoneInput.value || phoneInput.value.trim() === '')) {
        phoneInput.value = currentUser.phone || '';
      }
      if (emailInput && (!emailInput.value || emailInput.value.trim() === '')) {
        emailInput.value = currentUser.email || '';
      }
    }
  }

  initReservationAuthGuard();

  // ========================================================
  // 2. NHẬN DIỆN VÀ HIỂN THỊ SET LẨU ĐÃ CHỌN TRƯỚC (HIỆN RÕ GIÁ & ĐỒ ĐI KÈM)
  // ========================================================
  const comboSelectEl = document.getElementById('reservationComboSelect');

  function renderPreselectedComboCard(comboData) {
    if (!preselectedContainer) return;

    if (!comboData || !comboData.productName) {
      preselectedContainer.style.display = 'none';
      preselectedContainer.innerHTML = '';
      if (comboSelectEl) comboSelectEl.value = '';
      return;
    }

    const { productId, productName, price, servingSize, broth, addOns } = comboData;
    const addOnList = Array.isArray(addOns) ? addOns.filter(a => a.quantity > 0) : [];
    const addOnsTotal = addOnList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = (price || 0) + addOnsTotal;

    // Lấy thông tin chi tiết các món đi kèm từ AppState nếu có
    const originalProd = window.AppState.getProductById(productId);
    const includedItems = (originalProd && originalProd.comboDetails && originalProd.comboDetails.includedItems) 
      ? originalProd.comboDetails.includedItems 
      : [];

    preselectedContainer.style.display = 'block';
    preselectedContainer.innerHTML = `
      <div style="background: #FFFDF9; border: 2px solid var(--color-gold); border-radius: var(--radius-md); padding: 20px 22px; box-shadow: 0 6px 18px rgba(184, 134, 11, 0.12); margin-bottom: 22px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #E2D7C5; padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; background: var(--color-gold); color: white; padding: 3px 10px; border-radius: 4px; letter-spacing: 0.5px;">Món đã chọn cho bàn này</span>
            <span style="font-size: 0.85rem; color: #166534; background: #DCFCE7; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${servingSize || 'Thực đơn trọn vị'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <a href="combo-detail.html?id=${productId}" target="_blank" style="font-size: 0.82rem; color: var(--color-brand); font-weight: 600; text-decoration: underline;">
              Xem trang chi tiết món
            </a>
            <button type="button" id="btnRemovePreselectedCombo" class="btn btn-ghost btn-sm" style="font-size: 0.82rem; padding: 2px 6px; color: #991B1B; text-decoration: underline;" title="Hủy chọn trước set lẩu">
              Hủy chọn món
            </button>
          </div>
        </div>

        <!-- Tên món & Giá tiền hiển thị to rõ ràng ngay lập tức -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-primary);">${productName}</div>
            ${broth ? `
              <div style="font-size: 0.88rem; color: var(--color-gray-600); margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                <strong style="color: var(--color-dark);">Nước lẩu cốt:</strong>
                <span>${broth}</span>
              </div>
            ` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; color: var(--color-gray-500); text-transform: uppercase; font-weight: 700;">Giá niêm yết set lẩu:</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: var(--color-brand);">${formatPrice(price)}</div>
          </div>
        </div>

        <!-- Danh sách đồ nhúng & thành phần trọn gói kèm định lượng -->
        ${includedItems.length > 0 ? `
          <div style="background: white; border: 1px solid #EBE4D8; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
            <div style="font-size: 0.84rem; font-weight: 700; color: var(--color-dark); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span>Đồ nhúng & thành phần trọn gói đã bao gồm (${includedItems.length} món):</span>
              <span style="font-size: 0.76rem; color: #166534; font-weight: 600;">Không tính thêm phí</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px;">
              ${includedItems.map(item => `
                <div style="background: #FCFAF6; padding: 6px 10px; border-radius: 6px; border: 1px solid #ECE3D7; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
                  <span style="font-weight: 600; color: var(--color-dark);">${item.name}</span>
                  <span style="font-weight: 700; color: #166534; font-size: 0.78rem; background: #F0FDF4; padding: 2px 6px; border-radius: 4px; border: 1px solid #BBF7D0;">${item.amount}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${addOnList.length > 0 ? `
          <div style="background: white; border-radius: 8px; border: 1px solid #EBE4D8; padding: 12px 14px; margin-bottom: 12px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-dark); margin-bottom: 6px;">Món nhúng gọi thêm kèm theo:</div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; color: var(--color-gray-700); display: flex; flex-direction: column; gap: 4px;">
              ${addOnList.map(a => `
                <li style="display: flex; justify-content: space-between;">
                  <span>${a.name} <strong style="color: var(--color-brand);">x${a.quantity}</strong></span>
                  <span style="color: var(--color-gray-600); font-weight: 600;">${formatPrice(a.price * a.quantity)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Hàng hiển thị tổng tiền dự kiến nổi bật -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #E2D7C5; padding-top: 12px; margin-top: 6px;">
          <div>
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--color-dark);">Tổng tiền món ăn dự kiến:</div>
            <div style="font-size: 0.78rem; color: #166534;">Áp dụng ưu đãi giảm 10% khi nhà hàng xác nhận đơn</div>
          </div>
          <div style="font-size: 1.65rem; font-weight: 900; color: var(--color-brand);">${formatPrice(grandTotal)}</div>
        </div>
      </div>
    `;

    // Đồng bộ lại giá trị trong dropdown chọn combo
    if (comboSelectEl) {
      comboSelectEl.value = String(productId || '');
    }

    // Tự động ghi chú vào ô Ghi chú đặt bàn
    const noteInput = document.getElementById('reservationNote');
    if (noteInput) {
      const addonSummary = addOnList.length > 0 
        ? ` + Món gọi thêm: ${addOnList.map(a => `${a.name} x${a.quantity}`).join(', ')}`
        : '';
      const textToInsert = `[Khách đặt trước: ${productName} (${servingSize || 'Tiêu chuẩn'}) - Giá: ${formatPrice(grandTotal)}${addonSummary}]`;
      if (!noteInput.value || noteInput.value.trim() === '' || noteInput.value.includes('[Khách đặt trước:')) {
        noteInput.value = textToInsert;
      }
    }

    // Xử lý nút hủy chọn món
    const btnRemove = document.getElementById('btnRemovePreselectedCombo');
    if (btnRemove) {
      btnRemove.addEventListener('click', () => {
        sessionStorage.removeItem('launuong_preselected_combo');
        preselectedContainer.style.display = 'none';
        preselectedContainer.innerHTML = '';
        if (comboSelectEl) comboSelectEl.value = '';
        const noteEl = document.getElementById('reservationNote');
        if (noteEl && noteEl.value.includes('[Khách đặt trước:')) {
          noteEl.value = '';
        }
        if (window.showToast) {
          window.showToast('Đã hủy chọn trước set lẩu. Quý khách chỉ đặt bàn giữ chỗ.', 'info', 'Đã hủy món');
        }
      });
    }
  }

  function initPreselectedCombo() {
    let comboData = null;
    try {
      const stored = sessionStorage.getItem('launuong_preselected_combo');
      if (stored) comboData = JSON.parse(stored);
    } catch (e) {
      comboData = null;
    }

    if (comboData && comboData.productName) {
      renderPreselectedComboCard(comboData);
    } else {
      if (preselectedContainer) {
        preselectedContainer.style.display = 'none';
        preselectedContainer.innerHTML = '';
      }
    }

    // Lắng nghe sự kiện thay đổi combo trực tiếp từ dropdown trên trang đặt bàn
    if (comboSelectEl) {
      comboSelectEl.addEventListener('change', () => {
        const selectedId = Number(comboSelectEl.value);
        if (!selectedId) {
          sessionStorage.removeItem('launuong_preselected_combo');
          if (preselectedContainer) {
            preselectedContainer.style.display = 'none';
            preselectedContainer.innerHTML = '';
          }
          const noteEl = document.getElementById('reservationNote');
          if (noteEl && noteEl.value.includes('[Khách đặt trước:')) {
            noteEl.value = '';
          }
          if (window.showToast) {
            window.showToast('Đã xóa món đặt trước. Chỉ đặt bàn giữ chỗ.', 'info');
          }
          return;
        }

        const prod = window.AppState.getProductById(selectedId);
        if (prod) {
          const newComboData = {
            productId: prod.id,
            productName: prod.name,
            servingSize: prod.comboDetails ? prod.comboDetails.servingSize : 'Tiêu chuẩn',
            broth: prod.comboDetails ? prod.comboDetails.broth : '',
            price: prod.price,
            addOns: []
          };

          try {
            sessionStorage.setItem('launuong_preselected_combo', JSON.stringify(newComboData));
          } catch (e) {}

          renderPreselectedComboCard(newComboData);
          if (window.showToast) {
            window.showToast(`Đã chọn "${prod.name}" cho bàn đặt. Giá: ${formatPrice(prod.price)}`, 'success', 'Đã chọn món');
          }
        }
      });
    }
  }

  initPreselectedCombo();

  // ========================================================
  // 3. THIẾT LẬP NGÀY VÀ CHI NHÁNH MẶC ĐỊNH
  // ========================================================
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    dateInput.min = minDateStr;
    if (!dateInput.value) {
      dateInput.value = minDateStr;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const branchParam = urlParams.get('branch');
  if (branchParam && branchSelect) {
    branchSelect.value = branchParam;
  }

  // ========================================================
  // 4. KIỂM TRA RÀNG BUỘC VÀ XÁC NHẬN ĐẶT BÀN (SUBMIT FORM)
  // ========================================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Kiểm tra đăng nhập (Client-side Security Guard)
    const currentUser = window.AppState.getCurrentUser();
    if (!currentUser) {
      if (window.showToast) {
        window.showToast('Quý khách vui lòng đăng nhập tài khoản trước khi gửi thông tin đặt bàn.', 'error', 'Yêu cầu đăng nhập');
      }
      setTimeout(() => {
        window.location.href = 'login.html?redirect=reservation.html';
      }, 1000);
      return;
    }

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

    // 5. Lưu thông tin đặt bàn vào AppState
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

    // 6. Tự động gắn set lẩu và món nhúng đã chọn trước vào đơn đặt bàn
    let preselectedSummaryHtml = '';
    try {
      const stored = sessionStorage.getItem('launuong_preselected_combo');
      if (stored) {
        const comboData = JSON.parse(stored);
        if (comboData && comboData.productId) {
          window.AppState.addDishToReservation(savedRecord.id, comboData.productId, 1, comboData.price, comboData.productName);

          if (Array.isArray(comboData.addOns)) {
            comboData.addOns.forEach(addon => {
              if (addon.quantity > 0) {
                window.AppState.addDishToReservation(savedRecord.id, addon.id, addon.quantity, addon.price, addon.name);
              }
            });
          }

          const addOnList = (comboData.addOns || []).filter(a => a.quantity > 0);
          const addOnsTotal = addOnList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const comboGrandTotal = (comboData.price || 0) + addOnsTotal;

          preselectedSummaryHtml = `
            <div style="background: #FFFDF9; border: 1px solid var(--color-gold); border-radius: var(--radius-sm); padding: 10px 14px; margin-top: 12px; margin-bottom: 8px;">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">
                Món đặt trước: <span style="color: var(--color-brand);">${comboData.productName}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--color-gray-600);">
                Khẩu phần: ${comboData.servingSize || 'Tiêu chuẩn'} • Giá set: ${formatPrice(comboData.price)}
              </div>
              ${addOnList.length > 0 ? `
                <div style="font-size: 0.8rem; color: var(--color-gray-700); margin-top: 4px;">
                  Món nhúng thêm: ${addOnList.map(a => `${a.name} x${a.quantity}`).join(', ')}
                </div>
              ` : ''}
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-brand); margin-top: 6px; border-top: 1px dashed #E5D8C3; padding-top: 4px;">
                Tạm tính món ăn: ${formatPrice(comboGrandTotal)}
              </div>
            </div>
          `;

          // Xóa sau khi đã lưu thành công vào đơn
          sessionStorage.removeItem('launuong_preselected_combo');
          if (preselectedContainer) {
            preselectedContainer.style.display = 'none';
            preselectedContainer.innerHTML = '';
          }
        }
      }
    } catch (err) {}

    // 7. Hiển thị thông báo Toast
    if (window.showToast) {
      window.showToast(`Đặt bàn thành công! Mã số đặt bàn của bạn là ${savedRecord.code}.`, 'success', 'Thành công', 5000);
    }

    // 8. Hiển thị Modal Phiếu Đặt Bàn (Receipt)
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
        ${preselectedSummaryHtml}
        ${savedRecord.note ? `<div style="margin-top: 6px;">Ghi chú: <em>${savedRecord.note}</em></div>` : ''}
        <div style="margin-top: 12px; font-size: 0.8rem; color: var(--color-gray-500); border-top: 1px solid var(--color-gray-200); padding-top: 8px;">
          Lưu ý: Nhà hàng sẽ liên hệ xác nhận trong vòng 10 phút. Bàn được giữ tối đa 15 phút.
        </div>
      `;

      receiptModal.classList.add('active');
    }

    form.reset();
    initReservationAuthGuard();
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
