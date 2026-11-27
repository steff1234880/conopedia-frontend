import React, { useState } from 'react';
import {
  Bell,
  Menu,
  X,
  Clock,
  FileText,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import examIntroHero from '../assets/exam-intro-hero.png';

/**
 * Canopedia Exam Introduction Page
 *
 * Recreates the reference Exam Introduction screen:
 * - Top Navbar matching the platform design system
 * - Centered white card with subtle top ambient sky-blue glow
 * - Tilted medical books + stethoscope illustration card
 * - "EXAM INTRODUCTION" pill badge
 * - "You're almost ready" heading and supporting description
 * - "BEFORE YOU BEGIN" light-blue container with two white info cards:
 *   1. Starting begins your attempt
 *   2. Finish to see your results
 * - Primary CTA button: "I'm ready — Start assessment ->"
 * - Secondary text link: "Back to lesson"
 */
export default function ExamIntroductionPage({
  onStartAssessment,
  onBackToLesson,
  onNavigateHome,
  onNavigateCourses,
  onNavigatePractice,
  onNavigateLiveClasses,
  onNavigateProfile,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      if (onStartAssessment) {
        onStartAssessment();
      }
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-16">
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
                      <p className="font-medium text-[#1e293b]">Assessment Ready</p>
                      <p className="text-[11px] text-[#94a3b8]">
                        Review instructions below before starting your attempt.
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

      {/* 
        ========================================================================
        MAIN EXAM INTRODUCTION CARD
        ========================================================================
      */}
      <main className="w-[92%] max-w-[760px] mx-auto pt-6 sm:pt-8">
        <div className="relative rounded-[28px] bg-white border border-[#e9eff6] shadow-[0_8px_30px_rgba(15,23,42,0.04)] px-5 sm:px-10 md:px-12 pt-8 sm:pt-10 pb-9 sm:pb-11 overflow-hidden">
          {/* Soft radial sky-blue ambient glow at the top center */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] h-[220px] rounded-full bg-gradient-to-b from-[#dff0ff]/75 via-[#eef7ff]/40 to-transparent blur-xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Hero Illustration */}
            <div className="w-[168px] sm:w-[192px] mb-5 flex items-center justify-center">
              <img
                src={examIntroHero}
                alt="Exam introduction illustration"
                className="w-full h-auto object-contain pointer-events-none select-none"
                loading="eager"
              />
            </div>

            {/* Pill Label: EXAM INTRODUCTION */}
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#eef5ff] border border-[#dceafe] text-[#0066e6] text-[10.5px] font-bold uppercase tracking-[0.06em] mb-3.5">
              EXAM INTRODUCTION
            </span>

            {/* Main Heading */}
            <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0f172a] tracking-tight leading-tight mb-2.5">
              You&apos;re almost ready
            </h1>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] leading-[1.6] text-[#64748b] max-w-[460px] mb-7">
              Take a moment to review what to expect before you begin. The information below applies
              to all exams on this platform.
            </p>

            {/* Subtle Divider */}
            <div className="w-full border-t border-[#f1f5f9] mb-6" />

            {/* BEFORE YOU BEGIN Container */}
            <section
              aria-label="Before you begin"
              className="w-full rounded-2xl bg-[#f3f7fd] border border-[#e3edf9] p-4 sm:p-5 text-left mb-8"
            >
              <div className="flex items-center gap-2 mb-3.5">
                <Clock className="w-3.5 h-3.5 text-[#1d5bd6] stroke-[2.2]" />
                <h2 className="text-[11px] font-extrabold text-[#1d5bd6] uppercase tracking-[0.05em]">
                  BEFORE YOU BEGIN
                </h2>
              </div>

              {/* Two Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Card 1: Starting begins your attempt */}
                <div className="rounded-2xl bg-white border border-[#e6eef8] p-4 sm:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#eef5ff] flex items-center justify-center text-[#0066e6] shrink-0">
                      <FileText className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#0f172a] leading-snug">
                      Starting begins your attempt
                    </h3>
                  </div>
                  <p className="text-[11.5px] sm:text-[12px] leading-[1.58] text-[#64748b]">
                    Once you tap Start, your attempt is under way. Make sure you are ready before
                    proceeding.
                  </p>
                </div>

                {/* Card 2: Finish to see your results */}
                <div className="rounded-2xl bg-white border border-[#e6eef8] p-4 sm:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#e8faf0] flex items-center justify-center text-[#16a34a] shrink-0">
                      <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#0f172a] leading-snug">
                      Finish to see your results
                    </h3>
                  </div>
                  <p className="text-[11.5px] sm:text-[12px] leading-[1.58] text-[#64748b]">
                    Answer all questions and submit to view your results and any available
                    explanations.
                  </p>
                </div>
              </div>
            </section>

            {/* Primary CTA: I'm ready — Start assessment */}
            <button
              type="button"
              onClick={handleStart}
              disabled={isStarting}
              className="w-full sm:w-auto sm:min-w-[300px] h-[48px] px-7 rounded-full bg-[#0070f3] hover:bg-[#0060df] active:bg-[#0052cc] text-white text-[13.5px] sm:text-[14px] font-semibold shadow-[0_8px_20px_rgba(0,112,243,0.26)] hover:shadow-[0_10px_24px_rgba(0,112,243,0.32)] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 mb-4"
            >
              <span>{isStarting ? 'Starting assessment...' : "I'm ready — Start assessment"}</span>
              {!isStarting && <ArrowRight className="w-4 h-4 stroke-[2.2]" />}
            </button>

            {/* Back to lesson Link */}
            <button
              type="button"
              onClick={onBackToLesson}
              className="text-[12.5px] sm:text-[13px] font-semibold text-[#0070f3] hover:text-[#0058c4] hover:underline transition cursor-pointer py-1"
            >
              Back to lesson
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
