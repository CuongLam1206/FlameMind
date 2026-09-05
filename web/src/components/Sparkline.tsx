/** Biểu đồ đường nhỏ cho chuỗi cảm biến, không thư viện ngoài. */
export function Sparkline({ data, color = "var(--flame)", label }: { data: number[]; color?: string; label: string }) {
  const w = 220;
  const h = 46;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 6) - 3}`).join(" ");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <svg width={w} height={h} role="img" aria-label={label}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
      </svg>
      <span className="note">
        {label} · đỉnh {max}
      </span>
    </div>
  );
}
