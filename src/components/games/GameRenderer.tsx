import type { Item, ItemState } from '../../types';
import MCQGame from './MCQGame';
import DragOrderGame from './DragOrderGame';
import SequenceGame from './SequenceGame';
import SelectChipsGame from './SelectChipsGame';
import ReadAloudButton from '../ui/ReadAloudButton';

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

      {/* Story text for comprehension with read aloud */}
      {item.storyText && (
        <div className="bg-sand-50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <p className="text-lg leading-relaxed text-night-800 flex-1">
              {item.storyText}
            </p>
            <ReadAloudButton 
              text={item.storyText} 
              size="sm" 
              className="flex-shrink-0"
            />
          </div>
        </div>
      )}

      {/* Game content */}
      {renderGame()}
    </div>
  );
}

