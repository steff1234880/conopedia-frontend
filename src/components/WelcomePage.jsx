import React, { useState } from 'react';
import leftLogo from '../assets/left-logo.png';
import nurseIllustration from '../assets/nurse-illustration.png';
import canopediaWordmark from '../assets/canopedia-wordmark.png';

/**
 * Canopedia Welcome Page
 * 
 * - Desktop/Tablet view (md: and above):
 *   Dual-panel layout with ambient blue brand panel on left and nurse illustration + CTA buttons on right.
 * 
 * - Mobile view (< md):
 *   Dedicated clean layout matching mobile reference screenshot:
 *   - Centered Canopedia wordmark at top
 *   - Bold "Knowledge beyond horizons." headline
 *   - Centered circular sphere bird logo
 *   - Subtitle: "Build your confidence, one lesson at a time. Nursing education designed around you."
 *   - Bottom action buttons: Dark navy "Get started" and White/Blue "I already have an account"
 */
export default function WelcomePage({ onGetStarted, onLogin }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  const handleGetStarted = () => {
    setLoadingAction('get-started');
    setTimeout(() => {
      setLoadingAction(null);
      if (onGetStarted) {
        onGetStarted();
      } else {
        setModalMessage({
          title: 'Get Started',
          text: 'Welcome to CANOPEDIA! Onboarding flow is ready.'
        });
      }
    }, 250);
  };

  const handleLogin = () => {
    setLoadingAction('login');
    setTimeout(() => {
      setLoadingAction(null);
      if (onLogin) {
        onLogin();
      } else {
        setModalMessage({
          title: 'I already have an account',
          text: 'Redirecting to login portal...'
        });
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#1e2733] select-none">
      
      {/* 
        ========================================================================
        MOBILE VIEW (< md)
        Exactly matching mobile reference screenshot:
        1. Top Wordmark logo (canopedia)
        2. Headline: Knowledge beyond horizons.
        3. Spherical bird logo
        4. Subtitle text
        5. Action buttons at bottom:
           - "Get started" (navy pill)
           - "I already have an account" (white pill with blue text & subtle border)
        ========================================================================
      */}
      <div className="flex md:hidden flex-col justify-between items-center min-h-screen px-6 py-8 sm:px-8 max-w-[430px] mx-auto text-center">
        {/* Top Header with Wordmark */}
        <header className="w-full flex justify-center pt-2 pb-4">
          <img
            src={canopediaWordmark}
            alt="Canopedia"
            className="h-8 object-contain"
            loading="eager"
          />
        </header>

        {/* Center Content Section */}
        <div className="flex flex-col items-center justify-center my-auto w-full py-4">
          {/* Headline */}
          <h1 className="text-[27px] sm:text-[30px] font-bold text-[#1e2733] tracking-tight leading-[1.22] mb-7">
            Knowledge beyond<br />
            horizons.
          </h1>

          {/* Centered Spherical Bird Logo */}
          <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-7">
            <img
              src={leftLogo}
              alt="Canopedia Sphere Logo"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_10px_24px_rgba(25,95,170,0.14)]"
              loading="eager"
            />
          </div>

          {/* Subtitle */}
          <p className="text-[13px] leading-[1.55] text-[#718096] font-normal max-w-[285px] sm:max-w-[310px]">
            Build your confidence, one lesson at a time. Nursing education designed around you.
          </p>
        </div>

        {/* Bottom Action Buttons */}
        <div className="w-full space-y-3 pt-4 pb-2">
          {/* Primary Button: Get started */}
          <button
            type="button"
            onClick={handleGetStarted}
            disabled={loadingAction !== null}
            className="w-full h-[50px] rounded-full bg-[#1e2533] hover:bg-[#2c3649] active:bg-[#151a24] text-white text-[14.5px] font-semibold tracking-normal transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          >
            {loadingAction === 'get-started' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Loading...</span>
              </span>
            ) : (
              'Get started'
            )}
          </button>

          {/* Secondary Button: I already have an account */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loadingAction !== null}
            className="w-full h-[50px] rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 border border-[#e2e8f0] text-[#006ee6] text-[14.5px] font-semibold tracking-normal transition-all duration-150 shadow-xs active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          >
            {loadingAction === 'login' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-[#006ee6]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Loading...</span>
              </span>
            ) : (
              'I already have an account'
            )}
          </button>
        </div>
      </div>


      {/* 
        ========================================================================
        DESKTOP & TABLET VIEW (md: and above)
        Dual panel layout preserved exactly as before
        ========================================================================
      */}
      <div className="hidden md:flex min-h-screen w-full flex-row">
        
        {/* LEFT BRAND PANEL */}
        <section 
          aria-label="Brand Introduction"
          className="relative w-[41%] lg:w-[40%] xl:w-[39%] min-h-screen flex flex-col justify-between items-center text-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14 overflow-hidden bg-gradient-to-b from-[#8fd8fa] via-[#aee3fb] to-[#daf1fd]"
        >
          {/* Ambient subtle background decorative spheres */}
          <div 
            aria-hidden="true" 
            className="absolute top-[3.5%] right-[32%] w-6 h-6 rounded-full bg-white/75 blur-[0.5px] pointer-events-none" 
          />
          <div 
            aria-hidden="true" 
            className="absolute top-[24%] -right-10 w-44 h-44 rounded-full bg-white/40 blur-[1px] pointer-events-none" 
          />
          <div 
            aria-hidden="true" 
            className="absolute -bottom-14 -left-14 w-60 h-60 rounded-full bg-white/50 blur-[2px] pointer-events-none" 
          />

          <div className="w-full h-8 z-10" />

          {/* Center Content */}
          <div className="z-10 flex flex-col items-center max-w-[320px] sm:max-w-xs my-auto py-4">
            <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
              <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
                <img
                  src={leftLogo}
                  alt="Canopedia Logo"
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_12px_26px_rgba(25,95,170,0.18)]"
                  loading="eager"
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-[28px] lg:text-[31px] font-bold text-[#1b2f44] tracking-tight leading-[1.24]">
              Knowledge beyond<br />
              horizons.
            </h1>
          </div>

          <footer className="z-10 mt-auto pt-6 pb-2">
            <p className="text-[11.5px] font-medium tracking-[0.14em] text-[#4b6a80] uppercase">
              CANOPEDIA · Learn. Grow. Go beyond.
            </p>
          </footer>
        </section>

        {/* RIGHT ACTION PANEL */}
        <section 
          aria-label="Welcome and Actions"
          className="w-[59%] lg:w-[60%] xl:w-[61%] min-h-screen flex flex-col items-center justify-center px-8 sm:px-12 py-12 md:py-16 bg-white"
        >
          <div className="w-full max-w-[360px] sm:max-w-[385px] flex flex-col items-center text-center">
            
            {/* 3D Illustration */}
            <div className="relative mb-5 sm:mb-6 flex items-center justify-center w-full max-w-[260px] sm:max-w-[290px]">
              <img
                src={nurseIllustration}
                alt="Nursing education illustration"
                className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-300 hover:scale-[1.02]"
                loading="eager"
              />
            </div>

            {/* Heading */}
            <h2 className="text-[25px] sm:text-[27px] font-bold text-[#1e2733] tracking-tight leading-[1.26] mb-3">
              Knowledge beyond<br />
              horizons.
            </h2>

            {/* Subtitle */}
            <p className="text-[12.5px] sm:text-[13px] leading-[1.6] text-[#718096] font-normal max-w-[310px] sm:max-w-[330px] mb-8">
              Build your confidence, one lesson at a time. Nursing education designed around you.
            </p>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={handleGetStarted}
                disabled={loadingAction !== null}
                className="w-full h-[46px] sm:h-[48px] rounded-full bg-[#1e2533] hover:bg-[#2c3649] active:bg-[#151a24] text-white text-[14px] font-medium tracking-normal transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
              >
                {loadingAction === 'get-started' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Loading...</span>
                  </span>
                ) : (
                  'Get started'
                )}
              </button>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loadingAction !== null}
                className="w-full h-[46px] sm:h-[48px] rounded-full bg-[#006ee6] hover:bg-[#0062d0] active:bg-[#0055b8] text-white text-[14px] font-medium tracking-normal transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
              >
                {loadingAction === 'login' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Loading...</span>
                  </span>
                ) : (
                  'I already have an account'
                )}
              </button>
            </div>

          </div>
        </section>
      </div>

      {/* Modal for Mock Interaction */}
      {modalMessage && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setModalMessage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#1e2733] mb-2">{modalMessage.title}</h3>
            <p className="text-sm text-[#718096] mb-6">{modalMessage.text}</p>
            <button
              type="button"
              onClick={() => setModalMessage(null)}
              className="w-full py-2.5 px-4 bg-[#1e2533] hover:bg-[#2c3649] text-white font-medium text-sm rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
