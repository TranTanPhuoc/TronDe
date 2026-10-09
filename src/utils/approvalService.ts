import { ExamItem, PendingQuestionItem } from "@/types/question";
import { User, LicenseSubscription, UserVersion, LicenseExpiryInfo } from "@/types/user";
import {
  submitPendingQuestionApi,
  submitBulkPendingQuestionsApi,
  approvePendingQuestionsApi,
  approveAllPendingQuestionsApi,
  rejectPendingQuestionsApi,
  updateUserApi,
  changeUserVersionApi,
  activateLicenseApi,
  getQuestionsApi,
  getPendingQuestionsApi,
  getAllUsersApi,
  getLicensesApi,
} from "@/services/api";

export const STORAGE_KEY_QUESTIONS = "phan_mem_tron_de_questions_v5";
export const STORAGE_KEY_PENDING = "tron_de_pending_questions";
export const STORAGE_KEY_USERS = "tron_de_all_users";
export const STORAGE_KEY_LICENSES = "tron_de_licenses";

export const getUserCacheKey = (userId: string) => `tron_de_user_cache_${userId}`;

/**
 * Lấy danh sách câu hỏi trong cache riêng của một người dùng
 */
export const getUserCachedQuestions = (userId: string): ExamItem[] => {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(getUserCacheKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Lưu câu hỏi vào cache cá nhân của người dùng và tạo 1 yêu cầu duyệt gửi Admin
 */
export const saveUserCachedQuestion = (
  userId: string,
  question: ExamItem,
  user: User
): void => {
  if (typeof window === "undefined" || !userId) return;
  try {
    const markedQuestion: ExamItem = {
      ...question,
      isUserCache: true,
      submittedByUserId: userId,
    };

    // 1. Lưu vào cache cá nhân của user
    const currentCache = getUserCachedQuestions(userId);
    const filtered = currentCache.filter((q) => q.id !== question.id);
    const newCache = [markedQuestion, ...filtered];
    localStorage.setItem(getUserCacheKey(userId), JSON.stringify(newCache));

    // 2. Gửi request phê duyệt vào hàng đợi Admin
    const pendingList = getPendingQuestions();
    const newPendingItem: PendingQuestionItem = {
      id: `pending-${question.id}-${Date.now()}`,
      questionId: question.id,
      questionItem: markedQuestion,
      submittedBy: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        school: user.school,
        department: user.department,
        subject: user.subject,
      },
      submittedAt: new Date().toLocaleDateString("vi-VN"),
      status: "pending",
    };

    const updatedPending = [
      newPendingItem,
      ...pendingList.filter((p) => p.questionId !== question.id),
    ];
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));

    // Gọi API Backend Python lưu cache và gửi pending xuống MySQL
    submitPendingQuestionApi(newPendingItem).catch((err) => {
      console.warn("Backend API sync notice (submitPendingQuestion):", err?.message);
    });
  } catch (err) {
    console.error("Lỗi khi lưu cache câu hỏi người dùng:", err);
  }
};

/**
 * Lưu nhiều câu hỏi (Import file) vào cache của người dùng và tạo các yêu cầu duyệt gửi Admin
 */
