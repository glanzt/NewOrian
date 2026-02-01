import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Zap, Trophy, Home, Newspaper, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateNewsQuestions } from '../services/newsQuestionsService';
import GameRenderer from '../components/games/GameRenderer';
import Confetti from '../components/ui/Confetti';
import ReadAloudButton from '../components/ui/ReadAloudButton';
import type { NewsItem } from '../types/news';
import { categoryLabels } from '../types/news';
import clsx from 'clsx';

export default function NewsPractice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSession, startSession, answerItem, nextItem, lastScoreGain, clearLastScoreGain } = useStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Get news item from location state
  const newsItem = location.state?.newsItem as NewsItem | undefined;

  // Start session on mount - ALWAYS start fresh for new article
  useEffect(() => {
    if (newsItem) {
      // Always generate new questions for this specific article
      const questions = generateNewsQuestions(newsItem);
      // Use newsItem.id as lessonId to identify this specific article's session
      startSession('daily', questions, `news-${newsItem.id}`);
    }
  }, [newsItem?.id]); // Re-run when article ID changes

  // Reset session complete state when component mounts
  useEffect(() => {
    setSessionComplete(false);
  }, []);

  // Check for session completion
  useEffect(() => {
    if (currentSession?.completedAt && !sessionComplete) {
      setShowConfetti(true);
      setSessionComplete(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentSession?.completedAt, sessionComplete]);

  // No news item - redirect back
  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <Newspaper className="w-16 h-16 mx-auto text-night-800/30 mb-4" />
        <p className="text-night-800/60 mb-4">לא נבחרה כתבה לתרגול</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          חזור לדף הבית
        </button>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-night-800/50">טוען שאלות...</div>
      </div>
    );
  }

  const currentItem = currentSession.items[currentSession.currentIndex];
  const progress = ((currentSession.currentIndex) / currentSession.items.length) * 100;
  const correctCount = currentSession.items.filter(i => i.isCorrect).length;

  // Session complete screen
  if (sessionComplete) {
    const accuracy = Math.round((correctCount / currentSession.items.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        {showConfetti && <Confetti />}
        
        <div className="w-24 h-24 bg-comprehension-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-comprehension-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-night-900 mb-2">
          כל הכבוד! 🎉
        </h1>
        <p className="text-night-800/70 text-lg mb-2">
          סיימת את תרגול ההבנה
        </p>
        
        {/* News card mini */}
        <div className="bg-white rounded-2xl p-4 shadow-card mb-6 text-right">
          <div className={clsx(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2',
            categoryLabels[newsItem.category].color
          )}>
            <span>{categoryLabels[newsItem.category].icon}</span>
            <span>{categoryLabels[newsItem.category].label}</span>
          </div>
          <p className="text-sm text-night-800/70 line-clamp-2">{newsItem.title}</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-card mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-reading-600">
                {currentSession.items.length}
              </p>
              <p className="text-night-800/60 text-sm">שאלות</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-writing-600">
                {accuracy}%
              </p>
              <p className="text-night-800/60 text-sm">דיוק</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-vocabulary-600">
                +{Math.round(currentSession.totalXpEarned)}
              </p>
              <p className="text-night-800/60 text-sm">XP</p>
            </div>
          </div>
        </div>
        
        {/* Score Change for Leaderboard */}
        {lastScoreGain && (
          <motion.div 
            className="bg-gradient-to-br from-reading-50 to-comprehension-50 rounded-3xl p-6 shadow-card mb-6 text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-night-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-vocabulary-500" />
              שינוי בדירוג הכיתתי
            </h3>
            
            <div className="space-y-2 text-sm mb-4">
              {lastScoreGain.correctPoints > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-night-800/70">✅ תשובות נכונות</span>
                  <span className="text-writing-600 font-bold">+{lastScoreGain.correctPoints}</span>
                </div>
              )}
              {lastScoreGain.wrongPoints < 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-night-800/70">❌ תשובות שגויות</span>
                  <span className="text-red-500 font-bold">{lastScoreGain.wrongPoints}</span>
                </div>
              )}
              {lastScoreGain.streakBonus > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-night-800/70">🔥 בונוס רצף</span>
                  <span className="text-vocabulary-600 font-bold">+{lastScoreGain.streakBonus}</span>
                </div>
              )}
              {lastScoreGain.perfectBonus > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-night-800/70">💯 משחק מושלם!</span>
                  <span className="text-comprehension-600 font-bold">+{lastScoreGain.perfectBonus}</span>
                </div>
              )}
              <div className="border-t border-sand-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-night-900 font-bold">סה״כ</span>
                  <span className={clsx(
                    'text-xl font-bold',
                    lastScoreGain.totalChange >= 0 ? 'text-writing-600' : 'text-red-500'
                  )}>
                    {lastScoreGain.totalChange >= 0 ? '+' : ''}{lastScoreGain.totalChange} נקודות
                  </span>
                </div>
              </div>
            </div>
            
            {/* Rank change */}
            <div className="bg-white rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-night-800/70">הדירוג שלך</span>
                <div className="flex items-center gap-2">
                  <span className="text-night-800">מקום {lastScoreGain.oldRank}</span>
                  <span className="text-night-800/50">→</span>
                  <span className={clsx(
                    'font-bold flex items-center gap-1',
                    lastScoreGain.newRank < lastScoreGain.oldRank ? 'text-writing-600' : 
                    lastScoreGain.newRank > lastScoreGain.oldRank ? 'text-red-500' : 'text-night-800'
                  )}>
                    מקום {lastScoreGain.newRank}
                    {lastScoreGain.newRank < lastScoreGain.oldRank && <TrendingUp className="w-4 h-4" />}
                    {lastScoreGain.newRank > lastScoreGain.oldRank && <TrendingDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>
              {lastScoreGain.newRank < lastScoreGain.oldRank && (
                <p className="text-writing-600 text-xs mt-1">
                  🎉 עלית {lastScoreGain.oldRank - lastScoreGain.newRank} מקומות!
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Achievement */}
        {accuracy >= 80 && (
          <div className="bg-comprehension-100 rounded-2xl p-4 mb-8">
            <p className="text-comprehension-800">
              ⭐ מצוין! הבנת את הכתבה היטב!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              clearLastScoreGain();
              navigate('/leaderboard');
            }}
            className="btn-primary"
          >
            <Trophy className="w-5 h-5" />
            צפה בדירוג הכיתה
          </button>
          <button
            onClick={() => {
              clearLastScoreGain();
              navigate('/dashboard');
            }}
            className="btn-secondary"
          >
            <Newspaper className="w-5 h-5" />
            לכתבה נוספת
          </button>
          <button
            onClick={() => {
              clearLastScoreGain();
              navigate('/dashboard');
            }}
            className="text-night-800/60 hover:text-night-800 transition-colors text-sm"
          >
            <Home className="w-4 h-4 inline mr-1" />
            חזור הביתה
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl hover:bg-sand-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-night-800" />
        </button>
        
        <div className="text-center flex-1 mx-4">
          <div className={clsx(
            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mb-1',
            categoryLabels[newsItem.category].color
          )}>
            <span>{categoryLabels[newsItem.category].icon}</span>
            <span>הבנת הנקרא</span>
          </div>
          <p className="text-sm text-night-800/60 line-clamp-1">{newsItem.title}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-vocabulary-100 px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4 text-vocabulary-600" />
          <span className="font-semibold text-vocabulary-700">
            +{Math.round(currentSession.totalXpEarned)}
          </span>
        </div>
      </div>

      {/* Article preview with read aloud */}
      <div className="bg-sand-50 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <p className="text-night-800 text-sm leading-relaxed flex-1">
            {newsItem.fullText || newsItem.summary}
          </p>
          <ReadAloudButton 
            text={newsItem.fullText || newsItem.summary} 
            size="sm"
            className="flex-shrink-0"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-night-800/60">
            שאלה {currentSession.currentIndex + 1} מתוך {currentSession.items.length}
          </span>
          <span className="text-sm font-semibold text-writing-600">
            {correctCount} נכונות
          </span>
        </div>
        <div className="h-3 bg-sand-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-comprehension-500 to-reading-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSession.currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <GameRenderer
            item={currentItem.item}
            state={currentItem.state}
            selectedAnswer={currentItem.selectedAnswer}
            onAnswer={answerItem}
            onNext={nextItem}
          />
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlay */}
      <AnimatePresence>
        {currentItem.state === 'answered_correct' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-writing-500/10 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-card flex flex-col items-center"
            >
              <CheckCircle className="w-16 h-16 text-writing-500 mb-2" />
              <p className="text-2xl font-bold text-night-900">נכון! 🎉</p>
            </motion.div>
          </motion.div>
        )}
        
        {currentItem.state === 'answered_wrong' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-500/10 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-card flex flex-col items-center"
            >
              <XCircle className="w-16 h-16 text-red-500 mb-2" />
              <p className="text-2xl font-bold text-night-900">לא נורא!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

