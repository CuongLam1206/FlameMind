import { useState } from "react";
import { loadAdapter, saveAdapter } from "../lib/inference";
import type { AdapterMode, VerdictResult } from "../lib/inference";
import { EVENTS, MODELS } from "../lib/mockData";
import { VERDICT_LABEL } from "../lib/types";

/** Màn hình then chốt của yêu cầu "có model chỉ cần thêm vào sau": đổi adapter là đổi model. */
export function Models() {
  const initial = loadAdapter();
  const [mode, setMode] = useState<AdapterMode>(initial.mode);
  const [endpoint, setEndpoint] = useState(localStorage.getItem("fg.endpoint") ?? "http://gateway.local:8000");
  const [test, setTest] = useState<VerdictResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = () => {
    saveAdapter(mode, endpoint);
    setTest(null);
    setErr(null);
  };

  const runTest = async () => {
    setBusy(true);
    setErr(null);
    setTest(null);
    const { adapter } = loadAdapter();
    const ev = EVENTS[0];
    try {
      setTest(await adapter.getVerdict({ eventId: ev.id, nodeId: ev.nodeId, zone: ev.zone, series: ev.series }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="page-title">Model &amp; Adapter</h1>
      <p className="page-sub">
        Ranh giới InferenceAdapter: toàn bộ app chỉ hỏi phán quyết qua adapter. Model thật xong thì bật Live và trỏ endpoint về gateway FastAPI, không sửa màn hình nào.
      </p>

      <div className="card">
        <h2>Registry model (đối chiếu models/registry.md)</h2>
        <table className="tbl">
          <thead>
            <tr><th>Tag</th><th>Nền</th><th>Quant</th><th>Verdict acc</th><th>mAP50</th><th>FAR/ngày</th><th>Thiết bị</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {MODELS.map((m) => (
              <tr key={m.tag}>
                <td className="mono">{m.tag}</td>
                <td>{m.base}</td>
                <td className="mono">{m.quant}</td>
                <td className="mono">{m.verdictAcc ?? "—"}</td>
                <td className="mono">{m.map50 ?? "—"}</td>
                <td className="mono">{m.farPerDay ?? "—"}</td>
                <td>{m.device}</td>
                <td>{m.live ? <span className="tag live">đang chạy biên</span> : <span className="tag">chờ gate</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Adapter suy luận đang dùng</h2>
        <div className="body">
          <div className="field">
            <label>Chế độ</label>
            <select className="role-sel" value={mode} onChange={(e) => setMode(e.target.value as AdapterMode)}>
              <option value="mock">Mock — chưa có model, UI chạy dữ liệu mẫu</option>
              <option value="live">Live — gọi SLM thật qua gateway FastAPI</option>
            </select>
          </div>
          <div className="field">
            <label>Endpoint gateway (chỉ dùng ở chế độ Live)</label>
            <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="http://gateway.local:8000" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn primary" onClick={apply}>Lưu cấu hình adapter</button>
            <button className="btn" onClick={runTest} disabled={busy}>{busy ? "Đang test…" : "Test kết nối + phán quyết thử"}</button>
          </div>
          {test && (
            <p style={{ marginTop: 10 }}>
              Kết quả: <strong>{VERDICT_LABEL[test.verdict]}</strong> · {(test.confidence * 100).toFixed(0)}% · <span className={`tag ${mode === "live" ? "live" : "mock"}`}>{test.source}</span>
              <br />
              <span className="why">{test.explanation}</span>
            </p>
          )}
          {err && <p className="why" style={{ color: "var(--crit)", marginTop: 10 }}>{err}</p>}
          <p className="note" style={{ marginTop: 10 }}>
            Hợp đồng API: POST /api/v1/verdict với gói ngữ cảnh (series khói/nhiệt/CO + siêu dữ liệu cảnh); response gồm verdict, confidence, explanation. Token đầu tiên của SLM là verdict nhờ constrained decoding.
          </p>
        </div>
      </div>
    </>
  );
}
