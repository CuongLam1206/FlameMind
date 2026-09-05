# FlameMind (FireGuard SLM) — Hệ thống cảnh báo cháy đa phương thức

> Đề tài NCKH 12 tháng: "Nghiên cứu và phát triển hệ thống cảnh báo cháy sử dụng mô hình đa phương thức - Multimodal Model".
> Trọng tâm: fine-tune SLM chuyên phán quyết báo cháy chạy trên thiết bị biên; đánh giá bằng benchmark chuẩn quốc tế; công bố bài báo quốc tế; triển khai web app quản lý quy mô hàng nghìn người dùng.

## Cách đọc repo này

Quy trình làm việc tuân thủ 4S (STATE → STRUCTURE → SOLVE → SELL) và bốn nguyên tắc trong [claude.md](claude.md): nghĩ trước khi code, đơn giản tối thiểu, thay đổi đúng chỗ, mục tiêu phải kiểm chứng được.

| Tài liệu | Vai trò trong 4S | Đọc khi nào |
|---|---|---|
| [CONSTRAINTS.md](CONSTRAINTS.md) | Ràng buộc chống lệch hướng — **quan trọng nhất** | Trước mọi quyết định đổi phạm vi |
| [docs/01-process/01-state-tosca.md](docs/01-process/01-state-tosca.md) | STATE: định nghĩa vấn đề bằng TOSCA | Khi quên bài toán gốc |
| [docs/01-process/02-structure.md](docs/01-process/02-structure.md) | STRUCTURE: issue tree MECE, hypothesis tree, 80/20 | Khi phân công hoặc cắt phạm vi |
| [docs/01-process/03-solve-roadmap.md](docs/01-process/03-solve-roadmap.md) | SOLVE: lộ trình 12 tháng với gate và KPI | Đầu mỗi pha |
| [docs/01-process/04-sell-storyline.md](docs/01-process/04-sell-storyline.md) | SELL: storyline bảo vệ đề tài và khung bài báo | Khi viết báo cáo, slide, paper |
| [docs/02-architecture/architecture.md](docs/02-architecture/architecture.md) | Kiến trúc hệ thống theo chuẩn awesome-architecture | Khi thiết kế hoặc code hệ thống |
| [docs/02-architecture/techstack-versioning.md](docs/02-architecture/techstack-versioning.md) | Techstack và quản lý phiên bản code/data/model | Khi cài đặt môi trường |
| [docs/03-data/data-cards.md](docs/03-data/data-cards.md) | Thẻ dữ liệu: dataset, benchmark, giao thức đánh giá | Trước mọi thí nghiệm |
| [docs/04-research/papers.md](docs/04-research/papers.md) | Danh sách paper uy tín đã xác thực | Khi viết related work |
| [docs/05-reports/](docs/05-reports/) | Báo cáo pha, experiment log, biên bản gate | Cuối mỗi pha và mỗi gate |

## Cấu trúc thư mục

```
FlameMind/
├── CONSTRAINTS.md          # Ràng buộc và gate chống lệch hướng
├── docs/                   # Toàn bộ tài liệu 4S + kiến trúc + dữ liệu + paper
├── notebooks/              # Script huấn luyện model (detector, SLM, eval)
├── scripts/                # Script dữ liệu, xuất model, thiết lập phiên bản
├── tests/                  # Test cho logic an toàn và giao thức đánh giá
├── src/fireguard/          # Mã nguồn lõi tối thiểu (safety gate, metrics)
├── configs/                # Hyperparameter và cấu hình eval
├── server/                 # Gateway FastAPI: /api/v1/verdict, /auth/google, Dockerfile, test e2e API
├── deploy/                 # docker-compose (web+api+mqtt+timescale), nginx.conf, lộ trình hạ tầng
├── .github/workflows/      # CI: build web + pytest python mỗi push/PR
├── data/                   # DVC quản lý: raw / external / processed / analysis / splits
├── models/                 # DVC quản lý trọng số + registry.md
└── web/                    # App Vite+React (npm install && npm run dev): landing, login Google, 8 màn hình, chatbot; design system open-design + Anthropic brand blend
```

## Nguyên tắc bất biến

1. Model SLM chỉ phán quyết sau khi detector thường trực kích hoạt; không bao giờ cho LLM nhìn video liên tục.
2. Cổng an toàn tất định trong code luôn thắng phán quyết của SLM khi cảm biến vượt ngưỡng chứng nhận.
3. Hệ báo cháy kiểm định TCVN 5738 là hệ chính; FlameMind là tầng cảnh báo sớm bổ trợ.
4. Mọi con số cam kết trong CONSTRAINTS.md phải đo được bằng script trong `tests/` hoặc `notebooks/03_eval_benchmarks.py`.
