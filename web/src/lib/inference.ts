/**
 * RANH GIỚI ADAPTER — yêu cầu "sau này có model chỉ cần thêm vào sau".
 *
 * Mọi màn hình chỉ được lấy phán quyết qua InferenceAdapter, không gọi thẳng
 * model hay hard-code kết quả. Hiện tại MockAdapter giữ cho UI chạy được;
 * khi SLM thật sẵn sàng, bật chế độ Live trong màn hình "Model & Adapter":
 * ApiAdapter sẽ POST gói ngữ cảnh tới FastAPI gateway (hợp đồng ở cuối file).
 */
import type { SensorSeries, Verdict } from "./types";

export interface VerdictContext {
  eventId: string;
  nodeId: string;
  zone: string;
  series: SensorSeries;
  room?: string;
  hour?: number;
}

export interface VerdictResult {
  verdict: Verdict;
  confidence: number;
  explanation: string;
  source: string; // tên adapter, hiện trên UI để người dùng biết ai phán quyết
}

export interface InferenceAdapter {
  readonly name: string;
  getVerdict(ctx: VerdictContext): Promise<VerdictResult>;
}

/** Giả lập tất định theo eventId để UI ổn định khi chưa có model thật. */
export class MockAdapter implements InferenceAdapter {
  readonly name = "MockAdapter (chưa có model)";

  async getVerdict(ctx: VerdictContext): Promise<VerdictResult> {
    await new Promise((r) => setTimeout(r, 350)); // mô phỏng trễ suy luận
    const peakSmoke = Math.max(...ctx.series.smoke);
    const rise = ctx.series.temp[ctx.series.temp.length - 1] - ctx.series.temp[0];
    if (peakSmoke >= 15 || rise >= 8) {
      return {
        verdict: "chay_that",
        confidence: 0.92,
        explanation:
          "Khói vượt 15%/m và nhiệt tăng nhanh khớp động học cháy âm ỉ bùng phát; không khớp mẫu nấu ăn hay nhang.",
        source: this.name,
      };
    }
    if (peakSmoke >= 3) {
      return {
        verdict: "lanh_tinh",
        confidence: 0.81,
        explanation: "Khói thoáng rồi tắt, nhiệt ổn định; khớp mẫu nấu ăn hoặc hơi nước.",
        source: this.name,
      };
    }
    return {
      verdict: "khong_chay",
      confidence: 0.88,
      explanation: "Không có tiến triển đa phương thức nhất quán; nhiều khả năng bụi hoặc sương.",
      source: this.name,
    };
  }
}

/**
 * Hợp đồng API cho model thật (FastAPI gateway, pha 4):
 *   POST {endpoint}/api/v1/verdict
 *   body:  { event_id, node_id, zone, room, hour,
 *            series: { smoke: number[], temp: number[], co: number[] } }
 *   resp:  { verdict: "chay_that"|"lanh_tinh"|"khong_chay",
 *            confidence: number, explanation: string }
 * Token đầu tiên của SLM là verdict (constrained decoding), nên p95 < 5s.
 */
export class ApiAdapter implements InferenceAdapter {
  readonly name: string;
  constructor(private endpoint: string) {
    this.name = `Live API (${endpoint})`;
  }

  async getVerdict(ctx: VerdictContext): Promise<VerdictResult> {
    const res = await fetch(`${this.endpoint.replace(/\/$/, "")}/api/v1/verdict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ctx),
    });
    if (!res.ok) throw new Error(`Gateway trả về ${res.status} — kiểm tra model đã nạp chưa.`);
    const data = (await res.json()) as Omit<VerdictResult, "source">;
    return { ...data, source: this.name };
  }
}

export type AdapterMode = "mock" | "live";

export function loadAdapter(): { mode: AdapterMode; adapter: InferenceAdapter } {
  const mode = (localStorage.getItem("fg.adapter") ?? "mock") as AdapterMode;
  const endpoint = localStorage.getItem("fg.endpoint") ?? "http://gateway.local:8000";
  return { mode, adapter: mode === "live" ? new ApiAdapter(endpoint) : new MockAdapter() };
}

export function saveAdapter(mode: AdapterMode, endpoint: string): void {
  localStorage.setItem("fg.adapter", mode);
  localStorage.setItem("fg.endpoint", endpoint);
}
