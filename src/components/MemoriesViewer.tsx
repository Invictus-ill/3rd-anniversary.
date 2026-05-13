import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, Pause, ChevronLeft } from 'lucide-react';

// Use relative import for the JSON config
import mediaData from '../data/mediaConfig.json';

interface MemoriesViewerProps {
  onBack: () => void;
}

const MemoriesViewer = ({ onBack }: MemoriesViewerProps) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (mediaData && mediaData.length > 0) {
      setMediaList([...mediaData].sort(() => Math.random() - 0.5));
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoplay && mediaList.length > 0) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, currentIndex, mediaList]);

  const handleNext = () => {
    if (mediaList.length === 0) return;
    let nextIndex = (currentIndex + 1) % mediaList.length;
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full h-full absolute inset-0 flex items-center justify-center"
        >
          <img 
            src={mediaList[currentIndex]}
            alt="Memory"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Promise
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
        <button 
          onClick={handleNext}
          className="p-4 bg-anniversary-love text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCw className="w-8 h-8" />
        </button>

        <button 
          onClick={() => setIsAutoplay(!isAutoplay)}
          className={`p-4 rounded-full border transition-all ${isAutoplay ? 'bg-white text-anniversary-love border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
        >
          {isAutoplay ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-[2px]" />}
        </button>
      </div>

      {isAutoplay && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          key={currentIndex}
          transition={{ duration: 4, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-anniversary-love z-50"
        />
      )}
    </div>
  );
};

export default MemoriesViewer;
