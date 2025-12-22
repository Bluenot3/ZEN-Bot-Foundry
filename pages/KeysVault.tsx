import React, { useState, useEffect } from 'react';
import { KeyService, AuthService } from '../services/store';
import { MODEL_REGISTRY } from '../constants';
import { ApiKey, User } from '../types';
import { Shield, Check, Trash, Plus, Cloud, Key, Lock, Layers, Zap, CheckCircle2, Search } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'google', name: 'Google Cloud' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'perplexity', name: 'Perplexity' },
  { id: 'mistral', name: 'Mistral' },
  { id: 'meta', name: 'Meta / Llama' },
  { id: 'xai', name: 'xAI / Grok' },
  { id: 'amazon', name: 'Amazon Bedrock' },
  { id: 'nvidia', name: 'NVIDIA' },
  { id: 'cohere', name: 'Cohere' },
  { id: 'specialized', name: 'Specialized (DeepSeek/Qwen)' },
];

export default function KeysVault() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(AuthService.getUser());

  useEffect(() => {
    setKeys(KeyService.getKeys());
  }, []);

  const handleSaveKey = (providerId: string) => {
    const val = inputs[providerId];
    if (val) {
      KeyService.saveKey(providerId, val);
      setKeys(KeyService.getKeys());
      setSelectedProvider(providerId); // Move to step 2
    }
  };

  const finalizeModels = () => {
    alert(`Models permissions synced for ${selectedProvider}. Foundational nodes active.`);
    setSelectedProvider(null);
    setSelectedModels([]);
  };

  const toggleModel = (id: string) => {
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleDelete = (providerId: string) => {
    if (confirm(`Terminate ${providerId} credentials permanently?`)) {
      KeyService.deleteKey(providerId);
      setKeys(KeyService.getKeys());
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="liquid-glass p-12 rounded-[3rem] border-l-8 border-l-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-blue-500">
          <Shield size={180} />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] shrink-0">
            <Lock size={48} />
          </div>
          <div className="space-y-4">
             <h1 className="text-4xl font-black text-white uppercase tracking-tight">Credential Nexus</h1>
             <p className="text-slate-400 text-lg leading-relaxed max-w-3xl uppercase tracking-wider font-medium opacity-80">
               ZEN implements a secure BYOK (Bring Your Own Key) protocol. Authorized tokens allow the Foundry to automatically route logic through your local project credits.
             </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Provider Registry</h2>
               <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                  <Zap size={14} className="animate-pulse" /> Nodes Active
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROVIDERS.map(p => {
                const existing = keys.find(k => k.provider_id === p.id);
                return (
                  <div key={p.id} className={`liquid-glass p-6 rounded-[2rem] flex flex-col gap-5 group transition-all duration-500 ${existing ? 'border-blue-500/30 bg-blue-600/[0.03]' : 'border-white/5'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${existing ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                           <Key size={18} />
                         </div>
                         <h3 className="text-[13px] font-black text-white uppercase tracking-widest">{p.name}</h3>
                      </div>
                      {existing && (
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                    
                    {existing ? (
                      <div onClick={() => setSelectedProvider(p.id)} className="cursor-pointer text-emerald-400 flex items-center justify-between gap-2 text-[10px] font-black bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} /> ENCRYPTED: {existing.key_snippet}
                        </div>
                        <span className="text-slate-500 text-[8px] hover:text-white transition-colors">CONFIG_MODELS</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="password"
                          placeholder="INPUT_ACCESS_TOKEN..."
                          value={inputs[p.id] || ''}
                          onChange={e => setInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                          className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-[11px] font-mono text-blue-400 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                        <button 
                          onClick={() => handleSaveKey(p.id)}
                          disabled={!inputs[p.id]}
                          className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30"
                        >
                          LOCK
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
         </div>

         {/* Model Permission Sidebar - Liquid Glass Modal Style */}
         <div className="space-y-6">
            <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Model Permissions</h2>
            {selectedProvider ? (
               <div className="liquid-glass p-8 rounded-[2.5rem] space-y-8 animate-in slide-in-from-right-8 duration-500 border-blue-500/40">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                     <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Layers size={24} />
                     </div>
                     <div>
                        <h4 className="text-[14px] font-black text-white uppercase">{selectedProvider} Hub</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Select available neural nodes</p>
                     </div>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                     {MODEL_REGISTRY.filter(m => m.provider_id === selectedProvider).map(m => (
                        <button 
                           key={m.model_id}
                           onClick={() => toggleModel(m.model_id)}
                           className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              selectedModels.includes(m.model_id) 
                              ? 'bg-blue-600/10 border-blue-500 text-white' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                           }`}
                        >
                           <div className="text-[11px] font-black uppercase truncate pr-4">{m.display_name}</div>
                           {selectedModels.includes(m.model_id) && <Check size={14} className="text-blue-500" />}
                        </button>
                     ))}
                  </div>

                  <button 
                     onClick={finalizeModels}
                     className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                  >
                     Authorize Nodes
                  </button>
               </div>
            ) : (
               <div className="liquid-glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-40">
                  <Plus size={48} className="text-slate-600 mb-4" />
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Lock a provider key to manage permissions</p>
               </div>
            )}

            <div className="liquid-glass p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent">
               <div className="flex items-center gap-4 mb-4">
                  <Cloud className="text-blue-400" size={24} />
                  <h3 className="text-[13px] font-black text-white uppercase tracking-widest">Vertex Auto-Sync</h3>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase mb-6 tracking-tight">
                  Connect your primary Google project ({user?.email}) for automated quota management and dynamic scaling.
               </p>
               <button className="w-full py-4 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  Initialize Vertex Cloud
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}