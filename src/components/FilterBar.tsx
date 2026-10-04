"use client";

import React from "react";
import { Search, LayoutGrid, List, Trash2, X } from "lucide-react";
import { QUESTION_LEVELS, QUESTION_TYPES } from "@/types/question";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  levelFilter: string;
  onLevelChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  levelFilter,
  onLevelChange,
  typeFilter,
  onTypeChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  onBulkDelete,
  onClearFilters,
}: FilterBarProps) {
  const isFiltered = searchQuery !== "" || levelFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm câu hỏi, nội dung, đáp án hoặc tác giả..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Mức độ:</span>
            <select
              value={levelFilter}
              onChange={(e) => onLevelChange(e.target.value)}
              className="text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tất cả mức độ</option>
              {QUESTION_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.short_name}>
                  {lvl.short_name} - {lvl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Dạng câu:</span>
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              className="text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tất cả định dạng</option>
              {QUESTION_TYPES.map((t) => (
                <option key={t.id} value={t.short_name}>
                  {t.short_name} - {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 ml-auto sm:ml-0">
            <button
              onClick={() => onViewModeChange("card")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "card"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Chế độ Thẻ (Card)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Chế độ Bảng (Table)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (shows when items are checked) */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg animate-in fade-in duration-150">
          <span className="text-xs sm:text-sm font-medium text-indigo-900">
            Đang chọn <strong className="font-bold">{selectedCount}</strong> câu hỏi
          </span>
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Xoá các câu đã chọn</span>
          </button>
        </div>
      )}
    </div>
  );
}
