"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { ExamItem } from "@/types/question";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemToDelete: ExamItem | null;
  countToDelete?: number;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemToDelete,
  countToDelete = 1,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 safe-padding-top safe-padding-bottom">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-5 sm:p-6 my-auto">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              {itemToDelete
                ? "Xác nhận xóa câu hỏi?"
                : `Xác nhận xóa ${countToDelete} câu hỏi đã chọn?`}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {itemToDelete ? (
                <>
                  Hành động này sẽ xóa câu hỏi{" "}
                  <strong className="text-slate-800 font-semibold">
                    &ldquo;{itemToDelete.question.question.slice(0, 70)}
                    {itemToDelete.question.question.length > 70 ? "..." : ""}&rdquo;
                  </strong>{" "}
                  khỏi ngân hàng đề.
                </>
              ) : (
                `Hành động này sẽ xóa vĩnh viễn ${countToDelete} câu hỏi khỏi danh sách hiện tại.`
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm shadow-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
