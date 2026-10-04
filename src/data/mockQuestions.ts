import { ExamItem } from "@/types/question";

export const initialQuestions: ExamItem[] = [
  {
    id: "q-1",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "26-06-2026 11:41:26",
      update_at: "26-06-2026 11:41:26",
    },
    question: {
      content:
        "A. y = x³ - 3x + 1\nB. y = -x³ + 3x - 1\nC. y = x⁴ - 2x² + 1\nD. y = (2x - 1) / (x + 1)",
      question:
        "Đường cong trong hình vẽ là đồ thị của hàm số nào trong các hàm số dưới đây? Biết đồ thị có dạng chữ N với nhánh phải hướng lên.",
      solution_guide:
        "Nhánh phải của đồ thị hướng lên trên nên a > 0. Đồ thị có 2 điểm cực trị nên là hàm số bậc ba y = ax³ + bx² + cx + d. Do đó đáp án phù hợp là y = x³ - 3x + 1.",
      answer: "A",
      level: {
        id: 1,
        name: "Nhận Biết",
        short_name: "NB",
      },
      type: {
        id: 1,
        name: "Trắc Nghiệm",
        short_name: "TN",
      },
    },
  },
  {
    id: "q-2",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "26-06-2026 11:41:26",
      update_at: "26-06-2026 11:41:26",
    },
    question: {
      content:
        "a) Tập xác định của hàm số là D = ℝ \\ {2}.\nb) Đạo hàm y' = -5 / (x - 2)² < 0 với mọi x ≠ 2.\nc) Đường thẳng x = 2 là tiệm cận đứng, y = 1 là tiệm cận ngang.\nd) Hàm số nghịch biến trên khoảng (-∞; +∞).",
      question:
        "Cho hàm số y = f(x) = (x + 3) / (x - 2). Xét tính đúng/sai của các mệnh đề sau:",
      solution_guide:
        "• Mệnh đề a: Đúng, mẫu số x - 2 ≠ 0 <=> x ≠ 2.\n• Mệnh đề b: Đúng, y' = (1*(-2) - 3*1)/(x - 2)² = -5/(x - 2)² < 0 với mọi x ≠ 2.\n• Mệnh đề c: Đúng, lim x->2 f(x) = ∞ => x=2 là TCĐ; lim x->∞ f(x) = 1 => y=1 là TCN.\n• Mệnh đề d: Sai, hàm số phân thức bậc nhất/bậc nhất nghịch biến trên từng khoảng xác định (-∞; 2) và (2; +∞), không nghịch biến trên toàn bộ ℝ.",
      answer: "a) Đúng | b) Đúng | c) Đúng | d) Sai",
      level: {
        id: 2,
        name: "Thông Hiểu",
        short_name: "TH",
      },
      type: {
        id: 2,
        name: "Đúng Sai",
        short_name: "DS",
      },
    },
  },
  {
    id: "q-3",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "26-06-2026 11:41:26",
      update_at: "26-06-2026 11:41:26",
    },
    question: {
      content:
        "Cho phương trình x³ - 3x² + m = 0 (với m là tham số thực). Đồ thị hàm số y = x³ - 3x² cắt đường thẳng y = -m.",
      question:
        "Tìm số nguyên dương m nhỏ nhất để phương trình x³ - 3x² + m = 0 có đúng 3 nghiệm thực phân biệt.",
      solution_guide:
        "Phương trình tương đương x³ - 3x² = -m.\nXét hàm số g(x) = x³ - 3x²:\ng'(x) = 3x² - 6x = 0 <=> x = 0 hoặc x = 2.\nBảng biến thiên: g(0) = 0 (cực đại), g(2) = -4 (cực tiểu).\nĐể phương trình có 3 nghiệm phân biệt thì -4 < -m < 0 <=> 0 < m < 4.\nVì m là số nguyên dương nên m ∈ {1, 2, 3}. Giá trị nhỏ nhất là m = 1.",
      answer: "1",
      level: {
        id: 3,
        name: "Vận Dụng",
        short_name: "VD",
      },
      type: {
        id: 3,
        name: "Trả Lời Ngắn",
        short_name: "TLN",
      },
    },
  },
  {
    id: "q-4",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "26-06-2026 11:41:26",
      update_at: "26-06-2026 11:41:26",
    },
    question: {
      content:
        "Một công ty dự định thiết kế một bể chứa nước không nắp dạng hình hộp chữ nhật có thể tích V = 32 m³. Đáy bể là hình chữ nhật có chiều dài gấp đôi chiều rộng.",
      question:
        "Hãy xác định các kích thước (chiều rộng, chiều dài, chiều cao) của bể nước sao cho diện tích vật liệu xây dựng toàn phần (gồm đáy và 4 mặt bên) là nhỏ nhất. Trình bày chi tiết các bước tính.",
      solution_guide:
        "1. Gọi chiều rộng đáy bể là x (m, x > 0).\n   Chiều dài đáy bể là 2x (m).\n   Chiều cao của bể là h (m, h > 0).\n2. Thể tích bể: V = x · 2x · h = 2x²h = 32 => h = 16 / x².\n3. Diện tích vật liệu xây dựng (không có nắp):\n   S(x) = S_đáy + S_xung quanh = 2x² + 2(x + 2x)h = 2x² + 6x(16 / x²) = 2x² + 96 / x.\n4. Tìm giá trị nhỏ nhất của S(x) với x > 0:\n   S'(x) = 4x - 96 / x² = (4x³ - 96) / x².\n   S'(x) = 0 <=> 4x³ = 96 <=> x³ = 24 <=> x = 2∛3 (m) ≈ 2.88 m.\n   Qua bảng biến thiên, S(x) đạt giá trị nhỏ nhất tại x = 2∛3.\n5. Các kích thước tối ưu:\n   - Chiều rộng: x = 2∛3 m (~2.88 m)\n   - Chiều dài: 2x = 4∛3 m (~5.77 m)\n   - Chiều cao: h = 16 / (2∛3)² = 4 / (∛3)² m (~1.92 m).",
      answer:
        "Chiều rộng = 2∛3 m (~2.88m); Chiều dài = 4∛3 m (~5.77m); Chiều cao = 4/(∛3)² m (~1.92m)",
      level: {
        id: 4,
        name: "Vận Dụng Cao",
        short_name: "VDC",
      },
      type: {
        id: 4,
        name: "Tự Luận",
        short_name: "TL",
      },
    },
  },
  {
    id: "q-5",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "27-06-2026 09:15:00",
      update_at: "27-06-2026 09:15:00",
    },
    question: {
      content:
        "A. 1\nB. 2\nC. 3\nD. 0",
      question:
        "Số điểm cực trị của hàm số y = x⁴ - 4x² + 3 là bao nhiêu?",
      solution_guide:
        "y' = 4x³ - 8x = 4x(x² - 2) = 0 <=> x = 0 hoặc x = ±√2. Phương trình y'=0 có 3 nghiệm phân biệt và y' đổi dấu qua cả 3 nghiệm, do đó hàm số có 3 điểm cực trị.",
      answer: "C",
      level: {
        id: 1,
        name: "Nhận Biết",
        short_name: "NB",
      },
      type: {
        id: 1,
        name: "Trắc Nghiệm",
        short_name: "TN",
      },
    },
  },
  {
    id: "q-6",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "27-06-2026 10:20:45",
      update_at: "27-06-2026 10:20:45",
    },
    question: {
      content:
        "Cho hình chóp S.ABC có đáy ABC là tam giác vuông tại B, AB = a, BC = a√3. Cạnh bên SA vuông góc với mặt phẳng đáy (ABC) và SA = 2a.",
      question:
        "Tính thể tích khối chóp S.ABC theo a.",
      solution_guide:
        "Diện tích đáy S_ABC = 1/2 · AB · BC = 1/2 · a · a√3 = (a²√3) / 2.\nChiều cao khối chóp h = SA = 2a.\nThể tích V = 1/3 · S_ABC · SA = 1/3 · (a²√3 / 2) · 2a = (a³√3) / 3.",
      answer: "(a³√3) / 3",
      level: {
        id: 2,
        name: "Thông Hiểu",
        short_name: "TH",
      },
      type: {
        id: 3,
        name: "Trả Lời Ngắn",
        short_name: "TLN",
      },
    },
  },
];
