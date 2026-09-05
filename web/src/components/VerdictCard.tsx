import type { FireEvent } from "../lib/types";
import { VERDICT_LABEL } from "../lib/types";

const LV_CLASS: Record<number, string> = { 0: "mute", 1: "ok", 2: "mid", 3: "", 4: "" };
const LV_TEXT: Record<number, string> = { 0: "IM LẶNG", 1: "MỨC 1", 2: "MỨC 2", 3: "MỨC 3", 4: "MỨC 4" };

export function VerdictCard({ ev, onClick }: { ev: FireEvent; onClick?: () => void }) {
  return (
    <div className={`alert-row${ev.level >= 3 ? " crit" : ""}`} onClick={onClick} role="button" tabIndex={0}>
      <div className="top">
        <span className={`lv ${LV_CLASS[ev.level]}`}>{LV_TEXT[ev.level]}</span>
        <span className="t">
          {VERDICT_LABEL[ev.verdict]} · {ev.zone} · node {ev.nodeId}
        </span>
        <span className="time mono">{ev.ts.slice(11, 19)}</span>
      </div>
      <div className="why">Bằng chứng: {ev.evidence.join(" · ")}</div>
      {ev.level >= 3 && (
        <div className="guide">
          <span>Đi cầu thang bộ bên trái.</span>
          <span>Không dùng thang máy.</span>
        </div>
      )}
      <div className="ai-note">
        Nhận định của AI (độ tin {(ev.confidence * 100).toFixed(0)}%), có thể sai
        {ev.safetyGateTriggered ? " · cổng an toàn đã xác nhận độc lập" : ""}
        {ev.feedback ? ` · người dùng phản hồi: ${ev.feedback === "dung" ? "đúng" : "sai"}` : ""}
      </div>
    </div>
  );
}
