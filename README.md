# DỰ ÁN WEBSITE NHÀ HÀNG LẨU NƯỚNG VN
> **Slogan:** *"Hương vị Việt – Trọn vị sum vầy"*  
> **Học phần:** Thiết kế và Phát triển Ứng dụng Web (Bài tập lớn)  
> **Phong cách thiết kế:** Sang trọng, hiện đại, ấm cúng (Lấy cảm hứng trải nghiệm từ Haidilao Việt Nam).

---

## 1. GIỚI THIỆU DỰ ÁN

Website **LẨU NƯỚNG VN** là hệ thống web giới thiệu ẩm thực và đặt bàn trực tuyến trọn gói (Full-stack) dành cho chuỗi nhà hàng lẩu nướng cao cấp mang đậm hương vị Việt Nam.

Hệ thống bao gồm 2 phân hệ riêng biệt:
1. **Phân hệ Khách hàng (Customer Portal):**
   - **Trang chủ (`index.html`):** Banner ấn tượng, câu chuyện thương hiệu, món ăn nổi bật, combo ưu đãi, không gian nhà hàng, đánh giá của thực khách và thông tin liên hệ.
   - **Thực đơn (`pages/menu.html`):** Phân loại danh mục (Lẩu, Nướng, Bò Mỹ, Hải sản, Rau nấm, Combo, Đồ uống), tìm kiếm món tức thời, lọc danh mục, sắp xếp giá, xem chi tiết modal và lưu món yêu thích.
   - **Đặt bàn trực tuyến (`pages/reservation.html`):** Biểu mẫu đặt chỗ đầy đủ thông tin, tự động kiểm tra tính hợp lệ, ngăn chặn chọn ngày trong quá khứ, xuất hóa đơn đặt bàn xác nhận.
   - **Hệ thống Chi nhánh (`pages/branches.html`):** Danh sách 5 chi nhánh tại Hà Nội, TP.HCM, Đà Nẵng, tích hợp bộ lọc theo thành phố và xem vị trí bản đồ Google Maps.
   - **Giới thiệu (`pages/about.html`):** Triết lý ẩm thực, 4 giá trị cốt lõi và đội ngũ bếp trưởng.
   - **Liên hệ (`pages/contact.html`):** Form gửi phản hồi góp ý, thông tin hotline và bản đồ trụ sở.
   - **Đăng nhập & Đăng ký (`pages/login.html`, `pages/register.html`):** Xác thực tài khoản với phân quyền Quản trị viên (Admin) và Khách hàng.

2. **Phân hệ Quản trị viên (Admin Dashboard Portal):**
   - **Dashboard tổng quan (`admin/index.html`):** Thống kê số lượng món ăn, danh mục, tổng lượt đặt bàn, đơn chờ duyệt và bảng xử lý đơn mới nhất.
   - **Quản lý Món ăn (`admin/products.html`):** Thao tác CRUD (Thêm, Xem, Sửa, Xóa, Tìm kiếm, Đổi trạng thái còn/hết món).
   - **Quản lý Danh mục (`admin/categories.html`):** CRUD các nhóm thực đơn.
   - **Quản lý Đặt bàn (`admin/reservations.html`):** CRUD, duyệt xác nhận lịch hẹn, chuyển trạng thái (Chờ xác nhận → Đã xác nhận → Đã hoàn thành → Hủy).
   - **Quản lý Chi nhánh (`admin/branches.html`):** Thêm, sửa thông tin, cập nhật giờ mở cửa.
   - **Quản lý Khách hàng (`admin/customers.html`):** Danh sách người dùng, thống kê lượt đặt bàn và khóa/mở khóa tài khoản.

---

## 2. CÔNG NGHỆ ÁP DỤNG

