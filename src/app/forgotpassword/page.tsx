"use client";

import React, { useState } from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/route";
import {
  Shuffle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Send,
  HelpCircle,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1); // 1: Send Request, 2: Reset Password
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ Email hoặc Số điện thoại!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Mã xác nhận gồm 6 chữ số đã được gửi tới ${email}. Mã thử nghiệm: 123456`);
      setStep(2);
    }, 700);
  };

  const handleConfirmNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otpCode.trim() || !newPassword.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);
      setSuccessMsg("Mật khẩu đã được đặt lại thành công! Thầy/Cô có thể đăng nhập ngay bằng mật khẩu mới.");
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10 my-6">
        {/* Left Side: Brand Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-slate-950/90 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Shuffle className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> EdTech Pro 2026
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Phần Mềm Trộn Đề Thi
                </h1>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Khôi Phục <br />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Mật Khẩu An Toàn
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hệ thống xác thực 2 lớp bảo mật tài khoản giáo viên. Mọi dữ liệu ngân hàng câu hỏi luôn được bảo toàn nguyên vẹn.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span>Mã xác nhận bảo mật gửi trực tiếp</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span>Hỗ trợ kỹ thuật 24/7 cho giáo viên các trường</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bảo mật dữ liệu ngành giáo dục</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Xác thực mã hóa
            </span>
          </div>
        </div>

        {/* Right Side: FORGOT PASSWORD ONLY Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Trung Tâm Hỗ Trợ
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isCompleted ? "Thành Công!" : "Quên Mật Khẩu"}
              </h3>
              <p className="text-xs text-slate-400">
                {isCompleted
                  ? "Mật khẩu của bạn đã được cập nhật thành công"
                  : step === 1
                  ? "Nhập email của bạn để nhận mã khôi phục mật khẩu"
                  : "Nhập mã xác nhận OTP và thiết lập mật khẩu mới"}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {isCompleted ? (
              <div className="space-y-4 pt-2">
                <Link
                  href={APP_ROUTES.LOGIN}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition-all"
                >
                  <span>Đăng Nhập Ngay Bằng Mật Khẩu Mới</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : step === 1 ? (
              /* Step 1: Send OTP to Email */
              <form onSubmit={handleSendReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Địa chỉ Email hoặc Tên đăng nhập <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="VD: phuoc.tran@edu.vn"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-amber-600/20 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Mã Xác Nhận Khôi Phục</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Enter OTP & New Password */
              <form onSubmit={handleConfirmNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mã xác nhận (OTP gồm 6 số) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Nhập 123456"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mật khẩu mới <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Cập Nhật Mật Khẩu Mới</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login link */}
            <div className="text-center pt-3 border-t border-white/10">
              <Link
                href={APP_ROUTES.LOGIN}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang Đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
