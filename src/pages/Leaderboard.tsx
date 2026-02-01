import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

function getRankIcon(rank: number) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-lg font-bold text-night-800/60">{rank}</span>;
}

function getAvatarEmoji(name: string) {
  const emojis = ['👧', '👦', '👩', '🧒', '👱‍♀️', '👱', '🧑', '👧🏻', '👦🏻', '🧒🏽'];
  const index = name.charCodeAt(0) % emojis.length;
  return emojis[index];
}

export default function Leaderboard() {
  const { getLeaderboard, userScore, lastScoreGain, userName } = useStore();
  
  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex(p => p.isCurrentUser) + 1;

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-night-900 mb-1">לידרבורד כיתתי</h1>
        <p className="text-night-800/60">דירוג כיתה ב׳</p>
      </div>

      {/* User's current standing */}
      <motion.div 
        className="bg-gradient-to-br from-reading-500 to-comprehension-600 rounded-3xl p-6 mb-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{userName}</h2>
              <p className="text-white/80">מקום {userRank} מתוך {leaderboard.length}</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-4xl font-bold">{userScore}</p>
            <p className="text-white/80 text-sm">נקודות</p>
          </div>
        </div>
        
        {/* Last score change notification */}
        {lastScoreGain && lastScoreGain.totalChange !== 0 && (
          <motion.div 
            className="mt-4 bg-white/20 rounded-xl p-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span>שינוי אחרון:</span>
              <span className={clsx(
                'font-bold',
                lastScoreGain.totalChange > 0 ? 'text-writing-200' : 'text-red-200'
              )}>
                {lastScoreGain.totalChange > 0 ? '+' : ''}{lastScoreGain.totalChange} נקודות
              </span>
            </div>
            {lastScoreGain.oldRank !== lastScoreGain.newRank && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span>שינוי דירוג:</span>
                <span className="flex items-center gap-1">
                  {lastScoreGain.newRank < lastScoreGain.oldRank ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-writing-200" />
                      <span className="text-writing-200">עלית {lastScoreGain.oldRank - lastScoreGain.newRank} מקומות!</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-200" />
                      <span className="text-red-200">ירדת {lastScoreGain.newRank - lastScoreGain.oldRank} מקומות</span>
                    </>
                  )}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Leaderboard list */}
      <div className="bg-white rounded-3xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-sand-100">
          <h3 className="font-bold text-night-900 flex items-center gap-2">
            <Medal className="w-5 h-5 text-vocabulary-500" />
            דירוג הכיתה
          </h3>
        </div>
        
        <div className="divide-y divide-sand-100">
          {leaderboard.map((participant, index) => {
            const rank = index + 1;
            const isUser = participant.isCurrentUser;
            
            return (
              <motion.div
                key={participant.id}
                className={clsx(
                  'flex items-center gap-4 p-4 transition-colors',
                  isUser 
                    ? 'bg-reading-50 border-r-4 border-reading-500' 
                    : 'hover:bg-sand-50',
                  rank <= 3 && 'bg-gradient-to-l from-transparent to-vocabulary-50/50'
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Rank */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>
                
                {/* Avatar */}
                <div className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                  isUser 
                    ? 'bg-reading-100 ring-2 ring-reading-500' 
                    : 'bg-sand-100'
                )}>
                  {getAvatarEmoji(participant.name)}
                </div>
                
                {/* Name */}
                <div className="flex-1">
                  <p className={clsx(
                    'font-bold',
                    isUser ? 'text-reading-700' : 'text-night-900'
                  )}>
                    {participant.name}
                    {isUser && <span className="text-xs mr-2 text-reading-500">(את/ה)</span>}
                  </p>
                  {rank <= 3 && (
                    <p className="text-xs text-vocabulary-600 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {rank === 1 ? 'מוביל/ה!' : rank === 2 ? 'כמעט שם!' : 'על הפודיום!'}
                    </p>
                  )}
                </div>
                
                {/* Score */}
                <div className="text-left">
                  <p className={clsx(
                    'font-bold text-lg',
                    isUser ? 'text-reading-600' : 'text-night-900'
                  )}>
                    {participant.score}
                  </p>
                  <p className="text-xs text-night-800/50">נקודות</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scoring info */}
      <motion.div 
        className="mt-6 bg-sand-50 rounded-2xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-bold text-night-900 mb-3 text-sm">איך צוברים נקודות?</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white rounded-xl p-3">
            <p className="text-writing-600 font-bold mb-1">✅ תשובה נכונה</p>
            <p className="text-night-800/70">+10 עד +15 נקודות</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-red-500 font-bold mb-1">❌ תשובה שגויה</p>
            <p className="text-night-800/70">-3 עד -5 נקודות</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-vocabulary-600 font-bold mb-1">🔥 רצף 3 נכונות</p>
            <p className="text-night-800/70">+5 בונוס</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-comprehension-600 font-bold mb-1">💯 משחק מושלם</p>
            <p className="text-night-800/70">+20 בונוס</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
