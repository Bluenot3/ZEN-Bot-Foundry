
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig, Tool, KnowledgeAsset } from '../types';
import { BotService, AuthService, KnowledgeService, KeyService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import MagicEnhancer from '../components/MagicEnhancer';
import ChatInterface from '../components/ChatInterface';
import { AVAILABLE_TOOLS, IMAGE_STYLE_CHIPS, MODEL_REGISTRY, COMPATIBLE_IMAGE_MODELS } from '../constants';
import { 
  Save, ArrowLeft, Cpu, Brain, User, Sliders, Share2, 
  ImageIcon, BookOpen, Fingerprint, Scan, Filter, Camera, 
  Trash2, Plus, Zap, Activity, Shield, Palette, Crosshair,
  Settings, ChevronRight, Terminal, Workflow, Target, Binary,
  ShieldAlert, Gauge, Info, Ban, Focus, Anchor, Maximize,
  PieChart, BarChart4, BoxSelect, Check, ToggleLeft, ToggleRight,
  Database, Image as LucideImage, Layers, Globe, Eye,
  Paintbrush
} from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Profile', icon: User },
  { id: 'aesthetic', label: 'Aesthetics', icon: Palette },
  { id: 'intelligence', label: 'Model', icon: Brain },
  { id: 'images', label: 'Image Gen', icon: ImageIcon },
  { id: 'tools', label: 'Tools', icon: Cpu },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'configuration', label: 'Settings', icon: Sliders }
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

  const toggleTool = (toolId: string) => {
    if (!bot) return;
    const currentTools = bot.tools || [];
    const exists = currentTools.find(t => t.tool_id === toolId);
    
    let newTools;
    if (exists) {
      // Remove it (disable)
      newTools = currentTools.filter(t => t.tool_id !== toolId);
    } else {
      // Add it (enable) - find def from constants
      const def = AVAILABLE_TOOLS.find(t => t.tool_id === toolId);
      if (def) newTools = [...currentTools, { ...def, enabled: true }];
      else newTools = currentTools;
    }
    updateBot({ tools: newTools });
  };

  const toggleKnowledge = (assetId: string) => {
    if (!bot) return;
    const currentIds = bot.knowledge_ids || [];
    const updated = currentIds.includes(assetId) 
      ? currentIds.filter(id => id !== assetId)
      : [...currentIds, assetId];
    updateBot({ knowledge_ids: updated });
  };

  const handleModelSelect = (id: string) => {
     if (!bot) return;
     const modelConfigUpdate = { ...bot.model_config, primary_model: id };
     const selectedModelDef = MODEL_REGISTRY.find(m => m.model_id === id);
     
     // Reset budgets if they exceed new model limits
     if (selectedModelDef) {
         const maxCtx = selectedModelDef.context_window;
         if ((modelConfigUpdate.context_budget + modelConfigUpdate.max_output_tokens) > maxCtx) {
             modelConfigUpdate.context_budget = Math.floor(maxCtx * 0.7);
             modelConfigUpdate.max_output_tokens = Math.floor(maxCtx * 0.2);
         }
     }

     let imageConfigUpdate = { ...bot.image_gen_config };
     if (selectedModelDef?.provider_id === 'openai') {
        imageConfigUpdate.model = 'gpt-image-1.5';
        imageConfigUpdate.enabled = true; 
     } else if (selectedModelDef?.provider_id === 'google') {
        imageConfigUpdate.model = 'nano-banana-pro';
        imageConfigUpdate.enabled = true;
     }

     updateBot({ 
        model_config: modelConfigUpdate,
        image_gen_config: imageConfigUpdate
     });
  };

  const handleImageModelSelect = (id: string | null) => {
    if (!bot) return;
    if (id === null) {
      updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: false } });
    } else {
      updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: true, model: id } });
    }
  };

  // --- Token Logic Helpers ---
  const currentModelDef = MODEL_REGISTRY.find(m => m.model_id === bot?.model_config.primary_model);
  const maxTotalTokens = currentModelDef?.context_window || 128000;
  
  const outputBudget = bot?.model_config.max_output_tokens || 0;
  const contextBudget = bot?.model_config.context_budget || 0;
  const thinkingBudget = bot?.model_config.thinking_budget || 0;
  const totalAllocated = outputBudget + contextBudget + thinkingBudget;
  const remainingTokens = maxTotalTokens - totalAllocated;

  const updateTokenBudget = (field: 'max_output_tokens' | 'context_budget' | 'thinking_budget', newValue: number) => {
      if (!bot) return;
      const currentVal = bot.model_config[field] || 0;
      const otherTotal = totalAllocated - currentVal;
      
      // Enforce limit
      if (newValue + otherTotal > maxTotalTokens) {
          newValue = maxTotalTokens - otherTotal;
      }
      
      updateBot({ model_config: { ...bot.model_config, [field]: newValue } });
  };

  if (!bot) return null;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-700">
      <header className="flex items-center justify-between mb-6 shrink-0 bg-slate-900/40 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-3 rounded-2xl bg-slate-900/50 border border-white/10 text-slate-500 hover:text-white transition-all shadow-inner group">
            <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
              Agent Configuration
            </h1>
            <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.4em] mt-1.5">{bot.name || 'NEW AGENT'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar max-w-[50vw]">
            {STEPS.map((step, idx) => (
              <button
                key={step.id} onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  activeStep === idx ? 'bg-blue-600 text-white font-black shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-500/50' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <step.icon size={15} strokeWidth={activeStep === idx ? 3 : 2} />
                <span className="text-[11px] font-black uppercase tracking-widest hidden xl:block">{step.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleSave} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 active:scale-95 border border-white/10 hover:border-blue-400/50">
            <Save size={18} /> Save Agent
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-0 px-2">
        {/* Left Config Pane - Fixed Width for better preview space */}
        <div className="w-[420px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4 pb-20">
          
          {/* STEP 0: PROFILE */}
          {activeStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-8 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <User size={20} className="text-blue-500" />
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Agent Profile</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Name</label>
                    <input 
                      type="text" value={bot.name}
                      onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[14px] font-mono text-white outline-none focus:border-blue-500/50 shadow-inner transition-colors"
                      placeholder="e.g. MARKETING_ASSISTANT"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Handle</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-5 py-5 transition-colors focus-within:border-blue-500/50">
                      <span className="text-slate-700 font-black text-xs pr-1">@</span>
                      <input 
                        type="text" value={bot.slug}
                        onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="bg-transparent text-xs font-bold text-blue-400 outline-none w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Instructions</label>
                    <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                  </div>
                  <textarea 
                    value={bot.system_instructions}
                    onChange={e => updateBot({ system_instructions: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 text-[14px] text-slate-300 h-80 focus:border-blue-500/30 outline-none resize-none shadow-inner leading-relaxed custom-scrollbar"
                    placeholder="Enter the core instructions for the agent..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: AESTHETICS (NEW) */}
          {activeStep === 1 && (
             <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-8">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <Paintbrush size={20} className="text-purple-500" />
                      <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Aesthetic Engine</h3>
                   </div>

                   {/* Color Pickers */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chromatic Identity</label>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-600 uppercase">Primary Hue</span>
                            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                               <input 
                                  type="color" value={bot.theme_config.primary_color}
                                  onChange={e => updateBot({ theme_config: { ...bot.theme_config, primary_color: e.target.value } })}
                                  className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                               />
                               <span className="text-[10px] font-mono text-white">{bot.theme_config.primary_color}</span>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-600 uppercase">Secondary Hue</span>
                            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                               <input 
                                  type="color" value={bot.theme_config.secondary_color}
                                  onChange={e => updateBot({ theme_config: { ...bot.theme_config, secondary_color: e.target.value } })}
                                  className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                               />
                               <span className="text-[10px] font-mono text-white">{bot.theme_config.secondary_color}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Font Family */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Typography Matrix</label>
                      <select 
                         value={bot.theme_config.font_family}
                         onChange={e => updateBot({ theme_config: { ...bot.theme_config, font_family: e.target.value } })}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[12px] font-mono text-white outline-none focus:border-purple-500/50"
                      >
                         <option value="Inter">Inter UI (Standard)</option>
                         <option value="JetBrains Mono">JetBrains (Code)</option>
                         <option value="Space Grotesk">Space Grotesk (Modern)</option>
                         <option value="System-ui">System Native</option>
                      </select>
                   </div>

                   {/* Background Style */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environment Texture</label>
                      <div className="grid grid-cols-2 gap-2">
                         {['solid', 'gradient', 'glass', 'mesh'].map(s => (
                            <button
                               key={s}
                               onClick={() => updateBot({ theme_config: { ...bot.theme_config, background_style: s } })}
                               className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                  bot.theme_config.background_style === s 
                                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg' 
                                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
                               }`}
                            >
                               {s}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Button Style */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interactable Geometry</label>
                      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                         {['rounded', 'sharp', 'pill'].map(s => (
                            <button
                               key={s}
                               onClick={() => updateBot({ theme_config: { ...bot.theme_config, button_style: s } })}
                               className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                  bot.theme_config.button_style === s 
                                  ? 'bg-white text-black shadow-lg' 
                                  : 'text-slate-500 hover:text-white'
                               }`}
                            >
                               {s}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* STEP 2: MODEL */}
          {activeStep === 2 && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                  <Brain size={20} className="text-blue-500" />
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Model Selection</h3>
                </div>
                <ModelSelector 
                  selectedId={bot.model_config.primary_model} 
                  onSelect={handleModelSelect}
                  selectedImageModelId={bot.image_gen_config.model}
                  imageGenEnabled={bot.image_gen_config.enabled}
                  onSelectImageModel={handleImageModelSelect}
                />
              </div>
            </div>
          )}

          {/* STEP 3: IMAGE GENERATION */}
          {activeStep === 3 && (
             <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-10">
                   <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                         <LucideImage size={20} className="text-blue-500" />
                         <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Visual Synthesis Core</h3>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black uppercase text-slate-500">Module Status</span>
                         <button 
                            onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: !bot.image_gen_config.enabled } })}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${bot.image_gen_config.enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${bot.image_gen_config.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                      </div>
                   </div>

                   {bot.image_gen_config.enabled ? (
                      <>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Visual Model</label>
                            <div className="grid grid-cols-2 gap-4">
                               {['dall-e-3', 'gpt-image-1.5', 'imagen-4', 'imagen-3'].map(m => (
                                  <button
                                     key={m}
                                     onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, model: m } })}
                                     className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
                                        bot.image_gen_config.model === m 
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                                        : 'bg-black/20 border-white/5 text-slate-500 hover:text-white'
                                     }`}
                                  >
                                     <Zap size={14} />
                                     <span className="text-[10px] font-black uppercase tracking-widest">{m}</span>
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frame Ratio</label>
                            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                               {['1:1', '16:9', '9:16'].map((ratio) => (
                                  <button
                                     key={ratio}
                                     onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, aspect_ratio: ratio as any } })}
                                     className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        bot.image_gen_config.aspect_ratio === ratio 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-slate-500 hover:text-white'
                                     }`}
                                  >
                                     {ratio}
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Style Matrix Chips</label>
                            <div className="grid grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                               {IMAGE_STYLE_CHIPS.map(chip => (
                                  <button
                                     key={chip}
                                     onClick={() => toggleChip(chip)}
                                     className={`px-3 py-2.5 rounded-lg border text-[9px] font-black uppercase tracking-wider truncate transition-all ${
                                        bot.image_gen_config.selected_chips.includes(chip)
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                                     }`}
                                  >
                                     {chip}
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latent Style Prompt (Hidden)</label>
                            <textarea 
                               value={bot.image_gen_config.style_prompt}
                               onChange={(e) => updateBot({ image_gen_config: { ...bot.image_gen_config, style_prompt: e.target.value } })}
                               className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] font-mono text-slate-400 h-24 focus:border-blue-500/30 outline-none resize-none"
                               placeholder="e.g. Always generate images with a dark, moody cyberpunk aesthetic..."
                            />
                         </div>
                      </>
                   ) : (
                      <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                         <Eye size={48} className="mb-4" />
                         <h4 className="text-[12px] font-black uppercase tracking-widest">Visual Core Offline</h4>
                         <p className="text-[10px] mt-2">Enable module to configure synthesis parameters.</p>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* STEP 4: TOOLS */}
          {activeStep === 4 && (
             <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-8">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <Cpu size={20} className="text-blue-500" />
                      <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Available Toolset</h3>
                   </div>
                   
                   <div className="space-y-4">
                      {AVAILABLE_TOOLS.map((tool) => {
                         const isActive = bot.tools.some(t => t.tool_id === tool.tool_id);
                         return (
                            <div 
                               key={tool.tool_id} 
                               className={`p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                                  isActive 
                                  ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                                  : 'bg-black/20 border-white/5 hover:border-white/10'
                               }`}
                            >
                               <div className="flex items-center gap-5">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                                     isActive ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-500 border-white/10'
                                  }`}>
                                     {tool.tool_id.includes('image') ? <ImageIcon size={20} /> : 
                                      tool.tool_id.includes('code') ? <Terminal size={20} /> : 
                                      tool.tool_id.includes('web') ? <Globe size={20} /> : <BoxSelect size={20} />}
                                  </div>
                                  <div>
                                     <h4 className={`text-[12px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-400'}`}>{tool.name}</h4>
                                     <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-wider line-clamp-1">{tool.description}</p>
                                  </div>
                               </div>
                               <button 
                                  onClick={() => toggleTool(tool.tool_id)}
                                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                     isActive 
                                     ? 'bg-blue-600 text-white shadow-lg' 
                                     : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                  }`}
                               >
                                  {isActive ? 'Active' : 'Enable'}
                               </button>
                            </div>
                         );
                      })}
                   </div>
                </div>
             </div>
          )}

          {/* STEP 5: KNOWLEDGE */}
          {activeStep === 5 && (
             <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-8">
                   <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                         <Database size={20} className="text-blue-500" />
                         <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Knowledge Vault</h3>
                      </div>
                      <button 
                         onClick={() => navigate('/knowledge')}
                         className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors"
                      >
                         <Plus size={12} /> Upload New
                      </button>
                   </div>

                   <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {allAssets.length === 0 ? (
                         <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-2xl opacity-50">
                            <p className="text-[10px] font-black uppercase text-slate-500">Vault Empty. Ingest data to link.</p>
                         </div>
                      ) : (
                         allAssets.map(asset => {
                            const isLinked = (bot.knowledge_ids || []).includes(asset.id);
                            return (
                               <div 
                                  key={asset.id}
                                  onClick={() => toggleKnowledge(asset.id)}
                                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                                     isLinked 
                                     ? 'bg-emerald-500/10 border-emerald-500/50' 
                                     : 'bg-black/20 border-white/5 hover:border-white/20'
                                  }`}
                               >
                                  <div className="flex items-center gap-4">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLinked ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                                        <Layers size={14} />
                                     </div>
                                     <div>
                                        <div className={`text-[11px] font-black uppercase tracking-tight ${isLinked ? 'text-emerald-400' : 'text-slate-400'}`}>{asset.name}</div>
                                        <div className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">{asset.type} // {asset.source}</div>
                                     </div>
                                  </div>
                                  {isLinked && <Check size={16} className="text-emerald-500" />}
                               </div>
                            );
                         })
                      )}
                   </div>
                </div>
             </div>
          )}

          {/* STEP 6: SETTINGS (Configuration) */}
          {activeStep === 6 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-12">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <Sliders size={20} className="text-blue-500" />
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Behavior Controls</h3>
                </div>

                {/* Focus / Avoid Directives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                           <Focus size={14} /> Focus Targets
                         </label>
                      </div>
                      <textarea 
                        value={bot.positive_directives}
                        onChange={e => updateBot({ positive_directives: e.target.value })}
                        placeholder="e.g. Be concise, use technical terms..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[12px] font-mono text-emerald-400 h-32 focus:border-emerald-500/30 outline-none resize-none shadow-inner"
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                           <Ban size={14} /> Avoidance Protocols
                         </label>
                      </div>
                      <textarea 
                        value={bot.negative_directives}
                        onChange={e => updateBot({ negative_directives: e.target.value })}
                        placeholder="e.g. Do not use emojis, avoid filler words..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[12px] font-mono text-rose-400 h-32 focus:border-rose-500/30 outline-none resize-none shadow-inner"
                      />
                   </div>
                </div>

                {/* Token Budgeting System */}
                <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <BarChart4 size={16} className="text-blue-500" />
                         <span className="text-[11px] font-black text-white uppercase tracking-widest">Token Allocation Budget</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{totalAllocated.toLocaleString()} / {maxTotalTokens.toLocaleString()} TOTAL CAPACITY</span>
                   </div>
                   
                   {/* Visualization Bar */}
                   <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner border border-white/5">
                      <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(contextBudget / maxTotalTokens) * 100}%` }} title="Context Budget" />
                      <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${(outputBudget / maxTotalTokens) * 100}%` }} title="Output Budget" />
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(thinkingBudget / maxTotalTokens) * 100}%` }} title="Thinking Budget" />
                   </div>
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 px-1">
                      <span className="text-blue-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Memory/Input</span>
                      <span className="text-purple-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div> Output</span>
                      <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Thinking</span>
                      <span>{remainingTokens.toLocaleString()} Free</span>
                   </div>

                   <div className="grid grid-cols-1 gap-8 pt-4">
                      {/* Context Slider */}
                      <TokenSlider 
                         label="Memory & Context Retention"
                         value={contextBudget}
                         max={maxTotalTokens}
                         color="text-blue-500"
                         accentColor="bg-blue-600"
                         onChange={(v) => updateTokenBudget('context_budget', v)}
                      />
                      {/* Output Slider */}
                      <TokenSlider 
                         label="Max Response Output"
                         value={outputBudget}
                         max={maxTotalTokens}
                         color="text-purple-500"
                         accentColor="bg-purple-600"
                         onChange={(v) => updateTokenBudget('max_output_tokens', v)}
                      />
                      {/* Thinking Slider (Conditional) */}
                      {currentModelDef?.capabilities.reasoning && (
                         <TokenSlider 
                            label="Reasoning / Thinking Budget"
                            value={thinkingBudget}
                            max={maxTotalTokens}
                            color="text-emerald-500"
                            accentColor="bg-emerald-500"
                            onChange={(v) => updateTokenBudget('thinking_budget', v)}
                         />
                      )}
                   </div>
                </div>

                <div className="space-y-8 pt-6 border-t border-white/5">
                   {/* Sliders Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <ConfigSlider 
                        label="Temperature" 
                        value={bot.model_config.temperature} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, temperature: v } })}
                        min={0} max={1} step={0.1}
                      />
                      <ConfigSlider 
                        label="Top P" 
                        value={bot.model_config.top_p} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, top_p: v } })}
                        min={0} max={1} step={0.05}
                      />
                      <ConfigSlider 
                        label="Frequency Penalty" 
                        value={bot.model_config.frequency_penalty} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, frequency_penalty: v } })}
                        min={0} max={2} step={0.1}
                      />
                      <ConfigSlider 
                        label="Presence Penalty" 
                        value={bot.model_config.presence_penalty} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, presence_penalty: v } })}
                        min={0} max={2} step={0.1}
                      />
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Pane - Expanded */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex items-center justify-between gap-4 mb-5 px-4 shrink-0">
            <div className="flex items-center gap-4">
              <Activity size={18} className="text-blue-600 animate-pulse" />
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Live Preview</h4>
            </div>
          </div>
          <div className="flex-1 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative rounded-[3rem] overflow-hidden border border-white/10 bg-black/40">
            <ChatInterface 
              bot={bot} 
              className="h-full border-none rounded-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigSlider({ label, value, onChange, min, max, step }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number, step: number }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
        <span>{label}</span>
        <span className="text-blue-400 font-mono">{value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 hover:bg-white/10 transition-colors"
      />
    </div>
  );
}

function TokenSlider({ label, value, max, color, accentColor, onChange }: { label: string, value: number, max: number, color: string, accentColor: string, onChange: (v: number) => void }) {
   return (
      <div className="space-y-3">
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><BoxSelect size={12} /> {label}</span>
            <span className={`${color} font-mono`}>{value.toLocaleString()} TKNS</span>
         </div>
         <input 
            type="range" min={0} max={max} step={256}
            value={value}
            onChange={e => onChange(parseInt(e.target.value))}
            className={`w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-800 accent-${accentColor.replace('bg-', '')}`}
            style={{ accentColor: accentColor.replace('bg-', '') }} // Fallback for some browsers
         />
      </div>
   );
}
