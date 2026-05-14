import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft } from 'lucide-react';

// Use relative import for the JSON config
import mediaData from '../data/mediaConfig.json';

interface MemoriesViewerProps {
  onBack: () => void;
  onHome: () => void;
}

const MemoriesViewer = ({ onBack, onHome }: MemoriesViewerProps) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set([0]));
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (mediaData && mediaData.length > 0) {
      setMediaList(mediaData);
    }
  }, []);

  const totalPhotos = mediaList.length;
  const photosLeft = Math.max(0, totalPhotos - viewedIndices.size);

  // Auto transition to home when done
  useEffect(() => {
    if (totalPhotos > 0 && photosLeft === 0) {
      const timer = setTimeout(() => {
        onHome();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [photosLeft, totalPhotos, onHome]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoplay && mediaList.length > 0 && photosLeft > 0) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, currentIndex, mediaList, photosLeft]);

  const handleNext = () => {
    if (mediaList.length === 0) return;
    if (photosLeft === 0) return;

    const nextIndex = (currentIndex + 1) % mediaList.length;
    setCurrentIndex(nextIndex);
    setViewedIndices(prev => new Set(prev).add(nextIndex));
  };

  return (
    <div 
      className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      onClick={handleNext}
    >
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

      <div className="absolute top-6 left-6 z-50" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all shadow-lg font-serif italic text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Promise
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full border border-white/10">
          <span className="text-white font-serif font-black text-xl">{photosLeft}</span>
          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Left</span>
        </div>

        <button 
          onClick={() => setIsAutoplay(!isAutoplay)}
          className={`p-4 rounded-full border transition-all ${isAutoplay ? 'bg-white text-anniversary-love border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
        >
          {isAutoplay ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-[2px]" />}
        </button>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <div className="px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/60 text-xs font-black tracking-[0.2em] uppercase text-center font-serif">
          <span className="text-white">{currentIndex + 1}</span> / {totalPhotos}
          {photosLeft === 0 && <div className="text-[10px] text-anniversary-rose mt-1 animate-pulse italic">Restarting...</div>}
        </div>
      </div>

      {isAutoplay && photosLeft > 0 && (
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