### Phía Frontend
- **HTML5:** Cấu trúc ngữ nghĩa chuẩn SEO (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- **CSS3:** Thiết kế theo Design System chuẩn, CSS Variables, Flexbox & CSS Grid, Responsive 100% trên Desktop, Tablet và Mobile.
- **JavaScript (ES6+):** Xử lý lọc, tìm kiếm, DOM Manipulation, Modal, Toast Notification và State Management đồng bộ.

### Phía Backend
- **Node.js & Express.js:** Xây dựng kiến trúc máy chủ RESTful API theo mô hình MVC (Model - Controller - Route).
- **Bảo mật:** Truy vấn có tham số (Prepared Statements) chống SQL Injection, mã hóa mật khẩu một chiều với `bcryptjs`, cấp quyền qua `jsonwebtoken` (JWT).

### Cơ sở dữ liệu (Database)
- **MySQL / MariaDB (XAMPP):** 7 bảng dữ liệu quan hệ có khóa chính, khóa ngoại (`users`, `categories`, `products`, `branches`, `reservations`, `reviews`, `contact_messages`).

---

## 3. CẤU TRÚC THƯ MỤC

```
nha hang lau nuong/
│
├── frontend/                     # Toàn bộ mã nguồn giao diện khách & admin
│   ├── index.html                # Trang chủ
│   ├── pages/
│   │   ├── menu.html             # Thực đơn món ăn
│   │   ├── reservation.html      # Đặt bàn trực tuyến
│   │   ├── branches.html         # Chi nhánh
│   │   ├── about.html            # Giới thiệu
│   │   ├── contact.html          # Liên hệ
│   │   ├── login.html            # Đăng nhập
│   │   └── register.html         # Đăng ký
│   ├── admin/
│   │   ├── index.html            # Dashboard tổng quan
│   │   ├── products.html         # Quản lý món ăn (CRUD)
│   │   ├── categories.html       # Quản lý danh mục (CRUD)
│   │   ├── reservations.html     # Quản lý đặt bàn (CRUD)
│   │   ├── branches.html         # Quản lý chi nhánh
│   │   └── customers.html        # Quản lý người dùng
│   ├── css/
│   │   ├── base.css              # Reset, Biến màu sắc, Typography
│   │   ├── layout.css            # Header, Navbar, Grid, Footer
│   │   ├── components.css        # Buttons, Cards, Modals, Toasts
│   │   ├── responsive.css        # Media queries di động/máy tính bảng
│   │   └── admin.css             # Giao diện riêng cho trang quản trị
│   └── js/
│       ├── core/                 # State management & API client
│       ├── components/           # Navbar, Modal, Toast
│       └── features/             # Logic theo chức năng (Menu, Booking, Auth, Admin)
│
├── backend/                      # Máy chủ RESTful API Express
│   ├── config/db.js              # Kết nối MySQL Pool
│   ├── controllers/              # Bộ xử lý nghiệp vụ
│   ├── models/                   # Truy vấn dữ liệu MySQL
│   ├── routes/                   # Các tuyến API endpoint
│   ├── middleware/               # Xác thực JWT & xử lý lỗi
│   ├── package.json              # Khai báo thư viện backend
│   ├── server.js                 # Điểm khởi chạy máy chủ
│   └── .env                      # Biến môi trường kết nối CSDL
│
├── database/
│   ├── schema.sql                # Script tạo cấu trúc 7 bảng CSDL
│   └── seed.sql                  # Dữ liệu mẫu ban đầu
│
├── .gitignore
└── README.md
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN TRÊN MÁY TÍNH

### Bước 1: Khởi động MySQL trong XAMPP
1. Mở phần mềm **XAMPP Control Panel** trên máy tính của bạn.
2. Tại dòng **MySQL**, bấm nút **Start**.

### Bước 2: Nạp CSDL mẫu (Chỉ cần làm lần đầu)
- Mở trình duyệt web truy cập vào: `http://localhost/phpmyadmin`
- Bấm vào tab **Import** (Nhập).
- Chọn file: `database/schema.sql`, bấm **Import**.
- Tiếp tục chọn file: `database/seed.sql`, bấm **Import**.
*(Hoặc có thể chạy qua terminal dòng lệnh MySQL nếu quen thuộc).*

### Bước 3: Cài đặt thư viện Backend
Mở Terminal trong Visual Studio Code, di chuyển vào thư mục `backend`:
```powershell
cd backend
npm install
```

### Bước 4: Khởi chạy Website & Máy chủ
Trong thư mục `backend`, chạy lệnh:
```powershell
npm start
```
Terminal sẽ hiển thị thông báo:
```
  🌐 Website người dùng:  http://localhost:5000
  🛠  Trang quản trị:     http://localhost:5000/admin/index.html
```
👉 Bạn chỉ cần mở trình duyệt và truy cập vào **`http://localhost:5000`** để trải nghiệm toàn bộ hệ thống!

---

## 5. TÀI KHOẢN TRẢI NGHIỆM ĐĂNG NHẬP

Để tiện lợi cho Giảng viên chấm điểm và người dùng thử nghiệm, hệ thống có sẵn các tài khoản mẫu (hoặc bấm trực tiếp nút **⚡ Trải nghiệm nhanh** trên trang Đăng nhập):

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@launuongvn.vn` | `admin123` | Toàn quyền CRUD Món ăn, Danh mục, Chi nhánh, Khách hàng, Duyệt đặt bàn |
| **Khách hàng thân thiết** | `maianh.hoang@gmail.com` | `123456` | Đặt bàn trực tuyến, xem lịch sử, lưu món yêu thích |
