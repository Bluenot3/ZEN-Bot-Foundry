import React, { useState, useEffect } from 'react';
import { KeyService, AuthService } from '../services/store';
import { ApiKey, User } from '../types';
import { Shield, Check, Trash, Plus, Cloud } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'google', name: 'Google (Cloud)' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'mistral', name: 'Mistral' },
];

export default function KeysVault() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(AuthService.getUser());

  useEffect(() => {
    setKeys(KeyService.getKeys());
  }, []);

  const handleSave = (providerId: string) => {
    const val = inputs[providerId];
    if (val) {
      KeyService.saveKey(providerId, val);
      setKeys(KeyService.getKeys());
      setInputs(prev => ({ ...prev, [providerId]: '' }));
    }
  };

  const handleAuthorizeGoogle = async () => {
    const updatedUser = await AuthService.authorizeGoogle();
    setUser(updatedUser);
  };

  const handleDelete = (providerId: string) => {
    if (confirm(`Remove ${providerId} key?`)) {
      KeyService.deleteKey(providerId);
      setKeys(KeyService.getKeys());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-neon-cyan">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-neon-cyan/20 rounded-2xl text-neon-cyan">
            <Shield size={32} />
          </div>
          <div>
             <h1 className="text-2xl font-bold text-white mb-2">Security Vault</h1>
             <p className="text-gray-400 leading-relaxed max-w-2xl">
               Authorized accounts allow ZEN to automatically generate and rotate API keys using your Google Cloud project credits. Alternatively, use BYOK for 3rd party providers.
             </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Manual Keys (BYOK)</h2>
            {PROVIDERS.map(p => {
              const existing = keys.find(k => k.provider_id === p.id);
              return (
                <div key={p.id} className="glass-panel p-5 rounded-2xl flex items-center gap-4 group">
                  <div className="w-24 font-bold text-white text-sm">{p.name}</div>
                  <div className="flex-1">
                    {existing ? (
                      <div className="text-green-400 flex items-center gap-2 text-xs bg-green-400/10 px-3 py-2 rounded-lg border border-green-500/20">
                        <Check size={14} /> Stored ({existing.key_snippet})
                      </div>
                    ) : (
                      <input 
                        type="password"
                        placeholder="sk-..."
                        value={inputs[p.id] || ''}
                        onChange={e => setInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                        className="w-full glass-input px-4 py-2 rounded-xl text-sm"
                      />
                    )}
                  </div>
                  <div>
                    {existing ? (
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSave(p.id)}
                        disabled={!inputs[p.id]}
                        className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-gray-200 transition-all"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
         </div>

         <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Google Authorization</h2>
            <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/0">
               <div className="flex items-center gap-3 mb-4">
                  <Cloud className="text-neon-cyan" size={24} />
                  <h3 className="font-bold text-white">Vertex AI Sync</h3>
               </div>
               <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Authorize ZEN to use your current Gmail ({user?.email}) for automatic API key management in Google Cloud.
               </p>
               {user?.google_authorized ? (
                  <div className="flex flex-col items-center gap-2 text-green-400">
                     <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                        <Check size={24} />
                     </div>
                     <span className="text-sm font-bold">Authorized</span>
                     <p className="text-[10px] opacity-50">Syncing active</p>
                  </div>
               ) : (
                  <button 
                    onClick={handleAuthorizeGoogle}
                    className="w-full py-3 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                  >
                     Authorize Google Cloud
                  </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}