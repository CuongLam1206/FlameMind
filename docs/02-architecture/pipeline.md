# Pipeline end-to-end — model nào chạy ở đâu, dữ liệu đi qua những gì

> Trang trả lời ba câu hỏi: model xử lý tại biên là model nào, hệ thống vận hành ra sao, input/output từng chặng là gì. Mọi con số trễ là mục tiêu đo ở thí nghiệm E6, không phải lời hứa.

## Ba đơn vị tính toán tại biên, hai model AI và một bộ luật

| Đơn vị | Chạy gì | Model | Luôn bật? |
|---|---|---|---|
| Nút ESP32-S3 (mỗi khu vực) | Đọc cảm biến khói, nhiệt, CO; ngưỡng an toàn cục bộ; đẩy MQTT | Không có AI, chỉ luật tất định | Có, miliwatt |
| Raspberry Pi 5 (mỗi cụm camera) | Phát hiện lửa-khói trên luồng video, cắt clip khi nghi ngờ | YOLOv11n xuất ONNX chạy NCNN, ~6MB | Có, vài watt |
| Gateway Jetson Orin Nano hoặc mini PC (mỗi tòa nhà) | Gói ngữ cảnh, hỏi SLM phán quyết, cổng an toàn tổng hợp, escalation | Qwen2.5-1.5B-Instruct bản GGUF Q4_K_M qua llama.cpp, ~1,1GB, kèm file grammar cho constrained decoding | SLM ngủ, thức theo sự kiện |

Không chạy ở biên: model thầy chưng cất CoT (chỉ dùng lúc train, gọi API cloud), MAFF-Net (baseline nghiên cứu), web app và MLflow (cloud và máy dev).

## Luồng A — telemetry, mỗi 5 giây, không model nào tham gia

```
ESP32 đọc khói/nhiệt/CO
  → MQTT topic site/{site}/node/{id}/tele
  → gateway cập nhật device shadow và TimescaleDB
  → web dashboard đọc shadow, không đọc thẳng thiết bị
```

## Luồng B — sự kiện, từ lúc có khói đến điện thoại cư dân

```
[1] Camera frame 640x640
     vào YOLOv11n (RPi5)
     ra detections [{class fire|smoke, bbox, conf}]
     conf vượt ngưỡng mềm N frame liên tiếp → TRIGGER, cắt clip 8s
[2] Gateway kéo chuỗi 60 giây khói/nhiệt/CO của node đó
[3] CỔNG AN TOÀN (luật, không đợi model):
     cảm biến vượt ngưỡng chứng nhận → báo mức 4 NGAY, bất kể SLM nói gì
[4] Bộ gói ngữ cảnh dựng VerdictContext JSON:
     {event_id, node_id, zone, room, hour,
      series {smoke[], temp[], co[]}, tóm tắt detection}
[5] SLM llama.cpp, grammar ép token đầu ∈ {chay_that, lanh_tinh, khong_chay}:
     token 1 ra → quyết định báo phát được ngay
     token tiếp → {confidence, explanation, guidance} stream sau
[6] Hợp nhất mức = max(mức cổng an toàn, mức SLM quy đổi)
     mức 0 im lặng chỉ log · 1 báo quản lý · 2 báo cư dân
     3 cư dân + trung tâm + màn thoát nạn · 4 kèm tự gọi 114 khi hết hạn xác nhận
[7] Fanout: MQTT → cloud → app/SMS/email/cuộc gọi + thẻ cảnh báo web + banner thoát nạn
[8] Cư dân bấm đúng/sai → kho nhãn → fine-tune định kỳ (flywheel)
```

## Ngân sách trễ mục tiêu, đo bằng E6

| Chặng | Mục tiêu |
|---|---|
| Detector mỗi frame trên RPi5 | 30–80 ms |
| Gói ngữ cảnh | dưới 100 ms |
| SLM token phán quyết đầu trên Orin | 0,5–2 s |
| SLM trọn verdict trên Orin | 2–4 s, trên RPi5 bản 1.5B chấp nhận 6–10 s |
| Fanout tới điện thoại | dưới 1 s |
| Tổng từ khi khói xuất hiện đến cư dân nhận tin | 5–8 s |

## Input/output của SLM, nhìn cận cảnh

Input duy nhất là JSON ngữ cảnh dưới 1024 token, ví dụ:

```json
{
  "event_id": "evt-2026-0912-001",
  "node_id": "A4-02",
  "zone": "Hành lang tầng 4",
  "room": null,
  "hour": 21,
  "series": {
    "smoke": [0.4, 1.2, 3.8, 9.5, 18.0],
    "temp": [26.1, 26.8, 28.9, 32.4, 35.0],
    "co": [6, 9, 22, 60, 110]
  },
  "detection": {"class": "smoke", "conf": 0.87, "frames": 14}
}
```

Output bị grammar khóa cấu trúc:

```json
{"verdict": "chay_that", "confidence": 0.94,
 "explanation": "Khói và CO tăng dần nhất quán theo mẫu âm ỉ bùng phát…",
 "guidance": ["Đi cầu thang bộ bên trái", "Không dùng thang máy", "Không tự dập"]}
```

Không có đầu ra tự do: model không thể trả lời lạc đề, và token verdict luôn ra trước nên độ trễ báo động không phụ thuộc độ dài câu giải thích.

## Khi mất internet

Cổng an toàn và SLM nằm trong tòa nhà nên báo động tại chỗ không phụ thuộc cloud; ESP32 còn tự báo độc lập nếu gateway chết. Cloud chỉ mất phần fanout đa kênh và dashboard, đồng bộ lại khi có mạng. Đây là lý do kiến trúc không đặt SLM lên cloud dù rẻ hơn.
