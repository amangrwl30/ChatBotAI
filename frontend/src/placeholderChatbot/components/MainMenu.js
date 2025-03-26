import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTruck, faUndo, faSync, faTimesCircle, faCreditCard, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const MainMenu = (props) => {
  const handleOptionClick = (handler) => {
    // First remove the mainMenu widget
    props.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.map(msg => {
        if (msg.widget === "mainMenu") {
          const { widget, ...rest } = msg;
          return rest;
        }
        return msg;
      })
    }));
    
    // Then call the handler
    handler();
  };

  const options = [
    {
      text: "Where is my order?",
      handler: () => handleOptionClick(props.actionProvider.handleWhereIsMyOrder),
      icon: faTruck,
      id: 1,
    },
    {
      text: "Queries related to my Delivered products",
      handler: () => handleOptionClick(props.actionProvider.handleQueriesIssue),
      icon: faUndo,
      id: 2,
    },
    {
      text: "Payment Related",
      handler: () => handleOptionClick(props.actionProvider.handlePaymentRelated),
      icon: faCreditCard,
      id: 3,
    },
    {
      text: "Still have a Query",
      handler: () => handleOptionClick(props.actionProvider.handleGeneralQuery),
      icon: faQuestionCircle,
      id: 4,
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

export default MainMenu;