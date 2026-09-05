# analysis/ — đầu ra phân tích khám phá từng bộ dữ liệu

Nơi trả lời các câu hỏi "bộ này lệch phân bố ra sao, lớp nào hiếm, cảnh nào trùng nhau" trước khi đưa vào huấn luyện. Mọi phân tích tái sinh được bằng notebook hoặc script; folder này chỉ giữ kết quả và kết luận.

Quy ước đặt tên: `<dataset>__<chủ đề>__<YYYY-MM-DD>.<md|png|csv>`

Ví dụ:
- `dfire__phan_bo_lop_va_kich_thuoc__2026-10-05.md`
- `mmodalfire__dong_hoc_cam_bien_theo_ho_chay__2026-11-12.png`
- `msfsdb_vs_dfire__trunglap_canh__2026-10-05.csv`

Mỗi file .md mở đầu bằng một dòng kết luận in đậm, rồi đến số liệu và cách tái sinh (lệnh hoặc notebook). Phân tích nào dẫn tới quyết định đổi split hoặc đổi card phải được trích dẫn trong biên bản gate tương ứng ở [docs/05-reports/](../../docs/05-reports/).
