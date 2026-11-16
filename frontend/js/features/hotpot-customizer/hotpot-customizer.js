/**
 * LẨU NƯỚNG VN - HOTPOT CUSTOMIZER LOGIC
 * Tự phối nồi lẩu theo khẩu vị bàn tiệc
 * - Chọn kiểu nồi (1 ngăn, 2 ngăn Uyên Ương hoặc 4 ngăn Tứ Quý)
 * - Nhấp vào từng ngăn nồi và gán vị nước lẩu yêu thích
 * - Chọn thêm các món topping đồ nhúng tươi ngon đi kèm
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
      colorClass: 'broth-tomyum',
      dotColor: '#E64A19',
      spice: 'Cay vừa',
      desc: 'Chua cay đậm đà, thơm béo cốt dừa & sả chanh tươi',
      extraPrice: 0
    },
    {
      id: 'nam',
      name: 'Lẩu nấm chim câu bổ dưỡng',
      colorClass: 'broth-nam',
      dotColor: '#8D6E63',
      spice: 'Không cay',
      desc: 'Ngọt thanh tự nhiên hầm từ thảo mộc & 6 loại nấm quý',
      extraPrice: 0
    },
    {
      id: 'tuxuyen',
      name: 'Lẩu Tứ Xuyên cay tê nồng nàn',
      colorClass: 'broth-tuxuyen',
      dotColor: '#D32F2F',
      spice: 'Cay tê nhiều',
      desc: 'Hoa tiêu Tứ Xuyên trứ danh và ớt khô cay nồng',
      extraPrice: 0
    },
    {
      id: 'rieucua',
      name: 'Lẩu riêu cua bắp bò sườn sụn',
      colorClass: 'broth-rieucua',
      dotColor: '#F57C00',
      spice: 'Không cay',
      desc: 'Gạch cua đồng béo bùi kết hợp dấm bỗng nếp làng Vân',
      extraPrice: 0
    },
    {
      id: 'nhungdam',
      name: 'Lẩu bò nhúng dấm thảo mộc',
      colorClass: 'broth-nhungdam',
      dotColor: '#FBC02D',
      spice: 'Không cay',
      desc: 'Chua thanh dịu nhẹ thơm hương sả tươi và quế hồi',
      extraPrice: 0
    },
    {
      id: 'echmang',
      name: 'Lẩu ếch đồng măng cay',
      colorClass: 'broth-echmang',
      dotColor: '#EF6C00',
      spice: 'Cay vừa',
      desc: 'Đậm đà chua cay cùng măng củ xào tỏi ớt giòn rụm',
      extraPrice: 0
    }
  ];

  // 3. Danh mục 8 món Topping đồ nhúng tươi ngon đi kèm
  const toppingList = [
    {
      id: 13,
      name: 'Ba chỉ bò Mỹ thái lát mỏng',
      price: 89000,
      unit: 'đĩa 200g',
      img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 14,
      name: 'Bắp bò hoa giòn sần sật',
      price: 99000,
      unit: 'đĩa 200g',
      img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 17,
      name: 'Tôm sú biển tươi sống',
      price: 119000,
      unit: 'đĩa 6 con',
      img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 18,
      name: 'Mực trứng Phú Quốc tươi rói',
      price: 129000,
      unit: 'đĩa 250g',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 24,
      name: 'Set viên thả lẩu phô mai',
      price: 59000,
      unit: 'đĩa 8 viên',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 21,
      name: 'Set nấm tươi 6 loại bổ dưỡng',
      price: 49000,
      unit: 'đĩa lớn',
      img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 23,
      name: 'Đậu phụ Mơ lướt ván',
      price: 29000,
      unit: 'đĩa 8 miếng',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 22,
      name: 'Rau xanh tổng hợp VietGAP',
      price: 35000,
      unit: 'rổ lớn',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80'
    }
  ];

  // 4. Trạng thái hiện tại (State)
  let currentPotTypeId = 2; // Mặc định nồi 2 ngăn Uyên Ương
  let activeSlotIndex = 0; // Ngăn đang được chọn
  let assignedBroths = [brothList[0], brothList[1]]; // Mặc định Tomyum & Lẩu nấm
  let selectedToppings = {}; // { 13: 1, 17: 2 ... }
  let currentControlTab = 'broth'; // 'broth' (chọn nước lẩu) hoặc 'topping' (chọn đồ nhúng)

  // 5. Render khung giao diện chính
  function renderCustomizerLayout() {
    container.innerHTML = `
      <div class="container">
        <!-- Section Header (Không chứa tag kỹ thuật) -->
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
          
          <!-- Left Column: Interactive Hotpot Visual Vessel -->
          <div class="pot-stage-wrapper">
            <div class="pot-handles-wrap">
              <div class="pot-handle-left"></div>
              
              <!-- Round Metallic Pot -->
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
              <span>Nhấp trực tiếp vào ngăn nồi ở trên để gán hoặc đổi vị lẩu</span>
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
                2. Chọn topping đồ nhúng
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
                    <div class="broth-color-dot" style="background-color: ${broth.dotColor};"></div>
                    <div>
                      <div class="broth-info-title">${broth.name}</div>
                      <div class="broth-info-desc">${broth.desc}</div>
                      <div style="display: flex; gap: 8px; align-items: center; margin-top: 3px;">
                        <span style="font-size: 0.72rem; color: #991B1B; font-weight: 600;">${broth.spice}</span>
                        <span style="font-size: 0.72rem; color: #166534; font-weight: 600;">• Miễn phí</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="text-align: right; margin-top: 12px;">
                <button type="button" id="btnNextToTopping" class="btn btn-secondary btn-sm" style="font-size: 0.85rem; padding: 6px 14px; font-weight: 700; color: var(--color-brand); border-color: var(--color-gold);">
                  Tiếp tục chọn topping đồ nhúng →
                </button>
              </div>
            </div>

            <!-- Panel 2: Topping Choices Grid -->
            <div id="toppingPanelContainer" style="${currentControlTab === 'topping' ? 'display: block;' : 'display: none;'}">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
                <h3 style="font-size: 1.05rem; color: var(--color-primary); margin: 0; font-weight: 700;">
                  Chọn topping đồ nhúng tươi ngon đi kèm:
                </h3>
                <span style="font-size: 0.78rem; color: var(--color-gray-500);">Tùy chọn theo sở thích</span>
              </div>

              <div class="topping-options-grid" id="toppingOptionsList">
                ${toppingList.map(top => `
                  <div class="topping-choice-card" data-topping-id="${top.id}">
                    <img src="${top.img}" alt="${top.name}" class="topping-thumb">
                    <div style="flex: 1; min-width: 0;">
                      <div class="topping-name">${top.name}</div>
                      <div class="topping-price">
                        ${formatPrice(top.price)} <span class="topping-unit">/${top.unit}</span>
                      </div>
                    </div>
                    <div class="topping-qty-control">
                      <button type="button" class="btn-top-qty btn-top-minus" data-id="${top.id}">-</button>
                      <span class="topping-qty-val" data-id="${top.id}">0</span>
                      <button type="button" class="btn-top-qty btn-top-plus" data-id="${top.id}">+</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Real-time Live Price Calculator Box -->
            <div class="pot-summary-box">
              <div class="pot-summary-row">
                <span>Kiểu nồi đã chọn:</span>
                <strong id="summaryPotTypeName" style="color: var(--color-primary);">Nồi 2 ngăn Uyên Ương</strong>
              </div>
              <div class="pot-summary-row" style="align-items: flex-start;">
                <span>Vị nước lẩu cốt:</span>
                <div id="summaryAssignedBroths" style="text-align: right; font-weight: 600; color: var(--color-brand); line-height: 1.4;">
                  Ngăn 1: Lẩu Thái Tomyum<br>Ngăn 2: Lẩu nấm chim câu
                </div>
              </div>
              <div class="pot-summary-row" id="summaryToppingRow" style="display: none; align-items: flex-start;">
                <span>Topping đồ nhúng thêm:</span>
                <div id="summarySelectedToppings" style="text-align: right; font-weight: 600; color: #166534; font-size: 0.84rem; line-height: 1.4;">
                  Chưa chọn topping
                </div>
              </div>
              <div class="pot-summary-row" style="font-size: 0.8rem; color: #15803D;">
                <span>Quà tặng kèm theo:</span>
                <strong>01 Khay rau nấm nhúng tươi ngon</strong>
              </div>

              <!-- Total price row -->
              <div class="pot-summary-row total-row">
                <div>
                  <div style="font-weight: 800; font-size: 0.98rem; color: var(--color-primary);">Tổng tiền nồi lẩu & đồ nhúng:</div>
                  <div style="font-size: 0.78rem; color: var(--color-gray-500);">Đã bao gồm nước cốt và topping đi kèm</div>
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
    renderPotCompartments();
    updateSummaryCalculation();
  }

  // 6. Vẽ cấu trúc các ngăn nồi lẩu tương tác
  function renderPotCompartments() {
    const potContainer = document.getElementById('potCompartmentsContainer');
    if (!potContainer) return;

    const potConfig = potTypes[currentPotTypeId];
    const totalSlots = potConfig.slots;

    if (totalSlots === 1) {
      const broth = assignedBroths[0] || brothList[0];
      potContainer.innerHTML = `
        <div class="pot-layout-1">
          <div class="pot-compartment ${broth.colorClass} active-compartment" data-slot="0">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn đơn</span>
              <div class="compartment-broth-title">${broth.name}</div>
              <div class="compartment-hint">${broth.spice} • ${broth.desc}</div>
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
              <div class="compartment-broth-title">${b0.name}</div>
              <div class="compartment-hint">${b0.spice}</div>
            </div>
          </div>
          <div class="divider-bar"></div>
          <div class="pot-compartment ${b1.colorClass} ${activeSlotIndex === 1 ? 'active-compartment' : ''}" data-slot="1">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 2</span>
              <div class="compartment-broth-title">${b1.name}</div>
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
              <div class="compartment-broth-title">${b0.name}</div>
            </div>
          </div>
          <div class="pot-compartment ${b1.colorClass} ${activeSlotIndex === 1 ? 'active-compartment' : ''}" data-slot="1">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 2</span>
              <div class="compartment-broth-title">${b1.name}</div>
            </div>
          </div>
          <div class="divider-h"></div>
          <div class="divider-v"></div>
          <div class="pot-compartment ${b2.colorClass} ${activeSlotIndex === 2 ? 'active-compartment' : ''}" data-slot="2">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 3</span>
              <div class="compartment-broth-title">${b2.name}</div>
            </div>
          </div>
          <div class="pot-compartment ${b3.colorClass} ${activeSlotIndex === 3 ? 'active-compartment' : ''}" data-slot="3">
            <div class="compartment-info-card">
              <span class="compartment-num-tag">Ngăn 4</span>
              <div class="compartment-broth-title">${b3.name}</div>
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
        // Tự động chuyển sang tab chọn vị lẩu nếu đang ở tab topping
        switchControlTab('broth');
      });
    });

    updateActiveSlotIndicator();
  }

  // 7. Đặt ngăn đang chọn (Active Slot)
  function setActiveSlot(slotIndex) {
    activeSlotIndex = slotIndex;
    const potContainer = document.getElementById('potCompartmentsContainer');
    if (potContainer) {
      potContainer.querySelectorAll('.pot-compartment').forEach(comp => {
        const idx = Number(comp.getAttribute('data-slot'));
        comp.classList.toggle('active-compartment', idx === activeSlotIndex);
      });
    }
    updateActiveSlotIndicator();
    highlightSelectedBrothCard();
  }

  function updateActiveSlotIndicator() {
    const indicator = document.getElementById('activeSlotIndicator');
    if (indicator) {
      indicator.textContent = `Đang gán cho: Ngăn ${activeSlotIndex + 1}`;
    }
  }

  function highlightSelectedBrothCard() {
    const currentBroth = assignedBroths[activeSlotIndex];
    document.querySelectorAll('.broth-choice-card').forEach(card => {
      const brothId = card.getAttribute('data-broth-id');
      const isSelected = currentBroth && currentBroth.id === brothId;
      card.classList.toggle('selected-for-active', isSelected);
    });
  }

  // 8. Chuyển đổi giữa 2 tab: 1. Nước lẩu cốt | 2. Topping đồ nhúng
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

  // 9. Cập nhật bảng tính giá tự động
  function updateSummaryCalculation() {
    const potConfig = potTypes[currentPotTypeId];
    const typeNameEl = document.getElementById('summaryPotTypeName');
    const assignedEl = document.getElementById('summaryAssignedBroths');
    const totalPriceEl = document.getElementById('customizerTotalPrice');
    const summaryToppingRow = document.getElementById('summaryToppingRow');
    const summaryToppingsEl = document.getElementById('summarySelectedToppings');
    const badgeCountEl = document.getElementById('toppingBadgeCount');

    if (typeNameEl) typeNameEl.textContent = potConfig.name;

    if (assignedEl) {
      assignedEl.innerHTML = assignedBroths.slice(0, potConfig.slots).map((b, i) => {
        return `<div>Ngăn ${i + 1}: <strong style="color: var(--color-primary);">${b.name}</strong></div>`;
      }).join('');
    }

    // Tính tổng tiền topping
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
          selectedToppingEntries.push(`${item.name} x${qty}`);
        }
      }
    });

    if (summaryToppingRow && summaryToppingsEl) {
      if (selectedToppingEntries.length > 0) {
        summaryToppingRow.style.display = 'flex';
        summaryToppingsEl.innerHTML = selectedToppingEntries.join('<br>') + ` (${formatPrice(toppingTotal)})`;
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

  // 10. Gán các sự kiện tương tác
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

        // Vẽ lại ngăn nồi
        renderPotCompartments();
        updateSummaryCalculation();

        if (window.showToast) {
          window.showToast(`Đã gán "${selectedBroth.name}" vào Ngăn ${activeSlotIndex + 1}!`, 'success');
        }

        // Tự động chuyển tiêu điểm sang ngăn tiếp theo để khách chọn tiếp thuận tiện
        const totalSlots = potTypes[currentPotTypeId].slots;
        const nextSlot = (activeSlotIndex + 1) % totalSlots;
        setActiveSlot(nextSlot);
      });
    });

    // D. Tăng giảm số lượng Topping đồ nhúng
    document.querySelectorAll('.btn-top-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        selectedToppings[id] = (selectedToppings[id] || 0) + 1;
        
        const card = btn.closest('.topping-choice-card');
        const qtyEl = card.querySelector('.topping-qty-val');
        if (qtyEl) qtyEl.textContent = selectedToppings[id];
        if (card) card.classList.add('has-quantity');

        updateSummaryCalculation();
      });
    });

    document.querySelectorAll('.btn-top-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        if (selectedToppings[id] && selectedToppings[id] > 0) {
          selectedToppings[id] -= 1;
          const card = btn.closest('.topping-choice-card');
          const qtyEl = card.querySelector('.topping-qty-val');
          if (qtyEl) qtyEl.textContent = selectedToppings[id];
          
          if (selectedToppings[id] === 0) {
            delete selectedToppings[id];
            if (card) card.classList.remove('has-quantity');
          }
          updateSummaryCalculation();
        }
      });
    });

    // E. Nút đặt bàn với nồi lẩu tự phối này
    const btnBook = document.getElementById('btnBookCustomPot');
    if (btnBook) {
      btnBook.addEventListener('click', () => {
        const potConfig = potTypes[currentPotTypeId];
        const brothSummaryText = assignedBroths.slice(0, potConfig.slots).map((b, i) => `Ngăn ${i + 1}: ${b.name}`).join(' | ');

        // Danh sách topping đã chọn
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

        document.querySelectorAll('.pot-type-btn').forEach(b => b.classList.toggle('active', Number(b.getAttribute('data-type')) === 2));
        document.querySelectorAll('.topping-qty-val').forEach(el => el.textContent = '0');
        document.querySelectorAll('.topping-choice-card').forEach(card => card.classList.remove('has-quantity'));

        switchControlTab('broth');
        renderPotCompartments();
        updateSummaryCalculation();

        if (window.showToast) {
          window.showToast('Đã đặt lại cấu hình nồi lẩu và đồ nhúng về mặc định.', 'info');
        }
      });
    }
  }

  // Khởi tạo lần đầu
  renderCustomizerLayout();
});
