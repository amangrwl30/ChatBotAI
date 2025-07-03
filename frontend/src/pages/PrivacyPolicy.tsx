import React from 'react';

const PrivacyPolicy = () => (
  <div className="container mx-auto px-4 py-16 min-h-screen">
    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    <p className="mb-4">This Privacy Policy describes how UmbrellaX collects, uses, and protects your information when you use our website and services. We are committed to safeguarding your privacy and ensuring your personal information is protected.</p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Personal identification information (Name, email address, phone number, etc.)</li>
      <li>Usage data and cookies</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>To provide and maintain our services</li>
      <li>To improve our website and offerings</li>
      <li>To communicate with you</li>
      <li>To comply with legal obligations</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
    <p className="mb-4">You have the right to access, update, or delete your personal information. For any privacy-related requests, please contact us at <a href="mailto:amanagarwal@umbrellax.in" className="text-ai-purple underline">amanagarwal@umbrellax.in</a>.</p>
    <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().getFullYear()}</p>
  </div>
);

export default PrivacyPolicy; 