import React, { useState } from 'react';
import LandingPage from './LandingPage'; // Import the LandingPage component
import CRMChatBot from './CRMChatBot';
import AudioChatbot from '../audioComponent/AudioChatbot';
// import AnotherComponent from './AnotherComponent'; // Import another component

const InitialPage = () => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [theme, setTheme] = useState("light");
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
      };

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
  };

  return (
    <div className="initial-page-container bg-zinc-1000 flex flex-col items-center justify-center h-screen text-white" >
      {!selectedTile ? (
        <div className="text-center p-8">
          <h1 className="text-6xl font-extrabold mb-10">Select a Feature</h1>
          <p className="text-xl mb-6 font-light">Choose a feature to proceed.</p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
            <button
              onClick={() => handleTileClick('landingPage')}
              className="tile-button bg-yellow-500 px-8 py-4 rounded-full text-black font-bold shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-110"
            >
              LLM ChatBot
            </button>
            <button
              onClick={() => handleTileClick('crmChatbot')}
              className="tile-button bg-blue-500 px-8 py-4 rounded-full text-black font-bold shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-110"
            >
              CRM ChatBot
            </button>
            <button
              onClick={() => handleTileClick('audioChatbot')}
              className="tile-button bg-green-500 px-8 py-4 rounded-full text-black font-bold shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-110"
            >
              Audio ChatBot
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn w-full">
          {selectedTile === 'landingPage' ? (
            <LandingPage  />
          ) : selectedTile === 'crmChatbot' ? (
            <div className={`chatbot ${theme}`}>
              <CRMChatBot  toggleTheme={toggleTheme} theme={theme} />
              </div>
          ) : (
            <AudioChatbot />
          )}
        </div>
      )}
    </div>
  );
};

export default InitialPage;