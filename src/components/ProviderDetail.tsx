import React from 'react';
import { X, Star, Check, Clock, Phone, MessageCircle } from 'lucide-react';
import GlassCard from './shared/GlassCard';
import { Provider } from '../types';
import { useTheme } from '../theme/useTheme';

interface ProviderDetailProps {
  provider: Provider;
  onBack: () => void;
}

const ProviderDetail: React.FC<ProviderDetailProps> = ({ provider, onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 ${isDark ? 'bg-background-dark' : ''} transition-all duration-500`}>
      {/* Hero Section */}
      <div className="relative">
        <div className={`h-48 bg-gradient-to-r from-slate-300/80 via-blue-200/60 to-cyan-200/70 ${isDark ? 'from-blue-600 to-cyan-500' : ''} transition-all duration-500`}></div>
        <button
          onClick={onBack}
          className={`absolute top-6 left-6 w-10 h-10 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 ${isDark ? 'text-white' : ''} transition-all duration-500`}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Provider Info Overlay */}
        <GlassCard className={`absolute -bottom-16 left-6 right-6 p-6 bg-white/20 ${isDark ? 'bg-card-dark' : ''} backdrop-blur-xl border border-white/25 transition-all duration-500`}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              {provider.verified && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className={`text-xl font-bold text-slate-800 ${isDark ? 'text-white' : ''} transition-colors duration-500`}>{provider.name}</h1>
              <p className={`text-slate-600 ${isDark ? 'text-blue-200' : ''} transition-colors duration-500`}>{provider.category}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-slate-800 dark:text-white font-medium transition-colors duration-500">{provider.rating}</span>
                </div>
                <span className="text-slate-500 dark:text-blue-200 transition-colors duration-500">•</span>
                <span className="text-slate-600 dark:text-blue-200 transition-colors duration-500">{provider.distance}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Content */}
      <div className="pt-24 p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Response Time', value: provider.responseTime, icon: Clock },
            { label: 'Completed', value: `${provider.completedJobs} jobs`, icon: Check },
            { label: 'Rating', value: provider.rating.toString(), icon: Star }
          ].map((stat, index) => (
            <GlassCard key={index} className={`p-4 text-center bg-white/20 ${isDark ? 'bg-card-dark' : ''} backdrop-blur-xl border border-white/25 transition-all duration-500`}>
              <stat.icon className={`w-6 h-6 text-blue-500 ${isDark ? 'text-blue-400' : ''} transition-colors duration-500 mx-auto mb-2`} />
              <p className={`text-slate-800 ${isDark ? 'text-white' : ''} font-semibold transition-colors duration-500`}>{stat.value}</p>
              <p className={`text-slate-600 ${isDark ? 'text-blue-200' : ''} text-xs transition-colors duration-500`}>{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* About */}
        <GlassCard className="p-6 bg-white/20 dark:bg-card-dark backdrop-blur-xl border border-white/25 transition-all duration-500">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-500 mb-4">About</h2>
          <p className="text-slate-600 dark:text-blue-200 leading-relaxed transition-colors duration-500">{provider.bio}</p>
        </GlassCard>

        {/* Services */}
        <GlassCard className="p-6 bg-white/20 dark:bg-card-dark backdrop-blur-xl border border-white/25 transition-all duration-500">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-500 mb-4">Services</h2>
          <div className="flex flex-wrap gap-2">
            {provider.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gradient-to-r from-slate-200/60 to-blue-100/60 dark:from-blue-500/20 dark:to-cyan-500/20 border border-slate-300/30 dark:border-blue-400/30 text-slate-700 dark:text-blue-300 rounded-full transition-all duration-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Gallery */}
        <GlassCard className="p-6 bg-white/20 dark:bg-card-dark backdrop-blur-xl border border-white/25 transition-all duration-500">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-500 mb-4">Work Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {provider.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Work sample ${index + 1}`}
                className="w-full h-32 object-cover rounded-xl"
              />
            ))}
          </div>
        </GlassCard>

        {/* Contact Actions */}
        <div className="fixed bottom-6 left-6 right-6">
          <div className="flex space-x-4">
            <button className={`flex-1 bg-gradient-to-r ${
              isDark 
                ? 'from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500' 
                : 'from-slate-500 to-blue-400 hover:from-slate-600 hover:to-blue-500'
            } text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg`}>
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
            <button className={`flex-1 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg`}
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