export const saveUserCachedBulkQuestions = (
  userId: string,
  questions: ExamItem[],
  user: User
): void => {
  if (typeof window === "undefined" || !userId || questions.length === 0) return;
  try {
    const nowStr = new Date().toLocaleDateString("vi-VN");
    const markedQuestions: ExamItem[] = questions.map((q) => ({
      ...q,
      isUserCache: true,
      submittedByUserId: userId,
    }));

    // 1. Lưu vào cache riêng của user
    const currentCache = getUserCachedQuestions(userId);
    const newIds = new Set(markedQuestions.map((q) => q.id));
    const mergedCache = [
      ...markedQuestions,
      ...currentCache.filter((q) => !newIds.has(q.id)),
    ];
    localStorage.setItem(getUserCacheKey(userId), JSON.stringify(mergedCache));

    // 2. Gửi các request phê duyệt vào hàng đợi Admin
    const pendingList = getPendingQuestions();
    const newPendingItems: PendingQuestionItem[] = markedQuestions.map((q, idx) => ({
      id: `pending-${q.id}-${Date.now()}-${idx}`,
      questionId: q.id,
      questionItem: q,
      submittedBy: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        school: user.school,
        department: user.department,
        subject: user.subject,
      },
      submittedAt: nowStr,
      status: "pending",
    }));

    const updatedPending = [
      ...newPendingItems,
      ...pendingList.filter((p) => !newIds.has(p.questionId)),
    ];
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));

    // Gọi API Backend Python lưu bulk cache và gửi pending xuống MySQL
    submitBulkPendingQuestionsApi(newPendingItems).catch((err) => {
      console.warn("Backend API sync notice (submitBulkPendingQuestions):", err?.message);
    });
  } catch (err) {
    console.error("Lỗi khi lưu bulk câu hỏi vào cache:", err);
  }
};

/**
 * Mock data các câu hỏi chờ duyệt mẫu ban đầu để Admin kiểm tra tính năng ngay lập tức
 */
const INITIAL_PENDING_MOCKS: PendingQuestionItem[] = [
  {
    id: "pending-demo-01",
    questionId: "q-pending-01",
    questionItem: {
      id: "q-pending-01",
      author: {
        id: 101,
        name: "Thầy Trần Tấn Phước",
        created_at: "08/10/2026",
        update_at: "08/10/2026",
      },
      question: {
        lesson: "Bài 1: Sự đồng biến, nghịch biến của hàm số",
        question: "Cho hàm số y = -x^3 + 3x^2 - 1. Mệnh đề nào sau đây đúng?",
        content:
          "A. Hàm số đồng biến trên (0; 2)\nB. Hàm số nghịch biến trên (0; 2)\nC. Hàm số đồng biến trên (-inf; 0)\nD. Hàm số nghịch biến trên (2; +inf)",
        answer: "A",
        solution_guide:
          "y' = -3x^2 + 6x = -3x(x - 2). Cho y' > 0 <=> 0 < x < 2. Vậy hàm số đồng biến trên khoảng (0; 2).",
        level: { id: 2, name: "Thông Hiểu", short_name: "TH" },
        type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
        subject: { id: "TOAN", name: "Toán học" },
        grade: { id: 12, name: "Khối 12" },
      },
      isUserCache: true,
      submittedByUserId: "demo-teacher-01",
    },
    submittedBy: {
      userId: "demo-teacher-01",
      userName: "Thầy Trần Tấn Phước",
      userEmail: "phuoc.tran@edu.vn",
      school: "TRƯỜNG THPT CHUYÊN",
      department: "TỔ TOÁN HỌC",
      subject: { id: "TOAN", name: "Toán học" },
    },
    submittedAt: "08/10/2026",
    status: "pending",
  },
  {
    id: "pending-demo-02",
    questionId: "q-pending-02",
    questionItem: {
      id: "q-pending-02",
      author: {
        id: 102,
        name: "Cô Nguyễn Thị Minh",
        created_at: "08/10/2026",
        update_at: "08/10/2026",
      },
      question: {
        lesson: "Bài 2: Dao động điều hòa",
        question: "Một vật dao động điều hòa với phương trình x = 5cos(4pi*t + pi/3) (cm). Biên độ dao động của vật là:",
        content: "A. 5 cm\nB. 10 cm\nC. 4pi cm\nD. pi/3 cm",
        answer: "A",
        solution_guide: "Từ phương trình x = A cos(omega*t + phi), ta thấy biên độ dao động A = 5 cm.",
        level: { id: 1, name: "Nhận Biết", short_name: "NB" },
        type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
        subject: { id: "LY", name: "Vật lý" },
        grade: { id: 12, name: "Khối 12" },
      },
      isUserCache: true,
      submittedByUserId: "demo-teacher-ly",
    },
    submittedBy: {
      userId: "demo-teacher-ly",
      userName: "Cô Nguyễn Thị Minh",
      userEmail: "minh.ly@edu.vn",
      school: "TRƯỜNG THPT NGUYỄN HUỆ",
      department: "TỔ VẬT LÝ",
      subject: { id: "LY", name: "Vật lý" },
    },
    submittedAt: "08/10/2026",
    status: "pending",
  },
  {
    id: "pending-demo-03",
    questionId: "q-pending-03",
    questionItem: {
      id: "q-pending-03",
      author: {
        id: 103,
        name: "Thầy Lê Văn Hóa",
        created_at: "08/10/2026",
        update_at: "08/10/2026",
      },
      question: {
        lesson: "Bài 1: Este - Lipit",
        question: "Công thức phân tử tổng quát của este no, đơn chức, mạch hở là:",
        content: "A. CnH2nO2 (n >= 2)\nB. CnH2n-2O2 (n >= 2)\nC. CnH2n+2O2 (n >= 2)\nD. CnH2nO (n >= 1)",
        answer: "A",
        solution_guide: "Este no, đơn chức, mạch hở được tạo từ axit no đơn chức và ancol no đơn chức, có CTPT là CnH2nO2 (n >= 2).",
        level: { id: 1, name: "Nhận Biết", short_name: "NB" },
        type: { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
        subject: { id: "HOA", name: "Hóa học" },
        grade: { id: 12, name: "Khối 12" },
      },
      isUserCache: true,
      submittedByUserId: "demo-teacher-hoa",
    },
    submittedBy: {
      userId: "demo-teacher-hoa",
      userName: "Thầy Lê Văn Hóa",
      userEmail: "hoa.le@edu.vn",
      school: "TRƯỜNG THPT QUANG TRUNG",
      department: "TỔ HÓA HỌC",
      subject: { id: "HOA", name: "Hóa học" },
    },
    submittedAt: "08/10/2026",
    status: "pending",
  },
];

/**
 * Lấy danh sách các câu hỏi đang chờ Admin phê duyệt
 */
export const getPendingQuestions = (): PendingQuestionItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(INITIAL_PENDING_MOCKS));
      return INITIAL_PENDING_MOCKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return INITIAL_PENDING_MOCKS;
  }
};

