import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  Search, 
  Clock, 
  Video, 
  Calendar, 
  Check, 
  Users, 
  Radio, 
  Bookmark,
  Play
} from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import userAvatar from '../assets/user-avatar.png';
import instructorJenkins from '../assets/instructor-jenkins.png';
import instructorPatel from '../assets/instructor-patel.png';

export default function LiveClassesPage({ onNavigateHome, onNavigateCourses, onNavigatePractice, onLogout }) {
  const [activeTab, setActiveTab] = useState('Live Classes');
  const [filterTab, setFilterTab] = useState('Scheduled'); // 'Scheduled' | 'Completed' | 'Saved'
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [reminders, setReminders] = useState({});

  const navLinks = ['Home', 'Learn', 'Practice', 'Live Classes', 'Study Schedule'];

  const toggleReminder = (id) => {
    setReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Structured timeline groups matching reference
  const sessions = [
    {
      group: 'Today — Oct 29 (2 sessions)',
      dateKey: 'today',
      isToday: true,
      items: [
        {
          id: 'live-today-1',
          time: '10:00 – 11:00 AM',
          status: 'LIVE',
          statusType: 'live',
          title: 'Pharmacology Review Session',
          instructor: 'Dr. Jenkins, PhD',
          timingNote: 'Today · started 3:00 PM',
          footerMeta: '47 learners joined',
          buttonText: 'Join class',
          buttonType: 'live',
          avatar: instructorJenkins,
        },
        {
          id: 'upcoming-today-2',
          time: '1:00 – 2:30 PM',
          status: 'UPCOMING',
          statusType: 'upcoming',
          title: 'Cardiovascular Nursing Case Studies',
          instructor: 'Dr. Patel, RN',
          timingNote: 'Today · starts 1:00 PM',
          footerMeta: 'Reminder set for 5:45 PM',
          buttonText: 'Reminder set',
          buttonType: 'upcoming',
          avatar: instructorPatel,
        },
        {
          id: 'upcoming-today-3',
          time: '1:00 – 2:30 PM',
          status: 'UPCOMING',
          statusType: 'upcoming',
          title: 'Cardiovascular Nursing Case Studies',
          instructor: 'Dr. Patel, RN',
          timingNote: 'Today · starts 1:00 PM',
          footerMeta: 'Reminder set for 5:45 PM',
          buttonText: 'Reminder set',
          buttonType: 'upcoming',
          avatar: instructorPatel,
        },
        {
          id: 'upcoming-today-4',
          time: '1:00 – 2:30 PM',
          status: 'UPCOMING',
          statusType: 'upcoming',
          title: 'Cardiovascular Nursing Case Studies',
          instructor: 'Dr. Patel, RN',
          timingNote: 'Today · starts 1:00 PM',
          footerMeta: 'Reminder set for 5:45 PM',
          buttonText: 'Reminder set',
          buttonType: 'upcoming',
          avatar: instructorPatel,
        },
      ]
    },
    {
      group: 'Tomorrow — Oct 30 (2 sessions)',
      dateKey: 'tomorrow',
      isToday: false,
      items: [
        {
          id: 'live-tom-1',
          time: '10:00 – 11:00 AM',
          status: 'LIVE',
          statusType: 'live',
          title: 'Pharmacology Review Session',
          instructor: 'Dr. Jenkins, PhD',
          timingNote: 'Today · started 3:00 PM',
          footerMeta: '47 learners joined',
          buttonText: 'Join class',
          buttonType: 'live',
          avatar: instructorJenkins,
        },
        {
          id: 'upcoming-tom-2',
          time: '1:00 – 2:30 PM',
          status: 'UPCOMING',
          statusType: 'upcoming',
          title: 'Cardiovascular Nursing Case Studies',
          instructor: 'Dr. Patel, RN',
          timingNote: 'Today · starts 1:00 PM',
          footerMeta: 'Reminder set for 5:45 PM',
          buttonText: 'Reminder set',
          buttonType: 'upcoming',
          avatar: instructorPatel,
        },
        {
          id: 'upcoming-tom-3',
          time: '1:00 – 2:30 PM',
          status: 'UPCOMING',
          statusType: 'upcoming',
          title: 'Cardiovascular Nursing Case Studies',
          instructor: 'Dr. Patel, RN',
          timingNote: 'Today · starts 1:00 PM',
          footerMeta: 'Reminder set for 5:45 PM',
          buttonText: 'Reminder set',
          buttonType: 'upcoming',
          avatar: instructorPatel,
        },
        {
          id: 'upcoming-tom-4',
          time: '1:00 – 2:30 PM',
          status: 'UPCOMING',
          statusType: 'upcoming',
          title: 'Cardiovascular Nursing Case Studies',
          instructor: 'Dr. Patel, RN',
          timingNote: 'Today · starts 1:00 PM',
          footerMeta: 'Reminder set for 5:45 PM',
          buttonText: 'Reminder set',
          buttonType: 'upcoming',
          avatar: instructorPatel,
        },
      ]
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
              const isActive = link === 'Live Classes';
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => {
                    if (link === 'Home') onNavigateHome();
                    if (link === 'Learn') onNavigateCourses();
                    if (link === 'Practice' && onNavigatePractice) onNavigatePractice();
                    if (link === 'Live Classes') setActiveTab('Live Classes');
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e2e8f0] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => {
                if (link === 'Home') onNavigateHome();
                if (link === 'Learn') onNavigateCourses();
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                link === 'Live Classes' ? 'bg-[#006ee6] text-white' : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* 
        ========================================================================
        MAIN CONTENT CONTAINER
        ========================================================================
      */}
      <main className="w-[92%] max-w-[1560px] mx-auto px-2 sm:px-4 lg:px-6 pt-6 space-y-6">
        
        {/* Header & Tabs Row */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#0f172a] tracking-tight">
              Live Classes
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748b]">
              Interactive clinical lectures, NCLEX-RN exam walkthroughs, and case studies led by nursing specialists.
            </p>
          </div>

          {/* Filter Tabs: Scheduled (3), Completed (14), Saved (2) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilterTab('Scheduled')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'Scheduled'
                  ? 'bg-[#006ee6] text-white shadow-xs'
                  : 'bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Scheduled</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterTab === 'Scheduled' ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                3
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('Completed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'Completed'
                  ? 'bg-[#006ee6] text-white shadow-xs'
                  : 'bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Completed</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterTab === 'Completed' ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                14
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('Saved')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'Saved'
                  ? 'bg-[#006ee6] text-white shadow-xs'
                  : 'bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Saved</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterTab === 'Saved' ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                2
              </span>
            </button>
          </div>
        </section>

        {/* 
          ========================================================================
          TIMELINE SESSIONS
          ========================================================================
        */}
        <div className="space-y-7">
          {sessions.map((sessionGroup, gIdx) => (
            <section key={gIdx} className="space-y-3 text-left">
              
              {/* Group Title with Bullet & Line */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sessionGroup.isToday ? 'bg-[#006ee6]' : 'bg-[#64748b]'}`} />
                  <h3 className="text-[13px] sm:text-sm font-bold text-[#0f172a]">
                    {sessionGroup.group}
                  </h3>
                </div>
                <div className="flex-1 border-t border-[#e2e8f0]" />
              </div>

              {/* Compact Grid of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {sessionGroup.items.map((card) => {
                  const isLive = card.statusType === 'live';
                  const isReminderActive = reminders[card.id];

                  return (
                    <div
                      key={card.id}
                      className={`relative rounded-xl bg-white border border-[#edf2f7] p-3.5 sm:p-4 flex flex-col justify-between shadow-xs transition hover:border-[#cbd5e1] overflow-hidden ${
                        isLive ? 'border-l-[3.5px] border-l-[#ef4444]' : 'border-l-[3.5px] border-l-[#006ee6]'
                      }`}
                    >
                      <div>
                        {/* Top Time and Status Badge */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-bold text-[#0f172a]">
                            {card.time}
                          </span>

                          {isLive ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#fef2f2] text-[#ef4444] text-[9px] font-extrabold tracking-wider uppercase">
                              LIVE
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#f0f9ff] text-[#0284c7] text-[9px] font-extrabold tracking-wider uppercase">
                              UPCOMING
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-[12.5px] sm:text-[13px] font-bold text-[#0f172a] mb-2 leading-snug line-clamp-1">
                          {card.title}
                        </h4>

                        {/* Instructor Row */}
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={card.avatar}
                            alt={card.instructor}
                            className="w-5 h-5 rounded-full object-cover border border-[#e2e8f0] shrink-0"
                          />
                          <div className="leading-tight">
                            <p className="text-[11px] font-semibold text-[#0f172a]">
                              {card.instructor}
                            </p>
                            <p className="text-[9.5px] text-[#94a3b8]">
                              {card.timingNote}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer Meta and Action Button */}
                      <div className="pt-2 border-t border-[#f8fafc] flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-medium truncate ${isLive ? 'text-[#ef4444]' : 'text-[#0284c7]'}`}>
                          {isLive ? card.footerMeta : (isReminderActive ? 'Reminder active' : card.footerMeta)}
                        </span>

                        {isLive ? (
                          <button
                            type="button"
                            onClick={() => alert(`Joining live session: ${card.title}`)}
                            className="px-3 py-1 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-semibold transition shadow-xs cursor-pointer shrink-0"
                          >
                            Join class
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleReminder(card.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                              isReminderActive
                                ? 'bg-[#006ee6] text-white shadow-xs'
                                : 'bg-[#f0f9ff] hover:bg-[#e0f2fe] text-[#0284c7]'
                            }`}
                          >
                            {isReminderActive ? 'Reminder set' : card.buttonText}
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </section>
          ))}
        </div>

      </main>

    </div>
  );
}

