# Papers uy tín cho related work và baseline

> Tất cả mục đánh dấu [xác thực] đã được kiểm tra tồn tại qua Crossref hoặc arXiv trong phiên làm việc 09/2026, kèm DOI/ID thật. Mục [kinh điển] là công trình nền tảng nổi tiếng không cần xác thực lại.

## Nhóm 1 — Khảo cứu nền (đọc tuần 1)

- [xác thực] Cheng, R. et al., "Visual fire detection using deep learning: A survey," Neurocomputing, 2024. doi 10.1016/j.neucom.2024.128250
- [xác thực] Gragnaniello, D. et al., "Fire and smoke detection from videos: A literature review under a novel perspective," Expert Systems with Applications, 2025. doi 10.1016/j.eswa.2024.125230
- [xác thực] Elhanashi, A. et al., "Early Fire and Smoke Detection Using Deep Learning," Applied Sciences 15(18):10255, 2025. doi 10.3390/app151810255
- [xác thực] Han, X. et al., "Benchmarking Multi-Scene Fire and Smoke Detection (MS-FSDB)," arXiv:2410.16631, 2024
- [xác thực] "Fire and Smoke Datasets in 20 Years: An In-depth Review," arXiv:2503.14552, 2025 (bản đồ 36 dataset)

## Nhóm 2 — Baseline perception và video (chạy lại bằng harness của ta)

- [xác thực] Wang, G. et al., "FireVideoNet: a dual-path network for video-based real-time fire detection," Neural Computing and Applications, 2023. doi 10.1007/s00521-023-08678-8 (100+ trích dẫn)
- [kinh điển] Jocher, G. et al., Ultralytics YOLOv8/YOLO11, github.com/ultralytics/ultralytics
- [xác thực] "Real-time fire and smoke detection system," Scientific Reports, 2026. doi 10.1038/s41598-026-36687-9 (mốc tốc độ 2026)

## Nhóm 3 — Multimodal fusion, đối thủ trực tiếp của đóng góp lõi

- [xác thực] Jia, Y. et al., "MmodalFire: A Continuous Multimodal Dataset Comprising Video and Physical Sensing Data for Detecting Indoor Fires," Scientific Data, 2026. doi 10.1038/s41597-026-06810-6
- [xác thực] Liang, Y. et al., "MAFF-Net: A multimodal adaptive feature fusion network for early forest fire detection," Journal of Safety Science and Resilience, 2026. doi 10.1016/j.jnlssr.2026.100322, code github.com/Universe-ustc/MAFF-Net
- [xác thực] Zhao, S. et al., "Fire Detection Model Based on Visual Information and Multi-Sensor Information Fusion," ICMLCA 2025. doi 10.1145/3703935.3704042

## Nhóm 4 — Báo động giả và ngữ cảnh (đỡ luận điểm calibration)

- [xác thực] Ali, M. M. E. H., Ghodrat, M., "Toward Reliable Fire Detection in Indoor CCTV Footage: Reducing False Alarms From Benign Flames Using 3D Attention CNNs," IEEE Access, 2025. doi 10.1109/ACCESS.2025.3598919
- [xác thực] Chen, Y. et al., "Research on Highly Suspected True Alarm Model for Fire Detection," Fire 9(3):124, 2026. doi 10.3390/fire9030124
- [xác thực] Kim, D. et al., "Federated learning based fire detection method using local data," Scientific Reports, 2024. doi 10.1038/s41598-024-82001-w (nền cho pha 2)

## Nhóm 5 — Agent, an toàn chuỗi dài và SLM biên (đỡ tầng phán quyết)

- [xác thực] Yang, H. et al., "SimuHome: A Temporal- and Environment-Aware Benchmark for Smart Home LLM Agents," arXiv:2509.24282, 2025
- [xác thực] Wang, J. et al., "SMH-Bench: Benchmarking LLM Agents for Environment-Aware Smart Home Tasks," arXiv:2606.01912, 2026
- [xác thực] Huang, L. et al., "From Retries to Recoverable Execution for Long-Horizon LLM Agents," arXiv:2608.14380, 2026
- [kinh điển] Dettmers, T. et al., "QLoRA: Efficient Finetuning of Quantized LLMs," NeurIPS 2023
- [kinh điển] Qwen team, "Qwen2.5 Technical Report," 2024 (nền SLM theo ADR-0002)
- [kinh điển] llama.cpp, github.com/ggml-org/llama.cpp (suy luận GGUF biên)

## Cách dùng trong bài báo

Related work viết ba đoạn đúng ba nhóm 1–3–5; baseline thực nghiệm bắt buộc gồm FireVideoNet, MAFF-Net chạy lại bằng harness của ta, detector đơn modal, và model thầy zero-shot; mọi trích dẫn nộp paper kiểm lại DOI một lần nữa trước submission.
