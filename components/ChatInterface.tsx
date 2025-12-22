
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, StopCircle, RefreshCw, Terminal, Box, 
  Play, Users, GitBranch, CheckCircle, Info, BrainCircuit, 
  ChevronDown, ChevronUp, Sparkles, Cpu, Activity, ShieldAlert
} from 'lucide-react';
import { BotConfig, Message, Artifact } from '../types';
import { ModelRouter } from '../services/llm';
import ArtifactPane from './ArtifactPane';

interface ChatInterfaceProps {
  bot: BotConfig;
  className?: string;
  readOnly?: boolean;
}

export default function ChatInterface({ bot, className = '', readOnly = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [activeArtifacts, setActiveArtifacts] = useState<Artifact[] | null>(null);
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `UPLINK_SECURE: ${bot.name} INITIALIZED.\n\nDIRECTIVE: ${bot.description || 'Awaiting task parameters.'}\n\nSTRATEGY: ${bot.workflow.planning_strategy.toUpperCase()}_MODE\nREASONING_BUDGET: ${bot.model_config.thinking_budget} TKNS\n\nSYSTEM STATUS: ALL_SYSTEMS_NOMINAL`,
        timestamp: Date.now()
      }]);
    }
  }, [bot]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await ModelRouter.chat(bot, messages, currentInput);
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        dual_content: response.dual_content,
        consultation_log: response.consultation_log,
        thinking_log: response.thinking_log,
        timestamp: Date.now(),
        model_used: response.model_used,
        tokens: response.tokens,
        artifacts: response.artifacts
      };
      
      setMessages(prev => [...prev, botMsg]);
      setCurrentModel(response.model_used);
      
      if (response.artifacts) {
        setActiveArtifacts(response.artifacts);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'system',
        content: `CRITICAL ERROR: SIGNAL_INTERFERENCE_DETECTED. RECOVERY_MODE_FAILED.`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const selectVariant = (msgId: string, variant: 'A' | 'B') => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, selected_variant: variant } : m));
  };

  const toggleThinking = (id: string) => {
    setShowThinking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950/50 backdrop-blur-3xl overflow-hidden relative rounded-3xl border border-white/5 ${className}`}>
      {/* Tactical Header */}
      <div className="px-8 py-4 border-b border-white/5 bg-slate-900/40 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
             <Terminal size={18} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-slate-100 tracking-widest uppercase">{bot.name}</h3>
            <div className="flex items-center gap-3 mt-1">
               <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
               <span className="text-[9px] font-mono font-bold text-slate-500 tracking-widest uppercase">
                 {isTyping ? 'SYNTHESIZING_RESPONSE' : 'IDLE_NOMINAL'}
                 {currentModel && <span className="ml-3 text-blue-500/60">NODE: {currentModel}</span>}
               </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {bot.features.multi_agent_consult && (
             <div className="hidden md:flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
               <Users size={12} className="text-blue-400" />
               <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">SWARM_UP</span>
             </div>
          )}
          <button onClick={() => setMessages([])} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-slate-100 transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`w-full ${msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[95%]'} space-y-4`}>
              
              {/* Meta info */}
              <div className={`flex items-center gap-3 mb-1 px-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <span className={`text-[9px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-blue-400' : 'text-slate-500'}`}>
                   {msg.role === 'user' ? 'OPERATOR' : msg.role === 'system' ? 'SYS_ALERT' : bot.name.toUpperCase()}
                 </span>
                 <div className="h-px flex-1 bg-white/5"></div>
              </div>

              {/* Consultation Logs */}
              {msg.consultation_log && (
                <div className="flex flex-col gap-1.5 mb-2 px-4">
                  {msg.consultation_log.map((log, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-cyan-500/60 uppercase italic">
                       <Activity size={10} /> {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Recursive Thinking Component */}
              {msg.thinking_log && bot.features.thought_stream_visibility && (
                <div className="mx-4">
                   <button 
                     onClick={() => toggleThinking(msg.id)}
                     className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                   >
                     <BrainCircuit size={12} /> 
                     {showThinking[msg.id] ? 'COLLAPSE_LOGIC' : 'VIEW_REASONING_CHAIN'}
                   </button>
                   {showThinking[msg.id] && (
                     <div className="mt-3 p-4 bg-black/40 border-l-2 border-blue-500/50 rounded-r-xl font-mono text-[11px] text-slate-500 leading-relaxed whitespace-pre-wrap animate-in slide-in-from-top-2">
                        {msg.thinking_log}
                     </div>
                   )}
                </div>
              )}

              {/* Content Bubble */}
              {msg.dual_content ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VariantCard 
                    label="SYNTHESIS_A // ANALYTICAL"
                    content={msg.content}
                    selected={msg.selected_variant === 'A'}
                    onSelect={() => selectVariant(msg.id, 'A')}
                  />
                  <VariantCard 
                    label="SYNTHESIS_B // EXPANSIVE"
                    content={msg.dual_content}
                    selected={msg.selected_variant === 'B'}
                    onSelect={() => selectVariant(msg.id, 'B')}
                  />
                </div>
              ) : (
                <div className={`p-6 rounded-2xl shadow-xl border relative overflow-hidden group ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-500/50 shadow-blue-500/10 ml-auto font-medium' 
                    : msg.role === 'system'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 flex gap-3'
                    : 'bg-white/5 text-slate-200 border-white/5'
                }`}>
                  {msg.role === 'system' && <ShieldAlert size={18} className="shrink-0" />}
                  <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-mono">{msg.content}</div>
                  
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {msg.artifacts.map(art => (
                        <button 
                          key={art.id}
                          onClick={() => setActiveArtifacts(msg.artifacts || null)}
                          className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group"
                        >
                          <Play size={12} className="fill-current" />
                          LAUNCH_PREVIEW
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="flex items-center gap-4 py-3 px-6 rounded-xl bg-white/5 border border-white/5 shadow-2xl">
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">ANALYZING_INPUT</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Module */}
      <div className="p-6 bg-slate-900/60 border-t border-white/5">
        <div className="flex items-center gap-4">
          <button className="p-3.5 rounded-xl bg-white/5 text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-all border border-white/5 shadow-sm">
            <Paperclip size={18} />
          </button>
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={readOnly || isTyping}
              placeholder={readOnly ? "TERMINAL_LOCKED" : "COMMAND_INJECTION_READY..."}
              className="w-full mil-input px-6 py-3.5 text-[14px] font-mono placeholder:text-slate-600 border-white/5 focus:ring-4 ring-blue-500/10 transition-all"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || readOnly || isTyping}
            className={`p-3.5 rounded-xl transition-all active:scale-95 ${
              isTyping ? 'bg-rose-600 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
            }`}
          >
            {isTyping ? <StopCircle size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {activeArtifacts && (
        <ArtifactPane 
          artifacts={activeArtifacts} 
          onClose={() => setActiveArtifacts(null)} 
        />
      )}
    </div>
  );
}

const VariantCard = ({ label, content, selected, onSelect }: any) => (
  <div className={`p-5 rounded-2xl border transition-all relative group ${selected ? 'bg-blue-600/10 shadow-2xl border-blue-500/50' : 'bg-white/[0.03] border-white/5 opacity-60 hover:opacity-100'}`}>
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      {selected && <CheckCircle size={14} className="text-blue-500" />}
    </div>
    <div className="text-[13px] leading-relaxed font-mono text-slate-300">{content}</div>
    <button 
      onClick={onSelect}
      className={`mt-6 w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
    >
      {selected ? 'PATH_CONFIRMED' : 'SELECT_SIGNAL'}
    </button>
  </div>
);
