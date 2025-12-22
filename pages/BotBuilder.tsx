
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig, Tool } from '../types';
import { BotService, AuthService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import { 
  Save, ArrowLeft, Settings, Cpu, Share2, Wrench, Activity, 
  Users, GitBranch, Zap, Info, Layers, RefreshCw, Check, 
  Brain, Globe, Shield, User, Sliders, Target, Eye, Microscope,
  Sparkles, Terminal, Code, Database, ChevronRight, Wand2
} from 'lucide-react';

const STEPS = [
  { id: 'definition', label: 'Identity', icon: User },
  { id: 'intelligence', label: 'Neural Core', icon: Brain },
  { id: 'tools', label: 'Toolbox', icon: Wrench },
  { id: 'workflow', label: 'Workflows', icon: Microscope },
  { id: 'deployment', label: 'Launch', icon: Share2 }
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [isForging, setIsForging] = useState(false);

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

  const quickForge = async () => {
    if (!bot?.description) return;
    setIsForging(true);
    // Simulate AI forge of the manifest
    setTimeout(() => {
      updateBot({
        name: bot.description.split(' ').slice(0, 2).join('_').toUpperCase(),
        system_instructions: `You are a professional assistant designed for: ${bot.description}. Act as a high-fidelity intelligence unit.`,
        features: { ...bot.features, quick_forge: true }
      });
      setIsForging(false);
      setActiveStep(1);
    }, 1500);
  };

  if (!bot) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">Foundry Pro Configurator</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{id ? bot.name : 'Asset Synthesis'}</h1>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => updateFeature('quick_forge', !bot.features.quick_forge)}
             className={`px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${bot.features.quick_forge ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-slate-400 border border-slate-200'}`}
           >
             <Wand2 size={16} /> Quick Forge {bot.features.quick_forge ? 'ON' : 'OFF'}
           </button>
           <button 
             onClick={handleSave}
             className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-[13px] tracking-widest hover:bg-blue-600 transition-all uppercase flex items-center gap-3 shadow-xl shadow-slate-900/10"
           >
             <Save size={18} /> Sync Manifest
           </button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full">
        {/* Navigation HUB */}
        <div className="flex mb-12 bg-white/50 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white shadow-sm overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 py-4 flex items-center justify-center gap-3 transition-all rounded-[2rem] whitespace-nowrap px-6 ${
                activeStep === idx 
                  ? 'bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <step.icon size={16} />
              <span className="font-bold text-[11px] uppercase tracking-widest">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-12">
          {activeStep === 0 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              {bot.features.quick_forge ? (
                <div className="mil-panel p-20 text-center space-y-8 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-2xl">
                    <Wand2 size={40} />
                  </div>
                  <div className="space-y-4 max-w-lg mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 uppercase">1-Sentence Forge</h2>
                    <p className="text-slate-500 font-medium">Describe your agent and ZEN will architect the rest.</p>
                    <textarea 
                      value={bot.description}
                      onChange={e => updateBot({ description: e.target.value })}
                      className="w-full mil-input p-6 text-[16px] h-32 leading-relaxed"
                      placeholder="e.g. A lead qualification agent that asks for email and company size then pushes to a webhook."
                    />
                    <button 
                      onClick={quickForge}
                      disabled={isForging || !bot.description}
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isForging ? 'Synthesizing Manifest...' : 'Generate Agent'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mil-panel p-10 space-y-10">
                   <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <Terminal size={18} className="text-blue-600" />
                      <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Base Designation</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unit Name</label>
                       <input 
                         type="text" 
                         value={bot.name}
                         onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                         className="w-full mil-input p-5 text-[15px] font-black"
                       />
                     </div>
                     <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Public Slug</label>
                       <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1">
                          <span className="text-slate-400 text-xs">zen.foundry/</span>
                          <input 
                            type="text" 
                            value={bot.slug}
                            onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            className="bg-transparent border-none focus:ring-0 p-3 text-sm font-bold w-full"
                          />
                       </div>
                     </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Operational Directive</label>
                      <textarea 
                        value={bot.system_instructions}
                        onChange={e => updateBot({ system_instructions: e.target.value })}
                        className="w-full mil-input p-5 text-[14px] h-48"
                      />
                   </div>
                </div>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="mil-panel p-10 space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <Brain size={18} className="text-blue-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Neural Logic Selection</h3>
                </div>
                <ModelSelector 
                  selectedId={bot.model_config.primary_model} 
                  onSelect={(id) => updateBot({ model_config: { ...bot.model_config, primary_model: id } })} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="mil-panel p-8 space-y-6">
                    <div className="flex justify-between items-center">
                       <label className="text-[11px] font-black text-slate-400 uppercase">Reasoning Budget</label>
                       <span className="text-blue-600 font-bold">{bot.model_config.thinking_budget} TKNS</span>
                    </div>
                    <input 
                      type="range" min="0" max="32000" step="1000"
                      value={bot.model_config.thinking_budget}
                      onChange={e => updateBot({ model_config: { ...bot.model_config, thinking_budget: parseInt(e.target.value) } })}
                      className="w-full accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400">Allocates dedicated neural compute for complex task planning.</p>
                 </div>
                 <div className="mil-panel p-8 space-y-6">
                    <div className="flex justify-between items-center">
                       <label className="text-[11px] font-black text-slate-400 uppercase">Signal Temperature</label>
                       <span className="text-blue-600 font-bold">{bot.model_config.temperature}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.1"
                      value={bot.model_config.temperature}
                      onChange={e => updateBot({ model_config: { ...bot.model_config, temperature: parseFloat(e.target.value) } })}
                      className="w-full accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400">Low = Precise & Analytical. High = Creative & Fluid.</p>
                 </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="mil-panel p-10">
                <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
                   <div className="flex items-center gap-3">
                      <Wrench size={18} className="text-blue-600" />
                      <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Global Action Registry</h3>
                   </div>
                   <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                      <Plus size={14} /> Register Custom Tool
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bot.tools.map(tool => (
                    <button 
                      key={tool.tool_id}
                      onClick={() => toggleTool(tool.tool_id)}
                      className={`p-6 rounded-[2rem] border transition-all text-left flex gap-4 ${tool.enabled ? 'bg-white border-blue-500 shadow-xl ring-4 ring-blue-500/5' : 'bg-white/40 border-slate-200 opacity-60'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${tool.enabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {tool.tool_id === 'web_search' ? <Globe size={20} /> : tool.tool_id === 'code_interpreter' ? <Code size={20} /> : <Database size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className={`text-[13px] font-black uppercase ${tool.enabled ? 'text-slate-900' : 'text-slate-500'}`}>{tool.name}</h4>
                           {tool.enabled && <Check size={14} className="text-blue-600" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{tool.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="mil-panel p-20 text-center space-y-12 animate-in zoom-in-95 duration-500 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>
               <div className="w-32 h-32 rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-blue-900 text-white flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
                  <Shield size={56} />
               </div>
               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 uppercase">Operational Lock</h2>
                  <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">
                    Manifest synthesized. Your neural asset is encrypted and ready for production deployment.
                  </p>
               </div>
               <div className="flex flex-col md:flex-row justify-center gap-6">
                  <button 
                    onClick={handleSave}
                    className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-[16px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4"
                  >
                    Deploy to Foundry <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => updateBot({ publish_state: 'arena' })}
                    className={`px-12 py-6 rounded-[2.5rem] font-black text-[16px] uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-4 ${bot.publish_state === 'arena' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    <Sparkles size={20} /> Publish to Arena
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Plus({ size, className }: any) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
