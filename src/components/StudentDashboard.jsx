import React, { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Play, 
  Star, 
  GraduationCap, 
  Flame, 
  Target, 
  Search, 
  Menu, 
  X,
  FileCheck2,
  Check
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import heroBooks from '../assets/dashboard-hero-books.png';
import course1Img from '../assets/course-1.png';
import course2Img from '../assets/course-2.png';
import course3Img from '../assets/course-3.png';
import tutorial1Img from '../assets/tutorial-1.png';
import tutorial2Img from '../assets/tutorial-2.png';
import tutorial3Img from '../assets/tutorial-3.png';
import userAvatar from '../assets/user-avatar.png';
import { MobileTopHeader, MobileBottomNav } from './MobileNavigation';

/**
 * Canopedia Student Dashboard
 * 
 * Recreates the reference design exactly:
 * - Top Navbar: Logo, Nav Links (Home, Learn, Practice, Live Classes, Study Schedule), Notifications, User Profile Badge.
 * - Header Area: Day 4 Streak, Target: 45 min today, Greeting, Stats Cards (Today's Focus 28/45m, CAT Mastery 84%).
 * - Hero Card: "ADAPTIVE NEXT-GEN NCLEX (NGN)", "Your first chapter awaits", Explore courses button, 3D books & stethoscope illustration.
 * - Free Assessment: NCLEX readiness check card with 10 min, instant results tags, and Start button.
 * - Two Column Grid:
 *   - Left Col:
 *     - Self assessment (NCLEX readiness quiz, Practice test review)
 *     - Courses (NCLEX-RN essentials, NCLEX-RN exam prep & CAT drills, Pharmacology for Nurses)
 *   - Right Col:
 *     - Exam guide (NCLEX-RN exam guide, Study schedule builder)
 *     - Free tutorials (Pharmacology basics, Cardiovascular nursing, Pediatric vital signs & triage)
 */
export default function StudentDashboard({ 
  onNavigateCourses, 
  onNavigatePractice, 
  onNavigateLiveClasses, 
  onNavigateReadiness, 
  onNavigateProfile,
  onStartAssessment,
  onViewResults,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const handleTabClick = (link) => {
    setActiveTab(link);
    if (link === 'Learn' && onNavigateCourses) {
      onNavigateCourses();
    } else if (link === 'Practice' && onNavigatePractice) {
      onNavigatePractice();
    } else if (link === 'Live Classes' && onNavigateLiveClasses) {
      onNavigateLiveClasses();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f8fb] md:bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-28 md:pb-20">
      {/* Compact Mobile Header (< md) */}
      <MobileTopHeader
        onNavigateHome={() => setActiveTab('Home')}
        onNavigateProfile={onNavigateProfile}
      />

      {/* 
        ========================================================================
        DESKTOP & TABLET TOP NAVIGATION BAR (md: and above)
        ========================================================================
      */}
      <header className="hidden md:flex sticky top-0 z-40 w-full bg-white border-b border-[#eef2f6] px-4 sm:px-8 lg:px-12 py-3 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Canopedia Brand Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('Home')}>
            <img
              src={canopediaWordmark}
              alt="Canopedia"
              className="h-5.5 w-auto object-contain"
            />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link;
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleTabClick(link)}
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
          {/* Notifications bell */}
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
                    <span className="text-[10px] text-[#006ee6] font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2 text-xs text-[#64748b]">
                    <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9]">
                      <p className="font-medium text-[#1e293b]">Daily Goal: 28/45 mins</p>
                      <p className="text-[11px] text-[#94a3b8]">17 minutes left to maintain streak!</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill */}
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
        MAIN DASHBOARD CONTAINER
        Expanded to approximately 90-94% of screen width with balanced side margins
        ========================================================================
      */}
      <main className="w-full md:w-[92%] max-w-[1560px] mx-auto px-5 sm:px-6 lg:px-6 pt-3 md:pt-6 space-y-5 md:space-y-6">
        
        {/* Top Badges & Welcome Greeting Row */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {/* Pill Badges: Day 4 Streak + Target */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-[#eef6ff] text-[#006ee6] text-[11px] font-bold tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006ee6]" />
                DAY 4 STREAK
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-[#f1f5f9] text-[#475569] text-[11px] font-semibold">
                <Clock className="w-3 h-3 text-[#64748b]" />
                Target: 45 min today
              </span>
            </div>

            {/* Greeting */}
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#0f172a] tracking-tight">
              Welcome, Ananya. Let's begin.
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748b]">
              Your nursing journey starts with one small step. Every question mastered builds clinical instinct.
            </p>
          </div>

          {/* Right Stats Quick Cards */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            {/* Today's Focus Card */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#edf2f7] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#0f172a] leading-none">28 / 45m</div>
                <div className="text-[10px] font-semibold text-[#8a99a8] uppercase tracking-wider mt-1">
                  TODAY'S FOCUS
                </div>
              </div>
            </div>

            {/* CAT Mastery Card */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#edf2f7] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#0f172a] leading-none">84%</div>
                <div className="text-[10px] font-semibold text-[#8a99a8] uppercase tracking-wider mt-1">
                  CAT MASTERY
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 
          ========================================================================
          HERO BANNER: "Your first chapter awaits"
          ========================================================================
        */}
        <section className="relative w-full rounded-2xl bg-gradient-to-r from-[#e7f3fe] via-[#edf6ff] to-[#f4f9ff] border border-[#d6e8fc] px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between overflow-hidden">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />

          {/* Left Text & CTA */}
          <div className="z-10 max-w-lg space-y-2.5 text-left">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-[#d0e4fa] text-[#006ee6] text-[10.5px] font-bold tracking-tight">
              <GraduationCap className="w-3.5 h-3.5 text-[#006ee6]" />
              ADAPTIVE NEXT-GEN NCLEX (NGN)
            </span>

            <h2 className="text-xl sm:text-[22px] font-bold text-[#0f172a] tracking-tight leading-tight">
              Your first chapter awaits
            </h2>

            <p className="text-xs text-[#64748b]">
              Choose a course and set a study goal.
            </p>

            <div className="pt-1.5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNavigateCourses}
                className="px-5 py-2 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-[13px] font-semibold flex items-center gap-2 transition shadow-xs hover:shadow cursor-pointer"
              >
                <span>Explore courses</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-medium">
                <Check className="w-4 h-4 text-[#006ee6]" />
                <span>Updated for 2025 NCSBN test plan</span>
              </div>
            </div>
          </div>

          {/* Right 3D Books & Stethoscope Graphic */}
          <div className="z-10 mt-4 sm:mt-0 flex items-center justify-center shrink-0">
            <img
              src={heroBooks}
              alt="Medical books with stethoscope"
              className="w-32 sm:w-36 h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,110,230,0.12)] pointer-events-none"
            />
          </div>
        </section>


        {/* 
          ========================================================================
          FREE ASSESSMENT CARD
          ========================================================================
        */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-sm bg-[#f59e0b] text-white text-[9px] font-extrabold uppercase tracking-wider">
                FREE
              </span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                Free assessment
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onStartAssessment) {
                  onStartAssessment({
                    title: 'NCLEX readiness check',
                    returnRoute: 'dashboard',
                  });
                } else if (onNavigateReadiness) {
                  onNavigateReadiness();
                }
              }}
              className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Start now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner Box */}
          <div className="w-full rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#cbd5e1] transition">
            <div className="flex items-start sm:items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#fffbeb] border border-[#fef3c7] flex items-center justify-center shrink-0 text-[#d97706]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0f172a]">
                    NCLEX readiness check
                  </h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006ee6]" />
                </div>
                <p className="text-xs text-[#64748b]">
                  Get a quick snapshot of your strengths and weak areas before the exam.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[#64748b] pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#94a3b8]" />
                    10 min
                  </span>
                  <span className="flex items-center gap-1 text-[#006ee6] font-medium">
                    <Sparkles className="w-3 h-3" />
                    Instant results
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onStartAssessment) {
                  onStartAssessment({
                    title: 'NCLEX readiness check',
                    returnRoute: 'dashboard',
                  });
                } else if (onNavigateReadiness) {
                  onNavigateReadiness();
                }
              }}
              className="self-start sm:self-center px-5 py-2 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Start</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>


        {/* 
          ========================================================================
          TWO-COLUMN MAIN SECTION
          - Left (approx 65% width): Self assessment & Courses
          - Right (approx 35% width): Exam guide & Free tutorials
          ========================================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ================= LEFT COLUMN (Col span 8) ================= */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* Section 1: Self Assessment */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#006ee6]" />
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Self assessment
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Take quiz</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Two cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 1: NCLEX readiness quiz */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-[#cbd5e1] transition">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                        <GraduationCap className="w-4.5 h-4.5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#64748b] text-[10px] font-medium">
                        45 mins
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0f172a] mb-1.5">
                      NCLEX readiness quiz
                    </h4>
                    <p className="text-xs text-[#64748b] leading-relaxed mb-4">
                      Identify your strengths and weak areas across Safe Care & Physiological Adaptation before the real exam.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onStartAssessment) {
                        onStartAssessment({
                          title: 'NCLEX readiness quiz',
                          returnRoute: 'dashboard',
                        });
                      } else if (onNavigateReadiness) {
                        onNavigateReadiness();
                      }
                    }}
                    className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>Start assessment</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 2: Practice test review */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-[#cbd5e1] transition">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                        <FileCheck2 className="w-4.5 h-4.5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#e0f2fe] text-[#0284c7] text-[10px] font-semibold">
                        Instant Rationale
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0f172a] mb-1.5">
                      Practice test review
                    </h4>
                    <p className="text-xs text-[#64748b] leading-relaxed mb-4">
                      Review your recent clinical simulations and generate a focused study plan with spaced repetition flashcards.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onViewResults) {
                        onViewResults();
                      }
                    }}
                    className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>Review logs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* Section 2: Courses */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#006ee6]" />
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Courses
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>See all (14)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row of 2 Course Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Course 1: NCLEX-RN essentials */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] overflow-hidden shadow-xs hover:border-[#cbd5e1] transition flex flex-col justify-between">
                  <div>
                    {/* Course Banner */}
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={course1Img}
                        alt="NCLEX-RN essentials"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#006ee6] text-[9.5px] font-bold">
                        NCLEX-RN
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-medium">
                        24 Chapters
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] text-[#64748b]">
                        Dr. Sarah Chen, 24 chapters
                      </div>

                      <h4 className="text-sm font-bold text-[#0f172a] leading-tight">
                        NCLEX-RN essentials
                      </h4>

                      <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">
                        Comprehensive review covering adult health, pediatric milestones, psychiatric health, and...
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#0f172a]">
                      <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span>4.9</span>
                      <span className="text-[11px] text-[#94a3b8] font-normal">(3.2k reviews)</span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Enroll now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Course 2: NCLEX-RN exam prep & CAT drills */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] overflow-hidden shadow-xs hover:border-[#cbd5e1] transition flex flex-col justify-between">
                  <div>
                    {/* Course Banner */}
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={course2Img}
                        alt="NCLEX-RN exam prep & CAT drills"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#006ee6] text-[9.5px] font-bold">
                        NCLEX-RN
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-medium">
                        18 Chapters
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] text-[#64748b]">
                        Dr. Omar Patel, 24 chapters
                      </div>

                      <h4 className="text-sm font-bold text-[#0f172a] leading-tight">
                        NCLEX-RN exam prep & CAT drills
                      </h4>

                      <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">
                        High-yield case simulations, bowtie question strategies, and matrix grid mastery designed to...
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#0f172a]">
                      <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span>4.8</span>
                      <span className="text-[11px] text-[#94a3b8] font-normal">(1.9k reviews)</span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Enroll now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Horizontal Wide Course Card: Pharmacology */}
              <div className="w-full rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs hover:border-[#cbd5e1] transition">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left w-full">
                  <img
                    src={course3Img}
                    alt="Pharmacology"
                    className="w-full sm:w-28 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.2 rounded-sm bg-[#e0e7ff] text-[#4338ca] text-[9.5px] font-bold uppercase tracking-wide">
                        HIGH YIELD
                      </span>
                      <span className="text-[11px] text-[#64748b]">
                        Prof. Maya Lin, PharmD
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0f172a]">
                      Pharmacology for Nurses: Mechanism, Dosages & Antidotes
                    </h4>

                    <p className="text-xs text-[#64748b] line-clamp-2">
                      Master adrenergic agonists, insulin protocols, psychotropics, and critical therapeutic ranges with mnemonic flashcards.
                    </p>

                    <p className="text-[11px] text-[#94a3b8] pt-0.5">
                      16 Chapters · 120 Practice Items
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 self-start sm:self-center px-4 py-2 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>View syllabus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>


          {/* ================= RIGHT COLUMN (Col span 4) ================= */}
          <div className="lg:col-span-4 space-y-7">
            
            {/* Section 1: Exam Guide */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#006ee6]" />
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Exam guide
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Guide Items */}
              <div className="space-y-2.5">
                {/* Guide 1 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-3.5 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a]">
                        NCLEX-RN exam guide
                      </h4>
                      <p className="text-[11px] text-[#64748b]">
                        Format, timing, & scoring model
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                </div>

                {/* Guide 2 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-3.5 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a]">
                        Study schedule builder
                      </h4>
                      <p className="text-[11px] text-[#64748b]">
                        Build a routine around your shifts
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                </div>
              </div>
            </div>

            {/* Section 2: Free tutorials */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#006ee6]" />
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Free tutorials
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Browse all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Video Tutorial List */}
              <div className="space-y-2.5">
                
                {/* Video 1 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-2.5 sm:p-3 flex items-center gap-3 shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="relative w-15 sm:w-16 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <img src={tutorial1Img} alt="Pharmacology" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-extrabold text-[#006ee6] uppercase tracking-wider block">
                      PHARMACOLOGY
                    </span>
                    <h4 className="text-xs font-bold text-[#0f172a] line-clamp-1">
                      VIDEO: Pharmacology basics
                    </h4>
                    <span className="text-[10.5px] text-[#94a3b8] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 12 min watch
                    </span>
                  </div>
                </div>

                {/* Video 2 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-2.5 sm:p-3 flex items-center gap-3 shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="relative w-15 sm:w-16 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <img src={tutorial2Img} alt="Cardiology" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-extrabold text-[#006ee6] uppercase tracking-wider block">
                      CARDIOLOGY
                    </span>
                    <h4 className="text-xs font-bold text-[#0f172a] line-clamp-1">
                      VIDEO: Cardiovascular nursing
                    </h4>
                    <span className="text-[10.5px] text-[#94a3b8] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 8 min watch
                    </span>
                  </div>
                </div>

                {/* Video 3 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-2.5 sm:p-3 flex items-center gap-3 shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="relative w-15 sm:w-16 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <img src={tutorial3Img} alt="Pediatrics" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-extrabold text-[#006ee6] uppercase tracking-wider block">
                      PEDIATRICS
                    </span>
                    <h4 className="text-xs font-bold text-[#0f172a] line-clamp-1">
                      VIDEO: Pediatric vital signs & triage
                    </h4>
                    <span className="text-[10.5px] text-[#94a3b8] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 15 min watch
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Fixed Mobile Bottom Navigation (< md) */}
      <MobileBottomNav
        activeTab="Home"
        onNavigateHome={() => window.scrollTo(0, 0)}
        onNavigateLearn={onNavigateCourses}
        onNavigatePractice={onNavigatePractice}
        onNavigateLive={onNavigateLiveClasses}
      />

    </div>
  );
}

