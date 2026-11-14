/**
 * LẨU NƯỚNG VN - NAVBAR & NAVIGATION COMPONENT
 * Xử lý hiệu ứng Header cuộn trang, Menu Hamburger di động, và Trạng thái Đăng nhập
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll effect
  const header = document.getElementById('siteHeader');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial
  }

  // 2. Mobile Drawer Navigation
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileNavOverlay');

  function openMobileNav() {
    if (mobileNav) mobileNav.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (hamburgerBtn) hamburgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileNav && mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close drawer when clicking link inside
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // 3. Auth status update in Top Bar
  const authContainer = document.getElementById('topBarAuth');
  if (authContainer && window.AppState) {
    const currentUser = window.AppState.getCurrentUser();
    if (currentUser) {
      const isSubPage = window.location.pathname.includes('/pages/');
      const adminPath = isSubPage ? '../admin/index.html' : 'admin/index.html';
      const homePath = isSubPage ? '../index.html' : 'index.html';

      let adminLinkHtml = '';
      if (currentUser.role === 'admin') {
        adminLinkHtml = `<a href="${adminPath}" style="color: var(--color-gold); font-weight: 700; margin-right: 12px;">★ Quản Trị</a> <span style="color: rgba(201,166,107,0.4); margin-right: 12px;">|</span>`;
      }

      authContainer.innerHTML = `
        ${adminLinkHtml}
        <span style="color: var(--color-gold); font-weight: 600;">Xin chào, ${currentUser.fullName}</span>
        <span style="color: rgba(201,166,107,0.4); margin: 0 8px;">|</span>
        <a href="#" id="topBarLogoutBtn" style="color: var(--color-cream-dark); text-decoration: underline;">Đăng xuất</a>
      `;

      const logoutBtn = document.getElementById('topBarLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.AppState.logout();
          if (window.showToast) {
            window.showToast('Bạn đã đăng xuất thành công.', 'info', 'Đã đăng xuất');
          }
          setTimeout(() => {
            window.location.href = homePath;
          }, 800);
        });
      }
    }
  }
});
