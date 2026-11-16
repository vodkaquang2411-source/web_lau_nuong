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

  // Kiểm tra tham số ?tab=history trên URL để mở modal xem các bàn đã đặt
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'history') {
    setTimeout(() => {
      if (window.openUserAccountModal) {
        window.openUserAccountModal('reservations');
      }
    }, 300);
  }

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  // ========================================================
  // 1. TỰ ĐỘNG ĐIỀN THÔNG TIN TÀI KHOẢN NẾU ĐÃ ĐĂNG NHẬP
  // ========================================================
  function initReservationAuthGuard() {
    const currentUser = window.AppState.getCurrentUser();
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const emailInput = document.getElementById('customerEmail');

    // Luôn mở khóa form hoàn toàn để khách hàng đặt bàn thuận tiện nhất (không bắt buộc đăng nhập)
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
        Xác nhận đặt bàn & thanh toán ngay
      `;
    }

    if (authNoticeContainer) {
      authNoticeContainer.innerHTML = '';
      authNoticeContainer.style.display = 'none';
    }

    // Nếu khách hàng đã đăng nhập tài khoản thì tự động điền sẵn Họ tên, SĐT, Email
    if (currentUser) {
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
      <div class="preselected-card">
        <!-- Top Bar: Badge Món đã chọn + Các hành động -->
        <div class="preselected-top-bar">
          <div class="preselected-badge-tag">Món đã chọn cho bàn này</div>
          <div class="preselected-actions">
            ${Number(productId) === 999 
              ? `<a href="../index.html#hotpotCustomizer" class="preselected-link-action">Phối lại vị lẩu khác</a>`
              : `<a href="combo-detail.html?id=${productId}" target="_blank" class="preselected-link-action">Xem trang chi tiết món</a>`
            }
            <button type="button" id="btnRemovePreselectedCombo" class="preselected-btn-remove" title="Hủy chọn trước set lẩu">
              Hủy chọn món
            </button>
          </div>
        </div>

        <!-- Hàng tên món & Khẩu phần + Giá niêm yết (Không nhảy dòng) -->
        <div class="preselected-main-row">
          <div class="preselected-title-wrap">
            <h3 class="preselected-product-name">${productName}</h3>
            <div class="preselected-serving-tag">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <span>${servingSize || 'Thực đơn trọn vị'}</span>
            </div>
          </div>
          <div class="preselected-price-wrap">
            <span class="preselected-price-lbl">Giá niêm yết set lẩu:</span>
            <span class="preselected-price-val">${formatPrice(price)}</span>
          </div>
        </div>

        <!-- Khối vị nước lẩu cốt hiển thị theo từng ngăn ngay ngắn -->
        ${broth ? `
          <div class="preselected-broth-section">
            <div class="preselected-broth-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              <strong>Vị nước lẩu cốt đã phối:</strong>
            </div>
            <div class="preselected-broth-list">
              ${broth.split('|').map(item => `
                <div class="preselected-broth-pill">${item.trim()}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

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

        <!-- Danh sách món nhúng gọi thêm nếu có -->
        ${addOnList.length > 0 ? `
          <div style="background: white; border-radius: 8px; border: 1px solid #EBE4D8; padding: 12px 14px; margin-bottom: 12px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-dark); margin-bottom: 6px;">Món nhúng & đồ uống gọi thêm (${addOnList.length} món):</div>
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
        <div class="preselected-total-row">
          <div>
            <div class="preselected-total-lbl">Tổng tiền món ăn dự kiến:</div>
            <div class="preselected-total-sub">Áp dụng ưu đãi giảm 10% khi nhà hàng xác nhận đơn</div>
          </div>
          <div class="preselected-total-val">${formatPrice(grandTotal)}</div>
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

  const branchParam = urlParams ? urlParams.get('branch') : null;
  if (branchParam && branchSelect) {
    branchSelect.value = branchParam;
  }

  // ========================================================
  // 4. KIỂM TRA RÀNG BUỘC VÀ XÁC NHẬN ĐẶT BÀN (SUBMIT FORM)
  // ========================================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUser = window.AppState.getCurrentUser();
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
        window.showToast('Vui lòng kiểm tra lại các trường thông tin báo đỏ còn thiếu.', 'error', 'Thông tin chưa hợp lệ');
      }
      const firstInvalid = form.querySelector('.form-error-msg[style*="display: block"]');
      if (firstInvalid && firstInvalid.parentElement) {
        firstInvalid.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstInvalid.parentElement.querySelector('input, select, textarea');
        if (input) input.focus();
      }
      return;
    }

    // 5. Tính toán phương thức và số tiền thanh toán
    const paymentRadio = form.querySelector('input[name="paymentMethod"]:checked');
    const selectedPaymentMethod = paymentRadio ? paymentRadio.value : 'pay_later';

    // Tính tổng tiền món ăn hoặc tiền cọc giữ bàn
    let preselectedGrandTotal = 0;
    let preselectedComboData = null;
    try {
      const stored = sessionStorage.getItem('launuong_preselected_combo');
      if (stored) {
        preselectedComboData = JSON.parse(stored);
        if (preselectedComboData && preselectedComboData.productId) {
          const addOnList = (preselectedComboData.addOns || []).filter(a => a.quantity > 0);
          const addOnsTotal = addOnList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          preselectedGrandTotal = (preselectedComboData.price || 0) + addOnsTotal;
        }
      }
    } catch (e) {}

    // Nếu có món chọn trước thì số tiền thanh toán là tổng tiền món ăn, nếu chỉ đặt bàn giữ chỗ thì cọc 100.000 đ khi trả trực tiếp
    const depositAmount = 100000;
    const finalPaymentAmount = preselectedGrandTotal > 0 
      ? preselectedGrandTotal 
      : (selectedPaymentMethod === 'pay_now' ? depositAmount : 0);

    // 6. Lưu thông tin đặt bàn vào AppState
    const reservationData = {
      branchId: Number(branchId),
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      date: date,
      time: time,
      guestCount: Number(guests),
      note: note,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'unpaid',
      paymentAmount: finalPaymentAmount,
      userId: currentUser ? currentUser.id : null
    };

    const savedRecord = window.AppState.saveReservation(reservationData);

    // Lưu mã đặt bàn của khách vào localStorage để hiển thị trong mục "Bàn đã đặt"
    try {
      const guestCodes = JSON.parse(localStorage.getItem('launuong_guest_reservation_codes') || '[]');
      if (!guestCodes.includes(savedRecord.code)) {
        guestCodes.unshift(savedRecord.code);
        localStorage.setItem('launuong_guest_reservation_codes', JSON.stringify(guestCodes));
      }
    } catch (e) {}

    // 7. Gắn set lẩu và món nhúng đã chọn trước vào đơn đặt bàn
    let preselectedSummaryHtml = '';
    if (preselectedComboData && preselectedComboData.productId) {
      window.AppState.addDishToReservation(savedRecord.id, preselectedComboData.productId, 1, preselectedComboData.price, preselectedComboData.productName);

      if (Array.isArray(preselectedComboData.addOns)) {
        preselectedComboData.addOns.forEach(addon => {
          if (addon.quantity > 0) {
            window.AppState.addDishToReservation(savedRecord.id, addon.id, addon.quantity, addon.price, addon.name);
          }
        });
      }

      const addOnList = (preselectedComboData.addOns || []).filter(a => a.quantity > 0);
      const addOnsTotal = addOnList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const comboGrandTotal = (preselectedComboData.price || 0) + addOnsTotal;

      preselectedSummaryHtml = `
        <div style="background: #FFFDF9; border: 1px solid var(--color-gold); border-radius: var(--radius-sm); padding: 12px 14px; margin-top: 12px; margin-bottom: 8px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">
            Món đặt trước: <span style="color: var(--color-brand);">${preselectedComboData.productName}</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--color-gray-600);">
            Khẩu phần: ${preselectedComboData.servingSize || 'Tiêu chuẩn'} • Giá set: ${formatPrice(preselectedComboData.price)}
          </div>
          ${addOnList.length > 0 ? `
            <div style="font-size: 0.82rem; color: var(--color-gray-700); margin-top: 4px;">
              Món nhúng thêm: ${addOnList.map(a => `${a.name} x${a.quantity}`).join(', ')}
            </div>
          ` : ''}
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--color-brand); margin-top: 6px; border-top: 1px dashed #E5D8C3; padding-top: 6px; display: flex; justify-content: space-between;">
            <span>Tổng tiền món ăn dự kiến:</span>
            <span>${formatPrice(comboGrandTotal)}</span>
          </div>
        </div>
      `;
    }

    // 8. Định nghĩa mở Modal VietQR và Modal Phiếu xác nhận
    const directPayModal = document.getElementById('directPaymentModalOverlay');

    function openDirectPayModal(record) {
      if (!directPayModal) return;
      document.body.style.overflow = 'hidden';

      const cleanPhone = (record.customerPhone || '').replace(/\s+/g, '');
      const qrContent = `LAU ${record.code.replace(/[^A-Za-z0-9]/g, '')} ${cleanPhone.slice(-4)}`;
      const qrAmount = record.paymentAmount > 0 ? record.paymentAmount : 100000;
      const qrUrl = `https://img.vietqr.io/image/MB-0345662169-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(qrContent)}&accountName=LAU%20RESTAURANT`;

      const qrImg = document.getElementById('directPaymentQrImg');
      if (qrImg) qrImg.src = qrUrl;

      const qrAmountEl = document.getElementById('qrAmountDisplay');
      if (qrAmountEl) qrAmountEl.textContent = formatPrice(qrAmount);

      const qrContentEl = document.getElementById('qrContentDisplay');
      if (qrContentEl) qrContentEl.textContent = qrContent;

      const btnCopyAmt = document.getElementById('btnCopyAmount');
      if (btnCopyAmt) btnCopyAmt.setAttribute('data-copy', String(qrAmount));

      const btnCopyCnt = document.getElementById('btnCopyContent');
      if (btnCopyCnt) btnCopyCnt.setAttribute('data-copy', qrContent);

      if (receiptModal) receiptModal.classList.remove('active');
      directPayModal.classList.add('active');
      directPayModal.scrollTop = 0;

      if (window.showToast) {
        window.showToast(`Đặt bàn thành công! Mã đơn ${record.code}. Vui lòng quét mã VietQR để thanh toán trước.`, 'success', 'Thanh toán trước', 6000);
      }

      // Hook nút "Tôi đã chuyển khoản thành công"
      const btnConfirmPaid = document.getElementById('btnConfirmDirectPaid');
      if (btnConfirmPaid) {
        btnConfirmPaid.onclick = () => {
          window.AppState.updateReservationPayment(record.id, {
            paymentStatus: 'paid',
            paymentMethod: 'pay_now',
            paymentAmount: qrAmount
          });
          record.paymentStatus = 'paid';
          record.paymentAmount = qrAmount;
          directPayModal.classList.remove('active');

          if (window.showToast) {
            window.showToast(`Xác nhận thanh toán trước thành công cho đơn ${record.code}!`, 'success', 'Thanh toán thành công', 5000);
          }
          showReceiptModal(record);
        };
      }

      // Hook nút "Đổi sang thanh toán sau tại nhà hàng"
      const btnSwitchPayLater = document.getElementById('btnSwitchToPayLater');
      if (btnSwitchPayLater) {
        btnSwitchPayLater.onclick = () => {
          window.AppState.updateReservationPayment(record.id, {
            paymentStatus: 'unpaid',
            paymentMethod: 'pay_later',
            paymentAmount: Number(record.paymentAmount || finalPaymentAmount || 0)
          });
          record.paymentStatus = 'unpaid';
          record.paymentMethod = 'pay_later';
          directPayModal.classList.remove('active');

          if (window.showToast) {
            window.showToast(`Đã chuyển sang hình thức thanh toán sau tại nhà hàng.`, 'info', 'Thanh toán sau', 4000);
          }
          showReceiptModal(record);
        };
      }

      // Hook đóng modal VietQR
      const closeDirectPayBtn = document.getElementById('directPaymentModalCloseBtn');
      if (closeDirectPayBtn) {
        closeDirectPayBtn.onclick = () => {
          directPayModal.classList.remove('active');
          showReceiptModal(record);
        };
      }

      directPayModal.onclick = (e) => {
        if (e.target === directPayModal) {
          directPayModal.classList.remove('active');
          showReceiptModal(record);
        }
      };
    }

    function showReceiptModal(record) {
      if (!receiptDetails || !receiptModal) return;
      document.body.style.overflow = 'hidden';

      const isPaidDirect = record.paymentStatus === 'paid';
      const isPayNowMethod = record.paymentMethod === 'pay_now';

      const modalTitle = document.getElementById('receiptModalTitle');
      const modalSubtitle = document.getElementById('receiptModalSubtitle');
      const modalIcon = document.getElementById('receiptModalIcon');

      if (isPaidDirect) {
        if (modalTitle) modalTitle.textContent = 'Đặt bàn & thanh toán trước thành công!';
        if (modalSubtitle) modalSubtitle.textContent = 'Đơn của quý khách đã được xác thực thanh toán qua VietQR. Nhà hàng sẵn sàng đón tiếp!';
        if (modalIcon) {
          modalIcon.style.background = '#DCFCE7';
          modalIcon.style.color = '#166534';
          modalIcon.textContent = '✓';
        }
      } else {
        if (modalTitle) modalTitle.textContent = 'Đặt bàn thành công - Xác nhận thanh toán sau!';
        if (modalSubtitle) modalSubtitle.textContent = 'Mã đặt bàn đã được ghi nhận. Quý khách thanh toán tại quầy khi dùng bữa xong.';
        if (modalIcon) {
          modalIcon.style.background = 'var(--color-success-bg)';
          modalIcon.style.color = 'var(--color-success)';
          modalIcon.textContent = '✓';
        }
      }

      const paymentBannerHtml = isPaidDirect
        ? `
          <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div style="font-weight: 700; color: #166534; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Đã thanh toán trước qua VietQR MB Bank
            </div>
            <strong style="color: #166534; font-size: 1rem;">${formatPrice(record.paymentAmount)}</strong>
          </div>
        `
        : `
          <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <div style="font-weight: 700; color: #92400E; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                Hình thức: Thanh toán sau tại quầy khi dùng bữa
              </div>
              <span class="badge" style="background: #FEF3C7; color: #92400E; font-weight: 700;">Chưa thanh toán</span>
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #78350F; line-height: 1.5;">Quý khách vui lòng thanh toán bằng tiền mặt hoặc quẹt thẻ tại quầy lễ tân sau khi dùng bữa xong.</p>
            <button type="button" id="btnReceiptSwitchPayNow" class="btn btn-sm btn-gold" style="margin-top: 10px; width: 100%; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Quét mã VietQR chuyển khoản trước ngay (Giữ chỗ ưu tiên)
            </button>
          </div>
        `;

      receiptDetails.innerHTML = `
        ${paymentBannerHtml}
        <div style="border-bottom: 1px dashed var(--color-gray-300); padding-bottom: 10px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>Mã đặt bàn: <strong style="color: var(--color-brand); font-size: 1.2rem;">${record.code}</strong></div>
            <span class="badge" style="background: #DCFCE7; color: #166534; font-weight: 700;">Đã ghi nhận</span>
          </div>
        </div>
        <div>Khách hàng: <strong>${record.customerName}</strong></div>
        <div>Số điện thoại: <strong>${record.customerPhone}</strong></div>
        <div>Chi nhánh: <strong>${record.branchName}</strong></div>
        <div>Thời gian: <strong>${record.time} - Ngày ${record.date}</strong></div>
        <div>Số lượng khách: <strong>${record.guestCount} người</strong></div>
        ${preselectedSummaryHtml}
        ${record.note ? `<div style="margin-top: 6px;">Ghi chú: <em>${record.note}</em></div>` : ''}
        <div style="margin-top: 12px; font-size: 0.82rem; color: var(--color-gray-500); border-top: 1px solid var(--color-gray-200); padding-top: 8px;">
          Lưu ý: Nhà hàng sẽ liên hệ xác nhận trong vòng 10 phút. Bàn được giữ tối đa 15 phút so với giờ hẹn.
        </div>
      `;

      receiptModal.classList.add('active');
      receiptModal.scrollTop = 0;

      // Hook nút "Quét mã VietQR chuyển khoản trước ngay" từ trong Receipt Modal
      const btnSwitchNowInReceipt = document.getElementById('btnReceiptSwitchPayNow');
      if (btnSwitchNowInReceipt) {
        btnSwitchNowInReceipt.onclick = () => {
          openDirectPayModal(record);
        };
      }
    }

    // 9. Điều hướng mở modal theo lựa chọn ban đầu
    if (selectedPaymentMethod === 'pay_now' && directPayModal) {
      openDirectPayModal(savedRecord);
    } else {
      if (window.showToast) {
        window.showToast(`Đặt bàn thành công! Mã số đặt bàn của bạn là ${savedRecord.code}. Quý khách thanh toán sau khi dùng bữa xong.`, 'success', 'Đặt bàn thành công', 6000);
      }
      showReceiptModal(savedRecord);
    }

    if (window.updateReservationsBadge) {
      window.updateReservationsBadge();
    }
  });

  // ========================================================
  // 5. DỌN DẸP VÀ ĐÓNG MODAL AN TOÀN
  // ========================================================
  function cleanupAfterModal() {
    document.body.style.overflow = '';
    sessionStorage.removeItem('launuong_preselected_combo');
    if (preselectedContainer) {
      preselectedContainer.style.display = 'none';
      preselectedContainer.innerHTML = '';
    }
    form.reset();
    initReservationAuthGuard();
    if (window.updateReservationsBadge) {
      window.updateReservationsBadge();
    }
  }

  if (receiptCloseBtn) {
    receiptCloseBtn.addEventListener('click', () => {
      receiptModal.classList.remove('active');
      cleanupAfterModal();
    });
  }

  if (btnContinueMenu) {
    btnContinueMenu.addEventListener('click', () => {
      cleanupAfterModal();
      window.location.href = 'menu.html';
    });
  }

  if (receiptModal) {
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) {
        receiptModal.classList.remove('active');
        cleanupAfterModal();
      }
    });
  }

  // ========================================================
  // 9. XỬ LÝ CHỌN PHƯƠNG THỨC THANH TOÁN (INTERACTIVE RADIO CARDS)
  // ========================================================
  const cardLater = document.getElementById('payOptionLaterCard');
  const cardNow = document.getElementById('payOptionNowCard');
  const noticeBox = document.getElementById('directPaymentNoticeBox');

  function updatePaymentOptionCards(selectedMethod) {
    if (cardLater && cardNow) {
      const isNow = selectedMethod === 'pay_now';

      // Cập nhật kiểu dáng thẻ
      if (isNow) {
        cardNow.style.borderColor = 'var(--color-gold)';
        cardNow.style.background = '#FFFFFF';
        cardNow.style.boxShadow = '0 4px 12px rgba(201, 166, 107, 0.2)';
        cardLater.style.borderColor = '#E2D7C5';
        cardLater.style.background = '#FCFAF6';
        cardLater.style.boxShadow = 'none';
        if (noticeBox) noticeBox.style.display = 'block';
      } else {
        cardLater.style.borderColor = 'var(--color-gold)';
        cardLater.style.background = '#FFFFFF';
        cardLater.style.boxShadow = '0 4px 12px rgba(201, 166, 107, 0.2)';
        cardNow.style.borderColor = '#E2D7C5';
        cardNow.style.background = '#FCFAF6';
        cardNow.style.boxShadow = 'none';
        if (noticeBox) noticeBox.style.display = 'none';
      }

      const radio = form.querySelector(`input[name="paymentMethod"][value="${selectedMethod}"]`);
      if (radio) radio.checked = true;
    }
  }

  if (cardLater) {
    cardLater.addEventListener('click', () => updatePaymentOptionCards('pay_later'));
  }
  if (cardNow) {
    cardNow.addEventListener('click', () => updatePaymentOptionCards('pay_now'));
  }

  const paymentRadios = form.querySelectorAll('input[name="paymentMethod"]');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => updatePaymentOptionCards(radio.value));
  });

  // Hook sao chép nhanh vào Clipboard cho các nút trong Modal VietQR
  document.querySelectorAll('.btn-copy-field').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Đã chép!';
          btn.style.background = '#DCFCE7';
          btn.style.color = '#166534';
          btn.style.borderColor = '#86EFAC';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 1600);
        });
      }
    });
  });
});