/**
 * Admin PHÊ DUYỆT CÁC CÂU HỎI ĐÃ CHỌN:
 * 1. Lưu câu hỏi vào ngân hàng câu hỏi chung (tron_de_questions)
 * 2. Xóa câu hỏi khỏi cache của user đã gửi (để nhẹ database)
 * 3. Xóa các câu này khỏi danh sách chờ duyệt (những câu chưa chọn thì giữ nguyên)
 */
export const approvePendingQuestions = (
  pendingIds: string[],
  currentGlobalQuestions: ExamItem[]
): { updatedGlobal: ExamItem[]; approvedCount: number } => {
  if (typeof window === "undefined" || pendingIds.length === 0) {
    return { updatedGlobal: currentGlobalQuestions, approvedCount: 0 };
  }

  const allPending = getPendingQuestions();
  const targetPending = allPending.filter(
    (p) => pendingIds.includes(p.id) && p.status === "pending"
  );
  if (targetPending.length === 0) {
    return { updatedGlobal: currentGlobalQuestions, approvedCount: 0 };
  }

  // Chuyển đổi thành câu hỏi chính thức trong ngân hàng
  const approvedQuestions: ExamItem[] = targetPending.map((p) => ({
    ...p.questionItem,
    isUserCache: false, // Chính thức vào ngân hàng chung
  }));

  // Gộp vào ngân hàng câu hỏi chung
  const approvedIds = new Set(approvedQuestions.map((q) => q.id));
  const newGlobalQuestions = [
    ...approvedQuestions,
    ...currentGlobalQuestions.filter((q) => !approvedIds.has(q.id)),
  ];
  localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(newGlobalQuestions));

  // Xóa khỏi cache của các user đã gửi tương ứng
  targetPending.forEach((p) => {
    const userId = p.submittedBy.userId;
    if (userId) {
      const userCache = getUserCachedQuestions(userId);
      const cleaned = userCache.filter((q) => q.id !== p.questionId);
      localStorage.setItem(getUserCacheKey(userId), JSON.stringify(cleaned));
    }
  });

  // Cập nhật lại danh sách pending (giữ lại những câu chưa duyệt)
  const remainingPending = allPending.filter((p) => !pendingIds.includes(p.id));
  localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(remainingPending));

  // Gọi API Backend Python phê duyệt câu hỏi đưa vào MySQL
  approvePendingQuestionsApi(pendingIds).catch((err) => {
    console.warn("Backend API sync notice (approvePendingQuestions):", err?.message);
  });

  return {
    updatedGlobal: newGlobalQuestions,
    approvedCount: targetPending.length,
  };
};

