import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Landing from './components/Landing';
import MediaViewer from './components/MediaViewer';
import GiftBoxes from './components/GiftBoxes';
import PromiseLetter from './components/PromiseLetter';
import MemoriesViewer from './components/MemoriesViewer';

type Stage = 'landing' | 'media' | 'gifts' | 'promise' | 'memories';

const BG_MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/11/06/audio_039f60f64c.mp3';

function App() {
  const [stage, setStage] = useState<Stage>('landing');
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  
  // Use a persistent Audio object instead of a tag in JSX
  const bgMusic = useRef<HTMLAudioElement>(new Audio(BG_MUSIC_URL));

  useEffect(() => {
    const music = bgMusic.current;
    music.loop = true;
    music.volume = 0.5;
    
    // Safety cleanup
    return () => {
      music.pause();
      music.src = "";
    };
  }, []);

  useEffect(() => {
    if (bgMusic.current) {
      bgMusic.current.muted = isMuted;
    }
  }, [isMuted]);

  const startAudio = () => {
    if (bgMusic.current) {
      bgMusic.current.play()
        .then(() => setHasStartedAudio(true))
        .catch(e => console.error("Audio play failed:", e));
    }
  };

  const handleLandingContinue = () => {
    startAudio();
    setStage('media');
  };

  const handleStartOver = () => {
    setStage('landing');
  };

  return (
    <main className="font-sans relative">
      {/* Global Volume Toggle */}
      {hasStartedAudio && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-[200] p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all shadow-lg active:scale-95"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}

      {stage === 'landing' && (
        <Landing onContinue={handleLandingContinue} />
      )}
      
      {stage === 'media' && (
        <MediaViewer onComplete={() => setStage('gifts')} />
      )}
      
      {stage === 'gifts' && (
        <GiftBoxes onComplete={() => setStage('promise')} isMuted={isMuted} />
      )}
      
      {stage === 'promise' && (
        <PromiseLetter 
          onStartOver={handleStartOver} 
          onViewMemories={() => setStage('memories')}
        />
      )}

      {stage === 'memories' && (
        <MemoriesViewer 
          onBack={() => setStage('promise')} 
          onHome={handleStartOver}
        />
      )}
    </main>
  );
}

export default App;
