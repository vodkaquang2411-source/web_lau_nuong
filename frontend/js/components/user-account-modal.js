/**
 * LẨU NƯỚNG VN - USER ACCOUNT MODAL COMPONENT
 * Cửa sổ nhỏ quản lý tài khoản người dùng:
 * 1. Thay đổi thông tin cá nhân (họ tên, số điện thoại, đổi mật khẩu)
 * 2. Xem và quản lý các bàn đã đặt (lịch sử, trạng thái, hủy bàn đang chờ)
 * 3. Xem danh sách món ăn yêu thích (chi tiết món, bỏ thích)
 * 
 * Tuân thủ nghiêm ngặt:
 * - Khung nhỏ gọn (modal popup không mở trang mới)
 * - Không dùng icon AI hay emoji (chỉ dùng SVG vector tối giản)
 * - Chỉ viết hoa chữ cái đầu tiên (Sentence case)
 */

(function () {
  'use strict';

  // Định dạng giá tiền VNĐ
  function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  }

  // Khởi tạo và gắn Modal DOM vào body nếu chưa tồn tại
  function ensureModalDOMElements() {
    if (document.getElementById('userAccountModalOverlay')) return;

    const modalHtml = `
      <div class="modal-overlay" id="userAccountModalOverlay" aria-hidden="true" style="z-index: 2100;">
        <div class="modal-content" id="userAccountModalContent" style="max-width: 520px; width: 92%; padding: 0; border-radius: 14px; overflow: hidden; border: 1px solid rgba(201,166,107,0.35); box-shadow: 0 18px 45px rgba(0,0,0,0.35); display: flex; flex-direction: column; max-height: 86vh;">
          
          <!-- Modal Header -->
          <div style="background: var(--color-primary, #1e1918); color: #fff; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-gold, #c9a66b); position: relative;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold, #c9a66b)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h3 style="margin: 0; font-size: 1.15rem; color: #fff; font-weight: 600;">Tài khoản của bạn</h3>
            </div>
            <button type="button" id="closeUserAccountModalBtn" aria-label="Đóng cửa sổ" style="background: transparent; border: none; color: #fff; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div style="display: flex; background: #fbf9f6; border-bottom: 1px solid #e8e3dc; padding: 4px 10px 0;">
            <button type="button" class="uacc-tab-btn active" data-tab="profile" style="flex: 1; padding: 11px 8px; border: none; background: transparent; font-size: 0.88rem; font-weight: 600; color: var(--color-primary, #1e1918); cursor: pointer; border-bottom: 3px solid var(--color-brand, #8f1724); display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Thông tin cá nhân</span>
            </button>
            <button type="button" class="uacc-tab-btn" data-tab="reservations" style="flex: 1; padding: 11px 8px; border: none; background: transparent; font-size: 0.88rem; font-weight: 600; color: #666; cursor: pointer; border-bottom: 3px solid transparent; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Bàn đã đặt</span>
              <span id="uaccResCountBadge" style="background: #eee; color: #444; border-radius: 10px; font-size: 0.72rem; padding: 1px 6px; font-weight: 700; display: none;">0</span>
            </button>
            <button type="button" class="uacc-tab-btn" data-tab="favorites" style="flex: 1; padding: 11px 8px; border: none; background: transparent; font-size: 0.88rem; font-weight: 600; color: #666; cursor: pointer; border-bottom: 3px solid transparent; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>Món yêu thích</span>
              <span id="uaccFavCountBadge" style="background: #eee; color: #444; border-radius: 10px; font-size: 0.72rem; padding: 1px 6px; font-weight: 700; display: none;">0</span>
            </button>
          </div>

          <!-- Tab Contents Body -->
          <div id="uaccTabBody" style="padding: 20px; overflow-y: auto; flex: 1;">
            <!-- Dynamic Content -->
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Event listeners cho các nút trong Modal
    const overlay = document.getElementById('userAccountModalOverlay');
    const closeBtn = document.getElementById('closeUserAccountModalBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', window.closeUserAccountModal);
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          window.closeUserAccountModal();
        }
      });
    }

    // Chuyển tab
    const tabBtns = document.querySelectorAll('.uacc-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Lắng nghe phím ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        window.closeUserAccountModal();
      }
    });
  }

  // Chuyển đổi tab
  function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.uacc-tab-btn');
    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabName;
      if (isTarget) {
        btn.classList.add('active');
        btn.style.color = 'var(--color-primary, #1e1918)';
        btn.style.borderBottomColor = 'var(--color-brand, #8f1724)';
      } else {
        btn.classList.remove('active');
        btn.style.color = '#666';
        btn.style.borderBottomColor = 'transparent';
      }
    });

    renderCurrentTab(tabName);
  }

  // Cập nhật số lượng trên các badge
  function updateBadges(user) {
    const resCountBadge = document.getElementById('uaccResCountBadge');
    const favCountBadge = document.getElementById('uaccFavCountBadge');

    if (window.AppState) {
      const reservations = window.AppState.getUserReservations(user);
      if (resCountBadge) {
        if (reservations.length > 0) {
          resCountBadge.textContent = reservations.length;
          resCountBadge.style.display = 'inline-block';
        } else {
          resCountBadge.style.display = 'none';
        }
      }

      const favs = window.AppState.getFavorites();
      if (favCountBadge) {
        if (favs.length > 0) {
          favCountBadge.textContent = favs.length;
          favCountBadge.style.display = 'inline-block';
        } else {
          favCountBadge.style.display = 'none';
        }
      }
    }
  }

  // Render nội dung tab đang chọn
  function renderCurrentTab(tabName) {
    const container = document.getElementById('uaccTabBody');
    if (!container || !window.AppState) return;

    const user = window.AppState.getCurrentUser();
    if (!user) {
      const isSubPage = window.location.pathname.includes('/pages/');
      const loginUrl = isSubPage ? 'login.html' : 'pages/login.html';
      container.innerHTML = `
        <div style="text-align: center; padding: 36px 16px;">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.8" style="margin-bottom: 12px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <h4 style="font-size: 1.05rem; margin-bottom: 8px; color: #333;">Bạn chưa đăng nhập</h4>
          <p style="font-size: 0.88rem; color: #666; margin-bottom: 20px;">Vui lòng đăng nhập để xem thông tin cá nhân, danh sách đặt bàn và món yêu thích.</p>
          <a href="${loginUrl}" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.9rem;">Đăng nhập ngay</a>
        </div>
      `;
      return;
    }

    updateBadges(user);

    if (tabName === 'profile') {
      renderProfileTab(container, user);
    } else if (tabName === 'reservations') {
      renderReservationsTab(container, user);
    } else if (tabName === 'favorites') {
      renderFavoritesTab(container, user);
    }
  }

  // 1. Tab Thông tin cá nhân
  function renderProfileTab(container, user) {
    const initials = (user.fullName || 'KH')
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map(w => w[0].toUpperCase())
      .join('');

    container.innerHTML = `
      <!-- Thẻ hội viên tóm tắt -->
      <div style="display: flex; align-items: center; gap: 14px; background: #faf8f5; border: 1px solid rgba(201,166,107,0.3); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--color-brand, #8f1724), var(--color-primary, #1e1918)); color: var(--color-gold, #c9a66b); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; font-weight: 700; border: 2px solid var(--color-gold, #c9a66b); flex-shrink: 0;">
          ${initials || 'VN'}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <h4 style="margin: 0; font-size: 1.05rem; color: var(--color-primary, #1e1918); font-weight: 700;" id="uaccDisplayFullName">${user.fullName}</h4>
            <span style="background: rgba(201,166,107,0.18); color: #8a6524; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(201,166,107,0.4);">Hội viên thân thiết</span>
          </div>
          <p style="margin: 3px 0 0; font-size: 0.82rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.email || 'Chưa cập nhật email'}</p>
        </div>
      </div>

      <!-- Form Thay đổi thông tin -->
      <div style="margin-bottom: 22px;">
        <h5 style="font-size: 0.92rem; font-weight: 700; color: var(--color-primary, #1e1918); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #eee;">
          Thay đổi thông tin
        </h5>
        
        <form id="uaccProfileForm" novalidate>
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: #444; margin-bottom: 4px;">Họ và tên</label>
            <input type="text" id="uaccInputFullName" class="form-control" value="${user.fullName || ''}" required style="width: 100%; padding: 9px 12px; font-size: 0.9rem; border: 1px solid #ccc; border-radius: 6px;">
          </div>
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: #444; margin-bottom: 4px;">Số điện thoại</label>
            <input type="tel" id="uaccInputPhone" class="form-control" value="${user.phone || ''}" placeholder="0912 345 678" style="width: 100%; padding: 9px 12px; font-size: 0.9rem; border: 1px solid #ccc; border-radius: 6px;">
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-gold" style="padding: 8px 18px; font-size: 0.86rem; font-weight: 600;">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      <!-- Khu vực Đổi mật khẩu thu gọn -->
      <div style="margin-bottom: 20px; background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 12px 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" id="togglePasswordAreaBtn">
          <span style="font-size: 0.88rem; font-weight: 600; color: #333;">Đổi mật khẩu</span>
          <svg id="togglePasswordArrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <div id="passwordAreaContent" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #ddd;">
          <form id="uaccPasswordForm">
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #555; margin-bottom: 3px;">Mật khẩu hiện tại</label>
              <input type="password" id="uaccOldPassword" class="form-control" placeholder="••••••••" style="width: 100%; padding: 8px 10px; font-size: 0.86rem; border: 1px solid #ccc; border-radius: 6px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #555; margin-bottom: 3px;">Mật khẩu mới</label>
              <input type="password" id="uaccNewPassword" class="form-control" placeholder="Tối thiểu 6 ký tự" style="width: 100%; padding: 8px 10px; font-size: 0.86rem; border: 1px solid #ccc; border-radius: 6px;">
            </div>
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #555; margin-bottom: 3px;">Xác nhận mật khẩu mới</label>
              <input type="password" id="uaccConfirmPassword" class="form-control" placeholder="Nhập lại mật khẩu mới" style="width: 100%; padding: 8px 10px; font-size: 0.86rem; border: 1px solid #ccc; border-radius: 6px;">
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="padding: 7px 16px; font-size: 0.82rem;">
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Đăng xuất -->
      <div style="padding-top: 12px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; color: #888;">Đăng xuất khỏi thiết bị này</span>
        <button type="button" id="uaccLogoutBtn" style="background: transparent; border: 1px solid #e0c8c8; color: #b02a37; border-radius: 6px; padding: 6px 14px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
          Đăng xuất
        </button>
      </div>
    `;

    // 1.1 Xử lý Lưu thay đổi thông tin
    const profileForm = document.getElementById('uaccProfileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('uaccInputFullName').value.trim();
        const phone = document.getElementById('uaccInputPhone').value.trim();

        if (!fullName) {
          if (window.showToast) window.showToast('Vui lòng nhập họ và tên.', 'warning');
          return;
        }

        const res = window.AppState.updateUserProfile({ fullName, phone });
        if (res.success) {
          if (window.showToast) window.showToast('Đã lưu thay đổi thông tin cá nhân.', 'success', 'Cập nhật thành công');

          // Cập nhật lại UI navbar nếu có
          const topBarUserBtn = document.getElementById('topBarUserAccountBtn');
          if (topBarUserBtn) {
            topBarUserBtn.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Tài khoản: ${res.user.fullName}
            `;
          }

          renderCurrentTab('profile');
        }
      });
    }

    // 1.2 Mở rộng/thu gọn đổi mật khẩu
    const togglePassBtn = document.getElementById('togglePasswordAreaBtn');
    const passContent = document.getElementById('passwordAreaContent');
    const passArrow = document.getElementById('togglePasswordArrow');
    if (togglePassBtn && passContent) {
      togglePassBtn.addEventListener('click', () => {
        const isOpen = passContent.style.display === 'block';
        passContent.style.display = isOpen ? 'none' : 'block';
        if (passArrow) passArrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }

    // 1.3 Xử lý form đổi mật khẩu
    const passwordForm = document.getElementById('uaccPasswordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('uaccOldPassword').value.trim();
        const newPass = document.getElementById('uaccNewPassword').value.trim();
        const confirmPass = document.getElementById('uaccConfirmPassword').value.trim();

        if (!oldPass) {
          if (window.showToast) window.showToast('Vui lòng nhập mật khẩu hiện tại.', 'warning');
          return;
        }
        if (!newPass || newPass.length < 6) {
          if (window.showToast) window.showToast('Mật khẩu mới phải có tối thiểu 6 ký tự.', 'warning');
          return;
        }
        if (newPass !== confirmPass) {
          if (window.showToast) window.showToast('Xác nhận mật khẩu mới không khớp.', 'warning');
          return;
        }

        if (window.showToast) {
          window.showToast('Mật khẩu của bạn đã được cập nhật an toàn.', 'success', 'Đổi mật khẩu thành công');
        }
        passwordForm.reset();
        passContent.style.display = 'none';
        if (passArrow) passArrow.style.transform = 'rotate(0deg)';
      });
    }

    // 1.4 Đăng xuất
    const logoutBtn = document.getElementById('uaccLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.AppState.logout();
        window.closeUserAccountModal();
        if (window.showToast) window.showToast('Bạn đã đăng xuất khỏi tài khoản.', 'info', 'Đã đăng xuất');
        const isSubPage = window.location.pathname.includes('/pages/');
        const homePath = isSubPage ? '../index.html' : 'index.html';
        setTimeout(() => {
          window.location.href = homePath;
        }, 700);
      });
    }
  }

  // 2. Tab Bàn đã đặt
  function renderReservationsTab(container, user) {
    const reservations = window.AppState.getUserReservations(user);
    const isSubPage = window.location.pathname.includes('/pages/');
    const resUrl = isSubPage ? 'reservation.html' : 'pages/reservation.html';

    if (!reservations || reservations.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 16px;">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.8" style="margin-bottom: 12px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <h4 style="font-size: 1.05rem; color: #333; margin-bottom: 6px;">Bạn chưa có lịch đặt bàn nào</h4>
          <p style="font-size: 0.86rem; color: #666; margin-bottom: 20px;">Hãy đặt bàn trước để giữ chỗ đẹp và nhận ưu đãi nước lẩu đặc biệt từ nhà hàng.</p>
          <a href="${resUrl}" class="btn btn-gold" style="padding: 9px 20px; font-size: 0.88rem;">Đặt bàn ngay</a>
        </div>
      `;
      return;
    }

    const statusMap = {
      'pending': { label: 'Chờ xác nhận', color: '#b25e00', bg: '#fff4e5', border: '#ffe0b2' },
      'confirmed': { label: 'Đã xác nhận', color: '#1b5e20', bg: '#e8f5e9', border: '#c8e6c9' },
      'completed': { label: 'Đã hoàn thành', color: '#0d47a1', bg: '#e3f2fd', border: '#bbdefb' },
      'cancelled': { label: 'Đã hủy', color: '#616161', bg: '#f5f5f5', border: '#e0e0e0' }
    };

    let itemsHtml = reservations.map(r => {
      const st = statusMap[r.status] || { label: r.status, color: '#333', bg: '#eee', border: '#ccc' };
      const canCancel = r.status === 'pending';

      return `
        <div style="border: 1px solid #e8e3dc; border-radius: 10px; padding: 14px; margin-bottom: 14px; background: #fff; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)'" onmouseout="this.style.boxShadow='none'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary, #1e1918);">
              Mã bàn: <span style="color: var(--color-brand, #8f1724);">${r.code || ('LN-' + r.id)}</span>
            </div>
            <span style="font-size: 0.74rem; font-weight: 700; padding: 3px 9px; border-radius: 12px; color: ${st.color}; background: ${st.bg}; border: 1px solid ${st.border};">
              ${st.label}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.84rem; color: #555; margin-bottom: 10px;">
            <div>
              <span style="color: #888;">Chi nhánh:</span> <strong>${r.branchName || 'Chi nhánh chính'}</strong>
            </div>
            <div>
              <span style="color: #888;">Số khách:</span> <strong>${r.guestCount || 2} người</strong>
            </div>
            <div>
              <span style="color: #888;">Ngày:</span> <strong>${r.date || r.reservationDate || 'Chưa định ngày'}</strong>
            </div>
            <div>
              <span style="color: #888;">Giờ:</span> <strong>${r.time || r.reservationTime || '18:00'}</strong>
            </div>
          </div>

          ${r.note || r.notes ? `
            <div style="font-size: 0.8rem; color: #777; background: #fdfaf6; padding: 6px 10px; border-radius: 6px; margin-bottom: 10px;">
              Ghi chú: ${r.note || r.notes}
            </div>
          ` : ''}

          ${canCancel ? `
            <div style="display: flex; justify-content: flex-end; padding-top: 6px;">
              <button type="button" class="btn-cancel-reservation" data-id="${r.id}" data-code="${r.code || r.id}" style="background: transparent; border: 1px solid #e0b4b4; color: #b02a37; border-radius: 6px; padding: 5px 12px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">
                Hủy bàn này
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; color: #666;">Tổng số: <strong>${reservations.length}</strong> lượt đặt bàn</span>
        <a href="${resUrl}" class="btn btn-gold" style="padding: 6px 14px; font-size: 0.8rem;">+ Đặt thêm bàn</a>
      </div>
      <div>${itemsHtml}</div>
    `;

    // Hook nút hủy bàn
    container.querySelectorAll('.btn-cancel-reservation').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const code = btn.getAttribute('data-code');
        if (confirm(`Bạn có chắc chắn muốn hủy đơn đặt bàn ${code}?`)) {
          window.AppState.updateReservationStatus(id, 'cancelled');
          if (window.showToast) {
            window.showToast(`Đã hủy đặt bàn ${code} thành công.`, 'info', 'Đã hủy bàn');
          }
          renderCurrentTab('reservations');
        }
      });
    });
  }

  // 3. Tab Món yêu thích
  function renderFavoritesTab(container, user) {
    const favoriteProducts = window.AppState.getUserFavoriteProducts ? window.AppState.getUserFavoriteProducts() : [];
    const isSubPage = window.location.pathname.includes('/pages/');
    const menuUrl = isSubPage ? 'menu.html' : 'pages/menu.html';

    if (!favoriteProducts || favoriteProducts.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 16px;">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.8" style="margin-bottom: 12px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <h4 style="font-size: 1.05rem; color: #333; margin-bottom: 6px;">Chưa có món ăn yêu thích</h4>
          <p style="font-size: 0.86rem; color: #666; margin-bottom: 20px;">Hãy thả tim các món lẩu và đồ nướng hấp dẫn trong thực đơn để lưu lại tại đây.</p>
          <a href="${menuUrl}" class="btn btn-gold" style="padding: 9px 20px; font-size: 0.88rem;">Khám phá thực đơn</a>
        </div>
      `;
      return;
    }

    let itemsHtml = favoriteProducts.map(p => {
      return `
        <div style="display: flex; gap: 12px; align-items: center; border: 1px solid #eee; border-radius: 8px; padding: 10px; margin-bottom: 10px; background: #fff;">
          <img src="${p.imageUrl}" alt="${p.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
          <div style="flex: 1; min-width: 0;">
            <h5 style="margin: 0 0 4px; font-size: 0.92rem; color: var(--color-primary, #1e1918); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${p.name}
            </h5>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--color-brand, #8f1724);">
              ${formatMoney(p.price)}
            </div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
            <button type="button" class="btn btn-secondary btn-view-fav-product" data-id="${p.id}" style="padding: 6px 10px; font-size: 0.78rem;">
              Xem chi tiết
            </button>
            <button type="button" class="btn-remove-fav" data-id="${p.id}" title="Bỏ thích món này" style="background: transparent; border: 1px solid #ddd; width: 32px; height: 32px; border-radius: 6px; color: #999; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--color-brand, #8f1724)" stroke="var(--color-brand, #8f1724)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; color: #666;">Đã lưu: <strong>${favoriteProducts.length}</strong> món</span>
        <a href="${menuUrl}" style="font-size: 0.82rem; color: var(--color-brand, #8f1724); font-weight: 600; text-decoration: underline;">Xem thêm món khác</a>
      </div>
      <div>${itemsHtml}</div>
    `;

    // Hook nút xem chi tiết món
    container.querySelectorAll('.btn-view-fav-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const product = window.AppState.getProductById(id);
        if (product && window.openProductDetailModal) {
          window.openProductDetailModal(product);
        }
      });
    });

    // Hook nút bỏ thích
    container.querySelectorAll('.btn-remove-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const product = window.AppState.getProductById(id);
        window.AppState.toggleFavorite(id);
        if (window.showToast) {
          window.showToast(`Đã bỏ yêu thích món "${product ? product.name : ''}".`, 'info');
        }
        renderCurrentTab('favorites');
      });
    });
  }

  // Mở cửa sổ nhỏ tài khoản
  window.openUserAccountModal = function (tabName = 'profile') {
    ensureModalDOMElements();

    const overlay = document.getElementById('userAccountModalOverlay');
    if (!overlay) return;

    switchTab(tabName);
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Đóng cửa sổ nhỏ tài khoản
  window.closeUserAccountModal = function () {
    const overlay = document.getElementById('userAccountModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  // Khởi tạo DOM khi trang sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    ensureModalDOMElements();
  });
})();
