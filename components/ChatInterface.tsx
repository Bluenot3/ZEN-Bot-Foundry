
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
  
  // Theme Extraction
  const theme = bot.theme_config || {
     primary_color: '#3b82f6',
     secondary_color: '#1e293b',
     font_family: 'Inter',
     background_style: 'glass',
     button_style: 'rounded',
     message_bubble_style: 'modern',
     light_mode: false
  };

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

      if (response.artifacts && response.artifacts.length > 0 && response.content.length > 100) {
        setActiveArtifacts(response.artifacts);
      }
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: `CRITICAL_ERROR: ${err.message}`, isStreaming: false } : m));
    } finally {
      setIsTyping(false);
    }
  };

  // --- Aesthetic Helpers ---
  const getBubbleStyle = (role: 'user' | 'assistant') => {
    const base = `p-6 transition-all border shadow-2xl `;
    const shape = theme.message_bubble_style === 'modern' ? 'rounded-3xl' 
                  : theme.message_bubble_style === 'classic' ? 'rounded-lg' 
                  : 'rounded-none border-l-4';
    
    if (role === 'user') {
      return `${base} ${shape} ` + (theme.light_mode ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-white border-white/20');
    }
    return `${base} ${shape} ` + (theme.light_mode ? 'bg-white text-slate-800' : 'bg-[#0a0f1e] text-slate-200 border-white/10');
  };

  const getButtonStyle = () => {
     switch (theme.button_style) {
        case 'sharp': return 'rounded-none';
        case 'pill': return 'rounded-full';
        default: return 'rounded-2xl';
     }
  };

  return (
    <div 
      className={`flex flex-col overflow-hidden relative transition-all duration-700 ${isExpanded ? 'fixed inset-0 z-[1000] m-0 rounded-none' : 'rounded-[2.5rem] border border-white/10 h-full'} ${className}`}
      style={{ 
         fontFamily: theme.font_family,
         backgroundColor: theme.background_style === 'glass' ? '#020617' : theme.secondary_color
      }}
    >
      
      {/* Dynamic Background */}
      {theme.background_style === 'glass' && <div className="absolute inset-0 bg-[#020617] backdrop-blur-3xl z-0"></div>}
      {theme.background_style === 'mesh' && (
         <div className="absolute inset-0 opacity-20 z-0" 
              style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.primary_color} 0%, transparent 50%)` }}>
         </div>
      )}

      <header className="px-8 py-5 border-b border-white/5 bg-slate-900/40 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: theme.primary_color }}>
             <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-[13px] font-black tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: theme.light_mode ? '#000' : '#fff' }}>
              {bot.name} <div className="w-2 h-2 rounded-full status-pulse" style={{ backgroundColor: theme.primary_color }}></div>
            </h3>
            <span className="text-[9px] font-mono uppercase tracking-widest opacity-50" style={{ color: theme.light_mode ? '#333' : '#ccc' }}>{bot.model_config.primary_model}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setXrayActive(!xrayActive)} className={`p-2.5 ${getButtonStyle()} border transition-all ${xrayActive ? 'text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`} style={{ backgroundColor: xrayActive ? theme.primary_color : undefined }}>
            <Microscope size={16} />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2.5 ${getButtonStyle()} bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all`}>
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setMessages([])} className={`p-2.5 ${getButtonStyle()} bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 transition-all`}>
            <RotateCw size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`w-full ${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                <div className={`flex items-center gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                   <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.primary_color }}>{msg.role === 'user' ? 'OPERATOR' : 'NEURAL_UNIT'}</span>
                </div>
                <div 
                  className={getBubbleStyle(msg.role)}
                  style={msg.role === 'user' ? { backgroundColor: `${theme.primary_color}20`, borderColor: `${theme.primary_color}40` } : {}}
                >
                  <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-mono prose prose-invert max-w-none">
                    {msg.content}
                  </div>
                  {msg.image_url && (
                    <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-lg">
                       <img src={msg.image_url} alt="Generated Asset" className="w-full h-auto" />
                    </div>
                  )}
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {msg.artifacts.map(art => (
                        <button key={art.id} onClick={() => setActiveArtifacts(msg.artifacts!)} className={`px-5 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl flex items-center gap-2 hover:bg-white/10 transition-all`} style={{ color: theme.primary_color }}>
                           <Code size={14} /> VIEW_COMPONENT: {art.title}
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
               <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                 <div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary_color }}></div><div className="w-1.5 h-1.5 rounded-full animate-bounce delay-75" style={{ backgroundColor: theme.primary_color }}></div><div className="w-1.5 h-1.5 rounded-full animate-bounce delay-150" style={{ backgroundColor: theme.primary_color }}></div></div>
                 <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.primary_color }}>Processing...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {xrayActive && (
          <div className="w-[450px] border-l border-white/5 bg-slate-950/80 backdrop-blur-3xl animate-in slide-in-from-right-full duration-700 shadow-2xl">
            <XRayVision telemetry={currentTelemetry} thinking={messages[messages.length-1]?.thinking_log} />
          </div>
        )}
      </div>

      <footer className="p-8 bg-slate-900/40 backdrop-blur-md border-t border-white/5 z-20">
        <div className="flex items-center gap-5">
          <button className={`p-4 ${getButtonStyle()} bg-white/5 text-slate-600 hover:text-white transition-all border border-white/5 hover:border-white/20`}><Paperclip size={20} /></button>
          <div className="flex-1 relative group">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={readOnly || isTyping}
              placeholder="Inject command sequence..."
              className={`w-full bg-black/40 border border-white/10 ${getButtonStyle()} px-6 py-4.5 text-[14px] font-mono text-white placeholder:text-slate-700 outline-none transition-all shadow-inner group-hover:bg-black/60`}
              style={{ caretColor: theme.primary_color }}
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`p-4.5 ${getButtonStyle()} transition-all shadow-xl border border-transparent`}
            style={{ backgroundColor: isTyping ? undefined : theme.primary_color, color: isTyping ? theme.primary_color : '#fff' }}
          >
            {isTyping ? <StopCircle size={22} className="animate-pulse" /> : <Send size={22} />}
          </button>
        </div>
      </footer>

      {activeArtifacts && <ArtifactPane artifacts={activeArtifacts} onClose={() => setActiveArtifacts(null)} />}
    </div>
  );
}
