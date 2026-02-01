import type { NewsItem } from '../types/news';

// Curated kid-friendly news articles - concise single paragraph format
const kidsNews: NewsItem[] = [
  {
    id: 'kids-1',
    title: 'להקת BTS חוזרת להופיע יחד!',
    summary: 'להקת הקיפופ המפורסמת BTS מתכננת לחזור להופיע יחד אחרי שכל החברים סיימו את השירות הצבאי בקוריאה! המעריצים בכל העולם מתרגשים לראות את שבעת החברים שוב על הבמה.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'מוזיקה',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'להקת הקיפופ המפורסמת BTS מתכננת לחזור להופיע יחד אחרי שכל החברים סיימו את השירות הצבאי בקוריאה! המעריצים בכל העולם מתרגשים לראות את שבעת החברים שוב על הבמה עם ריקודים וזמרים.',
    interestId: 'kpop',
    interestName: 'K-POP',
  },
  {
    id: 'kids-2',
    title: 'ג׳ני מ-BLACKPINK בסרט חדש!',
    summary: 'ג׳ני מלהקת בלאקפינק תככב בסרט חדש בהוליווד! היא תשחק לצד שחקנים מפורסמים. ג׳ני ממשיכה להצליח גם בשירה וגם במשחק - היא באמת כוכבת אמיתית.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'מוזיקה',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'ג׳ני מלהקת בלאקפינק תככב בסרט חדש בהוליווד! היא תשחק לצד שחקנים מפורסמים. ג׳ני ממשיכה להצליח גם בשירה וגם במשחק - היא באמת כוכבת אמיתית מקוריאה הדרומית.',
    interestId: 'kpop',
    interestName: 'K-POP',
  },
  {
    id: 'kids-3',
    title: 'סדרת Hunter x Hunter חוזרת!',
    summary: 'חדשות מרגשות לאוהדי האנימה! הסדרה Hunter x Hunter תקבל עונה חדשה אחרי הפסקה ארוכה. גון וחבריו יצאו להרפתקאות חדשות מלאות אקשן ופעלולים מדהימים.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'אנימה',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'חדשות מרגשות לאוהדי האנימה! הסדרה Hunter x Hunter תקבל עונה חדשה אחרי הפסקה ארוכה. גון וחבריו יצאו להרפתקאות חדשות מלאות אקשן ופעלולים. גון רוצה להיות צייד כמו אביו.',
    interestId: 'hunter-x-hunter',
    interestName: 'Hunter x Hunter',
  },
  {
    id: 'kids-4',
    title: 'עונה חדשה של שקשוקה קראמל!',
    summary: 'הסדרה האהובה שקשוקה קראמל חוזרת עם פרקים חדשים בכאן 11! קראמל והכלב שקשוקה יעברו הרפתקאות חדשות עם חברים, משפחה ורגשות. כולם מחכים לראות מה יקרה.',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'טלוויזיה',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'הסדרה האהובה שקשוקה קראמל חוזרת עם פרקים חדשים בכאן 11! קראמל והכלב שקשוקה יעברו הרפתקאות חדשות עם חברים, משפחה ורגשות. הסדרה מציגה מצבים שילדים יכולים להזדהות איתם.',
    interestId: 'shakshuka-caramel',
    interestName: 'שקשוקה קראמל',
  },
  {
    id: 'kids-5',
    title: 'לילו וסטיץ׳ חוזרים בסרט חדש!',
    summary: 'הסרט לילו וסטיץ׳ חוזר עם שחקנים אמיתיים! הסרט על לילו והחייזר החמוד סטיץ׳ שלומדים יחד מה זה משפחה אמיתית - "אוהאנה". יגיע לדיסני פלוס בפברואר 2026.',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'קולנוע',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'הסרט לילו וסטיץ׳ חוזר עם שחקנים אמיתיים! הסרט על לילו והחייזר החמוד סטיץ׳ שלומדים יחד מה זה משפחה אמיתית - "אוהאנה". הסרט צולם בהוואי ויגיע לדיסני פלוס בפברואר 2026.',
    interestId: 'lilo-stitch',
    interestName: 'לילו וסטיץ׳',
  },
  {
    id: 'kids-6',
    title: 'נועה קירל מתכוננת לכבוש את אירופה',
    summary: 'נועה קירל שינתה את השם שלה באינסטגרם והתחילה לכתוב בצרפתית! היא העלתה טיזר לשיר חדש ונראה שהיא רוצה להצליח גם באירופה. נועה ייצגה את ישראל באירוויזיון.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'מוזיקה',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'נועה קירל שינתה את השם שלה באינסטגרם והתחילה לכתוב בצרפתית! היא העלתה טיזר לשיר חדש ונראה שהיא רוצה להצליח גם באירופה. נועה קירל היא זמרת ורקדנית מצליחה שייצגה את ישראל באירוויזיון.',
    interestId: 'noa-kirel',
    interestName: 'נועה קירל',
  },
  {
    id: 'kids-7',
    title: 'פסטיבל פריחת הדובדבן ביפן',
    summary: 'ביפן התחיל פסטיבל הסאקורה - פריחת הדובדבן! אנשים יוצאים לפארקים לראות את העצים הוורודים היפים. זה אחד החגים הכי מיוחדים ביפן והרבה תיירים מגיעים לראות.',
    imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'עולם',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'ביפן התחיל פסטיבל הסאקורה - פריחת הדובדבן! אנשים יוצאים לפארקים לראות את העצים הוורודים היפים. זה אחד החגים הכי מיוחדים ביפן. ילדים ביפן אוהבים אנימה ומנגה.',
    interestId: 'japan',
    interestName: 'יפן',
  },
  {
    id: 'kids-8',
    title: 'ריקוד קיפופ חדש כובש את הרשת',
    summary: 'ריקוד חדש מקוריאה הפך ויראלי ברשת! ילדים בכל העולם מנסים ללמוד את התנועות המיוחדות. להקות הקיפופ ידועות בריקודים המסודרים שלהן שכל חברי הלהקה עושים יחד.',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop',
    category: 'culture',
    source: 'מוזיקה',
    publishedAt: new Date(),
    readingLevel: 1,
    fullText: 'ריקוד חדש מקוריאה הפך ויראלי ברשת! ילדים בכל העולם מנסים ללמוד את התנועות המיוחדות. להקות הקיפופ ידועות בריקודים המסודרים שלהן שכל חברי הלהקה עושים יחד בצורה מושלמת.',
    interestId: 'kpop',
    interestName: 'K-POP',
  },
];

// Main function - get curated news for kids
export async function getTodaysNews(): Promise<NewsItem[]> {
  return kidsNews;
}

// Get news by ID
export async function getNewsById(id: string): Promise<NewsItem | null> {
  return kidsNews.find(item => item.id === id) || null;
}
