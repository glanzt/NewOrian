import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ArrowLeft, GripVertical, Check } from 'lucide-react';
import type { Item, ItemState } from '../../types';
import clsx from 'clsx';

interface DragOrderGameProps {
  item: Item;
  state: ItemState;
  selectedAnswer?: string[];  // eslint-disable-line @typescript-eslint/no-unused-vars
  onAnswer: (answer: string[]) => void;
  onNext: () => void;
}

// Note: selectedAnswer is part of the interface for consistency but not used in this component

export default function DragOrderGame({ item, state, onAnswer, onNext }: DragOrderGameProps) {
  // Initialize with shuffled options
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const isAnswered = state !== 'idle';
  const showNext = state === 'completed';

  useEffect(() => {
    // Shuffle options on mount
    const shuffled = [...item.options]
      .map(opt => opt.id)
      .sort(() => Math.random() - 0.5);
    setOrderedItems(shuffled);
  }, [item.id]);

  const handleSubmit = () => {
    onAnswer(orderedItems);
  };

  const getOptionText = (id: string) => {
    return item.options.find(opt => opt.id === id)?.text || '';
  };

  const isCorrectOrder = (id: string, index: number) => {
    if (!isAnswered) return null;
    const correctOrder = item.correctAnswer as string[];
    return correctOrder[index] === id;
  };

  return (
    <div>
      {/* Prompt */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-night-900 leading-relaxed">
          {item.prompt}
        </h2>
        <p className="text-night-800/60 mt-2">
          גרור את הפריטים לסדר הנכון
        </p>
      </div>

      {/* Draggable items */}
      <Reorder.Group
        axis="y"
        values={orderedItems}
        onReorder={setOrderedItems}
        className="space-y-3 mb-6"
      >
        {orderedItems.map((id, index) => {
          const correctStatus = isCorrectOrder(id, index);
          
          return (
            <Reorder.Item
              key={id}
              value={id}
              className={clsx(
                'drag-item flex items-center gap-3',
                !isAnswered && 'cursor-grab active:cursor-grabbing',
                isAnswered && correctStatus === true && 'bg-writing-50 border-writing-300',
                isAnswered && correctStatus === false && 'bg-red-50 border-red-300'
              )}
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              {/* Number indicator */}
              <span className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                isAnswered && correctStatus === true 
                  ? 'bg-writing-500 text-white' 
                  : isAnswered && correctStatus === false
                  ? 'bg-red-500 text-white'
                  : 'bg-sand-200 text-night-800'
              )}>
                {index + 1}
              </span>

              {/* Drag handle */}
              {!isAnswered && (
                <GripVertical className="w-5 h-5 text-sand-400" />
              )}

              {/* Text */}
              <span className="flex-1 text-lg text-night-900">
                {getOptionText(id)}
              </span>

              {/* Status icon */}
              {isAnswered && correctStatus !== null && (
                <span className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  correctStatus ? 'bg-writing-500' : 'bg-red-500'
                )}>
                  {correctStatus ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-sm">✗</span>
                  )}
                </span>
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Explanation */}
      {isAnswered && item.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-writing-50 border border-writing-200 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-writing-800 text-lg leading-relaxed">
              {item.explanation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Submit / Next button */}
      {!isAnswered ? (
        <motion.button
          onClick={handleSubmit}
          className="btn-primary w-full"
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

