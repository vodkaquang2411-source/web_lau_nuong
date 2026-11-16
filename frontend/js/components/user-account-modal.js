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

  // ID đơn đặt bàn đang được người dùng chỉnh sửa trong tab Bàn đã đặt
  let editingReservationId = null;

  // Định dạng giá tiền VNĐ
  function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  }

  // Khởi tạo và gắn Modal DOM vào body nếu chưa tồn tại
  function ensureModalDOMElements() {
    if (document.getElementById('userAccountModalOverlay')) return;

    const modalHtml = `
      <div class="modal-overlay" id="userAccountModalOverlay" aria-hidden="true" style="z-index: 2100;">
        <div class="modal-content" id="userAccountModalContent" style="max-width: 720px; width: 94%; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid rgba(201,166,107,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.4); display: flex; flex-direction: column; max-height: 88vh;">
          
          <!-- Modal Header -->
          <div style="background: var(--color-primary, #1e1918); color: #fff; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-gold, #c9a66b); position: relative;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold, #c9a66b)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h3 style="margin: 0; font-size: 1.2rem; color: #fff; font-weight: 600;">Tài khoản của bạn</h3>
            </div>
            <button type="button" id="closeUserAccountModalBtn" aria-label="Đóng cửa sổ" style="background: transparent; border: none; color: #fff; cursor: pointer; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div style="display: flex; background: #fbf9f6; border-bottom: 1px solid #e8e3dc; padding: 4px 14px 0;">
            <button type="button" class="uacc-tab-btn active" data-tab="profile" style="flex: 1; padding: 12px 10px; border: none; background: transparent; font-size: 0.92rem; font-weight: 600; color: var(--color-primary, #1e1918); cursor: pointer; border-bottom: 3px solid var(--color-brand, #8f1724); display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Thông tin cá nhân</span>
            </button>
            <button type="button" class="uacc-tab-btn" data-tab="reservations" style="flex: 1; padding: 12px 10px; border: none; background: transparent; font-size: 0.92rem; font-weight: 600; color: #666; cursor: pointer; border-bottom: 3px solid transparent; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Bàn đã đặt</span>
              <span id="uaccResCountBadge" style="background: #eee; color: #444; border-radius: 10px; font-size: 0.74rem; padding: 1px 7px; font-weight: 700; display: none;">0</span>
            </button>
            <button type="button" class="uacc-tab-btn" data-tab="favorites" style="flex: 1; padding: 12px 10px; border: none; background: transparent; font-size: 0.92rem; font-weight: 600; color: #666; cursor: pointer; border-bottom: 3px solid transparent; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>Món yêu thích</span>
              <span id="uaccFavCountBadge" style="background: #eee; color: #444; border-radius: 10px; font-size: 0.74rem; padding: 1px 7px; font-weight: 700; display: none;">0</span>
            </button>
          </div>

          <!-- Tab Contents Body -->
          <div id="uaccTabBody" style="padding: 24px; overflow-y: auto; flex: 1;">
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

    const isAdmin = user.role === 'admin';
    const isSubPage = window.location.pathname.includes('/pages/');
    const adminPath = isSubPage ? '../admin/index.html' : 'admin/index.html';

    container.innerHTML = `
      <!-- Thẻ hội viên tóm tắt -->
      <div style="display: flex; align-items: center; gap: 14px; background: #faf8f5; border: 1px solid rgba(201,166,107,0.3); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--color-brand, #8f1724), var(--color-primary, #1e1918)); color: var(--color-gold, #c9a66b); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; font-weight: 700; border: 2px solid var(--color-gold, #c9a66b); flex-shrink: 0;">
          ${initials || 'VN'}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <h4 style="margin: 0; font-size: 1.05rem; color: var(--color-primary, #1e1918); font-weight: 700;" id="uaccDisplayFullName">${user.fullName}</h4>
            ${isAdmin ? `
              <span style="background: rgba(143,23,36,0.12); color: var(--color-brand, #8f1724); font-size: 0.74rem; font-weight: 700; padding: 2px 9px; border-radius: 12px; border: 1px solid rgba(143,23,36,0.3);">Quản trị viên</span>
            ` : `
              <span style="background: rgba(201,166,107,0.18); color: #8a6524; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(201,166,107,0.4);">Hội viên thân thiết</span>
            `}
          </div>
          <p style="margin: 3px 0 0; font-size: 0.82rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.email || 'Chưa cập nhật email'}</p>
        </div>
      </div>

      ${isAdmin ? `
        <!-- Khu vực chuyển sang trang quản trị dành riêng cho Admin và Quản trị viên -->
        <div style="background: linear-gradient(135deg, #fdfbf7 0%, #f6f0e6 100%); border: 1px solid var(--color-gold, #c9a66b); border-radius: 10px; padding: 14px 18px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; gap: 14px; box-shadow: 0 3px 10px rgba(201,166,107,0.15);">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--color-primary, #1e1918); margin-bottom: 3px; display: flex; align-items: center; gap: 7px;">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold, #c9a66b)" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              <span>Khu vực quản trị</span>
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #555;">Tài khoản có quyền quản lý toàn diện thực đơn, bàn đặt và khách hàng.</p>
          </div>
          <a href="${adminPath}" class="btn btn-gold" style="padding: 9px 18px; font-size: 0.86rem; font-weight: 700; flex-shrink: 0; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            Đổi sang trang quản trị
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
      ` : ''}

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

  // 2. Tab Bàn đã đặt (Xem, chỉnh sửa khi chưa chốt, và hủy bàn)
  function renderReservationsTab(container, user) {
    const reservations = window.AppState.getUserReservations(user);
    const isSubPage = window.location.pathname.includes('/pages/');
    const resUrl = isSubPage ? 'reservation.html' : 'pages/reservation.html';
    const branches = window.AppState.getBranches ? window.AppState.getBranches() : [];
    const todayStr = new Date().toISOString().slice(0, 10);

    const availableTimes = [
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
    ];

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
      const isPending = r.status === 'pending';
      const isEditing = isPending && editingReservationId === r.id;

      // 2.A. Giao diện chỉnh sửa đơn đặt bàn khi chưa được admin chốt
      if (isEditing) {
        const branchOptions = branches.map(b => {
          const isSelected = (r.branchId && Number(r.branchId) === Number(b.id)) || (r.branchName === b.name);
          return `<option value="${b.id}" ${isSelected ? 'selected' : ''}>${b.name}</option>`;
        }).join('');

        const timeOptions = availableTimes.map(t => {
          const currentTime = (r.time || r.reservationTime || '18:00').slice(0, 5);
          return `<option value="${t}" ${currentTime === t ? 'selected' : ''}>${t}</option>`;
        }).join('');

        const currentDate = r.date || r.reservationDate || todayStr;
        const currentGuests = r.guestCount || 2;
        const currentNote = r.note || r.notes || '';

        return `
          <div style="border: 2px solid var(--color-gold, #c9a66b); border-radius: 10px; padding: 14px; margin-bottom: 14px; background: #fffdf9; box-shadow: 0 4px 14px rgba(201,166,107,0.18);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px dashed #e8d8be; padding-bottom: 8px;">
              <div style="font-size: 0.92rem; font-weight: 700; color: var(--color-primary, #1e1918); display: flex; align-items: center; gap: 6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold, #c9a66b)" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Chỉnh sửa đơn: <strong>${r.code || ('LN-' + r.id)}</strong></span>
              </div>
              <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; color: ${st.color}; background: ${st.bg}; border: 1px solid ${st.border};">
                ${st.label}
              </span>
            </div>

            <form class="form-edit-reservation" data-id="${r.id}" novalidate>
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 3px;">Chi nhánh</label>
                <select class="form-control edit-res-branch" style="width: 100%; padding: 7px 10px; font-size: 0.84rem; border: 1px solid #ccc; border-radius: 6px; background: #fff;">
                  ${branchOptions}
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 3px;">Ngày dùng bữa</label>
                  <input type="date" class="form-control edit-res-date" value="${currentDate}" min="${todayStr}" required style="width: 100%; padding: 7px 10px; font-size: 0.84rem; border: 1px solid #ccc; border-radius: 6px; background: #fff;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 3px;">Khung giờ</label>
                  <select class="form-control edit-res-time" style="width: 100%; padding: 7px 10px; font-size: 0.84rem; border: 1px solid #ccc; border-radius: 6px; background: #fff;">
                    ${timeOptions}
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; margin-bottom: 12px;">
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 3px;">Số khách</label>
                  <input type="number" class="form-control edit-res-guests" value="${currentGuests}" min="1" max="50" required style="width: 100%; padding: 7px 10px; font-size: 0.84rem; border: 1px solid #ccc; border-radius: 6px; background: #fff;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 3px;">Ghi chú đặc biệt</label>
                  <input type="text" class="form-control edit-res-note" value="${currentNote}" placeholder="Vị trí ngồi, ghế trẻ em..." style="width: 100%; padding: 7px 10px; font-size: 0.84rem; border: 1px solid #ccc; border-radius: 6px; background: #fff;">
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px;">
                <button type="button" class="btn btn-secondary btn-cancel-edit-mode" data-id="${r.id}" style="padding: 6px 14px; font-size: 0.8rem;">
                  Hủy bỏ
                </button>
                <button type="submit" class="btn btn-gold" style="padding: 6px 16px; font-size: 0.8rem; font-weight: 600;">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        `;
      }

      // 2.B. Chế độ xem bình thường
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

          <!-- Danh sách món đã đặt trước nếu có (Hiển thị rõ giá tiền & chi tiết combo) -->
          ${Array.isArray(r.orderedDishes) && r.orderedDishes.length > 0 ? `
            <div style="background: #FFFDF9; border: 1.5px solid #EBD9C0; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px dashed #E2D7C5; padding-bottom: 6px;">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary, #1e1918);">
                  Món ăn & set lẩu đã đặt trước (${r.orderedDishes.reduce((acc, d) => acc + d.quantity, 0)} món):
                </span>
                <span style="font-size: 0.95rem; font-weight: 800; color: var(--color-brand, #8f1724);">
                  ${formatMoney(r.totalDishPrice || 0)}
                </span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
                ${r.orderedDishes.map(d => {
                  const isComboOrLau = d.category === 'lau' || d.category === 'combo' || (d.comboDetails);
                  const detailLink = isSubPage ? `combo-detail.html?id=${d.id}` : `pages/combo-detail.html?id=${d.id}`;
                  return `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; background: #fff; border: 1px solid #ECE3D7; border-radius: 6px; padding: 6px 10px;">
                      <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                        <img src="${d.imageUrl}" alt="${d.name}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; flex-shrink: 0; border: 1px solid #eee;">
                        <div style="min-width: 0;">
                          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 700; color: var(--color-primary, #1e1918);">
                            ${d.name}
                          </div>
                          ${isComboOrLau ? `
                            <a href="${detailLink}" target="_blank" style="font-size: 0.74rem; color: var(--color-brand, #8f1724); text-decoration: underline;">
                              Xem đồ đi kèm trong set
                            </a>
                          ` : ''}
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-left: 8px;">
                        <span style="color: var(--color-brand, #8f1724); font-weight: 700; font-size: 0.84rem;">${formatMoney(d.price)}</span>
                        ${isPending ? `
                          <div style="display: inline-flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                            <button type="button" class="btn-res-dish-minus" data-res-id="${r.id}" data-dish-id="${d.id}" style="border: none; background: #f0f0f0; width: 24px; height: 24px; cursor: pointer; font-size: 0.85rem; line-height: 1; font-weight: 700;">-</button>
                            <span style="padding: 0 8px; font-weight: 700; font-size: 0.82rem;">${d.quantity}</span>
                            <button type="button" class="btn-res-dish-plus" data-res-id="${r.id}" data-dish-id="${d.id}" style="border: none; background: #f0f0f0; width: 24px; height: 24px; cursor: pointer; font-size: 0.85rem; line-height: 1; font-weight: 700;">+</button>
                          </div>
                          <button type="button" class="btn-res-dish-del" data-res-id="${r.id}" data-dish-id="${d.id}" title="Xóa món này" style="border: none; background: transparent; color: #b02a37; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 4px;">&times;</button>
                        ` : `
                          <span style="font-weight: 700; color: #333; font-size: 0.82rem;">x${d.quantity}</span>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px dashed #E2D7C5; font-size: 0.8rem;">
                <span style="color: var(--color-gray-600);">Tổng tiền tạm tính món ăn:</span>
                <strong style="color: var(--color-brand, #8f1724); font-size: 0.95rem;">${formatMoney(r.totalDishPrice || 0)}</strong>
              </div>
              ${isPending ? `
                <div style="text-align: right; margin-top: 6px;">
                  <a href="${isSubPage ? 'menu.html' : 'pages/menu.html'}" class="btn-quick-goto-menu" style="font-size: 0.78rem; color: var(--color-brand, #8f1724); font-weight: 600; text-decoration: underline;">+ Chọn thêm món từ thực đơn</a>
                </div>
              ` : ''}
            </div>
          ` : (isPending ? `
            <div style="font-size: 0.8rem; color: #777; background: #FFFDF9; border: 1.5px dashed var(--color-gold); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-weight: 600; color: var(--color-dark);">Chưa chọn món trước</span>
                <div style="font-size: 0.75rem; color: #888;">Quý khách có thể chọn trước set lẩu để nhà hàng chuẩn bị sẵn</div>
              </div>
              <a href="${isSubPage ? 'menu.html' : 'pages/menu.html'}" class="btn-quick-goto-menu" style="color: var(--color-brand, #8f1724); font-weight: 700; font-size: 0.8rem; text-decoration: underline; white-space: nowrap; margin-left: 8px;">+ Chọn set lẩu</a>
            </div>
          ` : '')}

          ${isPending ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f2ede7;">
              <span style="font-size: 0.74rem; color: #b25e00;">Chưa chốt bàn, bạn có thể chỉnh sửa lịch</span>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn-trigger-edit-res" data-id="${r.id}" style="background: transparent; border: 1px solid var(--color-gold, #c9a66b); color: #8a6524; border-radius: 6px; padding: 5px 12px; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Chỉnh sửa
                </button>
                <button type="button" class="btn-cancel-reservation" data-id="${r.id}" data-code="${r.code || r.id}" style="background: transparent; border: 1px solid #e0b4b4; color: #b02a37; border-radius: 6px; padding: 5px 12px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">
                  Hủy bàn này
                </button>
              </div>
            </div>
          ` : (r.status === 'confirmed' ? `
            <div style="padding-top: 6px; font-size: 0.76rem; color: #1b5e20; background: #f1f8e9; padding: 6px 10px; border-radius: 6px; border: 1px solid #dcedc8; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Quản trị viên đã chốt bàn. Vui lòng liên hệ hotline <strong>0345662169</strong> nếu cần đổi lịch gấp.</span>
            </div>
          ` : '')}
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

    // 2.1 Hook nút kích hoạt chế độ chỉnh sửa
    container.querySelectorAll('.btn-trigger-edit-res').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        editingReservationId = id;
        renderCurrentTab('reservations');
      });
    });

    // 2.2 Hook nút hủy chế độ chỉnh sửa
    container.querySelectorAll('.btn-cancel-edit-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        editingReservationId = null;
        renderCurrentTab('reservations');
      });
    });

    // 2.3 Hook form lưu thay đổi đặt bàn
    container.querySelectorAll('.form-edit-reservation').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = Number(form.getAttribute('data-id'));
        const branchId = Number(form.querySelector('.edit-res-branch').value);
        const date = form.querySelector('.edit-res-date').value;
        const time = form.querySelector('.edit-res-time').value;
        const guestCount = Number(form.querySelector('.edit-res-guests').value);
        const note = form.querySelector('.edit-res-note').value.trim();

        if (!date) {
          if (window.showToast) window.showToast('Vui lòng chọn ngày dùng bữa.', 'warning');
          return;
        }

        const selectedDate = new Date(date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          if (window.showToast) window.showToast('Ngày dùng bữa không thể là một ngày trong quá khứ.', 'warning');
          return;
        }

        if (!guestCount || guestCount < 1) {
          if (window.showToast) window.showToast('Số lượng khách phải từ 1 người trở lên.', 'warning');
          return;
        }

        // Cập nhật trong AppState
        const res = window.AppState.updateReservation(id, {
          branchId,
          date,
          reservationDate: date,
          time,
          reservationTime: time,
          guestCount,
          note,
          notes: note
        });

        if (res.success) {
          // Gọi API Backend ngầm nếu có kết nối
          try {
            fetch(`/api/reservations/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                branch_id: branchId,
                reservation_date: date,
                reservation_time: time,
                guest_count: guestCount,
                note: note
              })
            }).catch(() => {});
          } catch (err) {}

          editingReservationId = null;
          if (window.showToast) {
            window.showToast(`Đã cập nhật thông tin đơn đặt bàn ${res.reservation.code || id} thành công.`, 'success', 'Cập nhật thành công');
          }
          renderCurrentTab('reservations');
        } else {
          if (window.showToast) {
            window.showToast(res.message || 'Không thể cập nhật đơn đặt bàn.', 'warning');
          }
        }
      });
    });

    // 2.4 Hook nút hủy bàn
    container.querySelectorAll('.btn-cancel-reservation').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const code = btn.getAttribute('data-code');
        if (confirm(`Bạn có chắc chắn muốn hủy đơn đặt bàn ${code}?`)) {
          window.AppState.updateReservationStatus(id, 'cancelled');
          try {
            fetch(`/api/reservations/${id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'cancelled' })
            }).catch(() => {});
          } catch (err) {}

          if (window.showToast) {
            window.showToast(`Đã hủy đặt bàn ${code} thành công.`, 'info', 'Đã hủy bàn');
          }
          renderCurrentTab('reservations');
        }
      });
    });

    // 2.5 Hook tăng/giảm/xóa món ăn đặt trước
    container.querySelectorAll('.btn-res-dish-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = Number(btn.getAttribute('data-res-id'));
        const dishId = Number(btn.getAttribute('data-dish-id'));
        const res = window.AppState.getReservations().find(r => r.id === resId);
        if (res && Array.isArray(res.orderedDishes)) {
          const dish = res.orderedDishes.find(d => Number(d.id) === dishId);
          if (dish) {
            window.AppState.updateReservationDishQuantity(resId, dishId, dish.quantity + 1);
            renderCurrentTab('reservations');
          }
        }
      });
    });

    container.querySelectorAll('.btn-res-dish-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = Number(btn.getAttribute('data-res-id'));
        const dishId = Number(btn.getAttribute('data-dish-id'));
        const res = window.AppState.getReservations().find(r => r.id === resId);
        if (res && Array.isArray(res.orderedDishes)) {
          const dish = res.orderedDishes.find(d => Number(d.id) === dishId);
          if (dish) {
            window.AppState.updateReservationDishQuantity(resId, dishId, dish.quantity - 1);
            renderCurrentTab('reservations');
          }
        }
      });
    });

    container.querySelectorAll('.btn-res-dish-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = Number(btn.getAttribute('data-res-id'));
        const dishId = Number(btn.getAttribute('data-dish-id'));
        window.AppState.removeDishFromReservation(resId, dishId);
        if (window.showToast) {
          window.showToast('Đã xóa món ăn khỏi đơn đặt bàn.', 'info');
        }
        renderCurrentTab('reservations');
      });
    });

    // 2.6 Hook liên kết chuyển sang thực đơn chọn món
    container.querySelectorAll('.btn-quick-goto-menu').forEach(link => {
      link.addEventListener('click', () => {
        window.closeUserAccountModal();
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
          <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
            <button type="button" class="btn btn-gold btn-add-fav-to-res" data-id="${p.id}" style="padding: 7px 14px; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
              Thêm vào bàn
            </button>
            <button type="button" class="btn-remove-fav" data-id="${p.id}" title="Bỏ thích món này" style="background: transparent; border: 1px solid #ddd; width: 34px; height: 34px; border-radius: 6px; color: #999; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-brand, #8f1724)" stroke="var(--color-brand, #8f1724)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.88rem; color: #666;">Đã lưu: <strong>${favoriteProducts.length}</strong> món</span>
        <a href="${menuUrl}" style="font-size: 0.84rem; color: var(--color-brand, #8f1724); font-weight: 600; text-decoration: underline;">Xem thêm món khác</a>
      </div>
      <div>${itemsHtml}</div>
    `;

    // Hook nút thêm món yêu thích trực tiếp vào bàn đã đặt
    container.querySelectorAll('.btn-add-fav-to-res').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const product = window.AppState.getProductById(id);
        if (!product) return;

        const pendingList = window.AppState.getUserReservations(user).filter(r => r.status === 'pending');
        if (!pendingList || pendingList.length === 0) {
          if (window.showToast) {
            window.showToast('Bạn chưa có đơn đặt bàn nào đang chờ xác nhận. Vui lòng đặt bàn trước khi thêm món nhé!', 'info', 'Chưa có bàn đặt');
          }
          return;
        }

        // Trường hợp 1: Có đúng 1 bàn -> Thêm trực tiếp
        if (pendingList.length === 1) {
          const targetRes = pendingList[0];
          const res = window.AppState.addDishToReservation(targetRes.id, product.id, 1);
          if (res.success && window.showToast) {
            window.showToast(`Đã thêm món "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id} thành công!`, 'success', 'Đã thêm món');
          }
          return;
        }

        // Trường hợp 2: Có từ 2 bàn trở lên -> Mở hộp thoại chọn bàn
        if (window.openSelectReservationModal) {
          window.openSelectReservationModal(pendingList, product);
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
    editingReservationId = null;
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
