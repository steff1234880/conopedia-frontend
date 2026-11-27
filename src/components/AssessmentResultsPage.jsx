import React, { useState } from 'react';
import {
  Bell,
  Menu,
  X,
  Calendar,
  Check,
  CheckCircle2,
  XCircle,
  BarChart3,
  ClipboardCheck,
  Clock,
  FileText,
  ArrowRight,
  ArrowLeft,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import {
  getLatestAssessmentResult,
  getQuestionReviewDetails,
  evaluateQuestionResponse,
} from '../services/assessmentService';

/**
 * Canopedia Assessment Completion / Final Results Page
 *
 * Recreates the reference Assessment Completion screen:
 * 1. Top Navigation Bar matching Conopidea design system
 * 2. Top timestamp pill: "<PRACTICE TITLE> · <Calendar> <Date & Time>"
 * 3. Layered soft mint-green circular checkmark icon + "You nailed it!" heading +
 *    "Great job completing your practice assessment." subtitle
 * 4. "Your summary" & "ASSESSMENT STATISTICS" 4-card grid with dynamic submitted values:
 *    - Questions completed (completed / total + completion rate %)
 *    - Practice score (score % + Benchmark status)
 *    - Correct answers (correct / total + review items count)
 *    - Time spent (formatted duration + avg time / question)
 * 5. Personalized "LEARNING TAKEAWAY · Clinical Synthesis" card with interactive
 *    Clinical Reference Note modal
 * 6. "What would you like to do?" card with 3 functional actions:
 *    - Review answers -> (opens full submitted answer & rationale review)
 *    - Practice weak areas (launches targeted practice session on missed items)
 *    - Return to lesson (navigates back to the originating lesson/course)
 */
export default function AssessmentResultsPage({
  resultData,
  onReviewAnswers,
  onViewResults,
  onPracticeWeakAreas,
  onReturnToLesson,
  onNavigateHome,
  onNavigateCourses,
  onNavigatePractice,
  onNavigateLiveClasses,
  onNavigateProfile,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [viewMode, setViewMode] = useState('summary'); // 'summary' | 'review'
  const [referenceModalOpen, setReferenceModalOpen] = useState(false);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const activeResult = resultData || getLatestAssessmentResult();

  // Safe dynamic values derived strictly from the submitted result object
  const totalQuestions = activeResult?.totalQuestions ?? 0;
  const completedCount = activeResult?.completedCount ?? 0;
  const completionRatePercent = activeResult?.completionRatePercent ?? 0;
  const scorePercent = activeResult?.scorePercent ?? 0;
  const benchmarkPercent = activeResult?.benchmarkPercent ?? 70;
  const benchmarkMet = activeResult?.benchmarkMet ?? scorePercent >= benchmarkPercent;
  const correctCount = activeResult?.correctCount ?? 0;
  const reviewItemsCount = activeResult?.reviewItemsCount ?? Math.max(0, totalQuestions - correctCount);
  const timeSpentFormatted = activeResult?.timeSpentFormatted || '0s';
  const avgTimePerQuestionFormatted =
    activeResult?.avgTimePerQuestionFormatted || '~0s / question';
  const practiceLabel = activeResult?.practiceLabel || 'RECOGNITION PRACTICE';
  const completedAtFormatted = activeResult?.completedAtFormatted || 'Just now';

  const takeaway = activeResult?.takeaway || {
    badge: 'LEARNING TAKEAWAY',
    category: 'Clinical Synthesis',
    message:
      'Review your clinical cues and rationale explanations to reinforce safe nursing judgment.',
    referenceLinkLabel: 'View Clinical Reference Note',
    referenceTitle: 'Clinical Reference Note',
    topicTitle: 'Clinical Judgment Synthesis',
    referenceContent:
      'Use the ABC priority framework and trend serial vital signs alongside laboratory markers before initiating high-alert interventions.',
  };

  const questions = activeResult?.questions || [];
  const answers = activeResult?.answers || {};
  const weakQuestions = activeResult?.weakQuestions || [];

  const handlePracticeWeakAreasClick = () => {
    if (onPracticeWeakAreas) {
      // Pass weak questions if any exist; if 100% score, practice full reinforcement set
      const targetQuestions = weakQuestions.length > 0 ? weakQuestions : questions;
      onPracticeWeakAreas(targetQuestions);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-20">
      {/* 
        ========================================================================
        TOP NAVIGATION BAR
        ========================================================================
      */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eef2f6] px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
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
                  <div className="space-y-2 text-xs text-[#64748b]">
                    <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9]">
                      <p className="font-medium text-[#1e293b]">Assessment Scored: {scorePercent}%</p>
                      <p className="text-[11px] text-[#94a3b8]">
                        {correctCount} of {totalQuestions} items answered correctly.
                      </p>
                    </div>
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

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#f1f5f9]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e2e8f0] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => {
                if (link === 'Home' && onNavigateHome) onNavigateHome();
                if (link === 'Learn' && onNavigateCourses) onNavigateCourses();
                if (link === 'Practice' && onNavigatePractice) onNavigatePractice();
                if (link === 'Live Classes' && onNavigateLiveClasses) onNavigateLiveClasses();
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                link === 'Home' ? 'bg-[#006ee6] text-white' : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {viewMode === 'review' ? (
        /* 
          ========================================================================
          SUBMITTED ANSWERS & EXPLANATIONS REVIEW VIEW
          Opened when clicking "Review answers ->"
          ========================================================================
        */
        <main className="w-[92%] max-w-[920px] mx-auto pt-7 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setViewMode('summary');
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-xs font-bold text-[#0f172a] cursor-pointer transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to results summary</span>
            </button>

            <div className="flex items-center gap-2.5">
              {reviewItemsCount > 0 && (
                <button
                  type="button"
                  onClick={handlePracticeWeakAreasClick}
                  className="px-4 py-2 rounded-full bg-[#eef5ff] hover:bg-[#dbeafe] text-[#0066ff] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Practice weak areas ({reviewItemsCount})</span>
                </button>
              )}
              <button
                type="button"
                onClick={onReturnToLesson}
                className="px-4 py-2 rounded-full bg-[#0066ff] hover:bg-[#0058db] text-white text-xs font-bold cursor-pointer transition"
              >
                Return to lesson
              </button>
            </div>
          </div>

          <section className="rounded-3xl bg-white border border-[#e6eef8] p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <span className="text-[10.5px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                ANSWER KEY & CLINICAL RATIONALES
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mt-0.5">
                {practiceLabel} — {correctCount} of {totalQuestions} Correct ({scorePercent}%)
              </h1>
            </div>
            <span className="text-xs font-medium text-[#64748b]">{completedAtFormatted}</span>
          </section>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userResp = answers[q.id];
              const { isCorrect } = evaluateQuestionResponse(q, userResp);
              const details = getQuestionReviewDetails(q, userResp);

              return (
                <article
                  key={q.id}
                  className="rounded-3xl bg-white border border-[#e6eef8] p-5 sm:p-6 shadow-2xs text-left space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[#f1f5f9] pb-3">
                    <span className="text-[11px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                      Question {idx + 1} · {q.typeBadge || q.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
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
                          <span>Incorrect · Review Item</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-[15.5px] font-bold text-[#0f172a] leading-snug">
                    {q.prompt || q.scenarioText}
                  </h2>

                  {details.type === 'single' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        className={`rounded-2xl p-3.5 border text-xs ${
                          isCorrect
                            ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#14532d]'
                            : 'bg-[#fef2f2] border-[#fecaca] text-[#7f1d1d]'
                        }`}
                      >
                        <span className="block text-[10px] font-extrabold uppercase opacity-75 mb-1">
                          Your Submitted Answer
                        </span>
                        <span className="font-bold text-sm">{details.userSummary}</span>
                      </div>
                      <div className="rounded-2xl p-3.5 border bg-[#f0fdf4] border-[#bbf7d0] text-[#14532d] text-xs">
                        <span className="block text-[10px] font-extrabold uppercase opacity-75 mb-1">
                          Correct Answer
                        </span>
                        <span className="font-bold text-sm">{details.correctSummary}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(details.rowDetails || []).map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className={`rounded-xl px-3.5 py-2.5 border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            row.isCorrect
                              ? 'bg-[#f8fafc] border-[#e2e8f0]'
                              : 'bg-[#fffafb] border-[#fecdd3]'
                          }`}
                        >
                          <span className="font-semibold text-[#1e293b] sm:max-w-[55%]">
                            {row.label}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold ${
                                row.isCorrect
                                  ? 'bg-[#ecfdf5] text-[#059669]'
                                  : 'bg-[#fef2f2] text-[#dc2626]'
                              }`}
                            >
                              Yours: {row.userValue}
                            </span>
                            {!row.isCorrect && (
                              <span className="px-2 py-0.5 rounded-md bg-[#eff6ff] text-[#0066e6] font-semibold">
                                Correct: {row.correctValue}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.rationale && (
                    <div className="rounded-2xl bg-[#eff6ff]/70 border border-[#dbeafe] p-4 text-xs text-[#334155] leading-relaxed">
                      <strong className="text-[#0f172a] block mb-1">Clinical Explanation:</strong>
                      {q.rationale}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </main>
      ) : (
        /* 
          ========================================================================
          MAIN FINAL RESULTS SUMMARY VIEW (Matches Reference Screenshot)
          ========================================================================
        */
        <main className="w-[92%] max-w-[780px] mx-auto pt-8 sm:pt-10 space-y-7">
          {/* Top Completion Pill + Success Checkmark + Heading */}
          <section className="flex flex-col items-center text-center">
            {/* Pill: RECOGNITION PRACTICE • Oct 5, 2026 · 9:49 AM */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e6ecf4] shadow-[0_1px_3px_rgba(15,23,42,0.03)] text-[10.5px] sm:text-[11px] mb-6">
              <span className="font-extrabold text-[#0f172a] uppercase tracking-[0.04em]">
                {practiceLabel}
              </span>
              <span className="text-[#cbd5e1]">•</span>
              <span className="inline-flex items-center gap-1.5 text-[#64748b] font-medium">
                <Calendar className="w-3 h-3 text-[#94a3b8]" />
                <span>{completedAtFormatted}</span>
              </span>
            </div>

            {/* Layered Soft Green Success Icon */}
            <div className="w-[74px] h-[74px] rounded-full bg-[#ecfdf3] flex items-center justify-center mb-5">
              <div className="w-[54px] h-[54px] rounded-full bg-[#d1fae5] flex items-center justify-center text-[#10b981]">
                <Check className="w-6.5 h-6.5 stroke-[2.8]" />
              </div>
            </div>

            {/* Main Heading & Subtitle */}
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#0f172a] tracking-tight leading-tight mb-2">
              You nailed it!
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#64748b] font-normal">
              Great job completing your practice assessment.
            </p>
          </section>

          {/* 
            ========================================================================
            YOUR SUMMARY · ASSESSMENT STATISTICS (4 Dynamic Metric Cards)
            ========================================================================
          */}
          <section aria-label="Your summary" className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] sm:text-[15px] font-extrabold text-[#0f172a]">
                Your summary
              </h2>
              <span className="text-[10px] font-extrabold text-[#94a3b8] uppercase tracking-[0.06em]">
                ASSESSMENT STATISTICS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Stat Card 1: Questions completed */}
              <div className="rounded-2xl bg-white border border-[#ecf1f7] shadow-[0_2px_10px_rgba(15,23,42,0.02)] p-4 sm:p-5 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-[22px] sm:text-[24px] font-extrabold text-[#0f172a] leading-none tracking-tight">
                    {completedCount}{' '}
                    <span className="text-[15px] font-bold text-[#94a3b8]">/{totalQuestions}</span>
                  </div>
                </div>
                <div className="text-xs font-medium text-[#64748b] mb-1">Questions completed</div>
                <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#10b981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>{completionRatePercent}% completion rate</span>
                </div>
              </div>

              {/* Stat Card 2: Practice score */}
              <div className="rounded-2xl bg-white border border-[#ecf1f7] shadow-[0_2px_10px_rgba(15,23,42,0.02)] p-4 sm:p-5 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#fffbeb] flex items-center justify-center text-[#f59e0b] shrink-0">
                    <BarChart3 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-[22px] sm:text-[24px] font-extrabold text-[#0f172a] leading-none tracking-tight">
                    {scorePercent}%
                  </div>
                </div>
                <div className="text-xs font-medium text-[#64748b] mb-1">Practice score</div>
                <div
                  className={`flex items-center gap-1.5 text-[10.5px] font-semibold ${
                    benchmarkMet ? 'text-[#2563eb]' : 'text-[#d97706]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      benchmarkMet ? 'bg-[#2563eb]' : 'bg-[#f59e0b]'
                    }`}
                  />
                  <span>
                    {benchmarkMet
                      ? `Benchmark (${benchmarkPercent}%) Met`
                      : `Below ${benchmarkPercent}% Benchmark`}
                  </span>
                </div>
              </div>

              {/* Stat Card 3: Correct answers */}
              <div className="rounded-2xl bg-white border border-[#ecf1f7] shadow-[0_2px_10px_rgba(15,23,42,0.02)] p-4 sm:p-5 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] shrink-0">
                    <ClipboardCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-[22px] sm:text-[24px] font-extrabold text-[#0f172a] leading-none tracking-tight">
                    {correctCount}{' '}
                    <span className="text-[15px] font-bold text-[#94a3b8]">/{totalQuestions}</span>
                  </div>
                </div>
                <div className="text-xs font-medium text-[#64748b] mb-1">Correct answers</div>
                <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#64748b]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      reviewItemsCount > 0 ? 'bg-[#f59e0b]' : 'bg-[#10b981]'
                    }`}
                  />
                  <span>
                    {reviewItemsCount === 1
                      ? '1 review item'
                      : `${reviewItemsCount} review items`}
                  </span>
                </div>
              </div>

              {/* Stat Card 4: Time spent */}
              <div className="rounded-2xl bg-white border border-[#ecf1f7] shadow-[0_2px_10px_rgba(15,23,42,0.02)] p-4 sm:p-5 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#0066e6] shrink-0">
                    <Clock className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="text-[21px] sm:text-[23px] font-extrabold text-[#0f172a] leading-none tracking-tight">
                    {timeSpentFormatted}
                  </div>
                </div>
                <div className="text-xs font-medium text-[#64748b] mb-1">Time spent</div>
                <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#94a3b8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                  <span>{avgTimePerQuestionFormatted}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 
            ========================================================================
            LEARNING TAKEAWAY · CLINICAL SYNTHESIS BANNER
            ========================================================================
          */}
          <section
            aria-label="Learning takeaway"
            className="rounded-3xl bg-gradient-to-r from-[#eef5ff] via-[#f2f7ff] to-[#ebf3ff] border border-[#dbeafe] p-5 sm:p-6 flex items-start gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#dceafe] shadow-2xs flex items-center justify-center text-[#0066e6] shrink-0 mt-0.5">
              <FileText className="w-4.5 h-4.5 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#dceafe] text-[#0058db] text-[9.5px] font-extrabold uppercase tracking-wider">
                  {takeaway.badge}
                </span>
                <span className="text-[11px] font-medium text-[#64748b]">{takeaway.category}</span>
              </div>

              <p className="text-[13px] sm:text-[14px] font-semibold text-[#1e293b] leading-[1.58]">
                {takeaway.message}
              </p>

              <button
                type="button"
                onClick={() => setReferenceModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#0066ff] hover:text-[#0052cc] hover:underline pt-0.5 cursor-pointer"
              >
                <span>{takeaway.referenceLinkLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* 
            ========================================================================
            WHAT WOULD YOU LIKE TO DO? ACTION CARD
            ========================================================================
          */}
          <section
            aria-label="Next steps"
            className="rounded-3xl bg-white border border-[#ecf1f7] shadow-[0_2px_14px_rgba(15,23,42,0.025)] px-6 py-7 sm:py-8 text-center space-y-5"
          >
            <h2 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-[#0f172a]">
              What would you like to do?
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* 1. Result View / Review answers */}
              <button
                type="button"
                onClick={() => {
                  const openResultsHandler = onViewResults || onReviewAnswers;
                  if (openResultsHandler) {
                    openResultsHandler();
                  } else {
                    window.location.hash = '/assessment-results';
                  }
                }}
                className="w-full sm:w-auto px-6 h-[44px] rounded-full bg-[#0070f3] hover:bg-[#005fe0] active:bg-[#0051c2] text-white text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(0,112,243,0.22)] transition cursor-pointer"
              >
                <span>Review answers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 2. Practice weak areas */}
              <button
                type="button"
                onClick={handlePracticeWeakAreasClick}
                className="w-full sm:w-auto px-5 h-[44px] rounded-full bg-[#f0f7ff] hover:bg-[#e0effe] border border-[#dceafe] text-[#0066ff] text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-[#0066ff]/15" />
                <span>Practice weak areas</span>
              </button>

              {/* 3. Return to lesson */}
              <button
                type="button"
                onClick={onReturnToLesson}
                className="w-full sm:w-auto px-4 h-[44px] rounded-full text-xs sm:text-[13px] font-semibold text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#94a3b8]" />
                <span>Return to lesson</span>
              </button>
            </div>
          </section>
        </main>
      )}

      {/* Clinical Reference Note Modal */}
      {referenceModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setReferenceModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 text-left shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#f1f5f9] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#eef5ff] flex items-center justify-center text-[#0066e6] shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] font-extrabold text-[#0066e6] uppercase tracking-wider">
                    CLINICAL REFERENCE NOTE
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0f172a]">
                    {takeaway.referenceTitle}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReferenceModalOpen(false)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#334155] hover:bg-[#f1f5f9] cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <p className="text-xs sm:text-[13px] leading-relaxed text-[#334155]">
              {takeaway.referenceContent}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReferenceModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#0070f3] hover:bg-[#005fe0] text-white text-xs font-bold cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

