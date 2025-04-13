import React, { useState, lazy, Suspense } from 'react';
import { AppProvider } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Dynamic imports with prefetch
const LandingPage = lazy(() => import(/* webpackPrefetch: true */ './LandingPage'));
const CRMChatBot = lazy(() => import(/* webpackPrefetch: true */ './CRMChatBot'));
const AudioChatbot = lazy(() => import(/* webpackPrefetch: true */ '../audioComponent/AudioChatbot'));

// Optimized loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-gray-200"></div>
  </div>
);

const InitialPage = () => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
  };

  const handleBack = () => {
    setSelectedTile(null);
  };

  // Prefetch components on hover
  const prefetchComponent = (component) => {
    switch (component) {
      case 'landingPage':
        import('./LandingPage');
        break;
      case 'crmChatbot':
        import('./CRMChatBot');
        break;
      case 'audioChatbot':
        import('../audioComponent/AudioChatbot');
        break;
    }
  };

  const renderSelectedComponent = () => {
    if (!selectedTile) return null;

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {selectedTile === 'landingPage' ? (
          <LandingPage />
        ) : selectedTile === 'crmChatbot' ? (
          <div className={`chatbot ${theme}`}>
            <CRMChatBot toggleTheme={toggleTheme} theme={theme} />
          </div>
        ) : (
          <AudioChatbot />
        )}
      </Suspense>
    );
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-600/90 to-blue-500/90 flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
        {/* Home Button - Show only when no tile is selected */}
        {!selectedTile && (
          <button
            onClick={() => navigate('/')}
            className="fixed top-4 left-4 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 z-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </button>
        )}

        {/* Back Button - Show only when a tile is selected */}
        {selectedTile && (
          <button
            onClick={handleBack}
            className="fixed top-4 left-4 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 z-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back
          </button>
        )}

        {!selectedTile ? (
          <div className="w-full max-w-4xl mx-auto text-center px-4">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 md:mb-6 lg:mb-10 text-white">
              Select a Feature
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 font-light text-gray-300">
              Choose a feature to proceed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10">
              {[
                { id: 'landingPage', name: 'LLM ChatBot', color: 'yellow' },
                { id: 'crmChatbot', name: 'CRM ChatBot', color: 'blue' },
                { id: 'audioChatbot', name: 'Audio ChatBot', color: 'green' }
              ].map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  onMouseEnter={() => prefetchComponent(tile.id)}
                  className={`
                    w-full py-4 px-6 
                    rounded-xl md:rounded-2xl
                    font-bold
                    text-black
                    shadow-lg hover:shadow-xl
                    transform transition-all duration-300
                    hover:scale-105
                    text-sm md:text-base lg:text-lg
                    ${tile.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                      tile.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 
                      'bg-green-500 hover:bg-green-600'}
                  `}
                >
                  {tile.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full animate-fadeIn">
            <Suspense fallback={<LoadingSpinner />}>
              {renderSelectedComponent()}
            </Suspense>
          </div>
        )}
      </div>
    </AppProvider>
  );
};

export default InitialPage;