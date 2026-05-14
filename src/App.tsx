import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Landing from './components/Landing';
import MediaViewer from './components/MediaViewer';
import GiftBoxes from './components/GiftBoxes';
import PromiseLetter from './components/PromiseLetter';
import MemoriesViewer from './components/MemoriesViewer';

type Stage = 'landing' | 'media' | 'gifts' | 'promise' | 'memories';

function App() {
  const [stage, setStage] = useState<Stage>('landing');
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  
  // Use a persistent Audio object instead of a tag in JSX
  const bgMusic = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const music = bgMusic.current;
    music.loop = true;
    music.volume = 0.5;
    
    // Preload audio files
    const tracks = ['/media/birds.mp3', '/media/piano.mp3', '/media/5.mp3'];
    tracks.forEach(track => {
      const audio = new Audio();
      audio.src = track;
      audio.preload = 'auto';
    });

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

  useEffect(() => {
    const music = bgMusic.current;
    if (!hasStartedAudio) return;

    let targetSrc = "";

    // Determine the audio source based on the stage
    if (stage === 'media') {
      targetSrc = '/media/birds.mp3';
    } else if (stage === 'promise') {
      targetSrc = '/media/piano.mp3';
    } else if (stage === 'memories') {
      targetSrc = '/media/5.mp3';
    }

    // Only update and play if the source actually changes
    const currentPath = music.src ? new URL(music.src).pathname : "";
    if (targetSrc && currentPath !== targetSrc) {
      music.src = targetSrc;
      music.play().catch(e => console.error("Audio play failed:", e));
    } else if (!targetSrc) {
      music.pause();
      music.src = "";
    }
  }, [stage, hasStartedAudio]);

  const startAudio = () => {
    setHasStartedAudio(true);
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
