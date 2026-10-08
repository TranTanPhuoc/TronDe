"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/route";
import {
  User,
  KeyRound,
  MessageSquareHeart,
  LogOut,
  ChevronDown,
  UserCheck,
  Building2,
  Sun,
  Moon,
  Shield,
  Shuffle,
  Sparkles,
  Clock,
} from "lucide-react";
import { ProfileUserData } from "./ProfileModal";
import { useTheme } from "@/context/ThemeContext";
import { getUserProExpiryInfo } from "@/utils/approvalService";

interface UserProfileDropdownProps {
  currentUser?: ProfileUserData | null;
  schoolName: string;
  departmentName: string;
  onOpenProfile?: () => void;
  onOpenChangePassword?: () => void;
  onOpenFeedback?: () => void;
  onLogout: () => void;
  isMobile?: boolean;
  onToggleAdminMode?: () => void;
  isAdminMode?: boolean;
}

export default function UserProfileDropdown({
  currentUser,
  schoolName,
  departmentName,
  onOpenProfile,
  onOpenChangePassword,
  onOpenFeedback,
  onLogout,
  isMobile = false,
  onToggleAdminMode,
  isAdminMode = false,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const user: ProfileUserData = currentUser || {
    id: "demo-teacher-01",
    name: "Thầy Trần Tấn Phước",
    email: "phuoc.tran@edu.vn",
    password: "••••••••",
    phone: "0912 345 678",
    school: schoolName || "TRƯỜNG THPT CHUYÊN",
    department: departmentName || "TỔ TOÁN HỌC",
    subject: { id: "TOAN", name: "Toán học" },
    role: "teacher",
    version: "pro",
    proExpiresAt: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: "TP",
    accessToken: "mock_jwt_access_token_demo_01",
    refreshToken: "mock_jwt_refresh_token_demo_01",
  };

  const proExpiry = getUserProExpiryInfo(user);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 p-0.5 rounded-xl transition-all cursor-pointer select-none"
        >
          {/* 3D Mobile User Avatar */}
          <div
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 p-[1.5px] shadow-[0_2px_8px_rgba(79,70,229,0.25)] relative overflow-hidden shrink-0"
            title={`${user.name} - ${user.school || schoolName} - ${departmentName}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent pointer-events-none rounded-xl z-10"></div>
            {user.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarImage}
                alt={user.name}
                className="w-full h-full rounded-[9px] object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-[9px] bg-gradient-to-br from-indigo-600 to-emerald-700 flex items-center justify-center text-white font-black text-[11px] shadow-inner select-none">
                {user.avatar || "GV"}
              </div>
            )}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header info */}
            <div className="p-3 bg-slate-50/90 dark:bg-slate-800 rounded-xl border border-indigo-100/80 dark:border-slate-700 mb-1.5 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden">
                  {user.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.avatar || "GV"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-slate-700 dark:text-slate-200 font-semibold border-t border-slate-200 dark:border-slate-700/80 pt-1.5 flex items-center gap-1 truncate">
                <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-400 shrink-0" />
                <span className="truncate">{user.school || schoolName}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-indigo-700 dark:text-indigo-300 font-extrabold truncate">
                  {departmentName}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              {user.role === "admin" && onToggleAdminMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onToggleAdminMode();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100/70 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    {isAdminMode ? <Shuffle className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold">{isAdminMode ? "Vào trộn đề thi" : "Quản trị hệ thống"}</p>
                    <p className="text-[10px] text-slate-400">Chuyển đổi chế độ Admin</p>
                  </div>
                </button>
              )}
              <Link
                href={APP_ROUTES.PROFILE}
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Thông tin cá nhân</p>
                  <p className="text-[10px] text-slate-400">Giao diện quản lý hồ sơ riêng</p>
                </div>
              </Link>

              <Link
                href={APP_ROUTES.CHANGE_PASSWORD}
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenChangePassword) onOpenChangePassword();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100/70 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Đổi mật khẩu</p>
                  <p className="text-[10px] text-slate-400">Màn hình đổi mật khẩu riêng</p>
                </div>
              </Link>

              <Link
                href={APP_ROUTES.FEEDBACK}
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenFeedback) onOpenFeedback();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-100/70 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Đóng góp ý kiến</p>
                  <p className="text-[10px] text-slate-400">Góp ý & đánh giá phần mềm</p>
                </div>
              </Link>

              {/* Theme Toggle Quick Option */}
              <button
                type="button"
                onClick={() => toggleTheme()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100/70 dark:bg-slate-800 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">Chế độ {isDark ? "Tối" : "Sáng"}</p>
                  <p className="text-[10px] text-slate-400">Bấm để đổi sang {isDark ? "Giao diện Sáng" : "Giao diện Tối"}</p>
                </div>
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Đăng xuất</p>
                  <p className="text-[10px] text-rose-400">Thoát tài khoản an toàn</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 3D Glassmorphic Teacher Profile Card Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-2.5 bg-gradient-to-b from-white dark:from-slate-900 via-slate-50/90 dark:via-slate-900/90 to-indigo-50/30 dark:to-indigo-950/30 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05),0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-none hover:shadow-[0_6px_20px_rgba(79,70,229,0.12)] hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 cursor-pointer select-none shrink-0 group active:scale-[0.99]"
      >
        {/* 3D Avatar Sphere */}
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-teal-400 p-[2px] shadow-[0_4px_12px_rgba(79,70,229,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] relative overflow-hidden group-hover:scale-105 transition-transform duration-200"
            title={user.email}
          >
            {/* Glossy top specular light reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent rounded-xl pointer-events-none z-10"></div>
            {user.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarImage}
                alt={user.name}
                className="w-full h-full rounded-[10px] object-cover select-none drop-shadow-xs"
              />
            ) : (
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-700 flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-wide shadow-inner select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                {user.avatar || "GV"}
              </div>
            )}
          </div>
          {/* 3D Online Active Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full border-2 border-white dark:border-slate-900 shadow-[0_2px_4px_rgba(16,185,129,0.4)] ring-1 ring-emerald-500/30"></div>
        </div>

        {/* Name & School - Department Info */}
        <div className="text-left min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            <span
              className="text-xs sm:text-[13px] font-black text-slate-800 dark:text-slate-100 tracking-tight truncate max-w-[150px] sm:max-w-[200px]"
              title={user.name}
            >
              {user.name}
            </span>
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-extrabold text-white rounded-md shrink-0 shadow-xs ${
              user.role === "admin"
                ? "bg-gradient-to-r from-rose-500 to-amber-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}>
              <UserCheck className="w-2.5 h-2.5 text-white" />
              <span>{user.role === "admin" ? "ADMIN" : "GV"}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-black rounded-md shrink-0 ${
              user.version === "pro"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}>
              {user.version === "pro"
                ? `PRO ${user.role !== "admin" && proExpiry?.daysRemaining ? `• Còn ${proExpiry.daysRemaining} ngày` : ""}`
                : "NORMAL"}
            </span>
          </div>

          {/* School & Department (Tổ chuyên môn) */}
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium leading-none">
            <span
              className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[130px]"
              title={user.school || schoolName}
            >
              {user.school || schoolName}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span
              className="font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded-md border border-indigo-200/80 dark:border-indigo-700 truncate max-w-[140px] shadow-2xs"
              title={departmentName}
            >
              {departmentName}
            </span>
          </div>
        </div>

        {/* Dropdown Chevron Indicator */}
        <div className="ml-1 pl-1 border-l border-slate-200/80 dark:border-slate-800 flex items-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Card inside Dropdown */}
          <div className="p-3 bg-slate-50/90 dark:bg-slate-800 rounded-xl border border-indigo-100/80 dark:border-slate-700 mb-2">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-teal-400 p-[1.5px] shadow-xs shrink-0 overflow-hidden">
                {user.avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarImage}
                    alt={user.name}
                    className="w-full h-full rounded-[10px] object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-indigo-600 to-emerald-700 flex items-center justify-center text-white font-black text-xs shadow-inner">
                    {user.avatar || "GV"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200/60 dark:border-indigo-800">
                      {user.role === "admin" ? "Quản trị viên" : "Giáo viên"}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${
                      user.version === "pro"
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}>
                      {user.version === "pro" ? "PRO" : "NORMAL"}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5 text-[10px] text-slate-700 dark:text-slate-200 font-medium">
              <div className="flex items-center justify-between">
                <span className="truncate text-slate-700 dark:text-slate-200 font-semibold max-w-[130px] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-400 shrink-0" />
                  <span className="truncate">{user.school || schoolName}</span>
                </span>
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-200/80 dark:border-indigo-700 shrink-0 truncate max-w-[130px] shadow-2xs">
                  {departmentName}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Môn giảng dạy:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {typeof user.subject === "object" ? (user.subject?.name || "Toán học") : (user.subject || "Toán học")}
                </span>
              </div>
            </div>

            {/* Pro License Expiry Details for User */}
            {user.version === "pro" ? (
              <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-black text-amber-900 dark:text-amber-200 text-[10px]">
                      Bản quyền Pro theo năm
                    </div>
                    <div className="text-[9px] text-amber-700 dark:text-amber-300">
                      {user.role === "admin"
                        ? "Đặc quyền Quản trị viên"
                        : `Hạn: ${proExpiry?.formattedExpiryDate || "365 ngày"}`}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                  {user.role === "admin" ? "Vĩnh viễn" : proExpiry?.text || "Còn 320 ngày"}
                </span>
              </div>
            ) : (
              <div className="mt-2.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  Gói Tiêu Chuẩn (Normal)
                </span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                  Chưa mua Pro
                </span>
              </div>
            )}
          </div>

          {/* Navigation Options List */}
          <div className="space-y-1">
            {user.role === "admin" && onToggleAdminMode && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onToggleAdminMode();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer group text-left border border-rose-200/50 dark:border-rose-900/40"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100/80 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
                  {isAdminMode ? <Shuffle className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-rose-900 dark:text-rose-100">
                    {isAdminMode ? "Chuyển sang Trộn Đề Thi" : "Bảng Quản Trị Hệ Thống"}
                  </div>
                  <div className="text-[10px] text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300">
                    {isAdminMode ? "Không gian tạo mã đề và hoán vị" : "Phê duyệt câu hỏi, Quản lý User & Bản quyền"}
                  </div>
                </div>
              </button>
            )}

            {/* Option 1: Personal Profile */}
            <Link
              href={APP_ROUTES.PROFILE}
              onClick={() => {
                setIsOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Thông tin cá nhân
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300">
                  Mở màn hình hồ sơ & tổ chuyên môn riêng
                </div>
              </div>
            </Link>

            {/* Option 2: Change Password */}
            <Link
              href={APP_ROUTES.CHANGE_PASSWORD}
              onClick={() => {
                setIsOpen(false);
                if (onOpenChangePassword) onOpenChangePassword();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/70 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100/70 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-2xs">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Đổi mật khẩu
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300">
                  Mở màn hình đổi mật khẩu riêng
                </div>
              </div>
            </Link>

            {/* Option 3: Feedback / Suggestions */}
            <Link
              href={APP_ROUTES.FEEDBACK}
              onClick={() => {
                setIsOpen(false);
                if (onOpenFeedback) onOpenFeedback();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100/70 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  Đóng góp ý kiến
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300">
                  Mở màn hình gửi đánh giá & góp ý riêng
                </div>
              </div>
            </Link>

            {/* Option 4: Quick Dark / Light Mode Switch */}
            <button
              type="button"
              onClick={() => toggleTheme()}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100/70 dark:bg-slate-800 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all shadow-2xs">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Chế độ {isDark ? "Tối" : "Sáng"}
                </div>
                <div className="text-[10px] text-slate-400">
                  Bấm để chuyển sang {isDark ? "Giao diện Sáng" : "Giao diện Tối"}
                </div>
              </div>
            </button>
          </div>

          {/* Divider & Option 5: Logout */}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-1.5 pt-1.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-rose-600">Đăng xuất</div>
                <div className="text-[10px] text-rose-400">
                  Thoát tài khoản an toàn
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
