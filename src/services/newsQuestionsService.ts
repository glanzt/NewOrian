import type { Item, TopicId } from '../types';
import type { NewsItem } from '../types/news';

/**
 * Generates 4 learning games from a news article:
 * 1. Reading (קריאה) - Word recognition and reading
 * 2. Comprehension (הבנת הנקרא) - Understanding the text
 * 3. Writing (כתיבה) - Sentence construction
 * 4. Vocabulary (אוצר מילים) - Word meanings
 */
export function generateNewsQuestions(news: NewsItem): Item[] {
  const text = news.fullText || news.summary;
  const title = news.title;
  
  // Use interestName if available to anchor the analysis to the user's interest
  const interestName = news.interestName;
  
  // Analyze the article, passing the interest name for better anchoring
  const analysis = analyzeArticle(text, title, interestName);
  
  const questions: Item[] = [];
  const baseId = `news-${news.id}`;
  
  // Game 1: READING (קריאה) - Which word appears in the article?
  questions.push(createReadingGame(baseId, analysis, text));
  
  // Game 2: COMPREHENSION (הבנת הנקרא) - What is the article about?
  questions.push(createComprehensionGame(baseId, analysis, text));
  
  // Game 3: WRITING (כתיבה) - Arrange words to form a sentence
  questions.push(createWritingGame(baseId, analysis, text));
  
  // Game 4: VOCABULARY (אוצר מילים) - Word meanings
  questions.push(createVocabularyGame(baseId, analysis, text));
  
  return questions;
}

interface ArticleAnalysis {
  subject: string;           // Main subject (who/what the article is about)
  subjectType: 'person' | 'animal' | 'thing' | 'event' | 'place';
  mainAction: string;        // What happened
  details: string[];         // Specific facts/details
  sentences: string[];       // Clean sentences
  emotion: 'positive' | 'negative' | 'neutral';
  keywords: string[];        // Important content words
}

function analyzeArticle(text: string, title: string, interestName?: string): ArticleAnalysis {
  const fullText = `${title}. ${text}`;
  
  // Split into clean sentences
  const sentences = fullText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
  
  // Analyze WHO/WHAT the article is about
  let subject = findMainSubject(sentences);
  
  // If we have an interest name from the user's selection, use it to anchor the subject
  // This ensures questions are about what the user cares about (e.g., "מסי", "נועה קירל")
  if (interestName && interestName.length >= 2) {
    // Check if interest name appears in the text
    if (fullText.includes(interestName)) {
      subject = { text: interestName, confidence: 10 };
    } else {
      // Even if not exact match, prioritize the interest as the topic
      subject = { text: interestName, confidence: 5 };
    }
  }
  
  const subjectType = classifySubject(subject.text, fullText);
  
  // Find the main action/event
  const mainAction = findMainAction(sentences, subject.text);
  
  // Extract specific details
  const details = extractDetails(sentences, subject.text);
  
  // Determine emotional tone
  const emotion = analyzeEmotion(fullText);
  
  // Get content keywords - include interest name at the top if available
  let keywords = extractKeywords(fullText);
  if (interestName && !keywords.includes(interestName)) {
    keywords = [interestName, ...keywords.slice(0, 7)];
  }
  
  return {
    subject: subject.text,
    subjectType,
    mainAction,
    details,
    sentences,
    emotion,
    keywords,
  };
}

