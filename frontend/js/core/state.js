/**
 * LẨU NƯỚNG VN - CENTRALIZED STATE MANAGEMENT
 * Quản lý trạng thái dữ liệu (Thực đơn, Chi nhánh, Đặt bàn, Khách hàng, Xác thực)
 * Hỗ trợ lưu trữ cục bộ (localStorage) và sẵn sàng đồng bộ REST API Backend.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'launuongvn_products_v1',
  CATEGORIES: 'launuongvn_categories_v1',
  BRANCHES: 'launuongvn_branches_v1',
  RESERVATIONS: 'launuongvn_reservations_v1',
  CUSTOMERS: 'launuongvn_customers_v1',
  AUTH: 'launuongvn_auth_user_v1',
  FAVORITES: 'launuongvn_favorites_v1'
};

// DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA CHUẨN)
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Món Lẩu', slug: 'lau', description: 'Nước lẩu gia truyền ninh hầm từ thảo mộc thiên nhiên', sortOrder: 1 },
  { id: 2, name: 'Đồ Nướng', slug: 'nuong', description: 'Các món nướng tẩm ướp đậm đà sốt đặc chế', sortOrder: 2 },
  { id: 3, name: 'Thịt Bò Mỹ', slug: 'thit-bo', description: 'Thịt bò nhập khẩu vân mỡ cẩm thạch mềm thơm', sortOrder: 3 },
  { id: 4, name: 'Hải Sản', slug: 'hai-san', description: 'Tôm sú, mực nang, bạch tuộc tươi rói trong ngày', sortOrder: 4 },
  { id: 5, name: 'Rau & Nấm', slug: 'rau-kem', description: 'Rau xanh organic VietGAP và nấm tươi dinh dưỡng', sortOrder: 5 },
  { id: 6, name: 'Combo Tiết Kiệm', slug: 'combo', description: 'Các set đại tiệc sum vầy cho 2 đến 8 khách', sortOrder: 6 },
  { id: 7, name: 'Đồ Uống', slug: 'do-uong', description: 'Trà hoa quả giải nhiệt, vang đỏ và bia thủ công', sortOrder: 7 }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Lẩu Riêu Cua Bắp Bò Sườn Sụn',
    category: 'lau',
    price: 399000,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Nước lẩu riêu cua đồng thanh ngọt tự nhiên, giấm bỗng nếp thơm dịu, kèm bắp bò hoa và sườn sụn non giòn sần sật.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 2,
    name: 'Dẻ Sườn Bò Sốt Tiêu Đen Phú Quốc',
    category: 'nuong',
    price: 249000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Dẻ sườn bò Mỹ chọn lọc với vân mỡ đan xen đều đặn, tẩm ướp cùng sốt tiêu đen nguyên hạt nướng xèo xèo thơm nức mũi.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 3,
    name: 'Lẩu Nấm Chim Câu Bổ Dưỡng',
    category: 'lau',
    price: 450000,
    imageUrl: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
    description: 'Nước dùng hầm từ xương gà ta và thảo mộc hơn 8 giờ, kết hợp 6 loại nấm quý và chim bồ câu béo ngậy ngọt thanh.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 4,
    name: 'Tôm Sú Nướng Sốt Bơ Tỏi Phô Mai',
    category: 'hai-san',
    price: 219000,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    description: 'Tôm sú tươi sống size lớn, rưới đẫm sốt bơ tỏi vàng óng phủ phô mai Mozzarella kéo sợi béo ngậy tan chảy.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 5,
    name: 'Lẩu Thái Chua Cay Hải Sản Đậm Đà',
    category: 'lau',
    price: 389000,
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    description: 'Vị cay nồng của ớt xiêm, chua thanh từ nước cốt chanh tươi hòa quyện cùng mùi sả, lá chanh và nước cốt dừa béo bùi.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 6,
    name: 'Lẩu Tứ Xuyên Cay Nồng Đặc Biệt',
    category: 'lau',
    price: 420000,
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
    description: 'Dành riêng cho tín đồ ăn cay với hoa tiêu Tứ Xuyên tê tê nơi đầu lưỡi và ớt khô cay nồng bốc khói nghi ngút.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 7,
    name: 'Ba Chỉ Bò Mỹ Nướng Sốt Galbi Hàn Quốc',
    category: 'thit-bo',
    price: 189000,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    description: 'Ba chỉ bò Mỹ thái mỏng cuộn nấm kim châm hoặc ướp sốt Galbi truyền thống ngọt dịu đậm đà.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 8,
    name: 'Thăn Ngoại Bò Black Angus Thượng Hạng',
    category: 'thit-bo',
    price: 320000,
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    description: 'Từng thớ thịt bò Angus nhập khẩu mềm tan như bơ khi nướng chín tới trên vỉ than hoa không khói.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 9,
    name: 'Lõi Nạc Vai Bò Nhúng Lẩu Tươi Ngon',
    category: 'thit-bo',
    price: 210000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Lõi vai bò có đường gân giòn nhẹ ở giữa, nhúng lẩu 15 giây vừa chín tái giữ trọn vị ngọt tự nhiên.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 10,
    name: 'Mực Nang Nướng Sốt Sa Tế Cay',
    category: 'hai-san',
    price: 199000,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Mực nang dày mình giòn sần sật, khía vảy rồng tẩm sốt sa tế ớt hiểm cay xé lưỡi kích thích vị giác.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 11,
    name: 'Hàu Sữa Nướng Phô Mai Béo Ngậy',
    category: 'hai-san',
    price: 179000,
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80',
    description: 'Set 6 hàu sữa Vân Đồn béo múp, nướng cùng sốt kem phô mai trứng béo ngậy thơm lừng.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 12,
    name: 'Nấm Tươi Tổng Hợp Nhúng Lẩu (6 loại)',
    category: 'rau-kem',
    price: 110000,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    description: 'Gồm nấm đông cô, nấm đùi gà, nấm linh chi trắng/nâu, nấm kim châm và nấm hương tươi thanh mát.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 13,
    name: 'Rau Xanh Hữu Cơ Nhúng Lẩu Tươi Mát',
    category: 'rau-kem',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Rau muống chẻ, cải thảo, rau tần ô (cải cúc) và mồng tơi tươi rói được rửa sạch bằng công nghệ sục Ozone.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 14,
    name: 'Combo Hẹn Hò Ấm Áp (2-3 Người)',
    category: 'combo',
    price: 599000,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Gồm 01 nồi lẩu 2 ngăn, 01 đĩa ba chỉ bò Mỹ & bắp hoa (350g), 01 dẻ sườn nướng, rau nấm và 02 đồ uống.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 15,
    name: 'Combo Sum Vầy Đoàn Viên (4-6 Người)',
    category: 'combo',
    price: 1199000,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: 'Lẩu 4 ngăn đại tiệc, thăn bò Black Angus, hải sản tổng hợp, dẻ sườn sốt tiêu, set rau nấm và tráng miệng.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 16,
    name: 'Trà Đào Cam Sả Hạt Chia Thanh Nhiệt',
    category: 'do-uong',
    price: 49000,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Vị trà lài ủ lạnh thơm thanh khiết kết hợp đào miếng giòn sần sật, sả tươi và hạt chia giải nhiệt khi ăn lẩu nướng.',
    isFeatured: false,
    isAvailable: true
  }
];

const INITIAL_BRANCHES = [
  {
    id: 1,
    name: 'Chi Nhánh Phố Huế (Trụ Sở Chính)',
    address: '123 Phố Huế, Quận Hai Bà Trưng, TP. Hà Nội',
    phone: '024 3822 8888',
    hours: '10:00 - 23:00',
    city: 'hanoi',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
    isActive: true
  },
  {
    id: 2,
    name: 'Chi Nhánh Vincom Bà Triệu',
    address: 'Tầng 4, TTTM Vincom Center, 191 Bà Triệu, TP. Hà Nội',
    phone: '024 3974 9999',
    hours: '10:00 - 22:00',
    city: 'hanoi',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80',
    isActive: true
  },
  {
    id: 3,
    name: 'Chi Nhánh Landmark 81',
    address: 'Tầng B1, Tòa tháp Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM',
    phone: '028 7300 8888',
    hours: '10:00 - 23:00',
    city: 'hcm',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
    isActive: true
  },
  {
    id: 4,
    name: 'Chi Nhánh Nguyễn Thái Học',
    address: '88 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1, TP.HCM',
    phone: '028 3920 6666',
    hours: '10:00 - 23:00',
    city: 'hcm',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80',
    isActive: true
  },
  {
    id: 5,
    name: 'Chi Nhánh Bạch Đằng',
    address: '45 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng',
    phone: '0236 388 9999',
    hours: '10:00 - 23:00',
    city: 'danang',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
    isActive: true
  }
];

const INITIAL_RESERVATIONS = [
  {
    id: 101,
    code: 'LN-9421',
    customerName: 'Hoàng Mai Anh',
    customerPhone: '0912345678',
    customerEmail: 'maianh.hoang@gmail.com',
    branchId: 1,
    branchName: 'Chi Nhánh Phố Huế',
    date: '2026-11-15',
    time: '18:30',
    guestCount: 4,
    note: 'Bàn cạnh cửa sổ thoáng, chuẩn bị ghế trẻ em',
    status: 'pending',
    createdAt: '2026-11-14 09:30'
  },
  {
    id: 102,
    code: 'LN-8812',
    customerName: 'Trần Quang Huy',
    customerPhone: '0987654321',
    customerEmail: 'quanghuy.tran@gmail.com',
    branchId: 3,
    branchName: 'Chi Nhánh Landmark 81',
    date: '2026-11-15',
    time: '19:00',
    guestCount: 8,
    note: 'Tiệc kỷ niệm thành lập công ty, cần phòng VIP',
    status: 'confirmed',
    createdAt: '2026-11-14 08:15'
  },
  {
    id: 103,
    code: 'LN-7723',
    customerName: 'Nguyễn Thùy Linh',
    customerPhone: '0903112233',
    customerEmail: 'thuylinh.nguyen@yahoo.com',
    branchId: 5,
    branchName: 'Chi Nhánh Bạch Đằng',
    date: '2026-11-16',
    time: '12:00',
    guestCount: 2,
    note: 'Hẹn hò sinh nhật bạn gái',
    status: 'pending',
    createdAt: '2026-11-14 10:05'
  }
];

const INITIAL_CUSTOMERS = [
  { id: 1, fullName: 'Quản Trị Viên (Admin)', email: 'admin@launuongvn.vn', phone: '0911000888', role: 'admin', bookingCount: 0, status: 'active' },
  { id: 2, fullName: 'Hoàng Mai Anh', email: 'maianh.hoang@gmail.com', phone: '0912345678', role: 'customer', bookingCount: 5, status: 'active' },
  { id: 3, fullName: 'Trần Quang Huy', email: 'quanghuy.tran@gmail.com', phone: '0987654321', role: 'customer', bookingCount: 3, status: 'active' },
  { id: 4, fullName: 'Nguyễn Thùy Linh', email: 'thuylinh.nguyen@yahoo.com', phone: '0903112233', role: 'customer', bookingCount: 1, status: 'active' }
];

// STATE MANAGER API OBJECT
const AppState = {
  // Products
  getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return [...INITIAL_PRODUCTS];
    }
    return JSON.parse(raw);
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === Number(id));
  },

  saveProduct(productData) {
    const products = this.getProducts();
    if (productData.id) {
      // Update existing
      const index = products.findIndex(p => p.id === Number(productData.id));
      if (index !== -1) {
        products[index] = { ...products[index], ...productData, id: Number(productData.id) };
      }
    } else {
      // Create new
      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        ...productData,
        id: newId,
        isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true
      };
      products.unshift(newProduct);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== Number(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  // Categories
  getCategories() {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return [...INITIAL_CATEGORIES];
    }
    return JSON.parse(raw);
  },

  saveCategory(categoryData) {
    const categories = this.getCategories();
    if (categoryData.id) {
      const idx = categories.findIndex(c => c.id === Number(categoryData.id));
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...categoryData, id: Number(categoryData.id) };
      }
    } else {
      const newId = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      categories.push({ ...categoryData, id: newId });
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  },

  deleteCategory(id) {
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== Number(id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  },

  // Branches
  getBranches() {
    const raw = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
      return [...INITIAL_BRANCHES];
    }
    return JSON.parse(raw);
  },

  getBranchById(id) {
    return this.getBranches().find(b => b.id === Number(id));
  },

  saveBranch(branchData) {
    const branches = this.getBranches();
    if (branchData.id) {
      const idx = branches.findIndex(b => b.id === Number(branchData.id));
      if (idx !== -1) {
        branches[idx] = { ...branches[idx], ...branchData, id: Number(branchData.id) };
      }
    } else {
      const newId = branches.length ? Math.max(...branches.map(b => b.id)) + 1 : 1;
      branches.push({ ...branchData, id: newId, isActive: true });
    }
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
    return true;
  },

  deleteBranch(id) {
    let branches = this.getBranches();
    branches = branches.filter(b => b.id !== Number(id));
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
    return true;
  },

  // Reservations
  getReservations() {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
      return [...INITIAL_RESERVATIONS];
    }
    return JSON.parse(raw);
  },

  saveReservation(resData) {
    const reservations = this.getReservations();
    const newId = reservations.length ? Math.max(...reservations.map(r => r.id)) + 1 : 101;
    const randomCode = 'LN-' + Math.floor(1000 + Math.random() * 9000);
    
    // Find branch name
    const branch = this.getBranchById(resData.branchId);
    const branchName = branch ? branch.name : 'Chi nhánh chính';

    const newReservation = {
      ...resData,
      id: newId,
      code: randomCode,
      branchName: branchName,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    reservations.unshift(newReservation);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    return newReservation;
  },

  updateReservationStatus(id, newStatus) {
    const reservations = this.getReservations();
    const target = reservations.find(r => r.id === Number(id));
    if (target) {
      target.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
      return true;
    }
    return false;
  },

  deleteReservation(id) {
    let reservations = this.getReservations();
    reservations = reservations.filter(r => r.id !== Number(id));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    return true;
  },

  // Customers
  getCustomers() {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return [...INITIAL_CUSTOMERS];
    }
    return JSON.parse(raw);
  },

  toggleCustomerStatus(id) {
    const customers = this.getCustomers();
    const target = customers.find(c => c.id === Number(id));
    if (target) {
      target.status = target.status === 'active' ? 'locked' : 'active';
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      return target.status;
    }
    return null;
  },

  // Favorites
  getFavorites() {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  },

  toggleFavorite(productId) {
    let favs = this.getFavorites();
    const id = Number(productId);
    const exists = favs.includes(id);
    if (exists) {
      favs = favs.filter(item => item !== id);
    } else {
      favs.push(id);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return !exists;
  },

  isFavorite(productId) {
    return this.getFavorites().includes(Number(productId));
  },

  // Auth User
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
};

// Đưa AppState vào phạm vi window để các module có thể gọi tự do
window.AppState = AppState;
