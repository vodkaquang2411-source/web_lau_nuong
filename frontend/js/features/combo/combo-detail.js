/**
 * LẨU NƯỚNG VN - COMBO & HOTPOT DETAIL PAGE LOGIC
 * Hiển thị chi tiết trọn gói đồ ăn đi kèm, nước lẩu cốt, định lượng khẩu phần và tính toán món gọi thêm
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('comboDetailContainer');
  const otherCombosContainer = document.getElementById('otherCombosContainer');
  const breadcrumbName = document.getElementById('breadcrumbComboName');
  const pageMainHeading = document.getElementById('pageMainHeading');

  if (!container || !window.AppState) return;

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  // 1. Lấy ID từ tham số URL (?id=25), mặc định là combo 25 (Combo hẹn hò)
  const urlParams = new URLSearchParams(window.location.search);
  let productId = Number(urlParams.get('id')) || 25;

  let product = window.AppState.getProductById(productId);
  if (!product || (!product.comboDetails && product.category !== 'lau' && product.category !== 'combo')) {
    // Nếu sản phẩm không phải lẩu/combo, fallback về combo 25
    productId = 25;
    product = window.AppState.getProductById(productId);
  }

  if (!product) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h3 style="color: var(--color-brand); margin-bottom: 12px;">Không tìm thấy thông tin set lẩu</h3>
        <p style="color: var(--color-gray-600); margin-bottom: 20px;">Món ăn không tồn tại hoặc đã ngừng phục vụ.</p>
        <a href="menu.html" class="btn btn-primary">Xem toàn bộ thực đơn</a>
      </div>
    `;
    return;
  }

  // Cập nhật tiêu đề trang
  document.title = `${product.name} - Chi tiết set lẩu - LẨU NƯỚNG VN`;
  if (breadcrumbName) breadcrumbName.textContent = product.name;
  if (pageMainHeading) pageMainHeading.textContent = product.name;

  const details = product.comboDetails || {
    servingSize: 'Dành cho 3 - 4 người',
    broth: 'Nước cốt hầm xương thanh ngọt tự nhiên',
    includedItems: [
      { name: 'Ba chỉ bò Mỹ thái lát', amount: 'Đĩa 300g', desc: 'Thịt bò tươi mềm ngọt' },
      { name: 'Rau nấm tổng hợp', amount: 'Rổ lớn', desc: 'Rau xanh và 4 loại nấm' },
      { name: 'Mỳ nhúng lẩu', amount: '2 gói', desc: 'Mỳ trứng tươi dai ngon' }
    ],
    suggestedAddOns: [
      { id: 13, name: 'Ba chỉ bò Mỹ nhúng thêm', price: 89000, unit: 'đĩa 200g' },
      { id: 21, name: 'Set nấm tươi 6 loại gọi thêm', price: 49000, unit: 'đĩa lớn' }
    ]
  };

  // 2. Render giao diện chi tiết set lẩu & đồ đi kèm
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 36px; align-items: start;">
      
      <!-- Cột trái: Hình ảnh, khẩu phần & nước cốt lẩu -->
      <div>
        <div style="position: relative; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); border: 2px solid var(--color-gold); margin-bottom: 20px;">
          <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 380px; object-fit: cover; display: block;">
          <div style="position: absolute; top: 16px; left: 16px; display: flex; gap: 8px;">
            <span class="badge badge-hot" style="font-weight: 700; font-size: 0.85rem; padding: 6px 12px;">Set lẩu trọn gói</span>
            ${product.isFeatured ? '<span class="badge" style="background: var(--color-gold); color: var(--color-dark); font-weight: 700; font-size: 0.85rem; padding: 6px 12px;">Bán chạy nhất</span>' : ''}
          </div>
        </div>

        <!-- Khối khẩu phần và nước cốt lẩu -->
        <div style="background: #FFFDF9; border: 1px solid #EBE4D8; border-radius: var(--radius-md); padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px; border-bottom: 1px dashed #E2D7C5; padding-bottom: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div style="font-size: 0.82rem; color: var(--color-gray-500); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Khẩu phần tiêu chuẩn:</div>
              <div style="font-size: 1.05rem; font-weight: 700; color: var(--color-primary);">${details.servingSize}</div>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c1 3 2.5 4.5 4.5 5.5C18 8.5 19 10 19 12a7 7 0 1 1-14 0c0-2 1-3.5 2.5-4.5C9.5 6.5 11 5 12 2z"></path></svg>
            </div>
            <div>
              <div style="font-size: 0.82rem; color: var(--color-gray-500); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Nước lẩu cốt đặc trưng:</div>
              <div style="font-size: 0.95rem; font-weight: 600; color: var(--color-brand); line-height: 1.45;">${details.broth}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: Giá, Đồ đi kèm trọn gói, Món gọi thêm & Hành động đặt bàn -->
      <div>
        <div style="border-bottom: 2px solid var(--color-gold); padding-bottom: 16px; margin-bottom: 22px;">
          <h2 style="font-size: 1.85rem; color: var(--color-primary); margin: 0 0 8px 0; font-weight: 800;">${product.name}</h2>
          <p style="font-size: 0.95rem; color: var(--color-gray-600); line-height: 1.55; margin: 0 0 14px 0;">${product.description}</p>
          <div style="display: flex; align-items: baseline; gap: 14px;">
            <span style="font-size: 2.1rem; font-weight: 900; color: var(--color-brand);">${formatPrice(product.price)}</span>
            <span style="font-size: 0.95rem; color: var(--color-gray-500);">/ trọn set đầy đủ</span>
          </div>
        </div>

        <!-- Danh sách đồ đi kèm trọn gói trong set -->
        <div style="background: white; border: 1.5px solid #EBE4D8; border-radius: var(--radius-md); padding: 22px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px dashed #E2D7C5; padding-bottom: 10px;">
            <h3 style="font-size: 1.15rem; color: var(--color-primary); margin: 0; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Đồ nhúng & thành phần trọn gói trong set (${details.includedItems ? details.includedItems.length : 0} món)
            </h3>
            <span style="font-size: 0.82rem; color: #166534; background: #DCFCE7; padding: 4px 10px; border-radius: 20px; font-weight: 600;">
              Đã bao gồm trong giá
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">
            ${(details.includedItems || []).map(item => `
              <div style="background: #FCFAF6; border-radius: 8px; padding: 12px 14px; border: 1px solid #ECE3D7; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div>
                  <div style="font-weight: 700; font-size: 0.92rem; color: var(--color-dark);">${item.name}</div>
                  <div style="font-size: 0.8rem; color: #666; margin-top: 3px; line-height: 1.4;">${item.desc}</div>
                </div>
                <span style="background: #F0FDF4; color: #166534; font-weight: 700; font-size: 0.82rem; padding: 3px 8px; border-radius: 6px; white-space: nowrap; border: 1px solid #BBF7D0; flex-shrink: 0;">
                  ${item.amount}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Món nhúng gọi thêm tùy chọn -->
        ${details.suggestedAddOns && details.suggestedAddOns.length > 0 ? `
          <div style="background: white; border: 1.5px solid #EBE4D8; border-radius: var(--radius-md); padding: 22px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px dashed #E2D7C5; padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <h3 style="font-size: 1.1rem; color: var(--color-dark); margin: 0; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
                Món nhúng gọi thêm tùy chọn (Theo sở thích)
              </h3>
              <span style="font-size: 0.82rem; color: var(--color-gray-500);">Thêm số lượng món yêu thích</span>
            </div>

            <div id="comboAddonsList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;">
              ${details.suggestedAddOns.map(addon => `
                <div class="combo-addon-item" data-id="${addon.id}" data-price="${addon.price}" data-name="${addon.name}" style="border: 1px solid #EBE4D8; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; background: #FCFAF6; transition: all 0.2s;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem; color: var(--color-dark);">${addon.name}</div>
                    <div style="font-size: 0.85rem; color: var(--color-brand); font-weight: 700; margin-top: 2px;">
                      +${formatPrice(addon.price)} <span style="font-size: 0.78rem; color: #888; font-weight: normal;">/${addon.unit}</span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <button type="button" class="btn-addon-qty btn-addon-minus" style="width: 30px; height: 30px; border-radius: 6px; border: 1px solid #ccc; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #555; transition: all 0.2s;">-</button>
                    <span class="addon-qty-display" style="font-size: 0.95rem; font-weight: 700; min-width: 22px; text-align: center;">0</span>
                    <button type="button" class="btn-addon-qty btn-addon-plus" style="width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--color-gold); background: var(--color-gold); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: all 0.2s;">+</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Hộp tính tổng tiền và các nút hành động -->
        <div style="background: #FFFDF9; border: 2px solid var(--color-gold); border-radius: var(--radius-md); padding: 22px; box-shadow: 0 6px 18px rgba(184, 134, 11, 0.1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="font-size: 0.85rem; color: var(--color-gray-600); margin-bottom: 2px;">Tổng tiền tạm tính món ăn & đồ nhúng thêm:</div>
              <div id="comboGrandTotalDisplay" style="font-size: 2rem; font-weight: 900; color: var(--color-brand);">
                ${formatPrice(product.price)}
              </div>
            </div>
            <div style="text-align: right; font-size: 0.82rem; color: var(--color-gray-500);">
              Ưu đãi giảm 10% khi đặt bàn trước 2 tiếng
            </div>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button type="button" id="btnPageBookWithCombo" class="btn btn-primary btn-lg" style="flex: 1.5; min-width: 240px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Đặt bàn với set lẩu này
            </button>
            <button type="button" id="btnPageAddComboToRes" class="btn btn-gold btn-lg" style="flex: 1; min-width: 200px; font-weight: 700; font-size: 0.95rem;">
              Thêm vào bàn đã đặt
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // 3. Logic tăng giảm số lượng món Add-on
  const selectedAddons = {};
  const grandTotalEl = document.getElementById('comboGrandTotalDisplay');

  function calculateGrandTotal() {
    let total = product.price;
    Object.values(selectedAddons).forEach(item => {
      total += item.price * item.quantity;
    });
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(total);
  }

  container.querySelectorAll('.combo-addon-item').forEach(card => {
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
        calculateGrandTotal();
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
          calculateGrandTotal();
        }
      });
    }
  });

  // 4. Xử lý nút: Đặt bàn với set lẩu này
  const btnBookWithCombo = document.getElementById('btnPageBookWithCombo');
  if (btnBookWithCombo) {
    btnBookWithCombo.addEventListener('click', () => {
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

      window.location.href = 'reservation.html';
    });
  }

  // 5. Xử lý nút: Thêm vào bàn đã đặt (nếu khách hàng đã có bàn chờ)
  const btnAddComboToRes = document.getElementById('btnPageAddComboToRes');
  if (btnAddComboToRes) {
    btnAddComboToRes.addEventListener('click', () => {
      const currentUser = window.AppState.getCurrentUser();
      if (!currentUser) {
        if (window.showToast) {
          window.showToast('Vui lòng đăng nhập để thêm set lẩu vào bàn đã đặt.', 'warning', 'Chưa đăng nhập');
        }
        setTimeout(() => {
          window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
        }, 800);
        return;
      }

      const pendingList = window.AppState.getUserReservations(currentUser).filter(r => r.status === 'pending');
      if (!pendingList || pendingList.length === 0) {
        if (window.showToast) {
          window.showToast('Bạn chưa có đơn đặt bàn nào đang chờ xác nhận. Vui lòng nhấn nút Đặt bàn với set lẩu này.', 'info', 'Chưa có bàn đặt');
        }
        return;
      }

      function addAllToTargetRes(targetRes) {
        window.AppState.addDishToReservation(targetRes.id, product.id, 1);
        Object.values(selectedAddons).forEach(addon => {
          if (addon.quantity > 0) {
            window.AppState.addDishToReservation(targetRes.id, addon.id, addon.quantity);
          }
        });

        if (window.showToast) {
          window.showToast(`Đã thêm "${product.name}" vào đơn đặt bàn ${targetRes.code || targetRes.id}!`, 'success', 'Thêm thành công');
        }
      }

      if (pendingList.length === 1) {
        addAllToTargetRes(pendingList[0]);
      } else if (window.openSelectReservationModal) {
        window.openSelectReservationModal(pendingList, product, (chosenRes) => {
          addAllToTargetRes(chosenRes);
        });
      }
    });
  }

  // 6. Render danh sách các combo khác ở bên dưới
  if (otherCombosContainer) {
    const allProducts = window.AppState.getProducts();
    const otherCombos = allProducts.filter(p => (p.category === 'combo' || p.category === 'lau') && p.id !== product.id).slice(0, 3);

    otherCombosContainer.innerHTML = otherCombos.map(item => {
      const itemDetails = item.comboDetails || {};
      return `
        <div style="background: white; border-radius: var(--radius-lg); overflow: hidden; border: 1.5px solid #EBE4D8; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; transition: all 0.3s ease;">
          <div style="position: relative; height: 180px; overflow: hidden;">
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
            <span class="badge badge-hot" style="position: absolute; top: 10px; left: 10px; font-size: 0.75rem;">${itemDetails.servingSize || 'Thực đơn trọn vị'}</span>
          </div>
          <div style="padding: 18px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; color: var(--color-primary); margin: 0 0 6px 0;">${item.name}</h3>
              <p style="font-size: 0.85rem; color: var(--color-gray-600); line-height: 1.45; margin: 0 0 12px 0;">${item.description}</p>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-brand); margin-bottom: 12px;">${formatPrice(item.price)}</div>
              <div style="display: flex; gap: 8px;">
                <a href="combo-detail.html?id=${item.id}" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.82rem; text-align: center;">Xem chi tiết</a>
                <a href="reservation.html" class="btn btn-primary btn-sm btn-quick-book-other" data-id="${item.id}" style="flex: 1; font-size: 0.82rem; text-align: center;">Đặt bàn</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    otherCombosContainer.querySelectorAll('.btn-quick-book-other').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const otherId = Number(btn.getAttribute('data-id'));
        const otherProd = window.AppState.getProductById(otherId);
        if (otherProd) {
          const comboData = {
            productId: otherProd.id,
            productName: otherProd.name,
            servingSize: otherProd.comboDetails ? otherProd.comboDetails.servingSize : 'Tiêu chuẩn',
            broth: otherProd.comboDetails ? otherProd.comboDetails.broth : '',
            price: otherProd.price,
            addOns: []
          };
          try {
            sessionStorage.setItem('launuong_preselected_combo', JSON.stringify(comboData));
          } catch (err) {}
          window.location.href = 'reservation.html';
        }
      });
    });
  }
});
