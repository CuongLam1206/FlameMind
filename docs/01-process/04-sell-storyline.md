# 04 · SELL — Storyline bảo vệ đề tài và khung bài báo quốc tế

> Bước SELL của 4S: giải pháp tốt phải được kể như một câu chuyện, kết luận trước, bằng chứng sau (Pyramid Principle). Tài liệu này dùng cho ba khán giả: hội đồng NCKH, reviewer hội nghị quốc tế, và đối tác pilot.

## Pyramid: thông điệp lõi và ba luận điểm đỡ

**Core message (nói trước tiên, một câu):** Một model ngôn ngữ nhỏ được fine-tune chuyên biệt cho phán quyết cháy, chạy trên thiết bị biên giá rẻ, phát hiện sớm hơn và báo giả ít hơn hệ đơn cảm biến hiện hành, đồng thời nói cho người trong tòa nhà biết phải làm gì — và toàn bộ được chứng minh bằng benchmark quốc tế chứ không bằng số tự công bố.

- **Key line 1 (khoa học):** Phán quyết cháy là bài toán suy luận ngữ cảnh đa phương thức, không phải bài toán nhận diện ảnh; đóng góp là SLM phán quyết huấn luyện bằng kịch bản động học cháy chưng cất suy luận, đạt ≥85% trên held-out MmodalFire và vượt baseline fusion MAFF-Net trên cùng giao thức.
  - Evidence: bảng ablation E3–E5; so sánh MAFF-Net chạy lại bằng harness của ta; số liệu FAR trên tập nhiễu khó.
- **Key line 2 (hệ thống):** Cascade detector thường trực cộng SLM sau kích hoạt giữ phán quyết dưới 5 giây và dưới 10 watt ở biên, còn cổng an toàn tất định bảo đảm hệ không bao giờ im lặng khi cảm biến vượt ngưỡng chứng nhận.
  - Evidence: đo p95 latency và watt trên Jetson Orin Nano và RPi5 thật; test E7 xanh 100%.
- **Key line 3 (xã hội):** Sản phẩm trả lời đúng khoảng trống sau Khương Hạ: chung cư mini và nhà trọ không thiếu camera, họ thiếu một hệ hiểu ngữ cảnh và biết hướng dẫn thoát nạn bằng tiếng của họ.
  - Evidence: thống kê cháy 2026, khảo sát pilot 50 người dùng, thời gian hiểu đúng hướng thoát đo bằng prototype.

## Storyline bảo vệ trước hội đồng (thứ tự slide)

1. Executive summary: core message cộng ba con số cam kết (85%, 1 báo giả/ngày, 5 giây).
2. Situation: cháy nhà ở Việt Nam và giới hạn đầu báo đơn cảm biến.
3. Complication: hệ AI hiện tại nhìn thấy lửa nhưng không hiểu ngữ cảnh, và báo giả giết niềm tin; model lớn thì không chạy nổi ở biên.
4. Solution: kiến trúc ba tầng edge-gateway-cloud với SLM phán quyết và cổng an toàn; sơ đồ một trang theo [architecture.md](../02-architecture/architecture.md).
5. Action plan: năm pha năm gate của [03-solve-roadmap.md](03-solve-roadmap.md), nêu thẳng quy tắc pivot để hội đồng thấy rủi ro đã được quản lý trước.
6. Appendix: thẻ dữ liệu, danh sách paper đã xác thực, dự trù chi phí.

## Khung bài báo quốc tế (IMRaD mapping)

- **Introduction:** khoảng trống "phát hiện thì đủ, phán quyết thì thiếu"; trích khảo cứu Cheng 2024 và khoảng trống benign flames của Ali & Ghodrat 2025.
- **Related work:** ba nhóm: video fire detection (Gragnaniello 2025, FireVideoNet), multimodal fusion (MmodalFire Jia 2026, MAFF-Net Liang 2026), edge SLM và agentic safety (SimuHome, recoverable execution).
- **Method:** bộ sinh kịch bản động học cháy; chưng cất CoT; QLoRA SLM; constrained decoding token phán quyết đầu; cổng an toàn tất định.
- **Experiments:** giao thức khóa trước; bảng so sánh bốn baseline trên MS-FSDB, MmodalFire held-out, tập nhiễu khó; ablation bốn trục; đo biên thật.
- **Deployment & dataset:** mô tả pilot, model card, phát hành mở; phần này là điểm khác biệt với mọi paper thuần mô phỏng.
- **Limitations nêu thẳng:** chưa phủ cháy ngoài trời, pilot cỡ nhỏ, hướng dẫn thoát nạn chưa kiểm chứng bằng diễn tập thật.

## Nguyên tắc kể chuyện

Không mở đầu bằng công nghệ; mở đầu bằng 56 người ở Khương Hạ và một câu hỏi: vì sao chuông báo cháy không cứu được họ. Kết thúc bằng đúng một yêu cầu hoặc một tuyên bố: gate tiếp theo và con số sẽ chứng minh nó.
