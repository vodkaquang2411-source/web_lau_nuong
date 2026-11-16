/**
 * LẨU NƯỚNG VN - HOTPOT CUSTOMIZER LOGIC
 * Tự phối nồi lẩu theo khẩu vị bàn tiệc
 * Chọn kiểu nồi (1 ngăn, 2 ngăn Uyên Ương hoặc 4 ngăn Tứ Quý),
 * nhấp vào từng ngăn nồi và gán vị nước lẩu yêu thích để tính giá tự động.
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
      dotColor: '#D84315',
      spice: 'Cay vừa',
      desc: 'Chua cay đậm đà, thơm béo cốt dừa & sả chanh',
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
      dotColor: '#C62828',
      spice: 'Cay tê nhiều',
      desc: 'Hoa tiêu Tứ Xuyên trứ danh và ớt khô cay nồng',
      extraPrice: 0
    },
    {
      id: 'rieucua',
      name: 'Lẩu riêu cua bắp bò sườn sụn',
      colorClass: 'broth-rieucua',
      dotColor: '#EF6C00',
      spice: 'Không cay',
      desc: 'Gạch cua đồng béo bùi kết hợp dấm bỗng nếp làng Vân',
      extraPrice: 0
    },
    {
      id: 'nhungdam',
      name: 'Lẩu bò nhúng dấm thảo mộc',
      colorClass: 'broth-nhungdam',
      dotColor: '#F57F17',
      spice: 'Không cay',
      desc: 'Chua thanh dịu nhẹ thơm hương sả tươi và quế hồi',
      extraPrice: 0
    },
    {
      id: 'echmang',
      name: 'Lẩu ếch đồng măng cay',
      colorClass: 'broth-echmang',
      dotColor: '#E65100',
      spice: 'Cay vừa',
      desc: 'Đậm đà chua cay cùng măng củ xào tỏi ớt giòn rụm',
      extraPrice: 0
    }
  ];

  // 3. Trạng thái hiện tại (State)
  let currentPotTypeId = 2; // Mặc định nồi 2 ngăn Uyên Ương
  let activeSlotIndex = 0; // Ngăn đang được chọn
  let assignedBroths = [brothList[0], brothList[1]]; // Mặc định gán Tomyum & Lẩu Nấm

  // 4. Render khung giao diện chính
  function renderCustomizerLayout() {
    container.innerHTML = `
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag">Tương tác JavaScript — Hotpot Customizer</span>
          <h2 class="section-title">Tự phối nồi lẩu theo <span>khẩu vị bàn tiệc</span></h2>
          <div class="gold-divider"><div class="gold-divider-icon"></div></div>
          <p class="section-desc">Chọn kiểu nồi (1 ngăn, 2 ngăn Uyên Ương hoặc 4 ngăn Tứ Quý), nhấp vào từng ngăn nồi và gán vị nước lẩu yêu thích để tính giá tự động.</p>
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
                  <!-- Sẽ được vẽ bằng hàm renderPotCompartments -->
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

          <!-- Right Column: Broth Selector & Live Calculator -->
          <div class="pot-controls-wrapper">
            
            <!-- Broth Choices Panel -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <h3 style="font-size: 1.1rem; color: var(--color-primary); margin: 0; font-weight: 700;">
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
                      <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                        <span style="font-size: 0.72rem; color: #991B1B; font-weight: 600;">${broth.spice}</span>
                        <span style="font-size: 0.72rem; color: #166534; font-weight: 600;">• Miễn phí</span>
                      </div>
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
              <div class="pot-summary-row">
                <span>Khẩu phần khuyến nghị:</span>
                <span id="summaryPotServing" style="color: var(--color-gray-600);">3 - 5 người dùng</span>
              </div>
              <div class="pot-summary-row" style="align-items: flex-start;">
                <span>Các vị lẩu đã gán:</span>
                <div id="summaryAssignedBroths" style="text-align: right; font-weight: 600; color: var(--color-brand); line-height: 1.4;">
                  Ngăn 1: Lẩu Thái Tomyum<br>Ngăn 2: Lẩu nấm chim câu
                </div>
              </div>
              <div class="pot-summary-row" style="font-size: 0.8rem; color: #15803D;">
                <span>Quà tặng kèm theo:</span>
                <strong>01 Khay rau nấm nhúng tươi ngon</strong>
              </div>

              <!-- Total price row -->
              <div class="pot-summary-row total-row">
                <div>
                  <div style="font-weight: 800; font-size: 1rem; color: var(--color-primary);">Tổng tiền nồi lẩu cốt:</div>
                  <div style="font-size: 0.78rem; color: var(--color-gray-500);">Đã bao gồm nước cốt và rau nấm</div>
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

  // 5. Vẽ cấu trúc các ngăn nồi lẩu tương tác
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
            <span class="compartment-num-tag">Ngăn đơn duy nhất</span>
            <div class="compartment-broth-title">${broth.name}</div>
            <div class="compartment-hint">${broth.desc}</div>
            <div class="compartment-spice-level">${broth.spice}</div>
          </div>
        </div>
      `;
    } else if (totalSlots === 2) {
      const b0 = assignedBroths[0] || brothList[0];
      const b1 = assignedBroths[1] || brothList[1];
      potContainer.innerHTML = `
        <div class="pot-layout-2">
          <div class="pot-compartment ${b0.colorClass} ${activeSlotIndex === 0 ? 'active-compartment' : ''}" data-slot="0">
            <span class="compartment-num-tag">Ngăn 1</span>
            <div class="compartment-broth-title">${b0.name}</div>
            <div class="compartment-hint">${b0.spice}</div>
          </div>
          <div class="divider-bar"></div>
          <div class="pot-compartment ${b1.colorClass} ${activeSlotIndex === 1 ? 'active-compartment' : ''}" data-slot="1">
            <span class="compartment-num-tag">Ngăn 2</span>
            <div class="compartment-broth-title">${b1.name}</div>
            <div class="compartment-hint">${b1.spice}</div>
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
            <span class="compartment-num-tag">Ngăn 1</span>
            <div class="compartment-broth-title" style="font-size: 0.8rem;">${b0.name}</div>
          </div>
          <div class="pot-compartment ${b1.colorClass} ${activeSlotIndex === 1 ? 'active-compartment' : ''}" data-slot="1">
            <span class="compartment-num-tag">Ngăn 2</span>
            <div class="compartment-broth-title" style="font-size: 0.8rem;">${b1.name}</div>
          </div>
          <div class="divider-h"></div>
          <div class="divider-v"></div>
          <div class="pot-compartment ${b2.colorClass} ${activeSlotIndex === 2 ? 'active-compartment' : ''}" data-slot="2">
            <span class="compartment-num-tag">Ngăn 3</span>
            <div class="compartment-broth-title" style="font-size: 0.8rem;">${b2.name}</div>
          </div>
          <div class="pot-compartment ${b3.colorClass} ${activeSlotIndex === 3 ? 'active-compartment' : ''}" data-slot="3">
            <span class="compartment-num-tag">Ngăn 4</span>
            <div class="compartment-broth-title" style="font-size: 0.8rem;">${b3.name}</div>
          </div>
        </div>
      `;
    }

    // Lắng nghe sự kiện click trực tiếp vào từng ngăn nồi
    potContainer.querySelectorAll('.pot-compartment').forEach(comp => {
      comp.addEventListener('click', () => {
        const slotIdx = Number(comp.getAttribute('data-slot'));
        setActiveSlot(slotIdx);
      });
    });

    updateActiveSlotIndicator();
  }

  // 6. Đặt ngăn đang chọn (Active Slot)
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

  // 7. Cập nhật bảng tính giá tự động
  function updateSummaryCalculation() {
    const potConfig = potTypes[currentPotTypeId];
    const typeNameEl = document.getElementById('summaryPotTypeName');
    const servingEl = document.getElementById('summaryPotServing');
    const assignedEl = document.getElementById('summaryAssignedBroths');
    const totalPriceEl = document.getElementById('customizerTotalPrice');

    if (typeNameEl) typeNameEl.textContent = potConfig.name;
    if (servingEl) servingEl.textContent = potConfig.desc;

    let totalPrice = potConfig.basePrice;

    if (assignedEl) {
      assignedEl.innerHTML = assignedBroths.slice(0, potConfig.slots).map((b, i) => {
        return `<div>Ngăn ${i + 1}: <strong style="color: var(--color-primary);">${b.name}</strong></div>`;
      }).join('');
    }

    if (totalPriceEl) {
      totalPriceEl.textContent = formatPrice(totalPrice);
    }
  }

  // 8. Gán các sự kiện tương tác
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

    // B. Chọn vị lẩu từ danh sách bên phải
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

    // C. Nút đặt bàn với nồi lẩu tự phối này
    const btnBook = document.getElementById('btnBookCustomPot');
    if (btnBook) {
      btnBook.addEventListener('click', () => {
        const potConfig = potTypes[currentPotTypeId];
        const brothSummaryText = assignedBroths.slice(0, potConfig.slots).map((b, i) => `Ngăn ${i + 1}: ${b.name}`).join(' | ');

        const customPotData = {
          productId: 999, // Mã đặc biệt nhận diện lẩu tự phối
          productName: `Nồi lẩu tự phối (${potConfig.shortName})`,
          servingSize: potConfig.desc,
          broth: brothSummaryText,
          price: potConfig.basePrice,
          addOns: []
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

    // D. Nút phối lại từ đầu
    const btnReset = document.getElementById('btnResetCustomPot');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        currentPotTypeId = 2;
        activeSlotIndex = 0;
        assignedBroths = [brothList[0], brothList[1]];
        document.querySelectorAll('.pot-type-btn').forEach(b => b.classList.toggle('active', Number(b.getAttribute('data-type')) === 2));
        renderPotCompartments();
        updateSummaryCalculation();
        if (window.showToast) {
          window.showToast('Đã đặt lại cấu hình nồi lẩu 2 ngăn Uyên Ương mặc định.', 'info');
        }
      });
    }
  }

  // Khởi tạo lần đầu
  renderCustomizerLayout();
});
