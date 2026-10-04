"use client";

import React, { useState } from "react";
import { ExamItem } from "@/types/question";
import { shuffleArray } from "@/utils/helpers";
import {
  Shuffle,
  X,
  Printer,
  TableProperties,
  FileText,
  CheckCircle,
  Copy,
  Sparkles,
} from "lucide-react";

interface ExamShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: ExamItem[];
}

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

export default function ExamShuffleModal({
  isOpen,
  onClose,
  questions,
}: ExamShuffleModalProps) {
  const [examTitle, setExamTitle] = useState("KIỂM TRA CHẤT LƯỢNG ĐỊNH KỲ");
  const [schoolName, setSchoolName] = useState("TRƯỜNG THPT CHUYÊN");
  const [examSubject, setExamSubject] = useState("MÔN: TOÁN HỌC");
  const [duration, setDuration] = useState("45");
  const [numVariants, setNumVariants] = useState<number>(4);
  const [shuffleChoices, setShuffleChoices] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"preview" | "matrix">("preview");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [generatedExams, setGeneratedExams] = useState<ExamVariant[]>([]);
  const [copiedMatrix, setCopiedMatrix] = useState(false);

  // Shuffle multiple choices for TN type
  const shuffleOptionsForQuestion = (
    content: string,
    correctAnswer: string
  ): { content: string; answer: string } => {
    // If not standard A. B. C. D. format, return as is
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    const optionRegex = /^([A-D])[\.\:\s](.*)$/i;
    const isStandardOptions =
      lines.length >= 2 && lines.every((line) => optionRegex.test(line.trim()));

    if (!isStandardOptions || !shuffleChoices) {
      return { content, answer: correctAnswer };
    }

    // Extract options
    const parsedOptions = lines.map((l) => {
      const match = l.trim().match(optionRegex);
      return {
        originalLetter: match ? match[1].toUpperCase() : "",
        text: match ? match[2].trim() : l,
      };
    });

    // Shuffle options
    const shuffled = shuffleArray(parsedOptions);
    const letters = ["A", "B", "C", "D", "E", "F"];

    // Find new correct answer letter
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

  const handleGenerate = () => {
    if (questions.length === 0) return;

    const variants: ExamVariant[] = [];
    const baseCodes = [101, 102, 103, 104, 105, 106, 107, 108];

    for (let i = 0; i < numVariants; i++) {
      const code = baseCodes[i] ? `${baseCodes[i]}` : `${100 + i + 1}`;
      // Shuffle question order
      const shuffledQuestions = shuffleArray(questions).map((q) => {
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
        questions: shuffledQuestions,
      });
    }

    setGeneratedExams(variants);
    setSelectedVariantIndex(0);
  };

  if (!isOpen) return null;

  const currentExam = generatedExams[selectedVariantIndex];

  const handleCopyMatrix = () => {
    if (generatedExams.length === 0) return;
    let text = `BẢNG ĐÁP ÁN CÁC MÃ ĐỀ (${examTitle})\n`;
    text += `Câu\t` + generatedExams.map((v) => `Mã ${v.code}`).join("\t") + "\n";

    for (let i = 0; i < questions.length; i++) {
      text += `Câu ${i + 1}\t`;
      text += generatedExams.map((v) => v.questions[i]?.answer || "-").join("\t");
      text += "\n";
    }

    navigator.clipboard.writeText(text);
    setCopiedMatrix(true);
    setTimeout(() => setCopiedMatrix(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Thuật Toán Trộn Đề Thi Tự Động
              </h2>
              <p className="text-xs text-slate-500">
                Xáo trộn thứ tự câu hỏi và hoán vị đáp án ngẫu nhiên cho nhiều mã đề
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Tiêu đề kỳ thi
              </label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Đơn vị / Trường học
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Môn học
              </label>
              <input
                type="text"
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Thời gian (phút)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Số lượng mã đề cần tạo
              </label>
              <select
                value={numVariants}
                onChange={(e) => setNumVariants(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold cursor-pointer"
              >
                <option value={2}>2 mã đề (101, 102)</option>
                <option value={4}>4 mã đề (101 - 104)</option>
                <option value={6}>6 mã đề (101 - 106)</option>
                <option value={8}>8 mã đề (101 - 108)</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={handleGenerate}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tiến hành trộn đề ngay</span>
              </button>
            </div>
          </div>

          {/* Shuffle Options */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleChoices}
                onChange={(e) => setShuffleChoices(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600"
              />
              <span>Đảo ngẫu nhiên các phương án A, B, C, D (cho trắc nghiệm)</span>
            </label>
          </div>

          {/* If generated */}
          {generatedExams.length > 0 && (
            <div className="space-y-4">
              {/* Tabs & View switcher */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeTab === "preview"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Xem nội dung đề thi</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("matrix")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeTab === "matrix"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <TableProperties className="w-3.5 h-3.5" />
                    <span>Bảng ma trận đáp án</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In / Xuất đề</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Preview Variant */}
              {activeTab === "preview" && currentExam && (
                <div>
                  {/* Variant Selector */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                    <span className="text-xs font-semibold text-slate-500">Mã đề:</span>
                    {generatedExams.map((v, idx) => (
                      <button
                        key={v.code}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-3 py-1 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                          selectedVariantIndex === idx
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        Đề #{v.code}
                      </button>
                    ))}
                  </div>

                  {/* Printable Exam Paper Container */}
                  <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-xs max-w-4xl mx-auto space-y-6">
                    {/* Exam Paper Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                      <div className="text-center font-bold text-xs space-y-1">
                        <p className="uppercase">{schoolName}</p>
                        <p className="text-slate-500 font-normal">TỔ BỘ MÔN</p>
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wide">
                          {examTitle}
                        </h3>
                        <p className="text-xs font-semibold">{examSubject}</p>
                        <p className="text-xs text-slate-500">
                          Thời gian làm bài: {duration} phút (Không kể phát đề)
                        </p>
                      </div>
                      <div className="border-2 border-slate-900 rounded-lg px-3 py-1.5 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Mã đề</p>
                        <p className="text-lg font-black text-indigo-700">{currentExam.code}</p>
                      </div>
                    </div>

                    <div className="text-xs italic text-slate-500 text-center">
                      (Đề thi gồm {currentExam.questions.length} câu hỏi)
                    </div>

                    {/* Questions List */}
                    <div className="space-y-5 pt-2">
                      {currentExam.questions.map((q, idx) => (
                        <div key={idx} className="space-y-1.5 text-xs sm:text-sm">
                          <p className="font-semibold text-slate-900 leading-relaxed">
                            <span className="font-bold text-indigo-700">Câu {idx + 1}:</span>{" "}
                            {q.questionText}
                            <span className="ml-2 text-[10px] text-slate-400 font-normal">
                              [{q.type}]
                            </span>
                          </p>
                          {q.contentText && (
                            <pre className="font-sans text-xs text-slate-700 whitespace-pre-wrap pl-4 border-l-2 border-slate-200 py-1">
                              {q.contentText}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-xs text-slate-400 pt-6 border-t border-slate-200">
                      --- HẾT ---
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Answer Matrix */}
              {activeTab === "matrix" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600 font-medium">
                      Bảng tổng hợp đáp án đối chiếu giữa các mã đề được trộn:
                    </p>
                    <button
                      onClick={handleCopyMatrix}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedMatrix ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMatrix ? "Đã sao chép!" : "Sao chép bảng"}</span>
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-16">Câu</th>
                          {generatedExams.map((v) => (
                            <th key={v.code} className="p-3 bg-indigo-50/50 text-indigo-900 font-extrabold">
                              Mã đề {v.code}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {questions.map((_, qIdx) => (
                          <tr key={qIdx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-600">
                              Câu {qIdx + 1}
                            </td>
                            {generatedExams.map((v) => (
                              <td key={v.code} className="p-2.5 font-bold text-emerald-700">
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
            </div>
          )}

          {generatedExams.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Shuffle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Sẵn sàng trộn {questions.length} câu hỏi
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                Nhấn vào nút &ldquo;Tiến hành trộn đề ngay&rdquo; ở trên để thuật toán tự động sinh ra các mã đề thi ngẫu nhiên và bảng đáp án đối chiếu.
              </p>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tiến hành trộn đề ngay</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-end bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
