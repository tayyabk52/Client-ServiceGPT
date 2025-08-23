import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  History, 
  User, 
  Bell,
  MapPin,
  Clock,
  Heart,
  Home,
  ChevronRight,
  Calendar,
  Award,
  DollarSign
} from 'lucide-react';
import PageTransition from './shared/PageTransition';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  React.useEffect(()=>{
    const t = setInterval(()=> setNow(new Date()), 60000);
    return ()=> clearInterval(t);
  },[]);

  const greeting = React.useMemo(()=>{
    const h = now.getHours();
    if (h < 5) return 'Late night';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  },[now]);

  // Category pills & mini stats removed per request

  const handleStartChat = () => {
    // Provide immediate feedback
    const button = document.querySelector('.start-ai-search-button');
    if (button) {
      button.classList.add('animate-pulse');
    }
    
    // Small delay for button feedback, then transition
    setTimeout(() => {
      setIsTransitioning(true);
    }, 150);
  };

  const onTransitionComplete = () => {
    if (searchQuery.trim()) {
      // Navigate to chat with the user's message
      navigate('/chat', { state: { initialMessage: searchQuery.trim() } });
    } else {
      // Navigate to chat without initial message
      navigate('/chat');
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartChat();
    }
  };

  // Add custom CSS for spark animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spark-1 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        30% { opacity: 1; transform: translate(15px, -8px) scale(1.2); }
        60% { opacity: 0.8; transform: translate(25px, -15px) scale(1); }
        100% { opacity: 0; transform: translate(35px, -20px) scale(0.3); }
      }
      
      @keyframes spark-2 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        25% { opacity: 1; transform: translate(-10px, 15px) scale(1.1); }
        50% { opacity: 0.9; transform: translate(-18px, 25px) scale(1.3); }
        75% { opacity: 0.5; transform: translate(-25px, 35px) scale(0.8); }
        100% { opacity: 0; transform: translate(-30px, 40px) scale(0.3); }
      }
      
      @keyframes spark-3 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        40% { opacity: 1; transform: translate(20px, -12px) scale(1.4); }
        70% { opacity: 0.7; transform: translate(30px, -20px) scale(1); }
        100% { opacity: 0; transform: translate(40px, -25px) scale(0.3); }
      }
      
      @keyframes spark-4 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        35% { opacity: 1; transform: translate(-15px, -10px) scale(1.2); }
        65% { opacity: 0.8; transform: translate(-25px, -18px) scale(1.1); }
        100% { opacity: 0; transform: translate(-35px, -25px) scale(0.3); }
      }
      
      .animate-spark-1 { animation: spark-1 2s ease-out; }
      .animate-spark-2 { animation: spark-2 2.2s ease-out 0.2s; }
      .animate-spark-3 { animation: spark-3 1.8s ease-out 0.4s; }
      .animate-spark-4 { animation: spark-4 2.1s ease-out 0.6s; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // (serviceCategories removed - not currently rendered)

  // Recent activity with more detailed data
  const recentActivity = [
    { 
      id: 1, 
      type: 'search', 
      title: 'Found 3 plumbers near you', 
      subtitle: 'Leaky kitchen faucet repair',
      time: '2 hours ago', 
      status: 'completed',
      icon: '🔧',
      color: 'text-blue-500'
    },
    { 
      id: 2, 
      type: 'contact', 
      title: 'Contacted Mike\'s Cleaning Service', 
      subtitle: 'Deep house cleaning',
      time: '1 day ago', 
      status: 'replied',
      icon: '🧽',
      color: 'text-green-500'
    },
    { 
      id: 3, 
      type: 'save', 
      title: 'Saved ElectroFix Solutions', 
      subtitle: 'Light fixture installation',
      time: '3 days ago', 
      status: 'saved',
      icon: '⚡',
      color: 'text-yellow-500'
    }
  ];

  // Stats data
  const stats = [
    { label: 'Total Searches', value: '24', icon: Search, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Providers Found', value: '142', icon: Award, color: 'from-purple-500 to-pink-500', change: '+8%' },
    { label: 'Money Saved', value: '$340', icon: DollarSign, color: 'from-green-500 to-emerald-500', change: '+15%' },
    { label: 'This Month', value: '8', icon: Calendar, color: 'from-orange-500 to-red-500', change: '+25%' }
  ];

  return (
    <PageTransition
      isTransitioning={isTransitioning}
      onTransitionComplete={onTransitionComplete}
    >
      <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects - Same as Landing Page */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Redesigned Header */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="relative">
            {/* Ambient layers */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d141f]/90 via-[#0a111b]/80 to-[#090f18]/90 backdrop-blur-2xl" />
            <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,black,transparent)]" />
            {/* Border glow */}
            <div className="absolute inset-0 rounded-none border-b border-white/10 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_120%,rgba(59,130,246,0.25),transparent_70%)] before:opacity-40" />
            <div className="relative px-4 pt-3 pb-3">
              <div className="flex items-center justify-between">
                {/* Left cluster */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/20 to-purple-600/0 blur-lg opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-base font-semibold tracking-wide bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">{greeting}, John</h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-blue-200/60 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> New York, NY</span>
                      <span className="w-1 h-1 rounded-full bg-blue-300/50" />
                      <span>{now.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</span>
                      <span className="w-1 h-1 rounded-full bg-blue-300/50" />
                      <span>{now.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
                {/* Right cluster */}
                <div className="flex items-center gap-3">
                  <button className="relative h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-medium text-blue-100 transition">
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-[10px] font-bold flex items-center justify-center shadow">3</span>
                  </button>
                  <div className="relative">
                    <button onClick={()=>setUserMenuOpen(o=>!o)} className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-white/15 hover:border-white/30 flex items-center justify-center transition shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0d1522]/95 border border-white/10 backdrop-blur-xl p-2 shadow-2xl animate-fadeSlide z-50">
                        {[
                          {label:'Profile', action:()=>navigate('/profile')},
                          {label:'History', action:()=>navigate('/history')},
                          {label:'Saved Providers', action:()=>{}},
                          {label:'Logout', action:()=>navigate('/')}
                        ].map(item => (
                          <button key={item.label} onClick={()=>{item.action(); setUserMenuOpen(false);}} className="w-full text-left px-3 py-2 rounded-xl text-sm text-blue-100 hover:bg-white/10 transition flex items-center justify-between group">
                            <span>{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* (Mini stats & category pills intentionally removed) */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-20 sm:pt-24 md:pt-28 pb-20">
          {/* Enhanced AI Hero Section - Main Focus */}
          <div id="ai-search-card" className="px-4 py-6">
            {/* Welcome Message with Stats Preview */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Welcome back, John! 👋</h3>
                  <p className="text-gray-400 text-sm">Ready to find your next service provider?</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-xs text-gray-400">searches</div>
                </div>
              </div>
            </div>

            {/* Main AI Search Card - Enhanced Design */}
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-[2rem] blur-xl"></div>
              
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Floating elements for visual appeal */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-8 left-6 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* AI Icon with enhanced design */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Search className="w-10 h-10 text-blue-300" />
                    </div>
                    {/* Pulse rings */}
                    <div className="absolute inset-0 w-20 h-20 border-2 border-blue-500/30 rounded-3xl animate-ping"></div>
                    <div className="absolute inset-2 w-16 h-16 border-2 border-purple-500/20 rounded-2xl animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </div>

                {/* Main heading with gradient text */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                      What service do you need?
                    </span>
                  </h2>
                  <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">
                    Tell me what you're looking for and I'll find the 
                    <span className="text-blue-300 font-medium"> best providers</span> in your area
                  </p>
                </div>

                {/* Enhanced search input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleInputKeyPress}
                      placeholder="Try: 'I need a plumber for emergency leak repair'"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-6 pr-16 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm"
                    />
                    <button 
                      onClick={handleStartChat}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Main CTA Button - Elegant & Compact Design */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleStartChat}
                    className="relative group start-ai-search-button"
                  >
                    {/* Spark animation container - positioned outside for visibility */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none">
                      <div className="absolute w-2 h-2 bg-white rounded-full shadow-lg top-2 left-3 opacity-0 group-hover:opacity-100 group-hover:animate-spark-1 z-20"></div>
                      <div className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full shadow-lg top-5 right-4 opacity-0 group-hover:opacity-100 group-hover:animate-spark-2 z-20"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full shadow-lg bottom-4 left-5 opacity-0 group-hover:opacity-100 group-hover:animate-spark-3 z-20"></div>
                      <div className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full shadow-lg bottom-2 right-3 opacity-0 group-hover:opacity-100 group-hover:animate-spark-4 z-20"></div>
                    </div>
                    
                    {/* Main button with gradient background */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-0.5 shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden group-active:scale-95">
                      {/* Inner button content */}
                      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl py-4 px-8 text-white font-bold transition-all duration-200 group-hover:from-blue-500 group-hover:to-purple-500">
                        {/* Button content */}
                        <div className="relative flex items-center justify-center space-x-3 z-10">
                          <div className="flex items-center space-x-3">
                            {/* Icon with enhanced animation */}
                            <div className="relative">
                              <MessageCircle className="w-5 h-5 group-hover:scale-110 group-active:scale-95 transition-all duration-200" />
                            </div>
                            
                            {/* Text with enhanced styling */}
                            <span className="text-base font-bold tracking-wide group-hover:tracking-wider transition-all duration-200">Start AI Search</span>
                            
                            {/* Enhanced pulse indicator */}
                            <div className="relative">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              <div className="absolute inset-0 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-20"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Subtle bottom accent */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced outer glow with interaction feedback */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-all duration-300 -z-10"></div>
                    
                    {/* Active state ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-active:opacity-50 transition-opacity duration-150"></div>
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-xs mb-3">Popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Plumber', 'Electrician', 'Cleaner', 'Handyman'].map((service) => (
                      <button
                        key={service}
                        onClick={handleStartChat}
                        className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-300"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">1000+</div>
                      <div className="text-xs text-gray-400">Providers</div>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div>
                      <div className="text-lg font-bold text-white">4.9★</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div>
                      <div className="text-lg font-bold text-white">24/7</div>
                      <div className="text-xs text-gray-400">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards - More Visual Appeal */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-bold text-white mb-4">Your Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((stat, index) => {
                const IconComponent = stat.icon;
                const isHighlighted = index === 1; // Highlight one card like in reference
                return (
                  <div 
                    key={index} 
                    className={`${isHighlighted 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                      : 'bg-white/5 border-white/10'
                    } backdrop-blur-sm border rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group`}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${isHighlighted ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-400'}`}>
                          {stat.change}
                        </div>
                      </div>
                      <h4 className={`text-3xl font-bold mb-1 ${isHighlighted ? 'text-yellow-300' : 'text-white'}`}>{stat.value}</h4>
                      <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                      
                      {/* Progress bar */}
                      <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                          style={{width: `${60 + index * 10}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity - Enhanced Design */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <button onClick={() => navigate('/history')} className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                  {/* Subtle gradient based on activity type */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl ${
                    activity.type === 'search' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    activity.type === 'contact' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}></div>
                  
                  <div className="relative flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg ${
                      activity.type === 'search' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30' :
                      activity.type === 'contact' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30' :
                      'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                    } backdrop-blur-sm`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">{activity.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{activity.subtitle}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-500' : 
                            activity.status === 'replied' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></span>
                          <span className="text-xs text-gray-500 capitalize">{activity.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions - Enhanced Design */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate('/history')} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 active:scale-95 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <History className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors mb-1">Chat History</h4>
                  <p className="text-xs text-gray-400">View conversations</p>
                  
                  {/* Small indicator */}
                  <div className="mt-3 flex justify-center">
                    <div className="w-6 h-1 bg-purple-500/30 rounded-full"></div>
                  </div>
                </div>
              </button>
              
              <button onClick={()=>navigate('/saved')} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 active:scale-95 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-sm group-hover:text-red-300 transition-colors mb-1">Saved</h4>
                  <p className="text-xs text-gray-400">Favorite providers</p>
                  
                  {/* Small indicator */}
                  <div className="mt-3 flex justify-center">
                    <div className="w-6 h-1 bg-red-500/30 rounded-full"></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Bottom Navigation - Enhanced Design */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 px-6 py-3 shadow-2xl">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button className="flex flex-col items-center space-y-2 py-2 px-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 shadow-lg">
              <Home className="w-6 h-6 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Home</span>
            </button>
            
            <button onClick={() => navigate('/chat')} className="flex flex-col items-center space-y-2 py-2 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300 group" aria-label="AI Search">
              <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Search</span>
            </button>
            
            <button onClick={() => navigate('/history')} className="flex flex-col items-center space-y-2 py-2 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300 group">
              <History className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">History</span>
            </button>
            
            <button onClick={()=>navigate('/saved')} className="flex flex-col items-center space-y-2 py-2 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300 group">
              <Heart className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Saved</span>
            </button>
            
            <button onClick={() => navigate('/profile')} className="flex flex-col items-center space-y-2 py-2 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300 group">
              <User className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
    </PageTransition>
  );
};

export default Dashboard;
