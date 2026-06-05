import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  Inbox,
  SendHorizontal,
  FolderLock,
  Search,
  Check,
  Building,
  ArrowRight,
  Shield,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  googleSignIn, 
  getAccessToken, 
  initAuth, 
  logoutGmail 
} from '../lib/gmailAuth';
import { 
  fetchGmailMessages, 
  sendGmailMessage, 
  GmailMessage 
} from '../lib/gmailService';

export default function GmailManager() {
  const { language, t } = useLanguage();
  
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [gmailUser, setGmailUser] = useState<any | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(true);

  // Email fetching state
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(null);

  // Outreach pitching builder
  const [outreachTo, setOutreachTo] = useState('');
  const [outreachSubject, setOutreachSubject] = useState('');
  const [outreachBody, setOutreachBody] = useState('');
  const [sendingOutreach, setSendingOutreach] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Confirmation modal
  const [showConfirmSend, setShowConfirmSend] = useState(false);

  // Quick Preset Outreach Templates
  const templates = [
    {
      id: 'template_youtube',
      label: language === 'fr' ? 'Proposition Sponsoring YouTube' : 'YouTube Sponsoring Pitch',
      subject: language === 'fr' ? 'Opportunité de partenariat de contenu - Nexora' : 'Content Partnership Proposal - Sponsorship Inquiry',
      body: language === 'fr' 
        ? `Bonjour l'équipe Marketing,\n\nJe m'appelle Russel, créateur de contenu tech de premier plan avec Nexora.\n\nJe suis très admiratif de vos produits et je souhaite vous proposer une intégration de marque dédiée dans ma prochaine capsule vidéo d'analyse critique.\n\nNos statistiques de visionnage ciblent intensément les passionnés d'SaaS (environ 85k impressions organiques régulières).\n\nSeriez-vous ouverts à discuter d'une collaboration rémunérée ?\n\nCordialement,\nRussel Blackstorm`
        : `Dear Marketing Team,\n\nMy name is Russel, and I manage a specialized tech content review channel powered by Nexora.\n\nI am a huge admirer of your products and would love to propose a dedicated 60-second video sponsorship integration in our upcoming analytical tech review series.\n\nOur organic audience directly targets SaaS builders and enterprise makers (averaging 85k views with highly optimized conversion retention).\n\nLet me know if you would be open to coordinating a premium partnership deal!\n\nBest regards,\nRussel Blackstorm`
    },
    {
      id: 'template_saas',
      label: language === 'fr' ? 'Placement d\'Outils SaaS' : 'SaaS Brand Collaboration',
      subject: language === 'fr' ? 'Intégration de produit SaaS - Proposition de revue' : 'Specialized SaaS Product Review Collaboration',
      body: language === 'fr'
        ? `Bonjour,\n\nNous gérons actuellement une suite d'applications de micro-monétisation.\n\nNous serions ravis de rédiger une critique complète ou une présentation d'outil de votre logiciel SaaS sur notre flux de recommandation.\n\nEn échange, nous offrons un backlink qualitatif à forte valeur de trafic pour optimiser votre référencement Google.\n\nFaites-moi part de vos tarifs standards pour ce type d'insertion.\n\nMeilleures salutations,\nRussel`
        : `Hi there,\n\nWe are currently rolling out a premium suite of micro-monetization micro-tools.\n\nWe would love to publish a fully in-depth article review and showcase of your SaaS utility on our primary high-authority recommended feeds.\n\nIn return, we are able to redirect substantial authority traffic backlinks to your home metrics, maximizing your domain authority conversion ratios.\n\nLet me know if this sounds of interest to your advertising budget!\n\nWarm regards,\nRussel`
    }
  ];

  // Simulated fallback test emails
  const simulatedEmails: GmailMessage[] = [
    {
      id: 'sim_1',
      threadId: 'th_1',
      sender: 'Sponsor <sponsorships@nordvpn-deals.com>',
      subject: 'NordVPN Sponsorship Invitation for June 2026',
      snippet: 'Hi Russel, we recently reviewed your monetization statistics and would love to invite you to join our direct sponsorship pool this quarter.',
      date: 'Fri, 05 Jun 2026 08:31:00 GMT',
      body: `Hi Russel,\n\nThis is Sarah from the NordVPN Affiliate & Sponsorship acquisitions team.\n\nWe have been monitoring your tech performance evaluations, and the monetization stats you generated look phenomenal. We are currently scouting premium publishers for our autumn privacy campaign.\n\nWe would love to offer you a flat sponsor payment of $550 per integration plus extra multi-level commissions for every customer registration.\n\nLet us know if you want to proceed and we will coordinate the review materials.\n\nBest,\nSarah`,
      type: 'sponsor'
    },
    {
      id: 'sim_2',
      threadId: 'th_2',
      sender: 'Google AdSense <adsense-noreply@google.com>',
      subject: 'Google AdSense: Your balance transfer has cleared successfully',
      snippet: 'Congratulations! Your premium monetization balance in Google AdSense has been computed and issued to your local wire destination.',
      date: 'Thu, 04 Jun 2026 21:10:00 GMT',
      body: `Dear Publisher,\n\nWe are pleased to inform you that your accumulated Google AdSense earnings for the previous cycle have been reviewed, verified, and safely processed.\n\nDetails:\n- Publisher Code: ca-pub-0000000000000000\n- Dispatched Sum: $1,420.50 USD\n- Destination: Local Electronic Bank Transfer (Kinshasa, DRC)\n\nIt may take up to 3 business days for these funds to clear inside your account balance depending on intermediate route handlers.\n\nSincerely,\nThe Google AdSense Team`,
      type: 'adsense'
    },
    {
      id: 'sim_3',
      threadId: 'th_3',
      sender: 'Venture Capital <deals@epic-capital-saas.com>',
      subject: 'SaaS Acquisitons: Your micro-app is listed for purchase review',
      snippet: 'Hello, our investment desk has noted your monetization channel performance on Nexora. We request a preliminary discovery chat next Tuesday.',
      date: 'Wed, 03 Jun 2026 14:05:00 GMT',
      body: `Greetings Maker,\n\nOur growth syndicate is currently seeking to acquire profitable micro-SaaS utilities generating over $1,000 monthly recursively.\n\nBased on your monetization worksheet projections, your techReviews blueprint matches our criteria.\n\nWe would like to coordinate a brief 10-minute screening session to evaluate if your application code and subscriber parameters are ready for acquisition exit.\n\nBest,\nAcquisitions Lead`,
      type: 'general'
    }
  ];

  // Retrieve on-load state
  useEffect(() => {
    const unsub = initAuth(
      (user, cachedTok) => {
        setToken(cachedTok);
        setGmailUser(user);
        setNeedsAuth(false);
        loadGmailMessages(cachedTok);
      },
      () => {
        setNeedsAuth(true);
        // Fallback to simulated emails for presentation
        setEmails(simulatedEmails);
      }
    );

    return () => unsub();
  }, []);

  const handleApplyTemplate = (subject: string, body: string) => {
    setOutreachSubject(subject);
    setOutreachBody(body);
  };

  const loadGmailMessages = async (accessToken: string) => {
    setLoadingEmails(true);
    setErrorMessage(null);
    try {
      const liveMsgs = await fetchGmailMessages(accessToken);
      if (liveMsgs.length > 0) {
        setEmails(liveMsgs);
      } else {
        // Fallback to simulated with alert if mailbox is empty
        setEmails(simulatedEmails);
        console.warn('Live Gmail box was scanned but contained no active sponsorship matches. Rendering demo guidelines instead.');
      }
    } catch (e: any) {
      console.error(e);
      // Fallback but display descriptive warning
      setEmails(simulatedEmails);
      setErrorMessage(
        language === 'fr'
          ? "Impossible d'interroger Gmail en direct (votre compte nécessite peut-être la configuration de l'autorisation de l'API de test). Voici des bannières de démonstration sécurisées pour tester."
          : "Could not sync live Gmail inbox (requires test user access configured in target OAuth). Running interactive simulation for testing."
      );
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setGmailUser(result.user);
        setNeedsAuth(false);
        loadGmailMessages(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Gmail OAuth failed:', err);
      setErrorMessage('Google Authentication was cancelled or could not be completed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDisconnect = async () => {
    await logoutGmail();
    setToken(null);
    setGmailUser(null);
    setNeedsAuth(true);
    setEmails(simulatedEmails);
    setSelectedEmail(null);
  };

  // Safe wrapper with MANDATORY confirmation
  const triggerOutreachConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outreachTo || !outreachSubject || !outreachBody) return;
    setShowConfirmSend(true);
  };

  const handleConfirmAndSend = async () => {
    setShowConfirmSend(false);
    setSendingOutreach(true);
    setSendSuccess(false);
    setErrorMessage(null);

    try {
      if (token) {
        // REAL LIVE GMAIL API SEND
        await sendGmailMessage(token, outreachTo, outreachSubject, outreachBody);
      } else {
        // SIMULATED OUTREACH SEND
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Add simulated sent transaction locally
        const mockLog = {
          id: `sent_${Date.now().toString(36)}`,
          email: outreachTo,
          plan: 'pro' as any,
          amount: 0,
          status: 'succeeded',
          timestamp: new Date().toISOString(),
          payment_type: `Outreach Pitch Sent: ${outreachSubject}`
        };
        const logs = JSON.parse(localStorage.getItem('nexora_stripe_transactions') || '[]');
        logs.push(mockLog);
        localStorage.setItem('nexora_stripe_transactions', JSON.stringify(logs));
      }

      setSendSuccess(true);
      setOutreachTo('');
      setOutreachSubject('');
      setOutreachBody('');
      setTimeout(() => setSendSuccess(false), 4000);
    } catch (e: any) {
      console.error('Error sending:', e);
      setErrorMessage(
        language === 'fr' 
          ? "Erreur lors de l'envoi de l'e-mail. Vérifiez vos autorisations." 
          : "Failed to dispatch email. Check current verification credentials."
      );
    } finally {
      setSendingOutreach(false);
    }
  };

  return (
    <div id="gmail-integration-console" className="space-y-6">
      
      {/* Upper Status Banner */}
      <div className="bg-[#111319]/90 border border-white/5 rounded-2xl p-6 relative overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-650/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Google Workspace Integration
            </span>
            <h2 className="text-xl font-bold font-sans text-white">
              {language === 'fr' ? 'Monétisation Gmail & Automatisation' : 'Gmail Monetization & Outreach Console'}
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
              {language === 'fr'
                ? 'Gérez vos correspondances de sponsoring de marques, vos alertes de virement Google AdSense, et envoyez vos templates de propositions commerciales directement depuis votre boîte.'
                : 'Access active sponsorship brand inquiries, track live Google AdSense wiring clearances, and pitch commercial deals in real-time.'}
            </p>
          </div>

          <div>
            {needsAuth ? (
              /* Officially styled GSI styled material button */
              <button 
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button w-full sm:w-auto"
                id="gmail-gsi-signin-btn"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-sans text-xs">
                    {isLoggingIn ? 'Connecting...' : language === 'fr' ? 'Connecter Google Gmail' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 overflow-hidden flex items-center justify-center">
                  {gmailUser?.photoURL ? (
                    <img referrerPolicy="no-referrer" src={gmailUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Mail className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-left leading-tight pr-2">
                  <div className="text-xs text-white font-bold">{gmailUser?.displayName || 'Active Account'}</div>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider">🔐 LIVE GMAIL ACCESS</span>
                </div>
                <button 
                  type="button"
                  onClick={handleDisconnect}
                  className="text-[10px] text-slate-500 hover:text-rose-450 font-mono px-2 py-1 hover:bg-rose-500/15 rounded-lg border-0 transition-all cursor-pointer"
                >
                  {language === 'fr' ? 'Quitter' : 'Disconnect'}
                </button>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2 max-w-4xl">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Inbox + Outreach Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Sponsorship Scanner (Inbox) */}
        <div className="lg:col-span-7 bg-[#111319]/90 border border-white/5 rounded-2xl flex flex-col overflow-hidden min-h-[580px]">
          <div className="p-5 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-sans">
                {language === 'fr' ? 'Scanner de Sponsoring & AdSense' : 'Sponsorship & AdSense Inbox Scanner'}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {!needsAuth && (
                <button
                  type="button"
                  onClick={() => loadGmailMessages(token!)}
                  disabled={loadingEmails}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-450 hover:text-white transition-all cursor-pointer bg-transparent border-0 disabled:opacity-50"
                  title="Refreash Live Emails"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingEmails ? 'animate-spin' : ''}`} />
                </button>
              )}
              <span className="text-[9px] font-mono text-indigo-400 font-bold px-2 py-0.5 bg-indigo-505/10 rounded-full border border-indigo-505/10">
                {needsAuth ? 'SIMULATION MODE' : 'LIVE DISCOVERY'}
              </span>
            </div>
          </div>

          {/* Mailbox contents */}
          <div className="flex-1 p-4 space-y-3 max-h-[520px] overflow-y-auto">
            {loadingEmails ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin mx-auto"></div>
                <span className="text-xs text-slate-400 font-mono block">
                  {language === 'fr' ? 'Scan de votre boîte Gmail en cours...' : 'Scanning your Google Gmail folders...'}
                </span>
              </div>
            ) : emails.length === 0 ? (
              <div className="py-24 text-center text-slate-500 font-sans text-xs">
                {language === 'fr' ? 'Aucun mail de sponsoring détecté.' : 'No active sponsorship threads detected.'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {emails.map((email) => {
                  const isActive = selectedEmail?.id === email.id;
                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                        isActive 
                          ? 'bg-indigo-650/15 border-indigo-500/40 shadow-md' 
                          : 'bg-slate-950 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{email.sender}</span>
                        <span className="text-[9px] text-slate-505 font-mono">{email.date.substring(0, 16)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-semibold text-white truncate max-w-[325px] flex-1">{email.subject}</h4>
                        
                        {email.type === 'sponsor' ? (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">SPONSOR</span>
                        ) : email.type === 'adsense' ? (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/15 font-mono">ADSENSE</span>
                        ) : (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">GENERAL</span>
                        )}
                      </div>

                      <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">{email.snippet}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Email Reader drawer or side panel */}
          {selectedEmail && (
            <div className="p-5 border-t border-white/5 bg-slate-950/90 relative animate-fade-in text-left">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="absolute top-4 right-4 text-xs text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer font-mono"
              >
                Close Readers ✕
              </button>
              
              <div className="space-y-3 font-sans max-h-[300px] overflow-y-auto">
                <div className="space-y-1 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="font-mono">{language === 'fr' ? 'De' : 'From'}:</span>
                    <strong className="text-white font-sans">{selectedEmail.sender}</strong>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-normal pt-1">{selectedEmail.subject}</h3>
                </div>

                <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-line p-3 bg-[#0D0F14] rounded-lg border border-white/5 font-sans select-text">
                  {selectedEmail.body}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const extractedEmail = selectedEmail.sender.match(/<([^>]+)>/)?.[1] || selectedEmail.sender;
                      setOutreachTo(extractedEmail);
                      setOutreachSubject(`Re: ${selectedEmail.subject}`);
                      setOutreachBody(`Hi Team,\n\nThank you for reaching out! We would love to discuss the monetization parameters.\n\nBest,\nRussel`);
                      const tab = document.getElementById('outreach-form-container');
                      if (tab) tab.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 font-bold text-white text-[11px] rounded flex items-center gap-1.5 border-0 cursor-pointer"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    {language === 'fr' ? 'Préparer une réponse' : 'Draft Response'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedEmail(null)}
                    className="px-3 py-1.5 bg-slate-950 text-slate-400 text-[11px] rounded border border-white/5 cursor-pointer"
                  >
                    {language === 'fr' ? 'Masquer la lecture' : 'Hide content'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Outreach Pitch Sender */}
        <div id="outreach-form-container" className="lg:col-span-5 bg-[#111319]/90 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="space-y-1 text-left">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Send className="w-4 h-4 text-indigo-400" />
              {language === 'fr' ? 'Outil d\'Outreach & Pitching' : 'Outreach & Brand Pitching Board'}
            </h3>
            <p className="text-slate-400 text-[11.5px] leading-relaxed">
              {language === 'fr'
                ? "Dispatchez des relances et des propositions d'affiliation commerciale à forte audience."
                : "Submit outbound commercial emails. Use preset monetization pitches directly or customize your target specifications."}
            </p>
          </div>

          {/* Quick presets list */}
          <div className="space-y-1.5 text-left">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              {language === 'fr' ? 'Gabarits Instantanés' : 'Instant Pitch Templates'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-left">
              {templates.map((temp) => (
                <button
                  key={temp.id}
                  type="button"
                  onClick={() => handleApplyTemplate(temp.subject, temp.body)}
                  className="px-2.5 py-2 text-slate-300 hover:text-white bg-slate-955 border border-white/5 text-[10px] text-left hover:border-indigo-500/30 rounded-lg transition-all line-clamp-1 truncate cursor-pointer select-none"
                  title={temp.label}
                >
                  ✨ {temp.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={triggerOutreachConfirmation} className="space-y-4 text-left">
            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">
                {language === 'fr' ? 'Destinataire (E-mail)' : 'Send To (Email)'}
              </label>
              <input 
                type="email"
                required
                placeholder="marketing@brandinfo.com"
                value={outreachTo}
                onChange={(e) => setOutreachTo(e.target.value)}
                className="w-full bg-[#0D0F14] text-white text-xs px-3.5 py-2.5 border border-white/5 focus:border-indigo-505 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">
                {language === 'fr' ? "Objet du Message" : "Subject"}
              </label>
              <input 
                type="text"
                required
                placeholder={language === 'fr' ? 'Proposition de partenariat...' : 'Sponsorship inquiry...'}
                value={outreachSubject}
                onChange={(e) => setOutreachSubject(e.target.value)}
                className="w-full bg-[#0D0F14] text-white text-xs px-3.5 py-2.5 border border-white/5 focus:border-indigo-505 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase font-mono tracking-wider mb-1.5">
                {language === 'fr' ? 'Corps de Proposition' : 'Proposal Pitch Body'}
              </label>
              <textarea 
                rows={9}
                required
                value={outreachBody}
                onChange={(e) => setOutreachBody(e.target.value)}
                className="w-full bg-[#0D0F14] text-white text-xs px-4 py-3 border border-white/5 focus:border-indigo-505 rounded-xl outline-none font-sans leading-normal whitespace-pre-wrap resize-none"
                placeholder={language === 'fr' ? "Décrivez votre audience, statistiques CPM, tarification..." : "Describe channel statistics, conversion CPMs, or pricing package..."}
              />
            </div>

            {sendSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-1.5 font-sans font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'fr'
                    ? "Proposition d'Outreach envoyée avec succès !"
                    : "Outreach query sent successfully! Logged in ledger."}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={sendingOutreach || !outreachTo}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-650/15 uppercase font-mono tracking-wider disabled:opacity-50"
            >
              {sendingOutreach ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {needsAuth 
                ? (language === 'fr' ? 'Envoyer Pitch (Simulation)' : 'Send Pitch (Simulated)')
                : (language === 'fr' ? 'Envoyer via Gmail Actif' : 'Dispatch via Live Gmail')}
            </button>
          </form>

          {/* Secure SSL notice */}
          <div className="pt-3 border-t border-white/5 flex items-start gap-1.5 text-slate-505 text-[10px] font-sans">
            <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'fr'
                ? "L'authentification s'exécute localement à l me de jetons sécurisés. Nous ne stockons jamais vos mots de passe Google."
                : "Authentication utilizes ephemeral sandboxed tokens directly requested from the official Google server."}
            </span>
          </div>

        </div>

      </div>

      {/* MANDATORY USER CONFIRMATION MODAL FOR WRITING OPERATIONS */}
      {showConfirmSend && (
        <div className="fixed inset-0 min-h-screen bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl relative space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-amber-500">
              <Shield className="w-6 h-6 text-amber-500" />
              <h3 className="text-base font-bold text-white font-sans">
                {language === 'fr' ? 'Confirmer l\'envoi de l\'e-mail' : 'Confirm Dispatch Transaction'}
              </h3>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              {language === 'fr'
                ? `Êtes-vous sûr de vouloir envoyer cet e-mail de micro-partenariat à :`
                : `Are you sure you want to send this sponsorship proposal email on your behalf to:`}
              <strong className="text-white block mt-1.5 bg-slate-950 p-2 rounded text-center border border-white/5 font-mono select-all text-xs">
                {outreachTo}
              </strong>
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-white/10 text-[11px] font-mono overflow-y-auto max-h-[140px] leading-relaxed text-slate-400">
              <strong className="text-slate-300 block mb-1">Subject: {outreachSubject}</strong>
              <div className="whitespace-pre-wrap">{outreachBody}</div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleConfirmAndSend}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl cursor-pointer text-center select-none border-0"
              >
                {language === 'fr' ? 'Oui, Envoyer' : 'Yes, Confirm & Send'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmSend(false)}
                className="flex-1 py-2.5 bg-slate-950 text-slate-400 font-semibold text-xs rounded-xl border border-white/5 cursor-pointer text-center hover:text-white"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
