"""03 — Chạy giao thức đánh giá khóa của gate G1/G3/G4. Không huấn luyện gì ở đây.

Ba chế độ:
  --mode perception : gọi eval_voc.py chính thức của MS-FSDB trên dự đoán detector
  --mode verdict    : verdict accuracy + per-class recall trên held-out MmodalFire
  --mode far        : FAR quy đổi trên tập nhiễu khó (BoWFire + lớp false DFIRE-VIDEO)
  --mode edge       : đo p95 latency và watt trên thiết bị biên qua 200 sự kiện

Mọi ngưỡng đối chiếu lấy từ CONSTRAINTS.md; script chỉ in PASS/FAIL, không tự đổi ngưỡng.
"""

import argparse
import json
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # console Windows không phá chữ Việt

from fireguard.eval.metrics import false_alarms_per_camera_day, per_class_recall, verdict_accuracy

GATE = dict(map50=0.85, verdict=0.85, far_per_day=1.0, latency_p95_s=5.0)


def run_perception(pred_csv: str) -> None:
    cmd = ["python", "data/external/ms-fsdb/data/tools/eval_voc.py", "--pred", pred_csv]
    print(subprocess.run(cmd, capture_output=True, text=True).stdout)


def run_verdict(pred_jsonl: str, true_jsonl: str) -> None:
    pred = [json.loads(l) for l in open(pred_jsonl, encoding="utf-8")]
    true = [json.loads(l) for l in open(true_jsonl, encoding="utf-8")]
    y_pred = [p["verdict"] for p in pred]
    y_true = [t["verdict"] for t in true]
    acc = verdict_accuracy(y_true, y_pred)
    print(f"verdict_accuracy={acc:.4f} pass={acc >= GATE['verdict']}")
    print("per_class_recall=", per_class_recall(y_true, y_pred))


def run_far(pred_jsonl: str, cameras: int, days: float) -> None:
    fp = sum(1 for l in open(pred_jsonl, encoding="utf-8") if json.loads(l).get("false_alarm"))
    far = false_alarms_per_camera_day(fp, cameras, days)
    print(f"far_per_camera_day={far:.3f} pass={far <= GATE['far_per_day']}")


def run_edge(latency_log: str) -> None:
    secs = sorted(json.loads(l)["seconds"] for l in open(latency_log, encoding="utf-8"))
    p95 = secs[int(0.95 * len(secs)) - 1]
    print(f"latency_p95_s={p95:.2f} pass={p95 <= GATE['latency_p95_s']}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["perception", "verdict", "far", "edge"], required=True)
    ap.add_argument("--pred", default="")
    ap.add_argument("--true", default="")
    ap.add_argument("--cameras", type=int, default=10)
    ap.add_argument("--days", type=float, default=5.0)
    args = ap.parse_args()

    if args.mode == "perception":
        run_perception(args.pred)
    elif args.mode == "verdict":
        run_verdict(args.pred, args.true)
    elif args.mode == "far":
        run_far(args.pred, args.cameras, args.days)
    else:
        run_edge(args.pred)


if __name__ == "__main__":
    main()
