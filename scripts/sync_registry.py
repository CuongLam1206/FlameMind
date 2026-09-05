"""Đồng bộ registry.json (nguồn thật) sang web/public/registry.json và hút run từ MLflow nếu có.

Chạy: python scripts/sync_registry.py
- Nếu mlflow cài sẵn: quét experiment "fireguard", cập nhật metric và run id vào mục model khớp tag.
- Nếu chưa cài mlflow: chỉ copy, web vẫn hiển thị bản thủ công.
Không tự bịa số: chỉ ghi những gì MLflow hoặc registry nguồn đã có.
"""

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "registry.json"
DST = ROOT / "web" / "public" / "registry.json"


def pull_mlflow(reg: dict) -> int:
    try:
        import mlflow
    except ImportError:
        print("mlflow chưa cài: bỏ qua bước hút run, chỉ copy registry.")
        return 0
    mlflow.set_tracking_uri(reg.get("mlflow_tracking_uri", "sqlite:///./mlflow.db"))
    from mlflow import MlflowClient

    client = MlflowClient()
    try:
        exp = client.get_experiment_by_name("fireguard")
        runs = client.search_runs([exp.experiment_id]) if exp else []
    except Exception as exc:  # server chưa chạy hoặc chưa có experiment
        print(f"Không đọc được MLflow ({exc}); giữ nguyên registry nguồn.")
        return 0
    updated = 0
    for run in runs:
        tag = run.data.tags.get("model_tag")
        entry = next((m for m in reg["models"] if m["tag"] == tag), None)
        if not entry:
            continue
        entry["mlflow_run_id"] = run.info.run_id[:12]
        for key in ("map50_dfire", "map50_msfsdb", "verdict_acc", "far_per_day"):
            if key in run.data.metrics:
                entry["metrics"][key] = round(run.data.metrics[key], 4)
        if run.data.params.get("dvc_data_tag"):
            entry["dvc_data_tag"] = run.data.params["dvc_data_tag"]
        updated += 1
    return updated


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    reg = json.loads(SRC.read_text(encoding="utf-8"))
    n = pull_mlflow(reg)
    DST.parent.mkdir(parents=True, exist_ok=True)
    DST.write_text(json.dumps(reg, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Đã cập nhật {n} run từ MLflow; ghi {DST.relative_to(ROOT)} cho web.")


if __name__ == "__main__":
    main()
