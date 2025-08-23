import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Search, Filter, MapPin, MessageCircle, Phone, Tag, Trash2, Share2, Loader2, BookmarkCheck } from 'lucide-react';
import Button from './ui/Button';

/**
 * SavedProvidersScreen
 * Mobile-first luxury glass UI showing user's saved service providers.
 * Mock data & local interactions only.
 */
const SavedProvidersScreen: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [sort, setSort] = useState<'recent' | 'rating' | 'name'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All','Plumbing','Electrical','Cleaning','Landscaping','Renovation','IT','Misc'];

  useEffect(()=>{
    const t = setTimeout(()=> setLoading(false), 800);
    return ()=> clearTimeout(t);
  },[]);

  const providers = useMemo(()=>[
    { id:'p1', name:'AquaFlow Plumbing Co.', rating:4.9, reviews:182, distance: '2.1 km', category:'Plumbing', short:'Emergency & domestic repairs', avatar:'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=200&h=200&fit=crop', tags:['Emergency','Licensed','24/7'], savedAt: Date.now()- 1000*60*60*2 },
    { id:'p2', name:'VoltMaster Electric', rating:4.8, reviews:240, distance: '3.8 km', category:'Electrical', short:'Residential & commercial', avatar:'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=200&fit=crop', tags:['Certified','Insured'], savedAt: Date.now()- 1000*60*60*24 },
    { id:'p3', name:'PureSpark Cleaners', rating:4.7, reviews:134, distance: '1.9 km', category:'Cleaning', short:'Eco-friendly deep cleaning', avatar:'https://images.unsplash.com/photo-1598515214211-d6f3d79c8c5c?w=200&h=200&fit=crop', tags:['Eco','Premium'], savedAt: Date.now()- 1000*60*60*5 },
    { id:'p4', name:'GreenScape Gardens', rating:4.9, reviews:98, distance: '5.5 km', category:'Landscaping', short:'Design & weekly care', avatar:'https://images.unsplash.com/photo-1598511727601-905b2e21a996?w=200&h=200&fit=crop', tags:['Design','Seasonal'], savedAt: Date.now()- 1000*60*60*30 },
    { id:'p5', name:'RenovaCraft Builders', rating:5.0, reviews:76, distance: '6.2 km', category:'Renovation', short:'Kitchen & bath specialists', avatar:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop', tags:['Premium','Warranty'], savedAt: Date.now()- 1000*60*60*12 },
  ],[]);

  const filtered = providers
    .filter(p => category==='All' || p.category===category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t=>t.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=> {
      if (sort==='recent') return b.savedAt - a.savedAt;
      if (sort==='rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  const removeProvider = (id:string) => {
    setRemovingId(id);
    setTimeout(()=> setRemovingId(null), 900); // mock; would remove from state
  };
  const shareProvider = (id:string) => {
    setSharingId(id);
    setTimeout(()=> setSharingId(null), 1200);
  };

  return (
    <div className="min-h-screen relative text-white">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-36 w-[520px] h-[520px] bg-gradient-to-br from-blue-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-36 w-[480px] h-[480px] bg-gradient-to-tr from-fuchsia-500/15 via-purple-500/10 to-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(59,130,246,0.12),transparent_60%)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b111a] via-[#080e16] to-[#05080d]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header (consistent with other pages) */}
        <div className="sticky top-0 backdrop-blur-2xl bg-black/55 border-b border-white/10 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={()=>navigate(-1)}
              size="sm"
              variant="subtle"
              className="!h-10 !w-10 !px-0 rounded-xl"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              aria-label="Back"
            >
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-wide">Saved Providers</h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70 font-medium">Favorites</p>
            </div>
          </div>
          <Button size="md" variant="primary" onClick={()=>setShowFilters(f=>!f)} leftIcon={<Filter className="w-4 h-4" />}>{showFilters ? 'Hide' : 'Filter'}</Button>
        </div>

        {/* Filters Bar */}
        {showFilters && (
          <div className="px-4 py-3 space-y-3 bg-[#0b131c]/80 backdrop-blur-lg border-b border-white/10 animate-section">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-200/40" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search saved..." className="w-full pl-9 pr-3 h-10 rounded-lg bg-white/[0.05] border border-white/10 focus:border-blue-500/50 text-[13px]" />
              </div>
              <div className="w-36">
                <select value={sort} onChange={e=>setSort(e.target.value as 'recent' | 'rating' | 'name')} className="w-full h-10 rounded-lg bg-white/[0.05] border border-white/10 px-2 text-[13px] focus:border-blue-500/50">
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
                  variant={category===c ? 'primary' : 'subtle'}
                  onClick={()=>setCategory(c)}
                  className={`text-[10px] font-medium px-4 ${category===c ? 'shadow-none' : 'bg-white/5 hover:bg-white/10 border-white/10'} rounded-full !h-8`}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 space-y-5">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <p className="text-sm text-blue-200/70">Loading your saved providers...</p>
              </div>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.06] flex items-center justify-center">
                <BookmarkCheck className="w-8 h-8 text-blue-200/70" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-wide">Nothing Saved</h3>
              <p className="text-xs text-blue-200/60 mt-2 max-w-xs mx-auto leading-relaxed">Start a search and save providers to build your personal shortlist for quick access later.</p>
              <Button size="md" onClick={()=>navigate('/chat')} leftIcon={<Search className="w-4 h-4" />}>New Search</Button>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map(p => {
              const removing = removingId === p.id;
              const sharing = sharingId === p.id;
              return (
                <div key={p.id} className="relative rounded-3xl p-5 bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-white/20 transition">
                  <div className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 20% 25%, rgba(59,130,246,.18) 0, transparent 60%), radial-gradient(circle at 80% 35%, rgba(147,51,234,.18) 0, transparent 65%), radial-gradient(circle at 55% 85%, rgba(236,72,153,.18) 0, transparent 65%)'}} />
                  <div className="relative flex gap-5">
                    <div className="relative">
                      <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold tracking-wide text-base leading-tight truncate">{p.name}</h3>
                          <div className="mt-2 flex items-center gap-3 text-[11px] text-blue-200/60 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-blue-600/25 border border-blue-400/30 font-semibold text-[10px] tracking-wide">{p.category}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.distance}</span>
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {p.reviews} reviews</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold shrink-0">
                          <Star className="w-4 h-4 fill-amber-400" /> {p.rating}
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3 flex-wrap">
                        <Button size="md" variant="whatsapp" onClick={()=>{}} leftIcon={<MessageCircle className="w-4 h-4" />}>WhatsApp</Button>
                        <Button size="md" variant="subtle" onClick={()=>{}} leftIcon={<Phone className="w-4 h-4" />}>Call</Button>
                        <Button size="md" variant="subtle" onClick={()=>shareProvider(p.id)} leftIcon={<Share2 className="w-4 h-4" />} loading={sharing}>{sharing ? 'Sharing' : 'Share'}</Button>
                        <Button size="md" variant="danger" onClick={()=>removeProvider(p.id)} leftIcon={<Trash2 className="w-4 h-4" />} loading={removing}>{removing ? 'Removing' : 'Remove'}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedProvidersScreen;
