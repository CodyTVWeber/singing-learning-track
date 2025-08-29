
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { LessonPage } from './pages/LessonPage';
import { ComponentShowcase } from './pages/ComponentShowcase';
import { DevNavigation } from './components/DevNavigation';
import './theme/globalStyles.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/skill-tree" element={<SkillTreePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/showcase" element={<ComponentShowcase />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <DevNavigation />
      </Router>
    </AppProvider>
  );
}

export default App;