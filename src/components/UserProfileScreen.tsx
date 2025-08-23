import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Shield, Bell, MapPin, User, Lock, LogOut, Edit3, Mail, Phone, CheckCircle2, ChevronDown, ChevronUp, Link2, Loader2, AlertTriangle, X, CheckCircle } from 'lucide-react';

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedLocaleType, setSelectedLocaleType] = useState<'Urban'|'Suburban'|'Rural'>('Urban');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; type?: 'success' | 'error' | 'info'; desc?: string }>>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ personal: true, location: false, notifications: true, privacy: false, accounts: true });
  const [profile, setProfile] = useState({
    name: 'John Carter',
    email: 'john.carter@example.com',
    phone: '+1 (555) 234-9876',
    accountType: 'Pro',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=240&h=240&fit=crop&crop=face',
    address: '123 Market Street, New York, NY',
    radiusKm: 25
  });
  const initialNotif = { emailUpdates: true, providerReplies: true, recommendations: true, marketing: false, security: true };
  const initialPrivacy = { showProfilePublic: false, shareActivity: false, aiPersonalization: true, dataCollection: true };
  const initialAccounts = { google: true, facebook: false };
  const [notifSettings, setNotifSettings] = useState(initialNotif);
  const [privacySettings, setPrivacySettings] = useState(initialPrivacy);
  const [connectedAccounts, setConnectedAccounts] = useState(initialAccounts);

  // Dirty tracking state snapshots
  const [baseline, setBaseline] = useState({ profile, notifSettings, privacySettings, connectedAccounts, selectedLocaleType });

  // Animated mount
  useEffect(() => {
    const style = document.createElement('style');
  style.textContent = `@keyframes fadeSlide {0%{opacity:0;transform:translateY(18px) scale(.97)}60%{opacity:.85;transform:translateY(-4px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}} .animate-section{animation:fadeSlide .65s cubic-bezier(.23,1,.32,1);} .section-gradient:hover{border-color:rgba(255,255,255,.25);} .glass-input{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);} .glass-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2);} .toggle-base{transition:all .35s cubic-bezier(.23,1,.32,1);} .gradient-ring{position:relative;} .gradient-ring:before{content:'';position:absolute;inset:-2px;border-radius:inherit;padding:2px;background:linear-gradient(120deg,rgba(59,130,246,.6),rgba(147,51,234,.5),rgba(236,72,153,.5));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:.5s;} .gradient-ring:hover:before{opacity:.9;} .focus-reset:focus{outline:none;box-shadow:none;}  `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  const toggleExpand = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // Toast helper
  const pushToast = (title: string, type: 'success' | 'error' | 'info' = 'info', desc?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, title, type, desc }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const guardEdit = (fn: () => void) => {
    if (!editing) {
      pushToast('Enable Edit Mode', 'info', 'Tap Edit to modify settings');
      return;
    }
    fn();
  };

  const toggleSetting = (group: 'notif' | 'privacy', key: string) => guardEdit(() => {
    if (group === 'notif') setNotifSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }));
    else setPrivacySettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }));
  });
  const toggleAccount = (key: 'google' | 'facebook') => guardEdit(() => {
    // Simulate async connect/disconnect
    pushToast(`${connectedAccounts[key] ? 'Disconnecting' : 'Connecting'} ${key === 'google' ? 'Google' : 'Facebook'}...`, 'info');
    setTimeout(() => {
      setConnectedAccounts(a => ({ ...a, [key]: !a[key] }));
      pushToast(`${key === 'google' ? 'Google' : 'Facebook'} ${connectedAccounts[key] ? 'Disconnected' : 'Connected'}!`, 'success');
    }, 800);
  });

  const hasProfileChanged = useMemo(() => JSON.stringify(profile) !== JSON.stringify(baseline.profile), [profile, baseline.profile]);
  const hasNotifChanged = useMemo(() => JSON.stringify(notifSettings) !== JSON.stringify(baseline.notifSettings), [notifSettings, baseline.notifSettings]);
  const hasPrivacyChanged = useMemo(() => JSON.stringify(privacySettings) !== JSON.stringify(baseline.privacySettings), [privacySettings, baseline.privacySettings]);
  const hasAccountsChanged = useMemo(() => JSON.stringify(connectedAccounts) !== JSON.stringify(baseline.connectedAccounts), [connectedAccounts, baseline.connectedAccounts]);
  const hasLocaleTypeChanged = useMemo(() => selectedLocaleType !== baseline.selectedLocaleType, [selectedLocaleType, baseline.selectedLocaleType]);
  const dirtySections = useMemo(() => {
    const arr:string[] = [];
    if (hasProfileChanged) arr.push('Profile');
    if (hasNotifChanged) arr.push('Notifications');
    if (hasPrivacyChanged) arr.push('Privacy');
    if (hasAccountsChanged) arr.push('Accounts');
    if (hasLocaleTypeChanged) arr.push('Location');
    return arr;
  }, [hasProfileChanged, hasNotifChanged, hasPrivacyChanged, hasAccountsChanged, hasLocaleTypeChanged]);
  const isDirty = dirtySections.length > 0;

  const simulateNetwork = (ms = 900) => new Promise(res => setTimeout(res, ms));

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    pushToast('Saving changes...', 'info');
    await simulateNetwork();
    setBaseline({ profile, notifSettings, privacySettings, connectedAccounts, selectedLocaleType });
    setSaving(false);
    setEditing(false);
    setLastSaved(new Date());
    pushToast('Profile Updated', 'success', 'Your changes are stored locally (mock)');
  };
  const handleCancel = () => {
    setProfile(baseline.profile);
    setNotifSettings(baseline.notifSettings);
    setPrivacySettings(baseline.privacySettings);
    setConnectedAccounts(baseline.connectedAccounts);
    setSelectedLocaleType(baseline.selectedLocaleType);
    setEditing(false);
    pushToast('Reverted', 'info', 'All unsaved changes discarded');
  };

  const openPasswordModal = () => { setPwdForm({ current: '', next: '', confirm: '' }); setPwdError(null); setShowPwdModal(true); };
  const submitPassword = async () => {
    setPwdError(null);
    if (!pwdForm.current || !pwdForm.next) { setPwdError('Fill all fields'); return; }
    if (pwdForm.next !== pwdForm.confirm) { setPwdError('Passwords do not match'); return; }
    setPwdSubmitting(true);
    await simulateNetwork(1100);
    setPwdSubmitting(false);
    setShowPwdModal(false);
    pushToast('Password Changed', 'success');
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    pushToast('Logging out...', 'info');
    await simulateNetwork(700);
    pushToast('Logged Out (mock)', 'success');
    navigate('/');
  };

  const triggerAvatarUpload = () => guardEdit(() => fileInputRef.current?.click());
  const onAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUploading(true);
      const url = URL.createObjectURL(file);
      setTimeout(() => {
        setProfile(p => ({ ...p, avatar: url }));
        setAvatarUploading(false);
        pushToast('Avatar Updated', 'success');
      }, 900);
    }
  };

  const sectionWrapper = (id: string, title: string, icon: React.ReactNode, children: React.ReactNode, subtitle?: string) => (
    <div className={`relative rounded-2xl p-5 sm:p-6 bg-white/5 backdrop-blur-xl border border-white/10 transition-colors section-gradient animate-section ${expanded[id] ? 'ring-1 ring-white/10' : ''}`}> 
  <button onClick={() => toggleExpand(id)} className="focus-reset w-full flex items-center justify-between group mb-3" aria-expanded={expanded[id]} aria-controls={`section-${id}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-purple-600/30 flex items-center justify-center text-white shadow-inner">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm sm:text-base tracking-wide">{title}</h3>
            {subtitle && <p className="text-[11px] text-blue-200/60 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-transform ${expanded[id] ? 'rotate-180' : ''}`}>
          {expanded[id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded[id] && <div id={`section-${id}`} className="mt-2 space-y-5">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen relative text-white">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-40 w-[520px] h-[520px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] bg-gradient-to-tr from-fuchsia-500/15 via-purple-500/10 to-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(59,130,246,0.15),transparent_60%)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b111a] via-[#080e16] to-[#05080d]" />
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-2xl bg-black/50 border-b border-white/10 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-wide">Profile</h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70 font-medium">User Settings</p>
            </div>
          </div>
          <button onClick={() => setEditing(e=>{ if(!e) pushToast('Edit Mode Enabled','info','Changes are local only'); else if(isDirty) pushToast('Unsaved Changes','info','Remember to save'); return !e;})} className="px-3 h-10 rounded-xl text-sm font-semibold relative group overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:from-blue-500 group-hover:to-pink-500 transition" />
            <span className="relative flex items-center gap-2"><Edit3 className="w-4 h-4" /> {editing ? 'Exit' : 'Edit'}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-40 space-y-8">
          {/* Profile Header */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden gradient-ring">
            <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{backgroundImage:'radial-gradient(circle at 20% 25%, rgba(59,130,246,.25) 0, transparent 60%), radial-gradient(circle at 80% 35%, rgba(147,51,234,.25) 0, transparent 65%), radial-gradient(circle at 55% 85%, rgba(236,72,153,.25) 0, transparent 65%)'}} />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-3xl shadow-2xl ring-4 ring-white/10" />
                <button onClick={triggerAvatarUpload} disabled={!editing} className="absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl border border-white/20 hover:scale-105 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  {avatarUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarSelected} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">{profile.name}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600">{profile.accountType} ACCOUNT</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-blue-200/80">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.phone}</div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-4">
                  {[{label:'Total Searches', value:24},{label:'Providers Contacted', value:15},{label:'Saved Providers', value:42}].map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-white via-blue-100 to-white bg-clip-text text-transparent">{m.value}</div>
                      <div className="text-[11px] uppercase tracking-wide text-blue-200/60 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => setEditing(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold hover:from-blue-500 hover:to-pink-500 transition disabled:opacity-40" disabled={editing}>Edit Profile</button>
                  <button onClick={openPasswordModal} className="px-4 py-2.5 rounded-xl bg-white/10 text-sm font-semibold hover:bg-white/15 transition flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</button>
                  <button onClick={()=>setShowLogoutConfirm(true)} className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-sm font-semibold flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          {sectionWrapper('personal', 'Personal Information', <User className="w-5 h-5" />, (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wide text-blue-200/60">Full Name</label>
                <input disabled={!editing} value={profile.name} onChange={e=>setProfile(p=>({...p, name:e.target.value}))} className="w-full rounded-xl glass-input px-4 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wide text-blue-200/60">Email</label>
                <input disabled value={profile.email} className="w-full rounded-xl glass-input px-4 py-3 text-sm disabled:opacity-60" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wide text-blue-200/60">Phone</label>
                <input disabled={!editing} value={profile.phone} onChange={e=>setProfile(p=>({...p, phone:e.target.value}))} className="w-full rounded-xl glass-input px-4 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wide text-blue-200/60">Account Type</label>
                <input disabled value={profile.accountType} className="w-full rounded-xl glass-input px-4 py-3 text-sm disabled:opacity-60" />
              </div>
            </div>
          ), 'Manage the core details of your account')}

          {sectionWrapper('location', 'Location Preferences', <MapPin className="w-5 h-5" />, (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wide text-blue-200/60">Primary Address</label>
                <input disabled={!editing} value={profile.address} onChange={e=>setProfile(p=>({...p, address:e.target.value}))} className="w-full rounded-xl glass-input px-4 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium tracking-wide text-blue-200/60">Search Radius (km)</label>
                  <span className="text-xs font-semibold text-blue-200/70">{profile.radiusKm} km</span>
                </div>
                <input type="range" min={5} max={100} step={5} disabled={!editing} value={profile.radiusKm} onChange={e=>setProfile(p=>({...p, radiusKm: Number(e.target.value)}))} className="w-full accent-blue-500" />
                <div className="flex justify-between text-[10px] text-blue-200/40">
                  <span>5</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {(['Urban','Suburban','Rural'] as Array<'Urban'|'Suburban'|'Rural'>).map(t => (
                  <button key={t} onClick={()=>guardEdit(()=>setSelectedLocaleType(t))} className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition relative ${selectedLocaleType===t ? 'bg-blue-600/30 border-blue-400/40 text-white ring-1 ring-blue-300/40' : 'bg-white/5 border-white/10 text-blue-200/70 hover:bg-white/10'} ${!editing && 'opacity-60 cursor-not-allowed'}`}>
                    {t}
                    {selectedLocaleType===t && <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Active</span>}
                  </button>
                ))}
              </div>
            </div>
          ), 'Adjust how location shapes your results')}

          {sectionWrapper('notifications', 'Notification Settings', <Bell className="w-5 h-5" />, (
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key:'emailUpdates', label:'Email Updates', desc:'General platform announcements & updates' },
                { key:'providerReplies', label:'Provider Replies', desc:'When a contacted provider responds' },
                { key:'recommendations', label:'AI Recommendations', desc:'Smart suggestions for better matches' },
                { key:'marketing', label:'Promotions & Offers', desc:'Occasional deals and seasonal offers' },
                { key:'security', label:'Security Alerts', desc:'Password, login & unusual activity' }
              ].map(opt => (
                <div key={opt.key} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                  <button onClick={()=>toggleSetting('notif', opt.key)} disabled={!editing} className={`relative w-11 h-6 rounded-full toggle-base ${notifSettings[opt.key as keyof typeof notifSettings] ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-white/15'} flex items-center px-1 disabled:opacity-40 disabled:cursor-not-allowed`}> 
                    <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings[opt.key as keyof typeof notifSettings] ? 'translate-x-5' : ''}`}></span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium">{opt.label}</p>
                    <p className="text-[11px] text-blue-200/60 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ), 'Control how you stay informed')}

          {sectionWrapper('privacy', 'Privacy Settings', <Shield className="w-5 h-5" />, (
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key:'showProfilePublic', label:'Public Profile', desc:'Allow others to view limited public details' },
                { key:'shareActivity', label:'Share Activity', desc:'Share anonymized usage data to improve matches' },
                { key:'aiPersonalization', label:'AI Personalization', desc:'Use activity to tailor AI responses' },
                { key:'dataCollection', label:'Data Collection', desc:'Help improve the platform experience' }
              ].map(opt => (
                <div key={opt.key} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                  <button onClick={()=>toggleSetting('privacy', opt.key)} disabled={!editing} className={`relative w-11 h-6 rounded-full toggle-base ${privacySettings[opt.key as keyof typeof privacySettings] ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/15'} flex items-center px-1 disabled:opacity-40 disabled:cursor-not-allowed`}> 
                    <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${privacySettings[opt.key as keyof typeof privacySettings] ? 'translate-x-5' : ''}`}></span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium">{opt.label}</p>
                    <p className="text-[11px] text-blue-200/60 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ), 'Your data & visibility controls')}

          {sectionWrapper('accounts', 'Connected Accounts', <Link2 className="w-5 h-5" />, (
            <div className="space-y-4">
              {[
                { key:'google', label:'Google', desc:'Used for quick sign-in & syncing', color:'from-red-500 via-orange-500 to-yellow-500' },
                { key:'facebook', label:'Facebook', desc:'Social login & profile sync', color:'from-blue-600 to-indigo-600' }
              ].map(acc => (
                <div key={acc.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white font-semibold text-sm`}>{acc.label.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">{acc.label} {connectedAccounts[acc.key as keyof typeof connectedAccounts] && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}</p>
                      <p className="text-[11px] text-blue-200/60 mt-1">{acc.desc}</p>
                    </div>
                  </div>
                  <button onClick={()=>toggleAccount(acc.key as 'google' | 'facebook')} disabled={!editing} className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${connectedAccounts[acc.key as keyof typeof connectedAccounts] ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'} disabled:opacity-40 disabled:cursor-not-allowed`}>{connectedAccounts[acc.key as keyof typeof connectedAccounts] ? 'Connected' : 'Connect'}</button>
                </div>
              ))}
            </div>
          ), 'Link accounts for faster access')}
        </div>

        {/* Bottom Floating Bar */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-black/85 via-black/60 to-transparent backdrop-blur-2xl border-t border-white/10 flex items-center justify-between gap-4 z-50">
          <div className="flex-1 hidden sm:block">
            <p className="text-[11px] text-blue-200/60 uppercase tracking-wider">Status</p>
            <p className="text-xs font-medium flex items-center gap-2"><Shield className="w-3 h-3 text-emerald-400" /> Secure • <span className="text-blue-200/50">All changes local (mock)</span>{lastSaved && <span className="text-blue-300/60"> • Saved {lastSaved.toLocaleTimeString()}</span>}</p>
          </div>
          <div className="flex-1 flex sm:justify-end gap-3">
            <button onClick={handleCancel} disabled={!editing || (!isDirty && !saving)} className={`h-11 px-5 rounded-2xl text-sm font-semibold transition relative overflow-hidden ${editing && (isDirty || saving) ? 'bg-white/10 hover:bg-white/15' : 'bg-white/5 opacity-40 cursor-not-allowed'}`}>{saving ? '...' : 'Cancel'}</button>
            <button onClick={handleSave} disabled={!editing || !isDirty || saving} className={`h-11 px-6 rounded-2xl text-sm font-semibold relative overflow-hidden group ${editing && isDirty && !saving ? 'text-white' : 'text-white/50 cursor-not-allowed'}`}>
              <span className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 ${editing && isDirty && !saving ? 'group-hover:from-blue-500 group-hover:to-pink-500' : 'opacity-30'} transition`} />
              <span className="relative flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />} {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'No Changes'}</span>
            </button>
          </div>
        </div>
      
      {/* Toasts */}
      <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-[60] pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto w-[92%] sm:w-auto max-w-sm px-4 py-3 rounded-2xl backdrop-blur-xl border flex gap-3 items-start shadow-lg animate-section ${t.type==='success' ? 'border-emerald-400/30 bg-emerald-500/15' : t.type==='error' ? 'border-red-400/30 bg-red-500/15' : 'border-white/15 bg-white/10'}`}> 
            <div className="mt-0.5">
              {t.type==='success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {t.type==='error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              {t.type==='info' && <Bell className="w-4 h-4 text-blue-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{t.title}</p>
              {t.desc && <p className="text-[11px] text-blue-200/70 mt-0.5 leading-relaxed">{t.desc}</p>}
            </div>
            <button className="text-white/50 hover:text-white" onClick={()=>setToasts(ts=>ts.filter(x=>x.id!==t.id))}><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Change Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>!pwdSubmitting && setShowPwdModal(false)} />
          <div className="relative bg-[#0d1522]/95 border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:w-[440px] p-6 space-y-5 animate-section">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button onClick={()=>!pwdSubmitting && setShowPwdModal(false)} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {['current','next','confirm'].map(f => (
                <div key={f} className="space-y-1">
                  <label className="text-[11px] tracking-wide uppercase text-blue-200/50 font-medium">{f==='current'?'Current Password': f==='next' ? 'New Password' : 'Confirm Password'}</label>
                  <input type="password" value={pwdForm[f as keyof typeof pwdForm]} onChange={e=>setPwdForm(p=>({...p,[f]:e.target.value}))} disabled={pwdSubmitting} className="w-full glass-input rounded-xl px-4 py-3 text-sm" />
                </div>
              ))}
              {pwdError && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {pwdError}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowPwdModal(false)} disabled={pwdSubmitting} className="h-11 flex-1 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-semibold disabled:opacity-40">Cancel</button>
              <button onClick={submitPassword} disabled={pwdSubmitting} className="h-11 flex-1 rounded-2xl text-sm font-semibold relative overflow-hidden group">
                <span className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 ${!pwdSubmitting && 'group-hover:from-blue-500 group-hover:to-pink-500'} transition`} />
                <span className="relative flex items-center justify-center gap-2">{pwdSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {pwdSubmitting ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
            <p className="text-[11px] text-blue-200/40 leading-relaxed">Security tip: choose a strong password with at least 10 characters, mixing letters, numbers & symbols. This is a mock flow.</p>
          </div>
        </div>
      )}

      {/* Logout Confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>setShowLogoutConfirm(false)} />
          <div className="relative bg-[#0d1522]/95 border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:w-[420px] p-6 space-y-5 animate-section">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Confirm Logout</h3>
              <button onClick={()=>setShowLogoutConfirm(false)} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-blue-100/70 leading-relaxed">You will be returned to the landing page. Session clearing is simulated here (no real auth yet).</p>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowLogoutConfirm(false)} className="h-11 flex-1 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-semibold">Cancel</button>
              <button onClick={handleLogout} className="h-11 flex-1 rounded-2xl text-sm font-semibold bg-red-600/80 hover:bg-red-600 flex items-center justify-center gap-2">Logout</button>
            </div>
            <p className="text-[11px] text-blue-200/40 leading-relaxed">Later we'll integrate real sign-out & token revocation.</p>
          </div>
        </div>
      )}

      {/* Dirty Badge */}
      {editing && isDirty && (
        <div className="fixed bottom-[108px] right-4 z-[65]">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-xl text-[11px] font-semibold tracking-wide shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" /> {dirtySections.length} Unsaved • {dirtySections.join(', ')}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserProfileScreen;
