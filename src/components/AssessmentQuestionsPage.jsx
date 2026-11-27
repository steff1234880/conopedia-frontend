import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    category: 'Pharmacological & Parenteral Therapies',
    stem: 'A nurse is preparing to administer digoxin 0.125 mg PO to an adult client with heart failure. Which clinical finding requires the nurse to withhold the medication and notify the healthcare provider immediately?',
    options: [
      { id: 'A', text: 'Apical heart rate of 52 beats/minute' },
      { id: 'B', text: 'Blood pressure of 128/78 mm Hg' },
      { id: 'C', text: 'Serum potassium level of 4.2 mEq/L' },
      { id: 'D', text: 'Respiratory rate of 18 breaths/minute' },
    ],
    correctOptionId: 'A',
    rationale:
      'Digoxin slows AV node conduction and decreases heart rate. In adults, an apical pulse below 60 beats/minute is a critical threshold requiring the nurse to hold the dose and notify the provider to prevent severe bradycardia or heart block.',
  },
  {
    id: 2,
    category: 'Management of Care · Prioritization',
    stem: 'A charge nurse on a medical-surgical unit receives change-of-shift report on four clients. Which client should the nurse assess first?',
    options: [
      { id: 'A', text: 'A client 2 days postoperative cholecystectomy reporting incisional pain rated 6/10' },
      { id: 'B', text: 'A client with pneumonia who has newly onset restlessness and SpO₂ of 88% on room air' },
      { id: 'C', text: 'A client with type 2 diabetes mellitus awaiting breakfast with blood glucose of 148 mg/dL' },
      { id: 'D', text: 'A client scheduled for discharge requesting clarification on home wound care supplies' },
    ],
    correctOptionId: 'B',
    rationale:
      'Using the ABC (Airway, Breathing, Circulation) framework, acute restlessness combined with SpO₂ of 88% indicates hypoxemia requiring immediate bedside assessment and oxygen intervention.',
  },
  {
    id: 3,
    category: 'Safety & Infection Control',
    stem: 'A nurse is caring for a client diagnosed with pulmonary tuberculosis. Which infection control precaution must the nurse implement?',
    options: [
      { id: 'A', text: 'Place the client in a standard semiprivate room with droplet precautions' },
      { id: 'B', text: 'Wear a surgical mask when entering within 3 feet of the client' },
      { id: 'C', text: 'Assign the client to a negative-pressure airborne infection isolation room and wear an N95 respirator' },
      { id: 'D', text: 'Keep the room door open to maintain continuous corridor ventilation' },
    ],
    correctOptionId: 'C',
    rationale:
      'Mycobacterium tuberculosis is transmitted via airborne droplet nuclei. Airborne precautions require a negative-pressure isolation room with closed doors and fit-tested N95 or higher-level respiratory protection.',
  },
  {
    id: 4,
    category: 'Physiological Adaptation · Fluid & Electrolytes',
    stem: 'A nurse reviews laboratory results for a client receiving intravenous furosemide. Which finding places the client at highest risk for life-threatening cardiac dysrhythmias?',
    options: [
      { id: 'A', text: 'Serum sodium of 137 mEq/L' },
      { id: 'B', text: 'Serum potassium of 2.9 mEq/L' },
      { id: 'C', text: 'Serum calcium of 9.4 mg/dL' },
      { id: 'D', text: 'Blood urea nitrogen (BUN) of 16 mg/dL' },
    ],
    correctOptionId: 'B',
    rationale:
      'Loop diuretics such as furosemide promote potassium excretion. Hypokalemia (serum K⁺ < 3.5 mEq/L) increases myocardial irritability and predisposes the client to ventricular dysrhythmias.',
  },
  {
    id: 5,
    category: 'Reduction of Risk Potential',
    stem: 'A client receiving a packed red blood cell transfusion develops chills, lower back pain, and flushing 10 minutes after initiation. What is the nurse’s priority action?',
    options: [
      { id: 'A', text: 'Slow the transfusion rate to keep the vein open and reassess in 15 minutes' },
      { id: 'B', text: 'Administer prescribed acetaminophen and diphenhydramine before stopping the infusion' },
      { id: 'C', text: 'Stop the blood transfusion immediately and maintain IV patency with new normal saline tubing' },
      { id: 'D', text: 'Collect a urine specimen first before adjusting the infusion pump' },
    ],
    correctOptionId: 'C',
    rationale:
      'Chills, flank/back pain, and flushing shortly after starting a transfusion are classic signs of an acute hemolytic transfusion reaction. Stopping the transfusion immediately prevents further antigen exposure while keeping the IV line open with fresh 0.9% NaCl tubing.',
  },
];

