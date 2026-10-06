"use client";

import React, { useState, useMemo, useSyncExternalStore, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/route";
import {
  ExamItem,
  QUESTION_LEVELS,
  QUESTION_TYPES,
  SUBJECTS,
  GRADES,
} from "@/types/question";
import { initialQuestions } from "@/data/mockQuestions";
import {
  shuffleArray,
  getLevelBadge,
  getTypeBadge,
  getSubjectBadge,
  getGradeBadge,
} from "@/utils/helpers";
import QuestionModal from "@/components/QuestionModal";
import QuestionDetailModal from "@/components/QuestionDetailModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import {
  downloadExamDocx,
  downloadAllExamsZip,
  downloadMatrixDocx,
  downloadMatrixXlsx,
} from "@/utils/docxExport";
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
  FileDown,
  FileSpreadsheet,
  FolderArchive,
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STORAGE_KEY = "phan_mem_tron_de_questions_v3";
const emptySubscribe = () => () => {};

interface ShuffledQuestion {
  originalIndex: number;
  questionText: string;
  contentText: string;
  answer: string;
  level: string;
  type: string;
  solutionGuide: string;
  subject?: string;
  grade?: string;
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
      router.replace(APP_ROUTES.LOGIN);
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
              question: {
                ...item.question,
                subject: item.question?.subject || { id: "TOAN", name: "Toán học" },
                grade: item.question?.grade || { id: 12, name: "Khối 12" },
              },
            }));
          }
        }
      } catch {
        // Fallback
      }
    }
    return initialQuestions;
  });

  // Selected question IDs for shuffling (default to initially selected subject "TOAN")
  const [activeQuestionIds, setActiveQuestionIds] = useState<string[]>(() =>
    initialQuestions.filter((q) => q.question.subject?.id === "TOAN").map((q) => q.id)
  );

  // Exam Configuration State
  const [schoolName, setSchoolName] = useState("TRƯỜNG THPT CHUYÊN");
  const [examTitle, setExamTitle] = useState("KIỂM TRA CHẤT LƯỢNG ĐỊNH KỲ");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("TOAN");
  const [subjectName, setSubjectName] = useState("MÔN: TOÁN HỌC");
  const [selectedGradeId, setSelectedGradeId] = useState<number>(12);
  const [duration, setDuration] = useState("45");
  const [numVariants, setNumVariants] = useState<number>(4);
  const [shuffleChoices, setShuffleChoices] = useState<boolean>(true);

  // Search & Filter in Sidebar Question Selector
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [sidebarLevel, setSidebarLevel] = useState("ALL");
  const [sidebarType, setSidebarType] = useState("ALL");
  const [sidebarGrade, setSidebarGrade] = useState("ALL");

  // Mobile Accordion state for Exam Settings
  const [showMobileConfig, setShowMobileConfig] = useState(false);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"exam" | "matrix" | "solution" | "bank">(
    "exam"
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  // Generated Exam Variants State (scoped to initial subject "TOAN")
  const [generatedExams, setGeneratedExams] = useState<ExamVariant[]>(() => {
    const baseCodes = [101, 102, 103, 104];
    const initialPool = initialQuestions.filter((q) => q.question.subject?.id === "TOAN");
    return baseCodes.map((code) => ({
      code: `${code}`,
      questions: initialPool.map((q, idx) => ({
        originalIndex: idx + 1,
        questionText: q.question.question,
        contentText: q.question.content,
        answer: q.question.answer,
        level: q.question.level.short_name,
        type: q.question.type.name,
        solutionGuide: q.question.solution_guide,
        subject: q.question.subject?.name,
        grade: q.question.grade?.name,
      })),
    }));
  });

  // Search & Filter in Bank Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
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
      router.replace(APP_ROUTES.LOGIN);
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

  // Current subject metadata object
  const currentSubjectObj = useMemo(() => {
    return (
      SUBJECTS.find((s) => s.id === selectedSubjectId) || {
        id: selectedSubjectId,
        name: "Toán học",
      }
    );
  }, [selectedSubjectId]);

  // Total questions belonging to the currently selected subject
  const subjectQuestionsTotal = useMemo(() => {
    return questions.filter((q) => q.question.subject?.id === selectedSubjectId).length;
  }, [questions, selectedSubjectId]);

  // Checked/active questions belonging to the currently selected subject
  const activeQuestionsInSubject = useMemo(() => {
    return questions.filter(
      (q) => q.question.subject?.id === selectedSubjectId && activeQuestionIds.includes(q.id)
    ).length;
  }, [questions, selectedSubjectId, activeQuestionIds]);

  // Filtered questions for the Sidebar Question Selector (Strictly within selectedSubjectId)
  const sidebarFilteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. MUST strictly match currently selected subject
      if (q.question.subject?.id !== selectedSubjectId) {
        return false;
      }
      // 2. Filter by Grade
      if (sidebarGrade !== "ALL" && String(q.question.grade?.id) !== String(sidebarGrade)) {
        return false;
      }
      // 3. Filter by Level (4 mức độ: NB, TH, VD, VDC)
      if (sidebarLevel !== "ALL" && q.question.level.short_name !== sidebarLevel) {
        return false;
      }
      // 4. Filter by Type (4 định dạng: TN, DS, TLN, TL)
      if (sidebarType !== "ALL" && q.question.type.short_name !== sidebarType) {
        return false;
      }
      // 5. Search query
      if (sidebarSearch.trim() !== "") {
        const query = sidebarSearch.toLowerCase();
        const matchQ = q.question.question.toLowerCase().includes(query);
        const matchC = q.question.content.toLowerCase().includes(query);
        const matchA = q.question.answer.toLowerCase().includes(query);
        if (!matchQ && !matchC && !matchA) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedSubjectId, sidebarGrade, sidebarLevel, sidebarType, sidebarSearch]);

  // Shuffling logic: Chi tron DUY NHAT cac cau hoi da duoc nguoi dung tich chon
  const handleShuffleExams = () => {
    // Only pick questions that belong to the currently selected subject AND are checked in activeQuestionIds
    const targetPool = questions.filter(
      (q) =>
        q.question.subject?.id === selectedSubjectId &&
        activeQuestionIds.includes(q.id)
    );

    if (targetPool.length === 0) {
      showToast(`Vui lòng tích chọn ít nhất 1 câu hỏi môn ${currentSubjectObj.name} để trộn đề!`);
      return;
    }

    const variants: ExamVariant[] = [];

    for (let i = 0; i < numVariants; i++) {
      const code = `${101 + i}`;
      const shuffledList = shuffleArray(targetPool).map((q) => {
        const { content, answer } = shuffleOptionsForQuestion(
          q.question.content,
          q.question.answer
        );

        return {
          originalIndex: targetPool.findIndex((orig) => orig.id === q.id) + 1,
          questionText: q.question.question,
          contentText: content,
          answer: answer,
          level: q.question.level.short_name,
          type: q.question.type.name,
          solutionGuide: q.question.solution_guide,
          subject: q.question.subject?.name,
          grade: q.question.grade?.name,
        };
      });

      variants.push({
        code,
        questions: shuffledList,
      });
    }

    setGeneratedExams(variants);
    setSelectedVariantIndex(0);
    showToast(`Đã tạo thành công ${numVariants} mã đề từ đúng ${targetPool.length} câu hỏi bạn đã chọn!`);
  };

  // Tron de truc tiep tu cac cau hoi duoc tich chon trong tab Ngan hang cau hoi
  const handleShuffleFromBankSelection = () => {
    if (selectedBankIds.length === 0) {
      showToast("Vui lòng tích chọn các câu hỏi bạn muốn đưa vào đề thi!");
      return;
    }

    const selectedQuestions = questions.filter((q) => selectedBankIds.includes(q.id));
    if (selectedQuestions.length === 0) return;

    // Tu dong cap nhat mon hoc neu cac cau hoi chon cung thuoc mot mon
    const firstSubject = selectedQuestions[0].question.subject;
    if (firstSubject) {
      setSelectedSubjectId(firstSubject.id);
      setSubjectName(`MÔN: ${firstSubject.name.toUpperCase()}`);
    }

    // Gan danh sach cau hoi duoc chon
    setActiveQuestionIds(selectedBankIds);

    const variants: ExamVariant[] = [];
    for (let i = 0; i < numVariants; i++) {
      const code = `${101 + i}`;
      const shuffledList = shuffleArray(selectedQuestions).map((q) => {
        const { content, answer } = shuffleOptionsForQuestion(
          q.question.content,
          q.question.answer
        );

        return {
          originalIndex: selectedQuestions.findIndex((orig) => orig.id === q.id) + 1,
          questionText: q.question.question,
          contentText: content,
          answer: answer,
          level: q.question.level.short_name,
          type: q.question.type.name,
          solutionGuide: q.question.solution_guide,
          subject: q.question.subject?.name,
          grade: q.question.grade?.name,
        };
      });

      variants.push({
        code,
        questions: shuffledList,
      });
    }

    setGeneratedExams(variants);
    setSelectedVariantIndex(0);
    setActiveTab("exam");
    showToast(`Đã tạo thành công ${numVariants} mã đề từ đúng ${selectedQuestions.length} câu hỏi đã chọn trong ngân hàng!`);
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

  // Export current exam variant to standard Microsoft Word (.docx) with A4 format, Times New Roman 13pt
  const handleExportWord = () => {
    const current = generatedExams[selectedVariantIndex];
    if (!current) {
      showToast("Không tìm thấy mã đề thi để xuất!");
      return;
    }

    try {
      const fileName = downloadExamDocx({
        schoolName,
        examTitle,
        subjectName,
        duration,
        examCode: current.code,
        questions: current.questions,
      });
      showToast(`Đã xuất đề thi mã ${current.code} ra file Word (${fileName}) thành công!`);
    } catch (err) {
      console.error("Lỗi xuất file docx:", err);
      showToast("Có lỗi xảy ra khi tạo file Word (.docx)!");
    }
  };

  // Export all generated exam variants to individual .docx files packaged in a single .zip archive
  const handleExportAllZip = () => {
    if (!generatedExams || generatedExams.length === 0) {
      showToast("Chưa có danh sách đề thi để xuất!");
      return;
    }

    try {
      const fileName = downloadAllExamsZip({
        schoolName,
        examTitle,
        subjectName,
        duration,
        exams: generatedExams.map((v) => ({
          code: v.code,
          questions: v.questions,
        })),
      });
      showToast(`Đã xuất thành công toàn bộ ${generatedExams.length} mã đề thi vào file zip (${fileName})!`);
    } catch (err) {
      console.error("Lỗi xuất file zip tất cả đề thi:", err);
      showToast("Có lỗi xảy ra khi tạo file zip đề thi!");
    }
  };

  // Export Answer Matrix to Word (.docx) with automatic page-chunking for A4 paper
  const handleExportMatrixWord = () => {
    if (!generatedExams || generatedExams.length === 0) {
      showToast("Chưa có danh sách mã đề thi để xuất!");
      return;
    }

    try {
      const fileName = downloadMatrixDocx({
        schoolName,
        examTitle,
        subjectName,
        duration,
        exams: generatedExams.map((v) => ({
          code: v.code,
          questions: v.questions,
        })),
      });
      showToast(`Đã xuất ma trận đáp án ra file Word A4 (${fileName}) thành công!`);
    } catch (err) {
      console.error("Lỗi xuất ma trận Word:", err);
      showToast("Có lỗi xảy ra khi tạo file Word ma trận đáp án!");
    }
  };

  // Export Answer Matrix to Excel (.xlsx) spreadsheet
  const handleExportMatrixExcel = () => {
    if (!generatedExams || generatedExams.length === 0) {
      showToast("Chưa có danh sách mã đề thi để xuất!");
      return;
    }

    try {
      const fileName = downloadMatrixXlsx({
        schoolName,
        examTitle,
        subjectName,
        duration,
        exams: generatedExams.map((v) => ({
          code: v.code,
          questions: v.questions,
        })),
      });
      showToast(`Đã xuất ma trận đáp án ra file Excel (${fileName}) thành công!`);
    } catch (err) {
      console.error("Lỗi xuất ma trận Excel:", err);
      showToast("Có lỗi xảy ra khi tạo file Excel ma trận đáp án!");
    }
  };

  // Chunk matrix variants into groups of 10 for clean A4 printing/PDF without overflowing
  const matrixChunks = useMemo(() => {
    const chunkSize = 10;
    const chunks: ExamVariant[][] = [];
    for (let i = 0; i < generatedExams.length; i += chunkSize) {
      chunks.push(generatedExams.slice(i, i + chunkSize));
    }
    return chunks;
  }, [generatedExams]);

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
        subject: question.subject,
        grade: question.grade,
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
            subject: item.question?.subject || { id: "TOAN", name: "Toán học" },
            grade: item.question?.grade || { id: 12, name: "Khối 12" },
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
      if (subjectFilter !== "ALL" && item.question.subject?.id !== subjectFilter) {
        return false;
      }
      if (gradeFilter !== "ALL" && String(item.question.grade?.id) !== String(gradeFilter)) {
        return false;
      }
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
        const matchesSubject = item.question.subject?.name.toLowerCase().includes(q);
        const matchesGrade = item.question.grade?.name.toLowerCase().includes(q);
        if (
          !matchesQuestion &&
          !matchesContent &&
          !matchesAnswer &&
          !matchesAuthor &&
          !matchesSubject &&
          !matchesGrade
        ) {
          return false;
        }
      }
      return true;
    });
  }, [questions, subjectFilter, gradeFilter, levelFilter, typeFilter, searchQuery]);

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
    <div className="min-h-screen w-full bg-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for JSON import */}
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

      {/* Main Top Header - Full Screen Width */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print backdrop-blur-md bg-white/95 w-full safe-padding-top">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          {/* Top Bar for Desktop & Tablet */}
          <div className="hidden sm:flex items-center justify-between gap-3 py-2.5 min-h-[58px]">
            {/* Logo & Title */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                <Shuffle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    Hệ Thống Trộn Đề Thi
                  </h1>
                  <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Chính Thức
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden xl:block truncate">
                  Tạo mã đề ngẫu nhiên, hoán vị đáp án & xuất bảng ma trận
                </p>
              </div>
            </div>

            {/* Quick Actions & User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {/* JSON Data Management Group */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhập dữ liệu từ file JSON"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nhập</span>
                </button>

                <button
                  onClick={handleExportJson}
                  title="Xuất ngân hàng câu hỏi ra file JSON"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Xuất</span>
                </button>

                <button
                  onClick={handleResetData}
                  title="Khôi phục câu hỏi mẫu ban đầu"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100/70 rounded-md transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden lg:inline">Mẫu</span>
                </button>
              </div>

              {/* Create Question Button */}
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>

              {/* Shuffle Action Button */}
              <button
                onClick={handleShuffleExams}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-md shadow-emerald-200 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trộn đề ngay</span>
              </button>


              {/* Logged in Teacher Profile Badge & Logout */}
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200 shrink-0">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 select-none"
                  title={currentUser.email}
                >
                  {currentUser.avatar || "GV"}
                </div>
                <div className="hidden xl:block text-left min-w-0">
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[110px]">{currentUser.name}</span>
                    <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                    {currentUser.school || "Giáo viên"}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất khỏi hệ thống"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Header for Mobile (< sm) */}
          <div className="sm:hidden py-2 space-y-2">
            {/* Mobile Row 1: Brand & Key CTA */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Shuffle className="w-4 h-4" />
                </div>
                <h1 className="text-sm font-bold text-slate-900 truncate">
                  Trộn Đề Thi
                </h1>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleShuffleExams}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trộn đề</span>
                </button>

                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0"
                >
                  {currentUser.avatar || "GV"}
                </div>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1 text-slate-400 hover:text-rose-600 rounded shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Row 2: Secondary Action Toolbar */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <button
                onClick={handleOpenCreate}
                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm câu hỏi</span>
              </button>


              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhập JSON"
                  className="px-2 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleExportJson}
                  title="Xuất JSON"
                  className="px-2 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetData}
                  title="Dữ liệu mẫu"
                  className="px-2 py-1 text-xs font-semibold text-amber-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar / Tabs - Full Width Scrollable */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 py-1.5 scrollbar-none w-full">
            <button
              onClick={() => setActiveTab("exam")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "exam"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Đề Thi ({generatedExams.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("matrix")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "matrix"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <TableProperties className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Ma Trận Đáp Án</span>
            </button>

            <button
              onClick={() => setActiveTab("solution")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "solution"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Lời Giải Chi Tiết</span>
            </button>

            <button
              onClick={() => setActiveTab("bank")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "bank"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Ngân Hàng Câu Hỏi ({questions.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace - 100% Full Screen Width */}
      <main className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        {/* On Mobile: Collapsible Exam Configuration Accordion Button */}
        {activeTab !== "bank" && (
          <div className="lg:hidden mb-4 no-print">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Settings2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  Cấu hình đề ({numVariants} mã đề, {activeQuestionsInSubject} câu)
                </span>
              </div>
              <button
                onClick={() => setShowMobileConfig(!showMobileConfig)}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors shrink-0 cursor-pointer"
              >
                <span>{showMobileConfig ? "Thu gọn" : "Tùy chỉnh"}</span>
                {showMobileConfig ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start w-full">
          {/* Left Column: Exam Settings & Selection (no-print) */}
          {activeTab !== "bank" && (
            <div
              className={`lg:col-span-4 xl:col-span-3 space-y-4 no-print lg:sticky lg:top-20 ${
                showMobileConfig ? "block" : "hidden lg:block"
              }`}
            >
              {/* Configuration Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-sm font-bold text-slate-800">Cấu Hình Trộn Đề</h2>
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
                        Môn học
                      </label>
                      <select
                        value={selectedSubjectId}
                        onChange={(e) => {
                          const sId = e.target.value;
                          setSelectedSubjectId(sId);
                          const found = SUBJECTS.find((s) => s.id === sId);
                          if (found) {
                            setSubjectName(`MÔN: ${found.name.toUpperCase()}`);
                          }
                          const matchingIds = questions
                            .filter((q) => q.question.subject?.id === sId)
                            .map((q) => q.id);
                          setActiveQuestionIds(matchingIds);
                          setSidebarSearch("");
                          setSidebarLevel("ALL");
                          setSidebarType("ALL");
                          setSidebarGrade("ALL");
                        }}
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold cursor-pointer"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">
                        Khối lớp
                      </label>
                      <select
                        value={selectedGradeId}
                        onChange={(e) => setSelectedGradeId(Number(e.target.value))}
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold cursor-pointer"
                      >
                        {GRADES.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">
                        Tiêu đề trên đề thi
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
                      <option value={4}>4 mã đề (101 - 104)</option>
                      <option value={6}>6 mã đề (101 - 106)</option>
                      <option value={8}>8 mã đề (101 - 108)</option>
                      <option value={10}>10 mã đề (101 - 110)</option>
                      <option value={20}>20 mã đề (101 - 120)</option>
                      <option value={30}>30 mã đề (101 - 130)</option>
                      <option value={40}>40 mã đề (101 - 140)</option>
                      <option value={50}>50 mã đề (101 - 150)</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={shuffleChoices}
                        onChange={(e) => setShuffleChoices(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 shrink-0"
                      />
                      <span className="leading-tight">Hoán vị phương án A, B, C, D</span>
                    </label>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  onClick={handleShuffleExams}
                  disabled={activeQuestionsInSubject === 0}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 text-xs font-bold rounded-xl shadow-md transition-all ${
                    activeQuestionsInSubject > 0
                      ? "text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200 cursor-pointer"
                      : "text-slate-400 bg-slate-100 border border-slate-200 shadow-none cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {activeQuestionsInSubject > 0
                      ? `Tiến hành trộn đề (${activeQuestionsInSubject} câu đã chọn)`
                      : `Vui lòng chọn câu hỏi bên dưới`}
                  </span>
                </button>
              </div>

              {/* Questions to Include Selector */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                {/* Header & Quick Action */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-1">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Câu hỏi {currentSubjectObj.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Đã chọn: <strong className="text-indigo-600 font-bold">{activeQuestionsInSubject}</strong> / {subjectQuestionsTotal} câu
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      onClick={() => {
                        const filteredIds = sidebarFilteredQuestions.map((q) => q.id);
                        const allFilteredChecked =
                          filteredIds.length > 0 &&
                          filteredIds.every((id) => activeQuestionIds.includes(id));

                        if (allFilteredChecked) {
                          // Uncheck all currently filtered questions
                          setActiveQuestionIds((prev) =>
                            prev.filter((id) => !filteredIds.includes(id))
                          );
                        } else {
                          // Check all currently filtered questions
                          setActiveQuestionIds((prev) =>
                            Array.from(new Set([...prev, ...filteredIds]))
                          );
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                      title="Chọn hoặc bỏ chọn tất cả các câu hỏi đang hiển thị trong bộ lọc"
                    >
                      {sidebarFilteredQuestions.length > 0 &&
                      sidebarFilteredQuestions.every((q) => activeQuestionIds.includes(q.id))
                        ? "Bỏ chọn lọc"
                        : "Chọn tất cả lọc"}
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => {
                        const subjectAllIds = questions
                          .filter((q) => q.question.subject?.id === selectedSubjectId)
                          .map((q) => q.id);
                        const isAllSubjectChecked =
                          subjectAllIds.length > 0 &&
                          subjectAllIds.every((id) => activeQuestionIds.includes(id));
                        if (isAllSubjectChecked) {
                          setActiveQuestionIds((prev) =>
                            prev.filter((id) => !subjectAllIds.includes(id))
                          );
                        } else {
                          setActiveQuestionIds((prev) =>
                            Array.from(new Set([...prev, ...subjectAllIds]))
                          );
                        }
                      }}
                      className="text-xs text-slate-600 hover:text-slate-800 font-bold cursor-pointer"
                      title="Chọn hoặc bỏ chọn toàn bộ câu hỏi của môn này"
                    >
                      {activeQuestionsInSubject === subjectQuestionsTotal && subjectQuestionsTotal > 0
                        ? "Bỏ chọn môn"
                        : "Tất cả môn"}
                    </button>
                  </div>
                </div>

                {/* Filter and Search Controls for Question Selection */}
                <div className="space-y-2 pt-1">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      placeholder={`Tìm câu hỏi ${currentSubjectObj.name}...`}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Level & Type Select Dropdowns */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* 4 Mức độ */}
                    <select
                      value={sidebarLevel}
                      onChange={(e) => setSidebarLevel(e.target.value)}
                      className="text-[11px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">Tất cả mức độ</option>
                      {QUESTION_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.short_name}>
                          {lvl.short_name} - {lvl.name}
                        </option>
                      ))}
                    </select>

                    {/* 4 Dạng câu hỏi */}
                    <select
                      value={sidebarType}
                      onChange={(e) => setSidebarType(e.target.value)}
                      className="text-[11px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">Tất cả định dạng</option>
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.id} value={t.short_name}>
                          {t.short_name} - {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Filter & Reset button */}
                  <div className="flex items-center justify-between text-[11px] gap-2 pt-0.5">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-slate-500 font-semibold shrink-0">Khối:</span>
                      <select
                        value={sidebarGrade}
                        onChange={(e) => setSidebarGrade(e.target.value)}
                        className="text-[11px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-medium text-slate-700 cursor-pointer flex-1"
                      >
                        <option value="ALL">Tất cả khối</option>
                        {GRADES.map((g) => (
                          <option key={g.id} value={String(g.id)}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(sidebarSearch || sidebarLevel !== "ALL" || sidebarType !== "ALL" || sidebarGrade !== "ALL") && (
                      <button
                        onClick={() => {
                          setSidebarSearch("");
                          setSidebarLevel("ALL");
                          setSidebarType("ALL");
                          setSidebarGrade("ALL");
                        }}
                        className="text-rose-600 hover:text-rose-800 font-bold shrink-0 underline cursor-pointer"
                      >
                        Xóa lọc
                      </button>
                    )}
                  </div>
                </div>

                {/* Question List (Filtered strictly by selected subject & search/level/type) */}
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 pt-1">
                  {sidebarFilteredQuestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-1.5">
                      <p className="font-semibold text-slate-700">
                        {subjectQuestionsTotal === 0
                          ? `Chưa có câu hỏi nào thuộc môn ${currentSubjectObj.name} trong ngân hàng!`
                          : `Không có câu hỏi ${currentSubjectObj.name} nào khớp bộ lọc.`}
                      </p>
                      {subjectQuestionsTotal === 0 ? (
                        <button
                          onClick={handleOpenCreate}
                          className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          + Thêm câu hỏi môn {currentSubjectObj.name}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSidebarSearch("");
                            setSidebarLevel("ALL");
                            setSidebarType("ALL");
                            setSidebarGrade("ALL");
                          }}
                          className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          Đặt lại bộ lọc để xem {subjectQuestionsTotal} câu hỏi
                        </button>
                      )}
                    </div>
                  ) : (
                    sidebarFilteredQuestions.map((q, idx) => {
                      const isChecked = activeQuestionIds.includes(q.id);
                      const lvl = getLevelBadge(q.question.level.short_name);
                      const grdBadge = getGradeBadge(q.question.grade);
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
                            className="w-4 h-4 mt-0.5 rounded text-indigo-600 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="font-bold text-indigo-700">Câu {idx + 1}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${grdBadge.bg}`}>
                                {q.question.grade?.name || "Khối 12"}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${lvl.bg}`}>
                                {q.question.level.short_name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                [{q.question.type.short_name}]
                              </span>
                            </div>
                            <p className="truncate text-slate-800 font-medium">
                              {q.question.question}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>

                {/* Bottom Action Bar: Tron de ngay sau khi chon cau hoi */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {currentExam && currentExam.questions.length !== activeQuestionsInSubject && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-1.5 leading-tight">
                      <span className="font-bold shrink-0">⚠️ Lưu ý:</span>
                      <span>
                        Đề hiện tại ({currentExam.questions.length} câu) khác số câu bạn đang chọn ({activeQuestionsInSubject} câu). Bấm nút dưới để tạo lại đề thi!
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleShuffleExams}
                    disabled={activeQuestionsInSubject === 0}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all shadow-sm ${
                      activeQuestionsInSubject > 0
                        ? "text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-200 cursor-pointer"
                        : "text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {activeQuestionsInSubject > 0
                        ? `Trộn đề với đúng ${activeQuestionsInSubject} câu đã chọn`
                        : "Chưa chọn câu hỏi nào"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Active Tab Content (or Full Width for Question Bank) */}
          <div
            className={
              activeTab === "bank"
                ? "col-span-12 w-full space-y-4"
                : "lg:col-span-8 xl:col-span-9 space-y-4 w-full min-w-0"
            }
          >
            {/* TAB 1: EXAM PAPER PREVIEW */}
            {activeTab === "exam" && currentExam && (
              <div className="space-y-4 w-full">
                {/* Control bar above exam paper (no-print) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-3 no-print">
                  {/* Row 1: Active Exam Info & Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">
                        Mã Đề:
                      </span>
                      <span className="px-2.5 py-1 text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
                        Mã #{currentExam.code} ({selectedVariantIndex + 1}/{generatedExams.length})
                      </span>
                    </div>

                    {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyCurrentExam}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedExam ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedExam ? "Đã sao chép!" : "Sao chép đề"}</span>
                      <span className="sm:hidden">{copiedExam ? "Đã chép" : "Chép"}</span>
                    </button>

                    {/* Export directly to Word (.docx) with A4 format */}
                    <button
                      onClick={handleExportWord}
                      className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all cursor-pointer shadow-sm shadow-blue-200"
                      title="Tự động xuất đề thi sang file Word (.docx) chuẩn khổ giấy A4"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Xuất Word (.docx)</span>
                    </button>

                    {/* Export ALL exams into a single .zip archive */}
                    <button
                      onClick={handleExportAllZip}
                      className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-all cursor-pointer shadow-sm shadow-emerald-200"
                      title={`Tự động xuất tất cả ${generatedExams.length} mã đề thi (.docx) vào 1 file ZIP`}
                    >
                      <FolderArchive className="w-4 h-4" />
                      <span className="hidden sm:inline">Xuất tất cả ({generatedExams.length} đề .zip)</span>
                      <span className="sm:hidden">Tất cả ({generatedExams.length} đề .zip)</span>
                    </button>

                    {/* Print / Save PDF Button */}
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                      title="In trực tiếp ra máy in hoặc Lưu thành file PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">In / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Row 2: All Variant Switcher Buttons (Wrap automatically on width limit) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100 w-full">
                  {generatedExams.map((v, idx) => (
                    <button
                      key={v.code}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        selectedVariantIndex === idx
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      Mã {v.code}
                    </button>
                  ))}
                </div>
              </div>

                {/* Printable Exam Paper Container - Times New Roman 13pt */}
                <div
                  className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-10 lg:p-12 shadow-sm text-slate-900 print:border-none print:shadow-none print:p-0 w-full overflow-hidden"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "13pt",
                    lineHeight: "1.4",
                  }}
                >
                  {/* Formal Exam Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start border-b-2 border-slate-900 pb-4 gap-3 sm:gap-4">
                    {/* School Box */}
                    <div className="flex items-center justify-between sm:block sm:w-1/3 text-left sm:text-center font-bold space-y-0.5 sm:space-y-1">
                      <div>
                        <p className="uppercase font-bold tracking-tight" style={{ fontSize: "12pt" }}>{schoolName}</p>
                        <p className="font-normal text-slate-700" style={{ fontSize: "11pt" }}>TỔ BỘ MÔN CHUYÊN MÔN</p>
                        <div className="hidden sm:block w-20 h-0.5 bg-slate-900 mx-auto mt-1"></div>
                      </div>
                      <div className="sm:hidden border-2 border-slate-900 rounded-lg px-2.5 py-1 text-center bg-indigo-50/50">
                        <p className="font-bold text-slate-600 uppercase" style={{ fontSize: "9pt" }}>Mã đề</p>
                        <p className="font-bold text-indigo-700" style={{ fontSize: "14pt" }}>{currentExam.code}</p>
                      </div>
                    </div>

                    {/* Exam Title */}
                    <div className="text-center space-y-0.5 sm:space-y-1 flex-1">
                      <h3 className="font-bold uppercase tracking-wide" style={{ fontSize: "14pt" }}>
                        {examTitle}
                      </h3>
                      <p className="font-bold" style={{ fontSize: "13pt" }}>{subjectName}</p>
                      <p className="italic text-slate-600" style={{ fontSize: "11.5pt" }}>
                        Thời gian làm bài: {duration} phút (Không kể phát đề)
                      </p>
                    </div>

                    {/* Desktop Exam Code Box */}
                    <div className="hidden sm:block border-2 border-slate-900 rounded-xl px-4 py-2 text-center shrink-0 min-w-24 bg-slate-50/50 print:bg-transparent">
                      <p className="font-bold text-slate-500 uppercase tracking-wider" style={{ fontSize: "9.5pt" }}>
                        Mã đề thi
                      </p>
                      <p className="font-black text-indigo-900 print:text-black tracking-wider" style={{ fontSize: "18pt" }}>
                        {currentExam.code}
                      </p>
                    </div>
                  </div>

                  {/* Student Info Box */}
                  <div
                    className="p-3 border border-slate-300 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50/50 print:bg-transparent my-4"
                    style={{ fontSize: "12pt" }}
                  >
                    <div className="truncate">
                      <strong>Họ và tên:</strong> <span className="text-slate-400">............................</span>
                    </div>
                    <div className="truncate">
                      <strong>Lớp:</strong> <span className="text-slate-400">...................</span>
                    </div>
                    <div className="truncate">
                      <strong>Số báo danh:</strong> <span className="text-slate-400">.............</span>
                    </div>
                    <div className="truncate">
                      <strong>Phòng thi:</strong> <span className="text-slate-400">................</span>
                    </div>
                  </div>

                  <div className="italic text-slate-500 text-center mb-5" style={{ fontSize: "11.5pt" }}>
                    (Đề thi gồm có {currentExam.questions.length} câu hỏi)
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {currentExam.questions.map((q, idx) => (
                      <div key={idx} className="space-y-1.5" style={{ fontSize: "13pt" }}>
                        <p className="font-bold text-slate-900 leading-normal break-words">
                          <span>Câu {idx + 1}:</span>{" "}
                          <span className="font-normal">{q.questionText}</span>
                          <span className="ml-2 text-[10pt] font-normal text-slate-400 no-print">
                            [{q.type} - {q.level}]
                          </span>
                        </p>
                        {q.contentText && (
                          <div
                            className="pl-4 whitespace-pre-wrap leading-relaxed text-slate-800 break-words"
                            style={{
                              fontFamily: "'Times New Roman', Times, serif",
                              fontSize: "13pt",
                              lineHeight: "1.4",
                            }}
                          >
                            {q.contentText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-slate-400 pt-8 border-t border-slate-300 mt-6" style={{ fontSize: "12pt" }}>
                    ----------------------------- HẾT -----------------------------
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANSWER MATRIX */}
            {activeTab === "matrix" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 w-full">
                {/* Matrix Header & Actions Bar (no-print) */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2.5 no-print">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Bảng Ma Trận Đáp Án Đối Chiếu Các Mã Đề
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tổng hợp đáp án đối chiếu của {generatedExams.length} mã đề thi ({subjectName})
                    </p>
                  </div>

                  {/* Export and Action Buttons */}
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Export Word A4 (.docx) with Auto Page Break */}
                    <button
                      onClick={handleExportMatrixWord}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-blue-200 transition-all cursor-pointer"
                      title="Xuất bảng ma trận đáp án ra file Word chuẩn khổ A4, tự động ngắt trang khi có nhiều mã đề để không bị tràn"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Xuất Word A4 (.docx)</span>
                    </button>

                    {/* Export Excel (.xlsx) Spreadsheet */}
                    <button
                      onClick={handleExportMatrixExcel}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm shadow-emerald-200 transition-all cursor-pointer"
                      title="Xuất toàn bộ ma trận đáp án ra file bảng tính Excel (.xlsx) chuẩn đối chiếu chấm thi"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Xuất Excel (.xlsx)</span>
                    </button>

                    {/* Print / Save A4 PDF with Page-Break */}
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                      title="In trực tiếp hoặc Lưu thành file PDF chuẩn khổ A4 (tự động phân trang chống tràn)"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>In / PDF A4</span>
                    </button>

                    {/* Export All Exam Variants Zip */}
                    <button
                      onClick={handleExportAllZip}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                      title={`Tải về tất cả ${generatedExams.length} mã đề thi (.docx) trong 1 file ZIP`}
                    >
                      <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden xl:inline">Xuất tất cả đề (.zip)</span>
                      <span className="xl:hidden">Đề (.zip)</span>
                    </button>

                    {/* Copy Matrix to Clipboard */}
                    <button
                      onClick={handleCopyMatrix}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Sao chép toàn bộ bảng đáp án vào bộ nhớ tạm"
                    >
                      {copiedMatrix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedMatrix ? "Đã sao chép!" : "Sao chép"}</span>
                    </button>
                  </div>
                </div>

                {/* Helpful Notification Banner for Large Number of Exam Codes */}
                {generatedExams.length > 10 && (
                  <div className="flex items-start gap-2.5 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950 no-print">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold">
                        Đang có {generatedExams.length} mã đề thi: Hệ thống đã bật tính năng tự động ngắt trang A4 chống tràn!
                      </p>
                      <p className="text-slate-600">
                        Khi chọn <strong>Xuất Word A4</strong> hoặc <strong>In / PDF A4</strong>, ma trận sẽ tự động chia đều thành <strong>{matrixChunks.length} trang A4</strong> chuẩn (mỗi trang chứa 10 mã đề) kèm tiêu đề riêng biệt. Bạn cũng có thể chọn <strong>Xuất Excel (.xlsx)</strong> để xem toàn bộ {generatedExams.length} mã đề trên cùng một trang tính.
                      </p>
                    </div>
                  </div>
                )}

                {/* ON-SCREEN VIEW: Table with Sticky First Column & Full Horizontal Scroll (no-print) */}
                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs w-full print:hidden">
                  <table className="min-w-[480px] w-full text-center text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-20 sticky left-0 z-10 bg-slate-100 border-r border-slate-200 whitespace-nowrap">
                          Câu
                        </th>
                        {generatedExams.map((v) => (
                          <th key={v.code} className="p-3 bg-indigo-50/60 text-indigo-900 font-extrabold border-l border-slate-200 whitespace-nowrap">
                            Mã đề #{v.code}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(generatedExams[0]?.questions || []).map((_, qIdx) => (
                        <tr key={qIdx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 whitespace-nowrap">
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

                {/* PRINT / PDF A4 VIEW: Chunked by 10 Exam Codes per Page (only rendered on print) */}
                <div className="hidden print:block space-y-8 w-full text-slate-900">
                  {matrixChunks.map((chunk, chunkIdx) => (
                    <div
                      key={chunkIdx}
                      className="w-full text-left"
                      style={{
                        pageBreakAfter: chunkIdx < matrixChunks.length - 1 ? "always" : "auto",
                        breakAfter: chunkIdx < matrixChunks.length - 1 ? "page" : "auto",
                        fontFamily: "'Times New Roman', Times, serif",
                      }}
                    >
                      {/* Formal School & Exam Header */}
                      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-3 text-xs">
                        <div className="text-left font-bold space-y-0.5">
                          <p className="uppercase text-sm">{schoolName}</p>
                          <p className="font-normal text-slate-700 text-xs">TỔ BỘ MÔN CHUYÊN MÔN</p>
                        </div>
                        <div className="text-right font-bold space-y-0.5">
                          <p className="uppercase text-sm">{examTitle}</p>
                          <p className="font-normal text-slate-700 text-xs">
                            {subjectName} - Thời gian: {duration} phút
                          </p>
                        </div>
                      </div>

                      {/* Title of the Matrix Chunk */}
                      <div className="text-center mb-3">
                        <h4 className="font-bold text-base uppercase tracking-tight">
                          BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU CÁC MÃ ĐỀ
                        </h4>
                        <p className="text-xs italic text-slate-600">
                          {matrixChunks.length > 1
                            ? `(Nhóm mã đề: ${chunk[0].code} đến ${chunk[chunk.length - 1].code} • Trang ${chunkIdx + 1}/${matrixChunks.length})`
                            : `(Tổng cộng ${chunk.length} mã đề thi)`}
                        </p>
                      </div>

                      {/* Clean 10-Column A4 Table */}
                      <table className="w-full text-center text-xs border-collapse border border-slate-400">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b border-slate-400">
                            <th className="p-2 border border-slate-400 w-16">Câu</th>
                            {chunk.map((v) => (
                              <th key={v.code} className="p-2 border border-slate-400 font-black">
                                Mã #{v.code}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(generatedExams[0]?.questions || []).map((_, qIdx) => (
                            <tr key={qIdx} className={qIdx % 2 === 1 ? "bg-slate-50" : ""}>
                              <td className="p-1.5 font-bold border border-slate-400 bg-slate-100">
                                Câu {qIdx + 1}
                              </td>
                              {chunk.map((v) => (
                                <td key={v.code} className="p-1.5 font-bold text-black border border-slate-400">
                                  {v.questions[qIdx]?.answer || "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STEP-BY-STEP SOLUTIONS */}
            {activeTab === "solution" && currentExam && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5 w-full">
                <div className="pb-3 border-b border-slate-100 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Lời Giải Chi Tiết Cho Mã Đề #{currentExam.code}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Các bước lập luận và phương pháp giải của từng câu hỏi
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
                      Mã #{currentExam.code} ({selectedVariantIndex + 1}/{generatedExams.length})
                    </span>
                  </div>

                  {/* All Variant Switcher Buttons (Wrap automatically on width limit) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 w-full">
                    <span className="text-xs font-bold text-slate-500 uppercase mr-1 whitespace-nowrap">
                      Mã Đề:
                    </span>
                    {generatedExams.map((v, idx) => (
                      <button
                        key={v.code}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedVariantIndex === idx
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        #{v.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {currentExam.questions.map((q, idx) => (
                    <div key={idx} className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          Câu {idx + 1}: {q.questionText}
                        </p>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          Đáp án: {q.answer}
                        </span>
                      </div>

                      {q.contentText && (
                        <pre className="font-sans text-xs text-slate-600 whitespace-pre-wrap pl-3 border-l-2 border-slate-300 break-words">
                          {q.contentText}
                        </pre>
                      )}

                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-700 block mb-1">
                          Hướng dẫn giải chi tiết:
                        </span>
                        <pre className="font-sans text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-slate-200 break-words">
                          {q.solutionGuide || "Chưa có lời giải chi tiết cho câu hỏi này."}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: QUESTION BANK MANAGEMENT (FULL CRUD - EXPANDED 100% WIDTH) */}
            {activeTab === "bank" && (
              <div className="space-y-4 w-full">
                {/* Bank Header Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 w-full">
                  <div className="flex items-center justify-between flex-wrap gap-2.5">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm câu hỏi, nội dung, đáp án..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* Filter controls */}
                    <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto flex-wrap">
                      {/* Subject */}
                      <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                      >
                        <option value="ALL">Tất cả môn học</option>
                        {SUBJECTS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      {/* Grade */}
                      <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                      >
                        <option value="ALL">Tất cả khối lớp</option>
                        {GRADES.map((g) => (
                          <option key={g.id} value={String(g.id)}>
                            {g.name}
                          </option>
                        ))}
                      </select>

                      {/* Level */}
                      <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
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
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                      >
                        <option value="ALL">Tất cả định dạng</option>
                        {QUESTION_TYPES.map((t) => (
                          <option key={t.id} value={t.short_name}>
                            {t.short_name} - {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select All in Bank */}
                    <button
                      onClick={() => {
                        const filteredIds = filteredBankQuestions.map((q) => q.id);
                        const isAllSelected =
                          filteredIds.length > 0 &&
                          filteredIds.every((id) => selectedBankIds.includes(id));
                        if (isAllSelected) {
                          setSelectedBankIds((prev) =>
                            prev.filter((id) => !filteredIds.includes(id))
                          );
                        } else {
                          setSelectedBankIds((prev) =>
                            Array.from(new Set([...prev, ...filteredIds]))
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {filteredBankQuestions.length > 0 &&
                        filteredBankQuestions.every((q) => selectedBankIds.includes(q.id))
                          ? "Bỏ chọn tất cả"
                          : "Chọn tất cả"}
                      </span>
                    </button>

                    {/* Add Question Button */}
                    <button
                      onClick={handleOpenCreate}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm câu mới</span>
                    </button>
                  </div>

                  {/* Bulk Action Bar: Cho phep tron de hoac xoa tu cac cau hoi duoc chon */}
                  {selectedBankIds.length > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-xs font-medium text-indigo-950">
                          Đang chọn <strong className="font-bold text-indigo-700">{selectedBankIds.length}</strong> câu hỏi
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleShuffleFromBankSelection}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm shadow-emerald-200 transition-all cursor-pointer shrink-0"
                          title="Tạo đề thi và chuyển sang xem trước với đúng các câu hỏi đang chọn này"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Trộn đề từ {selectedBankIds.length} câu đã chọn</span>
                        </button>
                        <button
                          onClick={() => setIsBulkDeleteOpen(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bank Questions Cards List */}
                <div className="space-y-3 w-full">
                  {filteredBankQuestions.map((item, index) => {
                    const isSelected = selectedBankIds.includes(item.id);
                    const levelStyle = getLevelBadge(item.question.level.short_name);
                    const typeStyle = getTypeBadge(item.question.type.short_name);
                    const subjectStyle = getSubjectBadge(item.question.subject);
                    const gradeStyle = getGradeBadge(item.question.grade);

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border p-3.5 sm:p-4 shadow-xs transition-all w-full ${
                          isSelected ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20" : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
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
                              className="w-4 h-4 rounded text-indigo-600 shrink-0"
                            />
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                              Câu {index + 1}
                            </span>
                            <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0 ${subjectStyle.bg}`}>
                              {item.question.subject?.name || "Toán học"}
                            </span>
                            <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0 ${gradeStyle.bg}`}>
                              {item.question.grade?.name || "Khối 12"}
                            </span>
                            <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0 ${levelStyle.bg}`}>
                              {item.question.level.name} ({item.question.level.short_name})
                            </span>
                            <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0 ${typeStyle.bg}`}>
                              {item.question.type.name}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
                            <button
                              onClick={() => setDetailItem(item)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa câu hỏi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="pt-2.5 space-y-1.5">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug break-words">
                            {item.question.question}
                          </p>
                          {item.question.content && (
                            <pre className="font-sans text-xs text-slate-600 whitespace-pre-wrap pl-3 border-l-2 border-slate-200 break-words">
                              {item.question.content}
                            </pre>
                          )}
                          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 flex-wrap gap-1">
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

      {/* Footer (no-print) - Full Width */}
      <footer className="bg-white border-t border-slate-200 py-3.5 sm:py-4 text-center text-xs text-slate-500 no-print mt-auto w-full safe-padding-bottom">
        <div className="w-full px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Phần Mềm Trộn Đề Thi & Quản Lý Ngân Hàng Câu Hỏi © 2026</span>
          <span className="text-slate-400 text-[11px] sm:text-xs">
            Hỗ trợ 4 mức độ (NB, TH, VD, VDC) & 4 dạng câu hỏi (TN, DS, TLN, TL)
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
