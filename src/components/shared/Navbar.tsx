import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Menu } from "lucide-react";

interface NavbarProps {
  showCreateAccount?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showCreateAccount = true
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onGetStarted = () => {
    navigate("/auth");
    setIsMobileMenuOpen(false);
  };

  const onSignIn = () => {
    navigate("/auth");
    setIsMobileMenuOpen(false);
  };

  const onHome = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onHome}
              className="flex items-center space-x-2 group transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">ServiceGPT</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={onHome}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/how-it-works")}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
            >
              How it Works
            </button>
            <button
              onClick={() => navigate("/services")}
              className="px-4 py-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              Services
            </button>
            <button
              onClick={() => navigate("/professionals")}
              className="px-4 py-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              For Professionals
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="px-4 py-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/support")}
              className="px-4 py-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              Support
            </button>

            <div className="pl-4 flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin")}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <span>Admin</span>
                <span className="px-1.5 py-0.5 bg-red-600/80 rounded text-xs backdrop-blur-sm">TEST</span>
              </button>
              <button
                onClick={onSignIn}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                Sign In
              </button>
              {showCreateAccount && (
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-sm"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/how-it-works");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                How it Works
              </button>
              <button
                onClick={() => {
                  navigate("/services");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                Services
              </button>
              <button
                onClick={() => {
                  navigate("/professionals");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                For Professionals
              </button>
              <button
                onClick={() => {
                  navigate("/pricing");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  navigate("/support");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                Support
              </button>
              
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => {
                      navigate("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Sign In
                  </button>
                  {showCreateAccount && (
                    <button
                      onClick={onGetStarted}
                      className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-full shadow-sm"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
