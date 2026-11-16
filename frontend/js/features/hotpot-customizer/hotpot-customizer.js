/**
 * LẨU NƯỚNG VN - HOTPOT CUSTOMIZER LOGIC
 * Sáng tạo nồi lẩu theo phong vị riêng
 * - Chọn kiểu nồi (1 ngăn, 2 ngăn Uyên Ương hoặc 4 ngăn Tứ Quý)
 * - Nồi lẩu hoàng gia cao cấp không bao giờ bị mất chữ
 * - Tích chọn nước lẩu: Ô tròn được đánh dấu và góc thẻ hiển thị rõ Ngăn 1, 2, 3...
 * - Topping đồ nhúng chuyên biệt: Bò, tôm, sò, ốc, hến, gà, các loại rau, nấm, bia, nước ngọt, nước ngọc
 * - Tính giá tự động theo thời gian thực và chuyển tiếp đặt bàn
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hotpotCustomizer');
  if (!container) return;

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  // 1. Cấu hình kiểu nồi lẩu
  const potTypes = {
    1: {
      id: 1,
      name: 'Nồi 1 ngăn (Đơn vị tinh hoa)',
      shortName: 'Nồi 1 ngăn',
      slots: 1,
      basePrice: 189000,
      desc: 'Dành cho 2 - 3 người thích một vị cốt đậm đà nguyên bản'
    },
    2: {
      id: 2,
      name: 'Nồi 2 ngăn (Uyên Ương giao hòa)',
      shortName: 'Nồi 2 ngăn Uyên Ương',
      slots: 2,
      basePrice: 239000,
      desc: 'Dành cho 3 - 5 người phối 2 vị nước dùng cay & không cay'
    },
    4: {
      id: 4,
      name: 'Nồi 4 ngăn (Tứ Quý sum vầy)',
      shortName: 'Nồi 4 ngăn Tứ Quý',
      slots: 4,
      basePrice: 299000,
      desc: 'Dành cho 4 - 8 người đại tiệc sum vầy trải nghiệm 4 vị'
    }
  };

  // 2. Danh mục 6 vị nước lẩu cốt đặc sản
  const brothList = [
    {
      id: 'tomyum',
      name: 'Lẩu Thái Tomyum hải sản',
      shortName: 'Thái Tomyum',
      colorClass: 'broth-tomyum',
      dotColor: '#E64A19',
      spice: 'Cay vừa',
      desc: 'Chua cay đậm đà, thơm béo cốt dừa & sả chanh tươi',
      extraPrice: 0
    },
    {
      id: 'nam',
      name: 'Lẩu nấm chim câu bổ dưỡng',
      shortName: 'Nấm chim câu',
      colorClass: 'broth-nam',
      dotColor: '#8D6E63',
      spice: 'Không cay',
      desc: 'Ngọt thanh tự nhiên hầm từ thảo mộc & 6 loại nấm quý',
      extraPrice: 0
    },
    {
      id: 'tuxuyen',
      name: 'Lẩu Tứ Xuyên cay tê nồng nàn',
      shortName: 'Tứ Xuyên cay tê',
      colorClass: 'broth-tuxuyen',
      dotColor: '#D32F2F',
      spice: 'Cay tê',
      desc: 'Hoa tiêu Tứ Xuyên trứ danh và ớt khô cay nồng',
      extraPrice: 0
    },
    {
      id: 'rieucua',
      name: 'Lẩu riêu cua bắp bò sườn sụn',
      shortName: 'Riêu cua bắp bò',
      colorClass: 'broth-rieucua',
      dotColor: '#F57C00',
      spice: 'Không cay',
      desc: 'Gạch cua đồng béo bùi kết hợp dấm bỗng nếp làng Vân',
      extraPrice: 0
    },
    {
      id: 'nhungdam',
      name: 'Lẩu bò nhúng dấm thảo mộc',
      shortName: 'Bò nhúng dấm',
      colorClass: 'broth-nhungdam',
      dotColor: '#FBC02D',
      spice: 'Không cay',
      desc: 'Chua thanh dịu nhẹ thơm hương sả tươi và quế hồi',
      extraPrice: 0
    },
    {
      id: 'echmang',
      name: 'Lẩu ếch đồng măng cay',
      shortName: 'Ếch măng cay',
      colorClass: 'broth-echmang',
      dotColor: '#EF6C00',
      spice: 'Cay vừa',
      desc: 'Đậm đà chua cay cùng măng củ xào tỏi ớt giòn rụm',
      extraPrice: 0
    }
  ];

  // 3. Danh mục 17 món chuyên dùng để nhúng lẩu & đồ uống (Bò, tôm, sò, ốc, hến, gà, rau, bia, nước ngọt, nước ngọc)
  const toppingList = [
    // Thịt bò & Gà
    {
      id: 101,
      category: 'meat',
      name: 'Ba chỉ bò Mỹ thái lát mỏng',
      price: 89000,
      unit: 'đĩa 200g',
      img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 102,
      category: 'meat',
      name: 'Bắp bò hoa giòn sần sật',
      price: 99000,
      unit: 'đĩa 200g',
      img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 103,
      category: 'meat',
      name: 'Thịt gà ta thả vườn chặt miếng',
      price: 79000,
      unit: 'đĩa 300g',
      img: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=240&q=80'
    },

    // Hải sản nhúng (Tôm, Sò, Ốc, Hến)
    {
      id: 104,
      category: 'seafood',
      name: 'Tôm sú biển tươi sống',
      price: 119000,
      unit: 'đĩa 6 con',
      img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 105,
      category: 'seafood',
      name: 'Sò huyết tươi ngọt đậm',
      price: 69000,
      unit: 'đĩa 300g',
      img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 106,
      category: 'seafood',
      name: 'Ốc nhồi thịt thả lẩu giòn dai',
      price: 59000,
      unit: 'đĩa 8 viên',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 107,
      category: 'seafood',
      name: 'Hến tươi Cồn Hến béo ngọt',
      price: 49000,
      unit: 'đĩa 250g',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80'
    },

    // Các loại rau & Nấm
    {
      id: 108,
      category: 'veggie',
      name: 'Khay rau xanh nhúng lẩu tổng hợp',
      price: 35000,
      unit: 'rổ lớn',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 109,
      category: 'veggie',
      name: 'Rau muống cọng giòn xanh mướt',
      price: 25000,
      unit: 'đĩa lớn',
      img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 110,
      category: 'veggie',
      name: 'Rau cải cúc non ngọt mát',
      price: 25000,
      unit: 'đĩa lớn',
      img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 111,
      category: 'veggie',
      name: 'Set nấm tươi 5 loại thanh mát',
      price: 45000,
      unit: 'đĩa lớn',
      img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=240&q=80'
    },

    // Bia, Nước ngọt & Nước ngọc
    {
      id: 112,
      category: 'drink',
      name: 'Bia Tiger Crystal mát lạnh',
      price: 25000,
      unit: 'lon 330ml',
      img: 'https://images.unsplash.com/photo-1608270199990-264627d2c3df?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 113,
      category: 'drink',
      name: 'Bia Heineken Silver êm đằm',
      price: 28000,
      unit: 'lon 330ml',
      img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 114,
      category: 'drink',
      name: 'Nước ngọt Coca-Cola mát lạnh',
      price: 15000,
      unit: 'lon 320ml',
      img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 115,
      category: 'drink',
      name: 'Nước ngọt Sprite chanh sảng khoái',
      price: 15000,
      unit: 'lon 320ml',
      img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 116,
      category: 'drink',
      name: 'Nước ngọc thạch nha đam hạt chia',
      price: 20000,
      unit: 'chai 350ml',
      img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=240&q=80'
    },
    {
      id: 117,
      category: 'drink',
      name: 'Nước khoáng tinh khiết thiên nhiên',
      price: 10000,
      unit: 'chai 500ml',
      img: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=240&q=80'
    }
  ];

  // 4. Trạng thái hiện tại (State)
  let currentPotTypeId = 2; // Mặc định nồi 2 ngăn Uyên Ương
  let activeSlotIndex = 0; // Ngăn đang được chọn
  let assignedBroths = [brothList[0], brothList[1]]; // Mặc định Tomyum & Lẩu nấm
  let selectedToppings = {}; // { 101: 1, 104: 2 ... }
  let currentControlTab = 'broth'; // 'broth' (chọn nước lẩu) hoặc 'topping' (chọn đồ nhúng)
  let currentToppingCategory = 'all'; // 'all', 'meat', 'seafood', 'veggie', 'drink'

  // 5. Render khung giao diện chính
  function renderCustomizerLayout() {
    container.innerHTML = `
      <div class="container">
        <!-- Section Header -->
        <div class="section-header" style="margin-bottom: 26px;">
          <h2 class="section-title">Sáng tạo nồi lẩu theo <span>phong vị riêng</span></h2>
          <div class="gold-divider"><div class="gold-divider-icon"></div></div>
          <p class="section-desc">Tùy biến kiểu nồi 1 ngăn, 2 ngăn Uyên Ương hoặc 4 ngăn Tứ Quý, tự do kết hợp các vị nước cốt gia truyền và topping nhúng lẩu tươi ngon cho bàn tiệc của bạn.</p>
        </div>

        <!-- Pot Type Selector Tabs -->
        <div class="pot-type-selector">
          <button type="button" class="pot-type-btn ${currentPotTypeId === 1 ? 'active' : ''}" data-type="1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle></svg>
            Nồi 1 ngăn (Đơn vị)
            <span class="pot-badge-price">189.000 đ</span>
          </button>
          <button type="button" class="pot-type-btn ${currentPotTypeId === 2 ? 'active' : ''}" data-type="2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v18"></path></svg>
            Nồi 2 ngăn (Uyên Ương)
            <span class="pot-badge-price">239.000 đ</span>
          </button>
          <button type="button" class="pot-type-btn ${currentPotTypeId === 4 ? 'active' : ''}" data-type="4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v18M3 12h18"></path></svg>
            Nồi 4 ngăn (Tứ Quý)
            <span class="pot-badge-price">299.000 đ</span>
          </button>
        </div>

        <!-- Interactive Grid: Left Pot Visual + Right Controls -->
        <div class="pot-customizer-grid">
          
          <!-- Left Column: Royal Hotpot Visual Vessel -->
          <div class="pot-stage-wrapper">
            <div class="pot-handles-wrap">
              <div class="pot-handle-left"></div>
              
              <!-- Round Metallic Royal Pot -->
              <div class="pot-vessel" id="potVesselElement">
                <!-- Steam Effect -->
                <div class="pot-steam-effect">
                  <div class="steam-bubble"></div>
                  <div class="steam-bubble"></div>
                  <div class="steam-bubble"></div>
                </div>

                <!-- Compartments Container -->
                <div id="potCompartmentsContainer" style="width: 100%; height: 100%;">
                  <!-- Được vẽ bằng renderPotCompartments -->
                </div>
              </div>

              <div class="pot-handle-right"></div>
            </div>

            <!-- Stage Guidance Instruction -->
            <div class="pot-stage-guide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Nhấp trực tiếp vào ngăn nồi trên hoặc thẻ bên dưới để đổi vị:</span>
            </div>

            <!-- Pot Slots Mini Deck: Thanh tóm tắt và chuyển nhanh ngăn ngay dưới đáy nồi -->
            <div class="pot-slots-deck" id="potSlotsDeckContainer">
              <!-- Render tự động theo số ngăn -->
            </div>
          </div>

          <!-- Right Column: Sub-Tabs & Controls -->
          <div class="pot-controls-wrapper">
            
            <!-- Sub-Tabs: 1. Nước lẩu cốt | 2. Topping đồ nhúng -->
            <div class="customizer-subtabs">
              <button type="button" class="customizer-tab-btn ${currentControlTab === 'broth' ? 'active' : ''}" id="tabBtnBroth">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c1 3 2.5 4.5 4.5 5.5C18 8.5 19 10 19 12a7 7 0 1 1-14 0c0-2 1-3.5 2.5-4.5C9.5 6.5 11 5 12 2z"></path></svg>
                1. Phối vị nước lẩu
              </button>
              <button type="button" class="customizer-tab-btn ${currentControlTab === 'topping' ? 'active' : ''}" id="tabBtnTopping">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
                2. Chọn món nhúng & đồ uống
                <span class="tab-badge-count" id="toppingBadgeCount" style="display: none;">0</span>
              </button>
            </div>

            <!-- Panel 1: Broth Choices Grid -->
            <div id="brothPanelContainer" style="${currentControlTab === 'broth' ? 'display: block;' : 'display: none;'}">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
                <h3 style="font-size: 1.05rem; color: var(--color-primary); margin: 0; font-weight: 700;">
                  Danh mục 6 vị nước lẩu cốt đặc sản:
                </h3>
                <span id="activeSlotIndicator" style="font-size: 0.82rem; color: #166534; font-weight: 700; background: #DCFCE7; padding: 2px 8px; border-radius: 10px;">
                  Đang gán cho: Ngăn 1
                </span>
              </div>

              <div class="broth-options-grid" id="brothOptionsList">
                ${brothList.map(broth => `
                  <div class="broth-choice-card" data-broth-id="${broth.id}">
                    <div class="broth-color-dot" style="background-color: ${broth.dotColor};">
                      <svg class="broth-dot-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                      <div class="broth-info-title">${broth.name}</div>
                      <div class="broth-info-desc">${broth.desc}</div>
                      <div style="display: flex; gap: 8px; align-items: center; margin-top: 3px;">
                        <span style="font-size: 0.72rem; color: #991B1B; font-weight: 600;">${broth.spice}</span>
                        <span style="font-size: 0.72rem; color: #166534; font-weight: 600;">• Đã bao gồm</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="text-align: right; margin-top: 12px;">
                <button type="button" id="btnNextToTopping" class="btn btn-secondary btn-sm" style="font-size: 0.85rem; padding: 6px 14px; font-weight: 700; color: var(--color-brand); border-color: var(--color-gold);">
                  Tiếp tục chọn món nhúng & đồ uống →
                </button>
              </div>
            </div>

            <!-- Panel 2: Topping Choices Grid -->
            <div id="toppingPanelContainer" style="${currentControlTab === 'topping' ? 'display: block;' : 'display: none;'}">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                <h3 style="font-size: 1.05rem; color: var(--color-primary); margin: 0; font-weight: 700;">
                  Món chuyên dùng để nhúng & đồ uống:
                </h3>
                <span style="font-size: 0.78rem; color: var(--color-gray-500);">Gọi theo nhu cầu bàn tiệc</span>
              </div>

              <!-- Category Pills Filter -->
              <div class="topping-cat-filter" id="toppingCatFilter">
                <button type="button" class="top-cat-pill active" data-cat="all">Tất cả (17)</button>
                <button type="button" class="top-cat-pill" data-cat="meat">Bò & Gà</button>
                <button type="button" class="top-cat-pill" data-cat="seafood">Tôm, Sò, Ốc, Hến</button>
                <button type="button" class="top-cat-pill" data-cat="veggie">Các loại rau & Nấm</button>
                <button type="button" class="top-cat-pill" data-cat="drink">Bia & Nước giải khát</button>
              </div>

              <div class="topping-options-grid" id="toppingOptionsList">
                <!-- Render bằng hàm renderToppingsList() -->
              </div>
            </div>

            <!-- Real-time Live Price Calculator Box -->
            <div class="pot-summary-box">
              <div class="pot-summary-row">
                <span>Kiểu nồi cốt đã chọn:</span>
                <strong id="summaryPotTypeName" style="color: var(--color-primary);">Nồi 2 ngăn Uyên Ương (239.000 đ)</strong>
              </div>
              <div class="pot-summary-row" style="align-items: flex-start;">
                <span>Vị nước lẩu cốt:</span>
                <div id="summaryAssignedBroths" style="text-align: right; font-weight: 600; color: var(--color-brand); line-height: 1.4;">
                  Ngăn 1: Lẩu Thái Tomyum<br>Ngăn 2: Lẩu nấm chim câu
                </div>
              </div>
              <div class="pot-summary-row" id="summaryToppingRow" style="display: none; align-items: flex-start;">
                <span>Món nhúng & đồ uống gọi thêm:</span>
                <div id="summarySelectedToppings" style="text-align: right; font-weight: 600; color: #166534; font-size: 0.84rem; line-height: 1.4;">
                  Chưa chọn món nhúng
                </div>
              </div>

              <!-- Total price row -->
              <div class="pot-summary-row total-row">
                <div>
                  <div style="font-weight: 800; font-size: 0.98rem; color: var(--color-primary);">Tổng thanh toán nồi lẩu:</div>
                  <div style="font-size: 0.78rem; color: var(--color-gray-500);">Đã bao gồm nước lẩu và món gọi thêm</div>
                </div>
                <div class="pot-total-price" id="customizerTotalPrice">
                  239.000 đ
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pot-action-buttons">
                <button type="button" id="btnBookCustomPot" class="btn btn-primary" style="flex: 2; padding: 12px 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Đặt bàn với nồi lẩu tự phối này
                </button>
                <button type="button" id="btnResetCustomPot" class="btn btn-secondary" style="flex: 1; padding: 12px 14px; font-size: 0.85rem;">
                  Phối lại
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    bindEvents();
    renderToppingsList();
    renderPotCompartments();
    updateSummaryCalculation();
  }

  // 6. Vẽ danh sách Topping theo bộ lọc chuyên mục
  function renderToppingsList() {
    const listEl = document.getElementById('toppingOptionsList');
    if (!listEl) return;

    const filtered = currentToppingCategory === 'all'
      ? toppingList
      : toppingList.filter(item => item.category === currentToppingCategory);

    listEl.innerHTML = filtered.map(top => {
      const qty = selectedToppings[top.id] || 0;
      return `
        <div class="topping-choice-card ${qty > 0 ? 'has-quantity' : ''}" data-topping-id="${top.id}">
          <img src="${top.img}" alt="${top.name}" class="topping-thumb">
          <div style="flex: 1; min-width: 0;">
            <div class="topping-name">${top.name}</div>
            <div class="topping-price">
              ${formatPrice(top.price)} <span class="topping-unit">/${top.unit}</span>
            </div>
          </div>
          <div class="topping-qty-control">
            <button type="button" class="btn-top-qty btn-top-minus" data-id="${top.id}">-</button>
            <span class="topping-qty-val" data-id="${top.id}">${qty}</span>
            <button type="button" class="btn-top-qty btn-top-plus" data-id="${top.id}">+</button>
          </div>
        </div>
      `;
    }).join('');

    // Gán lại sự kiện tăng giảm
    listEl.querySelectorAll('.btn-top-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.getAttribute('data-id'));
        selectedToppings[id] = (selectedToppings[id] || 0) + 1;
        updateToppingQtyDisplay(id);
        updateSummaryCalculation();
      });
    });

    listEl.querySelectorAll('.btn-top-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.getAttribute('data-id'));
        if (selectedToppings[id] && selectedToppings[id] > 0) {
          selectedToppings[id] -= 1;
          if (selectedToppings[id] === 0) {
            delete selectedToppings[id];
          }
          updateToppingQtyDisplay(id);
          updateSummaryCalculation();
        }
      });
    });
  }

  function updateToppingQtyDisplay(id) {
    const qty = selectedToppings[id] || 0;
    const cards = document.querySelectorAll(`.topping-choice-card[data-topping-id="${id}"]`);
    cards.forEach(card => {
      const qtyEl = card.querySelector('.topping-qty-val');
      if (qtyEl) qtyEl.textContent = qty;
      card.classList.toggle('has-quantity', qty > 0);
    });
  }

  // 7. Vẽ cấu trúc các ngăn nồi lẩu tương tác (Nồi hoàng gia không mất chữ)
  function renderPotCompartments() {
    const potContainer = document.getElementById('potCompartmentsContainer');
    const deckContainer = document.getElementById('potSlotsDeckContainer');
    if (!potContainer) return;

    const potConfig = potTypes[currentPotTypeId];
    const totalSlots = potConfig.slots;

    if (totalSlots === 1) {
      const broth = assignedBroths[0] || brothList[0];
      potContainer.innerHTML = `
        <div class="pot-layout-1">
          <div class="pot-compartment ${broth.colorClass} active-compartment" data-slot="0">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Nồi đơn vị</span>
              <div class="compartment-broth-title">${broth.shortName || broth.name}</div>
              <div class="compartment-hint">${broth.spice} • Cốt chuẩn vị</div>
            </div>
          </div>
        </div>
      `;
    } else if (totalSlots === 2) {
      const b0 = assignedBroths[0] || brothList[0];
      const b1 = assignedBroths[1] || brothList[1];
      potContainer.innerHTML = `
        <div class="pot-layout-2">
          <div class="pot-compartment ${b0.colorClass} ${activeSlotIndex === 0 ? 'active-compartment' : ''}" data-slot="0">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 1</span>
              <div class="compartment-broth-title">${b0.shortName || b0.name}</div>
              <div class="compartment-hint">${b0.spice}</div>
            </div>
          </div>
          <div class="divider-bar"></div>
          <div class="pot-compartment ${b1.colorClass} ${activeSlotIndex === 1 ? 'active-compartment' : ''}" data-slot="1">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 2</span>
              <div class="compartment-broth-title">${b1.shortName || b1.name}</div>
              <div class="compartment-hint">${b1.spice}</div>
            </div>
          </div>
        </div>
      `;
    } else if (totalSlots === 4) {
      const b0 = assignedBroths[0] || brothList[0];
      const b1 = assignedBroths[1] || brothList[1];
      const b2 = assignedBroths[2] || brothList[2];
      const b3 = assignedBroths[3] || brothList[3];
      potContainer.innerHTML = `
        <div class="pot-layout-4">
          <div class="pot-compartment ${b0.colorClass} ${activeSlotIndex === 0 ? 'active-compartment' : ''}" data-slot="0">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 1</span>
              <div class="compartment-broth-title">${b0.shortName || b0.name}</div>
            </div>
          </div>
          <div class="pot-compartment ${b1.colorClass} ${activeSlotIndex === 1 ? 'active-compartment' : ''}" data-slot="1">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 2</span>
              <div class="compartment-broth-title">${b1.shortName || b1.name}</div>
            </div>
          </div>
          <div class="divider-h"></div>
          <div class="divider-v"></div>
          <div class="pot-compartment ${b2.colorClass} ${activeSlotIndex === 2 ? 'active-compartment' : ''}" data-slot="2">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 3</span>
              <div class="compartment-broth-title">${b2.shortName || b2.name}</div>
            </div>
          </div>
          <div class="pot-compartment ${b3.colorClass} ${activeSlotIndex === 3 ? 'active-compartment' : ''}" data-slot="3">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 4</span>
              <div class="compartment-broth-title">${b3.shortName || b3.name}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Lắng nghe sự kiện click trực tiếp vào từng ngăn nồi
    potContainer.querySelectorAll('.pot-compartment').forEach(comp => {
      comp.addEventListener('click', () => {
        const slotIdx = Number(comp.getAttribute('data-slot'));
        setActiveSlot(slotIdx);
        switchControlTab('broth');
      });
    });

    // Vẽ thanh Deck tóm tắt các ngăn ngay dưới đáy nồi
    if (deckContainer) {
      deckContainer.innerHTML = assignedBroths.slice(0, totalSlots).map((broth, idx) => {
        const isActive = idx === activeSlotIndex;
        return `
          <div class="slot-pill-btn ${isActive ? 'active' : ''}" data-slot="${idx}">
            <div class="slot-pill-header">
              <span class="slot-pill-num">Ngăn ${idx + 1}</span>
              <span class="slot-pill-spice">${broth.spice}</span>
            </div>
            <div class="slot-pill-name" title="${broth.name}">${broth.name}</div>
          </div>
        `;
      }).join('');

      deckContainer.querySelectorAll('.slot-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const slotIdx = Number(btn.getAttribute('data-slot'));
          setActiveSlot(slotIdx);
          switchControlTab('broth');
        });
      });
    }

    updateActiveSlotIndicator();
    updateBrothCardsStatus();
  }

  // 8. Đặt ngăn đang chọn (Active Slot)
  function setActiveSlot(slotIndex) {
    activeSlotIndex = slotIndex;
    
    // Đồng bộ class ngăn trong nồi
    const potContainer = document.getElementById('potCompartmentsContainer');
    if (potContainer) {
      potContainer.querySelectorAll('.pot-compartment').forEach(comp => {
        const idx = Number(comp.getAttribute('data-slot'));
        comp.classList.toggle('active-compartment', idx === activeSlotIndex);
      });
    }

    // Đồng bộ class thẻ deck dưới đáy nồi
    const deckContainer = document.getElementById('potSlotsDeckContainer');
    if (deckContainer) {
      deckContainer.querySelectorAll('.slot-pill-btn').forEach(btn => {
        const idx = Number(btn.getAttribute('data-slot'));
        btn.classList.toggle('active', idx === activeSlotIndex);
      });
    }

    updateActiveSlotIndicator();
    updateBrothCardsStatus();
  }

  function updateActiveSlotIndicator() {
    const indicator = document.getElementById('activeSlotIndicator');
    if (indicator) {
      indicator.textContent = `Đang gán cho: Ngăn ${activeSlotIndex + 1}`;
    }
  }

  // 9. Cập nhật dấu tích checkmark ở ô tròn và ghi rõ "Ngăn 1, 2, 3..." ở góc thẻ nước lẩu
  function updateBrothCardsStatus() {
    const totalSlots = potTypes[currentPotTypeId].slots;
    const currentActiveBroth = assignedBroths[activeSlotIndex];

    document.querySelectorAll('.broth-choice-card').forEach(card => {
      const brothId = card.getAttribute('data-broth-id');

      // Tìm danh sách các ngăn đang gán vị lẩu này
      const assignedSlotNumbers = [];
      for (let i = 0; i < totalSlots; i++) {
        if (assignedBroths[i] && assignedBroths[i].id === brothId) {
          assignedSlotNumbers.push(`Ngăn ${i + 1}`);
        }
      }

      const isAssigned = assignedSlotNumbers.length > 0;
      const isSelectedForActive = currentActiveBroth && currentActiveBroth.id === brothId;

      card.classList.toggle('is-assigned', isAssigned);
      card.classList.toggle('selected-for-active', isSelectedForActive);

      // Cập nhật huy hiệu góc ghi rõ số ngăn
      let badgeEl = card.querySelector('.broth-corner-badge');
      if (isAssigned) {
        if (!badgeEl) {
          badgeEl = document.createElement('div');
          badgeEl.className = 'broth-corner-badge';
          card.appendChild(badgeEl);
        }
        badgeEl.textContent = assignedSlotNumbers.join(', ');
      } else {
        if (badgeEl) {
          badgeEl.remove();
        }
      }
    });
  }

  // 10. Chuyển đổi giữa 2 tab: 1. Nước lẩu cốt | 2. Topping đồ nhúng
  function switchControlTab(tabName) {
    currentControlTab = tabName;
    const tabBroth = document.getElementById('tabBtnBroth');
    const tabTopping = document.getElementById('tabBtnTopping');
    const panelBroth = document.getElementById('brothPanelContainer');
    const panelTopping = document.getElementById('toppingPanelContainer');

    if (tabBroth && tabTopping && panelBroth && panelTopping) {
      tabBroth.classList.toggle('active', tabName === 'broth');
      tabTopping.classList.toggle('active', tabName === 'topping');
      panelBroth.style.display = tabName === 'broth' ? 'block' : 'none';
      panelTopping.style.display = tabName === 'topping' ? 'block' : 'none';
    }
  }

  // 11. Cập nhật bảng tính giá tự động
  function updateSummaryCalculation() {
    const potConfig = potTypes[currentPotTypeId];
    const typeNameEl = document.getElementById('summaryPotTypeName');
    const assignedEl = document.getElementById('summaryAssignedBroths');
    const totalPriceEl = document.getElementById('customizerTotalPrice');
    const summaryToppingRow = document.getElementById('summaryToppingRow');
    const summaryToppingsEl = document.getElementById('summarySelectedToppings');
    const badgeCountEl = document.getElementById('toppingBadgeCount');

    if (typeNameEl) {
      typeNameEl.textContent = `${potConfig.name} (${formatPrice(potConfig.basePrice)})`;
    }

    if (assignedEl) {
      assignedEl.innerHTML = assignedBroths.slice(0, potConfig.slots).map((b, i) => {
        return `<div>Ngăn ${i + 1}: <strong style="color: var(--color-primary);">${b.name}</strong></div>`;
      }).join('');
    }

    // Tính tổng tiền món nhúng & đồ uống
    let toppingTotal = 0;
    let toppingCount = 0;
    const selectedToppingEntries = [];

    Object.keys(selectedToppings).forEach(id => {
      const qty = selectedToppings[id];
      if (qty > 0) {
        const item = toppingList.find(t => t.id === Number(id));
        if (item) {
          toppingTotal += item.price * qty;
          toppingCount += qty;
          selectedToppingEntries.push(`${item.name} x${qty} (${formatPrice(item.price * qty)})`);
        }
      }
    });

    if (summaryToppingRow && summaryToppingsEl) {
      if (selectedToppingEntries.length > 0) {
        summaryToppingRow.style.display = 'flex';
        summaryToppingsEl.innerHTML = selectedToppingEntries.join('<br>') + `<div style="margin-top: 4px; font-weight: 700; color: #15803D;">Tổng đồ nhúng: ${formatPrice(toppingTotal)}</div>`;
      } else {
        summaryToppingRow.style.display = 'none';
      }
    }

    if (badgeCountEl) {
      if (toppingCount > 0) {
        badgeCountEl.style.display = 'inline-block';
        badgeCountEl.textContent = toppingCount;
      } else {
        badgeCountEl.style.display = 'none';
      }
    }

    const grandTotal = potConfig.basePrice + toppingTotal;
    if (totalPriceEl) {
      totalPriceEl.textContent = formatPrice(grandTotal);
    }
  }

  // 12. Gán các sự kiện tương tác
  function bindEvents() {
    // A. Chuyển đổi kiểu nồi (1 ngăn, 2 ngăn, 4 ngăn)
    document.querySelectorAll('.pot-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const typeId = Number(btn.getAttribute('data-type'));
        if (typeId === currentPotTypeId) return;

        currentPotTypeId = typeId;
        document.querySelectorAll('.pot-type-btn').forEach(b => b.classList.toggle('active', Number(b.getAttribute('data-type')) === currentPotTypeId));

        // Điều chỉnh mảng assignedBroths theo số ngăn mới
        const targetSlots = potTypes[currentPotTypeId].slots;
        while (assignedBroths.length < targetSlots) {
          const nextBroth = brothList[assignedBroths.length % brothList.length];
          assignedBroths.push(nextBroth);
        }
        if (activeSlotIndex >= targetSlots) {
          activeSlotIndex = 0;
        }

        renderPotCompartments();
        updateSummaryCalculation();

        if (window.showToast) {
          window.showToast(`Đã chuyển sang ${potTypes[currentPotTypeId].name}.`, 'info');
        }
      });
    });

    // B. Sub-tabs chuyển đổi: Nước lẩu / Topping
    const tabBroth = document.getElementById('tabBtnBroth');
    const tabTopping = document.getElementById('tabBtnTopping');
    const btnNext = document.getElementById('btnNextToTopping');

    if (tabBroth) tabBroth.addEventListener('click', () => switchControlTab('broth'));
    if (tabTopping) tabTopping.addEventListener('click', () => switchControlTab('topping'));
    if (btnNext) btnNext.addEventListener('click', () => switchControlTab('topping'));

    // C. Chọn vị lẩu từ danh sách
    document.querySelectorAll('.broth-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const brothId = card.getAttribute('data-broth-id');
        const selectedBroth = brothList.find(b => b.id === brothId);
        if (!selectedBroth) return;

        // Gán vị lẩu vào ngăn đang chọn
        assignedBroths[activeSlotIndex] = selectedBroth;

        // Vẽ lại cấu trúc ngăn nồi & cập nhật dấu tick và badge góc
        renderPotCompartments();
        updateSummaryCalculation();

        if (window.showToast) {
          window.showToast(`Đã gán "${selectedBroth.name}" cho Ngăn ${activeSlotIndex + 1}!`, 'success');
        }

        // Tự động chuyển tiêu điểm sang ngăn tiếp theo để khách chọn tiếp thuận tiện
        const totalSlots = potTypes[currentPotTypeId].slots;
        const nextSlot = (activeSlotIndex + 1) % totalSlots;
        setActiveSlot(nextSlot);
      });
    });

    // D. Bộ lọc phân loại Topping
    document.querySelectorAll('.top-cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.top-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentToppingCategory = pill.getAttribute('data-cat');
        renderToppingsList();
      });
    });

    // E. Nút đặt bàn với nồi lẩu tự phối này
    const btnBook = document.getElementById('btnBookCustomPot');
    if (btnBook) {
      btnBook.addEventListener('click', () => {
        const potConfig = potTypes[currentPotTypeId];
        const brothSummaryText = assignedBroths.slice(0, potConfig.slots).map((b, i) => `Ngăn ${i + 1}: ${b.name}`).join(' | ');

        // Danh sách topping & đồ uống đã chọn
        const addOns = [];
        let toppingTotal = 0;
        Object.keys(selectedToppings).forEach(id => {
          const qty = selectedToppings[id];
          if (qty > 0) {
            const item = toppingList.find(t => t.id === Number(id));
            if (item) {
              addOns.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: qty
              });
              toppingTotal += item.price * qty;
            }
          }
        });

        const grandTotal = potConfig.basePrice + toppingTotal;

        const customPotData = {
          productId: 999, // Mã đặc biệt nhận diện lẩu tự phối
          productName: `Nồi lẩu tự phối (${potConfig.shortName})`,
          servingSize: potConfig.desc,
          broth: brothSummaryText,
          price: potConfig.basePrice,
          addOns: addOns,
          totalPrice: grandTotal
        };

        try {
          sessionStorage.setItem('launuong_preselected_combo', JSON.stringify(customPotData));
        } catch (e) {}

        if (window.showToast) {
          window.showToast(`Đã lưu nồi lẩu tự phối của bạn! Đang chuyển đến trang đặt bàn...`, 'success', 'Thành công', 1200);
        }

        setTimeout(() => {
          window.location.href = 'pages/reservation.html';
        }, 600);
      });
    }

    // F. Nút phối lại từ đầu
    const btnReset = document.getElementById('btnResetCustomPot');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        currentPotTypeId = 2;
        activeSlotIndex = 0;
        assignedBroths = [brothList[0], brothList[1]];
        selectedToppings = {};
        currentToppingCategory = 'all';

        document.querySelectorAll('.pot-type-btn').forEach(b => b.classList.toggle('active', Number(b.getAttribute('data-type')) === 2));
        document.querySelectorAll('.top-cat-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-cat') === 'all'));

        switchControlTab('broth');
        renderToppingsList();
        renderPotCompartments();
        updateSummaryCalculation();

        if (window.showToast) {
          window.showToast('Đã đặt lại cấu hình nồi lẩu và món nhúng về mặc định.', 'info');
        }
      });
    }
  }

  // Khởi tạo lần đầu
  renderCustomizerLayout();
});
