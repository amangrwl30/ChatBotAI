import { playMessageSound } from './utils/sound';
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }



  // Add new method to handle user messages
  addUserMessage = (text) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, {
        message: text,
        type: 'user'
      }]
    }));
  };

  greet = () => {
    const message = this.createChatBotMessage("Hello! How can I assist you today?", {
      widget: "mainMenu"
    });
    this.addMessageToState(message);
  };

  handleWhereIsMyOrder = () => {
    this.addUserMessage("Where is My Order?");
    const message = this.createChatBotMessage("Fetching all your orders...", {
      widget: "orderList"
    });
    this.addMessageToState(message);
  };

  handleOrderDetail = (order, productDetail) => {
    const deliveryMessage = this.createChatBotMessage(`Checking status for Order ID: ${order.orderId}`);
    this.addMessageToState(deliveryMessage);

    if (productDetail.status === "DELIVERED") {
      // For delivered products, show the queries widget with both options
      
      const message = this.createChatBotMessage(
        `For Order ID: ${order.orderId}, please select your issue:`,
        {
          widget: "deliveredProductQueries",
          payload: { order, productDetail }
        }
      );
      this.addMessageToState(message);
    } else {
      // For non-delivered orders, show address change option
      const message = this.createChatBotMessage(
        "Would you like to change the delivery address?",
        {
          widget: "addressChangeChoice",
          payload: { orderId: order.orderId }
        }
      );
      this.addMessageToState(message);
    }
  };

  handleChangeDeliveryAddress = (orderId) => {
    const message = this.createChatBotMessage("Checking if the delivery address can be changed...");
    this.addMessageToState(message);
    // Placeholder for logic to check if order is in progress
    const isChangeable = true;  // Placeholder for actual logic
    if (isChangeable) {
      const message2 = this.createChatBotMessage("Yes, you can change your delivery address. Please go to this link: <link>");
      this.addMessageToState(message2);
    } else {
      const message2 = this.createChatBotMessage("No, you cannot change the delivery address at this stage.");
      this.addMessageToState(message2);
    }
  };

  handleDamagedPackage = (orderId) => {
    const message = this.createChatBotMessage("Checking return availability for the product...");
    this.addMessageToState(message);
    // Placeholder for logic to check return availability
    const isReturnAvailable = true;  // Placeholder for actual logic
    if (isReturnAvailable) {
      const message2 = this.createChatBotMessage("You can return the product. Here are the steps to return it: [steps]");
      this.addMessageToState(message2);
    } else {
      const message2 = this.createChatBotMessage("You cannot return the product. Here are the steps to raise a concern: [steps]");
      this.addMessageToState(message2);
    }
  };

  handleQueriesIssue = () => {
    this.addUserMessage("Queries related to my Delivered product");
    const message = this.createChatBotMessage(
      "Please select from your delivered orders:", 
      {
        widget: "deliveredOrders"
      }
    );
    this.addMessageToState(message);
  };

  handleDamagedPackageQuery = async (orderId) => {
    this.addUserMessage("📦 Damaged Package?");
    try {
      // First show loading message
      const loadingMessage = this.createChatBotMessage("Checking return eligibility...");
      this.addMessageToState(loadingMessage);
  
      // Call the API
      const response = await fetch(`http://localhost:8080/damagedProductInquiry?orderId=${orderId}`);
      if (!response.ok) throw new Error('Failed to check return eligibility');
      
      const data = await response.json();
      
      if (data.isReturnApplicable) {
        // If return is applicable, show return steps
        const message = this.createChatBotMessage(
          "You can return this product. Here are the steps:",
          {
            widget: "returnSteps"
          }
        );
        this.addMessageToState(message);
      } else {
        // If return is not applicable, show the message and contact support
        const message = this.createChatBotMessage(data.description);
        this.addMessageToState(message);

        // Add contact support widget
        const supportMessage = this.createChatBotMessage(
          "Please contact our support team for assistance:",
          {
            widget: "assistantContact"
          }
        );
        this.addMessageToState(supportMessage);
      }
    } catch (err) {
      console.error('Error checking return eligibility:', err);
      const errorMessage = this.createChatBotMessage(
        "Sorry, we couldn't check the return eligibility. Please try again later.",
        {
          widget: "assistantContact"
        }
      );
      this.addMessageToState(errorMessage);
    }
  };

  handleReturnRefundIssues = () => {
    this.addUserMessage("Return/Refund Issues");
    const message = this.createChatBotMessage("Select your issue:", {
      widget: "returnRefundOptions"
    });
    this.addMessageToState(message);
  };

  handleReturnAvailabilityYes = () => {
    const message = this.createChatBotMessage("Here are the steps to return your product:", {
      widget: "returnSteps"
    });
    this.addMessageToState(message);
  };

  handleReturnAvailabilityNo = () => {
    const message = this.createChatBotMessage("Here are the steps to raise a complaint:", {
      widget: "complaintSteps"
    });
    this.addMessageToState(message);
  };

  handleUnableToReturn = () => {
    this.addUserMessage("Unable to Return - Having issues with return process?");
    const message = this.createChatBotMessage(
      "I understand you're having trouble with returning your product. Let me help you with that.",
      {
        widget: "queryForm"
      }
    );
    this.addMessageToState(message);
  };

  handleCheckRefundStatus = () => {
    this.addUserMessage("Check Refund Status - Track your refund");
    const message = this.createChatBotMessage(
      "I'll help you check your refund status. Please wait while I fetch the details...",
      {
        widget: "refundStatus"
      }
    );
    this.addMessageToState(message);
  };

  handleRefundNotReceived = () => {
    this.addUserMessage("Refund Not Received - Where is my money?");
    const message = this.createChatBotMessage(
      "I see that you haven't received your refund yet. Let me connect you with our support team for immediate assistance.",
      {
        widget: "assistantContact"
      }
    );
    this.addMessageToState(message);
  };

  handleAddressChangeCheck = async (orderId) => {
    this.addUserMessage("🏠 Change Delivery Address");
    try {
      const loadingMessage = this.createChatBotMessage("Checking if address change is possible...");
      this.addMessageToState(loadingMessage);

      const response = await fetch(`http://localhost:3001/orders/address-change-status?orderId=${orderId}`);
      if (!response.ok) throw new Error('Failed to check address change status');
      
      const data = await response.json();
      
      if (data.isAddressChangeAllowed) {
        const message = this.createChatBotMessage(
          "Yes, you can change your delivery address. Click here to update:",
          {
            widget: "addressChangeLink",
            payload: { link: data.selfLink }
          }
        );
        this.addMessageToState(message);
      } else {
        // Show the error message from API
        const message = this.createChatBotMessage(data.description);
        this.addMessageToState(message);

        // Show contact support option
        const supportMessage = this.createChatBotMessage(
          "Need help? Contact our support team:",
          {
            widget: "assistantContact"
          }
        );
        this.addMessageToState(supportMessage);
      }
    } catch (err) {
      console.error('Error checking address change status:', err);
      const errorMessage = this.createChatBotMessage(
        "Sorry, we couldn't check if address change is possible. Please try again later.",
        {
          widget: "assistantContact"
        }
      );
      this.addMessageToState(errorMessage);
    }
  };

  handlePaymentRelated = () => {
    this.addUserMessage("Payment Related");
    const message = this.createChatBotMessage(
      "Please select your payment related issue:",
      {
        widget: "paymentOptions"
      }
    );
    this.addMessageToState(message);
  };

  handleGeneralQuery = () => {
    this.addUserMessage("Still have a Query");
    const message = this.createChatBotMessage(
      "I'll connect you with our live assistant right away.",
      {
        widget: "liveAssistant"
      }
    );
    this.addMessageToState(message);
  };

  handleChangePaymentMethod = () => {
    this.addUserMessage("Change Payment Method");
    const message = this.createChatBotMessage(
      "To change your payment method, please select an order:",
      {
        widget: "orderList",
        payload: { context: "payment" }
      }
    );
    this.addMessageToState(message);
  };

  handleCommonPaymentIssues = () => {
    this.addUserMessage("Common Payment Issues");
    const message = this.createChatBotMessage(
      "Here are some common payment issues and their solutions:",
      {
        widget: "commonPaymentIssues"
      }
    );
    this.addMessageToState(message);
  };

  handleVerifyPaymentStatus = () => {
    this.addUserMessage("Verify Payment Status");
    const message = this.createChatBotMessage(
      "Please provide your order details to check payment status:",
      {
        widget: "paymentStatusCheck"
      }
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message]
    }));
    
    // Play sound for bot messages (not user messages)
    if (!message.type || message.type !== 'user') {
      playMessageSound();
    }
  };
}

export default ActionProvider;