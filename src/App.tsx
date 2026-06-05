import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  User, 
  LogOut, 
  Settings, 
  MessageSquare, 
  LayoutDashboard, 
  Compass, 
  ShieldCheck, 
  CheckCircle,
  Menu,
  X,
  Target,
  Mail
} from 'lucide-react';
import { SubscriptionTier, UserSession, SavedChat, SavedPlan } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import GuidesList from './components/GuidesList';
import AdvisorChat from './components/AdvisorChat';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import PayPalAirtelCheckout from './components/PayPalAirtelCheckout';
import GmailManager from './components/GmailManager';
import { useLanguage } from './context/LanguageContext';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  // Navigation & Sessions
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'guides' | 'chat' | 'admin' | 'gmail'>('landing');
  const [session, setSession] = useState<UserSession | null>(null);
  
  // Modals Toggles
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login');
  const [stripeUpgradePlan, setStripeUpgradePlan] = useState<SubscriptionTier | null>(null);

  // Core database replicas
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  
  // Global settings
  const [adsenseEnabled, setAdsenseEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Recover active user session from localStorage initially
    const storedSession = localStorage.getItem('nexora_user_session');
    if (storedSession) {
      const parsedSession: UserSession = JSON.parse(storedSession);
      setSession(parsedSession);
      setActiveTab('dashboard'); 
    }

    // Load worksheets from local storage
    const storedPlans = localStorage.getItem('nexora_saved_plans');
    if (storedPlans) {
      setSavedPlans(JSON.parse(storedPlans));
    } else {
      const starterPlans: SavedPlan[] = [
        {
          id: 'plan_starter_yt',
          channelId: 'youtube',
          title: 'Primary Tech Reviews Goal',
          monthlyRevenueEst: 450,
          parameters: { primaryMetric: 100000, secondaryMetric: 0, targetGoal: 3000 },
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('nexora_saved_plans', JSON.stringify(starterPlans));
      setSavedPlans(starterPlans);
    }

    // Load chat threads initially
    const storedChats = localStorage.getItem('nexora_saved_chats');
    if (storedChats) {
      setSavedChats(JSON.parse(storedChats));
    }

    // 2. Setup dynamic Firebase auth sync listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          let syncedSession: UserSession;

          if (userSnap.exists()) {
            syncedSession = {
              ...(userSnap.data() as UserSession),
              uid: firebaseUser.uid,
              email: firebaseUser.email || (userSnap.data() as UserSession).email
            };
          } else {
            const nickname = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Maker';
            syncedSession = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || 'developer@nexora.com',
              displayName: nickname,
              subscription: 'free',
              targetMonthlyGoal: 3000,
              joinedAt: new Date().toISOString()
            };
            await setDoc(userRef, syncedSession);
          }

          setSession(syncedSession);
          localStorage.setItem('nexora_user_session', JSON.stringify(syncedSession));

          // Fetch Plans sub-collection from Cloud Firestore
          const plansPath = `users/${firebaseUser.uid}/plans`;
          const plansSnap = await getDocs(collection(db, plansPath));
          const dbPlans: SavedPlan[] = [];
          plansSnap.forEach((docSnap) => {
            dbPlans.push(docSnap.data() as SavedPlan);
          });

          if (dbPlans.length > 0) {
            setSavedPlans(dbPlans);
            localStorage.setItem('nexora_saved_plans', JSON.stringify(dbPlans));
          } else {
            const localPlans = JSON.parse(localStorage.getItem('nexora_saved_plans') || '[]');
            if (localPlans.length > 0) {
              for (const plan of localPlans) {
                await setDoc(doc(db, plansPath, plan.id), plan);
              }
            }
          }

          // Fetch Conversations sub-collection
          const chatsPath = `users/${firebaseUser.uid}/chats`;
          const chatsSnap = await getDocs(collection(db, chatsPath));
          const dbChats: SavedChat[] = [];
          chatsSnap.forEach((docSnap) => {
            dbChats.push(docSnap.data() as SavedChat);
          });

          if (dbChats.length > 0) {
            setSavedChats(dbChats);
            localStorage.setItem('nexora_saved_chats', JSON.stringify(dbChats));
          } else {
            const localChats = JSON.parse(localStorage.getItem('nexora_saved_chats') || '[]');
            if (localChats.length > 0) {
              for (const chat of localChats) {
                await setDoc(doc(db, chatsPath, chat.id), chat);
              }
            }
          }

          setActiveTab('dashboard');
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Update target monthly income goal
  const handleUpdateTargetGoal = async (newGoal: number) => {
    if (!session) return;
    const updated = { ...session, targetMonthlyGoal: newGoal };
    setSession(updated);
    localStorage.setItem('nexora_user_session', JSON.stringify(updated));

    if (auth.currentUser) {
      const userDocPath = `users/${auth.currentUser.uid}`;
      try {
        await setDoc(doc(db, userDocPath), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, userDocPath);
      }
    }
  };

  // Add monetization plan worksheet
  const handleSavePlan = async (plan: Omit<SavedPlan, 'id' | 'createdAt'>) => {
    const newPlanState: SavedPlan = {
      ...plan,
      id: `plan_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...savedPlans, newPlanState];
    setSavedPlans(updated);
    localStorage.setItem('nexora_saved_plans', JSON.stringify(updated));

    if (auth.currentUser) {
      const plansPath = `users/${auth.currentUser.uid}/plans`;
      try {
        await setDoc(doc(db, plansPath, newPlanState.id), newPlanState);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `${plansPath}/${newPlanState.id}`);
      }
    }
  };

  // Delete monetization plan
  const handleDeletePlan = async (planId: string) => {
    const updated = savedPlans.filter(p => p.id !== planId);
    setSavedPlans(updated);
    localStorage.setItem('nexora_saved_plans', JSON.stringify(updated));

    if (auth.currentUser) {
      const planDocPath = `users/${auth.currentUser.uid}/plans/${planId}`;
      try {
        await deleteDoc(doc(db, planDocPath));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, planDocPath);
      }
    }
  };

  // Chat actions
  const handleSaveChatThread = async (thread: SavedChat) => {
    // Upsert chat
    const exists = savedChats.findIndex(c => c.id === thread.id);
    let updated: SavedChat[];
    if (exists >= 0) {
      updated = [...savedChats];
      updated[exists] = thread;
    } else {
      updated = [thread, ...savedChats];
    }
    setSavedChats(updated);
    setActiveChatId(thread.id);
    localStorage.setItem('nexora_saved_chats', JSON.stringify(updated));

    if (auth.currentUser) {
      const chatDocPath = `users/${auth.currentUser.uid}/chats/${thread.id}`;
      try {
        await setDoc(doc(db, chatDocPath), thread);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, chatDocPath);
      }
    }
  };

  const handleSelectSavedChat = (chat: SavedChat) => {
    setActiveChatId(chat.id);
    setActiveMessages(chat.messages);
  };

  // Subscription plan selection flow
  const handleSelectPlanTier = async (tier: SubscriptionTier) => {
    if (tier === 'free') {
      // Basic Free plan simulation is instant
      if (session) {
        const updated = { ...session, subscription: 'free' as SubscriptionTier };
        setSession(updated);
        localStorage.setItem('nexora_user_session', JSON.stringify(updated));

        if (auth.currentUser) {
          try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), updated);
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
          }
        }
      } else {
        setAuthInitialTab('signup');
        setShowAuthModal(true);
      }
      return;
    }

    // If session is empty, guide to authentication first, setting target upgrade
    if (!session) {
      setAuthInitialTab('signup');
      setShowAuthModal(true);
      return;
    }

    // Direct redirection to our secure Stripe checkout simulation
    setStripeUpgradePlan(tier);
  };

  const handleStripeSuccess = async (updatedSession: UserSession) => {
    setSession(updatedSession);
    setStripeUpgradePlan(null);
    setActiveTab('dashboard');

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), updatedSession);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const handleAuthSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    localStorage.removeItem('nexora_user_session');
    localStorage.removeItem('nexora_saved_plans');
    localStorage.removeItem('nexora_saved_chats');
    setSession(null);
    setSavedPlans([]);
    setSavedChats([]);
    setActiveTab('landing');
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isUserAdmin = () => {
    if (!session) return false;
    // Russel or specific emails automatically receive administrative privileges
    return [
      'russelblackstorm116@gmail.com',
      'russellblackstorm116@gmail.com',
      'developer@nexora.com',
      'admin@nexora.com'
    ].includes(session.email.toLowerCase());
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between">
      
      {/* PayPal & Airtel Money Automated Checkout Blocker Overlay */}
      {stripeUpgradePlan && session && (
        <PayPalAirtelCheckout 
          planId={stripeUpgradePlan}
          email={session.email}
          onSuccess={handleStripeSuccess}
          onCancel={() => setStripeUpgradePlan(null)}
        />
      )}

      {!stripeUpgradePlan && (
        <>
          {/* Header Navigation Bar */}
          <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                
                {/* Brand Logo */}
                <div 
                  onClick={() => setActiveTab(session ? 'dashboard' : 'landing')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20 font-sans">
                    N
                  </div>
                  <div>
                    <span className="text-lg font-bold tracking-tight text-white block">
                      Nexora <span className="text-indigo-400">Monetize</span>
                    </span>
                  </div>
                </div>

                {/* Desktop Menu links */}
                {session ? (
                  <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-mono">
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all border border-transparent hover:text-white cursor-pointer ${
                        activeTab === 'dashboard' ? 'text-indigo-400 bg-indigo-505/10 border-indigo-500/20 font-bold' : ''
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" /> {t('nav.tab.dashboard')}
                    </button>
                    <button 
                      onClick={() => setActiveTab('guides')}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all border border-transparent hover:text-white cursor-pointer ${
                        activeTab === 'guides' ? 'text-indigo-400 bg-indigo-505/10 border-indigo-500/20 font-bold' : ''
                      }`}
                    >
                      <Compass className="w-4 h-4" /> {t('nav.tab.guides')}
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all border border-transparent hover:text-white cursor-pointer ${
                        activeTab === 'chat' ? 'text-indigo-400 bg-indigo-505/10 border-indigo-500/20 font-bold' : ''
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" /> {t('nav.tab.chat')}
                    </button>
                    <button 
                      onClick={() => setActiveTab('gmail')}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all border border-transparent hover:text-white cursor-pointer ${
                        activeTab === 'gmail' ? 'text-indigo-400 bg-indigo-505/10 border-indigo-500/20 font-bold' : ''
                      }`}
                    >
                      <Mail className="w-4.5 h-4.5" /> Gmail Outreach
                    </button>
                    
                    {isUserAdmin() && (
                      <button 
                      onClick={() => setActiveTab('admin')}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all border border-transparent hover:text-white cursor-pointer ${
                        activeTab === 'admin' ? 'text-amber-400 bg-amber-500/5 border-amber-500/10 font-bold' : ''
                      }`}
                    >
                      <ShieldCheck className="w-4.5 h-4.5" /> {t('nav.tab.admin')}
                    </button>
                    )}
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400 font-sans">
                    <button 
                      onClick={() => setActiveTab('landing')}
                      className={`text-slate-400 hover:text-white transition-colors cursor-pointer`}
                    >
                      {t('nav.tab.dashboard')}
                    </button>
                    <span className="text-slate-400">{t('nav.tab.guides')}</span>
                    <span className="text-slate-400">{t('landing.pricing.title').substring(0, 10)}</span>
                  </div>
                )}

                {/* Profile panel / Actions right */}
                <div className="hidden md:flex items-center gap-4">
                  
                  {/* Premium Language Switcher */}
                  <div className="flex items-center bg-[#111319] p-1 rounded-xl border border-white/5 text-[10px] font-mono leading-none">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                        language === 'en' ? 'bg-indigo-650 text-white font-extrabold' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                        language === 'fr' ? 'bg-indigo-650 text-white font-extrabold' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      FR
                    </button>
                  </div>

                  {session ? (
                    <div className="flex items-center gap-3 bg-[#111319] p-1.5 pr-4 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-[11px] font-sans leading-tight">
                        <div className="text-white font-bold max-w-[110px] truncate">{session.displayName || 'Maker'}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded block mt-0.5 w-max ${
                          session.subscription === 'free' ? 'bg-[#1A1C23] text-slate-400 border border-white/5' :
                          session.subscription === 'pro' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' :
                          'bg-indigo-600/10 text-indigo-400'
                        }`}>
                          {session.subscription.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="border-l border-white/5 h-6 mx-1"></div>

                      <button 
                        onClick={handleLogout}
                        className="text-slate-500 hover:text-rose-455 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                        title={t('nav.action.logout')}
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => { setAuthInitialTab('login'); setShowAuthModal(true); }}
                        className="text-sm font-medium text-slate-350 hover:text-white transition-colors cursor-pointer"
                      >
                        {t('auth.login')}
                      </button>
                      <button 
                        onClick={() => { setAuthInitialTab('signup'); setShowAuthModal(true); }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                      >
                        {t('nav.action.start')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Hamburger toggle */}
                <div className="md:hidden flex items-center">
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-slate-450 hover:text-white p-2"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>

              </div>
            </div>

            {/* Mobile Expand Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-slate-950 border-b border-slate-900 p-4 space-y-3 font-mono text-xs select-none">
                
                {/* Language Toggles in Mobile Panel */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Language / Langue</span>
                  <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/5 text-[9px] font-mono leading-none">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                        language === 'en' ? 'bg-indigo-650 text-white font-extrabold' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                        language === 'fr' ? 'bg-indigo-650 text-white font-extrabold' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      FR
                    </button>
                  </div>
                </div>

                {session ? (
                  <>
                    <button 
                      onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                      className="w-full text-left p-2.5 rounded bg-slate-900 hover:bg-slate-850"
                    >
                      {t('nav.tab.dashboard')}
                    </button>
                    <button 
                      onClick={() => { setActiveTab('guides'); setMobileMenuOpen(false); }}
                      className="w-full text-left p-2.5 rounded bg-slate-900 hover:bg-slate-850"
                    >
                      {t('nav.tab.guides')}
                    </button>
                    <button 
                      onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                      className="w-full text-left p-2.5 rounded bg-slate-900 hover:bg-slate-850"
                    >
                      {t('nav.tab.chat')}
                    </button>
                    <button 
                      onClick={() => { setActiveTab('gmail'); setMobileMenuOpen(false); }}
                      className="w-full text-left p-2.5 rounded bg-slate-900 hover:bg-slate-850"
                    >
                      Gmail Outreach
                    </button>
                    {isUserAdmin() && (
                      <button 
                        onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-2.5 rounded bg-slate-900 text-amber-500"
                      >
                        {t('nav.tab.admin')}
                      </button>
                    )}
                    
                    <div className="border-t border-slate-900 pt-3">
                      <div className="flex items-center justify-between text-slate-400 p-2 text-[10px]">
                        <span>{t('nav.action.signed_in_as')}: <strong className="text-white font-sans font-bold">{session.displayName}</strong></span>
                        <span className="uppercase text-indigo-400 font-bold">{session.subscription}</span>
                      </div>
                      <button 
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="w-full text-center py-2 bg-rose-500/10 text-rose-450 font-bold rounded"
                      >
                        {t('nav.action.disconnect')}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
                      className="w-full text-left p-2.5 bg-slate-900 text-slate-350"
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => { setAuthInitialTab('login'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                      className="w-full text-center py-2 rounded bg-slate-900 text-slate-300 font-bold"
                    >
                      {t('auth.login')}
                    </button>
                    <button 
                      onClick={() => { setAuthInitialTab('signup'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                      className="w-full text-center py-2 rounded bg-indigo-600 text-white font-semibold"
                    >
                      {t('nav.action.start')}
                    </button>
                  </>
                )}
              </div>
            )}
          </nav>

          {/* Main Content Router block */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            
            {activeTab === 'landing' && (
              <LandingPage 
                onGetStarted={() => {
                  if (session) {
                    setActiveTab('dashboard');
                  } else {
                    setAuthInitialTab('signup');
                    setShowAuthModal(true);
                  }
                }}
                onSelectPlan={handleSelectPlanTier}
                onLoginClick={() => { setAuthInitialTab('login'); setShowAuthModal(true); }}
                isAuthenticated={!!session}
              />
            )}

            {activeTab === 'dashboard' && session && (
              <Dashboard 
                session={session}
                savedPlans={savedPlans}
                onDeletePlan={handleDeletePlan}
                adsenseEnabled={adsenseEnabled}
                onNavigateToTab={(tabName) => setActiveTab(tabName)}
                onUpdateTargetGoal={handleUpdateTargetGoal}
              />
            )}

            {activeTab === 'guides' && session && (
              <GuidesList 
                subscription={session.subscription}
                monthlyGoal={session.targetMonthlyGoal || 3000}
                onSavePlan={handleSavePlan}
                onUnlockRequest={() => handleSelectPlanTier('pro')}
              />
            )}

            {activeTab === 'chat' && session && (
              <AdvisorChat 
                subscription={session.subscription}
                savedChats={savedChats}
                onSaveChatThread={handleSaveChatThread}
                onSelectSavedChat={handleSelectSavedChat}
                activeChatId={activeChatId}
                activeMessages={activeMessages}
                setActiveMessages={setActiveMessages}
              />
            )}

            {activeTab === 'gmail' && session && (
              <GmailManager />
            )}

            {activeTab === 'admin' && session && isUserAdmin() && (
              <AdminPanel 
                adsenseEnabled={adsenseEnabled}
                onToggleAdSense={(enabled) => setAdsenseEnabled(enabled)}
              />
            )}

          </main>

          {/* Sticky footer credits */}
          <footer className="border-t border-slate-900/80 bg-slate-950 py-6 text-center text-slate-600 text-xs select-none">
            <p>{t('footer.copyright')}</p>
          </footer>
        </>
      )}

      {/* Auth Gateway overlay */}
      {showAuthModal && (
        <AuthModal 
          initialTab={authInitialTab}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
