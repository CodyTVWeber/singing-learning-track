
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { LessonPage } from './pages/LessonPage';
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;