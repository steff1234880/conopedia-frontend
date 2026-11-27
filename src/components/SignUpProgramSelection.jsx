import React, { useState } from 'react';
import { ChevronLeft, Check, ClipboardList, BookOpen } from 'lucide-react';
import leftLogo from '../assets/left-logo.png';
import programNclexImg from '../assets/program-nclex.png';
import programDhaImg from '../assets/program-dha.png';

const PROGRAMS = [
  {
    id: 'NCLEX-RN',
    title: 'NCLEX-RN',
    image: programNclexImg,
    description:
      'Prepare for your registered nurse exam with focused practice questions, review lessons, and a personalized study plan.',
    badges: [
      { icon: 'clipboard', label: '1,200+ practice questions' },
      { icon: 'book', label: 'Review lessons included' },
    ],
    summaryHeading: 'Best for RN licensure in the United States.',
    highlights: [
      'Realistic CAT-style simulations.',
      'Content aligned to the latest NCLEX-RN blueprint.',
      'Review lessons to reinforce weak areas.',
      'Timing guidance for each question type.',
    ],
  },
  {
    id: 'DHA',
    title: 'DHA',
    image: programDhaImg,
    description:
      'Prepare for your Dubai nursing journey with exam prep, licensing guidance, and a tailored study plan for UAE requirements.',
    badges: [
      { icon: 'clipboard', label: 'Licensing guidance' },
      { icon: 'book', label: 'UAE-focused content' },
    ],
    summaryHeading: 'Best for RN licensure in Dubai (UAE).',
    highlights: [
      'Aligned with Dubai Health Authority (DHA) exam standards.',
      'Step-by-step DataFlow and licensing guidance.',
      'Targeted UAE clinical protocols and practice tests.',
      'Personalized study plan tailored to DHA requirements.',
    ],
  },
];

export default function SignUpProgramSelection({ initialProgram = 'NCLEX-RN', onBack, onComplete }) {
  const [selectedProgram, setSelectedProgram] = useState(initialProgram || 'NCLEX-RN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeProgram = PROGRAMS.find((p) => p.id === selectedProgram) || PROGRAMS[0];

  const handleGetStarted = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onComplete) {
        onComplete(selectedProgram);
      }
    }, 250);
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
        RIGHT PANEL (Program Selection - Step 3 of 3: Your Program)
        ========================================================================
      */}
      <section
        aria-label="Your Program Selection"
        className="w-full md:w-[60%] lg:w-[60%] xl:w-[60%] min-h-screen flex flex-col justify-center px-5 sm:px-10 md:px-12 lg:px-16 py-8 md:py-10 bg-white"
      >
        <div className="w-full max-w-[560px] mx-auto">
          {/* Back Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="w-9 h-9 rounded-full bg-[#f4f7fa] hover:bg-[#e9eff5] flex items-center justify-center text-[#334155] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1e2733] tracking-tight leading-tight mb-2">
            A path that fits your goals.
          </h2>

          {/* Step Indicator */}
          <p className="text-[11px] font-medium text-[#7b8a9a] tracking-[0.06em] uppercase mb-5">
            STEP 3 OF 3 · YOUR PROGRAM
          </p>

          {/* Program Selection Cards */}
          <div
            role="radiogroup"
            aria-label="Select your nursing program"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
          >
            {PROGRAMS.map((program) => {
              const isSelected = selectedProgram === program.id;

              return (
                <div
                  key={program.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedProgram(program.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProgram(program.id);
                    }
                  }}
                  className={`rounded-2xl p-3.5 flex flex-col justify-between transition-all cursor-pointer outline-hidden ${
                    isSelected
                      ? 'bg-white border-[1.75px] border-[#0066cc] shadow-[0_6px_20px_rgba(0,102,204,0.08)]'
                      : 'bg-white border border-[#e6ecf2] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div>
                    {/* Illustration Banner */}
                    <div className="w-full h-[92px] rounded-xl overflow-hidden bg-[#d5e3ec] mb-3.5">
                      <img
                        src={program.image}
                        alt={`${program.title} illustration`}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    </div>

                    {/* Card Title Row with Radio Indicator & Selected Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-[#0066cc] flex items-center justify-center text-white shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-[#d0d9e3] bg-white shrink-0" />
                        )}
                        <span className="text-[14.5px] font-bold text-[#1e2733]">
                          {program.title}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#e6f1fc] text-[#0066cc] text-[10.5px] font-semibold">
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11.5px] leading-[1.52] text-[#64748b] mb-4 pl-7">
                      {program.description}
                    </p>
                  </div>

                  {/* Feature Pill Badges */}
                  <div className="flex flex-col items-start gap-1.5 mt-auto">
                    {program.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-medium ${
                          isSelected
                            ? 'bg-[#ebf4fd] text-[#005bb5]'
                            : 'bg-[#f3f6f9] text-[#334155]'
                        }`}
                      >
                        {badge.icon === 'clipboard' ? (
                          <ClipboardList className="w-3 h-3 shrink-0" />
                        ) : (
                          <BookOpen className="w-3 h-3 shrink-0" />
                        )}
                        <span>{badge.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Program Summary Box */}
          <div className="w-full rounded-2xl bg-[#f5f7fa] px-4 py-3.5 mb-5">
            <h3 className="text-[11.5px] font-bold text-[#1e2733] mb-2">
              {activeProgram.summaryHeading}
            </h3>
            <ul className="space-y-1.5">
              {activeProgram.highlights.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[11px] text-[#64748b]">
                  <Check className="w-3.5 h-3.5 text-[#0066cc] shrink-0 stroke-[2.2]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary CTA: Get started */}
          <button
            type="button"
            onClick={handleGetStarted}
            disabled={isSubmitting}
            className="w-full h-[46px] rounded-full bg-[#0066cc] hover:bg-[#005bb8] active:bg-[#004f9e] text-white text-[13.5px] font-semibold transition-all duration-150 shadow-xs active:scale-[0.99] flex items-center justify-center cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
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
                <span>Saving...</span>
              </span>
            ) : (
              'Get started'
            )}
          </button>

          {/* Footer Note */}
          <p className="text-center text-[11px] text-[#7b8a9a] mt-3.5">
            You can change your program later from your dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}
