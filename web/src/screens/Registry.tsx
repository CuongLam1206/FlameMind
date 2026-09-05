import { useEffect, useState } from "react";

interface ModelEntry {
  tag: string;
  base: string;
  quant: string;
  stage: string;
  metrics: Record<string, number | null>;
  dvc_data_tag: string | null;
  mlflow_run_id: string | null;
  note: string;
}
interface DatasetEntry {
  name: string;
  card: number;
  role: string;
  dvc_tag: string | null;
  status: string;
  priority: string;
}
interface Registry {
  updated_at: string;
  mlflow_tracking_uri: string;
  models: ModelEntry[];
  datasets: DatasetEntry[];
}

/** Màn hình theo dõi vòng đời: model từ MLflow registry, dataset từ DVC, qua registry.json. */
export function Registry() {
  const [reg, setReg] = useState<Registry | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<"models" | "datasets">("models");

  useEffect(() => {
    fetch("/registry.json")
      .then((r) => {
        if (!r.ok) throw new Error(`registry.json trả về ${r.status}`);
        return r.json() as Promise<Registry>;
      })
      .then(setReg)
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)));
  }, []);

  if (err) {
    return (
      <>
        <h1 className="page-title">Registry dữ liệu và model</h1>
        <p className="why">Không đọc được registry.json: {err}. Chạy `python scripts/sync_registry.py` từ thư mục fireguard rồi tải lại trang.</p>
      </>
    );
  }
  if (!reg) return <p className="page-sub">Đang đọc registry…</p>;

  return (
    <>
      <h1 className="page-title">Registry dữ liệu và model</h1>
      <p className="page-sub">
        Nguồn sống là MLflow experiment fireguard và DVC; màn hình này chỉ đọc bản xuất registry.json, cập nhật ngày {reg.updated_at}. Thao tác ghi làm trong MLflow UI hoặc bằng script train.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`btn small${tab === "models" ? " primary" : ""}`} onClick={() => setTab("models")}>Model ({reg.models.length})</button>
        <button className={`btn small${tab === "datasets" ? " primary" : ""}`} onClick={() => setTab("datasets")}>Dataset ({reg.datasets.length})</button>
      </div>

      {tab === "models" ? (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Tag</th><th>Nền</th><th>Quant</th><th>Verdict acc</th><th>mAP50</th><th>FAR/ngày</th><th>Dữ liệu (DVC)</th><th>MLflow run</th><th>Ghi chú</th></tr>
            </thead>
            <tbody>
              {reg.models.map((m) => (
                <tr key={m.tag}>
                  <td><strong>{m.tag}</strong></td>
                  <td>{m.base}</td>
                  <td>{m.quant}</td>
                  <td>{m.metrics.verdict_acc ?? m.metrics.map50_dfire ?? "—"}</td>
                  <td>{m.metrics.map50_msfsdb ?? "—"}</td>
                  <td>{m.metrics.far_per_day ?? "—"}</td>
                  <td>{m.dvc_data_tag ?? <span className="tag">chưa gắn</span>}</td>
                  <td>{m.mlflow_run_id ?? <span className="tag">chưa có run</span>}</td>
                  <td className="note">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Dataset</th><th>Card</th><th>Vai trò</th><th>Ưu tiên lộ trình</th><th>DVC tag</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {reg.datasets.map((d) => (
                <tr key={d.name}>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.card}</td>
                  <td>{d.role}</td>
                  <td>{d.priority}</td>
                  <td>{d.dvc_tag ?? <span className="tag">chưa tag</span>}</td>
                  <td>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="note">
        Quy ước: mỗi run train ghi tham số dvc_data_tag để nối model với đúng phiên bản dữ liệu; muốn xem biểu đồ loss và so sánh run, mở MLflow UI tại {reg.mlflow_tracking_uri}.
      </p>
    </>
  );
}
