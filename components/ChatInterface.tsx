
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, StopCircle, RefreshCw, Terminal, Box, Play, Users, GitBranch, CheckCircle, Info } from 'lucide-react';
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `UPLINK_ESTABLISHED: ${bot.name} READY.\n\nOBJECTIVE: ${bot.description}\n\nDIRECTIVE: High-fidelity neural link established. Features: ${bot.features.dual_response_mode ? 'Dual-Response Mode Active' : 'Standard Logic'}.`,
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
        content: `ALERT: Signal degradation detected. Recovery failed.`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const selectVariant = (msgId: string, variant: 'A' | 'B') => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, selected_variant: variant } : m));
  };

  return (
    <div className={`flex flex-col h-full bg-white/40 backdrop-blur-3xl overflow-hidden relative rounded-[2.5rem] shadow-2xl border border-white/50 ${className}`}>
      {/* Header */}
      <div className="px-8 py-5 border-b border-white/50 bg-white/60 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
             <Terminal size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-slate-900 tracking-tight uppercase">{bot.name} Workspace</h3>
            <div className="flex items-center gap-2 mt-0.5">
               <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                 {isTyping ? 'Synthesizing Path' : 'Neural Stable'}
                 {currentModel && <span className="ml-3 opacity-60">Node: {currentModel}</span>}
               </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {bot.features.multi_agent_consult && (
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
               <Users size={14} className="text-slate-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase">Consult Mode ON</span>
             </div>
          )}
          {activeArtifacts && (
            <button 
              onClick={() => setActiveArtifacts(null)}
              className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Box size={16} />
            </button>
          )}
          <button onClick={() => setMessages([])} className="p-3 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar relative">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
            <div className={`w-full max-w-[90%] space-y-4`}>
              {/* Consultation Logs */}
              {msg.consultation_log && (
                <div className="flex flex-col gap-1 mb-2 px-6">
                  {msg.consultation_log.map((log, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                       <Info size={10} /> {log}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mb-1 px-4">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-blue-600' : 'text-slate-400'}`}>
                   {msg.role === 'user' ? 'Operator' : msg.role === 'system' ? 'System Warning' : bot.name}
                 </span>
                 <div className="h-px w-6 bg-slate-100"></div>
              </div>

              {/* Dual Response UI */}
              {msg.dual_content ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Variant A */}
                  <div className={`p-6 rounded-[1.75rem] border transition-all ${msg.selected_variant === 'A' ? 'bg-white shadow-xl border-blue-200 ring-2 ring-blue-500/20' : 'bg-white/50 border-slate-100 opacity-60 hover:opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Neural Path A // TECHNICAL</span>
                      {msg.selected_variant === 'A' && <CheckCircle size={14} className="text-blue-500" />}
                    </div>
                    <div className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap text-slate-700">{msg.content}</div>
                    <button 
                      onClick={() => selectVariant(msg.id, 'A')}
                      className={`mt-6 w-full py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${msg.selected_variant === 'A' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {msg.selected_variant === 'A' ? 'Path Selected' : 'Select Path A'}
                    </button>
                  </div>
                  {/* Variant B */}
                  <div className={`p-6 rounded-[1.75rem] border transition-all ${msg.selected_variant === 'B' ? 'bg-white shadow-xl border-blue-200 ring-2 ring-blue-500/20' : 'bg-white/50 border-slate-100 opacity-60 hover:opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Neural Path B // CREATIVE</span>
                      {msg.selected_variant === 'B' && <CheckCircle size={14} className="text-blue-500" />}
                    </div>
                    <div className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap text-slate-700">{msg.dual_content}</div>
                    <button 
                      onClick={() => selectVariant(msg.id, 'B')}
                      className={`mt-6 w-full py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${msg.selected_variant === 'B' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {msg.selected_variant === 'B' ? 'Path Selected' : 'Select Path B'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-[1.75rem] shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20' 
                    : msg.role === 'system'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-white text-slate-700 border-white/80 shadow-slate-200/50'
                }`}>
                  <div className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {msg.artifacts.map(art => (
                        <button 
                          key={art.id}
                          onClick={() => setActiveArtifacts(msg.artifacts || null)}
                          className="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all font-bold text-[12px] uppercase tracking-widest group shadow-sm"
                        >
                          <Play size={14} className="fill-current" />
                          Launch Integrated Preview
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
             <div className="flex items-center gap-5 py-4 px-8 rounded-full bg-white/80 border border-white shadow-lg">
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
               <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Neural Link Processing</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 bg-white/60 border-t border-white/50">
        <div className="flex items-center gap-4">
          <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white transition-all border border-slate-100">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={readOnly || isTyping}
              placeholder={readOnly ? "Terminal Locked" : "Inject neural prompt..."}
              className="w-full mil-input px-8 py-5 text-[15px] font-medium placeholder:text-slate-300 shadow-inner"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || readOnly || isTyping}
            className={`p-5 rounded-2xl transition-all shadow-xl active:scale-90 ${
              isTyping ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isTyping ? <StopCircle size={22} /> : <Send size={22} />}
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
