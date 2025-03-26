import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const PaymentOptions = (props) => {
  const handleOptionClick = (handler) => {
    props.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.filter(msg => msg.widget !== "paymentOptions")
    }));
    handler();
  };

  const options = [
    {
      text: "Change Payment Method",
      handler: () => handleOptionClick(props.actionProvider.handleChangePaymentMethod),
      icon: faCreditCard,
      id: 1,
    },
    {
      text: "Common Payment Issues",
      handler: () => handleOptionClick(props.actionProvider.handleCommonPaymentIssues),
      icon: faExclamationCircle,
      id: 2,
    },
    {
      text: "Verify Payment Status",
      handler: () => handleOptionClick(props.actionProvider.handleVerifyPaymentStatus),
      icon: faCheckCircle,
      id: 3,
    }
  ];

  return (
    <div className="space-y-1 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.handler}
          className="flex items-center gap-3 bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300 hover:bg-yellow-600 hover:text-white transition-all duration-300 w-full text-xs"
        >
          <FontAwesomeIcon icon={option.icon} className="text-lg" />
          <span className="text-xs font-medium">{option.text}</span>
        </button>
      ))}
    </div>
  );
};

export default PaymentOptions; 