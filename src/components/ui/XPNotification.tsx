import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { TopicId } from '../../types';

const topicColors: Record<TopicId, { gradient: string; shadow: string }> = {
  reading: { 
    gradient: 'from-reading-400 to-reading-600',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.8)]'
  },
  comprehension: { 
    gradient: 'from-comprehension-400 to-comprehension-600',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.8)]'
  },
  writing: { 
    gradient: 'from-writing-400 to-writing-600',
    shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.8)]'
  },
  vocabulary: { 
    gradient: 'from-vocabulary-400 to-vocabulary-600',
    shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.8)]'
  },
};

// Approximate Y positions for each topic in sidebar (from top)
const topicPositions: Record<TopicId, number> = {
  reading: 280,
  comprehension: 360,
  writing: 440,
  vocabulary: 520,
};

interface XPGain {
  id: number;
  amount: number;
  topicId: TopicId;
}

export default function XPNotification() {
  const { sidebarOpen, lastXpGain } = useStore();
  const [gains, setGains] = useState<XPGain[]>([]);

  useEffect(() => {
    if (lastXpGain && lastXpGain.amount > 0) {
      const newGain: XPGain = {
        id: Date.now(),
        amount: lastXpGain.amount,
        topicId: lastXpGain.topicId,
      };
      setGains(prev => [...prev, newGain]);

      // Remove after animation completes
      setTimeout(() => {
        setGains(prev => prev.filter(g => g.id !== newGain.id));
      }, 2000);
    }
  }, [lastXpGain]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      <AnimatePresence>
        {gains.map((gain) => {
          const colors = topicColors[gain.topicId];
          const targetY = topicPositions[gain.topicId];
          
          // Calculate target X based on sidebar state
          const targetX = sidebarOpen ? window.innerWidth - 144 : window.innerWidth - 50;
          
          return (
            <motion.div
              key={gain.id}
              className={`absolute flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.gradient} text-white font-bold text-lg ${colors.shadow}`}
              initial={{ 
                opacity: 0, 
                scale: 0,
                // Start from center-top of screen (where XP indicator usually is)
                x: window.innerWidth / 2 - 50,
                y: 120,
              }}
              animate={{ 
                opacity: [0, 1, 1, 1, 0],
                scale: [0, 1.3, 1, 0.9, 0.6],
                // Animate in stages: appear -> float up -> move right -> into sidebar
                x: [
                  window.innerWidth / 2 - 50,  // Start center
                  window.innerWidth / 2 - 30,  // Slight float
                  window.innerWidth * 0.7,     // Move toward sidebar
                  targetX,                      // Into sidebar
                  targetX,                      // Stay
                ],
                y: [
                  120,           // Start position
                  80,            // Float up
                  targetY - 50,  // Arc toward target
                  targetY,       // Land on target bar
                  targetY,       // Stay
                ],
              }}
              transition={{ 
                duration: 1.8,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.15, 0.5, 0.8, 1],
              }}
            >
              <Zap className="w-5 h-5" />
              <span>+{Math.round(gain.amount)}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Particle trail effect */}
      <AnimatePresence>
        {gains.map((gain) => {
          const colors = topicColors[gain.topicId];
          return (
            <motion.div
              key={`trail-${gain.id}`}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.2 }}
            >
              {/* Small particles following the main XP */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`}
                  initial={{
                    x: window.innerWidth / 2 - 50 + (Math.random() - 0.5) * 40,
                    y: 120 + (Math.random() - 0.5) * 20,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: sidebarOpen ? window.innerWidth - 144 : window.innerWidth - 50,
                    y: topicPositions[gain.topicId],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.1 + i * 0.08,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
