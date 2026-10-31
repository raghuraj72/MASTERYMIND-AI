import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CinematicIntro } from './components/CinematicIntro';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { PracticeWorkspace } from './pages/PracticeWorkspace';
import { ConceptGraphPage } from './pages/ConceptGraphPage';
import { RevisionPlannerPage } from './pages/RevisionPlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ClassAnalyticsPage } from './pages/ClassAnalyticsPage';
import { MisconceptionsPage } from './pages/MisconceptionsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user, isTeacher, isStudent } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [practiceConceptCode, setPracticeConceptCode] = useState<string | undefined>(undefined);

  // Check if intro should be shown on initial session visit
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const dismissed = localStorage.getItem('masterymind_intro_dismissed');
      const seenSession = sessionStorage.getItem('masterymind_intro_seen');
      return !dismissed && !seenSession;
    } catch {
      return false;
    }
  });

  // Handle intro completion
  const handleIntroComplete = (target: 'start' | 'how-it-works') => {
    setShowIntro(false);
    if (target === 'start') {
      if (user) {
        setCurrentTab(isTeacher ? 'teacher-dashboard' : 'student-dashboard');
      } else {
        setAuthRole('student');
        setCurrentTab('auth');
      }
    } else {
      setCurrentTab('landing');
    }
  };

  // If cinematic intro is active
  if (showIntro) {
    return (
      <CinematicIntro
        onStart={() => handleIntroComplete('start')}
        onExploreHowItWorks={() => handleIntroComplete('how-it-works')}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  // If user is not logged in
  if (!user) {
    if (currentTab === 'auth') {
      return (
        <AuthPage
          initialRole={authRole}
          onSuccess={(role) => {
            if (role === 'teacher') {
              setCurrentTab('teacher-dashboard');
            } else {
              setCurrentTab('student-dashboard');
            }
          }}
        />
      );
    }
    return (
      <LandingPage
        onStart={() => {
          setAuthRole('student');
          setCurrentTab('auth');
        }}
        onExploreDemo={(role) => {
          setAuthRole(role);
          setCurrentTab('auth');
        }}
        onWatchIntro={() => setShowIntro(true)}
      />
    );
  }

  const handlePracticeConcept = (conceptCode: string) => {
    setPracticeConceptCode(conceptCode);
    setCurrentTab('practice');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onReopenIntro={() => setShowIntro(true)}
      />

      <main className="flex-1">
        {/* Student Views */}
        {currentTab === 'student-dashboard' && (
          <StudentDashboard
            onNavigate={setCurrentTab}
            onPracticeConcept={handlePracticeConcept}
          />
        )}
        {currentTab === 'practice' && (
          <PracticeWorkspace
            initialConceptCode={practiceConceptCode}
            onNavigateToGraph={() => setCurrentTab('concept-graph')}
          />
        )}
        {currentTab === 'concept-graph' && (
          <ConceptGraphPage onPracticeConcept={handlePracticeConcept} />
        )}
        {currentTab === 'revision' && <RevisionPlannerPage />}
        {currentTab === 'diagnostic' && (
          <DiagnosticPage onComplete={() => setCurrentTab('student-dashboard')} />
        )}
        {currentTab === 'history' && <HistoryPage />}
        {currentTab === 'onboarding' && (
          <OnboardingPage onComplete={() => setCurrentTab('diagnostic')} />
        )}

        {/* Teacher Views */}
        {currentTab === 'teacher-dashboard' && (
          <TeacherDashboard onNavigate={setCurrentTab} />
        )}
        {currentTab === 'class-analytics' && <ClassAnalyticsPage />}
        {currentTab === 'misconceptions' && <MisconceptionsPage />}

        {/* Universal Settings */}
        {currentTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
