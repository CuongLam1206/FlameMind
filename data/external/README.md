# external/ — dataset quốc tế, mỗi bộ một folder, nguyên trạng

> Tải bằng `bash scripts/setup_data.sh` hoặc thủ công theo link bên dưới; xong thì `dvc add data/external`. Không đổi tên file, không chuẩn hóa nhãn trong folder này; mọi biến đổi sống ở ../processed/.

| Folder | Bộ dữ liệu | Nguồn tải | Giấy phép cần đọc trước khi dùng cho công bố | Trạng thái 09/2026 |
|---|---|---|---|---|
| dfire/ | D-Fire 21.527 ảnh | github.com/gaia-solutions-on-demand/DFireDataset | README repo | chưa tải |
| fasdd/ | FASDD ~100k ảnh | essd.copernicus.org, bài essd-2022-394 | CC-BY theo ESSD | chưa tải |
| hqfsd/ | HQFSD chuẩn ACM MM 2024 | trang bài báo dl.acm.org/10.1145/3688867.3690170 | theo tác giả | chưa tải |
| ms-fsdb/ | MS-FSDB benchmark + eval_voc.py | github.com/xiaoyihan6/ms-fsdb (link Google Drive trong repo) | README repo | chưa tải |
| mmodalfire/ | MmodalFire 65 video + 6 cảm biến | nature.com/articles/s41597-026-06810-6 | **đọc kỹ**: nếu cấm nghiên cứu thì pivot CONSTRAINTS mục 6 | chưa tải |
| dfire-video/ | DFIRE-VIDEO 313 clip 5 lớp | ScienceDirect Data in Brief, bài kèm dataset | theo bài báo | chưa tải |
| bowfire/ | BoWFire ảnh nhiễu cố ý | hyper.ai/en/datasets/33233 | theo tác giả Univ. Calgary | chưa tải |
| maffnet/ | MAFF-Net code + dataset HF Universe123456 | github.com/Universe-ustc/MAFF-Net | README repo | chưa tải |

Quy tắc phân tích nhiều bộ: muốn so sánh phân bố giữa các bộ, chép số liệu thống kê sang ../analysis/, không ghép file gốc của hai bộ vào một chỗ trong folder này.
