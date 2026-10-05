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

  // ================= GDCD / KT-PL =================
  {
    id: "gdcd-10-1",
    author: {
      id: 10,
      name: "Hoang Thu Thao",
      created_at: "05-07-2026 16:00:00",
      update_at: "05-07-2026 16:00:00",
    },
    question: {
      subject: { id: "GDCD", name: "GDCD / KT-PL" },
      grade: { id: 10, name: "Khối 10" },
      content:
        "A. Quy luật giá trị\nB. Quy luật cung - cầu\nC. Quy luật cạnh tranh\nD. Quy luật lưu thông tiền tệ",
      question:
        "Quy luật kinh tế cơ bản nhất chi phối sản xuất và lưu thông hàng hóa trong nền kinh tế thị trường là quy luật nào?",
      solution_guide:
        "Quy luật giá trị là quy luật kinh tế cơ bản của sản xuất và lưu thông hàng hóa, đòi hỏi sản xuất và trao đổi hàng hóa phải dựa trên cơ sở hao phí lao động xã hội cần thiết.",
      answer: "A",
      level: { id: 1, name: "Nhận Biết", short_name: "NB" },
      type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
    },
  },
];
