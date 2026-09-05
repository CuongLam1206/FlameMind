"""02 — SFT rồi DPO cho SLM phán quyết cháy bằng Unsloth, vòng đời quản bằng MLflow.

Môi trường: conda env "fire" (python 3.11, torch cu126 <2.12, transformers 4.57, unsloth).
Chạy: python notebooks/02_train_slm_qlora.py --stage sft --model-tag slm-0.1.0 --dvc-data-tag data/v1
Mỗi stage là một MLflow run trong experiment "fireguard", mang tham số dvc_data_tag
để màn hình Registry web nối model với đúng phiên bản dữ liệu.

Lưu ý thứ tự import: unsloth PHẢI nạp trước trl, vì unsloth nạp lại module trl;
import trl trước sẽ lệch class và gây lỗi eos_token placeholder.
Dataset đưa vào SFTTrainer là cột "text" đã áp chat template, tránh formatting_func.
"""

import argparse
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # console Windows không phá chữ Việt

ROOT = Path(__file__).resolve().parents[1]  # neo đường dẫn vào gốc repo, chạy từ đâu cũng đúng

import mlflow
from datasets import Dataset
from unsloth import FastLanguageModel  # import TRƯỚC trl
from trl import SFTConfig, SFTTrainer

PROMPT = (
    "Bạn là model phán quyết cháy chạy trong tòa nhà. Gói ngữ cảnh: {ctx}\n"
    "Trả lời đúng một JSON gồm verdict thuộc chay_that|lanh_tinh|khong_chay, confidence, chuoi_suy_luan."
)


def load_jsonl(path) -> list[dict]:
    with open(path, encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


def to_messages(r: dict) -> list[dict]:
    ctx = json.dumps({"room": r.get("room"), "hour": r.get("hour"), "sensors": r.get("sensors")}, ensure_ascii=False)
    ans = json.dumps({"verdict": r["verdict"], "confidence": 0.9,
                      "chuoi_suy_luan": r.get("cot_template", [])}, ensure_ascii=False)
    return [
        {"role": "user", "content": PROMPT.format(ctx=ctx)},
        {"role": "assistant", "content": ans},
    ]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", choices=["sft", "dpo"], default="sft")
    ap.add_argument("--base", default="Qwen/Qwen2.5-1.5B-Instruct")
    ap.add_argument("--model-tag", default="slm-0.1.0")
    ap.add_argument("--dvc-data-tag", default="data/v1")
    ap.add_argument("--epochs", type=int, default=2)
    ap.add_argument("--batch", type=int, default=2)
    ap.add_argument("--max-seq", type=int, default=1024)
    ap.add_argument("--max-rows", type=int, default=0, help="0 là dùng toàn bộ; đặt 500 cho smoke test")
    args = ap.parse_args()

    mlflow.set_tracking_uri(f"sqlite:///{ROOT / 'mlflow.db'}")
    mlflow.set_experiment("fireguard")

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.base, max_seq_length=args.max_seq, load_in_4bit=True)
    model = FastLanguageModel.get_peft_model(
        model, r=16, lora_alpha=32, lora_dropout=0.05, bias="none",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        use_gradient_checkpointing="unsloth")

    if args.stage == "sft":
        rows = load_jsonl(ROOT / "data/processed/scenarios/scenes_sft.jsonl")
        rows += load_jsonl(ROOT / "data/processed/verdict/mmodalfire_train.jsonl")
        if args.max_rows:
            rows = rows[: args.max_rows]
        texts = [tokenizer.apply_chat_template(to_messages(r), tokenize=False, add_generation_prompt=False)
                 for r in rows]
        ds = Dataset.from_list([{"text": t} for t in texts])
        with mlflow.start_run(run_name=args.model_tag):
            mlflow.log_param("model_tag", args.model_tag)
            mlflow.log_param("dvc_data_tag", args.dvc_data_tag)
            mlflow.log_param("base", args.base)
            mlflow.log_param("n_rows", len(rows))
            mlflow.log_param("engine", "unsloth")
            cfg = SFTConfig(output_dir=str(ROOT / "models" / args.model_tag), num_train_epochs=args.epochs,
                            per_device_train_batch_size=args.batch, gradient_accumulation_steps=4,
                            learning_rate=2e-4, warmup_steps=10, weight_decay=0.01,
                            logging_steps=25, save_strategy="epoch", seed=42)
            trainer = SFTTrainer(model=model, processing_class=tokenizer, train_dataset=ds, args=cfg)
            trainer.train()
            model.save_pretrained(str(ROOT / "models" / args.model_tag / "adapter"))
            tokenizer.save_pretrained(str(ROOT / "models" / args.model_tag / "adapter"))
            mlflow.log_artifact(str(ROOT / "models" / args.model_tag / "adapter"), "adapter")
            final = trainer.state.log_history[-1] if trainer.state.log_history else {}
            mlflow.log_metric("final_train_loss", final.get("loss", float("nan")))
            print(f"Xong SFT {args.model_tag}; chạy scripts/sync_registry.py để web cập nhật.")
    else:
        from trl import DPOConfig, DPOTrainer

        pairs = load_jsonl(ROOT / "data/processed/scenarios/preference_pairs.jsonl")
        with mlflow.start_run(run_name=f"{args.model_tag}-dpo"):
            mlflow.log_param("model_tag", args.model_tag)
            mlflow.log_param("dvc_data_tag", args.dvc_data_tag)
            mlflow.log_param("stage", "dpo")
            cfg = DPOConfig(output_dir=str(ROOT / "models" / args.model_tag / "dpo"), num_train_epochs=1,
                            per_device_train_batch_size=2, gradient_accumulation_steps=8,
                            learning_rate=5e-7, beta=0.1, max_length=args.max_seq)
            DPOTrainer(model=model, processing_class=tokenizer,
                       train_dataset=Dataset.from_list(pairs), args=cfg).train()
            print("Xong DPO; chạy scripts/sync_registry.py để web cập nhật.")


if __name__ == "__main__":
    main()
