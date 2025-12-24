
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, StopCircle, RotateCw, Cpu, Activity, 
  ImageIcon, Maximize2, Minimize2, Microscope, Code, 
  Zap, Share2, Terminal, Info, ChevronDown
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
  const [xrayActive, setXrayActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryStep[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `SECURE_LINK: ${bot.name.toUpperCase()} OPERATIONAL.\n\n[ENGINE]: ${bot.model_config.primary_model.toUpperCase()}\n[MODALITY]: ${bot.image_gen_config.enabled ? 'MULTIMODAL_ENABLED' : 'TEXT_ONLY'}`,
        timestamp: Date.now()
      }]);
    }
  }, [bot.name]);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isTyping) return;

    setCurrentTelemetry([]);
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true }]);

    try {
      const response = await ModelRouter.chatStream(
        bot, 
        messages, 
        textToSend, 
        (fullText) => {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
        },
        (step) => setCurrentTelemetry(prev => [...prev, step])
      );

      setMessages(prev => prev.map(m => m.id === botMsgId ? { 
        ...m, 
        content: response.content,
        image_url: response.image_url,
        thinking_log: response.thinking_log,
        tokens: response.tokens,
        artifacts: response.artifacts,
        isStreaming: false
      } : m));

      if (response.artifacts) setActiveArtifacts(response.artifacts);
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: `CRITICAL_ERROR: ${err.message}`, isStreaming: false } : m));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col bg-[#020617]/90 backdrop-blur-3xl overflow-hidden relative transition-all duration-700 ${isExpanded ? 'fixed inset-0 z-[1000] m-0 rounded-none' : 'rounded-[2.5rem] border border-white/5 h-full'} ${className}`}>
      {/* Expanded Mode Logic handled by fixed positioning */}
      
      <header className="px-8 py-5 border-b border-white/5 bg-slate-900/60 flex items-center justify-between z-20">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
             <Cpu size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-white tracking-[0.2em] uppercase flex items-center gap-2">
              {bot.name} <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></div>
            </h3>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{bot.model_config.primary_model}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setXrayActive(!xrayActive)} className={`p-2.5 rounded-xl border transition-all ${xrayActive ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}>
            <Microscope size={16} />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setMessages([])} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-blue-400 transition-all">
            <RotateCw size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`w-full ${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                <div className={`flex items-center gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{msg.role === 'user' ? 'OPERATOR' : 'NEURAL_UNIT'}</span>
                </div>
                <div className={`p-6 rounded-3xl border shadow-2xl ${msg.role === 'user' ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'bg-white/[0.03] border-white/10 text-slate-200'}`}>
                  <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-mono prose prose-invert">
                    {msg.content}
                  </div>
                  {msg.image_url && (
                    <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                       <img src={msg.image_url} alt="Generated Asset" className="w-full h-auto" />
                    </div>
                  )}
                  {msg.artifacts && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {msg.artifacts.map(art => (
                        <button key={art.id} onClick={() => setActiveArtifacts(msg.artifacts!)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-400 shadow-xl flex items-center gap-2">
                           <Code size={14} /> View Artifact
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
               <div className="bg-blue-600/10 border border-blue-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
                 <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div></div>
                 <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Processing Neural Weights...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {xrayActive && (
          <div className="w-[450px] border-l border-white/5 bg-slate-950/60 backdrop-blur-3xl animate-in slide-in-from-right-full duration-700">
            <XRayVision telemetry={currentTelemetry} thinking={messages[messages.length-1]?.thinking_log} />
          </div>
        )}
      </div>

      <footer className="p-8 bg-slate-900/60 border-t border-white/5">
        <div className="flex items-center gap-5">
          <button className="p-4 rounded-2xl bg-white/5 text-slate-600 hover:text-white transition-all border border-white/5"><Paperclip size={20} /></button>
          <div className="flex-1 relative">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={readOnly || isTyping}
              placeholder="Inject command sequence..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 text-[14px] font-mono text-white placeholder:text-slate-800 outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`p-4.5 rounded-2xl transition-all shadow-xl border ${isTyping ? 'bg-rose-600 text-white animate-pulse border-rose-400' : 'bg-blue-600 text-white hover:bg-blue-500 border-blue-400'}`}
          >
            {isTyping ? <StopCircle size={22} /> : <Send size={22} />}
          </button>
        </div>
      </footer>

      {activeArtifacts && <ArtifactPane artifacts={activeArtifacts} onClose={() => setActiveArtifacts(null)} />}
    </div>
  );
}
