"""Test đường đỏ: cổng an toàn không bao giờ im lặng khi cảm biến vượt ngưỡng.

Chạy: pytest tests/test_safety_gate.py — phải xanh trước mọi merge (CONSTRAINTS mục 5).
"""

from fireguard.agent.safety import SafetyThresholds, SensorSnapshot, final_alarm_level, hard_alarm

TH = SafetyThresholds()


def _snap(**kw) -> SensorSnapshot:
    base = dict(smoke_obs_per_m=1.0, temperature_c=28.0, co_ppm=5.0, rate_of_rise_c_per_min=0.2)
    base.update(kw)
    return SensorSnapshot(**base)


def test_im_lặng_khi_cảm_biến_bình_thường():
    assert hard_alarm(_snap(), TH) is False
    assert final_alarm_level(0, _snap(), TH) == 0


def test_vượt_ngưỡng_khói_thì_báo_dù_SLM_phủ_nhận():
    snap = _snap(smoke_obs_per_m=TH.smoke_obs_per_m)
    assert hard_alarm(snap, TH) is True
    assert final_alarm_level(0, snap, TH) == 4


def test_vượt_tốc_độ_tăng_nhiệt_thì_báo_dù_SLM_mức_thấp():
    snap = _snap(rate_of_rise_c_per_min=TH.rate_of_rise_c_per_min + 0.1)
    assert final_alarm_level(1, snap, TH) == 4


def test_SLM_mức_cao_vẫn_giữ_nguyên_khi_cảm_biến_bình_thường():
    assert final_alarm_level(3, _snap(), TH) == 3


def test_CO_vượt_ngưỡng():
    assert hard_alarm(_snap(co_ppm=150.0), TH) is True
