import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import IntroScreen from './pages/IntroScreen';
import Dashboard from './pages/Dashboard';
import NewsPractice from './pages/NewsPractice';
import Interests from './pages/Interests';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Routes>
      {/* Intro screen - always the starting point */}
      <Route path="/" element={<Navigate to="/intro" replace />} />
      <Route path="/intro" element={<IntroScreen />} />
      
      {/* Main app with sidebar layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/news-practice" element={<NewsPractice />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
      
      {/* Fallback - always go to intro */}
      <Route path="*" element={<Navigate to="/intro" replace />} />
    </Routes>
  );
}

export default App;

