import { EVENTS } from "../lib/mockData";
import { VerdictCard } from "../components/VerdictCard";

export function Alerts({ openEvent }: { openEvent: (id: string) => void }) {
  const sorted = [...EVENTS].sort((a, b) => b.level - a.level || b.ts.localeCompare(a.ts));
  return (
    <>
      <h1 className="page-title">Cảnh báo trực tiếp</h1>
      <p className="page-sub">
        Hàng đợi phán quyết theo mẫu review queue của các nền tảng CV: mỗi sự kiện là một thẻ verdict cần xem bằng chứng và phản hồi đúng/sai để nuôi flywheel.
      </p>
      <div className="card">
        {sorted.map((ev) => (
          <VerdictCard key={ev.id} ev={ev} onClick={() => openEvent(ev.id)} />
        ))}
      </div>
    </>
  );
}
