"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Play,
  FileText,
  AlertCircle,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import historyDataRaw from "@/data/history.json";
import biologyDataRaw from "@/data/biology.json";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Types ---
type MultipleChoiceQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

type TrueFalseStatement = {
  text: string;
  answer: boolean;
  explanation?: string;
};

type TrueFalseQuestion = {
  id: string;
  context: string;
  statements: TrueFalseStatement[];
};

type ShortAnswerQuestion = {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
};

type EssayQuestion = {
  id: string;
  question: string;
  sampleAnswer: string;
};

type QuizData = {
  multipleChoice: MultipleChoiceQuestion[];
  trueFalse: TrueFalseQuestion[];
  shortAnswer?: ShortAnswerQuestion[];
  essay: EssayQuestion[];
};

type AnswersState = {
  mc: Record<string, number>;
  tf: Record<string, Record<number, boolean>>;
  sa: Record<string, string>;
  essay: Record<string, string>;
};

const quizDataMap: Record<string, QuizData> = {
  history: historyDataRaw as QuizData,
  biology: biologyDataRaw as QuizData,
};

// --- Helpers ---
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function QuizApp() {
  const [status, setStatus] = useState<"idle" | "playing" | "results">("idle");
  const [subject, setSubject] = useState<string>("history");
  const [section, setSection] = useState<string>("all");

  const [activeQuestions, setActiveQuestions] = useState<{
    mc: MultipleChoiceQuestion[];
    tf: TrueFalseQuestion[];
    sa: ShortAnswerQuestion[];
    essay: EssayQuestion[];
  }>({ mc: [], tf: [], sa: [], essay: [] });

  const [answers, setAnswers] = useState<AnswersState>({
    mc: {},
    tf: {},
    sa: {},
    essay: {},
  });

  const [showConfirm, setShowConfirm] = useState(false);

  // --- Actions ---
  const startQuiz = () => {
    const data = quizDataMap[subject];

    let selectedMC: MultipleChoiceQuestion[] = [];
    let selectedTF: TrueFalseQuestion[] = [];
    let selectedSA: ShortAnswerQuestion[] = [];
    let selectedEssay: EssayQuestion[] = [];

    if (section === "all" || section === "mc")
      selectedMC = shuffleArray(data.multipleChoice || []);
    if (section === "all" || section === "tf")
      selectedTF = shuffleArray(data.trueFalse || []);
    if (section === "all" || section === "sa")
      selectedSA = shuffleArray(data.shortAnswer || []);
    if (section === "all" || section === "essay")
      selectedEssay = shuffleArray(data.essay || []);

    setActiveQuestions({
      mc: selectedMC,
      tf: selectedTF,
      sa: selectedSA,
      essay: selectedEssay,
    });
    setAnswers({ mc: {}, tf: {}, sa: {}, essay: {} });
    setStatus("playing");
    window.scrollTo(0, 0);
  };

  const submitQuiz = () => {
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    setStatus("results");
    window.scrollTo(0, 0);
  };

  // --- Scoring Logic ---
  const getScore = () => {
    let mcCorrect = 0;
    activeQuestions.mc.forEach((q) => {
      if (answers.mc[q.id] === q.answer) mcCorrect++;
    });

    let tfCorrect = 0;
    let tfTotal = 0;
    activeQuestions.tf.forEach((q) => {
      q.statements.forEach((stmt, idx) => {
        tfTotal++;
        if (answers.tf[q.id]?.[idx] === stmt.answer) tfCorrect++;
      });
    });

    let saCorrect = 0;
    activeQuestions.sa.forEach((q) => {
      const uAns = (answers.sa[q.id] || "").trim().toLowerCase();
      const cAns = q.answer.trim().toLowerCase();
      if (uAns === cAns) saCorrect++;
    });

    return {
      mcCorrect,
      mcTotal: activeQuestions.mc.length,
      tfCorrect,
      tfTotal,
      saCorrect,
      saTotal: activeQuestions.sa.length,
    };
  };

  // --- Renderers ---
  if (status === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-[#f8f9fc] to-[#f0fdf4] animate-gradient-xy flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Selection Card */}
          <Card className="border-0 shadow-2xl shadow-blue-900/5 bg-white rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0084ff] to-[#00d084]"></div>
            <CardHeader className="pb-6 pt-10 px-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#0084ff] text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                <GraduationCap size={28} />
              </div>
              <CardTitle className="text-[28px] font-bold text-[#1a1f36]">
                Bắt đầu ôn tập
              </CardTitle>
              <CardDescription className="text-slate-500 text-[15px] mt-2">
                Thiết lập bài kiểm tra của riêng bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-[13px] font-semibold text-slate-700">Chọn môn học</Label>
                <Select
                  value={subject}
                  onValueChange={(val) => val && setSubject(val)}
                >
                  <SelectTrigger id="subject" className="w-full h-12 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] text-slate-900">
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="history" className="py-3 cursor-pointer">Lịch Sử 11</SelectItem>
                    <SelectItem value="biology" className="py-3 cursor-pointer">Sinh Học 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="section" className="text-[13px] font-semibold text-slate-700">Phần kiến thức</Label>
                <Select
                  value={section}
                  onValueChange={(val) => val && setSection(val)}
                >
                  <SelectTrigger id="section" className="w-full h-12 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] text-slate-900">
                    <SelectValue placeholder="Chọn phần ôn tập" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="py-3 cursor-pointer">Tất cả các phần</SelectItem>
                    <SelectItem value="mc" className="py-3 cursor-pointer">Trắc nghiệm nhiều lựa chọn</SelectItem>
                    <SelectItem value="tf" className="py-3 cursor-pointer">Trắc nghiệm Đúng/Sai</SelectItem>
                    <SelectItem value="sa" className="py-3 cursor-pointer">Trắc nghiệm trả lời ngắn</SelectItem>
                    <SelectItem value="essay" className="py-3 cursor-pointer">Tự luận</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="pt-4 pb-10 px-8">
              <Button
                onClick={startQuiz}
                className="w-full h-14 bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-[16px] rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" />
                Vào Thi Ngay
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  const isReview = status === "results";
  const score = isReview ? getScore() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] via-white to-[#eff6ff] animate-gradient-xy pb-24 font-sans">
      {/* Sticky Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#1a1f36] font-bold text-lg">
            <div className="w-8 h-8 bg-[#0084ff] text-white rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20">
              <GraduationCap size={18} />
            </div>
            <span>Ôn Tập {subject === "history" ? "Lịch Sử" : "Sinh Học"} 11</span>
          </div>
          {isReview && (
            <div className="text-[13px] font-bold text-[#166534] bg-[#f0fdf4] px-4 py-1.5 rounded-full border border-[#00d084] flex items-center gap-2">
              <CheckCircle2 size={16} />
              Đã hoàn thành
            </div>
          )}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12"
      >
        {/* Header / Results Summary */}
        {isReview && score && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00d084] to-[#0084ff]"></div>
            <h2 className="text-[22px] font-bold text-[#1a1f36] mb-6 flex items-center gap-2">
              <Sparkles className="text-[#00d084]" size={24} />
              Kết quả làm bài
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {activeQuestions.mc.length > 0 && (
                <div className="bg-[#f8f9fc] p-5 rounded-2xl border border-slate-100">
                  <div className="text-[13px] font-medium text-slate-500 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0084ff]"></div>
                    Trắc nghiệm
                  </div>
                  <div className="text-[32px] font-bold text-[#1a1f36]">
                    <span className="text-[#0084ff]">{score.mcCorrect}</span> /{" "}
                    {score.mcTotal}{" "}
                    <span className="text-[13px] font-medium text-slate-500">
                      câu đúng
                    </span>
                  </div>
                </div>
              )}
              {activeQuestions.tf.length > 0 && (
                <div className="bg-[#f8f9fc] p-5 rounded-2xl border border-slate-100">
                  <div className="text-[13px] font-medium text-slate-500 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                    Đúng/Sai
                  </div>
                  <div className="text-[32px] font-bold text-[#1a1f36]">
                    <span className="text-[#6366f1]">{score.tfCorrect}</span> /{" "}
                    {score.tfTotal}{" "}
                    <span className="text-[13px] font-medium text-slate-500">
                      ý đúng
                    </span>
                  </div>
                </div>
              )}
              {activeQuestions.sa.length > 0 && (
                <div className="bg-[#f8f9fc] p-5 rounded-2xl border border-slate-100">
                  <div className="text-[13px] font-medium text-slate-500 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00d084]"></div>
                    Trả lời ngắn
                  </div>
                  <div className="text-[32px] font-bold text-[#1a1f36]">
                    <span className="text-[#00d084]">{score.saCorrect}</span> /{" "}
                    {score.saTotal}{" "}
                    <span className="text-[13px] font-medium text-slate-500">
                      câu đúng
                    </span>
                  </div>
                </div>
              )}
          </div>
          <p className="text-[13px] text-slate-500 italic">
            * Phần tự luận vui lòng tự đối chiếu với đáp án mẫu bên dưới.
          </p>
        </div>
      )}

      <div className="space-y-12">
        {/* Phần I: Trắc nghiệm */}
        {activeQuestions.mc.length > 0 && (
          <section>
            <h2 className="text-[20px] font-bold text-[#1a1f36] mb-6 flex items-center gap-3">
              <span className="bg-[#1a1f36] text-white w-8 h-8 rounded-full flex items-center justify-center text-[15px]">
                I
              </span>
              Trắc nghiệm nhiều lựa chọn
            </h2>
            <div className="space-y-6">
              {activeQuestions.mc.map((q, index) => {
                const userAnswer = answers.mc[q.id];
                const isCorrect = userAnswer === q.answer;
                const hasAnswered = userAnswer !== undefined;

                return (
                  <div
                    key={q.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <p className="font-medium text-[#1a1f36] text-[15px] leading-relaxed">
                        <span className="text-slate-500 mr-2">
                          Câu {index + 1}:
                        </span>
                        {q.question}
                      </p>
                      {isReview && (
                        <div
                          className={`ml-4 px-3 py-1 rounded-full text-[12px] font-bold whitespace-nowrap flex items-center gap-1.5 ${
                            !hasAnswered
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : isCorrect
                                ? "bg-[#f0fdf4] text-[#166534] border border-[#00d084]"
                                : "bg-[#fef2f2] text-[#991b1b] border border-[#ef4444]"
                          }`}
                        >
                          {!hasAnswered
                            ? "Chưa trả lời"
                            : isCorrect
                              ? <><CheckCircle2 size={14} /> Đúng</>
                              : <><XCircle size={14} /> Sai</>}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswer === optIdx;
                        const isActualAnswer = q.answer === optIdx;

                        let btnClass =
                          "w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ";

                        if (isReview) {
                          if (isActualAnswer) {
                            btnClass +=
                              "bg-[#f0fdf4] border-[#00d084] text-[#166534]";
                          } else if (isSelected && !isActualAnswer) {
                            btnClass += "bg-[#fef2f2] border-[#ef4444] text-[#991b1b]";
                          } else {
                            btnClass +=
                              "bg-white border-slate-100 text-slate-500 opacity-50";
                          }
                        } else {
                          btnClass += isSelected
                            ? "bg-[#eff6ff] border-[#0084ff] text-[#1e3a8a]"
                            : "bg-white border-slate-200 hover:border-[#0084ff] hover:bg-[#f8f9fc] text-[#1a1f36]";
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isReview}
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                mc: { ...prev.mc, [q.id]: optIdx },
                              }))
                            }
                            className={btnClass}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 ${
                              isReview 
                                ? isActualAnswer 
                                  ? "bg-[#00d084] text-white" 
                                  : isSelected 
                                    ? "bg-[#ef4444] text-white" 
                                    : "bg-slate-100 text-slate-400"
                                : isSelected
                                  ? "bg-[#0084ff] text-white"
                                  : "bg-slate-100 text-slate-600"
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="flex-1 text-[15px]">{opt}</span>
                            {isReview && isActualAnswer && (
                              <CheckCircle2
                                className="text-[#00d084] shrink-0"
                                size={22}
                              />
                            )}
                            {isReview && isSelected && !isActualAnswer && (
                              <XCircle
                                className="text-[#ef4444] shrink-0"
                                size={22}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Phần II: Đúng/Sai */}
        {activeQuestions.tf.length > 0 && (
          <section>
            <h2 className="text-[20px] font-bold text-[#1a1f36] mb-6 flex items-center gap-3">
              <span className="bg-[#1a1f36] text-white w-8 h-8 rounded-full flex items-center justify-center text-[15px]">
                II
              </span>
              Trắc nghiệm Đúng/Sai
            </h2>
            <div className="space-y-8">
              {activeQuestions.tf.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="mb-6">
                    <span className="font-medium text-[#1a1f36] mr-2">
                      Câu {index + 1}:
                    </span>
                    <span className="text-slate-500 italic">
                      Đọc đoạn tư liệu sau:
                    </span>
                    <p className="mt-4 text-[#1a1f36] bg-[#f8f9fc] p-5 rounded-xl border border-slate-100 text-[15px] leading-relaxed">
                      {q.context}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {q.statements.map((stmt, stmtIdx) => {
                      const userAnswer = answers.tf[q.id]?.[stmtIdx];
                      const isCorrect = userAnswer === stmt.answer;
                      const hasAnswered = userAnswer !== undefined;

                      const getTfBtnClass = (isTrueBtn: boolean) => {
                        const isSelected = userAnswer === isTrueBtn;
                        const isActualAnswer = stmt.answer === isTrueBtn;
                        let base =
                          "px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all border-2 ";

                        if (isReview) {
                          if (isActualAnswer && isSelected)
                            return (
                              base + "bg-[#00d084] text-white border-[#00d084]"
                            );
                          if (isSelected && !isActualAnswer)
                            return (
                              base + "bg-[#ef4444] text-white border-[#ef4444]"
                            );
                          if (isActualAnswer && !isSelected)
                            return (
                              base +
                              "bg-[#f0fdf4] text-[#166534] border-[#00d084]"
                            );
                          return (
                            base +
                            "bg-white text-slate-400 border-slate-100 opacity-50"
                          );
                        }

                        if (isSelected)
                          return (
                            base + "bg-[#0084ff] text-white border-[#0084ff]"
                          );
                        return (
                          base +
                          "bg-white text-slate-600 border-slate-200 hover:border-[#0084ff] hover:bg-[#f8f9fc]"
                        );
                      };

                      return (
                        <div
                          key={stmtIdx}
                          className="flex flex-col gap-3 p-5 rounded-xl border border-slate-100 bg-white shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 text-[#1a1f36] text-[15px] leading-relaxed">
                              <span className="font-bold mr-3 text-[#0084ff]">
                                {String.fromCharCode(97 + stmtIdx)}.
                              </span>
                              {stmt.text}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                disabled={isReview}
                                onClick={() =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    tf: {
                                      ...prev.tf,
                                      [q.id]: {
                                        ...(prev.tf[q.id] || {}),
                                        [stmtIdx]: true,
                                      },
                                    },
                                  }))
                                }
                                className={getTfBtnClass(true)}
                              >
                                Đúng
                              </button>
                              <button
                                disabled={isReview}
                                onClick={() =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    tf: {
                                      ...prev.tf,
                                      [q.id]: {
                                        ...(prev.tf[q.id] || {}),
                                        [stmtIdx]: false,
                                      },
                                    },
                                  }))
                                }
                                className={getTfBtnClass(false)}
                              >
                                Sai
                              </button>

                              {/* Review Icon */}
                              {isReview && (
                                <div className="w-[100px] ml-2 flex justify-end">
                                  {!hasAnswered ? (
                                    <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 whitespace-nowrap">
                                      Chưa trả lời
                                    </span>
                                  ) : isCorrect ? (
                                    <span className="text-[12px] font-bold text-[#166534] bg-[#f0fdf4] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#00d084] whitespace-nowrap">
                                      <CheckCircle2 size={14} /> Đúng
                                    </span>
                                  ) : (
                                    <span className="text-[12px] font-bold text-[#991b1b] bg-[#fef2f2] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#ef4444] whitespace-nowrap">
                                      <XCircle size={14} /> Sai
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {isReview && stmt.explanation && (
                            <div className="mt-3 text-[14px] text-slate-600 bg-[#f8f9fc] p-4 rounded-xl border border-slate-100 leading-relaxed">
                              <span className="font-bold text-[#1a1f36]">
                                Giải thích:
                              </span>{" "}
                              {stmt.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Phần III: Trả lời ngắn */}
        {activeQuestions.sa.length > 0 && (
          <section>
            <h2 className="text-[20px] font-bold text-[#1a1f36] mb-6 flex items-center gap-3">
              <span className="bg-[#1a1f36] text-white w-8 h-8 rounded-full flex items-center justify-center text-[15px]">
                III
              </span>
              Trắc nghiệm trả lời ngắn
            </h2>
            <div className="space-y-6">
              {activeQuestions.sa.map((q, index) => {
                const userAnswer = answers.sa[q.id] || "";
                const isCorrect =
                  userAnswer.trim().toLowerCase() ===
                  q.answer.trim().toLowerCase();
                const hasAnswered = userAnswer.trim().length > 0;

                return (
                  <div
                    key={q.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <p className="font-medium text-[#1a1f36] text-[15px] leading-relaxed">
                        <span className="text-slate-500 mr-2">
                          Câu {index + 1}:
                        </span>
                        {q.question}
                      </p>
                      {isReview && (
                        <div
                          className={`ml-4 px-3 py-1 rounded-full text-[12px] font-bold whitespace-nowrap flex items-center gap-1.5 ${
                            !hasAnswered
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : isCorrect
                                ? "bg-[#f0fdf4] text-[#166534] border border-[#00d084]"
                                : "bg-[#fef2f2] text-[#991b1b] border border-[#ef4444]"
                          }`}
                        >
                          {!hasAnswered
                            ? "Chưa trả lời"
                            : isCorrect
                              ? <><CheckCircle2 size={14} /> Đúng</>
                              : <><XCircle size={14} /> Sai</>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Input
                        disabled={isReview}
                        value={userAnswer}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            sa: { ...prev.sa, [q.id]: e.target.value },
                          }))
                        }
                        className={`w-full h-12 px-4 rounded-xl border-2 outline-none transition-all text-[15px] ${
                          isReview
                            ? isCorrect
                              ? "bg-[#f0fdf4] border-[#00d084] text-[#166534]"
                              : "bg-[#fef2f2] border-[#ef4444] text-[#991b1b]"
                            : "bg-white border-slate-200 focus:border-[#0084ff] focus:ring-4 focus:ring-blue-500/10"
                        }`}
                        placeholder="Nhập câu trả lời..."
                      />

                      {isReview && !isCorrect && (
                        <div className="text-[14px] font-bold text-[#166534] bg-[#f0fdf4] p-4 rounded-xl border border-[#00d084] flex items-center gap-2">
                          <CheckCircle2 size={18} />
                          Đáp án đúng: {q.answer}
                        </div>
                      )}

                      {isReview && q.explanation && (
                        <div className="text-[14px] text-slate-600 bg-[#f8f9fc] p-4 rounded-xl border border-slate-100 leading-relaxed">
                          <span className="font-bold text-[#1a1f36]">
                            Giải thích:
                          </span>{" "}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Phần IV: Tự luận */}
        {activeQuestions.essay.length > 0 && (
          <section>
            <h2 className="text-[20px] font-bold text-[#1a1f36] mb-6 flex items-center gap-3">
              <span className="bg-[#1a1f36] text-white w-8 h-8 rounded-full flex items-center justify-center text-[15px]">
                IV
              </span>
              Tự luận
            </h2>
            <div className="space-y-6">
              {activeQuestions.essay.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                  <p className="font-medium text-[#1a1f36] text-[15px] leading-relaxed mb-6">
                    <span className="text-slate-500 mr-2">
                      Câu {index + 1}:
                    </span>
                    {q.question}
                  </p>

                  <div
                    className={`grid gap-6 ${isReview ? "md:grid-cols-2" : "grid-cols-1"}`}
                  >
                    {/* User Input */}
                    <div>
                      <Label className="block text-[13px] font-bold text-slate-700 mb-3">
                        Bài làm của bạn:
                      </Label>
                      <Textarea
                        disabled={isReview}
                        value={answers.essay[q.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            essay: { ...prev.essay, [q.id]: e.target.value },
                          }))
                        }
                        className="w-full h-48 p-4 rounded-xl border-2 border-slate-200 focus:border-[#0084ff] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none disabled:bg-[#f8f9fc] disabled:text-slate-600 text-[15px] leading-relaxed"
                        placeholder="Nhập câu trả lời của bạn vào đây..."
                      />
                    </div>

                    {/* Sample Answer (Only in Review) */}
                    {isReview && (
                      <div className="animate-in fade-in slide-in-from-right-4">
                        <label className="block text-[13px] font-bold text-[#166534] mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          Đáp án tham khảo:
                        </label>
                        <div className="w-full h-48 p-5 rounded-xl border border-[#00d084] bg-[#f0fdf4] text-[#166534] overflow-y-auto text-[15px] leading-relaxed">
                          {q.sampleAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>

    {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-5xl mx-auto flex justify-end gap-4">
          {status === "playing" ? (
            <Button
              onClick={submitQuiz}
              className="bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-[15px] h-12 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              Nộp bài & Kiểm tra
            </Button>
          ) : (
            <Button
              onClick={startQuiz}
              className="bg-[#1a1f36] hover:bg-slate-800 text-white font-bold text-[15px] h-12 px-8 rounded-xl transition-all shadow-lg shadow-slate-900/25 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Làm đề mới
            </Button>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1a1f36]">Xác nhận nộp bài</DialogTitle>
            <DialogDescription className="text-[15px] text-slate-500 mt-2">
              Bạn có chắc chắn muốn nộp bài và xem kết quả không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 justify-end sm:justify-end mt-6">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="h-11 px-6 rounded-xl font-bold text-slate-600 border-slate-200">
              Hủy
            </Button>
            <Button
              onClick={confirmSubmit}
              className="h-11 px-6 rounded-xl bg-[#0084ff] text-white hover:bg-blue-600 font-bold shadow-md shadow-blue-500/20"
            >
              Nộp bài
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
