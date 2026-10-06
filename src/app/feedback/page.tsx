"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/route";
import {
  MessageSquareHeart,
  Star,
  Send,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Bug,
  FileCheck,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

const FEEDBACK_TOPICS = [
  {
    id: "feature",
    label: "Góp ý tính năng mới",
    icon: Sparkles,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
  {
    id: "bug",
    label: "Báo lỗi / Sự cố",
    icon: Bug,
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "format",
    label: "Định dạng đề thi & File Word/PDF",
    icon: FileCheck,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "other",
    label: "Ý kiến đóng góp khác",
    icon: HelpCircle,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
];

const RATING_LABELS: Record<number, string> = {
  1: "Chưa hài lòng",
  2: "Cần cải thiện nhiều",
  3: "Bình thường / Tạm ổn",
  4: "Hài lòng và tiện lợi",
  5: "Tuyệt vời, phần mềm rất hữu ích!",
};

export default function FeedbackPage() {
  const router = useRouter();

  const [topic, setTopic] = useState("feature");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tron_de_auth_user");
        if (stored) {
          const u = JSON.parse(stored);
          return u.email || "";
        }
      } catch {
        // Storage error
      }
    }
    return "";
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề góp ý!");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung chi tiết ý kiến đóng góp!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save feedback to localStorage
      try {
        const existing = JSON.parse(
          localStorage.getItem("tron_de_user_feedbacks") || "[]"
        );
        existing.push({
          id: "fb-" + Date.now(),
          topic,
          rating,
          title: title.trim(),
          content: content.trim(),
          email: email.trim(),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("tron_de_user_feedbacks", JSON.stringify(existing));
      } catch {
        // Storage error
      }

      setIsSubmitting(false);
      setTitle("");
      setContent("");
      setSuccessMessage(
        "Cảm ơn Thầy/Cô đã đóng góp ý kiến quý báu! Ban phát triển sẽ nghiên cứu và hoàn thiện phần mềm trong các bản cập nhật tiếp theo."
      );

      setTimeout(() => {
        router.push(APP_ROUTES.HOME);
      }, 2000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-rose-50/20 to-slate-100 flex flex-col font-sans py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar */}
      <div className="max-w-2xl w-full mx-auto mb-6 flex items-center justify-between">
        <Link
          href={APP_ROUTES.HOME}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-rose-700 bg-white hover:bg-rose-50/60 border border-slate-200/90 rounded-2xl shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại trang trộn đề</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Đóng Góp Ý Kiến</span>
        </span>
      </div>

      {/* Main Container Card */}
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
              Đóng Góp Ý Kiến & Phản Hồi
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 font-medium">
              Mọi ý kiến của Thầy/Cô đều là động lực to lớn giúp hoàn thiện phần mềm trộn đề thi
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

          {/* Topic Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Chọn chủ đề Thầy/Cô muốn góp ý <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FEEDBACK_TOPICS.map((item) => {
                const Icon = item.icon;
                const isSelected = topic === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTopic(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "border-rose-500 bg-rose-50/70 shadow-sm ring-1 ring-rose-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-rose-900" : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-center space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Đánh giá mức độ hài lòng về phần mềm
            </label>
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        active
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-extrabold text-amber-600 h-4">
              {RATING_LABELS[hoverRating || rating]}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Tiêu đề góp ý <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cần thêm tính năng xem trước ma trận đề thi..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
            />
          </div>

          {/* Detailed Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Nội dung chi tiết ý kiến <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {content.length}/1000
              </span>
            </div>
            <textarea
              required
              rows={5}
              maxLength={1000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả cụ thể trải nghiệm hoặc đề xuất cải tiến của Thầy/Cô..."
              className="w-full p-4 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs resize-none"
            />
          </div>

          {/* Email for feedback response */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              5. Email nhận phản hồi (tùy chọn)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="VD: phuoc.tran@edu.vn"
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-rose-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Đang gửi ý kiến..." : "Gửi đóng góp ý kiến"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
