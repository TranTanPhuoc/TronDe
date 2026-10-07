"use client";

import React, { useState } from "react";
import {
  X,
  MessageSquareHeart,
  Star,
  Send,
  AlertCircle,
  Sparkles,
  Bug,
  FileCheck,
  HelpCircle,
} from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    email: string;
    school?: string;
  };
  onSuccess: (message: string) => void;
}

const FEEDBACK_TOPICS = [
  { id: "feature", label: "Góp ý tính năng mới", icon: Sparkles, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { id: "bug", label: "Báo lỗi / Sự cố", icon: Bug, color: "text-rose-600 bg-rose-50 border-rose-200" },
  { id: "format", label: "Định dạng đề thi & Word", icon: FileCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "other", label: "Ý kiến đóng góp khác", icon: HelpCircle, color: "text-amber-600 bg-amber-50 border-amber-200" },
];

const RATING_LABELS = [
  "",
  "Chưa hài lòng",
  "Tạm chấp nhận",
  "Bình thường",
  "Rất hài lòng",
  "Tuyệt vời xuất sắc",
];

export default function FeedbackModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: FeedbackModalProps) {
  const [topic, setTopic] = useState("feature");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contactEmail, setContactEmail] = useState(currentUser.email || "");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung đóng góp ý kiến!");
      return;
    }

    // Save to local feedback store for persistence
    try {
      const feedbackItem = {
        id: "fb-" + Date.now(),
        topic,
        rating,
        title: title.trim() || "Góp ý phần mềm",
        content: content.trim(),
        authorName: currentUser.name,
        authorEmail: contactEmail.trim(),
        school: currentUser.school,
        createdAt: new Date().toLocaleString("vi-VN"),
      };
      const existing = localStorage.getItem("tron_de_feedback_list");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(feedbackItem);
      localStorage.setItem("tron_de_feedback_list", JSON.stringify(list));
    } catch {
      // Storage fallback
    }

    // Reset and succeed
    setTitle("");
    setContent("");
    setErrorMessage("");
    onSuccess("Cảm ơn Thầy/Cô đã đóng góp ý kiến! Ý kiến quý báu đã được ghi nhận để cải tiến hệ thống.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 dark:from-slate-850 via-white dark:via-slate-900 to-slate-50 dark:to-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Đóng Góp Ý Kiến & Phản Hồi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ý kiến của Thầy/Cô giúp phần mềm ngày càng hoàn thiện hơn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-slate-900 dark:text-slate-100">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Topic Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Chủ đề đóng góp ý kiến
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TOPICS.map((top) => {
                  const Icon = top.icon;
                  const isSelected = topic === top.id;
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => setTopic(top.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer text-xs font-semibold ${
                        isSelected
                          ? `${top.color} ring-2 ring-indigo-500/30 shadow-xs font-bold`
                          : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{top.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Star Rating */}
            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mức độ hài lòng với phần mềm:
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  {RATING_LABELS[hoverRating || rating]}
                </p>
              </div>

              {/* Star buttons */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 dark:text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tiêu đề góp ý (Tùy chọn)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Cần thêm tính năng xuất đề thi dạng song song 2 cột..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              />
            </div>

            {/* Detailed Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Nội dung chi tiết <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {content.length}/1000 ký tự
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={1000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Thầy/Cô vui lòng mô tả chi tiết mong muốn hoặc sự cố gặp phải..."
                className="w-full p-3 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs resize-none"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email nhận phản hồi phản hồi từ ban quản trị
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Địa chỉ email để phản hồi kết quả..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/95 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-200 dark:shadow-none transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi ý kiến đóng góp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
