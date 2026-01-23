import type { Item, ItemState } from '../../types';
import MCQGame from './MCQGame';
import DragOrderGame from './DragOrderGame';
import SequenceGame from './SequenceGame';
import SelectChipsGame from './SelectChipsGame';

interface GameRendererProps {
  item: Item;
  state: ItemState;
  selectedAnswer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
}

export default function GameRenderer({ item, state, selectedAnswer, onAnswer, onNext }: GameRendererProps) {
  // Determine which game component to render based on item type
  const renderGame = () => {
    switch (item.type) {
      case 'mcq':
        return (
          <MCQGame
            item={item}
            state={state}
            selectedAnswer={selectedAnswer as string}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        );
      
      case 'drag-order':
        return (
          <DragOrderGame
            item={item}
            state={state}
            selectedAnswer={selectedAnswer as string[]}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        );
      
      case 'sequence':
        return (
          <SequenceGame
            item={item}
            state={state}
            selectedAnswer={selectedAnswer as string[]}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        );
      
      case 'select-chips':
        return (
          <SelectChipsGame
            item={item}
            state={state}
            selectedAnswer={selectedAnswer as string[]}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        );
      
      case 'drag-match':
        // For now, use MCQ as fallback
        return (
          <MCQGame
            item={item}
            state={state}
            selectedAnswer={selectedAnswer as string}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        );
      
      default:
        return (
          <MCQGame
            item={item}
            state={state}
            selectedAnswer={selectedAnswer as string}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        );
    }
  };

  return (
    <div className="card">
      {/* Topic badge */}
      <div className={`topic-badge-${item.topicId} mb-4 inline-flex`}>
        {item.topicId === 'reading' && '📖 קריאה'}
        {item.topicId === 'comprehension' && '🔍 הבנה'}
        {item.topicId === 'writing' && '✏️ כתיבה'}
        {item.topicId === 'vocabulary' && '💎 אוצר מילים'}
      </div>

      {/* Story text for comprehension */}
      {item.storyText && (
        <div className="bg-sand-50 rounded-2xl p-4 mb-6 text-lg leading-relaxed text-night-800">
          {item.storyText}
        </div>
      )}

      {/* Game content */}
      {renderGame()}
    </div>
  );
}

