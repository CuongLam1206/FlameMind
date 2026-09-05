"""Metric chốt của giao thức đánh giá khóa (docs/data-cards.md).

Chỉ gồm các hàm dùng trực tiếp cho gate G3: verdict accuracy ba lớp và
FAR quy đổi lần/camera/ngày. mAP perception dùng eval_voc.py chính thức của MS-FSDB.
"""

from collections import Counter


def verdict_accuracy(y_true: list[str], y_pred: list[str]) -> float:
    """Accuracy ba lớp cháy_thật / lanh_tinh / khong_chay trên held-out theo video."""
    if len(y_true) != len(y_pred) or not y_true:
        raise ValueError("y_true và y_pred phải cùng độ dài và khác rỗng")
    return sum(t == p for t, p in zip(y_true, y_pred)) / len(y_true)


def false_alarms_per_camera_day(n_false_positives: int, n_cameras: int, days: float) -> float:
    """FAR quy đổi: số phán quyết cháy sai trên mỗi camera mỗi ngày theo dõi."""
    if n_cameras <= 0 or days <= 0:
        raise ValueError("số camera và số ngày phải dương")
    return n_false_positives / (n_cameras * days)


def per_class_recall(y_true: list[str], y_pred: list[str]) -> dict[str, float]:
    """Recall từng lớp, bắt buộc báo kèm accuracy để lộ bỏ sót lớp cháy thật."""
    totals = Counter(y_true)
    hits = Counter((t, p) for t, p in zip(y_true, y_pred))
    return {cls: hits[(cls, cls)] / totals[cls] for cls in totals}
