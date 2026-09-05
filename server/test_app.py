"""Test e2e mức API cho gateway: đúng hợp đồng mà web ApiAdapter gọi."""

from fastapi.testclient import TestClient

from server.app import app

client = TestClient(app)


def payload(smoke_peak: float, temp_rise: float) -> dict:
    return {
        "event_id": "evt-test-001",
        "node_id": "A4-02",
        "zone": "Hành lang tầng 4",
        "series": {
            "smoke": [0.5, smoke_peak * 0.6, smoke_peak],
            "temp": [26.0, 26.0 + temp_rise * 0.5, 26.0 + temp_rise],
            "co": [5, 8, 10],
        },
    }


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_verdict_chay_that():
    r = client.post("/api/v1/verdict", json=payload(18.0, 9.0))
    assert r.status_code == 200
    assert r.json()["verdict"] == "chay_that"


def test_verdict_lanh_tinh():
    r = client.post("/api/v1/verdict", json=payload(4.0, 1.0))
    assert r.json()["verdict"] == "lanh_tinh"


def test_verdict_khong_chay():
    r = client.post("/api/v1/verdict", json=payload(1.0, 0.2))
    assert r.json()["verdict"] == "khong_chay"


def test_verdict_thieu_chuoi_khoi_bi_tu_choi():
    bad = payload(1.0, 0.2)
    bad["series"]["smoke"] = []
    assert client.post("/api/v1/verdict", json=bad).status_code == 422


def test_auth_google_can_code():
    assert client.post("/auth/google", params={"code": ""}).status_code == 400
    assert client.post("/auth/google", params={"code": "abc12345"}).status_code == 200
