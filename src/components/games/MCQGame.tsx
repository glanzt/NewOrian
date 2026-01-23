import { motion } from 'framer-motion';
import { Volume2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import type { Item, ItemState } from '../../types';
import clsx from 'clsx';

interface MCQGameProps {
  item: Item;
  state: ItemState;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
}

export default function MCQGame({ item, state, selectedAnswer, onAnswer, onNext }: MCQGameProps) {
  const isAnswered = state !== 'idle';
  const showNext = state === 'completed';

  // Play audio if available
  const playAudio = () => {
    if (item.promptAudioUrl) {
      const audio = new Audio(item.promptAudioUrl);
      audio.play();
    }
  };

  return (
    <div>
      {/* Prompt */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          {item.promptAudioUrl && (
            <button
              onClick={playAudio}
              className="flex-shrink-0 w-12 h-12 bg-reading-100 rounded-xl flex items-center justify-center hover:bg-reading-200 transition-colors"
              aria-label="השמע"
            >
              <Volume2 className="w-6 h-6 text-reading-600" />
            </button>
          )}
          <h2 className="text-2xl font-bold text-night-900 leading-relaxed">
            {item.prompt}
          </h2>
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {item.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = option.isCorrect;
          const showCorrect = isAnswered && isCorrect;
          const showWrong = isAnswered && isSelected && !isCorrect;

          return (
            <motion.button
              key={option.id}
              onClick={() => !isAnswered && onAnswer(option.id)}
              disabled={isAnswered}
              className={clsx(
                'option-chip relative overflow-hidden',
                !isAnswered && 'hover:bg-sand-50',
                isSelected && !isAnswered && 'option-chip-selected',
                showCorrect && 'option-chip-correct',
                showWrong && 'option-chip-wrong'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              {option.text}
              
              {/* Correct/Wrong indicator */}
              {showCorrect && (
                <span className="absolute top-2 left-2">
                  <CheckCircle className="w-6 h-6 text-writing-500" />
                </span>
              )}
              {showWrong && (
                <span className="absolute top-2 left-2">
                  <XCircle className="w-6 h-6 text-red-500" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && item.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-reading-50 border border-reading-200 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-reading-800 text-lg leading-relaxed">
              {item.explanation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Next button */}
      {showNext && (
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

