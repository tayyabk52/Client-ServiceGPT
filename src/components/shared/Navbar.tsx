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
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={onHome}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ServiceGPT</span>
              </button>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-2 py-2">
              <button 
                onClick={onHome}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  currentPage === 'home' 
                    ? 'text-white bg-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  currentPage === 'how-it-works' 
                    ? 'text-white bg-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                How it Works
              </button>
              <button onClick={() => navigate('/services')} className="px-6 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 font-medium">Services</button>
              <button onClick={() => navigate('/professionals')} className="px-6 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 font-medium">For Professionals</button>
              <button onClick={() => navigate('/pricing')} className="px-6 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 font-medium">Pricing</button>
              <button onClick={() => navigate('/support')} className="px-6 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 font-medium">Support</button>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={onSignIn}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </button>
              {showCreateAccount && (
                <button 
                  onClick={onGetStarted}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-300 font-medium flex items-center space-x-2"
                >
                  <span>Get Started</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={onHome}
                  className={`text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    currentPage === 'home' 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate('/how-it-works');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    currentPage === 'how-it-works' 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  How it Works
                </button>
                <button onClick={() => {navigate('/services'); setIsMobileMenuOpen(false);}} className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium">Services</button>
                <button onClick={() => {navigate('/professionals'); setIsMobileMenuOpen(false);}} className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium">For Professionals</button>
                <button onClick={() => {navigate('/pricing'); setIsMobileMenuOpen(false);}} className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium">Pricing</button>
                <button onClick={() => {navigate('/support'); setIsMobileMenuOpen(false);}} className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium">Support</button>
                
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button 
                    onClick={onSignIn}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
                  >
                    Sign In
                  </button>
                  {showCreateAccount && (
                    <button 
                      onClick={onGetStarted}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium"
                    >
                      Get Started
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
