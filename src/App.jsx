import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import SignUpStep1 from './components/SignUpStep1';
import SignUpProgramSelection from './components/SignUpProgramSelection';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import StudentDashboard from './components/StudentDashboard';
import CoursesPage from './components/CoursesPage';
import LiveClassesPage from './components/LiveClassesPage';
import PracticePage from './components/PracticePage';
import ReadinessAssessmentsPage from './components/ReadinessAssessmentsPage';
import MySpaceProfilePage from './components/MySpaceProfilePage';
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
  const getRouteFromHash = () => {
    // Clean hash string: remove #, #/, query params, leading/trailing slashes and spaces
    const cleanHash = window.location.hash.split('?')[0].replace(/^#\/?/, '').trim().toLowerCase();

    // Direct match or normalize aliases
    if (
      cleanHash === 'profile' || 
      cleanHash === 'myspace' || 
      cleanHash === 'my-space'
    ) {
      return 'profile';
    }
    if (
      cleanHash === 'readiness-assessments' || 
      cleanHash === 'readiness-assessment' || 
      cleanHash === 'readiness' || 
      cleanHash === 'assessment' ||
      cleanHash === 'readinessassessments'
    ) {
      return 'readiness-assessments';
    }
    if (cleanHash === 'practice' || cleanHash === 'practise' || cleanHash === 'self-assessment') {
      return 'practice';
    }
    if (cleanHash === 'live-classes' || cleanHash === 'liveclasses' || cleanHash === 'live_classes' || cleanHash === 'live') {
      return 'live-classes';
    }
    if (cleanHash === 'courses' || cleanHash === 'learn') {
      return 'courses';
    }
    if (cleanHash === 'signup-program' || cleanHash === 'your-program' || cleanHash === 'select-program') {
      return 'signup-program';
    }
    if (['signup', 'login', 'forgot-password', 'dashboard'].includes(cleanHash)) {
      return cleanHash;
    }

    // Default to 'welcome' only when no route or root route is specified
    return 'welcome';
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash);
  const [signUpFormData, setSignUpFormData] = useState(null);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.location.hash = `/${route}`;
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
      window.location.hash = '/welcome';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
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
            navigateTo('signup-program');
          }}
        />
      )}

      {/* 2b. Sign Up Program Selection (Your Program) */}
      {currentRoute === 'signup-program' && (
        <SignUpProgramSelection
          initialProgram={signUpFormData?.program || 'NCLEX-RN'}
          onBack={() => navigateTo('signup')}
          onComplete={(selectedProgram) => {
            const updatedData = { ...(signUpFormData || {}), program: selectedProgram };
            setSignUpFormData(updatedData);
            demoAuthService.registerUserWithProgram(updatedData, selectedProgram);
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
          onLogout={() => {
            demoAuthService.logout();
            navigateTo('welcome');
          }}
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



