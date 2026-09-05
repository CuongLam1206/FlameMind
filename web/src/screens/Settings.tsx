import { useState } from "react";
import { DEFAULT_THRESHOLDS } from "../lib/mockData";

export function Settings() {
  const [th, setTh] = useState(() => {
    const raw = localStorage.getItem("fg.thresholds");
    return raw ? (JSON.parse(raw) as typeof DEFAULT_THRESHOLDS) : DEFAULT_THRESHOLDS;
  });
  const [channels, setChannels] = useState<string[]>(() => {
    const raw = localStorage.getItem("fg.channels");
    return raw ? (JSON.parse(raw) as string[]) : ["app", "sms"];
  });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof DEFAULT_THRESHOLDS, v: number) => setTh({ ...th, [k]: v });
  const toggle = (c: string) =>
    setChannels(channels.includes(c) ? channels.filter((x) => x !== c) : [...channels, c]);

  const save = () => {
    localStorage.setItem("fg.thresholds", JSON.stringify(th));
    localStorage.setItem("fg.channels", JSON.stringify(channels));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <>
      <h1 className="page-title">Cài đặt an toàn và escalation</h1>
      <p className="page-sub">
        Ngưỡng dưới đây là cổng an toàn tất định: vượt ngưỡng là báo, bất kể model nói gì. Đổi ngưỡng phải ghi biên bản gate theo CONSTRAINTS.
      </p>
      <div className="grid2">
        <div className="card">
          <h2>Ngưỡng cổng an toàn</h2>
          <div className="body">
            <div className="field">
              <label>Độ che mờ khói (%/m)</label>
              <input type="number" value={th.smoke_obs_per_m} onChange={(e) => set("smoke_obs_per_m", +e.target.value)} />
            </div>
            <div className="field">
              <label>Nhiệt độ (°C)</label>
              <input type="number" value={th.temperature_c} onChange={(e) => set("temperature_c", +e.target.value)} />
            </div>
            <div className="field">
              <label>CO (ppm)</label>
              <input type="number" value={th.co_ppm} onChange={(e) => set("co_ppm", +e.target.value)} />
            </div>
            <div className="field">
              <label>Tốc độ tăng nhiệt (°C/phút)</label>
              <input type="number" step="0.5" value={th.rate_of_rise_c_per_min} onChange={(e) => set("rate_of_rise_c_per_min", +e.target.value)} />
            </div>
          </div>
        </div>
        <div className="card">
          <h2>Kênh cảnh báo và escalation</h2>
          <div className="body">
            {["app", "sms", "email", "goi-dien"].map((c) => (
              <label key={c} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0" }}>
                <input type="checkbox" checked={channels.includes(c)} onChange={() => toggle(c)} />
                {c === "app" ? "Ứng dụng cư dân" : c === "sms" ? "SMS" : c === "email" ? "Email" : "Gọi điện tự động"}
              </label>
            ))}
            <p className="note" style={{ marginTop: 10 }}>
              Escalation cố định: mức 1 cư dân → mức 2 quản lý → mức 3 trung tâm → mức 4 gọi 114 khi hết hạn xác nhận. Thứ tự này không đổi được từ UI.
            </p>
          </div>
        </div>
      </div>
      <button className="btn primary" onClick={save}>Lưu cài đặt</button>
      {saved && <span className="note" style={{ marginLeft: 10 }}>Đã lưu.</span>}
    </>
  );
}