/**
 * Admin PHÊ DUYỆT TẤT CẢ CÁC CÂU HỎI:
 * 1. Phê duyệt toàn bộ các câu trong danh sách chờ duyệt
 * 2. Lưu vào ngân hàng câu hỏi chung
 * 3. Dọn sạch cache tương ứng của các user
 */
export const approveAllPendingQuestions = (
  currentGlobalQuestions: ExamItem[]
): { updatedGlobal: ExamItem[]; approvedCount: number } => {
  const allPending = getPendingQuestions();
  const pendingIds = allPending.filter((p) => p.status === "pending").map((p) => p.id);
  return approvePendingQuestions(pendingIds, currentGlobalQuestions);
};

/**
 * Admin TỪ CHỐI các câu hỏi đã chọn
 */
export const rejectPendingQuestions = (pendingIds: string[]): void => {
  if (typeof window === "undefined" || pendingIds.length === 0) return;
  const allPending = getPendingQuestions();
  const remaining = allPending.filter((p) => !pendingIds.includes(p.id));
  localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(remaining));

  // Gọi API Backend Python từ chối câu hỏi trong MySQL
  rejectPendingQuestionsApi(pendingIds).catch((err) => {
    console.warn("Backend API sync notice (rejectPendingQuestions):", err?.message);
  });
};

// ==========================================
// ==========================================
// QUẢN LÝ USER & QUẢN LÝ BẢN QUYỀN
// ==========================================

/**
 * Tạo chuỗi ISO ngày hết hạn Pro cách thời điểm hiện tại `years` năm (mặc định 1 năm)
 */
export const createProExpiryDate = (years: number = 1): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString();
};

/**
 * Tính toán số ngày còn lại của gói bản quyền Pro
 */
export const getLicenseExpiryInfo = (expiresAt?: string | null): LicenseExpiryInfo | null => {
  if (!expiresAt) return null;
  const expiry = new Date(expiresAt);
  if (isNaN(expiry.getTime())) return null;

  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formattedExpiryDate = expiry.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (diffDays <= 0) {
    return {
      daysRemaining: 0,
      isExpired: true,
      formattedExpiryDate,
      text: "Đã hết hạn",
    };
  }

  return {
    daysRemaining: diffDays,
    isExpired: false,
    formattedExpiryDate,
    text: `Còn ${diffDays} ngày`,
  };
};

/**
 * Lấy thông tin thời hạn bản quyền Pro cho một người dùng (cả Admin và Giáo viên)
 */
export const getUserProExpiryInfo = (user?: User | null): LicenseExpiryInfo | null => {
  if (!user || user.version !== "pro") return null;
  if (user.role === "admin") {
    return {
      daysRemaining: 9999,
      isExpired: false,
      formattedExpiryDate: "Vĩnh viễn",
      text: "Vĩnh viễn (Admin)",
    };
  }
  if (!user.proExpiresAt) {
    return {
      daysRemaining: 365,
      isExpired: false,
      formattedExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
      text: "Còn 365 ngày",
    };
  }
  return getLicenseExpiryInfo(user.proExpiresAt);
};

