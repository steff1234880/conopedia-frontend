import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, ChevronDown, Check } from 'lucide-react';
import leftLogo from '../assets/left-logo.png';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
];

export default function SignUpStep1({ initialData, onBack, onContinue }) {
  const [formData, setFormData] = useState(initialData || {
    fullName: 'Ananya Nair',
    email: 'ananya@example.com',
    countryCode: '+91',
    phone: '98765 43210',
    experience: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.countryCode) || COUNTRY_CODES[0];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onContinue) {
        onContinue(formData);
      } else {
        window.location.hash = '/your-program';
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8fafc] text-[#1e2733] select-none">
      
      {/* 
        ========================================================================
        LEFT PANEL (Canopedia Brand)
        Matches exact reference: soft aqua-sky gradient, subtle ambient spheres,
        crisp single logo, bold heading and clean footer tagline.
        ========================================================================
      */}
      <section 
        aria-label="Brand Introduction"
        className="relative w-full md:w-[41%] lg:w-[40%] xl:w-[39%] min-h-[380px] md:min-h-screen flex flex-col justify-between items-center text-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14 overflow-hidden bg-gradient-to-b from-[#8fd8fa] via-[#aee3fb] to-[#daf1fd]"
      >
        {/* Soft Ambient Floating Spheres */}
        <div 
          aria-hidden="true" 
          className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/40 blur-[2px] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-[4.5%] right-[28%] w-7 h-7 rounded-full bg-white/80 blur-[0.5px] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-[14%] -right-10 w-44 h-44 rounded-full bg-white/45 blur-[1px] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/50 blur-[2px] pointer-events-none" 
        />

        {/* Top Spacer */}
        <div className="w-full h-4 sm:h-8 z-10" />

        {/* Center Content: Single Logo + Headline */}
        <div className="z-10 flex flex-col items-center max-w-[320px] sm:max-w-xs my-auto py-4">
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
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

        {/* Bottom Tagline */}
        <footer className="z-10 mt-auto pt-6 pb-2">
          <p className="text-[11px] sm:text-[11.5px] font-medium tracking-[0.14em] text-[#4b6a80] uppercase">
            CANOPEDIA · Learn. Grow. Go beyond.
          </p>
        </footer>
      </section>

      {/* 
        ========================================================================
        RIGHT PANEL (Sign Up Form - Step 1: Personal Details)
        ========================================================================
      */}
      <section 
        aria-label="Personal Details Form"
        className="w-full md:w-[59%] lg:w-[60%] xl:w-[61%] min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-14 lg:px-20 py-10 md:py-16 bg-[#f8fafc]"
      >
        <div className="w-full max-w-[720px] mx-auto">
          
          {/* Back button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-[26px] sm:text-[30px] font-bold text-[#1e2733] tracking-tight mb-2.5">
            Your next chapter starts here.
          </h2>

          {/* Step Indicator */}
          <p className="text-[11px] sm:text-[12px] font-semibold text-[#8a99a8] tracking-[0.08em] uppercase mb-8">
            STEP 1 OF 3 · PERSONAL DETAILS
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-7">
              
              {/* Row 1, Col 1: Full name */}
              <div className="flex flex-col">
                <div className="relative rounded-2xl bg-white border border-[#e2e8f0] shadow-xs px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                  <label className="block text-[11px] font-medium text-[#718096] mb-0.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full text-[14px] font-medium text-[#1e2733] outline-hidden bg-transparent"
                  />
                </div>
                {errors.fullName && (
                  <span className="text-[11px] text-red-500 mt-1 ml-1">{errors.fullName}</span>
                )}
              </div>

              {/* Row 1, Col 2: Email address */}
              <div className="flex flex-col">
                <div className="relative rounded-2xl bg-white border border-[#e2e8f0] shadow-xs px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                  <label className="block text-[11px] font-medium text-[#718096] mb-0.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-[14px] font-medium text-[#1e2733] outline-hidden bg-transparent"
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-red-500 mt-1 ml-1">{errors.email}</span>
                )}
              </div>

              {/* Row 2, Col 1: Phone number (Flag, Code dropdown, Number) */}
              <div className="flex flex-col">
                <div className="relative rounded-2xl bg-white border border-[#e2e8f0] shadow-xs px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                  <label className="block text-[11px] font-medium text-[#718096] mb-0.5">
                    Phone number
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Country Code Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#1e2733] pr-1 py-0.5 cursor-pointer outline-hidden hover:opacity-80"
                      >
                        {/* Circular/rounded flag representation */}
                        <span className="text-base select-none inline-flex items-center justify-center">
                          {selectedCountry.flag}
                        </span>
                        <span>{selectedCountry.code}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#718096]" />
                      </button>

                      {showCountryDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setShowCountryDropdown(false)} 
                          />
                          <div className="absolute top-full left-0 mt-2 z-40 bg-white border border-[#e2e8f0] rounded-xl shadow-lg py-1.5 w-48 max-h-56 overflow-y-auto">
                            {COUNTRY_CODES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  handleChange('countryCode', c.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-[#f1f5f9] cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <span>{c.flag}</span>
                                  <span className="text-[#1e2733] font-medium">{c.country}</span>
                                </span>
                                <span className="text-[#64748b]">{c.code}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Vertical separator */}
                    <div className="w-[1px] h-4 bg-[#e2e8f0]" />

                    {/* Phone Input */}
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="98765 43210"
                      className="w-full text-[14px] font-medium text-[#1e2733] outline-hidden bg-transparent"
                    />
                  </div>
                </div>
                {errors.phone && (
                  <span className="text-[11px] text-red-500 mt-1 ml-1">{errors.phone}</span>
                )}
              </div>

              {/* Row 2, Col 2: Nursing experience */}
              <div className="flex flex-col">
                <div className="relative rounded-2xl bg-white border border-[#e2e8f0] shadow-xs px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                  <label className="block text-[11px] font-medium text-[#718096] mb-0.5">
                    Nursing experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    placeholder="Enter your experience in years (eg. 2)"
                    className="w-full text-[14px] font-normal placeholder:text-[#a0aec0] text-[#1e2733] outline-hidden bg-transparent"
                  />
                </div>
              </div>

              {/* Row 3, Col 1: Create password */}
              <div className="flex flex-col">
                <div className="relative rounded-2xl bg-white border border-[#e2e8f0] shadow-xs px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                  <label className="block text-[11px] font-medium text-[#718096] mb-0.5">
                    Create password
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Choose a secure password"
                      className="w-full text-[14px] font-normal placeholder:text-[#a0aec0] text-[#1e2733] outline-hidden bg-transparent pr-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#94a3b8] hover:text-[#475569] p-0.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <span className="text-[11px] text-red-500 mt-1 ml-1">{errors.password}</span>
                )}
              </div>

              {/* Row 3, Col 2: Confirm password */}
              <div className="flex flex-col">
                <div className="relative rounded-2xl bg-white border border-[#e2e8f0] shadow-xs px-4 pt-2.5 pb-2 transition-all focus-within:border-[#006ee6] focus-within:ring-1 focus-within:ring-[#006ee6]">
                  <label className="block text-[11px] font-medium text-[#718096] mb-0.5">
                    Confirm password
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full text-[14px] font-normal placeholder:text-[#a0aec0] text-[#1e2733] outline-hidden bg-transparent pr-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#94a3b8] hover:text-[#475569] p-0.5 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <span className="text-[11px] text-red-500 mt-1 ml-1">{errors.confirmPassword}</span>
                )}
              </div>

            </div>

            {/* Bottom: Full-width blue Done button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[48px] sm:h-[50px] rounded-full bg-[#006ee6] hover:bg-[#0062d0] active:bg-[#0055b8] text-white text-[14.5px] font-semibold transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Validating...</span>
                </span>
              ) : (
                'Done'
              )}
            </button>
          </form>

        </div>
      </section>

    </div>
  );
}

