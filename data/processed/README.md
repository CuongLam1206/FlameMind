# processed/ — bản dữ liệu sẵn sàng huấn luyện, tái sinh được bằng script

Mọi thứ ở đây đều sinh ra từ ../external/ hoặc ../raw/ bằng script có trong repo; mất thì chạy lại, không tiếc. Mỗi lần tái sinh phải `dvc add` và ghi tag vào experiment log.

| Folder | Nội dung | Script sinh ra | Dùng bởi |
|---|---|---|---|
| detection/ | Dataset YOLO format gộp D-Fire+FASDD+HQFSD kèm file yaml class | scripts/make_detection_yaml.py (viết ở pha 1) | notebooks/01_train_detector.py |
| scenarios/ | FireGuard-Scenes jsonl SFT và cặp preference DPO | scripts/build_scenarios.py + bước chưng cất CoT | notebooks/02_train_slm_qlora.py |
| verdict/ | MmodalFire train và held-out dạng jsonl gói ngữ cảnh; bản train của MAFF-Net để chạy baseline | scripts/make_verdict_jsonl.py (pha 2) | notebooks/02 và 03 |
| hardneg/ | Tập nhiễu khó ghép: negative MS-FSDB + lớp false DFIRE-VIDEO + BoWFire, chỉ để đo FAR | scripts/make_hardneg.py (pha 3) | notebooks/03 --mode far |

Quy tắc: file trong hardneg/ không bao giờ xuất hiện trong detection/ hay scenarios/ (CONSTRAINTS và data/README quy tắc 2). Tên file mang hậu tố phiên bản kịch bản, ví dụ `scenes_sft_v3.jsonl`, khớp tag DVC `scenes/v3`.