const INITIAL_USERS_MOCK: User[] = [
  {
    id: "admin-master-01",
    name: "Ban Quản Trị Hệ Thống",
    email: "admin@edu.vn",
    password: "••••••••",
    phone: "0900 888 999",
    school: "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
    department: "BAN QUẢN TRỊ TRỘN ĐỀ",
    subject: { id: "TOAN", name: "Toán học" },
    avatar: "AD",
    role: "admin",
    version: "pro",
    proExpiresAt: null,
    accessToken: "jwt_admin_master_access",
    refreshToken: "jwt_admin_master_refresh",
  },
  {
    id: "demo-teacher-01",
    name: "Thầy Trần Tấn Phước",
    email: "phuoc.tran@edu.vn",
    password: "••••••••",
    phone: "0912 345 678",
    school: "TRƯỜNG THPT CHUYÊN",
    department: "TỔ TOÁN HỌC",
    subject: { id: "TOAN", name: "Toán học" },
    avatar: "TP",
    role: "teacher",
    version: "pro",
    proExpiresAt: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
    accessToken: "jwt_teacher_01_access",
    refreshToken: "jwt_teacher_01_refresh",
  },
  {
    id: "demo-teacher-ly",
    name: "Cô Nguyễn Thị Minh",
    email: "minh.ly@edu.vn",
    password: "••••••••",
    phone: "0988 123 456",
    school: "TRƯỜNG THPT NGUYỄN HUỆ",
    department: "TỔ VẬT LÝ",
    subject: { id: "LY", name: "Vật lý" },
    avatar: "NM",
    role: "teacher",
    version: "normal",
    proExpiresAt: null,
    accessToken: "jwt_teacher_ly_access",
    refreshToken: "jwt_teacher_ly_refresh",
  },
  {
    id: "demo-teacher-hoa",
    name: "Thầy Lê Văn Hóa",
    email: "hoa.le@edu.vn",
    password: "••••••••",
    phone: "0977 654 321",
    school: "TRƯỜNG THPT QUANG TRUNG",
    department: "TỔ HÓA HỌC",
    subject: { id: "HOA", name: "Hóa học" },
    avatar: "LH",
    role: "teacher",
    version: "pro",
    proExpiresAt: new Date(Date.now() + 700 * 24 * 60 * 60 * 1000).toISOString(),
    accessToken: "jwt_teacher_hoa_access",
    refreshToken: "jwt_teacher_hoa_refresh",
  },
];

/**
 * Lấy danh sách toàn bộ User trong hệ thống
 */
export const getAllUsersList = (): User[] => {
  if (typeof window === "undefined") return INITIAL_USERS_MOCK;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS_MOCK));
      return INITIAL_USERS_MOCK;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS_MOCK;
  } catch {
    return INITIAL_USERS_MOCK;
  }
};

/**
 * Cập nhật thông tin User (Vai trò, Phiên bản Pro/Normal)
 */
export const updateUserInList = (updatedUser: User): void => {
  if (typeof window === "undefined") return;
  const list = getAllUsersList();
  const newList = list.map((u) => (u.id === updatedUser.id ? updatedUser : u));
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newList));

  try {
    const rawAuth = localStorage.getItem("tron_de_auth_user");
    if (rawAuth) {
      const authUser = JSON.parse(rawAuth);
      if (authUser.id === updatedUser.id) {
        localStorage.setItem(
          "tron_de_auth_user",
          JSON.stringify({ ...authUser, ...updatedUser })
        );
      }
    }
  } catch {}

  // Gọi API Backend Python cập nhật thông tin user trong MySQL
  updateUserApi(updatedUser.id, updatedUser).catch((err) => {
    console.warn("Backend API sync notice (updateUserInList):", err?.message);
  });
};

