import { motion } from 'framer-motion';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

interface Badge {
  id: string;
  nameHe: string;
  descriptionHe: string;
  icon: string;
  color: string;
  requirement: string;
  category: 'streak' | 'level' | 'accuracy' | 'completion' | 'special';
}

const allBadges: Badge[] = [
  // Streak badges
  { id: 'streak-3', nameHe: 'רצף של 3', descriptionHe: '3 ימים רצופים של תרגול', icon: '🔥', color: 'from-vocabulary-400 to-vocabulary-600', requirement: '3 ימים רצופים', category: 'streak' },
  { id: 'streak-7', nameHe: 'שבוע מושלם', descriptionHe: 'שבוע שלם של תרגול יומי', icon: '⭐', color: 'from-vocabulary-400 to-red-500', requirement: '7 ימים רצופים', category: 'streak' },
  { id: 'streak-30', nameHe: 'אלוף החודש', descriptionHe: 'חודש שלם של תרגול יומי!', icon: '👑', color: 'from-yellow-400 to-vocabulary-500', requirement: '30 ימים רצופים', category: 'streak' },

  // Level badges
  { id: 'level-reading-5', nameHe: 'קורא מתקדם', descriptionHe: 'הגעת לרמה 5 בקריאה', icon: '📖', color: 'from-reading-400 to-reading-600', requirement: 'רמה 5 בקריאה', category: 'level' },
  { id: 'level-comprehension-5', nameHe: 'מבין טקסט', descriptionHe: 'הגעת לרמה 5 בהבנת הנקרא', icon: '🔍', color: 'from-comprehension-400 to-comprehension-600', requirement: 'רמה 5 בהבנה', category: 'level' },
  { id: 'level-writing-5', nameHe: 'כותב מתחיל', descriptionHe: 'הגעת לרמה 5 בכתיבה', icon: '✏️', color: 'from-writing-400 to-writing-600', requirement: 'רמה 5 בכתיבה', category: 'level' },
  { id: 'level-vocabulary-5', nameHe: 'אוצר מילים עשיר', descriptionHe: 'הגעת לרמה 5 באוצר מילים', icon: '💎', color: 'from-vocabulary-400 to-vocabulary-600', requirement: 'רמה 5 באוצר מילים', category: 'level' },

  // Completion badges
  { id: 'first-lesson', nameHe: 'צעד ראשון', descriptionHe: 'סיימת את השיעור הראשון', icon: '🎯', color: 'from-reading-400 to-comprehension-500', requirement: 'שיעור ראשון', category: 'completion' },
  { id: '10-lessons', nameHe: '10 שיעורים', descriptionHe: 'סיימת 10 שיעורים', icon: '🏆', color: 'from-writing-400 to-comprehension-500', requirement: '10 שיעורים', category: 'completion' },
  { id: 'all-reading', nameHe: 'מסלול קריאה', descriptionHe: 'סיימת את כל שיעורי הקריאה', icon: '📚', color: 'from-reading-400 to-reading-700', requirement: 'כל שיעורי הקריאה', category: 'completion' },

  // Accuracy badges
  { id: 'perfect-lesson', nameHe: 'שיעור מושלם', descriptionHe: '100% דיוק בשיעור', icon: '💯', color: 'from-writing-400 to-writing-600', requirement: '100% בשיעור', category: 'accuracy' },
  { id: 'streak-5-correct', nameHe: 'רצף מושלם', descriptionHe: '5 תשובות נכונות ברצף', icon: '✨', color: 'from-yellow-400 to-vocabulary-500', requirement: '5 נכונות ברצף', category: 'accuracy' },

  // Special badges
  { id: 'early-bird', nameHe: 'ציפור מוקדמת', descriptionHe: 'תרגלת לפני 8 בבוקר', icon: '🌅', color: 'from-blue-400 to-comprehension-500', requirement: 'תרגול בוקר', category: 'special' },
  { id: 'night-owl', nameHe: 'ינשוף לילה', descriptionHe: 'תרגלת אחרי 8 בערב', icon: '🦉', color: 'from-purple-600 to-night-800', requirement: 'תרגול ערב', category: 'special' },
];

