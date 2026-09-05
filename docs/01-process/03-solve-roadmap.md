# 03 · SOLVE — Lộ trình 12 tháng, gate và ma trận thí nghiệm

> Bước SOLVE của 4S: kiểm chứng giả thuyết bằng dữ liệu và benchmark, prototype rồi mới cam kết. Mỗi pha kết thúc bằng một gate trong [CONSTRAINTS.md](../../CONSTRAINTS.md); trượt gate thì dùng quy tắc pivot đã định sẵn, không improvising.

## Lộ trình theo pha

**Pha 1 (tháng 1–2) — Nền đo lường và perception baseline. Gate G1.**
Dựng harness đánh giá MS-FSDB một lệnh; tải và chuẩn hóa D-Fire, FASDD, HQFSD; huấn luyện YOLOv8n/v11n baseline; khóa giao thức đánh giá (metric, split, tập nhiễu khó) thành văn bản trong [data-cards.md](../03-data/data-cards.md) trước khi chạy thí nghiệm model phán quyết nào. Song song: khảo sát phần cứng, đo llama.cpp token/s trên RPi5 và Jetson thuê/mượn để chốt kích thước model khả dĩ.

**Pha 2 (tháng 3–5) — Cỗ máy dữ liệu phán quyết. Gate G2.**
Viết bộ sinh kịch bản tham số: họ kịch bản cháy (âm ỉ rồi bùng, bùng nhanh, cháy điện) và họ lành tính (nến, nấu ăn, nhang, bụi, sương, đèn phản quang), mỗi kịch bản sinh chuỗi cảm biến theo động học khói-nhiệt-CO kèm đặc trưng clip; chưng cất chuỗi suy luận CoT và nhãn JSON từ model thầy; SFT QLoRA Qwen2.5-1.5B-Instruct vòng đầu; đo verdict accuracy trên held-out MmodalFire.

**Pha 3 (tháng 6–8) — Model lõi và calibration. Gate G3, điểm GO/NO-GO của cả đề tài.**
Nâng lên Qwen2.5-3B nếu 1.5B chạm trần; DPO trên cặp preference; ablation bốn trục: có/không cảm biến, có/không CoT, có/không temporal, kích thước model; chốt model đạt ≥0.85 verdict và ≥0.85 mAP@0.5 MS-FSDB, FAR ≤1/ngày; viết và nộp paper hệ thống/demo nếu kịp workshop; draft paper method.

**Pha 4 (tháng 9–10) — Biên và hệ thống thật. Gate G4.**
Xuất GGUF Q4_K_M, detector xuất ONNX/NCNN; dựng gateway (MQTT, device shadow, safety gate, FastAPI) và nút biên; pilot 1–3 địa điểm thật với thiết bị tự mua; web app ba vai mở pilot 50 người dùng; đo p95 cảnh báo và latency phán quyết trên thiết bị thật.

**Pha 5 (tháng 11–12) — Công bố và scale. Gate G5.**
Nộp paper method quốc tế; phát hành mã nguồn, model card, dataset tự thu; load-test web app 1.000 user đồng thời; báo cáo tổng kết NCKH; viết đề xuất pha 2 (flywheel nhãn người dùng, federated đa tòa nhà).

## Ma trận thí nghiệm chính (mỗi ô là một lần chạy có ngân sách GPU ghi trước)

| Thí nghiệm | Biến số | Metric chốt | Ngân sách |
|---|---|---|---|
| E1 perception | YOLOv8n vs v11n, aug khói | mAP@0.5 D-Fire val, MS-FSDB test | 1 lượt GPU ngày |
| E2 teacher baseline | LLM thầy zero-shot và few-shot trên held-out | verdict accuracy trần tham chiếu | API, không GPU |
| E3 SFT scale | 1.5B vs 3B, 10k vs 30k vs 60k kịch bản | verdict accuracy, FAR | 3 lượt GPU ngày |
| E4 ablation ngữ cảnh | bỏ cảm biến / bỏ CoT / bỏ temporal | delta accuracy và FAR | 3 lượt GPU ngày |
| E5 DPO | SFT vs SFT+DPO trên cùng held-out nhiễu | FAR, recall cháy thật | 2 lượt GPU ngày |
| E6 edge | GGUF Q4 vs Q5, RPi5 vs Orin Nano | p95 latency, watt, VRAM/RAM | 0 GPU, đo thiết bị |
| E7 safety gate | inject sự kiện vượt ngưỡng với phán quyết SLM âm | 100% cảnh báo phát ra | test đơn vị |

## Benchmarking đối thủ (competitor baseline phải chạy lại bằng harness của mình)

MAFF-Net (code mở, dataset kèm) làm baseline fusion chính; detector đơn modal YOLO trên cùng tập làm baseline dưới; LLM thầy prompt làm baseline trên. Bài báo chỉ tuyên bố thắng nếu vượt cả ba trên cùng giao thức.

## Nguyên tắc SOLVE theo claude.md gốc workspace

Mỗi thí nghiệm khai báo trước: giả thuyết, metric chốt, ngưỡng đạt, chi phí; chạy xong ghi kết quả vào experiment log kể cả khi âm tính; không chỉnh metric sau khi thấy kết quả (giao thức đã khóa ở pha 1).
