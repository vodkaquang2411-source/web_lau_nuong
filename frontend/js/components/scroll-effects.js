/**
 * LẨU RESTAURANT - SCROLL REVEAL & 3D INTERACTION SYSTEM
 * 1. Hiệu ứng cuộn trang 3D mượt mà (3D Scroll Reveal)
 * 2. Hiệu ứng rê chuột nghiêng 3D phản quang ánh kim (3D Interactive Card Tilt & Specular Glare)
 * 3. Thanh tiến trình cuộn trang màu vàng đồng sang trọng (Scroll Progress Bar)
 * 4. Nút cuộn lên đầu trang 3D (Back to top button)
 * 5. Tự động tương thích và hỗ trợ gọi lại khi render dữ liệu động
 * Sentence case: Toàn bộ nhãn và thông điệp chỉ viết hoa chữ cái đầu tiên
 */

(function () {
  'use strict';

  // Kiểm tra cài đặt giảm chuyển động của hệ điều hành
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointerFine = window.matchMedia('(pointer: fine)').matches;

  /* ==========================================================================
     1. THANH TIẾN TRÌNH CUỘN TRANG (SCROLL PROGRESS BAR)
     ========================================================================== */
  function initScrollProgressBar() {
    let progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgressBar';
      progressBar.className = 'scroll-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    let ticking = false;
    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* ==========================================================================
     2. NÚT CUỘN LÊN ĐẦU TRANG (BACK TO TOP BUTTON)
     ========================================================================== */
  function initBackToTopButton() {
    let btn = document.getElementById('btnBackToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'btnBackToTop';
      btn.className = 'btn-back-to-top';
      btn.title = 'Lên đầu trang';
      btn.setAttribute('aria-label', 'Lên đầu trang');
      // SVG vector nét mảnh chuẩn, không dùng emoji
      btn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    let isVisible = false;
    let ticking = false;

    function checkScroll() {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      if (scrolled > 360) {
        if (!isVisible) {
          btn.classList.add('is-visible');
          isVisible = true;
        }
      } else {
        if (isVisible) {
          btn.classList.remove('is-visible');
          isVisible = false;
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    checkScroll();
  }

  /* ==========================================================================
     3. HIỆU ỨNG CUỘN TRANG SCROLL REVEAL 3D (INTERSECTION OBSERVER)
     ========================================================================== */
  let revealObserver = null;

  function initScrollReveal() {
    if (prefersReducedMotion) {
      // Nếu bật reduced motion, hiển thị trực tiếp tất cả
      document.querySelectorAll('.reveal-init, .reveal-3d-up, .reveal-3d-left, .reveal-3d-right, .reveal-3d-zoom, .reveal-3d-flip')
        .forEach(el => el.classList.add('is-revealed'));
      return;
    }

    // Thiết lập IntersectionObserver nếu chưa có
    if (!revealObserver) {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      };

      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Sau khi đã kích hoạt, ngắt quan sát để tiết kiệm CPU/GPU
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
    }

    // Danh sách các selector cần tạo hiệu ứng xuất hiện 3D khi cuộn
    const targetSelectors = [
      '.section-header',
      '.page-hero .container > *',
      '.quick-booking-bar',
      '.home-about .grid-2 > div',
      '.features-grid > div',
      '.branches-grid > div',
      '.reviews-grid > div',
      '.cta-banner',
      '.product-card',
      '.branch-card',
      '.review-card',
      '.feature-card',
      '.story-card',
      '.menu-section-block',
      '.reservation-card',
      '.contact-card',
      '.contact-info-card',
      '.stats-card',
      '.faq-item',
      '.pot-type-selector',
      '.pot-stage-wrapper',
      '.pot-controls-wrapper',
      '.pot-summary-box',
      '.broth-choice-card',
      '[class*="reveal-3d-"]',
      '.reveal-init'
    ];

    // Tự động gán stagger-parent cho các container dạng lưới
    const gridContainers = document.querySelectorAll('.grid-2, .grid-3, .grid-4, .product-grid, .branches-grid, .reviews-grid, .features-grid, .broth-options-grid, .pot-customizer-grid');
    gridContainers.forEach(container => {
      if (!container.classList.contains('stagger-parent')) {
        container.classList.add('stagger-parent');
      }
    });

    // Quét và gán class reveal cho các phần tử
    targetSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        // Tránh gán đè nếu đã reveal
        if (el.classList.contains('is-revealed')) return;

        if (!el.classList.contains('reveal-init') &&
            !el.classList.contains('reveal-3d-up') &&
            !el.classList.contains('reveal-3d-left') &&
            !el.classList.contains('reveal-3d-right') &&
            !el.classList.contains('reveal-3d-zoom') &&
            !el.classList.contains('reveal-3d-flip')) {
          
          // Phân loại hướng chuyển động sinh động
          if (el.classList.contains('section-header') || el.classList.contains('quick-booking-bar') || el.classList.contains('pot-type-selector')) {
            el.classList.add('reveal-3d-flip');
          } else if (el.classList.contains('pot-stage-wrapper')) {
            el.classList.add('reveal-3d-left');
          } else if (el.classList.contains('pot-controls-wrapper')) {
            el.classList.add('reveal-3d-right');
          } else if (el.classList.contains('pot-summary-box') || el.classList.contains('broth-choice-card') || el.classList.contains('product-card') || el.classList.contains('branch-card') || el.classList.contains('review-card')) {
            el.classList.add('reveal-3d-up');
          } else if (index % 2 === 0 && (el.matches('.grid-2 > div:first-child') || el.matches('.grid-3 > div:first-child'))) {
            el.classList.add('reveal-3d-left');
          } else if (index % 2 === 1 && (el.matches('.grid-2 > div:last-child') || el.matches('.grid-3 > div:last-child'))) {
            el.classList.add('reveal-3d-right');
          } else {
            el.classList.add('reveal-init');
          }
        }

        // Bắt đầu quan sát
        revealObserver.observe(el);
      });
    });

    // Cập nhật hiệu ứng rê chuột nghiêng 3D
    initCardTilt3D();
  }

  /* ==========================================================================
     4. HIỆU ỨNG RÊ CHUỘT NGHIÊNG 3D (INTERACTIVE 3D MOUSE TILT)
     Áp dụng mượt mà trên Desktop với requestAnimationFrame
     ========================================================================== */
  function initCardTilt3D() {
    // Chỉ kích hoạt trên thiết bị có chuột (pointer: fine) và không bật reduced-motion
    if (!isPointerFine || prefersReducedMotion) return;

    const tiltCards = document.querySelectorAll('.product-card, .branch-card, .review-card, .feature-card, .chef-card, .broth-choice-card');

    tiltCards.forEach(card => {
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = 'true';
      card.classList.add('card-tilt-3d');

      let bounds = null;
      let rafId = null;

      function updateCardTransform(x, y) {
        if (!bounds) bounds = card.getBoundingClientRect();
        
        // Tính toán tọa độ chuột chuẩn hóa [-0.5, 0.5]
        const mouseX = (x - bounds.left) / bounds.width - 0.5;
        const mouseY = (y - bounds.top) / bounds.height - 0.5;

        // Giới hạn góc nghiêng tối đa 8.5 độ để đảm bảo sang trọng, tinh tế
        const maxAngle = 8.5;
        const rotX = -mouseY * maxAngle;
        const rotY = mouseX * maxAngle;

        // Tọa độ điểm sáng phản quang (Glare)
        const glareX = ((mouseX + 0.5) * 100).toFixed(1);
        const glareY = ((mouseY + 0.5) * 100).toFixed(1);

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
      }

      function onPointerMove(e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateCardTransform(e.clientX, e.clientY);
        });
      }

      function onPointerEnter() {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease';
      }

      function onPointerLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        bounds = null;
      }

      card.addEventListener('pointerenter', onPointerEnter, { passive: true });
      card.addEventListener('pointermove', onPointerMove, { passive: true });
      card.addEventListener('pointerleave', onPointerLeave, { passive: true });
    });
  }

  /* ==========================================================================
     5. HIỆU ỨNG TĂNG SỐ LIỆU ĐỘNG KHI CUỘN TỚI (ANIMATED NUMBER COUNTER)
     ========================================================================== */
  function initNumberCounters() {
    if (prefersReducedMotion) return;

    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetValue = parseInt(el.getAttribute('data-counter'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 1600; // 1.6s
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * targetValue);
            el.textContent = `${prefix}${current}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = `${prefix}${targetValue}${suffix}`;
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  /* ==========================================================================
     6. KHỞI CHẠY TỔNG THỂ & PUBLIC API
     ========================================================================== */
  function initializeAllEffects() {
    initScrollProgressBar();
    initBackToTopButton();
    initScrollReveal();
    initNumberCounters();
  }

  // Khởi chạy khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllEffects);
  } else {
    initializeAllEffects();
  }

  // Xuất API toàn cục để các trang có thể gọi lại sau khi tải dữ liệu động
  window.initScrollReveal = initScrollReveal;
  window.initCardTilt3D = initCardTilt3D;

})();

