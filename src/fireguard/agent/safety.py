"""Cổng an toàn tất định: luôn thắng phán quyết của SLM khi cảm biến vượt ngưỡng chứng nhận.

Hàm thuần, không trạng thái, không model. Test bắt buộc: tests/test_safety_gate.py.
Ngưỡng tham khảo đầu báo khói quang và nhiệt theo tài liệu đầu báo dân dụng;
số cuối cùng chốt cùng đối tác pilot và ghi vào configs/safety.yaml.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class SensorSnapshot:
    smoke_obs_per_m: float      # độ che mờ quang học, %/m
    temperature_c: float        # nhiệt độ không khí
    co_ppm: float               # nồng độ CO
    rate_of_rise_c_per_min: float  # tốc độ tăng nhiệt


@dataclass(frozen=True)
class SafetyThresholds:
    smoke_obs_per_m: float = 15.0
    temperature_c: float = 60.0
    co_ppm: float = 100.0
    rate_of_rise_c_per_min: float = 8.0


def hard_alarm(snapshot: SensorSnapshot, thresholds: SafetyThresholds) -> bool:
    """Trả về True nếu bất kỳ cảm biến nào vượt ngưỡng chứng nhận, bất kể SLM nói gì."""
    return (
        snapshot.smoke_obs_per_m >= thresholds.smoke_obs_per_m
        or snapshot.temperature_c >= thresholds.temperature_c
        or snapshot.co_ppm >= thresholds.co_ppm
        or snapshot.rate_of_rise_c_per_min >= thresholds.rate_of_rise_c_per_min
    )


def final_alarm_level(slm_level: int, snapshot: SensorSnapshot, thresholds: SafetyThresholds) -> int:
    """Hợp nhất: mức cuối = max(mức SLM, mức cứng 4 khi vượt ngưỡng). Mức 0 là im lặng."""
    return max(slm_level, 4 if hard_alarm(snapshot, thresholds) else 0)
