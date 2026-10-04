"use client";

import React, { useRef } from "react";
import {
  Shuffle,
  Plus,
  Upload,
  Download,
  RotateCcw,
  BookOpenCheck,
} from "lucide-react";

interface HeaderProps {
  totalQuestions: number;
  onOpenCreateModal: () => void;
  onOpenShuffleModal: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetData: () => void;
}

export default function Header({
  totalQuestions,
  onOpenCreateModal,
  onOpenShuffleModal,
  onExportJson,
  onImportJson,
  onResetData,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = "";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 flex-wrap gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Phần Mềm Trộn Đề Thi
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Quản lý ngân hàng câu hỏi & Trộn đề thi trắc nghiệm thông minh
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Nhập dữ liệu câu hỏi từ file JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Nhập JSON</span>
            </button>

            <button
              onClick={onExportJson}
              title="Xuất ngân hàng câu hỏi ra file JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Xuất JSON</span>
            </button>

            <button
              onClick={onResetData}
              title="Khôi phục lại danh sách câu hỏi mẫu ban đầu"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline">Dữ liệu mẫu</span>
            </button>

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi</span>
            </button>

            <button
              onClick={onOpenShuffleModal}
              disabled={totalQuestions === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm shadow-emerald-200 transition-all hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Trộn đề thi</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
