"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Sparkles,
  Save,
  Check,
  Shield,
} from "lucide-react";
import { User, UserVersion } from "@/types/user";
import { SUBJECTS } from "@/types/question";
import CustomSelect from "@/components/CustomSelect";

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [subjectId, setSubjectId] = useState("TOAN");
  const [version, setVersion] = useState<UserVersion>("normal");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setSchool(user.school || "");
      setDepartment(user.department || "");
      setSubjectId(user.subject?.id || "TOAN");
      setVersion(user.version || "normal");
      setErrorMsg("");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên người dùng!");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email!");
      return;
    }

    const selectedSubjectObj =
      SUBJECTS.find((s) => s.id === subjectId) || {
        id: subjectId,
        name: "Toán học",
      };

    const updatedUser: User = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      school: school.trim(),
      department: department.trim(),
      subject: selectedSubjectObj,
      version: version,
      avatar: name.trim().slice(0, 2).toUpperCase() || user.avatar,
    };

    onSave(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                Chỉnh Sửa Thông Tin Giáo Viên
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cập nhật thông tin hồ sơ và bộ môn của tài khoản
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* User Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Họ và tên</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Thầy Trần Tấn Phước..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Email</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="VD: phuoc.tran@edu.vn"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>Số điện thoại</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912 345 678"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>

          {/* School & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Trường / Đơn vị</span>
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="VD: TRƯỜNG THPT CHUYÊN..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tổ bộ môn</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="VD: TỔ TOÁN HỌC..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>

          {/* Subject & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Môn giảng dạy</span>
              </label>
              <CustomSelect
                value={subjectId}
                onChange={(val) => setSubjectId(String(val))}
                options={SUBJECTS.map((s) => ({ value: s.id, label: s.name }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Gói phiên bản</span>
              </label>
              <CustomSelect
                value={version}
                onChange={(val) => setVersion(val as UserVersion)}
                options={[
                  { value: "normal", label: "Bản Tiêu Chuẩn (Normal)" },
                  { value: "pro", label: "Bản Nâng Cao (Pro)" },
                ]}
              />
            </div>
          </div>

          {/* Role Indicator - Read-only */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Vai trò tài khoản:
            </span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
              Giáo viên
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
