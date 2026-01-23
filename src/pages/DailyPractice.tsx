import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, CheckCircle, XCircle, Zap, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getRandomItems } from '../data/sampleContent';
import GameRenderer from '../components/games/GameRenderer';
import Confetti from '../components/ui/Confetti';

export default function DailyPractice() {
  const navigate = useNavigate();
  const { currentSession, startSession, answerItem, nextItem, userProgress } = useStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Start session on mount
  useEffect(() => {
    if (!currentSession) {
      // Get 8 random items, 2 from each topic
      const items = getRandomItems(8);
      startSession('daily', items);
    }
  }, []);

  // Check for session completion
  useEffect(() => {
    if (currentSession?.completedAt && !sessionComplete) {
      setShowConfetti(true);
      setSessionComplete(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentSession?.completedAt, sessionComplete]);

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-night-800/50">טוען...</div>
      </div>
    );
  }

  const currentItem = currentSession.items[currentSession.currentIndex];
  const progress = ((currentSession.currentIndex) / currentSession.items.length) * 100;
  const correctCount = currentSession.items.filter(i => i.isCorrect).length;

  // Session complete screen
  if (sessionComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        {showConfetti && <Confetti />}
        
        <div className="w-24 h-24 bg-writing-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-writing-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-night-900 mb-2">
          כל הכבוד! 🎉
        </h1>
        <p className="text-night-800/70 text-lg mb-8">
          סיימת את התרגול היומי
        </p>

        {/* Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-card mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-reading-600">
                {currentSession.items.length}
              </p>
              <p className="text-night-800/60 text-sm">תרגילים</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-writing-600">
                {correctCount}
              </p>
              <p className="text-night-800/60 text-sm">נכונות</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-vocabulary-600">
                +{Math.round(currentSession.totalXpEarned)}
              </p>
              <p className="text-night-800/60 text-sm">XP</p>
            </div>
          </div>
        </div>

        {/* Streak */}
        {userProgress.dailyPracticeStreak > 0 && (
          <div className="bg-vocabulary-100 rounded-2xl p-4 mb-8">
            <p className="text-vocabulary-800">
              🔥 רצף של <span className="font-bold">{userProgress.dailyPracticeStreak} ימים</span>!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setSessionComplete(false);
              const items = getRandomItems(8);
              startSession('daily', items);
            }}
            className="btn-primary"
          >
            <Zap className="w-5 h-5" />
            תרגול נוסף
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <Home className="w-5 h-5" />
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
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-sand-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-night-800" />
        </button>
        
        <h1 className="text-xl font-bold text-night-900">תרגול יומי</h1>
        
        <div className="flex items-center gap-2 bg-vocabulary-100 px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4 text-vocabulary-600" />
          <span className="font-semibold text-vocabulary-700">
            +{Math.round(currentSession.totalXpEarned)} XP
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
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
            className="h-full bg-gradient-to-l from-reading-500 to-comprehension-500 rounded-full"
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
              <p className="text-2xl font-bold text-night-900">לא נורא, ננסה שוב!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

