"""Gateway FastAPI của FireGuard: hợp đồng /api/v1/verdict mà web app gọi qua ApiAdapter.

Chạy: uvicorn server.app:app --port 8000
Hiện phán quyết bằng luật tất định mô phỏng SLM (cùng logic MockAdapter phía web)
để toàn bộ vòng e2e chạy được trước gate G3; khi SLM thật sẵn sàng, thay hàm
predict_verdict() bằng lời gọi llama.cpp trên gateway biên, giữ nguyên hợp đồng.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="FireGuard gateway", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class Series(BaseModel):
    smoke: list[float]
    temp: list[float]
    co: list[float]


class VerdictRequest(BaseModel):
    event_id: str
    node_id: str
    zone: str
    series: Series
    room: str | None = None
    hour: int | None = None


class VerdictResponse(BaseModel):
    verdict: str
    confidence: float
    explanation: str


def predict_verdict(req: VerdictRequest) -> VerdictResponse:
    peak_smoke = max(req.series.smoke or [0.0])
    temp_rise = (req.series.temp[-1] - req.series.temp[0]) if req.series.temp else 0.0
    if peak_smoke >= 15 or temp_rise >= 8:
        return VerdictResponse(
            verdict="chay_that",
            confidence=0.92,
            explanation="Khói vượt 15%/m hoặc nhiệt tăng nhanh khớp động học cháy; không khớp mẫu lành tính.",
        )
    if peak_smoke >= 3:
        return VerdictResponse(
            verdict="lanh_tinh",
            confidence=0.81,
            explanation="Khói thoáng rồi tắt, nhiệt ổn định; khớp mẫu nấu ăn hoặc hơi nước.",
        )
    return VerdictResponse(
        verdict="khong_chay",
        confidence=0.88,
        explanation="Không có tiến triển đa phương thức nhất quán; nhiều khả năng bụi hoặc sương.",
    )


@app.get("/api/v1/health")
def health() -> dict:
    return {"status": "ok", "model": "rule-mock-pre-G3"}


@app.post("/api/v1/verdict", response_model=VerdictResponse)
def verdict(req: VerdictRequest) -> VerdictResponse:
    if not req.series.smoke:
        raise HTTPException(status_code=422, detail="Thiếu chuỗi khói trong gói ngữ cảnh.")
    return predict_verdict(req)


@app.post("/auth/google")
def auth_google(code: str = "") -> dict:
    """Chỗ đổi authorization code lấy token khi bật OAuth thật; hiện trả phiên mô phỏng."""
    if not code:
        raise HTTPException(status_code=400, detail="Thiếu authorization code.")
    return {"token": f"mock-{code[:8]}", "user": {"name": "Lê Minh Anh", "email": "minhanh.le@gmail.com"}}


@app.get("/api/v1/events")
def events() -> list[dict]:
    return [
        {"id": "evt-2026-0912-001", "zone": "Hành lang tầng 4", "level": 3, "verdict": "chay_that"},
        {"id": "evt-2026-0912-002", "zone": "Bếp căn 12-08", "level": 1, "verdict": "lanh_tinh"},
    ]
