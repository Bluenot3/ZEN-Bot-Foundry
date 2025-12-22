
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Layers, Palette, Type as TypeIcon, Box, Zap,
  Settings, Save, ArrowLeft, Bot, Wand2, RefreshCw,
  Plus, Trash2, Eye, Layout, Sliders, Activity, Monitor
} from 'lucide-react';
import { ArenaService, BotService } from '../services/store';
import { ModelRouter } from '../services/llm';
import { ArenaConfig, BotConfig, ArenaTheme } from '../types';

export default function ArenaDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [arena, setArena] = useState<ArenaConfig | null>(null);
  const [allBots, setAllBots] = useState<BotConfig[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewBotId, setPreviewBotId] = useState<string | null>(null);

  useEffect(() => {
    setAllBots(BotService.getBots());
    if (id) {
      const existing = ArenaService.getArena(id);
      if (existing) setArena(existing);
      else navigate('/dashboard');
    } else {
      setArena(ArenaService.createEmptyArena());
    }
  }, [id, navigate]);

  const handleAISynthesis = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const theme = await ModelRouter.generateArenaTheme(prompt);
      if (arena) {
        setArena({ ...arena, theme });
      }
    } catch (e) {
      alert("Neural synthesis failed. Check uplink.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateTheme = (updates: Partial<ArenaTheme>) => {
    if (arena) {
      setArena({ ...arena, theme: { ...arena.theme, ...updates } });
    }
  };

  const toggleBotSelection = (botId: string) => {
    if (!arena) return;
    const current = arena.bot_ids || [];
    const updated = current.includes(botId) 
      ? current.filter(b => b !== botId)
      : [...current, botId];
    setArena({ ...arena, bot_ids: updated });
  };

  const saveArena = async () => {
    if (arena) {
      await ArenaService.saveArena(arena);
      navigate('/dashboard');
    }
  };

  if (!arena) return null;

  const currentPreviewBot = allBots.find(b => b.id === (previewBotId || arena.bot_ids[0]));

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 pb-10">
      {/* Designer Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="w-1 h-1 rounded-full bg-blue-500 status-pulse"></div>
               <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Visual Synthesis Core</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{id ? arena.name : 'Forge New Arena'}</h1>
          </div>
        </div>
        <div className="flex gap-3">
           <button onClick={saveArena} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 shadow-xl active:scale-95 border border-white/10">
             <Save size={18} /> Initialize Manifest
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 overflow-hidden">
        {/* Left Control Panel: High-Density Customization */}
        <div className="xl:col-span-4 space-y-6 overflow-y-auto no-scrollbar pr-2">
          {/* AI Vibe Generator */}
          <div className="liquid-glass p-8 rounded-[2rem] space-y-6 border-blue-500/30">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <Wand2 size={18} className="text-blue-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Neural Vibe Synthesis</h3>
            </div>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the vibe... 'Sleek neon cyberpunk with heavy glass blur and vibrant cyan accents'..."
              className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[12px] font-mono text-blue-400 placeholder:text-slate-800 h-24 focus:border-blue-500/30 outline-none resize-none"
            />
            <button 
              onClick={handleAISynthesis}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGenerating ? 'Synthesizing...' : 'Generate AI Theme'}
            </button>
          </div>

          {/* Manual Refinement Hub */}
          <div className="liquid-glass p-8 rounded-[2rem] space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <Palette size={18} className="text-blue-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Global Refinement</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <ControlGroup label="Primary Color">
                  <ColorInput value={arena.theme.primary_color} onChange={(v) => updateTheme({ primary_color: v })} />
               </ControlGroup>
               <ControlGroup label="Secondary Color">
                  <ColorInput value={arena.theme.secondary_color} onChange={(v) => updateTheme({ secondary_color: v })} />
               </ControlGroup>
               <ControlGroup label="Background">
                  <ColorInput value={arena.theme.bg_color} onChange={(v) => updateTheme({ bg_color: v })} />
               </ControlGroup>
               <ControlGroup label="Accent Signal">
                  <ColorInput value={arena.theme.accent_color} onChange={(v) => updateTheme({ accent_color: v })} />
               </ControlGroup>
            </div>

            <ControlGroup label="Neural Typography">
               <select 
                 value={arena.theme.font_family}
                 onChange={(e) => updateTheme({ font_family: e.target.value })}
                 className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-mono text-white outline-none"
               >
                 <option value="Inter">Inter UI (Default)</option>
                 <option value="JetBrains Mono">JetBrains (Technical)</option>
                 <option value="Space Grotesk">Space Grotesk (Modern)</option>
                 <option value="System-ui">System Default</option>
               </select>
            </ControlGroup>

            <div className="space-y-6">
               <SliderControl 
                 label="Radius Intensity" 
                 value={parseInt(arena.theme.border_radius)} 
                 onChange={(v) => updateTheme({ border_radius: `${v}px` })} 
                 max={40} 
               />
               <SliderControl 
                 label="Atmospheric Blur" 
                 value={parseInt(arena.theme.glass_blur)} 
                 onChange={(v) => updateTheme({ glass_blur: `${v}px` })} 
                 max={100} 
               />
            </div>

            <ControlGroup label="Animation Flux">
               <div className="grid grid-cols-2 gap-2">
                 {['none', 'subtle', 'dynamic', 'glitch'].map((s) => (
                   <button 
                     key={s}
                     onClick={() => updateTheme({ animation_style: s as any })}
                     className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${arena.theme.animation_style === s ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-600 border-white/5 hover:border-white/20'}`}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </ControlGroup>

            <ControlGroup label="Interface Style">
               <div className="grid grid-cols-2 gap-2">
                 {['flat', 'glow', 'glass', 'outline'].map((s) => (
                   <button 
                     key={s}
                     onClick={() => updateTheme({ button_style: s as any })}
                     className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${arena.theme.button_style === s ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-600 border-white/5 hover:border-white/20'}`}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </ControlGroup>
          </div>

          {/* Agent Deployment */}
          <div className="liquid-glass p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <Bot size={18} className="text-blue-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Intelligence Swarm</h3>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
              {allBots.map(bot => {
                const isSelected = arena.bot_ids.includes(bot.id);
                return (
                  <button 
                    key={bot.id}
                    onClick={() => toggleBotSelection(bot.id)}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'bg-blue-600/10 border-blue-500' : 'bg-black/20 border-white/10 hover:border-white/10'}`}
                  >
                    <span className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-500'}`}>{bot.name}</span>
                    <Plus size={14} className={`transition-transform ${isSelected ? 'rotate-45 text-blue-500' : 'text-slate-800'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Live Preview: High-Fidelity Rendering */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Layout size={18} className="text-slate-700" />
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Real-time Deployment Preview</h3>
             </div>
             <div className="flex bg-slate-900 p-1 rounded-xl">
                <button className="p-2 text-blue-500"><Monitor size={14} /></button>
                <button className="p-2 text-slate-600"><Layout size={14} /></button>
             </div>
          </div>

          <div 
            className="flex-1 rounded-[3rem] border shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col transition-all duration-700"
            style={{ 
              backgroundColor: arena.theme.bg_color,
              borderColor: arena.theme.border_intensity === '1px' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              fontFamily: arena.theme.font_family,
              borderRadius: arena.theme.border_radius
            }}
          >
            {/* Mock Header */}
            <div className="h-20 border-b flex items-center justify-between px-10 bg-white/[0.02] backdrop-blur-xl" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: arena.theme.primary_color }}>
                     <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-[12px] font-black text-white uppercase tracking-widest">Arena Preview Hub</div>
                    <div className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Neural Link Synchronized</div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: arena.theme.accent_color }}></div>
                  <div className="w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: arena.theme.accent_color }}></div>
               </div>
            </div>

            {/* Mock Swarm Control */}
            <div className="p-6 flex gap-4 overflow-x-auto no-scrollbar">
               {arena.bot_ids.map(bid => {
                 const b = allBots.find(x => x.id === bid);
                 if (!b) return null;
                 return (
                   <button 
                     key={bid}
                     onClick={() => setPreviewBotId(bid)}
                     className="px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap"
                     style={{ 
                       borderColor: previewBotId === bid ? arena.theme.primary_color : 'rgba(255,255,255,0.05)',
                       backgroundColor: previewBotId === bid ? `${arena.theme.primary_color}10` : 'transparent',
                       color: previewBotId === bid ? '#fff' : 'rgba(255,255,255,0.3)'
                     }}
                   >
                     {b.name}
                   </button>
                 );
               })}
            </div>

            {/* Mock Chat Interface */}
            <div className="flex-1 flex flex-col p-10 space-y-10">
               <div className="flex justify-start">
                  <div className="max-w-md p-6 rounded-3xl border space-y-2 transition-all" style={{ 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    borderColor: 'rgba(255,255,255,0.05)',
                    borderRadius: arena.theme.border_radius
                  }}>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Node</div>
                    <p className="text-[14px] text-slate-200 leading-relaxed font-medium">UPLINK_SECURE: Operational manifest loaded into this neural space. How can I assist with your current objective?</p>
                  </div>
               </div>

               <div className="flex justify-end">
                  <div className="max-w-md p-6 rounded-3xl text-white space-y-2 transition-all shadow-xl" style={{ 
                    backgroundColor: arena.theme.primary_color,
                    borderColor: `${arena.theme.primary_color}40`,
                    borderRadius: arena.theme.border_radius,
                    boxShadow: arena.theme.button_style === 'glow' ? `0 0 30px ${arena.theme.primary_color}40` : 'none'
                  }}>
                    <div className="text-[10px] font-black opacity-60 uppercase tracking-widest">Operator Signal</div>
                    <p className="text-[14px] leading-relaxed font-bold">Synthesize a strategic report based on the local knowledge vault and active telemetry.</p>
                  </div>
               </div>
            </div>

            {/* Mock Input */}
            <div className="p-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
               <div className="flex items-center gap-4 bg-white/[0.02] border p-4 transition-all" style={{ 
                 borderColor: 'rgba(255,255,255,0.05)',
                 borderRadius: arena.theme.border_radius,
                 backdropFilter: `blur(${arena.theme.glass_blur})`
               }}>
                  <div className="flex-1 text-[13px] text-slate-600 font-medium">Inject neural directive...</div>
                  <button className="p-3.5 rounded-xl text-white transition-all active:scale-95" style={{ 
                    backgroundColor: arena.theme.primary_color,
                    boxShadow: arena.theme.button_style === 'glow' ? `0 0 20px ${arena.theme.primary_color}40` : 'none'
                  }}>
                    <Save size={18} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Added optional children to the props definition to resolve TypeScript errors with JSX children.
function ControlGroup({ label, children }: { label: string, children?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
       <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded bg-transparent border-none cursor-pointer" />
       <input type="text" value={value.toUpperCase()} onChange={(e) => onChange(e.target.value)} className="bg-transparent border-none text-[10px] font-mono text-white outline-none w-full" />
    </div>
  );
}

function SliderControl({ label, value, onChange, max }: { label: string, value: number, onChange: (v: number) => void, max: number }) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <span>{label}</span>
          <span className="text-blue-500">{value} UNITS</span>
       </div>
       <input 
         type="range" min="0" max={max}
         value={value}
         onChange={(e) => onChange(parseInt(e.target.value))}
         className="w-full h-1.5 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
       />
    </div>
  );
}
