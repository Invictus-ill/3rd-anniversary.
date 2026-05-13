import { useState } from 'react';
import Landing from './components/Landing';
import MediaViewer from './components/MediaViewer';
import GiftBoxes from './components/GiftBoxes';
import PromiseLetter from './components/PromiseLetter';
import MemoriesViewer from './components/MemoriesViewer';

type Stage = 'landing' | 'media' | 'gifts' | 'promise' | 'memories';

function App() {
  const [stage, setStage] = useState<Stage>('landing');

  return (
    <main className="font-sans">
      {stage === 'landing' && (
        <Landing onContinue={() => setStage('media')} />
      )}
      
      {stage === 'media' && (
        <MediaViewer onComplete={() => setStage('gifts')} />
      )}
      
      {stage === 'gifts' && (
        <GiftBoxes onComplete={() => setStage('promise')} />
      )}
      
      {stage === 'promise' && (
        <PromiseLetter 
          onStartOver={() => setStage('landing')} 
          onViewMemories={() => setStage('memories')}
        />
      )}

      {stage === 'memories' && (
        <MemoriesViewer onBack={() => setStage('promise')} />
      )}
    </main>
  );
}

export default App;
