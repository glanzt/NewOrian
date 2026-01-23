// Topic types
export type TopicId = 'reading' | 'comprehension' | 'writing' | 'vocabulary';

export interface Topic {
  id: TopicId;
  name: string;
  nameHe: string;
  color: string;
  icon: string;
}

// Game types per topic
export type GameType = 
  // Reading games
  | 'sound-match' 
  | 'mistake-hunter' 
  | 'reading-sprint'
  // Comprehension games
  | 'story-detective'
  | 'sequence-builder'
  | 'choose-ending'
  // Writing games
  | 'sentence-builder'
  | 'paragraph-builder'
  | 'fix-sentence'
  // Vocabulary games
  | 'gold-word'
  | 'opposites-arena'
  | 'word-family';

// Item (question/exercise) types
export type ItemState = 'idle' | 'answered_correct' | 'answered_wrong' | 'feedback_showing' | 'completed';

export interface ItemOption {
  id: string;
  text: string;
  isCorrect: boolean;
  audioUrl?: string;
}

export interface Item {
  id: string;
  lessonId: string;
  topicId: TopicId;
  gameType: GameType;
  type: 'mcq' | 'drag-order' | 'drag-match' | 'select-chips' | 'sequence';
  prompt: string;
  promptAudioUrl?: string;
  options: ItemOption[];
  correctAnswer: string | string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  xpValue: number;
  // Educational explanation shown after answering
  explanation?: string;
  // For comprehension - story context
  storyText?: string;
  // For sequence games
  sequenceItems?: string[];
  // Metadata
  errorType?: string;
  skillTag?: string;
}

// Lesson
export interface Lesson {
  id: string;
  topicId: TopicId;
  number: number;
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  difficulty: 1 | 2 | 3;
  durationMinutes: number;
  month: string;
  itemIds: string[];
  gameTypes: GameType[];
}

// Progress tracking
export interface TopicProgress {
  topicId: TopicId;
  xp: number;
  level: number;
  practicedCount: number;
  last7DaysAccuracy: number;
  bestStreak: number;
  lastPracticed?: Date;
  weeklyTrend: 'up' | 'down' | 'stable';
}

export interface UserProgress {
  userId: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  topics: Record<TopicId, TopicProgress>;
  completedLessons: string[];
  earnedBadges: string[];
  lastDailyPractice?: Date;
  dailyPracticeStreak: number;
}

// Session (daily practice or lesson)
export interface SessionItem {
  item: Item;
  state: ItemState;
  selectedAnswer?: string | string[];
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface Session {
  id: string;
  type: 'daily' | 'lesson';
  lessonId?: string;
  items: SessionItem[];
  currentIndex: number;
  startedAt: Date;
  completedAt?: Date;
  totalXpEarned: number;
}

// Badge/Reward
export interface Badge {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  iconUrl: string;
  requirement: string;
  category: 'streak' | 'level' | 'accuracy' | 'completion' | 'special';
}

// Level thresholds
export const LEVEL_THRESHOLDS = [
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

// XP rules
export const XP_RULES = {
  attemptItem: 1,        // +1 XP always for attempting
  correctBonus: 0.5,     // +0.5 XP for correct
  streakBonus: 1,        // +1 XP for 3 correct in a row
};

// Topics definition
export const TOPICS: Topic[] = [
  {
    id: 'reading',
    name: 'Reading Fluency & Accuracy',
    nameHe: 'דיוק ושטף קריאה',
    color: '#3b82f6',
    icon: '📖',
  },
  {
    id: 'comprehension',
    name: 'Reading Comprehension',
    nameHe: 'הבנת הנקרא',
    color: '#a855f7',
    icon: '🔍',
  },
  {
    id: 'writing',
    name: 'Structured Writing',
    nameHe: 'כתיבה מובנית',
    color: '#22c55e',
    icon: '✏️',
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    nameHe: 'אוצר מילים',
    color: '#f97316',
    icon: '💎',
  },
];

