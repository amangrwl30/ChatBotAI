import React, { useState } from "react";
import HomeButton from "./HomeButton";

const PaymentStatusCheck = (props) => {
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
      {!showSupportMessage && (
        <a
          href="#"
          onClick={handleStillHaveQuery}
          className="mt-6 block text-blue-600 ml-8 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
        >
          Still have a query?
        </a>
      )}
      <HomeButton {...props} />
    </div>
  );
};

export default PaymentStatusCheck;