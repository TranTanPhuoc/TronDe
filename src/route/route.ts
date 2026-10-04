/**
 * Quản lý toàn bộ đường dẫn màn hình (Pages / Screens) của ứng dụng
 * Giúp điều hướng, chuyển trang và quản lý phân quyền tập trung
 */

export const APP_ROUTES = {
  // Trang chủ: Không gian làm việc Trộn Đề Thi & Ngân hàng câu hỏi
  HOME: "/",

  // Trang xác thực
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgotpassword",
} as const;

export type AppRouteKey = keyof typeof APP_ROUTES;
export type AppRoutePath = (typeof APP_ROUTES)[AppRouteKey];

/**
 * Thông tin chi tiết (Metadata) của từng màn hình trong hệ thống
 */
export interface RouteMeta {
  path: string;
  name: string;
  description: string;
  requiresAuth: boolean;
}

export const ROUTE_METADATA: Record<AppRouteKey, RouteMeta> = {
  HOME: {
    path: APP_ROUTES.HOME,
    name: "Trang Chủ Trộn Đề Thi",
    description: "Không gian làm việc tạo mã đề, hoán vị đáp án và quản lý ngân hàng câu hỏi",
    requiresAuth: true,
  },
  LOGIN: {
    path: APP_ROUTES.LOGIN,
    name: "Đăng Nhập",
    description: "Cổng đăng nhập hệ thống dành cho giáo viên và ban chuyên môn",
    requiresAuth: false,
  },
  REGISTER: {
    path: APP_ROUTES.REGISTER,
    name: "Đăng Ký",
    description: "Đăng ký tài khoản giáo viên mới",
    requiresAuth: false,
  },
  FORGOT_PASSWORD: {
    path: APP_ROUTES.FORGOT_PASSWORD,
    name: "Quên Mật Khẩu",
    description: "Khôi phục mật khẩu thông qua mã xác nhận bảo mật",
    requiresAuth: false,
  },
};

/**
 * Kiểm tra xem một đường dẫn có phải là trang công khai (không cần đăng nhập) hay không
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes: string[] = [
    APP_ROUTES.LOGIN,
    APP_ROUTES.REGISTER,
    APP_ROUTES.FORGOT_PASSWORD,
  ];
  return publicRoutes.includes(pathname);
}

/**
 * Kiểm tra xem một đường dẫn có yêu cầu đăng nhập trước hay không
 */
export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

export default APP_ROUTES;
