# data/ — quản lý dataset huấn luyện và phân tích

> Nguồn sự thật về vai trò từng bộ dữ liệu là [docs/03-data/data-cards.md](../docs/03-data/data-cards.md). Folder này chỉ quản lý vật lý: tải về đâu, xử lý ra đâu, phân tích ở đâu. Mọi thay đổi split hoặc metric quay về data-cards, không tự quyết trong folder này.

## Năm vùng

| Vùng | Chứa gì | Bất biến? | Quản lý phiên bản |
|---|---|---|---|
| [raw/](raw/) | Dữ liệu tự thu buồng an toàn: video, log cảm biến gốc | Có, không sửa sau khi thu | DVC |
| [external/](external/) | Mỗi dataset quốc tế một folder con, nguyên trạng như tác giả công bố | Có | DVC |
| [processed/](processed/) | Bản sẵn sàng huấn luyện: YOLO format, jsonl SFT/DPO, tập nhiễu ghép | Không, tái sinh được bằng script | DVC |
| [analysis/](analysis/) | Đầu ra phân tích khám phá từng bộ: thống kê phân bố, biểu đồ, báo cáo so sánh | Không, tái sinh được | DVC |
| [splits/](splits/) | File khóa split train/val/test theo ID video và cảnh | Có, khóa trước huấn luyện | **git**, không dùng DVC |

## Ánh xạ dataset → folder (chi tiết giấy phép xem external/README.md)

| Dataset | Card | external/ | processed/ | Vai trò |
|---|---|---|---|---|
| D-Fire | 1 | dfire/ | detection/ | train detector |
| FASDD | 2 | fasdd/ | detection/ | train detector |
| HQFSD | 2 | hqfsd/ | detection/ | train detector |
| MS-FSDB | 3 | ms-fsdb/ | hardneg/ + splits/ | benchmark chính perception |
| MmodalFire | 4 | mmodalfire/ | verdict/ | benchmark chính phán quyết |
| DFIRE-VIDEO | 5 | dfire-video/ | hardneg/ | đo FAR, chỉ test |
| BoWFire | 5 | bowfire/ | hardneg/ | nhiễu khó, chỉ test |
| MAFF-Net | 3 (baseline) | maffnet/ | verdict/ | baseline fusion chạy lại |
| FireGuard-Scenes | 6 | — | scenarios/ | SFT/DPO sinh bởi scripts/build_scenarios.py |
| FireGuard-VN-Early | 7 | raw/ | verdict/ + detection/ | đóng góp mở của đề tài |

## Quy tắc bất di bất dịch

1. Không sửa tay file trong external/ và raw/; mọi biến đổi sống ở processed/ kèm script tái sinh.
2. Tập hardneg (card 5) không bao giờ được copy sang detection/ hay scenarios/; vi phạm là hỏng gate G3.
3. splits/ là giao thức khóa: đổi split phải mở niêm phong theo CONSTRAINTS và ghi biên bản gate.
4. Mỗi phân tích mới trong analysis/ đặt tên `<dataset>__<chủ đề>__<ngày>.md` hoặc `.png`, kèm một dòng kết luận đầu file.
5. Trước khi train bất cứ gì: `dvc status` sạch và tag DVC của processed/ được ghi vào experiment log.
