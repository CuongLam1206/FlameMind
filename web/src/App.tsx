import { useState } from "react";
import { Chatbot } from "./components/Chatbot";
import { Logo } from "./components/Logo";
import { currentUser, logout } from "./lib/auth";
import type { SessionUser } from "./lib/auth";
import { ROLE_LABEL } from "./lib/types";
import type { Role } from "./lib/types";
import { Alerts } from "./screens/Alerts";
import { Dashboard } from "./screens/Dashboard";
import { Devices } from "./screens/Devices";
import { EventDetail } from "./screens/EventDetail";
import { History } from "./screens/History";
import { Landing } from "./screens/Landing";
import { Login } from "./screens/Login";
import { Models } from "./screens/Models";
import { Registry } from "./screens/Registry";
import { Resident } from "./screens/Resident";
import { Settings } from "./screens/Settings";

type ScreenId = "dashboard" | "alerts" | "history" | "devices" | "resident" | "models" | "registry" | "settings";

const NAV: { id: ScreenId; label: string; roles: Role[] }[] = [
  { id: "dashboard", label: "Tổng quan", roles: ["quan_ly", "trung_tam"] },
  { id: "alerts", label: "Cảnh báo trực tiếp", roles: ["quan_ly", "trung_tam"] },
  { id: "history", label: "Lịch sử sự kiện", roles: ["quan_ly", "trung_tam"] },
  { id: "devices", label: "Thiết bị", roles: ["quan_ly", "trung_tam"] },
  { id: "resident", label: "Thoát nạn", roles: ["quan_ly", "cu_dan", "trung_tam"] },
  { id: "models", label: "Model và Adapter", roles: ["quan_ly", "trung_tam"] },
  { id: "registry", label: "Registry dữ liệu và model", roles: ["quan_ly", "trung_tam"] },
  { id: "settings", label: "Cài đặt an toàn", roles: ["quan_ly"] },
];

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(currentUser());
  const [atLogin, setAtLogin] = useState(false);
  const [role, setRole] = useState<Role>("quan_ly");
  const [screen, setScreen] = useState<ScreenId>("dashboard");
  const [eventId, setEventId] = useState<string | null>(null);

  if (!user) {
    return atLogin ? (
      <Login onDone={(u) => { setUser(u); setAtLogin(false); }} />
    ) : (
      <Landing onEnter={() => setAtLogin(true)} />
    );
  }

  const items = NAV.filter((n) => n.roles.includes(role));
  const current = items.some((i) => i.id === screen) ? screen : items[0].id;
  const openEvent = (id: string) => {
    setEventId(id);
    setScreen("alerts");
  };

  return (
    <>
      <div className="app">
        <aside className="side">
          <div className="brand">
            <Logo />
            <div>
              <b>FireGuard</b>
              <small>cảnh báo cháy đa phương thức</small>
            </div>
          </div>
          {items.map((n) => (
            <button
              key={n.id}
              className={`nav-btn${current === n.id && !eventId ? " on" : ""}`}
              onClick={() => {
                setScreen(n.id);
                setEventId(null);
              }}
            >
              {n.label}
            </button>
          ))}
          <div className="spacer" />
          <div className="note" style={{ padding: "0 12px 6px" }}>{user.email}</div>
          <select className="role-sel" value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Đổi vai trò">
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
            ))}
          </select>
          <button className="btn small" style={{ marginTop: 8 }} onClick={() => { logout(); setUser(null); }}>
            Đăng xuất
          </button>
        </aside>

        <main className="main">
          {eventId ? (
            <EventDetail id={eventId} back={() => setEventId(null)} />
          ) : current === "dashboard" ? (
            <Dashboard openEvent={openEvent} />
          ) : current === "alerts" ? (
            <Alerts openEvent={openEvent} />
          ) : current === "history" ? (
            <History openEvent={openEvent} />
          ) : current === "devices" ? (
            <Devices />
          ) : current === "resident" ? (
            <Resident />
          ) : current === "models" ? (
            <Models />
          ) : current === "registry" ? (
            <Registry />
          ) : (
            <Settings />
          )}
        </main>
      </div>
      <Chatbot />
    </>
  );
}
