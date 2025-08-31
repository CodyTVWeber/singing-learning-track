
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProfileSelectPage } from './pages/ProfileSelectPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { LessonPage } from './pages/LessonPage';
import { ComponentShowcase } from './pages/ComponentShowcase';
import { DevNavigation } from './components/DevNavigation';
import './theme/globalStyles.css';
import { InstallPrompt } from './components/InstallPrompt';
import { setLocale } from './i18n';

function App() {
  // Initialize locale (later can be user preference)
  setLocale('en');
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/profiles" element={<ProfileSelectPage />} />
          <Route path="/skill-tree" element={<SkillTreePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
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