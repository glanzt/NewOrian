import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, Zap, Award, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOPICS, type TopicId } from '../types';
import clsx from 'clsx';

const topicColors: Record<TopicId, { bg: string; fill: string; text: string; border: string }> = {
  reading: { 
    bg: 'bg-reading-100', 
    fill: 'bg-reading-500',
    text: 'text-reading-700',
    border: 'border-reading-200'
  },
  comprehension: { 
    bg: 'bg-comprehension-100', 
    fill: 'bg-comprehension-500',
    text: 'text-comprehension-700',
    border: 'border-comprehension-200'
  },
  writing: { 
    bg: 'bg-writing-100', 
    fill: 'bg-writing-500',
    text: 'text-writing-700',
    border: 'border-writing-200'
  },
  vocabulary: { 
    bg: 'bg-vocabulary-100', 
    fill: 'bg-vocabulary-500',
    text: 'text-vocabulary-700',
    border: 'border-vocabulary-200'
  },
};

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-5 h-5 text-writing-500" />;
  if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-500" />;
  return <Minus className="w-5 h-5 text-sand-400" />;
}

const trendLabels = {
  up: 'במגמת שיפור',
  down: 'צריך תרגול',
  stable: 'יציב'
};

export default function Progress() {
  const { userProgress, getXpProgress } = useStore();

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-night-900 mb-1">התקדמות</h1>
        <p className="text-night-800/60">צפה בשיפור שלך לאורך זמן</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-white rounded-2xl p-5 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-10 h-10 bg-reading-100 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-reading-600" />
          </div>
          <p className="text-3xl font-bold text-night-900">{Math.round(userProgress.totalXp)}</p>
          <p className="text-night-800/60 text-sm">סה״כ XP</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-5 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="w-10 h-10 bg-vocabulary-100 rounded-xl flex items-center justify-center mb-3">
            <span className="text-xl">🔥</span>
          </div>
          <p className="text-3xl font-bold text-night-900">{userProgress.dailyPracticeStreak}</p>
          <p className="text-night-800/60 text-sm">רצף יומי</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-5 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-10 h-10 bg-comprehension-100 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-comprehension-600" />
          </div>
          <p className="text-3xl font-bold text-night-900">{userProgress.completedLessons.length}</p>
          <p className="text-night-800/60 text-sm">שיעורים הושלמו</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-5 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="w-10 h-10 bg-writing-100 rounded-xl flex items-center justify-center mb-3">
            <Award className="w-5 h-5 text-writing-600" />
          </div>
          <p className="text-3xl font-bold text-night-900">{userProgress.earnedBadges.length}</p>
          <p className="text-night-800/60 text-sm">תגים נאספו</p>
        </motion.div>
      </div>

      {/* Topic progress cards */}
      <h2 className="text-xl font-bold text-night-900 mb-4">התקדמות לפי מסלול</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {TOPICS.map((topic, index) => {
          const progress = userProgress.topics[topic.id];
          const xpProgress = getXpProgress(progress.xp);
          const colors = topicColors[topic.id];

          return (
            <motion.div
              key={topic.id}
              className={clsx('bg-white rounded-3xl p-6 shadow-soft border', colors.border)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', colors.bg)}>
                    <span className="text-2xl">{topic.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-night-900">{topic.nameHe}</h3>
                    <p className={clsx('text-sm font-semibold', colors.text)}>רמה {progress.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon trend={progress.weeklyTrend} />
                  <span className="text-sm text-night-800/60">
                    {trendLabels[progress.weeklyTrend]}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className={clsx('h-4 rounded-full overflow-hidden mb-4', colors.bg)}>
                <motion.div
                  className={clsx('h-full rounded-full', colors.fill)}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={clsx('rounded-xl p-2', colors.bg)}>
                  <p className={clsx('font-bold text-lg', colors.text)}>
                    {Math.round(progress.xp)}
                  </p>
                  <p className="text-xs text-night-800/60">XP</p>
                </div>
                <div className={clsx('rounded-xl p-2', colors.bg)}>
                  <p className={clsx('font-bold text-lg', colors.text)}>
                    {progress.practicedCount}
                  </p>
                  <p className="text-xs text-night-800/60">תרגילים</p>
                </div>
                <div className={clsx('rounded-xl p-2', colors.bg)}>
                  <p className={clsx('font-bold text-lg', colors.text)}>
                    {progress.bestStreak}
                  </p>
                  <p className="text-xs text-night-800/60">רצף שיא</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent activity */}
      <h2 className="text-xl font-bold text-night-900 mb-4">פעילות אחרונה</h2>
      <div className="bg-white rounded-3xl p-6 shadow-soft">
        <div className="flex items-center gap-3 text-night-800/60">
          <Calendar className="w-5 h-5" />
          <span>
            {userProgress.lastDailyPractice 
              ? `תרגול אחרון: ${new Date(userProgress.lastDailyPractice).toLocaleDateString('he-IL')}`
              : 'עדיין לא התחלת לתרגל'}
          </span>
        </div>
        
        {/* Placeholder for activity chart */}
        <div className="mt-6 h-32 bg-sand-100 rounded-2xl flex items-center justify-center text-night-800/40">
          גרף פעילות שבועי (בקרוב)
        </div>
      </div>
    </motion.div>
  );
}

