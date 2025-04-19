import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppProvider } from './context/AppContext';

// Lazy load all routes
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const InitialPage = lazy(() => import('./crmcomponents/InitialPage.jsx'));
const LandingPage = lazy(() => import('./crmcomponents/LandingPage'));
const CRMChatBot = lazy(() => import('./crmcomponents/CRMChatBot'));
const AudioChatbot = lazy(() => import('./audioComponent/AudioChatbot'));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200"></div>
  </div>
);

// Layout component to handle navbar and footer visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const isInitialPage = location.pathname === '/get-started';
  const isChatbotRoute = location.pathname.startsWith('/chatbot/');

  return (
    <>
      {!isInitialPage && !isChatbotRoute && <Navbar />}
      {children}
      {!isInitialPage && !isChatbotRoute && <Footer />}
    </>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/get-started" element={<InitialPage />} />
                <Route path="/chatbot/*" element={<InitialPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
