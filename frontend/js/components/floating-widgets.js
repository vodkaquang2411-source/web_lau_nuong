/**
 * LẨU NƯỚNG VN - FLOATING WIDGETS JAVASCRIPT
 * 1. Thanh icon mạng xã hội cố định bên trái (Facebook, Zalo, YouTube)
 * 2. Hộp thoại hỗ trợ trực tuyến thông minh cố định bên phải (Live Chat Box)
 * Sentence case: Toàn bộ nhãn, tiêu đề và tin nhắn chỉ viết hoa chữ cái đầu tiên
 * Không dùng icon AI hay emoji - Sử dụng SVG vector nét mảnh chuẩn
 * Thông tin chuẩn: Hotline 0345662169, Trụ sở Kiến Hưng - Hải Phòng, Email codeweb@gmail.com
 */

(function () {
  'use strict';

  // Lịch sử chat mặc định
  const DEFAULT_BOT_WELCOME = 'Kính chào quý khách! Nhà hàng Lẩu Nướng VN rất hân hạnh được phục vụ. Quý khách đang quan tâm đến đặt bàn, xem thực đơn hay nhận ưu đãi hôm nay ạ?';

  // Danh mục câu hỏi gợi ý nhanh
  const QUICK_QUESTIONS = [
    { label: 'Tư vấn đặt bàn tiệc', key: 'booking' },
    { label: 'Ưu đãi và combo hôm nay', key: 'promo' },
    { label: 'Địa chỉ và giờ mở cửa', key: 'branch' },
    { label: 'Món ngon bán chạy nhất', key: 'popular' },
    { label: 'Hotline gọi trực tiếp', key: 'hotline' }
  ];

  /* ==========================================================================
     1. KHỞI TẠO THANH MẠNG XÃ HỘI CỐ ĐỊNH BÊN TRÁI
     ========================================================================== */
  function renderSocialBar() {
    if (document.getElementById('floatingSocialBar')) return;

    const socialBar = document.createElement('aside');
    socialBar.id = 'floatingSocialBar';
    socialBar.className = 'floating-social-bar';
    socialBar.setAttribute('aria-label', 'Mạng xã hội nhà hàng');

    socialBar.innerHTML = `
      <!-- Nút Facebook -->
      <div class="social-item">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-btn social-btn-facebook" aria-label="Facebook nhà hàng">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.198h3.312h-.006z"/>
          </svg>
        </a>
        <span class="social-tooltip">Facebook nhà hàng</span>
      </div>

      <!-- Nút Zalo -->
      <div class="social-item">
        <a href="https://zalo.me/0345662169" target="_blank" rel="noopener noreferrer" class="social-btn social-btn-zalo" aria-label="Zalo tư vấn & đặt bàn">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 13.5px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1;">Zalo</span>
        </a>
        <span class="social-tooltip">Zalo tư vấn & đặt bàn</span>
      </div>

      <!-- Nút YouTube -->
      <div class="social-item">
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-btn social-btn-youtube" aria-label="Kênh YouTube ẩm thực">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <span class="social-tooltip">Kênh YouTube ẩm thực</span>
      </div>
    `;

    document.body.appendChild(socialBar);
  }

  /* ==========================================================================
     2. KHỞI TẠO HỘP THOẠI HỖ TRỢ TRỰC TUYẾN BÊN PHẢI (LIVE CHAT BOX)
     ========================================================================== */
  function renderChatBox() {
    if (document.getElementById('chatTriggerBtn')) return;

    // Nút mở hộp thoại chat
    const chatBtn = document.createElement('button');
    chatBtn.id = 'chatTriggerBtn';
    chatBtn.className = 'chat-trigger-btn';
    chatBtn.setAttribute('aria-label', 'Mở hộp thoại hỗ trợ trực tuyến');
    chatBtn.title = 'Hỗ trợ trực tuyến';

    chatBtn.innerHTML = `
      <div class="chat-trigger-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="chat-online-dot"></span>
      </div>
      <span class="chat-trigger-text">Hỗ trợ trực tuyến</span>
    `;

    // Cửa sổ chat
    const chatWindow = document.createElement('aside');
    chatWindow.id = 'chatWindow';
    chatWindow.className = 'chat-window';
    chatWindow.setAttribute('aria-label', 'Khung chat hỗ trợ trực tuyến');

    chatWindow.innerHTML = `
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-profile">
          <div class="chat-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2c1 3 2.5 4.5 4.5 5.5C18 8.5 19 10 19 12a7 7 0 1 1-14 0c0-2 1-3.5 2.5-4.5C9.5 6.5 11 5 12 2z"></path>
            </svg>
          </div>
          <div class="chat-header-info">
            <h4>Hỗ trợ khách hàng</h4>
            <p class="chat-header-status">Lẩu Nướng VN • Sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <button class="chat-close-btn" id="chatCloseBtn" aria-label="Đóng hộp thoại chat" title="Đóng chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="chat-body" id="chatBody">
        <!-- Tin nhắn sẽ được render động ở đây -->
      </div>

      <!-- Footer Input -->
      <div class="chat-footer">
        <form class="chat-form" id="chatForm">
          <input type="text" class="chat-input" id="chatInput" placeholder="Nhập tin nhắn của bạn..." autocomplete="off">
          <button type="submit" class="chat-send-btn" id="chatSendBtn" aria-label="Gửi tin nhắn" title="Gửi tin nhắn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(chatBtn);
    document.body.appendChild(chatWindow);

    bindChatEvents(chatBtn, chatWindow);
  }

  /* ==========================================================================
     3. XỬ LÝ SỰ KIỆN & PHẢN HỒI THÔNG MINH CỦA CHAT BOX
     ========================================================================== */
  function bindChatEvents(chatBtn, chatWindow) {
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatBody = document.getElementById('chatBody');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    let isOpen = false;

    // Toggle mở/đóng chat
    function toggleChat() {
      isOpen = !isOpen;
      chatWindow.classList.toggle('is-open', isOpen);
      if (isOpen) {
        setTimeout(() => chatInput.focus(), 300);
        scrollToBottom();
      }
    }

    chatBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', () => {
      isOpen = false;
      chatWindow.classList.remove('is-open');
    });

    // Lấy lịch sử chat từ sessionStorage
    function loadChatHistory() {
      let history = [];
      try {
        const stored = sessionStorage.getItem('launuong_chat_history');
        if (stored) {
          history = JSON.parse(stored);
        }
      } catch (err) {
        history = [];
      }

      if (!history.length) {
        // Khởi tạo tin nhắn chào mừng mặc định
        history = [
          {
            sender: 'bot',
            text: DEFAULT_BOT_WELCOME,
            time: getCurrentTime(),
            showChips: true
          }
        ];
        saveChatHistory(history);
      }

      renderMessages(history);
    }

    function saveChatHistory(history) {
      try {
        sessionStorage.setItem('launuong_chat_history', JSON.stringify(history));
      } catch (err) {
        // Bỏ qua nếu lỗi bộ nhớ
      }
    }

    function getCurrentTime() {
      const now = new Date();
      return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }

    function scrollToBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function renderMessages(history) {
      chatBody.innerHTML = '';
      history.forEach((msg, idx) => {
        const row = document.createElement('div');
        row.className = `chat-msg-row ${msg.sender}`;

        let chipsHtml = '';
        if (msg.showChips && idx === history.length - 1) {
          chipsHtml = `
            <div class="chat-quick-chips">
              ${QUICK_QUESTIONS.map(q => `
                <button type="button" class="chat-chip" data-key="${q.key}">${q.label}</button>
              `).join('')}
            </div>
          `;
        }

        row.innerHTML = `
          <div>
            <div class="chat-msg-bubble">${msg.text}</div>
            <div class="chat-msg-time">${msg.time}</div>
            ${chipsHtml}
          </div>
        `;

        chatBody.appendChild(row);
      });

      // Gắn sự kiện click cho các chip câu hỏi nhanh
      chatBody.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const key = chip.getAttribute('data-key');
          const label = chip.textContent;
          handleUserSend(label, key);
        });
      });

      scrollToBottom();
    }

    // Xử lý gửi tin nhắn của người dùng
    function handleUserSend(text, presetKey = null) {
      const cleanText = text.trim();
      if (!cleanText) return;

      let history = [];
      try {
        history = JSON.parse(sessionStorage.getItem('launuong_chat_history')) || [];
      } catch (e) {
        history = [];
      }

      // Thêm tin nhắn của user
      history.push({
        sender: 'user',
        text: cleanText,
        time: getCurrentTime()
      });

      // Tắt hiển thị chips của tin nhắn trước
      history.forEach(m => m.showChips = false);

      saveChatHistory(history);
      renderMessages(history);

      // Hiển thị hiệu ứng đang soạn tin nhắn (Typing indicator)
      showTypingIndicator();

      // Giả lập bot trả lời thông minh sau 650ms
      setTimeout(() => {
        removeTypingIndicator();
        const botReply = generateBotReply(cleanText, presetKey);

        history.push({
          sender: 'bot',
          text: botReply,
          time: getCurrentTime(),
          showChips: true
        });

        saveChatHistory(history);
        renderMessages(history);
      }, 650);
    }

    function showTypingIndicator() {
      removeTypingIndicator();
      const typingRow = document.createElement('div');
      typingRow.id = 'chatTypingRow';
      typingRow.className = 'chat-typing-row';
      typingRow.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;
      chatBody.appendChild(typingRow);
      scrollToBottom();
    }

    function removeTypingIndicator() {
      const row = document.getElementById('chatTypingRow');
      if (row) row.remove();
    }

    // Bộ sinh câu trả lời tự động thông minh
    function generateBotReply(userInput, presetKey) {
      const q = userInput.toLowerCase();

      if (presetKey === 'booking' || q.includes('đặt bàn') || q.includes('dat ban') || q.includes('giữ chỗ') || q.includes('bàn')) {
        return 'Quý khách có thể bấm vào mục "Đặt bàn" trên thanh điều hướng để chọn chi nhánh, ngày giờ và số khách nhanh chóng. Hoặc gọi ngay Hotline 0345662169 để được sắp xếp bàn tiệc đẹp nhất kèm ưu đãi giảm 10% ạ!';
      }

      if (presetKey === 'promo' || q.includes('ưu đãi') || q.includes('khuyến mãi') || q.includes('combo') || q.includes('giảm giá')) {
        return 'Nhà hàng đang áp dụng chương trình "Combo sum vầy" tiết kiệm tới 25% cho nhóm từ 4 khách, tặng kèm nước tráng miệng thanh mát và giảm thêm 10% khi quý khách hoàn tất đặt bàn trực tuyến qua website ạ!';
      }

      if (presetKey === 'branch' || q.includes('chi nhánh') || q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('mở cửa') || q.includes('giờ')) {
        return 'Nhà hàng Lẩu Nướng VN có trụ sở chính tại Kiến Hưng - Hải Phòng, cùng hệ thống 5 chi nhánh tại Hà Nội, Đà Nẵng và TP. Hồ Chí Minh. Giờ mở cửa đón khách liên tục từ 10:00 đến 23:00 tất cả các ngày trong tuần ạ.';
      }

      if (presetKey === 'popular' || q.includes('món') || q.includes('thực đơn') || q.includes('ngon') || q.includes('lẩu') || q.includes('nướng')) {
        return 'Các món trứ danh được thực khách yêu thích nhất tại nhà hàng gồm có: Lẩu riêu cua bắp bò sườn sụn, Lẩu nấm chim câu, Ba chỉ bò Mỹ nướng sốt tiêu đen, Dẻ sườn bò sốt chao đỏ và Mực trứng Phú Quốc nướng muối ớt. Quý khách có thể vào mục "Thực đơn" để khám phá chi tiết ạ!';
      }

      if (presetKey === 'hotline' || q.includes('hotline') || q.includes('số điện thoại') || q.includes('sđt') || q.includes('liên hệ') || q.includes('gọi')) {
        return 'Hotline tư vấn và tiếp nhận đặt bàn 24/7 của nhà hàng là 0345662169, email hỗ trợ: codeweb@gmail.com. Đội ngũ phục vụ luôn túc trực để hỗ trợ quý khách kịp thời nhất!';
      }

      return 'Cảm ơn quý khách đã gửi tin nhắn! Nhân viên hỗ trợ của Lẩu Nướng VN đã tiếp nhận thông tin và sẽ phản hồi quý khách trong giây lát. Quý khách cũng có thể gọi trực tiếp Hotline 0345662169 để được phục vụ ngay tức thì ạ.';
    }

    // Sự kiện submit form
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value;
      if (text.trim()) {
        chatInput.value = '';
        handleUserSend(text);
      }
    });

    // Khởi chạy nạp lịch sử
    loadChatHistory();
  }

  /* ==========================================================================
     4. KHỞI CHẠY TỔNG THỂ
     ========================================================================== */
  function initWidgets() {
    renderSocialBar();
    renderChatBox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }

})();
