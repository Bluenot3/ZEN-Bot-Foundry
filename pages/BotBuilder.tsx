
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig, Tool } from '../types';
import { BotService, AuthService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import { 
  Save, ArrowLeft, Settings, Cpu, Share2, Wrench, Activity, 
  Users, GitBranch, Zap, Info, Layers, RefreshCw, Check, 
  Brain, Globe, Shield, User, Sliders, Target, Eye, Microscope,
  Sparkles, Terminal, Code, Database, ChevronRight, Wand2,
  Copy, Smartphone, Monitor, Download, ExternalLink, Box,
  CheckCircle2
} from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Identity', icon: User },
  { id: 'intelligence', label: 'Neural Core', icon: Brain },
  { id: 'tools', label: 'Toolbox', icon: Wrench },
  { id: 'deployment', label: 'Launch System', icon: Share2 }
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [launchMode, setLaunchMode] = useState<'iframe' | 'link' | 'html' | 'package'>('link');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = BotService.getBot(id);
      if (existing) setBot(existing);
      else navigate('/dashboard');
    } else {
      setBot(BotService.createEmptyBot());
    }
  }, [id, navigate]);

  const handleSave = async () => {
    if (bot) {
      await BotService.saveBot(bot);
      navigate('/dashboard');
    }
  };

  const updateBot = (updates: any) => {
    setBot(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateFeature = (key: keyof BotConfig['features'], value: boolean) => {
    if (bot) {
      setBot({ ...bot, features: { ...bot.features, [key]: value } });
    }
  };

  const toggleTool = (toolId: string) => {
    if (bot) {
      setBot({
        ...bot,
        tools: bot.tools.map(t => t.tool_id === toolId ? { ...t, enabled: !t.enabled } : t)
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!bot) return null;

  const launchUrl = `${window.location.origin}/#/bot/${bot.slug}`;
  const iframeCode = `<iframe src="${launchUrl}" width="100%" height="600px" frameborder="0" style="border-radius: 16px;"></iframe>`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 pb-12">
      {/* Header - Scaled Down */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-4 rounded-2xl liquid-glass text-slate-400 hover:text-white transition-all border">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1 animate-pulse">Synthesis Hub Online</div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">{id ? bot.name : 'Create Intelligence'}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
           <button 
             onClick={() => updateFeature('quick_forge', !bot.features.quick_forge)}
             className={`px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 border ${bot.features.quick_forge ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(0,102,255,0.3)]' : 'liquid-glass text-slate-400 border-white/10'}`}
           >
             <Wand2 size={16} /> Quick Forge {bot.features.quick_forge ? 'ON' : 'OFF'}
           </button>
           <button 
             onClick={handleSave}
             className="bg-white text-black px-8 py-3 rounded-xl font-black text-[12px] tracking-widest hover:bg-blue-600 hover:text-white transition-all uppercase flex items-center gap-3 shadow-xl active:scale-95"
           >
             <Save size={18} /> Sync Manifest
           </button>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full">
        {/* Navigation HUB - Scaled Down */}
        <div className="flex mb-10 liquid-glass p-1.5 rounded-[2rem] overflow-x-auto no-scrollbar shadow-xl border">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 py-3.5 flex items-center justify-center gap-3.5 transition-all rounded-[1.5rem] whitespace-nowrap px-6 ${
                activeStep === idx 
                  ? 'bg-blue-600 text-white font-black shadow-[0_0_20px_rgba(0,102,255,0.4)]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <step.icon size={16} strokeWidth={2.5} />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Step Content Area - Scaled Down */}
        <div className="min-h-[600px]">
          {activeStep === 0 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 space-y-10 rounded-[2.5rem] border">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                     <Terminal size={22} className="text-blue-500" strokeWidth={2.5} />
                     <h3 className="text-xl font-black text-white uppercase tracking-widest">Base Designation</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Unit Callsign</label>
                      <input 
                        type="text" 
                        value={bot.name}
                        onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-xl font-black text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all uppercase"
                        placeholder="ENTER_ID..."
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Uplink Slug</label>
                      <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-5 py-0.5">
                         <span className="text-slate-600 font-mono text-sm font-bold">/zen/</span>
                         <input 
                           type="text" 
                           value={bot.slug}
                           onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                           className="bg-transparent border-none focus:ring-0 py-4 text-sm font-black text-blue-400 w-full tracking-wider"
                         />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Directive Manifest</label>
                     <textarea 
                       value={bot.system_instructions}
                       onChange={e => updateBot({ system_instructions: e.target.value })}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-medium text-slate-300 h-64 focus:outline-none focus:border-blue-500/50 transition-all leading-relaxed custom-scrollbar"
                       placeholder="DEFINE_OPERATIONAL_PARAMETERS..."
                     />
                  </div>
               </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 space-y-8 rounded-[2.5rem] border">
                 <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                   <Brain size={22} className="text-blue-500" strokeWidth={2.5} />
                   <h3 className="text-xl font-black text-white uppercase tracking-widest">Neural Core</h3>
                 </div>
                 <ModelSelector 
                   selectedId={bot.model_config.primary_model} 
                   onSelect={(id) => updateBot({ model_config: { ...bot.model_config, primary_model: id } })} 
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="liquid-glass p-8 space-y-6 rounded-2xl border">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Logic Budget</label>
                        <span className="text-blue-400 font-black glow-text text-xl">{bot.model_config.thinking_budget} TKNS</span>
                     </div>
                     <input 
                       type="range" min="0" max="32000" step="1000"
                       value={bot.model_config.thinking_budget}
                       onChange={e => updateBot({ model_config: { ...bot.model_config, thinking_budget: parseInt(e.target.value) } })}
                       className="w-full h-2 bg-blue-900/40 rounded-full appearance-none cursor-pointer accent-blue-500"
                     />
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-80">Reserved neural capacity for complex multi-stage reasoning.</p>
                  </div>
                  <div className="liquid-glass p-8 space-y-6 rounded-2xl border">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Entropy</label>
                        <span className="text-blue-400 font-black glow-text text-xl">{bot.model_config.temperature}</span>
                     </div>
                     <input 
                       type="range" min="0" max="1" step="0.1"
                       value={bot.model_config.temperature}
                       onChange={e => updateBot({ model_config: { ...bot.model_config, temperature: parseFloat(e.target.value) } })}
                       className="w-full h-2 bg-blue-900/40 rounded-full appearance-none cursor-pointer accent-blue-500"
                     />
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-80">Strict adherence (0.0) yields clinical data accuracy.</p>
                  </div>
               </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 rounded-[2.5rem] border">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/5 pb-8 gap-6">
                     <div className="flex items-center gap-4">
                        <Wrench size={22} className="text-blue-500" strokeWidth={2.5} />
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Toolkit</h3>
                     </div>
                     <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 hover:text-white transition-all">
                        <Plus size={16} strokeWidth={3} /> Custom Endpoint
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bot.tools.map(tool => (
                      <button 
                        key={tool.tool_id}
                        onClick={() => toggleTool(tool.tool_id)}
                        className={`p-6 rounded-[2rem] border transition-all duration-500 text-left flex gap-6 ${tool.enabled ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all shrink-0 ${tool.enabled ? 'bg-blue-600 text-white border-blue-300 shadow-lg' : 'bg-white/5 text-slate-700 border-white/10'}`}>
                           <Box size={22} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                             <h4 className={`text-[12px] font-black uppercase tracking-widest ${tool.enabled ? 'text-white' : 'text-slate-600'}`}>{tool.name}</h4>
                             {tool.enabled && <CheckCircle2 size={16} className="text-blue-400" />}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase leading-relaxed tracking-tight line-clamp-2">{tool.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="grid lg:grid-cols-5 gap-8 animate-in zoom-in-95 duration-700">
               {/* Integration Modes Selection */}
               <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Launch Protocols</h3>
                  <div className="space-y-4">
                     <DeployBtn 
                        active={launchMode === 'link'} 
                        onClick={() => setLaunchMode('link')} 
                        icon={ExternalLink} 
                        label="Command Terminal" 
                        desc="Cloud-hosted persistent link."
                     />
                     <DeployBtn 
                        active={launchMode === 'iframe'} 
                        onClick={() => setLaunchMode('iframe')} 
                        icon={Smartphone} 
                        label="Portal Frame" 
                        desc="Standard injection code."
                     />
                     <DeployBtn 
                        active={launchMode === 'html'} 
                        onClick={() => setLaunchMode('html')} 
                        icon={Code} 
                        label="Neural Snippet" 
                        desc="Zero-dependency payload."
                     />
                     <DeployBtn 
                        active={launchMode === 'package'} 
                        onClick={() => setLaunchMode('package')} 
                        icon={Download} 
                        label="Binary Pull" 
                        desc="Zipped local archive."
                     />
                  </div>
               </div>

               {/* Integrated Output Pane */}
               <div className="lg:col-span-3 liquid-glass p-10 flex flex-col gap-6 rounded-[2.5rem] border-blue-500/30 shadow-2xl border">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <h4 className="text-lg font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500" strokeWidth={2.5} /> Verified
                     </h4>
                     <button 
                        onClick={() => copyToClipboard(launchMode === 'iframe' ? iframeCode : launchUrl)}
                        className="flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-white transition-all bg-blue-600/10 px-4 py-2 rounded-xl border border-blue-500/20"
                     >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'SIGNAL_COPIED' : 'COPY_UPLINK'}
                     </button>
                  </div>

                  <div className="bg-black/50 border border-white/5 rounded-2xl p-6 font-mono text-[12px] leading-relaxed text-blue-400 overflow-auto max-h-[300px] shadow-inner custom-scrollbar">
                     {launchMode === 'link' && launchUrl}
                     {launchMode === 'iframe' && iframeCode}
                     {launchMode === 'html' && `<!-- ZEN UPLINK -->\n<div id="zen" data-bot="${bot.id}"></div>\n<script src="https://zen.io/v5/nexus.js" async></script>`}
                     {launchMode === 'package' && `[READY] PACKAGING_ASSETS...`}
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row gap-4">
                     <button 
                        onClick={() => window.open(launchUrl, '_blank')}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-4"
                     >
                        Execute Launch <ExternalLink size={18} />
                     </button>
                     <button 
                        onClick={handleSave}
                        className="flex-1 py-4 bg-white text-black rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-4 shadow-xl"
                     >
                        Finalize Sync <Check size={18} />
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeployBtn({ active, onClick, icon: Icon, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-6 rounded-[2rem] border transition-all duration-500 text-left flex items-center gap-6 ${active ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02]' : 'liquid-glass text-slate-500 border-white/5 hover:border-white/20'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${active ? 'bg-white/20 border-white/40 shadow-lg' : 'bg-white/5 border-white/10'}`}>
         <Icon size={20} strokeWidth={2.5} />
      </div>
      <div>
         <h4 className="text-[14px] font-black uppercase tracking-widest leading-none mb-1.5">{label}</h4>
         <p className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-white/70' : 'text-slate-600'}`}>{desc}</p>
      </div>
    </button>
  );
}

function Plus({ size, className, strokeWidth = 3 }: any) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
