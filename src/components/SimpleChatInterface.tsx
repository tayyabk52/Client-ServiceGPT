import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, User, Bot, MapPin, Phone, Star, Wrench, Zap, Droplets, Home, Car, Scissors, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/useTheme';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  providers?: ServiceProvider[];
}

interface ServiceProvider {
  name: string;
  phone: string;
  details: string;
  address: string;
  location_note?: string;
  confidence?: string;
}

const SimpleChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'main' | 'results'>('main');
  const [serviceData, setServiceData] = useState({ service: '', location: '', count: 3 });
  const [nlpInput, setNlpInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'user' | 'ai', content: string, providers?: ServiceProvider[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      providers
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Service options with icons
  const serviceOptions = [
    { id: 'plumber', name: 'Plumber', icon: Droplets, description: 'Pipe repairs, leak fixes, installations' },
    { id: 'electrician', name: 'Electrician', icon: Zap, description: 'Wiring, outlets, electrical repairs' },
    { id: 'handyman', name: 'Handyman', icon: Wrench, description: 'General repairs and maintenance' },
    { id: 'cleaner', name: 'House Cleaner', icon: Home, description: 'Deep cleaning, regular maintenance' },
    { id: 'mechanic', name: 'Auto Mechanic', icon: Car, description: 'Car repairs and maintenance' },
    { id: 'barber', name: 'Barber/Stylist', icon: Scissors, description: 'Hair cutting and styling' }
  ];

  // US locations
  const locationOptions = [
    { id: 'new-york', name: 'New York, NY', state: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles, CA', state: 'California' },
    { id: 'chicago', name: 'Chicago, IL', state: 'Illinois' },
    { id: 'houston', name: 'Houston, TX', state: 'Texas' },
    { id: 'phoenix', name: 'Phoenix, AZ', state: 'Arizona' },
    { id: 'philadelphia', name: 'Philadelphia, PA', state: 'Pennsylvania' },
    { id: 'san-antonio', name: 'San Antonio, TX', state: 'Texas' },
    { id: 'san-diego', name: 'San Diego, CA', state: 'California' },
    { id: 'dallas', name: 'Dallas, TX', state: 'Texas' },
    { id: 'austin', name: 'Austin, TX', state: 'Texas' },
    { id: 'san-jose', name: 'San Jose, CA', state: 'California' },
    { id: 'fort-worth', name: 'Fort Worth, TX', state: 'Texas' }
  ];

  const handleServiceSelect = (service: any) => {
    const newInput = `I need a ${service.name.toLowerCase()}`;
    setNlpInput(prev => prev ? `${prev} ${newInput}` : newInput);
  };

  const handleLocationSelect = (location: any) => {
    const newInput = `in ${location.name}`;
    setNlpInput(prev => prev ? `${prev} ${newInput}` : newInput);
  };


  const handleNewSearch = () => {
    setCurrentStep('main');
    setServiceData({ service: '', location: '', count: 3 });
    setNlpInput('');
    setMessages([]);
  };

  const handleNlpSubmit = async () => {
    if (!nlpInput.trim()) return;

    setIsLoading(true);
    addMessage('user', nlpInput);
    setCurrentStep('results');

    try {
      // Call backend API with NLP input
      const response = await fetch('http://localhost:8000/api/nlp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: nlpInput.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      const data = await response.json();
      
      if (data.valid && data.providers && data.providers.length > 0) {
        addMessage('ai', `Found ${data.providers.length} providers for your request:`, data.providers);
      } else if (!data.valid) {
        addMessage('ai', 'I can only help you find local service providers like electricians, plumbers, handymen, cleaners, mechanics, or barbers. Please ask about services in that category.');
      } else {
        addMessage('ai', 'Sorry, I couldn\'t find any providers for your request. Please try with different criteria.');
      }
      
      // Reset for new search after delay
      setTimeout(() => {
        addMessage('ai', 'Would you like to search for another service?');
        setCurrentStep('main');
        setNlpInput('');
      }, 3000);
    } catch (error) {
      addMessage('ai', 'Sorry, there was an error processing your request. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize chat - no initial message needed since we have cards
  useEffect(() => {
    // Empty - let the service cards speak for themselves
  }, []);

  // Theme-consistent styles matching Dashboard
  const isDark = theme === 'dark';
  
  const themeStyles = {
    background: isDark 
      ? "min-h-screen bg-black relative overflow-hidden"
      : "min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 relative overflow-hidden",
    
    backgroundEffects: {
      grid: isDark
        ? "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"
        : "absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:60px_60px]",
      gradient: isDark
        ? "absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"
        : "absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/80 to-indigo-100/30",
      glow1: isDark
        ? "absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"
        : "absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl",
      glow2: isDark
        ? "absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-600/10 rounded-full blur-3xl"
        : "absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"
    },
    
    header: {
      container: isDark
        ? "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]"
        : "absolute inset-0 bg-[linear-gradient(rgba(107,114,128,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(107,114,128,0.15)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.4]",
      background: isDark
        ? "absolute inset-0 bg-gradient-to-br from-[#0d141f]/90 via-[#0a111b]/80 to-[#090f18]/90 backdrop-blur-2xl"
        : "absolute inset-0 bg-gradient-to-br from-gray-700/95 via-gray-800/95 to-slate-700/95 backdrop-blur-xl shadow-lg border-b-2 border-gray-600/80",
      border: isDark
        ? "absolute inset-0 rounded-none border-b border-white/10 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_120%,rgba(59,130,246,0.25),transparent_70%)] before:opacity-40"
        : "absolute inset-0 rounded-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_120%,rgba(107,114,128,0.2),transparent_70%)] before:opacity-60",
      button: isDark
        ? "relative h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-medium text-blue-100 transition"
        : "relative h-11 px-4 rounded-xl bg-gray-600/60 hover:bg-gray-500/60 border-2 border-gray-500/60 hover:border-gray-400/60 flex items-center gap-2 text-xs font-semibold text-white transition shadow-sm"
    },
    
    messageArea: isDark
      ? "bg-black/20 backdrop-blur-sm"
      : "bg-white/20 backdrop-blur-sm",
    
    serviceCard: isDark
      ? "bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
      : "bg-white/95 backdrop-blur-xl border-2 border-gray-200/80 rounded-3xl p-6 shadow-xl hover:bg-white/98 hover:shadow-2xl transition-all duration-300 group",
    
    locationCard: isDark
      ? "bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
      : "bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-4 hover:bg-white/98 hover:shadow-lg transition-all duration-300 group",
    
    messageUser: isDark
      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    
    messageAI: isDark
      ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white"
      : "bg-white/95 backdrop-blur-xl border-2 border-gray-200/80 text-gray-800 shadow-md",
    
    providerCard: isDark
      ? "bg-white/5 border border-white/20 backdrop-blur-sm"
      : "bg-white/90 border-2 border-gray-200/80 backdrop-blur-sm shadow-md"
  };

  return (
    <div className={themeStyles.background}>
      {/* Background Effects */}
      <div className={themeStyles.backgroundEffects.grid}></div>
      <div className={themeStyles.backgroundEffects.gradient}></div>
      <div className={themeStyles.backgroundEffects.glow1}></div>
      <div className={themeStyles.backgroundEffects.glow2}></div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="relative w-full">
          <div className="relative">
            <div className={themeStyles.header.container} />
            <div className={themeStyles.header.background} />
            <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,black,transparent)]" />
            <div className={themeStyles.header.border} />
            
            <div className="relative px-4 pt-3 pb-3">
              <div className="flex items-center justify-between">
                {/* Left cluster */}
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => navigate(-1)}
                    className={themeStyles.header.button}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600'} flex items-center justify-center shadow-lg ring-1 ${isDark ? 'ring-white/20' : 'ring-slate-400/30'}`}>
                      <Search className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className={`text-base font-semibold tracking-wide ${isDark ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent' : 'text-white'}`}>ServiceGPT</h1>
                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] ${isDark ? 'text-blue-200/60' : 'text-gray-200'} font-medium`}>
                      <span>Find local service providers</span>
                    </div>
                  </div>
                </div>
                
                {/* Right cluster */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleNewSearch}
                    className={themeStyles.header.button}
                  >
                    <Search className="w-4 h-4" />
                    <span>New Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className={`flex-1 ${themeStyles.messageArea} p-4 overflow-y-auto`}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.type === 'user' 
                      ? (isDark ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600')
                      : (isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-white/20' : 'bg-gradient-to-br from-gray-600 to-gray-700')
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div
                      className={`px-6 py-4 rounded-3xl shadow-lg ${
                        message.type === 'user' ? themeStyles.messageUser : themeStyles.messageAI
                      }`}
                    >
                      {message.content}
                    </div>
                    
                    {/* Service Providers */}
                    {message.providers && message.providers.length > 0 && (
                      <div className="space-y-4">
                        {message.providers.map((provider, index) => (
                          <div
                            key={index}
                            className={`p-6 rounded-2xl ${themeStyles.providerCard}`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{provider.name}</h3>
                              {provider.confidence && (
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  provider.confidence === 'HIGH' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {provider.confidence}
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Phone className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                <a 
                                  href={`tel:${provider.phone}`}
                                  className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                                >
                                  {provider.phone}
                                </a>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <MapPin className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`} />
                                <div>
                                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{provider.address}</span>
                                  {provider.location_note === 'NEARBY' && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                                      Nearby
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{provider.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Main Interface - Prominent Text Input with Small Recommendation Cards */}
            {currentStep === 'main' && !isLoading && (
              <div className="space-y-8 pt-8">
                {/* Prominent Text Input */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className={isDark 
                      ? 'text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'
                      : 'text-4xl font-bold mb-4 bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-700 bg-clip-text text-transparent'
                    }>
                      What service do you need?
                    </h1>
                    <p className={isDark 
                      ? 'text-gray-300 text-lg leading-relaxed max-w-lg mx-auto'
                      : 'text-gray-700 text-lg leading-relaxed max-w-lg mx-auto'
                    }>
                      Tell me what you're looking for and I'll find the 
                      <span className={`${isDark ? 'text-blue-300' : 'text-blue-600'} font-medium`}> best providers</span> in your area
                    </p>
                  </div>
                  
                  <div className="max-w-3xl mx-auto">
                    <div className={`flex gap-4 p-6 rounded-3xl shadow-2xl ${
                      isDark 
                        ? 'bg-white/10 backdrop-blur-xl border-2 border-white/20' 
                        : 'bg-white/98 backdrop-blur-xl border-2 border-gray-200/80'
                    }`}>
                      <input
                        type="text"
                        placeholder="e.g., I need a plumber to fix my sink in New York..."
                        value={nlpInput}
                        onChange={(e) => setNlpInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleNlpSubmit()}
                        className={`flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-400 ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}
                      />
                      <button
                        onClick={handleNlpSubmit}
                        disabled={!nlpInput.trim() || isLoading}
                        className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                          isDark
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500'
                        } text-white disabled:cursor-not-allowed`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Send className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-3 text-center">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        I can help you find: electricians, plumbers, handymen, cleaners, mechanics, barbers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Recommendations */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Or choose a service:
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
                    {serviceOptions.map((service) => {
                      const IconComponent = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service)}
                          className={`p-3 rounded-2xl transition-all duration-300 group ${
                            isDark
                              ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                              : 'bg-white/80 border border-gray-200 hover:bg-white/95 hover:shadow-md'
                          }`}
                        >
                          <div className="text-center space-y-2">
                            <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${
                              isDark 
                                ? 'from-blue-500/20 to-purple-600/20' 
                                : 'from-blue-500 to-indigo-600'
                            } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-white'}`} />
                            </div>
                            <div>
                              <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {service.name}
                              </h4>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location Recommendations */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Popular locations:
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                    {locationOptions.slice(0, 8).map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          isDark
                            ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            : 'bg-white/70 border border-gray-200 text-gray-700 hover:bg-white/90 hover:shadow-sm hover:text-gray-800'
                        }`}
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className={`p-6 rounded-3xl ${themeStyles.messageAI} flex items-center gap-4`}>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-medium">Searching for providers...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatInterface;