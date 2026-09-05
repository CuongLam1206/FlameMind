# Triển khai hạ tầng

Ba bậc thang, đi từ bậc thấp nhất đủ dùng, không nhảy bậc khi chưa cần.

## Bậc 1 — Máy cục bộ hoặc VPS đơn (pilot 1 tòa nhà)

```bash
cd fireguard/web && npm install && npm run build   # sinh dist/
cd ../deploy && docker compose up -d --build       # web :8080, api :8000, mqtt :1883, db :5432
```

Gateway biên (Jetson Orin Nano tại tòa nhà) chạy llama.cpp với GGUF Q4_K_M và nối lên MQTT broker; web và API ở bậc này chỉ nhận sự kiện đã tóm tắt, không nhận video.

## Bậc 2 — Cloud managed (pilot nhiều tòa nhà, load-test 1.000 user)

- Compute: một VM 4 vCPU cho API stateless sau load balancer, nhân bản ngang khi CPU p95 vượt 60%.
- Database: TimescaleDB managed (telemetry theo thời gian), object storage cho clip sự kiện và nhãn flywheel.
- MQTT: broker managed hoặc EMQX cluster khi vượt 5.000 nút; giữ nguyên topic ACL mỗi nút một khóa.
- Static web: object storage + CDN, chỉ gọi API qua /api.
- Bí mật: OAuth client id và khóa MQTT trong secret manager, không nằm trong repo; password trong docker-compose chỉ cho dev.

## Bậc 3 — Khi nào nghĩ tới Kubernetes

Chỉ khi số tòa nhà khiến việc nhân bản VM bằng tay tốn hơn một người vận hành. Trước đó, compose và VM là đủ và dễ kiểm toán hơn, đúng tinh thần tối giản của claude.md gốc workspace.

## CI/CD

`.github/workflows/ci.yml` chạy hai job mỗi push và PR: job web (npm build, TypeScript strict) và job python (pytest cho safety gate, metrics, và e2e API gateway qua TestClient). Merge vào main chỉ khi cả hai xanh; deploy bậc 1 hiện là thủ công một lệnh compose, tự động hóa deploy chỉ thêm sau khi pilot ổn định một tháng.
