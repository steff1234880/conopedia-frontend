import React, { useState, useMemo } from 'react';
import {
  Bell,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  FileText,
  Edit3,
  BookOpen,
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import { MobileTopHeader, MobileBottomNav } from './MobileNavigation';
import {
  getLatestAssessmentResult,
  evaluateQuestionResponse,
} from '../services/assessmentService';

const CHANCE_BANDS = ['Low', 'Borderline', 'High', 'Very High'];

const TYPE_TITLE_MAP = {
  'matrix-grid': 'Clinical judgment',
  'dosage-calc': 'Dosage calculation',
  'cloze-dropdown': 'Acute respiratory risk',
  'drag-drop': 'Prioritization',
  'incident-report': 'Safety & incident review',
  'multiple-response': 'Multiple response',
};

export default function AssessmentReviewDashboardPage({
  resultData,
  onOpenDetailedReview,
  onReturnToAssessments,
  onNavigateHome,
  onNavigateCourses,
  onNavigatePractice,
  onNavigateReadiness,
  onNavigateLiveClasses,
  onNavigateProfile,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Question Review filtering & pagination state
  const [activeReviewTab, setActiveReviewTab] = useState('all'); // 'all' | 'correct' | 'review'
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('All topics');
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Detailed Question Review state (null = show dashboard list, index = open detailed review)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [detailedAnalyticsModalOpen, setDetailedAnalyticsModalOpen] = useState(false);
  const [activeChartTabId, setActiveChartTabId] = useState(null);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const activeResult = resultData || getLatestAssessmentResult();

  const questions = useMemo(() => activeResult?.questions || [], [activeResult]);
  const answers = useMemo(() => activeResult?.answers || {}, [activeResult]);

  // Evaluate every submitted question dynamically
  const evaluatedItems = useMemo(() => {
    return questions.map((q, idx) => {
      const userAnswer = answers[q.id];
      const evalStatus = evaluateQuestionResponse(q, userAnswer);
      const category =
        q.clientNeedsCategory ||
        q.category ||
        (q.type === 'dosage-calc'
          ? 'Pharmacological therapies'
          : q.type === 'incident-report'
          ? 'Safety and infection control'
          : q.type === 'drag-drop'
          ? 'Management of care'
          : q.type === 'cloze-dropdown'
          ? 'Reduction of risk potential'
          : 'Physiological adaptation');

      const displayTitle =
        q.reviewTitle || TYPE_TITLE_MAP[q.type] || q.typeBadge || `Question ${idx + 1}`;

      return {
        index: idx,
        displayNumber: String(idx + 1).padStart(2, '0'),
        question: q,
        userAnswer,
        isAnswered: evalStatus.isAnswered,
        isCorrect: evalStatus.isCorrect,
        category,
        displayTitle,
      };
    });
  }, [questions, answers]);

  const totalCount = evaluatedItems.length;
  const correctCount = evaluatedItems.filter((i) => i.isCorrect).length;
  const reviewCount = Math.max(0, totalCount - correctCount);
  const scorePercent =
    totalCount > 0
      ? activeResult?.scorePercent ?? Math.round((correctCount / totalCount) * 100)
      : 0;

  // Dynamic metadata with safe fallbacks computed from actual results
  const assessmentDisplayName =
    activeResult?.assessmentDisplayName || 'NCLEX-RN readiness assessment';
  const completedDateLong = activeResult?.completedDateLong || 'Completed Today';
  const attemptBadgeText = activeResult?.attemptBadgeText || 'Attempt 1 of 6';
  const passingZoneLabel =
    activeResult?.passingZoneLabel || (scorePercent >= 70 ? 'Passing Zone' : 'Needs Review');
  const rankBadgeText =
    activeResult?.rankBadgeText ||
    (scorePercent >= 85 ? 'Top 15%' : scorePercent >= 70 ? 'Top 41%' : 'Remediation');
  const readinessHeading =
    activeResult?.readinessHeading ||
    (scorePercent >= 85
      ? "You're exam ready"
      : scorePercent >= 70
      ? "You're nearly ready"
      : 'Keep building mastery');
  const readinessFeedback =
    activeResult?.readinessFeedback ||
    'Keep sharpening your weaker topics to close the final gap before your scheduled exam date.';
  const chanceOfPassingBand =
    activeResult?.chanceOfPassingBand ||
    (scorePercent >= 85
      ? 'Very High'
      : scorePercent >= 70
      ? 'High'
      : scorePercent >= 55
      ? 'Borderline'
      : 'Low');
  const chanceOfPassingLabel =
    activeResult?.chanceOfPassingLabel || `${chanceOfPassingBand} Probability`;

  const elapsedSecs = activeResult?.elapsedSeconds ?? 0;
  const timeSpentClock =
    activeResult?.timeSpentClock ||
    `${String(Math.floor(elapsedSecs / 60)).padStart(2, '0')}:${String(
      elapsedSecs % 60
    ).padStart(2, '0')}`;

  // Dynamic Strong Foundations & Focus Areas
  const strongFoundationsText = useMemo(() => {
    if (Array.isArray(activeResult?.strongFoundationsList) && activeResult.strongFoundationsList.length > 0) {
      return activeResult.strongFoundationsList.join(' · ');
    }
    const correctCats = Array.from(
      new Set(evaluatedItems.filter((i) => i.isCorrect).map((i) => i.question.shortDomain || i.category))
    );
    return correctCats.length > 0 ? correctCats.slice(0, 3).join(' · ') : 'Complete more items to establish strengths';
  }, [activeResult, evaluatedItems]);

  const focusAreasText = useMemo(() => {
    if (Array.isArray(activeResult?.focusAreasList) && activeResult.focusAreasList.length > 0) {
      return activeResult.focusAreasList.join(' · ');
    }
    const missedCats = Array.from(
      new Set(evaluatedItems.filter((i) => !i.isCorrect).map((i) => i.question.shortDomain || i.category))
    );
    return missedCats.length > 0 ? missedCats.slice(0, 3).join(' · ') : 'No critical remediation gaps detected';
  }, [activeResult, evaluatedItems]);

  // Dynamic Category Breakdown for Performance Summary
  const categoryBreakdown = useMemo(() => {
    if (Array.isArray(activeResult?.categoryBreakdown) && activeResult.categoryBreakdown.length > 0) {
      return activeResult.categoryBreakdown;
    }
    const map = {};
    evaluatedItems.forEach((item) => {
      if (!map[item.category]) {
        map[item.category] = { category: item.category, correct: 0, total: 0, cohortAvg: 57 };
      }
      map[item.category].total += 1;
      if (item.isCorrect) map[item.category].correct += 1;
    });
    return Object.values(map).map((b) => {
      const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
      return {
        category: b.category,
        correct: b.correct,
        total: b.total,
        percent: pct,
        priorPercent: 0,
        cohortAvg: b.cohortAvg,
        needsRemediation: pct < 50,
      };
    });
  }, [activeResult, evaluatedItems]);

  // Unique topics for "Filter by: All topics" dropdown
  const availableTopics = useMemo(() => {
    const set = new Set(['All topics']);
    evaluatedItems.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [evaluatedItems]);

  // Filtered items for Right Column list
  const filteredQuestionItems = useMemo(() => {
    return evaluatedItems.filter((item) => {
      if (activeReviewTab === 'correct' && !item.isCorrect) return false;
      if (activeReviewTab === 'review' && item.isCorrect) return false;
      if (selectedTopicFilter !== 'All topics' && item.category !== selectedTopicFilter) {
        return false;
      }
      return true;
    });
  }, [evaluatedItems, activeReviewTab, selectedTopicFilter]);

  const visibleQuestionItems = showAllQuestions
    ? filteredQuestionItems
    : filteredQuestionItems.slice(0, 10);

  // SVG Circular Progress Ring math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, scorePercent));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
  const ringColor =
    scorePercent >= 70 ? '#10b981' : scorePercent >= 55 ? '#f59e0b' : '#ef4444';

  const openQuestionDetail = (idx) => {
    if (onOpenDetailedReview) {
      onOpenDetailedReview(idx);
      return;
    }
    const targetItem = evaluatedItems[idx];
    if (targetItem) {
      setSelectedQuestionIndex(idx);
      setActiveChartTabId(
        targetItem.question?.defaultTab ||
          targetItem.question?.clientRecord?.tabs?.[0]?.id ||
          'orders'
      );
      window.scrollTo(0, 0);
    }
  };

  // ================= FORMAT-AWARE DETAILED QUESTION REVIEW RENDERERS =================

  const renderDetailedFormatReview = (item) => {
    const q = item.question;
    const response = item.userAnswer;

    switch (q.type) {
      // 1. MATRIX GRID REVIEW
      case 'matrix-grid': {
        const userMap = response && typeof response === 'object' ? response : {};
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#64748b] font-medium">{q.instruction}</p>
            <div className="overflow-x-auto">
              <div className="min-w-[560px] space-y-2">
                <div className="grid grid-cols-12 items-center px-4 pb-1 text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  <div className="col-span-6">ASSESSMENT FINDING</div>
                  {(q.columns || []).map((col) => (
                    <div key={col.id} className="col-span-2 text-center">
                      {col.label}
                    </div>
                  ))}
                </div>

                {(q.rows || []).map((row) => {
                  const pickedCols = Array.isArray(userMap[row.id]) ? userMap[row.id] : [];
                  const correctCols = Array.isArray(row.correctColumns) ? row.correctColumns : [];

                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-12 items-center rounded-2xl bg-white border border-[#e6eef8] px-4 py-3"
                    >
                      <div className="col-span-6 pr-3 text-xs sm:text-[13px] font-semibold text-[#0f172a]">
                        {row.finding}
                      </div>

                      {(q.columns || []).map((col) => {
                        const wasSelected = pickedCols.includes(col.id);
                        const shouldBeSelected = correctCols.includes(col.id);

                        let cellStyle = 'bg-white border border-[#cbd5e1] text-transparent';
                        let badgeHint = null;

                        if (wasSelected && shouldBeSelected) {
                          // Correctly selected -> Green
                          cellStyle = 'bg-[#10b981] border border-[#10b981] text-white';
                        } else if (wasSelected && !shouldBeSelected) {
                          // Incorrectly selected -> Red
                          cellStyle = 'bg-[#ef4444] border border-[#ef4444] text-white';
                        } else if (!wasSelected && shouldBeSelected) {
                          // Missed correct answer -> Green outline + check
                          cellStyle =
                            'bg-[#ecfdf5] border-2 border-[#10b981] text-[#059669]';
                          badgeHint = 'Missed';
                        }

                        return (
                          <div
                            key={col.id}
                            className="col-span-2 flex flex-col items-center justify-center gap-0.5"
                          >
                            <div
                              className={`w-5.5 h-5.5 rounded-md flex items-center justify-center ${cellStyle}`}
                            >
                              {wasSelected && shouldBeSelected && (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                              {wasSelected && !shouldBeSelected && (
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                              {!wasSelected && shouldBeSelected && (
                                <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                              )}
                            </div>
                            {badgeHint && (
                              <span className="text-[9px] font-bold text-[#059669]">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-[#64748b]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#10b981] inline-block" />
                Correct selection
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#ef4444] inline-block" />
                Incorrect selection
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#ecfdf5] border border-[#10b981] inline-block" />
                Correct answer (unselected)
              </span>
            </div>
          </div>
        );
      }

      // 2. DOSAGE CALCULATION REVIEW
      case 'dosage-calc': {
        const rawVal =
          typeof response === 'object' && response !== null ? response.value : response;
        const userText =
          rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== ''
            ? `${String(rawVal).trim()} ${q.unitSuffix || 'mL'}`
            : 'No answer entered';
        const correctText = `${q.correctNumeric} ${q.unitSuffix || 'mL'}`;

        return (
          <div className="space-y-4">
            {q.medicationOrder && (
              <div className="rounded-2xl border border-[#e6eef8] overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-[#edf2f7] px-4 py-2 flex items-center justify-between">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                className={`rounded-2xl p-4 border ${
                  item.isCorrect
                    ? 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]'
                    : 'bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider">
                    Your Selected Answer
                  </span>
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#ef4444]" />
                  )}
                </div>
                <div className="text-lg font-extrabold">{userText}</div>
              </div>

              <div className="rounded-2xl p-4 border bg-[#ecfdf5] border-[#86efac] text-[#065f46]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider">
                    Correct Answer
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                </div>
                <div className="text-lg font-extrabold">{correctText}</div>
              </div>
            </div>
          </div>
        );
      }

      // 3. CLOZE DROPDOWN REVIEW
      case 'cloze-dropdown': {
        const userMap = response && typeof response === 'object' ? response : {};
        return (
          <div className="space-y-3.5">
            {(q.clauses || []).map((clause) => {
              const userChoice = userMap[clause.id] || '';
              const isClauseCorrect = userChoice === clause.correctAnswer;

              return (
                <div
                  key={clause.id}
                  className="rounded-2xl bg-[#f8fafc] border border-[#e6eef8] p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#334155]">
                      {clause.prefix}{' '}
                      <span className="text-[10px] font-extrabold text-[#0066ff] uppercase ml-1">
                        ({clause.label})
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        isClauseCorrect
                          ? 'bg-[#ecfdf5] text-[#059669]'
                          : 'bg-[#fef2f2] text-[#dc2626]'
                      }`}
                    >
                      {isClauseCorrect ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 stroke-[3]" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div
                      className={`rounded-xl px-3.5 py-2.5 border text-xs font-semibold flex items-center justify-between ${
                        isClauseCorrect
                          ? 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]'
                          : 'bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]'
                      }`}
                    >
                      <span>Your choice: {userChoice || 'Not selected'}</span>
                      {isClauseCorrect ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </div>

                    {!isClauseCorrect && (
                      <div className="rounded-xl px-3.5 py-2.5 border bg-[#ecfdf5] border-[#86efac] text-[#065f46] text-xs font-semibold flex items-center justify-between">
                        <span>Correct: {clause.correctAnswer}</span>
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      // 4. DRAG & DROP SENTENCE COMPLETION REVIEW
      case 'drag-drop': {
        const slotMap = response && typeof response === 'object' ? response : {};
        const wordBankLookup = {};
        (q.wordBank || []).forEach((w) => {
          wordBankLookup[w.id] = w.text;
        });

        return (
          <div className="space-y-3.5">
            {(q.slots || []).map((slot) => {
              const userWordId = slotMap[slot.id];
              const userWordText = userWordId ? wordBankLookup[userWordId] || userWordId : null;
              const correctWordText =
                wordBankLookup[slot.correctWordId] || slot.correctWordId;
              const isSlotCorrect = userWordId === slot.correctWordId;

              return (
                <div
                  key={slot.id}
                  className="rounded-2xl bg-[#f8fafc] border border-[#e6eef8] p-4 space-y-2"
                >
                  <span className="block text-xs font-bold text-[#334155]">
                    {slot.leadText}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div
                      className={`rounded-xl px-3.5 py-2.5 border text-xs font-bold flex items-center justify-between ${
                        isSlotCorrect
                          ? 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]'
                          : 'bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]'
                      }`}
                    >
                      <span>Your answer: {userWordText || 'Blank slot'}</span>
                      {isSlotCorrect ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </div>

                    {!isSlotCorrect && (
                      <div className="rounded-xl px-3.5 py-2.5 border bg-[#ecfdf5] border-[#86efac] text-[#065f46] text-xs font-bold flex items-center justify-between">
                        <span>Correct: {correctWordText}</span>
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      // 5. INCIDENT REPORT REVIEW
      case 'incident-report': {
        const pickedList = Array.isArray(response) ? response : [];
        return (
          <div className="space-y-2.5">
            {(q.segments || []).map((seg) => {
              const wasPicked = pickedList.includes(seg.id);
              const isRelevant = Boolean(seg.isRelevant);

              let cardClasses = 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569]';
              let statusBadge = null;

              if (wasPicked && isRelevant) {
                cardClasses = 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]';
                statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#047857] text-[10.5px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Correctly Selected
                  </span>
                );
              } else if (wasPicked && !isRelevant) {
                cardClasses = 'bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]';
                statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] text-[10.5px] font-bold shrink-0">
                    <X className="w-3 h-3 stroke-[3]" />
                    Incorrect Selection
                  </span>
                );
              } else if (!wasPicked && isRelevant) {
                cardClasses = 'bg-[#ecfdf5]/60 border-[#6ee7b7] text-[#065f46]';
                statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#047857] text-[10.5px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Correct Answer (Missed)
                  </span>
                );
              }

              return (
                <div
                  key={seg.id}
                  className={`rounded-2xl p-3.5 border text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${cardClasses}`}
                >
                  <span className="font-medium">{seg.text}</span>
                  {statusBadge}
                </div>
              );
            })}
          </div>
        );
      }

      // 6. MULTIPLE RESPONSE (SATA) & STANDARD OPTIONS REVIEW
      case 'multiple-response':
      default: {
        const pickedList = Array.isArray(response)
          ? response
          : response
          ? [response]
          : [];

        return (
          <div className="space-y-2.5">
            {(q.options || []).map((opt) => {
              const wasPicked = pickedList.includes(opt.id);
              const isOptionCorrect = Boolean(
                opt.isCorrect || (q.correctOptionId && q.correctOptionId === opt.id)
              );

              let rowClasses = 'bg-white border-[#e6eef8] text-[#334155]';
              let pill = null;

              if (wasPicked && isOptionCorrect) {
                rowClasses = 'bg-[#ecfdf5] border-[#86efac] text-[#065f46]';
                pill = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#047857] text-[10.5px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Your Selection · Correct
                  </span>
                );
              } else if (wasPicked && !isOptionCorrect) {
                rowClasses = 'bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]';
                pill = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] text-[10.5px] font-bold shrink-0">
                    <X className="w-3 h-3 stroke-[3]" />
                    Your Selection · Incorrect
                  </span>
                );
              } else if (!wasPicked && isOptionCorrect) {
                rowClasses = 'bg-[#ecfdf5]/65 border-[#6ee7b7] text-[#065f46]';
                pill = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#047857] text-[10.5px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Correct Answer
                  </span>
                );
              }

              return (
                <div
                  key={opt.id}
                  className={`rounded-2xl p-4 border text-xs sm:text-[13px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${rowClasses}`}
                >
                  <span className="font-medium leading-relaxed">
                    {opt.label ? <strong className="mr-1.5">{opt.label}.</strong> : null}
                    {opt.text}
                  </span>
                  {pill}
                </div>
              );
            })}
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f8fb] md:bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-28 md:pb-20">
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

        {/* Right Nav Utilities */}
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
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#0f172a]">Notifications</span>
                    <span className="text-[10px] text-[#006ee6] font-semibold cursor-pointer">
                      Mark read
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9] text-xs text-[#64748b]">
                    <p className="font-medium text-[#1e293b]">
                      Performance Report Ready ({scorePercent}%)
                    </p>
                    <p className="text-[11px] text-[#94a3b8]">
                      Click any question in Question review to inspect rationales.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            onClick={onNavigateProfile}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full bg-[#f8fafc] border border-[#eef2f6] cursor-pointer hover:bg-[#f1f5f9] transition"
            title="Open My space profile"
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
        MAIN CONTAINER
        ========================================================================
      */}
      <main className="w-full md:w-[92%] max-w-[1440px] mx-auto px-5 sm:px-4 lg:px-6 pt-3 md:pt-6 space-y-5 md:space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <button
            type="button"
            onClick={onNavigatePractice}
            className="hover:text-[#0066e6] transition cursor-pointer"
          >
            Practice
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
          <button
            type="button"
            onClick={onNavigateReadiness || onReturnToAssessments}
            className="hover:text-[#0066e6] transition cursor-pointer"
          >
            Readiness Assessments
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
          <span className="font-semibold text-[#0f172a]">Assessment Results</span>
        </nav>

        {/* Page Title & Action Header Row */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
              Assessment results
            </h1>
            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-[13px] text-[#64748b]">
              <span>{assessmentDisplayName}</span>
              <span className="text-[#cbd5e1]">•</span>
              <span>{completedDateLong}</span>
              <span className="text-[#cbd5e1]">•</span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] text-[11px] font-bold">
                {attemptBadgeText}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center flex-wrap gap-3 self-start md:self-center">
            <button
              type="button"
              onClick={() => {
                if (evaluatedItems.length > 0) {
                  openQuestionDetail(0);
                }
              }}
              className="h-[42px] px-6 rounded-xl bg-[#1d63ed] hover:bg-[#1554d1] text-white text-xs sm:text-[13px] font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(29,99,237,0.22)] transition cursor-pointer"
            >
              <span>Review answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onReturnToAssessments}
              className="h-[42px] px-5 rounded-xl bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] text-xs sm:text-[13px] font-semibold transition cursor-pointer"
            >
              Return to assessments
            </button>
          </div>
        </section>

        {selectedQuestionIndex !== null && evaluatedItems[selectedQuestionIndex] ? (
          /* 
            ========================================================================
            DETAILED QUESTION REVIEW VIEW
            Opened when clicking any question row or "Review answers ->"
            ========================================================================
          */
          (() => {
            const detailItem = evaluatedItems[selectedQuestionIndex];
            const q = detailItem.question;
            const recordTabs = q.clientRecord?.tabs || [];
            const activeRecordTab =
              recordTabs.find((t) => t.id === activeChartTabId) || recordTabs[0];

            return (
              <section className="space-y-5 text-left">
                {/* Top Review Navigation Bar */}
                <div className="rounded-2xl bg-white border border-[#e6eef8] px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestionIndex(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066e6] hover:underline cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to all questions ({totalCount})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={selectedQuestionIndex === 0}
                      onClick={() => openQuestionDetail(selectedQuestionIndex - 1)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-[#334155] flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <span className="text-xs font-bold text-[#0f172a] px-2">
                      Question {selectedQuestionIndex + 1} of {totalCount}
                    </span>
                    <button
                      type="button"
                      disabled={selectedQuestionIndex >= totalCount - 1}
                      onClick={() => openQuestionDetail(selectedQuestionIndex + 1)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-[#334155] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Split View: Client Record (if clinical case) + Question & Rationale Review */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {q.type !== 'dosage-calc' && recordTabs.length > 0 && (
                    <aside className="lg:col-span-4 rounded-3xl bg-white border border-[#e6eef8] shadow-2xs overflow-hidden">
                      <div className="px-5 pt-4 pb-3 border-b border-[#f1f5f9] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0066e6]" />
                        <span className="text-xs font-bold text-[#0f172a]">Client record</span>
                      </div>

                      <div className="px-4 py-3 border-b border-[#f1f5f9] flex flex-wrap gap-1.5">
                        {recordTabs.map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveChartTabId(tab.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                              activeRecordTab?.id === tab.id
                                ? 'bg-[#0066ff] text-white'
                                : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                            }`}
                          >
                            {tab.shortLabel || tab.label}
                          </button>
                        ))}
                      </div>

                      {activeRecordTab && (
                        <div className="p-4 space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-[#0066e6] uppercase">
                              {activeRecordTab.badgeTitle}
                            </span>
                            <span className="text-[10.5px] font-mono text-[#64748b]">
                              {activeRecordTab.time || activeRecordTab.timeTag}
                            </span>
                          </div>

                          <div className="rounded-xl bg-[#f2f8ff] border border-[#d8e9ff] p-3 font-semibold text-[#0f172a] leading-relaxed">
                            {activeRecordTab.primaryBox || activeRecordTab.labHighlight}
                          </div>

                          {activeRecordTab.directiveBody && (
                            <div className="rounded-xl bg-[#f8fafc] border border-[#edf2f7] p-3 text-[#334155] leading-relaxed">
                              <strong className="block text-[10px] text-[#64748b] uppercase mb-1">
                                {activeRecordTab.directiveTitle}
                              </strong>
                              {activeRecordTab.directiveBody}
                            </div>
                          )}

                          {activeRecordTab.casePresentation && (
                            <p className="text-[11.5px] text-[#64748b] leading-relaxed">
                              {activeRecordTab.casePresentation}
                            </p>
                          )}
                        </div>
                      )}
                    </aside>
                  )}

                  {/* Detailed Question & Explanation Card */}
                  <div
                    className={`${
                      q.type !== 'dosage-calc' && recordTabs.length > 0
                        ? 'lg:col-span-8'
                        : 'lg:col-span-12'
                    } rounded-3xl bg-white border border-[#e6eef8] shadow-2xs p-5 sm:p-8 space-y-6`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#f1f5f9] pb-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center ${
                            detailItem.isCorrect
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#fee2e2] text-[#dc2626]'
                          }`}
                        >
                          {detailItem.displayNumber}
                        </span>
                        <div>
                          <span className="text-[10.5px] font-extrabold text-[#0066e6] uppercase tracking-wider block">
                            {q.typeBadge || detailItem.displayTitle} · {detailItem.category}
                          </span>
                          <span className="text-xs font-semibold text-[#64748b]">
                            {detailItem.displayTitle}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          detailItem.isCorrect
                            ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#059669]'
                            : 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'
                        }`}
                      >
                        {detailItem.isCorrect ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                            <span>Correct</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 stroke-[2.8]" />
                            <span>Incorrect</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Original Question Stem / Scenario */}
                    <div className="space-y-2">
                      {q.scenarioText && (
                        <p className="text-sm sm:text-[15.5px] font-semibold text-[#1e293b] leading-relaxed">
                          {q.scenarioText}
                        </p>
                      )}
                      {q.prompt && (
                        <h2 className="text-base sm:text-[18px] font-extrabold text-[#0f172a] leading-snug">
                          {q.prompt}
                        </h2>
                      )}
                    </div>

                    {/* Format-Specific Answer Comparison */}
                    {renderDetailedFormatReview(detailItem)}

                    {/* Answer Explanation & Clinical Rationale */}
                    {q.rationale && (
                      <div className="rounded-2xl bg-[#f0f7ff] border border-[#dbeafe] p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[#0058db]">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-xs font-extrabold uppercase tracking-wider">
                            Answer Explanation & Clinical Rationale
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] leading-[1.65] text-[#1e293b]">
                          {q.rationale}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })()
        ) : (
          /* 
            ========================================================================
            TWO-COLUMN PERFORMANCE DASHBOARD & QUESTION REVIEW (Matches Reference)
            ========================================================================
          */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ================= LEFT SECTION: PERFORMANCE DASHBOARD (5 cols) ================= */}
            <div className="lg:col-span-5 space-y-5 text-left">
              {/* Card 1: Score Ring, Chance of Passing, Correct/Time, Strong & Focus Areas */}
              <section className="rounded-3xl bg-white border border-[#e9eff6] shadow-[0_2px_12px_rgba(15,23,42,0.025)] p-5 sm:p-6 space-y-5">
                {/* Score Gauge + Readiness Feedback */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
                  {/* Circular Progress Gauge */}
                  <div className="relative w-[124px] h-[124px] shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#e9eff5"
                        strokeWidth="9.5"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="9.5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[24px] font-extrabold text-[#0f172a] leading-none tracking-tight">
                        {scorePercent}%
                      </span>
                      <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest mt-1">
                        SCORE
                      </span>
                      <span
                        className={`mt-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold ${
                          scorePercent >= 70
                            ? 'bg-[#ecfdf5] text-[#059669]'
                            : 'bg-[#fffbeb] text-[#d97706]'
                        }`}
                      >
                        {passingZoneLabel}
                      </span>
                    </div>
                  </div>

                  {/* Performance Level & Feedback */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[10.5px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>{rankBadgeText}</span>
                    </span>
                    <h2 className="text-base sm:text-[17px] font-extrabold text-[#0f172a] leading-snug">
                      {readinessHeading}
                    </h2>
                    <p className="text-xs leading-[1.55] text-[#64748b]">{readinessFeedback}</p>
                  </div>
                </div>

                <div className="border-t border-[#f1f5f9]" />

                {/* Chance of Passing Segmented Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-extrabold text-[#64748b] uppercase tracking-wider">
                      CHANCE OF PASSING
                    </span>
                    <span
                      className={`font-bold ${
                        scorePercent >= 70
                          ? 'text-[#059669]'
                          : scorePercent >= 55
                          ? 'text-[#d97706]'
                          : 'text-[#dc2626]'
                      }`}
                    >
                      {chanceOfPassingLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 rounded-xl bg-[#f1f5f9] p-1 gap-1">
                    {CHANCE_BANDS.map((band) => {
                      const isActive = band === chanceOfPassingBand;
                      let activeColor = 'bg-[#10b981] text-white shadow-2xs';
                      if (band === 'Low') activeColor = 'bg-[#ef4444] text-white shadow-2xs';
                      if (band === 'Borderline') activeColor = 'bg-[#f59e0b] text-white shadow-2xs';

                      return (
                        <div
                          key={band}
                          className={`py-1.5 rounded-lg text-center text-[11px] font-semibold transition ${
                            isActive ? activeColor : 'text-[#94a3b8]'
                          }`}
                        >
                          {band}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Correct Answers & Time Spent Mini Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white border border-[#e9eff6] p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] shrink-0">
                      <Check className="w-4 h-4 stroke-[2.6]" />
                    </div>
                    <div>
                      <span className="block text-[10.5px] font-medium text-[#64748b]">
                        Correct answers
                      </span>
                      <span className="text-[15px] sm:text-base font-extrabold text-[#0f172a]">
                        {correctCount} / {totalCount}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-[#e9eff6] p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#0066e6] shrink-0">
                      <Clock className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-[10.5px] font-medium text-[#64748b]">
                        Time spent
                      </span>
                      <span className="text-[15px] sm:text-base font-extrabold text-[#0f172a]">
                        {timeSpentClock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Strong Foundations & Focus Area Callouts */}
                <div className="space-y-2.5">
                  <div className="rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-3 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="block font-bold text-[#0f172a]">Strong foundations</span>
                      <span className="text-[11.5px] font-medium text-[#15803d]">
                        {strongFoundationsText}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fffbeb] border border-[#fde68a] px-4 py-3 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="block font-bold text-[#78350f]">Focus area to improve</span>
                      <span className="text-[11.5px] font-medium text-[#b45309]">
                        {focusAreasText}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Card 2: Performance Summary (Client Needs Breakdown) */}
              <section className="rounded-3xl bg-white border border-[#e9eff6] shadow-[0_2px_12px_rgba(15,23,42,0.025)] p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-[15px] font-extrabold text-[#0f172a]">
                      Performance summary
                    </h2>
                    <p className="text-[11.5px] text-[#64748b] mt-0.5">
                      Breakdown by NCLEX-RN Client Needs
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetailedAnalyticsModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0066e6] hover:underline cursor-pointer"
                  >
                    <span>Detailed</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {categoryBreakdown.map((cat) => {
                    const pct = cat.percent;
                    const isLow = pct < 50;
                    const isHigh = pct >= 85;
                    const isGood = pct >= 70 && pct < 85;

                    let cardBg = 'bg-[#fcfdff] border-[#edf2f7]';
                    let barColor = 'bg-[#f59e0b]';
                    let pctTextClass = 'text-[#d97706]';

                    if (isLow) {
                      cardBg = 'bg-[#fffafa] border-[#fee2e2]';
                      barColor = 'bg-[#ef4444]';
                      pctTextClass = 'text-[#dc2626]';
                    } else if (isHigh) {
                      cardBg = 'bg-[#fcfdff] border-[#edf2f7]';
                      barColor = 'bg-[#1d63ed]';
                      pctTextClass = 'text-[#1d63ed]';
                    } else if (isGood) {
                      cardBg = 'bg-[#fcfdff] border-[#edf2f7]';
                      barColor = 'bg-[#10b981]';
                      pctTextClass = 'text-[#059669]';
                    }

                    return (
                      <div
                        key={cat.category}
                        className={`rounded-2xl border p-3.5 space-y-2 ${cardBg}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#0f172a]">{cat.category}</span>
                          <span
                            className={`inline-flex items-center gap-0.5 text-xs font-extrabold ${pctTextClass}`}
                          >
                            <span>{pct}%</span>
                            {pct >= 70 && <ArrowUp className="w-3 h-3" />}
                            {isLow && <ArrowDown className="w-3 h-3" />}
                          </span>
                        </div>

                        {/* Progress Track */}
                        <div className="w-full h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.max(4, pct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10.5px]">
                          {isLow ? (
                            <span className="font-semibold text-[#dc2626]">Needs remediation</span>
                          ) : (
                            <span className="text-[#94a3b8]">
                              {cat.priorPercent}% prior attempt
                            </span>
                          )}
                          <span className="text-[#94a3b8]">{cat.cohortAvg}% avg. others</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* ================= RIGHT SECTION: QUESTION REVIEW (7 cols) ================= */}
            <section className="lg:col-span-7 rounded-3xl bg-white border border-[#e9eff6] shadow-[0_2px_12px_rgba(15,23,42,0.025)] p-5 sm:p-7 text-left space-y-5">
              {/* Top Heading & Topic Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-[17px] font-extrabold text-[#0f172a]">
                    Question review
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Analyze your decision making and item rationales
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs text-[#64748b] whitespace-nowrap">Filter by:</span>
                  <div className="relative">
                    <select
                      aria-label="Filter questions by topic"
                      value={selectedTopicFilter}
                      onChange={(e) => setSelectedTopicFilter(e.target.value)}
                      className="appearance-none rounded-xl border border-[#e2e8f0] bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-[#1e293b] outline-hidden focus:border-[#1d63ed] cursor-pointer"
                    >
                      {availableTopics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Filter Tabs: All | Correct | Review */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewTab('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeReviewTab === 'all'
                      ? 'bg-[#1d63ed] text-white shadow-2xs'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  All {totalCount}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReviewTab('correct')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeReviewTab === 'correct'
                      ? 'bg-[#1d63ed] text-white shadow-2xs'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Correct {correctCount}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReviewTab('review')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeReviewTab === 'review'
                      ? 'bg-[#1d63ed] text-white shadow-2xs'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  <span>Review {reviewCount}</span>
                  {reviewCount > 0 && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeReviewTab === 'review' ? 'bg-white' : 'bg-[#ef4444]'
                      }`}
                    />
                  )}
                </button>
              </div>

              {/* Question Rows List */}
              <div className="divide-y divide-[#f1f5f9] border-t border-[#f1f5f9]">
                {visibleQuestionItems.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#64748b]">
                    No questions match the selected filter.
                  </div>
                ) : (
                  visibleQuestionItems.map((item) => (
                    <button
                      key={item.question.id}
                      type="button"
                      onClick={() => openQuestionDetail(item.index)}
                      className="w-full py-3.5 px-2 hover:bg-[#f8fafc] rounded-xl transition flex items-center justify-between gap-3 text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Number Square */}
                        <div
                          className={`w-9 h-9 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 ${
                            item.isCorrect
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#fee2e2] text-[#dc2626]'
                          }`}
                        >
                          {item.displayNumber}
                        </div>

                        {/* Title & Category Subtitle */}
                        <div className="min-w-0">
                          <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#0f172a] truncate group-hover:text-[#0066e6] transition">
                            {item.displayTitle}
                          </h3>
                          <p className="text-[11px] text-[#94a3b8] truncate mt-0.5">
                            {item.isCorrect ? 'Correct' : 'Incorrect'} · {item.category}
                          </p>
                        </div>
                      </div>

                      {/* Right Status Badge + Chevron */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        {item.isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ecfdf5] border border-[#bbf7d0] text-[#059669] text-[11px] font-bold">
                            <Check className="w-3 h-3 stroke-[2.8]" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[11px] font-bold">
                            <X className="w-3 h-3 stroke-[2.8]" />
                            <span>Incorrect</span>
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#0066e6] transition" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer: Showing X of Y questions + View all questions -> */}
              <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-[#64748b]">
                  Showing {visibleQuestionItems.length} of {filteredQuestionItems.length} questions
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (filteredQuestionItems.length > 10) {
                      setShowAllQuestions(!showAllQuestions);
                    } else if (evaluatedItems.length > 0) {
                      openQuestionDetail(0);
                    }
                  }}
                  className="inline-flex items-center gap-1 font-bold text-[#1d63ed] hover:underline cursor-pointer"
                >
                  <span>
                    {filteredQuestionItems.length > 10 && showAllQuestions
                      ? 'Show compact list'
                      : `View all ${filteredQuestionItems.length} questions`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Detailed Client Needs Modal */}
      {detailedAnalyticsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDetailedAnalyticsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                  NCSBN CLIENT NEEDS ANALYTICS
                </span>
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  Detailed Category Breakdown
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailedAnalyticsModalOpen(false)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#334155] hover:bg-[#f1f5f9] cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map((c) => (
                <div
                  key={c.category}
                  className="rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0f172a] block">{c.category}</span>
                    <span className="text-[11px] text-[#64748b]">
                      {c.correct} of {c.total} items correct · Peer benchmark {c.cohortAvg}%
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0066e6]">{c.percent}%</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailedAnalyticsModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#1d63ed] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

