import { useState } from "react";
import { DEVICES } from "../lib/mockData";

export function Devices() {
  const [openShadow, setOpenShadow] = useState<string | null>(null);
  return (
    <>
      <h1 className="page-title">Thiết bị</h1>
      <p className="page-sub">Mỗi nút một khóa MQTT riêng; ứng dụng đọc device shadow chứ không đọc thẳng thiết bị, theo đúng mẫu IoT platform.</p>
      <div className="grid2">
        {DEVICES.map((d) => (
          <div className="card" key={d.id} style={{ marginBottom: 0 }}>
            <h2>
              <span className={`dot${d.online ? "" : " off"}`} style={{ marginRight: 8 }} />
              <span className="mono">{d.id}</span> · {d.zone}
            </h2>
            <div className="body">
              <p style={{ margin: "0 0 8px" }}>
                {d.kinds.map((k) => (
                  <span className="tag" key={k} style={{ marginRight: 6 }}>{k}</span>
                ))}
                <span className="note" style={{ marginLeft: 8 }}>{d.online ? `trực tuyến ${d.lastSeen}` : `mất kết nối ${d.lastSeen}`}</span>
              </p>
              <button className="btn small" onClick={() => setOpenShadow(openShadow === d.id ? null : d.id)}>
                {openShadow === d.id ? "Ẩn shadow" : "Xem shadow"}
              </button>
              {openShadow === d.id && <pre className="shadow" style={{ marginTop: 10 }}>{JSON.stringify(d.shadow, null, 2)}</pre>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
