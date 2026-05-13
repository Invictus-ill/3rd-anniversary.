import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface PromiseLetterProps {
  onStartOver: () => void;
}

const PromiseLetter = ({ onStartOver }: PromiseLetterProps) => {
  const [letterContent, setLetterContent] = useState<string>('');

  useEffect(() => {
    fetch('/data/letter.txt')
      .then(res => res.text())
      .then(text => setLetterContent(text))
      .catch(err => console.error("Failed to load letter", err));
  }, []);

  return (
    <div className="min-h-screen bg-anniversary-warm flex flex-col items-center p-8 md:p-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="max-w-2xl w-full bg-white shadow-2xl rounded-[2rem] p-10 md:p-16 relative mt-10 mb-20"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-anniversary-love p-4 rounded-full shadow-lg">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-anniversary-love mb-12 text-center border-b border-anniversary-pink pb-6">
          A Promise
        </h1>

        <div className="prose prose-pink max-w-none">
          {letterContent.split('\n').map((paragraph, idx) => (
            <p key={idx} className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <Heart key={i} className={`w-6 h-6 text-anniversary-love ${i === 2 ? 'fill-anniversary-love scale-125' : 'opacity-40'}`} />
            ))}
          </div>
          
          <p className="text-anniversary-rose font-medium italic">
            Forever & Always
          </p>
        </div>
      </motion.div>

      <button 
        onClick={onStartOver}
        className="text-anniversary-rose hover:text-anniversary-love font-medium transition-colors mb-12 flex items-center gap-2"
      >
        <Heart className="w-4 h-4" /> Start Over
      </button>
    </div>
  );
};

export default PromiseLetter;
