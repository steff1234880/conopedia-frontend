import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  Search, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  Target, 
  Layers, 
  Flame, 
  FileCheck2,
  Check,
  AlertCircle
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';

export default function PracticePage({ 
  onNavigateHome, 
  onNavigateCourses, 
  onNavigateLiveClasses, 
  onNavigateReadiness, 
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('Practice');
  const [activeCategory, setActiveCategory] = useState('All Practice'); // 'All Practice' | 'Topic-wise Practice' | 'Mock Tests' | 'Previous Questions'
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Active quiz/test runner state modal
  const [activeTestSession, setActiveTestSession] = useState(null);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const categories = [
    { id: 'All Practice', label: 'All Practice' },
    { id: 'Topic-wise Practice', label: 'Topic-wise Practice', count: 18 },
    { id: 'Mock Tests', label: 'Mock Tests', count: 6 },
    { id: 'Previous Questions', label: 'Previous Questions', count: 12 },
  ];

  // Practice cards dataset (Exact match to reference screenshot: 2 Self assessment cards)
  const practiceItems = [
    {
      id: 'nclex-readiness-quiz',
      category: 'Mock Tests',
      title: 'NCLEX readiness quiz',
      description: 'Identify your strengths and weak areas before the exam with precision CAT simulation.',
      meta: '75 Adaptive Qs • 90 min',
      duration: '90 min',
      questions: 75,
      difficulty: 'Adaptive',
      attempts: '2 attempts completed',
      actionText: 'Start diagnostic',
      tag: 'Adaptive NGN',
      icon: 'sparkles'
    },
    {
      id: 'practice-test-review',
      category: 'Topic-wise Practice',
      title: 'Practice test review',
      description: 'Review your progress, dissect rationales, and create a focused remediation study plan.',
      meta: '3 tests completed',
      duration: '60 min',
      questions: 50,
      difficulty: 'Intermediate',
      attempts: '3 tests completed',
      actionText: 'Review results',
      tag: 'Remediation',
      icon: 'file'
    }
  ];

  const filteredItems = practiceItems.filter((item) => {
    const matchesCategory = 
      activeCategory === 'All Practice' || 
      item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-20">
      
      {/* 
        ========================================================================
        TOP NAVIGATION BAR
        ========================================================================
      */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eef2f6] px-4 sm:px-8 lg:px-14 py-3 flex items-center justify-between">
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
                    if (link === 'Home' && onNavigateHome) onNavigateHome();
                    if (link === 'Learn' && onNavigateCourses) onNavigateCourses();
                    if (link === 'Practice') setActiveTab('Practice');
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
            {onLogout && (
              <button 
                type="button" 
                onClick={onLogout}
                className="hidden lg:block text-[11px] text-[#94a3b8] hover:text-[#ef4444] px-1 cursor-pointer"
              >
                Exit
              </button>
            )}
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
        MAIN PRACTICE CONTAINER
        ========================================================================
      */}
      <main className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 space-y-7">
        
        {/* Page Heading & Subtitle */}
        <section className="text-left space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#0f172a] tracking-tight">
            Practice
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748b]">
            Build confidence with guided questions and sharpen your skills before the exam with high-fidelity NCLEX-RN simulations.
          </p>
        </section>

        {/* Filter Categories Bar & Search */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#006ee6] text-white shadow-xs'
                      : 'bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#475569]'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practice questions & drills..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-xs text-[#1e2733] placeholder:text-[#94a3b8] outline-hidden focus:border-[#006ee6] focus:ring-1 focus:ring-[#006ee6] transition"
            />
          </div>
        </section>

        {/* 
          ========================================================================
          MAIN GRID: Left Cards & Exam Guides vs Right NCLEX Readiness Card
          ========================================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ================= LEFT COLUMN (Col span 8) ================= */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* Self Assessment Section */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Self assessment
                  </h3>
                  <span className="px-2 py-0.2 rounded-full bg-[#eef6ff] text-[#006ee6] text-[10px] font-bold">
                    Adaptive NGN
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Take quiz</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-[#cbd5e1] transition text-left"
                  >
                    <div>
                      {/* Top Icon & Tag */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                          {item.icon === 'sparkles' ? <Sparkles className="w-4.5 h-4.5" /> : <FileCheck2 className="w-4.5 h-4.5" />}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#64748b] text-[10px] font-medium">
                          {item.difficulty}
                        </span>
                      </div>

                      <h4 className="text-[13.5px] font-bold text-[#0f172a] mb-1.5">
                        {item.title}
                      </h4>

                      <p className="text-xs text-[#64748b] leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#f8fafc] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748b] font-medium">
                        {item.meta}
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveTestSession(item)}
                        className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{item.actionText}</span>
                        <span className="text-sm">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam guide Section */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                  Exam guide
                </h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Guide 1 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                      <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                        NCLEX-RN exam guide
                      </h4>
                      <p className="text-[11px] text-[#64748b] mt-0.5">
                        Format, timing, and what to expect on exam day
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                </div>

                {/* Guide 2 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6]">
                      <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                        Study schedule builder
                      </h4>
                      <p className="text-[11px] text-[#64748b] mt-0.5">
                        Build a routine around your nursing shifts and clinical rotations
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                </div>
              </div>
            </div>

            {/* Free tutorials Section */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0f172a]">
                    Free tutorials
                  </h3>
                  <p className="text-[11px] text-[#64748b]">
                    Concise, high-yield clinical lessons reviewed by board-certified educators.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#006ee6] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Browse all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Tutorial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Tutorial 1 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] overflow-hidden shadow-xs hover:border-[#cbd5e1] transition flex flex-col justify-between">
                  <div className="relative h-28 bg-[#111827] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[9.5px]">
                      <span className="font-extrabold text-[#006ee6] uppercase">VIDEO</span>
                      <span className="text-[#94a3b8]">12 min watch</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0f172a] line-clamp-1">
                      Pharmacology basics
                    </h4>
                    <p className="text-[10.5px] text-[#64748b] line-clamp-2">
                      Key mechanisms, adverse effects, and critical nursing safety checkpoints.
                    </p>
                  </div>
                </div>

                {/* Tutorial 2 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] overflow-hidden shadow-xs hover:border-[#cbd5e1] transition flex flex-col justify-between">
                  <div className="relative h-28 bg-[#0f172a] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[9.5px]">
                      <span className="font-extrabold text-[#006ee6] uppercase">VIDEO</span>
                      <span className="text-[#94a3b8]">8 min watch</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0f172a] line-clamp-1">
                      Cardiovascular nursing
                    </h4>
                    <p className="text-[10.5px] text-[#64748b] line-clamp-2">
                      ECG strips interpretation and acute myocardial infarction management.
                    </p>
                  </div>
                </div>

                {/* Tutorial 3 */}
                <div className="rounded-2xl bg-white border border-[#edf2f7] overflow-hidden shadow-xs hover:border-[#cbd5e1] transition flex flex-col justify-between">
                  <div className="relative h-28 bg-[#1e293b] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[9.5px]">
                      <span className="font-extrabold text-[#7c3aed] uppercase">WEBINAR</span>
                      <span className="text-[#94a3b8]">15 min watch</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0f172a] line-clamp-1">
                      Med-Surg Clinical Priorities
                    </h4>
                    <p className="text-[10.5px] text-[#64748b] line-clamp-2">
                      Prioritization and delegation framework applied directly to case...
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>


          {/* ================= RIGHT COLUMN (Col span 4): NCLEX READINESS ================= */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div className="rounded-2xl bg-white border border-[#edf2f7] p-5 space-y-5 shadow-xs sticky top-20">
              
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  NCLEX READINESS
                </h4>
                <span className="text-[11px] font-semibold text-[#006ee6]">
                  Updated
                </span>
              </div>

              {/* Circular Gauge Representation */}
              <div className="flex items-center gap-4">
                <div className="relative w-18 h-18 rounded-full bg-[#eff6ff] flex items-center justify-center border-4 border-[#006ee6] shrink-0">
                  <div className="text-center">
                    <span className="text-base font-extrabold text-[#0f172a] leading-none block">78%</span>
                    <span className="text-[8px] font-semibold text-[#64748b] uppercase tracking-wider">OVERALL</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span>High Readiness</span>
                  </div>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Your probability of passing the Next Generation NCLEX-RN on first attempt is strong.
                  </p>
                </div>
              </div>

              {/* Recommendation Callout Box */}
              <div className="p-3 rounded-xl bg-[#f0f9ff] border border-[#e0f2fe] flex items-start gap-2.5 text-xs text-[#0369a1]">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#0284c7]" />
                <p className="text-[11px] leading-relaxed">
                  Take the <strong className="font-semibold text-[#0f172a]">Pediatric Dosage Calc</strong> drill to boost weak areas before Friday.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onNavigateReadiness || (() => alert('Opening Readiness assessments...'))}
                className="w-full py-2.5 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Readiness assessments</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>

      </main>

      {/* 
        ========================================================================
        PRACTICE / TEST SESSION MODAL
        Triggered when user clicks "Start diagnostic" / "Start practice"
        ========================================================================
      */}
      {activeTestSession && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setActiveTestSession(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <span className="text-[10.5px] font-bold text-[#006ee6] uppercase">
                  {activeTestSession.subject}
                </span>
                <h3 className="text-base font-bold text-[#0f172a]">
                  {activeTestSession.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTestSession(null)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#64748b]">
              <p>{activeTestSession.description}</p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-center">
                  <span className="block text-[10px] text-[#94a3b8]">Questions</span>
                  <span className="font-bold text-sm text-[#0f172a]">{activeTestSession.questions}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-center">
                  <span className="block text-[10px] text-[#94a3b8]">Duration</span>
                  <span className="font-bold text-sm text-[#0f172a]">{activeTestSession.duration}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#edf2f7] text-center">
                  <span className="block text-[10px] text-[#94a3b8]">Difficulty</span>
                  <span className="font-bold text-sm text-[#0f172a]">{activeTestSession.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTestSession(null)}
                className="px-4 py-2 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Starting session for: ${activeTestSession.title}`);
                  setActiveTestSession(null);
                }}
                className="px-5 py-2 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <span>Begin Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

