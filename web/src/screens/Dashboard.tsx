import { DEVICES, EVENTS } from "../lib/mockData";
import { VerdictCard } from "../components/VerdictCard";

export function Dashboard({ openEvent }: { openEvent: (id: string) => void }) {
  const online = DEVICES.filter((d) => d.online).length;
  const alerts24h = EVENTS.filter((e) => e.level >= 1).length;
  return (
    <>
      <h1 className="page-title">Tổng quan</h1>
      <p className="page-sub">Site CC-07 · gateway orin-01 · dữ liệu mẫu minh họa</p>
      <div className="kpis">
        <div className="kpi"><div className="n">{online}/{DEVICES.length}</div><div className="l">nút cảm biến trực tuyến</div></div>
        <div className="kpi"><div className="n">{alerts24h}</div><div className="l">cảnh báo 24 giờ qua</div></div>
        <div className="kpi"><div className="n">0.4</div><div className="l">báo giả / camera / ngày (30 ngày)</div></div>
        <div className="kpi"><div className="n">3.1s</div><div className="l">p95 trễ phán quyết biên</div></div>
      </div>
      <div className="grid2">
        <div className="card">
          <h2>Cảnh báo gần đây</h2>
          {EVENTS.slice(0, 4).map((ev) => (
            <VerdictCard key={ev.id} ev={ev} onClick={() => openEvent(ev.id)} />
          ))}
        </div>
        <div className="card">
          <h2>Sức khỏe thiết bị</h2>
          <div className="body">
            {DEVICES.map((d) => (
              <div key={d.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--haze)" }}>
                <span className={`dot${d.online ? "" : " off"}`} />
                <span className="mono" style={{ width: 70 }}>{d.id}</span>
                <span style={{ flex: 1 }}>{d.zone}</span>
                <span className="note">{d.online ? d.lastSeen : `mất ${d.lastSeen}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
