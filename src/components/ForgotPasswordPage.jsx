import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import leftLogo from '../assets/left-logo.png';
import canopediaWordmark from '../assets/canopedia-wordmark.png';

/**
 * Canopedia Forgot Password Page
 * 
 * Matches reference screenshot exactly:
 * - Left Panel:
 *   - Top-left Canopedia wordmark logo
 *   - Ambient sky gradient with decorative spheres
 *   - Centered circular Canopedia sphere illustration
 *   - Headline "Knowledge beyond horizons."
 *   - Tagline "CANOPEDIA · Learn. Grow. Go beyond."
 * - Right Panel:
 *   - Floating ambient light-blue circular accents in background
 *   - Centered rounded card with lock icon + "*******" dots underneath
 *   - Heading: "Reset Your Password"
 *   - Subtitle: "Enter your registered email. We'll send a code to help you reset your password."
 *   - Email address input with label and pre-fill "ananya@example.com"
 *   - Blue rounded "Send reset code" button
 *   - Soft light-blue "Back to sign in" button
 *   - Feedback state upon submission ready for backend API integration
 */
export default function ForgotPasswordPage({ onBackToSignIn, onResetCodeSent }) {
  const [email, setEmail] = useState('ananya@example.com');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email address is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API request to send reset code
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (onResetCodeSent) {
        onResetCodeSent(email);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-[#1e2733] select-none">
      
      {/* 
        ========================================================================
        LEFT PANEL (Canopedia Branding)
        ========================================================================
      */}
      <section 
        aria-label="Brand Presentation"
        className="relative w-full md:w-[41%] lg:w-[40%] xl:w-[39%] min-h-[440px] md:min-h-screen flex flex-col justify-between items-center text-center px-6 py-7 sm:px-10 sm:py-9 lg:px-12 lg:py-10 overflow-hidden bg-gradient-to-b from-[#8fd8fa] via-[#aee3fb] to-[#daf1fd]"
      >
        {/* Soft Ambient Floating Spheres */}
        <div 
          aria-hidden="true" 
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/40 blur-[2px] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-[4%] right-[30%] w-6 h-6 rounded-full bg-white/80 blur-[0.5px] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-[16%] -right-8 w-44 h-44 rounded-full bg-white/45 blur-[1px] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/50 blur-[2px] pointer-events-none" 
        />

        {/* Top-Left Canopedia Wordmark Logo */}
        <header className="w-full flex items-center justify-start z-10 pl-1 sm:pl-2">
          <img
            src={canopediaWordmark}
            alt="canopedia"
            className="h-5 sm:h-5.5 w-auto object-contain pointer-events-none"
            loading="eager"
          />
        </header>

        {/* Center Content: Single Centered Brand Illustration + Headline */}
        <div className="z-10 flex flex-col items-center max-w-[320px] sm:max-w-xs my-auto py-4">
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
              <img
                src={leftLogo}
                alt="Canopedia Sphere Logo"
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

        {/* Bottom Tagline */}
        <footer className="z-10 mt-auto pt-4 pb-1">
          <p className="text-[11px] sm:text-[11.5px] font-medium tracking-[0.14em] text-[#4b6a80] uppercase">
            CANOPEDIA · Learn. Grow. Go beyond.
          </p>
        </footer>
      </section>

      {/* 
        ========================================================================
        RIGHT PANEL (Forgot Password Form)
        Features:
        - Floating ambient soft cyan circles matching Figma
        - Rounded lock badge with asterisks
        - Heading & instruction subtitle
        - Email input with small label inside
        - "Send reset code" primary button
        - "Back to sign in" secondary button
        ========================================================================
      */}
      <section 
        aria-label="Forgot Password Form"
        className="relative w-full md:w-[59%] lg:w-[60%] xl:w-[61%] min-h-[500px] md:min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-12 md:py-16 bg-white overflow-hidden"
      >
        {/* Decorative soft circles in right panel matching reference */}
        <div 
          aria-hidden="true" 
          className="absolute top-[28%] left-[10%] w-20 h-20 rounded-full bg-[#e8f6fd] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-[32%] right-[10%] w-22 h-22 rounded-full bg-[#e8f6fd] pointer-events-none" 
        />

        <div className="z-10 w-full max-w-[360px] sm:max-w-[390px] flex flex-col items-center text-center">
          
          {/* Lock Icon Badge & Password Dots */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-[58px] h-[58px] rounded-2xl bg-white border border-[#edf2f7] shadow-[0_4px_14px_rgba(0,0,0,0.04)] flex items-center justify-center mb-2">
              <Lock className="w-5 h-5 text-[#475569] stroke-[2]" />
            </div>
            {/* 7 Asterisk Dots */}
            <div className="flex items-center gap-1 text-[#1e293b] text-sm font-bold tracking-[0.2em] select-none">
              <span>*</span><span>*</span><span>*</span><span>*</span><span>*</span><span>*</span><span>*</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[23px] sm:text-[26px] font-bold text-[#1e2733] tracking-tight mb-2.5">
            Reset Your Password
          </h2>

          {/* Subtitle */}
          <p className="text-[12px] sm:text-[12.5px] leading-relaxed text-[#718096] font-normal max-w-[320px] mb-7">
            Enter your registered email. We'll send a code to help you reset your password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="w-full space-y-3.5">
            
            {/* Email Field with Floating-style Label */}
            <div className="text-left">
              <div className="relative rounded-2xl bg-white border border-[#e2e8f0] px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                <label className="block text-[10.5px] font-medium text-[#718096] mb-0.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@example.com"
                  className="w-full text-[13.5px] font-medium text-[#1e2733] outline-hidden bg-transparent"
                />
              </div>
              {error && (
                <span className="text-[11px] text-red-500 mt-1 ml-1 block">{error}</span>
              )}
            </div>

            {/* Primary Button: Send reset code */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[46px] rounded-full bg-[#006ee6] hover:bg-[#0060cb] active:bg-[#0054b3] text-white text-[14px] font-semibold transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Sending code...</span>
                  </span>
                ) : (
                  'Send reset code'
                )}
              </button>
            </div>

            {/* Secondary Button: Back to sign in */}
            <div>
              <button
                type="button"
                onClick={onBackToSignIn}
                className="w-full h-[46px] rounded-full bg-[#edf6fd] hover:bg-[#e2f0fb] active:bg-[#d8eaf8] text-[#006ee6] text-[13.5px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer"
              >
                Back to sign in
              </button>
            </div>

          </form>

          {/* Success Notification Banner */}
          {isSuccess && (
            <div className="mt-5 w-full p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-left animate-in fade-in duration-200">
              <p className="text-[12.5px] font-semibold text-[#065f46]">Reset code sent!</p>
              <p className="text-[11.5px] text-[#047857] mt-0.5">
                We've sent a 6-digit verification code to <span className="font-medium">{email}</span>. Please check your inbox.
              </p>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

