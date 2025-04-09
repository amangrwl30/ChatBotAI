// import React, { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExternalLinkAlt, faPaperclip, faMicrophone, faPaperPlane, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// const CRMChatBot = ({ toggleTheme, isDarkTheme }) => {
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [placeholders, setPlaceholders] = useState(['Placeholder 1', 'Placeholder 2', 'Placeholder 3']);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     // Scroll to the bottom of the chat whenever messages change
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (messageInput.trim() === '') return;

//     const newMessage = { content: messageInput, isUser: true };
//     setMessages([...messages, newMessage]);
//     setMessageInput('');

//     setIsLoading(true);
//     // Simulate fetching response from API
//     setTimeout(() => {
//       const botMessage = { content: 'This is a placeholder response from the API', isUser: false, links: [] };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handlePlaceholderClick = (placeholder) => {
//     const newMessage = { content: placeholder, isUser: true };
//     setMessages([...messages, newMessage]);

//     setIsLoading(true);
//     // Simulate fetching response from API
//     setTimeout(() => {
//       const botMessage = {
//         content: `This is a response for ${placeholder}`,
//         isUser: false,
//         links: [{ title: 'Learn more', link: 'https://example.com' }],
//       };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);

//       // Update placeholders based on the placeholder clicked
//       if (placeholder === 'Placeholder 1') {
//         setPlaceholders(['Placeholder 1.1', 'Placeholder 1.2']);
//       } else if (placeholder === 'Placeholder 2') {
//         setPlaceholders(['Placeholder 2.1', 'Placeholder 2.2']);
//       } else {
//         setPlaceholders(['Placeholder 3.1', 'Placeholder 3.2']);
//       }

//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="container mt-10 mx-auto w-[100%] h-[85vh] flex flex-col py-4 animate-slideIn rounded-3xl bg-white dark:bg-gray-900 shadow-lg">
//       {/* Header */}
//       <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm rounded-t-3xl">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-xl font-semibold text-gray-500 dark:text-gray-300">AI Assistant</h1>
//           <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span>Online</span>
//           </div>
//         </div>
//         <button
//           className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//           aria-label="Toggle theme"
//           onClick={toggleTheme}
//         >
//           <FontAwesomeIcon icon={isDarkTheme ? faSun : faMoon} />
//         </button>
//       </header>

//       {/* Chat Messages (Fixed Height & Scrollable) */}
//       <div className="flex-1 h-[80vh] overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-b-3xl" id="chatContainer">
//         {messages.map((message, index) => (
//           <div key={index} className={`flex items-start mb-4 ${message.isUser ? 'flex-row-reverse' : ''}`}>
//             {/* Profile Icon */}
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md
//               ${message.isUser ? 'bg-gradient-to-r from-pink-500 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
//               {message.isUser ? 'U' : 'AI'}
//             </div>

//             {/* Message Box */}
//             <div className={`max-w-xs p-3 rounded-lg shadow-sm
//               ${message.isUser
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md max-w-sm text-black dark:text-white'
//               }
//               ${message.isUser ? 'ml-4' : 'mr-4'}`}
//             >

//               {/* Message Content (With Gray Background If Links Exist) */}
//               <div className={`${!message.isUser && message.links ? 'bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg mb-2 text-gray-900 dark:text-white text-sm font-medium' : ''}`}>
//                 {message.content}
//               </div>

//               {/* Suggested Articles Section */}
//               {message.links && message.links.length > 0 && (
//                 <div className="mt-2 p-2">
//                   <p className="text-md text-gray-800 dark:text-gray-300 font-semibold">Suggested articles:</p>

