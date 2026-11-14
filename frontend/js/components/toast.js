/**
 * LẨU NƯỚNG VN - TOAST NOTIFICATION COMPONENT
 * Hiển thị thông báo Toast pop-up hiện đại, mượt mà và trực quan
 */

(function () {
  const ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const DEFAULT_TITLES = {
    success: 'Thành công',
    error: 'Đã xảy ra lỗi',
    warning: 'Cảnh báo',
    info: 'Thông báo'
  };

  function getToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function (message, type = 'success', title = '', duration = 4000) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconChar = ICONS[type] || 'ℹ';
    const displayTitle = title || DEFAULT_TITLES[type] || 'Thông báo';

    toast.innerHTML = `
      <div class="toast-icon">${iconChar}</div>
      <div class="toast-body">
        <div class="toast-title">${displayTitle}</div>
        <div class="toast-message">${message}</div>
      </div>
      <div class="toast-close" title="Đóng">&times;</div>
    `;

    // Close button click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      dismissToast(toast);
    });

    container.appendChild(toast);

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    function dismissToast(element) {
      clearTimeout(timer);
      element.style.opacity = '0';
      element.style.transform = 'translateX(60px)';
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    }
  };
})();
