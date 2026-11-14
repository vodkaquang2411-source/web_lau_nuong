-- =============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA) CHO CSDL LAUNUONGVN
-- =============================================================================

USE `launuongvn`;

-- 1. Nạp Tài khoản Quản trị viên (Mật khẩu mặc định: admin123)
-- Mã băm bcrypt của 'admin123' với 10 vòng salt
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `status`) VALUES
(1, 'Admin Quản Lý', 'admin@launuongvn.vn', '0911000888', '$2b$10$tJ96lqD9O1qYmU.6z1YwUu77X2qGgC5I90h8F4p0C4K9lQ8tP6C3a', 'admin', 'active'),
(2, 'Hoàng Mai Anh', 'maianh.hoang@gmail.com', '0912345678', '$2b$10$tJ96lqD9O1qYmU.6z1YwUu77X2qGgC5I90h8F4p0C4K9lQ8tP6C3a', 'customer', 'active'),
(3, 'Trần Quang Huy', 'quanghuy.tran@gmail.com', '0987654321', '$2b$10$tJ96lqD9O1qYmU.6z1YwUu77X2qGgC5I90h8F4p0C4K9lQ8tP6C3a', 'customer', 'active')
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
(1, 'Chi Nhánh Phố Huế (Trụ Sở Chính)', '123 Phố Huế, Quận Hai Bà Trưng, TP. Hà Nội', '024 3822 8888', '10:00 - 23:00', 'hanoi', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80', TRUE),
(2, 'Chi Nhánh Vincom Bà Triệu', 'Tầng 4, TTTM Vincom Center, 191 Bà Triệu, TP. Hà Nội', '024 3974 9999', '10:00 - 22:00', 'hanoi', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80', TRUE),
(3, 'Chi Nhánh Landmark 81', 'Tầng B1, Tòa tháp Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM', '028 7300 8888', '10:00 - 23:00', 'hcm', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80', TRUE),
(4, 'Chi Nhánh Nguyễn Thái Học', '88 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1, TP.HCM', '028 3920 6666', '10:00 - 23:00', 'hcm', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80', TRUE),
(5, 'Chi Nhánh Bạch Đằng', '45 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng', '0236 388 9999', '10:00 - 23:00', 'danang', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. Nạp Danh sách Món ăn thực đơn
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `image_url`, `is_featured`, `is_available`) VALUES
(1, 1, 'Lẩu Riêu Cua Bắp Bò Sườn Sụn', 'lau-rieu-cua-bap-bo-suon-sun', 'Nước lẩu riêu cua đồng thanh ngọt tự nhiên, giấm bỗng nếp thơm dịu, kèm bắp bò hoa và sườn sụn non giòn sần sật.', 399000, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(2, 2, 'Dẻ Sườn Bò Sốt Tiêu Đen Phú Quốc', 'de-suon-bo-sot-tieu-den', 'Dẻ sườn bò Mỹ chọn lọc với vân mỡ đan xen đều đặn, tẩm ướp cùng sốt tiêu đen nguyên hạt nướng xèo xèo thơm nức mũi.', 249000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(3, 1, 'Lẩu Nấm Chim Câu Bổ Dưỡng', 'lau-nam-chim-cau', 'Nước dùng hầm từ xương gà ta và thảo mộc hơn 8 giờ, kết hợp 6 loại nấm quý và chim bồ câu béo ngậy ngọt thanh.', 450000, 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(4, 4, 'Tôm Sú Nướng Sốt Bơ Tỏi Phô Mai', 'tom-su-nuong-bo-toi-pho-mai', 'Tôm sú tươi sống size lớn, rưới đẫm sốt bơ tỏi vàng óng phủ phô mai Mozzarella kéo sợi béo ngậy tan chảy.', 219000, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(5, 1, 'Lẩu Thái Chua Cay Hải Sản Đậm Đà', 'lau-thai-chua-cay-hai-san', 'Vị cay nồng của ớt xiêm, chua thanh từ nước cốt chanh tươi hòa quyện cùng mùi sả, lá chanh và nước cốt dừa béo bùi.', 389000, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(6, 1, 'Lẩu Tứ Xuyên Cay Nồng Đặc Biệt', 'lau-tu-xuyen-cay-nong', 'Dành riêng cho tín đồ ăn cay với hoa tiêu Tứ Xuyên tê tê nơi đầu lưỡi và ớt khô cay nồng bốc khói nghi ngút.', 420000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(7, 3, 'Ba Chỉ Bò Mỹ Nướng Sốt Galbi Hàn Quốc', 'ba-chi-bo-my-nuong-sot-galbi', 'Ba chỉ bò Mỹ thái mỏng cuộn nấm kim châm hoặc ướp sốt Galbi truyền thống ngọt dịu đậm đà.', 189000, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(8, 3, 'Thăn Ngoại Bò Black Angus Thượng Hạng', 'than-ngoai-bo-black-angus', 'Từng thớ thịt bò Angus nhập khẩu mềm tan như bơ khi nướng chín tới trên vỉ than hoa không khói.', 320000, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(9, 3, 'Lõi Nạc Vai Bò Nhúng Lẩu Tươi Ngon', 'loi-nac-vai-bo-nhung-lau', 'Lõi vai bò có đường gân giòn nhẹ ở giữa, nhúng lẩu 15 giây vừa chín tái giữ trọn vị ngọt tự nhiên.', 210000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(10, 4, 'Mực Nang Nướng Sốt Sa Tế Cay', 'muc-nang-nuong-sa-te', 'Mực nang dày mình giòn sần sật, khía vảy rồng tẩm sốt sa tế ớt hiểm cay xé lưỡi kích thích vị giác.', 199000, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(11, 4, 'Hàu Sữa Nướng Phô Mai Béo Ngậy', 'hau-sua-nuong-pho-mai', 'Set 6 hàu sữa Vân Đồn béo múp, nướng cùng sốt kem phô mai trứng béo ngậy thơm lừng.', 179000, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(12, 5, 'Nấm Tươi Tổng Hợp Nhúng Lẩu (6 loại)', 'nam-tuoi-tong-hop', 'Gồm nấm đông cô, nấm đùi gà, nấm linh chi trắng/nâu, nấm kim châm và nấm hương tươi thanh mát.', 110000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(13, 5, 'Rau Xanh Hữu Cơ Nhúng Lẩu Tươi Mát', 'rau-xanh-huu-co', 'Rau muống chẻ, cải thảo, rau tần ô và mồng tơi tươi rói được rửa sạch bằng công nghệ sục Ozone.', 65000, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', FALSE, TRUE),
(14, 6, 'Combo Hẹn Hò Ấm Áp (2-3 Người)', 'combo-hen-ho-am-ap', 'Gồm 01 nồi lẩu 2 ngăn, 01 đĩa ba chỉ bò Mỹ & bắp hoa (350g), 01 dẻ sườn nướng, rau nấm và 02 đồ uống.', 599000, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(15, 6, 'Combo Sum Vầy Đoàn Viên (4-6 Người)', 'combo-sum-vay-doan-vien', 'Lẩu 4 ngăn đại tiệc, thăn bò Black Angus, hải sản tổng hợp, dẻ sườn sốt tiêu, set rau nấm và tráng miệng.', 1199000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(16, 7, 'Trà Đào Cam Sả Hạt Chia Thanh Nhiệt', 'tra-dao-cam-sa-hat-chia', 'Vị trà lài ủ lạnh thơm thanh khiết kết hợp đào miếng giòn sần sật, sả tươi và hạt chia giải nhiệt.', 49000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', FALSE, TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 5. Nạp Đơn đặt bàn mẫu ban đầu
INSERT INTO `reservations` (`id`, `code`, `branch_id`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `reservation_date`, `reservation_time`, `guest_count`, `note`, `status`) VALUES
(101, 'LN-9421', 1, 2, 'Hoàng Mai Anh', '0912345678', 'maianh.hoang@gmail.com', '2026-11-15', '18:30:00', 4, 'Bàn cạnh cửa sổ thoáng, chuẩn bị ghế trẻ em', 'pending'),
(102, 'LN-8812', 3, 3, 'Trần Quang Huy', '0987654321', 'quanghuy.tran@gmail.com', '2026-11-15', '19:00:00', 8, 'Tiệc kỷ niệm thành lập công ty, cần phòng VIP', 'confirmed'),
(103, 'LN-7723', 5, NULL, 'Nguyễn Thùy Linh', '0903112233', 'thuylinh.nguyen@yahoo.com', '2026-11-16', '12:00:00', 2, 'Hẹn hò sinh nhật bạn gái', 'pending')
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);
