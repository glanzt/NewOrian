import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Heart, 
  BarChart3, 
  Trophy, 
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOPICS, type TopicId } from '../types';
import clsx from 'clsx';

// Encouraging messages based on rank (feminine for Yael)
function getEncouragement(rank: number, total: number): string {
  if (rank === 1) return 'את מובילה! 👑';
  if (rank === 2) return 'כמעט ראשונה! 🚀';
  if (rank === 3) return 'על הפודיום! 🏆';
  if (rank <= 5) return 'קרובה לפודיום! 💪';
  if (rank <= Math.ceil(total / 2)) return 'בואי נעלה! ⬆️';
  return 'בואי נעלה! 🌟';
}

const navItems = [
  { path: '/dashboard', icon: Home, label: 'בית' },
  { path: '/interests', icon: Heart, label: 'מה מעניין אותי' },
  { path: '/progress', icon: BarChart3, label: 'התקדמות' },
  { path: '/leaderboard', icon: Trophy, label: 'לידרבורד כיתתי' },
];

const topicColorClasses: Record<TopicId, { bg: string; text: string }> = {
  reading: { 
    bg: 'bg-reading-100', 
    text: 'text-reading-700',
  },
  comprehension: { 
    bg: 'bg-comprehension-100', 
    text: 'text-comprehension-700',
  },
  writing: { 
    bg: 'bg-writing-100', 
    text: 'text-writing-700',
  },
  vocabulary: { 
    bg: 'bg-vocabulary-100', 
    text: 'text-vocabulary-700',
  },
};

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, userProgress, getUserRank, getLeaderboard } = useStore();
  
  const today = new Date().toDateString();
  const userRank = getUserRank();
  const totalParticipants = getLeaderboard().length;
  const encouragement = getEncouragement(userRank, totalParticipants);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={clsx(
          'fixed top-4 z-50 p-2 rounded-full bg-white shadow-card transition-all duration-300',
          sidebarOpen ? 'left-4' : 'right-4'
        )}
        aria-label={sidebarOpen ? 'סגור תפריט' : 'פתח תפריט'}
      >
        {sidebarOpen ? (
          <ChevronRight className="w-5 h-5 text-night-800" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-night-800" />
        )}
      </button>

      {/* Overlay - click to close */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="סגור תפריט"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-card z-40 overflow-y-auto"
          >
            {/* Rank Badge - Above Profile */}
            <div className="flex justify-center pt-14 pb-2">
              <Link 
                to="/leaderboard"
                className="flex items-center gap-2 bg-gradient-to-r from-comprehension-100 to-writing-100 border border-comprehension-200 rounded-full px-3 py-1.5 hover:shadow-md transition-shadow"
              >
                <TrendingUp className="w-4 h-4 text-comprehension-600" />
                <span className="text-comprehension-700 text-sm font-medium">מקום</span>
                <span className="bg-gradient-to-r from-comprehension-500 to-writing-500 text-white font-bold px-2.5 py-0.5 rounded-full text-base shadow-sm">
                  {userRank}
                </span>
                <span className="text-comprehension-600 text-xs">
                  {encouragement}
                </span>
              </Link>
            </div>
            
            {/* Profile Picture */}
            <div className="flex justify-center pb-2">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-reading-200 shadow-lg">
                <img 
                  src="/yael-profile.png" 
                  alt="יעל"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Logo/Title */}
            <div className="px-6 pb-4 text-center">
              <h1 className="text-2xl font-bold text-night-900">
                מסע האוריינות 📚
              </h1>
              <p className="text-sm text-night-800/60 mt-1">
                כיתה ב׳
              </p>
            </div>

            {/* Navigation */}
            <nav className="px-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all duration-200',
                      isActive
                        ? 'bg-reading-100 text-reading-700'
                        : 'text-night-800/70 hover:bg-sand-100 hover:text-night-900'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="h-px bg-sand-200 mx-6 my-4" />

            {/* Topic Progress - Checklist style */}
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-night-800/60 px-2 mb-2">
                תרגול היום לפי מסלול
              </h3>
              
              <div className="space-y-1.5">
                {TOPICS.map((topic) => {
                  const progress = userProgress.topics[topic.id];
                  const colors = topicColorClasses[topic.id];
                  
                  // Check if practiced today
                  const lastPracticed = progress.lastPracticed 
                    ? new Date(progress.lastPracticed).toDateString() 
                    : null;
                  const practicedToday = lastPracticed === today;

                  return (
                    <div
                      key={topic.id}
                      className={clsx(
                        'flex items-center gap-2 p-2 rounded-xl transition-colors',
                        practicedToday ? 'bg-writing-50' : 'bg-sand-50'
                      )}
                    >
                      {/* Status icon */}
                      <div className={clsx(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                        practicedToday 
                          ? 'bg-writing-500 text-white' 
                          : 'bg-sand-200 text-sand-400'
                      )}>
                        {practicedToday ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Topic icon */}
                      <span className="text-lg">{topic.icon}</span>
                      
                      {/* Topic name */}
                      <span className={clsx(
                        'flex-1 text-sm font-medium truncate',
                        practicedToday ? 'text-night-900' : 'text-night-800/70'
                      )}>
                        {topic.nameHe}
                      </span>
                      
                      {/* Level badge */}
                      <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded', colors.bg, colors.text)}>
                        {progress.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily streak */}
            <div className="px-4 pb-6">
              <div className="bg-gradient-to-br from-vocabulary-100 to-vocabulary-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-vocabulary-800 font-bold text-lg">
                      {userProgress.dailyPracticeStreak} ימים
                    </p>
                    <p className="text-vocabulary-700/70 text-sm">
                      רצף יומי
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

