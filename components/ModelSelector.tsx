
import React from 'react';
import { MODEL_REGISTRY } from '../constants';
import { Cpu, Zap, BrainCircuit, Sparkles, Check } from 'lucide-react';

interface ModelSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ModelSelector({ selectedId, onSelect }: ModelSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {MODEL_REGISTRY.map((model) => {
        const isSelected = selectedId === model.model_id;
        const Icon = model.capabilities.reasoning ? BrainCircuit : Zap;
        
        return (
          <button
            key={model.model_id}
            onClick={() => onSelect(model.model_id)}
            className={`relative p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-4 group ${
              isSelected 
                ? 'bg-white border-blue-500 shadow-xl ring-2 ring-blue-500/10' 
                : 'bg-white/40 border-slate-200 hover:border-slate-300 hover:bg-white/60'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Icon size={24} />
              </div>
              {isSelected && (
                <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg shadow-blue-500/20">
                  <Check size={14} />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-[15px] font-black tracking-tight uppercase ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                  {model.display_name}
                </h4>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                  model.cost_tier === 'high' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {model.cost_tier}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-1 leading-relaxed">
                {model.capabilities.reasoning 
                  ? 'Advanced logic & complex architectural reasoning.' 
                  : 'Ultra-fast throughput for real-time interaction.'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
               {model.capabilities.vision && <CapabilityBadge label="Vision" />}
               {model.capabilities.coding && <CapabilityBadge label="Coding" />}
               {model.capabilities.tool_calling && <CapabilityBadge label="Tools" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CapabilityBadge({ label }: { label: string }) {
  return (
    <span className="text-[8px] font-black text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-widest bg-slate-50">
      {label}
    </span>
  );
}
