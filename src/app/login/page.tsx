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
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpenCheck,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const userData = {
        id: "u-" + Date.now(),
        name: email.includes("@") ? email.split("@")[0] : email,
        email: email,
        school: "THPT Chuyên - Tổ Toán",
        role: "Giáo viên",
        avatar: (email[0] || "U").toUpperCase(),
      };

      localStorage.setItem("tron_de_auth_user", JSON.stringify(userData));
      setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");

      setTimeout(() => {
        router.push(APP_ROUTES.HOME);
      }, 500);
    }, 700);
  };

  // Quick 1-click Demo Login for testing
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      const demoUser = {
        id: "demo-teacher-01",
        name: "Thầy Trần Tấn Phước",
        email: "phuoc.tran@edu.vn",
        school: "TRƯỜNG THPT CHUYÊN",
        role: "Tổ trưởng Chuyên môn",
        avatar: "TP",
      };

      localStorage.setItem("tron_de_auth_user", JSON.stringify(demoUser));
      setSuccessMsg("Đăng nhập bằng tài khoản Demo thành công!");

      setTimeout(() => {
        router.push(APP_ROUTES.HOME);
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans safe-padding-top safe-padding-bottom">
      {/* Background Ambient Glows */}
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
                Đăng Nhập <br />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Không Gian Giáo Viên
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Quản lý kho câu hỏi chuẩn Bộ GD&ĐT, trộn nhiều mã đề thi ngẫu nhiên và xuất bảng ma trận đáp án chỉ với 1 click.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 hidden sm:block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <span>Hỗ trợ chuẩn 4 mức độ: NB, TH, VD, VDC</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Shuffle className="w-4 h-4" />
                </div>
                <span>Hoán vị A-B-C-D & tính toán tự động đáp án</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Xuất file in ấn A4 chuẩn quy cách sư phạm</span>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-white/10 hidden sm:flex items-center justify-between text-[11px] text-slate-400">
            <span>Bảo mật dữ liệu ngân hàng đề</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hệ thống sẵn sàng
            </span>
          </div>
        </div>

        {/* Right Side: LOGIN ONLY Form */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Cổng Giáo Viên
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Đăng Nhập Hệ Thống
              </h3>
              <p className="text-xs text-slate-400">
                Đăng nhập để vào không gian quản lý câu hỏi & tạo đề thi
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email / Tên đăng nhập <span className="text-rose-400">*</span>
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Mật khẩu <span className="text-rose-400">*</span>
                  </label>
                  <Link
                    href={APP_ROUTES.FORGOT_PASSWORD}
                    className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-white/20 bg-slate-800 focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Đăng Nhập Vào Hệ Thống</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dùng thử ngay với tài khoản Giáo viên Demo</span>
              </button>
            </div>

            {/* Navigation to Register */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Thầy/Cô chưa có tài khoản?{" "}
                <Link
                  href={APP_ROUTES.REGISTER}
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
                >
                  Đăng ký tài khoản mới
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
