import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  Search, 
  Users, 
  CheckCircle,
  Star,
  Clock,
  Shield,
  Sparkles,
  ArrowLeft,
  PlayCircle,
  Zap
} from 'lucide-react';
import Navbar from './shared/Navbar';

const HowItWorksScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Tell Us What You Need",
      description: "Simply describe your service requirements in natural language. Our AI understands context and details.",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      details: [
        "Type or speak your service need",
        "AI asks clarifying questions",
        "Specify location, budget, timeline",
        "Add any special requirements"
      ],
      visual: "💬"
    },
    {
      id: 2,
      title: "AI Finds Perfect Matches",
      description: "Our intelligent system analyzes your requirements and searches through thousands of verified providers.",
      icon: Search,
      color: "from-purple-500 to-pink-500",
      details: [
        "AI processes your requirements",
        "Searches verified provider database",
        "Matches based on expertise & availability",
        "Ranks by relevance and ratings"
      ],
      visual: "🔍"
    },
    {
      id: 3,
      title: "Review Curated Results",
      description: "Get a personalized list of the best service providers tailored to your specific needs and location.",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      details: [
        "View provider profiles & ratings",
        "Check real customer reviews",
        "Compare pricing and services",
        "See availability and response times"
      ],
      visual: "📋"
    },
    {
      id: 4,
      title: "Connect Instantly",
      description: "Reach out to your chosen provider through WhatsApp, phone, or email with pre-filled service details.",
      icon: CheckCircle,
      color: "from-orange-500 to-red-500",
      details: [
        "One-click WhatsApp messaging",
        "Pre-filled service details",
        "Direct phone calling",
        "Schedule appointments easily"
      ],
      visual: "✅"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All providers are background-checked and verified for quality and reliability."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get matched with qualified providers in seconds, not hours of searching."
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Real reviews from verified customers help ensure service excellence."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Find emergency services and providers available around the clock."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Found an amazing electrician in under 2 minutes! The AI understood exactly what I needed and connected me with the perfect professional.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content: "ServiceGPT saved me hours of research. The plumber they recommended was professional, reasonably priced, and fixed my issue perfectly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Emily Rodriguez",
      role: "Property Manager",
      content: "The AI chat made it so easy to explain my complex requirements. Got connected with exactly the right cleaning service for our office building.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
    }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <Navbar currentPage="how-it-works" />

      {/* Main Content */}
      <div className="relative z-40 max-w-7xl mx-auto px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16">
        
        {/* Hero Section */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 md:px-6 py-2 mb-6 md:mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-xs md:text-sm">AI-Powered Service Discovery</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
            <span className="text-white">How </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ServiceGPT
            </span>
            <span className="text-white"> Works</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Discover how our AI-powered platform revolutionizes the way you find and connect with local service professionals. 
            From conversation to connection in just a few simple steps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Try It Now →
            </button>
            <button 
              onClick={() => setActiveStep(0)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Process */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Simple 4-Step Process</h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Experience the future of service discovery with our intelligent, conversational approach
            </p>
          </div>

          {/* Interactive Step Navigation */}
          <div className="flex justify-center mb-8 md:mb-12 px-4">
            <div className="flex space-x-2 md:space-x-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 overflow-x-auto">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 whitespace-nowrap text-sm md:text-base ${
                    activeStep === index
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Step {step.id}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Display */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center px-4">
            <div className="order-2 md:order-1">
              <div className="text-4xl md:text-6xl mb-4 md:mb-6 text-center md:text-left">{steps[activeStep].visual}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 text-center md:text-left">{steps[activeStep].title}</h3>
              <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 leading-relaxed text-center md:text-left">{steps[activeStep].description}</p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {steps[activeStep].details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[activeStep].color} flex-shrink-0`}></div>
                    <span className="text-gray-300 text-sm md:text-base">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="w-full sm:w-auto px-4 md:px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  disabled={activeStep === steps.length - 1}
                  className="w-full sm:w-auto px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className={`w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br ${steps[activeStep].color} rounded-3xl p-6 md:p-8 flex items-center justify-center transition-all duration-500`}>
                  <div className="text-center">
                    {React.createElement(steps[activeStep].icon, { className: "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white mx-auto mb-3 md:mb-4" })}
                    <div className="text-white/80 text-xs md:text-sm">Step {activeStep + 1} of {steps.length}</div>
                  </div>
                </div>
                {/* Floating elements for visual appeal */}
                <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* All Steps Overview */}
        <div className="mb-16 md:mb-20 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                  activeStep === index ? 'ring-2 ring-blue-500/50' : ''
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  {React.createElement(step.icon, { className: "w-5 h-5 md:w-6 md:h-6 text-white" })}
                </div>
                <div className="text-xs md:text-sm text-blue-300 mb-2">Step {step.id}</div>
                <h3 className="text-base md:text-lg font-bold text-white mb-2 md:mb-3">{step.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 md:mb-20 px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Why Choose ServiceGPT?</h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Built with cutting-edge AI technology to provide the best service discovery experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 group text-center"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  {React.createElement(feature.icon, { className: "w-6 h-6 md:w-8 md:h-8 text-white" })}
                </div>
                <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 md:mb-20 px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Real stories from satisfied customers who found their perfect service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm md:text-base">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs md:text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex space-x-1 mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-4">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've discovered the easiest way to find local service professionals
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 md:mb-0">
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Finding Providers →
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span>Back to Home</span>
              </button>
            </div>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs md:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksScreen;
