"use client";

import React, { useState } from "react";
import { ExamItem } from "@/types/question";
import { getLevelBadge, getTypeBadge } from "@/utils/helpers";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  CheckCircle,
  BookOpen,
} from "lucide-react";

interface QuestionCardProps {
  item: ExamItem;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetail: (item: ExamItem) => void;
  onEdit: (item: ExamItem) => void;
  onDelete: (item: ExamItem) => void;
}

export default function QuestionCard({
  item,
  index,
  isSelected,
  onToggleSelect,
  onViewDetail,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const { question, author } = item;
  const levelStyle = getLevelBadge(question.level.short_name);
  const typeStyle = getTypeBadge(question.type.short_name);

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
        isSelected
          ? "border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Câu {index + 1}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${levelStyle.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot}`} />
              {question.level.name} ({question.level.short_name})
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${typeStyle.bg}`}
            >
              {question.type.name}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetail(item)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Xem chi tiết câu hỏi"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Chỉnh sửa câu hỏi"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Xóa câu hỏi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Lesson Badge (Bài học trong SGK) */}
        {question.lesson && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-1 rounded-md font-medium w-fit">
            <BookOpen className="w-3.5 h-3.5 shrink-0 text-indigo-500 dark:text-indigo-400" />
            <span className="truncate">{question.lesson}</span>
          </div>
        )}

        {/* Main Question Text */}
        <div>
          <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            {question.question || (
              <span className="italic text-slate-400 dark:text-slate-500">Chưa có nội dung câu hỏi</span>
            )}
          </h3>
        </div>

        {/* Question Content / Choices */}
        {question.content && (
          <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Nội dung / Các phương án lựa chọn:
            </p>
            <pre className="text-xs sm:text-sm font-sans text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {question.content}
            </pre>
          </div>
        )}

        {/* Toggle Answer & Solution */}
        <div className="pt-1">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
          >
            {showAnswer ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Ẩn đáp án & hướng dẫn giải
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Hiện đáp án & hướng dẫn giải
              </>
            )}
          </button>

          {showAnswer && (
            <div className="mt-2.5 p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase">
                    Đáp án đúng:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-200 mt-0.5">
                    {question.answer || (
                      <span className="italic text-slate-400 dark:text-slate-500">Chưa thiết lập</span>
                    )}
                  </p>
                </div>
              </div>

              {question.solution_guide && (
                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Hướng dẫn giải chi tiết:
                  </span>
                  <pre className="text-xs text-slate-600 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {question.solution_guide}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer (Author & Timestamps) */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{author.name}</span>
        </div>
        <div className="flex items-center gap-1.5" title={`Cập nhật: ${author.update_at}`}>
          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>{author.update_at || author.created_at}</span>
        </div>
      </div>
    </div>
  );
}
