import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TopicId, UserProgress, Session, SessionItem, Item, Classmate } from '../types';
import { SCORE_RULES, STREAK_BONUSES, INITIAL_CLASSMATES } from '../types';

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

interface ScoreGainEvent {
  correctPoints: number;
  wrongPoints: number;
  streakBonus: number;
  perfectBonus: number;
  totalChange: number;
  newScore: number;
  oldRank: number;
  newRank: number;
}

// User interests for personalized content
export interface UserInterest {
  id: string;
  name: string;
  category: 'sports' | 'celebrity' | 'animal' | 'game' | 'movie' | 'other';
}

// Predefined interests kids might like
export const PREDEFINED_INTERESTS: UserInterest[] = [
  // K-POP & Music
  { id: 'kpop', name: 'K-POP', category: 'celebrity' },
  { id: 'bts', name: 'BTS', category: 'celebrity' },
  { id: 'blackpink', name: 'BLACKPINK', category: 'celebrity' },
  { id: 'noa-kirel', name: 'נועה קירל', category: 'celebrity' },
  
  // Anime & Japanese Culture
  { id: 'hunter-x-hunter', name: 'Hunter x Hunter', category: 'movie' },
  { id: 'japan', name: 'יפן', category: 'other' },
  { id: 'anime', name: 'אנימה', category: 'movie' },
  
  // Israeli TV Shows
  { id: 'shakshuka-caramel', name: 'שקשוקה קראמל', category: 'movie' },
  { id: 'kan-kids', name: 'כאן 11', category: 'movie' },
  
  // Movies & Disney
  { id: 'lilo-stitch', name: 'לילו וסטיץ\'', category: 'movie' },
  { id: 'disney', name: 'דיסני', category: 'movie' },
  
  // Other interests
  { id: 'cats', name: 'חתולים', category: 'animal' },
  { id: 'dogs', name: 'כלבים', category: 'animal' },
];

interface AppState {
  // User and progress
  userProgress: UserProgress;
  hasSeenIntro: boolean;
  userName: string;
  
  // User interests
  userInterests: UserInterest[];
  hasSetInterests: boolean;
  
  // Current session
  currentSession: Session | null;
  consecutiveCorrect: number;
  
  // Leaderboard
  userScore: number;
  classmates: Classmate[];
  lastScoreGain: ScoreGainEvent | null;
  
  // UI state
  sidebarOpen: boolean;
  isTeacherView: boolean;
  
  // XP animation
  lastXpGain: XPGainEvent | null;
  
