/**
 * Phiên đăng nhập. Hiện là OAuth Google MÔ PHỎNG: nút Google tạo phiên cục bộ
 * sau khoảng trễ mạng giả lập. Khi triển khai thật, đổi hàm googleLogin() thành
 * luồng OAuth chuẩn: redirect sang accounts.google.com với client id, rồi đổi
 * authorization code lấy token tại POST /auth/google của backend (server/app.py).
 */
export interface SessionUser {
  name: string;
  email: string;
  provider: "google";
}

const KEY = "fg.user";

export function currentUser(): SessionUser | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function googleLogin(): Promise<SessionUser> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: SessionUser = { name: "Lê Minh Anh", email: "minhanh.le@gmail.com", provider: "google" };
      localStorage.setItem(KEY, JSON.stringify(user));
      resolve(user);
    }, 700);
  });
}

export function logout(): void {
  localStorage.removeItem(KEY);
}
