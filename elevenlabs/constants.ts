import type { StepConfig, Power, StoryBridgeData, ImageStyle } from '@/types';

// Default values for empty inputs (Hebrew) - used when user doesn't fill in a step
export const DEFAULT_STORY_VALUES: StoryBridgeData = {
  character: 'ילד אמיץ',
  desire: 'למצוא את דרכו',
  helper: 'חבר נאמן',
  obstacle: 'פחד מהלא נודע',
  action: 'לא ויתר והמשיך קדימה',
  ending: 'הצליח לגלות את הכוח שבתוכו',
};

// Step configuration for all 6 story steps
export const STEP_CONFIGS: StepConfig[] = [
  {
    stepNumber: 1,
    question: 'מי הגיבור או הגיבורה של הסיפור?',
    helper: 'זה יכול להיות מישהו אמיתי, חיה, או דמות שהמצאת',
    placeholder: '',
    inputKey: 'character',
  },
  {
    stepNumber: 2,
    question: 'מה הדבר שהגיבור הכי רצה שיקרה?',
    helper: 'משהו שהוא מאוד רוצה, צריך או חולם עליו',
    placeholder: '',
    inputKey: 'desire',
  },
  {
    stepNumber: 3,
    question: 'מי או מה יכול לעזור לו בדרך?',
    helper: 'אדם, חיה, חפץ או רעיון',
    placeholder: '',
    inputKey: 'helper',
  },
  {
    stepNumber: 4,
    question: 'מה הדבר שהקשה עליו במיוחד או עמד בדרכו?',
    helper: 'משהו שמאתגר או מבלבל',
    placeholder: '',
    inputKey: 'obstacle',
  },
  {
    stepNumber: 5,
    question: 'מה הגיבור מנסה לעשות כדי להתמודד?',
    helper: 'אין דרך אחת – כל ניסיון הוא חלק מהסיפור',
    placeholder: '',
    inputKey: 'action',
  },
  {
    stepNumber: 6,
    question: 'איך הכל הסתיים בסוף?',
    helper: 'לא חייב סוף מושלם – רק סוף שמרגיש נכון',
    placeholder: '',
    inputKey: 'ending',
  },
];

// Progress bar labels
export const PROGRESS_LABELS = ['דמות', 'רצון', 'חבר', 'קושי', 'פעולה', 'סיום'];

// All powers with their keywords for detection (kept for backwards compatibility)
export const ALL_POWERS: Power[] = [
  {
    name: 'כוח המחשבה',
    icon: '🧠',
    description: 'הגיבור עצר לחשוב, להבין מה קורה ולמצוא דרך לפתרון.',
    keywords: ['חושב', 'מחשבה', 'רעיון', 'להבין', 'לחשוב', 'הבין', 'גילה', 'למד', 'שאל', 'חקר'],
  },
  {
    name: 'כוח הרגש',
    icon: '💛',
    description: 'הגיבור הרגיש רגשות ונתן להם מקום. זה עזר לו להמשיך.',
    keywords: ['הרגיש', 'רגש', 'פחד', 'שמח', 'עצוב', 'כעס', 'אהבה', 'דאג', 'התרגש', 'בכה'],
  },
  {
    name: 'כוח הקשר',
    icon: '🤝',
    description: 'הגיבור לא נשאר לבד. הוא קיבל עזרה והשתמש בכוח של ביחד.',
    keywords: ['חבר', 'חברה', 'עזרה', 'ביחד', 'משפחה', 'ביקש', 'שיתף', 'יחד', 'אמא', 'אבא'],
  },
  {
    name: 'כוח הדמיון',
    icon: '✨',
    description: 'הגיבור השתמש בדמיון כדי למצוא פתרון יצירתי ולא רגיל.',
    keywords: ['דמיין', 'חולם', 'יצירה', 'המציא', 'קסם', 'יצירתי', 'חלום', 'פנטזיה', 'משחק'],
  },
  {
    name: 'כוח הגוף',
    icon: '💪',
    description: 'הגיבור השתמש בגוף שלו – בתנועה או בפעולה – כדי להתמודד.',
    keywords: ['רץ', 'קפץ', 'עשה', 'בנה', 'ניסה', 'טיפס', 'הלך', 'נע', 'פעל', 'התאמץ'],
  },
  {
    name: 'כוח האמונה',
    icon: '🌟',
    description: 'הגיבור האמין בעצמו או במשהו חשוב, וזה נתן לו כוח.',
    keywords: ['האמין', 'לא ויתר', 'המשיך', 'אמיץ', 'בטח', 'אמונה', 'תקווה', 'החליט', 'נחוש'],
  },
];

