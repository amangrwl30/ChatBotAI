import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const DeliveredOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isOrderSelected, setIsOrderSelected] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/orders?userId=1');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      // Filter only delivered orders
      const deliveredOrders = data.filter(order => order.status === 'DELIVERED');
      setOrders(deliveredOrders);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('delivered-orders-container');
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    setScrollPosition(container.scrollLeft);

    // Check if the end is reached
    const isEnd = container.scrollWidth - container.scrollLeft === container.clientWidth;
    setIsEndReached(isEnd);
  };

  const handleOnScroll = () => {
    const container = document.getElementById('delivered-orders-container');
    const isEnd = container.scrollWidth - container.scrollLeft === container.clientWidth;
    setIsEndReached(isEnd);
  };

  const handleOrderClick = async (order) => {
    try {
      const response = await fetch(`http://localhost:8080/order?orderId=${order.orderId}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      const productDetail = await response.json();

      // Set the order selected state to true
      setIsOrderSelected(true);

      // Show the two main options: Damaged Package or Return/Refund Issues
      const message = props.createChatBotMessage(
        `For Order ID: ${order.orderId}, please select your issue:`,
        {
          widget: "deliveredProductQueries",
          payload: { order, productDetail }
        }
      );
      props.actionProvider.addMessageToState(message);

    } catch (err) {
      console.error('Error fetching product details:', err);
      props.actionProvider.addMessageToState(
        "Sorry, I couldn't fetch the order details. Please try again."
      );
    }
  };

  if (loading) return <div className="text-center p-4">Loading delivered orders...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (orders.length === 0) return <div className="text-center p-4">No delivered orders found</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="relative">
      <div className="bg-[#3F6679] ml-12 mb-2 text-white text-sm font-medium px-4 py-2 rounded-xl text-center w-fit">
      Select the delivered order you have queries about:
      </div>
      
      <div className="relative">
        {scrollPosition > 0 && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 z-10 hover:bg-white hover:shadow-xl transition-all duration-300"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
          </button>
        )}
        
        <div 
          id="delivered-orders-container"
          className="flex overflow-x-auto space-x-4 pb-4 px-2"
          style={{ 
            scrollBehavior: 'smooth', 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none' 
          }}
          onScroll={handleOnScroll}
        >
          {orders.map((order) => (
            <div 
              key={order.orderId}
              onClick={() => !isOrderSelected && handleOrderClick(order)}
              className={`group flex-none w-72 rounded-xl shadow-md p-5 cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative overflow-hidden bg-gradient-to-br from-green-100 to-green-50 ${
                isOrderSelected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full opacity-40 group-hover:scale-150 transition-transform duration-500 bg-gradient-to-br from-green-300 to-green-200"></div>
              
              <div className="flex justify-between items-start mb-4 relative">
                <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-green-200 text-green-800 border border-green-300">
                  DELIVERED
                </span>
                <span className="text-sm font-bold text-gray-800 bg-white/90 px-3 py-1 rounded-full shadow-sm border border-gray-200">
                  ₹{order.amount}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2 text-base transition-colors duration-300 group-hover:text-green-700">
                    {order.name}
                  </h3>
                  <div className="mt-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-md inline-block border border-gray-100">
                    #{order.orderId}
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faCheckCircle}
                      className="text-lg text-green-500"
                    />
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping bg-green-400"></div>
                  </div>
                  <div className="ml-3">
                    <span className="text-gray-400">Delivered on: </span>
                    <span className="font-medium text-gray-600">{formatDate(order.created_on)}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                <div className="flex items-center text-sm font-medium text-green-600">
                  {/* <span className="mr-1">Select Order</span>
                  <FontAwesomeIcon icon={faChevronRight} /> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isEndReached && (
          <button 
            onClick={() => handleScroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 z-10 hover:bg-white hover:shadow-xl transition-all duration-300"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveredOrders;