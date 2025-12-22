
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig, Tool, KnowledgeAsset } from '../types';
import { BotService, AuthService, KnowledgeService, KeyService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import MagicEnhancer from '../components/MagicEnhancer';
import { AVAILABLE_TOOLS, IMAGE_STYLE_CHIPS } from '../constants';
import { 
  Save, ArrowLeft, Settings, Cpu, Share2, Wrench, Activity, 
  Users, GitBranch, Zap, Info, Layers, RefreshCw, Check, 
  Brain, Globe, Shield, User, Sliders, Target, Eye, Microscope,
  Sparkles, Terminal, Code, Database, ChevronRight, Wand2,
  Copy, Smartphone, Monitor, Download, ExternalLink, Box,
  CheckCircle2, Plus, Trash2, ListChecks, BookOpen, FileText,
  Lock, AlertTriangle, MessageSquare, ZapIcon, Binary, ImageIcon,
  Palette, Camera, Scan, Filter, Crosshair, Fingerprint
} from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Identity', icon: User },
  { id: 'intelligence', label: 'Neural Core', icon: Brain },
  { id: 'images', label: 'Aesthetics', icon: ImageIcon },
  { id: 'tools', label: 'Actions', icon: Cpu },
  { id: 'knowledge', label: 'Vault', icon: BookOpen },
  { id: 'configuration', label: 'Logic', icon: Sliders },
  { id: 'deployment', label: 'Finalize', icon: Share2 }
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [allAssets, setAllAssets] = useState<KnowledgeAsset[]>([]);

  useEffect(() => {
    setAllAssets(KnowledgeService.getAssets());
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

  const toggleChip = (chip: string) => {
    if (!bot) return;
    const current = bot.image_gen_config.selected_chips || [];
    const updated = current.includes(chip) ? current.filter(c => c !== chip) : [...current, chip];
    updateBot({ image_gen_config: { ...bot.image_gen_config, selected_chips: updated } });
  };

  if (!bot) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between mb-16 pb-10 border-b border-white/5 gap-10">
        <div className="flex items-center gap-10">
          <button onClick={() => navigate('/dashboard')} className="p-6 rounded-[2rem] bg-slate-900 border border-white/10 text-slate-500 hover:text-white transition-all shadow-2xl active:scale-95">
            <ArrowLeft size={28} strokeWidth={3} />
          </button>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-blue-500 status-pulse"></div>
               <div className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] animate-pulse">Synthesis Protocol Active</div>
            </div>
            <h1 className="text-5xl 2xl:text-6xl font-black text-white tracking-tighter uppercase leading-none">{id ? bot.name : 'Create Operation'}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
           <button onClick={handleSave} className="bg-white text-black px-12 py-6 rounded-3xl font-black text-[14px] tracking-widest hover:bg-blue-600 hover:text-white transition-all uppercase flex items-center gap-4 shadow-3xl border border-white/10 active:scale-95">
             <Save size={24} /> Sync Manifest
           </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full space-y-16">
        {/* Step Navigation */}
        <div className="flex liquid-glass p-2.5 rounded-[3rem] overflow-x-auto no-scrollbar shadow-3xl border border-white/10">
          {STEPS.map((step, idx) => (
            <button
              key={step.id} onClick={() => setActiveStep(idx)}
              className={`flex-1 py-5 flex items-center justify-center gap-5 transition-all rounded-[2.5rem] whitespace-nowrap px-10 ${
                activeStep === idx ? 'bg-blue-600 text-white font-black shadow-2xl' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <step.icon size={20} strokeWidth={activeStep === idx ? 3 : 2} />
              <span className="font-black text-[12px] uppercase tracking-[0.3em]">{step.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            {activeStep === 0 && (
              <div className="space-y-12 animate-in slide-in-from-right-12 duration-500">
                 <div className="liquid-glass p-16 space-y-12 rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.02] text-white">
                      <Fingerprint size={200} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">Agent Callsign</label>
                        <input 
                          type="text" value={bot.name}
                          onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                          className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 text-3xl font-black text-white uppercase outline-none focus:border-blue-500/50 transition-all shadow-inner"
                          placeholder="ALPHA_PROTO"
                        />
                      </div>
                      <div className="space-y-5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">Global Route</label>
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-[2rem] px-8 py-8 group">
                           <span className="text-slate-700 font-black text-lg pr-1">FOUNDRY://</span>
                           <input 
                            type="text" value={bot.slug}
                            onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            className="bg-transparent text-lg font-black text-blue-400 outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-5">
                       <div className="flex items-center justify-between">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">Operational Directives</label>
                          <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                       </div>
                       <textarea 
                         value={bot.system_instructions}
                         onChange={e => updateBot({ system_instructions: e.target.value })}
                         className="w-full bg-black/40 border border-white/10 rounded-[3rem] p-10 text-lg font-medium text-slate-300 h-[450px] focus:border-blue-500/50 transition-all outline-none resize-none shadow-inner custom-scrollbar"
                         placeholder="Synthesize agent personality, logic flow, and constraints..."
                       />
                    </div>
                 </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="animate-in slide-in-from-right-12 duration-500">
                 <div className="liquid-glass p-16 rounded-[4rem] border border-white/10 shadow-3xl">
                    <ModelSelector 
                      selectedId={bot.model_config.primary_model} 
                      onSelect={(id) => updateBot({ model_config: { ...bot.model_config, primary_model: id } })} 
                    />
                 </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-12 animate-in slide-in-from-right-12 duration-500">
                 <div className="liquid-glass p-16 rounded-[4rem] border border-white/10 shadow-3xl space-y-16">
                    <div className="flex items-center justify-between border-b border-white/5 pb-12">
                       <div className="flex items-center gap-8">
                          <div className="w-20 h-20 rounded-[2.5rem] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                             <ImageIcon size={40} />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Aesthetic Pulse</h3>
                             <p className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.2em] mt-2">Real-time Diffusion Orchestration</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: !bot.image_gen_config.enabled } })}
                          className={`px-12 py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-widest border transition-all ${bot.image_gen_config.enabled ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-slate-500 border-white/10'}`}
                       >
                          {bot.image_gen_config.enabled ? 'MANIFEST_ACTIVE' : 'ACTIVATE_ENGINE'}
                       </button>
                    </div>

                    {bot.image_gen_config.enabled ? (
                       <div className="grid md:grid-cols-2 gap-16">
                          <div className="space-y-12">
                             <div className="space-y-5">
                                <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4"><Palette size={18} className="text-cyan-500" /> Style Manifest Base</label>
                                <textarea 
                                   value={bot.image_gen_config.style_prompt}
                                   onChange={e => updateBot({ image_gen_config: { ...bot.image_gen_config, style_prompt: e.target.value } })}
                                   placeholder="Define global aesthetic constraints (e.g. 'Brutalist architecture, grainy 35mm film, moody shadows')..."
                                   className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-sm font-mono text-cyan-400 h-48 focus:border-cyan-500/50 outline-none resize-none shadow-inner"
                                />
                             </div>

                             <div className="space-y-5">
                                <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4"><Filter size={18} className="text-cyan-500" /> Neural Style Chips</label>
                                <div className="flex flex-wrap gap-3.5 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                                   {IMAGE_STYLE_CHIPS.map(chip => (
                                      <button 
                                         key={chip}
                                         onClick={() => toggleChip(chip)}
                                         className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${bot.image_gen_config.selected_chips.includes(chip) ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/40'}`}
                                      >
                                         {chip}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-12">
                             <div className="liquid-glass p-12 rounded-[3.5rem] border-cyan-500/20 bg-cyan-500/[0.03] flex flex-col items-center justify-center text-center gap-10 shadow-3xl">
                                <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-2xl animate-pulse">
                                   <Camera size={40} />
                                </div>
                                <div className="space-y-4">
                                   <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Atmospheric Dimensions</p>
                                   <div className="flex gap-5 mt-8">
                                      {['1:1', '16:9', '9:16'].map(ratio => (
                                         <button 
                                            key={ratio}
                                            onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, aspect_ratio: ratio as any } })}
                                            className={`w-24 h-16 border rounded-[1.5rem] flex items-center justify-center text-[13px] font-black transition-all ${bot.image_gen_config.aspect_ratio === ratio ? 'bg-cyan-500 text-black border-cyan-400 shadow-2xl' : 'bg-white/5 text-slate-600 border-white/10 hover:border-white/30'}`}
                                         >
                                            {ratio}
                                         </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                             <div className="p-10 rounded-[3rem] bg-black/40 border border-white/5 space-y-6">
                                <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em]">System Output Stats</h4>
                                <div className="space-y-4">
                                   <div className="flex justify-between text-[13px] font-bold text-slate-500"><span>Diffusion Engine</span> <span className="text-cyan-400 font-mono">GEMINI_FLASH_IMAGE_v2.5</span></div>
                                   <div className="flex justify-between text-[13px] font-bold text-slate-500"><span>Render Pipeline</span> <span className="text-cyan-400 font-mono">STOCHASTIC_SAMPLING</span></div>
                                   <div className="flex justify-between text-[13px] font-bold text-slate-500"><span>Safety Shield</span> <span className="text-emerald-500 font-mono">ACTIVE_S1</span></div>
                                </div>
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="py-48 text-center space-y-10 opacity-30">
                          <div className="w-32 h-32 rounded-[3rem] bg-slate-900 border border-white/10 flex items-center justify-center mx-auto">
                             <ImageIcon size={64} className="text-slate-700" />
                          </div>
                          <p className="text-2xl font-black text-slate-700 uppercase tracking-[1em] mr-[-1em]">Diffusion Offline</p>
                       </div>
                    )}
                 </div>
              </div>
            )}

            {activeStep >= 3 && (
               <div className="animate-in slide-in-from-right-12 duration-500">
                  <div className="liquid-glass p-16 rounded-[4rem] border border-white/10 shadow-3xl">
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-12">{STEPS[activeStep].label} Protocol</h3>
                     <p className="text-slate-500 text-lg font-medium uppercase tracking-widest leading-relaxed">Neural configuration nodes initializing in the visual lattice... <br/> Finalizing encrypted manifest synchronization.</p>
                  </div>
               </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-12">
             <div className="liquid-glass p-12 rounded-[4rem] border-white/10 space-y-12 shadow-3xl sticky top-12">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                   <Activity size={24} className="text-blue-500" />
                   <h4 className="text-[14px] font-black text-white uppercase tracking-[0.4em]">Foundry Telemetry</h4>
                </div>
                <div className="space-y-10">
                   <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Intelligence Entropy</span>
                         <span className="text-blue-400">{bot.model_config.temperature} Σ</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${bot.model_config.temperature * 100}%` }}></div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Logic Reserve</span>
                         <span className="text-blue-400">{bot.model_config.thinking_budget} TKNS</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${(bot.model_config.thinking_budget / 32768) * 100}%` }}></div>
                      </div>
                   </div>
                </div>
                <div className="p-10 rounded-[3rem] bg-blue-600/10 border border-blue-500/20 space-y-6">
                   <div className="flex items-center gap-4">
                      <Shield size={24} className="text-blue-400" />
                      <span className="text-[12px] font-black text-blue-400 uppercase tracking-widest">Sovereign Vault</span>
                   </div>
                   <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">Operation data is persisted via Liquid-Glass protocol. Encrypted by decentralized keys for absolute sovereignty.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
