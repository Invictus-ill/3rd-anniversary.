import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Landing from './components/Landing';
import MediaViewer from './components/MediaViewer';
import GiftBoxes from './components/GiftBoxes';
import PromiseLetter from './components/PromiseLetter';
import MemoriesViewer from './components/MemoriesViewer';

type Stage = 'landing' | 'media' | 'gifts' | 'promise' | 'memories';

const BG_MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/10/26/audio_9c4b6a2f9b.mp3';

function App() {
  const [stage, setStage] = useState<Stage>('landing');
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const startAudio = () => {
    if (!hasStartedAudio && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setHasStartedAudio(true);
    }
  };

  const handleLandingContinue = () => {
    startAudio();
    setStage('media');
  };

  return (
    <main className="font-sans relative">
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src={BG_MUSIC_URL}
        loop
      />

      {/* Global Volume Toggle */}
      {hasStartedAudio && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-[200] p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all shadow-lg"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
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
          onStartOver={() => setStage('landing')} 
          onViewMemories={() => setStage('memories')}
        />
      )}

      {stage === 'memories' && (
        <MemoriesViewer 
          onBack={() => setStage('promise')} 
          onHome={() => setStage('landing')}
        />
      )}
    </main>
  );
}

export default App;
