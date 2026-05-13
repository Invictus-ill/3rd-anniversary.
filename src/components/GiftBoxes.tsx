import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gift as GiftIcon } from 'lucide-react';

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
    description: "₹3,000 to spend on whatever makes you feel beautiful at Bath & Body Works.",
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
  const [revealedGiftIndex, setRevealedGiftIndex] = useState(-1);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    // Initial romantic transition
    const timer = setTimeout(() => setShowTransition(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleChestClick = () => {
    if (chestState === 'closed') {
      setChestState('shaking');
      // Shake for a bit then open
      setTimeout(() => setChestState('open'), 800);
    } else if (chestState === 'open' && revealedGiftIndex < GIFTS.length - 1) {
      setRevealedGiftIndex(prev => prev + 1);
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
          <h2 className="text-3xl font-bold text-anniversary-love tracking-widest uppercase">
            Something Special Awaits...
          </h2>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-anniversary-pink flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <AnimatePresence>
        {chestState !== 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-anniversary-love drop-shadow-sm">
              Tap to open your Anniversary Chest
            </h2>
            
            <motion.div
              className="relative cursor-pointer"
              onClick={handleChestClick}
              animate={chestState === 'shaking' ? {
                rotate: [-2, 2, -2, 2, 0],
                x: [-5, 5, -5, 5, 0],
              } : {
                y: [0, -10, 0]
              }}
              transition={chestState === 'shaking' ? {
                duration: 0.2,
                repeat: 4
              } : {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Skeuomorphic Chest */}
              <div className="w-64 h-48 bg-anniversary-love rounded-2xl relative shadow-[0_20px_50px_rgba(225,29,72,0.4)] border-b-8 border-rose-900 group">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-anniversary-rose rounded-t-2xl border-b-4 border-rose-900 flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full shadow-inner border-4 border-yellow-600 flex items-center justify-center">
                    <div className="w-2 h-4 bg-yellow-700 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-yellow-500/30"></div>
                {/* Golden bands */}
                <div className="absolute left-8 top-0 bottom-0 w-4 bg-yellow-500 shadow-md"></div>
                <div className="absolute right-8 top-0 bottom-0 w-4 bg-yellow-500 shadow-md"></div>
                
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-4 bg-white/20 blur-2xl rounded-full -z-10"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {chestState === 'open' && (
        <div className="w-full max-w-5xl flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-anniversary-love mb-2">Your Gifts</h2>
            <p className="text-anniversary-rose font-medium">Tap each one to see the details</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 w-full perspective-1000">
            {GIFTS.map((gift, index) => {
              const isRevealed = revealedGiftIndex >= index;
              return (
                <AnimatePresence key={gift.id}>
                  {isRevealed && (
                    <motion.div
                      initial={{ 
                        opacity: 0, 
                        scale: 0, 
                        y: 100,
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
                        damping: 12, 
                        stiffness: 100,
                        delay: 0.1 
                      }}
                      className="w-64 h-80 group cursor-pointer"
                      onClick={() => setSelectedGift(gift)}
                    >
                      {/* Big Pop Effect on Entry */}
                      <motion.div 
                        initial={{ scale: 2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -inset-4 bg-white/30 blur-2xl rounded-full -z-10"
                      />
                      
                      <div className="w-full h-full bg-white rounded-3xl p-4 shadow-2xl border-4 border-anniversary-pink relative overflow-hidden flex flex-col items-center text-center hover:border-anniversary-love transition-colors">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-anniversary-rose to-anniversary-love" />
                        
                        <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 shadow-inner">
                          <img 
                            src={gift.image} 
                            alt={gift.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <h3 className="font-bold text-anniversary-love text-lg mb-1">{gift.title}</h3>
                        <div className="p-2 bg-anniversary-pink rounded-full">
                          <GiftIcon className="w-5 h-5 text-anniversary-love" />
                        </div>
                        
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mt-2"
                        >
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>

          {revealedGiftIndex < GIFTS.length - 1 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleChestClick}
              className="mt-16 px-12 py-5 bg-anniversary-love text-white rounded-full font-black text-xl shadow-[0_10px_30px_rgba(225,29,72,0.4)] hover:bg-anniversary-rose transition-all uppercase tracking-widest"
            >
              Reveal Next Gift!
            </motion.button>
          )}

          {revealedGiftIndex === GIFTS.length - 1 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onComplete}
              className="mt-16 px-12 py-5 bg-white text-anniversary-love border-4 border-anniversary-love rounded-full font-black text-xl shadow-2xl hover:bg-anniversary-pink transition-all flex items-center gap-3"
            >
              The Final Secret <Heart className="w-6 h-6 fill-anniversary-love" />
            </motion.button>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedGift(null)}
          >
            <motion.div 
              initial={{ scale: 0.5, rotateX: 45 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-[0_0_100px_rgba(255,255,255,0.2)] relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedGift(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-anniversary-love transition-colors"
              >
                <Sparkles className="w-8 h-8" />
              </button>

              <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-anniversary-pink ring-8 ring-anniversary-warm">
                <img 
                  src={selectedGift.image} 
                  alt={selectedGift.title} 
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-3xl font-black text-anniversary-love mb-4 flex items-center justify-center gap-3">
                <GiftIcon className="w-8 h-8" /> {selectedGift.title}
              </h3>
              
              <p className="text-slate-600 text-xl leading-relaxed mb-10 italic">
                "{selectedGift.description}"
              </p>

              <button 
                onClick={() => setSelectedGift(null)}
                className="w-full py-5 bg-anniversary-love text-white font-black text-xl rounded-2xl hover:bg-anniversary-rose transition-all shadow-xl"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftBoxes;
