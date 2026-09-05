# raw/ — dữ liệu tự thu buồng an toàn FireGuard-VN-Early (card 7)

Mỗi đợt thu một folder con đặt tên `YYYY-MM-DD_dot-N`, bên trong gồm:

```
2026-11-10_dot-1/
├── video/          # clip camera gốc, không nén lại
├── sensors.csv     # log đồng bộ: thời gian, khói %/m, nhiệt C, CO ppm
├── meta.yaml       # kịch bản (họ cháy/lành tính), nhiên liệu, vị trí đặt cảm biến, người thu
└── consent.md      # xác nhận an toàn và người chứng kiến đợt thu
```

Quy tắc:

1. Bất biến sau khi thu; phát hiện lỗi ghi chú vào meta.yaml chứ không sửa file.
2. An toàn theo CONSTRAINTS mục 5: buồng kim loại thông gió, ngoài trời hoặc hút khói, bình chữa cháy cạnh bên, không chất gia tốc cháy.
3. Mục tiêu gate: ≥50 kịch bản, ≥10.000 khung hình nhãn; tiến độ đếm bằng số folder dot hợp lệ.
4. `dvc add` ngay sau mỗi đợt; bản nhãn và khung trích xuất sống ở ../processed/verdict/ và ../processed/detection/.
