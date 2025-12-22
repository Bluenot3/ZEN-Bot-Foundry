
import React, { useState } from 'react';
import { MODEL_REGISTRY } from '../constants';
import { Cpu, Zap, BrainCircuit, Sparkles, Check, ChevronRight, Layers, Activity } from 'lucide-react';

interface ModelSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ModelSelector({ selectedId, onSelect }: ModelSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('openai');

  const categories = Array.from(new Set(MODEL_REGISTRY.map(m => m.provider_id)));
  const filteredModels = MODEL_REGISTRY.filter(m => m.provider_id === activeCategory);

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Enhanced Provider Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(0,102,255,0.3)]' 
                : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rearchitected Model Grid - High Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar pb-10">
        {filteredModels.map((model) => {
          const isSelected = selectedId === model.model_id;
          const Icon = model.capabilities.reasoning ? BrainCircuit : Zap;
          
          return (
            <button
              key={model.model_id}
              onClick={() => onSelect(model.model_id)}
              className={`relative p-5 rounded-3xl border transition-all text-left flex flex-col group overflow-visible ${
                isSelected 
                  ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(0,102,255,0.1)]' 
                  : 'bg-[#010816]/40 border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {/* Selected Vertical Accent */}
              {isSelected && (
                <div className="absolute top-1/3 bottom-1/3 left-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(0,102,255,1)]"></div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 text-slate-500 border-white/10'
                }`}>
                  <Icon size={18} />
                </div>
                {isSelected && (
                  <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg border border-blue-300">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                      model.cost_tier === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {model.cost_tier}
                    </span>
                  </div>
                  <h4 className={`text-[13px] font-black tracking-tight uppercase break-words leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {model.display_name}
                  </h4>
                </div>
                
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter bg-black/30 px-2 py-1 rounded-lg w-fit border border-white/5">
                   <Activity size={10} className="text-blue-500" />
                   {model.context_window.toLocaleString()} TOKENS
                </div>
              </div>

              {/* Enhanced Capability Badges */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/10">
                 {model.capabilities.vision && <CapabilityBadge label="Vis" />}
                 {model.capabilities.coding && <CapabilityBadge label="Code" />}
                 {model.capabilities.reasoning && <CapabilityBadge label="Log" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CapabilityBadge({ label }: { label: string }) {
  return (
    <span className="text-[7px] font-black text-blue-400/80 border border-blue-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider bg-blue-500/5 whitespace-nowrap">
      {label}
    </span>
  );
}
