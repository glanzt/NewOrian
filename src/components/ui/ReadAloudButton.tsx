import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { generateSpeech, isTTSAvailable } from '../../services/ttsService';
import clsx from 'clsx';

interface ReadAloudButtonProps {
  text: string;
  /** Size variant - 'sm' for inline buttons, 'md' for standalone buttons */
  size?: 'sm' | 'md';
  /** Optional className for additional styling */
  className?: string;
  /** Label to show (optional) */
  label?: string;
}

type PlayState = 'idle' | 'loading' | 'playing';

export default function ReadAloudButton({ 
  text, 
  size = 'md',
  className,
  label 
}: ReadAloudButtonProps) {
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const currentTextRef = useRef<string>(text);

  // Clean up audio URL
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  // Cleanup on unmount or text change
  useEffect(() => {
    // If text changes, reset state
    if (currentTextRef.current !== text) {
      cleanupAudio();
      setPlayState('idle');
      setError(null);
      currentTextRef.current = text;
    }
    
    return () => {
      cleanupAudio();
    };
  }, [text, cleanupAudio]);

  const handleClick = async () => {
    // If currently playing - stop
    if (playState === 'playing') {
      cleanupAudio();
      setPlayState('idle');
      return;
    }

    // If loading - ignore click
    if (playState === 'loading') {
      return;
    }

    // Start loading and generating speech
    setPlayState('loading');
    setError(null);

    try {
      // Generate speech
      const blob = await generateSpeech(text);
      
      // Create URL for audio
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      
      // Create and play audio
      const audio = new Audio(url);
      audioRef.current = audio;

      // Handle audio events
      audio.onended = () => {
        setPlayState('idle');
      };

      audio.onerror = (e) => {
        console.error('[ReadAloud] Audio playback error:', e);
        setError('שגיאה בניגון');
        setPlayState('idle');
        cleanupAudio();
      };

      // Start playing
      await audio.play();
      setPlayState('playing');
    } catch (err) {
      console.error('[ReadAloud] Failed to generate speech:', err);
      setError('שגיאה בהקראה');
      setPlayState('idle');
      cleanupAudio();
    }
  };

  // Don't render if TTS is not available
  if (!isTTSAvailable()) {
    return null;
  }

  // Don't render if text is empty
  if (!text || !text.trim()) {
    return null;
  }

  const isSmall = size === 'sm';
  
  const buttonClasses = clsx(
    'flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-reading-400 focus:ring-offset-2',
    // Size variants
    isSmall ? [
      'w-8 h-8 p-1.5',
      'hover:bg-reading-100',
    ] : [
      'px-4 py-2.5',
      'bg-reading-100 hover:bg-reading-200',
    ],
    // States
    playState === 'loading' && 'opacity-70 cursor-wait',
    playState === 'playing' && 'bg-reading-200 ring-2 ring-reading-400',
    error && 'bg-red-50 hover:bg-red-100',
    className
  );

  const iconSize = isSmall ? 'w-4 h-4' : 'w-5 h-5';

  const getIcon = () => {
    if (playState === 'loading') {
      return <Loader2 className={clsx(iconSize, 'text-reading-600 animate-spin')} />;
    }
    if (playState === 'playing') {
      return <VolumeX className={clsx(iconSize, 'text-reading-700')} />;
    }
    if (error) {
      return <Volume2 className={clsx(iconSize, 'text-red-500')} />;
    }
    return <Volume2 className={clsx(iconSize, 'text-reading-600')} />;
  };

  const getLabel = () => {
    if (isSmall && !label) return null;
    if (playState === 'loading') return 'טוען...';
    if (playState === 'playing') return 'עצור';
    if (error) return error;
    return label || 'הקרא';
  };

  return (
    <button
      onClick={handleClick}
      disabled={playState === 'loading'}
      className={buttonClasses}
      aria-label={playState === 'playing' ? 'עצור הקראה' : 'הקרא טקסט'}
      title={playState === 'playing' ? 'לחץ כדי לעצור' : 'לחץ כדי להקריא'}
    >
      {getIcon()}
      {getLabel() && (
        <span className={clsx(
          'font-medium',
          isSmall ? 'text-xs' : 'text-sm',
          error ? 'text-red-600' : 'text-reading-700'
        )}>
          {getLabel()}
        </span>
      )}
    </button>
  );
}
