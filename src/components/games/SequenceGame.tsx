import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import type { Item, ItemState } from '../../types';
import clsx from 'clsx';

interface SequenceGameProps {
  item: Item;
  state: ItemState;
  selectedAnswer?: string[];  // eslint-disable-line @typescript-eslint/no-unused-vars
  onAnswer: (answer: string[]) => void;
  onNext: () => void;
}

// Note: selectedAnswer is part of the interface for consistency but not used in this component

const slotLabels = ['התחלה', 'אמצע', 'סוף'];

export default function SequenceGame({ item, state, onAnswer, onNext }: SequenceGameProps) {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [availableOptions, setAvailableOptions] = useState<string[]>(
    item.options.map(opt => opt.id)
  );
  
  const isAnswered = state !== 'idle';
  const showNext = state === 'completed';
  const allSlotsFilled = slots.every(s => s !== null);

  const handleSelectOption = (optionId: string) => {
    // Find first empty slot
    const emptySlotIndex = slots.findIndex(s => s === null);
    if (emptySlotIndex === -1) return;

    const newSlots = [...slots];
    newSlots[emptySlotIndex] = optionId;
    setSlots(newSlots);
    setAvailableOptions(prev => prev.filter(id => id !== optionId));
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    if (isAnswered) return;
    const optionId = slots[slotIndex];
    if (!optionId) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setAvailableOptions(prev => [...prev, optionId]);
  };

  const handleReset = () => {
    setSlots([null, null, null]);
    setAvailableOptions(item.options.map(opt => opt.id));
  };

  const handleSubmit = () => {
    const answer = slots.filter((s): s is string => s !== null);
    onAnswer(answer);
  };

  const getOptionText = (id: string) => {
    return item.options.find(opt => opt.id === id)?.text || '';
  };

  const isSlotCorrect = (slotIndex: number) => {
    if (!isAnswered || !slots[slotIndex]) return null;
    const correctOrder = item.correctAnswer as string[];
    return correctOrder[slotIndex] === slots[slotIndex];
  };

  return (
    <div>
      {/* Prompt */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-night-900 leading-relaxed">
          {item.prompt}
        </h2>
        <p className="text-night-800/60 mt-2">
          בחר משפט לכל חלק בסיפור
        </p>
      </div>

      {/* Slots */}
      <div className="space-y-3 mb-6">
        {slots.map((slotContent, index) => {
          const correctStatus = isSlotCorrect(index);
          
          return (
            <div
              key={index}
              className={clsx(
                'rounded-2xl p-4 border-2 border-dashed transition-all',
                !slotContent && 'border-sand-300 bg-sand-50',
                slotContent && !isAnswered && 'border-reading-300 bg-reading-50',
                isAnswered && correctStatus === true && 'border-writing-400 bg-writing-50',
                isAnswered && correctStatus === false && 'border-red-400 bg-red-50'
              )}
            >
              {/* Slot label */}
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-sm font-semibold',
                  isAnswered && correctStatus === true ? 'text-writing-700' :
                  isAnswered && correctStatus === false ? 'text-red-700' :
                  slotContent ? 'text-reading-700' : 'text-sand-500'
                )}>
                  {slotLabels[index]}
                </span>
                {isAnswered && correctStatus !== null && (
                  <span className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-white text-sm',
                    correctStatus ? 'bg-writing-500' : 'bg-red-500'
                  )}>
                    {correctStatus ? '✓' : '✗'}
                  </span>
                )}
              </div>

              {/* Slot content */}
              {slotContent ? (
                <motion.button
                  onClick={() => handleRemoveFromSlot(index)}
                  disabled={isAnswered}
                  className={clsx(
                    'w-full text-right text-lg p-2 rounded-xl',
                    !isAnswered && 'hover:bg-white/50 cursor-pointer'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {getOptionText(slotContent)}
                </motion.button>
              ) : (
                <p className="text-sand-400 p-2">
                  בחר משפט מלמטה...
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Available options */}
      {!isAnswered && availableOptions.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-night-800/60 mb-3">בחר משפט:</p>
          <div className="space-y-2">
            {availableOptions.map((id) => (
              <motion.button
                key={id}
                onClick={() => handleSelectOption(id)}
                className="w-full text-right bg-white rounded-xl p-4 shadow-soft hover:shadow-card transition-all text-night-900"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {getOptionText(id)}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      {isAnswered && item.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-comprehension-50 border border-comprehension-200 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-comprehension-800 text-lg leading-relaxed">
              {item.explanation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isAnswered && (
          <button
            onClick={handleReset}
            className="btn-secondary px-4"
            disabled={availableOptions.length === item.options.length}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        {!isAnswered ? (
          <motion.button
            onClick={handleSubmit}
            disabled={!allSlotsFilled}
            className={clsx(
              'btn-primary flex-1',
              !allSlotsFilled && 'opacity-50 cursor-not-allowed'
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
            className="btn-primary flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            המשך
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

