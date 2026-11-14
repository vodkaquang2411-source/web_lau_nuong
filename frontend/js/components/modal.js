/**
 * LẨU NƯỚNG VN - MODAL POPUP COMPONENT
 * Xử lý mở/đóng hộp thoại chi tiết món ăn và các popup tương tác
 */

(function () {
  function formatPrice(number) {
    return new Intl.NumberFormat('vi-VN').format(number) + ' đ';
  }

  window.openProductDetailModal = function (product) {
    const modalOverlay = document.getElementById('productModalOverlay');
    const modalBody = document.getElementById('modalBodyContent');
    if (!modalOverlay || !modalBody || !product) return;

    const isFav = window.AppState ? window.AppState.isFavorite(product.id) : false;
    const catMap = {
      'lau': 'Món Lẩu Gia Truyền',
      'nuong': 'Đồ Nướng Than Hoa',
      'thit-bo': 'Thịt Bò Mỹ Thượng Hạng',
      'hai-san': 'Hải Sản Biển Tươi Sống',
      'rau-kem': 'Rau & Nấm Ăn Kèm',
      'combo': 'Combo Đại Tiệc Sum Vầy',
      'do-uong': 'Đồ Uống & Tráng Miệng'
    };
    const catTitle = catMap[product.category] || product.category;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; align-items: start;">
        <div style="border-radius: var(--radius-md); overflow: hidden; height: 320px; box-shadow: var(--shadow-sm); position: relative;">
          <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 12px; left: 12px;">
            ${product.isFeatured ? '<span class="badge badge-hot">Bán chạy</span>' : ''}
            ${!product.isAvailable ? '<span class="badge badge-soldout">Tạm hết món</span>' : ''}
          </div>
        </div>
        <div>
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--color-gold-dark);">
            ${catTitle}
          </span>
          <h2 style="font-size: 1.45rem; color: var(--color-primary); margin: 6px 0 12px;">${product.name}</h2>
          <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-brand); margin-bottom: 16px;">
            ${formatPrice(product.price)}
          </div>
          <p style="color: var(--color-dark-light); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">
            ${product.description}
          </p>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-gold modal-add-to-res-btn" data-id="${product.id}" style="padding: 11px 16px; font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
              Thêm vào bàn đã đặt
            </button>
            <a href="${window.location.pathname.includes('/pages/') ? 'reservation.html' : 'pages/reservation.html'}" class="btn btn-primary" style="flex: 1; padding: 11px 16px; font-size: 0.9rem;">
              Đặt bàn thưởng thức
            </a>
            <button class="btn btn-secondary btn-icon-only modal-fav-btn" data-id="${product.id}" title="${isFav ? 'Bỏ thích' : 'Yêu thích món'}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-brand)' : 'none'}" stroke="${isFav ? 'var(--color-brand)' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Hook thêm món vào bàn đã đặt
    const addResBtn = modalBody.querySelector('.modal-add-to-res-btn');
    if (addResBtn) {
      addResBtn.addEventListener('click', () => {
        if (!window.AppState) return;

        const currentUser = window.AppState.getCurrentUser();
        if (!currentUser) {
          if (window.showToast) {
            window.showToast('Vui lòng đăng nhập để thêm món ăn vào bàn đã đặt.', 'warning', 'Chưa đăng nhập');
          }
          return;
        }

        const pendingList = window.AppState.getUserReservations(currentUser).filter(r => r.status === 'pending');
        if (!pendingList || pendingList.length === 0) {
          if (window.showToast) {
            window.showToast('Bạn chưa có đơn đặt bàn nào đang chờ xác nhận. Hãy đặt bàn trước để gắn món ăn này nhé!', 'info', 'Chưa có bàn đặt');
          }
          return;
        }

        // Thêm vào đơn đặt bàn đang chờ gần nhất
        const targetRes = pendingList[0];
        const res = window.AppState.addDishToReservation(targetRes.id, product.id, 1);
        if (res.success) {
          if (window.showToast) {
            window.showToast(`Đã thêm món "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id} thành công!`, 'success', 'Đã thêm món');
          }
        } else {
          if (window.showToast) {
            window.showToast(res.message || 'Không thể thêm món vào đơn đặt bàn.', 'warning');
          }
        }
      });
    }

    // Hook favorite in modal
    const favBtn = modalBody.querySelector('.modal-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        if (window.AppState) {
          const nowFav = window.AppState.toggleFavorite(product.id);
          const icon = favBtn.querySelector('svg');
          if (nowFav) {
            icon.setAttribute('fill', 'var(--color-brand)');
            icon.setAttribute('stroke', 'var(--color-brand)');
            if (window.showToast) window.showToast(`Đã thêm "${product.name}" vào danh sách yêu thích!`, 'success', 'Yêu thích');
          } else {
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
            if (window.showToast) window.showToast(`Đã bỏ yêu thích món "${product.name}".`, 'info');
          }
        }
      });
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function () {
    const modalOverlay = document.getElementById('productModalOverlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('productModalOverlay');

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', window.closeProductModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          window.closeProductModal();
        }
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeProductModal();
      }
    });
  });
})();
