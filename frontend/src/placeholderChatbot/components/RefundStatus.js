import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import HomeButton from "./HomeButton";

const RefundStatus = (props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundData, setRefundData] = useState(null);

  useEffect(() => {
    fetchRefundStatus();
  }, []);

  const fetchRefundStatus = async () => {
    try {
      const orderId = props.payload?.orderId || "102"; // Use provided orderId or default
      const response = await fetch(`http://localhost:8080/checkRefundStatus?orderId=${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch refund status');
      const data = await response.json();
      setRefundData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <FontAwesomeIcon icon={faSpinner} spin className="text-yellow-600 text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
        <HomeButton {...props} />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Order ID</span>
            <span className="text-sm font-bold text-gray-800">#{refundData.orderId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={refundData.refundStatus === "COMPLETED" ? faCheckCircle : faClock}
                className={refundData.refundStatus === "COMPLETED" ? "text-green-500" : "text-yellow-500"}
              />
              <span className={`text-sm font-bold ${
                refundData.refundStatus === "COMPLETED" ? "text-green-600" : "text-yellow-600"
              }`}>
                {refundData.refundStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Transaction ID</span>
            <span className="text-sm font-mono bg-gray-600 px-2 py-1 rounded">
              {refundData.transactionId}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Initiated On</span>
              <span className="text-sm text-gray-800">
                {formatDate(refundData.refund_initiated_date)}
              </span>
            </div>
            
            {refundData.refundStatus === "COMPLETED" && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Completed On</span>
                <span className="text-sm text-gray-800">
                  {formatDate(refundData.refund_completed_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <HomeButton {...props} />
    </div>
  );
};

export default RefundStatus;