const categoryLabels = {
  streak: 'רצפים',
  level: 'רמות',
  completion: 'השלמה',
  accuracy: 'דיוק',
  special: 'מיוחדים',
};

export default function Rewards() {
  const { userProgress } = useStore();

  // Check which badges are earned
  const earnedBadgeIds = new Set(userProgress.earnedBadges);
  
  // Auto-check some basic badges
  if (userProgress.dailyPracticeStreak >= 3) earnedBadgeIds.add('streak-3');
  if (userProgress.dailyPracticeStreak >= 7) earnedBadgeIds.add('streak-7');
  if (userProgress.completedLessons.length >= 1) earnedBadgeIds.add('first-lesson');
  if (userProgress.completedLessons.length >= 10) earnedBadgeIds.add('10-lessons');
  if (userProgress.topics.reading.level >= 5) earnedBadgeIds.add('level-reading-5');
  if (userProgress.topics.comprehension.level >= 5) earnedBadgeIds.add('level-comprehension-5');
  if (userProgress.topics.writing.level >= 5) earnedBadgeIds.add('level-writing-5');
  if (userProgress.topics.vocabulary.level >= 5) earnedBadgeIds.add('level-vocabulary-5');

  const earnedCount = earnedBadgeIds.size;
  const totalCount = allBadges.length;

  // Group badges by category
  const badgesByCategory = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-night-900 mb-1">פרסים ותגים</h1>
        <p className="text-night-800/60">אספת {earnedCount} מתוך {totalCount} תגים</p>
      </div>

      {/* Overall progress */}
      <motion.div 
        className="bg-gradient-to-br from-vocabulary-500 to-vocabulary-700 rounded-3xl p-6 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">אוסף התגים שלך</h2>
            <p className="text-white/80">{earnedCount} תגים נאספו • {totalCount - earnedCount} עוד לגלות</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Badges by category */}
      {Object.entries(badgesByCategory).map(([category, badges], categoryIndex) => (
        <motion.div 
          key={category}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + categoryIndex * 0.1 }}
        >
          <h2 className="text-xl font-bold text-night-900 mb-4">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              
              return (
                <motion.div
                  key={badge.id}
                  className={clsx(
                    'relative rounded-2xl p-4 text-center transition-all',
                    isEarned 
                      ? 'bg-white shadow-card hover:shadow-lg'
                      : 'bg-sand-100 opacity-60'
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + categoryIndex * 0.1 + index * 0.05 }}
                  whileHover={isEarned ? { scale: 1.05 } : {}}
                >
                  {/* Badge icon */}
                  <div className={clsx(
                    'w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center',
                    isEarned 
                      ? `bg-gradient-to-br ${badge.color} shadow-soft`
                      : 'bg-sand-200'
                  )}>
                    {isEarned ? (
                      <span className="text-3xl">{badge.icon}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-sand-400" />
                    )}
                  </div>

                  {/* Badge info */}
                  <h3 className={clsx(
                    'font-bold mb-1',
                    isEarned ? 'text-night-900' : 'text-night-800/50'
                  )}>
                    {badge.nameHe}
                  </h3>
                  <p className={clsx(
                    'text-xs',
                    isEarned ? 'text-night-800/60' : 'text-night-800/40'
                  )}>
                    {isEarned ? badge.descriptionHe : badge.requirement}
                  </p>

                  {/* Earned checkmark */}
                  {isEarned && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-writing-500 rounded-full flex items-center justify-center shadow-soft">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Encouragement */}
      {earnedCount < totalCount && (
        <motion.div 
          className="bg-reading-50 border border-reading-200 rounded-2xl p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-reading-800">
            💡 המשך לתרגל כדי לפתוח עוד תגים!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

