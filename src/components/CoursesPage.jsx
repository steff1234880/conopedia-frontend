import React, { useState } from 'react';
import { 
  Bell, 
  Home, 
  ChevronRight, 
  Search, 
  LayoutGrid, 
  List, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import courseCard1 from '../assets/course-card-1.png';
import courseCard2 from '../assets/course-card-2.png';
import courseCard3 from '../assets/course-card-3.png';
import courseCard4 from '../assets/course-card-4.png';

export default function CoursesPage({ onNavigateHome, onNavigatePractice, onNavigateLiveClasses, onLogout }) {
  const [activeTab, setActiveTab] = useState('Learn'); // Currently in Courses
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const categories = [
    { id: 'All Courses', label: 'All Courses' },
    { id: 'NCLEX-RN', label: 'NCLEX-RN', count: 3 },
    { id: 'DHA (Dubai)', label: 'DHA (Dubai)' },
  ];

  const courses = [
    {
      id: 'nclex-rn-essentials',
      category: 'NCLEX-RN',
      tag: 'NCLEX-RN',
      subtag: 'HIGH-YIELD',
      rating: '4.9',
      reviewCount: '1.2k',
      instructor: 'Dr. Sarah Chen, RN, MSN',
      title: 'NCLEX-RN essentials',
      meta: '24 chapters · 140 Practice items',
      description: 'Comprehensive review covering adult health, pediatric milestones, psychiatric health, safe pharmacological interventions, and clinical judgment.',
      features: ['NGN Case Studies', 'Bowtie Drills', 'CAT Readiness'],
      thumbnail: courseCard1,
    },
    {
      id: 'nclex-pn-fundamentals',
      category: 'NCLEX-RN',
      tag: 'NCLEX-PN',
      subtag: 'ESSENTIAL',
      rating: '4.7',
      reviewCount: '800',
      instructor: 'Prof. John Smith, LPN, BSN',
      title: 'NCLEX-PN fundamentals',
      meta: '20 chapters · 100 Practice items',
      description: 'Detailed review focusing on nursing fundamentals, mental health, and foundational medical-surgical nursing processes.',
      features: ['Interactive Quizzes', 'Simulation Scenarios', 'Exam Strategies'],
      thumbnail: courseCard2,
    },
    {
      id: 'teas-test-prep',
      category: 'DHA (Dubai)',
      tag: 'TEAS Prep',
      subtag: 'INTENSIVE',
      rating: '4.8',
      reviewCount: '900',
      instructor: 'Mrs. Emily Johnson, BSN',
      title: 'TEAS Test preparation',
      meta: '15 chapters · 80 Practice items',
      description: 'In-depth guidance on reading, math, science, and English language skills essential for nursing school admission.',
      features: ['Practice Exams', 'Flashcards', 'Study Groups'],
      thumbnail: courseCard3,
    },
    {
      id: 'basic-life-support',
      category: 'All Courses',
      tag: 'BLS Certification',
      subtag: 'CRITICAL',
      rating: '4.9',
      reviewCount: '500',
      instructor: 'Dr. Mark Lee, MD',
      title: 'Basic Life Support',
      meta: '10 modules · 50 Practice scenarios',
      description: 'Essential training in CPR, AED use, and emergency response for healthcare providers.',
      features: ['Hands-On Training', 'Skill Assessment', 'Certification Exam'],
      thumbnail: courseCard4,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = 
      activeCategory === 'All Courses' || 
      (activeCategory === 'NCLEX-RN' && course.category === 'NCLEX-RN') ||
      (activeCategory === 'DHA (Dubai)' && course.category === 'DHA (Dubai)');
    
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-20">
      
      {/* 
        ========================================================================
        TOP NAVIGATION BAR (Exact match to Dashboard)
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
              const isActive = link === 'Learn';
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => {
                    if (link === 'Home') onNavigateHome();
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
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                link === 'Learn' ? 'bg-[#006ee6] text-white' : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* 
        ========================================================================
        MAIN COURSES CONTAINER
        ========================================================================
      */}
      <main className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-5">
        
        {/* Breadcrumb & Updated Badge Bar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748b]">
          <div className="flex items-center gap-1.5">
            <button 
              type="button" 
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-[#006ee6] transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-[#0f172a]">Courses & Modules</span>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006ee6]" />
            <span className="text-[11.5px] font-semibold text-[#006ee6]">
              Updated for 2025 NCSBN & Regional Licensing Test Plans
            </span>
          </div>
        </section>

        {/* Filter Tabs & Search / View Controls Bar */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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

          {/* Search Input & View Switcher */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by topic or clinical faculty..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-xs text-[#1e2733] placeholder:text-[#94a3b8] outline-hidden focus:border-[#006ee6] focus:ring-1 focus:ring-[#006ee6] transition"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-white border border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#006ee6] text-white' : 'text-[#64748b] hover:bg-[#f1f5f9]'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#006ee6] text-white' : 'text-[#64748b] hover:bg-[#f1f5f9]'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 
          ========================================================================
          MAIN CONTENT GRID
          - Left: Course Cards (col-span-8)
          - Right: Included in all enrollments & Testimonial (col-span-4)
          ========================================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* ================= LEFT COLUMN: COURSE CARDS (Col span 8) ================= */}
          <div className="lg:col-span-8 space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-[#edf2f7]">
                <p className="text-sm text-[#64748b]">No courses found matching your filter.</p>
                <button
                  type="button"
                  onClick={() => { setActiveCategory('All Courses'); setSearchQuery(''); }}
                  className="mt-3 text-xs font-semibold text-[#006ee6] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-white border border-[#edf2f7] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 shadow-xs hover:border-[#cbd5e1] transition text-left"
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full sm:w-44 h-36 sm:h-auto rounded-xl overflow-hidden shrink-0 border border-[#f1f5f9]">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Top Tag */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 text-[#006ee6] text-[9.5px] font-bold shadow-xs">
                      {course.tag}
                    </span>
                    {/* Bottom Subtag & Rating */}
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-white text-[9.5px] font-semibold">
                      <span className="px-1.5 py-0.5 rounded-sm bg-black/60 backdrop-blur-xs">
                        {course.subtag}
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-black/60 backdrop-blur-xs">
                        <Star className="w-2.5 h-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                        <span>{course.rating}</span>
                        <span className="text-[8.5px] text-[#cbd5e1]">({course.reviewCount})</span>
                      </span>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {/* Instructor & Meta */}
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-[11.5px] font-semibold text-[#006ee6] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006ee6]" />
                          <span>{course.instructor}</span>
                        </span>
                        <span className="text-[11px] text-[#64748b]">
                          {course.meta}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-[#0f172a] tracking-tight">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      {/* Feature Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {course.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#f0f7ff] text-[#006ee6] text-[10.5px] font-medium flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-[#006ee6]" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => alert(`Previewing syllabus for ${course.title}`)}
                        className="px-4 py-2 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition cursor-pointer"
                      >
                        Preview Syllabus
                      </button>

                      <button
                        type="button"
                        onClick={() => alert(`Enrolling in ${course.title}`)}
                        className="px-5 py-2 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <span>Enroll now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>


          {/* ================= RIGHT COLUMN: BENEFITS & TESTIMONIAL (Col span 4) ================= */}
          <div className="lg:col-span-4 space-y-5 text-left">
            
            {/* Card 1: Included in all enrollments */}
            <div className="rounded-2xl bg-white border border-[#edf2f7] p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006ee6]" />
                <h4 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                  Included in all enrollments
                </h4>
              </div>

              <div className="space-y-4 text-xs">
                {/* Benefit 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0 mt-0.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0f172a]">24/7 Faculty Q&A Clinical Desk</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed mt-0.5">
                      Direct rationale explanations by board-certified nursing educators within 2 hours.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0f172a]">High-Yield Offline Cheat Sheets</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed mt-0.5">
                      Printable lab values, pharmacology antidotes, and pediatric growth milestone cards.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0f172a]">Adaptive CAT Simulator Access</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed mt-0.5">
                      Simulate the real exam experience with 85–150 question variable-stopping logic.
                    </p>
                  </div>
                </div>

                {/* Benefit 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0f172a]">100% Pass Guarantee</h5>
                    <p className="text-[11px] text-[#64748b] leading-relaxed mt-0.5">
                      Pass your NCLEX or DHA exam on the first attempt or receive a 100% full tuition refund.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 2: Student Testimonial */}
            <div className="rounded-2xl bg-white border border-[#edf2f7] p-5 space-y-3.5 shadow-xs">
              {/* 5 Stars */}
              <div className="flex items-center gap-1 text-[#f59e0b]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>

              {/* Quote */}
              <p className="text-xs text-[#475569] leading-relaxed italic">
                “Canopedia's Next-Gen case studies matched what I saw on test day down to the exact Bowtie question templates. <span className="font-semibold text-[#0f172a]">Passed in 85 questions!</span>”
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[10.5px] font-bold flex items-center justify-center">
                  PR
                </div>
                <div>
                  <h6 className="text-xs font-bold text-[#0f172a] leading-none">
                    Priya Ramanathan, RN
                  </h6>
                  <p className="text-[10.5px] text-[#64748b] mt-0.5">
                    Passed NCLEX-RN · Chicago, IL
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

