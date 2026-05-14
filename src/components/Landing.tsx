import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LandingProps {
  onContinue: () => void;
}

const Landing = ({ onContinue }: LandingProps) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-anniversary-pink p-6 text-center cursor-pointer"
      onClick={onContinue}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="flex justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-20 h-20 text-anniversary-love fill-anniversary-love" />
          </motion.div>
        </div>

        <h1 className="text-6xl md:text-8xl font-serif font-black text-anniversary-love tracking-tighter">
          Happy 3rd Anniversary<br />
          <span className="text-5xl md:text-7xl font-cursive mt-6 block text-anniversary-rose">My Love</span>
        </h1>

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl md:text-3xl font-serif italic text-anniversary-love/60 font-medium"
        >
          Tap to continue
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
