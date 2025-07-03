import React from 'react';

const TermsAndConditions = () => (
  <div className="container mx-auto px-4 py-16 min-h-screen">
    <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
    <p className="mb-4">Welcome to UmbrellaX. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Use of Our Services</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>You must use our services in compliance with all applicable laws and regulations.</li>
      <li>Do not misuse or interfere with our services or try to access them using a method other than the interface provided.</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">Intellectual Property</h2>
    <p className="mb-4">All content, trademarks, and data on this website are the property of UmbrellaX or its licensors.</p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Limitation of Liability</h2>
    <p className="mb-4">UmbrellaX is not liable for any damages arising from the use or inability to use our services.</p>
    <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().getFullYear()}</p>
  </div>
);

export default TermsAndConditions; 