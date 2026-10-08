"use client";

import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
  FileUp,
  ArrowLeft,
  Info,
  BookOpen,
} from "lucide-react";
import {
  SUBJECTS,
  GRADES,
  ExamItem,
  LevelShortName,
} from "@/types/question";
import {
  ParsedQuestionCandidate,
  downloadSampleExcelTemplate,
  downloadSampleWordTemplate,
  parseExcelFile,
  parseWordFile,
  convertCandidateToExamItem,
} from "@/utils/questionImportExport";
import CustomSelect from "./CustomSelect";

interface ImportQuestionSectionProps {
  defaultSubjectId?: string;
  defaultGradeId?: number;
  onSaveBulk: (items: ExamItem[]) => void;
  onCloseModal: () => void;
  // External control to reset staging list when modal closes
  stagingCandidates: ParsedQuestionCandidate[];
  setStagingCandidates: React.Dispatch<React.SetStateAction<ParsedQuestionCandidate[]>>;
}

export default function ImportQuestionSection({
  defaultSubjectId = "TOAN",
  defaultGradeId = 12,
  onSaveBulk,
  onCloseModal,
  stagingCandidates,
  setStagingCandidates,
}: ImportQuestionSectionProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubjectId);
  const [selectedGradeId, setSelectedGradeId] = useState<number>(defaultGradeId);

  // File loading state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string>("");

  // Checkbox selections for staging verification list
  const [selectedTempIds, setSelectedTempIds] = useState<Set<string>>(new Set());

  // Editing single item in verification list
  const [editingTempId, setEditingTempId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ParsedQuestionCandidate>>({});

  // Expandable solution guide toggles
  const [expandedSolutions, setExpandedSolutions] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle selection for a single question
  const toggleSelect = (tempId: string) => {
    setSelectedTempIds((prev) => {
      const next = new Set(prev);
      if (next.has(tempId)) {
        next.delete(tempId);
      } else {
        next.add(tempId);
      }
      return next;
    });
  };

  // Select all or deselect all
  const toggleSelectAll = () => {
    if (selectedTempIds.size === stagingCandidates.length) {
      setSelectedTempIds(new Set());
    } else {
      setSelectedTempIds(new Set(stagingCandidates.map((c) => c.tempId)));
    }
  };

  // Toggle solution visibility
  const toggleSolution = (tempId: string) => {
    setExpandedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(tempId)) {
        next.delete(tempId);
      } else {
        next.add(tempId);
      }
      return next;
    });
  };

  // Handle file input upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    // Reset input value so same file can be re-uploaded if desired
    e.target.value = "";
  };

  // Process chosen file (Excel or Word)
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const fileName = file.name.toLowerCase();
    try {
      let parsed: ParsedQuestionCandidate[] = [];

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        parsed = await parseExcelFile(file, selectedSubjectId, selectedGradeId);
      } else if (fileName.endsWith(".docx")) {
        parsed = await parseWordFile(file, selectedSubjectId, selectedGradeId);
      } else {
        throw new Error(
          "Định dạng file không được hỗ trợ! Vui lòng chọn file Excel (.xlsx, .xls) hoặc file Word (.docx)."
        );
      }

      if (parsed.length === 0) {
        throw new Error("Không tìm thấy câu hỏi hợp lệ nào trong file đã chọn!");
      }

      setLoadedFileName(file.name);
      setStagingCandidates(parsed);
      // Pre-select all valid questions by default so user can review & confirm easily
      setSelectedTempIds(new Set(parsed.map((c) => c.tempId)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi đọc file!";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm selected questions to Question Bank
  const handleConfirmSelected = () => {
    const selectedList = stagingCandidates.filter((c) => selectedTempIds.has(c.tempId));
    if (selectedList.length === 0) return;

    // Retrieve current user info from localStorage if available
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

    // Convert candidates into full ExamItem records
    const newExamItems: ExamItem[] = selectedList.map((cand) =>
      convertCandidateToExamItem(cand, currentUserName, currentUserId)
    );

    // Push into bank
    onSaveBulk(newExamItems);

    // Remove confirmed questions from staging verification list
    const remainingCandidates = stagingCandidates.filter((c) => !selectedTempIds.has(c.tempId));
    setStagingCandidates(remainingCandidates);
    setSelectedTempIds(new Set());

    // If no questions remain, close modal
    if (remainingCandidates.length === 0) {
      onCloseModal();
    }
  };

  // Delete a single item from staging list
  const handleDeleteStagingItem = (tempId: string) => {
    setStagingCandidates((prev) => prev.filter((c) => c.tempId !== tempId));
    setSelectedTempIds((prev) => {
      const next = new Set(prev);
      next.delete(tempId);
      return next;
    });
  };

  // Start inline editing
  const handleStartEdit = (cand: ParsedQuestionCandidate) => {
    setEditingTempId(cand.tempId);
    setEditForm({ ...cand });
  };

  // Save inline editing
  const handleSaveEdit = (tempId: string) => {
    setStagingCandidates((prev) =>
      prev.map((c) => {
        if (c.tempId === tempId) {
          return {
            ...c,
            ...editForm,
            lesson: (editForm.lesson !== undefined ? editForm.lesson : c.lesson)?.trim() || undefined,
            question: (editForm.question || c.question).trim(),
            content: (editForm.content || c.content).trim(),
            answer: (editForm.answer || c.answer).trim(),
            solution_guide: (editForm.solution_guide || c.solution_guide).trim(),
          } as ParsedQuestionCandidate;
        }
        return c;
      })
    );
    setEditingTempId(null);
    setEditForm({});
  };

  // Reset staging state to upload a new file
  const handleResetStaging = () => {
    setStagingCandidates([]);
    setSelectedTempIds(new Set());
    setLoadedFileName("");
    setErrorMessage(null);
  };

  // ==========================================
  // VIEW 1: UPLOAD & TEMPLATE DOWNLOAD VIEW
  // ==========================================
  if (stagingCandidates.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-white dark:bg-slate-900 transition-colors">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <span className="font-bold">Lỗi xử lý file:</span> {errorMessage}
            </div>
          </div>
        )}

        {/* 1. Download Sample Templates Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-800/80 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Tải file mẫu để nhập câu hỏi chính xác
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vui lòng tải file mẫu bên dưới để xem đúng cấu trúc và cú pháp trước khi nhập liệu:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Excel Template Button */}
            <button
              type="button"
              onClick={downloadSampleExcelTemplate}
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/90 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl shadow-2xs transition-all text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 truncate">
                  File mẫu Excel (.xlsx)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Định dạng bảng cột STT, câu hỏi, đáp án
                </p>
              </div>
            </button>

            {/* Word Template Button */}
            <button
              type="button"
              onClick={downloadSampleWordTemplate}
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/90 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl shadow-2xs transition-all text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-800 dark:group-hover:text-blue-300 truncate">
                  File mẫu Word (.docx)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Mẫu đề thi chuẩn Câu 1:, A. B. C. D.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Default Subject & Grade Settings */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Môn học & Khối lớp mặc định khi nhập
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nếu câu hỏi trong file không ghi rõ môn hoặc khối, hệ thống sẽ tự động gán theo thông tin dưới đây:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Môn học mặc định
              </label>
              <CustomSelect
                value={selectedSubjectId}
                onChange={(val) => setSelectedSubjectId(String(val))}
                options={SUBJECTS.map((sub) => ({ value: sub.id, label: sub.name }))}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                Khối lớp mặc định
              </label>
              <CustomSelect
                value={selectedGradeId}
                onChange={(val) => setSelectedGradeId(Number(val))}
                options={GRADES.map((gr) => ({ value: gr.id, label: gr.name }))}
              />
            </div>
          </div>
        </div>

        {/* 3. File Upload Dropzone */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .docx"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files?.[0];
              if (droppedFile) await processFile(droppedFile);
            }}
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              {isProcessing ? (
                <div className="w-8 h-8 border-3 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {isProcessing
                  ? "Đang phân tích dữ liệu câu hỏi trong file..."
                  : "Kéo thả file vào đây hoặc bấm để chọn file"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hỗ trợ định dạng Microsoft Excel (<strong>.xlsx, .xls</strong>) và Microsoft Word (<strong>.docx</strong>)
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-2xs group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all pointer-events-none"
            >
              <FileUp className="w-4 h-4" />
              <span>Duyệt file từ máy tính</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: STAGING VERIFICATION LIST VIEW
  // (Khoan hãy đưa vào Ngân hàng, hiển thị danh sách kiểm tra lại 1 loạt)
  // ==========================================
  const allSelected = selectedTempIds.size === stagingCandidates.length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0 bg-white dark:bg-slate-900 transition-colors">
      {/* Verification Header Notification Bar */}
      <div className="p-3.5 sm:p-4 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-slate-800 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-100 flex items-center gap-2">
              Kiểm tra dữ liệu câu hỏi ({stagingCandidates.length} câu đã tìm thấy)
            </h3>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
              Từ file: <span className="font-semibold">{loadedFileName}</span>. Tích chọn các câu hỏi chính xác để thêm vào Ngân hàng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleResetStaging}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Chọn file khác</span>
          </button>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 text-xs">
        <button
          type="button"
          onClick={toggleSelectAll}
          className="inline-flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer select-none"
        >
          {allSelected ? (
            <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          )}
          <span>{allSelected ? "Bỏ chọn tất cả" : `Chọn tất cả (${stagingCandidates.length} câu)`}</span>
        </button>

        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/60 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800">
          Đã chọn: {selectedTempIds.size} / {stagingCandidates.length} câu
        </span>
      </div>

      {/* Staging Question Items Scrollable List */}
      <div className="p-3 sm:p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-950/50">
        {stagingCandidates.map((cand, idx) => {
          const isSelected = selectedTempIds.has(cand.tempId);
          const isEditing = editingTempId === cand.tempId;
          const isExpandedSol = expandedSolutions.has(cand.tempId);

          const subjectObj = SUBJECTS.find((s) => s.id === cand.subjectId);
          const gradeObj = GRADES.find((g) => g.id === cand.gradeId);

          return (
            <div
              key={cand.tempId}
              className={`rounded-xl border transition-all overflow-hidden ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-700 shadow-sm ring-1 ring-indigo-500/20 dark:ring-indigo-500/30"
                  : "bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Question Header & Checkbox */}
              <div className="p-3 sm:p-3.5 flex items-start gap-3">
                {/* Combox / Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleSelect(cand.tempId)}
                  className="mt-0.5 p-0.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer shrink-0"
                  title={isSelected ? "Bỏ chọn câu này" : "Chọn câu này để nhập"}
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-50 dark:fill-indigo-950" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>

                {/* Question Info & Badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-black rounded-md">
                      #{idx + 1}
                    </span>

                    {/* Level Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        cand.levelShort === "NB"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : cand.levelShort === "TH"
                          ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                          : cand.levelShort === "VD"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          : "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300"
                      }`}
                    >
                      {cand.levelShort}
                    </span>

                    {/* Type Badge */}
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                      {cand.typeShort}
                    </span>

                    {/* Subject & Grade */}
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md">
                      {subjectObj?.name || cand.subjectId} - {gradeObj?.name || `K${cand.gradeId}`}
                    </span>

                    {/* Lesson (if any) */}
                    {cand.lesson && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {cand.lesson}
                      </span>
                    )}

                    {/* Warnings (if any) */}
                    {cand.warnings.map((w, wIdx) => (
                      <span
                        key={wIdx}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-md border border-rose-200 dark:border-rose-800"
                      >
                        ⚠️ {w}
                      </span>
                    ))}
                  </div>

                  {/* Inline Edit Mode */}
                  {isEditing ? (
                    <div className="space-y-2.5 mt-2 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Bài học SGK (Lesson):
                        </label>
                        <input
                          type="text"
                          value={editForm.lesson ?? cand.lesson ?? ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, lesson: e.target.value }))
                          }
                          placeholder="Ví dụ: Bài 1. Sự đồng biến, nghịch biến của hàm số"
                          className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Lệnh hỏi / Tiêu đề:
                        </label>
                        <textarea
                          rows={2}
                          value={editForm.question ?? cand.question}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, question: e.target.value }))
                          }
                          className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Các phương án (A. ... B. ...):
                        </label>
                        <textarea
                          rows={3}
                          value={editForm.content ?? cand.content}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, content: e.target.value }))
                          }
                          className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                            Đáp án:
                          </label>
                          <input
                            type="text"
                            value={editForm.answer ?? cand.answer}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, answer: e.target.value }))
                            }
                            className="w-full p-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-bold text-indigo-700 dark:text-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                            Mức độ:
                          </label>
                          <CustomSelect
                            value={editForm.levelShort ?? cand.levelShort}
                            onChange={(val) =>
                              setEditForm((prev) => ({
                                ...prev,
                                levelShort: val as LevelShortName,
                              }))
                            }
                            options={[
                              { value: "NB", label: "Nhận Biết (NB)" },
                              { value: "TH", label: "Thông Hiểu (TH)" },
                              { value: "VD", label: "Vận Dụng (VD)" },
                              { value: "VDC", label: "Vận Dụng Cao (VDC)" },
                            ]}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingTempId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cand.tempId)}
                          className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded cursor-pointer"
                        >
                          Lưu chỉnh sửa
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="space-y-1.5 mt-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {cand.question}
                      </p>

                      {/* Options / Content */}
                      {cand.content && (
                        <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 whitespace-pre-line font-mono text-[11px] sm:text-xs">
                          {cand.content}
                        </div>
                      )}

                      {/* Answer & Solution Bar */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {cand.answer ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-md">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Đáp án: {cand.answer}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                            Chưa có đáp án
                          </span>
                        )}

                        {cand.solution_guide && (
                          <button
                            type="button"
                            onClick={() => toggleSolution(cand.tempId)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium cursor-pointer"
                          >
                            <span>Lời giải</span>
                            {isExpandedSol ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded Solution Guide */}
                      {isExpandedSol && cand.solution_guide && (
                        <div className="mt-1.5 p-2.5 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                          <p className="font-bold text-[11px] text-amber-900 dark:text-amber-300 uppercase mb-0.5">
                            Hướng dẫn giải:
                          </p>
                          <p className="whitespace-pre-line text-[11px] text-slate-800 dark:text-slate-200">
                            {cand.solution_guide}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action Icons: Quick Edit & Delete */}
                {!isEditing && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cand)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa câu hỏi này"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStagingItem(cand.tempId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Xóa khỏi danh sách kiểm tra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Footer Confirmation Bar */}
      <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/95 shrink-0">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Đang chọn: <span className="font-bold text-indigo-700 dark:text-indigo-400">{selectedTempIds.size}</span> /{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-200">{stagingCandidates.length}</span> câu hỏi
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCloseModal}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={selectedTempIds.size === 0}
            onClick={handleConfirmSelected}
            className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white rounded-lg transition-all cursor-pointer shadow-sm ${
              selectedTempIds.size > 0
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-950 active:scale-98"
                : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed shadow-none"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận thêm ({selectedTempIds.size}) câu vào Ngân hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
