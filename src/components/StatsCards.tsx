"use client";

import React from "react";
import { ExamItem } from "@/types/question";
import { Layers, CheckCircle2, Award, FileSpreadsheet } from "lucide-react";

interface StatsCardsProps {
  questions: ExamItem[];
  activeLevelFilter: string;
  activeTypeFilter: string;
  onSelectLevel: (level: string) => void;
  onSelectType: (type: string) => void;
}

export default function StatsCards({
  questions,
  activeLevelFilter,
  activeTypeFilter,
  onSelectLevel,
  onSelectType,
}: StatsCardsProps) {
  const total = questions.length;

  const countByLevel = {
    NB: questions.filter((q) => q.question.level.short_name === "NB").length,
    TH: questions.filter((q) => q.question.level.short_name === "TH").length,
    VD: questions.filter((q) => q.question.level.short_name === "VD").length,
    VDC: questions.filter((q) => q.question.level.short_name === "VDC").length,
  };

  const countByType = {
    TN: questions.filter((q) => q.question.type.short_name === "TN").length,
    DS: questions.filter((q) => q.question.type.short_name === "DS").length,
    TLN: questions.filter((q) => q.question.type.short_name === "TLN").length,
    TL: questions.filter((q) => q.question.type.short_name === "TL").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Tổng số câu hỏi
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500 font-medium">câu trong kho</span>
          </div>
          <p className="text-xs text-indigo-600 mt-2 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng tạo đề thi
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Layers className="w-6 h-6" />
        </div>
      </div>

      {/* Levels Breakdown */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Mức độ nhận thức
          </p>
          <Award className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onSelectLevel(activeLevelFilter === "NB" ? "ALL" : "NB")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeLevelFilter === "NB"
                ? "bg-emerald-100 border border-emerald-300 ring-2 ring-emerald-500/20"
                : "bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-100"
            }`}
          >
            <div className="text-base font-bold text-emerald-700">{countByLevel.NB}</div>
            <div className="text-[10px] font-semibold text-emerald-800">NB</div>
          </button>
          <button
            onClick={() => onSelectLevel(activeLevelFilter === "TH" ? "ALL" : "TH")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeLevelFilter === "TH"
                ? "bg-blue-100 border border-blue-300 ring-2 ring-blue-500/20"
                : "bg-blue-50/70 hover:bg-blue-100/60 border border-blue-100"
            }`}
          >
            <div className="text-base font-bold text-blue-700">{countByLevel.TH}</div>
            <div className="text-[10px] font-semibold text-blue-800">TH</div>
          </button>
          <button
            onClick={() => onSelectLevel(activeLevelFilter === "VD" ? "ALL" : "VD")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeLevelFilter === "VD"
                ? "bg-amber-100 border border-amber-300 ring-2 ring-amber-500/20"
                : "bg-amber-50/70 hover:bg-amber-100/60 border border-amber-100"
            }`}
          >
            <div className="text-base font-bold text-amber-700">{countByLevel.VD}</div>
            <div className="text-[10px] font-semibold text-amber-800">VD</div>
          </button>
          <button
            onClick={() => onSelectLevel(activeLevelFilter === "VDC" ? "ALL" : "VDC")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeLevelFilter === "VDC"
                ? "bg-rose-100 border border-rose-300 ring-2 ring-rose-500/20"
                : "bg-rose-50/70 hover:bg-rose-100/60 border border-rose-100"
            }`}
          >
            <div className="text-base font-bold text-rose-700">{countByLevel.VDC}</div>
            <div className="text-[10px] font-semibold text-rose-800">VDC</div>
          </button>
        </div>
      </div>

      {/* Types Breakdown */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Định dạng câu hỏi
          </p>
          <FileSpreadsheet className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onSelectType(activeTypeFilter === "TN" ? "ALL" : "TN")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTypeFilter === "TN"
                ? "bg-indigo-100 border border-indigo-300 ring-2 ring-indigo-500/20"
                : "bg-indigo-50/70 hover:bg-indigo-100/60 border border-indigo-100"
            }`}
          >
            <div className="text-base font-bold text-indigo-700">{countByType.TN}</div>
            <div className="text-[10px] font-semibold text-indigo-800">TN</div>
          </button>
          <button
            onClick={() => onSelectType(activeTypeFilter === "DS" ? "ALL" : "DS")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTypeFilter === "DS"
                ? "bg-cyan-100 border border-cyan-300 ring-2 ring-cyan-500/20"
                : "bg-cyan-50/70 hover:bg-cyan-100/60 border border-cyan-100"
            }`}
          >
            <div className="text-base font-bold text-cyan-700">{countByType.DS}</div>
            <div className="text-[10px] font-semibold text-cyan-800">DS</div>
          </button>
          <button
            onClick={() => onSelectType(activeTypeFilter === "TLN" ? "ALL" : "TLN")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTypeFilter === "TLN"
                ? "bg-purple-100 border border-purple-300 ring-2 ring-purple-500/20"
                : "bg-purple-50/70 hover:bg-purple-100/60 border border-purple-100"
            }`}
          >
            <div className="text-base font-bold text-purple-700">{countByType.TLN}</div>
            <div className="text-[10px] font-semibold text-purple-800">TLN</div>
          </button>
          <button
            onClick={() => onSelectType(activeTypeFilter === "TL" ? "ALL" : "TL")}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTypeFilter === "TL"
                ? "bg-orange-100 border border-orange-300 ring-2 ring-orange-500/20"
                : "bg-orange-50/70 hover:bg-orange-100/60 border border-orange-100"
            }`}
          >
            <div className="text-base font-bold text-orange-700">{countByType.TL}</div>
            <div className="text-[10px] font-semibold text-orange-800">TL</div>
          </button>
        </div>
      </div>
    </div>
  );
}
