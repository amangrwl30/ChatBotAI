import React, { useState , useContext} from 'react';
import ChatBot from './ChatBot'; // Import your chatbot component
import Loader from './Loader'; // Import the loader component
import { AppContext } from '../context/AppContext';
const LandingPage = (props) => {
  const [website, setWebsite] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {sharedState } = useContext(AppContext)

  const isValidWebsite = (url) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (website.trim() && isValidWebsite(website)) {
      setIsLoading(true);
      setTimeout(() => {
        setShowChatbot(true);
        setIsLoading(false);
      }, 2000); // Simulate loading time
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter a valid website URL.');
    }
  };

  return (
    <div className={`${sharedState.yellowAiTheme ? 'dark' : ''}`}>
 <div className="landing-container flex flex-col items-center justify-center h-screen bg-gray-1000  dark:bg-zinc-1000   text-white">
      {isLoading ? (
        <Loader />
      ) : !showChatbot ? (
        <div className="text-center p-8">
          <h1 className="text-6xl font-extrabold mb-10">Conversations Reimagined</h1>
          <p className="text-xl mb-6 font-light">Infinite interactions. Zero setup.</p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center bg-white mt-20 p-2 px-16 rounded-full shadow-xl">
            <span className="mr-2 text-black text-lg">Create a</span>
            <select className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md focus:outline-none">
              <option>Website assistant</option>
            </select>
            <span className="ml-2 text-black text-lg">for my website</span>
            <input
              type="text"
              className="ml-2 px-4 py-3 border border-gray-300 rounded-lg w-60 focus:outline-none focus:border-indigo-500 text-black"
              placeholder="www.example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
            />
          </form>
          {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
          <button onClick={handleSubmit} className="bg-[linear-gradient(to_right,rgb(255,204,51),rgb(245,158,11))] hover:bg-[linear-gradient(to_right,rgb(245,158,11),rgb(255,204,51))] mt-10 w-full text-xl max-w-xs bg-yellow-500 px-8 py-4 rounded-full text-black font-bold shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-110">
            Generate
          </button>
        </div>
      ) : (
        <div className="animate-fadeIn w-full">
          <ChatBot website={website} />
        </div>
      )}
    </div>
    </div>
   
  );
};

export default LandingPage;