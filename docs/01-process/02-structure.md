# 02 · STRUCTURE — Phân rã vấn đề

> Bước STRUCTURE của 4S. Dùng issue tree MECE để chia việc, hypothesis tree để chọn thứ chứng minh trước, và 80/20 để chọn thứ làm trước. Design thinking áp dụng riêng cho phần web app (người dùng cuối là cư dân trong hoảng loạn).

## Issue tree (MECE — các nhánh không trùng nhau, gộp lại đủ bài toán)

**Vấn đề gốc: làm sao một hệ một người xây trong 12 tháng phán quyết cháy đúng ngữ cảnh ở biên và hướng dẫn được con người?**

- **A. Độ chính xác model** (What makes it right?)
  - A1. Perception: phát hiện lửa-khói trong frame và clip, gồm khói mỏng giai đoạn sớm.
  - A2. Judgment: SLM suy luận từ gói ngữ cảnh (clip đặc trưng + chuỗi cảm biến + siêu dữ liệu cảnh) ra phán quyết và mức cảnh báo.
  - A3. Calibration: cân bằng bỏ sót và báo giả; phân biệt lửa lành tính (nến, bếp, nhang).
- **B. Dữ liệu** (What feeds it?)
  - B1. Dataset công khai quốc tế: D-Fire, FASDD, HQFSD, MS-FSDB, DFIRE-VIDEO, MmodalFire, BoWFire.
  - B2. Bộ sinh kịch bản tổng hợp theo động học cháy + chưng cất chuỗi suy luận từ model thầy.
  - B3. Dữ liệu tự thu buồng an toàn ngữ cảnh Việt Nam.
  - B4. Nhãn phản hồi đúng/sai từ người dùng pilot (flywheel, pha sau G4).
- **C. Triển khai biên** (What makes it run there?)
  - C1. Nén: QLoRA khi huấn luyện, GGUF 4-bit khi suy luận; detector xuất ONNX/NCNN.
  - C2. Trễ và năng lượng: cascade detector thường trực + SLM sau kích hoạt; token phán quyết ra đầu tiên.
  - C3. Cổng an toàn tất định độc lập với SLM.
- **D. Hệ thống và người dùng** (What makes it usable?)
  - D1. Backend IoT: MQTT, device shadow, rule engine tối giản, lưu clip sự kiện.
  - D2. Web app ba vai (cư dân, quản lý, trung tâm) cảnh báo đa kênh, scale ngang tới 1.000 user.
  - D3. Giao diện hướng dẫn thoát nạn đọc được trong hoảng loạn (design thinking: empathize với người đang chạy khỏi đám khói).
- **E. Đầu ra khoa học** (What makes it count?)
  - E1. Giao thức đánh giá chuẩn quốc tế cố định trước khi huấn luyện.
  - E2. Bài báo quốc tế (method + hệ thống).
  - E3. Phát hành mở: mã nguồn, dataset tự thu, model card.

Kiểm MECE: không hạng mục nào xuất hiện hai nhánh (calibration nằm A3 không nằm B; nén nằm C1 không nằm A); gộp năm nhánh đủ mọi việc trong lộ trình tháng 1–12.

## Hypothesis tree (giả thuyết dẫn đường, mỗi giả thuyết có phép thử)

| Giả thuyết | Nếu đúng thì | Phép thử bác bỏ | Gate |
|---|---|---|---|
| H1: SLM 1.5–3B fine-tune QLoRA trên kịch bản tổng hợp + CoT chưng cất đạt verdict accuracy ≥0.85 trên held-out MmodalFire | Đóng góp method chính đứng vững | So SFT-SLM với baseline luật thuần và với LLM thầy prompt-zero-shot trên cùng tập | G3 |
| H2: Cascade detector + SLM giữ phán quyết ≤5 giây và ≤10W trên Jetson Orin Nano | Triển khai biên khả thi không cần cloud | Đo p95 latency và watt trên thiết bị thật với 200 sự kiện | G4 |
| H3: DPO trên cặp preference giảm FAR ≥30% so với SFT cùng dữ liệu | Calibration là đóng góp thứ hai | A/B cùng held-out nhiễu khó | G3 |
| H4: Người dùng pilot tin hệ thống hơn khi có giải thích và hướng dẫn kèm cảnh báo (tỷ lệ phản hồi đúng/sai tăng theo thời gian) | Flywheel và phần agent có giá trị người dùng | So sánh tỷ lệ phản hồi tháng đầu và tháng thứ ba của pilot | G4–G5 |

## Ưu tiên 80/20

Ba hạng mục tạo phần lớn giá trị khoa học và sản phẩm, chiếm ưu tiên thời gian tuyệt đối:

1. **Bộ sinh kịch bản tổng hợp + chưng cất CoT** (B2): không có nó thì không có dữ liệu phán quyết, mọi nhánh A tê liệt.
2. **Vòng huấn luyện QLoRA và xuất GGUF** (A2 + C1): đường ống biến dữ liệu thành model biên.
3. **Harness đánh giá chuẩn quốc tế** (E1): không có nó mọi con số đều tự sướng; có nó mới viết được paper.

Mọi hạng mục khác (web app đẹp, OTA, dashboard nâng cao) đều xếp sau ba hạng mục này cho tới khi G3 xanh.

## Design thinking cho phần D3 (người dùng trong hoảng loạn)

- Empathize: phỏng vấn 5–10 cư dân và 1–2 ban quản lý về lần nghe báo cháy gần nhất; ghi lại họ nhìn gì trước, tin gì trước.
- Define: trong 10 giây đầu, người dùng cần đúng ba thứ: có cháy thật không, tôi đi hướng nào, tôi có được dập không.
- Ideate và Prototype: màn hình cảnh báo chỉ hiện ba câu trả lời đó cỡ chữ lớn, màu cam-trắng tương phản cao; phần giải thích của SLM xếp dưới nếp gập.
- Test: đo thời gian hiểu đúng hướng thoát trên 10 người với prototype web trước khi viết backend.
