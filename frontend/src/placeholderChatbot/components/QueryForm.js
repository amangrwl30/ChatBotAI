import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const QueryForm = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      setErrorMessage("Please describe your issue before submitting.");
      return;
    }

    // const message = "Thank you for submitting your query. Our team will get back to you shortly.";
    // props.actionProvider.addMessageToState(props.actionProvider.createChatBotMessage(message));

    setIsSubmitted(true);
  };

  const handleStillHaveQuery = () => {
    setShowSupportMessage(true);
    const supportMessage = "For further queries, please connect with our support team.";
    props.actionProvider.addMessageToState(props.actionProvider.createChatBotMessage(supportMessage, {
      widget: "assistantContact"
    }));
  };

  return (
    <div>
      {isSubmitted ? (
        <div>
          <div className="p-4 mb-4 bg-white rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Query Submitted</h2>
            <p className="text-gray-600 mt-2">Thank you for submitting your query. Our team will get back to you shortly.</p>
          </div>
          {!showSupportMessage && (
            <a
              href="#"
              onClick={handleStillHaveQuery}
              className="mt-4 text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
            >
              Still have a query?
            </a>
          )}
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Describe your issue</label>
              <textarea 
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-700"
                rows="3"
                placeholder="Tell us what's wrong with the return process"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
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
      )}
      <HomeButton {...props} />
    </div>
  );
};

export default QueryForm;