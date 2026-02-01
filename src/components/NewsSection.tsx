import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, X, ArrowLeft, RefreshCw } from 'lucide-react';
import type { NewsItem } from '../types/news';
import { categoryLabels } from '../types/news';
import { getTodaysNews } from '../services/newsService';
import { useStore, type UserInterest } from '../store/useStore';
import NewsCard from './NewsCard';
import ReadAloudButton from './ui/ReadAloudButton';
import clsx from 'clsx';

interface NewsSectionProps {
  interests?: UserInterest[];
}

export default function NewsSection({ interests }: NewsSectionProps) {
  const navigate = useNavigate();
  const { userInterests: storeInterests } = useStore();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Use provided interests or fall back to store interests
  const effectiveInterests = interests || storeInterests;

  useEffect(() => {
    loadNews();
  }, [effectiveInterests]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const items = await getTodaysNews();
      setNews(items);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNews = (item: NewsItem) => {
    setSelectedNews(item);
  };

  const handleCloseNews = () => {
    setSelectedNews(null);
  };

  const handleStartPractice = () => {
    if (!selectedNews) return;
    // Navigate to practice page with the news item
    navigate('/news-practice', { state: { newsItem: selectedNews } });
    setSelectedNews(null);
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-reading-600" />
          <h2 className="text-xl font-bold text-night-900">
            {effectiveInterests.length > 0 ? 'חדשות בשבילך' : 'חדשות היום לילדים'}
          </h2>
        </div>
        <button
          onClick={loadNews}
          disabled={loading}
          className="p-2 rounded-xl hover:bg-sand-100 transition-colors text-night-800/50 hover:text-night-800"
          aria-label="רענן חדשות"
        >
          <RefreshCw className={clsx('w-5 h-5', loading && 'animate-spin')} />
        </button>
      </div>


      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-sand-100 rounded-2xl h-52 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {news.slice(0, 8).map((item, index) => (
            <NewsCard
              key={item.id}
              news={item}
              index={index}
              onSelect={handleSelectNews}
            />
          ))}
        </div>
      )}

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseNews}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleCloseNews}
                  className="absolute top-3 left-3 p-2 bg-white/90 rounded-full shadow-soft hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-night-800" />
                </button>
                {/* Topic badge - show interest name if personalized */}
                {selectedNews.interestName ? (
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md">
                    <span>❤️</span>
                    <span>{selectedNews.interestName}</span>
                  </div>
                ) : (
                  <div className={clsx(
                    'absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1',
                    categoryLabels[selectedNews.category].color
                  )}>
                    <span>{categoryLabels[selectedNews.category].icon}</span>
                    <span>{categoryLabels[selectedNews.category].label}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title with read aloud */}
                <div className="flex items-start gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-night-900 flex-1">
                    {selectedNews.title}
                  </h2>
                  <ReadAloudButton 
                    text={selectedNews.title} 
                    size="sm" 
                    className="flex-shrink-0 mt-1"
                  />
                </div>

                {/* Article text with read aloud */}
                <div className="bg-sand-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <p className="text-lg text-night-800 leading-relaxed flex-1">
                      {selectedNews.fullText || selectedNews.summary}
                    </p>
                    <ReadAloudButton 
                      text={selectedNews.fullText || selectedNews.summary} 
                      size="sm" 
                      className="flex-shrink-0"
                    />
                  </div>
                </div>

                {/* Source & Time */}
                <div className="flex items-center justify-between text-sm text-night-800/50 mb-6">
                  <span>מקור: {selectedNews.source}</span>
                  <span>היום</span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleStartPractice}
                  className="btn-primary w-full text-lg"
                >
                  <span>התחל תרגול הבנה</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

