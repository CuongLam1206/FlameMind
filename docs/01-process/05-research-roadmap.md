# 05 · Lộ trình nghiên cứu chi tiết — dữ liệu trước, model sau, đo lường suốt đường

> Bổ sung cho [03-solve-roadmap.md](03-solve-roadmap.md): file kia giữ gate và mốc tháng, file này giữ đầu việc tuần, thứ tự dataset, và cách train bằng PyTorch Lightning + MLflow. Nguyên tắc bất biến: khóa giao thức đánh giá trước khi train bất cứ gì; mỗi run huấn luyện là một MLflow run mang tham số là tag DVC của dữ liệu.

## Trả lời thẳng: bắt đầu từ bộ dataset nào

1. **D-Fire trước tiên cho tầng perception.** Lý do: chuẩn de-facto, mọi paper đều báo số trên đó nên kết quả của ta so sánh được ngay, tải nhanh, huấn luyện baseline trong một ngày.
2. **Bộ sinh kịch bản FireGuard-Sces song song ngay tuần đầu cho tầng phán quyết.** Dữ liệu huấn luyện SLM phán quyết không tồn tại sẵn trên thế giới; chờ dataset thật là chết tiến độ. Kịch bản tổng hợp là khối lượng train, dữ liệu thật là neo đánh giá.
3. **MmodalFire là neo benchmark của tầng phán quyết**, tải ngay tuần 2 nhưng chỉ để giữ held-out, không để train lan tràn; đọc giấy phép trước khi tải.
4. **MS-FSDB tải tuần 2** vì mang theo script eval chính thức và tập âm tính khó, đo khả năng tổng quát hóa từ ngày đầu.
5. **Không bắt đầu bằng FASDD** (lệch phân bố cháy rừng, lớn nhưng loãng) và **không bắt đầu bằng dữ liệu tự thu** (chậm, chỉ đủ chín từ tháng 4). Hai bộ này vào sau, khi biết thiếu gì.

## Sáu chặng

**S0 · Tuần 1–2 — Chuẩn bị và khóa giao thức.**
Đầu việc: cài môi trường (Lightning, MLflow, DVC, Ultralytics, PEFT); chạy `scripts/setup_data.sh`; khởi động MLflow (`mlflow server` hoặc tracking uri local `mlruns`) tạo experiment `fireguard`; khởi tạo `registry.json`; đọc bốn survey (Cheng 2024, Gragnaniello 2025, Elhanashi 2025, review 36 dataset arXiv 2503.14552); viết và commit file split khóa vào `data/splits/`.
Kết quả đo được: harness MS-FSDB chạy một lệnh; registry hiện trên web màn hình Registry; split nằm trong git.

**S1 · Tuần 3–6 — Tải và phân tích dữ liệu.**
Đầu việc theo thứ tự D-Fire → MS-FSDB → MmodalFire → DFIRE-VIDEO + BoWFire; với mỗi bộ viết một phân tích vào `data/analysis/` theo quy ước tên: phân bố lớp, phân bố kích thước ảnh, mật độ khói, và kiểm tra trùng cảnh giữa các bộ (rò rỉ train-test); kết luận in đậm dòng đầu mỗi file. Song song dựng FireGuard-Scenes v1 ≥20.000 kịch bản kèm CoT chưng cất thầy.
Kết quả đo được: 5 báo cáo phân tích; `data/processed/detection/` yaml hoàn chỉnh; `data/processed/verdict/` jsonl MmodalFire; DVC tag `data/v1`.

**S2 · Tuần 5–8 — Baseline perception (gối đuôi S1).**
Đầu việc: train YOLOv11n trên D-Fire bằng Ultralytics, mỗi run log MLflow thủ công (params, mAP, artifact ONNX); đánh giá chéo cảnh trên MS-FSDB bằng eval_voc.py; đọc paper MS-FSDB và FireVideoNet trong tuần này.
Cửa đạt: mAP@0.5 ≥0.75 trên D-Fire val và số MS-FSDB đầu tiên nằm trong registry (G1).

**S3 · Tuần 7–14 — Lõi đề tài: SFT SLM phán quyết bằng Lightning + MLflow.**
Đầu việc: huấn luyện QLoRA Qwen2.5-1.5B-Instruct trên FireGuard-Scenes + MmodalFire train bằng `notebooks/02_train_slm_qlora.py` (LightningModule, MLFlowLogger native, checkpoint callback); mỗi run ghi tham số `dvc_data_tag`; so sánh các run bằng MLflow compare; chạy baseline MAFF-Net bằng code tác giả làm mốc; ablation E3/E4 (kích thước model, số kịch bản, có/không CoT, có/không cảm biến).
Cửa đạt: verdict accuracy ≥0.80 trên MmodalFire held-out (G2); model đăng ký vào MLflow registry và hiện trên màn hình Registry web.

**S4 · Tuần 15–20 — Calibration và diệt báo động giả.**
Đầu việc: sinh cặp preference từ kịch bản lành tính khó và lỗi của S3; DPO (TRL, log MLflow thủ công); đo FAR trên tập hardneg; ablation E5; đọc paper benign flames (IEEE Access 2025) và true-alarm model (MDPI Fire 2026) trước khi diễn giải kết quả.
Cửa đạt: G3 cả ba ngưỡng (verdict ≥0.85, mAP ≥0.85, FAR ≤1/ngày) thì GO sang biên; trượt thì dùng quy tắc pivot trong CONSTRAINTS.

**S5 · Tuần 21–28 — Xuất biên và đánh giá hệ thống.**
Đầu việc: export GGUF Q4_K_M bằng llama.cpp, log artifact vào MLflow; đo E6 latency p95 và watt trên Orin Nano và RPi5; bật adapter Live trong web trỏ về gateway FastAPI nay gọi SLM thật; pilot 50 người dùng; đọc lại paper recoverable execution khi dựng tầng escalation.
Cửa đạt: G4 (≤5s Orin, ≤10W, p95 cảnh báo web ≤10s).

**S6 · Tuần 29–48 — Công bố, mở nguồn, flywheel.**
Đầu việc: viết paper theo storyline trong [04-sell-storyline.md](04-sell-storyline.md); phát hành dataset tự thu và mã nguồn; load-test 1.000 user; báo cáo tổng kết; đề xuất pha 2 (nhãn phản hồi người dùng quay vòng fine-tune, federated đa tòa nhà).
Cửa đạt: G5.

## Nhịp tuần chống lệch hướng

Thứ hai mở MLflow compare và màn hình Registry web, đối chiếu run đang chạy với gate hiện tại. Thứ sáu viết một đoạn tổng hợp vào `docs/05-reports/` kèm link run. Việc mới nảy sinh không thuộc gate hiện tại: ghi vào danh sách chờ pha 2 trong CONSTRAINTS, không làm ngay.

## Vòng đời phiên bản, chốt một lần

- **Code và docs**: git.
- **Dữ liệu**: DVC, tag `data/vN`; hash DVC đi kèm mỗi MLflow run dưới tên tham số `dvc_data_tag`.
- **Model**: MLflow registry là nguồn sống (run id, metric, artifact); `registry.json` ở gốc là bản xuất cho web, cập nhật bằng `scripts/sync_registry.py`; màn hình Registry trong web chỉ đọc và dẫn link sang MLflow UI cho thao tác ghi.
