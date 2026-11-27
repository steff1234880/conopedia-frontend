import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Check,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Scale,
  Lightbulb,
  Zap,
  FileText,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import { MobileTopHeader, MobileBottomNav } from './MobileNavigation';
import {
  getLatestAssessmentResult,
  fetchLatestResultFromApiOrStorage,
  evaluateQuestionResponse,
  getDetailedItemAnalysis,
} from '../services/assessmentService';

/**
 * Conopidea Dedicated Detailed Review Answers Page
 *
 * Recreates the reference NCLEX-RN Question Review screen:
 * - Top Navigation Bar matching Conopidea design system
 * - Question Header Card (with solid blue bottom accent bar):
 *   - "Question X of Y" (clickable navigator trigger) · "Question review" · Green Format Pill · Hint Tag
 *   - Clinical context sentence, bold Question Prompt, and instruction line
 *   - Action buttons on right: "<- Back to results", "Previous" (when > 1), and "Next question ->"
 *   - Expandable Question Navigator drawer to jump directly to any question (green/red status pills)
 * - Optional Collapsible / Split Client Record Card when clinical chart data applies
 * - Two-Column Main Review Grid (Read-Only, Non-Editable):
 *   - LEFT COLUMN:
 *     - Segmented Toggle: "Your answer" | "Correct answer"
 *     - "Your response" / "Verified answer key" header + "X of Y scored" pill
 *     - Status Callout Box ("Not quite" in red or "Spot on!" in green)
 *     - Read-only format-specific answer display (Matrix Grid, Dosage Calculation,
 *       Multiple Response, Incident Report, Drag & Drop, Dropdown/Cloze) with green/red highlights
 *     - 4 Bottom Metric Mini-Cards: SCORED / MAX, SCORING RULE, TIME SPENT, TOTAL TIME
 *   - RIGHT COLUMN:
 *     - "CANDIDATE CHOICE REMEDIATION" card
 *     - "Why these findings matter · Priority Review" card with green checkmarks
 *     - "CLINICAL TAKEAWAY" blue highlight card
 * - Footer: Canopedia Clinical Prep Portal · NCLEX-RN® Standard Compliant Clinical Decision Support
 */
