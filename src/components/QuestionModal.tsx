"use client";

import React, { useState } from "react";
import {
  ExamItem,
  QUESTION_LEVELS,
  QUESTION_TYPES,
  QuestionLevel,
  QuestionType,
} from "@/types/question";
import { formatDateTime } from "@/utils/helpers";
import { X, Check, AlertCircle } from "lucide-react";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExamItem) => void;
  editingItem: ExamItem | null;
}

function QuestionModalForm({
  onClose,
  onSave,
  editingItem,
}: {
  onClose: () => void;
  onSave: (item: ExamItem) => void;
  editingItem: ExamItem | null;
}) {
  const [levelId, setLevelId] = useState<number>(
    editingItem ? editingItem.question.level.id : 1
  );
  const [typeId, setTypeId] = useState<number>(
    editingItem ? editingItem.question.type.id : 1
  );
  const [questionText, setQuestionText] = useState(
    editingItem ? editingItem.question.question : ""
  );
  const [contentText, setContentText] = useState(
    editingItem ? editingItem.question.content : "A. \nB. \nC. \nD. "
  );
  const [answerText, setAnswerText] = useState(
    editingItem ? editingItem.question.answer : ""
  );
  const [solutionGuide, setSolutionGuide] = useState(
    editingItem ? editingItem.question.solution_guide : ""
  );
  const [authorName, setAuthorName] = useState(
    editingItem ? editingItem.author.name : "Tran Tan Phuoc"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleTypeChange = (newTypeId: number) => {
    setTypeId(newTypeId);
    if (!editingItem && (!contentText || contentText.startsWith("A.") || contentText.startsWith("a)"))) {
      if (newTypeId === 1) {
        setContentText("A. \nB. \nC. \nD. ");
      } else if (newTypeId === 2) {
        setContentText("a) \nb) \nc) \nd) ");
      } else {
        setContentText("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setErrorMessage("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const selectedLevel: QuestionLevel =
      QUESTION_LEVELS.find((l) => l.id === levelId) || QUESTION_LEVELS[0];
    const selectedType: QuestionType =
      QUESTION_TYPES.find((t) => t.id === typeId) || QUESTION_TYPES[0];

    const now = formatDateTime();

    if (editingItem) {
      const updated: ExamItem = {
        ...editingItem,
        author: {
          ...editingItem.author,
          name: authorName.trim() || "Tran Tan Phuoc",
          update_at: now,
        },
        question: {
          content: contentText,
          question: questionText,
          solution_guide: solutionGuide,
          answer: answerText,
          level: selectedLevel,
          type: selectedType,
        },
      };
      onSave(updated);
    } else {
      const newItem: ExamItem = {
        id: `q-${Date.now()}`,
        author: {
          id: 1,
          name: authorName.trim() || "Tran Tan Phuoc",
          created_at: now,
          update_at: now,
        },
        question: {
          content: contentText,
          question: questionText,
          solution_guide: solutionGuide,
          answer: answerText,
          level: selectedLevel,
          type: selectedType,
        },
      };
      onSave(newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 safe-padding-top safe-padding-bottom">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90dvh] sm:max-h-[85dvh] my-auto">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {editingItem ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới vào ngân hàng"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {editingItem
                ? `Đang chỉnh sửa câu hỏi mã #${editingItem.id}`
                : "Điền đầy đủ thông tin để lưu trữ vào kho dữ liệu"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Level and Type Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mức độ nhận thức <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUESTION_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevelId(lvl.id)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      levelId === lvl.id
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold ring-2 ring-indigo-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold text-xs">{lvl.short_name}</div>
                    <div className="text-[11px] truncate text-slate-500">{lvl.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Định dạng câu hỏi <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUESTION_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTypeChange(t.id)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      typeId === t.id
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold ring-2 ring-indigo-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold text-xs">{t.short_name}</div>
                    <div className="text-[11px] truncate text-slate-500">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nội dung câu hỏi (`question`) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="VD: Cho hàm số y = f(x) có đồ thị như hình vẽ bên. Mệnh đề nào dưới đây đúng?..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
              required
            />
          </div>

          {/* Content / Choices */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nội dung bổ sung / Các phương án lựa chọn (`content`)
              </label>
              <span className="text-[11px] text-slate-400">
                {typeId === 1 && "Nhập A. B. C. D. mỗi phương án 1 dòng"}
                {typeId === 2 && "Nhập a) b) c) d) mỗi mệnh đề 1 dòng"}
              </span>
            </div>
            <textarea
              rows={4}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder={
                typeId === 1
                  ? "A. Phương án 1\nB. Phương án 2\nC. Phương án 3\nD. Phương án 4"
                  : "Nội dung dẫn dắt hoặc chi tiết các mệnh đề..."
              }
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          {/* Answer and Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Đáp án chuẩn (`answer`)
              </label>
              <input
                type="text"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="VD: A hoặc a) Đúng | b) Sai..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tác giả / Giáo viên (`author.name`)
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Tran Tan Phuoc"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Solution Guide */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hướng dẫn giải / Lời giải chi tiết (`solution_guide`)
            </label>
            <textarea
              rows={4}
              value={solutionGuide}
              onChange={(e) => setSolutionGuide(e.target.value)}
              placeholder="Giải thích các bước giải, công thức áp dụng, lập luận..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans text-xs"
            />
          </div>

          </div>

          {/* Modal Footer - Fixed at bottom */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 flex items-center justify-end gap-2 sm:gap-3 bg-slate-50/90 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingItem ? "Lưu thay đổi" : "Thêm câu hỏi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
}: QuestionModalProps) {
  if (!isOpen) return null;

  return (
    <QuestionModalForm
      key={editingItem ? `edit-${editingItem.id}` : "new"}
      onClose={onClose}
      onSave={onSave}
      editingItem={editingItem}
    />
  );
}
