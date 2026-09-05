import { useMemo, useState } from "react";
import { EVENTS } from "../lib/mockData";
import { VERDICT_LABEL } from "../lib/types";
import type { Verdict } from "../lib/types";

export function History({ openEvent }: { openEvent: (id: string) => void }) {
  const [verdict, setVerdict] = useState<"all" | Verdict>("all");
  const [level, setLevel] = useState<"all" | "cao" | "thap">("all");

  const rows = useMemo(
    () =>
      EVENTS.filter((e) => (verdict === "all" ? true : e.verdict === verdict)).filter((e) =>
        level === "all" ? true : level === "cao" ? e.level >= 2 : e.level < 2,
      ),
    [verdict, level],
  );

  const exportCsv = () => {
    const head = "id,zone,node,ts,level,verdict,confidence,feedback";
    const body = rows.map((e) => [e.id, e.zone, e.nodeId, e.ts, e.level, e.verdict, e.confidence, e.feedback ?? ""].join(","));
    const blob = new Blob([[head, ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fireguard_events.csv";
    a.click();
  };

  return (
    <>
      <h1 className="page-title">Lịch sử sự kiện</h1>
      <p className="page-sub">Bộ lọc và xuất CSV theo mẫu dataset browser của các nền tảng CV.</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <select className="role-sel" value={verdict} onChange={(e) => setVerdict(e.target.value as typeof verdict)}>
          <option value="all">Mọi phán quyết</option>
          <option value="chay_that">Cháy thật</option>
          <option value="lanh_tinh">Lành tính</option>
          <option value="khong_chay">Không cháy</option>
        </select>
        <select className="role-sel" value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
          <option value="all">Mọi mức</option>
          <option value="cao">Mức ≥ 2</option>
          <option value="thap">Mức &lt; 2</option>
        </select>
        <button className="btn" onClick={exportCsv}>Xuất CSV</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>Khu vực</th><th>Node</th><th>Thời gian</th><th>Mức</th><th>Phán quyết</th><th>Độ tin</th><th>Phản hồi</th></tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} onClick={() => openEvent(e.id)} style={{ cursor: "pointer" }}>
                <td className="mono">{e.id}</td>
                <td>{e.zone}</td>
                <td className="mono">{e.nodeId}</td>
                <td className="mono">{e.ts.slice(0, 16).replace("T", " ")}</td>
                <td>{e.level}</td>
                <td>{VERDICT_LABEL[e.verdict]}</td>
                <td className="mono">{(e.confidence * 100).toFixed(0)}%</td>
                <td>{e.feedback === "dung" ? "đúng" : e.feedback === "sai" ? "sai" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
