import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const HomeButton = (props) => {
  const handleHomeClick = () => {
    // Remove all widgets and show main menu
    props.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.filter(msg => !msg.widget)
    }));
    props.actionProvider.greet();
  };

  return (
    <button
      onClick={handleHomeClick}
      className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
      title="Back to Main Menu"
    >
      <FontAwesomeIcon icon={faHome} className="text-lg" />
    </button>
  );
};

export default HomeButton; 