import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TopicId, UserProgress, Session, SessionItem, Item } from '../types';

// Re-import constants for calculations
const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, maxXp: 19 },
  { level: 2, minXp: 20, maxXp: 49 },
  { level: 3, minXp: 50, maxXp: 89 },
  { level: 4, minXp: 90, maxXp: 139 },
  { level: 5, minXp: 140, maxXp: 199 },
  { level: 6, minXp: 200, maxXp: 269 },
  { level: 7, minXp: 270, maxXp: 349 },
  { level: 8, minXp: 350, maxXp: 449 },
  { level: 9, minXp: 450, maxXp: 569 },
  { level: 10, minXp: 570, maxXp: Infinity },
];

const XP_RULES = {
  attemptItem: 1,
  correctBonus: 0.5,
  streakBonus: 1,
};

interface XPGainEvent {
  amount: number;
  topicId: TopicId;
  timestamp: number;
}

interface AppState {
  // User and progress
  userProgress: UserProgress;
  hasSeenIntro: boolean;
  
  // Current session
  currentSession: Session | null;
  consecutiveCorrect: number;
  
  // UI state
  sidebarOpen: boolean;
  isTeacherView: boolean;
  
  // XP animation
  lastXpGain: XPGainEvent | null;
  
  // Actions
  setHasSeenIntro: (seen: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setTeacherView: (isTeacher: boolean) => void;
  
  // Session actions
  startSession: (type: 'daily' | 'lesson', items: Item[], lessonId?: string) => void;
  answerItem: (selectedAnswer: string | string[]) => void;
  nextItem: () => void;
  completeSession: () => void;
  
  // Progress actions
  addXp: (topicId: TopicId, amount: number) => void;
  completeLesson: (lessonId: string) => void;
  earnBadge: (badgeId: string) => void;
  
  // Helpers
  getLevelForXp: (xp: number) => number;
  getXpProgress: (xp: number) => { current: number; required: number; percentage: number };
}

const initialProgress: UserProgress = {
  userId: 'student-1',
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  topics: {
    reading: {
      topicId: 'reading',
      xp: 0,
      level: 1,
      practicedCount: 0,
      last7DaysAccuracy: 0,
      bestStreak: 0,
      weeklyTrend: 'stable',
    },
    comprehension: {
      topicId: 'comprehension',
      xp: 0,
      level: 1,
      practicedCount: 0,
      last7DaysAccuracy: 0,
      bestStreak: 0,
      weeklyTrend: 'stable',
    },
    writing: {
      topicId: 'writing',
      xp: 0,
      level: 1,
      practicedCount: 0,
      last7DaysAccuracy: 0,
      bestStreak: 0,
      weeklyTrend: 'stable',
    },
    vocabulary: {
      topicId: 'vocabulary',
      xp: 0,
      level: 1,
      practicedCount: 0,
      last7DaysAccuracy: 0,
      bestStreak: 0,
      weeklyTrend: 'stable',
    },
  },
  completedLessons: [],
  earnedBadges: [],
  dailyPracticeStreak: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,
      hasSeenIntro: false,
      currentSession: null,
      consecutiveCorrect: 0,
      sidebarOpen: true,
      isTeacherView: false,
      lastXpGain: null,

      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTeacherView: (isTeacher) => set({ isTeacherView: isTeacher }),

      getLevelForXp: (xp: number) => {
        const threshold = LEVEL_THRESHOLDS.find(t => xp >= t.minXp && xp <= t.maxXp);
        return threshold?.level ?? 10;
      },

      getXpProgress: (xp: number) => {
        const currentLevel = get().getLevelForXp(xp);
        const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel)!;
        const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
        
        if (!nextThreshold) {
          return { current: xp, required: xp, percentage: 100 };
        }
        
        const current = xp - currentThreshold.minXp;
        const required = nextThreshold.minXp - currentThreshold.minXp;
        const percentage = Math.min(100, (current / required) * 100);
        
        return { current, required, percentage };
      },

      startSession: (type, items, lessonId) => {
        const sessionItems: SessionItem[] = items.map(item => ({
          item,
          state: 'idle',
        }));

        set({
          currentSession: {
            id: `session-${Date.now()}`,
            type,
            lessonId,
            items: sessionItems,
            currentIndex: 0,
            startedAt: new Date(),
            totalXpEarned: 0,
          },
          consecutiveCorrect: 0,
        });
      },

