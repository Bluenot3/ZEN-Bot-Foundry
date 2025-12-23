
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
  Settings, ChevronRight, Terminal, Workflow
} from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Identity', icon: User },
  { id: 'intelligence', label: 'Neural', icon: Brain },
  { id: 'images', label: 'Creative', icon: ImageIcon },
  { id: 'tools', label: 'Actions', icon: Cpu },
  { id: 'knowledge', label: 'Vault', icon: BookOpen },
  { id: 'configuration', label: 'Logic', icon: Sliders }
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

  // Handles text model selection (primary)
  const handleModelSelect = (id: string) => {
     if (!bot) return;
     
     // 1. Update Primary Model
     const modelConfigUpdate = { ...bot.model_config, primary_model: id };
     
     // 2. Auto-Switch Image Engine based on Provider (Default logic)
     const selectedModelDef = MODEL_REGISTRY.find(m => m.model_id === id);
     let imageConfigUpdate = { ...bot.image_gen_config };
     
     if (selectedModelDef?.provider_id === 'openai') {
        // Default to best OpenAI model if switching provider
        imageConfigUpdate.model = 'gpt-image-1.5';
        imageConfigUpdate.enabled = true; 
     } else if (selectedModelDef?.provider_id === 'google') {
        // Default to best Google model if switching provider
        imageConfigUpdate.model = 'nano-banana-pro';
        imageConfigUpdate.enabled = true;
     }

     updateBot({ 
        model_config: modelConfigUpdate,
        image_gen_config: imageConfigUpdate
     });
  };

  // Handles manual image model selection via the chip
  const handleImageModelSelect = (id: string | null) => {
    if (!bot) return;
    
    if (id === null) {
      // Disable image gen
      updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: false } });
    } else {
      // Enable and set specific model
      updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: true, model: id } });
    }
  };

  if (!bot) return null;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-700">
      {/* Ultra-Slim Navigation Header */}
      <header className="flex items-center justify-between mb-4 shrink-0 bg-slate-900/40 p-4 rounded-3xl border border-white/5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-500 hover:text-white transition-all">
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
              {id ? 'Node Calibration' : 'Core Synthesis'}
            </h1>
            <span className="text-[9px] font-mono text-blue-500 uppercase tracking-[0.4em] mt-1">{bot.name || 'NEW_MANIFEST'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            {STEPS.map((step, idx) => (
              <button
                key={step.id} onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeStep === idx ? 'bg-blue-600 text-white font-black shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <step.icon size={14} strokeWidth={activeStep === idx ? 3 : 2} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">{step.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleSave} className="bg-white text-black px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center gap-3">
            <Save size={16} /> Deploy
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left Pane: Calibration Modules */}
        <div className="w-[45%] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          {activeStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <User size={18} className="text-blue-500" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Core Identity</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Callsign</label>
                    <input 
                      type="text" value={bot.name}
                      onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[13px] font-mono text-white outline-none focus:border-blue-500/30"
                      placeholder="ALPHA_PROTO"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uplink URL</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-4 group">
                      <span className="text-slate-700 font-black text-xs pr-1">ZEN_</span>
                      <input 
                        type="text" value={bot.slug}
                        onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="bg-transparent text-xs font-bold text-blue-400 outline-none w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Directive Manifest</label>
                    <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                  </div>
                  <textarea 
                    value={bot.system_instructions}
                    onChange={e => updateBot({ system_instructions: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-[13px] text-slate-300 h-64 focus:border-blue-500/30 outline-none resize-none shadow-inner"
                    placeholder="Synthesize agent logic and constraints..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-6">
                  <Brain size={18} className="text-blue-500" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Intelligence Core</h3>
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

          {activeStep === 2 && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5 space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <ImageIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-black text-white uppercase tracking-tighter">Aesthetic Pulse</h3>
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">
                        Engine: {bot.image_gen_config.enabled ? bot.image_gen_config.model : 'OFFLINE'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: !bot.image_gen_config.enabled } })}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${bot.image_gen_config.enabled ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-slate-500 border-white/10'}`}
                  >
                    {bot.image_gen_config.enabled ? 'ACTIVE' : 'OFFLINE'}
                  </button>
                </div>

                {bot.image_gen_config.enabled && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Scan size={14} className="text-cyan-500" /> Base Style</label>
                      <textarea 
                        value={bot.image_gen_config.style_prompt}
                        onChange={e => updateBot({ image_gen_config: { ...bot.image_gen_config, style_prompt: e.target.value } })}
                        placeholder="e.g. Cinematic, moody, 8k resolution..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[12px] font-mono text-cyan-400 h-32 focus:border-cyan-500/30 outline-none resize-none shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Filter size={14} className="text-cyan-500" /> Style Presets</label>
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {IMAGE_STYLE_CHIPS.map(chip => (
                          <button 
                            key={chip}
                            onClick={() => toggleChip(chip)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${bot.image_gen_config.selected_chips.includes(chip) ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-slate-500 border-white/10'}`}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <Cpu size={18} className="text-blue-500" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Action Nodes</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {AVAILABLE_TOOLS.map(tool => (
                    <button 
                      key={tool.tool_id} onClick={() => {
                        const current = bot.tools || [];
                        const updated = current.some(t => t.tool_id === tool.tool_id) 
                          ? current.filter(t => t.tool_id !== tool.tool_id) 
                          : [...current, { ...tool, enabled: true }];
                        updateBot({ tools: updated });
                      }}
                      className={`p-5 rounded-2xl border text-left transition-all ${bot.tools.some(t => t.tool_id === tool.tool_id) ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[12px] font-black text-white uppercase tracking-widest">{tool.name}</h4>
                        {bot.tools.some(t => t.tool_id === tool.tool_id) && <Zap size={12} className="text-blue-500 fill-current" />}
                      </div>
                      <p className="text-[9px] text-slate-600 font-bold uppercase">{tool.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <BookOpen size={18} className="text-blue-500" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Knowledge Vault</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {allAssets.map(asset => (
                    <button 
                      key={asset.id} onClick={() => {
                        const current = bot.knowledge_ids || [];
                        const updated = current.includes(asset.id) ? current.filter(id => id !== asset.id) : [...current, asset.id];
                        updateBot({ knowledge_ids: updated });
                      }}
                      className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${bot.knowledge_ids.includes(asset.id) ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                      <div>
                        <h4 className="text-[12px] font-black text-white uppercase tracking-tight">{asset.name}</h4>
                        <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{asset.type} NODE</p>
                      </div>
                      {bot.knowledge_ids.includes(asset.id) && <Plus size={14} className="rotate-45 text-blue-500" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5 space-y-10">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <Sliders size={18} className="text-blue-500" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Logic Constraints</h3>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      <span>Intelligence Temperature</span>
                      <span className="text-blue-400">{bot.model_config.temperature}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      value={bot.model_config.temperature}
                      onChange={e => updateBot({ model_config: { ...bot.model_config, temperature: parseFloat(e.target.value) } })}
                      className="w-full h-1.5 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      <span>Reasoning Token Budget</span>
                      <span className="text-blue-400">{bot.model_config.thinking_budget} TKNS</span>
                    </div>
                    <input 
                      type="range" min="0" max="32768" step="1024" 
                      value={bot.model_config.thinking_budget}
                      onChange={e => updateBot({ model_config: { ...bot.model_config, thinking_budget: parseInt(e.target.value) } })}
                      className="w-full h-1.5 bg-blue-900/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Live Operational Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-4 mb-4 px-2">
            <Activity size={16} className="text-slate-600 animate-pulse" />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Live Operational Preview</h4>
          </div>
          <div className="flex-1 shadow-3xl relative rounded-[3rem] overflow-hidden border border-white/10">
            <ChatInterface 
              bot={bot} 
              className="h-full border-none rounded-none" 
            />
            {/* Context Stats Overlay */}
            <div className="absolute top-20 left-10 pointer-events-none space-y-2 opacity-60">
               <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 status-pulse"></div>
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Preview Mode: Active</span>
               </div>
               <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-3">
                  <Shield size={10} className="text-emerald-500" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Manifest Locked</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
