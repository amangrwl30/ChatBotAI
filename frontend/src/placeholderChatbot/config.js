import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import HomeButton from "./components/HomeButton";
import MainMenu from "./components/MainMenu";
import OrderList from "./components/OrderList";
import DeliveredProductQueries from "./components/DeliveredProductQueries";
import QueryForm from "./components/QueryForm";
import RefundStatus from "./components/RefundStatus";
import AssistantContact from "./components/AssistantContact";
import DeliveredOrders from "./components/DeliveredOrders";
import PaymentOptions from "./components/PaymentOptions";
import botAvatar from "../assets/bot.jpg"
import userAvatar from "../assets/user.png"
import AddressChangeChoice from "./components/AddressChangeChoice";
import CommonPaymentIssues from "./components/CommonPaymentIssues";
import PaymentStatusCheck from "./components/PaymentStatusCheck";
import PaymentMethodChangeLink from "./components/PaymentMethodChangeLink";

const botName = "Ema";

const getConfig = (theme, toggleTheme) => ({
  botName: botName,
  initialMessages: [
    createChatBotMessage(
      `Hello, I am ${botName}, your assistant. How can I help you today?`,
      {
        widget: "mainMenu"
      }
    )
  ],
  customStyles: {
    botMessageBox: {
      width: "500px",
      backgroundColor: "#E2EFFF",
      color:'black'
    },
    chatButton: {
      backgroundColor: "#E2EFFF",
      color: 'black'
    },
  },
  widgets: [
    {
      widgetName: "mainMenu",
      widgetFunc: (props) => (
        <div>
          <MainMenu {...props} />
          <HomeButton {...props} />
        </div>
      )
    },
    {
      widgetName: "orderList",
      widgetFunc: (props) => (
        <div>
          <OrderList {...props} />
          <HomeButton {...props} />
        </div>
      )
    },
    {
      widgetName: "deliveredProductQueries",
      widgetFunc: (props) => (
        <div>
          <DeliveredProductQueries {...props} />
          <HomeButton {...props} />
        </div>
      )
    },
    {
      widgetName: "returnAvailabilityOptions",
      widgetFunc: (props) => {
        const handleClick = (handler) => {
          props.setState((prevState) => ({
            ...prevState,
            messages: prevState.messages.filter(msg => !msg.widget)
          }));
          handler();
        };

        return (
          <div>
            <div className="space-y-1 p-1">
              <button
                onClick={() => handleClick(props.actionProvider.handleReturnAvailabilityYes)}
                className="btn-option"
              >
                Yes
              </button>
              <button
                onClick={() => handleClick(props.actionProvider.handleReturnAvailabilityNo)}
                className="btn-option"
              >
                No
              </button>
            </div>
            <HomeButton {...props} />
          </div>
        );
      },
    },
    {
      widgetName: "returnRefundOptions",
      widgetFunc: (props) => {
        const handleClick = (handler) => {
          props.setState((prevState) => ({
            ...prevState,
            messages: prevState.messages.filter(msg => msg.widget !== "returnRefundOptions")
          }));
          handler();
        };

        const options = [
          {
            text: "Unable to Return - Having issues with return process?",
            description: "Get help with return related problems",
            handler: () => handleClick(props.actionProvider.handleUnableToReturn),
            icon: "🔄",
          },
          {
            text: "Check Refund Status - Track your refund",
            description: "View the current status of your refund",
            handler: () => handleClick(props.actionProvider.handleCheckRefundStatus),
            icon: "💰",
          },
          {
            text: "Refund Not Received - Where is my money?",
            description: "Help with delayed or missing refunds",
            handler: () => handleClick(props.actionProvider.handleRefundNotReceived),
            icon: "❓",
          }
        ];

        return (
          <div>
            <div className="space-y-2 p-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={option.handler}
                  className="flex flex-col items-start w-full p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-yellow-600 hover:text-white transition-all duration-300"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-gray-700">{option.text}</span>
                  </div>
                  <span className="text-xs ml-7 mt-1 text-gray-500">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
            <HomeButton {...props} />
          </div>
        );
      }
    },
    {
      widgetName: "queryForm",
      widgetFunc: (props) => <QueryForm {...props} />
    },
    {
      widgetName: "refundStatus",
      widgetFunc: (props) => <RefundStatus {...props} />
    },
    {
      widgetName: "assistantContact",
      widgetFunc: (props) => <AssistantContact {...props} />
    },
    {
      widgetName: "damagedProductChoice",
      widgetFunc: (props) => {
        const handleClick = (isYes) => {
          props.setState((prevState) => ({
            ...prevState,
            messages: prevState.messages.filter(msg => msg.widget !== "damagedProductChoice")
          }));

          if (isYes) {
            const orderId = props.payload?.orderId;
            props.actionProvider.handleDamagedPackageQuery(orderId);
          } else {
            props.actionProvider.greet(); // Or handle "No" case differently
          }
        };

        return (
          <div>
            <div className="space-y-2 p-2">
              <button
                onClick={() => handleClick(true)}
                className="flex items-center gap-2 w-full p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-yellow-600 hover:text-white transition-all duration-300"
              >
                <span className="text-xl">✅</span>
                <span>Yes, my product is damaged</span>
              </button>
              <button
                onClick={() => handleClick(false)}
                className="flex items-center gap-2 w-full p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-yellow-600 hover:text-white transition-all duration-300"
              >
                <span className="text-xl">❌</span>
                <span>No, my product is fine</span>
              </button>
            </div>
            <HomeButton {...props} />
          </div>
        );
      }
    },
    {
      widgetName: "deliveredOrders",
      widgetFunc: (props) => (
        <div>
          <DeliveredOrders {...props} createChatBotMessage={createChatBotMessage} />
          <HomeButton {...props} />
        </div>
      ),
    },
    {
      widgetName: "addressChangeChoice",
      widgetFunc: (props) => {
        const handleClick = () => {
          props.setState((prevState) => ({
            ...prevState,
            messages: prevState.messages.filter(msg => msg.widget !== "addressChangeChoice")
          }));

          const orderId = props.payload?.orderId;
          props.actionProvider.handleAddressChangeCheck(orderId);
        };

        return (
          <div>
            <div className="space-y-2 p-2">
              <button
                onClick={handleClick}
                className="flex items-center gap-2 w-full p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-yellow-600 hover:text-white transition-all duration-300"
              >
                <span className="text-xl">🏠</span>
                <span>Change Delivery Address</span>
              </button>
            </div>
            <HomeButton {...props} />
          </div>
        );
      },
      widgetFunc: (props) => <AddressChangeChoice {...props} />
    },
    {
      widgetName: "addressChangeLink",
      widgetFunc: (props) => (
        <div>
          <div className="p-2">
            <a
              href={props.payload?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-yellow-600 hover:text-white transition-all duration-300"
            >
              <span className="text-xl">🔗</span>
              <span>Click here to change address</span>
            </a>
          </div>
          <HomeButton {...props} />
        </div>
      )
    },
    {
      widgetName: "paymentOptions",
      widgetFunc: (props) => (
        <div>
          <PaymentOptions {...props} />
          <HomeButton {...props} />
        </div>
      )
    },
    {
      widgetName: "commonPaymentIssues",
      widgetFunc: (props) => <CommonPaymentIssues {...props} />
    },
    {
      widgetName: "paymentStatusCheck",
      widgetFunc: (props) => <PaymentStatusCheck {...props} />
    },
    {
      widgetName: "paymentMethodChangeLink",
      widgetFunc: (props) => (
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
          <HomeButton {...props} />
        </div>
      ),
      widgetFunc: (props) => <PaymentMethodChangeLink {...props} />
    },
    {
      widgetName: "liveAssistant",
      widgetFunc: (props) => (
        <div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-center space-y-3">
              <div className="animate-pulse">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <p className="font-medium text-gray-800">Connecting you with a live assistant...</p>
              <p className="text-sm text-gray-600">Our team will contact you shortly on your registered mobile number.</p>
              <div className="mt-4 text-xs text-gray-500">
                Operating hours: Mon-Sat, 9 AM - 9 PM
              </div>
            </div>
          </div>
          <HomeButton {...props} />
        </div>
      )
    }
  ],
  customComponents: {
    botMessageBox: (props) => (
      <div>
        {props.children}
        <HomeButton {...props} />
      </div>
    ),
    botAvatar: (props) => (
    <img
      src={botAvatar}
      alt="Chatbot Avatar"
      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
    />),
    userAvatar: (props) => (
      <img
        src={userAvatar}
        alt="Chatbot Avatar"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />),
      header: () => <div class="react-chatbot-kit-chat-header">Conversation with Ema    <button
      onClick={toggleTheme}
      className="ml-auto"
    >
      {theme==="dark" ? (
        // Sun icon (white)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.42-1.42"
          />
        </svg>
      ) : (
        // Moon icon (white)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z"
          />
        </svg>
      )}
    </button></div>,
  },
});

export default getConfig;