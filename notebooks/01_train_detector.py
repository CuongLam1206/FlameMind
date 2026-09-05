"""01 — Huấn luyện detector lửa-khói baseline và xuất ONNX cho biên. Gate G1.

Chạy: python notebooks/01_train_detector.py --config configs/train_detector.yaml
Kiểm chứng G1: mAP@0.5 >= 0.75 trên D-Fire val, in ra cuối run và ghi experiment log.
Ultralytics giữ vòng train tối ưu sẵn của nó; MLflow log thủ công để chung một registry với SLM.
"""

import argparse
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # console Windows không phá chữ Việt

import mlflow
from ultralytics import YOLO


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="configs/train_detector.yaml")
    ap.add_argument("--model", default="yolo11n.pt")
    ap.add_argument("--model-tag", default="det-0.1.0")
    ap.add_argument("--dvc-data-tag", default="data/v1")
    ap.add_argument("--data", default="data/processed/detection/dfire_fasdd_hqfsd.yaml")
    ap.add_argument("--epochs", type=int, default=60)
    ap.add_argument("--imgsz", type=int, default=640)
    args = ap.parse_args()

    mlflow.set_tracking_uri("sqlite:///../mlflow.db")
    mlflow.set_experiment("fireguard")

    model = YOLO(args.model)
    with mlflow.start_run(run_name=args.model_tag):
        mlflow.log_param("model_tag", args.model_tag)
        mlflow.log_param("dvc_data_tag", args.dvc_data_tag)
        mlflow.log_param("epochs", args.epochs)
        results = model.train(data=args.data, epochs=args.epochs, imgsz=args.imgsz, batch=32, workers=8)

        val = model.val(data=args.data)
        map50 = float(val.box.map50)
        mlflow.log_metric("map50_dfire", map50)
        print(f"G1_CHECK mAP50={map50:.4f} pass={map50 >= 0.75}")

        onnx = model.export(format="onnx", imgsz=args.imgsz, simplify=True)
        mlflow.log_artifact(onnx, "onnx")
        print("Đã xuất ONNX và log artifact; chạy scripts/sync_registry.py để web cập nhật.")


if __name__ == "__main__":
    main()
