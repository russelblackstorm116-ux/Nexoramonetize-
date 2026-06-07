import React, { useState } from 'react';
import { 
  ArrowRight, 
  Coins, 
  TrendingUp, 
  MessageSquare, 
  Shield, 
  Play, 
  Youtube, 
  Music2, 
  Volume2, 
  Film, 
  BookOpen, 
  Sparkles, 
  CheckCircle2,
  DollarSign,
  Download
} from 'lucide-react';
import { SubscriptionTier } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onSelectPlan: (tier: SubscriptionTier) => void;
  onLoginClick: () => void;
  isAuthenticated: boolean;
}

export default function LandingPage({ 
  onGetStarted, 
  onSelectPlan, 
  onLoginClick,
  isAuthenticated 
}: LandingPageProps) {
  const { t, language } = useLanguage();
  const [calculatorChannel, setCalculatorChannel] = useState<'youtube' | 'tiktok' | 'blogging'>('youtube');
  const [calcMetrics, setCalcMetrics] = useState<number>(100000); // views/pageviews
  const [showItchKit, setShowItchKit] = useState(false);

  // Quick estimator formula
  const getEstimatedRevenue = () => {
    switch(calculatorChannel) {
      case 'youtube':
        return Math.round((calcMetrics / 1000) * 4.5);
      case 'tiktok':
        return Math.round((calcMetrics / 1000) * 0.7);
      case 'blogging':
        return Math.round((calcMetrics / 1000) * 22);
      default:
        return 0;
    }
  };

  return (
    <div className="text-gray-105 min-h-screen bg-[#0A0B0E] font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse">
            <Coins className="w-3.5 h-3.5" /> {t('landing.hero.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-extrabold text-white leading-tight tracking-tight mb-4">
            {t('landing.hero.title1')}<br />{t('landing.hero.title2')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              {t('landing.hero.title3')}
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-405 mt-6 mb-10 leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer text-sm"
              >
                {t('landing.hero.dashboard_btn')} <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer text-sm"
                >
                  {t('landing.hero.start_btn')} <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 border border-white/5 hover:bg-slate-850 hover:border-white/10 font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer text-sm text-slate-300"
                >
                  {t('landing.hero.signin_btn')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Absolute Background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-555/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Instant Income Estimator Widget */}
      <section className="py-12 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#111319]/80 border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative">
            <div className="absolute -top-3 left-6 px-3 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider">
              {t('landing.calc.badge')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-2">
              <div>
                <h3 className="text-xl font-bold font-sans text-white mb-2">{t('landing.calc.title')}</h3>
                <p className="text-slate-400 text-xs mb-6">{t('landing.calc.subtitle')}</p>
                
                {/* Channel Selectors */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button 
                    onClick={() => { setCalculatorChannel('youtube'); setCalcMetrics(150000); }}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      calculatorChannel === 'youtube' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-gray-200'
                    }`}
                  >
                    <Youtube className="w-5 h-5" />
                    <span className="text-[10px] font-bold">YouTube</span>
                  </button>
                  <button 
                    onClick={() => { setCalculatorChannel('tiktok'); setCalcMetrics(450000); }}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      calculatorChannel === 'tiktok' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-gray-200'
                    }`}
                  >
                    <Music2 className="w-5 h-5" />
                    <span className="text-[10px] font-bold">TikTok</span>
                  </button>
                  <button 
                    onClick={() => { setCalculatorChannel('blogging'); setCalcMetrics(50500); }}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      calculatorChannel === 'blogging' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-gray-200'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Blogging</span>
                  </button>
                </div>

                {/* Range Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>{t('landing.calc.traffic')}</span>
                    <span className="text-indigo-400 font-bold">{calcMetrics.toLocaleString()} / mo</span>
                  </div>
                  <input 
                    type="range"
                    min={5000}
                    max={1000000}
                    step={5000}
                    value={calcMetrics}
                    onChange={(e) => setCalcMetrics(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>5K</span>
                    <span>500K</span>
                    <span>1M+</span>
                  </div>
                </div>
              </div>

              {/* Estimate Results display */}
              <div className="bg-[#0D0F14] border border-white/5 rounded-xl p-6 text-center flex flex-col justify-center items-center">
                <span className="text-slate-400 text-xs uppercase tracking-widest font-mono">{t('landing.calc.estimate')}</span>
                <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 mt-2 font-mono">
                  ${getEstimatedRevenue().toLocaleString()}
                </span>
                <span className="text-slate-505 text-[10px] font-mono mt-1">{t('landing.calc.rpm_note')}</span>
                
                <div className="w-full border-t border-white/5 my-4"></div>
                
                <button 
                  onClick={onGetStarted}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors cursor-pointer"
                >
                  {t('landing.calc.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
            {t('landing.feature.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-[#14171D] border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans mb-2">{t('landing.feature.p3_title')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('landing.feature.p3_desc')}
            </p>
          </div>
          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-[#14171D] border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans mb-2">{t('landing.feature.p1_title')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('landing.feature.p1_desc')}
            </p>
          </div>
          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-[#14171D] border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans mb-2">{t('landing.feature.p2_title')}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('landing.feature.p2_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Matrix */}
      <section className="py-20 bg-slate-950/40 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-xs">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="rounded-2xl border border-white/5 bg-[#111319] p-8 flex flex-col justify-between transition-all hover:border-white/10">
              <div>
                <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-widest font-mono">{t('landing.pricing.free.name')}</span>
                <p className="text-slate-400 text-xs mt-1">{t('landing.pricing.free.desc')}</p>
                <div className="flex items-baseline text-white mt-6 mb-8 font-sans">
                  <span className="text-5xl font-extrabold">$0</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <div className="border-t border-white/5 my-4"></div>
                <ul className="space-y-3.5 text-xs text-slate-350">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.free.opt1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.free.opt2')}</li>
                  <li className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-indigo-500/20" /> {t('landing.pricing.free.opt3')}</li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('free')}
                className="w-full py-3 px-4 rounded-xl mt-8 bg-slate-900 hover:bg-slate-850 border border-white/5 text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
              >
                {t('landing.pricing.btn_upgrade')}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-indigo-500 bg-[#111319] p-8 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10 transition-all transform hover:-translate-y-1">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                RECOMMENDED BEST VALUE
              </div>
              <div>
                <span className="text-indigo-450 text-[10px] font-extrabold uppercase tracking-widest font-mono">{t('landing.pricing.pro.name')}</span>
                <p className="text-slate-400 text-xs mt-1">{t('landing.pricing.pro.desc')}</p>
                <div className="flex items-baseline text-white mt-6 mb-8 font-sans">
                  <span className="text-5xl font-extrabold text-indigo-300">$29</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <div className="border-t border-white/5 my-4"></div>
                <ul className="space-y-3.5 text-xs text-slate-350">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.pro.opt1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.pro.opt2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.pro.opt3')}</li>
                  <li className="flex items-center gap-2 text-slate-405"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.pro.opt4')}</li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('pro')}
                className="w-full py-3 px-4 rounded-xl mt-8 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all text-center shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {t('landing.pricing.btn_upgrade')}
              </button>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl border border-white/5 bg-[#111319] p-8 flex flex-col justify-between transition-all hover:border-white/10">
              <div>
                <span className="text-indigo-405 text-[10px] font-extrabold uppercase tracking-widest font-mono">{t('landing.pricing.premium.name')}</span>
                <p className="text-slate-400 text-xs mt-1">{t('landing.pricing.premium.desc')}</p>
                <div className="flex items-baseline text-white mt-6 mb-8 font-sans">
                  <span className="text-5xl font-extrabold">$79</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <div className="border-t border-white/5 my-4"></div>
                <ul className="space-y-3.5 text-xs text-slate-350">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.premium.opt1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.premium.opt2')}</li>
                  <li className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> {t('landing.pricing.premium.opt3')}</li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('premium')}
                className="w-full py-3 px-4 rounded-xl mt-8 bg-slate-900 border border-white/10 hover:bg-indigo-650 hover:border-indigo-500/20 text-slate-100 text-xs font-bold transition-all text-center cursor-pointer"
              >
                {t('landing.pricing.btn_upgrade')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#08090C] border-t border-white/5 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 md:flex justify-between items-center text-center md:text-left">
          <div>
            <div className="font-extrabold text-white text-base mb-2">
              Nexora <span className="text-indigo-400">Monetize</span>
            </div>
            <p className="max-w-md mx-auto md:mx-0 text-[11px] text-slate-550">
              {t('landing.hero.subtitle').substring(0, 110)}...
            </p>
          </div>
          <div className="mt-6 md:mt-0 font-mono text-[10px] space-y-1">
            <p>© 2026 Nexora Monetize Inc. All rights reserved.</p>
            <p>Stripe Payment & Google AdSense Integrated Presets.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
