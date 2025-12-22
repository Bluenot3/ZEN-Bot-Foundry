
import React from 'react';
import { TelemetryStep } from '../types';
import { Activity, Brain, Database, Cpu, Globe, Zap, List, Terminal, Workflow, Radio, BarChart3, Gauge, Hash, ZapIcon } from 'lucide-react';

interface XRayVisionProps {
  telemetry: TelemetryStep[];
  thinking?: string;
}

export default function XRayVision({ telemetry, thinking }: XRayVisionProps) {
  const getIcon = (type: TelemetryStep['type']) => {
    switch (type) {
      case 'UPLINK': return <Radio size={12} className="text-blue-500" />;
      case 'RETRIEVAL': return <Database size={12} className="text-cyan-500" />;
      case 'REASONING': return <Brain size={12} className="text-purple-500" />;
      case 'TOOL_EXEC': return <Cpu size={12} className="text-amber-500" />;
      case 'SYNTHESIS': return <Workflow size={12} className="text-emerald-500" />;
      case 'IMAGE_GEN': return <Zap size={12} className="text-pink-500" />;
      case 'ENTROPY_ANALYSIS': return <BarChart3 size={12} className="text-rose-500" />;
      default: return <Activity size={12} className="text-slate-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col font-mono bg-[#01040a]/80">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
            <Terminal size={14} className="text-blue-500" />
            Neural_Anatomy.XRAY_v5.2
          </h3>
          <div className="flex items-center gap-3">
             <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Signal_Lock: 100%</span>
             <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest">Latency: 28ms</span>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500 status-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
        {/* Dynamic Hardware Grid Simulation */}
        <div className="grid grid-cols-2 gap-2">
           <GranularMetric label="VRAM_LOAD" val="12.4GB" status="OPTIMAL" color="text-blue-400" />
           <GranularMetric label="TEMP_NODE" val="44.2°C" status="NOMINAL" color="text-emerald-400" />
           <GranularMetric label="ATTN_HEADS" val="128/128" status="ACTIVE" color="text-purple-400" />
           <GranularMetric label="VECTOR_SPACE" val="1.2M_DIM" status="DENSE" color="text-cyan-400" />
        </div>

        {/* Real-time Telemetry Log */}
        <div className="space-y-4">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
            <Activity size={10} className="text-blue-500" /> Stream_Telemetry
          </div>
          {telemetry.length === 0 ? (
            <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center opacity-20">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Awaiting_Neural_Handshake</span>
            </div>
          ) : (
            <div className="space-y-4">
              {telemetry.map((step) => (
                <div key={step.id} className="group p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4 animate-in slide-in-from-right-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                        {getIcon(step.type)}
                      </div>
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{step.label}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[7px] font-bold text-slate-600 uppercase">{new Date(step.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                       <span className="text-[6px] text-blue-500 font-black mt-1">LOG://NODE_EXEC</span>
                    </div>
                  </div>
                  {step.detail && (
                    <div className="text-[9px] text-slate-400 leading-relaxed font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                      {step.detail}
                    </div>
                  )}
                  {step.metrics && (
                     <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center gap-2">
                           <Gauge size={8} className="text-slate-600" />
                           <span className="text-[7px] font-black text-slate-500 uppercase">TKN_S: <span className="text-emerald-400">{step.metrics.tokens_per_sec?.toFixed(1)}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Hash size={8} className="text-slate-600" />
                           <span className="text-[7px] font-black text-slate-500 uppercase">HEADS: <span className="text-blue-400">{step.metrics.attention_heads}</span></span>
                        </div>
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
             <div className="text-[8px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2 px-1">
               <Brain size={10} /> Latent_Reasoning_Log (Hidden_State)
             </div>
             <div className="relative p-6 bg-purple-500/[0.03] border border-purple-500/10 rounded-2xl text-[10px] text-purple-300 leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ZapIcon size={32} /></div>
                {thinking}
             </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-3xl border-t border-white/5 space-y-4">
         <div className="flex justify-between items-center px-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global_System_entropy</span>
            <span className="text-[8px] font-black text-blue-500 uppercase">0.0024_SIGMA</span>
         </div>
         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[82%] animate-pulse"></div>
         </div>
      </div>
    </div>
  );
}

function GranularMetric({ label, val, status, color }: any) {
  return (
    <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1 group hover:border-blue-500/20 transition-all">
       <div className="flex justify-between items-center">
          <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
          <span className="text-[6px] font-black text-emerald-500 uppercase">{status}</span>
       </div>
       <div className={`text-[12px] font-black ${color} tracking-tight`}>{val}</div>
    </div>
  );
}
