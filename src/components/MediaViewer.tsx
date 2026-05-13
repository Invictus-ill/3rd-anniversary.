import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Gift } from 'lucide-react';

// Use relative import for the JSON config
import mediaData from '../data/mediaConfig.json';

interface MediaViewerProps {
  onComplete: () => void;
}

const MediaViewer = ({ onComplete }: MediaViewerProps) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(0);

  useEffect(() => {
    if (mediaData && mediaData.length > 0) {
      // Shuffle initial list
      setMediaList([...mediaData].sort(() => Math.random() - 0.5));
    }
  }, []);

  const handleNext = () => {
    if (mediaList.length === 0) return;
    
    // Pick a random next index that isn't the current one if possible
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
        <div className="max-w-md space-y-6">
          <p className="text-xl text-slate-600">
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full absolute inset-0 flex items-center justify-center"
        >
          <img 
            src={mediaList[currentIndex]}
            alt="Anniversary memory"
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 z-10 px-6">
        <div className="flex gap-4">
          <button 
            onClick={handleNext}
            className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all active:scale-95"
          >
            <RefreshCw className="w-8 h-8" />
          </button>
          
          {viewedCount >= 3 && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onComplete}
              className="px-8 py-4 bg-anniversary-love text-white rounded-full font-bold shadow-xl hover:bg-anniversary-rose transition-all flex items-center gap-2"
            >
              See my gifts <Gift className="w-5 h-5" />
            </motion.button>
          )}
        </div>
        
        <p className="text-white/60 text-sm font-medium">
          {viewedCount < 3 ? `View ${3 - viewedCount} more to unlock gifts` : "Gifts unlocked!"}
        </p>
      </div>

      <div className="absolute top-6 left-6 text-white/40 text-sm italic">
        3 Years of Us
      </div>
    </div>
  );
};

export default MediaViewer;
