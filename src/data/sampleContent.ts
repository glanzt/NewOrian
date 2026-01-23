import type { Item, TopicId } from '../types';

// Sample Hebrew content items for each topic
// In production, this would come from a database

export const sampleItems: Item[] = [
  // ======================================
  // READING ITEMS
  // ======================================
  {
    id: 'r1',
    lessonId: 'reading-1',
    topicId: 'reading',
    gameType: 'sound-match',
    type: 'mcq',
    prompt: 'בחר את המילה הנכונה:',
    options: [
      { id: 'r1-a', text: 'בית', isCorrect: true },
      { id: 'r1-b', text: 'בת', isCorrect: false },
      { id: 'r1-c', text: 'בוט', isCorrect: false },
      { id: 'r1-d', text: 'בטן', isCorrect: false },
    ],
    correctAnswer: 'r1-a',
    difficulty: 1,
    tags: ['short-words', 'basic'],
    xpValue: 1,
    explanation: 'המילה "בית" מתחילה באות ב׳ ומסתיימת בת׳. חשוב לשים לב לאותיות האמצעיות!',
  },
  {
    id: 'r2',
    lessonId: 'reading-2',
    topicId: 'reading',
    gameType: 'mistake-hunter',
    type: 'mcq',
    prompt: 'איזה משפט כתוב נכון?',
    options: [
      { id: 'r2-a', text: 'הילד רץ מהר.', isCorrect: true },
      { id: 'r2-b', text: 'הילד רץ מחר.', isCorrect: false },
      { id: 'r2-c', text: 'הילד רז מהר.', isCorrect: false },
      { id: 'r2-d', text: 'הילד רץ מההר.', isCorrect: false },
    ],
    correctAnswer: 'r2-a',
    difficulty: 2,
    tags: ['similar-letters', 'sentences'],
    xpValue: 1,
    explanation: '"מהר" פירושו במהירות. שים לב להבדל בין ה׳ לח׳ - הם נראים דומים אבל נשמעים אחרת!',
  },
  {
    id: 'r3',
    lessonId: 'reading-3',
    topicId: 'reading',
    gameType: 'sound-match',
    type: 'mcq',
    prompt: 'מהי המילה הנכונה למשפט: "אני ___ לבית הספר"',
    options: [
      { id: 'r3-a', text: 'הולך', isCorrect: true },
      { id: 'r3-b', text: 'הלך', isCorrect: false },
      { id: 'r3-c', text: 'הליך', isCorrect: false },
      { id: 'r3-d', text: 'הולכים', isCorrect: false },
    ],
    correctAnswer: 'r3-a',
    difficulty: 2,
    tags: ['common-words', 'no-nikud'],
    xpValue: 1,
    explanation: 'כשאנחנו מדברים על עצמנו (אני), אנחנו משתמשים ב"הולך" בהווה. "הלך" זה עבר, ו"הולכים" זה לרבים.',
  },
  {
    id: 'r4',
    lessonId: 'reading-4',
    topicId: 'reading',
    gameType: 'mistake-hunter',
    type: 'mcq',
    prompt: 'איזה משפט נכון מבחינת פיסוק?',
    options: [
      { id: 'r4-a', text: 'שלום! מה שלומך?', isCorrect: true },
      { id: 'r4-b', text: 'שלום מה שלומך', isCorrect: false },
      { id: 'r4-c', text: 'שלום, מה שלומך', isCorrect: false },
      { id: 'r4-d', text: '!שלום ?מה שלומך', isCorrect: false },
    ],
    correctAnswer: 'r4-a',
    difficulty: 2,
    tags: ['punctuation', 'sentences'],
    xpValue: 1,
    explanation: 'סימן קריאה (!) בא בסוף משפט נלהב, וסימן שאלה (?) בא בסוף שאלה. הם תמיד בסוף המשפט בעברית!',
  },
  {
    id: 'r5',
    lessonId: 'reading-1',
    topicId: 'reading',
    gameType: 'sound-match',
    type: 'mcq',
    prompt: 'בחר את המילה שמתאימה לתמונה: 🏠',
    options: [
      { id: 'r5-a', text: 'בית', isCorrect: true },
      { id: 'r5-b', text: 'גן', isCorrect: false },
      { id: 'r5-c', text: 'ים', isCorrect: false },
      { id: 'r5-d', text: 'עץ', isCorrect: false },
    ],
    correctAnswer: 'r5-a',
    difficulty: 1,
    tags: ['short-words', 'basic'],
    xpValue: 1,
    explanation: 'בית זה מקום שגרים בו. יש לו גג, קירות ודלת - בדיוק כמו בציור! 🏠',
  },

  // ======================================
  // COMPREHENSION ITEMS
  // ======================================
  {
    id: 'c1',
    lessonId: 'comprehension-1',
    topicId: 'comprehension',
    gameType: 'story-detective',
    type: 'mcq',
    prompt: 'מי הלך לגן?',
    storyText: 'דני קם בבוקר. הוא אכל ארוחת בוקר והלך לגן עם אמא. בגן הוא שיחק עם חברים.',
    options: [
      { id: 'c1-a', text: 'דני', isCorrect: true },
      { id: 'c1-b', text: 'אמא', isCorrect: false },
      { id: 'c1-c', text: 'אבא', isCorrect: false },
      { id: 'c1-d', text: 'הכלב', isCorrect: false },
    ],
    correctAnswer: 'c1-a',
    difficulty: 1,
    tags: ['who-what-where', 'detail'],
    xpValue: 1,
    skillTag: 'detail',
    explanation: 'כשרוצים לדעת "מי" עשה משהו, מחפשים בסיפור שם של אדם או דמות. כאן כתוב "הוא הלך לגן" - וה"הוא" מתייחס לדני.',
  },
  {
    id: 'c2',
    lessonId: 'comprehension-2',
    topicId: 'comprehension',
    gameType: 'sequence-builder',
    type: 'sequence',
    prompt: 'סדר את האירועים לפי הסדר הנכון:',
    storyText: 'מיכל התעוררה בבוקר. היא התלבשה ואכלה. אחר כך היא הלכה לבית הספר.',
    options: [
      { id: 'c2-a', text: 'מיכל הלכה לבית הספר', isCorrect: false },
      { id: 'c2-b', text: 'מיכל התעוררה', isCorrect: false },
      { id: 'c2-c', text: 'מיכל התלבשה ואכלה', isCorrect: false },
    ],
    correctAnswer: ['c2-b', 'c2-c', 'c2-a'],
    difficulty: 1,
    tags: ['sequence', 'order'],
    xpValue: 1,
    skillTag: 'sequence',
    explanation: 'כדי לסדר אירועים, מחפשים מילים כמו "קודם", "אחר כך", "בסוף". קוראים שוב את הסיפור ושמים לב מה קרה ראשון!',
  },
  {
    id: 'c3',
    lessonId: 'comprehension-3',
    topicId: 'comprehension',
    gameType: 'story-detective',
    type: 'mcq',
    prompt: 'איך הרגיש יוסי?',
    storyText: 'יוסי קיבל מתנה ליום ההולדת. הוא חייך וחיבק את סבא וסבתא.',
    options: [
      { id: 'c3-a', text: 'שמח', isCorrect: true },
      { id: 'c3-b', text: 'עצוב', isCorrect: false },
      { id: 'c3-c', text: 'כועס', isCorrect: false },
      { id: 'c3-d', text: 'עייף', isCorrect: false },
    ],
    correctAnswer: 'c3-a',
    difficulty: 2,
    tags: ['emotions', 'inference'],
    xpValue: 1,
    skillTag: 'emotions',
    explanation: 'כשמישהו מחייך ומחבק - זה סימן שהוא שמח! פעולות מראות לנו איך הדמות מרגישה.',
  },
  {
    id: 'c4',
    lessonId: 'comprehension-4',
    topicId: 'comprehension',
    gameType: 'story-detective',
    type: 'mcq',
    prompt: 'למה הכלב רץ לדלת?',
    storyText: 'נשמע צלצול בדלת. הכלב קפץ מהספה ורץ לדלת במהירות.',
    options: [
      { id: 'c4-a', text: 'כי הוא שמע צלצול', isCorrect: true },
      { id: 'c4-b', text: 'כי הוא רעב', isCorrect: false },
      { id: 'c4-c', text: 'כי הוא עייף', isCorrect: false },
      { id: 'c4-d', text: 'כי הוא רצה לישון', isCorrect: false },
    ],
    correctAnswer: 'c4-a',
    difficulty: 2,
    tags: ['cause-effect'],
    xpValue: 1,
    skillTag: 'cause-effect',
    explanation: 'סיבה ותוצאה: הצלצול (הסיבה) גרם לכלב לרוץ (התוצאה). מחפשים מה קרה קודם שגרם למשהו אחר!',
  },
  {
    id: 'c5',
    lessonId: 'comprehension-5',
    topicId: 'comprehension',
    gameType: 'story-detective',
    type: 'mcq',
    prompt: 'מה הכותרת הכי מתאימה לסיפור?',
    storyText: 'רוני אוהבת חיות. יש לה כלב בבית. היא מטיילת איתו כל יום ומשחקת איתו בפארק.',
    options: [
      { id: 'c5-a', text: 'רוני והכלב שלה', isCorrect: true },
      { id: 'c5-b', text: 'הפארק הגדול', isCorrect: false },
      { id: 'c5-c', text: 'יום בבית הספר', isCorrect: false },
      { id: 'c5-d', text: 'החתול השובב', isCorrect: false },
    ],
    correctAnswer: 'c5-a',
    difficulty: 2,
    tags: ['main-idea', 'title'],
    xpValue: 1,
    skillTag: 'main-idea',
    explanation: 'הכותרת צריכה לספר על הנושא המרכזי של הסיפור. הסיפור הזה מדבר על רוני ועל הכלב שלה - אז זו הכותרת הטובה!',
  },

  // ======================================
  // WRITING ITEMS
  // ======================================
  {
    id: 'w1',
    lessonId: 'writing-1',
    topicId: 'writing',
    gameType: 'sentence-builder',
    type: 'drag-order',
    prompt: 'סדר את המילים למשפט נכון:',
    options: [
      { id: 'w1-a', text: 'הילד', isCorrect: false },
      { id: 'w1-b', text: 'אוכל', isCorrect: false },
      { id: 'w1-c', text: 'תפוח', isCorrect: false },
      { id: 'w1-d', text: '.', isCorrect: false },
    ],
    correctAnswer: ['w1-a', 'w1-b', 'w1-c', 'w1-d'],
    difficulty: 1,
    tags: ['sentence-structure', 'word-order'],
    xpValue: 1,
    explanation: 'משפט בעברית מתחיל בנושא (מי?) - "הילד", אחר כך פועל (מה עושה?) - "אוכל", ואז מושא (את מה?) - "תפוח". וסיום בנקודה!',
  },
  {
    id: 'w2',
    lessonId: 'writing-2',
    topicId: 'writing',
    gameType: 'sentence-builder',
    type: 'drag-order',
    prompt: 'סדר את המילים למשפט נכון עם תואר:',
    options: [
      { id: 'w2-a', text: 'הכלב', isCorrect: false },
      { id: 'w2-b', text: 'הגדול', isCorrect: false },
      { id: 'w2-c', text: 'רץ', isCorrect: false },
      { id: 'w2-d', text: 'בפארק', isCorrect: false },
      { id: 'w2-e', text: '.', isCorrect: false },
    ],
    correctAnswer: ['w2-a', 'w2-b', 'w2-c', 'w2-d', 'w2-e'],
    difficulty: 1,
    tags: ['adjectives', 'sentence-structure'],
    xpValue: 1,
    explanation: 'תואר (מילת תיאור) בא אחרי השם שהוא מתאר. "הכלב הגדול" - קודם הכלב, אחר כך גדול. זה עוזר לנו לדמיין!',
  },
  {
    id: 'w3',
    lessonId: 'writing-4',
    topicId: 'writing',
    gameType: 'fix-sentence',
    type: 'mcq',
    prompt: 'איזה משפט נכון מבחינת פיסוק?',
    options: [
      { id: 'w3-a', text: 'אני אוהב לשחק, כי זה כיף.', isCorrect: true },
      { id: 'w3-b', text: 'אני אוהב לשחק כי זה כיף', isCorrect: false },
      { id: 'w3-c', text: 'אני אוהב, לשחק כי זה כיף.', isCorrect: false },
      { id: 'w3-d', text: 'אני אוהב לשחק כי, זה כיף.', isCorrect: false },
    ],
    correctAnswer: 'w3-a',
    difficulty: 2,
    tags: ['punctuation', 'fix-sentence'],
    xpValue: 1,
    explanation: 'פסיק (,) בא לפני מילת קישור כמו "כי", "אבל", "אז". נקודה (.) באה בסוף המשפט. זה עוזר לקורא לנשום!',
  },
  {
    id: 'w4',
    lessonId: 'writing-5',
    topicId: 'writing',
    gameType: 'paragraph-builder',
    type: 'sequence',
    prompt: 'סדר את המשפטים לסיפור עם התחלה, אמצע וסוף:',
    options: [
      { id: 'w4-a', text: 'בסוף כולם אכלו עוגה והיה כיף.', isCorrect: false },
      { id: 'w4-b', text: 'היום היה יום הולדת של דני.', isCorrect: false },
      { id: 'w4-c', text: 'כל החברים הגיעו עם מתנות.', isCorrect: false },
    ],
    correctAnswer: ['w4-b', 'w4-c', 'w4-a'],
    difficulty: 2,
    tags: ['story-structure', 'paragraph'],
    xpValue: 1,
    explanation: 'לכל סיפור יש התחלה (מה קרה?), אמצע (מה היה אחר כך?) וסוף (איך נגמר?). זה עוזר לקורא להבין את הסדר!',
  },
  {
    id: 'w5',
    lessonId: 'writing-3',
    topicId: 'writing',
    gameType: 'sentence-builder',
    type: 'mcq',
    prompt: 'איזו מילת קישור מתאימה? "אני רוצה גלידה ___ אני אוהב מתוק."',
    options: [
      { id: 'w5-a', text: 'כי', isCorrect: true },
      { id: 'w5-b', text: 'אבל', isCorrect: false },
      { id: 'w5-c', text: 'או', isCorrect: false },
      { id: 'w5-d', text: 'לא', isCorrect: false },
    ],
    correctAnswer: 'w5-a',
    difficulty: 2,
    tags: ['connecting-words'],
    xpValue: 1,
    explanation: '"כי" משמשת להסבר סיבה - למה אני רוצה גלידה? כי אני אוהב מתוק! "אבל" לעומת זאת מחברת דברים הפוכים.',
  },

  // ======================================
  // VOCABULARY ITEMS
  // ======================================
  {
    id: 'v1',
    lessonId: 'vocabulary-1',
    topicId: 'vocabulary',
    gameType: 'gold-word',
    type: 'mcq',
    prompt: 'מה המילה המתאימה? "הילד היה ___ אחרי הריצה."',
    options: [
      { id: 'v1-a', text: 'עייף', isCorrect: true },
      { id: 'v1-b', text: 'שמח', isCorrect: false },
      { id: 'v1-c', text: 'רעב', isCorrect: false },
      { id: 'v1-d', text: 'גדול', isCorrect: false },
    ],
    correctAnswer: 'v1-a',
    difficulty: 1,
    tags: ['context', 'adjectives'],
    xpValue: 1,
    explanation: 'אחרי ריצה הגוף עובד קשה ואנחנו מרגישים עייפים. ההקשר (אחרי הריצה) עוזר לנו לבחור את המילה הנכונה!',
  },
  {
    id: 'v2',
    lessonId: 'vocabulary-2',
    topicId: 'vocabulary',
    gameType: 'opposites-arena',
    type: 'mcq',
    prompt: 'מה המילה הדומה ל"שמח"?',
    options: [
      { id: 'v2-a', text: 'עליז', isCorrect: true },
      { id: 'v2-b', text: 'עצוב', isCorrect: false },
      { id: 'v2-c', text: 'כועס', isCorrect: false },
      { id: 'v2-d', text: 'עייף', isCorrect: false },
    ],
    correctAnswer: 'v2-a',
    difficulty: 1,
    tags: ['synonyms'],
    xpValue: 1,
    explanation: 'מילים נרדפות הן מילים עם משמעות דומה. "שמח" ו"עליז" שתיהן מתארות הרגשה טובה ועליזה!',
  },
  {
    id: 'v3',
    lessonId: 'vocabulary-3',
    topicId: 'vocabulary',
    gameType: 'opposites-arena',
    type: 'mcq',
    prompt: 'מה ההפך של "גדול"?',
    options: [
      { id: 'v3-a', text: 'קטן', isCorrect: true },
      { id: 'v3-b', text: 'ארוך', isCorrect: false },
      { id: 'v3-c', text: 'רחב', isCorrect: false },
      { id: 'v3-d', text: 'כבד', isCorrect: false },
    ],
    correctAnswer: 'v3-a',
    difficulty: 1,
    tags: ['opposites'],
    xpValue: 1,
    explanation: 'הפכים הן מילים עם משמעות הפוכה. גדול ↔ קטן, ארוך ↔ קצר, כבד ↔ קל. זה עוזר להרחיב את אוצר המילים!',
  },
  {
    id: 'v4',
    lessonId: 'vocabulary-4',
    topicId: 'vocabulary',
    gameType: 'word-family',
    type: 'select-chips',
    prompt: 'בחר את כל המילים ממשפחת "ספר":',
    options: [
      { id: 'v4-a', text: 'ספרייה', isCorrect: true },
      { id: 'v4-b', text: 'סיפור', isCorrect: true },
      { id: 'v4-c', text: 'ספרים', isCorrect: true },
      { id: 'v4-d', text: 'שולחן', isCorrect: false },
      { id: 'v4-e', text: 'מספר', isCorrect: true },
      { id: 'v4-f', text: 'עיפרון', isCorrect: false },
    ],
    correctAnswer: ['v4-a', 'v4-b', 'v4-c', 'v4-e'],
    difficulty: 2,
    tags: ['word-family', 'morphology'],
    xpValue: 1,
    explanation: 'משפחת מילים - מילים שנבנות מאותו שורש. ס-פ-ר: ספר, ספרייה, סיפור, מספר - כולן קשורות לספרים או לספירה!',
  },
  {
    id: 'v5',
    lessonId: 'vocabulary-5',
    topicId: 'vocabulary',
    gameType: 'word-family',
    type: 'select-chips',
    prompt: 'בחר את כל החיות:',
    options: [
      { id: 'v5-a', text: 'כלב', isCorrect: true },
      { id: 'v5-b', text: 'חתול', isCorrect: true },
      { id: 'v5-c', text: 'שולחן', isCorrect: false },
      { id: 'v5-d', text: 'ציפור', isCorrect: true },
      { id: 'v5-e', text: 'כיסא', isCorrect: false },
      { id: 'v5-f', text: 'דג', isCorrect: true },
    ],
    correctAnswer: ['v5-a', 'v5-b', 'v5-d', 'v5-f'],
    difficulty: 1,
    tags: ['categories', 'animals'],
    xpValue: 1,
    explanation: 'קטגוריה = קבוצה של דברים דומים. חיות הן יצורים חיים - כלב, חתול, ציפור, דג. שולחן וכיסא הם רהיטים!',
  },
  {
    id: 'v6',
    lessonId: 'vocabulary-7',
    topicId: 'vocabulary',
    gameType: 'opposites-arena',
    type: 'mcq',
    prompt: 'מה ההפך של "חם"?',
    options: [
      { id: 'v6-a', text: 'קר', isCorrect: true },
      { id: 'v6-b', text: 'רטוב', isCorrect: false },
      { id: 'v6-c', text: 'יבש', isCorrect: false },
      { id: 'v6-d', text: 'קשה', isCorrect: false },
    ],
    correctAnswer: 'v6-a',
    difficulty: 1,
    tags: ['opposites', 'adjectives'],
    xpValue: 1,
    explanation: 'חם ↔ קר - אלה הפכים שקשורים לטמפרטורה. רטוב ↔ יבש קשורים למים, וקשה ↔ רך קשורים למרקם.',
  },
  {
    id: 'v7',
    lessonId: 'vocabulary-1',
    topicId: 'vocabulary',
    gameType: 'gold-word',
    type: 'mcq',
    prompt: 'מה המילה המתאימה? "השמש ___ בשמיים."',
    options: [
      { id: 'v7-a', text: 'זורחת', isCorrect: true },
      { id: 'v7-b', text: 'רצה', isCorrect: false },
      { id: 'v7-c', text: 'שותה', isCorrect: false },
      { id: 'v7-d', text: 'ישנה', isCorrect: false },
    ],
    correctAnswer: 'v7-a',
    difficulty: 2,
    tags: ['context', 'verbs'],
    xpValue: 1,
    explanation: 'השמש זורחת - זה מה שהשמש עושה! היא מאירה ונותנת אור. לכל דבר יש פעולות שמתאימות לו.',
  },
];

