import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Star, 
  Lock, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';

export default function ReadinessAssessmentsPage({ 
  onNavigateHome, 
  onNavigateCourses, 
  onNavigatePractice, 
  onNavigateLiveClasses, 
  onStartAssessment,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('Practice');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // active assessment start modal

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  // Current Next Readiness Benchmark Card
  const nextAssessment = {
    id: 'nclex-rn-readiness-attempt-4',
    title: 'NCLEX–RN readiness assessment',
    subtitle: 'Scheduled clinical diagnostic benchmark',
    badge: 'YOUR NEXT READINESS CHECK',
    attemptTag: 'ATTEMPT 4 OF 6',
    questions: 30,
    duration: 'About 35 minutes',
    attemptsUsed: '3 of 6 attempts used',
    status: 'Available',
    difficulty: 'Adaptive NGN',
    subject: 'NCLEX-RN Benchmark'
  };

  // Past completed assessments
  const pastAssessments = [
    {
      id: 'past-1',
      title: 'Fundamentals readiness check',
      completedDate: 'Completed Sep 28',
      questions: '30 questions',
      timeSpent: '32m spent',
      score: '82%',
      scoreLabel: '82% High Pass',
      scoreBadgeClass: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
    },
    {
      id: 'past-2',
      title: 'NCLEX–RN readiness assessment (Attempt 3)',
      completedDate: 'Completed Sep 12',
      questions: '30 questions',
      timeSpent: '28m spent',
      score: '78%',
      scoreLabel: '78% Target Met',
      scoreBadgeClass: 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]'
    },
    {
      id: 'past-3',
      title: 'Pharmacology checkpoint',
      completedDate: 'Completed Aug 30',
      questions: '25 questions',
      timeSpent: '24m spent',
      score: '91%',
      scoreLabel: '91% Mastery',
      scoreBadgeClass: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-24">
      
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
              const isActive = link === 'Practice';
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => {
                    if (link === 'Home') onNavigateHome();
                    if (link === 'Learn') onNavigateCourses();
                    if (link === 'Practice') onNavigatePractice();
                    if (link === 'Live Classes') onNavigateLiveClasses();
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
          </div>

          <div className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full bg-[#f8fafc] border border-[#eef2f6]">
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
                if (link === 'Home') onNavigateHome();
                if (link === 'Learn') onNavigateCourses();
                if (link === 'Practice') onNavigatePractice();
                if (link === 'Live Classes') onNavigateLiveClasses();
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                link === 'Practice' ? 'bg-[#006ee6] text-white' : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* 
        ========================================================================
        MAIN READINESS CONTAINER
        ========================================================================
      */}
      <main className="w-[92%] max-w-[1560px] mx-auto px-2 sm:px-4 lg:px-6 pt-6 space-y-6">
        
        {/* Breadcrumb & Target Exam Badge */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <button 
                type="button" 
                onClick={onNavigatePractice}
                className="hover:text-[#006ee6] transition cursor-pointer"
              >
                Practice
              </button>
              <span>›</span>
              <span className="font-semibold text-[#0f172a]">Readiness assessments</span>
            </div>

            <h1 className="text-2xl sm:text-[28px] font-bold text-[#0f172a] tracking-tight">
              Readiness assessments
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748b]">
              Check what you know, find your focus areas, and walk into exam day with a clear plan.
            </p>
          </div>

          <div className="self-start sm:self-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fffbeb] border border-[#fef3c7] text-[#d97706] text-xs font-semibold shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Target Exam: 38 Days Left</span>
            </div>
          </div>
        </section>

        {/* 
          ========================================================================
          TWO-COLUMN MAIN GRID
          - Left: Hero Next Check Banner + Past Assessments (col-span-8)
          - Right: "How readiness works" instructions card (col-span-4)
          ========================================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* ================= LEFT COLUMN (Col span 8) ================= */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* HERO CARD: "YOUR NEXT READINESS CHECK" */}
            <div className="rounded-2xl bg-gradient-to-r from-[#eef6ff] via-[#f4f9ff] to-[#fbfdff] border border-[#d6e8fc] p-6 sm:p-7 shadow-xs text-left relative overflow-hidden">
              
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white border border-[#d0e4fa] flex items-center justify-center text-[#006ee6]">
                    <Star className="w-3.5 h-3.5 fill-[#006ee6]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#006ee6] uppercase tracking-wider block">
                      {nextAssessment.badge}
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      {nextAssessment.subtitle}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[9.5px] font-bold uppercase tracking-wider">
                  {nextAssessment.attemptTag}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h2 className="text-xl sm:text-[22px] font-bold text-[#0f172a] tracking-tight leading-snug">
                    {nextAssessment.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-[#64748b] mt-1.5 flex-wrap">
                    <span>{nextAssessment.questions} questions</span>
                    <span>·</span>
                    <span>{nextAssessment.duration}</span>
                    <span>·</span>
                    <span className="font-medium text-[#0f172a]">{nextAssessment.attemptsUsed}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onStartAssessment) {
                      onStartAssessment({
                        title: nextAssessment.title,
                        returnRoute: 'readiness-assessments',
                      });
                    } else {
                      setActiveModal(nextAssessment);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs hover:shadow active:scale-[0.99] cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>Start assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* PAST ASSESSMENTS SECTION */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Past assessments
                  </h3>
                  <span className="text-xs text-[#64748b]">
                    3 completed
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Opening complete assessment history...')}
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View history</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Assessment list cards */}
              <div className="space-y-3">
                {pastAssessments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
                    onClick={() => alert(`Reviewing rationales for ${item.title}`)}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0 mt-0.5 sm:mt-0">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-[13.5px] font-bold text-[#0f172a]">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#64748b] mt-0.5">
                          <span>{item.completedDate}</span>
                          <span>·</span>
                          <span>{item.questions}</span>
                          <span>·</span>
                          <span>{item.timeSpent}</span>
                        </div>
                      </div>
                    </div>

                    <div className="self-start sm:self-center">
                      <span className={`px-2.5 py-1 rounded-md border text-[11px] font-bold ${item.scoreBadgeClass}`}>
                        {item.scoreLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>


          {/* ================= RIGHT COLUMN (Col span 4) ================= */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div className="rounded-2xl bg-white border border-[#edf2f7] p-5 sm:p-6 space-y-5 shadow-xs sticky top-20">
              
              <h4 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                How readiness works
              </h4>

              {/* Numbered Steps */}
              <div className="space-y-4 text-xs">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f0f7ff] text-[#006ee6] font-bold text-xs flex items-center justify-center shrink-0 border border-[#dbeafe]">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-[#0f172a]">Take a focused assessment</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed">
                      Answer exam-style questions without hints under realistic test conditions.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f0f7ff] text-[#006ee6] font-bold text-xs flex items-center justify-center shrink-0 border border-[#dbeafe]">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-[#0f172a]">See your performance</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed">
                      Scan strengths, focus areas, and cohort benchmark percentiles.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f0f7ff] text-[#006ee6] font-bold text-xs flex items-center justify-center shrink-0 border border-[#dbeafe]">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-[#0f172a]">Review the rationale</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed">
                      Understand why each answer is right or wrong with clinical pearls.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informational Callout Box */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-2.5 text-xs text-[#64748b]">
                <HelpCircle className="w-4 h-4 text-[#006ee6] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Assessments are fully calibrated with the Next Generation NCLEX (NGN) clinical judgment measurement model.
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* 
        ========================================================================
        ASSESSMENT INSTRUCTIONS & START MODAL
        ========================================================================
      */}
      {activeModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#006ee6] uppercase">
                  {activeModal.badge}
                </span>
                <h3 className="text-base font-bold text-[#0f172a]">
                  {activeModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#64748b]">
              <p>
                You are about to begin <strong>Attempt 4</strong>. Once started, this assessment will run under timed exam conditions. Ensure you have a quiet environment and stable connection.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-center">
                  <span className="block text-[10px] text-[#94a3b8]">Questions</span>
                  <span className="font-bold text-sm text-[#0f172a]">{activeModal.questions}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-center">
                  <span className="block text-[10px] text-[#94a3b8]">Allocated Time</span>
                  <span className="font-bold text-sm text-[#0f172a]">35 mins</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-center">
                  <span className="block text-[10px] text-[#94a3b8]">Scoring</span>
                  <span className="font-bold text-sm text-[#0f172a]">NGN CAT</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Starting ${activeModal.title}... Diagnostic exam initialized!`);
                  setActiveModal(null);
                }}
                className="px-5 py-2 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Confirm & Start Exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

