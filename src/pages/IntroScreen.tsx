import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Pencil, Sparkles, Play, BookMarked } from 'lucide-react';
import { useStore } from '../store/useStore';

const topics = [
  {
    icon: BookOpen,
    title: 'קריאה',
    subtitle: 'דיוק + שטף',
    color: 'from-reading-400 to-reading-600',
    bgColor: 'bg-reading-100',
    textColor: 'text-reading-700',
  },
  {
    icon: Brain,
    title: 'הבנת הנקרא',
    subtitle: 'מבינים מה קראנו',
    color: 'from-comprehension-400 to-comprehension-600',
    bgColor: 'bg-comprehension-100',
    textColor: 'text-comprehension-700',
  },
  {
    icon: Pencil,
    title: 'כתיבה',
    subtitle: 'בהרכבה של משפטים',
    color: 'from-writing-400 to-writing-600',
    bgColor: 'bg-writing-100',
    textColor: 'text-writing-700',
  },
  {
    icon: Sparkles,
    title: 'אוצר מילים',
    subtitle: 'מילים חדשות',
    color: 'from-vocabulary-400 to-vocabulary-600',
    bgColor: 'bg-vocabulary-100',
    textColor: 'text-vocabulary-700',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 20 }
  },
};

export default function IntroScreen() {
  const navigate = useNavigate();
  const { setHasSeenIntro } = useStore();

  const handleStart = (path: string) => {
    setHasSeenIntro(true);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-reading-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-comprehension-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-writing-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-16 w-64 h-64 bg-vocabulary-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        className="max-w-2xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-card mb-6">
            <span className="text-5xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-night-900 mb-4">
            ברוכים הבאים למסע האוריינות
          </h1>
          <p className="text-xl text-night-800/70">
            של כיתה ב׳
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-lg text-night-800/80 mb-8"
        >
          נשפר 4 מיומנויות שבית הספר בודק השנה
        </motion.p>

        {/* Topics grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic.title}
              className={`${topic.bgColor} rounded-3xl p-5 transition-transform hover:scale-[1.02]`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-3 shadow-soft`}>
                <topic.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-bold text-lg ${topic.textColor}`}>
                {topic.title}
              </h3>
              <p className="text-night-800/60 text-sm">
                {topic.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Explanation */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-soft"
        >
          <h3 className="font-bold text-night-900 mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            איך זה עובד?
          </h3>
          <ul className="space-y-2 text-night-800/80">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-reading-500" />
              ככל שמתרגלים יותר – הבר מתמלא
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-comprehension-500" />
              כל תרגול נותן XP ומעלה רמות
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-writing-500" />
              תרגול יומי שומר על רצף 🔥
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vocabulary-500" />
              אוספים פרסים ותגים
            </li>
          </ul>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => handleStart('/daily')}
            className="btn-primary flex-1 text-xl py-5 group"
          >
            <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
            התחל תרגול יומי
          </button>
          <button
            onClick={() => handleStart('/lessons')}
            className="btn-secondary flex-1 text-xl py-5"
          >
            <BookMarked className="w-6 h-6" />
            בחר שיעור
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-sm text-night-800/50 mt-6"
        >
          מוכן למסע? בוא נתחיל! 🚀
        </motion.p>
      </motion.div>
    </div>
  );
}

