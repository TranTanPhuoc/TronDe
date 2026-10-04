"use client";

import React, { useState, useMemo, useSyncExternalStore, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExamItem,
  QUESTION_LEVELS,
  QUESTION_TYPES,
} from "@/types/question";
import { initialQuestions } from "@/data/mockQuestions";
import { shuffleArray, getLevelBadge, getTypeBadge } from "@/utils/helpers";
import QuestionModal from "@/components/QuestionModal";
import QuestionDetailModal from "@/components/QuestionDetailModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import {
  Shuffle,
  Plus,
  Upload,
  Download,
  RotateCcw,
  Printer,
  Copy,
  CheckCircle2,
  FileText,
  TableProperties,
  BookOpen,
  Layers,
  Settings2,
  Search,
  Eye,
  Pencil,
  Trash2,
  Sparkles,
  Check,
  LogOut,
  UserCheck,
} from "lucide-react";

const STORAGE_KEY = "phan_mem_tron_de_questions_v1";
const emptySubscribe = () => () => {};

interface ShuffledQuestion {
  originalIndex: number;
  questionText: string;
  contentText: string;
  answer: string;
  level: string;
  type: string;
  solutionGuide: string;
}

interface ExamVariant {
  code: string;
  questions: ShuffledQuestion[];
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  school: string;
  role: string;
  avatar: string;
}

