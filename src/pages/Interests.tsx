import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import InterestsSelector from '../components/InterestsSelector';

export default function Interests() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-night-800/60 hover:text-night-800 mb-6 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
        <span>חזרה לדשבורד</span>
      </button>

      {/* Interests selector */}
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-card">
        <InterestsSelector onComplete={handleComplete} />
      </div>
    </motion.div>
  );
}
