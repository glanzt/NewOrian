export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: 'science' | 'animals' | 'sports' | 'environment' | 'space' | 'technology' | 'culture' | 'health';
  source: string;
  publishedAt: Date;
  readingLevel: 1 | 2 | 3; // 1 = easy, 2 = medium, 3 = harder
  // For generating questions
  fullText?: string;
  // Which user interest this news matches
  interestId?: string;
  // Display name of the interest (e.g., "נועה קירל", "מסי")
  interestName?: string;
  // Priority score for sorting
  priorityScore?: number;
}

export const categoryLabels: Record<NewsItem['category'], { label: string; icon: string; color: string }> = {
  science: { label: 'מדע', icon: '🔬', color: 'bg-purple-100 text-purple-700' },
  animals: { label: 'חיות', icon: '🐾', color: 'bg-green-100 text-green-700' },
  sports: { label: 'ספורט', icon: '⚽', color: 'bg-blue-100 text-blue-700' },
  environment: { label: 'סביבה', icon: '🌍', color: 'bg-emerald-100 text-emerald-700' },
  space: { label: 'חלל', icon: '🚀', color: 'bg-indigo-100 text-indigo-700' },
  technology: { label: 'טכנולוגיה', icon: '💻', color: 'bg-cyan-100 text-cyan-700' },
  culture: { label: 'תרבות', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  health: { label: 'בריאות', icon: '❤️', color: 'bg-red-100 text-red-700' },
};