// Helper function to get random items for daily practice
export function getRandomItems(count: number): Item[] {
  const itemsByTopic: Record<TopicId, Item[]> = {
    reading: sampleItems.filter(i => i.topicId === 'reading'),
    comprehension: sampleItems.filter(i => i.topicId === 'comprehension'),
    writing: sampleItems.filter(i => i.topicId === 'writing'),
    vocabulary: sampleItems.filter(i => i.topicId === 'vocabulary'),
  };

  const perTopic = Math.floor(count / 4);
  const result: Item[] = [];

  // Get equal items from each topic
  for (const topicId of ['reading', 'comprehension', 'writing', 'vocabulary'] as TopicId[]) {
    const topicItems = [...itemsByTopic[topicId]];
    const shuffled = topicItems.sort(() => Math.random() - 0.5);
    result.push(...shuffled.slice(0, perTopic));
  }

  // Shuffle final result
  return result.sort(() => Math.random() - 0.5);
}

// Helper function to get items for a specific lesson
export function getItemsForLesson(lessonId: string, topicId: TopicId): Item[] {
  // Get items that match the lesson
  let lessonItems = sampleItems.filter(i => i.lessonId === lessonId);
  
  // If not enough items for this specific lesson, supplement with topic items
  if (lessonItems.length < 8) {
    const topicItems = sampleItems.filter(
      i => i.topicId === topicId && !lessonItems.find(li => li.id === i.id)
    );
    const shuffled = topicItems.sort(() => Math.random() - 0.5);
    lessonItems = [...lessonItems, ...shuffled.slice(0, 8 - lessonItems.length)];
  }

  // Shuffle and return
  return lessonItems.sort(() => Math.random() - 0.5).slice(0, 10);
}
