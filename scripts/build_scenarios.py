"""Sinh kịch bản tổng hợp FireGuard-Scenes: chuỗi cảm biến theo động học cháy + nhãn phán quyết.

Đây là hạng mục 80/20 số 1 (docs/02-structure.md): không có nó thì không có dữ liệu phán quyết.
Mỗi kịch bản gồm: họ tình huống, chuỗi cảm biến 60 giây bước 1s, siêu dữ liệu cảnh,
nhãn verdict và khung chuỗi suy luận CoT để điền bằng chưng cất thầy ở bước kế tiếp.

Chạy: python scripts/build_scenarios.py --n 20000 --out data/processed/scenarios/scenes_sft.jsonl
"""

import argparse
import json
import random
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # console Windows không phá chữ Việt

FAMILIES = [
    # (tên họ, verdict, đỉnh khói %/m, đỉnh nhiệt C, đỉnh CO ppm, tốc độ tăng nhiệt C/phút)
    ("smolder_burst", "chay_that", 25.0, 75.0, 140.0, 9.0),
    ("fast_flame", "chay_that", 18.0, 90.0, 90.0, 14.0),
    ("electrical", "chay_that", 12.0, 65.0, 60.0, 7.0),
    ("candle_benign", "lanh_tinh", 1.5, 31.0, 8.0, 0.3),
    ("cooking_steam", "lanh_tinh", 4.0, 34.0, 12.0, 0.6),
    ("incense", "lanh_tinh", 2.5, 29.0, 9.0, 0.2),
    ("dust_burst", "khong_chay", 6.0, 27.0, 4.0, 0.1),
    ("fog_morning", "khong_chay", 5.0, 26.0, 3.0, 0.1),
]

ROOMS = ["bep", "phong_khach", "hanh_lang", "kho", "ban_tho", "nha_xe"]


def sensor_curve(peak: float, tau_s: float, rng: random.Random, seconds: int = 60) -> list[float]:
    """Đường cong tăng dần kiểu bão hòa kèm nhiễu cảm biến, mô phỏng động học lan tỏa."""
    return [round(peak * (1 - 2.71828 ** (-t / tau_s)) + rng.gauss(0, peak * 0.02), 3) for t in range(seconds)]


def make_scenario(family: tuple, rng: random.Random) -> dict:
    name, verdict, smoke, temp, co, ror = family
    return {
        "family": name,
        "verdict": verdict,
        "room": rng.choice(ROOMS),
        "hour": rng.randint(0, 23),
        "sensors": {
            "smoke_obs_per_m": sensor_curve(smoke, rng.uniform(8, 25), rng),
            "temperature_c": sensor_curve(temp - 26, rng.uniform(20, 45), rng, ),
            "co_ppm": sensor_curve(co, rng.uniform(15, 40), rng),
            "rate_of_rise_c_per_min": round(ror * rng.uniform(0.8, 1.2), 2),
        },
        "cot_template": [
            "kiem_tra_tinh_nhat_quan_da_phuong_thuc",
            "kiem_tra_dong_hoc_tang_dan",
            "kiem_tra_nguon_lanh_tinh_da_biet",
            "ket_luan_va_muc_canh_bao",
        ],
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=20000)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--out", default="data/processed/scenarios/scenes_sft.jsonl")
    args = ap.parse_args()

    rng = random.Random(args.seed)
    with open(args.out, "w", encoding="utf-8") as fh:
        for _ in range(args.n):
            fh.write(json.dumps(make_scenario(rng.choice(FAMILIES), rng), ensure_ascii=False) + "\n")
    print(f"Đã sinh {args.n} kịch bản vào {args.out}; dvc add trước khi huấn luyện.")


if __name__ == "__main__":
    main()
