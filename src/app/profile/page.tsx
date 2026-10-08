"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/route";
import {
  User,
  Building2,
  Mail,
  Phone,
  Shield,
  Save,
  ArrowLeft,
  Camera,
  Trash2,
  Upload,
  BookOpen,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import { Subject, UserRole, UserVersion } from "@/types/user";
import { SUBJECTS } from "@/types/question";

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  school: string;
  department: string;
  subject: Subject;
  role: UserRole;
  version: UserVersion;
  avatar: string;
  avatarImage?: string | null;
  phone?: string;
  accessToken?: string;
  refreshToken?: string;
  password?: string;
}

const AVATAR_PALETTES = [
  { name: "Indigo", gradient: "from-indigo-600 via-indigo-700 to-emerald-700" },
  { name: "Ocean", gradient: "from-sky-500 via-blue-600 to-indigo-800" },
  { name: "Emerald", gradient: "from-emerald-500 via-teal-600 to-cyan-800" },
  { name: "Violet", gradient: "from-purple-600 via-fuchsia-600 to-indigo-800" },
  { name: "Sunset", gradient: "from-rose-500 via-amber-500 to-red-600" },
];

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper normalize subject
  const normalizeSubject = (sub: unknown): Subject => {
    if (sub && typeof sub === "object" && "id" in sub && "name" in sub) {
      return sub as Subject;
    }
    if (typeof sub === "string") {
      const found = SUBJECTS.find((s) => s.name === sub || s.id === sub);
      if (found) return found;
      return { id: "TOAN", name: sub || "Toán học" };
    }
    return { id: "TOAN", name: "Toán học" };
  };

  // Load existing profile from localStorage or defaults
  const [profile, setProfile] = useState<TeacherProfile>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tron_de_teacher_profile");
        if (stored) {
          const p = JSON.parse(stored);
          return {
            ...p,
            subject: normalizeSubject(p.subject),
          };
        }
        const authUser = localStorage.getItem("tron_de_auth_user");
        if (authUser) {
          const u = JSON.parse(authUser);
          return {
            id: u.id || "demo-teacher-01",
            name: u.name || "Thầy Trần Tấn Phước",
            email: u.email || "phuoc.tran@edu.vn",
            password: u.password || "••••••••",
            school: u.school || "TRƯỜNG THPT CHUYÊN",
            department: u.department || "TỔ TOÁN HỌC",
            subject: normalizeSubject(u.subject),
            role: (u.role === "admin" ? "admin" : "teacher") as UserRole,
            version: (u.version === "normal" ? "normal" : "pro") as UserVersion,
            avatar: u.avatar || "TP",
            phone: u.phone || "0912 345 678",
            accessToken: u.accessToken || "mock_jwt_access_token_demo_01",
            refreshToken: u.refreshToken || "mock_jwt_refresh_token_demo_01",
          };
        }
      } catch {
        // Storage error
      }
    }
    return {
      id: "demo-teacher-01",
      name: "Thầy Trần Tấn Phước",
      email: "phuoc.tran@edu.vn",
      password: "••••••••",
      school: "TRƯỜNG THPT CHUYÊN",
      department: "TỔ TOÁN HỌC",
      subject: { id: "TOAN", name: "Toán học" },
      role: "teacher" as UserRole,
      version: "pro" as UserVersion,
      avatar: "TP",
      phone: "0912 345 678",
      accessToken: "mock_jwt_access_token_demo_01",
      refreshToken: "mock_jwt_refresh_token_demo_01",
    };
  });

  const [name, setName] = useState(profile.name);
  const [school, setSchool] = useState(profile.school);
  // Department is fixed according to account registration
  const department = profile.department || "TỔ TOÁN HỌC";
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || "");
  const [role, setRole] = useState(profile.role);
  const [avatarText, setAvatarText] = useState(profile.avatar);
  const [avatarImage, setAvatarImage] = useState<string | null>(profile.avatarImage || null);
  const [selectedPalette, setSelectedPalette] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP)!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Kích thước ảnh tối đa là 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          const compressed = canvas.toDataURL("image/jpeg", 0.88);
          setAvatarImage(compressed);
        } else {
          setAvatarImage(result);
        }
        setSuccessMessage("Đã chọn ảnh đại diện mới! Hãy nhấn 'Lưu thông tin hồ sơ' để áp dụng.");
        setErrorMessage("");
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setAvatarImage(null);
    setSuccessMessage("Đã chuyển về sử dụng ảnh Avatar chữ viết tắt 3D!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên giáo viên!");
      return;
    }

    if (!school.trim()) {
      setErrorMessage("Vui lòng nhập tên trường hoặc đơn vị!");
      return;
    }

    const updated: TeacherProfile = {
      ...profile,
      name: name.trim(),
      school: school.trim(),
      department: "TỔ TOÁN HỌC",
      email: email.trim(),
      phone: phone.trim(),
      avatar: (avatarText.trim() || name.slice(0, 2)).toUpperCase(),
      avatarImage: avatarImage,
    };

    try {
      localStorage.setItem("tron_de_teacher_profile", JSON.stringify(updated));

      const existingAuth = localStorage.getItem("tron_de_auth_user");
      if (existingAuth) {
        const parsed = JSON.parse(existingAuth);
        localStorage.setItem(
          "tron_de_auth_user",
          JSON.stringify({
            ...parsed,
            name: updated.name,
            school: updated.school,
            department: updated.department,
            email: updated.email,
            phone: updated.phone,
            subject: profile.subject,
            role: profile.role,
            version: profile.version,
            avatar: updated.avatar,
            avatarImage: updated.avatarImage,
          })
        );
      }

      setProfile(updated);
      setSuccessMessage("Đã lưu thông tin hồ sơ giáo viên thành công!");
    } catch {
      setErrorMessage("Không thể lưu thông tin vào bộ nhớ trình duyệt!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col font-sans py-6 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hidden file input for uploading avatar image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleImageFile}
        className="hidden"
      />

      {/* Top Navbar */}
      <div className="max-w-4xl w-full mx-auto mb-6 flex items-center justify-between">
        <Link
          href={APP_ROUTES.HOME}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700/60 border border-slate-200/90 dark:border-slate-700 rounded-2xl shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại trang trộn đề</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <User className="w-3.5 h-3.5" />
            <span>Hồ Sơ Giáo Viên</span>
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="max-w-4xl w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
              Thông Tin Cá Nhân Giáo Viên
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium">
              Quản lý hồ sơ công tác, ảnh đại diện Avatar và tổ chuyên môn
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 3D Avatar Profile Spotlight Box with Image Upload */}
          <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50 dark:from-slate-800/80 via-indigo-50/30 dark:via-slate-800/50 to-white dark:to-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6 shadow-2xs">
            {/* 3D Avatar Orb / Photo Display */}
            <div className="relative group shrink-0">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr ${
                  avatarImage
                    ? "from-indigo-600 to-teal-400"
                    : AVATAR_PALETTES[selectedPalette].gradient
                } p-[3px] shadow-[0_8px_24px_rgba(79,70,229,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-2xl pointer-events-none z-10"></div>
                {avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarImage}
                    alt={name}
                    className="w-full h-full rounded-[14px] object-cover shadow-inner select-none"
                  />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 flex items-center justify-center text-white font-black text-3xl sm:text-4xl tracking-wider select-none shadow-inner drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {avatarText || "GV"}
                  </div>
                )}
              </div>

              {/* Upload trigger button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Tải ảnh đại diện từ máy tính"
                className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Actions & Controls */}
            <div className="space-y-3 text-center md:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{avatarImage ? "Đổi ảnh đại diện" : "Tải ảnh từ máy tính"}</span>
                </button>

                {avatarImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ảnh (dùng chữ 3D)</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Hỗ trợ định dạng PNG, JPG, WEBP. Ảnh sẽ được tự động căn chỉnh khung vuông chuẩn 3D.
              </p>

              {/* Initials & Color Palette (Available when not using custom image) */}
              {!avatarImage && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Chữ ký viết tắt trên Avatar (2–3 ký tự):
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={avatarText}
                      onChange={(e) => setAvatarText(e.target.value.toUpperCase())}
                      className="w-20 px-2.5 py-1 text-center font-extrabold text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-2 pt-0.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">Tông màu 3D:</span>
                    {AVATAR_PALETTES.map((pal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPalette(idx)}
                        title={pal.name}
                        className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${pal.gradient} transition-all cursor-pointer ${
                          selectedPalette === idx
                            ? "ring-2 ring-offset-2 ring-indigo-600 scale-110 shadow-md"
                            : "opacity-75 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Thầy Trần Tấn Phước"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Trường / Đơn vị tổ chức <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="VD: TRƯỜNG THPT CHUYÊN"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Department / Tổ chuyên môn - CỐ ĐỊNH, KHÔNG CHO THAY ĐỔI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Tổ bộ môn chuyên môn
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Cố định (Không thể sửa)</span>
                </span>
              </div>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  disabled
                  value={department}
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-black cursor-not-allowed select-none shadow-inner"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Tổ chuyên môn được liên kết tự động theo tài khoản của Thầy/Cô và không thể tự chỉnh sửa.
              </p>
            </div>

            {/* Subject / Môn học giảng dạy chính - CỐ ĐỊNH, KHÔNG CHO THAY ĐỔI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Môn học (Subject) giảng dạy chính
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Cố định (Không thể sửa)</span>
                </span>
              </div>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  disabled
                  value={profile.subject?.name || (typeof profile.subject === "string" ? profile.subject : "Toán học")}
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-black cursor-not-allowed select-none shadow-inner"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Môn học (Subject) được chọn khi đăng ký tài khoản và không thể tự ý thay đổi trong phần thông tin cá nhân.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="VD: phuoc.tran@edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Số điện thoại liên hệ
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Role & Version Display */}
            <div className="grid grid-cols-2 gap-4 sm:col-span-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Quyền hạn tài khoản (Role)
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={profile.role === "admin" ? "Quản trị viên (admin)" : "Giáo viên (teacher)"}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed select-none shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phiên bản hệ thống (Version)
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={profile.version === "pro" ? "Bản Nâng Cao (PRO)" : "Bản Tiêu Chuẩn (NORMAL)"}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed select-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thông tin hồ sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
