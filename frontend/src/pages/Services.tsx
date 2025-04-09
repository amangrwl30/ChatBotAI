
import { Button } from "@/components/ui/button";
import ThreeScene from "@/components/ThreeScene";
import AIModel from "@/components/AIModel";
import { 
  Bot, MessageCircle, Headphones, Globe, Check, ArrowRight, 
  Sparkles, BrainCircuit, BarChart, Users, Shield, Database, 
  Lightbulb, RefreshCw 
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 hero-gradient">
        <ThreeScene />
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Complete AI Services
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Discover our comprehensive range of AI solutions designed to transform how your business interacts with customers and processes information.
            </p>
            <Button
              className="bg-ai-purple hover:bg-ai-deep-purple text-white"
              asChild
            >
              <Link to="/contact">
                Get a Custom Solution <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LLM Chatbots */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-ai-purple/10 text-ai-purple px-3 py-1 rounded-full inline-flex items-center mb-4">
                <Bot size={16} className="mr-1" />
                <span className="text-sm font-medium">LLM Chatbots</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Advanced Language Model Powered Chatbots
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our intelligent chatbots leverage the latest advancements in large language models to provide human-like conversations, understanding context and nuance while delivering accurate information.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="text-ai-purple mr-2 flex-shrink-0" />
                  <span>24/7 customer support without human intervention</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-purple mr-2 flex-shrink-0" />
                  <span>Support for over 50 languages with accurate translation</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-purple mr-2 flex-shrink-0" />
                  <span>Continuous learning from interactions to improve over time</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-purple mr-2 flex-shrink-0" />
                  <span>Seamless integration with your knowledge base and CRM</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-purple mr-2 flex-shrink-0" />
                  <span>Advanced contextual understanding and memory capabilities</span>
                </li>
              </ul>
              <Button
                className="bg-ai-purple hover:bg-ai-deep-purple text-white"
                asChild
              >
                <Link to="/contact">
                  Request a Demo <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 h-[400px] relative">
              <div className="absolute inset-0">
                <AIModel type="brain" color="#8B5CF6" size={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice AI */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-[400px] relative">
              <div className="absolute inset-0">
                <AIModel type="assistant" color="#0EA5E9" size={1.5} />
              </div>
            </div>
            <div>
              <div className="bg-ai-blue/10 text-ai-blue px-3 py-1 rounded-full inline-flex items-center mb-4">
                <Headphones size={16} className="mr-1" />
                <span className="text-sm font-medium">Voice AI Assistants</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Natural Voice Interfaces for Seamless Interaction
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our voice AI solutions transform how users interact with your systems, providing natural speech recognition and response generation that feels like talking to a human assistant.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Advanced speech recognition with 98% accuracy</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Emotion detection and sentiment-aware responses</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Voice authentication for secure transactions</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Natural-sounding voice synthesis technology</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Multi-language support with accent recognition</span>
                </li>
              </ul>
              <Button
                className="bg-ai-blue hover:bg-blue-600 text-white"
                asChild
              >
                <Link to="/contact">
                  Request a Demo <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Customer Agents */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-ai-deep-purple/10 text-ai-deep-purple px-3 py-1 rounded-full inline-flex items-center mb-4">
                <MessageCircle size={16} className="mr-1" />
                <span className="text-sm font-medium">Virtual Customer Agents</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Full-Service Virtual Assistants for Complex Support
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our virtual customer agents go beyond simple chatbots, handling complex queries and providing end-to-end support for your customers across multiple channels.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="text-ai-deep-purple mr-2 flex-shrink-0" />
                  <span>Deep domain knowledge customized to your industry</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-deep-purple mr-2 flex-shrink-0" />
                  <span>Personalized responses based on customer history</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-deep-purple mr-2 flex-shrink-0" />
                  <span>Advanced intent recognition and entity extraction</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-deep-purple mr-2 flex-shrink-0" />
                  <span>Intelligent routing to human agents when needed</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-deep-purple mr-2 flex-shrink-0" />
                  <span>Omnichannel presence with unified customer view</span>
                </li>
              </ul>
              <Button
                className="bg-ai-deep-purple hover:bg-purple-700 text-white"
                asChild
              >
                <Link to="/contact">
                  Request a Demo <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 h-[400px] relative">
              <div className="absolute inset-0">
                <AIModel type="network" color="#7E69AB" size={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Messaging Integrations */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-[400px] relative">
              <ThreeScene className="opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe size={120} className="text-ai-blue opacity-80" />
              </div>
            </div>
            <div>
              <div className="bg-ai-blue/10 text-ai-blue px-3 py-1 rounded-full inline-flex items-center mb-4">
                <Globe size={16} className="mr-1" />
                <span className="text-sm font-medium">Messaging Integrations</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Connect Your AI to Popular Messaging Platforms
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Meet your customers where they already are by integrating our AI solutions with the messaging platforms they use every day.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>WhatsApp Business API integration</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Facebook Messenger chatbot deployment</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Telegram bot with full AI capabilities</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>SMS integration for text-based support</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-ai-blue mr-2 flex-shrink-0" />
                  <span>Unified inbox for managing all conversations</span>
                </li>
              </ul>
              <Button
                className="bg-ai-blue hover:bg-blue-600 text-white"
                asChild
              >
                <Link to="/contact">
                  Request a Demo <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Key Features of Our AI Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our AI platform comes packed with powerful features to enhance customer experiences and streamline your operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BrainCircuit size={24} className="text-ai-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Context Awareness</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI maintains context throughout conversations, remembering details without asking users to repeat information.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart size={24} className="text-ai-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive analytics provide insights into customer interactions, common queries, and satisfaction levels.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-deep-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-ai-deep-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detect customer emotions and adjust responses accordingly to provide empathetic and appropriate support.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users size={24} className="text-ai-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Human Handoff</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seamlessly transfer complex conversations to human agents with full context preservation when needed.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield size={24} className="text-ai-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bank-grade encryption, data protection, and compliance with GDPR, HIPAA, and other regulations.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-deep-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Database size={24} className="text-ai-deep-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect to your existing databases, documentation, and CRM systems for accurate and up-to-date information.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lightbulb size={24} className="text-ai-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proactive Suggestions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Offer proactive assistance based on user behavior, preventing issues before they arise.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="bg-ai-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <RefreshCw size={24} className="text-ai-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI systems learn from each interaction, constantly improving their responses and effectiveness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Implement AI in Your Business?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Contact our team to discover how our AI solutions can be tailored to your specific industry and business needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              className="bg-ai-purple hover:bg-ai-deep-purple text-white"
              asChild
            >
              <Link to="/contact">
                Contact Us Today <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple"
              asChild
            >
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
