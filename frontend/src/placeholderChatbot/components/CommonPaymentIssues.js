import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faRedoAlt, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const CommonPaymentIssues = (props) => {
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const handleStillHaveQuery = () => {
    setShowSupportMessage(true);
    const supportMessage = "For further queries, please connect with our support team.";
    props.actionProvider.addMessageToState(props.actionProvider.createChatBotMessage(supportMessage, {
      widget: "assistantContact"
    }));
  };

  return (
    <div className="space-y-2 p-2">
      <div className="bg-white mb-4 rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Common Payment Issues:</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-600 text-2xl" />
            <div>
              <p className="font-medium text-black">Payment Failed</p>
              <p className="text-sm text-gray-600">Wait for 30 minutes and check your bank statement</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <FontAwesomeIcon icon={faRedoAlt} className="text-yellow-600 text-2xl" />
            <div>
              <p className="font-medium text-black">Amount Deducted Twice</p>
              <p className="text-sm text-gray-600">Extra amount will be refunded within 5-7 days</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <FontAwesomeIcon icon={faSyncAlt} className="text-yellow-600 text-2xl" />
            <div>
              <p className="font-medium text-black">Payment Gateway Error</p>
              <p className="text-sm text-gray-600">Try again after clearing browser cache</p>
            </div>
          </li>
        </ul>
      </div>
      {!showSupportMessage && (
        <a
          href="#"
          onClick={handleStillHaveQuery}
          className="mt-4 block text-blue-600 font-bold ml-2 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
        >
          Still have a query?
        </a>
      )}
      <HomeButton {...props} />
    </div>
  );
};

export default CommonPaymentIssues;