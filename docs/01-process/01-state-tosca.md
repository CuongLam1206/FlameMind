# 01 · STATE — Xác định vấn đề bằng TOSCA

> Bước STATE của quy trình 4S: define, not interpret. Không định trước giải pháp ở bước này; giải pháp sống trong [03-solve-roadmap.md](03-solve-roadmap.md).

## TOSCA

| Thành tố | Nội dung |
|---|---|
| **Trouble** (vấn đề đau) | Cháy nhà ở Việt Nam phát hiện quá muộn và cảnh báo không được tin. Thảm họa chung cư mini Khương Hạ 2023 làm 56 người chết; hơn 1.500 vụ cháy trong 6 tháng đầu 2026; đầu báo đơn cảm biến báo chậm ở giai đoạn khói âm ỉ và báo giả khi nấu ăn, thắp nhang khiến người dân vô hiệu hóa thiết bị. Hệ AI hiện có dừng ở "nhìn thấy lửa" chứ không "hiểu ngữ cảnh" và không biết hướng dẫn con người phải làm gì. |
| **Owner** (chủ sở hữu vấn đề) | Nghiên cứu sinh chính của đề tài NCKH 12 tháng, người chịu trách nhiệm khoa học và sản phẩm; hội đồng NCKH là bên nghiệm thu; đối tác pilot (ban quản lý tòa nhà) là đồng sở hữu bài toán triển khai. |
| **Success** (tiêu chí thành công đo được) | (1) Verdict accuracy ≥85% trên held-out MmodalFire và mAP@0.5 ≥85% trên MS-FSDB test; (2) FAR quy đổi ≤1 lần/camera/ngày trên tập nhiễu khó; (3) phán quyết ≤5 giây trên Jetson Orin Nano; (4) ít nhất 1 bài báo quốc tế nộp trong 12 tháng; (5) web app pilot 50 người dùng thật và load-test 1.000 người dùng đồng thời; (6) mã nguồn và dataset mở phát hành. |
| **Constraints** (ràng buộc) | 12 tháng, 1 người; GPU thuê ≤400 USD; phần cứng ≤15 triệu VND; không robot; thiết bị biên hạng Raspberry Pi 5 / Jetson Orin Nano; định vị pháp lý là tầng bổ trợ cho hệ kiểm định TCVN 5738; dữ liệu người dùng phải consent và ẩn danh; song ngữ Việt-Anh cho sản phẩm và công bố. |
| **Actors** (bên liên quan) | Cư dân (nhận cảnh báo và hướng dẫn), ban quản lý tòa nhà (vận hành dashboard), trung tâm giám sát và lực lượng 114 (escalation), người duyệt ethics và hội đồng NCKH, reviewer hội nghị quốc tế, cộng đồng nghiên cứu dùng dataset mở, người bảo trì hệ thống sau đề tài. |

## Phát biểu vấn đề một câu (problem statement chốt)

Người ở trong tòa nhà đang cháy tại Việt Nam chết vì hai khoảng trống nối tiếp nhau: hệ thống phát hiện quá chậm và quá nhiều báo giả để được tin, và khi sự cố thật xảy ra thì không ai nhận được hướng dẫn thoát nạn đúng ngữ cảnh; chưa có hệ thống nào dùng một model ngôn ngữ nhỏ chuyên biệt, chạy được trên thiết bị biên giá rẻ, vừa phán quyết ngữ cảnh cháy từ dữ liệu đa phương thức vừa sinh hướng dẫn hành động, được đánh giá bằng benchmark quốc tế.

## Kiểm tra chất lượng phát biểu (theo nguyên tắc define, not interpret)

- Có số đo: sáu tiêu chí Success ở trên, tất cả có script đo tương ứng trong repo.
- Không cài sẵn giải pháp: câu phát biểu không nêu tên model, framework hay kiến trúc.
- Có chủ thể đau và người sở hữu: cư dân và nghiên cứu sinh, không phải "ngành PCCC" chung chung.
- Có ranh giới: ràng buộc liệt kê rõ những gì không phải bài toán này (robot, cháy rừng, thương mại hóa).
