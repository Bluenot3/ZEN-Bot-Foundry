
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, StopCircle, RefreshCw, Terminal, Box, 
  Play, Users, GitBranch, CheckCircle, Info, BrainCircuit, 
  ChevronDown, ChevronUp, Sparkles, Cpu, Activity, ShieldAlert,
  Copy, Share2, MoreHorizontal, Maximize2, Hash, Zap, 
  Hash as HashIcon, Type, BarChart3, RotateCw, BookOpen, Search,
  Fingerprint, Microscope, Radio, History, Workflow, Eye, ImageIcon
} from 'lucide-react';
import { BotConfig, Message, Artifact, TelemetryStep } from '../types';
import { ModelRouter } from '../services/llm';
import ArtifactPane from './ArtifactPane';
import XRayVision from './XRayVision';

interface ChatInterfaceProps {
  bot: BotConfig;
  className?: string;
  readOnly?: boolean;
}

export default function ChatInterface({ bot, className = '', readOnly = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeArtifacts, setActiveArtifacts] = useState<Artifact[] | null>(null);
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});
  const [xrayActive, setXrayActive] = useState(bot.features.xray_vision);
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryStep[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, currentTelemetry]);

  // Handle re-initialization or bot name/directive updates
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `UPLINK_SECURE: ${bot.name || 'NEW_MANIFEST'} INITIALIZED.\n\nDIRECTIVE: ${bot.description || 'Awaiting operational tasks.'}\n\n[NEURAL_ENGINE]: ${bot.model_config.primary_model.toUpperCase()}\n[IMAGE_GEN]: ${bot.image_gen_config.enabled ? 'ACTIVE' : 'OFFLINE'}\n\nSYSTEM_STATUS: NOMINAL`,
        timestamp: Date.now()
      }]);
    } else {
      // Update existing init message if bot name changes during setup
      setMessages(prev => prev.map(m => m.id === 'init' ? {
        ...m,
        content: `UPLINK_SECURE: ${bot.name || 'NEW_MANIFEST'} INITIALIZED.\n\nDIRECTIVE: ${bot.description || 'Awaiting operational tasks.'}\n\n[NEURAL_ENGINE]: ${bot.model_config.primary_model.toUpperCase()}\n[IMAGE_GEN]: ${bot.image_gen_config.enabled ? 'ACTIVE' : 'OFFLINE'}\n\nSYSTEM_STATUS: NOMINAL`
      } : m));
    }
    setXrayActive(bot.features.xray_vision);
  }, [bot.name, bot.model_config.primary_model, bot.image_gen_config.enabled, bot.features.xray_vision]);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isTyping) return;

    setCurrentTelemetry([]);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botMsgId = crypto.randomUUID();
    const botMsg: Message = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model_used: bot.model_config.primary_model,
      isStreaming: true
    };
    setMessages(prev => [...prev, botMsg]);

    try {
      const response = await ModelRouter.chatStream(
        bot, 
        messages, 
        textToSend, 
        (fullText) => {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
        },
        (step) => {
          setCurrentTelemetry(prev => [...prev, step]);
        }
      );

      setMessages(prev => prev.map(m => m.id === botMsgId ? { 
        ...m, 
        content: response.content,
        image_url: response.image_url,
        thinking_log: response.thinking_log,
        tokens: response.tokens,
        artifacts: response.artifacts,
        isStreaming: false,
        telemetry: currentTelemetry
      } : m));

      if (response.artifacts) setActiveArtifacts(response.artifacts);
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? {
        ...m,
        content: `CRITICAL_ERROR: SIGNAL_TERMINATED. ${err.message}`,
        isStreaming: false
      } : m));
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className={`flex flex-col h-full bg-[#020617]/40 backdrop-blur-3xl overflow-hidden relative rounded-3xl border border-white/5 ${className}`}>
      {/* High-Fidelity Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
             <Cpu size={18} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-[12px] font-black text-white tracking-widest uppercase flex items-center gap-2">
              {bot.name || 'NEW_NODE'}
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </h3>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                 <Zap size={10} className="text-blue-500" /> {bot.model_config.primary_model}
               </span>
               <span className="w-px h-2 bg-white/10"></span>
               <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                 <ImageIcon size={10} className={bot.image_gen_config.enabled ? "text-cyan-400" : "text-slate-700"} /> IMG_{bot.image_gen_config.enabled ? 'ON' : 'OFF'}
               </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setXrayActive(!xrayActive)} 
            className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${xrayActive ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-blue-400'}`} 
            title="X-Ray Vision"
          >
            <Microscope size={14} />
            <span className="text-[8px] font-black uppercase tracking-widest">X_RAY</span>
          </button>
          <button onClick={() => setMessages([])} className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-blue-400 transition-all" title="Reset Session">
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Feed */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative transition-all duration-500`}>
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`w-full ${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[90%]'}`}>
                
                <div className={`flex items-center gap-3 mb-2 px-1 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                   <span className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-blue-400' : 'text-slate-500'}`}>
                     {msg.role === 'user' ? 'OPERATOR' : 'NEURAL_NODE'}
                   </span>
                   <div className="h-px flex-1 bg-white/[0.03]"></div>
                </div>

                <div className={`group relative p-5 rounded-2xl border shadow-xl transition-all ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 border-blue-500/30 text-white ml-auto' 
                    : 'bg-white/[0.02] text-slate-200 border-white/5'
                }`}>
                  <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-mono prose prose-invert max-w-none">
                    {msg.content}
                  </div>

                  {msg.image_url && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-700">
                       <img src={msg.image_url} alt="Generated Neural Asset" className="w-full h-auto object-cover max-h-[500px]" />
                       <div className="p-3 bg-black/60 flex justify-between items-center border-t border-white/5">
                          <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">DIFFUSION_MANIFEST_SUCCESS</span>
                          <button 
                            onClick={() => {
                               const a = document.createElement('a');
                               a.href = msg.image_url!;
                               a.download = `zen_gen_${Date.now()}.png`;
                               a.click();
                            }}
                            className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors"
                          >
                             <Share2 size={12} />
                          </button>
                       </div>
                    </div>
                  )}
                  
                  {/* Stats & Tools */}
                  {!msg.isStreaming && msg.role === 'assistant' && (
                    <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-[8px] font-mono text-slate-600 uppercase font-bold">
                      <div className="flex items-center gap-1.5"><HashIcon size={10} className="text-blue-500" /> {Math.ceil(msg.tokens || 0)} TKNS</div>
                      <div className="flex items-center gap-1.5"><Fingerprint size={10} className="text-blue-500" /> {msg.model_used || bot.model_config.primary_model}</div>
                    </div>
                  )}

                  {/* Artifacts */}
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {msg.artifacts.map(art => (
                        <button key={art.id} onClick={() => setActiveArtifacts(msg.artifacts || null)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border border-blue-400">
                          <Play size={10} fill="currentColor" /> RUN_{art.language.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-2xl">
                 <div className="flex gap-1"><div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div></div>
                 <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">SYNTHESIZING_SIGNAL...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* X-Ray Display Column */}
        {xrayActive && (
          <div className="w-96 border-l border-white/5 bg-slate-950/60 backdrop-blur-xl animate-in slide-in-from-right-full duration-500 overflow-y-auto no-scrollbar">
            <XRayVision telemetry={currentTelemetry} thinking={messages[messages.length-1]?.thinking_log} />
          </div>
        )}
      </div>

      {/* Input Module */}
      <div className="p-6 bg-slate-900/60 border-t border-white/5">
        <div className="flex items-center gap-3">
          <button className="p-3.5 rounded-xl bg-white/5 text-slate-600 hover:text-white transition-all border border-white/5"><Paperclip size={18} /></button>
          <div className="flex-1 relative">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={readOnly || isTyping}
              placeholder="Inject neural directive..."
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-[13px] font-mono text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => isTyping ? null : handleSend()}
            disabled={!input.trim() || readOnly}
            className={`p-3.5 rounded-xl transition-all active:scale-95 border ${isTyping ? 'bg-rose-600 text-white animate-pulse border-rose-400' : 'bg-blue-600 text-white hover:bg-blue-500 border-blue-400 shadow-xl'}`}
          >
            {isTyping ? <StopCircle size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {activeArtifacts && <ArtifactPane artifacts={activeArtifacts} onClose={() => setActiveArtifacts(null)} />}
    </div>
  );
}
