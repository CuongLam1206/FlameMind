import { useEffect, useRef } from "react";

/** Trường tàn lửa bay lên trong hero landing. Tắt hẳn khi người dùng giảm chuyển động. */
export function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    const N = 42;
    const embers = Array.from({ length: N }, () => spawn(true));
    function spawn(anywhere: boolean) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 6,
        r: 0.8 + Math.random() * 1.8,
        vy: 0.25 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.3,
        a: 0.15 + Math.random() * 0.4,
      };
    }

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.vy;
        e.x += e.drift + Math.sin(e.y / 40) * 0.15;
        if (e.y < -8) embers[i] = spawn(false);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 119, 87, ${e.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}
    />
  );
}
