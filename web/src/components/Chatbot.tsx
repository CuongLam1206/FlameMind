import { useRef, useState } from "react";
import { loadAdapter } from "../lib/inference";
import { EVENTS } from "../lib/mockData";
import { VERDICT_LABEL } from "../lib/types";

interface Msg {
  who: "bot" | "user";
  text: string;
}

const KNOWLEDGE: { keys: string[]; answer: string }[] = [
  { keys: ["thoat", "chay nao", "huong"], answer: "Nguyên tắc thoát nạn: đi cầu thang bộ, cúi thấp người nếu có khói, không dùng thang máy, không quay lại lấy đồ, đóng cửa sau lưng để khoanh khói." },
  { keys: ["dap", "binh", "chua chay"], answer: "Chỉ dập khi lửa còn nhỏ hơn một thùng carton và bạn đứng giữa lửa với lối thoát. Cháy điện hoặc dầu mỡ: không dùng nước, dùng bình bột hoặc CO2. Quá ngưỡng đó thì thoát và đóng cửa." },
  { keys: ["bao gia", "nau an", "nhang"], answer: "Hệ phân biệt nấu ăn, nhang, bụi bằng động học đa phương thức: khói lành tính thoáng rồi tắt, không kèm nhiệt và CO tăng dần. Mỗi lần bạn bấm đúng/sai trên thẻ cảnh báo là model học thêm một mẫu." },
  { keys: ["cam bien", "hong", "offline"], answer: "Vào màn hình Thiết bị để xem shadow và thời điểm cuối mỗi nút được nhìn thấy. Nút mất kết nối vẫn tự chủ cảnh báo tại chỗ nhờ cổng an toàn chạy cục bộ." },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "bot", text: "Tôi là trợ lý FireGuard. Hỏi tôi về thoát nạn, chữa cháy ban đầu, vì sao hệ báo hay im lặng, hoặc gõ \"phán quyết evt-2026-0912-001\" để tôi hỏi model." },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    setText("");
    setMsgs((m) => [...m, { who: "user", text: q }]);
    setBusy(true);

    let reply: string;
    const evId = q.match(/evt-[0-9a-z-]+/i)?.[0];
    if (evId) {
      const ev = EVENTS.find((e) => e.id === evId);
      if (!ev) {
        reply = `Không tìm thấy sự kiện ${evId} trong kho hiện tại.`;
      } else {
        const { adapter } = loadAdapter();
        try {
          const r = await adapter.getVerdict({ eventId: ev.id, nodeId: ev.nodeId, zone: ev.zone, series: ev.series });
          reply = `${VERDICT_LABEL[r.verdict]}, độ tin ${(r.confidence * 100).toFixed(0)}%, nguồn ${r.source}. Lý do: ${r.explanation}`;
        } catch (e) {
          reply = `Không hỏi được model: ${e instanceof Error ? e.message : String(e)}`;
        }
      }
    } else {
      const hit = KNOWLEDGE.find((k) => k.keys.some((key) => q.toLowerCase().includes(key)));
      reply = hit?.answer ?? "Tôi chưa hiểu ý bạn. Thử hỏi về thoát nạn, chữa cháy ban đầu, báo động giả, cảm biến ngoại tuyến, hoặc gõ mã sự kiện dạng evt-...";
    }
    setMsgs((m) => [...m, { who: "bot", text: reply }]);
    setBusy(false);
    setTimeout(() => bodyRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 30);
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Mở trợ lý FireGuard">
        <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3c1 5-6 8-6 14a6 6 0 0 0 12 0c0-3-2-5-2-8 3 2 6 5 6 10a10 10 0 0 1-20 0C6 10 13 7 16 3z" fill="#fff" />
        </svg>
      </button>
      {open && (
        <div className="chat-win" role="dialog" aria-label="Cửa sổ trợ lý">
          <header>
            <span className="dot" />
            <div>
              <b>Trợ lý FireGuard</b>
              <div className="st">trả lời từ tri thức PCCC và model phán quyết</div>
            </div>
            <button className="btn small" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}>Đóng</button>
          </header>
          <div className="chat-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div className={`msg ${m.who}`} key={i}>{m.text}</div>
            ))}
            {busy && <div className="msg bot">Đang hỏi model…</div>}
          </div>
          <div className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Hỏi về thoát nạn, hoặc dán mã sự kiện…"
              aria-label="Nhập câu hỏi"
            />
            <button className="btn primary small" onClick={send} disabled={busy}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
}
