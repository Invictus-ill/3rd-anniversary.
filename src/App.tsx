import { useState } from 'react';
import Landing from './components/Landing';
import MediaViewer from './components/MediaViewer';
import GiftBoxes from './components/GiftBoxes';
import PromiseLetter from './components/PromiseLetter';

type Stage = 'landing' | 'media' | 'gifts' | 'promise';

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
        <PromiseLetter onStartOver={() => setStage('landing')} />
      )}
    </main>
  );
}

export default App;