export default function AssessmentQuestionsPage({
  assessmentTitle = 'NCLEX-RN Clinical Assessment',
  onBackToLesson,
  onExitToDashboard,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = SAMPLE_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = SAMPLE_QUESTIONS.length;

  const handleSelectOption = (optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleSubmitExam = () => {
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleRetake = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setSecondsElapsed(0);
    setSubmitted(false);
  };

  const correctCount = SAMPLE_QUESTIONS.reduce(
    (acc, q) => (answers[q.id] === q.correctOptionId ? acc + 1 : acc),
    0
  );
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-20">
      {/* Top Assessment Bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eef2f6] px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={canopediaWordmark}
            alt="Canopedia"
            className="h-5.5 w-auto object-contain cursor-pointer"
            onClick={onExitToDashboard}
          />
          <div className="hidden sm:block h-4 w-[1px] bg-[#e2e8f0]" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0f172a]">{assessmentTitle}</span>
            <span className="text-[10.5px] text-[#64748b]">
              {submitted ? 'Assessment Results & Rationales' : `Question ${currentIndex + 1} of ${totalQuestions}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff6ff] border border-[#dbeafe] text-[#0066e6] text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            type="button"
            onClick={onBackToLesson}
            className="px-3.5 py-1.5 rounded-full border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] text-xs font-semibold text-[#475569] transition cursor-pointer"
          >
            Back to lesson
          </button>
        </div>
      </header>

      {submitted ? (
        /* ================= RESULTS & EXPLANATIONS VIEW ================= */
        <main className="w-[92%] max-w-[920px] mx-auto pt-7 space-y-6">
          <section className="rounded-3xl bg-white border border-[#e6eef8] p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#eef5ff] text-[#0070f3] flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#eef5ff] text-[#0066e6] text-[10.5px] font-bold uppercase tracking-wider mb-2">
                ASSESSMENT COMPLETED
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
                You scored {scorePercent}% ({correctCount} / {totalQuestions})
              </h1>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                Time spent: {formatTime(secondsElapsed)} · Review the clinical explanations below.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-full border border-[#dce6f2] bg-white hover:bg-[#f8fafc] text-xs font-semibold text-[#0f172a] flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake assessment</span>
              </button>
              <button
                type="button"
                onClick={onBackToLesson}
                className="px-6 py-2.5 rounded-full bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Back to lesson</span>
              </button>
            </div>
          </section>

          {/* Detailed Question Breakdown */}
          <section className="space-y-4">
            {SAMPLE_QUESTIONS.map((q, idx) => {
              const userChoice = answers[q.id];
              const isCorrect = userChoice === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl bg-white border border-[#e6eef8] p-5 sm:p-6 shadow-xs text-left space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#0066e6] uppercase tracking-wide">
                      Question {idx + 1} · {q.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isCorrect
                          ? 'bg-[#ecfdf5] text-[#059669]'
                          : 'bg-[#fef2f2] text-[#dc2626]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#0f172a] leading-relaxed">{q.stem}</p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isAnswer = opt.id === q.correctOptionId;
                      const isPicked = opt.id === userChoice;

                      return (
                        <div
                          key={opt.id}
                          className={`px-3.5 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isAnswer
                              ? 'bg-[#f0fdf4] border-[#86efac] text-[#14532d] font-semibold'
                              : isPicked
                              ? 'bg-[#fef2f2] border-[#fca5a5] text-[#7f1d1d]'
                              : 'bg-[#f8fafc] border-[#edf2f7] text-[#475569]'
                          }`}
                        >
                          <span>
                            <strong>{opt.id}.</strong> {opt.text}
                          </span>
                          {isAnswer && (
                            <span className="text-[10.5px] font-bold text-[#15803d] shrink-0">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl bg-[#f3f7fd] border border-[#e3edf9] p-3.5 text-xs text-[#334155] leading-relaxed">
                    <strong className="text-[#0f172a] block mb-1">Clinical Explanation:</strong>
                    {q.rationale}
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      ) : (
        /* ================= ACTIVE EXAM QUESTIONS VIEW ================= */
        <main className="w-[92%] max-w-[920px] mx-auto pt-6 sm:pt-8 space-y-5">
          {/* Progress Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {SAMPLE_QUESTIONS.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(answers[q.id]);
                const isFlagged = Boolean(flagged[q.id]);

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer relative flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#0070f3] text-white shadow-xs'
                        : isAnswered
                        ? 'bg-[#dbeafe] text-[#1d4ed8]'
                        : 'bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-medium text-[#64748b]">
              {answeredCount} of {totalQuestions} answered
            </span>
          </div>

          {/* Question Card */}
          <section className="rounded-3xl bg-white border border-[#e6eef8] shadow-xs p-5 sm:p-8 text-left space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[#f1f5f9] pb-4">
              <div>
                <span className="text-[10.5px] font-extrabold text-[#0066e6] uppercase tracking-wider block">
                  {currentQuestion.category}
                </span>
                <span className="text-xs text-[#64748b]">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFlag}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  flagged[currentQuestion.id]
                    ? 'bg-[#fffbeb] border-[#fde68a] text-[#d97706]'
                    : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag for review'}</span>
              </button>
            </div>

            {/* Question Stem */}
            <h2 className="text-[15px] sm:text-[17px] font-bold text-[#0f172a] leading-relaxed">
              {currentQuestion.stem}
            </h2>

            {/* Answer Choices */}
            <div role="radiogroup" className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#eff6ff] border-[#0070f3] ring-1 ring-[#0070f3]'
                        : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#0070f3] text-white'
                          : 'bg-[#f1f5f9] text-[#475569]'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-[13.5px] text-[#1e293b] font-medium leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#475569] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-full bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <span>Next question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit assessment</span>
                </button>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
