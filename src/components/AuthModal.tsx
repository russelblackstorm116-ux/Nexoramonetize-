import React, { useState } from 'react';
import { Mail, Lock, User, Target, X, Check, ArrowRight } from 'lucide-react';
import { UserSession, SubscriptionTier } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { googleSignIn } from '../lib/gmailAuth';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: UserSession) => void;
  initialTab?: 'login' | 'signup';
}

export default function AuthModal({ onClose, onAuthSuccess, initialTab = 'login' }: AuthModalProps) {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState<number>(3000);
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Login trigger
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const resp = await googleSignIn();
      if (resp) {
        const userSession: UserSession = {
          uid: resp.user.uid,
          email: resp.user.email || 'russelblackstorm116@gmail.com',
          displayName: resp.user.displayName || resp.user.email?.split('@')[0] || 'Maker',
          subscription: 'free',
          targetMonthlyGoal: 3000,
          joinedAt: new Date().toISOString()
        };
        onAuthSuccess(userSession);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Google Auth Failure');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Submit trigger
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('auth.fill_fields'));
      return;
    }

    if (tab === 'signup' && !displayName) {
      setError(t('auth.name_req'));
      return;
    }

    // Capture or generate mock user session
    const mockSession: UserSession = {
      uid: `usr_${Date.now().toString(36)}`,
      email: email.trim().toLowerCase(),
      displayName: tab === 'signup' ? displayName : email.split('@')[0],
      subscription: tab === 'signup' ? tier : 'pro', // Default to pro for general mock logins
      targetMonthlyGoal: tab === 'signup' ? goal : 3000,
      joinedAt: new Date().toISOString()
    };

    // Store in localStorage to support persistence
    localStorage.setItem('nexora_user_session', JSON.stringify(mockSession));
    
    // Add to all accounts registered
    const registered = JSON.parse(localStorage.getItem('nexora_registered_users') || '[]');
    const exists = registered.find((u: any) => u.email === mockSession.email);
    if (!exists) {
      registered.push(mockSession);
      localStorage.setItem('nexora_registered_users', JSON.stringify(registered));
    }

    setSuccess(t('auth.success_msg'));
    setTimeout(() => {
      onAuthSuccess(mockSession);
      onClose();
    }, 800);
  };

  // Instant login helper for testing
  const handleQuickLogin = (presetEmail: string, selectedTier: SubscriptionTier, targetGoal: number) => {
    const mockSession: UserSession = {
      uid: `usr_${presetEmail.split('@')[0]}`,
      email: presetEmail,
      displayName: presetEmail === 'russelblackstorm116@gmail.com' ? 'Russel Blackstorm' : 'Expert Maker',
      subscription: selectedTier,
      targetMonthlyGoal: targetGoal,
      joinedAt: new Date(2026, 4, 15).toISOString()
    };

    localStorage.setItem('nexora_user_session', JSON.stringify(mockSession));
    setSuccess(language === 'fr' ? `Connecté sous ${mockSession.displayName} !` : `Logged in as ${mockSession.displayName}!`);
    setTimeout(() => {
      onAuthSuccess(mockSession);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white font-sans">
              {tab === 'login' ? t('auth.welcome_back') : t('auth.create')}
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              {tab === 'login' 
                ? t('auth.welcome_back_desc') 
                : t('auth.create_desc')}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg mb-6">
            <button 
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`py-2 text-xs font-bold rounded transition-all cursor-pointer ${tab === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t('auth.login')}
            </button>
            <button 
              type="button"
              onClick={() => { setTab('signup'); setError(''); }}
              className={`py-2 text-xs font-bold rounded transition-all cursor-pointer ${tab === 'signup' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t('auth.signup')}
            </button>
          </div>

          {/* Google Sign-In Option */}
          <button 
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md mb-4 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? (language === 'fr' ? 'Connexion en cours...' : 'Signing in...') : (language === 'fr' ? 'Continuer avec Google (Cloud Sync)' : 'Continue with Google (Cloud Sync)')}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">{language === 'fr' ? 'Ou email standard' : 'Or standard email'}</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">{t('auth.label_name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    required
                    placeholder={t('auth.placeholder_name')}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">{t('auth.label_email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="email"
                  required
                  placeholder={t('auth.placeholder_email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">{t('auth.label_password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {tab === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">{t('auth.label_goal')}</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="number"
                      required
                      min={500}
                      max={100000}
                      value={goal}
                      onChange={(e) => setGoal(Number(e.target.value))}
                      className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">{t('auth.label_plan')}</label>
                  <select 
                    value={tier}
                    onChange={(e) => setTier(e.target.value as SubscriptionTier)}
                    className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-505"
                  >
                    <option value="free">{t('auth.option_free')}</option>
                    <option value="pro">{t('auth.option_pro')}</option>
                    <option value="premium">{t('auth.option_premium')}</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-650 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15"
            >
              {tab === 'login' ? t('auth.btn_login') : t('auth.btn_signup')} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo User Section */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <span className="block text-center text-slate-500 text-[10px] uppercase tracking-widest font-mono mb-3">
              {t('auth.quick_title')}
            </span>
            <div className="space-y-2">
              <button 
                type="button"
                onClick={() => handleQuickLogin('russelblackstorm116@gmail.com', 'pro', 5000)}
                className="w-full p-2 bg-slate-950 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono flex justify-between items-center border border-slate-800/80 hover:border-indigo-500/30 rounded-lg transition-all"
              >
                <span>Russel (Primary Owner)</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[9px] font-bold text-indigo-300">PRO MEMBERSHIP</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('guest_maker@nexora.com', 'free', 2000)}
                className="w-full p-2 bg-slate-950 text-[11px] text-teal-400 hover:text-teal-300 font-mono flex justify-between items-center border border-slate-800/80 hover:border-teal-500/30 rounded-lg transition-all"
              >
                <span>Guest Maker</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-slate-400">FREE PLAN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
