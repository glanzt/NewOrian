import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import type { Item, ItemState } from '../../types';
import clsx from 'clsx';

interface SelectChipsGameProps {
  item: Item;
  state: ItemState;
  selectedAnswer?: string[];  // eslint-disable-line @typescript-eslint/no-unused-vars
  onAnswer: (answer: string[]) => void;
  onNext: () => void;
}

// Note: selectedAnswer is part of the interface for consistency but not used in this component

export default function SelectChipsGame({ item, state, onAnswer, onNext }: SelectChipsGameProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const isAnswered = state !== 'idle';
  const showNext = state === 'completed';

  const toggleSelection = (id: string) => {
    if (isAnswered) return;
    
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    onAnswer(Array.from(selected));
  };

  const isOptionCorrect = (id: string) => {
    if (!isAnswered) return null;
    const correctAnswers = item.correctAnswer as string[];
    const isInCorrect = correctAnswers.includes(id);
    const wasSelected = selected.has(id);
    
    if (isInCorrect && wasSelected) return true;
    if (!isInCorrect && wasSelected) return false;
    if (isInCorrect && !wasSelected) return 'missed';
    return null;
  };

  return (
    <div>
      {/* Prompt */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-night-900 leading-relaxed">
          {item.prompt}
        </h2>
        <p className="text-night-800/60 mt-2">
          בחר את כל התשובות הנכונות
        </p>
      </div>

      {/* Options as chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {item.options.map((option, index) => {
          const isSelected = selected.has(option.id);
          const correctStatus = isOptionCorrect(option.id);
          
          return (
            <motion.button
              key={option.id}
              onClick={() => toggleSelection(option.id)}
              disabled={isAnswered}
              className={clsx(
                'px-5 py-3 rounded-2xl font-medium text-lg transition-all tap-target',
                // Default state
                !isAnswered && !isSelected && 'bg-white shadow-soft hover:shadow-card text-night-800',
                // Selected (not answered)
                !isAnswered && isSelected && 'bg-reading-500 text-white shadow-glow-blue',
                // Correct (answered)
                correctStatus === true && 'bg-writing-500 text-white',
                // Wrong (answered)
                correctStatus === false && 'bg-red-500 text-white',
                // Missed (should have selected but didn't)
                correctStatus === 'missed' && 'bg-writing-100 text-writing-700 ring-2 ring-writing-400 ring-dashed'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isAnswered ? { scale: 1.05 } : {}}
              whileTap={!isAnswered ? { scale: 0.95 } : {}}
            >
              {option.text}
              
              {/* Status indicator */}
              {isAnswered && (correctStatus === true || correctStatus === false) && (
                <span className="mr-2">
                  {correctStatus === true ? '✓' : '✗'}
                </span>
              )}
              {correctStatus === 'missed' && (
                <span className="mr-2">← צריך לבחור</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selection count */}
      {!isAnswered && (
        <p className="text-center text-night-800/60 mb-4">
          נבחרו: {selected.size}
        </p>
      )}

      {/* Explanation */}
      {isAnswered && item.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vocabulary-50 border border-vocabulary-200 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-vocabulary-800 text-lg leading-relaxed">
              {item.explanation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Submit / Next button */}
      {!isAnswered ? (
        <motion.button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          className={clsx(
            'btn-primary w-full',
            selected.size === 0 && 'opacity-50 cursor-not-allowed'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          בדוק תשובה
          <Check className="w-5 h-5" />
        </motion.button>
      ) : showNext && (
        <motion.button
          onClick={onNext}
          className="btn-primary w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          המשך
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

