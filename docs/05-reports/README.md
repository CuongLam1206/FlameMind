# 05-reports — báo cáo pha, biên bản gate, experiment log tổng hợp

Folder này sẽ phình nhanh nhất dự án, nên quy tắc đặt tên cố định ngay từ đầu:

- `phase-1-...md` đến `phase-5-...md`: báo cáo kết thúc pha, đối chiếu với gate tương ứng trong [CONSTRAINTS.md](../../CONSTRAINTS.md).
- `gate-G1-...md` đến `gate-G5-...md`: biên bản một trang cho mỗi lần chấm gate: metric đo được bằng script nào, PASS/FAIL, quyết định đi tiếp hay pivot, chữ ký người chấm.
- `exp-log-tong-hop-...md`: bảng tổng hợp các run huấn luyện (tag DVC dữ liệu, tag model, giả thuyết, metric chốt, chi phí GPU); bản chi tiết từng run nằm ở experiment tracking (W&B/MLflow), không chép tràn vào đây.

Mẫu biên bản gate một trang:

```
# Gate G3 — ngày chấm: ....
Script đo: notebooks/03_eval_benchmarks.py --mode verdict|far|perception
verdict_accuracy = ... (ngưỡng 0.85) → PASS/FAIL
mAP50 MS-FSDB   = ... (ngưỡng 0.85) → PASS/FAIL
FAR/camera/ngày = ... (ngưỡng 1.0)  → PASS/FAIL
DPO delta FAR   = ... (ngưỡng giảm 30%) → PASS/FAIL
Quyết định: đi tiếp pha 4 / lặp vòng 2 / pivot theo CONSTRAINTS mục 6
Ghi chú và link experiment log:
```

Chưa có báo cáo nào vì dự án ở vạch xuất phát; file đầu tiên sẽ là `gate-G1-...md` vào tháng 10/2026.
