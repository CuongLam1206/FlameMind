#!/usr/bin/env bash
# Tải dataset công khai vào data/external và đăng ký DVC. Chạy một lần, dữ liệu bất biến.
# Nguồn và giấy phép đối chiếu docs/data-cards.md trước khi dùng cho công bố.
set -euo pipefail

mkdir -p data/raw data/analysis data/splits \
  data/processed/detection data/processed/scenarios data/processed/verdict data/processed/hardneg \
  data/external/dfire data/external/fasdd data/external/hqfsd data/external/ms-fsdb \
  data/external/mmodalfire data/external/dfire-video data/external/bowfire data/external/maffnet \
  models

echo "== MS-FSDB (benchmark chính perception) =="
git clone --depth 1 https://github.com/xiaoyihan6/ms-fsdb.git data/external/ms-fsdb || echo "Đã có, bỏ qua clone"

echo "== D-Fire =="
git clone --depth 1 https://github.com/gaia-solutions-on-demand/DFireDataset.git data/external/dfire || echo "Đã có, bỏ qua clone"

echo "== MAFF-Net code + dataset (baseline fusion) =="
git clone --depth 1 https://github.com/Universe-ustc/MAFF-Net.git data/external/maffnet || echo "Đã có, bỏ qua clone"

echo "== MmodalFire: tải thủ công theo hướng dẫn Nature Scientific Data, doi 10.1038/s41597-026-06810-6 =="
echo "   Đọc giấy phép TRƯỚC khi tải; nếu cấm nghiên cứu, kích hoạt pivot CONSTRAINTS mục 6."
mkdir -p data/external/mmodalfire

echo "== Đăng ký DVC =="
if command -v dvc >/dev/null 2>&1; then
  dvc add data/external data/processed 2>/dev/null || true
  echo "DVC đã đăng ký. Commit file .dvc cùng code."
else
  echo "CẢNH BÁO: chưa cài dvc (pip install dvc). Phiên bản dữ liệu chưa được quản lý."
fi

echo "Hoàn tất. Kiểm tra danh sách: dvc status"
