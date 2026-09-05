import { useState } from "react";
import { Sparkline } from "../components/Sparkline";
import { loadAdapter } from "../lib/inference";
import type { VerdictResult } from "../lib/inference";
import { EVENTS } from "../lib/mockData";
import { VERDICT_LABEL } from "../lib/types";

export function EventDetail({ id, back }: { id: string; back: () => void }) {
  const ev = EVENTS.find((e) => e.id === id);
  const [rerun, setRerun] = useState<VerdictResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!ev) return <p>Sự kiện không tồn tại. <button className="btn small" onClick={back}>Quay lại</button></p>;

  const { adapter } = loadAdapter();
  const runVerdict = async () => {
    setBusy(true);
    setErr(null);
    try {
      setRerun(await adapter.getVerdict({ eventId: ev.id, nodeId: ev.nodeId, zone: ev.zone, series: ev.series }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button className="btn small" onClick={back}>← Danh sách</button>
      <h1 className="page-title" style={{ marginTop: 10 }}>Sự kiện {ev.id}</h1>
      <p className="page-sub">{ev.zone} · node {ev.nodeId} · {ev.ts}</p>

      <div className="grid2">
        <div className="card">
          <h2>Bằng chứng đa phương thức</h2>
          <div className="body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "var(--mist)", border: "1px dashed var(--haze)", borderRadius: "var(--radius)", padding: 26, textAlign: "center", color: "var(--smoke)" }}>
              Clip 8s từ camera {ev.nodeId} (chỗ giữ cho player thật ở pha 4)
            </div>
            <Sparkline data={ev.series.smoke} label="Khói %/m" />
            <Sparkline data={ev.series.temp} color="var(--warn)" label="Nhiệt °C" />
            <Sparkline data={ev.series.co} color="var(--crit)" label="CO ppm" />
          </div>
        </div>

        <div>
          <div className="card">
            <h2>Phán quyết đã phát</h2>
            <div className="body">
              <p style={{ margin: "0 0 6px" }}>
                <strong>{VERDICT_LABEL[ev.verdict]}</strong> · mức {ev.level} · độ tin {(ev.confidence * 100).toFixed(0)}%
              </p>
              <p className="why">{ev.explanation}</p>
              <p className="ai-note">
                {ev.safetyGateTriggered ? "Cổng an toàn tất định đã xác nhận độc lập (cảm biến vượt ngưỡng chứng nhận)." : "Chưa chạm ngưỡng cổng an toàn; phán quyết thuần từ model."}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn small">Đúng</button>
                <button className="btn small">Sai</button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Chạy lại phán quyết qua adapter</h2>
            <div className="body">
              <p className="note">
                Nút này gọi đúng ranh giới InferenceAdapter mà mọi màn hình dùng. Khi SLM thật được nạp vào gateway, kết quả ở đây đổi sang model thật mà không sửa dòng UI nào.
              </p>
              <button className="btn primary" onClick={runVerdict} disabled={busy}>
                {busy ? "Đang hỏi model…" : "Chạy lại phán quyết"}
              </button>
              {rerun && (
                <p style={{ marginTop: 10 }}>
                  <strong>{VERDICT_LABEL[rerun.verdict]}</strong> · {(rerun.confidence * 100).toFixed(0)}% · <span className="tag">{rerun.source}</span>
                  <br />
                  <span className="why">{rerun.explanation}</span>
                </p>
              )}
              {err && <p className="why" style={{ color: "var(--crit)" }}>{err}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