function findMainSubject(sentences: string[]): { text: string; confidence: number } {
  // Count word/phrase frequency to find the main subject
  const subjectCandidates = new Map<string, number>();
  
  // Look for repeated nouns/phrases
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    
    // Check 2-word phrases (more specific subjects)
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`.replace(/[.,!?:;]/g, '');
      if (phrase.length > 5 && !isCommonWord(phrase)) {
        subjectCandidates.set(phrase, (subjectCandidates.get(phrase) || 0) + 2);
      }
    }
    
    // Check single important words (>= 3 to include short names like "מסי")
    for (const word of words) {
      const clean = word.replace(/[.,!?:;""״׳']/g, '');
      if (clean.length >= 3 && !isCommonWord(clean)) {
        subjectCandidates.set(clean, (subjectCandidates.get(clean) || 0) + 1);
      }
    }
  }
  
  // First sentence usually has the main subject - boost those words
  if (sentences[0]) {
    const firstWords = sentences[0].split(/\s+/).slice(0, 4);
    for (const word of firstWords) {
      const clean = word.replace(/[.,!?:;""״׳']/g, '');
      if (clean.length > 2) {
        subjectCandidates.set(clean, (subjectCandidates.get(clean) || 0) + 3);
      }
    }
  }
  
  // Find the most likely subject
  let bestSubject = '';
  let bestScore = 0;
  
  for (const [candidate, score] of subjectCandidates) {
    if (score > bestScore && candidate.length > 2) {
      bestScore = score;
      bestSubject = candidate;
    }
  }
  
  return { text: bestSubject || sentences[0]?.split(/\s+/).slice(0, 2).join(' ') || '', confidence: bestScore };
}

function classifySubject(subject: string, text: string): ArticleAnalysis['subjectType'] {
  const lowerText = text.toLowerCase();
  const lowerSubject = subject.toLowerCase();
  
  // Animal indicators
  const animalWords = ['כלב', 'חתול', 'גור', 'חיה', 'ציפור', 'דג', 'סוס', 'פנדה', 'אריה', 'דוב', 'צב', 'דינוזאור', 'פיל', 'קוף', 'דולפין'];
  if (animalWords.some(w => lowerText.includes(w) || lowerSubject.includes(w))) {
    return 'animal';
  }
  
  // Person indicators
  const personWords = ['ילד', 'ילדה', 'אדם', 'איש', 'אישה', 'זמר', 'זמרת', 'שחקן', 'מדען', 'אסטרונאוט', 'מורה', 'תלמיד'];
  if (personWords.some(w => lowerText.includes(w) || lowerSubject.includes(w))) {
    return 'person';
  }
  
  // Place indicators
  const placeWords = ['עיר', 'מדינה', 'גן חיות', 'בית ספר', 'חוף', 'יער', 'הר'];
  if (placeWords.some(w => lowerText.includes(w))) {
    return 'place';
  }
  
  // Event indicators
  const eventWords = ['תחרות', 'משחק', 'הופעה', 'חגיגה', 'טקס', 'אירוע'];
  if (eventWords.some(w => lowerText.includes(w))) {
    return 'event';
  }
  
  return 'thing';
}

function findMainAction(sentences: string[], subject: string): string {
  // Look for sentences containing the subject and action verbs
  const actionVerbs = ['עשה', 'הלך', 'מצא', 'גילה', 'ניצח', 'הצליח', 'למד', 'בנה', 'יצר', 'שיחק', 'רץ', 'קפץ', 'שר', 'הופיע', 'זכה', 'הגיע', 'נולד', 'גדל'];
  
  for (const sentence of sentences) {
    // Check if sentence contains the subject or is about them
    const hasSubject = subject.split(/\s+/).some(w => sentence.includes(w));
    const hasAction = actionVerbs.some(v => sentence.includes(v));
    
    if (hasSubject && hasAction) {
      return sentence;
    }
  }
  
  // Fallback to first sentence that seems like an action
  for (const sentence of sentences) {
    if (actionVerbs.some(v => sentence.includes(v))) {
      return sentence;
    }
  }
  
  return sentences[0] || '';
}

function extractDetails(sentences: string[], _subject: string): string[] {
  const details: string[] = [];
  
  // Skip first sentence (usually main idea), look for supporting details
  for (let i = 1; i < sentences.length && details.length < 3; i++) {
    const sentence = sentences[i];
    // Look for sentences with specific information (numbers, descriptions)
    if (
      /\d+/.test(sentence) ||  // Has numbers
      sentence.length > 20 ||   // Longer = more detail
      sentence.includes('כי') || // Because - explains something
      sentence.includes('אחרי') || // After - sequence
      sentence.includes('לפני')    // Before - sequence
    ) {
      details.push(sentence);
    }
  }
  
  // If we don't have enough details, add remaining sentences
  for (let i = 1; i < sentences.length && details.length < 3; i++) {
    if (!details.includes(sentences[i])) {
      details.push(sentences[i]);
    }
  }
  
  return details;
}

function analyzeEmotion(text: string): ArticleAnalysis['emotion'] {
  const positiveWords = ['שמח', 'מצוין', 'נהדר', 'יפה', 'אהב', 'הצליח', 'ניצח', 'זכה', 'מרגש', 'מדהים', 'חמוד', 'מתוק', 'כיף'];
  const negativeWords = ['עצוב', 'קשה', 'נפל', 'פחד', 'בעיה', 'סכנה'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of positiveWords) {
    if (text.includes(word)) positiveCount++;
  }
  for (const word of negativeWords) {
    if (text.includes(word)) negativeCount++;
  }
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractKeywords(text: string): string[] {
  const words = text.split(/\s+/)
    .map(w => w.replace(/[.,!?:;""״׳']/g, ''))
    .filter(w => w.length >= 3 && !isCommonWord(w)); // Changed to >= 3 to include short names like "מסי"
  
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function isCommonWord(word: string): boolean {
  const commonWords = [
    'את', 'של', 'על', 'עם', 'אל', 'מן', 'הוא', 'היא', 'הם', 'הן', 'אני', 'אתה', 'את',
    'זה', 'זאת', 'אלה', 'כל', 'כמו', 'גם', 'רק', 'עוד', 'יותר', 'פחות', 'מאוד', 'כבר',
    'היה', 'היתה', 'היו', 'יהיה', 'להיות', 'שהיה', 'שהיא', 'שהם', 'אשר', 'כאשר',
    'לא', 'כן', 'אבל', 'או', 'אם', 'כי', 'למה', 'מה', 'מי', 'איך', 'איפה', 'מתי',
    'ואת', 'ועל', 'ושל', 'והוא', 'והיא', 'לו', 'לה', 'להם', 'שלו', 'שלה', 'שלהם',
  ];
  return commonWords.includes(word);
}

// ============ Game Generators - One per Topic ============

/**
 * READING GAME (קריאה) - Find the MISTAKE in the sentence
 * More challenging: identify which word was changed
 */
function createReadingGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Take a real sentence and create a version with a mistake
  const originalSentence = analysis.sentences.find(s => s.length > 15 && s.length < 60) || analysis.sentences[0];
  
  if (!originalSentence) {
    return createFallbackReadingGame(baseId, analysis, storyText);
  }
  
  const words = originalSentence.split(/\s+/).filter(w => w.length > 2);
  
  // Find a content word to replace (not common words)
  const contentWordIndex = words.findIndex(w => 
    w.length >= 3 && !isCommonWord(w) && !w.includes(analysis.subject)
  );
  
  if (contentWordIndex === -1 || words.length < 4) {
    return createFallbackReadingGame(baseId, analysis, storyText);
  }
  
  const originalWord = words[contentWordIndex];
  const wrongWord = getConfusingWord(originalWord);
  
  // Create sentence with mistake
  const wordsWithMistake = [...words];
  wordsWithMistake[contentWordIndex] = wrongWord;
  const sentenceWithMistake = wordsWithMistake.join(' ');
  
  const options = [
    { id: 'original', text: originalWord, isCorrect: true },
    { id: 'wrong', text: wrongWord, isCorrect: false },
    { id: 'fake1', text: getRandomDistractor(originalWord), isCorrect: false },
    { id: 'fake2', text: getRandomDistractor(originalWord), isCorrect: false },
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-reading`,
    lessonId: baseId,
    topicId: 'reading' as TopicId,
    gameType: 'mistake-hunter',
    type: 'mcq',
    prompt: `במשפט הזה יש טעות! איזו מילה צריכה להיות במקום המילה המסומנת?\n\n"${sentenceWithMistake.replace(wrongWord, `**${wrongWord}**`)}"`,
    options,
    correctAnswer: 'original',
    difficulty: 2,
    tags: ['reading', 'mistake-finding'],
    xpValue: 1,
    explanation: `המילה הנכונה היא "${originalWord}" ולא "${wrongWord}". המשפט המקורי: "${originalSentence}"`,
    storyText,
  };
}

function createFallbackReadingGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Fallback: Which sentence is FROM the article?
  const realSentence = analysis.sentences[0]?.slice(0, 50) || analysis.subject;
  
  const fakeSentences = [
    `${analysis.subject} טס לירח והחזיר גבינה`,
    `${analysis.subject} הפך לעץ גדול`,
    `${analysis.subject} נעלם ומצאו אותו בארון`,
  ];
  
  const options = [
    { id: 'real', text: realSentence + (realSentence.endsWith('.') ? '' : '...'), isCorrect: true },
    ...fakeSentences.slice(0, 3).map((text, i) => ({
      id: `fake-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-reading`,
    lessonId: baseId,
    topicId: 'reading' as TopicId,
    gameType: 'mistake-hunter',
    type: 'mcq',
    prompt: 'איזה משפט באמת מופיע בכתבה?',
    options,
    correctAnswer: 'real',
    difficulty: 2,
    tags: ['reading', 'sentence-recognition'],
    xpValue: 1,
    explanation: `המשפט מהכתבה הוא: "${realSentence}". השאר היו המצאה!`,
    storyText,
  };
}

function getConfusingWord(original: string): string {
  // Words that might be confused with the original
  const confusionPairs: Record<string, string[]> = {
    'שער': ['שיער', 'שעה', 'שיר'],
    'כדור': ['כדורגל', 'כדורסל', 'כידור'],
    'משחק': ['משהק', 'מישחק', 'משחה'],
    'שיר': ['שער', 'שיער', 'שור'],
    'בית': ['בת', 'בייט', 'בות'],
    'ילד': ['יילד', 'ילדה', 'יֶלֶד'],
    'גדול': ['גודל', 'גדולה', 'גדל'],
    'קטן': ['קטנה', 'קטין', 'קאטן'],
    'יפה': ['יפי', 'יפהפה', 'יופי'],
    'חדש': ['חדשה', 'חידש', 'חדיש'],
  };
  
  if (confusionPairs[original]) {
    return confusionPairs[original][Math.floor(Math.random() * confusionPairs[original].length)];
  }
  
  // Generic confusion - swap letters or add letter
  const confusions = ['מטוס', 'רכבת', 'אופניים', 'כלב', 'חתול', 'שמש', 'ירח', 'כוכב'];
  return confusions[Math.floor(Math.random() * confusions.length)];
}

function getRandomDistractor(original: string): string {
  const distractors = [
    'שולחן', 'כיסא', 'מחברת', 'עפרון', 'תיק', 'ספר', 
    'דלת', 'חלון', 'שעון', 'טלפון', 'מראה', 'כובע'
  ];
  return distractors.filter(d => d !== original)[Math.floor(Math.random() * (distractors.length - 1))];
}

/**
 * COMPREHENSION GAME (הבנת הנקרא) - Deep understanding
 * WHY/HOW questions, cause-effect, inference
 */
function createComprehensionGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Randomly choose question type for variety
  const questionType = Math.random();
  
  if (questionType < 0.33) {
    // Type 1: WHY question - inference
    return createWhyQuestion(baseId, analysis, storyText);
  } else if (questionType < 0.66) {
    // Type 2: What happened FIRST/THEN
    return createSequenceQuestion(baseId, analysis, storyText);
  } else {
    // Type 3: What can we LEARN/CONCLUDE
    return createConclusionQuestion(baseId, analysis, storyText);
  }
}

function createWhyQuestion(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  const mainAction = analysis.mainAction || analysis.sentences[0];
  
  // Generate a WHY question based on the content
  const whyPrompts: Record<ArticleAnalysis['subjectType'], string> = {
    person: `למה ${analysis.subject} עשה/עשתה את מה שמתואר בכתבה?`,
    animal: `למה ${analysis.subject} התנהג/ה כך לפי הכתבה?`,
    thing: `למה מדברים על ${analysis.subject} בכתבה?`,
    event: `למה האירוע הזה חשוב לפי הכתבה?`,
    place: `למה ${analysis.subject} מיוחד לפי הכתבה?`,
  };
  
  // Create logical answer from details
  const correctAnswer = analysis.details[0] 
    ? `כי ${analysis.details[0].slice(0, 40)}...`
    : `כי זה קשור ל${analysis.subject}`;
  
  const wrongAnswers = [
    'כי הוא/היא רצה לישון',
    'כי היה משעמם בבית',
    'כי אמרו לו/לה לעשות את זה',
    'כי לא היה מה לאכול',
    'כי רצה לראות טלוויזיה',
  ].filter(a => !correctAnswer.includes(a.slice(3, 10)));
  
  const options = [
    { id: 'correct', text: correctAnswer, isCorrect: true },
    ...wrongAnswers.slice(0, 3).map((text, i) => ({
      id: `wrong-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-comprehension`,
    lessonId: baseId,
    topicId: 'comprehension' as TopicId,
    gameType: 'story-detective',
    type: 'mcq',
    prompt: whyPrompts[analysis.subjectType] || `למה הדברים בכתבה קרו?`,
    options,
    correctAnswer: 'correct',
    difficulty: 3,
    tags: ['comprehension', 'inference', 'why'],
    xpValue: 1,
    explanation: `התשובה נמצאת בכתבה! ${mainAction}`,
    storyText,
  };
}

function createSequenceQuestion(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Ask about what happened first or what led to what
  const events = analysis.sentences.slice(0, 3);
  
  if (events.length < 2) {
    return createConclusionQuestion(baseId, analysis, storyText);
  }
  
  const firstEvent = events[0].slice(0, 35) + '...';
  const secondEvent = events[1]?.slice(0, 35) + '...' || '';
  
  const options = [
    { id: 'correct', text: firstEvent, isCorrect: true },
    { id: 'wrong-1', text: secondEvent || 'הכל קרה ביחד', isCorrect: false },
    { id: 'wrong-2', text: 'שום דבר לא קרה קודם', isCorrect: false },
    { id: 'wrong-3', text: 'הסיפור מתחיל מהסוף', isCorrect: false },
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-comprehension`,
    lessonId: baseId,
    topicId: 'comprehension' as TopicId,
    gameType: 'story-detective',
    type: 'mcq',
    prompt: `מה קרה קודם בכתבה? מה הדבר הראשון שמסופר?`,
    options,
    correctAnswer: 'correct',
    difficulty: 2,
    tags: ['comprehension', 'sequence', 'order'],
    xpValue: 1,
    explanation: `הדבר הראשון שקרה: "${events[0]}". חשוב לשים לב לסדר!`,
    storyText,
  };
}

function createConclusionQuestion(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // What can we conclude/learn from the article?
  const conclusionOptions: Record<ArticleAnalysis['emotion'], { correct: string; wrong: string[] }> = {
    positive: {
      correct: `${analysis.subject} עשה/עשתה משהו מיוחד וטוב`,
      wrong: [
        `${analysis.subject} נכשל/ה במשימה`,
        'הסיפור מסתיים בצורה עצובה',
        'אף אחד לא שם לב למה שקרה',
      ],
    },
    negative: {
      correct: 'היו קשיים או אתגרים בסיפור',
      wrong: [
        'הכל היה קל ופשוט',
        'כולם היו שמחים מההתחלה',
        'לא היו בעיות בכלל',
      ],
    },
    neutral: {
      correct: `הכתבה מספרת על ${analysis.subject} ומה קרה`,
      wrong: [
        'הכתבה היא בדיחה ארוכה',
        'זה סיפור דמיוני לגמרי',
        'הכתבה לא מספרת כלום',
      ],
    },
  };
  
  const conclusionData = conclusionOptions[analysis.emotion];
  
  const options = [
    { id: 'correct', text: conclusionData.correct, isCorrect: true },
    ...conclusionData.wrong.map((text, i) => ({
      id: `wrong-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-comprehension`,
    lessonId: baseId,
    topicId: 'comprehension' as TopicId,
    gameType: 'story-detective',
    type: 'mcq',
    prompt: `מה אפשר להבין מהכתבה? מה המסקנה?`,
    options,
    correctAnswer: 'correct',
    difficulty: 3,
    tags: ['comprehension', 'conclusion', 'inference'],
    xpValue: 1,
    explanation: `מהכתבה אפשר להבין ש${conclusionData.correct}. כל הכבוד על ההבנה!`,
    storyText,
  };
}

/**
 * WRITING GAME (כתיבה) - Advanced sentence work
 * Fix grammar, complete sentences, or choose correct structure
 */
function createWritingGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Randomly choose writing challenge type
  const challengeType = Math.random();
  
  if (challengeType < 0.4) {
    // Type 1: Fix the sentence (grammar/structure)
    return createFixSentenceGame(baseId, analysis, storyText);
  } else if (challengeType < 0.7) {
    // Type 2: Complete the sentence with the RIGHT word
    return createCompleteSentenceGame(baseId, analysis, storyText);
  } else {
    // Type 3: Arrange words (but longer, more challenging)
    return createArrangeWordsGame(baseId, analysis, storyText);
  }
}

function createFixSentenceGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Create a sentence with grammatical error to fix
  const originalSentence = analysis.sentences.find(s => s.length > 15 && s.length < 50) || analysis.sentences[0];
  
  if (!originalSentence) {
    return createCompleteSentenceGame(baseId, analysis, storyText);
  }
  
  // Common grammar mistakes for Hebrew 2nd graders
  const grammarMistakes = [
    { wrong: 'הוא הלכה', correct: 'הוא הלך', rule: 'התאמת פועל לגוף' },
    { wrong: 'היא רץ', correct: 'היא רצה', rule: 'התאמת פועל לגוף' },
    { wrong: 'הילדים שמח', correct: 'הילדים שמחים', rule: 'התאמה לרבים' },
    { wrong: 'הכלב גדולה', correct: 'הכלב גדול', rule: 'התאמת תואר' },
  ];
  
  const mistake = grammarMistakes[Math.floor(Math.random() * grammarMistakes.length)];
  
  const options = [
    { id: 'correct', text: mistake.correct, isCorrect: true },
    { id: 'wrong', text: mistake.wrong, isCorrect: false },
    { id: 'wrong-2', text: mistake.wrong.split(' ').reverse().join(' '), isCorrect: false },
    { id: 'wrong-3', text: 'שניהם נכונים', isCorrect: false },
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-writing`,
    lessonId: baseId,
    topicId: 'writing' as TopicId,
    gameType: 'fix-sentence',
    type: 'mcq',
    prompt: `איזה משפט כתוב נכון מבחינה דקדוקית?`,
    options,
    correctAnswer: 'correct',
    difficulty: 3,
    tags: ['writing', 'grammar', 'fix-sentence'],
    xpValue: 1,
    explanation: `"${mistake.correct}" נכון כי ${mistake.rule}. "${mistake.wrong}" הוא שגוי!`,
    storyText,
  };
}

function createCompleteSentenceGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Create a meaningful sentence completion about the article
  const subject = analysis.subject;
  
  // Different completion templates based on content
  const templates = [
    {
      prompt: `השלם: "בכתבה סיפרו על ${subject} ש_____"`,
      correct: analysis.mainAction.slice(0, 30) || 'עשה משהו מיוחד',
      wrong: ['אכל גלידה בחורף', 'טס לירח', 'הפך לבלון'],
    },
    {
      prompt: `השלם: "הדבר המעניין בכתבה הוא ש_____"`,
      correct: `${subject} ${analysis.emotion === 'positive' ? 'הצליח/ה' : 'התמודד/ה עם אתגר'}`,
      wrong: ['שום דבר לא קרה', 'הכל היה רגיל', 'אף אחד לא היה שם'],
    },
    {
      prompt: `מה היית כותב/ת בכותרת לכתבה הזו?`,
      correct: `${subject} - ${analysis.emotion === 'positive' ? 'סיפור הצלחה' : 'סיפור מרגש'}`,
      wrong: ['מתכון לעוגה', 'תחזית מזג האוויר', 'פרסומת לממתקים'],
    },
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const options = [
    { id: 'correct', text: template.correct, isCorrect: true },
    ...template.wrong.map((text, i) => ({
      id: `wrong-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-writing`,
    lessonId: baseId,
    topicId: 'writing' as TopicId,
    gameType: 'sentence-builder',
    type: 'mcq',
    prompt: template.prompt,
    options,
    correctAnswer: 'correct',
    difficulty: 2,
    tags: ['writing', 'sentence-completion'],
    xpValue: 1,
    explanation: `התשובה הנכונה מתבססת על מה שקראת בכתבה על ${subject}!`,
    storyText,
  };
}

function createArrangeWordsGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Take a longer sentence for more challenge
  let sentence = analysis.sentences.find(s => s.length > 20 && s.length < 60) || analysis.mainAction;
  sentence = sentence?.replace(/[.,!?:;]/g, '').trim() || analysis.subject;
  
  // Split into 5-6 words for challenge
  const words = sentence.split(/\s+/).filter(w => w.length > 1).slice(0, 6);
  
  if (words.length >= 4) {
    const options = words.map((text, i) => ({
      id: `word-${i}`,
      text,
      isCorrect: false,
    }));
    
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    
    return {
      id: `${baseId}-writing`,
      lessonId: baseId,
      topicId: 'writing' as TopicId,
      gameType: 'sentence-builder',
      type: 'drag-order',
      prompt: `סדר את המילים למשפט הגיוני ונכון:\n(רמז: המשפט קשור ל${analysis.subject})`,
      options: shuffledOptions,
      correctAnswer: words.map((_, i) => `word-${i}`),
      difficulty: 3,
      tags: ['writing', 'sentence-order'],
      xpValue: 1,
      explanation: `המשפט הנכון: "${words.join(' ')}". מבנה משפט חשוב!`,
      storyText,
      sequenceItems: words,
    };
  }
  
  return createCompleteSentenceGame(baseId, analysis, storyText);
}

/**
 * VOCABULARY GAME (אוצר מילים) - Advanced word work
 * Synonyms, antonyms, word families, contextual meaning
 */
function createVocabularyGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Randomly choose vocabulary challenge type
  const challengeType = Math.random();
  
  if (challengeType < 0.35) {
    // Type 1: Synonyms - find similar meaning
    return createSynonymGame(baseId, analysis, storyText);
  } else if (challengeType < 0.65) {
    // Type 2: Antonyms - find opposite
    return createAntonymGame(baseId, analysis, storyText);
  } else {
    // Type 3: Context meaning - what does the word mean HERE
    return createContextMeaningGame(baseId, analysis, storyText);
  }
}

function createSynonymGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Common words with synonyms for 2nd graders
  const synonymPairs: Array<{ word: string; synonym: string; wrong: string[] }> = [
    { word: 'גדול', synonym: 'ענק', wrong: ['קטן', 'צר', 'נמוך'] },
    { word: 'שמח', synonym: 'עליז', wrong: ['עצוב', 'כועס', 'עייף'] },
    { word: 'יפה', synonym: 'נאה', wrong: ['מכוער', 'משעמם', 'רגיל'] },
    { word: 'מהר', synonym: 'במהירות', wrong: ['לאט', 'בעצלות', 'אחר כך'] },
    { word: 'רץ', synonym: 'דהר', wrong: ['עמד', 'ישב', 'שכב'] },
    { word: 'אמר', synonym: 'סיפר', wrong: ['שתק', 'שמע', 'ראה'] },
    { word: 'הלך', synonym: 'צעד', wrong: ['עצר', 'נשאר', 'חזר'] },
    { word: 'טוב', synonym: 'מצוין', wrong: ['רע', 'גרוע', 'נורא'] },
    { word: 'חזק', synonym: 'עצום', wrong: ['חלש', 'רך', 'שביר'] },
    { word: 'חדש', synonym: 'טרי', wrong: ['ישן', 'עתיק', 'שבור'] },
  ];
  
  // Find a word that might appear in the text or pick random
  let pair = synonymPairs.find(p => storyText.includes(p.word));
  if (!pair) {
    pair = synonymPairs[Math.floor(Math.random() * synonymPairs.length)];
  }
  
  const options = [
    { id: 'correct', text: pair.synonym, isCorrect: true },
    ...pair.wrong.map((text, i) => ({
      id: `wrong-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-vocabulary`,
    lessonId: baseId,
    topicId: 'vocabulary' as TopicId,
    gameType: 'gold-word',
    type: 'mcq',
    prompt: `איזו מילה דומה במשמעות ל"${pair.word}"? (מילה נרדפת)`,
    options,
    correctAnswer: 'correct',
    difficulty: 2,
    tags: ['vocabulary', 'synonyms'],
    xpValue: 1,
    explanation: `"${pair.synonym}" ו"${pair.word}" הן מילים נרדפות - יש להן משמעות דומה!`,
    storyText,
  };
}

function createAntonymGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Common words with antonyms for 2nd graders
  const antonymPairs: Array<{ word: string; antonym: string; wrong: string[] }> = [
    { word: 'גדול', antonym: 'קטן', wrong: ['ענק', 'רחב', 'גבוה'] },
    { word: 'שמח', antonym: 'עצוב', wrong: ['עליז', 'צוהל', 'מאושר'] },
    { word: 'חם', antonym: 'קר', wrong: ['רותח', 'חמים', 'לוהט'] },
    { word: 'מהר', antonym: 'לאט', wrong: ['במהירות', 'בריצה', 'מיד'] },
    { word: 'עלה', antonym: 'ירד', wrong: ['קפץ', 'טיפס', 'זינק'] },
    { word: 'פתח', antonym: 'סגר', wrong: ['נעל', 'הרים', 'משך'] },
    { word: 'התחיל', antonym: 'סיים', wrong: ['המשיך', 'פתח', 'יצא'] },
    { word: 'בא', antonym: 'הלך', wrong: ['הגיע', 'נכנס', 'חזר'] },
    { word: 'אהב', antonym: 'שנא', wrong: ['חיבב', 'העדיף', 'רצה'] },
    { word: 'זכר', antonym: 'שכח', wrong: ['ידע', 'הבין', 'למד'] },
  ];
  
  let pair = antonymPairs.find(p => storyText.includes(p.word));
  if (!pair) {
    pair = antonymPairs[Math.floor(Math.random() * antonymPairs.length)];
  }
  
  const options = [
    { id: 'correct', text: pair.antonym, isCorrect: true },
    ...pair.wrong.map((text, i) => ({
      id: `wrong-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-vocabulary`,
    lessonId: baseId,
    topicId: 'vocabulary' as TopicId,
    gameType: 'opposites-arena',
    type: 'mcq',
    prompt: `מה ההפך של "${pair.word}"? (מילה הפוכה)`,
    options,
    correctAnswer: 'correct',
    difficulty: 2,
    tags: ['vocabulary', 'antonyms'],
    xpValue: 1,
    explanation: `"${pair.antonym}" הוא ההפך של "${pair.word}". מילים הפוכות = אנטונימים!`,
    storyText,
  };
}

function createContextMeaningGame(baseId: string, analysis: ArticleAnalysis, storyText: string): Item {
  // Words with multiple meanings - understand from context
  const multiMeaningWords: Array<{ 
    word: string; 
    sentence: string;
    correctMeaning: string; 
    wrongMeanings: string[] 
  }> = [
    { 
      word: 'שער', 
      sentence: 'השחקן כבש שער',
      correctMeaning: 'גול בכדורגל',
      wrongMeanings: ['שיער בראש', 'דלת כניסה', 'מספר מתמטי'],
    },
    { 
      word: 'כוכב', 
      sentence: 'הוא כוכב גדול',
      correctMeaning: 'מפורסם ומוכשר',
      wrongMeanings: ['גוף בחלל', 'צורה גיאומטרית', 'תכשיט'],
    },
    { 
      word: 'לב', 
      sentence: 'היא שמה לב לפרטים',
      correctMeaning: 'תשומת לב, התרכזות',
      wrongMeanings: ['איבר בגוף', 'מרכז העיר', 'צורה של לב'],
    },
    { 
      word: 'יד', 
      sentence: 'הוא נתן יד',
      correctMeaning: 'עזר, סייע',
      wrongMeanings: ['איבר בגוף', 'ידית של דלת', 'כלי לכתיבה'],
    },
    { 
      word: 'ראש', 
      sentence: 'הוא עמד בראש',
      correctMeaning: 'מוביל, ראשון',
      wrongMeanings: ['איבר בגוף', 'חלק עליון', 'מחשבה'],
    },
  ];
  
  const wordData = multiMeaningWords[Math.floor(Math.random() * multiMeaningWords.length)];
  
  const options = [
    { id: 'correct', text: wordData.correctMeaning, isCorrect: true },
    ...wordData.wrongMeanings.map((text, i) => ({
      id: `wrong-${i}`,
      text,
      isCorrect: false,
    })),
  ].sort(() => Math.random() - 0.5);
  
  return {
    id: `${baseId}-vocabulary`,
    lessonId: baseId,
    topicId: 'vocabulary' as TopicId,
    gameType: 'gold-word',
    type: 'mcq',
    prompt: `במשפט "${wordData.sentence}" - מה הכוונה של המילה "${wordData.word}"?`,
    options,
    correctAnswer: 'correct',
    difficulty: 3,
    tags: ['vocabulary', 'context-meaning', 'multiple-meanings'],
    xpValue: 1,
    explanation: `במשפט הזה, "${wordData.word}" פירושו "${wordData.correctMeaning}". יש מילים עם כמה משמעויות!`,
    storyText,
  };
}
