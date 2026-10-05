"use client";

import React, { useState } from "react";
import {
  ExamItem,
  QUESTION_LEVELS,
  QUESTION_TYPES,
  SUBJECTS,
  GRADES,
  LevelShortName,
  TypeShortName,
} from "@/types/question";
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
  const [subjectId, setSubjectId] = useState<string>(
    editingItem?.question.subject?.id || "TOAN"
  );
  const [gradeId, setGradeId] = useState<number>(
    editingItem?.question.grade?.id || 12
  );
  const [levelShort, setLevelShort] = useState<LevelShortName>(
    (editingItem?.question.level.short_name as LevelShortName) || "NB"
  );
  const [typeShort, setTypeShort] = useState<TypeShortName>(
    (editingItem?.question.type.short_name as TypeShortName) || "TN"
  );
  const [questionText, setQuestionText] = useState(
    editingItem?.question.question || ""
  );
  const [content, setContent] = useState(editingItem?.question.content || "");
  const [answer, setAnswer] = useState(editingItem?.question.answer || "");
  const [solutionGuide, setSolutionGuide] = useState(
    editingItem?.question.solution_guide || ""
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      setErrorMessage("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const selectedLevel = QUESTION_LEVELS.find((l) => l.short_name === levelShort);
    const selectedType = QUESTION_TYPES.find((t) => t.short_name === typeShort);
    const selectedSubject = SUBJECTS.find((s) => s.id === subjectId) || {
      id: subjectId,
      name: "Toán học",
    };
    const selectedGrade = GRADES.find((g) => g.id === gradeId) || {
      id: gradeId,
      name: `Khối ${gradeId}`,
    };

    if (!selectedLevel || !selectedType) {
      setErrorMessage("Mức độ hoặc định dạng câu hỏi không hợp lệ!");
      return;
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    if (editingItem) {
      const updatedItem: ExamItem = {
        ...editingItem,
        author: {
          ...editingItem.author,
          update_at: formattedDate,
        },
        question: {
          question: questionText.trim(),
          content: content.trim(),
          answer: answer.trim(),
          solution_guide: solutionGuide.trim(),
          level: selectedLevel,
          type: selectedType,
          subject: selectedSubject,
          grade: selectedGrade,
        },
      };
      onSave(updatedItem);
    } else {
      let currentUserName = "Tran Tan Phuoc";
      let currentUserId = 1;
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("tron_de_auth_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.name) currentUserName = parsed.name;
            if (parsed.id) currentUserId = parsed.id;
          }
        } catch {
          // ignore
        }
      }

      const newItem: ExamItem = {
        id: `q-${Date.now()}`,
        author: {
          id: currentUserId,
          name: currentUserName,
          created_at: formattedDate,
          update_at: formattedDate,
        },
        question: {
          question: questionText.trim(),
          content: content.trim(),
          answer: answer.trim(),
          solution_guide: solutionGuide.trim(),
          level: selectedLevel,
          type: selectedType,
          subject: selectedSubject,
          grade: selectedGrade,
        },
      };
      onSave(newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 safe-padding-top safe-padding-bottom">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92dvh] sm:max-h-[85dvh] my-auto">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate">
              {editingItem ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới vào ngân hàng"}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
              {editingItem
                ? `Đang chỉnh sửa câu hỏi #${editingItem.id}`
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

            {/* Subject and Grade Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Môn học <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                >
                  {SUBJECTS.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Khối lớp <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gradeId}
                  onChange={(e) => setGradeId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                >
                  {GRADES.map((gr) => (
                    <option key={gr.id} value={gr.id}>
                      {gr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Level and Type Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mức độ nhận thức <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUESTION_LEVELS.map((lvl) => {
                    const isSelected = levelShort === lvl.short_name;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setLevelShort(lvl.short_name as LevelShortName)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs ring-1 ring-indigo-600/30 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lvl.name} ({lvl.short_name})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Định dạng câu hỏi <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUESTION_TYPES.map((t) => {
                    const isSelected = typeShort === t.short_name;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTypeShort(t.short_name as TypeShortName)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs ring-1 ring-indigo-600/30 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {t.name} ({t.short_name})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Question title / prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tiêu đề / Lệnh hỏi (Question) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ví dụ: Cho hàm số y = f(x) có bảng biến thiên... Tìm số điểm cực trị?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Content / Options */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nội dung chi tiết & Các phương án lựa chọn (Content)
                </label>
                <span className="text-[10px] text-slate-400">
                  {typeShort === "TN" ? "Định dạng A. ... B. ... C. ... D. ..." : "Tự do"}
                </span>
              </div>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  typeShort === "TN"
                    ? "A. 1\nB. 2\nC. 3\nD. 4"
                    : "Nhập nội dung đề bài bổ sung, biểu thức toán học hoặc các mệnh đề đúng/sai..."
                }
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Answer key */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Đáp án chuẩn (Answer)
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Ví dụ: A (hoặc Đúng, Sai, 42, ...)"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-indigo-700"
              />
            </div>

            {/* Solution guide */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hướng dẫn giải chi tiết (Solution Guide)
              </label>
              <textarea
                rows={3}
                value={solutionGuide}
                onChange={(e) => setSolutionGuide(e.target.value)}
                placeholder="Giải thích các bước giải, công thức áp dụng, lập luận..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          {/* Modal Footer - Fixed at bottom */}
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 flex items-center justify-end gap-2 sm:gap-3 bg-slate-50 shrink-0">
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
