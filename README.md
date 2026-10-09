# 🎓 Phần Mềm Trộn Đề Thi Trắc Nghiệm Thông Minh & Ngân Hàng Câu Hỏi 11 Môn (Frontend)

Ứng dụng Frontend xây dựng trên nền tảng **Next.js 16 + React 19 + Tailwind CSS** kết nối trực tiếp với **Backend Python FastAPI + MySQL**.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Cấu hình kết nối Backend
File `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Khởi chạy ứng dụng
```bash
npm run dev
```

Mở trình duyệt tại: **`http://localhost:3000`**

---

## 👥 Tài khoản kiểm thử mẫu

| Vai trò | Email | Mật khẩu | Môn học | Gói |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@edu.vn` | `Admin@123` | Toàn quyền | Pro Vĩnh viễn |
| **Giáo viên Toán** | `phuoc.tran@edu.vn` | `Teacher@123` | Toán học | Pro (còn 320 ngày) |
| **Giáo viên Vật lý** | `minh.ly@edu.vn` | `Teacher@123` | Vật lý | Tiêu chuẩn (Normal) |
| **Giáo viên Hóa học** | `hoa.le@edu.vn` | `Teacher@123` | Hóa học | Pro (còn 700 ngày) |

---

## 🔗 Liên kết Backend API

Backend Python được quản lý tại repository riêng:
- **FastAPI Backend Server**: `http://localhost:8000`
- **Swagger UI Tài liệu API**: `http://localhost:8000/docs`
