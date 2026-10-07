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
import { X, Check, AlertCircle, PenLine, FileSpreadsheet } from "lucide-react";
import ImportQuestionSection from "./ImportQuestionSection";
import CustomSelect from "./CustomSelect";
import { ParsedQuestionCandidate } from "@/utils/questionImportExport";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExamItem) => void;
  onSaveBulk?: (items: ExamItem[]) => void;
  editingItem: ExamItem | null;
  initialTab?: "manual" | "import";
  defaultSubjectId?: string;
  defaultGradeId?: number;
}

function QuestionModalForm({
  onClose,
  onSave,
  onSaveBulk,
  editingItem,
  initialTab = "manual",
  defaultSubjectId = "TOAN",
  defaultGradeId = 12,
}: {
  onClose: () => void;
  onSave: (item: ExamItem) => void;
  onSaveBulk?: (items: ExamItem[]) => void;
  editingItem: ExamItem | null;
  initialTab?: "manual" | "import";
  defaultSubjectId?: string;
  defaultGradeId?: number;
}) {
  // Tab state: "manual" (Thêm thủ công) or "import" (Nhập từ Excel / Word)
  const [activeTab, setActiveTab] = useState<"manual" | "import">(
    editingItem ? "manual" : initialTab
  );

  // Staging candidates list for import verification step
  const [stagingCandidates, setStagingCandidates] = useState<ParsedQuestionCandidate[]>([]);

  // Manual Form States
  const [subjectId, setSubjectId] = useState<string>(
    editingItem?.question.subject?.id || defaultSubjectId
  );
  const [gradeId, setGradeId] = useState<number>(
    editingItem?.question.grade?.id || defaultGradeId
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

  // Clean exit: Thoát ra và xoá hết list câu hỏi kiểm tra
  const handleDialogExit = () => {
    setStagingCandidates([]);
    onClose();
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!questionText.trim()) {
      setErrorMessage("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const selectedSubject = SUBJECTS.find((s) => s.id === subjectId) || {
      id: subjectId,
      name: "Toán học",
    };
    const selectedGrade = GRADES.find((g) => g.id === gradeId) || {
      id: gradeId,
      name: `Khối ${gradeId}`,
    };
    const selectedLevel = QUESTION_LEVELS.find((l) => l.short_name === levelShort) || QUESTION_LEVELS[0];
    const selectedType = QUESTION_TYPES.find((t) => t.short_name === typeShort) || QUESTION_TYPES[0];

    // Lấy thông tin tác giả từ localStorage
    let currentUserId = "teacher-current";
    let currentUserName = "Giáo viên";
    try {
      const stored = localStorage.getItem("tron_de_auth_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.id) currentUserId = u.id;
        if (u.name) currentUserName = u.name;
      }
    } catch {
      // Storage error
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()}`;

    if (editingItem) {
      const updatedItem: ExamItem = {
        ...editingItem,
        author: {
          ...editingItem.author,
          update_at: formattedDate,
        },
        question: {
          ...editingItem.question,
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
      let isDuplicate = false;
      try {
        const raw = localStorage.getItem("tron_de_exam_questions");
        if (raw) {
          const list: ExamItem[] = JSON.parse(raw);
          isDuplicate = list.some(
            (item) =>
              item.question.question.trim().toLowerCase() ===
              questionText.trim().toLowerCase()
          );
        }
      } catch {
        // Storage error
      }

      if (isDuplicate) {
        setErrorMessage("Câu hỏi này đã tồn tại trong Ngân hàng câu hỏi! Vui lòng kiểm tra lại.");
        return;
      }

      const newItem: ExamItem = {
        id: `q-${Date.now()}`,
        author: {
          id: Number(currentUserId) || 1,
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
    handleDialogExit();
  };

  const handleBulkSave = (items: ExamItem[]) => {
    if (onSaveBulk) {
      onSaveBulk(items);
    } else {
      items.forEach((item) => onSave(item));
    }
  };

  const isWideLayout = activeTab === "import" && stagingCandidates.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 safe-padding-top safe-padding-bottom">
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[94dvh] sm:max-h-[88dvh] my-auto transition-all ${
          isWideLayout ? "max-w-4xl lg:max-w-5xl" : "max-w-2xl"
        }`}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/95 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 pr-2">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {editingItem
                  ? "Chỉnh sửa câu hỏi"
                  : activeTab === "import"
                  ? "Nhập câu hỏi từ Excel & Word"
                  : "Thêm câu hỏi mới vào ngân hàng"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {editingItem
                  ? `Đang chỉnh sửa câu hỏi #${editingItem.id}`
                  : activeTab === "import"
                  ? "Hỗ trợ file Excel (.xlsx) và file Word (.docx) với mẫu chuẩn"
                  : "Điền đầy đủ thông tin để lưu trữ vào kho dữ liệu"}
              </p>
            </div>

            {/* Dấu X trên dialog: Thoát ra và xoá hết list câu hỏi kiểm tra */}
            <button
              onClick={handleDialogExit}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Đóng và hủy danh sách kiểm tra"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation for New Questions: Thêm thủ công & Nhập từ Excel/Word */}
          {!editingItem && (
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "manual"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"
                }`}
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Thêm thủ công</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("import")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "import"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Nhập từ Excel / Word</span>
                {stagingCandidates.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 rounded-full font-black">
                    {stagingCandidates.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        {activeTab === "import" && !editingItem ? (
          <ImportQuestionSection
            defaultSubjectId={defaultSubjectId}
            defaultGradeId={defaultGradeId}
            onSaveBulk={handleBulkSave}
            onCloseModal={handleDialogExit}
            stagingCandidates={stagingCandidates}
            setStagingCandidates={setStagingCandidates}
          />
        ) : (
          /* MANUAL FORM (Thêm thủ công từng câu hỏi) */
          <form onSubmit={handleSubmitManual} className="flex flex-col flex-1 overflow-hidden min-h-0 text-slate-900 dark:text-slate-100">
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Subject and Grade Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Môn học <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    value={subjectId}
                    onChange={(val) => setSubjectId(String(val))}
                    options={SUBJECTS.map((sub) => ({ value: sub.id, label: sub.name }))}
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Khối lớp <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    value={gradeId}
                    onChange={(val) => setGradeId(Number(val))}
                    options={GRADES.map((gr) => ({ value: gr.id, label: gr.name }))}
                  />
                </div>
              </div>

              {/* Level and Type Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                              ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs ring-1 ring-indigo-600/30 dark:ring-indigo-400/40 font-bold"
                              : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                              ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs ring-1 ring-indigo-600/30 dark:ring-indigo-400/40 font-bold"
                              : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tiêu đề / Lệnh hỏi (Question) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ví dụ: Cho hàm số y = f(x) có bảng biến thiên... Tìm số điểm cực trị?"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400 font-sans"
                />
              </div>

              {/* Content / Options */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Nội dung chi tiết & Các phương án lựa chọn (Content)
                  </label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
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
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400 font-sans"
                />
              </div>

              {/* Answer key */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Đáp án chuẩn (Answer)
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Ví dụ: A (hoặc Đúng, Sai, 42, ...)"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400 font-semibold text-indigo-700 dark:text-indigo-400"
                />
              </div>

              {/* Solution guide */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Hướng dẫn giải chi tiết (Solution Guide)
                </label>
                <textarea
                  rows={3}
                  value={solutionGuide}
                  onChange={(e) => setSolutionGuide(e.target.value)}
                  placeholder="Giải thích các bước giải, công thức áp dụng, lập luận..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400 font-sans"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-900/95 shrink-0">
              <button
                type="button"
                onClick={handleDialogExit}
                className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingItem ? "Lưu thay đổi" : "Thêm câu hỏi"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  onSaveBulk,
  editingItem,
  initialTab = "manual",
  defaultSubjectId = "TOAN",
  defaultGradeId = 12,
}: QuestionModalProps) {
  if (!isOpen) return null;

  return (
    <QuestionModalForm
      key={editingItem ? `edit-${editingItem.id}` : `new-${initialTab}`}
      onClose={onClose}
      onSave={onSave}
      onSaveBulk={onSaveBulk}
      editingItem={editingItem}
      initialTab={initialTab}
      defaultSubjectId={defaultSubjectId}
      defaultGradeId={defaultGradeId}
    />
  );
}
