import React,{useContext} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faUndo, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../context/AppContext";
const DeliveredProductQueries = (props) => {
  const { sharedState, setSharedState } = useContext(AppContext);
  const handleOptionClick = (handler) => {
    // First remove the deliveredProductQueries widget
    props.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.filter(msg => msg.widget !== "deliveredProductQueries")
    }));
    
    // Then call the handler
    handler();
  };

  const options = [
    {
      text: "Damaged Package",
      handler: () => handleOptionClick(() => props.actionProvider.handleDamagedPackageQuery(sharedState?.selectedOrder?.orderId)),
      icon: faBox,
      id: 1,
    },
    {
      text: "Return/Refund Issues",
      handler: () => handleOptionClick(props.actionProvider.handleReturnRefundIssues),
      icon: faUndo,
      id: 2,
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

export default DeliveredProductQueries; 