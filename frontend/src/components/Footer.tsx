import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-ai-charcoal pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-purple to-ai-blue flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ai</span>
              </div>
              <span className="text-2xl font-bold text-ai-charcoal dark:text-white">UmbrellaX</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Next-generation AI agents for your business. Enhancing customer experiences with intelligent automation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ai-purple">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ai-purple">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ai-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ai-purple">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ai-charcoal dark:text-white">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Virtual Assistants</Link></li>
              <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">LLM Chatbots</Link></li>
              <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Voice AI</Link></li>
              <li><Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">WhatsApp Integration</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ai-charcoal dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">About Us</Link></li>
              <li><Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Pricing</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Careers</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ai-charcoal dark:text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <a href="mailto:amanagarwal@umbrellax.in" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">amanagarwal@umbrellax.in</a>
              </li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Support</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-ai-purple">Sales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AI UmbrellaX. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-ai-purple">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-sm text-gray-600 dark:text-gray-400 hover:text-ai-purple">Terms & Conditions</Link>
            <Link to="/refund-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-ai-purple">Refund Policy</Link>
            <Link to="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-ai-purple">Services</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
