import { SubjectItem } from "./question";

export type Subject = SubjectItem;

export type UserRole = "admin" | "teacher";
export type UserVersion = "normal" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  school: string;
  department: string;
  subject: Subject; // Object { id: string; name: string } - Cố định từ khi đăng ký
  avatar: string; // Chữ viết tắt đại diện (VD: "TP")
  avatarImage?: string | null; // Đường dẫn ảnh đại diện nếu có
  role: UserRole; // "admin" | "teacher"
  version: UserVersion; // "normal" | "pro"
  proExpiresAt?: string | null; // Ngày hết hạn bản quyền Pro (ISO string)
  accessToken: string;
  refreshToken: string;
  bio?: string;
}

export type ProfileUserData = User;

export interface LicenseSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  school: string;
  plan: UserVersion;
  status: "active" | "pending" | "expired";
  requestDate: string;
  activatedDate?: string;
  expiryDate?: string; // Ngày hết hạn bản quyền (DD/MM/YYYY hoặc ISO)
  durationMonths: number;
  price: number;
  note?: string;
}

export interface LicenseExpiryInfo {
  daysRemaining: number;
  isExpired: boolean;
  formattedExpiryDate: string;
  text: string;
}

