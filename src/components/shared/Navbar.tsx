import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Menu } from 'lucide-react';

interface NavbarProps {
  showCreateAccount?: boolean;
  currentPage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showCreateAccount = true, 
  currentPage = 'home' 
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onGetStarted = () => {
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  const onSignIn = () => {
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  const onHome = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-gray-100/50 dark:bg-black/20 backdrop-blur-xl transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl px-6 py-4 shadow-lg shadow-gray-300/30 dark:shadow-none transition-all duration-500">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={onHome}
                className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-700 dark:text-white transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">HireLocalGPT</span>
              </button>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center bg-gray-100/70 dark:bg-white/5 backdrop-blur-lg border border-gray-300/50 dark:border-white/10 rounded-full px-4 py-3 shadow-lg shadow-gray-400/10 dark:shadow-none transition-all duration-500 hover:shadow-xl hover:bg-gray-50/80 dark:hover:bg-white/8">
              <button 
                onClick={onHome}
                className={`px-8 py-2.5 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                  currentPage === 'home' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 scale-105' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:shadow-md hover:scale-105'
                }`}
              >
                <span className="relative z-10">Home</span>
                {currentPage !== 'home' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 opacity-0 hover:opacity-100 rounded-full" />
                )}
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className={`px-8 py-2.5 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                  currentPage === 'how-it-works' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 scale-105' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:shadow-md hover:scale-105'
                }`}
              >
                <span className="relative z-10">How it Works</span>
                {currentPage !== 'how-it-works' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 opacity-0 hover:opacity-100 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => navigate('/contact')} 
                className="px-8 py-2.5 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:shadow-md hover:scale-105 rounded-full transition-all duration-300 font-medium relative overflow-hidden"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 opacity-0 hover:opacity-100 rounded-full" />
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button 
                onClick={onSignIn}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-6 py-2.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/10 hover:shadow-md transition-all duration-300 font-medium hover:scale-105"
              >
                Sign In
              </button>
              {showCreateAccount && (
                <button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 text-white backdrop-blur-sm border border-gray-200/80 dark:border-blue-400/20 px-8 py-2.5 rounded-full transition-all duration-300 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-700 dark:text-white hover:bg-white/60 dark:hover:bg-white/10 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 transform rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 transform transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-300/60 dark:border-white/10 transition-all duration-500 animate-in slide-in-from-top-2 fade-in">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={onHome}
                  className={`text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md ${
                    currentPage === 'home' 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate('/how-it-works');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md ${
                    currentPage === 'how-it-works' 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500'
                  }`}
                >
                  How it Works
                </button>
                <button 
                  onClick={() => {navigate('/contact'); setIsMobileMenuOpen(false);}} 
                  className="text-left px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                >
                  Contact Us
                </button>
                
                <div className="pt-6 border-t border-gray-300/60 dark:border-white/10 space-y-4">
                  <button 
                    onClick={onSignIn}
                    className="w-full text-left px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                  >
                    Sign In
                  </button>
                  {showCreateAccount && (
                    <button 
                      onClick={onGetStarted}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 text-white backdrop-blur-sm border border-blue-500/30 dark:border-blue-400/20 px-6 py-4 rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>Get Started</span>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;