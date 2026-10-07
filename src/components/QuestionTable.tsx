"use client";

import React from "react";
import { ExamItem } from "@/types/question";
import { getLevelBadge, getTypeBadge } from "@/utils/helpers";
import { Eye, Pencil, Trash2, BookOpen } from "lucide-react";

interface QuestionTableProps {
  questions: ExamItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetail: (item: ExamItem) => void;
  onEdit: (item: ExamItem) => void;
  onDelete: (item: ExamItem) => void;
}

export default function QuestionTable({
  questions,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onEdit,
  onDelete,
}: QuestionTableProps) {
  const isAllSelected =
    questions.length > 0 && selectedIds.length === questions.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <tr>
              <th scope="col" className="p-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
              </th>
              <th scope="col" className="px-3 py-3.5 w-12 text-center">
                STT
              </th>
              <th scope="col" className="px-4 py-3.5">
                Câu hỏi & Nội dung
              </th>
              <th scope="col" className="px-3 py-3.5 w-32">
                Mức độ
              </th>
              <th scope="col" className="px-3 py-3.5 w-32">
                Dạng câu
              </th>
              <th scope="col" className="px-3 py-3.5 w-36">
                Đáp án
              </th>
              <th scope="col" className="px-3 py-3.5 w-36">
                Tác giả
              </th>
              <th scope="col" className="px-4 py-3.5 w-28 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const levelStyle = getLevelBadge(item.question.level.short_name);
              const typeStyle = getTypeBadge(item.question.type.short_name);

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                    isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/30" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                  </td>

                  {/* Index */}
                  <td className="px-3 py-4 text-center font-bold text-xs text-slate-500 dark:text-slate-400">
                    {index + 1}
                  </td>

                  {/* Question and Content preview */}
                  <td className="px-4 py-4 max-w-md">
                    {item.question.lesson && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded mb-1 max-w-full truncate">
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.question.lesson}</span>
                      </div>
                    )}
                    <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                      {item.question.question || (
                        <span className="italic text-slate-400 dark:text-slate-500">Chưa có câu hỏi</span>
                      )}
                    </p>
                    {item.question.content && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-mono">
                        {item.question.content}
                      </p>
                    )}
                  </td>

                  {/* Level Badge */}
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${levelStyle.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot}`} />
                      {item.question.level.short_name}
                    </span>
                  </td>

                  {/* Type Badge */}
                  <td className="px-3 py-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md border ${typeStyle.bg}`}
                    >
                      {item.question.type.name}
                    </span>
                  </td>

                  {/* Answer */}
                  <td className="px-3 py-4 font-semibold text-xs text-emerald-800 dark:text-emerald-300 line-clamp-2">
                    {item.question.answer || "-"}
                  </td>

                  {/* Author */}
                  <td className="px-3 py-4">
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {item.author.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {item.author.update_at || item.author.created_at}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
