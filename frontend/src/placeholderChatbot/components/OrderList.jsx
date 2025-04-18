import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCheckCircle, faClock, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";
import { AppContext } from "../../context/AppContext";

const OrderList = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [allDisabled, setAllDisabled] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  
  // Add fallback for context
  const context = useContext(AppContext);
  const { sharedState = {}, setSharedState = () => {} } = context || {};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL_EMA + '/orders?userId=1');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProductDetail = async (orderId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL_EMA + `/order?orderId=${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('orders-scroll-container');
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
    const container = document.getElementById('orders-scroll-container');
    setScrollPosition(container.scrollLeft);

    // Check if the end is reached
    const isEnd = container.scrollWidth - container.scrollLeft === container.clientWidth;
    setIsEndReached(isEnd);
  };

  const orderHandler = async (order) => {
    setAllDisabled(true);
    if (order.status === 'CANCELLED') {
      props.actionProvider.addMessageToState(
        props.actionProvider.createChatBotMessage(
          `For cancelled orders, please connect with our Assistant for more info at 123-456-7890.`
        )
      );
      return;
    }

    setSharedState({ ...sharedState, selectedOrder: order });
    const productDetail = await fetchProductDetail(order.orderId);
    if (productDetail) {
      props.actionProvider.handleOrderDetail(order, productDetail);
    } else {
      console.error('Failed to fetch product details');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      'DELIVERED': 'text-green-600',
      'SHIPPED': 'text-blue-600',
      'CANCELLED': 'text-red-600',
      'REFUNDED': 'text-yellow-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="relative">
      <div className="bg-[#3F6679] ml-14 mb-2 text-white text-sm font-medium px-4 py-2 rounded-xl text-center w-fit">
        Here are your recent orders:
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
          id="orders-scroll-container"
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
              onClick={() => !allDisabled && orderHandler(order)}
              className={`
                group flex-none w-72 rounded-xl shadow-md p-5 cursor-pointer 
                hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 
                border border-gray-100 relative overflow-hidden
                ${allDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
               <img src={order.imageUrl} alt="background"  class="absolute inset-0 w-full h-full object-cover opacity-30" />
              {/* Decorative Elements with darker matching colors */}
              <div className={`
                absolute -right-8 -top-8 w-16 h-16 rounded-full opacity-40 group-hover:scale-150 transition-transform duration-500
                ${order.status === 'DELIVERED' ? 'bg-gradient-to-br from-green-300 to-green-200' :
                  order.status === 'SHIPPED' ? 'bg-gradient-to-br from-blue-300 to-blue-200' :
                  order.status === 'CANCELLED' ? 'bg-gradient-to-br from-red-300 to-red-200' :
                  'bg-gradient-to-br from-yellow-300 to-yellow-200'}
              `}></div>
              
              {/* Status Badge - slightly darker */}
              <div className="flex justify-between items-start mb-4 relative">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                  ${order.status === 'DELIVERED' ? 'bg-green-200 text-green-800 border border-green-300' : 
                    order.status === 'SHIPPED' ? 'bg-blue-200 text-blue-800 border border-blue-300' :
                    order.status === 'CANCELLED' ? 'bg-red-200 text-red-800 border border-red-300' :
                    'bg-yellow-200 text-yellow-800 border border-yellow-300'}
                `}>
                  {order.status}
                </span>
                <span className="text-sm font-bold text-gray-800 bg-white/90 px-3 py-1 rounded-full shadow-sm border border-gray-200">
                  ₹{order.amount}
                </span>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <div>
                  <h3 className={`
                    font-semibold text-gray-800 line-clamp-2 text-base transition-colors duration-300
                    group-hover:${order.status === 'DELIVERED' ? 'text-green-700' :
                      order.status === 'SHIPPED' ? 'text-blue-700' :
                      order.status === 'CANCELLED' ? 'text-red-700' :
                      'text-yellow-700'}
                  `}>
                    {order.name}
                  </h3>
                  <div className="mt-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-md inline-block border border-gray-100">
                    #{order.orderId}
                  </div>
                </div>

                {/* Timeline with enhanced styling */}
                <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={order.status === 'DELIVERED' ? faCheckCircle : order.status === 'CANCELLED' ? faTimesCircle : faClock} 
                      className={`text-lg ${order.status === 'DELIVERED' ? 'text-green-500' : 
                        order.status === 'SHIPPED' ? 'text-blue-500' :
                        order.status === 'CANCELLED' ? 'text-red-500' :
                        'text-yellow-500'}`}
                    />
                    <div className={`
                      absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping
                      ${order.status === 'DELIVERED' ? 'bg-green-400' :
                        order.status === 'SHIPPED' ? 'bg-blue-400' :
                        order.status === 'CANCELLED' ? 'bg-red-400' :
                        'bg-yellow-400'}
                    `}></div>
                  </div>
                  <div className="ml-3">
                    <span className="text-gray-400">
                      {order.status === 'DELIVERED' ? 'Delivered on: ' : 
                        order.status === 'CANCELLED' ? 'Cancelled on: ' : 'Ordered on: '}
                    </span>
                    <span className="font-medium text-gray-600">{formatDate(order.created_on)}</span>
                  </div>
                </div>
              </div>

              {/* Hover Effects */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                <div className={`
                  flex items-center text-sm font-medium
                  ${order.status === 'DELIVERED' ? 'text-green-600' :
                    order.status === 'SHIPPED' ? 'text-blue-600' :
                    order.status === 'CANCELLED' ? 'text-red-600' :
                    'text-yellow-600'}
                `}>
                  {/* <span className="mr-1">View Details</span>
                  <FontAwesomeIcon icon={faChevronRight} /> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {scrollPosition > 0 && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 z-10 hover:bg-white hover:shadow-xl transition-all duration-300"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
          </button>
        )}

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

export default OrderList;