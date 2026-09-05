# Mục lục docs

> Quy ước đặt folder: số thứ tự theo vòng đời dự án, tên folder theo loại nội dung. File mới luôn vào đúng folder; nếu một loại nội dung mới xuất hiện và phình quá ba file, tách folder mới và cập nhật bảng này.

| Folder | Chứa gì | Quy tắc thêm file |
|---|---|---|
| [01-process/](01-process/) | Bốn bước 4S: STATE, STRUCTURE, SOLVE, SELL | Mỗi bước một file, đánh số 01–04, không thêm bước mới nếu không sửa CONSTRAINTS |
| [02-architecture/](02-architecture/) | Kiến trúc hệ thống, ADR, techstack, quản lý phiên bản | ADR mới viết thêm vào architecture.md mục 6; techstack đổi phải kèm ADR |
| [03-data/](03-data/) | Thẻ dataset, benchmark, giao thức đánh giá khóa | Mỗi dataset hoặc benchmark mới một card riêng khi vượt một trang |
| [04-research/](04-research/) | Paper đã xác thực, related work, khảo cứu | Paper mới phải ghi nguồn kiểm chứng và ngày kiểm tra |
| [05-reports/](05-reports/) | Báo cáo pha, biên bản gate, experiment log tổng hợp | Đặt tên `phase-N-...md` hoặc `gate-GN-...md`; log chi tiết từng run nằm ở experiment tracking, folder này chỉ giữ bản tổng hợp |

## Đọc theo vai trò

- Người mới vào dự án: README gốc → 01-process/01 → CONSTRAINTS ở gốc → bảng này.
- Người chạy thí nghiệm: 03-data trước, rồi 01-process/03, rồi notebooks/README.
- Người viết paper hoặc bảo vệ: 04-research rồi 01-process/04.
- Người vận hành pilot: 02-architecture rồi 05-reports các biên bản gate gần nhất.