// Character identity card fields
export interface CharacterTrait {
  label: string;
  icon: string;
  field: 'character' | 'desire' | 'helper' | 'obstacle' | 'action' | 'ending';
  emptyText: string;
}

export const CHARACTER_IDENTITY_FIELDS: CharacterTrait[] = [
  {
    label: 'שם הגיבור',
    icon: '👤',
    field: 'character',
    emptyText: 'גיבור מסתורי',
  },
  {
    label: 'החלום הגדול',
    icon: '⭐',
    field: 'desire',
    emptyText: 'חלום שעדיין נשמר בסוד',
  },
  {
    label: 'מי לצידי',
    icon: '🤝',
    field: 'helper',
    emptyText: 'עוזר נסתר',
  },
  {
    label: 'האתגר שלי',
    icon: '🏔️',
    field: 'obstacle',
    emptyText: 'אתגר שמחכה להיפתר',
  },
  {
    label: 'איך אני מתמודד',
    icon: '💪',
    field: 'action',
    emptyText: 'בדרך שלי',
  },
  {
    label: 'הסוף שלי',
    icon: '🌈',
    field: 'ending',
    emptyText: 'סוף פתוח',
  },
];

// Safety message text
export const SAFETY_MESSAGE = 'אין תשובות נכונות או לא נכונות – רק סיפור שמחכה להיכתב';

// Magic levels for story generation
export interface MagicLevel {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  description: string;
}

export const MAGIC_LEVELS: MagicLevel[] = [
  {
    id: 'little',
    name: 'A Little Magic',
    nameHe: 'מעט',
    icon: '✨',
    description: 'סיפור קרוב למציאות עם נגיעה קלה של קסם',
  },
  {
    id: 'medium',
    name: 'Some Magic',
    nameHe: 'בינוני',
    icon: '🌟',
    description: 'עולם עם אלמנטים קסומים משולבים',
  },
  {
    id: 'lots',
    name: 'Lots of Magic',
    nameHe: 'הרבה',
    icon: '💫',
    description: 'עולם קסום ומופלא עם הרפתקאות',
  },
  {
    id: 'maximum',
    name: 'Maximum Magic',
    nameHe: 'הכי הרבה',
    icon: '🪄',
    description: 'עולם פנטזיה מלא בקסמים והפתעות',
  },
];

export const DEFAULT_MAGIC_LEVEL = 'medium';

// Default image style for generation (realistic cinematic)
export const DEFAULT_IMAGE_STYLE: ImageStyle = {
  id: 'magical-cinematic',
  name: 'Magical Cinematic Story',
  nameHe: 'סיפור קסום קולנועי',
  icon: '🌟',
  prompt: `High-quality cinematic children's story illustration in a magical animated-film style. Soft realism with expressive, stylized features. Full-body character centered in the frame. Luminous lighting with gentle glow and rich color gradients. Enchanted, fairytale atmosphere suitable for ages 6–12 (more mature than preschool; slightly more detailed and less babyish, while still child-friendly). Smooth painterly textures with detailed but friendly character design. Artwork fills the entire canvas edge-to-edge as pure illustration. Background elements are soft, magical, and non-distracting. IMPORTANT: No text, no letters, no words, no writing, no symbols, no signs with text, no labels — pure visual artwork only.`,
};

// Keep IMAGE_STYLES array for backwards compatibility (single style)
export const IMAGE_STYLES: ImageStyle[] = [DEFAULT_IMAGE_STYLE];

// API configuration
export const API_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1500,  // For 6-page story with 2-3 sentences each
  powersMaxTokens: 500,
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  storyGeneration: 8000,  // Story generation time
  powersAnalysis: 6000,
  fadeTransition: 500,
  progressComplete: 400,
};

// UI text constants
export const UI_TEXT = {
  headerTitle: 'בוא נכתוב את הסיפור שלנו ביחד',
  welcomeTitle: 'כאן נולדים סיפורים',
  welcomeSubtitle: 'מקום קסום ליצור סיפור משלך, צעד אחר צעד, בדרך שלך',
  startButton: 'בואו נתחיל סיפור',
  continueButton: 'המשך',
  finishButton: 'סיימתי!',
  storyLoadingTitle: 'הסיפור שלך נכתב...',
  storyLoadingSubtitle: 'קסם קורה ברגעים אלה ממש',
  storyReadyTitle: 'הסיפור שלך מוכן!',
  readStoryButton: 'קרא את הסיפור',
  showPowersButton: 'תעודת זהות של הילד',
  powersLoadingTitle: 'יוצרים את תעודת הזהות...',
  powersLoadingSubtitle: 'מגלים את מי שמסתתר מאחורי הסיפור',
  powersTitle: 'תעודת זהות של הגיבור',
  endTitle: 'הסיפור הזה שלך',
  endSubtitle: 'תמיד אפשר לחזור וליצור עוד אחד',
  restartButton: 'רוצה ליצור סיפור חדש?',
};

