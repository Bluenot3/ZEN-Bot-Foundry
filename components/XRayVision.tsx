
import React from 'react';
import { TelemetryStep } from '../types';
import { Activity, Brain, Database, Cpu, Globe, Zap, List, Terminal, Workflow, Radio } from 'lucide-react';

interface XRayVisionProps {
  telemetry: TelemetryStep[];
  thinking?: string;
}

export default function XRayVision({ telemetry, thinking }: XRayVisionProps) {
  const getIcon = (type: TelemetryStep['type']) => {
    switch (type) {
      // Added missing Radio icon import from lucide-react.
      case 'UPLINK': return <Radio size={12} className="text-blue-500" />;
      case 'RETRIEVAL': return <Database size={12} className="text-cyan-500" />;
      case 'REASONING': return <Brain size={12} className="text-purple-500" />;
      case 'TOOL_EXEC': return <Cpu size={12} className="text-amber-500" />;
      case 'SYNTHESIS': return <Workflow size={12} className="text-emerald-500" />;
      default: return <Activity size={12} className="text-slate-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
          <Terminal size={14} className="text-blue-500" />
          Neural_Anatomy.XRAY
        </h3>
        <div className="w-2 h-2 rounded-full bg-blue-500 status-pulse"></div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-20">
        {/* Real-time Telemetry Log */}
        <div className="space-y-4">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={10} /> Stream_Telemetry
          </div>
          {telemetry.length === 0 ? (
            <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center opacity-30">
               <span className="text-[8px] font-black text-slate-500 uppercase">Awaiting_Input_Trigger</span>
            </div>
          ) : (
            <div className="space-y-3">
              {telemetry.map((step) => (
                <div key={step.id} className="group p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 animate-in slide-in-from-right-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIcon(step.type)}
                      <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">{step.label}</span>
                    </div>
                    <span className="text-[7px] font-bold text-slate-600 uppercase">{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {step.detail && (
                    <div className="text-[8px] text-blue-400 leading-relaxed font-bold bg-black/40 p-2 rounded border border-white/5 border-l-2 border-l-blue-500">
                      {step.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Neural Reasoning (Thinking) Display */}
        {thinking && (
          <div className="space-y-4 pt-6 border-t border-white/5">
             <div className="text-[8px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
               <Brain size={10} /> Latent_Reasoning_Log
             </div>
             <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-[9px] text-purple-300 leading-relaxed whitespace-pre-wrap font-medium">
                {thinking}
             </div>
          </div>
        )}
      </div>

      {/* Stats Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-3xl border-t border-white/5 grid grid-cols-2 gap-2">
         <div className="p-2 bg-white/5 rounded flex flex-col">
            <span className="text-[7px] font-black text-slate-500 uppercase">Active_Buffers</span>
            <span className="text-[10px] font-black text-blue-400">0x4F92A1</span>
         </div>
         <div className="p-2 bg-white/5 rounded flex flex-col">
            <span className="text-[7px] font-black text-slate-500 uppercase">Neural_Temp</span>
            <span className="text-[10px] font-black text-emerald-400">OPTIMAL</span>
         </div>
      </div>
    </div>
  );
}
