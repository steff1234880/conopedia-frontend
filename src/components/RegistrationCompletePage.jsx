import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import leftLogo from '../assets/left-logo.png';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import registrationCompleteNurse from '../assets/registration-complete-nurse.png';

/**
 * Canopedia Registration Complete Page
 *
 * - Mobile view (< md):
 *   Matches mobile reference screenshot:
 *   - Top bar with circular back button on left + centered Canopedia wordmark
 *   - Left-aligned bold heading: "A world of / knowledge awaits."
 *   - Left-aligned subtitle: "You're all set. Your learning journey starts with one small step."
 *   - Centered standing 3D nurse illustration
 *   - Bottom full-width blue "Go to my dashboard" pill button
 *
 * - Desktop & Tablet view (md: and above):
 *   Dual-panel layout with ambient sky-blue Canopedia brand panel on left and
 *   centered illustration + heading + button on right.
 */
export default function RegistrationCompletePage({ onBack, onGoToDashboard }) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGoToDashboard = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      if (onGoToDashboard) {
        onGoToDashboard();
      }
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] md:bg-white text-[#1e2733] select-none">
      {/* 
        ========================================================================
        MOBILE VIEW (< md)
        ========================================================================
      */}
      <div className="flex md:hidden flex-col justify-between min-h-screen px-5 pt-6 pb-8 max-w-[430px] mx-auto bg-white">
        <div>
          {/* Top Bar: Back Button + Centered Wordmark */}
          <header className="relative flex items-center justify-center mb-6 pt-1">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="absolute left-0 w-10 h-10 rounded-full bg-[#f8fafc] border border-[#edf2f7] flex items-center justify-center text-[#334155] hover:bg-[#f1f5f9] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
            <img
              src={canopediaWordmark}
              alt="Canopedia"
              className="h-7 object-contain pointer-events-none select-none"
              loading="eager"
            />
          </header>

          {/* Left-Aligned Heading & Subtitle */}
          <h1 className="text-[26px] font-bold text-[#1e2733] tracking-tight leading-[1.2] mb-2.5 text-left">
            A world of
            <br />
            knowledge awaits.
          </h1>

          <p className="text-[12.5px] leading-[1.55] text-[#64748b] font-normal text-left max-w-[330px]">
            You&apos;re all set. Your learning journey starts with one small step.
          </p>
        </div>

        {/* Center 3D Nurse Illustration */}
        <div className="flex items-center justify-center my-auto py-6">
          <div className="w-[215px] sm:w-[235px] flex items-center justify-center">
            <img
              src={registrationCompleteNurse}
              alt="Nurse with study materials"
              className="w-full h-auto object-contain pointer-events-none select-none"
              loading="eager"
            />
          </div>
        </div>

        {/* Bottom Primary CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoToDashboard}
            disabled={isNavigating}
            className="w-full h-[48px] rounded-full bg-[#0066cc] hover:bg-[#005bb8] active:bg-[#004f9e] text-white text-[14px] font-semibold transition-all duration-150 shadow-xs active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          >
            {isNavigating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Opening dashboard...</span>
              </span>
            ) : (
              'Go to my dashboard'
            )}
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        DESKTOP & TABLET VIEW (md: and above)
        ========================================================================
      */}
      <div className="hidden md:flex min-h-screen w-full flex-row bg-white">
        {/* LEFT BRAND PANEL */}
        <section
          aria-label="Brand Introduction"
          className="relative w-[40%] min-h-screen flex flex-col justify-center items-center text-center px-6 py-10 sm:px-10 lg:px-12 overflow-hidden bg-gradient-to-b from-[#9adcfb] via-[#bce7fc] to-[#eaf6fe]"
        >
          {/* Soft Ambient Floating Spheres */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-white/45 blur-[2px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-[5%] right-[16%] w-7 h-7 rounded-full bg-white/85 blur-[0.5px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-[14%] right-[5%] w-28 h-28 rounded-full bg-white/65 blur-[1px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/50 blur-[2px] pointer-events-none"
          />

          {/* Center Content: Logo + Headline + Tagline */}
          <div className="z-10 flex flex-col items-center max-w-[330px] my-auto py-4">
            <div className="relative mb-7 flex items-center justify-center">
              <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
                <img
                  src={leftLogo}
                  alt="Canopedia Logo"
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_12px_26px_rgba(25,95,170,0.16)]"
                  loading="eager"
                />
              </div>
            </div>

            <h1 className="text-[29px] lg:text-[32px] font-bold text-[#1e293b] tracking-tight leading-[1.22] mb-4">
              Knowledge beyond
              <br />
              horizons.
            </h1>

            <p className="text-[11.5px] font-normal tracking-[0.02em] text-[#52657a]">
              CANOPEDIA · Learn. Grow. Go beyond.
            </p>
          </div>
        </section>

        {/* RIGHT PANEL (Registration Complete Confirmation) */}
        <section
          aria-label="Registration Complete"
          className="w-[60%] min-h-screen flex flex-col items-center justify-center px-12 lg:px-16 py-16 bg-white"
        >
          <div className="w-full max-w-[400px] flex flex-col items-center text-center">
            {/* 3D Nurse Illustration */}
            <div className="relative mb-7 flex items-center justify-center w-[172px]">
              <img
                src={registrationCompleteNurse}
                alt="Nurse with study materials"
                className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-300 hover:scale-[1.02]"
                loading="eager"
              />
            </div>

            {/* Heading */}
            <h2 className="text-[25px] font-bold text-[#1e2733] tracking-tight leading-snug mb-2.5">
              A world of knowledge awaits.
            </h2>

            {/* Supporting Text */}
            <p className="text-[12.5px] leading-relaxed text-[#64748b] font-normal mb-7">
              You&apos;re all set. Your learning journey starts with one small step.
            </p>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleGoToDashboard}
              disabled={isNavigating}
              className="w-full max-w-[360px] h-[46px] rounded-full bg-[#0066cc] hover:bg-[#005bb8] active:bg-[#004f9e] text-white text-[13.5px] font-semibold transition-all duration-150 shadow-xs active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
            >
              {isNavigating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Opening dashboard...</span>
                </span>
              ) : (
                'Go to my dashboard'
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
