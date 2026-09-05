# Techstack và quản lý phiên bản

## Bảng techstack theo tầng

| Tầng | Công nghệ | Ghi chú lựa chọn |
|---|---|---|
| Huấn luyện detector | PyTorch + Ultralytics (YOLOv8n/v11n) | Xuất ONNX rồi NCNN cho RPi5 |
| Huấn luyện SLM | Unsloth (FastLanguageModel 4-bit + LoRA) + TRL SFTTrainer/DPOTrainer, log MLflow thủ công, trong conda env `fire` | Nền Qwen2.5-1.5B/3B-Instruct theo ADR-0002; Unsloth nhanh ~2 lần và vừa VRAM 6GB; mỗi run mang tham số dvc_data_tag |
| Huấn luyện detector | Ultralytics (vòng train tối ưu sẵn) + mlflow log thủ công | Lightning không thêm giá trị cho loop YOLO; MLflow giữ một registry chung |
| Chưng cất thầy | API model lớn (Qwen2.5-72B-class) | Chỉ dùng sinh nhãn CoT, không dùng lúc suy luận |
| Theo dõi thí nghiệm | Weights & Biases hoặc MLflow self-host | Mỗi run ghi giả thuyết, metric chốt, chi phí GPU |
| Suy luận biên | llama.cpp (GGUF Q4_K_M), constrained decoding bằng grammar JSON | Token phán quyết bắt buộc ra đầu tiên |
| Nút biên | Raspberry Pi 5 / ESP32-S3 (detector-only) | MQTT over TLS, một khóa mỗi nút |
| Gateway | Jetson Orin Nano hoặc mini PC; FastAPI | Chạy SLM và cổng an toàn |
| Broker và bus | Mosquitto hoặc EMQX | Topic ACL theo site/node |
| Lưu trữ cloud | Postgres + TimescaleDB (telemetry), MinIO/S3 (clip sự kiện, nhãn) | Shadow registry nằm trong Postgres |
| Web app | Vite + React + TypeScript, design system open-design cam-trắng | API stateless sau nginx, scale ngang |
| Đánh giá | eval_voc.py chính thức của MS-FSDB + harness tự viết trong `notebooks/03_eval_benchmarks.py` | Giao thức khóa ở pha 1 |

## Quản lý phiên bản (ADR-0004)

- **Code và docs**: git, nhánh `main` luôn xanh test; mỗi thí nghiệm lớn tag `exp/E3-...`.
- **Dữ liệu**: DVC theo năm vùng trong `data/` (xem [data/README.md](../../data/README.md)): `raw` và `external` bất biến, `processed` và `analysis` tái sinh được bằng script, `splits` khóa giao thức và theo git chứ không theo DVC. File `.dvc` commit cùng code để mọi experiment tái hiện đúng bản dữ liệu.
- **Model**: `models/` do DVC quản lý trọng số; `models/registry.md` là bảng một dòng mỗi phiên bản: tag DVC, dataset hash, metric chốt trên tập khóa, latency thiết bị, người chạy, ngày. Không có dòng registry thì model không tồn tại với đề tài.
- **Notebook/script huấn luyện**: mọi run ghi experiment log; script nhận config từ `configs/` để không ai sửa số bằng tay trong code.

## Thiết lập lần đầu

```bash
cd fireguard
git init && dvc init            # nếu chưa có dvc: pip install dvc
dvc remote add -d fgstore <đường dẫn hoặc S3 của anh/chị>
pip install -r requirements.txt # Ultralytics, transformers, peft, trl, fastapi, paho-mqtt
bash scripts/setup_data.sh      # tải dataset công khai vào data/external và dvc add
pytest tests/                   # phải xanh trước khi huấn luyện bất cứ gì
```

Yêu cầu môi trường tối thiểu: Python 3.11+, CUDA cho máy huấn luyện thuê, llama.cpp build sẵn cho hai thiết bị biên, Docker cho stack cloud khi pilot.
