import { Button } from "@/components/ui/button";
import HeroScene from "@/components/HeroScene";
import ThreeScene from "@/components/ThreeScene";
import ServiceCard from "@/components/ServiceCard";
import ChatInterface from "@/components/ChatInterface";
import AIModel from "@/components/AIModel";
import { MessageCircle, Headphones, Bot, Globe, Award, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import robot from "../assets/images/robot-norby.png"

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-gradient">
        <HeroScene />
        <div className="container mx-auto px-4 py-24 pt-32 z-10 flex">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-float">
              Next-Gen AI Agents <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-purple to-ai-blue">
                Powering Your Business
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-2xl">
              Virtual customer assistants, LLM-powered chatbots, and voice AI solutions tailored to your specific industry needs.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-ai-purple hover:bg-ai-deep-purple text-white font-medium text-lg px-8 py-6"
                asChild
              >
                <Link to="/get-started">Explore Services</Link>
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple font-medium text-lg px-8 py-6"
                asChild
              >
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>

          {/* Robot Image */}
          <img
            src={robot}
            alt="AI Robot"
            className="absolute right-10 bottom-0 md:right-20 md:bottom-10 w-64 md:w-80 lg:w-[400px] xl:w-[420px] animate-float duration-1000"
          />



        </div>
      </section>


      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Solutions for Every Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our comprehensive suite of AI services designed to transform your customer interactions and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              title="LLM Chatbots"
              description="Intelligent conversational AI powered by advanced language models."
              icon={<Bot size={24} className="text-ai-purple" />}
              features={[
                "24/7 customer support",
                "Multi-language support",
                "Continuous learning",
                "Knowledge base integration"
              ]}
              color="bg-ai-purple"
              serviceType="llm"
            />

            <ServiceCard
              title="Voice AI Assistants"
              description="Natural voice interfaces for seamless customer interactions."
              icon={<Headphones size={24} className="text-ai-blue" />}
              features={[
                "Natural speech recognition",
                "Emotion detection",
                "Voice authentication",
                "Multi-language support"
              ]}
              color="bg-ai-blue"
              serviceType="voice"
            />

            <ServiceCard
              title="Virtual Customer Agents"
              description="Full-service virtual assistants that handle complex queries."
              icon={<MessageCircle size={24} className="text-ai-deep-purple" />}
              features={[
                "Deep domain knowledge",
                "Personalized responses",
                "Intent recognition",
                "Intelligent routing"
              ]}
              color="bg-ai-deep-purple"
              serviceType="crm"
            />

            <ServiceCard
              title="Messaging Integrations"
              description="Connect your AI agents to popular messaging platforms."
              icon={<Globe size={24} className="text-ai-blue" />}
              features={[
                "WhatsApp integration",
                "Facebook Messenger",
                "Telegram support",
                "SMS capabilities"
              ]}
              color="bg-ai-blue"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative">
        <ThreeScene />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience Our AI in Action
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Try out our demo chatbot to see how our AI can understand context, provide helpful responses, and maintain natural conversations.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-ai-purple/20 p-2 rounded-full mr-4 mt-1">
                    <Award size={20} className="text-ai-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Industry-Leading Accuracy</h3>
                    <p className="text-gray-600 dark:text-gray-400">Our AI models are trained on diverse datasets to ensure high accuracy and relevance.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-ai-purple/20 p-2 rounded-full mr-4 mt-1">
                    <Zap size={20} className="text-ai-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Lightning-Fast Responses</h3>
                    <p className="text-gray-600 dark:text-gray-400">Optimized for speed without compromising quality, our AI delivers instant answers.</p>
                  </div>
                </li>
              </ul>
              <Button className="bg-ai-purple hover:bg-ai-deep-purple text-white" asChild>
                <Link to="/services">
                  Learn More <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div>
              <ChatInterface />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our AI Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge technology with practical business applications to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-[300px]">
              <div className="absolute inset-0">
                <AIModel type="brain" color="#8B5CF6" />
              </div>
            </div>
            <div className="relative h-[300px]">
              <div className="absolute inset-0">
                <AIModel type="assistant" color="#0EA5E9" />
              </div>
            </div>
            <div className="relative h-[300px]">
              <div className="absolute inset-0">
                <AIModel type="network" color="#7E69AB" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-ai-purple">Advanced AI Models</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Powered by state-of-the-art large language models and neural networks trained on diverse datasets.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-ai-blue">Seamless Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Easy to integrate with your existing systems, websites, apps, and popular messaging platforms.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-ai-deep-purple">Customized Solutions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tailor-made AI agents that understand your specific industry terminology and business processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Join hundreds of businesses that have elevated their customer interactions with our AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              className="bg-ai-purple hover:bg-ai-deep-purple text-white font-medium text-lg px-8 py-6"
              asChild
            >
              <Link to="/contact">Schedule a Demo</Link>
            </Button>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple font-medium text-lg px-8 py-6"
              asChild
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