      answerItem: (selectedAnswer) => {
        const { currentSession, consecutiveCorrect, userProgress } = get();
        if (!currentSession) return;

        const currentItem = currentSession.items[currentSession.currentIndex];
        const item = currentItem.item;
        
        // Check if correct
        let isCorrect = false;
        if (Array.isArray(item.correctAnswer)) {
          isCorrect = Array.isArray(selectedAnswer) 
            ? JSON.stringify(selectedAnswer.sort()) === JSON.stringify(item.correctAnswer.sort())
            : item.correctAnswer.includes(selectedAnswer);
        } else {
          isCorrect = selectedAnswer === item.correctAnswer;
        }

        // Calculate XP
        let xpEarned = XP_RULES.attemptItem;
        if (isCorrect) {
          xpEarned += XP_RULES.correctBonus;
        }
        
        const newConsecutive = isCorrect ? consecutiveCorrect + 1 : 0;
        if (newConsecutive >= 3 && newConsecutive % 3 === 0) {
          xpEarned += XP_RULES.streakBonus;
        }

        // Update topic progress
        const topicId = item.topicId;
        const topicProgress = { ...userProgress.topics[topicId] };
        topicProgress.xp += xpEarned;
        topicProgress.level = get().getLevelForXp(topicProgress.xp);
        topicProgress.practicedCount += 1;
        topicProgress.lastPracticed = new Date();

        // Update session
        const updatedItems = [...currentSession.items];
        updatedItems[currentSession.currentIndex] = {
          ...currentItem,
          state: isCorrect ? 'answered_correct' : 'answered_wrong',
          selectedAnswer,
          isCorrect,
        };

        set({
          currentSession: {
            ...currentSession,
            items: updatedItems,
            totalXpEarned: currentSession.totalXpEarned + xpEarned,
          },
          consecutiveCorrect: newConsecutive,
          userProgress: {
            ...userProgress,
            totalXp: userProgress.totalXp + xpEarned,
            topics: {
              ...userProgress.topics,
              [topicId]: topicProgress,
            },
          },
          // Trigger XP animation
          lastXpGain: {
            amount: xpEarned,
            topicId,
            timestamp: Date.now(),
          },
        });

        // Show feedback for 900ms then move to completed state
        setTimeout(() => {
          const session = get().currentSession;
          if (!session) return;
          
          const items = [...session.items];
          items[session.currentIndex] = {
            ...items[session.currentIndex],
            state: 'completed',
          };
          
          set({
            currentSession: {
              ...session,
              items,
            },
          });
        }, 900);
      },

      nextItem: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentIndex + 1;
        
        if (nextIndex >= currentSession.items.length) {
          get().completeSession();
          return;
        }

        set({
          currentSession: {
            ...currentSession,
            currentIndex: nextIndex,
          },
        });
      },

      completeSession: () => {
        const { currentSession, userProgress } = get();
        if (!currentSession) return;

        // Update daily streak
        const today = new Date().toDateString();
        const lastPractice = userProgress.lastDailyPractice 
          ? new Date(userProgress.lastDailyPractice).toDateString() 
          : null;
        
        let newStreak = userProgress.dailyPracticeStreak;
        if (lastPractice !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastPractice === yesterday.toDateString()) {
            newStreak += 1;
          } else if (lastPractice !== today) {
            newStreak = 1;
          }
        }

        set({
          currentSession: {
            ...currentSession,
            completedAt: new Date(),
          },
          userProgress: {
            ...userProgress,
            dailyPracticeStreak: newStreak,
            currentStreak: Math.max(userProgress.currentStreak, newStreak),
            longestStreak: Math.max(userProgress.longestStreak, newStreak),
            lastDailyPractice: new Date(),
          },
        });
      },

      addXp: (topicId, amount) => {
        const { userProgress } = get();
        const topicProgress = { ...userProgress.topics[topicId] };
        topicProgress.xp += amount;
        topicProgress.level = get().getLevelForXp(topicProgress.xp);

        set({
          userProgress: {
            ...userProgress,
            totalXp: userProgress.totalXp + amount,
            topics: {
              ...userProgress.topics,
              [topicId]: topicProgress,
            },
          },
        });
      },

      completeLesson: (lessonId) => {
        const { userProgress } = get();
        if (!userProgress.completedLessons.includes(lessonId)) {
          set({
            userProgress: {
              ...userProgress,
              completedLessons: [...userProgress.completedLessons, lessonId],
            },
          });
        }
      },

      earnBadge: (badgeId) => {
        const { userProgress } = get();
        if (!userProgress.earnedBadges.includes(badgeId)) {
          set({
            userProgress: {
              ...userProgress,
              earnedBadges: [...userProgress.earnedBadges, badgeId],
            },
          });
        }
      },
    }),
    {
      name: 'literacy-quest-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        hasSeenIntro: state.hasSeenIntro,
      }),
    }
  )
);

