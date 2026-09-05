"""Chuyển MmodalFire (Figshare, Scientific Data 2026) thành jsonl huấn luyện tầng phán quyết.

Quy tắc đọc dữ liệu thực tế của bộ này:
- File cảm biến có header bắt đầu bằng 烟测量值, gồm 6 kênh: khói, nhiệt, ba dải hồng ngoại, đếm UV.
- File chỉ có 时间/当前时间 là file mốc thời gian, bỏ qua.
- Ánh xạ kênh vào lược đồ của đề tài: smoke = 烟测量值, temp = 温测量值, co = 紫外计数
  (UV làm đại diện sản phẩm cháy; ba dải hồng ngoại giữ lại trong meta để dùng sau).
- Nhãn theo họ kịch bản: Control Group = khong_chay; Dry Ice và Humidifier = lanh_tinh
  (nhiễu lành tính, đúng thứ cần để hiệu chuẩn báo giả); Cotton rope, Wood, Polyurethane,
  N-Heptane, Occlusion = chay_that.
- Chia held-out theo kịch bản chứ không theo dòng: mọi lặp lại của một kịch bản
  cùng nằm một phía, tránh rò rỉ.

Chạy: python scripts/make_mmodalfire_jsonl.py
"""

import csv
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data/external/mmodalfire/原始数据/Physical sensing"
OUT_TRAIN = ROOT / "data/processed/verdict/mmodalfire_train.jsonl"
OUT_HELD = ROOT / "data/processed/verdict/mmodalfire_heldout.jsonl"
OUT_SPLIT = ROOT / "data/splits/mmodalfire_split.json"

VERDICT_BY_FAMILY = {
    "Control Group": "khong_chay",
    "Dry Ice": "lanh_tinh",
    "Humidifier": "lanh_tinh",
    "Cotton rope": "chay_that",
    "Wood": "chay_that",
    "Polyurethane": "chay_that",
    "N-Heptane": "chay_that",
    "Occlusion": "chay_that",
}
COT = {
    "chay_that": ["da_phuong_thuc_tang_nhat_quan", "dong_hoc_chay_am_i_hoac_bung_phat", "khong_khop_mau_lanh_tinh", "ket_luan_chay_that"],
    "lanh_tinh": ["co_che_mo_hoac_khi_lanh", "khong_tang_nhiet_va_uv", "khop_mau_nhieu_lanh_tinh", "ket_luan_lanh_tinh"],
    "khong_chay": ["nen_cam_bien_on_dinh", "khong_co_tien_trien", "khong_khop_mau_chay", "ket_luan_khong_chay"],
}


def family_of(name: str) -> str:
    for fam in VERDICT_BY_FAMILY:
        if name.startswith(fam):
            return fam
    return ""


def downsample(vals: list[float], n: int = 60) -> list[float]:
    if not vals:
        return [0.0] * n
    step = max(1, len(vals) // n)
    out = [round(vals[i], 2) for i in range(0, len(vals), step)][:n]
    while len(out) < n:
        out.append(out[-1])
    return out


def main() -> None:
    rows, split = [], {"heldout_scenarios": []}
    for path in sorted(SRC.glob("*.csv")):
        with open(path, encoding="gbk") as fh:
            reader = csv.reader(fh)
            header = next(reader, None)
            if not header or not header[0].startswith("烟测量值"):
                continue
            data = [r for r in reader if len(r) >= 6 and r[0].strip()]
        fam = family_of(path.stem)
        if not fam:
            continue
        verdict = VERDICT_BY_FAMILY[fam]
        smoke = downsample([float(r[0]) for r in data])
        temp = downsample([float(r[1]) for r in data])
        uv = downsample([float(r[5]) for r in data])
        scenario = re.sub(r"[-_ ]*\d+$", "", path.stem).strip()
        heldout = hash(scenario) % 3 == 0
        if heldout and scenario not in split["heldout_scenarios"]:
            split["heldout_scenarios"].append(scenario)
        rows.append({
            "source": "mmodalfire",
            "scenario": scenario,
            "file": path.name,
            "room": "phong_thi_nghiem_kin",
            "hour": None,
            "sensors": {"smoke_obs_per_m": smoke, "temperature_c": temp, "co_ppm": uv},
            "verdict": verdict,
            "cot_template": COT[verdict],
            "heldout": heldout,
        })

    train = [r for r in rows if not r["heldout"]]
    held = [r for r in rows if r["heldout"]]
    for r in rows:
        r.pop("heldout")
    OUT_TRAIN.parent.mkdir(parents=True, exist_ok=True)
    OUT_SPLIT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_TRAIN, "w", encoding="utf-8") as fh:
        for r in train:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(OUT_HELD, "w", encoding="utf-8") as fh:
        for r in held:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")
    OUT_SPLIT.write_text(json.dumps(split, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"MmodalFire: {len(rows)} file cảm biến -> train {len(train)}, held-out {len(held)}")
    print(f"Kịch bản held-out: {split['heldout_scenarios']}")


if __name__ == "__main__":
    main()
