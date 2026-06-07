import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Save, 
  Trash2, 
  FolderPlus,
  ArrowRight,
  User,
  Cpu,
  Bookmark,
  CheckCircle,
  Clock,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, SavedChat, SubscriptionTier } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdvisorChatProps {
  subscription: SubscriptionTier;
  savedChats: SavedChat[];
  onSaveChatThread: (chat: SavedChat) => void;
  onSelectSavedChat: (chat: SavedChat) => void;
  activeChatId: string | null;
  activeMessages: ChatMessage[];
  setActiveMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AdvisorChat({
  subscription,
  savedChats,
  onSaveChatThread,
  onSelectSavedChat,
  activeChatId,
  activeMessages,
  setActiveMessages
}: AdvisorChatProps) {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatCount, setChatCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveNotifier, setSaveNotifier] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested starter prompts utilizing translation keys
  const suggestedPrompts = [
    { label: t('chat.suggestion.p1_label'), text: t('chat.suggestion.p1_text') },
    { label: t('chat.suggestion.p2_label'), text: t('chat.suggestion.p2_text') },
    { label: t('chat.suggestion.p3_label'), text: t('chat.suggestion.p3_text') }
  ];

  // Auto scroll to latest response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, loading]);

  useEffect(() => {
    // Sync chat counts from localStorage to prevent bypassing free limits
    const storedCount = localStorage.getItem('nexora_free_advisor_count');
    if (storedCount) {
      setChatCount(Number(storedCount));
    }
  }, []);

  // Free Tier constraints (max 3 counts)
  const isFreeTierExceeded = subscription === 'free' && chatCount >= 3;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    if (isFreeTierExceeded) {
      setErrorMessage(language === 'fr' ? "Limite gratuite atteinte. Passez à un compte Pro pour poser des questions de stratégie de manière illimitée." : "You have consumed all 3 daily Free consults. Upgrade to Pro to unlock unlimited Gemini advice.");
      return;
    }

    setErrorMessage('');
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setActiveMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: textToSend,
          chatHistory: activeMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reach monetization advisor. Ensure Gemini API key is configured.");
      }

      const modelMsg: ChatMessage = {
        id: `msg_model_${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };

      setActiveMessages(prev => [...prev, modelMsg]);

      // Count free tier usage
      if (subscription === 'free') {
        const nextCount = chatCount + 1;
        setChatCount(nextCount);
        localStorage.setItem('nexora_free_advisor_count', String(nextCount));
      }
    } catch (err: any) {
      console.warn("API Error, triggering local fallback Advisor response:", err);
      
      const query = textToSend.toLowerCase();
      let fallbackText = "";

      if (language === 'fr') {
        if (query.includes('jeu') || query.includes('game') || query.includes('play') || query.includes('itch') || query.includes('steam')) {
          fallbackText = `### 🎮 Stratégie de Monétisation pour Jeux Vidéo (Conseil d'Expert Nexora)

Pour monétiser au mieux vos projets de jeux vidéo autonomes ou hébergés sur navigateur :

1. **Modèle de Don 'Pay-What-You-Want' :** Sur **itch.io**, laisser les joueurs fixer leur prix draine 40% de revenus supplémentaires par rapport à un prix fixe serré pour les petits jeux indés.
2. **Extensions & Musiques :** Proposez la bande-son originale (OST) au format FLAC/MP3 ou un livre d'illustrations numériques (Artbook) comme achats intégrés complémentaires.
3. **Insertions Publicitaires Web :** Si le jeu s'exécute directement dans le navigateur, configurez un espace publicitaire périphérique via l'**Éditeur de Bannières Nexora** en utilisant des slots AdSense réactifs.
4. **Financement Communautaire :** Mettez en avant vos coulisses de développement (Devlogs) sur Patreon/Discord pour attirer de fidèles mécènes.`;
        } else if (query.includes('musique') || query.includes('music') || query.includes('chanson') || query.includes('song') || query.includes('audio') || query.includes('instrum')) {
          fallbackText = `### 🎵 Guide de Monétisation pour les Créateurs Audio

L'industrie musicale moderne regorge d'options de vente directe sans intermédiaires :

1. **Canaux de Vente Directe (Bandcamp & Nexora) :** Vendez directement vos pistes audio en qualité maximale. Bandcamp ne prend que 10-15% de commission, contre les fractions de centimes reversées par Spotify ou Apple Music.
2. **Licences de Synchronisation (Sync Licensing) :** Mettez vos productions à disposition des vidéastes, podcasteurs et développeurs de jeux en échange de redevances via des bibliothèques de sons libres de droits.
3. **Contenus exclusifs pour Fans :** Créez un abonnement de soutien (Patreon, Nexora) donnant accès aux fichiers sources (.WAV de chaque instrument) pour que d'autres créateurs fassent des remixes.
4. **Sponsoring d'Épisodes :** Si vous produisez un podcast musical, louez un spot audio de 20 secondes au début de chaque session.`;
        } else if (query.includes('vidéo') || query.includes('video') || query.includes('youtube') || query.includes('tiktok') || query.includes('stream') || query.includes('twitch') || query.includes('chaîne') || query.includes('channel')) {
          fallbackText = `### 📹 Optimisation du Revenu Vidéo & Streaming

La monétisation vidéo performante repose sur la diversification au-delà de la publicité :

1. **Double Flux Publicitaire (AdSense + Nexora) :** Configurez un site web supportant des bannières AdSense pour rediriger vos spectateurs depuis vos descriptions de vidéos et capter des revenus par clic élevés.
2. **Contrats de Sponsoring Directs :** Présentez un kit média professionnel aux marques de votre créneau (ex: outils tech, matériel de sport) avec des tarifs de mention de 30 secondes en début de vidéo.
3. **Affiliation Sélective :** Ajoutez des liens traçables vers le matériel que vous utilisez. Les commissions d'affiliation de produits de marque représentent souvent le triple des revenus publicitaires YouTube.
4. **Adhésions & Abonnements de Chaîne :** Proposez des émoticônes personnalisées, des vidéos bonus ou des séances de questions-réponses en direct via vos formules d'abonnements récurrents.`;
        } else if (query.includes('app') || query.includes('saas') || query.includes('logiciel') || query.includes('software') || query.includes('code') || query.includes('site')) {
          fallbackText = `### 💻 Stratégie SaaS & Applications Web

Les applications logicielles bénéficient des plus forts multiplicateurs de valeur :

1. **Modèle d'Abonnement Récurrent (SaaS) :** Facturez une licence mensuelle ou annuelle pour l'utilisation de vos fonctionnalités professionnelles tout en conservant un accès d'essai gratuit limité.
2. **Intégration de Passerelle de Paiement :** Éliminez la friction en proposant des passerelles d'encaissement directes (PayPal, Stripe) via notre guide de caisses Airtel/PayPal.
3. **Partenariats de Bannières de Redirection :** Si votre application web génère du trafic quotidien important, placez de puissantes bannières AdSense aux points de friction ou d'attente d'exécution pour pérenniser vos serveurs.
4. **Fonctionnalités Verrouillées par Crédits :** Mettez en place un système de jetons à la consommation pour les requêtes gourmandes en calcul (comme les requêtes IA).`;
        } else if (query.includes('sponsor') || query.includes('brand') || query.includes('partenaire') || query.includes('partenariat') || query.includes('collaboration')) {
          fallbackText = `### 🤝 Accords de Sponsoring & Partenariats de Marques

Comment attirer et conserver des annonceurs de marque qualifiés sur vos espaces numériques :

1. **Kit Média Structuré :** Affichez de vraies mesures de performance : visites mensuelles, taux de clics (CTR), audience géographique et engagements récents.
2. **Offres Forfaitaires d'Insertions :** Ne facturez pas au clic aléatoire. Vendez des espaces fixes pour un tarif forfaitaire mensuel clair (par exemple, 150€/mois pour la bannière de haut de page).
3. **Campagne Pilote Gratuite :** Proposez de diffuser une publicité de 10 jours à un partenaire potentiel. S'il convertit, proposez-lui un abonnement annuel récurent pour solidifier la relation.
4. **Liens Affiliés Cumulés :** Négociez un pourcentage supplémentaire sur les ventes directes issues de votre trafic en plus du prix fixe de parrainage.`;
        } else if (query.includes('abonnement') || query.includes('subscription') || query.includes('mensuel') || query.includes('recurring') || query.includes('vip') || query.includes('pro')) {
          fallbackText = `### 💳 Structurer une Offre par Abonnements (Subscriptions)

Le revenu récurrent est la clé de la stabilité financière de tout créateur de contenu :

1. **Règle des Trois Paliers :** 
   - **Tiers Découverte (Gratuit) :** Accès de base, outils limités, bannières publicitaires actives.
   - **Tiers Pro (Payant - 5€ à 20€/mois) :** Zéro publicité, outils de calcul avancés, exports illimités, assistance premium.
   - **Tiers Mentorat/VIP (Premium - 50€+/mois) :** Session d'accompagnement direct, retour personnalisé sur les projets, vote prioritaire sur les développements futurs.
2. **Engagement Communautaire :** Offrez un accès privé à un groupe d'échange (Discord, Telegram) réservé exclusivement aux abonnés actifs.
3. **Contenus Périodiques Exclusifs :** Publiez une infolettre (Newsletter) mensuelle ou des fiches de stratégie exclusives non disponibles publiquement.`;
        } else {
          fallbackText = `### 🚀 Plan de Monétisation Global (Conseil Nexora AI)

Bienvenue dans l'espace conseil de **Nexora Monetize**. Pour monétiser efficacement vos actifs et créations digitales, suivez cette feuille de route éprouvée :

1. **Le Triple Flux de Revenu :**
   - **La Publicité Directe / AdSense :** Pour monétiser le trafic passif qui visite vos pages de présentation.
   - **Les Micro-Patiements / Dons :** Pour permettre à votre communauté de soutenir directement vos lancements de produits.
   - **Le Modèle Récurrent (Abonnements) :** Pour stabiliser vos revenus par paliers et d'offrir des espaces de discussion privatifs.
2. **Implémentation Pratique dans l'Interface :**
   - Pour insérer des blocs d'annonces, naviguez vers l'**Espace Admin** pour copier le code auto-généré AdSense adapté à votre identifiant Google Publisher.
   - Simulez vos futurs gains à l'aide de notre **Estimateur d'Audience** sur la page principale pour ajuster vos tarifs publicitaires et abonnements de soutien.

*Note de fonctionnement : L'advisor utilise un modèle de réponse d'expert optimisé localement pour l'environnement de démonstration itch.io.*`;
        }
      } else {
        if (query.includes('game') || query.includes('play') || query.includes('gaming') || query.includes('itch') || query.includes('steam') || query.includes('indie')) {
          fallbackText = `### 🎮 Indie Game Monetization Framework (Nexora Expert Advice)

To maximize player-supported revenue loops for standalone desktop or web browser games:

1. **The Pay-With-Confidence PWYW Model:** On **itch.io**, allowing your community to choose their donation amount can yield up to 40% organic increases over standard flat licensing models.
2. **Asset Supplements (DLCs):** Package custom soundtracks (OST) in high-quality FLAC format or release downloadable art development booklets as digital addons.
3. **Browser Embed Advertising:** For instant-play web versions, establish standard advertising banner frames around the viewport canvas using our **Nexora Banner Placement tool** configured with responsive slot IDs.
4. **Community Patrons:** Harness active devlog walkthroughs on sites like Patreon to transform occasional players into long-term funding champions.`;
        } else if (query.includes('music') || query.includes('song') || query.includes('audio') || query.includes('track') || query.includes('sound')) {
          fallbackText = `### 🎵 Music & Audio Asset Optimization Strategies

Independent musicians and audio engineers benefit greatly from direct digital delivery strategies:

1. **Direct Fan Sales (Bandcamp Model):** Retain over 80-85% of item sales, bypassing fraction-of-a-cent payouts standard on Spotify or Apple Music streaming networks.
2. **Sync Licensing Opportunities:** Pitch your songs or ambient soundtracks to content channels, indie developers, and marketing groups through royalty-free stock licensing catalogues.
3. **Exclusive Studio Tiers:** Implement recurrent subscriptions (using Nexora or Patreon grids) that unlock raw audio stems, project walkthroughs, and direct custom vocal hooks.
4. **Podcast Placements:** Monetize speaking engagements or custom soundscapes by offering fixed introductory sponsors slots on digital directories.`;
        } else if (query.includes('video') || query.includes('youtube') || query.includes('tiktok') || query.includes('stream') || query.includes('twitch') || query.includes('channel')) {
          fallbackText = `### 📹 High-Impact Video Creator Revenue Roadmap

Modern video monetization goes beyond baseline platform CPM rates:

1. **Strategic Redirect Portals:** Drive viewers from video description links to a landing page embedded with custom **Nexora Banner Ads** and AdSense slots to monetize web traffic.
2. **Curated Brand Integrations:** Align with specific services relevant to your audience niche (e.g. creators tools, tech channels) and negotiate high flat-fee 30-second video sponsor spots.
3. **Affiliate Endorsements:** Maintain a detailed kit of links showcasing the recording hardware and software tools you use to earn direct referral fees.
4. **Channel Community Clubs:** Gate premium discussion boards, bonus outtakes, or early stream releases using reliable recurring supporter subscription tiers.`;
        } else if (query.includes('app') || query.includes('saas') || query.includes('software') || query.includes('code') || query.includes('utility') || query.includes('site')) {
          fallbackText = `### 💻 Digital Tools & Software-as-a-Service (SaaS)

Software structures command some of the highest monetization multipliers online:

1. **Freemium Utility Tiers:** Retain standard tool functions for free to drive massive user adoption, and key-lock high-capacity integrations or premium exports behind monthly/annual Pro subscriptions.
2. **Streamlined Transaction Processing:** Eliminate local user setup friction by adding direct credit card and custom mobile billing flows (like Airtel Money/PayPal).
3. **Peripheral Display Injections:** Place fast, clean web banners in processing pages or output screens where user attention is concentrated to subsidize server compute costs.
4. **Metered API Subscriptions:** Offer developers dedicated developer keys to query your data or models, billed directly on active call volumes.`;
        } else if (query.includes('sponsor') || query.includes('brand') || query.includes('partner') || query.includes('partnership') || query.includes('collab')) {
          fallbackText = `### 🤝 Designing Dynamic Brand Sponsorship Packages

Attract big partners by shifting focus from sheer follower counts to targeted high engagement:

1. **Develop a Professional Media Kit:** Package absolute metrics such as page visits, Click-Through-Rates (CTR), and viewer locations into a clean layout.
2. **Flat Flatbook Placements:** Sell prime real estate spots (example: prominent header spots) for predictable flat monthly rates rather than low CPC auctions.
3. **Introductory Test Flights:** Offer a brief 10-day pilot run to highly aligned companies. Prove immediate refer rates, then upsell them into custom annual retainer contracts.
4. **Affiliate Overlays:** Negotiate performance-based bonuses alongside flat rates to build strong, reciprocal relationships.`;
        } else if (query.includes('sub') || query.includes('subscription') || query.includes('members') || query.includes('recurring') || query.includes('tier') || query.includes('billing')) {
          fallbackText = `### 💳 Structuring Elite Recurring Member Tiers

Recurring membership is the safest financial anchor for any modern digital business:

1. **The Classic Three-Level Funnel:**
   - **Level 1 (Free / Public):** Broad access, standard platform tools, passive advertising.
   - **Level 2 (Pro / Support at $10-15/mo):** Ad-free navigation, deep analytics tools, high resolution downloads, premium templates.
   - **Level 3 (Private / VIP access at $50+/mo):** Custom monthly critiques, priority queue voting, direct chat access.
2. **Locked Discord/Telegram Zones:** Funnel subscription payers immediately into cozy private discussion chats to drive organic retention.
3. **Curated Premium Content Bulletins:** Distribute direct exclusive industry analyses or strategies directly to subscriber email lists.`;
        } else {
          fallbackText = `### 🚀 Global Digital Monetization Playbook (Nexora AI)

Welcome to your dedicated **Nexora Monetize** strategy consultation. To build durable, compound revenue flows for your digital assets, embrace this fundamental plan:

1. **Implement the Three-Core Stream Plan:**
   - **Passive Advertising:** Serve responsive Google AdSense or Nexora web banners on high-traffic presentation pages to capture passive, consistent monetization.
   - **Direct Support Loops:** Install customized checkout scripts (such as Airtel/PayPal modules) to let dedicated users directly support launch rollouts.
   - **Recurring Subscription Tiers:** Secure periodic support streams by grouping premium features, templates, or consulting spaces behind monthly Pro clubs.
2. **Next Steps inside the Platform:**
   - Copy high-performance ad-unit code templates from the **Admin Centre** to embed in your external blog posts or application frames.
   - Refine your traffic assumptions using our **Instant Income Estimator** on the Home dashboard to set optimal subscription and marketing tier costs.

*Note: The AI advisor is actively executing in offline-safe fallback mode designed specifically for the itch.io HTML5 environment.*`;
        }
      }

      const modelMsg: ChatMessage = {
        id: `msg_model_${Date.now()}`,
        role: 'model',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };

      setActiveMessages(prev => [...prev, modelMsg]);

      if (subscription === 'free') {
        const nextCount = chatCount + 1;
        setChatCount(nextCount);
        localStorage.setItem('nexora_free_advisor_count', String(nextCount));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActiveChat = () => {
    if (activeMessages.length === 0) return;

    // Create custom title based on early queries
    const firstUserQuery = activeMessages.find(m => m.role === 'user')?.text || 'Bespoke Strategy Thread';
    const cleanTitle = firstUserQuery.length > 35 ? firstUserQuery.substring(0, 32) + '...' : firstUserQuery;

    const threadToSave: SavedChat = {
      id: activeChatId || `chat_${Date.now().toString(36)}`,
      title: cleanTitle,
      messages: activeMessages,
      updatedAt: new Date().toLocaleString()
    };

    onSaveChatThread(threadToSave);
    setSaveNotifier(true);
    setTimeout(() => setSaveNotifier(false), 2000);
  };

  return (
    <div className="text-gray-105 font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
      
      {/* Dynamic List of Saved Chats (Left Sidebar) */}
      <div className="lg:col-span-4 bg-[#111319]/90 border border-white/5 p-6 rounded-2xl space-y-6 h-[580px] overflow-y-auto flex flex-col justify-between font-sans">
        <div className="space-y-4 font-mono text-xs">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-400" /> {t('chat.saved.title')}
          </h3>

          {savedChats.length === 0 ? (
            <div className="text-center py-10 bg-slate-950/40 border border-white/5 rounded-xl font-sans">
              <MessageSquare className="w-8 h-8 text-indigo-500/50 mx-auto mb-2.5" />
              <p className="text-[11px] text-slate-550 font-mono">{t('chat.saved.empty1')}</p>
              <p className="text-[10px] text-slate-600 mt-1 pb-1">{t('chat.saved.empty2')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectSavedChat(chat)}
                  className={`w-full text-left p-3 rounded-xl border flex flex-col gap-1 transition-all group relative cursor-pointer ${
                    activeChatId === chat.id
                      ? 'bg-indigo-500/10 border-indigo-505/30'
                      : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="text-xs font-bold text-white block truncate pr-5 font-sans group-hover:text-indigo-305 transition-colors">
                    {chat.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-505">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>{chat.updatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/5">
          <button 
            type="button"
            onClick={() => { setActiveMessages([]); }}
            className="w-full py-2.5 bg-slate-950 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 text-[10px] font-bold font-mono transition-all rounded-full text-center flex items-center justify-center gap-1 cursor-pointer border border-white/5"
          >
            <Trash2 className="w-3.5 h-3.5" /> {t('chat.action.clear')}
          </button>
        </div>
      </div>

      {/* Main Chat Hub Window */}
      <div className="lg:col-span-8 bg-[#111319]/90 border border-white/5 rounded-2xl h-[580px] overflow-hidden flex flex-col justify-between relative shadow-xl font-sans">
        
        {/* Chat window Header */}
        <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-sans flex items-center gap-1.5 font-sans">
                {t('chat.hub.title')} <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[8px] font-bold text-indigo-400 font-mono">Gemini Active</span>
              </h4>
              <p className="text-[10px] text-slate-500">{t('chat.hub.tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[9px]">
            {subscription === 'free' && (
              <span className="text-[9px] px-2.5 py-1 rounded bg-indigo-550/10 text-indigo-400 font-bold uppercase tracking-wider animate-pulse">
                {chatCount}/3 {language === 'fr' ? 'Consultations consommées' : 'Consults used'}
              </span>
            )}
            <button
              onClick={handleSaveActiveChat}
              disabled={activeMessages.length === 0}
              className={`px-3 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMessages.length === 0
                  ? 'bg-[#14171D] text-slate-600 border border-white/5 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              <Save className="w-3.5 h-3.5" /> {saveNotifier ? t('chat.hub.saved') : t('chat.hub.save')}
            </button>
          </div>
        </div>

        {/* Free Limits Banner Gating Overlay */}
        {isFreeTierExceeded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[5px] z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500 flex items-center justify-center text-indigo-400 mb-4">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-white font-sans">{t('chat.gate.title')}</h4>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mb-6 leading-relaxed">
              {t('chat.gate.desc')}
            </p>
            <div className="p-3 bg-[#111319] border border-white/5 rounded-lg text-[10px] text-left text-amber-500 font-mono mb-6 flex items-start gap-2 max-w-xs leading-normal">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{t('chat.gate.prompt')}</span>
            </div>
          </div>
        )}

        {/* Channels Message Stream List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans bg-slate-955/35">
          
          {activeMessages.length === 0 ? (
            <div className="text-center py-10 max-w-md mx-auto space-y-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-sans">{t('chat.welcome.title')}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-sans">
                  {t('chat.welcome.desc')}
                </p>
              </div>

              {/* Starter suggested pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2 font-sans">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.text)}
                    className="p-3 rounded-lg bg-slate-900 border border-white/5 hover:border-indigo-500/25 text-left transition-all hover:bg-slate-950 text-[10px] text-slate-400 hover:text-white leading-relaxed cursor-pointer"
                  >
                    <strong className="text-indigo-400 font-bold block mb-0.5">{p.label}</strong>
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-sans">
              {activeMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs border ${
                    msg.role === 'user'
                      ? 'bg-indigo-650 text-white border-indigo-450/35'
                      : 'bg-slate-900 text-indigo-400 border-white/5'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-xl text-xs space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-indigo-500/10 border border-indigo-500/15 text-slate-200'
                      : 'bg-slate-900 text-slate-300 leading-relaxed'
                  }`}>
                    <div className="whitespace-pre-wrap select-text">{msg.text}</div>
                    <span className="block text-right text-[9px] text-slate-500 mt-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-[#14171D] border border-white/5 text-indigo-400 flex items-center justify-center text-xs">
                    <Cpu className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div className="p-4 rounded-xl bg-[#14171D] border border-white/5 text-slate-400 text-xs italic font-mono">
                    {t('chat.sending')}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/15 rounded text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Input box section */}
        <div className="p-4 bg-slate-950 border-t border-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              disabled={loading || isFreeTierExceeded}
              placeholder={isFreeTierExceeded ? t('chat.placeholder_limit') : t('chat.placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#14171D] text-white text-xs px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-indigo-500 placeholder-slate-500 disabled:cursor-not-allowed disabled:bg-slate-950 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || isFreeTierExceeded}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                !input.trim() || loading || isFreeTierExceeded
                  ? 'bg-slate-900 text-slate-605 border border-white/5 disabled:cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
