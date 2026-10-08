"use client";

import React from "react";
import {
  AlertTriangle,
  Sparkles,
  Shield,
  ArrowRight,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  BookOpen,
} from "lucide-react";
import { User, UserVersion } from "@/types/user";

interface ConfirmChangeVersionModalProps {
  isOpen: boolean;
  user: User | null;
  targetVersion: UserVersion;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmChangeVersionModal({
  isOpen,
  user,
  targetVersion,
  onConfirm,
  onCancel,
}: ConfirmChangeVersionModalProps) {
  if (!isOpen || !user) return null;

  const isUpgradingToPro = targetVersion === "pro";
  const subjectName = user.subject?.name || "Toán học";
  const schoolName = user.school || "Chưa cập nhật trường";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Modal Header */}
        <div
          className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between ${
            isUpgradingToPro
              ? "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent"
              : "bg-gradient-to-r from-slate-100 dark:from-slate-800/60 to-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
                isUpgradingToPro
                  ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/25"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              {isUpgradingToPro ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                {isUpgradingToPro
                  ? "Xác nhận nâng cấp gói Pro"
                  : "Xác nhận chuyển về bản Tiêu Chuẩn"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thay đổi gói bản quyền giáo viên trong hệ thống
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Main Question Confirmation Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              Bạn có muốn{" "}
              <strong className={isUpgradingToPro ? "text-amber-600 dark:text-amber-400 font-black" : "text-slate-900 dark:text-slate-100 font-black"}>
                {isUpgradingToPro ? "nâng" : "chuyển"}
              </strong>{" "}
              giáo viên <strong className="text-indigo-600 dark:text-indigo-400 font-black">{user.name}</strong> dạy môn học{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">{subjectName}</strong> của trường{" "}
              <strong className="text-slate-900 dark:text-slate-100 font-black">{schoolName}</strong> sang{" "}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black text-xs ${
                  isUpgradingToPro
                    ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                }`}
              >
                {isUpgradingToPro ? "phiên bản Nâng Cao (Pro)" : "phiên bản Tiêu Chuẩn (Normal)"}
              </span>{" "}
              không?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">Môn: {subjectName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{schoolName}</span>
              </div>
            </div>
          </div>

          {/* Version Transition Visual */}
          <div className="flex items-center justify-between gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div className="text-center flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Hiện tại
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-xl font-black text-xs ${
                  user.version === "pro"
                    ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {user.version === "pro" ? "Bản Pro" : "Bản Tiêu Chuẩn"}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-indigo-500">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            <div className="text-center flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Sau khi đổi
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-xl font-black text-xs ${
                  targetVersion === "pro"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "bg-slate-700 text-white"
                }`}
              >
                {targetVersion === "pro" ? "Bản Nâng Cao (Pro)" : "Bản Tiêu Chuẩn"}
              </span>
            </div>
          </div>

          {/* License & Sync Note */}
          <div className="space-y-2 text-xs">
            {isUpgradingToPro ? (
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1.5 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold text-[11px]">
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Thời hạn bản quyền Pro: Mua theo năm (365 ngày)</span>
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  • Người dùng và Admin sẽ thấy đếm ngược <strong>còn bao nhiêu ngày hết hạn</strong>.
                  <br />• Đơn bản quyền trong tab <strong>Quản lý mua bản quyền</strong> sẽ được tự động chuyển sang <strong>Đang hoạt động</strong>.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 font-bold text-[11px] text-slate-900 dark:text-slate-100">
                  <Shield className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Đồng bộ sang Quản lý mua bản quyền:</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  • Bản quyền Pro của giáo viên sẽ kết thúc ngay lập tức.
                  <br />• Bên tab <strong>Quản lý mua bản quyền</strong> sẽ tự động cập nhật trạng thái hiển thị <strong>Mua bản quyền</strong> (Chờ duyệt / Kích hoạt Pro) cho giáo viên này.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/95 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Không thay đổi
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
              isUpgradingToPro
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25"
                : "bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 shadow-slate-900/20"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isUpgradingToPro ? "Xác nhận nâng lên Pro" : "Xác nhận chuyển về Tiêu Chuẩn"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
