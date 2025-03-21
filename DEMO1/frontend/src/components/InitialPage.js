import React, { useState } from 'react';
import LandingPage from './LandingPage'; // Import the LandingPage component
import CRMChatBot from './CRMChatBot';
// import AnotherComponent from './AnotherComponent'; // Import another component

const InitialPage = () => {
  const [selectedTile, setSelectedTile] = useState(null);

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
  };

  return (
    <div className="initial-page-container flex flex-col items-center justify-center h-screen bg-violet-900 from-purple-500 via-pink-500 to-red-500 text-white">
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
              onClick={() => handleTileClick('anotherComponent')}
              className="tile-button bg-blue-500 px-8 py-4 rounded-full text-black font-bold shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-110"
            >
              CRM ChatBot
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          {selectedTile === 'landingPage' ? (
            <LandingPage />
          ) : (
            // <AnotherComponent />
            <div className="text-center p-8">
              <h1 className="text-4xl font-extrabold mb-10">CRM ChatBot</h1>
              {/* <p className="text-xl mb-6 font-light">This is the Another Feature.</p> */}
              <CRMChatBot />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InitialPage;