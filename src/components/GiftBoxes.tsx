import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

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
  const [openedGifts, setOpenedGifts] = useState<number[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const handleBoxClick = (gift: Gift) => {
    if (openedGifts.includes(gift.id)) {
      setSelectedGift(gift);
      return;
    }
    setOpenedGifts([...openedGifts, gift.id]);
    setSelectedGift(gift);
  };

  return (
    <div className="min-h-screen bg-anniversary-pink flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <h2 className="text-3xl md:text-4xl font-bold text-anniversary-love mb-12 text-center">
        Pick a Mystery Box
      </h2>

      {/* 3D Carousel Container */}
      <div className="relative w-full h-[400px] perspective-1000 flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full preserve-3d flex items-center justify-center"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {GIFTS.map((gift, index) => {
            const angle = (index * 360) / GIFTS.length;
            const radius = 160; // Increased radius slightly

            return (
              <div
                key={gift.id}
                className="absolute w-40 h-40 preserve-3d"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                <motion.div
                  className="w-full h-full cursor-pointer preserve-3d"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.8
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleBoxClick(gift)}
                >
                  {/* Skeuomorphic Box */}
                  <div className="w-full h-full relative preserve-3d">
                    {/* Main Box Body */}
                    <div className={`w-full h-full bg-anniversary-love rounded-xl shadow-2xl flex items-center justify-center border-4 border-anniversary-rose transition-all ${openedGifts.includes(gift.id) ? 'opacity-50' : ''}`}>
                      <Heart className="w-12 h-12 text-white fill-white" />
                    </div>
                    
                    {/* Ribbon effect */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-anniversary-pink/30 backdrop-blur-sm pointer-events-none"></div>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-anniversary-pink/30 backdrop-blur-sm pointer-events-none"></div>
                    
                    {/* Glow effect for unopened */}
                    {!openedGifts.includes(gift.id) && (
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -inset-2 bg-white blur-xl rounded-full -z-10"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedGift && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedGift(null)}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-anniversary-love" />
              
              <div className="mb-6 rounded-2xl overflow-hidden shadow-inner border-2 border-anniversary-pink">
                <img 
                  src={selectedGift.image} 
                  alt={selectedGift.title} 
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-2xl font-bold text-anniversary-love mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> {selectedGift.title}
              </h3>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                {selectedGift.description}
              </p>

              <button 
                onClick={() => setSelectedGift(null)}
                className="w-full py-3 bg-anniversary-pink text-anniversary-love font-bold rounded-xl hover:bg-anniversary-pink/80 transition-colors"
              >
                Keep Exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12">
        {openedGifts.length === GIFTS.length && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="px-10 py-4 bg-anniversary-love text-white rounded-full font-bold shadow-xl hover:bg-anniversary-rose transition-all flex items-center gap-3 animate-bounce"
          >
            One Last Thing... <Heart className="w-5 h-5 fill-white" />
          </motion.button>
        )}
      </div>

      <p className="mt-4 text-anniversary-rose font-medium text-sm">
        {openedGifts.length} / {GIFTS.length} Boxes Opened
      </p>
    </div>
  );
};

export default GiftBoxes;
