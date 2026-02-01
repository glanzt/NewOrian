import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Heart, Newspaper, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import NewsSection from '../components/NewsSection';

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

// Simulate live users count
function useLiveUsers() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 15) + 18); // Start between 18-32
  
  useEffect(() => {
    // Update count every 3-8 seconds randomly
    const updateCount = () => {
      setCount(prev => {
        // Fluctuate by -2 to +3
        const change = Math.floor(Math.random() * 6) - 2;
        const newCount = prev + change;
        // Keep between 12 and 45
        return Math.max(12, Math.min(45, newCount));
      });
    };
    
    const interval = setInterval(updateCount, Math.random() * 5000 + 3000);
    return () => clearInterval(interval);
  }, []);
  
  return count;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { userInterests } = useStore();
  const liveUsers = useLiveUsers();

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome header */}
      <motion.div variants={cardVariants} className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-night-900 mb-1">
          שלום יעל! 👋
        </h1>
        <p className="text-night-800/60">
          בחרי כתבה שמעניינת אותך ונתחיל לתרגל!
        </p>
      </motion.div>
      
      {/* Live users - FOMO */}
      <motion.div 
        variants={cardVariants}
        className="bg-gradient-to-r from-writing-500 to-comprehension-500 rounded-2xl px-4 py-3 mb-5 shadow-soft"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <Users className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
          </div>
          <span className="text-white/90 text-sm">עכשיו מתרגלים:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={liveUsers}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-white font-bold text-lg"
            >
              {liveUsers}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/90 text-sm">ילדים מהכיתה</span>
          <span className="text-xl">🔥</span>
        </div>
      </motion.div>

      {/* User interests section */}
      {userInterests.length > 0 && (
        <motion.div variants={cardVariants} className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-night-800/70">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>מה מעניין אותך:</span>
            </div>
            <button
              onClick={() => navigate('/interests')}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Settings2 className="w-3.5 h-3.5" />
              עריכה
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userInterests.slice(0, 6).map((interest) => (
              <span
                key={interest.id}
                className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-medium"
              >
                {interest.name}
              </span>
            ))}
            {userInterests.length > 6 && (
              <span className="px-3 py-1 bg-sand-100 text-night-800/60 rounded-full text-sm">
                +{userInterests.length - 6} עוד
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Tip for new users */}
      {userInterests.length === 0 && (
        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-4 mb-5"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <p className="text-pink-800 font-medium">
                ספרי לנו מה מעניין אותך!
              </p>
              <p className="text-pink-700/70 text-sm">
                נביא לך כתבות על נושאים שאת אוהבת
              </p>
            </div>
            <button
              onClick={() => navigate('/interests')}
              className="mr-auto px-4 py-2 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors"
            >
              בחרי נושאים
            </button>
          </div>
        </motion.div>
      )}

      {/* Main instruction */}
      <motion.div 
        variants={cardVariants}
        className="bg-gradient-to-r from-reading-50 to-comprehension-50 border border-reading-200 rounded-2xl p-4 mb-2"
      >
        <div className="flex items-start gap-3">
          <Newspaper className="w-6 h-6 text-reading-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-reading-800 font-semibold mb-1">
              איך זה עובד?
            </p>
            <p className="text-reading-700 text-sm leading-relaxed">
              בוחרים כתבה מעניינת, קוראים אותה, ומתרגלים <span className="font-medium">קריאה</span>, <span className="font-medium">הבנה</span>, <span className="font-medium">כתיבה</span> ו<span className="font-medium">אוצר מילים</span>. 
              לוקח רק כמה דקות ומקבלים ניקוד! ⭐
            </p>
          </div>
        </div>
      </motion.div>

      {/* News Section - Main focus */}
      <motion.div variants={cardVariants}>
        <NewsSection />
      </motion.div>
    </motion.div>
  );
}