// ElevenLabs TTS configuration
export const ELEVENLABS_CONFIG = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
  voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID,
  modelId: import.meta.env.VITE_ELEVENLABS_MODEL_ID || 'eleven_v3', // Default to v3 model
};

// Image generation debug configuration
export const IMAGE_DEBUG_CONFIG = {
  enabled: import.meta.env.VITE_IMAGE_DEBUG === 'false' ? false : true, 
};

// Voice input configuration
export const VOICE_INPUT_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_SPEECH_API_KEY,
  language: 'he-IL', // Hebrew (Israel)
  encoding: 'WEBM_OPUS',
  sampleRateHertz: 48000,
  enableAutomaticPunctuation: true,
  beepFrequency: 800, // Hz
  beepDuration: 0.15, // seconds
  maxRecordingTime: 60000, // 60 seconds max recording time
  
  // Silence Detection (Auto-stop)
  silenceThreshold: 10, // Audio level threshold (0-255) - balanced for most environments
  silenceTimeout: 3000, // 3 seconds of silence before auto-stop
  audioCheckInterval: 100, // Check audio levels every 100ms
  minRecordingDuration: 500, // Minimum 0.5s recording before auto-stop can trigger
  
  // Real-Time Streaming Transcription (Optional)
  streamingEnabled: import.meta.env.VITE_VOICE_STREAMING_ENABLED === 'true',
  streamingInterval: 2000, // Send audio chunks every 2 seconds for interim transcription
};

// BASIC Ph analysis configuration
export const BASIC_PH_CONFIG = {
  enabled: import.meta.env.VITE_BASIC_PH_ENABLED === 'true',
};

// ZIP download configuration
export const ZIP_DOWNLOAD_CONFIG = {
  enabled: import.meta.env.VITE_ENABLE_ZIP_DOWNLOAD === 'true',
};

// Reading level configurations
import type { ReadingLevelConfig } from '@/types/literacy';

export const READING_LEVELS: ReadingLevelConfig[] = [
  {
    id: 'age_4_5',
    label: 'Ages 4-5',
    labelHe: 'גיל 4-5',
    ageRange: '4-5',
    description: 'Very simple sentences, basic vocabulary, lots of repetition',
    descriptionHe: 'משפטים פשוטים מאוד, אוצר מילים בסיסי',
    sentencesPerChapter: [2, 3],
    wordsPerSentence: [4, 8],
    vocabularyLevel: 'very_simple',
    quizDifficulty: 'recall',
  },
  {
    id: 'age_6_7',
    label: 'Ages 6-7',
    labelHe: 'גיל 6-7',
    ageRange: '6-7',
    description: 'Simple sentences, everyday vocabulary',
    descriptionHe: 'משפטים פשוטים, מילים יומיומיות',
    sentencesPerChapter: [3, 4],
    wordsPerSentence: [6, 12],
    vocabularyLevel: 'simple',
    quizDifficulty: 'recall',
  },
  {
    id: 'age_8_9',
    label: 'Ages 8-9',
    labelHe: 'גיל 8-9',
    ageRange: '8-9',
    description: 'Standard complexity, varied vocabulary',
    descriptionHe: 'רמה רגילה, אוצר מילים מגוון',
    sentencesPerChapter: [3, 5],
    wordsPerSentence: [8, 16],
    vocabularyLevel: 'standard',
    quizDifficulty: 'understanding',
  },
  {
    id: 'age_10_12',
    label: 'Ages 10-12',
    labelHe: 'גיל 10-12',
    ageRange: '10-12',
    description: 'Rich vocabulary, complex sentences, emotional depth',
    descriptionHe: 'אוצר מילים עשיר, משפטים מורכבים',
    sentencesPerChapter: [4, 6],
    wordsPerSentence: [10, 20],
    vocabularyLevel: 'rich',
    quizDifficulty: 'inference',
  },
];

export const DEFAULT_READING_LEVEL: ReadingLevelConfig['id'] = 'age_6_7';

