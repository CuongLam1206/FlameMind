import { useEffect, useState } from "react";
import { EmberField } from "../components/EmberField";
import { Logo } from "../components/Logo";

const STREAM = [
  { badge: "hot", text: "21:14 hành lang T4: khói 18%/m, nhiệt tăng 9°C/phút. Phán quyết: cháy thật, mức 3." },
  { badge: "calm", text: "18:42 bếp 12-08: khói thoáng rồi tắt, khớp mẫu nấu ăn. Không làm phiền cư dân." },
  { badge: "mute", text: "07:05 ban thờ 02-05: mật độ khói thấp ổn định, khớp mẫu nhang. Im lặng." },
];

export function Landing({ onEnter }: { onEnter: () => void }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setShown((s) => (s < STREAM.length ? s + 1 : s)), 650);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="landing-hero">
        <EmberField />
        <div className="inner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <Logo size={40} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#b0aea5" }}>
                FireGuard
              </span>
            </div>
            <h1>Chuông báo cháy kêu quá nhiều lần sai, đến khi cháy thật thì không ai chạy.</h1>
            <p className="lede">
              FireGuard nhìn bằng camera và ngửi bằng cảm biến khói, nhiệt, CO cùng lúc, rồi một model
              ngôn ngữ nhỏ chạy ngay trong tòa nhà phán quyết đó là cháy thật, nến hay nồi kho cạn,
              trước khi đánh thức ai lúc ba giờ sáng.
            </p>
            <div className="hero-cta">
              <button className="btn primary" onClick={onEnter}>Vào trạm giám sát</button>
              <a className="btn on-dark" href="#cach-pham-quyet">Xem cách hệ thống phán quyết</a>
            </div>
          </div>
          <div className="stream-panel" aria-label="Luồng phán quyết minh họa">
            <div style={{ color: "#b0aea5", fontSize: 12, marginBottom: 6, fontFamily: "var(--font-display)" }}>
              Luồng phán quyết đêm qua, tòa nhà CC-07
            </div>
            {STREAM.slice(0, shown).map((r, i) => (
              <div className="row in" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <span className={`badge ${r.badge}`}>{r.badge === "hot" ? "cháy" : r.badge === "calm" ? "lành tính" : "im"}</span>
                <span style={{ color: "#e8e6dc" }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="cach-pham-quyet">
        <h2>Ba việc hệ thống làm mỗi năm giây</h2>
        <p className="sub">
          Không phải một model đoán mò trên một tấm ảnh. Là một chuỗi kiểm chứng, và con người luôn nằm trong vòng.
        </p>
        <div className="trio">
          <div className="item">
            <h3>Ngửi và nhìn cùng lúc</h3>
            <p>Camera bắt khói mỏng từ giai đoạn âm ỉ, cảm biến khói, nhiệt, CO xác nhận chéo theo động học lan tỏa thật.</p>
          </div>
          <div className="item">
            <h3>Phán quyết có lý do</h3>
            <p>Model ngôn ngữ nhỏ chạy trong tòa nhà trả lời cháy thật hay lành tính, kèm chuỗi bằng chứng đọc được, không hộp đen.</p>
          </div>
          <div className="item">
            <h3>Bảo con người phải làm gì</h3>
            <p>Màn hình cư dân hiện đúng ba câu: có cháy thật không, đi hướng nào, có được dập không. Escalation tự động lên 114 khi không ai xác nhận.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <h2>Dựng cho điều kiện Việt Nam</h2>
        <p className="sub">
          Chung cư mini, nhà trọ, nhà ở kết hợp kinh doanh: nơi thiếu hệ báo cháy kiểm định nhất lại là nơi cháy chết người nhiều nhất.
          FireGuard chạy trên phần cứng giá rẻ đã có sẵn, bổ trợ chứ không thay thế hệ kiểm định TCVN 5738.
        </p>
        <button className="btn primary" onClick={onEnter}>Đăng nhập bằng Google để xem trạm giám sát</button>
      </section>
    </>
  );
}
