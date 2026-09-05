# Design System FireGuard

> Category: Public Safety & Smart Building
> Cam lửa trên nền trắng giấy: giao diện phải đọc được trong mười giây đầu của một đêm báo cháy.

## 1. Visual Theme & Atmosphere

Không khí trạm trực cháy: nền trắng giấy mát, chữ than chì, và một màu cam lửa duy nhất dành cho thứ đang cháy hoặc sắp cháy. Mọi thứ khác đứng im để màu cam luôn là tin tức. Bo góc nhỏ 6px, không bóng đổ trang trí, đường kẻ mảnh màu khói.

## 2. Color Palette & Roles

Hệ trung tính lấy từ Anthropic brand-guidelines, cam tách hai bậc rõ ràng:

- `--paper: #faf9f5` nền sáng; `--soot: #141413` chữ và nền hero tối; `--mid: #b0aea5` chữ phụ; `--line: #e8e6dc` đường kẻ.
- `--flame: #d97757` cam thương hiệu: nút chính, nav active, logo, link.
- `--flame-hot: #e8590c` cam lửa: CHỈ dùng cho báo cháy đang hoạt động (banner, mức 3+, glow một lần). Tách bậc này để màu nóng luôn là tin khẩn, không bị loãng thành màu trang trí.
- `--ember: #f7e9e1` nền thẻ cảnh báo và hover; `--blue: #6a9bcc` nhấn phụ; semantic: `--ok #788c5d`, `--warn #a9761f`, `--crit #b3402b`.
- Dark mode đảo trung tính, giữ nguyên hai bậc cam.

## 3. Typography

Theo Anthropic brand-guidelines: Poppins cho tiêu đề và toàn bộ UI (nút, nav, bảng, nhãn), Lora cho văn bản dài (mô tả, giải thích của model, copy landing); cả hai có subset tiếng Việt. Số liệu dùng Poppins với font-variant-numeric tabular-nums, không dùng monospace cho nhãn dữ liệu. Thang chữ: 13.5/14.5/15.5/17/23/27/54; dòng văn bản dài không quá 70 ký tự, Lora line-height 1.65.

## 4. Layout & Spacing

Lưới 12 cột, khoang chứa 1200px, nhịp spacing 4px bội số (8/12/16/24/32). Dashboard ba vùng cố định: dải KPI trên, luồng cảnh báo giữa, lưới thiết bị dưới. Màn hình cư dân chỉ một cột, ba khối câu trả lời xếp dọc.

## 5. Components

Thẻ cảnh báo (verdict, độ tin cậy, chuỗi suy luận gập được, nút xác nhận); tile KPI số lớn mono; hàng thiết bị với chấm trạng thái; banner thoát nạn toàn màn hình cam-trắng; nút phản hồi đúng/sai hai màu tương phản; timeline sự kiện mono.

## 6. Motion & Interaction

Chỉ chuyển động mang tin: banner thoát nạn trượt vào 200ms, chấm trạng thái nhấp nháy 1s khi offline, không animation trang trí. Tôn trọng prefers-reduced-motion.

## 7. Iconography & Imagery

Logo tinh linh lửa: ngọn lửa cam một nét với lõi sáng màu ember và đôi mắt than nhỏ ở tâm, vừa là linh vật vừa là dấu trạng thái (lõi nhấp nháy khi có cảnh báo mức 3+). Bản SVG sống trong `src/components/Logo.tsx`. Icon tuyến tính 1.5px cùng họ; ảnh thật chỉ dùng clip sự kiện có nhãn thời gian, không ảnh stock.

## 8. Voice & Tone

Câu lệnh, không câu cảm thán. Ba câu trả lời đầu dùng động từ mệnh lệnh tiếng Việt: "Đi cầu thang bên trái", "Không dùng thang máy", "Không dập lửa điện bằng nước". Phần giải thích của model luôn gắn nhãn "Nhận định của AI, có thể sai".

## 9. Edge Cases & Variations

Mất kết nối: thẻ thiết bị chuyển chấm xám kèm thời điểm cuối nhìn thấy. SLM trễ: hiển thị phán quyết cứng từ cổng an toàn trước, giải thích AI điền sau. Người dùng khiếm thị: banner thoát nạn có bản đọc màn hình ưu tiên và rung thiết bị.
