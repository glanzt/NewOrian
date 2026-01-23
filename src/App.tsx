import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import IntroScreen from './pages/IntroScreen';
import Dashboard from './pages/Dashboard';
import DailyPractice from './pages/DailyPractice';
import LessonsMenu from './pages/LessonsMenu';
import LessonRunner from './pages/LessonRunner';
import Progress from './pages/Progress';
import Rewards from './pages/Rewards';

function App() {
  const { hasSeenIntro } = useStore();

  return (
    <Routes>
      {/* Intro screen - shown first if not seen */}
      <Route 
        path="/intro" 
        element={<IntroScreen />} 
      />
      
      {/* Main app with sidebar layout */}
      <Route element={<Layout />}>
        <Route 
          path="/" 
          element={hasSeenIntro ? <Dashboard /> : <Navigate to="/intro" replace />} 
        />
        <Route path="/daily" element={<DailyPractice />} />
        <Route path="/lessons" element={<LessonsMenu />} />
        <Route path="/lessons/:lessonId" element={<LessonRunner />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/rewards" element={<Rewards />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

