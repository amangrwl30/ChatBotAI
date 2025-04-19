import React, { useState, lazy, Suspense } from 'react';
import { AppProvider } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import robot from "../assets/images/robot-norby.png";  // Make sure to import the robot image

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
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8"
        style={{ background: 'linear-gradient(135deg, #8b5cf626, #0ea5e926)' }}
      >
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
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 md:mb-6 lg:mb-10 text-gray-700">
              Select a Feature
            </h1>
                <p className="text-base md:text-lg lg:text-xl mb-6 font-light text-gray-700">
              Choose a feature to proceed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  id: 'landingPage',
                  name: 'LLM Chatbot',
                  description: 'Advanced AI chatbot for natural conversations',
                  icon: '🤖',
                  color: 'bg-[#5C42FC]',
                  textColor: 'text-white',
                  gradient: 'from-[#5C42FC] to-[#8B5CF6]',
                  features: ['Natural Language', 'Context Awareness', 'Real-time Responses']
                },
                {
                  id: 'crmChatbot',
                  name: 'Virtual Agent',
                  description: 'Intelligent customer service automation',
                  icon: '💼',
                  color: 'bg-[#F8B806]',
                  textColor: 'text-black',
                  gradient: 'from-[#F8B806] to-[#F97316]',
                  features: ['24/7 Support', 'Multi-language', 'Smart Routing']
                },
                {
                  id: 'audioChatbot',
                  name: 'Voice Assistant',
                  description: 'Voice-enabled AI for interactive conversations',
                  icon: '🎙️',
                  color: 'bg-black',
                  textColor: 'text-white',
                  gradient: 'from-black to-gray-900',
                  features: ['Voice Recognition', 'Natural Speech', 'Real-time Translation']
                }
              ].map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => handleTileClick(feature.id)}
                  onMouseEnter={() => prefetchComponent(feature.id)}
                  className={`
                    relative group
                    rounded-3xl p-6 md:p-8
                    aspect-square w-full max-w-[400px] mx-auto
                    ${feature.color}
                    ${feature.textColor}
                    border border-white/20
                    shadow-2xl hover:shadow-3xl
                    transform transition-all duration-500
                    hover:scale-105 cursor-pointer
                    overflow-hidden
                    flex flex-col justify-center items-center
                  `}
                >
                  {/* Main Content (Visible by default) */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-90">
                    {/* Icon */}
                    <div className="text-5xl mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {feature.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-center">
                      {feature.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm md:text-base opacity-90 leading-relaxed text-center px-4">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hidden Content (Visible on hover) */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                    <div className="w-full px-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {feature.features.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="text-lg">•</span>
                            <span className="text-sm md:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Button */}
                    <button className="mt-8 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                      Get Started
                    </button>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full transform -translate-x-10 translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
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

        {/* Robot Image */}
        <div className="fixed bottom-4 right-4 w-24 h-24 z-10">
          <img 
            src={robot} 
            alt="Robot Assistant" 
            className="w-full h-full object-contain animate-bounce"
          />
        </div>
      </div>
    </AppProvider>
  );
};

export default InitialPage;