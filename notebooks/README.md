# notebooks/ — script huấn luyện và đánh giá model

Thư mục này chỉ chứa script train/eval model theo đúng yêu cầu tổ chức repo. Mỗi script nhận config từ `configs/`, ghi experiment log, và không hard-code số liệu.

| Script | Vai trò | Gate liên quan |
|---|---|---|
| `01_train_detector.py` | Huấn luyện YOLO nano trên D-Fire+FASDD+HQFSD, xuất ONNX | G1 |
| `02_train_slm_qlora.py` | QLoRA SLM phán quyết trên FireGuard-Scenes + MmodalFire train, rồi DPO | G2, G3 |
| `03_eval_benchmarks.py` | Chạy giao thức khóa: MS-FSDB eval_voc, verdict accuracy MmodalFire held-out, FAR tập nhiễu khó, đo latency biên | G1, G3, G4 |

Quy tắc: không sửa metric trong script sau khi thấy kết quả; giao thức đã khóa trong [docs/03-data/data-cards.md](../docs/03-data/data-cards.md). Mỗi lần chạy ghi vào experiment log: tag DVC dữ liệu, tag model, giả thuyết, metric chốt, chi phí GPU.