export default function Home() {
  const router = useRouter();
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Auth state
  const [currentUser] = useState<CurrentUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tron_de_auth_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Verify authentication on mount
  useEffect(() => {
    if (!currentUser && isLoaded) {
      router.replace("/login");
    }
  }, [currentUser, isLoaded, router]);

  // Question Bank State
  const [questions, setQuestions] = useState<ExamItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, idx) => ({
              ...item,
              id: item.id || `q-${idx + 1}-${Date.now()}`,
            }));
          }
        }
      } catch {
        // Fallback
      }
    }
    return initialQuestions;
  });

  // Selected question IDs for shuffling
  const [activeQuestionIds, setActiveQuestionIds] = useState<string[]>(() =>
    initialQuestions.map((q) => q.id)
  );

  // Exam Configuration State
  const [schoolName, setSchoolName] = useState("TRƯỜNG THPT CHUYÊN");
  const [examTitle, setExamTitle] = useState("KIỂM TRA CHẤT LƯỢNG ĐỊNH KỲ");
  const [subjectName, setSubjectName] = useState("MÔN: TOÁN HỌC");
  const [duration, setDuration] = useState("45");
  const [numVariants, setNumVariants] = useState<number>(4);
  const [shuffleChoices, setShuffleChoices] = useState<boolean>(true);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"exam" | "matrix" | "solution" | "bank">(
    "exam"
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  // Generated Exam Variants State
  const [generatedExams, setGeneratedExams] = useState<ExamVariant[]>(() => {
    const baseCodes = [101, 102, 103, 104];
    return baseCodes.map((code) => ({
      code: `${code}`,
      questions: initialQuestions.map((q, idx) => ({
        originalIndex: idx + 1,
        questionText: q.question.question,
        contentText: q.question.content,
        answer: q.question.answer,
        level: q.question.level.short_name,
        type: q.question.type.name,
        solutionGuide: q.question.solution_guide,
      })),
    }));
  });

  // Search & Filter in Bank Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExamItem | null>(null);
  const [detailItem, setDetailItem] = useState<ExamItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ExamItem | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Toast & Copy status
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedMatrix, setCopiedMatrix] = useState(false);
  const [copiedExam, setCopiedExam] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    if (confirm("Thầy/Cô có chắc chắn muốn đăng xuất khỏi hệ thống không?")) {
      localStorage.removeItem("tron_de_auth_user");
      router.replace("/login");
    }
  };

  const saveQuestions = (newQuestions: ExamItem[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuestions));
    } catch {
      // Storage error
    }
  };

  // Helper to scramble options for multiple choice questions
  const shuffleOptionsForQuestion = (
    content: string,
    correctAnswer: string
  ): { content: string; answer: string } => {
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    const optionRegex = /^([A-D])[\.\:\s](.*)$/i;
    const isStandardOptions =
      lines.length >= 2 && lines.every((line) => optionRegex.test(line.trim()));

    if (!isStandardOptions || !shuffleChoices) {
      return { content, answer: correctAnswer };
    }

    const parsedOptions = lines.map((l) => {
      const match = l.trim().match(optionRegex);
      return {
        originalLetter: match ? match[1].toUpperCase() : "",
        text: match ? match[2].trim() : l,
      };
    });

    const shuffled = shuffleArray(parsedOptions);
    const letters = ["A", "B", "C", "D", "E", "F"];
    const oldAnswerTrimmed = correctAnswer.trim().toUpperCase();
    let newAnswer = correctAnswer;

    const newLines = shuffled.map((item, idx) => {
      const newLetter = letters[idx];
      if (item.originalLetter === oldAnswerTrimmed) {
        newAnswer = newLetter;
      }
      return `${newLetter}. ${item.text}`;
    });

    return {
      content: newLines.join("\n"),
      answer: newAnswer,
    };
  };

  // Shuffling logic
  const handleShuffleExams = () => {
    const targetPool = questions.filter((q) =>
      activeQuestionIds.length > 0 ? activeQuestionIds.includes(q.id) : true
    );

    if (targetPool.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 câu hỏi để trộn đề!");
      return;
    }

    const variants: ExamVariant[] = [];
    const baseCodes = [101, 102, 103, 104, 105, 106, 107, 108];

    for (let i = 0; i < numVariants; i++) {
      const code = baseCodes[i] ? `${baseCodes[i]}` : `${100 + i + 1}`;
      const shuffledList = shuffleArray(targetPool).map((q) => {
        const { content, answer } = shuffleOptionsForQuestion(
          q.question.content,
          q.question.answer
        );

        return {
          originalIndex: questions.findIndex((orig) => orig.id === q.id) + 1,
          questionText: q.question.question,
          contentText: content,
          answer: answer,
          level: q.question.level.short_name,
          type: q.question.type.name,
          solutionGuide: q.question.solution_guide,
        };
      });

      variants.push({
        code,
        questions: shuffledList,
      });
    }

    setGeneratedExams(variants);
    setSelectedVariantIndex(0);
    showToast(`Đã tạo thành công ${numVariants} mã đề thi mới!`);
  };

  // Copy matrix to clipboard
  const handleCopyMatrix = () => {
    if (generatedExams.length === 0) return;
    let text = `BẢNG ĐÁP ÁN CÁC MÃ ĐỀ (${examTitle})\n`;
    text += `Câu\t` + generatedExams.map((v) => `Mã ${v.code}`).join("\t") + "\n";

    const maxQuestions = generatedExams[0]?.questions.length || 0;
    for (let i = 0; i < maxQuestions; i++) {
      text += `Câu ${i + 1}\t`;
      text += generatedExams.map((v) => v.questions[i]?.answer || "-").join("\t");
      text += "\n";
    }

    navigator.clipboard.writeText(text);
    setCopiedMatrix(true);
    setTimeout(() => setCopiedMatrix(false), 2000);
  };

  // Copy current exam content
  const handleCopyCurrentExam = () => {
    const current = generatedExams[selectedVariantIndex];
    if (!current) return;

    let text = `${schoolName.toUpperCase()}\n${examTitle.toUpperCase()}\n${subjectName} - THỜI GIAN: ${duration} PHÚT\nMÃ ĐỀ: ${current.code}\n\n`;
    current.questions.forEach((q, idx) => {
      text += `Câu ${idx + 1}: ${q.questionText}\n`;
      if (q.contentText) text += `${q.contentText}\n`;
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedExam(true);
    setTimeout(() => setCopiedExam(false), 2000);
  };

  // CRUD handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExamItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (savedItem: ExamItem) => {
    const exists = questions.some((q) => q.id === savedItem.id);
    let updated: ExamItem[];
    if (exists) {
      updated = questions.map((q) => (q.id === savedItem.id ? savedItem : q));
      showToast("Đã cập nhật câu hỏi thành công!");
    } else {
      updated = [savedItem, ...questions];
      setActiveQuestionIds((prev) => [...prev, savedItem.id]);
      showToast("Đã thêm câu hỏi mới!");
    }
    saveQuestions(updated);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    const updated = questions.filter((q) => q.id !== itemToDelete.id);
    setActiveQuestionIds((prev) => prev.filter((id) => id !== itemToDelete.id));
    setSelectedBankIds((prev) => prev.filter((id) => id !== itemToDelete.id));
    saveQuestions(updated);
    setItemToDelete(null);
    showToast("Đã xóa câu hỏi khỏi ngân hàng!");
  };

  const handleConfirmBulkDelete = () => {
    const updated = questions.filter((q) => !selectedBankIds.includes(q.id));
    setActiveQuestionIds((prev) => prev.filter((id) => !selectedBankIds.includes(id)));
    saveQuestions(updated);
    setSelectedBankIds([]);
    setIsBulkDeleteOpen(false);
    showToast(`Đã xóa ${selectedBankIds.length} câu hỏi thành công!`);
  };

  // Import / Export JSON
  const handleExportJson = () => {
    const exportData = questions.map(({ author, question }) => ({
      author: {
        id: author.id,
        name: author.name,
        created_at: author.created_at,
        update_at: author.update_at,
      },
      question: {
        content: question.content,
        question: question.question,
        solution_guide: question.solution_guide,
        answer: question.answer,
        level: question.level,
        type: question.type,
      },
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ngan-hang-cau-hoi-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Đã xuất file JSON thành công!");
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          alert("File JSON không hợp lệ! Vui lòng chọn file chứa mảng câu hỏi.");
          return;
        }

        const imported: ExamItem[] = parsed.map((item, idx) => ({
          id: item.id || `q-imported-${Date.now()}-${idx}`,
          author: {
            id: item.author?.id || 1,
            name: item.author?.name || currentUser?.name || "Tran Tan Phuoc",
            created_at: item.author?.created_at || "26-06-2026 11:41:26",
            update_at: item.author?.update_at || "26-06-2026 11:41:26",
          },
          question: {
            content: item.question?.content || "",
            question: item.question?.question || "",
            solution_guide: item.question?.solution_guide || "",
            answer: item.question?.answer || "",
            level: item.question?.level || { id: 1, name: "Nhận Biết", short_name: "NB" },
            type: item.question?.type || { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
          },
        }));

        const merged = [...imported, ...questions];
        saveQuestions(merged);
        setActiveQuestionIds(merged.map((q) => q.id));
        showToast(`Đã nhập thành công ${imported.length} câu hỏi mới!`);
      } catch {
        alert("Lỗi khi đọc file JSON. Vui lòng kiểm tra định dạng file!");
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn đặt lại ngân hàng câu hỏi về dữ liệu mẫu ban đầu?")) {
      saveQuestions(initialQuestions);
      setActiveQuestionIds(initialQuestions.map((q) => q.id));
      setSelectedBankIds([]);
      showToast("Đã khôi phục dữ liệu mẫu ban đầu!");
    }
  };

  // Filtered in Bank Tab
  const filteredBankQuestions = useMemo(() => {
    return questions.filter((item) => {
      if (levelFilter !== "ALL" && item.question.level.short_name !== levelFilter) {
        return false;
      }
      if (typeFilter !== "ALL" && item.question.type.short_name !== typeFilter) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesQuestion = item.question.question.toLowerCase().includes(q);
        const matchesContent = item.question.content.toLowerCase().includes(q);
        const matchesAnswer = item.question.answer.toLowerCase().includes(q);
        const matchesAuthor = item.author.name.toLowerCase().includes(q);
        if (!matchesQuestion && !matchesContent && !matchesAnswer && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [questions, levelFilter, typeFilter, searchQuery]);

  // Loading state when checking authentication
  if (!isLoaded || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-3 font-sans">
        <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  const currentExam = generatedExams[selectedVariantIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 flex-wrap gap-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Shuffle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Hệ Thống Trộn Đề Thi
                  </h1>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Chính Thức
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Tạo mã đề ngẫu nhiên, hoán vị đáp án & xuất bảng ma trận đáp án
                </p>
              </div>
            </div>

            {/* Quick Actions & User Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportJson(file);
                    e.target.value = "";
                  }
                }}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Nhập dữ liệu từ file JSON"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Nhập JSON</span>
              </button>

              <button
                onClick={handleExportJson}
                title="Xuất ngân hàng câu hỏi ra file JSON"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Xuất JSON</span>
              </button>

              <button
                onClick={handleResetData}
                title="Khôi phục câu hỏi mẫu ban đầu"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">Dữ liệu mẫu</span>
              </button>

              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>

              <button
                onClick={handleShuffleExams}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trộn đề ngay</span>
              </button>

              {/* Logged in Teacher Profile Badge & Logout */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 sm:border-l border-slate-200 ml-1">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                  title={currentUser.email}
                >
                  {currentUser.avatar || "GV"}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {currentUser.school || "Giáo viên"}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất khỏi hệ thống"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar / Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-2 pb-2">
            <button
              onClick={() => setActiveTab("exam")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === "exam"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Đề Thi Đã Trộn ({generatedExams.length} mã đề)</span>
            </button>

            <button
              onClick={() => setActiveTab("matrix")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === "matrix"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>Ma Trận Đáp Án</span>
            </button>

            <button
              onClick={() => setActiveTab("solution")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === "solution"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lời Giải Chi Tiết</span>
            </button>

            <button
              onClick={() => setActiveTab("bank")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === "bank"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Ngân Hàng Câu Hỏi ({questions.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Exam Settings & Selection (no-print) */}
          <div className="lg:col-span-4 space-y-5 no-print">
            {/* Configuration Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-800">Cấu Hình Trộn Đề Thi</h2>
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {numVariants} mã đề
                </span>
              </div>

              {/* Input Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Trường / Đơn vị tổ chức
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Tiêu đề kỳ thi
                  </label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">
                      Môn thi
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">
                      Thời gian (phút)
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Số lượng mã đề cần tạo
                  </label>
                  <select
                    value={numVariants}
                    onChange={(e) => setNumVariants(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value={2}>2 mã đề (101, 102)</option>
                    <option value={4}>4 mã đề (101, 102, 103, 104)</option>
                    <option value={6}>6 mã đề (101 - 106)</option>
                    <option value={8}>8 mã đề (101 - 108)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={shuffleChoices}
                      onChange={(e) => setShuffleChoices(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>Hoán vị các phương án A, B, C, D (Trắc nghiệm)</span>
                  </label>
                </div>
              </div>

              {/* Big Action Button */}
              <button
                onClick={handleShuffleExams}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tiến hành trộn lại đề thi</span>
              </button>
            </div>

            {/* Questions to Include Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Câu hỏi tham gia trộn ({activeQuestionIds.length}/{questions.length})
                </span>
                <button
                  onClick={() => {
                    if (activeQuestionIds.length === questions.length) {
                      setActiveQuestionIds([]);
                    } else {
                      setActiveQuestionIds(questions.map((q) => q.id));
                    }
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                >
                  {activeQuestionIds.length === questions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {questions.map((q, idx) => {
                  const isChecked = activeQuestionIds.includes(q.id);
                  const lvl = getLevelBadge(q.question.level.short_name);
                  return (
                    <label
                      key={q.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-indigo-50/50 border-indigo-200 text-slate-800"
                          : "bg-slate-50 border-slate-200 text-slate-500 opacity-60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setActiveQuestionIds((prev) =>
                            prev.includes(q.id)
                              ? prev.filter((id) => id !== q.id)
                              : [...prev, q.id]
                          );
                        }}
                        className="w-4 h-4 mt-0.5 rounded text-indigo-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-indigo-700">Câu {idx + 1}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${lvl.bg}`}>
                            {q.question.level.short_name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            [{q.question.type.short_name}]
                          </span>
                        </div>
                        <p className="truncate text-slate-700 font-medium">
                          {q.question.question}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Tab Content */}
          <div className="lg:col-span-8 space-y-4">
            {/* TAB 1: EXAM PAPER PREVIEW */}
            {activeTab === "exam" && currentExam && (
              <div className="space-y-4">
                {/* Control bar above exam paper (no-print) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between flex-wrap gap-3 no-print">
                  {/* Variant Switcher Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase mr-1">
                      Chọn Mã Đề:
                    </span>
                    {generatedExams.map((v, idx) => (
                      <button
                        key={v.code}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedVariantIndex === idx
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Mã {v.code}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCurrentExam}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedExam ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedExam ? "Đã sao chép!" : "Sao chép đề"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In / Xuất PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable Exam Paper Container */}
                <div className="bg-white border border-slate-300 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
                  {/* Formal Exam Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
                    <div className="text-center font-bold text-xs space-y-1 w-1/3">
                      <p className="uppercase">{schoolName}</p>
                      <p className="text-slate-600 font-normal">TỔ BỘ MÔN CHUYÊN MÔN</p>
                      <div className="w-16 h-0.5 bg-slate-900 mx-auto mt-1"></div>
                    </div>

                    <div className="text-center space-y-1 flex-1">
                      <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wide">
                        {examTitle}
                      </h3>
                      <p className="text-xs font-bold">{subjectName}</p>
                      <p className="text-xs text-slate-600">
                        Thời gian làm bài: {duration} phút (Không kể phát đề)
                      </p>
                    </div>

                    <div className="border-2 border-slate-900 rounded-xl px-4 py-2 text-center shrink-0 min-w-24">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Mã đề thi
                      </p>
                      <p className="text-xl font-black text-indigo-700 tracking-wider">
                        {currentExam.code}
                      </p>
                    </div>
                  </div>

                  {/* Student Info Box */}
                  <div className="p-3 border border-slate-200 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/50 print:bg-transparent">
                    <div>
                      <span className="font-bold text-slate-600">Họ và tên:</span>{" "}
                      <span className="text-slate-400">............................</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Lớp:</span>{" "}
                      <span className="text-slate-400">...................</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Số báo danh:</span>{" "}
                      <span className="text-slate-400">.............</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Phòng thi:</span>{" "}
                      <span className="text-slate-400">................</span>
                    </div>
                  </div>

                  <div className="text-xs italic text-slate-500 text-center">
                    (Đề thi gồm có {currentExam.questions.length} câu hỏi)
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6 pt-2">
                    {currentExam.questions.map((q, idx) => (
                      <div key={idx} className="space-y-2 text-xs sm:text-sm">
                        <p className="font-semibold text-slate-900 leading-relaxed">
                          <span className="font-bold text-indigo-800">Câu {idx + 1}:</span>{" "}
                          {q.questionText}
                          <span className="ml-2 text-[10px] text-slate-400 font-normal no-print">
                            [{q.type} - {q.level}]
                          </span>
                        </p>
                        {q.contentText && (
                          <pre className="font-sans text-xs text-slate-700 whitespace-pre-wrap pl-4 border-l-2 border-slate-200 py-1 leading-relaxed">
                            {q.contentText}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
                    ----------------------------- HẾT -----------------------------
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANSWER MATRIX */}
            {activeTab === "matrix" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Bảng Ma Trận Đáp Án Đối Chiếu Các Mã Đề
                    </h3>
                    <p className="text-xs text-slate-500">
                      Đáp án của từng câu hỏi được sắp xếp tương ứng theo từng mã đề thi
                    </p>
                  </div>
                  <button
                    onClick={handleCopyMatrix}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedMatrix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMatrix ? "Đã sao chép vào clipboard!" : "Sao chép bảng đáp án"}</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-16">Câu</th>
                        {generatedExams.map((v) => (
                          <th key={v.code} className="p-3 bg-indigo-50/60 text-indigo-900 font-extrabold border-l border-slate-200">
                            Mã đề #{v.code}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(generatedExams[0]?.questions || []).map((_, qIdx) => (
                        <tr key={qIdx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-600 bg-slate-50/40">
                            Câu {qIdx + 1}
                          </td>
                          {generatedExams.map((v) => (
                            <td key={v.code} className="p-2.5 font-bold text-emerald-700 border-l border-slate-100">
                              {v.questions[qIdx]?.answer || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: STEP-BY-STEP SOLUTIONS */}
            {activeTab === "solution" && currentExam && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Lời Giải Chi Tiết Cho Mã Đề #{currentExam.code}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Các bước lập luận và phương pháp giải của từng câu hỏi
                    </p>
                  </div>
                  {/* Variant Switcher */}
                  <div className="flex items-center gap-1.5">
                    {generatedExams.map((v, idx) => (
                      <button
                        key={v.code}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                          selectedVariantIndex === idx
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        #{v.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {currentExam.questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          Câu {idx + 1}: {q.questionText}
                        </p>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          Đáp án: {q.answer}
                        </span>
                      </div>

                      {q.contentText && (
                        <pre className="font-sans text-xs text-slate-600 whitespace-pre-wrap pl-3 border-l-2 border-slate-300">
                          {q.contentText}
                        </pre>
                      )}

                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-700 block mb-1">
                          Hướng dẫn giải chi tiết:
                        </span>
                        <pre className="font-sans text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                          {q.solutionGuide || "Chưa có lời giải chi tiết cho câu hỏi này."}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: QUESTION BANK MANAGEMENT (FULL CRUD) */}
            {activeTab === "bank" && (
              <div className="space-y-4">
                {/* Bank Header Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm câu hỏi, nội dung, đáp án..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* Level */}
                    <select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
                    >
                      <option value="ALL">Tất cả mức độ</option>
                      {QUESTION_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.short_name}>
                          {lvl.short_name} - {lvl.name}
                        </option>
                      ))}
                    </select>

                    {/* Type */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
                    >
                      <option value="ALL">Tất cả định dạng</option>
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.id} value={t.short_name}>
                          {t.short_name} - {t.name}
                        </option>
                      ))}
                    </select>

                    {/* Add Question Button */}
                    <button
                      onClick={handleOpenCreate}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm câu mới</span>
                    </button>
                  </div>

                  {/* Bulk Delete Bar */}
                  {selectedBankIds.length > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                      <span className="text-xs font-medium text-rose-900">
                        Đang chọn <strong className="font-bold">{selectedBankIds.length}</strong> câu hỏi
                      </span>
                      <button
                        onClick={() => setIsBulkDeleteOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-rose-700 bg-white hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Xóa các câu đã chọn</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Bank Questions Cards List */}
                <div className="space-y-3">
                  {filteredBankQuestions.map((item, index) => {
                    const isSelected = selectedBankIds.includes(item.id);
                    const levelStyle = getLevelBadge(item.question.level.short_name);
                    const typeStyle = getTypeBadge(item.question.type.short_name);

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                          isSelected ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20" : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedBankIds((prev) =>
                                  prev.includes(item.id)
                                    ? prev.filter((id) => id !== item.id)
                                    : [...prev, item.id]
                                );
                              }}
                              className="w-4 h-4 rounded text-indigo-600"
                            />
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              Câu {index + 1}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${levelStyle.bg}`}>
                              {item.question.level.name} ({item.question.level.short_name})
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${typeStyle.bg}`}>
                              {item.question.type.name}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDetailItem(item)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 text-slate-400 hover:text-amber-600 rounded transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Xóa câu hỏi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="pt-2.5 space-y-1.5">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                            {item.question.question}
                          </p>
                          {item.question.content && (
                            <pre className="font-sans text-xs text-slate-600 whitespace-pre-wrap pl-3 border-l-2 border-slate-200">
                              {item.question.content}
                            </pre>
                          )}
                          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                            <span className="font-bold text-emerald-700">
                              Đáp án: {item.question.answer || "Chưa có"}
                            </span>
                            <span>{item.author.name} • {item.author.update_at}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer (no-print) */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Phần Mềm Trộn Đề Thi & Quản Lý Ngân Hàng Câu Hỏi © 2026</span>
          <span className="text-slate-400">
            Hỗ trợ đầy đủ 4 mức độ nhận thức (NB, TH, VD, VDC) & 4 dạng câu hỏi (TN, DS, TLN, TL)
          </span>
        </div>
      </footer>

      {/* CRUD MODALS */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        editingItem={editingItem}
      />

      <QuestionDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={handleOpenEdit}
      />

      <DeleteConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        itemToDelete={itemToDelete}
      />

      <DeleteConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        itemToDelete={null}
        countToDelete={selectedBankIds.length}
      />
    </div>
  );
}