//                   {/* Grid layout (2 links per row) */}
//                   <div className="grid grid-cols-2 gap-2 mt-2">
//                     {message.links.map((link, idx) => (
//                       <a
//                         key={idx}
//                         href={link.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         title={link.title}
//                         className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm text-xs font-medium text-gray-900 dark:text-white truncate"
//                       >
//                         <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 text-xs text-gray-600 dark:text-gray-300" />
//                         {link.title.length > 20 ? link.title.slice(0, 20) + '...' : link.title}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex items-start mb-4">
//             <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md bg-gradient-to-r from-blue-500 to-purple-500">
//               AI
//             </div>
//             <div className="max-w-xs p-3 rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ml-4">
//               <div className="flex space-x-2">
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Placeholder Buttons */}
//       <div className="p-3">
//         <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-sm">
//           {placeholders.map((placeholder, index) => (
//             <button
//               key={index}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
//               onClick={() => handlePlaceholderClick(placeholder)}
//             >
//               {placeholder}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Input Area (Fixed at Bottom) */}
//       <div className="p-3">
//         <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-sm">
//           <input
//             type="text"
//             className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
//             placeholder="Type your message..."
//             aria-label="Message input"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 handleSendMessage();
//               }
//             }}
//           />
//           <button className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg" aria-label="Add attachment">
//             <FontAwesomeIcon icon={faPaperclip} />
//           </button>
//           <button className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg" aria-label="Voice input">
//             <FontAwesomeIcon icon={faMicrophone} />
//           </button>
//           <button className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all" onClick={handleSendMessage}>
//             <span className="mr-2">Send</span>
//             <FontAwesomeIcon icon={faPaperPlane} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CRMChatBot;










// import React, { useState } from "react";

// const initialMessages = [
//   {
//     type: "bot",
//     text: "Welcome to Domino's. How can I help you today?",
//     time: "Thu 00:57",
//   },
// ];

// const initialOptions = [
//   "Track current order",
//   "Queries & feedback",
//   "Stores near me",
//   "Contact store",
// ];

// const CRMChatbot = () => {
//   const [chat, setChat] = useState(initialMessages);
//   const [options, setOptions] = useState(initialOptions);

//   const handleOptionClick = (option) => {
//     const newMessage = {
//       type: "user",
//       text: option,
//       time: new Date().toLocaleTimeString(),
//     };

//     setChat([...chat, newMessage]);

//     // Simulate bot response
//     setTimeout(() => {
//       const botResponse = {
//         type: "bot",
//         text: `You selected "${option}". How can I assist you further?`,
//         time: new Date().toLocaleTimeString(),
//       };
//       setChat((prevChat) => [...prevChat, botResponse]);
//     }, 1000);
//   };

//   return (
//     <div className="flex flex-col w-full max-w-md mx-auto h-[80vh] bg-gray-100 rounded-lg shadow-lg">
//       {/* Header */}
//       <div className="bg-blue-700 text-white p-4 flex items-center border-b shadow-sm rounded-t-lg">
//         <img src="https://via.placeholder.com/30" alt="logo" className="mr-2" />
//         <div>
//           <h2 className="text-lg font-semibold">Domino's</h2>
//           <p className="text-xs">Virtual Customer Assistant</p>
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {chat.map((msg, index) => (
//           <div key={index} className="mb-3">
//             <div className={`flex items-start ${msg.type === "user" ? "justify-end" : ""}`}>
//               {msg.type === "bot" && (
//                 <img
//                   src="https://via.placeholder.com/30"
//                   alt="logo"
//                   className="mr-2"
//                 />
//               )}
//               <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.type === "bot" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
//                 {msg.text}
//               </div>
//             </div>
//             <p className={`text-xs text-gray-500 mt-1 ${msg.type === "user" ? "text-right" : ""}`}>{msg.time}</p>
//           </div>
//         ))}

//         {/* User Options */}
//         <div className="mt-4 space-y-3">
//           {options.map((option, index) => (
//             <button
//               key={index}
//               className="w-full text-center px-4 py-2 bg-white text-black border rounded-full text-sm hover:bg-gray-200"
//               onClick={() => handleOptionClick(option)}
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CRMChatbot;






import React from "react";
import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import { AppProvider } from '../context/AppContext';

import config from "../placeholderChatbot/config";
import ActionProvider from "../placeholderChatbot/ActionProvider";
import MessageParser from "../placeholderChatbot/MessageParser";
import "./chatbotStyles.css";

function CRMChatbot() {
    return (
        <AppProvider>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <div className="w-full h-full max-w-4xl mx-auto">
                    <Chatbot
                        config={config}
                        actionProvider={ActionProvider}
                        messageParser={MessageParser}
                        disableInput={true}
                        className="chatbot-container"
                    />
                </div>
            </div>
        </AppProvider>
    );
}

export default CRMChatbot;