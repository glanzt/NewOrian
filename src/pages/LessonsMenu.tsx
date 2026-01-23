import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BarChart2, Play, Eye, CheckCircle, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOPICS, type TopicId } from '../types';
import { lessonsData } from '../data/lessons';
import clsx from 'clsx';

const tabColors: Record<TopicId, { active: string; hover: string; badge: string }> = {
  reading: { 
    active: 'bg-reading-500 text-white', 
    hover: 'hover:bg-reading-100',
    badge: 'bg-reading-100 text-reading-700'
  },
  comprehension: { 
    active: 'bg-comprehension-500 text-white', 
    hover: 'hover:bg-comprehension-100',
    badge: 'bg-comprehension-100 text-comprehension-700'
  },
  writing: { 
    active: 'bg-writing-500 text-white', 
    hover: 'hover:bg-writing-100',
    badge: 'bg-writing-100 text-writing-700'
  },
  vocabulary: { 
    active: 'bg-vocabulary-500 text-white', 
    hover: 'hover:bg-vocabulary-100',
    badge: 'bg-vocabulary-100 text-vocabulary-700'
  },
};

const difficultyLabels = ['', 'קל', 'בינוני', 'מאתגר'];
const difficultyColors = ['', 'text-writing-600', 'text-vocabulary-600', 'text-red-500'];

export default function LessonsMenu() {
  const [activeTab, setActiveTab] = useState<TopicId>('reading');
  const { userProgress, isTeacherView, setTeacherView } = useStore();

  const topicLessons = lessonsData.filter(l => l.topicId === activeTab);
  const colors = tabColors[activeTab];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-night-900 mb-1">שיעורים</h1>
          <p className="text-night-800/60">בחר שיעור לפי נושא</p>
        </div>
        
        {/* Teacher toggle */}
        <button
          onClick={() => setTeacherView(!isTeacherView)}
          className={clsx(
            'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            isTeacherView 
              ? 'bg-comprehension-500 text-white' 
              : 'bg-sand-100 text-night-800 hover:bg-sand-200'
          )}
        >
          {isTeacherView ? '👩‍🏫 תצוגת מורה' : '👦 תצוגת תלמיד'}
        </button>
      </div>

      {/* Topic tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTab(topic.id)}
            className={clsx(
              'flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all whitespace-nowrap',
              activeTab === topic.id
                ? tabColors[topic.id].active
                : `bg-white text-night-800 ${tabColors[topic.id].hover}`
            )}
          >
            <span className="text-xl">{topic.icon}</span>
            {topic.nameHe}
          </button>
        ))}
      </div>

      {/* Lessons grid */}
      <motion.div 
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={activeTab}
      >
        {topicLessons.map((lesson, index) => {
          const isCompleted = userProgress.completedLessons.includes(lesson.id);
          const isLocked = index > userProgress.topics[activeTab].level + 2;

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className={clsx(
                  'card group',
                  isLocked ? 'opacity-60' : 'hover:shadow-lg'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {/* Lesson number */}
                    <div className={clsx(
                      'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg',
                      isCompleted ? 'bg-writing-100 text-writing-600' : colors.badge
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        lesson.number
                      )}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-night-900 text-lg mb-1">
                        {lesson.titleHe}
                      </h3>
                      <p className="text-night-800/60 text-sm mb-3">
                        {lesson.descriptionHe}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-night-800/50">
                          <Clock className="w-4 h-4" />
                          {lesson.durationMinutes} דק׳
                        </span>
                        <span className={clsx('flex items-center gap-1', difficultyColors[lesson.difficulty])}>
                          <BarChart2 className="w-4 h-4" />
                          {difficultyLabels[lesson.difficulty]}
                        </span>
                        <span className="text-night-800/40">
                          {lesson.month}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isTeacherView && (
                      <Link
                        to={`/lessons/${lesson.id}?preview=true`}
                        className="p-2 rounded-xl hover:bg-sand-100 transition-colors"
                        title="תצוגה מקדימה"
                      >
                        <Eye className="w-5 h-5 text-night-800/50" />
                      </Link>
                    )}
                    
                    {!isLocked && (
                      <Link
                        to={`/lessons/${lesson.id}`}
                        className={clsx(
                          'btn px-6',
                          isCompleted 
                            ? 'bg-writing-100 text-writing-700 hover:bg-writing-200'
                            : `bg-gradient-to-br from-${activeTab === 'reading' ? 'reading' : activeTab === 'comprehension' ? 'comprehension' : activeTab === 'writing' ? 'writing' : 'vocabulary'}-500 to-${activeTab}-700 text-white`
                        )}
                        style={{
                          background: isCompleted 
                            ? undefined 
                            : `linear-gradient(to bottom right, var(--color-${activeTab}), var(--color-${activeTab}))`
                        }}
                      >
                        <Play className="w-4 h-4" />
                        {isCompleted ? 'חזור' : 'התחל'}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Teacher stats */}
                {isTeacherView && (
                  <div className="mt-4 pt-4 border-t border-sand-200 flex items-center gap-6 text-sm">
                    <span className="text-night-800/50">
                      📊 15 תלמידים השלימו
                    </span>
                    <span className="text-night-800/50">
                      ⏱️ זמן ממוצע: 12 דק׳
                    </span>
                    <span className="text-night-800/50">
                      ✓ דיוק ממוצע: 78%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

