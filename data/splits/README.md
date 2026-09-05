# splits/ — file khóa split đánh giá, theo git chứ không theo DVC

Split là giao thức khoa học, phải nằm trong git để mọi experiment trích đúng bản và mọi lần "mở niêm phong" để lại vết commit.

File dự kiến (tạo ở pha 1 và pha 2, trước khi huấn luyện):

- `msfsdb_test_ids.txt` — ID ảnh test chéo cảnh của MS-FSDB, lấy từ giao thức chính thức.
- `mmodalfire_video_split.json` — ánh xạ 65 video → train/val/held-out 70/15/15 theo video, không theo frame.
- `hardneg_test_ids.json` — danh mục tập nhiễu khó cố định (BoWFire toàn bộ + lớp false của DFIRE-VIDEO + negative chọn từ MS-FSDB).
- `dfire_val_ids.txt` — val detector, tách khỏi train theo cảnh.

Quy tắc niêm phong (CONSTRAINTS mục 7 và data-cards):

1. Held-out MmodalFire chỉ mở đúng hai lần: chấm gate G3 và chốt số paper ở G5; mỗi lần mở là một commit ghi rõ lý do.
2. Không ai được nhìn nhãn của held-out trong lúc chọn hyperparameter; ablation dùng val, không dùng held-out.
3. Đổi split vì phát hiện rò rỉ: ghi biên bản gate, commit mới, experiment cũ đánh dấu vô hiệu trong log.
