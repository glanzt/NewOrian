import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Sparkles, Heart, Gamepad2, Film, Dog, Trophy } from 'lucide-react';
import { useStore, PREDEFINED_INTERESTS, type UserInterest } from '../store/useStore';

const categoryIcons: Record<UserInterest['category'], React.ReactNode> = {
  sports: <Trophy className="w-4 h-4" />,
  celebrity: <Sparkles className="w-4 h-4" />,
  animal: <Dog className="w-4 h-4" />,
  game: <Gamepad2 className="w-4 h-4" />,
  movie: <Film className="w-4 h-4" />,
  other: <Heart className="w-4 h-4" />,
};

const categoryColors: Record<UserInterest['category'], string> = {
  sports: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
  celebrity: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
  animal: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
  game: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
  movie: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
};

const categorySelectedColors: Record<UserInterest['category'], string> = {
  sports: 'bg-green-500 text-white border-green-500',
  celebrity: 'bg-pink-500 text-white border-pink-500',
  animal: 'bg-amber-500 text-white border-amber-500',
  game: 'bg-purple-500 text-white border-purple-500',
  movie: 'bg-blue-500 text-white border-blue-500',
  other: 'bg-gray-500 text-white border-gray-500',
};

interface InterestsSelectorProps {
  onComplete: () => void;
}

export default function InterestsSelector({ onComplete }: InterestsSelectorProps) {
  const { userInterests, addInterest, removeInterest, addCustomInterest, setHasSetInterests } = useStore();
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const isSelected = (id: string) => userInterests.some(i => i.id === id);

  const toggleInterest = (interest: UserInterest) => {
    if (isSelected(interest.id)) {
      removeInterest(interest.id);
    } else {
      addInterest(interest);
    }
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      addCustomInterest(customInput.trim());
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const handleComplete = () => {
    setHasSetInterests(true);
    onComplete();
  };

  // Group interests by category
  const groupedInterests = PREDEFINED_INTERESTS.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<UserInterest['category'], UserInterest[]>);

  const categoryNames: Record<UserInterest['category'], string> = {
    sports: 'ספורט',
    celebrity: 'כוכבים',
    animal: 'חיות',
    game: 'משחקים',
    movie: 'סרטים',
    other: 'אחר',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl shadow-lg mb-4"
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-night-900 mb-2">
          מה מעניין אותך?
        </h2>
        <p className="text-night-800/70">
          בחר נושאים שאתה אוהב ונמצא לך חדשות מעניינות!
        </p>
      </div>

      {/* Selected interests count */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft text-sm">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-night-800">
            נבחרו <strong className="text-primary-600">{userInterests.length}</strong> נושאים
          </span>
        </span>
      </div>

      {/* Interest categories */}
      <div className="space-y-4">
        {(Object.keys(groupedInterests) as UserInterest['category'][]).map((category) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-night-800/70">
              {categoryIcons[category]}
              <span>{categoryNames[category]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupedInterests[category].map((interest) => {
                const selected = isSelected(interest.id);
                return (
                  <motion.button
                    key={interest.id}
                    onClick={() => toggleInterest(interest)}
                    className={`
                      px-4 py-2 rounded-full border-2 font-medium text-sm
                      transition-all duration-200 flex items-center gap-2
                      ${selected 
                        ? categorySelectedColors[interest.category]
                        : categoryColors[interest.category]
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selected && <Check className="w-4 h-4" />}
                    {interest.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom interests */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-night-800/70">
          משהו אחר? הוסף בעצמך:
        </p>
        
        {/* Show added custom interests */}
        <AnimatePresence>
          {userInterests.filter(i => i.id.startsWith('custom-')).length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {userInterests.filter(i => i.id.startsWith('custom-')).map((interest) => (
                <motion.span
                  key={interest.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {interest.name}
                  <button
                    onClick={() => removeInterest(interest.id)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add custom input */}
        <AnimatePresence>
          {showCustomInput ? (
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                placeholder="למשל: נינג'ה, אייל שני..."
                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:outline-none text-right"
                autoFocus
              />
              <button
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomInput('');
                }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowCustomInput(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Plus className="w-5 h-5" />
              הוסף נושא משלך
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <motion.button
        onClick={handleComplete}
        disabled={userInterests.length === 0}
        className={`
          w-full py-4 rounded-2xl font-bold text-lg transition-all
          ${userInterests.length > 0
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
        whileHover={userInterests.length > 0 ? { scale: 1.02 } : {}}
        whileTap={userInterests.length > 0 ? { scale: 0.98 } : {}}
      >
        {userInterests.length === 0 
          ? 'בחרי לפחות נושא אחד' 
          : `יאללה, בואי נתחיל! (${userInterests.length} נושאים)`
        }
      </motion.button>
    </div>
  );
}
