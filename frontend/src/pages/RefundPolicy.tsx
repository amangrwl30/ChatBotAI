import React from 'react';

const RefundPolicy = () => (
  <div className="container mx-auto px-4 py-16 min-h-screen">
    <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
    <p className="mb-4">At UmbrellaX, we strive to provide the best service possible. If you are not satisfied with your purchase, please review our refund policy below.</p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Eligibility for Refunds</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Refund requests must be made within 14 days of purchase.</li>
      <li>To be eligible, your request must include proof of purchase and a valid reason for the refund.</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">Non-Refundable Items</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Services that have already been rendered</li>
      <li>Digital products that have been downloaded or accessed</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">How to Request a Refund</h2>
    <p className="mb-4">To request a refund, please contact us at <a href="mailto:amanagarwal@umbrellax.in" className="text-ai-purple underline">amanagarwal@umbrellax.in</a> with your order details.</p>
    <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().getFullYear()}</p>
  </div>
);

export default RefundPolicy; 