import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { UserProvider, useUser } from './contexts/UserContext';
import { MobileHeader } from './components/MobileHeader';
import { MobileNavigation } from './components/MobileNavigation';
import { UserOnboarding } from './components/UserOnboarding';
import { Home } from './pages/Home';
import { Lessons } from './pages/Lessons';
import { LessonView } from './pages/LessonView';
import { Practice } from './pages/Practice';
import { Progress } from './pages/Progress';
import { Kookaburra } from './components/Kookaburra';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
`;

const LoadingText = styled.h2`
  color: ${props => props.theme?.colors?.text || '#3E2723'};
`;

function AppContent() {
  const { user, createUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Kookaburra mood="excited" size="large" animate />
        <LoadingText>Getting ready...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <>
      <GlobalStyles />
      {!user && <UserOnboarding onComplete={createUser} />}
      {user && (
        <div className="App">
          <MobileHeader />
          <main style={{ flex: 1, paddingBottom: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/lessons/:lessonId" element={<LessonView />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </main>
          <MobileNavigation />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;