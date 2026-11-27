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
  BookOpen,
  FileText,
  ExternalLink,
  AlertCircle,
  LayoutGrid,
  ListFilter,
  GripVertical,
  X,
  ArrowRight,
  Edit3,
  ChevronDown,
  Check,
  Info,
  ShieldAlert,
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import myspaceAvatar from '../assets/myspace-avatar.png';
import {
  loadAssessmentQuestions,
  evaluateQuestionResponse,
} from '../services/assessmentService';

const ANSWERS_STORAGE_KEY = 'canopedia_ngn_exam_answers';
const FLAGS_STORAGE_KEY = 'canopedia_ngn_exam_flags';

export default function AssessmentQuestionsPage({
  assessmentTitle = 'NCLEX-RN PRACTICE',
  assessmentContext = {},
  onBackToLesson,
  onExitToDashboard,
}) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      const cached = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });
  const [flagged, setFlagged] = useState(() => {
    try {
      const cached = sessionStorage.getItem(FLAGS_STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  // Countdown timer (starts at 35:00 = 2100 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(2100);
  const [submitted, setSubmitted] = useState(false);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState(false);
  const [clientRecordModalOpen, setClientRecordModalOpen] = useState(false);

  // Per-question active Client Record tab
  const [activeChartTabByQuestion, setActiveChartTabByQuestion] = useState({});

  // Drag-and-drop state for sentence completion
  const [draggedWordId, setDraggedWordId] = useState(null);
  const [dragSourceSlotId, setDragSourceSlotId] = useState(null);
  const [selectedWordBankId, setSelectedWordBankId] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadAssessmentQuestions(assessmentContext).then((loaded) => {
      if (mounted) {
        setQuestions(loaded || []);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [assessmentContext]);

  useEffect(() => {
    try {
      sessionStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore storage errors
    }
  }, [answers]);

  useEffect(() => {
    try {
      sessionStorage.setItem(FLAGS_STORAGE_KEY, JSON.stringify(flagged));
    } catch {
      // ignore storage errors
    }
  }, [flagged]);

  useEffect(() => {
    if (submitted || isLoading) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, isLoading]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f4f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-[#0066e6] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-[#64748b]">Loading clinical assessment...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || questions[0];

  if (!currentQuestion) {
    return null;
  }

  const currentAnswer = answers[currentQuestion.id];
  const isCurrentFlagged = Boolean(flagged[currentQuestion.id]);

  const activeTabId =
    activeChartTabByQuestion[currentQuestion.id] ||
    currentQuestion.defaultTab ||
    currentQuestion.clientRecord?.tabs?.[0]?.id ||
    'orders';

  const setActiveTabForCurrent = (tabId) => {
    setActiveChartTabByQuestion((prev) => ({
      ...prev,
      [currentQuestion.id]: tabId,
    }));
  };

  const updateCurrentAnswer = (nextVal) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]:
        typeof nextVal === 'function' ? nextVal(prev[currentQuestion.id]) : nextVal,
    }));
  };

  const toggleFlagCurrent = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const goToPrevious = () => {
    setSelectedWordBankId(null);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };

  const goToNext = () => {
    setSelectedWordBankId(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setShowEndExamModal(true);
    }
  };

  const handleFinishExam = () => {
    setShowEndExamModal(false);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleRetake = () => {
    setAnswers({});
    setFlagged({});
    try {
      sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
      sessionStorage.removeItem(FLAGS_STORAGE_KEY);
    } catch {
      // ignore
    }
    setCurrentIndex(0);
    setSecondsRemaining(2100);
    setSubmitted(false);
    window.scrollTo(0, 0);
  };

  // ================= QUESTION TYPE INTERACTION HANDLERS =================

  // 1. Matrix Grid toggle
  const handleMatrixToggle = (rowId, colId) => {
    updateCurrentAnswer((prev) => {
      const currentMap = prev && typeof prev === 'object' ? { ...prev } : {};
      const existingRow = Array.isArray(currentMap[rowId]) ? [...currentMap[rowId]] : [];
      const nextRow = existingRow.includes(colId)
        ? existingRow.filter((c) => c !== colId)
        : [...existingRow, colId];
      return {
        ...currentMap,
        [rowId]: nextRow,
      };
    });
  };

  // 2. Dosage Calculation input & Proceed
  const handleDosageChange = (rawText) => {
    // Allow numbers and single decimal point only (no unit text)
    const cleaned = rawText.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
    updateCurrentAnswer({ value: formatted, confirmed: false });
  };

  const handleDosageProceed = () => {
    const rawVal =
      typeof currentAnswer === 'object' && currentAnswer !== null
        ? currentAnswer.value
        : currentAnswer || '';
    if (!String(rawVal).trim()) return;
    updateCurrentAnswer({ value: String(rawVal).trim(), confirmed: true });
    goToNext();
  };

  // 3. Cloze Drop-down change
  const handleClozeSelect = (clauseId, value) => {
    updateCurrentAnswer((prev) => ({
      ...(prev && typeof prev === 'object' ? prev : {}),
      [clauseId]: value,
    }));
  };

  // 4. Drag and Drop Words handlers
  const handleAssignWordToSlot = (slotId, wordId, fromSlotId = null) => {
    if (!wordId) return;
    updateCurrentAnswer((prev) => {
      const currentSlots = prev && typeof prev === 'object' ? { ...prev } : {};
      const displacedWordId = currentSlots[slotId];

      // Remove wordId from any other slot where it already sits
      Object.keys(currentSlots).forEach((sKey) => {
        if (currentSlots[sKey] === wordId) {
          delete currentSlots[sKey];
        }
      });

      // If dragged from another slot and target had a word, swap them
      if (fromSlotId && displacedWordId && fromSlotId !== slotId) {
        currentSlots[fromSlotId] = displacedWordId;
      }

      currentSlots[slotId] = wordId;
      return currentSlots;
    });
    setDraggedWordId(null);
    setDragSourceSlotId(null);
    setSelectedWordBankId(null);
  };

  const handleRemoveWordFromSlot = (slotId) => {
    updateCurrentAnswer((prev) => {
      const currentSlots = prev && typeof prev === 'object' ? { ...prev } : {};
      delete currentSlots[slotId];
      return currentSlots;
    });
  };

  // 5. Incident Report segment toggle
  const handleIncidentSegmentToggle = (segId) => {
    updateCurrentAnswer((prev) => {
      const list = Array.isArray(prev) ? [...prev] : [];
      return list.includes(segId) ? list.filter((id) => id !== segId) : [...list, segId];
    });
  };

  // 6. Multiple Response option toggle
  const handleMultipleResponseToggle = (optionId) => {
    updateCurrentAnswer((prev) => {
      const list = Array.isArray(prev) ? [...prev] : [];
      return list.includes(optionId)
        ? list.filter((id) => id !== optionId)
        : [...list, optionId];
    });
  };

  // ================= CLIENT RECORD PANEL RENDERER =================
  const renderClientRecordContent = (record, isModal = false) => {
    if (!record) return null;
    const tabs = record.tabs || [];
    const activeTabObj = tabs.find((t) => t.id === activeTabId) || tabs[0];

    return (
      <div
        className={`rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col ${
          isModal ? '' : 'h-full'
        }`}
      >
        {/* Optional Top Client Record Header Row (Matches Matrix Grid reference) */}
        {currentQuestion.type === 'matrix-grid' || isModal ? (
          <div className="px-5 pt-4 pb-3 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#eef5ff] flex items-center justify-center text-[#0066e6]">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px] font-bold text-[#0f172a]">Client record</span>
            </div>

            {!isModal && (
              <button
                type="button"
                onClick={() => setClientRecordModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#0066e6] hover:underline cursor-pointer"
              >
                <span>Tap to review</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : null}

        {/* Chart Category Pill Tabs */}
        <div className="px-5 pt-4 pb-3.5 border-b border-[#f1f5f9] flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const isTabActive = tab.id === activeTabObj?.id;
            const displayLabel =
              currentQuestion.useShortLabLabel && tab.shortLabel ? tab.shortLabel : tab.label;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabForCurrent(tab.id)}
                className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isTabActive
                    ? 'bg-[#0066ff] text-white shadow-2xs'
                    : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0f172a]'
                }`}
              >
                <span>{displayLabel}</span>
                {tab.hasDot && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isTabActive ? 'bg-white' : 'bg-[#0066ff]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Chart Tab Body */}
        {activeTabObj && (
          <div className="p-5 space-y-4 text-left flex-1">
            {activeTabObj.id === 'laboratory' ? (
              /* Laboratory Results Layout (Matches Matrix Grid Screenshot) */
              <>
                <div className="rounded-2xl bg-white border border-[#e6eef8] p-4 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                      {activeTabObj.badgeTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10.5px] font-mono font-semibold">
                      {activeTabObj.timeTag}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#f8fbff] border border-[#dceafe] p-3.5">
                    <p className="text-xs font-bold text-[#0f172a] leading-relaxed">
                      {activeTabObj.labHighlight}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11.5px] text-[#475569]">
                    {(activeTabObj.labSecondaryLines || []).map((line, i) => (
                      <p key={i}>
                        {line.text}
                        <strong className="font-bold text-[#0f172a]">{line.bold}</strong>
                        {line.mid}
                        <strong className="font-bold text-[#0f172a]">{line.bold2}</strong>
                        {line.end}
                      </p>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10.5px] text-[#64748b]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#334155]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Verified electronic transfer
                    </span>
                    <span className="font-mono text-[#94a3b8]">{activeTabObj.verifiedRef}</span>
                  </div>
                </div>

                {/* Clinical Case Presentation Box */}
                <div className="rounded-2xl bg-[#f8fafc] border border-[#eef2f6] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                    <span className="text-[11px] font-bold text-[#0f172a]">
                      Clinical Case Presentation
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-[1.58] text-[#64748b]">
                    {activeTabObj.casePresentation}
                  </p>
                </div>
              </>
            ) : (
              /* Orders / Admission / Nurse's Notes / Flowsheet Layout (Matches Cloze & Drag-Drop Screenshots) */
              <>
                <div className="rounded-2xl bg-white border border-[#e6eef8] border-t-[3px] border-t-[#0066ff] p-4 space-y-3.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#eef5ff] text-[#005ce6] text-[10px] font-extrabold uppercase tracking-wider">
                      {activeTabObj.badgeTitle}
                    </span>
                    <span className="text-[10.5px] font-mono font-semibold text-[#64748b]">
                      {activeTabObj.time}
                    </span>
                  </div>

                  {/* Highlighted Order / Clinical Box */}
                  <div className="rounded-xl bg-[#f2f8ff] border border-[#d8e9ff] p-3.5">
                    <p className="text-[12.5px] font-bold text-[#0f172a] leading-relaxed">
                      {activeTabObj.primaryBox}
                    </p>
                  </div>

                  {/* Standing Directives Box */}
                  <div className="rounded-xl bg-[#f8fafc] border border-[#edf2f7] p-3.5 space-y-1">
                    <span className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                      {activeTabObj.directiveTitle}
                    </span>
                    <p className="text-xs leading-relaxed text-[#334155]">
                      {activeTabObj.directiveBody}
                    </p>
                  </div>

                  {/* Clinical Focus Note */}
                  {activeTabObj.note && (
                    <div className="flex items-start gap-2 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-[1.5] text-[#64748b]">
                        {activeTabObj.note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Vitals Strip */}
                {activeTabObj.vitals && (
                  <div className="rounded-2xl bg-[#f8fafc] border border-[#edf2f7] p-3.5 space-y-2.5">
                    <span className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                      {activeTabObj.vitalsTitle}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeTabObj.vitals.map((v, i) => (
                        <div
                          key={i}
                          className="rounded-xl bg-white border border-[#e6eef8] py-2 px-2 text-center"
                        >
                          <span className="block text-[9.5px] font-semibold text-[#94a3b8] uppercase">
                            {v.label}
                          </span>
                          <span
                            className={`block text-[11.5px] font-mono font-bold mt-0.5 ${
                              v.alert ? 'text-[#e11d48]' : 'text-[#0f172a]'
                            }`}
                          >
                            {v.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ================= QUESTION TYPE RENDERERS =================

  // 1. MATRIX GRID
  const renderMatrixGridQuestion = (q) => {
    const rowSelections = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};

    return (
      <div className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-5 sm:p-8 text-left space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#eef5ff] text-[#0066e6] text-[10.5px] font-extrabold uppercase tracking-wider mb-3">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{q.typeBadge || 'MATRIX GRID'}</span>
          </span>

          <h1 className="text-[19px] sm:text-[22px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
            {q.prompt}
          </h1>
        </div>

        {/* Instruction Banner */}
        <div className="rounded-xl bg-[#f4f9ff] border border-[#e0eeff] px-4 py-3 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0" />
          <p className="text-xs text-[#475569] font-medium">{q.instruction}</p>
        </div>

        {/* Responsive Matrix Table */}
        <div className="overflow-x-auto pt-1">
          <div className="min-w-[560px] space-y-2.5">
            {/* Column Headers */}
            <div className="grid grid-cols-12 items-center px-4 pb-1 text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
              <div className="col-span-6 text-left">ASSESSMENT FINDING</div>
              {(q.columns || []).map((col) => (
                <div key={col.id} className="col-span-2 text-center">
                  {col.label}
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {(q.rows || []).map((row) => {
              const checkedCols = Array.isArray(rowSelections[row.id])
                ? rowSelections[row.id]
                : [];

              return (
                <div
                  key={row.id}
                  className="grid grid-cols-12 items-center rounded-2xl bg-white border border-[#e6eef8] hover:border-[#cbd5e1] px-4 py-3.5 transition shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
                >
                  <div className="col-span-6 pr-3 text-[12.5px] sm:text-[13px] font-semibold text-[#1e293b]">
                    {row.finding}
                  </div>

                  {(q.columns || []).map((col) => {
                    const isChecked = checkedCols.includes(col.id);
                    return (
                      <div key={col.id} className="col-span-2 flex items-center justify-center">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isChecked}
                          aria-label={`${row.finding} — ${col.label}`}
                          onClick={() => handleMatrixToggle(row.id, col.id)}
                          className={`w-5.5 h-5.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#0066ff] border border-[#0066ff] text-white shadow-2xs'
                              : 'bg-white border border-[#cbd5e1] hover:border-[#0066ff]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 2. DOSAGE CALCULATION (Matches Screenshot 1 exactly)
  const renderDosageCalcLayout = (q) => {
    const rawValue =
      typeof currentAnswer === 'object' && currentAnswer !== null
        ? currentAnswer.value
        : currentAnswer || '';

    return (
      <div className="space-y-5">
        {/* Top Sub-bar: Topic Pill + Numeric Fill-in Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#e8f2ff] text-[#0066e6] text-[10.5px] font-extrabold uppercase tracking-wider">
              {q.topicBadge || 'PEDIATRIC MEDICATION'}
            </span>
            <span className="text-xs text-[#64748b] font-medium">
              {q.topicSubheading || 'Clinical Dosage Calculation'}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e2e8f0] text-[#334155] text-[10.5px] font-bold uppercase tracking-wider shadow-2xs">
            <FileText className="w-3 h-3 text-[#0066e6]" />
            <span>{q.typeBadge || 'NUMERIC FILL-IN'}</span>
          </span>
        </div>

        {/* Two-Card Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Card: Clinical Scenario & Medication Order (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 sm:p-8 text-left space-y-6">
            <h1 className="text-[18px] sm:text-[21px] font-extrabold text-[#0f172a] leading-[1.42] tracking-tight">
              {q.scenarioText}
            </h1>

            {/* Medication Order Box */}
            <div className="rounded-2xl border border-[#e6eef8] overflow-hidden">
              <div className="bg-[#f8fafc] border-b border-[#edf2f7] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-[#0066e6]" />
                  <span className="text-[10.5px] font-extrabold text-[#1e293b] uppercase tracking-wider">
                    MEDICATION ORDER
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#64748b]">
                  {q.medicationOrder?.unitLabel}
                </span>
              </div>

              <div className="p-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                    PRESCRIBED DOSE
                  </span>
                  <span className="text-base sm:text-[17px] font-extrabold text-[#0f172a]">
                    {q.medicationOrder?.prescribedDose}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                    AVAILABLE CONCENTRATION
                  </span>
                  <span className="text-base sm:text-[17px] font-extrabold text-[#0f172a]">
                    {q.medicationOrder?.availableConcentration}
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Weight Callout */}
            <div className="rounded-2xl bg-[#f3f8ff] border border-[#e1edff] p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#dceafe] flex items-center justify-center text-[#0066e6] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-xs leading-relaxed text-[#334155] pt-0.5">{q.helperNote}</p>
            </div>
          </div>

          {/* Right Card: Numeric mL Entry & Proceed (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 sm:p-7 text-left space-y-5">
            <div className="space-y-1.5">
              <span className="block text-[10.5px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                YOUR ANSWER
              </span>
              <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#0f172a] leading-snug">
                {q.prompt}
              </h2>
              <p className="text-xs text-[#64748b] leading-relaxed">{q.instruction}</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dosage-ml-input"
                className="block text-xs font-bold text-[#1e293b]"
              >
                {q.inputLabel || 'Dose to administer'}
              </label>

              <div className="relative flex items-center rounded-2xl bg-[#f8fafc] border border-[#dce6f2] focus-within:bg-white focus-within:border-[#0066ff] focus-within:ring-2 focus-within:ring-[#0066ff]/15 px-4 py-3 transition">
                <input
                  id="dosage-ml-input"
                  type="text"
                  inputMode="decimal"
                  value={rawValue}
                  onChange={(e) => handleDosageChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && String(rawValue).trim()) {
                      e.preventDefault();
                      handleDosageProceed();
                    }
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-transparent text-sm sm:text-[15px] font-semibold text-[#0f172a] placeholder:text-[#94a3b8] placeholder:font-normal outline-hidden pr-12"
                />
                <span className="px-2.5 py-1 rounded-lg bg-[#e2e8f0]/70 text-[#475569] text-xs font-bold shrink-0">
                  {q.unitSuffix || 'mL'}
                </span>
              </div>
            </div>

            {/* Amber Rounding Alert */}
            <div className="rounded-2xl bg-[#fffbeb] border border-[#fef08a] p-3.5 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
              <p className="text-[11.5px] leading-relaxed text-[#92400e] font-medium">
                {q.roundingWarning}
              </p>
            </div>

            {/* Clear & Proceed Row */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => updateCurrentAnswer('')}
                className="text-xs font-semibold text-[#64748b] hover:text-[#0f172a] cursor-pointer px-2 py-1.5 transition"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleDosageProceed}
                disabled={!String(rawValue).trim()}
                className="px-6 py-2.5 rounded-full bg-[#0066e6] hover:bg-[#0058c9] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>Proceed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. DROP-DOWN / CLOZE QUESTION (Matches Screenshot 2)
  const renderClozeDropdownQuestion = (q) => {
    const selections = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};
    const clauses = q.clauses || [];
    const completedCount = clauses.filter((c) => Boolean(selections[c.id])).length;

    return (
      <div className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 sm:p-8 text-left space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-[19px] sm:text-[22px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
            {q.prompt}
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748b]">{q.instruction}</p>
        </div>

        {/* Cloze Sentence Box */}
        <div className="rounded-2xl bg-[#f5f8fd] border border-[#e5eef9] p-5 sm:p-7 space-y-6">
          {clauses.map((clause) => {
            const selectedVal = selections[clause.id] || '';
            return (
              <div
                key={clause.id}
                className="flex flex-col sm:flex-row sm:items-end flex-wrap gap-3"
              >
                <span className="text-[14px] sm:text-[15px] font-medium text-[#1e293b] pb-2">
                  {clause.prefix}
                </span>

                <div className="flex flex-col min-w-[250px] sm:min-w-[290px]">
                  <span className="text-[9.5px] font-extrabold text-[#0066ff] uppercase tracking-wider mb-1 pl-2">
                    {clause.label}
                  </span>
                  <div className="relative">
                    <select
                      aria-label={clause.label}
                      value={selectedVal}
                      onChange={(e) => handleClozeSelect(clause.id, e.target.value)}
                      className={`w-full appearance-none rounded-full bg-white px-4 py-2.5 pr-9 text-[13px] font-semibold outline-hidden transition cursor-pointer ${
                        selectedVal
                          ? 'border-[1.75px] border-[#0066ff] text-[#0f172a] shadow-2xs'
                          : 'border border-[#cbd5e1] text-[#64748b] hover:border-[#0066ff]'
                      }`}
                    >
                      <option value="">{clause.placeholder}</option>
                      {(clause.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#0066ff] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Status & Inline Next */}
        <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#64748b]">
            {completedCount} of {clauses.length} dropdowns completed
          </span>

          <button
            type="button"
            onClick={goToNext}
            className="px-6 py-2.5 rounded-full bg-[#0066ff] hover:bg-[#0058db] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // 4. DRAG AND DROP WORDS (Matches Screenshot 3)
  const renderDragDropQuestion = (q) => {
    const slotAssignments = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};
    const assignedWordIds = Object.values(slotAssignments).filter(Boolean);
    const wordLookup = {};
    (q.wordBank || []).forEach((w) => {
      wordLookup[w.id] = w;
    });

    const remainingChoices = (q.wordBank || []).filter(
      (w) => !assignedWordIds.includes(w.id)
    );

    return (
      <div className="space-y-5 text-left">
        {/* Main Sentence Completion Card */}
        <div className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-5 sm:p-8 space-y-5">
          {/* Header Row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#eef5ff] flex items-center justify-center text-[#0066ff]">
                <ListFilter className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-extrabold text-[#0066ff] uppercase tracking-wider">
                {q.typeBadge || 'DRAG WORDS · PLAN OF CARE'}
              </span>
            </div>

            {q.nextGenTag && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[#94a3b8] font-medium">NextGen Item:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#f1f5f9] text-[#334155] font-bold">
                  {q.nextGenTag}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-[19px] sm:text-[22px] font-extrabold text-[#0f172a] tracking-tight">
            {q.prompt}
          </h1>

          {/* Instruction Banner */}
          <div className="rounded-xl bg-[#f8fafc] border border-[#edf2f7] px-4 py-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
            <p className="text-xs text-[#475569] leading-relaxed">{q.instruction}</p>
          </div>

          {/* Dashed Sentence Container */}
          <div className="rounded-2xl border border-dashed border-[#bdd6f7] bg-[#fbfdff] p-4 sm:p-6 space-y-4">
            {(q.slots || []).map((slot) => {
              const assignedId = slotAssignments[slot.id];
              const assignedWord = assignedId ? wordLookup[assignedId] : null;

              return (
                <div key={slot.id} className="space-y-2">
                  <span className="block text-xs sm:text-[13px] font-semibold text-[#334155]">
                    {slot.leadText}
                  </span>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedWordId) {
                        handleAssignWordToSlot(slot.id, draggedWordId, dragSourceSlotId);
                      }
                    }}
                    onClick={() => {
                      if (selectedWordBankId) {
                        handleAssignWordToSlot(slot.id, selectedWordBankId);
                      }
                    }}
                    draggable={Boolean(assignedWord)}
                    onDragStart={() => {
                      if (assignedWord) {
                        setDraggedWordId(assignedWord.id);
                        setDragSourceSlotId(slot.id);
                      }
                    }}
                    className={`min-h-[48px] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 transition-all ${
                      assignedWord
                        ? 'bg-[#f2f7ff] border-[1.75px] border-[#0066ff] text-[#0b3b8c] shadow-2xs cursor-grab'
                        : selectedWordBankId
                        ? 'bg-[#eff6ff] border-2 border-dashed border-[#0066ff] text-[#0066ff] cursor-pointer'
                        : 'bg-white border border-dashed border-[#cbd5e1] text-[#94a3b8]'
                    }`}
                  >
                    {assignedWord ? (
                      <>
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="w-4 h-4 text-[#0066ff] shrink-0" />
                          <span className="text-[13px] sm:text-[13.5px] font-bold">
                            {assignedWord.text}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWordFromSlot(slot.id);
                          }}
                          aria-label={`Remove ${assignedWord.text}`}
                          className="p-1 rounded-md text-[#64748b] hover:text-[#0f172a] hover:bg-white/70 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-medium">
                        {selectedWordBankId
                          ? 'Tap here to place selected choice'
                          : 'Drag a choice here or click a word below, then tap slot'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Word Bank Card */}
        <div className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-5 sm:p-6 space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10.5px] font-extrabold text-[#475569] uppercase tracking-wider">
              WORD BANK · REMAINING CHOICES
            </span>
            <span className="text-[11px] text-[#94a3b8]">Click or drag items to swap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {remainingChoices.map((word) => {
              const isPickedForTap = selectedWordBankId === word.id;
              return (
                <div
                  key={word.id}
                  draggable
                  onDragStart={() => {
                    setDraggedWordId(word.id);
                    setDragSourceSlotId(null);
                  }}
                  onClick={() => {
                    if (isPickedForTap) {
                      setSelectedWordBankId(null);
                    } else {
                      // If there's an empty slot, allow either tap-to-select or quick fill
                      const firstEmptySlot = (q.slots || []).find(
                        (s) => !slotAssignments[s.id]
                      );
                      if (firstEmptySlot && selectedWordBankId === null) {
                        setSelectedWordBankId(word.id);
                      } else {
                        setSelectedWordBankId(word.id);
                      }
                    }
                  }}
                  onDoubleClick={() => {
                    const firstEmptySlot = (q.slots || []).find((s) => !slotAssignments[s.id]);
                    if (firstEmptySlot) {
                      handleAssignWordToSlot(firstEmptySlot.id, word.id);
                    }
                  }}
                  className={`rounded-xl px-4 py-3 border flex items-center gap-2.5 cursor-grab active:cursor-grabbing transition select-none ${
                    isPickedForTap
                      ? 'bg-[#eff6ff] border-[#0066ff] ring-1 ring-[#0066ff] text-[#0058db]'
                      : 'bg-white border-[#e6eef8] hover:border-[#cbd5e1] text-[#1e293b]'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-[#cbd5e1] shrink-0" />
                  <span className="text-[12.5px] font-semibold">{word.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 5. INCIDENT REPORT (SELECT RELEVANT INFORMATION)
  const renderIncidentReportQuestion = (q) => {
    const selectedIds = Array.isArray(currentAnswer) ? currentAnswer : [];

    return (
      <div className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-5 sm:p-8 text-left space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#fff7ed] border border-[#ffedd5] text-[#c2410c] text-[10.5px] font-extrabold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{q.typeBadge || 'INCIDENT REPORT'}</span>
          </span>

          <h1 className="text-[18px] sm:text-[21px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
            {q.prompt}
          </h1>
        </div>

        <div className="rounded-xl bg-[#f4f9ff] border border-[#e0eeff] px-4 py-3 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0" />
          <p className="text-xs text-[#475569] font-medium">{q.instruction}</p>
        </div>

        {/* Interactive Incident Narrative Document */}
        <div className="rounded-2xl border border-[#e2e8f0] overflow-hidden">
          <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-2.5 flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-[#334155] uppercase tracking-wider">
              {q.reportHeader || 'CLINICAL INCIDENT REVIEW'}
            </span>
            <span className="text-[10.5px] font-mono font-semibold text-[#64748b]">
              {q.reportTimestamp}
            </span>
          </div>

          <div className="p-4 sm:p-5 bg-white space-y-2.5">
            {(q.segments || []).map((seg) => {
              const isSelected = selectedIds.includes(seg.id);
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => handleIncidentSegmentToggle(seg.id)}
                  className={`w-full text-left rounded-xl p-3.5 border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#eff6ff] border-[#0066ff] ring-1 ring-[#0066ff]/40 text-[#0f172a]'
                      : 'bg-[#fcfdff] border-[#edf2f7] hover:border-[#cbd5e1] text-[#334155]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? 'bg-[#0066ff] text-white'
                        : 'bg-white border border-[#cbd5e1]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span className="text-xs sm:text-[13px] leading-relaxed font-medium">
                    {seg.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-medium text-[#64748b]">
          {selectedIds.length} statement{selectedIds.length === 1 ? '' : 's'} selected for incident
          follow-up
        </div>
      </div>
    );
  };

  // 6. MULTIPLE RESPONSE / MULTIPLE SELECT (SATA)
  const renderMultipleResponseQuestion = (q) => {
    const selectedIds = Array.isArray(currentAnswer) ? currentAnswer : [];

    return (
      <div className="rounded-3xl bg-white border border-[#e6eef8] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-5 sm:p-8 text-left space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#eef5ff] text-[#0066e6] text-[10.5px] font-extrabold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{q.typeBadge || 'MULTIPLE RESPONSE'}</span>
          </span>

          <h1 className="text-[18px] sm:text-[21px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
            {q.prompt}
          </h1>
        </div>

        <div className="rounded-xl bg-[#f4f9ff] border border-[#e0eeff] px-4 py-3 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0" />
          <p className="text-xs text-[#475569] font-medium">
            {q.instruction || 'Select all that apply.'}
          </p>
        </div>

        <div role="group" aria-label="Multiple response options" className="space-y-2.5">
          {(q.options || []).map((opt) => {
            const isChecked = selectedIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => handleMultipleResponseToggle(opt.id)}
                className={`w-full text-left rounded-2xl p-4 border transition-all flex items-start gap-3.5 cursor-pointer ${
                  isChecked
                    ? 'bg-[#f0f7ff] border-[#0066ff] ring-1 ring-[#0066ff]/30'
                    : 'bg-white border-[#e6eef8] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                }`}
              >
                <span
                  className={`w-5.5 h-5.5 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition ${
                    isChecked
                      ? 'bg-[#0066ff] border border-[#0066ff] text-white'
                      : 'bg-white border border-[#cbd5e1]'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <span className="text-xs sm:text-[13.5px] font-medium text-[#1e293b] leading-relaxed">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-[#64748b]">
          {selectedIds.length} option{selectedIds.length === 1 ? '' : 's'} selected
        </div>
      </div>
    );
  };

  // ================= SUBMITTED RESULTS SUMMARY =================
  if (submitted) {
    const evaluations = questions.map((q) => ({
      question: q,
      ...evaluateQuestionResponse(q, answers[q.id]),
    }));
    const correctCount = evaluations.filter((e) => e.isCorrect).length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen w-full bg-[#f4f7fb] text-[#1e2733] font-sans pb-20">
        <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eef2f6] px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={canopediaWordmark}
              alt="Canopedia"
              className="h-6 w-auto object-contain cursor-pointer"
              onClick={onExitToDashboard}
            />
            <span className="text-xs font-extrabold text-[#0066e6] uppercase tracking-wide">
              NCLEX-RN ASSESSMENT RESULTS
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToLesson}
            className="px-4 py-1.5 rounded-full border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] text-xs font-semibold text-[#334155] cursor-pointer"
          >
            Back to lesson
          </button>
        </header>

        <main className="w-[92%] max-w-[1040px] mx-auto pt-8 space-y-6">
          <section className="rounded-3xl bg-white border border-[#e6eef8] p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#eef5ff] text-[#0066ff] flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#eef5ff] text-[#0066e6] text-[10.5px] font-bold uppercase tracking-wider mb-2">
                ASSESSMENT COMPLETE
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
                {scorePercent}% Clinical Mastery ({correctCount} of {totalQuestions} items correct)
              </h1>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                Review item-by-item NGN scoring and clinical rationales below.
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
                className="px-6 py-2.5 rounded-full bg-[#0066ff] hover:bg-[#0058db] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Back to lesson</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            {evaluations.map(({ question: q, isCorrect }, idx) => (
              <div
                key={q.id}
                className="rounded-2xl bg-white border border-[#e6eef8] p-5 sm:p-6 shadow-xs text-left space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                    Question {idx + 1} · {q.typeBadge || q.type}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isCorrect ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
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
                        <span>Needs Review</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                  {q.prompt || q.scenarioText}
                </h3>

                {q.rationale && (
                  <div className="rounded-xl bg-[#f3f7fd] border border-[#e3edf9] p-3.5 text-xs text-[#334155] leading-relaxed">
                    <strong className="text-[#0f172a] block mb-1">Clinical Rationale:</strong>
                    {q.rationale}
                  </div>
                )}
              </div>
            ))}
          </section>
        </main>
      </div>
    );
  }

  // ================= MAIN ACTIVE EXAM SHELL =================
  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] text-[#1e2733] font-sans flex flex-col pb-24">
      {/* 
        ========================================================================
        TOP EXAM HEADER BAR (Matches Reference Screenshots)
        Left: Canopedia Wordmark | NCLEX-RN PRACTICE > QUESTION X
        Right: Timer Pill | End exam Pill | Avatar
        ========================================================================
      */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eaeff5] px-4 sm:px-8 lg:px-10 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <img
            src={canopediaWordmark}
            alt="Canopedia"
            onClick={onExitToDashboard}
            className="h-6 sm:h-6.5 w-auto object-contain cursor-pointer shrink-0"
          />

          <div className="hidden sm:flex items-center gap-2 text-xs truncate">
            <span className="font-extrabold text-[#0066e6] uppercase tracking-wide">
              {currentQuestion.sectionLabel || assessmentTitle || 'NCLEX-RN PRACTICE'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <button
              type="button"
              onClick={() => setShowQuestionDrawer(!showQuestionDrawer)}
              className="inline-flex items-center gap-1 font-extrabold text-[#0f172a] uppercase tracking-wide hover:text-[#0066e6] cursor-pointer"
              title="Open question navigator"
            >
              <span>QUESTION {currentIndex + 1}</span>
              <span className="text-[#94a3b8] font-semibold">OF {totalQuestions}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
            </button>
          </div>
        </div>

        {/* Right Controls: Timer + End exam + Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Mobile Question Navigator Trigger */}
          <button
            type="button"
            onClick={() => setShowQuestionDrawer(!showQuestionDrawer)}
            className="sm:hidden px-2.5 py-1.5 rounded-full bg-[#f1f5f9] text-[#0f172a] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>
              Q{currentIndex + 1}/{totalQuestions}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Timer Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f1f5f9] text-[#0f172a] text-xs font-bold tracking-tight">
            <Clock className="w-3.5 h-3.5 text-[#0066e6]" />
            <span className="font-mono">{formatTimer(secondsRemaining)}</span>
          </div>

          {/* End Exam Pill */}
          <button
            type="button"
            onClick={() => setShowEndExamModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-xs font-bold transition cursor-pointer"
          >
            End exam
          </button>

          <div className="hidden sm:block h-5 w-[1px] bg-[#e2e8f0]" />

          <img
            src={myspaceAvatar}
            alt="Student profile"
            className="w-8 h-8 rounded-full object-cover border border-[#e2e8f0] shrink-0"
          />
        </div>
      </header>

      {/* Collapsible Question Navigator Bar */}
      {showQuestionDrawer && (
        <div className="bg-white border-b border-[#e6eef8] px-4 sm:px-8 lg:px-10 py-3 shadow-xs">
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const { isAnswered } = evaluateQuestionResponse(q, answers[q.id]);
                const isFlag = Boolean(flagged[q.id]);

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowQuestionDrawer(false);
                      window.scrollTo(0, 0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition relative flex items-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0066ff] text-white shadow-2xs'
                        : isAnswered
                        ? 'bg-[#e8f2ff] text-[#0058db] border border-[#bfd9ff]'
                        : 'bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {isFlag && (
                      <span className="w-2 h-2 rounded-full bg-[#f59e0b]" title="Flagged" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowQuestionDrawer(false)}
              className="text-xs font-semibold text-[#64748b] hover:text-[#0f172a] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        MAIN WORKSPACE AREA
        - Dosage Calculation uses its dedicated 2-card Medication Order + Answer layout
        - Clinical Case NGN items use Split-Screen: Client Record (Left) + Question (Right)
        ========================================================================
      */}
      <main className="w-[92%] max-w-[1440px] mx-auto pt-5 sm:pt-6 flex-1">
        {currentQuestion.type === 'dosage-calc' ? (
          renderDosageCalcLayout(currentQuestion)
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Client Record (4 cols on desktop) */}
            <aside aria-label="Client Record" className="lg:col-span-4 w-full">
              {renderClientRecordContent(currentQuestion.clientRecord)}
            </aside>

            {/* Right Column: Dynamic NGN Question Renderer (8 cols on desktop) */}
            <section aria-label="Assessment Question" className="lg:col-span-8 w-full">
              {currentQuestion.type === 'matrix-grid' &&
                renderMatrixGridQuestion(currentQuestion)}
              {currentQuestion.type === 'cloze-dropdown' &&
                renderClozeDropdownQuestion(currentQuestion)}
              {currentQuestion.type === 'drag-drop' && renderDragDropQuestion(currentQuestion)}
              {currentQuestion.type === 'incident-report' &&
                renderIncidentReportQuestion(currentQuestion)}
              {currentQuestion.type === 'multiple-response' &&
                renderMultipleResponseQuestion(currentQuestion)}
            </section>
          </div>
        )}
      </main>

      {/* 
        ========================================================================
        FIXED BOTTOM EXAM FOOTER BAR (Matches Reference Screenshots)
        Left: < Previous | Flag question
        Right: Next > (or Submit exam on final item)
        ========================================================================
      */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#e6eef8] px-4 sm:px-8 lg:px-10 py-3">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Previous Button */}
            <button
              type="button"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="h-[40px] px-4 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Flag Question Button */}
            <button
              type="button"
              onClick={toggleFlagCurrent}
              className={`h-[40px] px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                isCurrentFlagged
                  ? 'bg-[#fffbeb] border-[#fde68a] text-[#d97706]'
                  : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc] text-[#334155]'
              }`}
            >
              <Flag
                className={`w-3.5 h-3.5 ${
                  isCurrentFlagged ? 'fill-[#f59e0b] text-[#d97706]' : 'text-[#f59e0b]'
                }`}
              />
              <span>{isCurrentFlagged ? 'Flagged' : 'Flag question'}</span>
            </button>
          </div>

          {/* Next / Submit Button */}
          <button
            type="button"
            onClick={goToNext}
            className="h-[42px] px-6 rounded-xl bg-[#0066e6] hover:bg-[#0058c9] active:bg-[#004bb0] text-white text-xs sm:text-[13px] font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>{currentIndex === totalQuestions - 1 ? 'Submit exam' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/*Expanded Client Record Modal ("Tap to review") */}
      {clientRecordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setClientRecordModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setClientRecordModalOpen(false)}
              aria-label="Close client record"
              className="absolute top-3.5 right-4 z-10 p-1.5 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            {renderClientRecordContent(currentQuestion.clientRecord, true)}
          </div>
        </div>
      )}

      {/* End Exam Confirmation Modal */}
      {showEndExamModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowEndExamModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-extrabold text-[#0f172a]">Submit & End Assessment?</h3>
            <p className="text-xs leading-relaxed text-[#64748b]">
              You have completed{' '}
              <strong className="text-[#0f172a]">
                {
                  questions.filter((q) => evaluateQuestionResponse(q, answers[q.id]).isAnswered)
                    .length
                }{' '}
                of {totalQuestions}
              </strong>{' '}
              questions. Submitting now will score your attempt and display clinical explanations.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowEndExamModal(false)}
                className="px-4 py-2 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Continue exam
              </button>
              <button
                type="button"
                onClick={handleFinishExam}
                className="px-5 py-2 rounded-full bg-[#0066e6] hover:bg-[#0058c9] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Submit & view results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
