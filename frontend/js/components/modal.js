/**
 * LẨU RESTAURANT - MODAL POPUP COMPONENT
 * Xử lý mở/đóng hộp thoại chi tiết món ăn và các popup tương tác
 * Hỗ trợ hiển thị logic chi tiết các đồ nhúng & thành phần đi kèm trong set lẩu / combo lẩu
 * Sentence case: Toàn bộ tiêu đề, nhãn và nút bấm chỉ viết hoa chữ cái đầu tiên
 */

(function () {
  'use strict';

  function formatPrice(number) {
    return new Intl.NumberFormat('vi-VN').format(number) + ' đ';
  }

  window.openProductDetailModal = function (product) {
    const modalOverlay = document.getElementById('productModalOverlay');
    const modalBody = document.getElementById('modalBodyContent');
    if (!modalOverlay || !modalBody || !product) return;

    const modalDialog = modalOverlay.querySelector('.modal-content') || modalOverlay.firstElementChild;
    const isFav = window.AppState ? window.AppState.isFavorite(product.id) : false;
    const isComboOrHotpot = !!(product.comboDetails || product.category === 'lau' || product.category === 'combo');

    const catMap = {
      'lau': 'Món lẩu gia truyền',
      'nuong': 'Đồ nướng than hoa',
      'thit-bo': 'Thịt bò Mỹ thượng hạng',
      'hai-san': 'Hải sản biển tươi sống',
      'rau-kem': 'Rau & nấm ăn kèm',
      'combo': 'Combo đại tiệc sum vầy',
      'do-uong': 'Đồ uống & tráng miệng'
    };
    const catTitle = catMap[product.category] || product.category;
    const reservationUrl = window.location.pathname.includes('/pages/') ? 'reservation.html' : 'pages/reservation.html';

    // 1. NẾU LÀ MÓN LẨU HOẶC COMBO: HIỂN THỊ CHI TIẾT ĐỒ ĐI KÈM TRỌN GÓI LOGIC
    if (isComboOrHotpot && product.comboDetails) {
      const details = product.comboDetails;
      if (modalDialog) {
        modalDialog.style.maxWidth = '840px';
        modalDialog.style.width = '95%';
        modalDialog.style.maxHeight = '90vh';
        modalDialog.style.overflowY = 'auto';
        modalDialog.style.borderRadius = '16px';
      }

      modalBody.innerHTML = `
        <div class="combo-detail-wrapper" style="padding: 4px;">
          <!-- Top info banner -->
          <div style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 24px; align-items: start; margin-bottom: 22px;">
            <div style="border-radius: var(--radius-md); overflow: hidden; height: 260px; box-shadow: var(--shadow-sm); position: relative;">
              <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
              <div style="position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 6px;">
                <span class="badge badge-hot" style="font-weight: 700;">Set lẩu trọn gói</span>
                ${product.isFeatured ? '<span class="badge" style="background: var(--color-gold); color: var(--color-dark); font-weight: 700;">Bán chạy nhất</span>' : ''}
              </div>
            </div>

            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-gold-dark);">
                  ${catTitle}
                </span>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(201,166,107,0.18); color: var(--color-gold-dark); font-size: 0.82rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(201,166,107,0.4);">
                    ${details.servingSize || '2 - 3 người dùng'}
                  </span>
                  <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}combo-detail.html?id=${product.id}" style="font-size: 0.8rem; color: var(--color-brand); text-decoration: underline; font-weight: 600;">
                    Mở trang riêng
                  </a>
                </div>
              </div>

              <h2 style="font-size: 1.45rem; color: var(--color-primary); margin: 0 0 10px; line-height: 1.3;">${product.name}</h2>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-brand); margin-bottom: 12px;">
                ${formatPrice(product.price)}
              </div>
              <p style="color: var(--color-dark-light); font-size: 0.92rem; line-height: 1.6; margin-bottom: 14px;">
                ${product.description}
              </p>

              <!-- Thông tin nước lẩu cốt -->
              <div style="background: #FDF9F2; border: 1.5px dashed var(--color-gold); border-radius: 8px; padding: 10px 14px; font-size: 0.88rem; color: #5D4037; display: flex; align-items: flex-start; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><path d="M12 2c1 3 2.5 4.5 4.5 5.5C18 8.5 19 10 19 12a7 7 0 1 1-14 0c0-2 1-3.5 2.5-4.5C9.5 6.5 11 5 12 2z"></path></svg>
                <div><strong>Nước lẩu cốt:</strong> ${details.broth}</div>
              </div>
            </div>
          </div>

          <!-- Included items section: Đồ nhúng & thành phần trọn gói trong set -->
          <div style="background: #FAF6F0; border-radius: 12px; padding: 18px; margin-bottom: 22px; border: 1px solid #EADBCE;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
              <h3 style="font-size: 1.05rem; color: var(--color-primary); margin: 0; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Đồ nhúng & thành phần trọn gói trong set (${details.includedItems ? details.includedItems.length : 0} món)
              </h3>
              <span style="font-size: 0.8rem; color: #666; font-style: italic;">Đã bao gồm đầy đủ trong giá set</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px;">
              ${(details.includedItems || []).map(item => `
                <div style="background: white; border-radius: 8px; padding: 10px 14px; border: 1px solid #ECE3D7; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem; color: #24201E;">${item.name}</div>
                    <div style="font-size: 0.78rem; color: #777; margin-top: 2px; line-height: 1.4;">${item.desc}</div>
                  </div>
                  <span style="background: #F0F7ED; color: #2E7D32; font-weight: 700; font-size: 0.8rem; padding: 3px 8px; border-radius: 12px; white-space: nowrap; border: 1px solid #C8E6C9; flex-shrink: 0;">
                    ${item.amount}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Suggested Add-ons section: Món nhúng gọi thêm tùy chọn -->
          ${details.suggestedAddOns && details.suggestedAddOns.length > 0 ? `
            <div style="border: 1px solid #EADBCE; border-radius: 12px; padding: 18px; margin-bottom: 22px; background: white;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <h3 style="font-size: 1rem; color: var(--color-dark); margin: 0; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
                  Món nhúng gọi thêm tùy chọn (Theo sở thích)
                </h3>
                <span style="font-size: 0.8rem; color: #777;">Chọn thêm nếu quý khách muốn dùng thêm</span>
              </div>

              <div id="comboAddonsList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px;">
                ${details.suggestedAddOns.map(addon => `
                  <div class="combo-addon-item" data-id="${addon.id}" data-price="${addon.price}" data-name="${addon.name}" style="border: 1px solid #EBE4D8; border-radius: 8px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; background: #FCFAF6;">
                    <div>
                      <div style="font-weight: 600; font-size: 0.86rem; color: #24201E;">${addon.name}</div>
                      <div style="font-size: 0.82rem; color: var(--color-brand); font-weight: 700;">
                        +${formatPrice(addon.price)} <span style="font-size: 0.75rem; color: #888; font-weight: normal;">/${addon.unit}</span>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button type="button" class="btn-addon-qty btn-addon-minus" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid #ccc; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #555; transition: all 0.2s;">-</button>
                      <span class="addon-qty-display" style="font-size: 0.9rem; font-weight: 700; min-width: 20px; text-align: center;">0</span>
                      <button type="button" class="btn-addon-qty btn-addon-plus" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--color-gold); background: var(--color-gold); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: all 0.2s;">+</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Footer Actions & Total Calculation -->
          <div style="border-top: 1px solid #EADBCE; padding-top: 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div>
              <div style="font-size: 0.82rem; color: #777;">Tạm tính tổng set lẩu & món gọi thêm:</div>
              <div id="comboTotalPriceDisplay" style="font-size: 1.6rem; font-weight: 800; color: var(--color-brand);">
                ${formatPrice(product.price)}
              </div>
            </div>

            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-gold modal-add-combo-to-res-btn" style="padding: 11px 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
                Thêm set lẩu vào bàn đã đặt
              </button>
              <button type="button" class="btn btn-primary modal-book-with-combo-btn" style="padding: 11px 18px; font-weight: 700;">
                Đặt bàn với set lẩu này
              </button>
              <button class="btn btn-secondary btn-icon-only modal-fav-btn" data-id="${product.id}" title="${isFav ? 'Bỏ thích' : 'Yêu thích món'}" style="width: 44px; height: 44px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-brand)' : 'none'}" stroke="${isFav ? 'var(--color-brand)' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      // Xử lý tăng giảm số lượng món Add-on
      const selectedAddons = {};
      const totalPriceEl = modalBody.querySelector('#comboTotalPriceDisplay');

      function calculateTotal() {
        let total = product.price;
        Object.values(selectedAddons).forEach(item => {
          total += item.price * item.quantity;
        });
        if (totalPriceEl) totalPriceEl.textContent = formatPrice(total);
      }

      modalBody.querySelectorAll('.combo-addon-item').forEach(card => {
        const id = Number(card.getAttribute('data-id'));
        const price = Number(card.getAttribute('data-price'));
        const name = card.getAttribute('data-name');
        const qtyDisplay = card.querySelector('.addon-qty-display');
        const minusBtn = card.querySelector('.btn-addon-minus');
        const plusBtn = card.querySelector('.btn-addon-plus');

        if (plusBtn) {
          plusBtn.addEventListener('click', () => {
            if (!selectedAddons[id]) {
              selectedAddons[id] = { id, name, price, quantity: 0 };
            }
            selectedAddons[id].quantity += 1;
            qtyDisplay.textContent = selectedAddons[id].quantity;
            card.style.borderColor = 'var(--color-gold)';
            card.style.background = '#FFFDF9';
            calculateTotal();
          });
        }

        if (minusBtn) {
          minusBtn.addEventListener('click', () => {
            if (selectedAddons[id] && selectedAddons[id].quantity > 0) {
              selectedAddons[id].quantity -= 1;
              qtyDisplay.textContent = selectedAddons[id].quantity;
              if (selectedAddons[id].quantity === 0) {
                delete selectedAddons[id];
                card.style.borderColor = '#EBE4D8';
                card.style.background = '#FCFAF6';
              }
              calculateTotal();
            }
          });
        }
      });

      // Xử lý nút: Thêm set lẩu và các món add-on vào bàn đã đặt
      const addComboResBtn = modalBody.querySelector('.modal-add-combo-to-res-btn');
      if (addComboResBtn) {
        addComboResBtn.addEventListener('click', () => {
          if (!window.AppState) return;

          const currentUser = window.AppState.getCurrentUser();
          if (!currentUser) {
            if (window.showToast) {
              window.showToast('Vui lòng đăng nhập để thêm món vào bàn đã đặt.', 'warning', 'Chưa đăng nhập');
            }
            return;
          }

          const pendingList = window.AppState.getUserReservations(currentUser).filter(r => r.status === 'pending');
          if (!pendingList || pendingList.length === 0) {
            if (window.showToast) {
              window.showToast('Bạn chưa có đơn đặt bàn nào đang chờ xác nhận. Hãy đặt bàn trước nhé!', 'info', 'Chưa có bàn đặt');
            }
            return;
          }

          function addAllToReservation(targetRes) {
            // Thêm set lẩu chính
            window.AppState.addDishToReservation(targetRes.id, product.id, 1);
            // Thêm các món nhúng gọi thêm nếu có
            Object.values(selectedAddons).forEach(addon => {
              if (addon.quantity > 0) {
                window.AppState.addDishToReservation(targetRes.id, addon.id, addon.quantity);
              }
            });

            if (window.showToast) {
              const addonCount = Object.keys(selectedAddons).length;
              const msg = addonCount > 0 
                ? `Đã thêm "${product.name}" kèm ${addonCount} món gọi thêm vào đơn đặt bàn ${targetRes.code || targetRes.id}!` 
                : `Đã thêm "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id}!`;
              window.showToast(msg, 'success', 'Thêm thành công');
            }
          }

          if (pendingList.length === 1) {
            addAllToReservation(pendingList[0]);
          } else {
            window.openSelectReservationModal(pendingList, product, (chosenRes) => {
              addAllToReservation(chosenRes);
            });
          }
        });
      }

      // Xử lý nút: Đặt bàn với set lẩu này
      const bookWithComboBtn = modalBody.querySelector('.modal-book-with-combo-btn');
      if (bookWithComboBtn) {
        bookWithComboBtn.addEventListener('click', () => {
          // Lưu thông tin set lẩu đã chọn vào sessionStorage để tự động áp dụng vào trang đặt bàn
          const comboData = {
            productId: product.id,
            productName: product.name,
            servingSize: details.servingSize,
            broth: details.broth,
            price: product.price,
            addOns: Object.values(selectedAddons).filter(a => a.quantity > 0)
          };
          try {
            sessionStorage.setItem('launuong_preselected_combo', JSON.stringify(comboData));
          } catch (e) {}

          window.closeProductModal();
          window.location.href = reservationUrl;
        });
      }

    } else {
      // 2. MÓN ĂN THÔNG THƯỜNG (NƯỚNG, RAU NẤM, HẢI SẢN, ĐỒ UỐNG ĐƠN LẺ)
      if (modalDialog) {
        modalDialog.style.maxWidth = '680px';
        modalDialog.style.width = '90%';
        modalDialog.style.maxHeight = '';
        modalDialog.style.overflowY = '';
        modalDialog.style.borderRadius = '12px';
      }

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
              <a href="${reservationUrl}" class="btn btn-primary" style="flex: 1; padding: 11px 16px; font-size: 0.9rem;">
                Đặt bàn thưởng thức
              </a>
              <button class="btn btn-secondary btn-icon-only modal-fav-btn" data-id="${product.id}" title="${isFav ? 'Bỏ thích' : 'Yêu thích món'}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'var(--color-brand)' : 'none'}" stroke="${isFav ? 'var(--color-brand)' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      // Hook thêm món đơn lẻ vào bàn đã đặt
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

          if (pendingList.length === 1) {
            const targetRes = pendingList[0];
            const res = window.AppState.addDishToReservation(targetRes.id, product.id, 1);
            if (res.success && window.showToast) {
              window.showToast(`Đã thêm món "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id} thành công!`, 'success', 'Đã thêm món');
            }
          } else {
            window.openSelectReservationModal(pendingList, product);
          }
        });
      }
    }

    // Hook chung: Nút yêu thích
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

    modalOverlay.style.zIndex = '2200';
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Hộp thoại nhỏ chọn bàn khi người dùng có >= 2 bàn đang chờ xác nhận
  window.openSelectReservationModal = function (pendingList, product, onSelectedCallback) {
    let selectOverlay = document.getElementById('selectResModalOverlay');
    if (!selectOverlay) {
      const modalHtml = `
        <div class="modal-overlay" id="selectResModalOverlay" aria-hidden="true" style="z-index: 2400;">
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

      document.getElementById('closeSelectResModalBtn').addEventListener('click', window.closeSelectReservationModal);
      document.getElementById('cancelSelectResBtn').addEventListener('click', window.closeSelectReservationModal);
      selectOverlay.addEventListener('click', (e) => {
        if (e.target === selectOverlay) window.closeSelectReservationModal();
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

      listEl.querySelectorAll('.btn-choose-res').forEach(btn => {
        btn.addEventListener('click', () => {
          const resId = Number(btn.getAttribute('data-res-id'));
          const targetRes = pendingList.find(r => r.id === resId);
          if (targetRes && window.AppState) {
            const res = window.AppState.addDishToReservation(targetRes.id, product.id, 1);
            window.closeSelectReservationModal();
            if (res.success && window.showToast) {
              window.showToast(`Đã thêm món "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id} thành công!`, 'success', 'Thêm món thành công');
            }
            if (typeof onSelectedCallback === 'function') {
              onSelectedCallback(targetRes);
            }
          }
        });
      });
    }

    selectOverlay.style.zIndex = '2400';
    selectOverlay.classList.add('active');
    selectOverlay.setAttribute('aria-hidden', 'false');
  };

  window.closeSelectReservationModal = function () {
    const selectOverlay = document.getElementById('selectResModalOverlay');
    if (selectOverlay) {
      selectOverlay.classList.remove('active');
      selectOverlay.setAttribute('aria-hidden', 'true');
    }
  };

  window.closeProductModal = function () {
    window.closeSelectReservationModal();
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeProductModal();
      }
    });
  });
})();

