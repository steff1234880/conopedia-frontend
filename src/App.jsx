import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import SignUpStep1 from './components/SignUpStep1';
import SignUpProgramSelection from './components/SignUpProgramSelection';
import RegistrationCompletePage from './components/RegistrationCompletePage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import StudentDashboard from './components/StudentDashboard';
import CoursesPage from './components/CoursesPage';
import LiveClassesPage from './components/LiveClassesPage';
import PracticePage from './components/PracticePage';
import ReadinessAssessmentsPage from './components/ReadinessAssessmentsPage';
import MySpaceProfilePage from './components/MySpaceProfilePage';
import ExamIntroductionPage from './components/ExamIntroductionPage';
import AssessmentQuestionsPage from './components/AssessmentQuestionsPage';
import { demoAuthService } from './services/authService';

/**
 * Canopedia Application Router
 * 
 * Supports:
 * - 'welcome': Public Initial Landing page
 * - 'signup': Step 1 of 3 (Personal Details)
 * - 'login': Sign in portal
 * - 'forgot-password': Password recovery flow
 * - 'dashboard': Student Dashboard
 * - 'courses': Available Courses page
 * - 'live-classes': Live Classes page
 * - 'practice': Practice & Assessment page
 */
export default function App() {
  const resolveRoute = () => {
    // Support both hash routes (#/your-program) and pathname routes (/your-program)
    const rawHash = window.location.hash.split('?')[0].replace(/^#\/?/, '').trim().toLowerCase();
    const rawPath = window.location.pathname.split('?')[0].replace(/^\/+|\/+$/g, '').trim().toLowerCase();
    const cleanRoute = rawHash || rawPath;

    // Direct match or normalize aliases
    if (
      cleanRoute === 'profile' || 
      cleanRoute === 'myspace' || 
      cleanRoute === 'my-space'
    ) {
      return 'profile';
    }
    if (
      cleanRoute === 'exam-introduction' ||
      cleanRoute === 'exam-intro' ||
      cleanRoute === 'examintroduction' ||
      cleanRoute === 'assessment-introduction' ||
      cleanRoute === 'assessment-intro' ||
      cleanRoute === 'start-assessment' ||
      cleanRoute === 'lesson-assessment' ||
      cleanRoute === 'assessment-instructions'
    ) {
      return 'exam-introduction';
    }
    if (
      cleanRoute === 'assessment-questions' ||
      cleanRoute === 'exam-questions' ||
      cleanRoute === 'assessment-exam' ||
      cleanRoute === 'exam'
    ) {
      return 'assessment-questions';
    }
    if (
      cleanRoute === 'readiness-assessments' || 
      cleanRoute === 'readiness-assessment' || 
      cleanRoute === 'readiness' || 
      cleanRoute === 'assessment' ||
      cleanRoute === 'readinessassessments'
    ) {
      return 'readiness-assessments';
    }
    if (cleanRoute === 'practice' || cleanRoute === 'practise' || cleanRoute === 'self-assessment') {
      return 'practice';
    }
    if (cleanRoute === 'live-classes' || cleanRoute === 'liveclasses' || cleanRoute === 'live_classes' || cleanRoute === 'live') {
      return 'live-classes';
    }
    if (cleanRoute === 'courses' || cleanRoute === 'learn') {
      return 'courses';
    }
    if (
      cleanRoute === 'registration-complete' ||
      cleanRoute === 'registrationcomplete' ||
      cleanRoute === 'signup-complete' ||
      cleanRoute === 'onboarding-complete' ||
      cleanRoute === 'signup/complete'
    ) {
      return 'registration-complete';
    }
    if (
      cleanRoute === 'your-program' ||
      cleanRoute === 'yourprogram' ||
      cleanRoute === 'signup-program' ||
      cleanRoute === 'select-program' ||
      cleanRoute === 'program-selection' ||
      cleanRoute === 'program' ||
      cleanRoute === 'signup/program' ||
      cleanRoute === 'onboarding/program'
    ) {
      return 'your-program';
    }
    if (cleanRoute === 'signup' || cleanRoute === 'sign-up' || cleanRoute === 'register') {
      return 'signup';
    }
    if (['login', 'forgot-password', 'dashboard'].includes(cleanRoute)) {
      return cleanRoute;
    }

    // Default to 'welcome' only when no route or root route is specified
    return 'welcome';
  };

  const [currentRoute, setCurrentRoute] = useState(resolveRoute);
  const [activeAssessmentContext, setActiveAssessmentContext] = useState(() => {
    try {
      const saved = sessionStorage.getItem('canopedia_active_assessment');
      return saved ? JSON.parse(saved) : { title: 'NCLEX-RN Clinical Assessment', returnRoute: 'courses' };
    } catch {
      return { title: 'NCLEX-RN Clinical Assessment', returnRoute: 'courses' };
    }
  });
  const [signUpFormData, setSignUpFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('canopedia_signup_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const navigateTo = (route) => {
    setCurrentRoute(route);
    const targetHash = `#/${route}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = `/${route}`;
    }
    window.scrollTo(0, 0);
  };

  const handleOpenExamIntroduction = (context = {}) => {
    const nextContext = {
      title: context.title || 'NCLEX-RN Clinical Assessment',
      returnRoute: context.returnRoute || currentRoute || 'courses',
    };
    setActiveAssessmentContext(nextContext);
    try {
      sessionStorage.setItem('canopedia_active_assessment', JSON.stringify(nextContext));
    } catch {
      // ignore storage errors
    }
    navigateTo('exam-introduction');
  };

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const resolved = resolveRoute();
      setCurrentRoute(resolved);
    };

    window.addEventListener('hashchange', syncRouteFromLocation);
    window.addEventListener('popstate', syncRouteFromLocation);

    const initialResolved = resolveRoute();
    if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
      window.history.replaceState(null, '', `#/${initialResolved}`);
    }

    return () => {
      window.removeEventListener('hashchange', syncRouteFromLocation);
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, []);

  return (
    <main>
      {/* 1. Welcome Page */}
      {currentRoute === 'welcome' && (
        <WelcomePage
          onGetStarted={() => navigateTo('signup')}
          onLogin={() => navigateTo('login')}
        />
      )}

      {/* 2. Sign Up Page (Step 1: Personal Details) */}
      {currentRoute === 'signup' && (
        <SignUpStep1
          initialData={signUpFormData}
          onBack={() => navigateTo('welcome')}
          onContinue={(data) => {
            setSignUpFormData(data);
            try {
              sessionStorage.setItem('canopedia_signup_draft', JSON.stringify(data));
            } catch {
              // ignore storage errors
            }
            navigateTo('your-program');
          }}
        />
      )}

      {/* 2b. Sign Up Program Selection (Your Program) */}
      {currentRoute === 'your-program' && (
        <SignUpProgramSelection
          initialProgram={signUpFormData?.program || 'NCLEX-RN'}
          onBack={() => navigateTo('signup')}
          onComplete={(selectedProgram) => {
            const updatedData = { ...(signUpFormData || {}), program: selectedProgram };
            setSignUpFormData(updatedData);
            try {
              sessionStorage.removeItem('canopedia_signup_draft');
            } catch {
              // ignore storage errors
            }
            demoAuthService.registerUserWithProgram(updatedData, selectedProgram);
            navigateTo('registration-complete');
          }}
        />
      )}

      {/* 2c. Registration Complete Page */}
      {currentRoute === 'registration-complete' && (
        <RegistrationCompletePage
          onBack={() => navigateTo('your-program')}
          onGoToDashboard={() => {
            navigateTo('dashboard');
          }}
        />
      )}

      {/* 3. Login Page */}
      {currentRoute === 'login' && (
        <LoginPage
          onBack={() => navigateTo('welcome')}
          onCreateAccount={() => navigateTo('signup')}
          onForgotPassword={() => navigateTo('forgot-password')}
          onLoginSuccess={() => {
            navigateTo('dashboard');
          }}
        />
      )}

      {/* 4. Forgot Password Page */}
      {currentRoute === 'forgot-password' && (
        <ForgotPasswordPage
          onBackToSignIn={() => navigateTo('login')}
          onResetCodeSent={(email) => {
            console.log('Reset code dispatched to:', email);
          }}
        />
      )}

      {/* 5. Student Dashboard */}
      {currentRoute === 'dashboard' && (
        <StudentDashboard
          onNavigateCourses={() => navigateTo('courses')}
          onNavigatePractice={() => navigateTo('practice')}
          onNavigateLiveClasses={() => navigateTo('live-classes')}
          onNavigateReadiness={() => navigateTo('readiness-assessments')}
          onNavigateProfile={() => navigateTo('profile')}
          onStartAssessment={handleOpenExamIntroduction}
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
        />
      )}

      {/* 6. Available Courses Page */}
      {currentRoute === 'courses' && (
        <CoursesPage
          onNavigateHome={() => navigateTo('dashboard')}
          onNavigatePractice={() => navigateTo('practice')}
          onNavigateLiveClasses={() => navigateTo('live-classes')}
          onStartAssessment={handleOpenExamIntroduction}
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
        />
      )}

      {/* 7. Live Classes Page */}
      {currentRoute === 'live-classes' && (
        <LiveClassesPage
          onNavigateHome={() => navigateTo('dashboard')}
          onNavigateCourses={() => navigateTo('courses')}
          onNavigatePractice={() => navigateTo('practice')}
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
        />
      )}

      {/* 8. Practice Page */}
      {currentRoute === 'practice' && (
        <PracticePage
          onNavigateHome={() => navigateTo('dashboard')}
          onNavigateCourses={() => navigateTo('courses')}
          onNavigateLiveClasses={() => navigateTo('live-classes')}
          onNavigateReadiness={() => navigateTo('readiness-assessments')}
          onStartAssessment={handleOpenExamIntroduction}
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
        />
      )}

      {/* 9. Readiness Assessments Page */}
      {currentRoute === 'readiness-assessments' && (
        <ReadinessAssessmentsPage
          onNavigateHome={() => navigateTo('dashboard')}
          onNavigateCourses={() => navigateTo('courses')}
          onNavigatePractice={() => navigateTo('practice')}
          onNavigateLiveClasses={() => navigateTo('live-classes')}
          onStartAssessment={handleOpenExamIntroduction}
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
        />
      )}

      {/* 9b. Exam Introduction Page */}
      {currentRoute === 'exam-introduction' && (
        <ExamIntroductionPage
          onStartAssessment={() => navigateTo('assessment-questions')}
          onBackToLesson={() => navigateTo(activeAssessmentContext?.returnRoute || 'courses')}
          onNavigateHome={() => navigateTo('dashboard')}
          onNavigateCourses={() => navigateTo('courses')}
          onNavigatePractice={() => navigateTo('practice')}
          onNavigateLiveClasses={() => navigateTo('live-classes')}
          onNavigateProfile={() => navigateTo('profile')}
        />
      )}

      {/* 9c. Assessment Questions Page */}
      {currentRoute === 'assessment-questions' && (
        <AssessmentQuestionsPage
          assessmentTitle={activeAssessmentContext?.title || 'NCLEX-RN Clinical Assessment'}
          onBackToLesson={() => navigateTo(activeAssessmentContext?.returnRoute || 'courses')}
          onExitToDashboard={() => navigateTo('dashboard')}
        />
      )}

      {/* 10. My Space - Profile Page */}
      {currentRoute === 'profile' && (
        <MySpaceProfilePage
          onNavigateHome={() => navigateTo('dashboard')}
          onNavigateCourses={() => navigateTo('courses')}
          onNavigatePractice={() => navigateTo('practice')}
          onNavigateLiveClasses={() => navigateTo('live-classes')}
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
        />
      )}
    </main>
  );
}



