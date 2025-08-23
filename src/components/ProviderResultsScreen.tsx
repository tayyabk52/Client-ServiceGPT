import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map as MapIcon, List, Star, Heart, MessageCircle, ArrowLeft, ChevronDown, ExternalLink, X, Check, Loader2 } from 'lucide-react';
import { ServiceProvider } from '../types';

interface LocationState {
  providers?: ServiceProvider[];
  searchQuery?: string;
  category?: string;
}

type ViewMode = 'list' | 'map';

// Themed mock map placeholder (dark glass style)
const MapPlaceholder: React.FC<{ providers: ServiceProvider[] }> = ({ providers }) => (
  <div className="w-full h-[520px] rounded-3xl relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#101826]/80 via-[#0d1320]/70 to-[#161b2b]/80 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
    <div className="absolute inset-0 opacity-[0.35] mix-blend-screen" style={{backgroundImage:'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35) 0, transparent 55%), radial-gradient(circle at 75% 20%, rgba(168,85,247,0.35) 0, transparent 60%), radial-gradient(circle at 60% 75%, rgba(236,72,153,0.3) 0, transparent 60%)'}} />
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_65%,rgba(255,255,255,0.08)_100%)] pointer-events-none" />
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
      <div className="mb-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-xs font-medium text-blue-200 tracking-wider">
        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse" />
        <span>MAP MODE (MOCK)</span>
      </div>
      <p className="text-lg font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">Interactive Map Coming Soon</p>
      <p className="text-sm text-blue-300/80">Showing {providers.length} dynamic provider marker placeholders</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-xl">
        {providers.slice(0,8).map(p => (
          <div key={p.id} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-[11px] text-blue-200/80 backdrop-blur-md">
            {p.businessName.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
    {/* Decorative grid */}
    <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize:'40px 40px'}} />
  </div>
);

const ProviderResultsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as LocationState;
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAll, setShowAll] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [prefill, setPrefill] = useState('');
  const providers: ServiceProvider[] = state.providers || [];
  const visibleProviders = showAll ? providers : providers.slice(0, 6);

  const category = state.category || providers[0]?.category || 'Service Providers';
  const searchQuery = state.searchQuery || category;

  // Compose message when provider changes
  useEffect(() => {
    if (selectedProvider) {
      const base = `Hello ${selectedProvider.businessName}! I'm interested in your ${selectedProvider.category.toLowerCase()} services I found via ServiceGPT. Could you assist with my needs?`;
      setPrefill(base + '\n\nBrief: [Add any extra details here]\nPreferred timing: [e.g. This week]\nBudget: [optional]\n\nThanks!');
    }
  }, [selectedProvider]);

  const openWhatsApp = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowWhatsApp(true);
    setSending(false);
    setSent(false);
  };

  const buildWhatsAppLink = () => {
    if (!selectedProvider) return '#';
    const raw = (selectedProvider.whatsapp || selectedProvider.phone || '').replace(/[^\d+]/g, '');
    const number = raw.startsWith('+') ? raw.replace(/\+/,'') : raw;
    const text = encodeURIComponent(prefill.replace(/\n/g,'\n'));
    return `https://wa.me/${number}?text=${text}`;
  };

  const simulateSend = () => {
    setSending(true);
    setSent(false);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1300);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e3a8a_0%,transparent_60%),radial-gradient(circle_at_80%_30%,#7e22ce_0%,transparent_55%),radial-gradient(circle_at_50%_80%,#be185d_0%,transparent_55%)] opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#05070d_0%,#090d17_45%,#0d1220_70%,#101727_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cpath fill=%27%23fff%27 fill-opacity=%270.08%27 d=%27M0 0h1v1H0z%27/%3E%3C/svg%3E")'}} />

      {/* Fixed Header / Filters */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[linear-gradient(140deg,#05070d_0%,#090d17_45%,#0d1220_70%,#101727_100%)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <button onClick={() => navigate(-1)} className="group h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all backdrop-blur-md">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <div className="inline-flex items-center gap-2 mb-1 sm:mb-2">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-50 to-purple-100 bg-clip-text text-transparent">{searchQuery}</h1>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/15 text-blue-200/80">Live</span>
                </div>
                <p className="text-xs sm:text-[13px] text-blue-100/60 font-medium">{providers.length} providers • curated results</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 self-start md:self-auto">
              <button onClick={() => setViewMode('list')} className={`relative h-9 sm:h-11 px-3 sm:px-4 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium transition-all backdrop-blur-md border ${viewMode==='list' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/40 shadow-lg shadow-blue-500/25' : 'bg-white/5 text-blue-200/70 border-white/10 hover:bg-white/10 hover:text-white'} overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white/10 to-transparent" />
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>List</span>
              </button>
              <button onClick={() => setViewMode('map')} className={`relative h-9 sm:h-11 px-3 sm:px-4 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium transition-all backdrop-blur-md border ${viewMode==='map' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/40 shadow-lg shadow-blue-500/25' : 'bg-white/5 text-blue-200/70 border-white/10 hover:bg-white/10 hover:text-white'} overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white/10 to-transparent" />
                <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>Map</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {[
              {label:`Location: 5 km`},
              {label:`Category: ${category}`},
            {label:`Rating 4.0+`},
            {label:`Price: All`}
          ].map(chip => (
            <button key={chip.label} className="group relative inline-flex items-center space-x-2 h-10 pl-4 pr-3 rounded-xl text-[13px] font-medium tracking-wide bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/10 text-blue-100/80 hover:text-white hover:border-blue-400/40 hover:from-white/20 hover:to-white/10 transition-all backdrop-blur-xl overflow-hidden">
              <span>{chip.label}</span>
              <ChevronDown className="w-4 h-4 text-blue-200/50 group-hover:text-white transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_60%)] transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Scrollable Content Area */}
    <div className="pt-32 sm:pt-36 md:pt-44 lg:pt-48 px-4 sm:px-6 lg:px-10 pb-8">
      <div className="max-w-7xl mx-auto">

        {viewMode === 'map' ? (
          <MapPlaceholder providers={providers} />
        ) : (
          <>
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-12">
              {visibleProviders.map(provider => (
                <div key={provider.id} className="group relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.55)] transition-all duration-500 hover:-translate-y-1 flex flex-col">
                  {/* Accent gradient bar */}
                  <div className="absolute -left-px top-4 h-10 w-[3px] rounded-r-full bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 opacity-70 group-hover:opacity-100 group-hover:h-14 transition-all" />
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/20 group-hover:ring-blue-400/40 transition-all duration-500 shadow-lg">
                        <img src={provider.profileImage} alt={provider.businessName} className="w-full h-full object-cover" />
                      </div>
                      {provider.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-[#0d1220] shadow-md">✓</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 pr-2">
                          <h3 className="text-[15px] font-semibold text-white truncate tracking-wide group-hover:text-blue-200 transition-colors">{provider.businessName}</h3>
                          <p className="text-[11px] font-medium text-blue-300/80 uppercase tracking-[0.12em] mt-1">{provider.category}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center space-x-1.5">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-300 drop-shadow" />
                            <span className="text-sm font-semibold text-white">{provider.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] text-blue-200/60 mt-1">{provider.distance}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-blue-100/60">
                        <span className="inline-flex items-center font-semibold text-emerald-300/90 bg-emerald-500/10 px-2 py-1 rounded-lg ring-1 ring-emerald-400/20 tracking-wide">{provider.priceRange}</span>
                        <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" /> {provider.responseTime} resp.</span>
                        <span> {provider.completedJobs} jobs</span>
                      </div>
                    </div>
                  </div>
                  {/* Divider removed tags */}
                  <div className="mt-4 mb-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-2.5">
                      <button onClick={() => openWhatsApp(provider)} className="relative h-10 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-[13px] font-semibold shadow-lg shadow-green-600/30 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 overflow-hidden group">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white/40 to-transparent" />
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-200/60 hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-all">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <button className="group text-[13px] font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-colors">
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    </button>
                  </div>
                  {/* Glow ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-blue-400/30 transition-all" />
                  <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-xl transition-opacity" />
                </div>
              ))}
            </div>
            {providers.length > 6 && !showAll && (
              <div className="flex justify-center mb-24">
                <button onClick={() => setShowAll(true)} className="relative px-10 h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border border-white/10 flex items-center gap-3 overflow-hidden group text-sm tracking-wide">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
                  <span>Load More Providers</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-md border border-white/10">{providers.length - 6} more</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {showWhatsApp && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowWhatsApp(false)} />
          <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-gradient-to-br from-[#101826]/90 via-[#0d1320]/85 to-[#161b2b]/90 border border-white/10 shadow-2xl animate-scaleIn">
            {/* Decorative gradients */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 15% 20%, rgba(59,130,246,.25) 0, transparent 55%), radial-gradient(circle at 85% 30%, rgba(147,51,234,.25) 0, transparent 60%), radial-gradient(circle at 60% 85%, rgba(236,72,153,.25) 0, transparent 60%)'}} />
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.07)_100%)] pointer-events-none" />
            <div className="relative p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-blue-50 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
                    Outreach to {selectedProvider.businessName}
                  </h2>
                  <p className="text-xs text-blue-200/70 mt-1 tracking-wide uppercase">WhatsApp Mock Automation</p>
                </div>
                <button onClick={() => setShowWhatsApp(false)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/10">
                  <img src={selectedProvider.profileImage} alt={selectedProvider.businessName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{selectedProvider.businessName}</p>
                  <p className="text-[11px] text-blue-300/70 uppercase tracking-wider">{selectedProvider.category}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-blue-200/60">
                    <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{selectedProvider.rating.toFixed(1)}</span>
                    <span>{selectedProvider.distance}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300/90 font-medium">{selectedProvider.priceRange}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-blue-200/70 block mb-2">Prefilled Message</label>
                <div className="relative group">
                  <textarea value={prefill} onChange={e=>setPrefill(e.target.value)} rows={5} className="w-full rounded-2xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none p-4 text-sm text-blue-50/90 leading-relaxed backdrop-blur-md transition-all" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-focus-within:ring-blue-400/40 transition" />
                </div>
                <div className="flex justify-between mt-2 text-[11px] text-blue-300/50">
                  <span>{prefill.length} chars</span>
                  <span>Editable before sending</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 flex gap-3">
                  <button disabled={sending || sent} onClick={simulateSend} className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all relative overflow-hidden ${sent ? 'bg-green-600/20 border border-green-400/40 text-green-300' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border border-green-400/30 shadow-lg hover:shadow-green-500/30'} ${sending ? 'opacity-70 cursor-wait' : ''}`}>
                    {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {sent && <Check className="w-4 h-4" />}
                    {!sending && !sent && <MessageCircle className="w-4 h-4" />}
                    <span>{sent ? 'Prepared' : sending ? 'Preparing...' : 'Prepare & Track'}</span>
                  </button>
                  <a onClick={e=>{if(!sent){e.preventDefault(); simulateSend();}}} href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${sent ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg' : 'bg-white/5 text-blue-200/70 border border-white/10 hover:bg-white/10'} `}>
                    <ExternalLink className="w-4 h-4" />
                    <span>{sent ? 'Open WhatsApp' : 'Open (after prep)'}</span>
                  </a>
                </div>
              </div>
              <div className="relative mt-2 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 transition-all duration-700 ${sending ? 'w-2/3 animate-pulse' : sent ? 'w-full' : 'w-0'}`} />
                {sent && <div className="absolute inset-0 rounded-full ring-1 ring-green-400/40 animate-pulse" />}
              </div>
              {sent && (
                <p className="text-[11px] text-green-300/80 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Message prepared locally. This is a mock preview.</p>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProviderResultsScreen;
