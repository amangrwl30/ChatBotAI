
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import ThreeScene from "@/components/ThreeScene";
import { Mail, Phone, MapPin, Check } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      interest: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Form submitted successfully",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSuccess(false);
        setFormState({
          name: '',
          email: '',
          company: '',
          phone: '',
          interest: '',
          message: '',
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 hero-gradient">
        <ThreeScene />
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Have questions about our AI solutions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Fill out the form below, and our team will get back to you within 24 hours to discuss how we can help your business.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-ai-purple/10 p-3 rounded-full mr-4">
                    <Mail className="text-ai-purple" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                    <a href="mailto:amanagarwal@umbrellax.in" className="text-ai-purple hover:underline">amanagarwal@umbrellax.in</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-ai-purple/10 p-3 rounded-full mr-4">
                    <Phone className="text-ai-purple" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                    <a href="tel:+15551234567" className="text-ai-purple hover:underline">8112298645</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-ai-purple/10 p-3 rounded-full mr-4">
                    <MapPin className="text-ai-purple" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                    <address className="not-italic text-gray-600 dark:text-gray-400">
                      2951, sector 57, gurugram<br />
                      122001, India
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex justify-between">
                    <span>Monday - Sunday:</span>
                    <span>Anytime</span>
                  </li>
                  {/* <li className="flex justify-between">
                    <span>Saturday - Sunday:</span>
                    <span>Closed</span>
                  </li> */}
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="bg-ai-purple hover:bg-ai-deep-purple text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company Name *
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        placeholder="Company Inc."
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="8112298645"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="interest" className="block text-sm font-medium mb-2">
                      I'm interested in *
                    </label>
                    <Select
                      value={formState.interest}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llm-chatbot">LLM Chatbot</SelectItem>
                        <SelectItem value="voice-ai">Voice AI Assistant</SelectItem>
                        <SelectItem value="virtual-agent">Virtual Customer Agent</SelectItem>
                        <SelectItem value="messaging">Messaging Integrations</SelectItem>
                        <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project and requirements..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-ai-purple hover:bg-ai-deep-purple text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {/* <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Locations</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-[500px] relative">
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Interactive Map Would Be Here</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">San Francisco HQ</h3>
              <address className="not-italic text-gray-600 dark:text-gray-400 mb-4">
                2951, sector 57, gurugram<br />
                122001, India
              </address>
              <p className="text-ai-purple">8112298645</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">London Office</h3>
              <address className="not-italic text-gray-600 dark:text-gray-400 mb-4">
                45 Tech Square<br />
                London, EC2A 4BQ<br />
                United Kingdom
              </address>
              <p className="text-ai-purple">+44 20 1234 5678</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Singapore Office</h3>
              <address className="not-italic text-gray-600 dark:text-gray-400 mb-4">
                8 Marina View<br />
                Singapore, 018960<br />
                Singapore
              </address>
              <p className="text-ai-purple">+65 6123 4567</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for the latest AI insights, product updates, and industry news.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter your email"
              type="email"
              className="bg-white dark:bg-gray-800"
            />
            <Button className="bg-ai-purple hover:bg-ai-deep-purple text-white whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
