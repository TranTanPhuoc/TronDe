"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  KeyRound,
  MessageSquareHeart,
  LogOut,
  ChevronDown,
  UserCheck,
  Building2,
} from "lucide-react";
import { ProfileUserData } from "./ProfileModal";

interface UserProfileDropdownProps {
  currentUser: ProfileUserData;
  schoolName: string;
  departmentName: string;
  onOpenProfile: () => void;
  onOpenChangePassword: () => void;
  onOpenFeedback: () => void;
  onLogout: () => void;
  isMobile?: boolean;
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
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            title={`${currentUser.name} - ${currentUser.school || schoolName} - ${departmentName}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent pointer-events-none rounded-xl z-10"></div>
            <div className="w-full h-full rounded-[9px] bg-gradient-to-br from-indigo-600 to-emerald-700 flex items-center justify-center text-white font-black text-[11px] shadow-inner select-none">
              {currentUser.avatar || "GV"}
            </div>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_12px_36px_rgba(15,23,42,0.15),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header info */}
            <div className="p-3 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-xl border border-indigo-100/80 mb-1.5 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                  {currentUser.avatar || "GV"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 font-medium border-t border-slate-100 pt-1.5 flex items-center gap-1 truncate">
                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.school || schoolName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-600 font-bold truncate">
                  {departmentName}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Thông tin cá nhân</p>
                  <p className="text-[10px] text-slate-400">Hồ sơ trường, tổ & liên hệ</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenChangePassword();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-amber-50/80 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Đổi mật khẩu</p>
                  <p className="text-[10px] text-slate-400">Bảo mật tài khoản giáo viên</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFeedback();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold">Đóng góp ý kiến</p>
                  <p className="text-[10px] text-slate-400">Góp ý & phản hồi tính năng</p>
                </div>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="relative" ref={dropdownRef}>
      {/* 3D Glassmorphic Teacher Profile Card (Clickable Trigger) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-2.5 bg-gradient-to-b from-white via-slate-50/90 to-indigo-50/30 border border-slate-200/90 rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05),0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.12),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-indigo-300 transition-all duration-200 shrink-0 cursor-pointer select-none group"
      >
        {/* 3D Avatar Sphere */}
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-teal-400 p-[2px] shadow-[0_4px_12px_rgba(79,70,229,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] relative overflow-hidden group-hover:scale-105 transition-transform"
            title={currentUser.email}
          >
            {/* Glossy top specular light reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent rounded-xl pointer-events-none z-10"></div>
            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-700 flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-wide shadow-inner select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              {currentUser.avatar || "GV"}
            </div>
          </div>
          {/* 3D Online Active Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(16,185,129,0.4)] ring-1 ring-emerald-500/30"></div>
        </div>

        {/* Name & School - Department Info */}
        <div className="text-left min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs sm:text-[13px] font-black text-slate-800 tracking-tight truncate max-w-[150px] sm:max-w-[200px] group-hover:text-indigo-900 transition-colors"
              title={currentUser.name}
            >
              {currentUser.name}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md shadow-[0_1px_3px_rgba(16,185,129,0.3)] shrink-0">
              <UserCheck className="w-2.5 h-2.5 text-white" />
              <span>{currentUser.role || "GV"}</span>
            </span>
          </div>

          {/* School & Department (Tổ chuyên môn) */}
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1.5 font-medium leading-none">
            <span
              className="font-semibold text-slate-600 truncate max-w-[130px]"
              title={currentUser.school || schoolName}
            >
              {currentUser.school || schoolName}
            </span>
            <span className="text-slate-300">•</span>
            <span
              className="font-bold text-indigo-700 bg-indigo-50/90 px-1.5 py-0.5 rounded-md border border-indigo-200/80 truncate max-w-[140px] shadow-2xs"
              title={departmentName}
            >
              {departmentName}
            </span>
          </div>
        </div>

        {/* Chevron Indicator */}
        <div className="ml-1 p-1 text-slate-400 group-hover:text-indigo-600 transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Floating 3D Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.18),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
          {/* Header Card inside Dropdown */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-xl border border-indigo-100/90 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                {currentUser.avatar || "GV"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {currentUser.name}
                  </p>
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded">
                    {currentUser.role || "Giáo viên"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 font-medium border-t border-slate-100 pt-2 flex items-center justify-between gap-1">
              <span className="truncate text-slate-500">
                {currentUser.school || schoolName}
              </span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 shrink-0">
                {departmentName}
              </span>
            </div>
          </div>

          {/* Menu Action List */}
          <div className="space-y-1">
            {/* 1. Thông tin cá nhân */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenProfile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl transition-colors cursor-pointer text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 group-hover:text-indigo-600">
                  Thông tin cá nhân
                </p>
                <p className="text-[11px] text-slate-400">
                  Cập nhật họ tên, trường học, tổ chuyên môn & liên hệ
                </p>
              </div>
            </button>

            {/* 2. Đổi mật khẩu */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenChangePassword();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-amber-50/80 rounded-xl transition-colors cursor-pointer text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 group-hover:text-amber-600">
                  Đổi mật khẩu
                </p>
                <p className="text-[11px] text-slate-400">
                  Bảo vệ an toàn cho tài khoản giáo viên
                </p>
              </div>
            </button>

            {/* 3. Đóng góp ý kiến */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenFeedback();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-xl transition-colors cursor-pointer text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 group-hover:text-emerald-600">
                  Đóng góp ý kiến
                </p>
                <p className="text-[11px] text-slate-400">
                  Phản hồi tính năng & đề xuất cải tiến phần mềm
                </p>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-slate-100 my-1.5"></div>

            {/* 4. Đăng xuất */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Đăng xuất khỏi hệ thống</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
