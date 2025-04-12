import React, { useState, lazy, Suspense } from 'react';
import { AppProvider } from '../context/AppContext';

// Dynamic imports with prefetch
const LandingPage = lazy(() => import(/* webpackPrefetch: true */ './LandingPage'));
const CRMChatBot = lazy(() => import(/* webpackPrefetch: true */ './CRMChatBot'));
const AudioChatbot = lazy(() => import(/* webpackPrefetch: true */ '../audioComponent/AudioChatbot'));

// Optimized loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200"></div>
  </div>
);

const InitialPage = () => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [theme, setTheme] = useState("light");
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
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
      <div className="initial-page-container bg-zinc-1000 flex flex-col items-center justify-center min-h-screen text-white">
        {!selectedTile ? (
          <div className="text-center p-8">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 md:mb-10">Select a Feature</h1>
            <p className="text-lg md:text-xl mb-6 font-light">Choose a feature to proceed.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6 md:mt-10">
              {['landingPage', 'crmChatbot', 'audioChatbot'].map((tile) => (
                <button
                  key={tile}
                  onClick={() => handleTileClick(tile)}
                  onMouseEnter={() => prefetchComponent(tile)}
                  className={`tile-button px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
                    tile === 'landingPage'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : tile === 'crmChatbot'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-black`}
                >
                  {tile === 'landingPage'
                    ? 'LLM ChatBot'
                    : tile === 'crmChatbot'
                    ? 'CRM ChatBot'
                    : 'Audio ChatBot'}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn w-full">
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