  // Actions
  setHasSeenIntro: (seen: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setTeacherView: (isTeacher: boolean) => void;
  setUserName: (name: string) => void;
  
  // Interests actions
  addInterest: (interest: UserInterest) => void;
  removeInterest: (interestId: string) => void;
  setInterests: (interests: UserInterest[]) => void;
  addCustomInterest: (name: string) => void;
  setHasSetInterests: (hasSet: boolean) => void;
  
  // Session actions
  startSession: (type: 'daily' | 'lesson', items: Item[], lessonId?: string) => void;
  answerItem: (selectedAnswer: string | string[]) => void;
  nextItem: () => void;
  completeSession: () => void;
  
  // Progress actions
  addXp: (topicId: TopicId, amount: number) => void;
  completeLesson: (lessonId: string) => void;
  earnBadge: (badgeId: string) => void;
  
  // Leaderboard actions
  getUserRank: () => number;
  getLeaderboard: () => Classmate[];
  clearLastScoreGain: () => void;
  
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
      userName: 'יעל',
      userInterests: [],
      hasSetInterests: false,
      currentSession: null,
      consecutiveCorrect: 0,
      sidebarOpen: true,
      isTeacherView: false,
      lastXpGain: null,
      
      // Leaderboard state
      userScore: 770,
      classmates: INITIAL_CLASSMATES,
      lastScoreGain: null,

      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTeacherView: (isTeacher) => set({ isTeacherView: isTeacher }),
      setUserName: (name) => set({ userName: name }),
      
      // Interests actions
      addInterest: (interest) => {
        const { userInterests } = get();
        if (!userInterests.find(i => i.id === interest.id)) {
          set({ userInterests: [...userInterests, interest] });
        }
      },
      
      removeInterest: (interestId) => {
        const { userInterests } = get();
        set({ userInterests: userInterests.filter(i => i.id !== interestId) });
      },
      
      setInterests: (interests) => set({ userInterests: interests }),
      
      addCustomInterest: (name) => {
        const { userInterests } = get();
        const id = `custom-${Date.now()}`;
        set({ 
          userInterests: [...userInterests, { id, name, category: 'other' }] 
        });
      },
      
      setHasSetInterests: (hasSet) => set({ hasSetInterests: hasSet }),

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
        
        // Check if correct based on item type
        let isCorrect = false;
        if (Array.isArray(item.correctAnswer)) {
          if (!Array.isArray(selectedAnswer)) {
            // Single answer given but array expected - always wrong
            isCorrect = false;
          } else if (item.type === 'select-chips') {
            // For select-chips: order doesn't matter, just the set of selected items
            const sortedSelected = [...selectedAnswer].sort();
            const sortedCorrect = [...item.correctAnswer].sort();
            isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
          } else {
            // For sequence/drag-order: order matters!
            isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(item.correctAnswer);
          }
        } else {
          // Single correct answer (MCQ)
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
        const { currentSession, userProgress, userScore, getUserRank } = get();
        if (!currentSession) return;

        // Calculate score changes for leaderboard
        let correctPoints = 0;
        let wrongPoints = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        let streakBonus = 0;
        
        currentSession.items.forEach(sessionItem => {
          const itemType = sessionItem.item.type;
          const scoreRule = SCORE_RULES[itemType] || SCORE_RULES.mcq;
          
          if (sessionItem.isCorrect) {
            correctPoints += scoreRule.correct;
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
            
            // Check for streak bonuses
            if (currentStreak === 3) {
              streakBonus += STREAK_BONUSES.streak3;
            } else if (currentStreak === 5) {
              streakBonus += STREAK_BONUSES.streak5;
            }
          } else if (sessionItem.state === 'completed' || sessionItem.state === 'answered_wrong') {
            wrongPoints += scoreRule.wrong;
            currentStreak = 0;
          }
        });
        
        // Check for perfect game bonus
        const correctCount = currentSession.items.filter(i => i.isCorrect).length;
        const answeredCount = currentSession.items.filter(i => 
          i.state === 'completed' || i.state === 'answered_correct' || i.state === 'answered_wrong'
        ).length;
        const perfectBonus = (correctCount === answeredCount && answeredCount > 0) 
          ? STREAK_BONUSES.perfect 
          : 0;
        
        const totalChange = correctPoints + wrongPoints + streakBonus + perfectBonus;
        const newScore = Math.max(0, userScore + totalChange);
        const oldRank = getUserRank();

        // Update daily streak
        const today = new Date().toDateString();
        const lastPractice = userProgress.lastDailyPractice 
          ? new Date(userProgress.lastDailyPractice).toDateString() 
          : null;
        
        let newDailyStreak = userProgress.dailyPracticeStreak;
        if (lastPractice !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastPractice === yesterday.toDateString()) {
            newDailyStreak += 1;
          } else if (lastPractice !== today) {
            newDailyStreak = 1;
          }
        }

        set({
          currentSession: {
            ...currentSession,
            completedAt: new Date(),
          },
          userScore: newScore,
          userProgress: {
            ...userProgress,
            dailyPracticeStreak: newDailyStreak,
            currentStreak: Math.max(userProgress.currentStreak, newDailyStreak),
            longestStreak: Math.max(userProgress.longestStreak, newDailyStreak),
            lastDailyPractice: new Date(),
          },
        });
        
        // Calculate new rank after score update
        const tempState = get();
        const newRank = tempState.getUserRank();
        
        set({
          lastScoreGain: {
            correctPoints,
            wrongPoints,
            streakBonus,
            perfectBonus,
            totalChange,
            newScore,
            oldRank,
            newRank,
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
      
      // Leaderboard helpers
      getUserRank: () => {
        const { userScore, classmates, userName } = get();
        const allParticipants = [
          ...classmates,
          { id: 'user', name: userName, score: userScore, isCurrentUser: true }
        ].sort((a, b) => b.score - a.score);
        
        return allParticipants.findIndex(p => p.isCurrentUser) + 1;
      },
      
      getLeaderboard: () => {
        const { userScore, classmates, userName } = get();
        const allParticipants = [
          ...classmates,
          { id: 'user', name: userName, score: userScore, isCurrentUser: true }
        ].sort((a, b) => b.score - a.score);
        
        return allParticipants;
      },
      
      clearLastScoreGain: () => set({ lastScoreGain: null }),
    }),
    {
      name: 'literacy-quest-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        hasSeenIntro: state.hasSeenIntro,
        userName: state.userName,
        userInterests: state.userInterests,
        hasSetInterests: state.hasSetInterests,
        userScore: state.userScore,
        classmates: state.classmates,
      }),
    }
  )
);

