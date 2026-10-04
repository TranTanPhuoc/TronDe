"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { ExamItem } from "@/types/question";
import { initialQuestions } from "@/data/mockQuestions";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import FilterBar from "@/components/FilterBar";
import QuestionCard from "@/components/QuestionCard";
import QuestionTable from "@/components/QuestionTable";
import QuestionModal from "@/components/QuestionModal";
import QuestionDetailModal from "@/components/QuestionDetailModal";
import ExamShuffleModal from "@/components/ExamShuffleModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Plus, Inbox, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "phan_mem_tron_de_questions_v1";
const emptySubscribe = () => () => {};

export default function Home() {
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

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
      } catch (err) {
        console.error("Failed to load questions from localStorage:", err);
      }
    }
    return initialQuestions;
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExamItem | null>(null);
  const [detailItem, setDetailItem] = useState<ExamItem | null>(null);
  const [isShuffleOpen, setIsShuffleOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExamItem | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save to localStorage when questions change
  const saveQuestions = (newQuestions: ExamItem[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuestions));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      // Level filter
      if (levelFilter !== "ALL" && item.question.level.short_name !== levelFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== "ALL" && item.question.type.short_name !== typeFilter) {
        return false;
      }
      // Search query
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

  // CRUD Handlers
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
      showToast("Đã thêm câu hỏi mới vào ngân hàng!");
    }
    saveQuestions(updated);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    const updated = questions.filter((q) => q.id !== itemToDelete.id);
    setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id));
    saveQuestions(updated);
    setItemToDelete(null);
    showToast("Đã xóa câu hỏi khỏi ngân hàng!");
  };

  const handleConfirmBulkDelete = () => {
    const updated = questions.filter((q) => !selectedIds.includes(q.id));
    saveQuestions(updated);
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
    showToast(`Đã xóa ${selectedIds.length} câu hỏi thành công!`);
  };

  // Selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  // Export clean JSON matching exact user schema
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
        level: {
          id: question.level.id,
          name: question.level.name,
          short_name: question.level.short_name,
        },
        type: {
          id: question.type.id,
          name: question.type.name,
          short_name: question.type.short_name,
        },
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

  // Import JSON
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
            name: item.author?.name || "Tran Tan Phuoc",
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
        showToast(`Đã nhập thành công ${imported.length} câu hỏi mới!`);
      } catch {
        alert("Lỗi khi đọc file JSON. Vui lòng kiểm tra định dạng file!");
      }
    };
    reader.readAsText(file);
  };

  // Reset to default sample
  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn đặt lại ngân hàng câu hỏi về dữ liệu mẫu ban đầu?")) {
      saveQuestions(initialQuestions);
      setSelectedIds([]);
      showToast("Đã khôi phục dữ liệu mẫu ban đầu!");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        totalQuestions={questions.length}
        onOpenCreateModal={handleOpenCreate}
        onOpenShuffleModal={() => setIsShuffleOpen(true)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetData={handleResetData}
      />

      {/* Page Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Stats Cards */}
        <StatsCards
          questions={questions}
          activeLevelFilter={levelFilter}
          activeTypeFilter={typeFilter}
          onSelectLevel={(lvl) => setLevelFilter(lvl)}
          onSelectType={(t) => setTypeFilter(t)}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedIds.length}
          onBulkDelete={() => setIsBulkDeleteOpen(true)}
          onClearFilters={() => {
            setSearchQuery("");
            setLevelFilter("ALL");
            setTypeFilter("ALL");
          }}
        />

        {/* Questions Display */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy câu hỏi phù hợp
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              Không có câu hỏi nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Bạn có thể xóa bộ lọc hoặc thêm câu hỏi mới.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi ngay</span>
            </button>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((item, index) => (
              <QuestionCard
                key={item.id}
                item={item}
                index={index}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={handleToggleSelect}
                onViewDetail={(q) => setDetailItem(q)}
                onEdit={handleOpenEdit}
                onDelete={(q) => setItemToDelete(q)}
              />
            ))}
          </div>
        ) : (
          <QuestionTable
            questions={filteredQuestions}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewDetail={(q) => setDetailItem(q)}
            onEdit={handleOpenEdit}
            onDelete={(q) => setItemToDelete(q)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Phần Mềm Trộn Đề Thi & Quản Lý Câu Hỏi © 2026</span>
          <span className="text-slate-400">
            Hỗ trợ 4 mức độ (NB, TH, VD, VDC) & 4 dạng câu hỏi (TN, DS, TLN, TL)
          </span>
        </div>
      </footer>

      {/* Create / Edit Modal (C & U) */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        editingItem={editingItem}
      />

      {/* Detail Modal (R) */}
      <QuestionDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={handleOpenEdit}
      />

      {/* Delete Confirmation Modal (D) */}
      <DeleteConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        itemToDelete={itemToDelete}
      />

      {/* Bulk Delete Confirmation Modal (D) */}
      <DeleteConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        itemToDelete={null}
        countToDelete={selectedIds.length}
      />

      {/* Exam Shuffler Modal */}
      <ExamShuffleModal
        isOpen={isShuffleOpen}
        onClose={() => setIsShuffleOpen(false)}
        questions={questions}
      />
    </div>
  );
}
