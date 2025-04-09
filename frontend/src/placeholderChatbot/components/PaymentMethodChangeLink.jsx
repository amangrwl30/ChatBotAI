import React, { useState } from "react";
import HomeButton from "./HomeButton";

const PaymentMethodChangeLink = (props) => {
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const handleStillHaveQuery = () => {
    setShowSupportMessage(true);
    const supportMessage = "For further queries, please connect with our support team.";
    props.actionProvider.addMessageToState(props.actionProvider.createChatBotMessage(supportMessage, {
      widget: "assistantContact"
    }));
  };

  return (
    <div>
      <div className="p-2">
        <a 
          href={props.payload?.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 w-full p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-yellow-600 hover:text-white transition-all duration-300"
        >
          <span className="text-xl">🔗</span>
          <span>Click here to change payment method</span>
        </a>
      </div>
      {!showSupportMessage && (
        <a
          href="#"
          onClick={handleStillHaveQuery}
          className="mt-4 block text-blue-600 ml-4 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
        >
          Still have a query?
        </a>
      )}
      <HomeButton {...props} />
    </div>
  );
};

export default PaymentMethodChangeLink;