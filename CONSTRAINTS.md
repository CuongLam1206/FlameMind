# CONSTRAINTS.md — Ràng buộc và cổng kiểm soát chống lệch hướng

> Tài liệu quan trọng nhất của dự án. Mọi quyết định đổi phạm vi, thêm tính năng, đổi model nền đều phải đối chiếu tài liệu này và ghi ADR trong [docs/02-architecture/architecture.md](docs/02-architecture/architecture.md). Nếu một ý tưởng không vượt qua được các ràng buộc dưới đây, nó bị từ chối bất kể hấp dẫn đến đâu.

## 1. Ngôi sao phương Bắc (North Star)

Một câu duy nhất: **SLM chuyên biệt chạy trên thiết bị biên phán quyết đúng ngữ cảnh cháy với độ chính xác ≥85% trên benchmark quốc tế, giảm báo động giả còn ≤1 lần/camera/ngày, và phán quyết trong ≤5 giây.**

Mọi công việc không đóng góp trực tiếp vào câu này trong 12 tháng đầu đều là phạm vi ngoài.

## 2. Chỉ tiêu đo được và các gate

| Gate | Thời điểm | Tiêu chí thoát gate (đo bằng script, không đo bằng cảm giác) | Hành động nếu trượt |
|---|---|---|---|
| G1 | Tháng 2 | Baseline detector đạt mAP@0.5 ≥0.75 trên D-Fire val; harness đánh giá MS-FSDB chạy được một lệnh | Sửa harness/dữ liệu, chưa đụng SLM |
| G2 | Tháng 5 | Bộ sinh kịch bản ≥20.000 tình huống; SLM SFT đạt verdict accuracy ≥0.80 trên tập held-out MmodalFire | Tăng chất lượng kịch bản và CoT thầy, chưa tăng kích thước model |
| G3 | Tháng 8 | Verdict accuracy ≥0.85 (MmodalFire held-out) VÀ mAP@0.5 ≥0.85 (MS-FSDB test) VÀ FAR quy đổi ≤1/camera/ngày trên tập nhiễu khó; DPO giảm FAR ≥30% so với SFT | Lặp tối đa 2 vòng; dưới 0.80 sau 2 vòng thì pivot: bỏ tuyên bố SLM, giữ hệ detector+luật (xem mục 6) |
| G4 | Tháng 10 | Trên Jetson Orin Nano: phán quyết ≤5 giây, công suất gateway ≤10W; trên RPi5 bản 1.5B ≤10 giây; web app pilot 50 người dùng thật, p95 cảnh báo ≤10 giây | Giảm kích thước model hoặc chuyển SLM lên gateway mạnh hơn |
| G5 | Tháng 12 | Paper nộp hội nghị/tạp chí quốc tế; mã nguồn + dataset mở phát hành; load-test web app 1.000 người dùng đồng thời | Gia hạn hạng mục công bố sang pha 2, hệ thống vẫn đóng gói |

## 3. Phạm vi TRONG và NGOÀI

**Trong phạm vi 12 tháng:**
- Detector lửa-khói nhỏ (YOLO nano) + SLM phán quyết 1.5B/3B fine-tune QLoRA, xuất GGUF 4-bit.
- Bộ sinh kịch bản tổng hợp theo động học cháy + chưng cất CoT từ model thầy.
- Đánh giá trên MS-FSDB, MmodalFire, tập nhiễu khó (BoWFire, lớp false của DFIRE-VIDEO).
- Backend IoT (MQTT, device shadow, safety gate) + web app quản lý đa người dùng.
- Pilot thiết bị thật tại 1–3 địa điểm; load-test 1.000 user.

**Ngoài phạm vi, cấm tự ý thêm:**
- Điều khiển robot, drone, hoặc bất kỳ thiết bị di chuyển nào.
- Cháy rừng, ảnh vệ tinh, camera nhiệt chuyên dụng.
- Mobile app native; thanh toán, multi-tenant billing, SaaS thương mại.
- Model thị giác-ngôn ngữ trên 7B; cho LLM xem video liên tục thay detector.
- Thay thế hoặc can thiệp hệ báo cháy kiểm định TCVN 5738.
- Tính năng web app ngoài ba vai: cư dân, quản lý tòa nhà, trung tâm giám sát.

## 4. Ràng buộc tài nguyên

- Nhân lực: 1 người chính; không giả định thêm nhân lực.
- Compute huấn luyện: GPU thuê tổng ngân sách ≤400 USD; mỗi thí nghiệm phải ghi chi phí vào experiment log.
- Phần cứng: gateway + nút biên tổng ≤15 triệu VND; không mua robot.
- Thời gian: khung NCKH 15/09/2026–30/04/2027 cho phần thuyết minh; phần paper và scale test kéo dài trong 12 tháng tính từ 09/2026.

## 5. Ràng buộc an toàn và pháp lý (đường đỏ, không thương lượng)

1. Cổng an toàn tất định (sensor threshold chứng nhận) luôn phát cảnh báo độc lập với SLM; test bắt buộc trong `tests/test_safety_gate.py` phải xanh trước mọi merge.
2. Đầu ra SLM gồm phán quyết có cấu trúc; phần văn bản hướng dẫn không được chứa chỉ dẫn nguy hiểm (ví dụ dùng nước cho cháy điện/dầu); kiểm bằng test danh mục cấm.
3. Định vị pháp lý: tầng cảnh báo sớm bổ trợ, không thay thế hệ kiểm định; ghi trong mọi tài liệu công bố và giao diện người dùng.
4. Dữ liệu người dùng pilot: consent bằng văn bản, ẩn danh hóa, video thô không rời gateway; chỉ trọng số cập nhật và nhãn sự kiện lên cloud.

## 6. Quy tắc pivot đã định sẵn (quyết định trước khi cảm xúc xen vào)

- Trượt G3 dưới 0.80 sau 2 vòng lặp: chuyển tuyên bố khoa học sang "hệ phát hiện đa phương thức + luật xác thực", SLM xuống vai trò sinh giải thích tùy chọn; hệ thống và dataset vẫn là đóng góp.
- MmodalFire không tải được hoặc giấy phép cấm nghiên cứu: thay bằng giao thức verdict trên DFIRE-VIDEO + kịch bản tổng hợp, ghi ADR.
- Không đạt latency trên RPi5: chốt cấu hình Jetson Orin Nano làm chuẩn biên, RPi5 chỉ chạy detector.

## 7. Nghi thức chống trôi phạm vi

- Mỗi tuần một lần đối chiếu công việc đang làm với bảng gate; việc không nằm trong gate hiện tại phải ghi vào danh sách chờ pha 2, không làm ngay.
- Mọi thay đổi phạm vi phải: (1) sửa tài liệu này, (2) thêm ADR, (3) ghi ngày và lý do. Không có ngoại lệ bằng lời nói.
- Nguyên tắc 80/20: ba hạng mục tạo phần lớn giá trị là bộ sinh kịch bản, vòng huấn luyện QLoRA, và harness đánh giá; ưu tiên thời gian cho đúng ba hạng mục này.
