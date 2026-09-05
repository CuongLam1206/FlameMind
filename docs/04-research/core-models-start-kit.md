# Bộ khởi động nghiên cứu hai model lõi — dataset và paper đã xác thực

> Dùng cùng [papers.md](papers.md) (danh sách tổng) và [data-cards.md](../03-data/data-cards.md) (giao thức). Trang này tập trung vào thứ cần đọc và tải TRƯỚC khi bấm train, kèm trạng thái tải thực tế trên máy dự án ngày 04/09/2026.

## Model 1 — Detector YOLOv11n (perception)

Paper đọc trước, theo thứ tự:

1. Cheng et al., "Visual fire detection using deep learning: A survey," Neurocomputing 2024, doi 10.1016/j.neucom.2024.128250 — bản đồ phương pháp, đọc mục thách thức trước.
2. Han et al., MS-FSDB, arXiv:2410.16631 — vừa là benchmark vừa là bài học vì sao dataset nhỏ gây overfit.
3. "Deep learning object detection for forest fire smoke (YOLOv11x)," Scientific Reports 2025, doi 10.1038/s41598-025-98086-w — mốc YOLO11 trên khói.
4. YOLOGX, Frontiers in Environmental Science 2024, doi 10.3389/fenvs.2024.1486212 — công thức cải tiến YOLO cho lửa, tham khảo ablation.
5. Wang et al., FireVideoNet, Neural Computing and Applications 2023, doi 10.1007/s00521-023-08678-8 — baseline video cho pha sau.

Dataset và trạng thái tải:

| Bộ | Vai trò | Trạng thái trên máy | Hành động cần |
|---|---|---|---|
| D-Fire | train chính | repo đã clone vào data/external/dfire nhưng CHỈ có nhãn và utils; ảnh nằm ở OneDrive và mirror Kaggle | cần tài khoản Kaggle (khuyến nghị) hoặc tải tay link OneDrive trong README repo |
| Smoke-Fire-Detection-YOLO (Kaggle) | mirror D-Fire đủ ảnh, YOLO format, đã chia train/val/test | chưa tải | `kaggle datasets download -d sayedgamal99/smoke-fire-detection-yolo` sau khi có token |
| MS-FSDB | benchmark + âm tính khó | chưa tải | thử gdown link Google Drive trong repo xiaoyihan6/ms-fsdb |
| DFS (frames.gov) | bổ sung nếu thiếu | repo github chỉ ~57MB, ảnh ở kho ACM | tải sau, không chặn tiến độ |

Kết luận thực dụng: chặn duy nhất của Model 1 là ảnh D-Fire. Một tài khoản Kaggle miễn phí gỡ được chặn trong 5 phút; đây là hành động cần người làm, không tự động hóa được.

## Model 2 — SLM phán quyết Qwen2.5-1.5B (verdict)

Paper đọc trước, theo thứ tự:

1. Qwen Team, "Qwen2.5 Technical Report," arXiv:2412.15115 — hiểu nền model sẽ fine-tune, đặc biệt khả năng tuân thủ JSON và tiếng Việt.
2. Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs," arXiv:2305.14314, 8000+ trích dẫn — cơ sở 4-bit + LoRA mà Unsloth tăng tốc.
3. Jia et al., MmodalFire, Scientific Data 2026, doi 10.1038/s41597-026-06810-6 — benchmark neo của tầng phán quyết; đọc giấy phép trước khi tải.
4. Liang et al., MAFF-Net, Journal of Safety Science and Resilience 2026, doi 10.1016/j.jnlssr.2026.100322, code github.com/Universe-ustc/MAFF-Net — baseline fusion phải chạy lại.
5. Ali và Ghodrat, benign flames, IEEE Access 2025, doi 10.1109/ACCESS.2025.3598919 — đọc trước khi diễn giải bất kỳ số báo giả nào.
6. Yang et al., SimuHome, arXiv:2509.24282 — ngữ cảnh agent nhà thông minh cho phần hướng dẫn.

Dataset và trạng thái:

| Bộ | Vai trò | Trạng thái | Hành động |
|---|---|---|---|
| FireGuard-Scenes | khối lượng train SFT/DPO | ĐÃ SINH 20.000 kịch bản tại data/processed/scenarios/scenes_sft.jsonl | dvc add trước khi train |
| MmodalFire | held-out benchmark + train phụ | đang tải từ Figshare công khai, ~4,6GB, không cần đăng nhập | link: springernature.figshare.com/articles/dataset/28804448, giải nén vào data/external/mmodalfire |
| DetectiumFire | bổ sung đa phương thức, paper arXiv:2511.02495 | chưa tải | đọc paper rồi tải theo kho tác giả công bố |
| Indoor Fire Smoke (Zenodo 15826133) | bổ sung khói trong nhà | chưa tải | zenodo.org/records/15826133, tải công khai |
| DFIRE-VIDEO, BoWFire | đo FAR, chỉ test | chưa tải | tải tuần 3 theo lộ trình S1 |

Lưu ý ngày 04/09/2026: folder Google Drive của MS-FSDB trả 401 với gdown (chưa bật công khai hoặc bị giới hạn lượt), nên MS-FSDB tạm thời chờ tác giả hoặc tải tay; không chặn tiến độ vì D-Fire và MmodalFire đủ cho hai smoke test đầu tiên.

## Thứ tự bấm nút khi env fire sẵn sàng

1. `python scripts/build_scenarios.py --n 20000 --out data/processed/scenarios/scenes_sft.jsonl` rồi `dvc add data/processed && dvc commit -m "scenes v1"`.
2. Smoke test SLM: `python notebooks/02_train_slm_qlora.py --stage sft --epochs 1 --model-tag slm-0.0.1-smoke` trên 500 kịch bản để xác nhận Unsloth chạy trên RTX 4050 6GB trước khi chạy bản đầy đủ.
3. Smoke test detector chờ ảnh D-Fire từ Kaggle; trong lúc chờ chạy pipeline test trên tập nhỏ bất kỳ có sẵn để xác nhận Ultralytics + MLflow + export ONNX.
4. Sau mỗi run: `python scripts/sync_registry.py` để màn hình Registry web cập nhật.
