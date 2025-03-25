import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faComments } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const AssistantContact = (props) => {

  const email = {
    to: 'zomato.com',
    subject: 'Regarding product query',
    body: 'Regarding personal product query on Product with order Id 101, the food received is contaminated. Required refund'
  }
  const contactOptions = [
    {
      icon: faPhone,
      text: "Call Support",
      description: "Talk to our support team",
      action: "tel:1800-123-4567",
      color: "text-green-600"
    },
    {
      icon: faEnvelope,
      text: "Email Support",
      description: "Send us an email",
      action: `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`,
      color: "text-yellow-600"
    },
    {
      icon: faComments,
      text: "Live Chat",
      description: "Chat with an agent",
      action: "#",
      color: "text-blue-600"
    },
    // {
    //   icon: faComments,
    //   text: "Schedule Appointment",
    //   description: "Schedule apt. with the Agent",
    //   action: "#",
    //   color: "text-blue-600"
    // }
  ];

  return (
    <div>
      <div className="space-y-3 p-4">
        {contactOptions.map((option, index) => (
          <a 
            key={index}
            href={option.action}
            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-all duration-300 border border-gray-200"
          >
            <FontAwesomeIcon icon={option.icon} className={`text-2xl ${option.color}`} />
            <div>
              <div className="font-semibold text-gray-800">{option.text}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </div>
          </a>
        ))}
      </div>
      <HomeButton {...props} />
    </div>
  );
};

export default AssistantContact; 