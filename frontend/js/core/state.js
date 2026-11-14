/**
 * LẨU NƯỚNG VN - CENTRALIZED STATE MANAGEMENT
 * Quản lý trạng thái dữ liệu (Thực đơn, Chi nhánh, Đặt bàn, Khách hàng, Xác thực)
 * Hỗ trợ lưu trữ cục bộ (localStorage) và sẵn sàng đồng bộ REST API Backend.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'launuongvn_products_v2',
  CATEGORIES: 'launuongvn_categories_v1',
  BRANCHES: 'launuongvn_branches_v1',
  RESERVATIONS: 'launuongvn_reservations_v1',
  CUSTOMERS: 'launuongvn_customers_v1',
  AUTH: 'launuongvn_auth_user_v1',
  FAVORITES: 'launuongvn_favorites_v1'
};

// DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA CHUẨN 30 MÓN VIỆT NAM & CHÂU Á)
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
  // --- 1. MÓN LẨU (Category: lau) ---
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
    name: 'Lẩu Nấm Chim Câu Bổ Dưỡng',
    category: 'lau',
    price: 450000,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    description: 'Nước dùng hầm từ xương gà ta và thảo mộc hơn 8 giờ, kết hợp 6 loại nấm quý và chim bồ câu béo ngậy ngọt thanh.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 3,
    name: 'Lẩu Thái Tomyum Hải Sản Chua Cay',
    category: 'lau',
    price: 389000,
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    description: 'Vị cay nồng của ớt xiêm, chua thanh từ nước cốt chanh tươi hòa quyện cùng mùi sả, lá chanh và nước cốt dừa béo bùi.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 4,
    name: 'Lẩu Tứ Xuyên 2 Ngăn Cay Nồng Thảo Quả',
    category: 'lau',
    price: 420000,
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
    description: 'Nồi lẩu 2 ngăn âm dương với hoa tiêu Tứ Xuyên tê tê kích thích vị giác và nước hầm xương ống ngọt thanh.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 5,
    name: 'Lẩu Ếch Đồng Măng Cay Giòn Rụm',
    category: 'lau',
    price: 359000,
    imageUrl: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
    description: 'Thịt ếch đồng xào săn da giòn rụm với măng trúc muối ớt chua cay, thơm ngào ngạt mùi lá lốt tía tô Bắc Bộ.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 6,
    name: 'Lẩu Bò Nhúng Dấm Thảo Mộc Gia Truyền',
    category: 'lau',
    price: 379000,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    description: 'Nước dấm gạo thanh chua dịu hầm cùng nước dừa xiêm bến tre, sả, hành tây, nhúng kèm bắp bò tươi và bánh tráng cuốn.',
    isFeatured: false,
    isAvailable: true
  },

  // --- 2. ĐỒ NƯỚNG (Category: nuong) ---
  {
    id: 7,
    name: 'Dẻ Sườn Bò Nướng Sốt Tiêu Đen Phú Quốc',
    category: 'nuong',
    price: 249000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Dẻ sườn bò rút xương tẩm ướp tiêu chín Phú Quốc và sốt đặc chế, nướng xèo xèo trên than hoa thơm nức mũi.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 8,
    name: 'Nầm Heo Nướng Chao Giòn Béo Sần Sật',
    category: 'nuong',
    price: 189000,
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
    description: 'Nầm heo tươi giòn hoa sần sật, ướp chao đỏ bông gòn và ớt sa tế, nướng vàng xém chấm sốt me chanh tỏi ớt.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 9,
    name: 'Nọng Heo Nướng Hạt Dổi Mắc Khén Tây Bắc',
    category: 'nuong',
    price: 199000,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    description: 'Nọng heo vân mỡ cẩm thạch giòn sần sật không hề ngấy, tẩm ướp hạt dổi rừng và mắc khén thơm lừng núi rừng Tây Bắc.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 10,
    name: 'Ba Chỉ Cuộn Nấm Kim Châm Nướng Sốt Mè',
    category: 'nuong',
    price: 159000,
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    description: 'Từng cuộn ba chỉ tươi ôm trọn nấm kim châm giòn ngọt, rưới sốt tương mè rang thơm lừng nướng chín vàng ươm.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 11,
    name: 'Dạ Dày Nướng Sa Tế Cay Nồng Bắt Miệng',
    category: 'nuong',
    price: 179000,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Dạ dày heo sơ chế sạch sẽ, khía vảy rồng thấm đẫm sa tế tỏi ớt, nướng giòn sần sật cực kỳ bắt miệng.',
    isFeatured: false,
    isAvailable: true
  },

  // --- 3. THỊT BÒ MỸ (Category: thit-bo) ---
  {
    id: 12,
    name: 'Ba Chỉ Bò Mỹ Cắt Lát Cuộn Tròn',
    category: 'thit-bo',
    price: 189000,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    description: 'Ba chỉ bò Mỹ chọn lọc tỷ lệ nạc mỡ chuẩn 7:3, thái mỏng cuộn hoa văn đẹp mắt, nhúng lẩu mềm tan trong miệng.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 13,
    name: 'Bắp Bò Hoa Nhúng Lẩu Giòn Ngọt',
    category: 'thit-bo',
    price: 220000,
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    description: 'Từng lát bắp bò vân hoa màu đỏ tươi xen gân trong veo, chỉ cần nhúng 15-20 giây là giữ trọn vị ngọt đậm đà.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 14,
    name: 'Gầu Bò Mỹ Tươi Giòn Thơm Béo',
    category: 'thit-bo',
    price: 199000,
    imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80',
    description: 'Gầu bò Mỹ có viền mỡ giòn sần sật không ngấy, khi nhúng vào nước lẩu sôi tỏa hương thơm ngậy đặc trưng.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 15,
    name: 'Lõi Nạc Vai Bò Ướp Sốt Mật Ong Sa Tế',
    category: 'thit-bo',
    price: 210000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Lõi nạc vai bò có dải gân mảnh ở giữa, tẩm sốt mật ong sa tế nướng vừa chín tới ngọt mềm mọng nước.',
    isFeatured: false,
    isAvailable: true
  },

  // --- 4. HẢI SẢN (Category: hai-san) ---
  {
    id: 16,
    name: 'Tôm Sú Biển Tươi Sống (Đĩa 300g)',
    category: 'hai-san',
    price: 219000,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    description: 'Tôm sú tươi roi rói vỏ mỏng thịt chắc ngọt đậm vị biển, dùng để nhúng lẩu chua cay hoặc nướng muối ớt đều tuyệt đỉnh.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 17,
    name: 'Mực Trứng Phú Quốc Nướng Sa Tế Cay',
    category: 'hai-san',
    price: 199000,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Mực trứng Phú Quốc nguyên con ôm bụng trứng béo bùi, ướp sốt sa tế ớt hiểm nướng than hoa vàng rộm xèo xèo.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 18,
    name: 'Bạch Tuộc Baby Nướng Muối Ớt Xanh',
    category: 'hai-san',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Bạch tuộc baby tươi giòn rụm được khía hoa ướp muối ớt cay nồng, chấm sốt ớt xanh chua cay ngọt dịu.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 19,
    name: 'Hàu Sữa Nướng Mỡ Hành Đậu Phộng',
    category: 'hai-san',
    price: 179000,
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80',
    description: 'Set 6 hàu sữa Vân Đồn tươi béo múp, nướng than hoa xèo xèo cùng mỡ hành tươi và đậu phộng rang giòn thơm phức.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 20,
    name: 'Ngao Hai Cùi Tươi Nhúng Lẩu Ngọt Nước',
    category: 'hai-san',
    price: 139000,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    description: 'Ngao hai cùi mập mạp nhiều thịt, thả vào nồi lẩu bung vỏ tiết ra nước cốt ngọt thanh mát lành.',
    isFeatured: false,
    isAvailable: true
  },

  // --- 5. RAU & NẤM (Category: rau-kem) ---
  {
    id: 21,
    name: 'Set Nấm Tươi Hảo Hạng (6 Loại Nấm)',
    category: 'rau-kem',
    price: 110000,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    description: 'Gồm nấm đông cô tươi, nấm đùi gà baby, linh chi nâu, linh chi trắng, nấm kim châm và mộc nhĩ giòn.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 22,
    name: 'Mẹt Rau Rừng & Rau Xanh VietGAP Nhúng Lẩu',
    category: 'rau-kem',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Đầy đủ rau muống non chẻ ngọn, cải thảo ngọt, mồng tơi và cải cúc tần ô được sục rửa sạch sẽ đạt chuẩn organic.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 23,
    name: 'Đậu Phụ Mơ Chiên Lướt Ván & Váng Đậu Giòn',
    category: 'rau-kem',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Đậu phụ làng Mơ béo mềm núng nính chiên lướt ngoài vàng ruộm trong mềm mọng, kèm cuộn váng đậu chiên phồng giòn tan.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 24,
    name: 'Ngô Ngọt & Khoai Môn Lệ Phố Bùi Ngậy',
    category: 'rau-kem',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80',
    description: 'Ngô ngọt Đà Lạt luộc ngọt nước lẩu kết hợp khoai môn Lệ Phố dẻo bùi béo ngậy làm nước dùng thêm đậm đà sánh mịn.',
    isFeatured: false,
    isAvailable: true
  },

  // --- 6. COMBO TIẾT KIỆM (Category: combo) ---
  {
    id: 25,
    name: 'Combo Hẹn Hò Ấm Áp (2 - 3 Người)',
    category: 'combo',
    price: 599000,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Gồm 01 nồi lẩu 2 ngăn tự chọn vị, 01 đĩa ba chỉ bò Mỹ & bắp hoa (350g), 01 dẻ sườn nướng mật ong, đĩa rau nấm và 02 đồ uống.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 26,
    name: 'Combo Sum Vầy Đoàn Viên (4 - 6 Người)',
    category: 'combo',
    price: 1199000,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: '01 Lẩu 4 ngăn đại tiệc, thăn bò, mực trứng nướng sa tế, nầm nướng chao, đĩa rau nấm hảo hạng và 4 đồ uống trái cây.',
    isFeatured: true,
    isAvailable: true
  },
  {
    id: 27,
    name: 'Combo Tiệc Tùng Thịnh Soạn (6 - 8 Người)',
    category: 'combo',
    price: 1799000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Đại tiệc toàn diện lẩu riêu cua bắp bò + bếp nướng xèo xèo, bạch tuộc, tôm sú, nọng heo hạt dổi, tráng miệng chè dưỡng nhan.',
    isFeatured: true,
    isAvailable: true
  },

  // --- 7. ĐỒ UỐNG & TRÁNG MIỆNG (Category: do-uong) ---
  {
    id: 28,
    name: 'Trà Đào Cam Sả Hạt Chia Mát Lạnh',
    category: 'do-uong',
    price: 49000,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Vị trà lài ủ lạnh thơm thanh khiết kết hợp miếng đào giòn rụm, sả tươi và hạt chia giải nhiệt khi ăn lẩu nướng.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 29,
    name: 'Trà Mận Hậu Sapa Đá Tuyết Chua Ngọt',
    category: 'do-uong',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    description: 'Mận hậu Sapa chín mọng ủ đường phèn thanh mát cùng trà ô long cao sơn, vị chua ngọt giải ngấy tuyệt đối.',
    isFeatured: false,
    isAvailable: true
  },
  {
    id: 30,
    name: 'Nước Mơ Chùa Hương Gừng Phèn Cổ Truyền',
    category: 'do-uong',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Mơ rừng Chùa Hương ngâm đường phèn gừng tươi theo công thức cổ truyền, vị chua thanh ngọt hậu giúp tiêu hóa êm ru.',
    isFeatured: false,
    isAvailable: true
  }
];

const INITIAL_BRANCHES = [
  {
    id: 1,
    name: 'Chi Nhánh Kiến Hưng (Trụ Sở Chính)',
    address: 'Kiến Hưng, TP. Hải Phòng',
    phone: '0345662169',
    hours: '10:00 - 23:00',
    city: 'haiphong',
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
    branchName: 'Chi Nhánh Kiến Hưng',
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

  updateReservation(id, updatedData) {
    const reservations = this.getReservations();
    const idx = reservations.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      if (reservations[idx].status !== 'pending') {
        return { success: false, message: 'Đơn đặt bàn này đã được quản trị viên xử lý, không thể chỉnh sửa.' };
      }

      let branchName = reservations[idx].branchName;
      if (updatedData.branchId) {
        const branch = this.getBranchById(updatedData.branchId);
        if (branch) branchName = branch.name;
      }

      reservations[idx] = {
        ...reservations[idx],
        ...updatedData,
        id: Number(id),
        branchName: branchName,
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };

      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
      return { success: true, reservation: reservations[idx] };
    }
    return { success: false, message: 'Không tìm thấy đơn đặt bàn.' };
  },

  addDishToReservation(reservationId, productId, quantity = 1) {
    const reservations = this.getReservations();
    const resIdx = reservations.findIndex(r => r.id === Number(reservationId));
    if (resIdx === -1) {
      return { success: false, message: 'Không tìm thấy đơn đặt bàn.' };
    }

    if (reservations[resIdx].status !== 'pending') {
      return { success: false, message: 'Đơn đặt bàn này đã được quản trị viên xử lý, không thể thêm món.' };
    }

    const product = this.getProductById(productId);
    if (!product) {
      return { success: false, message: 'Món ăn không tồn tại trong thực đơn.' };
    }

    if (!Array.isArray(reservations[resIdx].orderedDishes)) {
      reservations[resIdx].orderedDishes = [];
    }

    const dishIdx = reservations[resIdx].orderedDishes.findIndex(d => Number(d.id) === Number(productId));
    if (dishIdx !== -1) {
      reservations[resIdx].orderedDishes[dishIdx].quantity += Number(quantity);
    } else {
      reservations[resIdx].orderedDishes.push({
        id: Number(product.id),
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: Number(quantity)
      });
    }

    // Tính tổng tiền các món đặt trước
    reservations[resIdx].totalDishPrice = reservations[resIdx].orderedDishes.reduce(
      (sum, d) => sum + (d.price * d.quantity), 0
    );

    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    return { success: true, reservation: reservations[resIdx], product };
  },

  updateReservationDishQuantity(reservationId, productId, quantity) {
    const reservations = this.getReservations();
    const resIdx = reservations.findIndex(r => r.id === Number(reservationId));
    if (resIdx === -1) return { success: false, message: 'Không tìm thấy đơn đặt bàn.' };

    if (reservations[resIdx].status !== 'pending') {
      return { success: false, message: 'Đơn đặt bàn này đã được quản trị viên xử lý.' };
    }

    if (!Array.isArray(reservations[resIdx].orderedDishes)) {
      reservations[resIdx].orderedDishes = [];
      return { success: false, message: 'Không có món để cập nhật.' };
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      // Xóa món nếu số lượng <= 0
      reservations[resIdx].orderedDishes = reservations[resIdx].orderedDishes.filter(d => Number(d.id) !== Number(productId));
    } else {
      const dish = reservations[resIdx].orderedDishes.find(d => Number(d.id) === Number(productId));
      if (dish) dish.quantity = qty;
    }

    reservations[resIdx].totalDishPrice = reservations[resIdx].orderedDishes.reduce(
      (sum, d) => sum + (d.price * d.quantity), 0
    );

    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    return { success: true, reservation: reservations[resIdx] };
  },

  removeDishFromReservation(reservationId, productId) {
    return this.updateReservationDishQuantity(reservationId, productId, 0);
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

  getUserFavoriteProducts() {
    const favIds = this.getFavorites();
    const products = this.getProducts();
    return products.filter(p => favIds.includes(Number(p.id)));
  },

  // Auth User & User Profile
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getUserReservations(user) {
    if (!user) user = this.getCurrentUser();
    if (!user) return [];

    const reservations = this.getReservations();
    const userEmail = (user.email || '').toLowerCase().trim();
    const userPhone = (user.phone || '').replace(/\s+/g, '');
    const userName = (user.fullName || '').toLowerCase().trim();
    const userId = user.id ? Number(user.id) : null;

    return reservations.filter(r => {
      if (userId && r.userId && Number(r.userId) === userId) return true;
      if (userEmail) {
        if (r.customerEmail && r.customerEmail.toLowerCase().trim() === userEmail) return true;
        if (r.email && r.email.toLowerCase().trim() === userEmail) return true;
      }
      if (userPhone) {
        if (r.customerPhone && r.customerPhone.replace(/\s+/g, '') === userPhone) return true;
        if (r.phone && r.phone.replace(/\s+/g, '') === userPhone) return true;
      }
      if (userName && (r.customerName || r.fullName)) {
        const resName = (r.customerName || r.fullName || '').toLowerCase().trim();
        if (resName && resName === userName) return true;
      }
      return false;
    });
  },

  updateUserProfile({ fullName, phone }) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Bạn chưa đăng nhập.' };

    const updatedUser = {
      ...user,
      fullName: fullName.trim() || user.fullName,
      phone: phone.trim() || user.phone
    };
    this.setCurrentUser(updatedUser);

    // Đồng bộ vào danh sách khách hàng (customers)
    const customers = this.getCustomers();
    const customerIdx = customers.findIndex(c => 
      (user.id && c.id === user.id) || 
      (user.email && c.email && c.email.toLowerCase() === user.email.toLowerCase())
    );

    if (customerIdx !== -1) {
      customers[customerIdx] = {
        ...customers[customerIdx],
        fullName: updatedUser.fullName,
        phone: updatedUser.phone
      };
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    }

    return { success: true, user: updatedUser };
  }
};

// Đưa AppState vào phạm vi window để các module có thể gọi tự do
window.AppState = AppState;
