import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOPICS, type TopicId } from '../types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const topicColors: Record<TopicId, { bg: string; text: string }> = {
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

// Get last 7 days for weekly tracker
function getWeekDays() {
  const days = [];
  const dayNames = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toDateString(),
      dayName: dayNames[date.getDay()],
      isToday: i === 0,
    });
  }
  return days;
}

export default function Progress() {
  const { userProgress } = useStore();
  const navigate = useNavigate();
  
  const weekDays = getWeekDays();
  const today = new Date().toDateString();
  const lastPracticeDate = userProgress.lastDailyPractice 
    ? new Date(userProgress.lastDailyPractice).toDateString()
    : null;
  const practicedToday = lastPracticeDate === today;

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-night-900 mb-1">התקדמות</h1>
        <p className="text-night-800/60">צפה בשיפור שלך לאורך זמן</p>
      </div>

      {/* Daily Practice Tracker - TOP */}
      <motion.div 
        className={clsx(
          'rounded-2xl p-4 mb-5 shadow-soft',
          practicedToday 
            ? 'bg-gradient-to-br from-writing-100 to-writing-200' 
            : 'bg-gradient-to-br from-vocabulary-100 to-vocabulary-200'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-night-900">תרגול יומי</h2>
            <p className={clsx(
              'text-sm font-medium',
              practicedToday ? 'text-writing-700' : 'text-vocabulary-700'
            )}>
              {practicedToday ? '✅ סיימת היום!' : '⏳ עדיין לא תרגלת'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Streak info - inline */}
            <div className="flex items-center gap-1 bg-white/50 rounded-full px-3 py-1">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-bold text-night-900">
                {userProgress.dailyPracticeStreak}
              </span>
            </div>
            
            {!practicedToday && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-vocabulary-500 hover:bg-vocabulary-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
              >
                לתרגול →
              </button>
            )}
            
            {practicedToday && (
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-xl">🎉</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Weekly tracker - compact */}
        <div className="bg-white/60 rounded-xl p-3">
          <div className="flex justify-between items-center">
            {weekDays.map((day, index) => {
              const isPracticed = day.date === lastPracticeDate;
              
              return (
                <div key={index} className="flex flex-col items-center gap-0.5">
                  <span className={clsx(
                    'text-[10px] font-medium',
                    day.isToday ? 'text-night-900' : 'text-night-800/50'
                  )}>
                    {day.dayName}
                  </span>
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                    isPracticed 
                      ? 'bg-writing-500 text-white' 
                      : day.isToday 
                        ? 'bg-vocabulary-200 text-vocabulary-600 ring-2 ring-vocabulary-400'
                        : 'bg-sand-200 text-sand-400'
                  )}>
                    {isPracticed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Topic daily progress - checklist style */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-night-900">תרגול לפי מסלול</h2>
        <p className="text-xs text-night-800/50">האם תרגלת היום?</p>
      </div>
      <motion.div 
        className="bg-white rounded-2xl p-4 shadow-soft"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="space-y-3">
          {TOPICS.map((topic) => {
            const progress = userProgress.topics[topic.id];
            const colors = topicColors[topic.id];
            
            // Check if practiced today
            const lastPracticed = progress.lastPracticed 
              ? new Date(progress.lastPracticed).toDateString() 
              : null;
            const practicedTopicToday = lastPracticed === today;

            return (
              <div
                key={topic.id}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-xl transition-all',
                  practicedTopicToday ? 'bg-writing-50' : 'bg-sand-50'
                )}
              >
                {/* Status icon */}
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  practicedTopicToday 
                    ? 'bg-writing-500 text-white' 
                    : 'bg-sand-200 text-sand-400'
                )}>
                  {practicedTopicToday ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                
                {/* Topic info */}
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', colors.bg)}>
                  <span className="text-lg">{topic.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-night-900 text-sm">{topic.nameHe}</h3>
                  <p className={clsx('text-xs', practicedTopicToday ? 'text-writing-600' : 'text-night-800/50')}>
                    {practicedTopicToday ? '✓ תרגלת היום' : 'עדיין לא תרגלת'}
                  </p>
                </div>
                
                {/* Level badge */}
                <div className={clsx('px-2 py-1 rounded-lg text-xs font-semibold', colors.bg, colors.text)}>
                  רמה {progress.level}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

