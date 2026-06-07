import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  FileText, 
  Radio, 
  Trash2, 
  Cpu, 
  Percent, 
  CheckCircle, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { UserSession, SavedChat, SavedPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  session: UserSession;
  savedPlans: SavedPlan[];
  onDeletePlan: (planId: string) => void;
  adsenseEnabled: boolean;
  onNavigateToTab: (tab: 'guides' | 'chat') => void;
  onUpdateTargetGoal: (newGoal: number) => void;
}

export default function Dashboard({
  session,
  savedPlans,
  onDeletePlan,
  adsenseEnabled,
  onNavigateToTab,
  onUpdateTargetGoal
}: DashboardProps) {
  const { t, language } = useLanguage();
  const [goalInput, setGoalInput] = useState<number>(session.targetMonthlyGoal || 3000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [broadcast, setBroadcast] = useState('');

  useEffect(() => {
    // Read announcements from local storage
    const storedBroadcast = localStorage.getItem('nexora_broadcast');
    if (storedBroadcast) {
      setBroadcast(storedBroadcast);
    } else {
      setBroadcast('');
    }
  }, [savedPlans]); // re-render when plans update to check storage

  // Dynamic Real Google AdSense script integration
  useEffect(() => {
    if (!adsenseEnabled) return;

    const pubId = localStorage.getItem('nexora_adsense_pub_id') || 'ca-pub-5340486277299258';
    
    // Check if script already exists to avoid duplication
    const existingScript = document.getElementById('adsense-real-script') as HTMLScriptElement;
    if (existingScript) {
      if (existingScript.src.includes(`client=${pubId}`)) {
        return; // script with correct ID is already running
      } else {
        existingScript.remove(); // remove stale script
      }
    }

    const script = document.createElement('script');
    script.id = 'adsense-real-script';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Try executing AdSense layout push call in a delayed loop safely
    const pushTimer = setTimeout(() => {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // Safe catch for environment restrictions or adblock devices
        console.warn('AdSense push failed (expected in sandbox/local preview):', e);
      }
    }, 1000);

    return () => {
      clearTimeout(pushTimer);
    };
  }, [adsenseEnabled]);

  // Calculate active totals
  const totalProjected = savedPlans.reduce((acc, p) => acc + p.monthlyRevenueEst, 0);
  const percentOfGoal = Math.round((totalProjected / (session.targetMonthlyGoal || 3000)) * 100);

  const handleSaveGoal = () => {
    if (goalInput < 500) return;
    onUpdateTargetGoal(goalInput);
    setIsEditingGoal(false);
  };

  return (
    <div className="text-gray-100 font-sans pb-12 select-none space-y-8">
      
      {/* Sitewide active alert */}
      {broadcast && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-indigo-600/10 to-transparent border border-indigo-500/15 text-indigo-400 text-xs flex items-start gap-3 relative animate-pulse">
          <Radio className="w-5 h-5 flex-shrink-0 text-indigo-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[9px] block">SYSTEM ADVISORY ALERT</span>
            <p className="text-slate-200">{broadcast}</p>
          </div>
        </div>
      )}

      {/* Target Progress Card Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Progress Dial Stats */}
        <div className="lg:col-span-5 bg-[#111319]/90 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                {language === 'fr' ? 'Progression des revenus' : 'Total revenue progress'}
              </span>
              <Target className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="text-4xl md:text-5xl font-bold font-sans text-white flex items-baseline gap-1">
              ${totalProjected.toLocaleString()}
              <span className="text-xs text-slate-500 font-normal">/ mo</span>
            </div>

            {/* Target Settings */}
            <div className="pt-2">
              {isEditingGoal ? (
                <div className="flex gap-2">
                  <input 
                    type="number"
                    min={500}
                    max={100000}
                    value={goalInput}
                    onChange={(e) => setGoalInput(Number(e.target.value))}
                    className="bg-slate-950 text-white text-xs px-3 py-1.5 border border-white/5 rounded font-mono w-28 focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    onClick={handleSaveGoal}
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase cursor-pointer"
                  >
                    {language === 'fr' ? 'Enregistrer' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsEditingGoal(false)}
                    className="text-slate-400 text-xs hover:text-white"
                  >
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>{t('dash.metric.target')}: <strong className="text-slate-200">${session.targetMonthlyGoal.toLocaleString()}</strong></span>
                  <button 
                    onClick={() => setIsEditingGoal(true)}
                    className="text-indigo-455 hover:text-indigo-300 text-[10px] bg-indigo-500/5 px-2.5 py-1 rounded border border-indigo-550/10 cursor-pointer"
                  >
                    {language === 'fr' ? 'Modifier' : 'Edit Goal'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{t('dash.metric.coverage')}</span>
              <span className="text-indigo-400 font-bold">{percentOfGoal}% {language === 'fr' ? 'atteint' : 'achieved'}</span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-950 border border-white/5 overflow-hidden">
              <div 
                style={{ width: `${Math.min(percentOfGoal, 100)}%` }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
              />
            </div>

            <p className="text-[10px] text-slate-500 font-mono italic">
              {percentOfGoal >= 100 
                ? (language === 'fr' ? 'Excellent ! Vos simulations de canaux cumulées dépassent vos objectifs.' : 'Excellent! Your combined active channel worksheets exceed your targets.')
                : (language === 'fr' ? 'Simulez et configurez d’autres plans pour combler l’écart avec votre objectif.' : 'Develop and parameterize additional platform blueprints to close your goal discrepancy.')}
            </p>
          </div>
        </div>

        {/* Dynamic Vector visual bar showing channel share */}
        <div className="lg:col-span-7 bg-[#111319]/90 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> {language === 'fr' ? 'Répartition des sources de revenus' : 'Income source breakdown'}
            </h3>
            <p className="text-slate-400 text-xs">
              {language === 'fr' ? 'Un rapport visuel des projections de revenus segmentées par feuilles actives.' : 'A visual report of revenue projections segmented across active sheets.'}
            </p>
          </div>

          <div className="my-6 space-y-3.5">
            {savedPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 font-mono">{language === 'fr' ? 'Aucune simulation pour le moment.' : 'No active sheets saved yet.'}</p>
                <button
                  onClick={() => onNavigateToTab('guides')}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-350 flex items-center gap-1 mx-auto mt-2 cursor-pointer bg-indigo-500/5 px-3 py-1.5 border border-indigo-500/20 rounded-lg whitespace-nowrap"
                >
                  {language === 'fr' ? 'Configurer l\'espace des guides' : 'Configure guides workspace'} <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              savedPlans.map((plan) => {
                const fraction = totalProjected > 0 ? (plan.monthlyRevenueEst / totalProjected) * 100 : 0;
                return (
                  <div key={plan.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span className="text-slate-200 capitalize font-medium">{plan.channelId.replace('_', ' ')} strategy</span>
                      <span>${plan.monthlyRevenueEst.toLocaleString()} ({Math.round(fraction)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-950 overflow-hidden border border-white/5">
                      <div 
                        style={{ width: `${fraction}%` }}
                        className="h-full rounded bg-indigo-600/85"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-500 flex justify-between">
            <span>{language === 'fr' ? 'Statut membre' : 'License status'}: <strong className="text-indigo-400 uppercase font-sans font-bold">{session.subscription} member</strong></span>
            <span>{language === 'fr' ? 'Revenu passif annuel' : 'Est. passive annualized'}: ${Math.round(totalProjected * 12).toLocaleString()} / yr</span>
          </div>
        </div>

      </div>

      {/* Active Worksheets & AdSense Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* List of saved blueprints / worksheets */}
        <div className="lg:col-span-8 bg-[#111319]/90 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" /> {t('dash.blueprints.title')} ({savedPlans.length})
            </h3>
            <button
              onClick={() => onNavigateToTab('guides')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-full text-xs flex items-center gap-1 text-center font-sans tracking-wide shadow-md transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Nouveau canal' : 'Configure new channel'} <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedPlans.length === 0 ? (
            <div className="text-center py-16 bg-[#0D0F14]/40 border border-white/5 rounded-xl">
              <Coins className="w-10 h-10 text-slate-650 mx-auto mb-3 animate-bounce" />
              <p className="text-sm font-semibold text-white">{t('dash.blueprints.empty1')}</p>
              <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                {t('dash.blueprints.empty2')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className="p-5 bg-[#0D0F14] border border-white/5 rounded-xl space-y-4 hover:border-white/10 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                        {plan.channelId.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        className="text-slate-550 hover:text-rose-455 transition-colors bg-transparent border-0 cursor-pointer"
                        title={language === 'fr' ? 'Supprimer' : 'Remove worksheet'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-white font-sans pt-1">{plan.title}</h4>
                    <p className="text-slate-500 text-[10px] font-mono">{language === 'fr' ? 'Simulé selon les constantes CPM' : 'Simulated on CPM constants'}</p>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">{language === 'fr' ? 'Projection Mensuelle' : 'Monthly Projection'}:</span>
                    <span className="text-white font-bold">${plan.monthlyRevenueEst.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic AdSense Simulator placeholder side layout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-indigo-400" /> {language === 'fr' ? 'Google AdSense Actif' : 'Google AdSense Live'}
            </h3>
            
            <p className="text-slate-400 text-[11.5px] leading-relaxed mb-4 font-sans">
              {language === 'fr' 
               ? 'Votre intégration Google AdSense est active et configurée de manière dynamique à l’aide de vos identifiants réels.' 
               : 'Your Google AdSense integration is live and dynamically populated using your target production credentials.'}
            </p>

            {adsenseEnabled ? (
              <div className="p-4 rounded-xl border border-dashed border-emerald-500/30 bg-slate-950 text-center relative overflow-hidden select-text space-y-3">
                <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
                  <span className="font-extrabold uppercase tracking-widest">REAL ADSENSE LIVE</span>
                  <span className="opacity-75">{localStorage.getItem('nexora_adsense_pub_id') || 'ca-pub-5340486277299258'}</span>
                </div>
                
                {/* Genuine AdSense element tag required to fetch live inventory */}
                <div className="w-full bg-[#0D0F14] rounded-lg p-2 overflow-hidden flex items-center justify-center min-h-[100px] border border-white/5 relative">
                  <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', minHeight: '100px' }}
                    data-ad-client={localStorage.getItem('nexora_adsense_pub_id') || 'ca-pub-5340486277299258'}
                    data-ad-slot={localStorage.getItem('nexora_adsense_slot_id') || '1234567890'}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-slate-950/40 p-3">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      {language === 'fr' ? 'Bannière Google AdSense Active' : 'Google AdSense Unit Active'}
                    </span>
                    <span className="text-[8px] font-mono text-slate-505 mt-1 block">
                      Slot: {localStorage.getItem('nexora_adsense_slot_id') || '1234567890'}
                    </span>
                  </div>
                </div>

                <p className="text-slate-450 text-[10px] font-mono leading-relaxed text-left leading-normal">
                  {language === 'fr' 
                    ? 'Le tag officiel a été injecté dans l’en-tête de page. Les bannières publicitaires s’afficheront en production.'
                    : 'The official AdSense script is injected in the document head. Ad banners dynamically request custom slot inventories.'}
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-white/5 bg-slate-950 text-center text-slate-505 text-[11px]">
                <p>{language === 'fr' ? 'Mode Google AdSense inactif.' : 'Google AdSense mode currently inactive.'}</p>
                <p className="text-[10px] mt-1 text-slate-600">{language === 'fr' ? 'Activez-le via l’onglet Administration en haut de la page.' : 'Enable via our dedicated Admin tools tab at top of screen.'}</p>
              </div>
            )}
          </div>

          <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6 text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">{language === 'fr' ? 'Besoin d’Affiner la Stratégie ?' : 'Need Strategic Refinement?'}</h3>
            <p className="text-slate-400 text-xs">{language === 'fr' ? 'Soumettez vos feuilles de calcul directement à Nexora IA pour obtenir des audits d’expert.' : 'Submit active worksheet parameters directly to Nexora AI for comprehensive audits.'}</p>
            <button
              onClick={() => onNavigateToTab('chat')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-md text-center inline-block"
            >
              {language === 'fr' ? 'Ouvrir le Conseiller IA' : 'Open AI Advisor'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
