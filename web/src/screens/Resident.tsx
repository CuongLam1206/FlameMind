import { EVENTS } from "../lib/mockData";

/** Màn hình cư dân: đúng ba câu trả lời cỡ lớn, theo design thinking D3. */
export function Resident() {
  const active = EVENTS.find((e) => e.level >= 3);
  if (!active) {
    return (
      <>
        <h1 className="page-title">Nhà bạn đang an toàn</h1>
        <p className="page-sub">Không có cảnh báo cháy đang hoạt động tại tòa nhà của bạn.</p>
        <div className="card">
          <div className="body">
            <p style={{ margin: 0 }}>
              Khi có cháy thật, màn hình này sẽ hiện đúng ba điều: <strong>có cháy thật không</strong>, <strong>bạn đi hướng nào</strong>, và <strong>bạn có được dập lửa không</strong>. Mọi thứ khác xếp sau.
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="banner" role="alert">
        <h2>CÓ CHÁY THẬT TẠI {active.zone.toUpperCase()}</h2>
        <p>Đi cầu thang bộ bên trái.</p>
        <p>Không dùng thang máy.</p>
        <p>Không dập lửa: đám cháy đã vượt ngưỡng an toàn tự dập.</p>
        <p className="sub">
          Nhận định của AI kèm xác nhận độc lập của cổng an toàn cảm biến · đã báo quản lý và trung tâm · giữ bình tĩnh, cúi thấp người nếu có khói
        </p>
      </div>
      <div className="card">
        <h2>Vì sao hệ thống kết luận cháy thật</h2>
        <div className="body">
          <p className="why">{active.explanation}</p>
          <p className="ai-note">Bằng chứng: {active.evidence.join(" · ")}</p>
        </div>
      </div>
    </>
  );
}
