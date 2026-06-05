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
      console.error(err);
      setErrorMessage(err.message || "Network exception occurred while communicating with Nexora AI.");
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
