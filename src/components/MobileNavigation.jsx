import React, { useState } from 'react';
import { Home, BookOpen, ClipboardList, Video, Bell } from 'lucide-react';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import mobileHeaderAvatar from '../assets/mobile-header-avatar.png';

/**
 * Conopidea Compact Mobile Top Header (< md only)
 *
 * Matches the Figma mobile reference screenshot:
 * - Left: Circular student avatar button (navigates to My Space / Profile)
 * - Center: Canopedia wordmark logo
 * - Right: Circular white notification bell button
 * - No desktop hamburger or expanded dropdown menu on mobile
 */
export function MobileTopHeader({ onNavigateHome, onNavigateProfile }) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="flex md:hidden sticky top-0 z-40 w-full bg-[#f5f8fb]/95 backdrop-blur-md px-5 pt-3.5 pb-3 items-center justify-between">
      {/* Left: Circular Profile Avatar */}
      <button
        type="button"
        onClick={onNavigateProfile || onNavigateHome}
        aria-label="Open profile"
        className="w-11 h-11 rounded-full overflow-hidden bg-[#dce5ec] border border-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] shrink-0 active:scale-95 transition cursor-pointer"
      >
        <img
          src={mobileHeaderAvatar}
          alt="Student profile"
          className="w-full h-full object-cover scale-105"
        />
      </button>

      {/* Center: Canopedia Wordmark */}
      <button
        type="button"
        onClick={onNavigateHome}
        aria-label="Canopedia Home"
        className="flex items-center justify-center cursor-pointer"
      >
        <img
          src={canopediaWordmark}
          alt="Canopedia"
          className="h-8 w-auto object-contain pointer-events-none select-none"
        />
      </button>

      {/* Right: Circular White Notification Bell */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setNotificationOpen(!notificationOpen)}
          aria-label="Notifications"
          className="w-11 h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] border border-[#edf2f7] flex items-center justify-center text-[#1e293b] active:scale-95 transition cursor-pointer"
        >
          <Bell className="w-5 h-5 stroke-[1.9]" />
        </button>

        {notificationOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
            <div className="absolute right-0 mt-2 z-50 w-68 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0f172a]">Notifications</span>
                <button
                  type="button"
                  onClick={() => setNotificationOpen(false)}
                  className="text-[10.5px] font-semibold text-[#0066cc] cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] text-xs text-[#64748b]">
                <p className="font-semibold text-[#1e293b]">Daily Study Target</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Stay consistent with your weekly NCLEX-RN study plan!
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/**
 * Conopidea Fixed Mobile Bottom Navigation Bar (< md only)
 *
 * Matches the Figma mobile reference screenshot:
 * - Floating white rounded-full dock fixed at bottom while scrolling
 * - 4 items: Home, Learn, Practice, Live
 * - Active tab highlighted with solid blue (#0066cc) rounded-full pill background + white icon & label
 * - Inactive tabs in clean dark slate icon + muted label
 */
export function MobileBottomNav({
  activeTab = 'Home',
  onNavigateHome,
  onNavigateLearn,
  onNavigatePractice,
  onNavigateLive,
}) {
  const navItems = [
    {
      id: 'Home',
      label: 'Home',
      icon: Home,
      onClick: onNavigateHome,
    },
    {
      id: 'Learn',
      label: 'Learn',
      icon: BookOpen,
      onClick: onNavigateLearn,
    },
    {
      id: 'Practice',
      label: 'Practice',
      icon: ClipboardList,
      onClick: onNavigatePractice,
    },
    {
      id: 'Live',
      label: 'Live',
      icon: Video,
      onClick: onNavigateLive,
    },
  ];

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="md:hidden fixed bottom-4 inset-x-0 z-50 px-5 pointer-events-none"
    >
      <div className="max-w-[390px] mx-auto bg-white/98 backdrop-blur-md rounded-full p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.10)] border border-[#edf2f7] grid grid-cols-4 items-center gap-1 pointer-events-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.onClick) item.onClick();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`h-[56px] rounded-full flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-[#0066cc] text-white shadow-[0_4px_12px_rgba(0,102,204,0.28)]'
                  : 'bg-transparent text-[#334155] hover:bg-[#f8fafc]'
              }`}
            >
              <IconComponent
                className={`w-[20px] h-[20px] ${
                  isActive ? 'stroke-[2.1] text-white' : 'stroke-[1.85] text-[#1e293b]'
                }`}
              />
              <span
                className={`text-[11px] leading-none tracking-tight ${
                  isActive ? 'font-semibold text-white' : 'font-medium text-[#64748b]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
