import React, { useState } from 'react';
import leftLogo from '../assets/left-logo.png';
import registrationCompleteNurse from '../assets/registration-complete-nurse.png';

/**
 * Canopedia Registration Complete Page
 *
 * Displayed once at the end of first-time student registration after selecting
 * a program (NCLEX-RN or DHA):
 * - Left Panel: Canopedia ambient sky-blue brand panel with spherical logo,
 *   "Knowledge beyond horizons." headline, and tagline.
 * - Right Panel: Centered standing 3D nurse illustration, "A world of knowledge awaits."
 *   heading, supporting text, and full-width blue "Go to my dashboard" pill button.
 */
export default function RegistrationCompletePage({ onGoToDashboard }) {
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-[#1e2733] select-none">
      {/* 
        ========================================================================
        LEFT PANEL (Canopedia Brand)
        Matches exact reference: soft aqua-sky gradient, subtle ambient spheres,
        crisp single logo, bold heading and tagline directly beneath.
        ========================================================================
      */}
      <section
        aria-label="Brand Introduction"
        className="relative w-full md:w-[40%] lg:w-[40%] xl:w-[40%] min-h-[340px] md:min-h-screen flex flex-col justify-center items-center text-center px-6 py-10 sm:px-10 lg:px-12 overflow-hidden bg-gradient-to-b from-[#9adcfb] via-[#bce7fc] to-[#eaf6fe]"
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
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
              <img
                src={leftLogo}
                alt="Canopedia Logo"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_12px_26px_rgba(25,95,170,0.16)]"
                loading="eager"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-[29px] lg:text-[32px] font-bold text-[#1e293b] tracking-tight leading-[1.22] mb-4">
            Knowledge beyond
            <br />
            horizons.
          </h1>

          <p className="text-[11px] sm:text-[11.5px] font-normal tracking-[0.02em] text-[#52657a]">
            CANOPEDIA · Learn. Grow. Go beyond.
          </p>
        </div>
      </section>

      {/* 
        ========================================================================
        RIGHT PANEL (Registration Complete Confirmation)
        ========================================================================
      */}
      <section
        aria-label="Registration Complete"
        className="w-full md:w-[60%] lg:w-[60%] xl:w-[60%] min-h-[460px] md:min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 py-12 md:py-16 bg-white"
      >
        <div className="w-full max-w-[380px] sm:max-w-[400px] flex flex-col items-center text-center">
          {/* 3D Nurse Illustration */}
          <div className="relative mb-6 sm:mb-7 flex items-center justify-center w-[150px] sm:w-[172px]">
            <img
              src={registrationCompleteNurse}
              alt="Nurse with study materials"
              className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-300 hover:scale-[1.02]"
              loading="eager"
            />
          </div>

          {/* Heading */}
          <h2 className="text-[22px] sm:text-[25px] font-bold text-[#1e2733] tracking-tight leading-snug mb-2.5">
            A world of knowledge awaits.
          </h2>

          {/* Supporting Text */}
          <p className="text-[12px] sm:text-[12.5px] leading-relaxed text-[#64748b] font-normal mb-7">
            You&apos;re all set. Your learning journey starts with one small step.
          </p>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleGoToDashboard}
            disabled={isNavigating}
            className="w-full max-w-[360px] h-[44px] sm:h-[46px] rounded-full bg-[#0066cc] hover:bg-[#005bb8] active:bg-[#004f9e] text-white text-[13px] sm:text-[13.5px] font-semibold transition-all duration-150 shadow-xs active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          >
            {isNavigating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
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
  );
}
