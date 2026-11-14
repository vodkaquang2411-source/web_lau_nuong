/**
 * LẨU NƯỚNG VN - ADMIN COMMON HELPER
 * Đồng bộ Header, Avatar, Nút Đăng xuất và Menu Di động trên toàn bộ 6 trang Admin
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tạo overlay cho Mobile Sidebar nếu chưa có
  let overlay = document.querySelector('.admin-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const sidebar = document.getElementById('adminSidebar');
  const header = document.querySelector('.admin-header');

  // 2. Tự động đồng bộ Header: Nút Hamburger bên trái & User Profile + Logout bên phải
  if (header) {
    // Kiểm tra xem đã có nút hamburger chưa
    let leftWrap = header.querySelector('.admin-header-left');
    if (!leftWrap) {
      const currentTitle = header.querySelector('.admin-header-title');
      const titleText = currentTitle ? currentTitle.textContent : 'Bảng Điều Khiển Quản Trị';
      
      const newLeft = document.createElement('div');
      newLeft.className = 'admin-header-left';
      newLeft.style.cssText = 'display: flex; align-items: center; gap: 14px;';
      newLeft.innerHTML = `
        <button id="adminMenuToggle" class="btn btn-secondary btn-icon-only" style="display: none;" aria-label="Mở menu quản trị">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 class="admin-header-title">${titleText}</h1>
      `;

      if (currentTitle) {
        currentTitle.replaceWith(newLeft);
      } else {
        header.prepend(newLeft);
      }
    }

    // Kiểm tra xem đã có User profile & nút Logout bên phải chưa
    let rightUser = header.querySelector('.admin-header-user');
    if (!rightUser) {
      const userBox = document.createElement('div');
      userBox.className = 'admin-header-user';
      userBox.innerHTML = `
        <div class="admin-user-info">
          <div class="admin-avatar">A</div>
          <div>
            <div class="admin-user-name" id="adminUserName">Admin Quản Lý</div>
            <div class="admin-user-role">Quản trị viên</div>
          </div>
        </div>
        <button id="btnAdminLogout" class="btn btn-secondary btn-sm" title="Đăng xuất khỏi hệ thống">
          Đăng xuất
        </button>
      `;
      header.appendChild(userBox);
    }
  }

  // 3. Xử lý mở / đóng Sidebar trên Mobile & Tablet
  const menuToggle = document.getElementById('adminMenuToggle');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });

    // Bấm link trong sidebar thì đóng sidebar trên mobile
    sidebar.querySelectorAll('.admin-nav-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          sidebar.classList.remove('show');
          overlay.classList.remove('show');
        }
      });
    });
  }

  // 4. Xử lý Đăng xuất và hiển thị tên Admin
  if (window.AppState) {
    const currentUser = window.AppState.getCurrentUser();
    const adminNameEl = document.getElementById('adminUserName');
    if (adminNameEl && currentUser) {
      adminNameEl.textContent = currentUser.fullName;
    }

    const btnLogout = document.getElementById('btnAdminLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        window.AppState.logout();
        if (window.showToast) {
          window.showToast('Bạn đã đăng xuất tài khoản quản trị viên.', 'info');
        }
        setTimeout(() => {
          window.location.href = '../pages/login.html';
        }, 700);
      });
    }
  }
});
