"use client";

import React, { useState, useRef } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Shield,
  AlertCircle,
  Lock,
  Camera,
  Upload,
  Trash2,
  Check,
} from "lucide-react";

export interface ProfileUserData {
  id: string;
  name: string;
  email: string;
  school: string;
  role: string;
  avatar: string;
  avatarImage?: string;
  department?: string;
  phone?: string;
  subject?: string;
  bio?: string;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [phone, setPhone] = useState(currentUser.phone || "0912 345 678");
  const [school, setSchool] = useState(currentUser.school || schoolName);
  // Tổ bộ môn chuyên môn: Cố định theo tài khoản, không cho phép chỉnh sửa
  const [department] = useState(
    currentUser.department || departmentName
  );
  const [role, setRole] = useState(currentUser.role || "Tổ trưởng Chuyên môn");
  const [avatarText, setAvatarText] = useState(currentUser.avatar || "GV");
  const [avatarImage, setAvatarImage] = useState<string | null>(
    currentUser.avatarImage || null
  );
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("");
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setAvatarImage(null);
  };

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
      role: role.trim(),
      avatar: avatarText.trim().toUpperCase() || "GV",
      avatarImage: avatarImage || undefined,
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleImageFile}
        className="hidden"
      />

      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Thông Tin Cá Nhân Giáo Viên
              </h2>
              <p className="text-xs text-slate-500">
                Quản lý hồ sơ công tác, ảnh Avatar và tổ chuyên môn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 3D Avatar Profile Spotlight with Image Upload */}
            <div className="p-4 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 shadow-2xs">
              {/* 3D Avatar Orb / Photo */}
              <div className="relative group shrink-0">
                <div
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr ${
                    avatarImage
                      ? "from-indigo-600 to-teal-400"
                      : AVATAR_PALETTES[selectedPalette].gradient
                  } p-[2.5px] shadow-[0_8px_20px_rgba(79,70,229,0.3),inset_0_1px_2px_rgba(255,255,255,0.6)] relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent rounded-2xl pointer-events-none z-10"></div>
                  {avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarImage}
                      alt={name}
                      className="w-full h-full rounded-[14px] object-cover shadow-inner select-none"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 flex items-center justify-center text-white font-black text-2xl sm:text-3xl tracking-wider select-none shadow-inner drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {avatarText || "GV"}
                    </div>
                  )}
                </div>

                {/* Upload Camera trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Tải ảnh đại diện từ máy tính"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full border-2 border-white shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Avatar Actions & Initials / Palette */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarImage ? "Đổi ảnh đại diện" : "Tải ảnh từ máy tính"}</span>
                  </button>

                  {avatarImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa ảnh</span>
                    </button>
                  )}
                </div>

                {!avatarImage && (
                  <>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <label className="text-xs font-bold text-slate-700">
                        Chữ hiển thị Avatar:
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        value={avatarText}
                        onChange={(e) => setAvatarText(e.target.value.toUpperCase())}
                        className="w-16 px-2 py-0.5 text-center font-extrabold text-xs uppercase bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                      />
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                      {AVATAR_PALETTES.map((pal, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPalette(idx)}
                          title={pal.name}
                          className={`w-5 h-5 rounded-md bg-gradient-to-tr ${pal.gradient} transition-transform cursor-pointer ${
                            selectedPalette === idx
                              ? "ring-2 ring-offset-1 ring-indigo-600 scale-110 shadow-xs"
                              : "opacity-75 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* Department / Tổ chuyên môn - CỐ ĐỊNH, KHÔNG CHO THAY ĐỔI */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tổ bộ môn chuyên môn
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    <Lock className="w-2.5 h-2.5 text-amber-600" />
                    <span>Cố định</span>
                  </span>
                </div>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={department}
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-300 rounded-xl text-slate-800 font-bold cursor-not-allowed select-none shadow-2xs"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: phuoc.tran@edu.vn"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại liên hệ
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0912 345 678"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Chức vụ / Vai trò chuyên môn
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="VD: Tổ trưởng Chuyên môn / Giáo viên bộ môn"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
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
