# Kiến trúc hệ thống FireGuard SLM

> Khuôn mẫu theo awesome-architecture (template iot-platform + inference-serving + embedded-device).
> Đại diện tham chiếu: ThingsBoard/EMQX cho tầng IoT, llama.cpp cho suy luận biên, Home Assistant cho tích hợp nhà thông minh.
> Định nghĩa một câu: **FireGuard là một gateway IoT có bộ não phán quyết chạy tại biên: thiết bị cảm biến báo sự kiện, gateway ghép đa phương thức và hỏi SLM chuyên biệt, cloud giữ shadow, cảnh báo và web app cho hàng nghìn người dùng.**

## 1. Yêu cầu chức năng

- [ ] Nút biên gửi telemetry cảm biến (khói, nhiệt, CO) và trạng thái camera qua MQTT
- [ ] Detector thường trực trên nút biên phát sự kiện nghi ngờ kèm trích đoạn clip
- [ ] Gateway ghép gói ngữ cảnh (đặc trưng clip + chuỗi cảm biến + siêu dữ liệu cảnh) và gọi SLM phán quyết
- [ ] SLM trả token phán quyết đầu tiên (constrained decoding) rồi stream giải thích và hướng dẫn
- [ ] Cổng an toàn tất định phát cảnh báo độc lập khi cảm biến vượt ngưỡng chứng nhận
- [ ] Device shadow: cloud giữ gương trạng thái mỗi nút, app đọc shadow không đọc thiết bị
- [ ] Cảnh báo đa kênh theo mức: cư dân, quản lý, trung tâm, escalation 114 khi không ai xác nhận
- [ ] Web app ba vai và màn hình phản hồi đúng/sai nuôi flywheel
- [ ] OTA cấu hình và trọng số detector theo lô có circuit-breaker

## 2. Chất lượng thuộc tính và ràng buộc đỏ

| Chất lượng | Mục tiêu | Vì sao sống còn |
|---|---|---|
| Trễ phán quyết biên | ≤5s Orin Nano, ≤10s RPi5 (p95) | Cảnh báo chậm vô nghĩa |
| Báo động giả | ≤1 lần/camera/ngày trên tập nhiễu khó | Báo giả giết niềm tin, người dùng tắt hệ thống |
| An toàn im lặng | 0 lần bỏ qua sự kiện vượt ngưỡng chứng nhận | Đường đỏ pháp lý và đạo đức |
| Kết nối yếu | Mất mạng cloud không làm mất cảnh báo tại chỗ | Offline là bình thường, không phải ngoại lệ (iot-platform) |
| Scale web | 1.000 user đồng thời, API stateless ngang | Yêu cầu đề bài hàng nghìn user |
| Riêng tư | Video thô không rời gateway; cloud chỉ nhận nhãn và trọng số | Consent pilot |

🔴 Ràng buộc đỏ: thiết bị biên tài nguyên nhỏ nên SLM chỉ chạy sau kích hoạt; 🔴 một khóa MQTT mỗi nút, thu hồi đơn lẻ; 🔴 SLM không bao giờ là cổng an toàn duy nhất; 🔴 VRAM/RAM biên là trần cứng, chọn model theo trần chứ không theo sở thích.

## 3. Toàn cảnh

```
 Nút biên (mỗi khu vực)                      Gateway tòa nhà (Jetson/miniPC)
 ┌──────────────────────────────┐           ┌──────────────────────────────────────┐
 │ Cảm biến khói/nhiệt/CO ──┐   │           │ Gói ngữ cảnh: đặc trưng clip         │
 │ Camera + detector YOLO   │   │  MQTT TLS │  + chuỗi cảm biến + siêu dữ liệu     │
 │  thường trực (ONNX/NCNN) │   │ ─────────▶│          │                           │
 │ Safety threshold cục bộ ─┼───┼───┐       │          ▼                           │
 └──────────────────────────────┘   │       │  SLM GGUF 4-bit (llama.cpp)          │
                                    │       │  token1=phán quyết → stream giải thích│
                                    │       │          │                           │
                                    │       │          ▼                           │
                                    └──────▶│ CỔNG AN TOÀN TẤT ĐỊNH (luôn thắng)   │
                                            │          │ mức cảnh báo              │
                                            └──────────┼───────────────────────────┘
                                                       ▼ MQTT lên cloud
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │ Cloud: message bus → device shadow registry → rule engine escalation          │
 │   → notification fan-out (app/SMS/email) → API stateless → web app 3 vai      │
 │   → kho clip sự kiện (object storage) → pipeline nhãn flywheel → DVC registry │
 └───────────────────────────────────────────────────────────────────────────────┘
```

