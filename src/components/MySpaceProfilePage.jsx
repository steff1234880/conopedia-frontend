import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Sliders, 
  Download, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Check, 
  Edit3, 
  Lock, 
  X,
  Bell,
  Menu,
  CheckCircle2,
  Phone,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import mySpaceAvatar from '../assets/myspace-avatar.png';

export default function MySpaceProfilePage({ 
  onNavigateHome, 
  onNavigateCourses, 
  onNavigatePractice, 
  onNavigateLiveClasses, 
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Profile Information State
  const [profile, setProfile] = useState({
    fullName: 'Ananya Nair',
    email: 'ananya@example.com',
    phone: '+91 98765 43210',
    studentId: 'CNP-2026-8841',
    course: 'NCLEX-RN Prep (NextGen)',
    tag: 'NCLEX-RN Learner',
    joinedDate: 'Joined Sep 2026',
    examFocus: 'NCLEX-RN (NextGen)',
    licensureStatus: 'Primary Licensure'
  });

  // Modal dialog states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form edit states
  const [editFormData, setEditFormData] = useState({ ...profile });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editFormData });
    setIsEditModalOpen(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordFormData.currentPassword || !passwordFormData.newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setPasswordError('');
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
      setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f8fb] md:bg-[#f8fafc] text-[#1e2733] font-sans selection:bg-[#006ee6] selection:text-white pb-24">
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
              const isActive = link === activeTab;
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
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#475569] hover:bg-[#f1f5f9]"
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* 
        ========================================================================
        MAIN MY SPACE CONTAINER
        ========================================================================
      */}
      <main className="w-full md:w-[92%] max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-6 pt-3 md:pt-6 space-y-5 md:space-y-6">
        
        {/* Header Row: Back button & Title */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              aria-label="Back to home"
              className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-[#475569] hover:bg-[#f1f5f9] transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl sm:text-[22px] font-bold text-[#0f172a] tracking-tight">
              My space
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditFormData({ ...profile });
              setIsEditModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#d0e4fa] text-[#006ee6] hover:bg-[#f0f7ff] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </section>

        {/* 
          ========================================================================
          PROFILE HEADER HERO BANNER
          ========================================================================
        */}
        <section className="rounded-2xl bg-gradient-to-r from-[#eef6ff] via-[#f3f8fe] to-[#fafcff] border border-[#d6e8fc] p-5 sm:p-6 flex items-center gap-4 text-left shadow-xs">
          {/* Avatar Container with checkmark overlay */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-xs bg-[#c084fc]">
              <img
                src={mySpaceAvatar}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#006ee6] border-2 border-white flex items-center justify-center text-white">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          {/* User Name & Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
                {profile.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-bold">
                {profile.tag}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <GraduationCap className="w-3.5 h-3.5 text-[#006ee6]" />
              <span>{profile.joinedDate}</span>
              <span>·</span>
              <span className="font-medium text-[#475569]">ID: {profile.studentId}</span>
            </div>
          </div>
        </section>


        {/* 
          ========================================================================
          SECTION 1: PREPARATION & ROUTINE
          ========================================================================
        */}
        <section className="space-y-2.5 text-left">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#8a99a8] uppercase tracking-wider">
              PREPARATION & ROUTINE
            </span>
            <span className="text-[10.5px] font-semibold text-[#006ee6]">
              3 Active modules
            </span>
          </div>

          <div className="space-y-2">
            {/* 1. Personal information card */}
            <div 
              onClick={() => {
                setEditFormData({ ...profile });
                setIsEditModalOpen(true);
              }}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    Personal information
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Profile, learning goals and preferences
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#64748b]">
                <span className="text-[10.5px] text-[#94a3b8] hidden sm:inline">Updated 2d ago</span>
                <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
              </div>
            </div>

            {/* 2. Study schedule builder card */}
            <div 
              onClick={() => alert('Navigating to Study schedule builder...')}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                      Study schedule builder
                    </h3>
                    <span className="px-1.5 py-0.2 rounded-md bg-[#e0f2fe] text-[#0284c7] text-[9px] font-bold tracking-wide">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Build a routine around your hospital nursing shifts
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </div>

            {/* 3. Exam Focus card */}
            <div 
              onClick={() => alert('Editing Exam Focus...')}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    Exam Focus
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Selected: <span className="font-semibold text-[#0f172a]">{profile.examFocus}</span> · Switch exam
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-semibold">
                  {profile.licensureStatus}
                </span>
                <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
              </div>
            </div>
          </div>
        </section>


        {/* 
          ========================================================================
          SECTION 2: BILLING, ASSETS & SETTINGS
          ========================================================================
        */}
        <section className="space-y-2.5 text-left">
          <div className="px-1">
            <span className="text-[10px] font-bold text-[#8a99a8] uppercase tracking-wider">
              BILLING, ASSETS & SETTINGS
            </span>
          </div>

          <div className="space-y-2">
            {/* 1. My Purchases */}
            <div 
              onClick={() => alert('Opening Purchases & Invoices...')}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    My Purchases
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    8 Courses · Active 180-Day Clinical QBank Plan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-bold text-[#16a34a]">
                  Valid till Mar 2027
                </span>
                <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
              </div>
            </div>

            {/* 2. Theme Toggle Switch */}
            <div className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <Sliders className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    Theme
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Switch between clinical light and low-strain dark mode
                  </p>
                </div>
              </div>

              {/* Theme Toggle Pill */}
              <div className="flex items-center p-0.5 rounded-full bg-[#f1f5f9] border border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setDarkMode(false)}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    !darkMode ? 'bg-[#006ee6] text-white shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                  aria-label="Light mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDarkMode(true)}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    darkMode ? 'bg-[#006ee6] text-white shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                  aria-label="Dark mode"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Downloads & saved items */}
            <div 
              onClick={() => alert('Opening Downloads & saved items...')}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <Download className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    Downloads & saved items
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Your offline learning library · 4 Guides & 3 Case Studies
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </div>

            {/* 4. Settings & security */}
            <div 
              onClick={() => setIsPasswordModalOpen(true)}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    Settings & security
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Change password, two-factor authentication, and login sessions
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </div>

            {/* 5. Help & support */}
            <div 
              onClick={() => alert('Opening Help & support modal...')}
              className="rounded-2xl bg-white border border-[#edf2f7] p-4 flex items-center justify-between shadow-xs hover:border-[#cbd5e1] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#006ee6] shrink-0">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#0f172a]">
                    Help & support
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    FAQs, contact support, and clinical educator feedback
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </div>
          </div>
        </section>

        {/* 
          ========================================================================
          SIGN OUT BUTTON
          ========================================================================
        */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 rounded-2xl bg-white border border-[#edf2f7] text-xs sm:text-[13px] font-semibold text-[#ef4444] hover:bg-[#fef2f2] transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>

      </main>


      {/* 
        ========================================================================
        EDIT PROFILE MODAL DIALOG
        ========================================================================
      */}
      {isEditModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">
                Edit Profile Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Personal Information Group */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#8a99a8] uppercase">
                  Personal Information
                </span>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Full name</label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Email address</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Phone number</label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Group */}
              <div className="space-y-3 pt-2 border-t border-[#f1f5f9]">
                <span className="text-[11px] font-bold text-[#8a99a8] uppercase">
                  Academic Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Student ID</label>
                    <input
                      type="text"
                      disabled
                      value={editFormData.studentId}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#94a3b8] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">Grade / Course</label>
                    <input
                      type="text"
                      value={editFormData.course}
                      onChange={(e) => setEditFormData({ ...editFormData, course: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons: Cancel & Save Changes */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* 
        ========================================================================
        CHANGE PASSWORD MODAL DIALOG
        ========================================================================
      */}
      {isPasswordModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#006ee6]" />
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Change Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Current Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 pr-9 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-2.5 text-[#94a3b8] hover:text-[#475569]"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2 pr-9 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-2.5 text-[#94a3b8] hover:text-[#475569]"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordFormData.confirmPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-xs font-medium text-[#0f172a] focus:border-[#006ee6] outline-hidden"
                />
              </div>

              {passwordError && (
                <p className="text-[11px] text-red-500 font-medium">{passwordError}</p>
              )}

              {passwordSuccess && (
                <div className="p-2.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[11px] font-semibold text-[#065f46]">
                  Password updated successfully!
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-[#006ee6] hover:bg-[#0060cb] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Save Password
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

