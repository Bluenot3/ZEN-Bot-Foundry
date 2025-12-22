
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig, Tool, KnowledgeAsset } from '../types';
import { BotService, AuthService, KnowledgeService, KeyService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import MagicEnhancer from '../components/MagicEnhancer';
import { AVAILABLE_TOOLS } from '../constants';
import { 
  Save, ArrowLeft, Settings, Cpu, Share2, Wrench, Activity, 
  Users, GitBranch, Zap, Info, Layers, RefreshCw, Check, 
  Brain, Globe, Shield, User, Sliders, Target, Eye, Microscope,
  Sparkles, Terminal, Code, Database, ChevronRight, Wand2,
  Copy, Smartphone, Monitor, Download, ExternalLink, Box,
  CheckCircle2, Plus, Trash2, ListChecks, BookOpen, FileText,
  Lock, AlertTriangle, MessageSquare, ZapIcon, Binary
} from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Identity', icon: User },
  { id: 'intelligence', label: 'Neural Core', icon: Brain },
  { id: 'tools', label: 'Action Suite', icon: Cpu },
  { id: 'knowledge', label: 'Knowledge Vault', icon: BookOpen },
  { id: 'configuration', label: 'Logic Params', icon: Sliders },
  { id: 'deployment', label: 'Launch System', icon: Share2 }
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [allAssets, setAllAssets] = useState<KnowledgeAsset[]>([]);
  const [keys, setKeys] = useState(KeyService.getKeys());

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

  const toggleTool = (tool: Tool) => {
    if (!bot) return;
    const current = bot.tools || [];
    const existingIdx = current.findIndex(t => t.tool_id === tool.tool_id);
    let updated;
    if (existingIdx >= 0) {
      updated = current.filter(t => t.tool_id !== tool.tool_id);
    } else {
      updated = [...current, { ...tool, enabled: true }];
    }
    updateBot({ tools: updated });
  };

  const handleAddStarter = () => {
    if (!bot) return;
    updateBot({ starter_prompts: [...bot.starter_prompts, ""] });
  };

  const updateStarter = (index: number, val: string) => {
    if (!bot) return;
    const next = [...bot.starter_prompts];
    next[index] = val;
    updateBot({ starter_prompts: next });
  };

  if (!bot) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-4 rounded-2xl liquid-glass text-slate-400 hover:text-white transition-all border border-white/10">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1 animate-pulse">Foundry Mode Active</div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">{id ? bot.name : 'Create Intelligence'}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
           <button onClick={handleSave} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[12px] tracking-widest hover:bg-blue-600 hover:text-white transition-all uppercase flex items-center gap-3 shadow-xl border border-white/10">
             <Save size={18} /> Sync Manifest
           </button>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full">
        {/* Step Nav */}
        <div className="flex mb-10 liquid-glass p-1.5 rounded-[2rem] overflow-x-auto no-scrollbar shadow-xl border border-white/10">
          {STEPS.map((step, idx) => (
            <button
              key={step.id} onClick={() => setActiveStep(idx)}
              className={`flex-1 py-3.5 flex items-center justify-center gap-3.5 transition-all rounded-[1.5rem] whitespace-nowrap px-6 ${
                activeStep === idx ? 'bg-blue-600 text-white font-black shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <step.icon size={16} strokeWidth={2.5} />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">{step.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[600px]">
          {/* STEP 0: IDENTITY */}
          {activeStep === 0 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 space-y-10 rounded-[2.5rem] border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Unit Callsign</label>
                      <input 
                        type="text" value={bot.name}
                        onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-xl font-black text-white uppercase outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Uplink Slug</label>
                      <input 
                        type="text" value={bot.slug}
                        onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-sm font-black text-blue-400 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Directive Manifest (System Prompt)</label>
                        <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                     </div>
                     <textarea 
                       value={bot.system_instructions}
                       onChange={e => updateBot({ system_instructions: e.target.value })}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-medium text-slate-300 h-64 focus:border-blue-500/50 transition-all outline-none resize-none"
                     />
                  </div>
                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Neural Starter Prompts</label>
                     <div className="grid gap-3">
                        {bot.starter_prompts.map((p, i) => (
                           <div key={i} className="flex gap-2">
                              <input 
                                type="text" value={p}
                                onChange={e => updateStarter(i, e.target.value)}
                                className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[12px] text-slate-300 outline-none"
                              />
                              <button onClick={() => updateBot({ starter_prompts: bot.starter_prompts.filter((_, idx) => idx !== i) })} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                           </div>
                        ))}
                        <button onClick={handleAddStarter} className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-all"><Plus size={14} /> Add Pulse Starter</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 1: INTELLIGENCE */}
          {activeStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 rounded-[2.5rem] border border-white/10">
                 <ModelSelector 
                   selectedId={bot.model_config.primary_model} 
                   onSelect={(id) => updateBot({ model_config: { ...bot.model_config, primary_model: id } })} 
                 />
               </div>
            </div>
          )}

          {/* STEP 2: TOOLS */}
          {activeStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                     <div className="flex items-center gap-4">
                        <Cpu size={22} className="text-blue-500" strokeWidth={2.5} />
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Action_Suite_v5 [30_NODES]</h3>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                     {AVAILABLE_TOOLS.map(tool => {
                       const isSelected = bot.tools.some(t => t.tool_id === tool.tool_id);
                       const hasKey = !tool.required_key || keys.some(k => k.provider_id === tool.required_key);
                       
                       return (
                         <button 
                           key={tool.tool_id}
                           onClick={() => toggleTool(tool)}
                           className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col gap-3 ${
                              isSelected ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black/20 border-white/5 hover:bg-white/5'
                           }`}
                         >
                            <div className="flex justify-between items-start">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-600'}`}>
                                  <Cpu size={18} />
                               </div>
                               {tool.required_key && (
                                  <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest flex items-center gap-1 ${hasKey ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                     {hasKey ? <CheckCircle2 size={8} /> : <Lock size={8} />}
                                     {tool.required_key.toUpperCase()}_UPLINK
                                  </div>
                               )}
                            </div>
                            <div>
                               <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1">{tool.name}</h4>
                               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight line-clamp-2 leading-relaxed">{tool.description}</p>
                            </div>
                            {!hasKey && isSelected && (
                               <div className="mt-2 flex items-center gap-1.5 text-[8px] font-black text-rose-400 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                                  <AlertTriangle size={10} /> MISSING_CREDENTIALS: ADD {tool.required_key.toUpperCase()} KEY IN VAULT
                               </div>
                            )}
                         </button>
                       );
                     })}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 3: KNOWLEDGE */}
          {activeStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                     <h3 className="text-xl font-black text-white uppercase tracking-widest">Semantic Context Hub</h3>
                     <button onClick={() => navigate('/knowledge')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> Import Data</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {allAssets.map(asset => {
                       const isSelected = (bot.knowledge_ids || []).includes(asset.id);
                       return (
                         <button 
                           key={asset.id} onClick={() => {
                             const current = bot.knowledge_ids || [];
                             const updated = isSelected ? current.filter(id => id !== asset.id) : [...current, asset.id];
                             updateBot({ knowledge_ids: updated });
                           }}
                           className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${isSelected ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                         >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-600'}`}>
                               <Database size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-[12px] font-black text-white uppercase tracking-widest truncate">{asset.name}</h4>
                               <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{asset.type} // {asset.status}</span>
                            </div>
                            {isSelected && <CheckCircle2 size={16} className="text-blue-500" />}
                         </button>
                       );
                     })}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 4: CONFIGURATION */}
          {activeStep === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="liquid-glass p-10 rounded-[2.5rem] border border-white/10 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Signal Temperature</span>
                        <span className="text-blue-400">{bot.model_config.temperature}</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.1" 
                        value={bot.model_config.temperature}
                        onChange={e => updateBot({ model_config: { ...bot.model_config, temperature: parseFloat(e.target.value) } })}
                        className="w-full h-2 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                      />
                      <p className="text-[9px] text-slate-600 uppercase font-bold leading-relaxed">Higher temperature = more creative/latent signal patterns. Lower = deterministic logic.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Neural Thinking Budget</span>
                        <span className="text-blue-400">{bot.model_config.thinking_budget} TKNS</span>
                      </div>
                      <input 
                        type="range" min="0" max="32768" step="1024" 
                        value={bot.model_config.thinking_budget}
                        onChange={e => updateBot({ model_config: { ...bot.model_config, thinking_budget: parseInt(e.target.value) } })}
                        className="w-full h-2 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                      />
                      <p className="text-[9px] text-slate-600 uppercase font-bold leading-relaxed">Dedicated tokens for internal reasoning steps. Only available on reasoning models.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-white/5">
                     <FeatureToggle 
                        icon={Microscope} label="X-Ray Vision Telemetry" desc="Enable deep technical telemetry for internal model anatomy tracking." 
                        active={bot.features.xray_vision} onClick={() => updateBot({ features: { ...bot.features, xray_vision: !bot.features.xray_vision } })}
                     />
                     <FeatureToggle 
                        icon={ZapIcon} label="Dual Response Synthesis" desc="Generate multiple logic variants simultaneously for operator selection." 
                        active={bot.features.dual_response_mode} onClick={() => updateBot({ features: { ...bot.features, dual_response_mode: !bot.features.dual_response_mode } })}
                     />
                     <FeatureToggle 
                        icon={Users} label="Multi-Agent Consultation" desc="Allow agent to consult other deployed Foundry assets for complex tasks." 
                        active={bot.features.multi_agent_consult} onClick={() => updateBot({ features: { ...bot.features, multi_agent_consult: !bot.features.multi_agent_consult } })}
                     />
                     <FeatureToggle 
                        icon={Binary} label="Thought Stream Visibility" desc="Display raw reasoning chain to the end user during synthesis." 
                        active={bot.features.thought_stream_visibility} onClick={() => updateBot({ features: { ...bot.features, thought_stream_visibility: !bot.features.thought_stream_visibility } })}
                     />
                  </div>
               </div>
            </div>
          )}

          {/* STEP 5: DEPLOYMENT */}
          {activeStep === 5 && (
            <div className="grid lg:grid-cols-5 gap-8 animate-in zoom-in-95 duration-700">
               <div className="lg:col-span-3 liquid-glass p-10 flex flex-col gap-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl border border-emerald-500/30">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-widest">Operational Manifest Verified</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Ready for global deployment</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Uplink URL</label>
                     <div className="bg-black/50 border border-white/5 rounded-2xl p-6 font-mono text-[12px] text-blue-400 overflow-auto flex justify-between items-center group">
                        <span className="truncate">{`${window.location.origin}/#/bot/${bot.slug}`}</span>
                        <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/#/bot/${bot.slug}`)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Copy size={16} /></button>
                     </div>
                  </div>

                  <button 
                    onClick={handleSave} 
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(37,99,235,0.3)]"
                  >
                     Finalize Deployment Sequence <Zap size={18} />
                  </button>
               </div>
               
               <div className="lg:col-span-2 space-y-6">
                  <div className="liquid-glass p-8 rounded-[2rem] border border-white/10">
                     <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Active Entitlements</h5>
                     <div className="space-y-4">
                        <EntitlementRow label="Model Access" status="GRANTED" />
                        <EntitlementRow label="Tool Execution" status="GRANTED" />
                        <EntitlementRow label="Vault Indexing" status="READY" />
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureToggle({ icon: Icon, label, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-[1.8rem] border text-left transition-all flex gap-5 ${active ? 'bg-blue-600/10 border-blue-500/40 shadow-xl' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${active ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-600'}`}>
        <Icon size={20} />
      </div>
      <div>
         <div className="text-[12px] font-black text-white uppercase tracking-widest mb-1">{label}</div>
         <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">{desc}</p>
      </div>
    </button>
  );
}

function EntitlementRow({ label, status }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><Check size={10} strokeWidth={3} /> {status}</span>
    </div>
  );
}
