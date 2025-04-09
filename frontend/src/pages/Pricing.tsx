
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import ThreeScene from "@/components/ThreeScene";
import { Bot, Headphones, MessageCircle, Globe, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (faqOpen === index) {
      setFaqOpen(null);
    } else {
      setFaqOpen(index);
    }
  };

  const faqs = [
    {
      question: "What's included in the free trial?",
      answer: "Our 14-day free trial includes full access to all features in the Standard plan, with usage limits. This allows you to test our AI capabilities with your actual use cases before committing to a paid plan."
    },
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing takes effect immediately. If you downgrade, the new pricing takes effect at the start of your next billing cycle."
    },
    {
      question: "How does the pricing work for messaging integrations?",
      answer: "Our messaging integration pricing is based on the number of unique users your AI interacts with each month across all messaging platforms. Additional platform-specific fees (like WhatsApp Business API costs) may apply separately."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes, our Enterprise plan offers fully customized solutions tailored to your specific requirements, including dedicated infrastructure, custom AI model training, and bespoke integrations. Contact our sales team to learn more."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for our Standard and Pro plans. For Enterprise customers, setup fees may apply depending on the complexity of the customization and integration requirements."
    }
  ];

  const discounts = {
    standard: {
      monthly: 49,
      annual: 39,
    },
    pro: {
      monthly: 149,
      annual: 119,
    },
    enterprise: {
      monthly: "Custom",
      annual: "Custom",
    },
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 hero-gradient">
        <ThreeScene />
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Choose the plan that's right for your business needs, with no hidden fees or long-term contracts.
            </p>
            
            <div className="bg-white dark:bg-ai-charcoal inline-flex p-1.5 rounded-full shadow-sm mb-10">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-ai-purple text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-ai-purple text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setBillingPeriod('annual')}
              >
                Annual <span className="text-xs opacity-75">(Save 20%)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Standard"
              price={billingPeriod === 'monthly' 
                ? `$${discounts.standard.monthly}` 
                : `$${discounts.standard.annual}`}
              description="Perfect for small businesses looking to enhance customer support."
              icon={<Bot size={24} className="text-ai-purple" />}
              features={[
                "1 AI chatbot or voice assistant",
                "Up to 1,000 interactions/month",
                "Basic analytics dashboard",
                "Email support",
                "Website integration",
                "Knowledge base integration",
                "2 admin users",
              ]}
              buttonText="Start 14-day Trial"
              buttonLink="/contact"
            />

            <PricingCard
              title="Pro"
              price={billingPeriod === 'monthly' 
                ? `$${discounts.pro.monthly}` 
                : `$${discounts.pro.annual}`}
              description="Ideal for growing businesses with increasing support demands."
              icon={<MessageCircle size={24} className="text-ai-purple" />}
              recommended={true}
              features={[
                "3 AI assistants of any type",
                "Up to 5,000 interactions/month",
                "Advanced analytics & reporting",
                "Priority email & chat support",
                "All integrations (Web, WhatsApp, etc.)",
                "Custom AI training",
                "5 admin users",
                "Human handoff functionality",
              ]}
              buttonText="Start 14-day Trial"
              buttonLink="/contact"
            />

            <PricingCard
              title="Enterprise"
              price={discounts.enterprise.monthly}
              description="Custom solutions for large organizations with complex needs."
              icon={<Globe size={24} className="text-ai-purple" />}
              features={[
                "Unlimited AI assistants",
                "Unlimited interactions",
                "Custom analytics & reporting",
                "24/7 dedicated support",
                "All current and future integrations",
                "Custom AI model development",
                "Unlimited admin users",
                "SLA guarantees",
                "Dedicated infrastructure",
                "White-labeling options",
              ]}
              buttonText="Contact Sales"
              buttonLink="/contact"
            />
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Compare Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A detailed comparison of what's included in each of our plans.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 text-left font-semibold text-gray-800 dark:text-gray-200">Feature</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-gray-200">Standard</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-gray-200">
                    Pro
                    <span className="ml-2 inline-block py-0.5 px-2 text-xs bg-ai-purple text-white rounded-full">Recommended</span>
                  </th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-gray-200">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Number of AI assistants</td>
                  <td className="py-4 px-6 text-center">1</td>
                  <td className="py-4 px-6 text-center">3</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Monthly interactions</td>
                  <td className="py-4 px-6 text-center">1,000</td>
                  <td className="py-4 px-6 text-center">5,000</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">LLM chatbot</td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Voice AI</td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">WhatsApp integration</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Custom AI training</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Analytics & reporting</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Custom</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Human handoff</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">Support level</td>
                  <td className="py-4 px-6 text-center">Email</td>
                  <td className="py-4 px-6 text-center">Priority</td>
                  <td className="py-4 px-6 text-center">24/7 Dedicated</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">SLA guarantees</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center"><Check size={20} className="inline text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our pricing and plans.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  {faqOpen === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                {faqOpen === index && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 mt-1 rounded-lg text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              className="bg-ai-purple hover:bg-ai-deep-purple text-white"
              asChild
            >
              <Link to="/contact">
                Start Free Trial
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple"
              asChild
            >
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
