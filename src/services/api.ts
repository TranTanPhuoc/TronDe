import { ExamItem, PendingQuestionItem } from "@/types/question";
import { User, LicenseSubscription, UserVersion } from "@/types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Lấy token xác thực từ localStorage nếu có
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("tron_de_auth_token") ||
    localStorage.getItem("jwt_token") ||
    null
  );
};

/**
 * Generic fetch wrapper với headers tự động gắn Bearer Token
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "Yêu cầu API thất bại";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `Lỗi HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// ============================================================================
// 1. AUTH APIS
// ============================================================================

export interface AuthLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const loginApi = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthLoginResponse> => {
  const res = await apiRequest<AuthLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (typeof window !== "undefined" && res.accessToken) {
    localStorage.setItem("tron_de_auth_token", res.accessToken);
    localStorage.setItem("tron_de_auth_user", JSON.stringify(res.user));
  }
  return res;
};

export const registerApi = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  school?: string;
  department?: string;
  subject?: { id: string; name: string };
}): Promise<AuthLoginResponse> => {
  const res = await apiRequest<AuthLoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (typeof window !== "undefined" && res.accessToken) {
    localStorage.setItem("tron_de_auth_token", res.accessToken);
    localStorage.setItem("tron_de_auth_user", JSON.stringify(res.user));
  }
  return res;
};

export const getCurrentUserApi = async (): Promise<User> => {
  return apiRequest<User>("/auth/me");
};

// ============================================================================
// 2. USERS APIS
// ============================================================================

export const getAllUsersApi = async (role?: string): Promise<User[]> => {
  const query = role && role !== "ALL" ? `?role=${role}` : "";
  return apiRequest<User[]>(`/users${query}`);
};

export const getUserByIdApi = async (userId: string): Promise<User> => {
  return apiRequest<User>(`/users/${userId}`);
};

export const updateUserApi = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  return apiRequest<User>(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const changeUserVersionApi = async (
  userId: string,
  version: UserVersion
): Promise<User> => {
  return apiRequest<User>(`/users/${userId}/version`, {
    method: "PUT",
    body: JSON.stringify({ version }),
  });
};

// ============================================================================
// 3. QUESTIONS APIS
// ============================================================================

export interface GetQuestionsParams {
  subject_id?: string;
  grade_id?: number;
  level_id?: number;
  type_id?: number;
  search?: string;
  include_user_cache?: boolean;
  user_id?: string;
}

export const getQuestionsApi = async (
  params?: GetQuestionsParams
): Promise<ExamItem[]> => {
  const queryParts: string[] = [];
  if (params?.subject_id && params.subject_id !== "ALL") {
    queryParts.push(`subject_id=${encodeURIComponent(params.subject_id)}`);
  }
  if (params?.grade_id) queryParts.push(`grade_id=${params.grade_id}`);
  if (params?.level_id) queryParts.push(`level_id=${params.level_id}`);
  if (params?.type_id) queryParts.push(`type_id=${params.type_id}`);
  if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.include_user_cache !== undefined) {
    queryParts.push(`include_user_cache=${params.include_user_cache}`);
  }
  if (params?.user_id) queryParts.push(`user_id=${encodeURIComponent(params.user_id)}`);

  const qs = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  return apiRequest<ExamItem[]>(`/questions${qs}`);
};

export const getUserCachedQuestionsApi = async (
  userId: string
): Promise<ExamItem[]> => {
  return apiRequest<ExamItem[]>(`/questions/user-cache/${userId}`);
};

export const createQuestionApi = async (
  question: ExamItem
): Promise<ExamItem> => {
  return apiRequest<ExamItem>("/questions", {
    method: "POST",
    body: JSON.stringify(question),
  });
};

export const createBulkQuestionsApi = async (
  questions: ExamItem[]
): Promise<ExamItem[]> => {
  return apiRequest<ExamItem[]>("/questions/bulk", {
    method: "POST",
    body: JSON.stringify(questions),
  });
};

export const updateQuestionApi = async (
  questionId: string,
  question: ExamItem
): Promise<ExamItem> => {
  return apiRequest<ExamItem>(`/questions/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(question),
  });
};

export const deleteQuestionApi = async (
  questionId: string
): Promise<{ message: string; id: string }> => {
  return apiRequest<{ message: string; id: string }>(`/questions/${questionId}`, {
    method: "DELETE",
  });
};

// ============================================================================
// 4. APPROVALS APIS (HÀNG ĐỢI PHÊ DUYỆT CÂU HỎI)
// ============================================================================

export interface ApproveResponse {
  approvedCount: number;
  message: string;
  updatedGlobal: ExamItem[];
}

export const getPendingQuestionsApi = async (params?: {
  subject_id?: string;
  user_id?: string;
  status_filter?: string;
}): Promise<PendingQuestionItem[]> => {
  const parts: string[] = [];
  if (params?.subject_id && params.subject_id !== "ALL") {
    parts.push(`subject_id=${encodeURIComponent(params.subject_id)}`);
  }
  if (params?.user_id) parts.push(`user_id=${encodeURIComponent(params.user_id)}`);
  if (params?.status_filter) parts.push(`status_filter=${params.status_filter}`);

  const qs = parts.length > 0 ? `?${parts.join("&")}` : "";
  return apiRequest<PendingQuestionItem[]>(`/approvals${qs}`);
};

export const submitPendingQuestionApi = async (
  payload: PendingQuestionItem
): Promise<PendingQuestionItem> => {
  return apiRequest<PendingQuestionItem>("/approvals/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const submitBulkPendingQuestionsApi = async (
  payload: PendingQuestionItem[]
): Promise<PendingQuestionItem[]> => {
  return apiRequest<PendingQuestionItem[]>("/approvals/submit-bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const approvePendingQuestionsApi = async (
  pendingIds: string[]
): Promise<ApproveResponse> => {
  return apiRequest<ApproveResponse>("/approvals/approve", {
    method: "POST",
    body: JSON.stringify({ pendingIds }),
  });
};

export const approveAllPendingQuestionsApi = async (): Promise<ApproveResponse> => {
  return apiRequest<ApproveResponse>("/approvals/approve-all", {
    method: "POST",
  });
};

export const rejectPendingQuestionsApi = async (
  pendingIds: string[]
): Promise<{ rejectedCount: number; message: string }> => {
  return apiRequest<{ rejectedCount: number; message: string }>("/approvals/reject", {
    method: "POST",
    body: JSON.stringify({ pendingIds }),
  });
};

export const deletePendingQuestionApi = async (
  pendingId: string
): Promise<{ message: string; id: string }> => {
  return apiRequest<{ message: string; id: string }>(`/approvals/${pendingId}`, {
    method: "DELETE",
  });
};

// ============================================================================
// 5. LICENSES APIS (QUẢN LÝ BẢN QUYỀN PRO)
// ============================================================================

export interface ActivateLicenseResponse {
  license: LicenseSubscription;
  user: User | null;
  message: string;
}

export const getLicensesApi = async (
  status?: string
): Promise<LicenseSubscription[]> => {
  const qs = status && status !== "ALL" ? `?status=${status}` : "";
  return apiRequest<LicenseSubscription[]>(`/licenses${qs}`);
};

export const createLicenseApi = async (
  payload: Partial<LicenseSubscription>
): Promise<LicenseSubscription> => {
  return apiRequest<LicenseSubscription>("/licenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const activateLicenseApi = async (
  licenseId: string
): Promise<ActivateLicenseResponse> => {
  return apiRequest<ActivateLicenseResponse>("/licenses/activate", {
    method: "POST",
    body: JSON.stringify({ licenseId }),
  });
};

export const updateLicenseApi = async (
  licenseId: string,
  payload: Partial<LicenseSubscription>
): Promise<LicenseSubscription> => {
  return apiRequest<LicenseSubscription>(`/licenses/${licenseId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteLicenseApi = async (
  licenseId: string
): Promise<{ message: string; id: string }> => {
  return apiRequest<{ message: string; id: string }>(`/licenses/${licenseId}`, {
    method: "DELETE",
  });
};