Linh hồn theo đúng template iot-platform: **ứng dụng không nói chuyện với thiết bị, mọi thao tác trạng thái đi qua shadow**; và theo inference-serving: **token phán quyết ra trước, giải thích stream sau** để trễ cảnh báo không phụ thuộc độ dài câu chữ.

## 4. Trách nhiệm thành phần

- **Detector biên**: luôn bật, mili giây, vài watt; chỉ gửi sự kiện và clip 5–10 giây; xuất ONNX/NCNN.
- **SLM phán quyết biên**: Qwen2.5-1.5B/3B QLoRA→GGUF Q4_K_M; đầu vào gói ngữ cảnh dạng JSON + embedding clip; đầu ra JSON có lược đồ cố định.
- **Cổng an toàn tất định**: hàm thuần trong `src/fireguard/agent/safety.py`, không trạng thái, không model; test đơn vị bắt buộc.
- **Device shadow registry**: JSON reported/desired mỗi nút; app đọc shadow.
- **Rule engine escalation**: mức 1 cư dân, mức 2 quản lý, mức 3 trung tâm, mức 4 gọi 114 tự động khi hết hạn xác nhận.
- **Web app**: ba vai; màn hình cảnh báo chỉ ba câu trả lời lớn (cháy thật không, đi hướng nào, có được dập không).
- **Flywheel pipeline**: nhãn đúng/sai → lô fine-tune định kỳ → model registry phiên bản mới → OTA trọng số detector và cập nhật SLM gateway theo lô. Giao thức dữ liệu và benchmark xem [data-cards.md](../03-data/data-cards.md).

## 5. Luồng dữ liệu chính

1. **Telemetry**: cảm biến → MQTT topic `site/{site}/node/{id}/tele` → shadow + TSDB; chu kỳ 5 giây, sự kiện tức thời.
2. **Kích hoạt phán quyết**: detector ≥ ngưỡng mềm → clip lên gateway → gói ngữ cảnh → SLM → mức cảnh báo → cổng an toàn OR logic → fan-out.
3. **Flywheel**: phản hồi người dùng → object storage nhãn → script `scripts/build_scenarios.py` trộn vào lô huấn luyện kế tiếp → DVC tag model mới.

## 6. ADR (Architecture Decision Records)

- **ADR-0001 Cascade, không LLM liên tục.** Lý do: ngân sách watt và trễ; thay thế bị bác: VLM xem video liên tục (đo thực tế vượt 10W và giật frame).
- **ADR-0002 Nền SLM Qwen2.5-1.5B/3B-Instruct.** Lý do: hỗ trợ tiếng Việt tốt trong họ model cùng cỡ, giấy phép cho nghiên cứu; thay thế bị bác: Llama-3.2 (tiếng Việt yếu hơn), Gemma (kém hơn trên benchmark nội bộ thử nhanh).
- **ADR-0003 Cổng an toàn tất định thắng SLM.** Lý do: đường đỏ CONSTRAINTS mục 5; không có thay thế được chấp nhận.
- **ADR-0004 Git cho code và docs, DVC cho data và models, experiment log cho mỗi lần chạy.** Lý do: yêu cầu quản lý phiên bản model/data của đề bài; thay thế bị bác: MLflow artifacts đơn thuần (không phiên bản dataset reproducible được).
- **ADR-0005 Web stack: FastAPI + Postgres(Timescale) + MQTT broker + frontend Vite/React theo design system open-design cam-trắng.** Lý do: một ngôn ngữ Python xuyên suốt huấn luyện lẫn API; scale ngang bằng API stateless.
- **ADR-0006 Web app chỉ lấy phán quyết qua ranh giới InferenceAdapter.** MockAdapter nuôi UI trước gate G3; ApiAdapter gọi POST /api/v1/verdict của gateway FastAPI khi SLM thật sẵn sàng (hợp đồng ghi trong `web/src/lib/inference.ts`). Lý do: yêu cầu "có model chỉ cần thêm vào sau"; thay thế bị bác: gọi thẳng endpoint từ component (ghép cứng UI vào model, đổi model phải sửa màn hình).
