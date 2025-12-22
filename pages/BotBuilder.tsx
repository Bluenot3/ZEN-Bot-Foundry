
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
    <div className="flex flex-col h-full animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between mb-8 pb-8 border-b border-white/5 gap-8">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/dashboard')} className="p-4 rounded-[1.5rem] bg-slate-900 border border-white/10 text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-500 status-pulse"></div>
               <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Synthesis Hub Active</div>
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tighter uppercase leading-none">{id ? bot.name : 'Forge Operation'}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
           <button onClick={handleSave} className="bg-white text-black px-10 py-5 rounded-2xl font-black text-[13px] tracking-widest hover:bg-blue-600 hover:text-white transition-all uppercase flex items-center gap-4 shadow-2xl border border-white/10 active:scale-95">
             <Save size={20} /> Deploy Manifest
           </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full space-y-8 flex-1 flex flex-col min-h-0">
        {/* Step Navigation */}
        <div className="flex liquid-glass p-2 rounded-[2.5rem] overflow-x-auto no-scrollbar shadow-2xl border border-white/5 shrink-0">
          {STEPS.map((step, idx) => (
            <button
              key={step.id} onClick={() => setActiveStep(idx)}
              className={`flex-1 py-4 flex items-center justify-center gap-4 transition-all rounded-[2rem] whitespace-nowrap px-8 ${
                activeStep === idx ? 'bg-blue-600 text-white font-black shadow-xl' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <step.icon size={18} strokeWidth={activeStep === idx ? 3 : 2} />
              <span className="font-black text-[11px] uppercase tracking-[0.2em]">{step.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar p-1">
          {/* Main Workspace */}
          <div className="lg:col-span-8">
            {activeStep === 0 && (
              <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                 <div className="liquid-glass p-10 space-y-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.02] text-white pointer-events-none">
                      <Fingerprint size={200} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Agent Callsign</label>
                        <input 
                          type="text" value={bot.name}
                          onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-2xl font-black text-white uppercase outline-none focus:border-blue-500/50 transition-all shadow-inner"
                          placeholder="ALPHA_PROTO"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Global Route</label>
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-6 py-6 group">
                           <span className="text-slate-700 font-black text-sm pr-1">ZEN_</span>
                           <input 
                            type="text" value={bot.slug}
                            onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            className="bg-transparent text-sm font-black text-blue-400 outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Directive Manifest (System Prompt)</label>
                          <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                       </div>
                       <textarea 
                         value={bot.system_instructions}
                         onChange={e => updateBot({ system_instructions: e.target.value })}
                         className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 text-sm font-medium text-slate-300 h-80 focus:border-blue-500/50 transition-all outline-none resize-none shadow-inner"
                         placeholder="Synthesize agent personality, logic flow, and constraints..."
                       />
                    </div>
                 </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="animate-in slide-in-from-right-8 duration-500">
                 <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                    <ModelSelector 
                      selectedId={bot.model_config.primary_model} 
                      onSelect={(id) => updateBot({ model_config: { ...bot.model_config, primary_model: id } })} 
                    />
                 </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                 <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-10">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                             <ImageIcon size={32} />
                          </div>
                          <div>
                             <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Aesthetic Pulse</h3>
                             <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">Real-time Diffusion Orchestration</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: !bot.image_gen_config.enabled } })}
                          className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${bot.image_gen_config.enabled ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-slate-500 border-white/10'}`}
                       >
                          {bot.image_gen_config.enabled ? 'MANIFEST_ACTIVE' : 'ACTIVATE_ENGINE'}
                       </button>
                    </div>

                    {bot.image_gen_config.enabled ? (
                       <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-10">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3"><Scan size={14} className="text-cyan-500" /> Style Manifest Base</label>
                                <textarea 
                                   value={bot.image_gen_config.style_prompt}
                                   onChange={e => updateBot({ image_gen_config: { ...bot.image_gen_config, style_prompt: e.target.value } })}
                                   placeholder="Define global aesthetic constraints (e.g. 'Brutalist architecture, grainy 35mm film')..."
                                   className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-mono text-cyan-400 h-40 focus:border-cyan-500/50 outline-none resize-none shadow-inner"
                                />
                             </div>

                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3"><Filter size={14} className="text-cyan-500" /> Style Preset Library</label>
                                <div className="flex flex-wrap gap-2.5 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                                   {IMAGE_STYLE_CHIPS.map(chip => (
                                      <button 
                                         key={chip}
                                         onClick={() => toggleChip(chip)}
                                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${bot.image_gen_config.selected_chips.includes(chip) ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/30'}`}
                                      >
                                         {chip}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-10">
                             <div className="liquid-glass p-8 rounded-[2.5rem] border-cyan-500/20 bg-cyan-500/[0.03] flex flex-col items-center justify-center text-center gap-10 shadow-3xl">
                                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-2xl">
                                   <Camera size={32} />
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Atmospheric Dimensions</p>
                                   <div className="flex gap-4 mt-6">
                                      {['1:1', '16:9', '9:16'].map(ratio => (
                                         <button 
                                            key={ratio}
                                            onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, aspect_ratio: ratio as any } })}
                                            className={`w-16 h-12 border rounded-[1.2rem] flex items-center justify-center text-[11px] font-black transition-all ${bot.image_gen_config.aspect_ratio === ratio ? 'bg-cyan-500 text-black border-cyan-400 shadow-2xl' : 'bg-white/5 text-slate-600 border-white/10 hover:border-white/30'}`}
                                         >
                                            {ratio}
                                         </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                             <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">System Output Stats</h4>
                                <div className="space-y-3">
                                   <div className="flex justify-between text-[11px] font-bold text-slate-400"><span>Diffusion Engine</span> <span className="text-cyan-400 font-mono">GEMINI_FLASH_IMAGE</span></div>
                                   <div className="flex justify-between text-[11px] font-bold text-slate-400"><span>Render Pipeline</span> <span className="text-cyan-400 font-mono">STOCHASTIC_SAMPLING</span></div>
                                </div>
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="py-32 text-center space-y-10 opacity-30">
                          <div className="w-32 h-32 rounded-[3rem] bg-slate-900 border border-white/10 flex items-center justify-center mx-auto">
                             <ImageIcon size={48} className="text-slate-700" />
                          </div>
                          <p className="text-2xl font-black text-slate-700 uppercase tracking-[1em] mr-[-1em]">Diffusion Offline</p>
                       </div>
                    )}
                 </div>
              </div>
            )}

            {activeStep === 3 && (
               <div className="animate-in slide-in-from-right-8 duration-500">
                  <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Action Suite</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AVAILABLE_TOOLS.map(tool => (
                          <button 
                            key={tool.tool_id} onClick={() => {
                              const current = bot.tools || [];
                              const updated = current.some(t => t.tool_id === tool.tool_id) 
                                ? current.filter(t => t.tool_id !== tool.tool_id) 
                                : [...current, { ...tool, enabled: true }];
                              updateBot({ tools: updated });
                            }}
                            className={`p-6 rounded-2xl border text-left transition-all ${bot.tools.some(t => t.tool_id === tool.tool_id) ? 'bg-blue-600/10 border-blue-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                          >
                             <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1">{tool.name}</h4>
                             <p className="text-[9px] text-slate-500 font-bold uppercase truncate">{tool.description}</p>
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {activeStep === 4 && (
               <div className="animate-in slide-in-from-right-8 duration-500">
                  <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Vault Hub</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allAssets.map(asset => (
                          <button 
                            key={asset.id} onClick={() => {
                              const current = bot.knowledge_ids || [];
                              const updated = current.includes(asset.id) ? current.filter(id => id !== asset.id) : [...current, asset.id];
                              updateBot({ knowledge_ids: updated });
                            }}
                            className={`p-6 rounded-2xl border text-left transition-all ${bot.knowledge_ids.includes(asset.id) ? 'bg-blue-600/10 border-blue-500' : 'bg-black/20 border-white/5'}`}
                          >
                             <h4 className="text-[12px] font-black text-white uppercase tracking-tight truncate">{asset.name}</h4>
                             <span className="text-[9px] font-bold text-slate-500 uppercase">{asset.type} NODE</span>
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {activeStep === 5 && (
              <div className="animate-in slide-in-from-right-8 duration-500">
                 <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Signal Temperature</span>
                          <span className="text-blue-400">{bot.model_config.temperature} Σ</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.1" 
                          value={bot.model_config.temperature}
                          onChange={e => updateBot({ model_config: { ...bot.model_config, temperature: parseFloat(e.target.value) } })}
                          className="w-full h-2 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Reasoning Reserve</span>
                          <span className="text-blue-400">{bot.model_config.thinking_budget} TKNS</span>
                        </div>
                        <input 
                          type="range" min="0" max="32768" step="1024" 
                          value={bot.model_config.thinking_budget}
                          onChange={e => updateBot({ model_config: { ...bot.model_config, thinking_budget: parseInt(e.target.value) } })}
                          className="w-full h-2 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="animate-in zoom-in-95 duration-700 h-full">
                 <div className="liquid-glass p-12 rounded-[4rem] border border-white/10 shadow-3xl text-center space-y-10">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl border border-emerald-500/30 mx-auto">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Manifest Verified</h4>
                       <p className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.3em]">Operational node ready for deployment</p>
                    </div>
                    <button 
                      onClick={handleSave} 
                      className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[14px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all shadow-3xl shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-4"
                    >
                       Execute Final Deployment <Zap size={20} />
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Side HUD */}
          <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-4">
             <div className="liquid-glass p-10 rounded-[3rem] border-white/10 space-y-10 shadow-3xl">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                   <Activity size={20} className="text-blue-500" />
                   <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Foundry Metrics</h4>
                </div>
                <div className="space-y-8">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Intelligence Entropy</span>
                         <span className="text-blue-400">{bot.model_config.temperature} Σ</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${bot.model_config.temperature * 100}%` }}></div>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Logic Reserve</span>
                         <span className="text-blue-400">{bot.model_config.thinking_budget} TKNS</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${(bot.model_config.thinking_budget / 32768) * 100}%` }}></div>
                      </div>
                   </div>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 space-y-6">
                   <div className="flex items-center gap-4">
                      <Shield size={20} className="text-blue-400" />
                      <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Secure Vault</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">Operation data is persisted via Liquid-Glass protocol. Encrypted by decentralized keys.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
