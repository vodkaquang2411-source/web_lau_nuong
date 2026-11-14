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

    // Hook thêm món vào bàn đã đặt (Tự động chọn nếu có 1 bàn, hoặc mở hộp thoại chọn bàn nếu có >= 2 bàn)
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

        // Trường hợp 1: Có đúng 1 bàn đang chờ -> Thêm trực tiếp
        if (pendingList.length === 1) {
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
          return;
        }

        // Trường hợp 2: Có từ 2 bàn trở lên -> Mở hộp thoại chọn bàn cụ thể
        openSelectReservationModal(pendingList, product);
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

  // Hộp thoại nhỏ chọn bàn khi người dùng có >= 2 bàn đang chờ xác nhận
  function openSelectReservationModal(pendingList, product) {
    let selectOverlay = document.getElementById('selectResModalOverlay');
    if (!selectOverlay) {
      const modalHtml = `
        <div class="modal-overlay" id="selectResModalOverlay" aria-hidden="true" style="z-index: 2200;">
          <div class="modal-content" style="max-width: 440px; width: 92%; padding: 20px; border-radius: 12px; border: 1px solid rgba(201,166,107,0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px dashed #e8d8be; padding-bottom: 8px;">
              <h4 style="margin: 0; font-size: 1.05rem; color: var(--color-primary, #1e1918); font-weight: 700;">
                Chọn bàn để thêm món
              </h4>
              <button type="button" id="closeSelectResModalBtn" aria-label="Đóng" style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer; color: #888;">&times;</button>
            </div>
            <p id="selectResModalDesc" style="font-size: 0.85rem; color: #555; margin-bottom: 14px; line-height: 1.5;"></p>
            <div id="selectResModalList" style="display: flex; flex-direction: column; gap: 8px; max-height: 50vh; overflow-y: auto; margin-bottom: 14px;"></div>
            <div style="display: flex; justify-content: flex-end;">
              <button type="button" id="cancelSelectResBtn" class="btn btn-secondary btn-sm" style="padding: 6px 16px; font-size: 0.82rem;">Hủy bỏ</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      selectOverlay = document.getElementById('selectResModalOverlay');

      document.getElementById('closeSelectResModalBtn').addEventListener('click', closeSelectReservationModal);
      document.getElementById('cancelSelectResBtn').addEventListener('click', closeSelectReservationModal);
      selectOverlay.addEventListener('click', (e) => {
        if (e.target === selectOverlay) closeSelectReservationModal();
      });
    }

    const descEl = document.getElementById('selectResModalDesc');
    const listEl = document.getElementById('selectResModalList');

    if (descEl) {
      descEl.innerHTML = `Bạn đang có <strong>${pendingList.length}</strong> đơn đặt bàn chưa chốt. Vui lòng chọn bàn muốn thêm món <strong>"${product.name}"</strong>:`;
    }

    if (listEl) {
      listEl.innerHTML = pendingList.map(r => `
        <div style="border: 1px solid #e8e3dc; border-radius: 8px; padding: 10px 12px; background: #faf8f5; display: flex; justify-content: space-between; align-items: center; gap: 10px; transition: all 0.2s;" onmouseover="this.style.background='#fff'; this.style.borderColor='var(--color-gold, #c9a66b)'" onmouseout="this.style.background='#faf8f5'; this.style.borderColor='#e8e3dc'">
          <div style="font-size: 0.82rem; line-height: 1.5;">
            <div style="font-weight: 700; color: var(--color-primary, #1e1918);">
              Mã bàn: <span style="color: var(--color-brand, #8f1724);">${r.code || ('LN-' + r.id)}</span>
            </div>
            <div style="color: #666;">${r.branchName || 'Chi nhánh chính'}</div>
            <div style="color: #888; font-size: 0.76rem;">${r.time || r.reservationTime || '18:00'} - Ngày ${r.date || r.reservationDate || ''} (${r.guestCount || 2} khách)</div>
          </div>
          <button type="button" class="btn btn-gold btn-sm btn-choose-res" data-res-id="${r.id}" style="padding: 6px 12px; font-size: 0.78rem; flex-shrink: 0; font-weight: 600;">
            Chọn bàn này
          </button>
        </div>
      `).join('');

      // Hook click chọn bàn
      listEl.querySelectorAll('.btn-choose-res').forEach(btn => {
        btn.addEventListener('click', () => {
          const resId = Number(btn.getAttribute('data-res-id'));
          const targetRes = pendingList.find(r => r.id === resId);
          if (targetRes && window.AppState) {
            const res = window.AppState.addDishToReservation(targetRes.id, product.id, 1);
            closeSelectReservationModal();
            if (res.success && window.showToast) {
              window.showToast(`Đã thêm món "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id} thành công!`, 'success', 'Thêm món thành công');
            }
          }
        });
      });
    }

    selectOverlay.classList.add('active');
    selectOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeSelectReservationModal() {
    const selectOverlay = document.getElementById('selectResModalOverlay');
    if (selectOverlay) {
      selectOverlay.classList.remove('active');
      selectOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  window.closeProductModal = function () {
    closeSelectReservationModal();
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
