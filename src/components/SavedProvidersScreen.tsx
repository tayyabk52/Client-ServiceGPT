import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/useTheme';
import { ArrowLeft, Star, Search, Filter, MapPin, MessageCircle, Phone, Tag, Trash2, Share2, Loader2, BookmarkCheck } from 'lucide-react';

interface ButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'subtle' | 'whatsapp' | 'danger';
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  [key: string]: any;
}

// Mock Button component
const Button: React.FC<ButtonProps> = ({ onClick, size = 'md', variant = 'primary', leftIcon, children, className = '', loading = false, ...props }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500',
    subtle: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    whatsapp: 'bg-green-600 hover:bg-green-700 text-white border border-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-500'
  };
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
    </button>
  );
};

const SavedProvidersScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All','Plumbing','Electrical','Cleaning','Landscaping','Renovation','IT','Misc'];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const providers = useMemo(() => [
    { id:'p1', name:'AquaFlow Plumbing Co.', rating:4.9, reviews:182, distance: '2.1 km', category:'Plumbing', short:'Emergency & domestic repairs', avatar:'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=200&h=200&fit=crop', tags:['Emergency','Licensed','24/7'], savedAt: Date.now()- 1000*60*60*2 },
    { id:'p2', name:'VoltMaster Electric', rating:4.8, reviews:240, distance: '3.8 km', category:'Electrical', short:'Residential & commercial', avatar:'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=200&fit=crop', tags:['Certified','Insured'], savedAt: Date.now()- 1000*60*60*24 },
    { id:'p3', name:'PureSpark Cleaners', rating:4.7, reviews:134, distance: '1.9 km', category:'Cleaning', short:'Eco-friendly deep cleaning', avatar:'https://images.unsplash.com/photo-1598515214211-d6f3d79c8c5c?w=200&h=200&fit=crop', tags:['Eco','Premium'], savedAt: Date.now()- 1000*60*60*5 },
    { id:'p4', name:'GreenScape Gardens', rating:4.9, reviews:98, distance: '5.5 km', category:'Landscaping', short:'Design & weekly care', avatar:'https://images.unsplash.com/photo-1598511727601-905b2e21a996?w=200&h=200&fit=crop', tags:['Design','Seasonal'], savedAt: Date.now()- 1000*60*60*30 },
    { id:'p5', name:'RenovaCraft Builders', rating:5.0, reviews:76, distance: '6.2 km', category:'Renovation', short:'Kitchen & bath specialists', avatar:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop', tags:['Premium','Warranty'], savedAt: Date.now()- 1000*60*60*12 },
  ], []);

  const filtered = providers
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'recent') return b.savedAt - a.savedAt;
      if (sort === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  const removeProvider = (id: string) => {
    setRemovingId(id);
    setTimeout(() => setRemovingId(null), 900);
  };

  const shareProvider = (id: string) => {
    setSharingId(id);
    setTimeout(() => setSharingId(null), 1200);
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Theme-specific classes  
  const themeClasses = {
    // Background classes
    background: isDark 
      ? 'bg-background-light dark:bg-background-dark' 
      : 'bg-gradient-to-br from-slate-400 via-gray-500 to-zinc-600',
    
    // Header classes  
    header: isDark
      ? 'backdrop-blur-2xl bg-black/55 border-b border-white/10'
      : 'backdrop-blur-2xl bg-slate-800/70 border-b border-slate-400/30 shadow-lg',
    
    // Title classes
    title: isDark
      ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-slate-100 via-zinc-200 to-gray-100 bg-clip-text text-transparent',
    
    // Subtitle classes
    subtitle: isDark
      ? 'text-blue-300/70' 
      : 'text-slate-300/90',
    
    // Filter bar classes
    filterBar: isDark
      ? 'bg-[#0b131c]/80 backdrop-blur-lg border-b border-white/10'
      : 'bg-slate-700/80 backdrop-blur-lg border-b border-slate-400/20 shadow-md',
    
    // Input classes
    input: isDark
      ? 'bg-white/[0.05] border-white/10 focus:border-blue-500/50 text-white placeholder-blue-200/40'
      : 'bg-slate-600/40 border-slate-400/30 focus:border-slate-300/60 text-slate-100 placeholder-slate-300/60',
    
    // Select classes
    select: isDark
      ? 'bg-white/[0.05] border-white/10 focus:border-blue-500/50 text-white'
      : 'bg-slate-600/40 border-slate-400/30 focus:border-slate-300/60 text-slate-100',
    
    // Card classes
    card: isDark
      ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20'
      : 'bg-slate-800/40 backdrop-blur-xl border-slate-400/30 hover:border-slate-300/50 shadow-lg hover:shadow-xl',
    
    // Text classes
    primaryText: isDark ? 'text-white' : 'text-slate-100',
    secondaryText: isDark ? 'text-blue-200/60' : 'text-slate-300/80',
    
    // Category badge classes
    categoryBadge: isDark
      ? 'bg-blue-600/25 border-blue-400/30 text-white'
      : 'bg-slate-600/50 border-slate-400/40 text-slate-200',
    
    // Empty state classes
    emptyStateBox: isDark
      ? 'bg-white/[0.06]'
      : 'bg-slate-700/30',
    
    emptyStateText: isDark
      ? 'text-blue-200/70'
      : 'text-slate-300/80'
  };

  // Ambient background with theme-aware gradients
  const ambientBackground = (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-36 w-[520px] h-[520px] bg-gradient-to-br from-slate-700/25 via-gray-600/20 to-zinc-700/25 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-purple-600/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-36 w-[480px] h-[480px] bg-gradient-to-tr from-slate-600/20 via-zinc-600/15 to-gray-600/15 dark:from-fuchsia-500/15 dark:via-purple-500/10 dark:to-sky-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-gradient-to-br from-gray-700/15 via-slate-700/15 to-zinc-700/15 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-emerald-500/10 blur-[160px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(71,85,105,0.20),transparent_60%)] dark:bg-[radial-gradient(circle_at_65%_25%,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.12] dark:opacity-[0.07]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-600/40 via-gray-700/50 to-zinc-800/60 dark:from-[#0b111a] dark:via-[#080e16] dark:to-[#05080d]" />
    </div>
  );

  return (
    <div className="min-h-screen transition-all duration-500 bg-gray-100 dark:bg-[#05070d]">
      {/* Ambient Background */}
      {ambientBackground}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${themeClasses.header} px-4 py-3 sm:py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(-1)}
              size="sm"
              variant="subtle"
              className="!h-9 !w-9 sm:!h-10 sm:!w-10 !px-0 rounded-xl"
              leftIcon={<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
              aria-label="Back"
            />
            <div>
              <h1 className={`text-base sm:text-lg md:text-xl font-bold tracking-wide transition-all duration-300 ${themeClasses.title}`}>
                Saved Providers
              </h1>
              <p className={`text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 ${themeClasses.subtitle}`}>
                Favorites
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              size="md" 
              variant="primary" 
              onClick={() => setShowFilters(f => !f)} 
              leftIcon={<Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} 
              className="text-xs sm:text-sm"
            >
              {showFilters ? 'Hide' : 'Filter'}
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        {showFilters && (
          <div className={`fixed top-16 sm:top-20 left-0 right-0 z-40 px-4 py-3 space-y-3 transition-all duration-300 ${themeClasses.filterBar}`}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 text-slate-300/70 dark:text-blue-200/40" />
                <input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  placeholder="Search saved..." 
                  className="w-full pl-9 pr-3 h-9 sm:h-10 rounded-lg transition-all duration-300 text-xs sm:text-[13px] bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-200 placeholder-slate-400/70 dark:placeholder-slate-500" 
                />
              </div>
              <div className="w-28 sm:w-36">
                <select 
                  value={sort} 
                  onChange={e => setSort(e.target.value)} 
                  className={`w-full h-9 sm:h-10 rounded-lg px-2 text-xs sm:text-[13px] transition-all duration-300 ${themeClasses.select}`}
                >
                  <option value="recent">Recent</option>
                  <option value="rating">Rating</option>
                  <option value="name">A-Z</option>
                </select>
              </div>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {categories.map(c => (
                <Button
                  key={c}
                  size="sm"
                  variant={category === c ? 'primary' : 'subtle'}
                  onClick={() => setCategory(c)}
                  className="text-[10px] font-medium px-4 rounded-full !h-8 transition-all duration-300 bg-slate-600/30 dark:bg-white/5 hover:bg-slate-500/40 dark:hover:bg-white/10 border-slate-400/30 dark:border-white/10 text-slate-200"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 overflow-y-auto px-4 pb-32 space-y-5 ${showFilters ? 'pt-32 sm:pt-36' : 'pt-20 sm:pt-24'}`}>
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin transition-colors duration-300 text-slate-600 dark:text-blue-400" />
                <p className="text-sm transition-colors duration-300 text-slate-600 dark:text-slate-300">
                  Loading your saved providers...
                </p>
              </div>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${themeClasses.emptyStateBox}`}>
                <BookmarkCheck className={`w-8 h-8 transition-colors duration-300 ${themeClasses.emptyStateText}`} />
              </div>
              <h3 className={`mt-5 text-lg font-semibold tracking-wide transition-colors duration-300 ${themeClasses.primaryText}`}>
                Nothing Saved
              </h3>
              <p className={`text-xs mt-2 max-w-xs mx-auto leading-relaxed transition-colors duration-300 ${themeClasses.secondaryText}`}>
                Start a search and save providers to build your personal shortlist for quick access later.
              </p>
              <Button size="md" onClick={() => console.log('Navigate to chat')} leftIcon={<Search className="w-4 h-4" />}>
                New Search
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map(p => {
              const removing = removingId === p.id;
              const sharing = sharingId === p.id;
              
              // Light theme card overlay
              const lightCardOverlay = 'radial-gradient(circle at 20% 25%, rgba(71,85,105,.25) 0, transparent 60%), radial-gradient(circle at 80% 35%, rgba(100,116,139,.20) 0, transparent 65%), radial-gradient(circle at 55% 85%, rgba(148,163,184,.18) 0, transparent 65%)';
              
              // Dark theme card overlay (original)
              const darkCardOverlay = 'radial-gradient(circle at 20% 25%, rgba(59,130,246,.18) 0, transparent 60%), radial-gradient(circle at 80% 35%, rgba(147,51,234,.18) 0, transparent 65%), radial-gradient(circle at 55% 85%, rgba(236,72,153,.18) 0, transparent 65%)';
              
              return (
                <div key={p.id} className={`relative rounded-3xl p-5 overflow-hidden group transition-all duration-300 hover:scale-[1.02] ${themeClasses.card}`}>
                  <div 
                    className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none transition-all duration-300" 
                    style={{backgroundImage: isDark ? darkCardOverlay : lightCardOverlay}} 
                  />
                  <div className="relative flex gap-5">
                    <div className="relative">
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className={`w-20 h-20 rounded-2xl object-cover shadow-lg transition-all duration-300 ${
                          isDark ? 'border border-white/10' : 'border border-slate-400/40 shadow-slate-800/30'
                        }`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className={`font-semibold tracking-wide text-base leading-tight truncate transition-colors duration-300 ${themeClasses.primaryText}`}>
                            {p.name}
                          </h3>
                          <div className={`mt-2 flex items-center gap-3 text-[11px] flex-wrap transition-colors duration-300 ${themeClasses.secondaryText}`}>
                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] tracking-wide transition-all duration-300 ${themeClasses.categoryBadge}`}>
                              {p.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {p.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" /> {p.reviews} reviews
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold shrink-0">
                          <Star className="w-4 h-4 fill-amber-400" /> {p.rating}
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3 flex-wrap">
                        <Button size="md" variant="whatsapp" onClick={() => {}} leftIcon={<MessageCircle className="w-4 h-4" />}>
                          WhatsApp
                        </Button>
                        <Button size="md" variant="subtle" onClick={() => {}} leftIcon={<Phone className="w-4 h-4" />}>
                          Call
                        </Button>
                        <Button size="md" variant="subtle" onClick={() => shareProvider(p.id)} leftIcon={<Share2 className="w-4 h-4" />} loading={sharing}>
                          {sharing ? 'Sharing' : 'Share'}
                        </Button>
                        <Button size="md" variant="danger" onClick={() => removeProvider(p.id)} leftIcon={<Trash2 className="w-4 h-4" />} loading={removing}>
                          {removing ? 'Removing' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SavedProvidersScreen;