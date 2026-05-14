import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, RotateCcw } from 'lucide-react';

interface PromiseLetterProps {
  onStartOver: () => void;
  onViewMemories: () => void;
}

const PromiseLetter = ({ onStartOver, onViewMemories }: PromiseLetterProps) => {
  const [fullText, setFullText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    fetch('/data/letter.txt')
      .then(res => res.text())
      .then(text => setFullText(text))
      .catch(err => console.error("Failed to load letter", err));
  }, []);

  useEffect(() => {
    if (!fullText) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 30); // Adjust speed here (ms per character)

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="min-h-dvh bg-anniversary-warm flex flex-col items-center p-4 md:p-12 overflow-y-auto relative">
      {/* Background Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: Math.random() * 100 + "vw", scale: Math.random() * 0.5 + 0.5 }}
            animate={{ y: "-10vh" }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              delay: Math.random() * 20,
              ease: "linear" 
            }}
            className="absolute text-anniversary-love"
          >
            <Heart fill="currentColor" size={Math.random() * 24 + 12} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="max-w-3xl w-full relative group mt-10 mb-20"
      >
        {/* Shimmering Animated Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-anniversary-rose via-white to-anniversary-love rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="absolute -inset-[2px] bg-gradient-to-r from-anniversary-love via-anniversary-pink to-anniversary-rose rounded-[2.5rem] animate-pulse"></div>

        <div className="relative bg-white shadow-2xl rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center">
          {/* Heart symbols along the border */}
          <div className="absolute top-4 left-8 text-anniversary-pink"><Heart size={20} fill="currentColor" /></div>
          <div className="absolute top-4 right-8 text-anniversary-pink"><Heart size={20} fill="currentColor" /></div>
          <div className="absolute bottom-4 left-8 text-anniversary-pink"><Heart size={20} fill="currentColor" /></div>
          <div className="absolute bottom-4 right-8 text-anniversary-pink"><Heart size={20} fill="currentColor" /></div>

          <div className="bg-anniversary-love p-4 rounded-full shadow-lg -mt-16 md:-mt-24 mb-8 border-8 border-anniversary-warm">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>

          <h1 className="text-5xl md:text-7xl font-cursive text-anniversary-love mb-10 text-center tracking-tight">
            A Promise
          </h1>

          <div className="prose prose-pink max-w-none w-full border-t border-b border-anniversary-pink/30 py-10 my-4 min-h-[300px]">
            {displayedText.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-2xl md:text-3xl text-slate-700 leading-relaxed mb-8 text-center font-serif italic font-medium">
                {paragraph}
              </p>
            ))}
            {!isTypingComplete && (
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-3 h-8 bg-anniversary-love ml-1 align-middle"
              />
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isTypingComplete ? 1 : 0 }}
            className="mt-12 flex flex-col items-center gap-10 w-full"
          >
            <div className="flex gap-4 items-center">
              <Heart className="w-6 h-6 text-anniversary-rose animate-bounce" />
              <p className="text-3xl font-cursive text-anniversary-love tracking-widest text-center px-4">
                Forever & Always
              </p>
              <Heart className="w-6 h-6 text-anniversary-rose animate-bounce delay-100" />
            </div>

            <div className="flex flex-wrap justify-center gap-6 w-full">
              <button 
                onClick={onViewMemories}
                className="px-10 py-5 bg-anniversary-love text-white rounded-full font-serif font-black text-xl shadow-[0_10px_40px_rgba(225,29,72,0.3)] hover:bg-anniversary-rose transition-all flex items-center gap-3 active:scale-95 italic"
              >
                View Memories <Play className="w-6 h-6 fill-white" />
              </button>

              <button 
                onClick={onStartOver}
                className="px-10 py-5 bg-red-100 text-red-500 border-2 border-red-200 rounded-full font-serif font-black text-xl shadow-lg hover:bg-red-200 transition-all flex items-center gap-3 active:scale-95 italic"
              >
                Start Over <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="mb-12 text-anniversary-love/30 text-sm font-black tracking-[0.4em] uppercase font-serif italic">
        Three Years of Us • 2026
      </div>
    </div>
  );
};

export default PromiseLetter;
