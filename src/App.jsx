
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import EchoBuddy from './components/EchoBuddy';
import AudioController from './components/AudioController';
import FilterControls from './components/FilterControls';

function App() {
  const [isAppActive, setIsAppActive] = useState(false);
  const [characterState, setCharacterState] = useState('idle');
  const [audioURL, setAudioURL] = useState(null);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [activeFilter, setActiveFilter] = useState('none');

  
  useEffect(() => {
    
    
    if (isAppActive && !isListening && !audioURL) {
      setIsListening(true);
    }
  }, [isAppActive, isListening, audioURL]);

  
  const handleStartSession = () => {
    setIsAppActive(true);
    
  };

  const handleStopSession = () => {
    setIsAppActive(false);
    
    setIsListening(false);
    setAudioURL(null);
    setCharacterState('idle');
    setMouthOpenness(0);
  };

  
  const handleRecordingStart = () => {
    setCharacterState('listening');
    setAudioURL(null);
  };

  const handleRecordingComplete = (url) => {
    setIsListening(false);
    setAudioURL(url);
    setCharacterState('idle');
  };

  const handlePlaybackStart = () => {
    setCharacterState('talking');
  };

  
  
  const handlePlaybackComplete = () => {
    setMouthOpenness(0);
    setCharacterState('idle');
    setAudioURL(null);
  };

  const handleAudioActivity = (level) => {
    setMouthOpenness(level);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-6">
        <EchoBuddy state={characterState} mouthOpenness={mouthOpenness} activeFilter={activeFilter} />
        
        <FilterControls
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          isDisabled={isListening || characterState === 'talking'}
        />

        <div className="text-center text-slate-400 h-10">
          {isAppActive ? (
            <p className="transition-opacity duration-300">
              {characterState === 'listening' && 'Listening... Speak now!'}
              {characterState === 'talking' && 'Repeating what you said...'}
              {characterState === 'idle' && !isListening && 'Ready for the next round...'}
            </p>
          ) : (
            <p>Select a voice filter, then start the session.</p>
          )}
        </div>

        <div className="mt-2">
          <button
            onClick={isAppActive ? handleStopSession : handleStartSession}
            className={`
              px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold text-white rounded-xl shadow-lg
              transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-offset-slate-900
              ${isAppActive
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }
            `}
          >
            {isAppActive ? 'Stop Session' : 'Start Session'}
          </button>
        </div>
      </main>
      
      <AudioController
        
        isActive={isListening}
        onRecordingStart={handleRecordingStart}
        onRecordingComplete={handleRecordingComplete}
        
        audioUrlToPlay={audioURL}
        activeFilter={activeFilter}
        onPlaybackStart={handlePlaybackStart}
        onPlaybackComplete={handlePlaybackComplete}
        onAudioActivity={handleAudioActivity}
      />
      
      <Footer />
    </div>
  );
}

export default App;