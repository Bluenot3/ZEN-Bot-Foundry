
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
  ShieldAlert, Gauge, Info, Ban, Focus, Anchor, Maximize
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

  const handleModelSelect = (id: string) => {
     if (!bot) return;
     const modelConfigUpdate = { ...bot.model_config, primary_model: id };
     const selectedModelDef = MODEL_REGISTRY.find(m => m.model_id === id);
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

  if (!bot) return null;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-700">
      <header className="flex items-center justify-between mb-6 shrink-0 bg-slate-900/40 p-5 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-slate-500 hover:text-white transition-all shadow-inner">
            <ArrowLeft size={18} strokeWidth={3} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
              Foundry_Synthesis
            </h1>
            <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.4em] mt-1.5">{bot.name || 'NEW_MANIFEST'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar max-w-[50vw]">
            {STEPS.map((step, idx) => (
              <button
                key={step.id} onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  activeStep === idx ? 'bg-blue-600 text-white font-black shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <step.icon size={15} strokeWidth={activeStep === idx ? 3 : 2} />
                <span className="text-[11px] font-black uppercase tracking-widest hidden xl:block">{step.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleSave} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 active:scale-95">
            <Save size={18} /> Initialize
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-0 px-2">
        <div className="w-[48%] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4 pb-20">
          {activeStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/5 space-y-10">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <User size={20} className="text-blue-500" />
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Identity_Matrix</h3>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bot_Callsign</label>
                    <input 
                      type="text" value={bot.name}
                      onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[14px] font-mono text-white outline-none focus:border-blue-500/50 shadow-inner"
                      placeholder="ALPHA_PROTOTYPE"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network_Slug</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-5 py-5">
                      <span className="text-slate-700 font-black text-xs pr-1">ZN_</span>
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Directive_Manifest</label>
                    <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                  </div>
                  <textarea 
                    value={bot.system_instructions}
                    onChange={e => updateBot({ system_instructions: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 text-[14px] text-slate-300 h-80 focus:border-blue-500/30 outline-none resize-none shadow-inner leading-relaxed"
                    placeholder="Input agent foundational logic and behavioral constraints..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/5">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                  <Brain size={20} className="text-blue-500" />
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Intelligence_Node</h3>
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

          {activeStep === 5 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/5 space-y-12">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <Sliders size={20} className="text-blue-500" />
                  <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Behavioral_Telemetry_Forge</h3>
                </div>

                {/* Focus / Avoid Directives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                           <Focus size={14} /> Focus_Targets
                         </label>
                      </div>
                      <textarea 
                        value={bot.positive_directives}
                        onChange={e => updateBot({ positive_directives: e.target.value })}
                        placeholder="Define what the agent SHOULD focus on..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[12px] font-mono text-emerald-400 h-32 focus:border-emerald-500/30 outline-none resize-none shadow-inner"
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                           <Ban size={14} /> Avoid_Constraints
                         </label>
                      </div>
                      <textarea 
                        value={bot.negative_directives}
                        onChange={e => updateBot({ negative_directives: e.target.value })}
                        placeholder="Define what the agent SHOULD avoid..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[12px] font-mono text-rose-400 h-32 focus:border-rose-500/30 outline-none resize-none shadow-inner"
                      />
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Target size={14} className="text-blue-500" /> System_Anchor (Reminder)
                        </label>
                      </div>
                      <textarea 
                        value={bot.system_reminder}
                        onChange={e => updateBot({ system_reminder: e.target.value })}
                        placeholder="This prompt is injected at the end of every system call for maximum influence."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[12px] font-mono text-blue-400 h-24 focus:border-blue-500/30 outline-none resize-none shadow-inner"
                      />
                   </div>

                   {/* Sliders Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <ConfigSlider 
                        label="Entropy_Temperature" 
                        value={bot.model_config.temperature} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, temperature: v } })}
                        min={0} max={1} step={0.1}
                      />
                      <ConfigSlider 
                        label="Nucleus_Sampling (Top-P)" 
                        value={bot.model_config.top_p} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, top_p: v } })}
                        min={0} max={1} step={0.05}
                      />
                      <ConfigSlider 
                        label="Frequency_Penalty" 
                        value={bot.model_config.frequency_penalty} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, frequency_penalty: v } })}
                        min={0} max={2} step={0.1}
                      />
                      <ConfigSlider 
                        label="Presence_Penalty" 
                        value={bot.model_config.presence_penalty} 
                        onChange={v => updateBot({ model_config: { ...bot.model_config, presence_penalty: v } })}
                        min={0} max={2} step={0.1}
                      />
                   </div>

                   <div className="space-y-5 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                        <span className="flex items-center gap-2"><Binary size={14} /> Reasoning_Token_Budget</span>
                        <span className="text-blue-400">{bot.model_config.thinking_budget} TKNS</span>
                      </div>
                      <input 
                        type="range" min="0" max="32768" step="1024" 
                        value={bot.model_config.thinking_budget}
                        onChange={e => updateBot({ model_config: { ...bot.model_config, thinking_budget: parseInt(e.target.value) } })}
                        className="w-full h-1.5 bg-blue-900/30 rounded-full appearance-none cursor-pointer accent-blue-500"
                      />
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <ShieldAlert size={14} className="text-rose-500" /> Stop_Sequences
                      </label>
                      <input 
                        type="text" 
                        placeholder="Comma separated: \n, USER:, STOP"
                        value={bot.model_config.stop_sequences.join(', ')}
                        onChange={e => updateBot({ model_config: { ...bot.model_config, stop_sequences: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[12px] font-mono text-rose-400 outline-none focus:border-rose-500/30 shadow-inner"
                      />
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-4 mb-5 px-4">
            <div className="flex items-center gap-4">
              <Activity size={18} className="text-blue-600 animate-pulse" />
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Live_Neural_Preview</h4>
            </div>
          </div>
          <div className="flex-1 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative rounded-[3.5rem] overflow-hidden border border-white/10">
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
        <span className="text-blue-400">{value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}
