import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Shield, Clock, Users, Star, Wrench, Droplets, Plug, Brush, Paintbrush2, Move3D } from 'lucide-react';
import Navbar from './shared/Navbar';

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();

  const onGetStarted = () => {
    navigate('/auth');
  };
  const floatingElements = [
    { name: 'Plumber Pro', rating: '4.9', position: 'top-20 left-20', delay: '0s' },
    { name: 'ElectricExpert', rating: '4.8', position: 'top-32 right-32', delay: '2s' },
    { name: 'CleanMaster', rating: '4.7', position: 'bottom-40 left-16', delay: '4s' },
    { name: 'HandyHelper', rating: '4.9', position: 'bottom-20 right-20', delay: '1s' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
      
      {/* Large Gradient Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <Navbar 
        showCreateAccount={true} 
        currentPage="home"
      />

      {/* Floating Service Provider Cards */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} hidden lg:block animate-float`}
          style={{
            animationDelay: element.delay,
            animationDuration: '6s',
            animationIterationCount: 'infinite'
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <p className="text-white text-sm font-medium">{element.name}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-gray-300 text-xs">{element.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-40 max-w-7xl mx-auto px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-sm">Unlock Your Service Needs</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="text-white">One-click for Service</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Excellence
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Dive into the art of services, where innovative technology meets professional expertise
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Open App →
            </button>
            <button 
              onClick={onGetStarted}
              className="flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              <span>Discover More</span>
            </button>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
            {[{
              label:'Plumbing', icon:Droplets, gradient:'from-cyan-500 to-blue-600'
            },{
              label:'Electrical', icon:Plug, gradient:'from-amber-500 to-orange-600'
            },{
              label:'Cleaning', icon:Brush, gradient:'from-emerald-500 to-teal-600'
            },{
              label:'Handyman', icon:Wrench, gradient:'from-indigo-500 to-purple-600'
            },{
              label:'Painting', icon:Paintbrush2, gradient:'from-pink-500 to-rose-600'
            },{
              label:'Moving', icon:Move3D, gradient:'from-violet-500 to-fuchsia-600'
            }].map(item => (
              <button
                key={item.label}
                onClick={onGetStarted}
                className="group relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_65%)] transition-opacity" />
                <div className={`w-12 h-12 mb-3 mx-auto rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-110 group-active:scale-95 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm font-medium tracking-wide">{item.label}</p>
                <div className="mt-2 h-px w-8 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Active Professionals', value: '50K+' },
            { label: 'Completed Services', value: '1M+' },
            { label: 'Average Rating', value: '4.9★' },
            { label: 'Response Time', value: '<30min' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Shield,
              title: 'Verified Professionals',
              description: 'All service providers are background-checked and verified for your safety'
            },
            {
              icon: Clock,
              title: 'Instant Matching',
              description: 'Get connected with qualified professionals in minutes, not hours'
            },
            {
              icon: Users,
              title: 'Community Driven',
              description: 'Real reviews from real customers help you make informed decisions'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Admin Portal Link */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => navigate('/admin/login')}
          className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          Admin Portal
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
