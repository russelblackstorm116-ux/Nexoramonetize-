import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckSquare, 
  Square, 
  Flame, 
  Coins, 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  Youtube, 
  Music2, 
  Play, 
  Volume2, 
  Film, 
  BookOpen, 
  Hourglass, 
  FolderPlus,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { MONETIZATION_CHANNELS } from '../data/guides';
import { MonetizationChannel, SubscriptionTier, SavedPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GuidesListProps {
  subscription: SubscriptionTier;
  monthlyGoal: number;
  onSavePlan: (plan: Omit<SavedPlan, 'id' | 'createdAt'>) => void;
  onUnlockRequest: () => void;
}

export default function GuidesList({ subscription, monthlyGoal, onSavePlan, onUnlockRequest }: GuidesListProps) {
  const { t, translateChannel, language } = useLanguage();
  const [selectedChannelRaw, setSelectedChannelRaw] = useState<MonetizationChannel>(MONETIZATION_CHANNELS[0]);
  
  // Dynamically map selected channel structure using our context translator hook
  const selectedChannel = translateChannel(selectedChannelRaw);

  const [primaryMetricVal, setPrimaryMetricVal] = useState<number>(selectedChannel.metricDefault);
  const [secondaryMetricVal, setSecondaryMetricVal] = useState<number>(
    selectedChannel.secondaryMetrics?.[0]?.default || 0
  );
  
  // Requirement checked state
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Re-synchronize values when channels switch or language changes
  useEffect(() => {
    setPrimaryMetricVal(selectedChannelRaw.metricDefault);
    setSecondaryMetricVal(selectedChannelRaw.secondaryMetrics?.[0]?.default || 0);
    // Clear checklist for new channel
    setCheckedRequirements({});
    setSaveSuccess(false);
  }, [selectedChannelRaw]);

  // Is channel locked for free users?
  const isChannelLocked = (channelId: string) => {
    if (subscription !== 'free') return false;
    return !['youtube', 'tiktok'].includes(channelId);
  };

  // Dynamic earnings computer
  const calculateEstimatedEarnings = () => {
    const baseRevenue = (primaryMetricVal / 1000) * selectedChannel.rpmDefault;
    
    let secondaryRevenue = 0;
    if (selectedChannel.secondaryMetrics && selectedChannel.secondaryMetrics.length > 0) {
      secondaryRevenue = secondaryMetricVal;
    }

    if (selectedChannel.id === 'freelancing') {
      return (primaryMetricVal * selectedChannel.rpmDefault) + secondaryMetricVal;
    }

    return Math.round(baseRevenue + secondaryRevenue);
  };

  const estimatedEarnings = calculateEstimatedEarnings();
  const goalAchievedPercent = Math.round((estimatedEarnings / (monthlyGoal || 3000)) * 100);

  // Toggle checklist tasks
  const toggleRequirement = (reqText: string) => {
    setCheckedRequirements(prev => ({
      ...prev,
      [reqText]: !prev[reqText]
    }));
  };

  // Click handler to save plan to user's dashboard
  const handleSaveWorkspacePlan = () => {
    const newPlan: Omit<SavedPlan, 'id' | 'createdAt'> = {
      channelId: selectedChannel.id,
      title: language === 'fr' ? `Plan Stratégique ${selectedChannel.name}` : `${selectedChannel.name} Strategy Plan`,
      monthlyRevenueEst: estimatedEarnings,
      parameters: {
        primaryMetric: primaryMetricVal,
        secondaryMetric: secondaryMetricVal,
        targetGoal: monthlyGoal
      }
    };
    onSavePlan(newPlan);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube': return <Youtube className="w-5 h-5" />;
      case 'Music2': return <Music2 className="w-5 h-5" />;
      case 'Play': return <Play className="w-5 h-5" />;
      case 'Volume2': return <Volume2 className="w-5 h-5" />;
      case 'Film': return <Film className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Coins className="w-5 h-5" />;
    }
  };

  return (
    <div className="text-gray-100 font-sans pb-12 select-none">
      {/* Upper Navigation Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-8">
        {MONETIZATION_CHANNELS.map((ch) => {
          const transCh = translateChannel(ch);
          const locked = isChannelLocked(transCh.id);
          const active = selectedChannel.id === transCh.id;

          return (
            <button
              key={transCh.id}
              onClick={() => setSelectedChannelRaw(ch)}
              className={`p-3 rounded-xl flex flex-col items-center text-center gap-1.5 border transition-all relative cursor-pointer ${
                active 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-lg shadow-indigo-600/10' 
                  : 'bg-[#111319]/60 border-white/5 hover:border-white/10 text-slate-400'
              }`}
            >
              {locked && (
                <div className="absolute top-1 right-1 p-0.5 rounded bg-slate-950/80 text-amber-500">
                  <Lock className="w-3 h-3" />
                </div>
              )}
              {getIcon(ch.icon)}
              <span className="text-[10px] tracking-tight block truncate w-full">{transCh.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {selectedChannel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Overlay Lock for Premium Guides */}
          {isChannelLocked(selectedChannel.id) && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[5px] z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-550 flex items-center justify-center text-amber-500 mb-4 animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-sans">
                {language === 'fr' ? 'Guide Stratégique Verrouillé' : 'Bespoke Strategic Guide Gated'}
              </h3>
              <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed font-sans">
                {language === 'fr' 
                  ? `La feuille de calcul ${selectedChannel.name} de niveau Premium est réservée aux abonnés. Passez au niveau supérieur de test pour débloquer tous les canaux.`
                  : `The ${selectedChannel.name} worksheet is a Premium-tier blueprint. Upgrade to the Pro Plan now to unlock all channels.`}
              </p>
              <button 
                onClick={onUnlockRequest}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer font-sans"
              >
                {t('guides.sim.unlock')}
              </button>
            </div>
          )}

          {/* Left Column: Details & Checklists */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-550/15 text-indigo-400 text-[10px] font-bold uppercase tracking-widest font-mono mb-4">
                {language === 'fr' ? 'Blueprint Actif' : 'Active Blueprint'}
              </div>
              <h2 className="text-2xl font-bold text-white font-sans">{selectedChannel.name}</h2>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">{selectedChannel.tagline}</p>

              {/* Requirement Checklist Progress */}
              <div className="mt-8 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                    <CheckSquare className="w-4 h-4 text-indigo-400" /> {t('guides.sim.req')}
                  </h4>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded">
                    {Math.round(
                      (Object.values(checkedRequirements).filter(Boolean).length / 
                      selectedChannel.requirements.length) * 100
                    )}% {language === 'fr' ? 'Terminé' : 'Completed'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  {selectedChannel.requirements.map((req, i) => {
                    const isChecked = !!checkedRequirements[req];
                    return (
                      <div 
                        key={i}
                        onClick={() => toggleRequirement(req)}
                        className={`p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                          isChecked 
                            ? 'bg-[#14171D] border-indigo-500/30 text-slate-100' 
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10 text-slate-400'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="leading-relaxed font-sans">{req}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Strategic Action Roadmap */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 md:p-8">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> {t('guides.sim.strategies')}
              </h3>
              
              <div className="space-y-4 font-sans">
                {selectedChannel.strategies.map((strat, i) => (
                  <div key={i} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2 hover:border-slate-800 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white font-sans">{strat.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          strat.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          strat.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>{t('guides.sim.difficulty')}: {strat.difficulty}</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{t('guides.sim.tf')}: {strat.timeToFirstDollar}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">{strat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Earnings Worksheet */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-6 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-400" /> {t('guides.sim.title')}
              </h3>

              <div className="space-y-6 font-mono">
                
                {/* Metric Slider 1 */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>{selectedChannel.metricLabel}</span>
                    <span className="text-indigo-400 font-bold font-mono">
                      {selectedChannel.id === 'freelancing' 
                        ? `${primaryMetricVal.toLocaleString()} hrs` 
                        : primaryMetricVal.toLocaleString()}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min={selectedChannel.metricMin}
                    max={selectedChannel.metricMax}
                    step={selectedChannel.id === 'freelancing' ? 5 : 500}
                    value={primaryMetricVal}
                    onChange={(e) => setPrimaryMetricVal(Number(e.target.value))}
                    className="w-full h-1 bg-slate-955 rounded appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>{selectedChannel.metricMin.toLocaleString()}</span>
                    <span>{(selectedChannel.metricMax / 2).toLocaleString()}</span>
                    <span>{selectedChannel.metricMax.toLocaleString()}</span>
                  </div>
                </div>

                {/* Metric Slider 2 (Secondary values if present) */}
                {selectedChannel.secondaryMetrics && selectedChannel.secondaryMetrics.length > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                      <span>{selectedChannel.secondaryMetrics[0].name}</span>
                      <span className="text-indigo-404 font-bold font-mono">
                        ${secondaryMetricVal.toLocaleString()}
                      </span>
                    </div>
                    <input 
                      type="range"
                      min={selectedChannel.secondaryMetrics[0].min}
                      max={selectedChannel.secondaryMetrics[0].max}
                      step={selectedChannel.id === 'freelancing' ? 50 : 5}
                      value={secondaryMetricVal}
                      onChange={(e) => setSecondaryMetricVal(Number(e.target.value))}
                      className="w-full h-1 bg-slate-955 rounded appearance-none cursor-pointer accent-indigo-550"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>${selectedChannel.secondaryMetrics[0].min.toLocaleString()}</span>
                      <span>${(selectedChannel.secondaryMetrics[0].max / 2).toLocaleString()}</span>
                      <span>${selectedChannel.secondaryMetrics[0].max.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Results block */}
                <div className="p-5 rounded-xl bg-slate-950 border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">{t('guides.sim.yield')}</span>
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 mt-1 font-mono">
                    ${estimatedEarnings.toLocaleString()}
                  </div>
                  <span className="text-slate-550 text-[10px] block font-mono mt-0.5">
                    {language === 'fr' ? 'Indicateurs de gains basés sur la simulation de taux' : 'Estimated under CPM/Rates listed'}
                  </span>

                  <div className="border-t border-white/5 my-4"></div>

                  <div className="space-y-2 max-w-xs mx-auto text-sans">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>{language === 'fr' ? 'Objectif Personnel Mensuel :' : 'Personal Monthly Goal:'}</span>
                      <span className="text-white font-bold">${monthlyGoal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>{language === 'fr' ? 'Objectif Atteint :' : 'Goal Target Reached:'}</span>
                      <span className={`font-bold ${goalAchievedPercent >= 100 ? 'text-indigo-405' : 'text-amber-400'}`}>
                        {goalAchievedPercent}%
                      </span>
                    </div>
                    
                    {/* Goal indicator bar */}
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative border border-white/5">
                      <div 
                        style={{ width: `${Math.min(goalAchievedPercent, 100)}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${goalAchievedPercent >= 100 ? 'bg-indigo-600' : 'bg-amber-500'}`}
                      />
                    </div>
                  </div>
                </div>

                {saveSuccess ? (
                  <div className="w-full py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-center rounded-xl text-xs flex justify-center items-center gap-1.5 animate-pulse">
                    <CheckCircle className="w-4 h-4" /> {t('guides.sim.saved')}
                  </div>
                ) : (
                  <button
                    onClick={handleSaveWorkspacePlan}
                    className="w-full py-3 bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-indigo-400 font-bold text-xs hover:bg-slate-850 hover:text-indigo-300 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" /> {t('guides.sim.save')}
                  </button>
                )}

              </div>
            </div>

            {/* Platform rules disclosure banner */}
            <div className="p-4 rounded-xl bg-[#111319]/90 border border-white/5 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-400 leading-relaxed font-mono">
                <strong>Google AdSense Formula:</strong> {language === 'fr' 
                  ? 'Les reversements YouTube et Blogging fluctuent selon la saisonnalité publicitaire. Les estimations reposent sur les moyennes de référence du secteur.' 
                  : 'YouTube/Blogging RPM payouts fluctuate on advertiser seasons. These metrics use standard Q2 baseline industry conversions.'}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
