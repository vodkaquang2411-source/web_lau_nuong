/**
 * LẨU NƯỚNG VN - AUTH FEATURE LOGIC
 * Xử lý Đăng nhập, Đăng ký, Phân quyền Admin / Customer và Phím tắt Demo cho Giảng viên/Chấm điểm
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const btnDemoAdmin = document.getElementById('btnDemoAdmin');
  const btnDemoCustomer = document.getElementById('btnDemoCustomer');
  const btnForgotPassword = document.getElementById('btnForgotPassword');

  // 1. Phím tắt Đăng nhập nhanh Demo (Dành cho việc chấm điểm bài tập lớn)
  if (btnDemoAdmin) {
    btnDemoAdmin.addEventListener('click', () => {
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      if (emailInput) emailInput.value = 'admin@launuongvn.vn';
      if (passInput) passInput.value = 'admin123';
      if (window.showToast) {
        window.showToast('Đã điền tài khoản Quản trị viên (Admin). Nhấn Đăng Nhập để vào trang quản trị!', 'info', 'Demo Admin');
      }
    });
  }

  if (btnDemoCustomer) {
    btnDemoCustomer.addEventListener('click', () => {
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      if (emailInput) emailInput.value = 'maianh.hoang@gmail.com';
      if (passInput) passInput.value = '123456';
      if (window.showToast) {
        window.showToast('Đã điền tài khoản Khách hàng thân thiết. Nhấn Đăng Nhập để tiếp tục!', 'info', 'Demo Khách');
      }
    });
  }

  // 2. Xử lý Form Đăng Nhập
  if (loginForm && window.AppState) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      let isValid = true;
      if (!email) {
        document.getElementById('errorLoginEmail').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorLoginEmail').style.display = 'none';
      }

      if (!password || password.length < 6) {
        document.getElementById('errorLoginPassword').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorLoginPassword').style.display = 'none';
      }

      if (!isValid) return;

      // Phân quyền: Kiểm tra nếu là Admin
      if (email.toLowerCase().includes('admin') || password === 'admin123') {
        const adminUser = {
          id: 1,
          fullName: 'Admin Quản Lý',
          email: email,
          role: 'admin',
          token: 'mock-jwt-token-admin'
        };
        window.AppState.setCurrentUser(adminUser);

        if (window.showToast) {
          window.showToast('Đăng nhập thành công với quyền Quản trị viên! Đang chuyển hướng đến Dashboard...', 'success', 'Chào mừng Admin');
        }

        setTimeout(() => {
          window.location.href = '../admin/index.html';
        }, 1000);
      } else {
        // Khách hàng thông thường
        const customerUser = {
          id: 2,
          fullName: email.split('@')[0] || 'Khách Hàng',
          email: email,
          role: 'customer',
          token: 'mock-jwt-token-customer'
        };
        window.AppState.setCurrentUser(customerUser);

        if (window.showToast) {
          window.showToast(`Chào mừng bạn quay trở lại với Lẩu Nướng VN!`, 'success', 'Đăng nhập thành công');
        }

        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1000);
      }
    });
  }

  // 3. Xử lý Form Đăng Ký
  if (registerForm && window.AppState) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('regFullName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pass = document.getElementById('regPassword').value;
      const confirmPass = document.getElementById('regConfirmPassword').value;
      const agree = document.getElementById('agreeTerms').checked;

      let isValid = true;
      if (!name || name.length < 3) {
        document.getElementById('errorRegName').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorRegName').style.display = 'none';
      }

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
        document.getElementById('errorRegPhone').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorRegPhone').style.display = 'none';
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('errorRegEmail').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorRegEmail').style.display = 'none';
      }

      if (!pass || pass.length < 6) {
        document.getElementById('errorRegPassword').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorRegPassword').style.display = 'none';
      }

      if (pass !== confirmPass) {
        document.getElementById('errorRegConfirm').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('errorRegConfirm').style.display = 'none';
      }

      if (!agree) {
        if (window.showToast) window.showToast('Vui lòng đồng ý với điều khoản dịch vụ của nhà hàng.', 'warning');
        return;
      }

      if (!isValid) return;

      // Đăng ký thành công và tự động đăng nhập
      const newUser = {
        id: Date.now(),
        fullName: name,
        email: email,
        phone: phone,
        role: 'customer',
        token: 'mock-jwt-customer-' + Date.now()
      };

      window.AppState.setCurrentUser(newUser);

      if (window.showToast) {
        window.showToast('Đăng ký tài khoản hội viên thành công! Tặng bạn voucher giảm 100k cho lần đặt bàn đầu tiên.', 'success', 'Chúc mừng');
      }

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1200);
    });
  }

  // 4. Quên mật khẩu
  if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showToast) {
        window.showToast('Hệ thống đã gửi liên kết đặt lại mật khẩu đến email của bạn.', 'info', 'Khôi phục mật khẩu');
      }
    });
  }
});
