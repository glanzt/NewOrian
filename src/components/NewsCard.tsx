import { motion } from 'framer-motion';
import { Clock, BookOpen, Heart } from 'lucide-react';
import type { NewsItem } from '../types/news';
import { categoryLabels } from '../types/news';
import clsx from 'clsx';

interface NewsCardProps {
  news: NewsItem;
  index: number;
  onSelect: (news: NewsItem) => void;
}

export default function NewsCard({ news, index, onSelect }: NewsCardProps) {
  const category = categoryLabels[news.category];
  
  // Format time as "לפני X שעות" or "היום"
  const formatTime = () => {
    const now = new Date();
    const diff = now.getTime() - news.publishedAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'עכשיו';
    if (hours < 24) return `לפני ${hours} שעות`;
    if (days === 1) return 'אתמול';
    if (days < 7) return `לפני ${days} ימים`;
    return 'השבוע';
  };

  // Check if this is personalized content (has interest name)
  const isPersonalized = !!news.interestName;

  return (
    <motion.button
      onClick={() => onSelect(news)}
      className="bg-white rounded-2xl shadow-soft overflow-hidden text-right w-full hover:shadow-card transition-shadow group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Topic badge - show interest name if personalized, otherwise category */}
        {isPersonalized ? (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm">
            <Heart className="w-3 h-3" />
            <span>{news.interestName}</span>
          </div>
        ) : (
          <div className={clsx(
            'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1',
            category.color
          )}>
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-night-900 text-sm leading-snug mb-2 line-clamp-2">
          {news.title}
        </h3>
        
        <p className="text-night-800/70 text-xs leading-relaxed line-clamp-4 mb-3">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-night-800/50">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime()}
          </span>
          <span className="flex items-center gap-1 text-reading-600 font-medium">
            <BookOpen className="w-3 h-3" />
            קרא ותרגל
          </span>
        </div>
      </div>
    </motion.button>
  );
}

