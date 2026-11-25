import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import leftLogo from '../assets/left-logo.png';
import canopediaWordmark from '../assets/canopedia-wordmark.png';
import { demoAuthService } from '../services/authService';

/**
 * Canopedia Login Page
 * 
 * Supports temporary demo login:
 * - Allows any non-empty email and password.
 * - Shows validation only if email or password is empty.
 * - Calls demoAuthService to navigate directly to the Student Dashboard.
 * - Preserves existing layout, typography, colors, and button styling exactly.
 */
export default function LoginPage({ onBack, onCreateAccount, onForgotPassword, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    }
    if (!password.trim()) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Isolated temporary demo authentication
      const user = await demoAuthService.login(email, password);
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setIsLoading(false);
      setErrors({ form: err.message });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    // Temporary demo Google login
    const user = await demoAuthService.login('ananya@gmail.com', 'google-auth');
    setIsGoogleLoading(false);
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
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
        RIGHT PANEL (Login Form)
        ========================================================================
      */}
      <section 
        aria-label="Login Form"
        className="w-full md:w-[59%] lg:w-[60%] xl:w-[61%] min-h-[500px] md:min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-12 md:py-16 bg-white relative"
      >
        {/* Back button to Welcome Page */}
        {onBack && (
          <div className="absolute top-6 left-6 sm:top-10 sm:left-12">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back to Welcome"
              className="w-10 h-10 rounded-full bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
          </div>
        )}

        <div className="w-full max-w-[360px] sm:max-w-[380px] flex flex-col">
          
          {/* Heading */}
          <h2 className="text-[26px] sm:text-[29px] font-bold text-[#1e2733] tracking-tight leading-snug mb-2">
            Welcome back.
          </h2>

          {/* Subtitle */}
          <p className="text-[12.5px] sm:text-[13px] text-[#718096] font-normal mb-7">
            A calmer space to learn, practice and grow.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
            
            {/* Email Field */}
            <div>
              <div className="relative rounded-xl border border-[#e2e8f0] px-4 py-2.5 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                  placeholder="Email address"
                  className="w-full text-[13.5px] text-[#1e2733] placeholder:text-[#a0aec0] outline-hidden bg-transparent"
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-red-500 mt-1 ml-1 block">{errors.email}</span>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <div className="relative rounded-xl border border-[#e2e8f0] px-4 py-2.5 flex items-center justify-between transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  placeholder="Password"
                  className="w-full text-[13.5px] text-[#1e2733] placeholder:text-[#a0aec0] outline-hidden bg-transparent pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#94a3b8] hover:text-[#475569] p-0.5 cursor-pointer outline-hidden transition"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-500 mt-1 ml-1 block">{errors.password}</span>
              )}
            </div>

            {/* Forgot password? Link */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[12px] font-medium text-[#006ee6] hover:text-[#0055b8] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in Button */}
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
                    <span>Signing in...</span>
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* "or" Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="w-full border-t border-[#edf2f7]" />
              <span className="absolute bg-white px-3 text-[11px] text-[#a0aec0] font-normal">
                or
              </span>
            </div>

            {/* Continue with Google Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-[46px] rounded-full bg-[#edf6fd] hover:bg-[#e2f0fb] active:bg-[#d8eaf8] text-[#1e2733] text-[13.5px] font-medium transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Bottom: New here? Create an account */}
            <div className="text-center pt-3">
              <p className="text-[12.5px] text-[#718096]">
                New here?{' '}
                <button
                  type="button"
                  onClick={onCreateAccount}
                  className="font-medium text-[#006ee6] hover:text-[#0055b8] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </div>

          </form>

        </div>
      </section>

    </div>
  );
}
