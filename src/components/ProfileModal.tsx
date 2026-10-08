"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Shield,
  AlertCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import { User as UserType, ProfileUserData as ProfileUserDataType, UserRole, UserVersion } from "@/types/user";

export type ProfileUserData = ProfileUserDataType;
export type { UserType, UserRole, UserVersion };

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ProfileUserData;
  onSave: (updatedUser: ProfileUserData) => void;
  departmentName?: string;
  schoolName?: string;
}

const AVATAR_PALETTES = [
  { name: "Indigo Sapphire", gradient: "from-indigo-600 to-violet-700" },
  { name: "Emerald Mint", gradient: "from-emerald-600 to-teal-700" },
  { name: "Sunset Amber", gradient: "from-amber-500 to-rose-600" },
  { name: "Ocean Cyan", gradient: "from-cyan-600 to-blue-700" },
  { name: "Rose Ruby", gradient: "from-rose-600 to-pink-700" },
];

function ProfileModalContent({
  onClose,
  currentUser,
  onSave,
  departmentName,
  schoolName,
}: {
  onClose: () => void;
  currentUser: ProfileUserData;
  onSave: (updatedUser: ProfileUserData) => void;
  departmentName: string;
  schoolName: string;
}) {
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [phone, setPhone] = useState(currentUser.phone || "0912 345 678");
  const [school, setSchool] = useState(currentUser.school || schoolName);
  const [department] = useState(
    currentUser.department || departmentName
  );
  const [role, setRole] = useState<UserRole>(currentUser.role || "teacher");
  const [avatarText, setAvatarText] = useState(currentUser.avatar || "GV");
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên giáo viên!");
      return;
    }

    if (!school.trim()) {
      setErrorMessage("Vui lòng nhập tên trường hoặc đơn vị tổ chức!");
      return;
    }

    const updatedUser: ProfileUserData = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      school: school.trim(),
      department: department.trim(),
      role: role,
      avatar: avatarText.trim().toUpperCase() || "GV",
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 dark:from-slate-850 via-white dark:via-slate-900 to-slate-50 dark:to-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Thông Tin Cá Nhân Giáo Viên
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý hồ sơ công tác, trường học và tổ chuyên môn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-slate-900 dark:text-slate-100">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 3D Avatar Profile Spotlight */}
            <div className="p-4 bg-gradient-to-b from-slate-50 dark:from-slate-800/80 via-indigo-50/30 dark:via-slate-800/40 to-white dark:to-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 shadow-2xs">
              {/* 3D Avatar Orb */}
              <div className="relative group shrink-0">
                <div
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${AVATAR_PALETTES[selectedPalette].gradient} p-[2.5px] shadow-[0_8px_20px_rgba(79,70,229,0.3),inset_0_1px_2px_rgba(255,255,255,0.6)] relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent rounded-2xl pointer-events-none z-10"></div>
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 flex items-center justify-center text-white font-black text-2xl sm:text-3xl tracking-wider select-none shadow-inner drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {avatarText || "GV"}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(16,185,129,0.4)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              </div>

              {/* Avatar Initials & Color Palette Picker */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chữ hiển thị Avatar (2-3 ký tự):
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={avatarText}
                    onChange={(e) => setAvatarText(e.target.value.toUpperCase())}
                    className="w-20 px-2.5 py-1 text-center font-extrabold text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Chọn tông màu 3D cho ảnh đại diện của Thầy/Cô:
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                  {AVATAR_PALETTES.map((pal, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPalette(idx)}
                      title={pal.name}
                      className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${pal.gradient} transition-transform cursor-pointer ${
                        selectedPalette === idx
                          ? "ring-2 ring-offset-2 ring-indigo-600 dark:ring-offset-slate-900 scale-110 shadow-xs"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Nhóm 1: Thông tin cá nhân & Đơn vị công tác (Chỉnh sửa được) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Thông tin cá nhân & Đơn vị công tác
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Họ và tên giáo viên <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Thầy Trần Tấn Phước"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="VD: phuoc.tran@edu.vn"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0912 345 678"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                    />
                  </div>
                </div>

                {/* School */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Trường / Đơn vị tổ chức <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="VD: TRƯỜNG THPT CHUYÊN"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nhóm 2: Thông tin chuyên môn & Phân quyền hệ thống (Cố định) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Thông tin chuyên môn & Quyền hạn tài khoản
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                  <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                  <span>Cố định</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tổ chuyên môn */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Tổ bộ môn chuyên môn
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={department}
                      className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed select-none shadow-2xs"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Môn học giảng dạy chính */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Môn học giảng dạy chính
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-emerald-500 dark:text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={typeof currentUser.subject === "object" ? (currentUser.subject?.name || "Toán học") : (currentUser.subject || "Toán học")}
                      className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed select-none shadow-2xs"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Vai trò */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Vai trò tài khoản
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentUser.role === "admin" ? "Quản trị viên" : "Giáo viên"}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed select-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Gói phiên bản */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Gói phiên bản
                  </label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentUser.version === "pro" ? "Bản Nâng Cao (Pro)" : "Bản Tiêu Chuẩn"}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed select-none shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-start gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Tổ chuyên môn, Môn học giảng dạy và Vai trò tài khoản được cố định theo đăng ký ban đầu để bảo vệ dữ liệu.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/95 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thông tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSave,
  departmentName = "TỔ BỘ MÔN CHUYÊN MÔN",
  schoolName = "TRƯỜNG THPT CHUYÊN",
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <ProfileModalContent
      key={`${currentUser.id}-${currentUser.name}-${schoolName}-${departmentName}`}
      onClose={onClose}
      currentUser={currentUser}
      onSave={onSave}
      departmentName={departmentName}
      schoolName={schoolName}
    />
  );
}
