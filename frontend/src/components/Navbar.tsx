import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/robot-norby.png"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-ai-charcoal/80 backdrop-blur-md py-2 shadow-md'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            {/* <span className="text-white font-bold text-lg">Ai</span> */}
            <img src={logo} alt="" />
          </div>
          <span className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-500 via-blue-500 to-purple-700 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-colors duration-300 ease-in-out dark:text-white">
  UmbrellaX
</span> </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-ai-purple ${
                location.pathname === item.path
                  ? 'text-ai-purple'
                  : 'text-ai-charcoal/80 dark:text-white/80'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button 
            onClick={handleGetStarted}
            className="bg-ai-purple hover:bg-ai-deep-purple text-white"
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-ai-charcoal dark:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-ai-charcoal shadow-lg absolute top-full left-0 right-0">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-base font-medium py-2 px-4 rounded-md ${
                  location.pathname === item.path
                    ? 'bg-ai-light-purple text-ai-purple'
                    : 'text-ai-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button 
              onClick={handleGetStarted}
              className="bg-ai-purple hover:bg-ai-deep-purple text-white w-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
