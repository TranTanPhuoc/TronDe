"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_ROUTES } from "@/route";
import {
  Shuffle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  School,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpenCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const existing = localStorage.getItem("tron_de_auth_user");
    if (existing) {
      router.replace(APP_ROUTES.HOME);
    }
  }, [router]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải chứa ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Vui lòng đồng ý với Điều khoản sử dụng hệ thống!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const userData = {
        id: "u-" + Date.now(),
        name: fullName.trim(),
        email: email.trim(),
        school: schoolName.trim() || "Trường THPT Chuyên",
        role: "Giáo viên",
        avatar: fullName.trim()[0].toUpperCase(),
      };

      localStorage.setItem("tron_de_auth_user", JSON.stringify(userData));
      setSuccessMsg("Tạo tài khoản thành công! Đang chuyển vào không gian làm việc...");

      setTimeout(() => {
        router.push(APP_ROUTES.HOME);
      }, 600);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans safe-padding-top safe-padding-bottom">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10 my-4 sm:my-6">
        {/* Left Side: Brand Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-slate-950/90 p-5 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                <Shuffle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> EdTech Pro 2026
                </span>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                  Phần Mềm Trộn Đề Thi
                </h1>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                Đăng Ký <br />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Tài Khoản Giáo Viên
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tạo tài khoản cá nhân để lưu trữ ngân hàng đề thi riêng, bảo mật câu hỏi và xuất đề thi định dạng chuẩn.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 hidden sm:block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <span>Kho câu hỏi lưu trữ cá nhân hóa an toàn</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Shuffle className="w-4 h-4" />
                </div>
                <span>Tùy biến số lượng mã đề & thời gian thi</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Đáp ứng chuẩn giáo dục phổ thông mới</span>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-white/10 hidden sm:flex items-center justify-between text-[11px] text-slate-400">
            <span>Bảo mật dữ liệu ngân hàng đề</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Miễn phí cho giáo viên
            </span>
          </div>
        </div>

        {/* Right Side: REGISTER ONLY Form */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Gia Nhập Cộng Đồng
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Tạo Tài Khoản Mới
              </h3>
              <p className="text-xs text-slate-400">
                Điền thông tin để bắt đầu sử dụng phần mềm trộn đề thi
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên giáo viên <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Thầy Trần Tấn Phước"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trường / Đơn vị công tác
                </label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="VD: Trường THPT Chuyên"
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa chỉ Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: phuoc.tran@edu.vn"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mật khẩu <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      required
                      className="w-full pl-10 pr-10 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Xác nhận mật khẩu <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 border-white/20 bg-slate-800 focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none leading-relaxed">
                  Tôi đồng ý với các quy định bảo mật & điều khoản sử dụng phần mềm
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Tạo Tài Khoản & Vào Hệ Thống</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Navigation back to Login */}
            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-xs text-slate-400">
                Thầy/Cô đã có tài khoản rồi?{" "}
                <Link
                  href={APP_ROUTES.LOGIN}
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
