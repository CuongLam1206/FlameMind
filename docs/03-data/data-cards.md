# Data cards — dataset, benchmark và giao thức đánh giá khóa

> Mọi thí nghiệm phải khai báo dùng card nào. Sửa split hoặc metric sau khi thấy kết quả là vi phạm CONSTRAINTS mục 7. Nguồn và tình trạng xác thực: kiểm chứng qua Crossref/arXiv và trang chính thức, 09/2026.

## Card 1 — D-Fire (huấn luyện perception)

21.527 ảnh, ba lớp fire/smoke/fire-smoke, cảnh hỗn hợp. Nguồn: github.com/gaia-solutions-on-demand/DFireDataset. Vai trò: train/val detector. Rủi ro: cảnh mất cân bằng âm tính; luôn báo kèm số trên tập âm bổ sung từ MS-FSDB.

## Card 2 — FASDD và HQFSD (mở rộng train)

FASDD cỡ 100 nghìn ảnh lửa-khói phân theo cỡ đám cháy (Copernicus ESSD); HQFSD chuẩn ACM MM 2024 được chứng minh tổng quát hóa tốt hơn D-Fire. Vai trò: train detector; không dùng làm test vì trùng phân phối với train.

## Card 3 — MS-FSDB (BENCHMARK CHÍNH tầng perception)

12.586 ảnh, 2.731 cảnh, gộp 5 dataset kinh điển, 3.603 dương và 8.983 âm gồm negative khó (hoàng hôn, mây). Nguồn: github.com/xiaoyihan6/ms-fsdb, paper arXiv:2410.16631. Giao thức: dùng script eval_voc.py chính thức; metric mAP@0.5 và AP từng lớp; test chéo cảnh, không tinh chỉnh trên MS-FSDB. Cam kết gate G3: mAP@0.5 ≥0.85.

## Card 4 — MmodalFire (BENCHMARK CHÍNH tầng phán quyết đa phương thức)

65 video cháy trong nhà đồng bộ 6 luồng cảm biến vật lý liên tục. Nguồn: Nature Scientific Data 2026, doi 10.1038/s41597-026-06810-6 (Jia et al.). Giao thức: chia held-out theo video (không theo frame) 70/15/15; metric verdict accuracy ba lớp (cháy thật/lành tính/không cháy) và time-to-alarm tính từ đầu chuỗi tới phán quyết đúng đầu tiên. Cam kết gate G3: accuracy ≥0.85. Giấy phép phải đọc trước khi tải; nếu cấm nghiên cứu thì kích hoạt pivot đã định trong CONSTRAINTS mục 6.

## Card 5 — DFIRE-VIDEO và BoWFire (tập nhiễu khó, chỉ test)

DFIRE-VIDEO 313 clip năm lớp gồm false-fire và false-smoke; BoWFire ảnh camera đô thị kèm vùng nhiễu cố ý. Vai trò: đo FAR quy đổi và recall lớp giả; cấm đưa vào train (kết luận overfit của paper MS-FSDB). Cam kết gate G3: FAR quy đổi ≤1 lần/camera/ngày.

## Card 6 — Kịch bản tổng hợp FireGuard-Scenes (tự sinh, DVC quản lý)

Sinh bởi `scripts/build_scenarios.py`: họ cháy (âm ỉ-bùng, bùng nhanh, cháy điện) và họ lành tính (nến, nấu ăn, nhang, bụi, sương, đèn), mỗi kịch bản gồm chuỗi cảm biến theo động học lan tỏa và đặc trưng clip, kèm CoT chưng cất từ model thầy. Quy mô gate G2: ≥20.000 kịch bản. Phiên bản hóa bằng DVC tag `scenes/vN`.

## Card 7 — FireGuard-VN-Early (tự thu, đóng góp mở)

Buồng an toàn: khói âm ỉ từ nhang và vải ẩm, lửa lành tính từ nến và bếp mini, đồng bộ camera với MQ-2, DHT22, MQ-7; mục tiêu ≥50 kịch bản và ≥10.000 khung hình nhãn. An toàn theo CONSTRAINTS mục 5; phát hành mở ở gate G5.

## Quy tắc chống rò rỉ bắt buộc

1. Chia split theo video và theo cảnh, không theo frame.
2. Tập nhiễu khó (card 5) không bao giờ xuất hiện trong train hay val chọn model.
3. Held-out MmodalFire mở niêm phong đúng một lần ở gate G3 và một lần ở G5 cho paper; mọi lần chạm khác ghi vào experiment log.
