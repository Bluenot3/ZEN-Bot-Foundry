
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig } from '../types';
import { BotService, AuthService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import { Save, ArrowLeft, Settings, Cpu, Share2, Wrench, Activity, Users, GitBranch, Zap, Info, Layers, RefreshCw, Check, Brain, Globe, Shield } from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Identity', icon: Settings },
  { id: 'neural', label: 'Intelligence', icon: Cpu },
  { id: 'protocols', label: 'Capabilities', icon: Wrench },
  { id: 'deployment', label: 'Finalize', icon: Share2 }
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bot, setBot] = useState<BotConfig | null>(null);

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

  const updateBot = (updates: Partial<BotConfig>) => {
    setBot(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateFeature = (key: keyof BotConfig['features'], value: boolean) => {
    if (bot) {
      setBot({
        ...bot,
        features: { ...bot.features, [key]: value }
      });
    }
  };

  const updateModelConfig = (updates: any) => {
    if (bot) {
      setBot({
        ...bot,
        model_config: { ...bot.model_config, ...updates }
      });
    }
  };

  if (!bot) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">Foundry Configurator Ultra</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{id ? bot.name : 'Asset Synthesis'}</h1>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-[13px] tracking-widest hover:bg-blue-600 transition-all uppercase flex items-center gap-3 shadow-xl shadow-slate-900/10"
        >
          <Save size={18} /> Sync Manifest
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 gap-10 min-h-0 pb-10">
        <div className="max-w-4xl mx-auto w-full">
          {/* Steps Indicator */}
          <div className="flex mb-12 bg-white/40 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white shadow-sm overflow-x-auto no-scrollbar">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 py-4 flex items-center justify-center gap-3 transition-all rounded-2xl whitespace-nowrap px-6 ${
                  activeStep === idx 
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <step.icon size={16} />
                <span className="font-bold text-[11px] uppercase tracking-widest">{step.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-12">
            {activeStep === 0 && (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div className="mil-panel p-10 space-y-10">
                   <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <Layers size={18} className="text-blue-600" />
                      <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Neural Core Definition</h3>
                   </div>
                   
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Asset Name</label>
                      <input 
                        type="text" 
                        value={bot.name}
                        onChange={e => updateBot({ name: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                        className="w-full mil-input p-5 text-[15px] font-black tracking-tight"
                        placeholder="ZEN_UNIT_X"
                      />
                   </div>

                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Operational Directive</label>
                      <textarea 
                        value={bot.system_instructions}
                        onChange={e => updateBot({ system_instructions: e.target.value })}
                        className="w-full mil-input p-5 text-[14px] font-medium h-48 leading-relaxed focus:ring-4 ring-blue-500/5"
                        placeholder="Define behavior, constraints, and expertise..."
                      />
                   </div>
                </div>

                <div className="mil-panel p-10 space-y-10 bg-blue-50/20 border-blue-100 shadow-inner">
                   <div className="flex items-center gap-3 border-b border-blue-100 pb-4">
                      <Zap size={18} className="text-blue-600" />
                      <h3 className="text-[14px] font-black text-blue-600 uppercase tracking-widest">Next-Gen Architecture Modules</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FeatureToggle 
                        icon={<Brain size={20} />}
                        title="Recursive Thinking"
                        desc="Agent uses high-budget thinking tokens to reason through complex tasks before responding."
                        active={bot.features.recursive_thinking}
                        onClick={() => updateFeature('recursive_thinking', !bot.features.recursive_thinking)}
                      />
                      <FeatureToggle 
                        icon={<Globe size={20} />}
                        title="Adaptive Routing"
                        desc="Automatically switches between models (Reasoning vs Flash) based on prompt complexity."
                        active={bot.features.adaptive_routing}
                        onClick={() => updateFeature('adaptive_routing', !bot.features.adaptive_routing)}
                      />
                      <FeatureToggle 
                        icon={<GitBranch size={20} />}
                        title="Dual-Response Mode"
                        desc="Generates two outputs side-by-side for comparison and selection."
                        active={bot.features.dual_response_mode}
                        onClick={() => updateFeature('dual_response_mode', !bot.features.dual_response_mode)}
                      />
                      <FeatureToggle 
                        icon={<Users size={20} />}
                        title="Agent Swarm"
                        desc="Consult with other specialized bots in your foundry to solve multi-domain problems."
                        active={bot.features.multi_agent_consult}
                        onClick={() => updateFeature('multi_agent_consult', !bot.features.multi_agent_consult)}
                      />
                   </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
               <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                 <div className="mil-panel p-10 space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                       <Cpu size={18} className="text-blue-600" />
                       <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">State-of-the-Art Model Selection</h3>
                    </div>
                    <ModelSelector 
                      selectedId={bot.model_config.primary_model} 
                      onSelect={(id) => updateModelConfig({ primary_model: id })} 
                    />
                 </div>
                 
                 <div className="mil-panel p-10 bg-slate-50/50">
                    <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-8">Neural Sensitivity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">Temperature: {bot.model_config.temperature}</label>
                          <input 
                            type="range" min="0" max="1" step="0.1"
                            value={bot.model_config.temperature}
                            onChange={e => updateModelConfig({ temperature: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">Top-P: {bot.model_config.topP}</label>
                          <input 
                            type="range" min="0" max="1" step="0.05"
                            value={bot.model_config.topP}
                            onChange={e => updateModelConfig({ topP: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                          />
                       </div>
                    </div>
                 </div>
               </div>
            )}

            {activeStep === 3 && (
               <div className="mil-panel p-20 text-center space-y-10 border-blue-200 bg-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>
                  <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 transform transition-transform group-hover:scale-110 duration-500">
                     <Shield size={48} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Manifest Locked</h2>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed text-lg">
                       Foundry unit configured with elite parameters. Ready for deployment to the tactical workspace.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={handleSave} 
                      className="bg-slate-900 text-white px-14 py-6 rounded-[2rem] font-black text-[16px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
                    >
                      Initialize Deployment
                    </button>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureToggle = ({ icon, title, desc, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-4 relative group ${active ? 'bg-white border-blue-500 shadow-xl ring-2 ring-blue-500/5' : 'bg-white/40 border-slate-200 opacity-60 hover:opacity-100 hover:bg-white/60'}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
      {icon}
    </div>
    <div>
      <h4 className={`text-[14px] font-black uppercase tracking-tight ${active ? 'text-slate-900' : 'text-slate-600'}`}>{title}</h4>
      <p className="text-[11px] font-medium text-slate-400 mt-2 leading-snug">{desc}</p>
    </div>
    {active && (
      <div className="absolute top-6 right-6">
        <Check size={16} className="text-blue-600" />
      </div>
    )}
  </button>
);
