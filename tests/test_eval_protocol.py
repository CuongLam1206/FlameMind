"""Test cho metric chốt của gate G3: verdict accuracy và FAR quy đổi."""

import pytest

from fireguard.eval.metrics import false_alarms_per_camera_day, per_class_recall, verdict_accuracy


def test_verdict_accuracy_trọn_vẹn():
    y = ["chay_that", "lanh_tinh", "khong_chay"]
    assert verdict_accuracy(y, y) == 1.0


def test_verdict_accuracy_nhầm_một_trên_bốn():
    y_true = ["chay_that", "chay_that", "lanh_tinh", "khong_chay"]
    y_pred = ["chay_that", "lanh_tinh", "lanh_tinh", "khong_chay"]
    assert verdict_accuracy(y_true, y_pred) == 0.75


def test_bỏ_sót_lớp_cháy_thật_bị_lộ_bởi_per_class_recall():
    y_true = ["chay_that", "chay_that", "khong_chay"]
    y_pred = ["lanh_tinh", "chay_that", "khong_chay"]
    recall = per_class_recall(y_true, y_pred)
    assert recall["chay_that"] == 0.5


def test_FAR_quy_đổi_đúng_ngưỡng_gate():
    # 30 phán quyết sai, 10 camera, 5 ngày => 0.6 lần/camera/ngày, đạt gate <=1
    assert false_alarms_per_camera_day(30, 10, 5) == pytest.approx(0.6)


def test_FAR_từ_chối_tham_số_vô_lý():
    with pytest.raises(ValueError):
        false_alarms_per_camera_day(5, 0, 3)
    with pytest.raises(ValueError):
        verdict_accuracy([], [])
