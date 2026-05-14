import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface Gift {
  id: number;
  title: string;
  description: string;
  image: string;
}

const GIFTS: Gift[] = [
  {
    id: 1,
    title: "A Shopping Spree",
    description: "₹3,000 for whatever makes you feel beautiful at Bath & Body Works.",
    image: "/images/gift1.jpg"
  },
  {
    id: 2,
    title: "For Your Elegance",
    description: "A fancy hand harness, as beautiful and unique as you are.",
    image: "/images/gift2.jpg"
  },
  {
    id: 3,
    title: "Us Time",
    description: "A special date with me. No distractions, just us and our love.",
    image: "/images/gift3.jpeg"
  }
];

interface GiftBoxesProps {
  onComplete: () => void;
}

const GiftBoxes = ({ onComplete }: GiftBoxesProps) => {
  const [chestState, setChestState] = useState<'closed' | 'shaking' | 'open'>('closed');
  const [revealedCount, setRevealedCount] = useState(0);
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTransition(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = () => {
    if (chestState === 'closed') {
      setChestState('shaking');
      setTimeout(() => {
        setChestState('open');
      }, 600);
    } else if (chestState === 'open' && revealedCount < GIFTS.length) {
      setRevealedCount(prev => prev + 1);
    }
  };

  if (showTransition) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-anniversary-warm flex flex-col items-center justify-center text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="space-y-6"
        >
          <Heart className="w-20 h-20 text-anniversary-love fill-anniversary-love mx-auto" />
          <h2 className="text-3xl font-bold text-anniversary-love tracking-widest uppercase px-6">
            Something Special Awaits...
          </h2>
        </motion.div>
      </motion.div>
    );
  }

  const isAllRevealed = revealedCount === GIFTS.length;

  return (
    <div 
      className="min-h-screen bg-[#1a0b16] flex flex-col items-center justify-between p-6 overflow-hidden relative cursor-pointer"
      onClick={handleAction}
    >
      {/* Dynamic Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-anniversary-rose"
            style={{ 
              top: Math.random() * 100 + '%', 
              left: Math.random() * 100 + '%' 
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            <Sparkles size={16} />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div 
        className="text-center pt-8 z-10"
        animate={{ y: isAllRevealed ? 0 : -20 }}
      >
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
          {isAllRevealed ? "Your Rewards" : `Tap to Reveal (${GIFTS.length - revealedCount} remaining)`}
        </h2>
        {revealedCount === 0 && (
          <p className="text-anniversary-rose font-bold animate-pulse mt-2">Open the Chest!</p>
        )}
      </motion.div>

      {/* Main Stage (Cards) */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-6xl w-full px-4">
          {GIFTS.map((gift, index) => {
            const isShown = revealedCount > index;
            const isCurrentlyRevealing = revealedCount === index + 1;
            
            return (
              <AnimatePresence key={gift.id}>
                {isShown && (
                  <motion.div
                    layout
                    initial={{ 
                      opacity: 0, 
                      scale: 0.5, 
                      y: 300,
                      rotateY: 180
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      rotateY: 0
                    }}
                    transition={{ 
                      type: "spring", 
                      damping: 15, 
                      stiffness: 150 
                    }}
                    className={`w-full md:w-72 aspect-[3/4] max-w-[280px] bg-white rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.4)] border-4 ${isCurrentlyRevealing ? 'border-yellow-400 ring-4 ring-yellow-400' : 'border-white'}`}
                  >
                    <div className="h-full flex flex-col">
                      <div className="relative h-1/2 bg-anniversary-pink flex items-center justify-center overflow-hidden">
                        <img 
                          src={gift.image} 
                          alt={gift.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-4 right-4">
                          <p className="text-white font-black text-lg leading-tight uppercase italic">{gift.title}</p>
                        </div>
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between bg-white text-slate-800">
                        <p className="text-sm md:text-base font-bold leading-relaxed italic text-slate-600">
                          "{gift.description}"
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="bg-anniversary-love/10 text-anniversary-love px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-anniversary-love/20">
                            Rare Gift
                          </div>
                          <Heart className="w-5 h-5 text-anniversary-love fill-anniversary-love" />
                        </div>
                      </div>
                    </div>
                    {isCurrentlyRevealing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: 2 }}
                        className="absolute inset-0 bg-white z-50 pointer-events-none"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>

      {/* Footer (Chest) */}
      <div className="pb-12 md:pb-20 relative w-full flex flex-col items-center">
        {!isAllRevealed ? (
          <motion.div
            className="relative"
            animate={chestState === 'shaking' ? {
              rotate: [-2, 2, -2, 2, 0],
              x: [-10, 10, -10, 10, 0],
              scale: [1, 1.2, 1]
            } : {
              y: [0, -8, 0]
            }}
            transition={chestState === 'shaking' ? {
              duration: 0.15,
              repeat: 4
            } : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Skeuomorphic Chest at Bottom */}
            <div className={`w-48 h-36 ${chestState === 'open' ? 'bg-rose-950' : 'bg-anniversary-love'} rounded-2xl relative shadow-[0_-10px_50px_rgba(225,29,72,0.5)] border-b-8 border-rose-900 overflow-visible`}>
              {/* Lid */}
              <motion.div 
                className={`absolute top-0 left-0 w-full h-1/2 bg-anniversary-rose rounded-t-2xl border-b-4 border-rose-900 flex items-center justify-center z-10 origin-bottom`}
                animate={{ rotateX: chestState === 'open' ? -110 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="w-10 h-10 bg-yellow-400 rounded-full shadow-inner border-4 border-yellow-600 flex items-center justify-center">
                  <div className="w-2 h-4 bg-yellow-700 rounded-full"></div>
                </div>
              </motion.div>
              
              {/* Inner light when open */}
              {chestState === 'open' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/50 blur-3xl rounded-full z-0"
                />
              )}

              {/* Decorative elements */}
              <div className="absolute left-6 top-0 bottom-0 w-3 bg-yellow-500 shadow-sm z-20"></div>
              <div className="absolute right-6 top-0 bottom-0 w-3 bg-yellow-500 shadow-sm z-20"></div>
            </div>
            
            {/* Tap indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 flex flex-col items-center"
            >
              <div className="w-1 h-4 bg-yellow-400 rounded-full mb-1"></div>
              <p className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Tap Chest</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="px-12 py-5 bg-white text-anniversary-love border-4 border-anniversary-love rounded-full font-black text-xl shadow-2xl hover:bg-anniversary-pink transition-all flex items-center gap-3 group active:scale-95"
          >
            A Message for You <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default GiftBoxes;
