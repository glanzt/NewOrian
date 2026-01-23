import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BookOpen, BarChart3, Trophy, ArrowLeft, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOPICS } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 20 }
  },
};

export default function Dashboard() {
  const { userProgress, getXpProgress } = useStore();

  // Find the topic with lowest progress for encouragement
  const lowestTopic = TOPICS.reduce((lowest, topic) => {
    const progress = userProgress.topics[topic.id];
    const lowestProgress = userProgress.topics[lowest.id];
    return progress.xp < lowestProgress.xp ? topic : lowest;
  }, TOPICS[0]);

  const lowestTopicProgress = getXpProgress(userProgress.topics[lowestTopic.id].xp);
  const itemsNeeded = Math.ceil((lowestTopicProgress.required - lowestTopicProgress.current) / 1.5);

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome header */}
      <motion.div variants={cardVariants} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-night-900 mb-2">
          שלום! 👋
        </h1>
        <p className="text-night-800/70 text-lg">
          מוכן להמשיך במסע האוריינות?
        </p>
      </motion.div>

      {/* Daily Practice - Main CTA */}
      <motion.div variants={cardVariants}>
        <Link to="/daily" className="block group">
          <div className="relative overflow-hidden bg-gradient-to-br from-reading-500 via-reading-600 to-comprehension-600 rounded-3xl p-8 shadow-card hover:shadow-lg transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    תרגול יומי
                  </h2>
                  <p className="text-white/80">
                    8 תרגילים • 5 דקות
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-8 h-8 text-white/80 group-hover:translate-x-[-8px] transition-transform" />
            </div>

            {/* Streak badge */}
            {userProgress.dailyPracticeStreak > 0 && (
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-vocabulary-300" />
                <span className="text-white font-semibold text-sm">
                  {userProgress.dailyPracticeStreak} ימים
                </span>
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Encouragement message */}
      <motion.div 
        variants={cardVariants}
        className="bg-vocabulary-50 border border-vocabulary-200 rounded-2xl p-4 mt-6"
      >
        <p className="text-vocabulary-800 text-center">
          <span className="font-semibold">💡 טיפ:</span> היום חסרים לך{' '}
          <span className="font-bold">{itemsNeeded} תרגילים</span> כדי למלא בר ב
          <span className="font-bold">{lowestTopic.nameHe}</span>!
        </p>
      </motion.div>

      {/* Secondary cards grid */}
      <motion.div 
        variants={cardVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        {/* Lessons */}
        <Link to="/lessons" className="card-interactive group">
          <div className="w-12 h-12 bg-comprehension-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-comprehension-600" />
          </div>
          <h3 className="font-bold text-night-900 text-lg mb-1">שיעורים</h3>
          <p className="text-night-800/60 text-sm">
            40 שיעורים לפי נושאים
          </p>
          <div className="mt-3 text-sm text-comprehension-600 font-medium flex items-center gap-1">
            בחר שיעור
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>

        {/* Progress */}
        <Link to="/progress" className="card-interactive group">
          <div className="w-12 h-12 bg-writing-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6 text-writing-600" />
          </div>
          <h3 className="font-bold text-night-900 text-lg mb-1">התקדמות</h3>
          <p className="text-night-800/60 text-sm">
            צפה בשיפור שלך
          </p>
          <div className="mt-3 text-sm text-writing-600 font-medium flex items-center gap-1">
            ראה סטטיסטיקות
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>

        {/* Rewards */}
        <Link to="/rewards" className="card-interactive group">
          <div className="w-12 h-12 bg-vocabulary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-vocabulary-600" />
          </div>
          <h3 className="font-bold text-night-900 text-lg mb-1">פרסים</h3>
          <p className="text-night-800/60 text-sm">
            {userProgress.earnedBadges.length} תגים נאספו
          </p>
          <div className="mt-3 text-sm text-vocabulary-600 font-medium flex items-center gap-1">
            ראה אוסף
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>
      </motion.div>

      {/* Quick stats */}
      <motion.div 
        variants={cardVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      >
        <div className="bg-white rounded-2xl p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-night-900">{Math.round(userProgress.totalXp)}</p>
          <p className="text-night-800/60 text-sm">סה״כ XP</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-night-900">{userProgress.completedLessons.length}</p>
          <p className="text-night-800/60 text-sm">שיעורים הושלמו</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-night-900">{userProgress.longestStreak}</p>
          <p className="text-night-800/60 text-sm">רצף שיא</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-night-900">{userProgress.earnedBadges.length}</p>
          <p className="text-night-800/60 text-sm">תגים</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