const INITIAL_LICENSES_MOCK: LicenseSubscription[] = [
  {
    id: "lic-001",
    userId: "demo-teacher-ly",
    userName: "Cô Nguyễn Thị Minh",
    userEmail: "minh.ly@edu.vn",
    school: "TRƯỜNG THPT NGUYỄN HUỆ",
    plan: "pro",
    status: "pending",
    requestDate: "07/10/2026",
    durationMonths: 12,
    price: 600000,
    note: "Nâng cấp gói Pro 1 năm - Chờ mua bản quyền",
  },
  {
    id: "lic-002",
    userId: "demo-teacher-01",
    userName: "Thầy Trần Tấn Phước",
    userEmail: "phuoc.tran@edu.vn",
    school: "TRƯỜNG THPT CHUYÊN",
    plan: "pro",
    status: "active",
    requestDate: "01/09/2026",
    activatedDate: "01/09/2026",
    expiryDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
    durationMonths: 12,
    price: 600000,
    note: "Đã kích hoạt bản quyền Pro 1 năm",
  },
  {
    id: "lic-003",
    userId: "demo-teacher-hoa",
    userName: "Thầy Lê Văn Hóa",
    userEmail: "hoa.le@edu.vn",
    school: "TRƯỜNG THPT QUANG TRUNG",
    plan: "pro",
    status: "active",
    requestDate: "15/09/2026",
    activatedDate: "15/09/2026",
    expiryDate: new Date(Date.now() + 700 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
    durationMonths: 24,
    price: 1100000,
    note: "Gói bản quyền Pro 2 năm cho tổ Hóa học",
  },
];

/**
 * Lấy danh sách các đơn mua / đăng ký bản quyền Pro
 */
export const getLicenseSubscriptions = (): LicenseSubscription[] => {
  if (typeof window === "undefined") return INITIAL_LICENSES_MOCK;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LICENSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(INITIAL_LICENSES_MOCK));
      return INITIAL_LICENSES_MOCK;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LICENSES_MOCK;
  } catch {
    return INITIAL_LICENSES_MOCK;
  }
};

/**
 * Chuyển đổi phiên bản tài khoản giữa Normal và Pro với đồng bộ hệ thống bản quyền:
 * - Khi nâng lên Pro: Thời hạn 1 năm (365 ngày), tự động kích hoạt đơn bản quyền.
 * - Khi về Normal: Hủy thời hạn Pro, tự động chuyển đơn bản quyền sang trạng thái "pending" (Chờ mua bản quyền).
 */
export const changeUserVersionWithLicenseSync = (
  userId: string,
  targetVersion: UserVersion
): { updatedUser: User; updatedLicenses: LicenseSubscription[] } | null => {
  if (typeof window === "undefined") return null;
  const users = getAllUsersList();
  const targetUser = users.find((u) => u.id === userId);
  if (!targetUser) return null;

  const nowStr = new Date().toLocaleDateString("vi-VN");
  let updatedUser: User;
  const licenses = getLicenseSubscriptions();

  if (targetVersion === "pro") {
    const newExpiresAt = createProExpiryDate(1);
    const expiryFormatted = new Date(newExpiresAt).toLocaleDateString("vi-VN");
    updatedUser = {
      ...targetUser,
      version: "pro",
      proExpiresAt: newExpiresAt,
    };

    let found = false;
    const newLicenses = licenses.map((lic) => {
      if (lic.userId === userId) {
        found = true;
        return {
          ...lic,
          status: "active" as const,
          plan: "pro" as const,
          activatedDate: nowStr,
          expiryDate: expiryFormatted,
          durationMonths: 12,
          price: 600000,
          note: "Đã kích hoạt bản quyền Pro 1 năm",
        };
      }
      return lic;
    });

    if (!found) {
      newLicenses.unshift({
        id: `lic-${Date.now()}`,
        userId: targetUser.id,
        userName: targetUser.name,
        userEmail: targetUser.email,
        school: targetUser.school,
        plan: "pro",
        status: "active",
        requestDate: nowStr,
        activatedDate: nowStr,
        expiryDate: expiryFormatted,
        durationMonths: 12,
        price: 600000,
        note: "Đã kích hoạt bản quyền Pro 1 năm",
      });
    }

    localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(newLicenses));
    updateUserInList(updatedUser);
    return { updatedUser, updatedLicenses: newLicenses };
  } else {
    // Chuyển về bản tiêu chuẩn:
    updatedUser = {
      ...targetUser,
      version: "normal",
      proExpiresAt: null,
    };

    let found = false;
    const newLicenses = licenses.map((lic) => {
      if (lic.userId === userId) {
        found = true;
        return {
          ...lic,
          status: "pending" as const,
          plan: "pro" as const,
          activatedDate: undefined,
          expiryDate: undefined,
          durationMonths: 12,
          price: 600000,
          requestDate: nowStr,
          note: "Đã chuyển về bản Tiêu chuẩn - Cần mua bản quyền Pro mới",
        };
      }
      return lic;
    });

    if (!found) {
      newLicenses.unshift({
        id: `lic-${Date.now()}`,
        userId: targetUser.id,
        userName: targetUser.name,
        userEmail: targetUser.email,
        school: targetUser.school,
        plan: "pro",
        status: "pending",
        requestDate: nowStr,
        durationMonths: 12,
        price: 600000,
        note: "Đã chuyển về bản Tiêu chuẩn - Cần mua bản quyền Pro mới",
      });
    }

    localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(newLicenses));
    updateUserInList(updatedUser);

    // Gọi API Backend Python chuyển đổi phiên bản người dùng
    changeUserVersionApi(userId, targetVersion).catch((err) => {
      console.warn("Backend API sync notice (changeUserVersionWithLicenseSync):", err?.message);
    });

    return { updatedUser, updatedLicenses: newLicenses };
  }
};

