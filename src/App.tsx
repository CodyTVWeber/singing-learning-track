import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { UserProvider, useUser } from './contexts/UserContext';
import { Header } from './components/Header';
import { UserOnboarding } from './components/UserOnboarding';
import { Home } from './pages/Home';
import { Lessons } from './pages/Lessons';
import { LessonView } from './pages/LessonView';
import { Practice } from './pages/Practice';
import { Progress } from './pages/Progress';

function AppContent() {
  const { user, createUser, isLoading } = useUser();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Loading...</h2>
    </div>;
  }

  return (
    <>
      <GlobalStyles />
      {!user && <UserOnboarding onComplete={createUser} />}
      <div className="App">
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:lessonId" element={<LessonView />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
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