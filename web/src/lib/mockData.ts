import type { DeviceNode, FireEvent, ModelVersion } from "./types";

function curve(peak: number, tau: number, base = 0): number[] {
  return Array.from({ length: 60 }, (_, t) => +(base + peak * (1 - Math.exp(-t / tau))).toFixed(2));
}

export const EVENTS: FireEvent[] = [
  {
    id: "evt-2026-0912-001",
    nodeId: "A4-02",
    zone: "Hành lang tầng 4",
    ts: "2026-09-12T21:14:07+07:00",
    level: 3,
    verdict: "chay_that",
    confidence: 0.94,
    evidence: ["khói 18%/m tăng đều 90s", "nhiệt +9°C/phút", "CO 110ppm", "clip khớp động học âm ỉ-bùng"],
    explanation:
      "Chuỗi đa phương thức tiến triển nhất quán theo mẫu cháy âm ỉ rồi bùng phát; loại trừ nấu ăn và nhang vì tốc độ tăng nhiệt và CO vượt xa mẫu lành tính.",
    series: { smoke: curve(18, 22), temp: curve(34, 40, 26), co: curve(110, 30) },
    safetyGateTriggered: true,
    feedback: null,
  },
  {
    id: "evt-2026-0912-002",
    nodeId: "B12-08",
    zone: "Bếp căn 12-08",
    ts: "2026-09-12T18:42:51+07:00",
    level: 1,
    verdict: "lanh_tinh",
    confidence: 0.86,
    evidence: ["khói thoáng 4%/m rồi tắt", "nhiệt ổn định 34°C", "CO 12ppm"],
    explanation: "Khói xuất hiện ngắn trong khung giờ nấu ăn, không có tiến triển nhiệt và CO; khớp mẫu nấu ăn.",
    series: { smoke: curve(4, 8), temp: curve(8, 30, 26), co: curve(12, 20) },
    safetyGateTriggered: false,
    feedback: "dung",
  },
  {
    id: "evt-2026-0911-014",
    nodeId: "F2-01",
    zone: "Ban thờ căn 02-05",
    ts: "2026-09-11T07:05:33+07:00",
    level: 1,
    verdict: "lanh_tinh",
    confidence: 0.9,
    evidence: ["khói 2.5%/m", "nhiệt 29°C", "khung giờ thắp nhang sáng"],
    explanation: "Khói mật độ thấp, ổn định, khớp mẫu nhang tại vị trí ban thờ đã khai báo.",
    series: { smoke: curve(2.5, 12), temp: curve(3, 25, 26), co: curve(9, 18) },
    safetyGateTriggered: false,
    feedback: "dung",
  },
  {
    id: "evt-2026-0910-007",
    nodeId: "C3-01",
    zone: "Kho tầng hầm",
    ts: "2026-09-10T15:03:12+07:00",
    level: 0,
    verdict: "khong_chay",
    confidence: 0.77,
    evidence: ["bụi bốc khi nhập hàng", "không tăng nhiệt", "CO 4ppm"],
    explanation: "Đỉnh khói ngắn không kèm tiến triển nhiệt hay CO; khớp mẫu bụi, không phát cảnh báo.",
    series: { smoke: curve(6, 4), temp: curve(1, 20, 26), co: curve(4, 15) },
    safetyGateTriggered: false,
    feedback: "sai",
  },
  {
    id: "evt-2026-0909-003",
    nodeId: "D1-01",
    zone: "Sảnh tầng 1",
    ts: "2026-09-09T06:12:40+07:00",
    level: 0,
    verdict: "khong_chay",
    confidence: 0.83,
    evidence: ["sương sáng 5%/m", "nhiệt 26°C", "CO 3ppm"],
    explanation: "Độ che mờ lan tỏa chậm đều khắp khung hình, không nguồn điểm; khớp mẫu sương.",
    series: { smoke: curve(5, 30), temp: curve(0.5, 30, 26), co: curve(3, 20) },
    safetyGateTriggered: false,
    feedback: null,
  },
];

export const DEVICES: DeviceNode[] = [
  { id: "A4-02", zone: "Hành lang tầng 4", kinds: ["khói", "nhiệt", "CO", "cam"], online: true, lastSeen: "5s", shadow: { reported: { smoke: 1.2, temp: 27.4, co: 6 }, desired: { interval_s: 5 }, fw: "det-1.3.1" } },
  { id: "B12-08", zone: "Bếp căn 12-08", kinds: ["khói", "cam"], online: true, lastSeen: "5s", shadow: { reported: { smoke: 0.8, temp: 33.9 }, desired: { interval_s: 5 }, fw: "det-1.3.1" } },
  { id: "C3-01", zone: "Kho tầng hầm", kinds: ["khói", "nhiệt"], online: false, lastSeen: "6 phút", shadow: { reported: { smoke: 0.4, temp: 25.1 }, desired: { interval_s: 5 }, fw: "det-1.2.9" } },
  { id: "D1-01", zone: "Sảnh tầng 1", kinds: ["cam", "loa"], online: true, lastSeen: "5s", shadow: { reported: { motion: false }, desired: { volume: 70 }, fw: "cam-2.0.4" } },
  { id: "F2-01", zone: "Ban thờ căn 02-05", kinds: ["khói"], online: true, lastSeen: "5s", shadow: { reported: { smoke: 2.1 }, desired: { benign_source: "nhang" }, fw: "det-1.3.1" } },
  { id: "E5-04", zone: "Sân thượng", kinds: ["cam"], online: false, lastSeen: "2 ngày", shadow: { reported: {}, desired: {}, fw: "cam-2.0.4", note: "bảo trì" } },
];

export const MODELS: ModelVersion[] = [
  { tag: "det-1.3.1", base: "YOLOv11n", quant: "ONNX/NCNN", verdictAcc: null, map50: 0.81, farPerDay: null, device: "RPi5 + ESP32", date: "2026-10 (dự kiến G1)", live: true },
  { tag: "slm-0.4.2", base: "Qwen2.5-1.5B-Instruct", quant: "GGUF Q4_K_M", verdictAcc: 0.83, map50: null, farPerDay: 0.6, device: "Jetson Orin Nano", date: "chờ G3", live: false },
  { tag: "slm-1.0.0", base: "Qwen2.5-3B-Instruct", quant: "GGUF Q4_K_M", verdictAcc: null, map50: null, farPerDay: null, device: "Jetson Orin Nano", date: "mục tiêu G3 ≥0.85", live: false },
];

export const DEFAULT_THRESHOLDS = {
  smoke_obs_per_m: 15,
  temperature_c: 60,
  co_ppm: 100,
  rate_of_rise_c_per_min: 8,
};