/**
 * Kích hoạt bản quyền Pro cho một đơn đăng ký
 */
export const activateLicenseSubscription = (licenseId: string): void => {
  if (typeof window === "undefined") return;
  const list = getLicenseSubscriptions();
  const target = list.find((lic) => lic.id === licenseId);
  if (!target) return;

  const nowStr = new Date().toLocaleDateString("vi-VN");
  const newExpiryIso = createProExpiryDate(target.durationMonths >= 24 ? 2 : 1);
  const expiryFormatted = new Date(newExpiryIso).toLocaleDateString("vi-VN");

  const updatedList = list.map((lic) =>
    lic.id === licenseId
      ? {
          ...lic,
          status: "active" as const,
          activatedDate: nowStr,
          expiryDate: expiryFormatted,
          note: `Đã kích hoạt bản quyền Pro ${Math.round(target.durationMonths / 12)} năm`,
        }
      : lic
  );
  localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(updatedList));

  // Cập nhật User tương ứng lên phiên bản Pro
  const users = getAllUsersList();
  const targetUser = users.find((u) => u.id === target.userId);
  if (targetUser) {
    updateUserInList({
      ...targetUser,
      version: "pro",
      proExpiresAt: newExpiryIso,
    });
  }

  // Gọi API Backend Python kích hoạt bản quyền trong MySQL
  activateLicenseApi(licenseId).catch((err) => {
    console.warn("Backend API sync notice (activateLicenseSubscription):", err?.message);
  });
};

/**
 * Tự động đồng bộ toàn bộ dữ liệu mới nhất từ Python Backend API (MySQL) về Client
 */
export const syncAllDataFromBackend = async () => {
  if (typeof window === "undefined") return;
  try {
    const [questionsRes, pendingRes, usersRes, licensesRes] = await Promise.allSettled([
      getQuestionsApi(),
      getPendingQuestionsApi(),
      getAllUsersApi(),
      getLicensesApi(),
    ]);

    if (questionsRes.status === "fulfilled" && questionsRes.value && questionsRes.value.length > 0) {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questionsRes.value));
    }
    if (pendingRes.status === "fulfilled" && pendingRes.value) {
      localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(pendingRes.value));
    }
    if (usersRes.status === "fulfilled" && usersRes.value && usersRes.value.length > 0) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersRes.value));
    }
    if (licensesRes.status === "fulfilled" && licensesRes.value && licensesRes.value.length > 0) {
      localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(licensesRes.value));
    }
    console.log("✅ Đã đồng bộ dữ liệu từ Python Backend API thành công!");
  } catch (e: any) {
    console.warn("Lưu ý đồng bộ Backend:", e?.message);
  }
};

