-- =============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA) CHO CSDL LAUNUONGVN
-- =============================================================================

USE `launuongvn`;

-- 1. Nạp Tài khoản Quản trị viên (Mật khẩu mặc định: admin123)
-- Mã băm bcrypt của 'admin123' với 10 vòng salt
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `status`) VALUES
(1, 'Admin Quản Lý', 'admin@launuongvn.vn', '0911000888', '$2a$10$OJd7TJ.GVEqIMHKorUaJ5Ol2JMBEY4nQeOgSEqqZdb3GuJKoWP9u6', 'admin', 'active'),
(2, 'Hoàng Mai Anh', 'maianh.hoang@gmail.com', '0912345678', '$2a$10$OJd7TJ.GVEqIMHKorUaJ5Ol2JMBEY4nQeOgSEqqZdb3GuJKoWP9u6', 'customer', 'active'),
(3, 'Trần Quang Huy', 'quanghuy.tran@gmail.com', '0987654321', '$2a$10$OJd7TJ.GVEqIMHKorUaJ5Ol2JMBEY4nQeOgSEqqZdb3GuJKoWP9u6', 'customer', 'active')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- 2. Nạp Danh mục món ăn
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `sort_order`, `is_active`) VALUES
(1, 'Món Lẩu', 'lau', 'Nước lẩu gia truyền ninh hầm từ thảo mộc thiên nhiên', 1, TRUE),
(2, 'Đồ Nướng', 'nuong', 'Các món nướng tẩm ướp đậm đà sốt đặc chế', 2, TRUE),
(3, 'Thịt Bò Mỹ', 'thit-bo', 'Thịt bò nhập khẩu vân mỡ cẩm thạch mềm thơm', 3, TRUE),
(4, 'Hải Sản', 'hai-san', 'Tôm sú, mực nang, bạch tuộc tươi rói trong ngày', 4, TRUE),
(5, 'Rau & Nấm', 'rau-kem', 'Rau xanh organic VietGAP và nấm tươi dinh dưỡng', 5, TRUE),
(6, 'Combo Tiết Kiệm', 'combo', 'Các set đại tiệc sum vầy cho 2 đến 8 khách', 6, TRUE),
(7, 'Đồ Uống', 'do-uong', 'Trà hoa quả giải nhiệt, vang đỏ và bia thủ công', 7, TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Nạp Danh sách Chi nhánh
INSERT INTO `branches` (`id`, `name`, `address`, `phone`, `hours`, `city`, `image_url`, `is_active`) VALUES
(1, 'Chi Nhánh Kiến Hưng (Trụ Sở Chính)', 'Kiến Hưng, TP. Hải Phòng', '0345662169', '10:00 - 23:00', 'haiphong', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80', TRUE),
(2, 'Chi Nhánh Vincom Bà Triệu', 'Tầng 4, TTTM Vincom Center, 191 Bà Triệu, TP. Hà Nội', '024 3974 9999', '10:00 - 22:00', 'hanoi', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80', TRUE),
(3, 'Chi Nhánh Landmark 81', 'Tầng B1, Tòa tháp Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM', '028 7300 8888', '10:00 - 23:00', 'hcm', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80', TRUE),
(4, 'Chi Nhánh Nguyễn Thái Học', '88 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1, TP.HCM', '028 3920 6666', '10:00 - 23:00', 'hcm', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80', TRUE),
(5, 'Chi Nhánh Bạch Đằng', '45 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng', '0236 388 9999', '10:00 - 23:00', 'danang', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. Nạp Danh sách Món ăn thực đơn (30 món Việt Nam & Châu Á đặc sắc)
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `image_url`, `is_featured`, `is_available`) VALUES
-- --- Nhóm 1: Món Lẩu (Category ID: 1) ---
(1, 1, 'Lẩu Riêu Cua Bắp Bò Sườn Sụn', 'lau-rieu-cua-bap-bo-suon-sun', 'Nước lẩu riêu cua đồng thanh ngọt tự nhiên, giấm bỗng nếp thơm dịu, kèm bắp bò hoa và sườn sụn non giòn sần sật.', 399000, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(2, 1, 'Lẩu Nấm Chim Câu Bổ Dưỡng', 'lau-nam-chim-cau', 'Nước dùng hầm từ xương gà ta và thảo mộc hơn 8 giờ, kết hợp 6 loại nấm quý và chim bồ câu béo ngậy ngọt thanh.', 450000, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(3, 1, 'Lẩu Thái Tomyum Hải Sản Chua Cay', 'lau-thai-tomyum-hai-san', 'Vị cay nồng của ớt xiêm, chua thanh từ nước cốt chanh tươi hòa quyện cùng mùi sả, lá chanh và nước cốt dừa béo bùi.', 389000, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(4, 1, 'Lẩu Tứ Xuyên 2 Ngăn Cay Nồng Thảo Quả', 'lau-tu-xuyen-2-ngan', 'Nồi lẩu 2 ngăn âm dương với hoa tiêu Tứ Xuyên tê tê kích thích vị giác và nước hầm xương ống ngọt thanh.', 420000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(5, 1, 'Lẩu Ếch Đồng Măng Cay Giòn Rụm', 'lau-ech-dong-mang-cay', 'Thịt ếch đồng xào săn da giòn rụm với măng trúc muối ớt chua cay, thơm ngào ngạt mùi lá lốt tía tô Bắc Bộ.', 359000, 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(6, 1, 'Lẩu Bò Nhúng Dấm Thảo Mộc Gia Truyền', 'lau-bo-nhung-dam-thao-moc', 'Nước dấm gạo thanh chua dịu hầm cùng nước dừa xiêm bến tre, sả, hành tây, nhúng kèm bắp bò tươi và bánh tráng cuốn.', 379000, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),

-- --- Nhóm 2: Đồ Nướng (Category ID: 2) ---
(7, 2, 'Dẻ Sườn Bò Nướng Sốt Tiêu Đen Phú Quốc', 'de-suon-bo-nuong-sot-tieu-den', 'Dẻ sườn bò rút xương tẩm ướp tiêu chín Phú Quốc và sốt đặc chế, nướng xèo xèo trên than hoa thơm nức mũi.', 249000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(8, 2, 'Nầm Heo Nướng Chao Giòn Béo Sần Sật', 'nam-heo-nuong-chao-gion-beo', 'Nầm heo tươi giòn hoa sần sật, ướp chao đỏ bông gòn và ớt sa tế, nướng vàng xém chấm sốt me chanh tỏi ớt.', 189000, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(9, 2, 'Nọng Heo Nướng Hạt Dổi Mắc Khén Tây Bắc', 'nong-heo-nuong-hat-doi-mac-khen', 'Nọng heo vân mỡ cẩm thạch giòn sần sật không hề ngấy, tẩm ướp hạt dổi rừng và mắc khén thơm lừng núi rừng Tây Bắc.', 199000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(10, 2, 'Ba Chỉ Cuộn Nấm Kim Châm Nướng Sốt Mè', 'ba-chi-cuon-nam-kim-cham-nuong', 'Từng cuộn ba chỉ tươi ôm trọn nấm kim châm giòn ngọt, rưới sốt tương mè rang thơm lừng nướng chín vàng ươm.', 159000, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(11, 2, 'Dạ Dày Nướng Sa Tế Cay Nồng Bắt Miệng', 'da-day-nuong-sa-te-cay-nong', 'Dạ dày heo sơ chế sạch sẽ, khía vảy rồng thấm đẫm sa tế tỏi ớt, nướng giòn sần sật cực kỳ bắt miệng.', 179000, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),

-- --- Nhóm 3: Thịt Bò Mỹ (Category ID: 3) ---
(12, 3, 'Ba Chỉ Bò Mỹ Cắt Lát Cuộn Tròn', 'ba-chi-bo-my-cat-lat-cuon-tron', 'Ba chỉ bò Mỹ chọn lọc tỷ lệ nạc mỡ chuẩn 7:3, thái mỏng cuộn hoa văn đẹp mắt, nhúng lẩu mềm tan trong miệng.', 189000, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(13, 3, 'Bắp Bò Hoa Nhúng Lẩu Giòn Ngọt', 'bap-bo-hoa-nhung-lau-gion-ngot', 'Từng lát bắp bò vân hoa màu đỏ tươi xen gân trong veo, chỉ cần nhúng 15-20 giây là giữ trọn vị ngọt đậm đà.', 220000, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(14, 3, 'Gầu Bò Mỹ Tươi Giòn Thơm Béo', 'gau-bo-my-tuoi-gion-thom-beo', 'Gầu bò Mỹ có viền mỡ giòn sần sật không ngấy, khi nhúng vào nước lẩu sôi tỏa hương thơm ngậy đặc trưng.', 199000, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(15, 3, 'Lõi Nạc Vai Bò Ướp Sốt Mật Ong Sa Tế', 'loi-nac-vai-bo-uop-sot-sa-te', 'Lõi nạc vai bò có dải gân mảnh ở giữa, tẩm sốt mật ong sa tế nướng vừa chín tới ngọt mềm mọng nước.', 210000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),

-- --- Nhóm 4: Hải Sản (Category ID: 4) ---
(16, 4, 'Tôm Sú Biển Tươi Sống (Đĩa 300g)', 'tom-su-bien-tuoi-song-300g', 'Tôm sú tươi roi rói vỏ mỏng thịt chắc ngọt đậm vị biển, dùng để nhúng lẩu chua cay hoặc nướng muối ớt đều tuyệt đỉnh.', 219000, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(17, 4, 'Mực Trứng Phú Quốc Nướng Sa Tế Cay', 'muc-trung-phu-quoc-nuong-sa-te', 'Mực trứng Phú Quốc nguyên con ôm bụng trứng béo bùi, ướp sốt sa tế ớt hiểm nướng than hoa vàng rộm xèo xèo.', 199000, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(18, 4, 'Bạch Tuộc Baby Nướng Muối Ớt Xanh', 'bach-tuoc-baby-nuong-muoi-ot', 'Bạch tuộc baby tươi giòn rụm được khía hoa ướp muối ớt cay nồng, chấm sốt ớt xanh chua cay ngọt dịu.', 185000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(19, 4, 'Hàu Sữa Nướng Mỡ Hành Đậu Phộng', 'hau-sua-nuong-mo-hanh-dau-phong', 'Set 6 hàu sữa Vân Đồn tươi béo múp, nướng than hoa xèo xèo cùng mỡ hành tươi và đậu phộng rang giòn thơm phức.', 179000, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(20, 4, 'Ngao Hai Cùi Tươi Nhúng Lẩu Ngọt Nước', 'ngao-hai-cui-tuoi-nhung-lau', 'Ngao hai cùi mập mạp nhiều thịt, thả vào nồi lẩu bung vỏ tiết ra nước cốt ngọt thanh mát lành.', 139000, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),

-- --- Nhóm 5: Rau & Nấm (Category ID: 5) ---
(21, 5, 'Set Nấm Tươi Hảo Hạng (6 Loại Nấm)', 'set-nam-tuoi-hao-hang-6-loai', 'Gồm nấm đông cô tươi, nấm đùi gà baby, linh chi nâu, linh chi trắng, nấm kim châm và mộc nhĩ giòn.', 110000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(22, 5, 'Mẹt Rau Rừng & Rau Xanh VietGAP Nhúng Lẩu', 'met-rau-rung-rau-xanh-vietgap', 'Đầy đủ rau muống non chẻ ngọn, cải thảo ngọt, mồng tơi và cải cúc tần ô được sục rửa sạch sẽ đạt chuẩn organic.', 65000, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(23, 5, 'Đậu Phụ Mơ Chiên Lướt Ván & Váng Đậu Giòn', 'dau-phu-mo-chien-luot-van', 'Đậu phụ làng Mơ béo mềm núng nính chiên lướt ngoài vàng ruộm trong mềm mọng, kèm cuộn váng đậu chiên phồng giòn tan.', 55000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(24, 5, 'Ngô Ngọt & Khoai Môn Lệ Phố Bùi Ngậy', 'ngo-ngot-khoai-mon-le-pho', 'Ngô ngọt Đà Lạt luộc ngọt nước lẩu kết hợp khoai môn Lệ Phố dẻo bùi béo ngậy làm nước dùng thêm đậm đà sánh mịn.', 50000, 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),

-- --- Nhóm 6: Combo Tiết Kiệm (Category ID: 6) ---
(25, 6, 'Combo Hẹn Hò Ấm Áp (2 - 3 Người)', 'combo-hen-ho-am-ap-2-3-nguoi', 'Gồm 01 nồi lẩu 2 ngăn tự chọn vị, 01 đĩa ba chỉ bò Mỹ & bắp hoa (350g), 01 dẻ sườn nướng mật ong, đĩa rau nấm và 02 đồ uống.', 599000, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(26, 6, 'Combo Sum Vầy Đoàn Viên (4 - 6 Người)', 'combo-sum-vay-doan-vien-4-6-nguoi', '01 Lẩu 4 ngăn đại tiệc, thăn bò, mực trứng nướng sa tế, nầm nướng chao, đĩa rau nấm hảo hạng và 4 đồ uống trái cây.', 1199000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(27, 6, 'Combo Tiệc Tùng Thịnh Soạn (6 - 8 Người)', 'combo-tiec-tung-thinh-soan-6-8-nguoi', 'Đại tiệc toàn diện lẩu riêu cua bắp bò + bếp nướng xèo xèo, bạch tuộc, tôm sú, nọng heo hạt dổi, tráng miệng chè dưỡng nhan.', 1799000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),

-- --- Nhóm 7: Đồ Uống & Tráng Miệng (Category ID: 7) ---
(28, 7, 'Trà Đào Cam Sả Hạt Chia Mát Lạnh', 'tra-dao-cam-sa-hat-chia-mat-lanh', 'Vị trà lài ủ lạnh thơm thanh khiết kết hợp miếng đào giòn rụm, sả tươi và hạt chia giải nhiệt khi ăn lẩu nướng.', 49000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(29, 7, 'Trà Mận Hậu Sapa Đá Tuyết Chua Ngọt', 'tra-man-hau-sapa-da-tuyet', 'Mận hậu Sapa chín mọng ủ đường phèn thanh mát cùng trà ô long cao sơn, vị chua ngọt giải ngấy tuyệt đối.', 55000, 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(30, 7, 'Nước Mơ Chùa Hương Gừng Phèn Cổ Truyền', 'nuoc-mo-chua-huong-gung-phen', 'Mơ rừng Chùa Hương ngâm đường phèn gừng tươi theo công thức cổ truyền, vị chua thanh ngọt hậu giúp tiêu hóa êm ru.', 45000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', FALSE, TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price` = VALUES(`price`), `description` = VALUES(`description`), `image_url` = VALUES(`image_url`), `category_id` = VALUES(`category_id`);

-- 5. Nạp Đơn đặt bàn mẫu ban đầu
INSERT INTO `reservations` (`id`, `code`, `branch_id`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `reservation_date`, `reservation_time`, `guest_count`, `note`, `status`) VALUES
(101, 'LN-9421', 1, 2, 'Hoàng Mai Anh', '0912345678', 'maianh.hoang@gmail.com', '2026-11-15', '18:30:00', 4, 'Bàn cạnh cửa sổ thoáng, chuẩn bị ghế trẻ em', 'pending'),
(102, 'LN-8812', 3, 3, 'Trần Quang Huy', '0987654321', 'quanghuy.tran@gmail.com', '2026-11-15', '19:00:00', 8, 'Tiệc kỷ niệm thành lập công ty, cần phòng VIP', 'confirmed'),
(103, 'LN-7723', 5, NULL, 'Nguyễn Thùy Linh', '0903112233', 'thuylinh.nguyen@yahoo.com', '2026-11-16', '12:00:00', 2, 'Hẹn hò sinh nhật bạn gái', 'pending')
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);
