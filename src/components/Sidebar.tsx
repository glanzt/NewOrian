import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Zap, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOPICS } from '../types';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: Home, label: 'בית' },
  { path: '/daily', icon: Zap, label: 'תרגול יומי' },
  { path: '/lessons', icon: BookOpen, label: 'שיעורים' },
  { path: '/progress', icon: BarChart3, label: 'התקדמות' },
  { path: '/rewards', icon: Trophy, label: 'פרסים' },
];

const topicColorClasses: Record<string, { bg: string; fill: string; text: string }> = {
  reading: { 
    bg: 'bg-reading-100', 
    fill: 'bg-gradient-to-l from-reading-500 to-reading-400',
    text: 'text-reading-700'
  },
  comprehension: { 
    bg: 'bg-comprehension-100', 
    fill: 'bg-gradient-to-l from-comprehension-500 to-comprehension-400',
    text: 'text-comprehension-700'
  },
  writing: { 
    bg: 'bg-writing-100', 
    fill: 'bg-gradient-to-l from-writing-500 to-writing-400',
    text: 'text-writing-700'
  },
  vocabulary: { 
    bg: 'bg-vocabulary-100', 
    fill: 'bg-gradient-to-l from-vocabulary-500 to-vocabulary-400',
    text: 'text-vocabulary-700'
  },
};

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-writing-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-sand-400" />;
}

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, userProgress, getXpProgress } = useStore();

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
            {/* Logo/Title */}
            <div className="p-6 pt-16">
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

            {/* Topic Progress */}
            <div className="px-4 pb-6">
              <h3 className="text-sm font-semibold text-night-800/60 px-4 mb-3">
                התקדמות לפי מסלול
              </h3>
              
              {TOPICS.map((topic) => {
                const progress = userProgress.topics[topic.id];
                const xpProgress = getXpProgress(progress.xp);
                const colors = topicColorClasses[topic.id];

                return (
                  <div
                    key={topic.id}
                    className="p-3 rounded-2xl hover:bg-sand-50 transition-colors mb-2"
                  >
                    {/* Topic header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{topic.icon}</span>
                        <span className="font-medium text-night-900 text-sm">
                          {topic.nameHe}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-xs font-bold', colors.text)}>
                          רמה {progress.level}
                        </span>
                        <TrendIcon trend={progress.weeklyTrend} />
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className={clsx('h-2.5 rounded-full overflow-hidden', colors.bg)}>
                      <motion.div
                        className={clsx('h-full rounded-full', colors.fill)}
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>

                    {/* XP info */}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-night-800/50">
                        {Math.round(xpProgress.current)} / {xpProgress.required} XP
                      </span>
                      <span className="text-xs text-night-800/50">
                        {progress.practicedCount} תרגילים
                      </span>
                    </div>
                  </div>
                );
              })}
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

