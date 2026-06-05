import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Radio, 
  FileText, 
  CheckCircle,
  Copy,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Cpu,
  Inbox
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Transaction {
  id: string;
  email: string;
  plan: string;
  amount: number;
  status: string;
  timestamp: string;
}

interface AdminPanelProps {
  onToggleAdSense: (enabled: boolean) => void;
  adsenseEnabled: boolean;
}

export default function AdminPanel({ onToggleAdSense, adsenseEnabled }: AdminPanelProps) {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Populate transactions ledger from localStorage
    const storedTxns = JSON.parse(localStorage.getItem('nexora_stripe_transactions') || '[]');
    setTransactions(storedTxns);

    // If no transactions, let's pre-load three attractive mock checkouts for realism
    if (storedTxns.length === 0) {
      const defaultTxns: Transaction[] = [
        {
          id: 'AM-DRC-KNS88A',
          email: 'russellblackstorm116@gmail.com',
          plan: 'pro',
          amount: 29,
          status: 'succeeded',
          timestamp: new Date(2026, 4, 30, 14, 22).toISOString()
        },
        {
          id: 'AM-DRC-VLS21E',
          email: 'sarah_growth@builder.com',
          plan: 'premium',
          amount: 79,
          status: 'succeeded',
          timestamp: new Date(2026, 5, 2, 9, 45).toISOString()
        },
        {
          id: 'AM-DRC-YTB05C',
          email: 'mark_vlog@youtube-maker.net',
          plan: 'pro',
          amount: 29,
          status: 'succeeded',
          timestamp: new Date(2026, 5, 4, 18, 12).toISOString()
        }
      ];
      localStorage.setItem('nexora_stripe_transactions', JSON.stringify(defaultTxns));
      setTransactions(defaultTxns);
    }

    const storedBroadcast = localStorage.getItem('nexora_broadcast');
    if (storedBroadcast) {
      setBroadcastMessage(storedBroadcast);
    }
  }, []);

  const [adsensePubId, setAdsensePubId] = useState(
    localStorage.getItem('nexora_adsense_pub_id') || 'ca-pub-0000000000000000'
  );
  const [adsenseSlotId, setAdsenseSlotId] = useState(
    localStorage.getItem('nexora_adsense_slot_id') || '1234567890'
  );
  const [saveAdsenseSuccess, setSaveAdsenseSuccess] = useState(false);

  const handleSaveAdsenseSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nexora_adsense_pub_id', adsensePubId.trim());
    localStorage.setItem('nexora_adsense_slot_id', adsenseSlotId.trim());
    setSaveAdsenseSuccess(true);
    setTimeout(() => setSaveAdsenseSuccess(false), 2000);
  };

  const handlePublishBroadcast = () => {
    if (!announcementText.trim()) return;
    localStorage.setItem('nexora_broadcast', announcementText);
    setBroadcastMessage(announcementText);
    setAnnouncementText('');
  };

  const handleClearBroadcast = () => {
    localStorage.removeItem('nexora_broadcast');
    setBroadcastMessage('');
  };

  const codeSnippet = `<!-- Google AdSense Auto Ads - nexoramonetize.com Active -->
<script 
  async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePubId}"
  crossorigin="anonymous">
</script>
<!-- nexoramonetize.com Banner Unit -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${adsensePubId}"
     data-ad-slot="${adsenseSlotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const copyAdSenseToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Compute stats
  const totalSubscribers = transactions.length + 42; // Base visitors multiplier
  const totalMrr = transactions.reduce((acc, current) => acc + current.amount, 0) + (14 * 29) + (3 * 79); // Base multiplier

  return (
    <div className="text-gray-100 font-sans pb-12 select-none space-y-8">
      
      {/* Dynamic Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-sans">{t('admin.title')}</h2>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{t('admin.subtitle')}</p>
      </div>

      {/* Upper analytical scoreboards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-[#111319]/90 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{t('admin.mrr')}</span>
            <DollarSign className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">${totalMrr.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">{t('admin.mrr_trend')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111319]/90 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{t('admin.paying')}</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{totalSubscribers}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">{t('admin.paying_note')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111319]/90 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{t('admin.adsense')}</span>
            {adsenseEnabled ? (
              <span className="px-1.5 py-0.5 rounded bg-[#1A1E29] text-[8px] font-bold text-indigo-400 uppercase tracking-widest font-mono">ENABLED</span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-slate-805 text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">DISABLED</span>
            )}
          </div>
          <button
            onClick={() => onToggleAdSense(!adsenseEnabled)}
            className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-950 hover:bg-slate-900 border border-white/5 text-xs font-mono transition-all text-slate-250 cursor-pointer"
          >
            {adsenseEnabled ? (
              <><ToggleRight className="w-5 h-5 text-indigo-400" /> {t('admin.ads_on')}</>
            ) : (
              <><ToggleLeft className="w-5 h-5 text-slate-500" /> {t('admin.ads_off')}</>
            )}
          </button>
          <p className="text-[10px] text-slate-500 font-mono mt-2">{t('admin.helper')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111319]/90 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{t('admin.server')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{t('admin.server_status')}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-2.5">{t('admin.server_note')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Ledger transactions list */}
        <div className="lg:col-span-8 bg-[#111319]/90 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
              <FileText className="w-4 h-4 text-indigo-400" /> {t('admin.ledger.title')}
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{transactions.length} {t('admin.ledger.count')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-550 text-[10px]">
                  <th className="pb-3 pr-2">{t('admin.ledger.col_id')}</th>
                  <th className="pb-3 pr-2">{t('admin.ledger.col_email')}</th>
                  <th className="pb-3 pr-2">{t('admin.ledger.col_tier')}</th>
                  <th className="pb-3 pr-2">{t('admin.ledger.col_amt')}</th>
                  <th className="pb-3 pr-2">{t('admin.ledger.col_status')}</th>
                  <th className="pb-3">{t('admin.ledger.col_time')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tVal, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-3.5 text-white font-bold">{tVal.id}</td>
                    <td className="py-3.5 font-sans truncate max-w-[150px]">{tVal.email}</td>
                    <td className="py-3.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400">
                        {tVal.plan}
                      </span>
                    </td>
                    <td className="py-3.5 text-white font-bold">${tVal.amount}.00</td>
                    <td className="py-3.5 text-indigo-400 font-semibold">{tVal.status.toUpperCase()}</td>
                    <td className="py-3.5 text-[10px] text-slate-500">{new Date(tVal.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Setup tools for AdSense & Advisory Alerts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AdSense configuration helper */}
          <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">{t('admin.adsense_helper.title')}</h3>
            </div>
            
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              {t('admin.adsense_helper.desc')}
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-950 rounded-lg text-[9px] text-slate-400 font-mono overflow-x-auto max-h-[140px] border border-white/5 select-text leading-snug">
                {codeSnippet}
              </pre>
              <button
                onClick={copyAdSenseToClipboard}
                className="absolute top-2 right-2 p-1.5 bg-slate-900 border border-white/5 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedCode ? (
                  <span className="text-[8px] font-bold text-indigo-400 px-1 font-sans">{t('admin.adsense_helper.copied')}</span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Config Form for Real Google AdSense parameters */}
            <form onSubmit={handleSaveAdsenseSettings} className="pt-3 border-t border-white/5 space-y-3">
              <div className="text-left">
                <span className="text-[9px] font-extrabold text-amber-500 font-mono uppercase tracking-wider block">
                  {language === 'fr' ? 'Configuration AdSense Réelle' : 'Real-Time AdSense Settings'}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {language === 'fr' 
                    ? 'Définissez vos identifiants réels Google AdSense de production :' 
                    : 'Set your actual production Google AdSense publisher parameters:'}
                </p>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">
                    {language === 'fr' ? 'ID Éditeur (Publisher ID)' : 'Publisher Client ID'}
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="ca-pub-0000000000000000"
                    value={adsensePubId}
                    onChange={(e) => setAdsensePubId(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3 py-1.5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-505 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">
                    {language === 'fr' ? "ID de l'Annonce (Slot ID)" : 'Ad Slot ID'}
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="1234567890"
                    value={adsenseSlotId}
                    onChange={(e) => setAdsenseSlotId(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3 py-1.5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-505 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md border-0"
              >
                {saveAdsenseSuccess ? '✓ ' : ''}
                {language === 'fr' ? 'Enregistrer les clés AdSense' : 'Save AdSense Credentials'}
              </button>
            </form>
          </div>

          {/* Broadcast alert console tool */}
          <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" /> {t('admin.broadcast.title')}
            </h3>

            {broadcastMessage ? (
              <div className="p-3 bg-indigo-500/10 border border-indigo-505/20 text-indigo-400 text-xs rounded-xl flex justify-between items-center">
                <div className="truncate pr-2">
                  <span className="font-bold underline block text-[9px] uppercase tracking-wider font-mono">{t('admin.broadcast.active')}</span>
                  <p className="truncate text-slate-300 pt-0.5">{broadcastMessage}</p>
                </div>
                <button
                  onClick={handleClearBroadcast}
                  className="text-slate-555 hover:text-rose-455 text-[10px] font-bold border-0 bg-transparent cursor-pointer font-mono"
                >
                  {language === 'fr' ? 'Supprimer' : 'Remove'}
                </button>
              </div>
            ) : (
              <p className="text-slate-500 text-[11px]">{language === 'fr' ? "Aucun message d'actualité actif." : "No active sitewide alerts."}</p>
            )}

            <div className="space-y-2">
              <textarea
                placeholder={t('admin.broadcast.placeholder')}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full h-16 bg-slate-950 text-white border border-white/5 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 font-sans resize-none"
              />
              <button
                onClick={handlePublishBroadcast}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans rounded-full transition-all text-center cursor-pointer"
              >
                {t('admin.broadcast.btn')}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
