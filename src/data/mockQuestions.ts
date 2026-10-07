import { ExamItem } from "@/types/question";

export const initialQuestions: ExamItem[] = [
  // ================= TOÁN HỌC =================
  {
    id: "toan-12-1",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "26-06-2026 11:41:26",
      update_at: "26-06-2026 11:41:26",
    },
    question: {
      lesson: "Bài 1: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. y = x³ - 3x + 1\nB. y = -x³ + 3x - 1\nC. y = x⁴ - 2x² + 1\nD. y = (2x - 1) / (x + 1)",
      question:
        "Đường cong trong hình vẽ là đồ thị của hàm số nào trong các hàm số dưới đây? Biết đồ thị có dạng chữ N với nhánh phải hướng lên và có 2 điểm cực trị.",
      solution_guide:
        "Nhánh phải của đồ thị hướng lên trên nên a > 0. Đồ thị có 2 điểm cực trị nên là hàm số bậc ba y = ax³ + bx² + cx + d. Do đó đáp án phù hợp là y = x³ - 3x + 1.",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "toan-12-2",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "26-06-2026 11:41:26",
      update_at: "26-06-2026 11:41:26",
    },
    question: {
      lesson: "Bài 2: Tính đơn điệu và cực trị của hàm số",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "a) Tập xác định của hàm số là D = ℝ \\ {2}.\nb) Đạo hàm y' = -5 / (x - 2)² < 0 với mọi x ≠ 2.\nc) Đường thẳng x = 2 là tiệm cận đứng, y = 1 là tiệm cận ngang.\nd) Hàm số nghịch biến trên khoảng (-∞; +∞).",
      question:
        "Cho hàm số y = f(x) = (x + 3) / (x - 2). Xét tính đúng/sai của các mệnh đề sau:",
      solution_guide:
        "• Mệnh đề a: Đúng, mẫu số x - 2 ≠ 0 <=> x ≠ 2.\n• Mệnh đề b: Đúng, y' = (1*(-2) - 3*1)/(x - 2)² = -5/(x - 2)² < 0 với mọi x ≠ 2.\n• Mệnh đề c: Đúng, tiệm cận đứng x = 2, tiệm cận ngang y = 1.\n• Mệnh đề d: Sai, hàm số phân thức nghịch biến trên từng khoảng (-∞; 2) và (2; +∞), không nghịch biến trên ℝ.",
      answer: "a) Đúng | b) Đúng | c) Đúng | d) Sai",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 2, name: "Đúng Sai", short_name: "DS" },
    },
  },
  {
    id: "toan-11-1",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "27-06-2026 08:30:00",
      update_at: "27-06-2026 08:30:00",
    },
    question: {
      lesson: "Bài 3: Cấp số nhân",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 11, name: "Khối 11" },
      content:
        "A. S = 2\nB. S = 1\nC. S = 1/2\nD. S = 4",
      question:
        "Tổng của cấp số nhân lùi vô hạn với số hạng đầu u₁ = 1 và công bội q = 1/2 là bao nhiêu?",
      solution_guide:
        "Công thức tổng cấp số nhân lùi vô hạn (|q| < 1): S = u₁ / (1 - q) = 1 / (1 - 1/2) = 1 / (1/2) = 2.",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "toan-10-1",
    author: {
      id: 1,
      name: "Tran Tan Phuoc",
      created_at: "27-06-2026 09:00:00",
      update_at: "27-06-2026 09:00:00",
    },
    question: {
      lesson: "Bài 2: Hàm số bậc hai và đồ thị",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 10, name: "Khối 10" },
      content:
        "A. I(1; -4)\nB. I(-1; -4)\nC. I(2; -5)\nD. I(-2; 5)",
      question:
        "Tọa độ đỉnh I của parabol (P): y = x² - 2x - 3 là:",
      solution_guide:
        "Hoành độ đỉnh: x_I = -b / (2a) = -(-2) / (2 · 1) = 1.\nTung độ đỉnh: y_I = 1² - 2(1) - 3 = -4.\nVậy đỉnh I có tọa độ (1; -4).",
      answer: "A",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= VẬT LÝ =================
  {
    id: "ly-12-1",
    author: {
      id: 2,
      name: "Nguyen Thi Lan",
      created_at: "28-06-2026 14:10:00",
      update_at: "28-06-2026 14:10:00",
    },
    question: {
      lesson: "Bài 1: Dao động điều hòa",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. T = 2π√(l/g)\nB. T = 2π√(g/l)\nC. T = 1/(2π)√(l/g)\nD. T = 2π√(m/k)",
      question:
        "Công thức tính chu kì dao động điều hòa của con lắc đơn có chiều dài l tại nơi có gia tốc trọng trường g là:",
      solution_guide:
        "Chu kì dao động của con lắc đơn: T = 2π√(l/g).",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "ly-12-2",
    author: {
      id: 2,
      name: "Nguyen Thi Lan",
      created_at: "28-06-2026 14:30:00",
      update_at: "28-06-2026 14:30:00",
    },
    question: {
      lesson: "Bài 2: Con lắc lò xo và con lắc đơn",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "Một vật dao động điều hòa với biên độ A = 4 cm, chu kỳ T = 2 s. Tại thời điểm t = 0 vật qua vị trí cân bằng theo chiều dương.",
      question:
        "Tính tốc độ của vật khi đi qua vị trí cân bằng (đơn vị: cm/s, lấy π = 3.14).",
      solution_guide:
        "Tần số góc: ω = 2π / T = 2π / 2 = π (rad/s).\nTốc độ cực đại tại vị trí cân bằng: v_max = ω · A = π · 4 = 4π ≈ 12.57 cm/s.",
      answer: "12.57",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 3, name: "Trả Lời Ngắn", short_name: "TLN" },
    },
  },
  {
    id: "ly-10-1",
    author: {
      id: 2,
      name: "Nguyen Thi Lan",
      created_at: "28-06-2026 15:00:00",
      update_at: "28-06-2026 15:00:00",
    },
    question: {
      lesson: "Bài 10: Định luật II Newton",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 10, name: "Khối 10" },
      content:
        "A. F = m / a\nB. F = m · a\nC. a = F · m\nD. F = m · v",
      question:
        "Theo định luật II Newton, biểu thức liên hệ giữa lực tác dụng F, khối lượng m và gia tốc a là:",
      solution_guide:
        "Định luật II Newton phát biểu: F = m · a.",
      answer: "B",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= HÓA HỌC =================
  {
    id: "hoa-12-1",
    author: {
      id: 3,
      name: "Le Hoang Nam",
      created_at: "29-06-2026 10:15:00",
      update_at: "29-06-2026 10:15:00",
    },
    question: {
      lesson: "Bài 1: Este - Lipit",
      subject: { id: "HOA", name: "Hóa học" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. CH₃COOCH₃\nB. HCOOC₂H₅\nC. CH₃COOC₂H₅\nD. HCOOCH₃",
      question:
        "Este có mùi thơm của chuối chín là isoamyl axetat. Còn este etyl fomat có công thức phân tử là gì?",
      solution_guide:
        "Etyl fomat tạo từ axit fomic (HCOOH) và ancol etylic (C₂H₅OH), công thức cấu tạo là HCOOC₂H₅.",
      answer: "B",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "hoa-11-1",
    author: {
      id: 3,
      name: "Le Hoang Nam",
      created_at: "29-06-2026 10:45:00",
      update_at: "29-06-2026 10:45:00",
    },
    question: {
      lesson: "Bài 2: Sự điện li và pH",
      subject: { id: "HOA", name: "Hóa học" },
      grade: { id: 11, name: "Khối 11" },
      content:
        "A. pH = 7\nB. pH < 7\nC. pH > 7\nD. pH = 0",
      question:
        "Dung dịch chất nào có môi trường axit ở 25°C thì giá trị pH thỏa mãn điều kiện nào?",
      solution_guide:
        "Ở 25°C: Môi trường axit có [H⁺] > 10⁻⁷ M nên pH < 7.",
      answer: "B",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= SINH HỌC =================
  {
    id: "sinh-12-1",
    author: {
      id: 4,
      name: "Vu Thi Mai",
      created_at: "30-06-2026 09:20:00",
      update_at: "30-06-2026 09:20:00",
    },
    question: {
      lesson: "Bài 1: Quy luật phân li của Menđen",
      subject: { id: "SINH", name: "Sinh học" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. 1 : 1\nB. 3 : 1\nC. 1 : 2 : 1\nD. 9 : 3 : 3 : 1",
      question:
        "Theo Menđen, khi lai hai cơ thể thuần chủng khác nhau về một cặp tính trạng tương phản, tỉ lệ phân li kiểu hình ở thế hệ F₂ là:",
      solution_guide:
        "Quy luật phân li của Menđen: Thế hệ F₂ phân li theo tỉ lệ xấp xỉ 3 trội : 1 lặn.",
      answer: "B",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "sinh-10-1",
    author: {
      id: 4,
      name: "Vu Thi Mai",
      created_at: "30-06-2026 09:40:00",
      update_at: "30-06-2026 09:40:00",
    },
    question: {
      lesson: "Bài 9: Tế bào nhân thực - Các bào quan",
      subject: { id: "SINH", name: "Sinh học" },
      grade: { id: 10, name: "Khối 10" },
      content:
        "A. Nhân tế bào\nB. Ti thể\nC. Ribôxôm\nD. Lục lạp",
      question:
        "Bào quan nào được ví như 'nhà máy năng lượng' của tế bào nhân thực?",
      solution_guide:
        "Ti thể là nơi diễn ra hô hấp tế bào tạo ra phần lớn ATP (năng lượng cho mọi hoạt động sống), do đó được gọi là nhà máy năng lượng của tế bào.",
      answer: "B",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= TIẾNG ANH =================
  {
    id: "anh-12-1",
    author: {
      id: 5,
      name: "Pham Quoc Bao",
      created_at: "01-07-2026 14:00:00",
      update_at: "01-07-2026 14:00:00",
    },
    question: {
      lesson: "Unit 5: Higher Education - Grammar: Conditionals",
      subject: { id: "ANH", name: "Tiếng Anh" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. will pass\nB. would pass\nC. passed\nD. would have passed",
      question:
        "Choose the correct option: 'If she had studied harder, she _______ the entrance exam.'",
      solution_guide:
        "Đây là câu điều kiện loại 3 (diễn tả sự việc trái với thực tế trong quá khứ):\nIf + S + had + P2, S + would have + P2.\nDo đó đáp án chính xác là 'would have passed'.",
      answer: "D",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "anh-10-1",
    author: {
      id: 5,
      name: "Pham Quoc Bao",
      created_at: "01-07-2026 14:20:00",
      update_at: "01-07-2026 14:20:00",
    },
    question: {
      lesson: "Unit 1: Family Life - Grammar: Prepositions of Time",
      subject: { id: "ANH", name: "Tiếng Anh" },
      grade: { id: 10, name: "Khối 10" },
      content:
        "A. in\nB. at\nC. on\nD. to",
      question:
        "Choose the correct preposition: 'We have English lessons _______ Monday and Thursday mornings.'",
      solution_guide:
        "Giới từ đi với các thứ trong tuần (Monday, Thursday,...) là 'on'.",
      answer: "C",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= NGỮ VĂN =================
  {
    id: "van-12-1",
    author: {
      id: 6,
      name: "Doan Thi Ngoc",
      created_at: "02-07-2026 08:15:00",
      update_at: "02-07-2026 08:15:00",
    },
    question: {
      lesson: "Bài 2: Tây Tiến (Quang Dũng)",
      subject: { id: "VAN", name: "Ngữ văn" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. Quang Dũng\nB. Tố Hữu\nC. Chế Lan Viên\nD. Nguyễn Khoa Điềm",
      question:
        "Tác giả của bài thơ 'Tây Tiến' - kiệt tác thơ ca kháng chiến chống Pháp là nhà thơ nào?",
      solution_guide:
        "Bài thơ 'Tây Tiến' do nhà thơ Quang Dũng sáng tác năm 1948 tại Phù Lưu Chanh khi ông rời xa đơn vị Tây Tiến.",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "van-11-1",
    author: {
      id: 6,
      name: "Doan Thi Ngoc",
      created_at: "02-07-2026 08:45:00",
      update_at: "02-07-2026 08:45:00",
    },
    question: {
      lesson: "Bài 6: Chí Phèo (Nam Cao)",
      subject: { id: "VAN", name: "Ngữ văn" },
      grade: { id: 11, name: "Khối 11" },
      content:
        "A. Nam Cao\nB. Ngô Tất Tố\nC. Vũ Trọng Phụng\nD. Nguyễn Công Hoan",
      question:
        "Tác phẩm 'Chí Phèo' - đỉnh cao của chủ nghĩa hiện thực phê phán Việt Nam 1930-1945 là của nhà văn nào?",
      solution_guide:
        "Truyện ngắn 'Chí Phèo' (nguyên văn ban đầu là 'Cái lò gạch cũ') là tác phẩm xuất sắc của nhà văn Nam Cao viết năm 1941.",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= LỊCH SỬ =================
  {
    id: "su-12-1",
    author: {
      id: 7,
      name: "Tran Van Duc",
      created_at: "03-07-2026 15:30:00",
      update_at: "03-07-2026 15:30:00",
    },
    question: {
      lesson: "Bài 23: Kháng chiến chống Mỹ cứu nước (1954-1975)",
      subject: { id: "SU", name: "Lịch sử" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. 1954\nB. 1975\nC. 1945\nD. 1968",
      question:
        "Chiến dịch Hồ Chí Minh lịch sử toàn thắng, giải phóng hoàn toàn miền Nam, thống nhất đất nước diễn ra vào năm nào?",
      solution_guide:
        "Chiến dịch Hồ Chí Minh kết thúc thắng lợi vào ngày 30 tháng 4 năm 1975.",
      answer: "B",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= ĐỊA LÝ =================
  {
    id: "dia-12-1",
    author: {
      id: 8,
      name: "Nguyen Hong Hanh",
      created_at: "04-07-2026 10:00:00",
      update_at: "04-07-2026 10:00:00",
    },
    question: {
      lesson: "Bài 2: Vị trí địa lí, phạm vi lãnh thổ",
      subject: { id: "DIA", name: "Địa lý" },
      grade: { id: 12, name: "Khối 12" },
      content:
        "A. 3.260 km\nB. 4.500 km\nC. 2.360 km\nD. 1.650 km",
      question:
        "Đường bờ biển của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam dài khoảng bao nhiêu km?",
      solution_guide:
        "Việt Nam có đường bờ biển dài khoảng 3.260 km từ Móng Cái (Quảng Ninh) đến Hà Tiên (Kiên Giang).",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= TIN HỌC =================
  {
    id: "tin-11-1",
    author: {
      id: 9,
      name: "Bui Minh Tri",
      created_at: "04-07-2026 11:20:00",
      update_at: "04-07-2026 11:20:00",
    },
    question: {
      lesson: "Bài 14: Thuật toán tìm kiếm và sắp xếp",
      subject: { id: "TIN", name: "Tin học" },
      grade: { id: 11, name: "Khối 11" },
      content:
        "A. O(1)\nB. O(log n)\nC. O(n)\nD. O(n²)",
      question:
        "Độ phức tạp thời gian trung bình của thuật toán tìm kiếm nhị phân (Binary Search) trên mảng đã sắp xếp gồm n phần tử là:",
      solution_guide:
        "Sau mỗi lần so sánh, không gian tìm kiếm giảm đi một nửa: n -> n/2 -> n/4 -> ... Do đó độ phức tạp là O(log n).",
      answer: "B",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // ================= BỔ SUNG CÂU HỎI ĐA DẠNG CHO CÁC MÔN =================
  // TOÁN (VD, VDC, TL)
  {
    id: "toan-12-vd-1",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 09:00:00", update_at: "06-07-2026 09:00:00" },
    question: {
      lesson: "Bài 2: Cực trị của hàm số",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 12, name: "Khối 12" },
      content: "A. m ∈ (1; 3)\nB. m ∈ [-1; 2]\nC. m ∈ (2; +∞)\nD. m ∈ (-∞; 0]",
      question: "Tìm tất cả các giá trị thực của tham số m để hàm số y = x³ - 3mx² + 3(m² - 1)x đạt cực tiểu tại x = 2.",
      solution_guide: "y' = 3x² - 6mx + 3(m² - 1). Để x = 2 là điểm cực tiểu thì y'(2) = 0 và y''(2) > 0. Giải hệ phương trình tìm được m = 1 hoặc m = 3, thử lại điều kiện cực tiểu suy ra m = 1.",
      answer: "A",
      level: { id: 3, name: "Vận Dụng", short_name: "VD" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "toan-12-vdc-1",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 09:15:00", update_at: "06-07-2026 09:15:00" },
    question: {
      lesson: "Bài 3: Đường thẳng và mặt phẳng vuông góc",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 12, name: "Khối 12" },
      content: "Cho hình lăng trụ đứng ABC.A'B'C' có đáy ABC là tam giác vuông cân tại B, AB = BC = a. Biết khoảng cách từ A đến mặt phẳng (A'BC) bằng (a√2)/2.",
      question: "Tính góc giữa đường thẳng A'B và mặt phẳng đáy (ABC) theo độ.",
      solution_guide: "Đặt chiều cao AA' = h. Dựng AH ⊥ A'B tại H => AH = (a√2)/2. Áp dụng 1/AH² = 1/AA'² + 1/AB² => h = a. Khi đó tan(A'BA) = AA'/AB = a/a = 1 => góc A'BA = 45°.",
      answer: "45",
      level: { id: 4, name: "Vận Dụng Cao", short_name: "VDC" },
      type: { id: 3, name: "Trả Lời Ngắn", short_name: "TLN" },
    },
  },
  {
    id: "toan-10-tl-1",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 09:30:00", update_at: "06-07-2026 09:30:00" },
    question: {
      lesson: "Bài 4: Bất phương trình bậc hai một ẩn",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 10, name: "Khối 10" },
      content: "Giải bất phương trình: √(x² - 3x - 10) ≤ x - 2.",
      question: "Trình bày các bước tìm tập nghiệm của bất phương trình chứa căn bậc hai đã cho.",
      solution_guide: "Điều kiện: x² - 3x - 10 ≥ 0 và x - 2 ≥ 0. Bình phương hai vế: x² - 3x - 10 ≤ x² - 4x + 4 <=> x ≤ 14. Kết hợp điều kiện x ≥ 5 => Tập nghiệm S = [5; 14].",
      answer: "S = [5; 14]",
      level: { id: 3, name: "Vận Dụng", short_name: "VD" },
      type: { id: 4, name: "Tự Luận", short_name: "TL" },
    },
  },

  // VẬT LÝ (DS, VD, TL)
  {
    id: "ly-12-ds-1",
    author: { id: 2, name: "Nguyen Thi Lan", created_at: "06-07-2026 10:00:00", update_at: "06-07-2026 10:00:00" },
    question: {
      lesson: "Bài 7: Sóng cơ và sự truyền sóng cơ",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 12, name: "Khối 12" },
      content: "a) Trong sóng cơ, bước sóng λ là quãng đường sóng truyền đi trong 1 chu kì T.\nb) Các phân tử vật chất của môi trường chuyển động thẳng đều theo chiều truyền sóng.\nc) Sóng ngang truyền được trong chất rắn và bề mặt chất lỏng.\nd) Vận tốc truyền sóng phụ thuộc vào tần số sóng và không phụ thuộc bản chất môi trường.",
      question: "Xét các phát biểu về sự truyền sóng cơ trong môi trường đàn hồi, chọn tính Đúng/Sai:",
      solution_guide: "• a: Đúng (định nghĩa bước sóng).\n• b: Sai (phân tử dao động tại chỗ quanh vị trí cân bằng, không truyền đi).\n• c: Đúng (đặc tính sóng ngang).\n• d: Sai (vận tốc truyền sóng phụ thuộc bản chất và nhiệt độ môi trường).",
      answer: "a) Đúng | b) Sai | c) Đúng | d) Sai",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 2, name: "Đúng Sai", short_name: "DS" },
    },
  },
  {
    id: "ly-11-vd-1",
    author: { id: 2, name: "Nguyen Thi Lan", created_at: "06-07-2026 10:15:00", update_at: "06-07-2026 10:15:00" },
    question: {
      lesson: "Bài 9: Định luật Ôm đối với toàn mạch",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 11, name: "Khối 11" },
      content: "A. 1.5 A\nB. 2.0 A\nC. 0.8 A\nD. 3.0 A",
      question: "Cho mạch điện kín gồm nguồn điện E = 12V, r = 1Ω và điện trở ngoài R = 5Ω. Cường độ dòng điện chạy trong mạch là:",
      solution_guide: "Áp dụng định luật Ohm cho toàn mạch: I = E / (R + r) = 12 / (5 + 1) = 12 / 6 = 2 A.",
      answer: "B",
      level: { id: 3, name: "Vận Dụng", short_name: "VD" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "ly-10-tl-1",
    author: { id: 2, name: "Nguyen Thi Lan", created_at: "06-07-2026 10:30:00", update_at: "06-07-2026 10:30:00" },
    question: {
      lesson: "Bài 12: Chuyển động của vật trên mặt phẳng nghiêng",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 10, name: "Khối 10" },
      content: "Một vật có khối lượng m = 2 kg trượt từ đỉnh mặt phẳng nghiêng dài s = 10 m, góc nghiêng α = 30° so với phương ngang. Hệ số ma sát µ = 0.1, lấy g = 9.8 m/s².",
      question: "Tính gia tốc chuyển động của vật trên mặt phẳng nghiêng (m/s²).",
      solution_guide: "Áp dụng định luật II Newton chiếu lên phương chuyển động: a = g(sin α - µ cos α) = 9.8 · (sin 30° - 0.1 · cos 30°) = 9.8 · (0.5 - 0.0866) ≈ 4.05 m/s².",
      answer: "4.05 m/s²",
      level: { id: 4, name: "Vận Dụng Cao", short_name: "VDC" },
      type: { id: 4, name: "Tự Luận", short_name: "TL" },
    },
  },

  // HÓA HỌC (DS, VD, TLN)
  {
    id: "hoa-12-ds-1",
    author: { id: 3, name: "Le Hoang Nam", created_at: "06-07-2026 11:00:00", update_at: "06-07-2026 11:00:00" },
    question: {
      lesson: "Bài 5: Glucozơ và Cacbohiđrat",
      subject: { id: "HOA", name: "Hóa học" },
      grade: { id: 12, name: "Khối 12" },
      content: "a) Glucozơ và fructozơ đều tham gia phản ứng tráng bạc sinh ra Ag.\nb) Xenlulozơ và tinh bột là đồng phân của nhau.\nc) Saccarozơ bị thủy phân trong môi trường axit cho ra glucozơ và fructozơ.\nd) Dung dịch glucozơ hòa tan Cu(OH)₂ ở nhiệt độ thường tạo phức màu xanh lam.",
      question: "Xét tính Đúng / Sai của các phát biểu về cacbohiđrat sau đây:",
      solution_guide: "• a: Đúng (đều tráng bạc).\n• b: Sai (hệ số polime hóa n khác nhau nên không phải đồng phân).\n• c: Đúng (thủy phân saccarozơ).\n• d: Đúng (glucozơ có nhiều nhóm -OH kề nhau).",
      answer: "a) Đúng | b) Sai | c) Đúng | d) Đúng",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 2, name: "Đúng Sai", short_name: "DS" },
    },
  },
  {
    id: "hoa-11-vd-1",
    author: { id: 3, name: "Le Hoang Nam", created_at: "06-07-2026 11:15:00", update_at: "06-07-2026 11:15:00" },
    question: {
      lesson: "Bài 3: Axit, bazơ và muối - Thang pH",
      subject: { id: "HOA", name: "Hóa học" },
      grade: { id: 11, name: "Khối 11" },
      content: "A. pH = 12\nB. pH = 2\nC. pH = 13\nD. pH = 1",
      question: "Hòa tan hoàn toàn 0.4 gam NaOH vào nước thu được 1 lít dung dịch X. Giá trị pH của dung dịch X là bao nhiêu?",
      solution_guide: "n_NaOH = 0.4 / 40 = 0.01 mol. Nồng độ [OH⁻] = 0.01 / 1 = 10⁻² M => pOH = 2 => pH = 14 - 2 = 12.",
      answer: "A",
      level: { id: 3, name: "Vận Dụng", short_name: "VD" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },

  // TIẾNG ANH (DS, VD, TLN)
  {
    id: "anh-12-vd-1",
    author: { id: 5, name: "Pham Thu Ha", created_at: "06-07-2026 14:00:00", update_at: "06-07-2026 14:00:00" },
    question: {
      lesson: "Unit 8: Life in the Future - Inversion",
      subject: { id: "ANH", name: "Tiếng Anh" },
      grade: { id: 12, name: "Khối 12" },
      content: "A. had they arrived / when\nB. did they arrive / than\nC. had they arrived / that\nD. they had arrived / then",
      question: "Scarcely _______ at the airport _______ the severe storm hit the city.",
      solution_guide: "Cấu trúc đảo ngữ: Scarcely had + S + V(pII) + when + S + V(quá khứ đơn).",
      answer: "A",
      level: { id: 3, name: "Vận Dụng", short_name: "VD" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "anh-11-ds-1",
    author: { id: 5, name: "Pham Thu Ha", created_at: "06-07-2026 14:20:00", update_at: "06-07-2026 14:20:00" },
    question: {
      lesson: "Unit 7: Further Education - Language Focus",
      subject: { id: "ANH", name: "Tiếng Anh" },
      grade: { id: 11, name: "Khối 11" },
      content: "a) 'Look forward to' is followed by a gerund (V-ing).\nb) In passive voice of Present Perfect: S + have/has + been + V3/ed.\nc) 'Unless' has the same meaning as 'If'.\nd) Conditional Sentence Type 2 expresses an imaginary situation in the present or future.",
      question: "Determine whether each grammatical statement below is True (Đúng) or False (Sai):",
      solution_guide: "• a: Đúng (look forward to doing sth).\n• b: Đúng (công thức bị động HTHT).\n• c: Sai (Unless = If not).\n• d: Đúng (câu điều kiện loại 2).",
      answer: "a) Đúng | b) Đúng | c) Sai | d) Đúng",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 2, name: "Đúng Sai", short_name: "DS" },
    },
  },

  // NGỮ VĂN (TL, VD)
  {
    id: "van-12-vdc-1",
    author: { id: 6, name: "Nguyen Van Tam", created_at: "06-07-2026 15:00:00", update_at: "06-07-2026 15:00:00" },
    question: {
      lesson: "Bài 7: Người lái đò Sông Đà (Nguyễn Tuân)",
      subject: { id: "VAN", name: "Ngữ văn" },
      grade: { id: 12, name: "Khối 12" },
      content: "Cảm nhận về vẻ đẹp trữ tình và dòng chảy thiên nhiên thơ mộng của sông Đà trong đoạn văn: 'Con Sông Đà tuôn dài tuôn dài như một áng tóc trữ tình, đầu tóc chân tóc ẩn hiện trong mây trời Tây Bắc...'",
      question: "Viết đoạn văn nghị luận văn học khoảng 200 chữ phân tích nghệ thuật so sánh độc đáo của Nguyễn Tuân trong đoạn văn trên.",
      solution_guide: "1. Mở đoạn: Giới thiệu Nguyễn Tuân và hình tượng Sông Đà trữ tình.\n2. Thân đoạn: Phân tích phép so sánh 'như một áng tóc trữ tình', từ láy 'tuôn dài tuôn dài' gợi nhịp điệu êm đềm, vẻ đẹp kiều diễm như thiếu nữ Tây Bắc.\n3. Kết đoạn: Khẳng định tài hoa uyên bác và tình yêu tha thiết với vẻ đẹp đất nước của nhà văn.",
      answer: "Đoạn văn nghị luận hoàn chỉnh",
      level: { id: 4, name: "Vận Dụng Cao", short_name: "VDC" },
      type: { id: 4, name: "Tự Luận", short_name: "TL" },
    },
  },

  // BỔ SUNG TOÁN KHỐI 11 & 10
  {
    id: "toan-11-tn-2",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 15:30:00", update_at: "06-07-2026 15:30:00" },
    question: {
      lesson: "Bài 1: Giới hạn của dãy số",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 11, name: "Khối 11" },
      content: "A. lim (2n + 1)/(n - 3) = 2\nB. lim (2n + 1)/(n - 3) = 1/2\nC. lim (2n + 1)/(n - 3) = 0\nD. lim (2n + 1)/(n - 3) = +∞",
      question: "Tính giới hạn của dãy số u_n = (2n + 1)/(n - 3):",
      solution_guide: "Chia cả tử và mẫu cho n: lim (2 + 1/n) / (1 - 3/n) = 2/1 = 2.",
      answer: "A",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "toan-11-tln-1",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 15:40:00", update_at: "06-07-2026 15:40:00" },
    question: {
      lesson: "Bài 2: Cấp số cộng",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 11, name: "Khối 11" },
      content: "Điền số nguyên hoặc số thập phân vào ô trống.",
      question: "Cho cấp số cộng (u_n) có u_1 = 3 và công sai d = 4. Tìm số hạng thứ 10 của cấp số cộng đó.",
      solution_guide: "Công thức số hạng tổng quát: u_n = u_1 + (n - 1)d => u_10 = 3 + 9*4 = 39.",
      answer: "39",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 3, name: "Trả Lời Ngắn", short_name: "TLN" },
    },
  },
  {
    id: "toan-10-nb-2",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 15:50:00", update_at: "06-07-2026 15:50:00" },
    question: {
      lesson: "Bài 1: Mệnh đề và tập hợp",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 10, name: "Khối 10" },
      content: "A. [1; 3]\nB. (1; 3)\nC. [1; 5)\nD. (2; 3]",
      question: "Cho hai tập hợp A = [1; 5) và B = (0; 3]. Giao của hai tập hợp A ∩ B là:",
      solution_guide: "Giao của A và B là tập hợp các phần tử thuộc cả A và B: A ∩ B = [1; 3].",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "toan-10-ds-1",
    author: { id: 1, name: "Tran Tan Phuoc", created_at: "06-07-2026 16:00:00", update_at: "06-07-2026 16:00:00" },
    question: {
      lesson: "Bài 1: Các định nghĩa về vectơ",
      subject: { id: "TOAN", name: "Toán học" },
      grade: { id: 10, name: "Khối 10" },
      content: "a) Vectơ cùng hướng với mọi vectơ là vectơ-không 0.\nb) Hai vectơ cùng phương thì giá của chúng song song hoặc trùng nhau.\nc) Độ dài của vectơ AB là khoảng cách giữa 2 điểm A và B.\nd) Nếu |a| = |b| thì a = b.",
      question: "Xét tính đúng hoặc sai của các mệnh đề hình học vectơ lớp 10 sau:",
      solution_guide: "• a: Đúng, quy ước vectơ 0 cùng hướng với mọi vectơ.\n• b: Đúng, định nghĩa hai vectơ cùng phương.\n• c: Đúng, độ dài đoạn thẳng AB.\n• d: Sai, hai vectơ bằng nhau khi cùng hướng và cùng độ dài.",
      answer: "a) Đúng | b) Đúng | c) Đúng | d) Sai",
      level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
      type: { id: 2, name: "Đúng Sai", short_name: "DS" },
    },
  },
  {
    id: "ly-11-tn-2",
    author: { id: 2, name: "Nguyen Thi Lan", created_at: "06-07-2026 16:10:00", update_at: "06-07-2026 16:10:00" },
    question: {
      lesson: "Bài 2: Thuyết electron - Định luật bảo toàn điện tích",
      subject: { id: "LY", name: "Vật lý" },
      grade: { id: 11, name: "Khối 11" },
      content: "A. F = qE\nB. F = q/E\nC. F = E/q\nD. F = qE²",
      question: "Lực điện trường F tác dụng lên một điện tích điểm q đặt trong điện trường đều E được xác định bởi công thức nào?",
      solution_guide: "Công thức liên hệ lực điện và cường độ điện trường: vectơ F = q * vectơ E. Về độ lớn F = |q|E.",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
  {
    id: "hoa-10-nb-1",
    author: { id: 3, name: "Tran Van Minh", created_at: "06-07-2026 16:20:00", update_at: "06-07-2026 16:20:00" },
    question: {
      lesson: "Bài 2: Hạt nhân nguyên tử - Nguyên tố hóa học",
      subject: { id: "HOA", name: "Hóa học" },
      grade: { id: 10, name: "Khối 10" },
      content: "A. Số proton\nB. Số neutron\nC. Số electron\nD. Khối lượng nguyên tử",
      question: "Nguyên tố hóa học là tập hợp các nguyên tử có cùng:",
      solution_guide: "Định nghĩa nguyên tố hóa học là tập hợp các nguyên tử có cùng điện tích hạt nhân (cùng số proton).",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
];
