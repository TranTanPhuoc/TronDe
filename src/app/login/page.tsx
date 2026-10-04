"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Mode: "login" or "register"
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Check if already logged in -> redirect to home
  useEffect(() => {
    const existing = localStorage.getItem("tron_de_auth_user");
    if (existing) {
      router.replace("/");
    }
  }, [router]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Create user session
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
        router.push("/");
      }, 600);
    }, 800);
  };

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

    setIsLoading(true);

    setTimeout(() => {
      const userData = {
        id: "u-" + Date.now(),
        name: fullName.trim(),
        email: email.trim(),
        school: schoolName.trim() || "Trường THPT",
        role: "Giáo viên",
        avatar: fullName.trim()[0].toUpperCase(),
      };

      localStorage.setItem("tron_de_auth_user", JSON.stringify(userData));
      setSuccessMsg("Đăng ký tài khoản thành công! Đang vào hệ thống...");

      setTimeout(() => {
        router.push("/");
      }, 700);
    }, 900);
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
        router.push("/");
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Glassmorphism Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10 my-6">
        {/* Left Side: Product Showcase & Brand Hero (Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-slate-950/90 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
          <div className="space-y-6">
            {/* Logo Badge */}
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

            {/* Headline */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Giải pháp trộn đề <br />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Thông minh & Chuẩn xác
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tạo nhanh các mã đề thi trắc nghiệm, hoán vị phương án khoa học, đối chiếu ma trận đáp án và in ấn tức thì.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <span>Hỗ trợ chuẩn 4 mức độ (NB, TH, VD, VDC) & 4 dạng câu hỏi</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Shuffle className="w-4 h-4" />
                </div>
                <span>Hoán vị A-B-C-D & tính toán tự động bảng đáp án</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Xuất file in ấn A4 chuẩn quy cách Bộ Giáo Dục</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bảo mật dữ liệu ngân hàng đề</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hệ thống sẵn sàng
            </span>
          </div>
        </div>

        {/* Right Side: Interactive Dynamic Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Tab Switcher (Đăng Nhập / Đăng Ký) */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-2xl border border-white/10 relative">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  !isRegister
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Đăng Nhập
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  isRegister
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Đăng Ký Tài Khoản
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {isRegister ? "Đăng ký tài khoản giáo viên" : "Chào mừng thầy/cô quay trở lại!"}
              </h3>
              <p className="text-xs text-slate-400">
                {isRegister
                  ? "Điền thông tin để bắt đầu sử dụng phần mềm trộn đề thi"
                  : "Đăng nhập để vào không gian quản lý câu hỏi & tạo đề thi"}
              </p>
            </div>

            {/* Feedback Messages */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
              {/* Full name (Register only) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* School (Register only) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Trường / Đơn vị công tác
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="VD: Trường THPT Chuyên"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Mật khẩu <span className="text-rose-400">*</span>
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => alert("Chức năng khôi phục mật khẩu đã được gửi đến email quản trị của trường.")}
                      className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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

              {/* Remember me (Login only) */}
              {!isRegister && (
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
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isRegister ? "Đăng Ký Tài Khoản" : "Đăng Nhập Vào Hệ Thống"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            {!isRegister && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
