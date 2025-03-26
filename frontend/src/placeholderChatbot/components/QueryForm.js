import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const QueryForm = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = "Thank you for submitting your query. Our team will get back to you shortly.";
    props.actionProvider.addMessageToState(props.createChatBotMessage(message));
  };

  return (
    <div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Describe your issue</label>
            <textarea 
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-700"
              rows="3"
              placeholder="Tell us what's wrong with the return process"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Submit Query</span>
          </button>
        </form>
      </div>
      <HomeButton {...props} />
    </div>
  );
};

export default QueryForm; 