/**
 * Cấu hình toàn bộ URL và Endpoints để gọi API cho Hệ Thống Trộn Đề Thi
 * Hỗ trợ cấu hình Base URL qua biến môi trường NEXT_PUBLIC_API_URL
 */

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * 1. Các URL API phục vụ Xác thực người dùng (Auth)
 */
export const API_AUTH = {
  LOGIN: `${BASE_API_URL}/auth/login`,
  REGISTER: `${BASE_API_URL}/auth/register`,
  LOGOUT: `${BASE_API_URL}/auth/logout`,
  REFRESH_TOKEN: `${BASE_API_URL}/auth/refresh-token`,
  ME: `${BASE_API_URL}/auth/me`,
  FORGOT_PASSWORD: `${BASE_API_URL}/auth/forgot-password`,
  VERIFY_OTP: `${BASE_API_URL}/auth/verify-otp`,
  RESET_PASSWORD: `${BASE_API_URL}/auth/reset-password`,
  CHANGE_PASSWORD: `${BASE_API_URL}/auth/change-password`,
};

/**
 * 2. Các URL API phục vụ Quản lý Ngân hàng Câu hỏi (Questions CRUD)
 */
export const API_QUESTIONS = {
  // Lấy danh sách câu hỏi (có phân trang, tìm kiếm, lọc)
  GET_ALL: `${BASE_API_URL}/questions`,
  // Lấy chi tiết 1 câu hỏi theo ID
  GET_DETAIL: (id: string | number) => `${BASE_API_URL}/questions/${id}`,
  // Tạo mới 1 câu hỏi
  CREATE: `${BASE_API_URL}/questions`,
  // Cập nhật câu hỏi theo ID
  UPDATE: (id: string | number) => `${BASE_API_URL}/questions/${id}`,
  // Xóa 1 câu hỏi theo ID
  DELETE: (id: string | number) => `${BASE_API_URL}/questions/${id}`,
  // Xóa nhiều câu hỏi hàng loạt
  BULK_DELETE: `${BASE_API_URL}/questions/bulk-delete`,
  // Nhập câu hỏi từ file JSON / Excel
  IMPORT: `${BASE_API_URL}/questions/import`,
  // Xuất câu hỏi ra file JSON / Excel
  EXPORT: `${BASE_API_URL}/questions/export`,
};

/**
 * 3. Các URL API phục vụ Trộn Đề Thi & Quản lý Đề Thi (Exams & Shuffling)
 */
export const API_EXAMS = {
  // Thuật toán trộn đề thi tự động từ danh sách câu hỏi
  SHUFFLE: `${BASE_API_URL}/exams/shuffle`,
  // Lưu đề thi đã trộn vào kho
  SAVE: `${BASE_API_URL}/exams`,
  // Lấy danh sách đề thi đã tạo
  GET_ALL: `${BASE_API_URL}/exams`,
  // Lấy chi tiết 1 đề thi và các mã đề con
  GET_DETAIL: (id: string | number) => `${BASE_API_URL}/exams/${id}`,
  // Xóa đề thi
  DELETE: (id: string | number) => `${BASE_API_URL}/exams/${id}`,
  // Xuất đề thi ra file PDF (theo mã đề)
  EXPORT_PDF: (examId: string | number, variantCode?: string) =>
    `${BASE_API_URL}/exams/${examId}/pdf${variantCode ? `?code=${variantCode}` : ""}`,
  // Xuất đề thi ra file Word (.docx)
  EXPORT_DOCX: (examId: string | number, variantCode?: string) =>
    `${BASE_API_URL}/exams/${examId}/docx${variantCode ? `?code=${variantCode}` : ""}`,
  // Xuất bảng ma trận đáp án ra file Excel
  EXPORT_MATRIX: (examId: string | number) =>
    `${BASE_API_URL}/exams/${examId}/matrix-export`,
};

/**
 * 4. Các URL API phục vụ Danh mục & Cấu hình (Config & Categories)
 */
export const API_CONFIG = {
  // Lấy danh sách 4 mức độ nhận thức (NB, TH, VD, VDC)
  LEVELS: `${BASE_API_URL}/config/levels`,
  // Lấy danh sách 4 dạng câu hỏi (TN, DS, TLN, TL)
  TYPES: `${BASE_API_URL}/config/types`,
  // Danh sách các môn học
  SUBJECTS: `${BASE_API_URL}/config/subjects`,
};

/**
 * Tổng hợp toàn bộ API URL trong 1 đối tượng duy nhất
 */
export const API_URLS = {
  BASE: BASE_API_URL,
  AUTH: API_AUTH,
  QUESTIONS: API_QUESTIONS,
  EXAMS: API_EXAMS,
  CONFIG: API_CONFIG,
};

/**
 * Helper hỗ trợ ghép query parameters vào URL một cách an toàn
 */
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return endpoint;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return query ? `${endpoint}?${query}` : endpoint;
}

export default API_URLS;
