"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/route";
import {
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Shield,
  ArrowLeft,
  AlertCircle,
  Save,
  CheckCircle2,
  Lock,
  Camera,
  Trash2,
  Upload,
} from "lucide-react";
import { ProfileUserData } from "@/components/ProfileModal";

const DEFAULT_TEACHER: ProfileUserData = {
  id: "demo-teacher-01",
  name: "Thầy Trần Tấn Phước",
  email: "phuoc.tran@edu.vn",
  school: "TRƯỜNG THPT CHUYÊN",
  department: "TỔ TOÁN HỌC",
  role: "Tổ trưởng Chuyên môn",
  avatar: "TP",
  phone: "0912 345 678",
};

const AVATAR_PALETTES = [
  { name: "Indigo Sapphire", gradient: "from-indigo-600 to-violet-700" },
  { name: "Emerald Mint", gradient: "from-emerald-600 to-teal-700" },
  { name: "Sunset Amber", gradient: "from-amber-500 to-rose-600" },
  { name: "Ocean Cyan", gradient: "from-cyan-600 to-blue-700" },
  { name: "Rose Ruby", gradient: "from-rose-600 to-pink-700" },
];

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialUser] = useState<ProfileUserData>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tron_de_auth_user");
        if (stored) return JSON.parse(stored);
      } catch {
        // Storage error
      }
    }
    return DEFAULT_TEACHER;
  });

  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [phone, setPhone] = useState(initialUser.phone || "0912 345 678");
  const [school, setSchool] = useState(initialUser.school || DEFAULT_TEACHER.school);
  // Tổ bộ môn chuyên môn: Hiển thị theo tài khoản, KHÔNG cho phép chỉnh sửa
  const [department] = useState(
    initialUser.department || "TỔ TOÁN HỌC"
  );
  const [role, setRole] = useState(initialUser.role || DEFAULT_TEACHER.role);

  // Avatar text & custom uploaded image
  const [avatarText, setAvatarText] = useState(initialUser.avatar || "TP");
  const [avatarImage, setAvatarImage] = useState<string | null>(
    initialUser.avatarImage || null
  );
  const [selectedPalette, setSelectedPalette] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle image upload & crop to square 256x256
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Vui lòng chọn file định dạng hình ảnh hợp lệ (PNG, JPG, WEBP)!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Dung lượng file ảnh tối đa là 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

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

    // Reset input value so same file can be selected again
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
      setErrorMessage("Vui lòng nhập tên trường hoặc đơn vị tổ chức!");
      return;
    }

    const updatedUser: ProfileUserData = {
      id: initialUser.id || "demo-teacher-01",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      school: school.trim(),
      department: department.trim(), // Giữ nguyên tổ bộ môn cố định
      role: role.trim(),
      avatar: avatarText.trim().toUpperCase() || "GV",
      avatarImage: avatarImage || undefined,
    };

    try {
      localStorage.setItem("tron_de_auth_user", JSON.stringify(updatedUser));
      setSuccessMessage("Cập nhật thông tin cá nhân và ảnh đại diện giáo viên thành công!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch {
      setErrorMessage("Không thể lưu thông tin vào bộ nhớ trình duyệt!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col font-sans py-6 px-4 sm:px-6 lg:px-8">
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
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50/60 border border-slate-200/90 rounded-2xl shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại trang trộn đề</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <User className="w-3.5 h-3.5" />
            <span>Hồ Sơ Giáo Viên</span>
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
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
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs sm:text-sm font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 3D Avatar Profile Spotlight Box with Image Upload */}
          <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 shadow-2xs">
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
                className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full border-2 border-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ảnh (dùng chữ 3D)</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Hỗ trợ định dạng PNG, JPG, WEBP. Ảnh sẽ được tự động căn chỉnh khung vuông chuẩn 3D.
              </p>

              {/* Initials & Color Palette (Available when not using custom image) */}
              {!avatarImage && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      Chữ ký viết tắt trên Avatar (2–3 ký tự):
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={avatarText}
                      onChange={(e) => setAvatarText(e.target.value.toUpperCase())}
                      className="w-20 px-2.5 py-1 text-center font-extrabold text-xs uppercase bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-2 pt-0.5">
                    <span className="text-[11px] text-slate-500 font-semibold mr-1">Tông màu 3D:</span>
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Department / Tổ chuyên môn - CỐ ĐỊNH, KHÔNG CHO THAY ĐỔI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tổ bộ môn chuyên môn
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-600" />
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
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-100/90 border border-slate-300 rounded-xl text-slate-800 font-black cursor-not-allowed select-none shadow-inner"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                Tổ chuyên môn được liên kết tự động theo tài khoản của Thầy/Cô và không thể tự chỉnh sửa.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="VD: phuoc.tran@edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Số điện thoại liên hệ
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>

            {/* Role */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chức vụ / Vai trò chuyên môn
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="VD: Tổ trưởng Chuyên môn / Giáo viên bộ môn"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
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
