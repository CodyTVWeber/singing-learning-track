
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
// import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { LessonPage } from './pages/LessonPage';
import { ProfileSelectPage } from './pages/ProfileSelectPage';
import { DevNavigation } from './components/DevNavigation';
import './theme/globalStyles.css';
import { InstallPrompt } from './components/InstallPrompt';
import { setLocale } from './i18n';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { ComponentShowcase } from './pages/ComponentShowcase';

function App() {
  // Initialize locale (later can be user preference)
  setLocale('en');
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProfileSelectPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/skill-tree" element={<AuthenticatedLayout><SkillTreePage /></AuthenticatedLayout>} />
          <Route path="/lesson/:lessonId" element={<AuthenticatedLayout><LessonPage /></AuthenticatedLayout>} />
          <Route path="/showcase" element={<ComponentShowcase />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <DevNavigation />
        <InstallPrompt />
      </Router>
    </AppProvider>
  );
}

export default App;