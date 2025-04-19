import React from "react";
import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';

// import config from "../placeholderChatbot/config";
// ipmort getConfig
import ActionProvider from "../placeholderChatbot/ActionProvider";
import MessageParser from "../placeholderChatbot/MessageParser";
import "./chatbotStyles.css";
import "./chatbotStylesDarkMode.css"
import { useState } from "react";
import getConfig from "../placeholderChatbot/config";
import notificationBeep from '../assets/sounds/notificationbeep.mp3';



function CRMChatbot(props) {
  const notificationSound = new Audio(notificationBeep);
  
  const handleMessage = (message) => {
    try {
      notificationSound.play().catch(console.error);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return (
    <div className="app">
      <div className="chatbot">
        <Chatbot
          config={getConfig(props.theme, props.toggleTheme)}
          actionProvider={ActionProvider}
          messageParser={MessageParser}
          disableInput={true}
          messageHistory={handleMessage}
          className="chatbot-container"
        />
      </div>
    </div>
  );
}

export default CRMChatbot;