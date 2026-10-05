"use client";

import React, { useState } from "react";
import { ExamItem } from "@/types/question";
import { getLevelBadge, getTypeBadge, getSubjectBadge, getGradeBadge } from "@/utils/helpers";
import { X, Copy, Check, User, Clock, CheckCircle2, BookOpen } from "lucide-react";

interface QuestionDetailModalProps {
  item: ExamItem | null;
  onClose: () => void;
  onEdit: (item: ExamItem) => void;
}

export default function QuestionDetailModal({
  item,
  onClose,
  onEdit,
}: QuestionDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const { question, author } = item;
  const levelStyle = getLevelBadge(question.level.short_name);
  const typeStyle = getTypeBadge(question.type.short_name);
  const subjectStyle = getSubjectBadge(question.subject);
  const gradeStyle = getGradeBadge(question.grade);

  const handleCopy = () => {
    const textToCopy = `[${subjectStyle.label} - ${gradeStyle.label} | ${question.type.name} - ${question.level.name}]\nCâu hỏi: ${question.question}\n\nNội dung/Phương án:\n${question.content}\n\nĐáp án: ${question.answer}\n\nLời giải chi tiết:\n${question.solution_guide}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 safe-padding-top safe-padding-bottom">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92dvh] sm:max-h-[85dvh] my-auto">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 pr-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${subjectStyle.bg}`}
            >
              {subjectStyle.label}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md border ${gradeStyle.bg}`}
            >
              {gradeStyle.label}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${levelStyle.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot}`} />
              {question.level.name} ({question.level.short_name})
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${typeStyle.bg}`}
            >
              {question.type.name} ({question.type.short_name})
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Sao chép nội dung câu hỏi"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Question text */}
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Content / Options */}
          {question.content && (
            <div className="p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Nội dung / Các phương án:
              </span>
              <pre className="text-xs sm:text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed">
                {question.content}
              </pre>
            </div>
          )}

          {/* Answer */}
          <div className="p-3.5 sm:p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900 uppercase">
                Đáp án chính xác:
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-emerald-800">
              {question.answer || <span className="italic text-slate-400">Chưa thiết lập</span>}
            </p>
          </div>

          {/* Solution Guide */}
          {question.solution_guide && (
            <div className="p-3.5 sm:p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900 uppercase">
                  Hướng dẫn giải chi tiết:
                </span>
              </div>
              <pre className="text-xs sm:text-sm font-sans text-slate-700 whitespace-pre-wrap leading-relaxed">
                {question.solution_guide}
              </pre>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Người tạo: <strong className="font-semibold text-slate-700">{author.name}</strong></span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Tạo: {author.created_at}
              </span>
              <span>•</span>
              <span>Sửa: {author.update_at}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0 gap-2">
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer truncate"
          >
            Chỉnh sửa câu hỏi
          </button>
          <button
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
