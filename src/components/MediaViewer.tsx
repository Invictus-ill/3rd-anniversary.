import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Gift } from 'lucide-react';

// Use relative import for the JSON config
import mediaData from '../data/mediaConfig.json';

interface MediaViewerProps {
  onComplete: () => void;
}

const MediaViewer = ({ onComplete }: MediaViewerProps) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const TARGET_VIEWS = 10;

  useEffect(() => {
    if (mediaData && mediaData.length > 0) {
      // Shuffle initial list
      setMediaList([...mediaData].sort(() => Math.random() - 0.5));
    }
  }, []);

  // Automatic transition when target is reached
  useEffect(() => {
    if (viewedCount >= TARGET_VIEWS) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500); // 1.5s delay to see the last image before transition
      return () => clearTimeout(timer);
    }
  }, [viewedCount, onComplete]);

  // Autoplay effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoplay && mediaList.length > 0 && viewedCount < TARGET_VIEWS) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, currentIndex, mediaList, viewedCount]);

  const handleNext = () => {
    if (mediaList.length === 0 || viewedCount >= TARGET_VIEWS) return;
    
    let nextIndex = Math.floor(Math.random() * mediaList.length);
    if (mediaList.length > 1 && nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % mediaList.length;
    }
    
    setCurrentIndex(nextIndex);
    setViewedCount(prev => prev + 1);
  };

  if (mediaList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-anniversary-warm p-6 text-center">
        <div className="max-w-md space-y-6 font-serif">
          <p className="text-2xl text-slate-600 italic">
            No memories loaded! <br/>
            Run <code>npm run refresh-media</code> to fetch links from Google Photos.
          </p>
          <button 
            onClick={onComplete}
            className="px-8 py-3 bg-anniversary-love text-white rounded-full font-bold shadow-lg hover:bg-anniversary-rose transition-colors flex items-center gap-2 mx-auto"
          >
            Skip to Gifts <Gift className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const viewsLeft = Math.max(0, TARGET_VIEWS - viewedCount);

  return (
    <div 
      className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      onClick={handleNext}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full absolute inset-0 flex items-center justify-center"
        >
          <img 
            src={mediaList[currentIndex]}
            alt="Anniversary memory"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-20 px-6">
        <div 
          className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full border border-white/10">
            <span className="text-white font-serif font-black text-xl">{viewsLeft}</span>
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Left</span>
          </div>

          <button 
            onClick={() => setIsAutoplay(!isAutoplay)}
            disabled={viewedCount >= TARGET_VIEWS}
            className={`p-4 rounded-full border transition-all ${viewedCount >= TARGET_VIEWS ? 'opacity-30' : ''} ${isAutoplay ? 'bg-white text-anniversary-love border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            title={isAutoplay ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isAutoplay ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-[2px]" />}
          </button>
        </div>

        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/80 text-xs md:text-sm font-black tracking-[0.3em] uppercase drop-shadow-md font-serif italic"
        >
          {viewedCount >= TARGET_VIEWS ? "Something Special Awaits..." : `Unlocking gifts in ${viewsLeft} more`}
        </motion.p>
      </div>

      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-anniversary-rose animate-pulse" />
        <span className="text-white/60 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase font-serif italic">
          3 Years of Us
        </span>
      </div>

      {isAutoplay && viewedCount < TARGET_VIEWS && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          key={currentIndex}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-anniversary-love z-30"
        />
      )}
    </div>
  );
};

export default MediaViewer;