export default function DedicatedReviewAnswersPage({
  resultData,
  initialQuestionIndex = 0,
  onBackToResults,
  onNavigateHome,
  onNavigateCourses,
  onNavigatePractice,
  onNavigateLiveClasses,
  onNavigateProfile,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [resolvedResult, setResolvedResult] = useState(
    () => resultData || getLatestAssessmentResult()
  );
  const [isCheckingApi, setIsCheckingApi] = useState(false);

  useEffect(() => {
    if (resultData && Array.isArray(resultData.questions) && resultData.questions.length > 0) {
      setResolvedResult(resultData);
      return;
    }
    const local = getLatestAssessmentResult();
    if (local) {
      setResolvedResult(local);
      return;
    }
    let active = true;
    setIsCheckingApi(true);
    fetchLatestResultFromApiOrStorage().then((loaded) => {
      if (active) {
        if (loaded) setResolvedResult(loaded);
        setIsCheckingApi(false);
      }
    });
    return () => {
      active = false;
    };
  }, [resultData]);

  const activeResult = resolvedResult;
  const questions = useMemo(() => activeResult?.questions || [], [activeResult]);
  const answers = useMemo(() => activeResult?.answers || {}, [activeResult]);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(() => {
    const safeIdx = Number(initialQuestionIndex) || 0;
    return Math.max(0, Math.min(safeIdx, Math.max(0, totalQuestions - 1)));
  });

  // Toggle between 'your-answer' and 'correct-answer' tab inside the left response card
  const [answerTab, setAnswerTab] = useState('your-answer');
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [clientRecordExpanded, setClientRecordExpanded] = useState(true);
  const [activeChartTabId, setActiveChartTabId] = useState('orders');

  useEffect(() => {
    const safeIdx = Number(initialQuestionIndex) || 0;
    if (totalQuestions > 0) {
      setCurrentIndex(Math.max(0, Math.min(safeIdx, totalQuestions - 1)));
    }
  }, [initialQuestionIndex, totalQuestions]);

  const currentQuestion = questions[currentIndex] || questions[0] || null;

  useEffect(() => {
    if (currentQuestion) {
      setActiveChartTabId(
        currentQuestion.defaultTab ||
          currentQuestion.clientRecord?.tabs?.[0]?.id ||
          'orders'
      );
      setAnswerTab('your-answer');
    }
  }, [currentQuestion]);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  if (isCheckingApi) {
    return (
      <div className="min-h-screen w-full bg-[#f5f8fc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-[#0066ff] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-[#64748b]">Loading submitted answers...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen w-full bg-[#f5f8fc] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl border border-[#e6eef8] p-8 max-w-md space-y-4 shadow-xs">
          <h1 className="text-lg font-extrabold text-[#0f172a]">No Submitted Assessment Found</h1>
          <p className="text-xs text-[#64748b]">
            Complete a practice or readiness assessment first to review your submitted answers and
            clinical rationales.
          </p>
          <button
            type="button"
            onClick={onBackToResults}
            className="px-6 py-2.5 rounded-full bg-[#0066ff] text-white text-xs font-bold cursor-pointer"
          >
            Back to results
          </button>
        </div>
      </div>
    );
  }

  const userResponse = answers[currentQuestion.id];
  const totalElapsedSeconds = activeResult?.elapsedSeconds ?? 5;

  const analysis = getDetailedItemAnalysis(
    currentQuestion,
    userResponse,
    totalElapsedSeconds,
    totalQuestions
  );

  const formatTotalClock = (secs) => {
    const safe = Math.max(1, Math.round(Number(secs) || 0));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const itemTimeLabel =
    analysis.estimatedItemSeconds === 1
      ? '1 second'
      : analysis.estimatedItemSeconds < 60
      ? `${analysis.estimatedItemSeconds} seconds`
      : `${Math.floor(analysis.estimatedItemSeconds / 60)}m ${
          analysis.estimatedItemSeconds % 60
        }s`;

  const goToQuestion = (idx) => {
    const clamped = Math.max(0, Math.min(idx, totalQuestions - 1));
    setCurrentIndex(clamped);
    setNavigatorOpen(false);
    window.scrollTo(0, 0);
  };

  const hasClientRecord =
    currentQuestion.type !== 'dosage-calc' &&
    Array.isArray(currentQuestion.clientRecord?.tabs) &&
    currentQuestion.clientRecord.tabs.length > 0;

  const recordTabs = currentQuestion.clientRecord?.tabs || [];
  const activeRecordTab =
    recordTabs.find((t) => t.id === activeChartTabId) || recordTabs[0] || null;

  // ================= READ-ONLY FORMAT RENDERERS =================
  const renderReadOnlyResponseBody = (q, resp, showCorrectKey) => {
    switch (q.type) {
      // 1. MULTIPLE RESPONSE (Matches Reference Screenshot Options Layout)
      case 'multiple-response': {
        const pickedIds = Array.isArray(resp) ? resp : resp ? [resp] : [];

        return (
          <div className="space-y-2.5" aria-label="Submitted options review">
            {(q.options || []).map((opt) => {
              const isCorrectOpt = Boolean(
                opt.isCorrect || (q.correctOptionId && q.correctOptionId === opt.id)
              );
              const wasSelected = pickedIds.includes(opt.id);

              if (showCorrectKey) {
                return (
                  <div
                    key={opt.id}
                    className={`rounded-2xl px-4 py-3.5 border flex items-center justify-between gap-3 select-none ${
                      isCorrectOpt
                        ? 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]'
                        : 'bg-white border-[#e9eff6] text-[#64748b]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isCorrectOpt ? (
                        <span className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border-2 border-[#cbd5e1] bg-white shrink-0" />
                      )}
                      <span className="text-xs sm:text-[13px] font-semibold leading-relaxed">
                        {opt.text}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider shrink-0 ${
                        isCorrectOpt
                          ? 'bg-white text-[#059669] border border-[#a7f3d0]'
                          : 'bg-[#f1f5f9] text-[#94a3b8]'
                      }`}
                    >
                      {isCorrectOpt ? 'CORRECT ANSWER' : 'DISTRACTOR'}
                    </span>
                  </div>
                );
              }

              // "Your answer" mode: highlight selected+correct in green, selected+incorrect in red, missed correct in soft green
              let rowStyle = 'bg-white border-[#e9eff6] text-[#334155]';
              let circleEl = (
                <span className="w-5 h-5 rounded-full border-2 border-[#cbd5e1] bg-white shrink-0" />
              );
              let rightBadge = (
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#94a3b8] text-[9.5px] font-bold uppercase tracking-wider shrink-0">
                  UNSELECTED
                </span>
              );

              if (wasSelected && isCorrectOpt) {
                rowStyle = 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]';
                circleEl = (
                  <span className="w-5 h-5 rounded-full border-[5px] border-[#10b981] bg-white shrink-0" />
                );
                rightBadge = (
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#a7f3d0] text-[#059669] text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                    SELECTED • CORRECT
                  </span>
                );
              } else if (wasSelected && !isCorrectOpt) {
                rowStyle = 'bg-[#fee2e2]/65 border-[#fca5a5] text-[#7f1d1d]';
                circleEl = (
                  <span className="w-5 h-5 rounded-full border-[5px] border-[#ef4444] bg-white shrink-0" />
                );
                rightBadge = (
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#fecaca] text-[#dc2626] text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                    SELECTED • INCORRECT
                  </span>
                );
              } else if (!wasSelected && isCorrectOpt) {
                rowStyle = 'bg-[#f0fdf4]/70 border-[#bbf7d0] text-[#14532d]';
                circleEl = (
                  <span className="w-5 h-5 rounded-full border-2 border-[#10b981] bg-white flex items-center justify-center text-[#10b981] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.8]" />
                  </span>
                );
                rightBadge = (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                    MISSED • CORRECT
                  </span>
                );
              }

              return (
                <div
                  key={opt.id}
                  className={`rounded-2xl px-4 py-3.5 border flex items-center justify-between gap-3 select-none ${rowStyle}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {circleEl}
                    <span className="text-xs sm:text-[13px] font-medium leading-relaxed">
                      {opt.text}
                    </span>
                  </div>
                  {rightBadge}
                </div>
              );
            })}
          </div>
        );
      }

      // 2. INCIDENT REPORT (Read-only narrative segments)
      case 'incident-report': {
        const pickedIds = Array.isArray(resp) ? resp : [];

        return (
          <div className="space-y-2.5">
            {(q.segments || []).map((seg) => {
              const isRelevant = Boolean(seg.isRelevant);
              const wasSelected = pickedIds.includes(seg.id);

              if (showCorrectKey) {
                return (
                  <div
                    key={seg.id}
                    className={`rounded-2xl px-4 py-3.5 border flex items-center justify-between gap-3 select-none ${
                      isRelevant
                        ? 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]'
                        : 'bg-white border-[#e9eff6] text-[#64748b]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isRelevant ? (
                        <span className="w-5 h-5 mt-0.5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#cbd5e1] bg-white shrink-0" />
                      )}
                      <span className="text-xs sm:text-[13px] font-medium leading-relaxed">
                        {seg.text}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider shrink-0 ${
                        isRelevant
                          ? 'bg-white border border-[#a7f3d0] text-[#059669]'
                          : 'bg-[#f1f5f9] text-[#94a3b8]'
                      }`}
                    >
                      {isRelevant ? 'REQUIRES REPORT' : 'ROUTINE CARE'}
                    </span>
                  </div>
                );
              }

              let rowStyle = 'bg-white border-[#e9eff6] text-[#334155]';
              let indicator = (
                <span className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#cbd5e1] bg-white shrink-0" />
              );
              let tag = (
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#94a3b8] text-[9.5px] font-bold uppercase tracking-wider shrink-0">
                  UNSELECTED
                </span>
              );

              if (wasSelected && isRelevant) {
                rowStyle = 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]';
                indicator = (
                  <span className="w-5 h-5 mt-0.5 rounded-full border-[5px] border-[#10b981] bg-white shrink-0" />
                );
                tag = (
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#a7f3d0] text-[#059669] text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                    SELECTED • CORRECT
                  </span>
                );
              } else if (wasSelected && !isRelevant) {
                rowStyle = 'bg-[#fee2e2]/65 border-[#fca5a5] text-[#7f1d1d]';
                indicator = (
                  <span className="w-5 h-5 mt-0.5 rounded-full border-[5px] border-[#ef4444] bg-white shrink-0" />
                );
                tag = (
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#fecaca] text-[#dc2626] text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                    SELECTED • INCORRECT
                  </span>
                );
              } else if (!wasSelected && isRelevant) {
                rowStyle = 'bg-[#f0fdf4]/70 border-[#bbf7d0] text-[#14532d]';
                indicator = (
                  <span className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#10b981] bg-white flex items-center justify-center text-[#10b981] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.8]" />
                  </span>
                );
                tag = (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[9.5px] font-extrabold uppercase tracking-wider shrink-0">
                    MISSED • CORRECT
                  </span>
                );
              }

              return (
                <div
                  key={seg.id}
                  className={`rounded-2xl px-4 py-3.5 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none ${rowStyle}`}
                >
                  <div className="flex items-start gap-3">
                    {indicator}
                    <span className="text-xs sm:text-[13px] font-medium leading-relaxed">
                      {seg.text}
                    </span>
                  </div>
                  {tag}
                </div>
              );
            })}
          </div>
        );
      }

      // 3. MATRIX GRID (Read-only matrix table with green/red cell states)
      case 'matrix-grid': {
        const userMap = resp && typeof resp === 'object' ? resp : {};

        return (
          <div className="overflow-x-auto">
            <div className="min-w-[520px] space-y-2">
              <div className="grid grid-cols-12 items-center px-3 pb-1 text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                <div className="col-span-6">ASSESSMENT FINDING</div>
                {(q.columns || []).map((col) => (
                  <div key={col.id} className="col-span-2 text-center">
                    {col.label}
                  </div>
                ))}
              </div>

              {(q.rows || []).map((row) => {
                const pickedCols = Array.isArray(userMap[row.id]) ? userMap[row.id] : [];
                const expectedCols = Array.isArray(row.correctColumns) ? row.correctColumns : [];

                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-12 items-center rounded-2xl bg-white border border-[#e9eff6] px-3.5 py-3 select-none"
                  >
                    <div className="col-span-6 pr-2 text-xs font-semibold text-[#1e293b]">
                      {row.finding}
                    </div>

                    {(q.columns || []).map((col) => {
                      const shouldCheck = expectedCols.includes(col.id);
                      const didCheck = pickedCols.includes(col.id);

                      if (showCorrectKey) {
                        return (
                          <div key={col.id} className="col-span-2 flex justify-center">
                            <span
                              className={`w-5.5 h-5.5 rounded-md flex items-center justify-center ${
                                shouldCheck
                                  ? 'bg-[#10b981] text-white'
                                  : 'bg-[#f8fafc] border border-[#e2e8f0]'
                              }`}
                            >
                              {shouldCheck && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </span>
                          </div>
                        );
                      }

                      let boxClass = 'bg-white border border-[#cbd5e1]';
                      let icon = null;
                      if (didCheck && shouldCheck) {
                        boxClass = 'bg-[#10b981] border border-[#10b981] text-white';
                        icon = <Check className="w-3.5 h-3.5 stroke-[3]" />;
                      } else if (didCheck && !shouldCheck) {
                        boxClass = 'bg-[#ef4444] border border-[#ef4444] text-white';
                        icon = <X className="w-3.5 h-3.5 stroke-[3]" />;
                      } else if (!didCheck && shouldCheck) {
                        boxClass = 'bg-[#ecfdf5] border-2 border-[#10b981] text-[#059669]';
                        icon = <Check className="w-3.5 h-3.5 stroke-[2.6]" />;
                      }

                      return (
                        <div key={col.id} className="col-span-2 flex justify-center">
                          <span
                            className={`w-5.5 h-5.5 rounded-md flex items-center justify-center ${boxClass}`}
                          >
                            {icon}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // 4. DOSAGE CALCULATION (Read-only Medication Order + Submitted vs. Correct mL)
      case 'dosage-calc': {
        const rawVal =
          typeof resp === 'object' && resp !== null ? resp.value : resp;
        const userText =
          rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== ''
            ? `${String(rawVal).trim()} ${q.unitSuffix || 'mL'}`
            : 'Not answered';
        const correctText = `${q.correctNumeric} ${q.unitSuffix || 'mL'}`;

        return (
          <div className="space-y-3.5 select-none">
            {q.medicationOrder && (
              <div className="rounded-2xl border border-[#e9eff6] overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-[#edf2f7] px-4 py-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#1e293b] uppercase">
                    <Edit3 className="w-3.5 h-3.5 text-[#0066e6]" />
                    MEDICATION ORDER
                  </span>
                  <span className="text-[11px] text-[#64748b]">
                    {q.medicationOrder.unitLabel}
                  </span>
                </div>
                <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-[#94a3b8] uppercase">
                      PRESCRIBED DOSE
                    </span>
                    <span className="text-sm font-extrabold text-[#0f172a]">
                      {q.medicationOrder.prescribedDose}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-[#94a3b8] uppercase">
                      AVAILABLE CONCENTRATION
                    </span>
                    <span className="text-sm font-extrabold text-[#0f172a]">
                      {q.medicationOrder.availableConcentration}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {showCorrectKey ? (
              <div className="rounded-2xl p-4 border bg-[#ecfdf5] border-[#86efac] text-[#065f46] flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider">
                    Verified Correct Volume
                  </span>
                  <span className="text-xl font-extrabold">{correctText}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white border border-[#a7f3d0] text-[#059669] text-[10px] font-extrabold uppercase">
                  CORRECT ANSWER
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`rounded-2xl p-4 border flex items-center justify-between ${
                    analysis.isFullyCorrect
                      ? 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]'
                      : 'bg-[#fee2e2]/65 border-[#fca5a5] text-[#7f1d1d]'
                  }`}
                >
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider opacity-80">
                      Your Submitted Dose
                    </span>
                    <span className="text-xl font-extrabold">{userText}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full bg-white border text-[9.5px] font-extrabold uppercase ${
                      analysis.isFullyCorrect
                        ? 'border-[#a7f3d0] text-[#059669]'
                        : 'border-[#fecaca] text-[#dc2626]'
                    }`}
                  >
                    {analysis.isFullyCorrect ? 'SUBMITTED • CORRECT' : 'SUBMITTED • INCORRECT'}
                  </span>
                </div>

                {!analysis.isFullyCorrect && (
                  <div className="rounded-2xl p-4 border bg-[#ecfdf5] border-[#86efac] text-[#065f46] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider opacity-80">
                        Correct Target Dose
                      </span>
                      <span className="text-lg font-extrabold">{correctText}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#a7f3d0] text-[#059669] text-[9.5px] font-extrabold uppercase">
                      CORRECT ANSWER
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      // 5. DRAG AND DROP WORDS (Read-only Sentence Slots)
      case 'drag-drop': {
        const slotMap = resp && typeof resp === 'object' ? resp : {};
        const bankLookup = {};
        (q.wordBank || []).forEach((w) => {
          bankLookup[w.id] = w.text;
        });

        return (
          <div className="space-y-3 select-none">
            {(q.slots || []).map((slot) => {
              const pickedId = slotMap[slot.id];
              const pickedText = pickedId ? bankLookup[pickedId] || pickedId : 'Unanswered';
              const correctText = bankLookup[slot.correctWordId] || slot.correctWordId;
              const isSlotRight = pickedId === slot.correctWordId;

              if (showCorrectKey) {
                return (
                  <div
                    key={slot.id}
                    className="rounded-2xl bg-[#ecfdf5] border border-[#86efac] p-4 space-y-1.5"
                  >
                    <span className="block text-xs font-semibold text-[#065f46]">
                      {slot.leadText}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-[#064e3b]">{correctText}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#a7f3d0] text-[#059669] text-[9.5px] font-extrabold uppercase">
                        CORRECT SLOT
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  className={`rounded-2xl border p-4 space-y-2 ${
                    isSlotRight
                      ? 'bg-[#ecfdf5] border-[#86efac]'
                      : 'bg-[#fee2e2]/65 border-[#fca5a5]'
                  }`}
                >
                  <span className="block text-xs font-semibold text-[#334155]">
                    {slot.leadText}
                  </span>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-[13.5px] font-extrabold ${
                        isSlotRight ? 'text-[#065f46]' : 'text-[#7f1d1d]'
                      }`}
                    >
                      {pickedText}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full bg-white border text-[9.5px] font-extrabold uppercase ${
                        isSlotRight
                          ? 'border-[#a7f3d0] text-[#059669]'
                          : 'border-[#fecaca] text-[#dc2626]'
                      }`}
                    >
                      {isSlotRight ? 'SELECTED • CORRECT' : 'SELECTED • INCORRECT'}
                    </span>
                  </div>
                  {!isSlotRight && (
                    <div className="pt-1.5 border-t border-[#fecaca] flex items-center justify-between text-xs font-bold text-[#059669]">
                      <span>Correct answer: {correctText}</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      // 6. DROPDOWN / CLOZE (Read-only Cloze Statements)
      case 'cloze-dropdown':
      default: {
        const userMap = resp && typeof resp === 'object' ? resp : {};

        return (
          <div className="space-y-3 select-none">
            {(q.clauses || []).map((clause) => {
              const userChoice = userMap[clause.id] || 'Not selected';
              const isClauseRight = userChoice === clause.correctAnswer;

              if (showCorrectKey) {
                return (
                  <div
                    key={clause.id}
                    className="rounded-2xl bg-[#ecfdf5] border border-[#86efac] p-4 space-y-1.5"
                  >
                    <span className="block text-xs font-semibold text-[#065f46]">
                      {clause.prefix}{' '}
                      <span className="text-[10px] font-extrabold uppercase opacity-75">
                        ({clause.label})
                      </span>
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-[#064e3b]">
                        {clause.correctAnswer}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#a7f3d0] text-[#059669] text-[9.5px] font-extrabold uppercase">
                        CORRECT CHOICE
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={clause.id}
                  className={`rounded-2xl border p-4 space-y-2 ${
                    isClauseRight
                      ? 'bg-[#ecfdf5] border-[#86efac]'
                      : 'bg-[#fee2e2]/65 border-[#fca5a5]'
                  }`}
                >
                  <span className="block text-xs font-semibold text-[#334155]">
                    {clause.prefix}{' '}
                    <span className="text-[10px] font-extrabold text-[#0066e6] uppercase">
                      ({clause.label})
                    </span>
                  </span>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-[13.5px] font-extrabold ${
                        isClauseRight ? 'text-[#065f46]' : 'text-[#7f1d1d]'
                      }`}
                    >
                      {userChoice}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full bg-white border text-[9.5px] font-extrabold uppercase ${
                        isClauseRight
                          ? 'border-[#a7f3d0] text-[#059669]'
                          : 'border-[#fecaca] text-[#dc2626]'
                      }`}
                    >
                      {isClauseRight ? 'SELECTED • CORRECT' : 'SELECTED • INCORRECT'}
                    </span>
                  </div>

                  {!isClauseRight && (
                    <div className="pt-1.5 border-t border-[#fecaca] flex items-center justify-between text-xs font-bold text-[#059669]">
                      <span>Correct answer: {clause.correctAnswer}</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f8fb] md:bg-[#f5f8fc] text-[#1e2733] font-sans flex flex-col justify-between selection:bg-[#006ee6] selection:text-white pb-28 md:pb-0">
      <div>
        {/* Compact Mobile Top Header (< md) */}
        <MobileTopHeader onNavigateHome={onNavigateHome} onNavigateProfile={onNavigateProfile} />

        {/* 
          ========================================================================
          TOP NAVIGATION BAR (Desktop >= md)
          ========================================================================
        */}
        <header className="hidden md:flex sticky top-0 z-40 w-full bg-white border-b border-[#eef2f6] px-4 sm:px-8 lg:px-12 py-3 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
              <img
                src={canopediaWordmark}
                alt="Canopedia"
                className="h-5.5 w-auto object-contain"
              />
            </div>

            <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
              {navLinks.map((link) => {
                const isActive = link === 'Home';
                return (
                  <button
                    key={link}
                    type="button"
                    onClick={() => {
                      if (link === 'Home' && onNavigateHome) onNavigateHome();
                      if (link === 'Learn' && onNavigateCourses) onNavigateCourses();
                      if (link === 'Practice' && onNavigatePractice) onNavigatePractice();
                      if (link === 'Live Classes' && onNavigateLiveClasses) onNavigateLiveClasses();
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#006ee6] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    {link}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-full hover:bg-[#f1f5f9] text-[#475569] transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444]" />
              </button>

              {notificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-72 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-4 text-left">
                    <span className="text-xs font-bold text-[#0f172a] block mb-1">
                      Review Mode Active
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      Submitted answers are locked for accurate rationale comparison.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div
              onClick={onNavigateProfile}
              className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full bg-[#f8fafc] border border-[#eef2f6] cursor-pointer hover:bg-[#f1f5f9] transition"
            >
              <img
                src={userAvatar}
                alt="Ananya"
                className="w-7 h-7 rounded-full object-cover border border-white"
              />
              <div className="hidden sm:flex flex-col text-left pr-1 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-[#0f172a]">Ananya</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm bg-[#dbeafe] text-[#1d4ed8] tracking-wider">
                    PREMIUM
                  </span>
                </div>
                <span className="text-[10px] text-[#64748b] font-medium">NCLEX-RN Prep</span>
              </div>
            </div>
          </div>
        </header>

        {/* 
          ========================================================================
          MAIN REVIEW CONTENT CONTAINER
          ========================================================================
        */}
        <main className="w-full md:w-[92%] max-w-[1440px] mx-auto px-5 sm:px-4 lg:px-6 pt-3 md:pt-6 pb-8 md:pb-14 space-y-5 md:space-y-6">
          {/* 
            ========================================================================
            TOP QUESTION STEM & NAVIGATION HEADER CARD (Matches Reference Screenshot)
            ========================================================================
          */}
          <section className="rounded-3xl bg-white border border-[#e6eef8] border-b-[3px] border-b-[#0066ff] shadow-[0_2px_14px_rgba(15,23,42,0.03)] p-5 sm:p-7 text-left space-y-4">
            {/* Top Metadata Bar + Navigator Toggle */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3.5 border-b border-[#f1f5f9]">
              <div className="flex items-center flex-wrap gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setNavigatorOpen(!navigatorOpen)}
                  className="inline-flex items-center gap-1 font-extrabold text-[#0f172a] hover:text-[#0066ff] cursor-pointer transition"
                  title="Open question navigator"
                >
                  <span>
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </button>

                <span className="text-[#cbd5e1]">•</span>
                <span className="font-semibold text-[#64748b]">Question review</span>

                {/* Green Question Type Pill */}
                <span className="px-2.5 py-0.5 rounded-full bg-[#e6f9ef] border border-[#bbf7d0] text-[#059669] text-[10px] font-extrabold uppercase tracking-wider">
                  {analysis.typeLabel}
                </span>

                {/* Grey Hint Pill */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] text-[10.5px] font-semibold">
                  <Clock className="w-3 h-3 text-[#64748b]" />
                  <span>{analysis.hintTag}</span>
                </span>
              </div>

              {/* Client Record Quick Toggle (when clinical chart applies) */}
              {hasClientRecord && (
                <button
                  type="button"
                  onClick={() => setClientRecordExpanded(!clientRecordExpanded)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                    clientRecordExpanded
                      ? 'bg-[#0066ff] border-[#0066ff] text-white'
                      : 'bg-[#f0f7ff] border-[#dbeafe] text-[#0066ff] hover:bg-[#e0effe]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{clientRecordExpanded ? 'Hide client record' : 'View client record'}</span>
                </button>
              )}
            </div>

            {/* Collapsible Question Navigator Grid */}
            {navigatorOpen && (
              <div className="rounded-2xl bg-[#f8fafc] border border-[#e6eef8] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-[#475569] uppercase tracking-wider">
                    Jump to Question
                  </span>
                  <span className="text-[#64748b]">Green = Correct · Red = Needs Review</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {questions.map((qItem, idx) => {
                    const status = evaluateQuestionResponse(qItem, answers[qItem.id]);
                    const isCurrent = idx === currentIndex;

                    return (
                      <button
                        key={qItem.id}
                        type="button"
                        onClick={() => goToQuestion(idx)}
                        className={`w-9 h-9 rounded-xl text-xs font-extrabold transition flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-[#0f172a] bg-[#0066ff] text-white'
                            : status.isCorrect
                            ? 'bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0]'
                            : 'bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question Stem + Right Navigation Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-0.5">
              <div className="space-y-1.5 max-w-3xl">
                <p className="text-xs sm:text-[13px] text-[#475569] font-medium">
                  {currentQuestion.scenarioText ||
                    "The nurse is reviewing the client's assessment findings and clinical record."}
                </p>

                <h1 className="text-xl sm:text-[23px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
                  {currentQuestion.prompt}
                </h1>

                {currentQuestion.instruction && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-[#64748b] pt-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#0066ff]" />
                    <span>{currentQuestion.instruction}</span>
                  </p>
                )}
              </div>

              {/* Navigation Buttons: Back to results | Previous | Next question */}
              <div className="flex items-center flex-wrap gap-2.5 shrink-0 self-start lg:self-center">
                <button
                  type="button"
                  onClick={onBackToResults}
                  className="h-[40px] px-4 rounded-full bg-white hover:bg-[#f8fafc] border border-[#dce6f2] text-xs font-bold text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#64748b]" />
                  <span>Back to results</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => goToQuestion(currentIndex - 1)}
                  className="h-[40px] px-4 rounded-full bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed border border-[#dce6f2] text-xs font-bold text-[#334155] flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentIndex < totalQuestions - 1) {
                      goToQuestion(currentIndex + 1);
                    } else {
                      onBackToResults();
                    }
                  }}
                  className="h-[40px] px-5 rounded-full bg-[#0066ff] hover:bg-[#0058db] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(0,102,255,0.22)] transition cursor-pointer"
                >
                  <span>
                    {currentIndex < totalQuestions - 1 ? 'Next question' : 'Back to results'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable Clinical Case / Client Record Drawer */}
            {hasClientRecord && clientRecordExpanded && activeRecordTab && (
              <div className="mt-4 pt-4 border-t border-[#f1f5f9] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0066ff]" />
                    <span className="text-xs font-extrabold text-[#0f172a]">
                      Client Clinical Record
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recordTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveChartTabId(tab.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                          activeRecordTab.id === tab.id
                            ? 'bg-[#0066ff] text-white'
                            : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                        }`}
                      >
                        {tab.shortLabel || tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="rounded-2xl bg-[#f2f8ff] border border-[#d8e9ff] p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-[#005ce6] uppercase">
                      <span>{activeRecordTab.badgeTitle}</span>
                      <span>{activeRecordTab.time || activeRecordTab.timeTag}</span>
                    </div>
                    <p className="text-xs font-bold text-[#0f172a] leading-relaxed">
                      {activeRecordTab.primaryBox || activeRecordTab.labHighlight}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f8fafc] border border-[#edf2f7] p-4 space-y-1">
                    <span className="block text-[10px] font-extrabold text-[#64748b] uppercase">
                      {activeRecordTab.directiveTitle || 'CLINICAL CONTEXT'}
                    </span>
                    <p className="text-xs text-[#334155] leading-relaxed">
                      {activeRecordTab.directiveBody || activeRecordTab.casePresentation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 
            ========================================================================
            TWO-COLUMN REVIEW WORKSPACE
            Left (7 cols): Your answer / Correct answer toggle + Read-only choices + 4 Metric cards
            Right (5 cols): Candidate Choice Remediation + Why These Findings Matter + Clinical Takeaway
            ========================================================================
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ================= LEFT COLUMN: CANDIDATE RESPONSE CARD (7 cols) ================= */}
            <section
              aria-label="Submitted answer comparison"
              className="lg:col-span-7 rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_14px_rgba(15,23,42,0.025)] p-5 sm:p-7 text-left space-y-5"
            >
              {/* Segmented Pill Toggle: Your answer | Correct answer */}
              <div className="inline-flex items-center rounded-full bg-[#f1f5f9] p-1">
                <button
                  type="button"
                  onClick={() => setAnswerTab('your-answer')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    answerTab === 'your-answer'
                      ? 'bg-[#0066ff] text-white shadow-2xs'
                      : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  Your answer
                </button>
                <button
                  type="button"
                  onClick={() => setAnswerTab('correct-answer')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    answerTab === 'correct-answer'
                      ? 'bg-[#0066ff] text-white shadow-2xs'
                      : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  Correct answer
                </button>
              </div>

              {/* Response Section Title + Score Pill */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] sm:text-base font-extrabold text-[#0f172a]">
                    {answerTab === 'your-answer' ? 'Your response' : 'Verified correct answer'}
                  </h2>
                  <p className="text-[11.5px] text-[#64748b] mt-0.5">
                    {answerTab === 'your-answer'
                      ? 'Evaluation of candidate selection against clinical safety thresholds'
                      : 'Official NCLEX-RN answer key for this clinical item'}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-lg border text-[11px] font-extrabold shrink-0 ${
                    analysis.isFullyCorrect
                      ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#059669]'
                      : 'bg-[#fff1f2] border-[#fecdd3] text-[#e11d48]'
                  }`}
                >
                  {analysis.scoredPoints} of {analysis.maxPoints} scored
                </span>
              </div>

              {/* Evaluation Feedback Banner ("Not quite" / "Spot on!") */}
              {answerTab === 'your-answer' && (
                <div
                  className={`rounded-2xl border p-4 flex items-start gap-3 ${
                    analysis.isFullyCorrect
                      ? 'bg-[#f0fdf4] border-[#bbf7d0]'
                      : 'bg-[#fff5f5] border-[#fed7d7]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      analysis.isFullyCorrect
                        ? 'bg-[#dcfce7] text-[#16a34a]'
                        : 'bg-[#fee2e2] text-[#dc2626]'
                    }`}
                  >
                    {analysis.isFullyCorrect ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h3
                      className={`text-xs sm:text-[13px] font-extrabold ${
                        analysis.isFullyCorrect ? 'text-[#14532d]' : 'text-[#991b1b]'
                      }`}
                    >
                      {analysis.feedbackTitle}
                    </h3>
                    <p
                      className={`text-[11.5px] sm:text-xs leading-relaxed ${
                        analysis.isFullyCorrect ? 'text-[#166534]' : 'text-[#b91c1c]'
                      }`}
                    >
                      {analysis.feedbackBody}
                    </p>
                  </div>
                </div>
              )}

              {/* Read-Only Question Format Body */}
              {renderReadOnlyResponseBody(
                currentQuestion,
                userResponse,
                answerTab === 'correct-answer'
              )}

              {/* Bottom 4 Scoring & Timing Metric Mini-Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl bg-[#f8fafc] border border-[#edf2f7] p-3.5 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#eef5ff] text-[#0066ff] flex items-center justify-center mx-auto">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="block text-[9.5px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    SCORED / MAX
                  </span>
                  <span className="block text-xs sm:text-[13px] font-extrabold text-[#0f172a]">
                    {analysis.scoredPoints} of {analysis.maxPoints}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] border border-[#edf2f7] p-3.5 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#eef5ff] text-[#0066ff] flex items-center justify-center mx-auto">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <span className="block text-[9.5px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    SCORING RULE
                  </span>
                  <span className="block text-xs sm:text-[13px] font-extrabold text-[#0f172a]">
                    {analysis.scoringRule}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] border border-[#edf2f7] p-3.5 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#fffbeb] text-[#d97706] flex items-center justify-center mx-auto">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="block text-[9.5px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    TIME SPENT
                  </span>
                  <span className="block text-xs sm:text-[13px] font-extrabold text-[#0f172a]">
                    {itemTimeLabel}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] border border-[#edf2f7] p-3.5 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#f3e8ff] text-[#7c3aed] flex items-center justify-center mx-auto">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="block text-[9.5px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    TOTAL TIME
                  </span>
                  <span className="block text-xs sm:text-[13px] font-extrabold text-[#0f172a]">
                    {formatTotalClock(totalElapsedSeconds)}
                  </span>
                </div>
              </div>
            </section>

            {/* ================= RIGHT COLUMN: RATIONALE & CLINICAL TAKEAWAY (5 cols) ================= */}
            <aside className="lg:col-span-5 space-y-5 text-left">
              {/* Card 1: CANDIDATE CHOICE REMEDIATION */}
              <section className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_14px_rgba(15,23,42,0.025)] p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      analysis.isFullyCorrect ? 'bg-[#10b981]' : 'bg-[#ef4444]'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      analysis.isFullyCorrect ? 'text-[#059669]' : 'text-[#e11d48]'
                    }`}
                  >
                    {analysis.isFullyCorrect
                      ? 'CLINICAL RATIONALE VERIFIED'
                      : 'CANDIDATE CHOICE REMEDIATION'}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      analysis.isFullyCorrect
                        ? 'bg-[#dcfce7] text-[#16a34a]'
                        : 'bg-[#fee2e2] text-[#dc2626]'
                    }`}
                  >
                    {analysis.isFullyCorrect ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-[13.5px] sm:text-sm font-extrabold text-[#0f172a] leading-snug">
                      {analysis.remediationHeading}
                    </h3>
                    <p className="text-xs leading-[1.62] text-[#64748b]">
                      {analysis.remediationBody}
                    </p>
                  </div>
                </div>
              </section>

              {/* Card 2: Why these findings matter · Priority Review */}
              {Array.isArray(analysis.keyPoints) && analysis.keyPoints.length > 0 && (
                <section className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_14px_rgba(15,23,42,0.025)] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#eef5ff] text-[#0066ff] flex items-center justify-center">
                        <Lightbulb className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[13.5px] sm:text-sm font-extrabold text-[#0f172a]">
                        {analysis.keyPointsTitle}
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#94a3b8]">
                      Priority Review
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {analysis.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-5.5 h-5.5 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs sm:text-[12.5px] font-extrabold text-[#0f172a]">
                            {pt.title}
                          </h4>
                          <p className="text-[11.5px] leading-[1.55] text-[#64748b]">
                            {pt.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Card 3: CLINICAL TAKEAWAY */}
              {analysis.clinicalTakeaway && (
                <section className="rounded-3xl bg-[#f0f7ff] border border-[#cfe3ff] p-5 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0066ff] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-extrabold text-[#0066ff] uppercase tracking-wider">
                      CLINICAL TAKEAWAY
                    </span>
                    <p className="text-xs font-bold text-[#0f172a] leading-[1.58]">
                      {analysis.clinicalTakeaway}
                    </p>
                  </div>
                </section>
              )}
            </aside>
          </div>
        </main>
      </div>

      {/* Bottom Clinical Compliance Footer */}
      <footer className="w-full bg-white border-t border-[#eef2f6] px-4 sm:px-8 lg:px-12 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748b]">
          <div className="flex items-center flex-wrap gap-2">
            <strong className="font-bold text-[#0f172a]">Canopedia Clinical Prep Portal</strong>
            <span className="text-[#cbd5e1]">|</span>
            <span>NCLEX-RN® Standard Compliant Clinical Decision Support</span>
          </div>

          <div className="flex items-center flex-wrap gap-4 text-[#64748b]">
            <span>Clinical Guidelines</span>
            <span>Scoring Methodology</span>
            <span>Accessibility</span>
            <span>Report Discrepancy</span>
          </div>
        </div>
      </footer>

      {/* Fixed Mobile Bottom Navigation (< md) */}
      <MobileBottomNav
        activeTab="Practice"
        onNavigateHome={onNavigateHome}
        onNavigateLearn={onNavigateCourses}
        onNavigatePractice={onNavigatePractice}
        onNavigateLive={onNavigateLiveClasses}
      />
    </div>
  );
}

