
import React from 'react';
import { TelemetryStep } from '../types';
import { 
  Terminal, Activity, Radio, Database, Brain, 
  Workflow, Cpu, Gauge, BarChart3, Zap, Hash
} from 'lucide-react';

interface XRayVisionProps {
  telemetry: TelemetryStep[];
  thinking?: string;
}

export default function XRayVision({ telemetry, thinking }: XRayVisionProps) {
  return (
    <div className="h-full flex flex-col font-mono bg-[#01040a]/90 text-slate-400">
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
            <Terminal size={14} className="text-blue-500" />
            Neural_Logic.XRAY_v5.2
          </h3>
          <p className="text-[8px] font-bold text-slate-600 uppercase">Hardware-Level Signal Monitor</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 status-pulse"></div>
      </header>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
        {/* Physical Layer Metrics */}
        <div className="grid grid-cols-2 gap-3">
           <Metric label="KV_CACHE_USAGE" val="32.4%" status="NOMINAL" color="text-blue-400" />
           <Metric label="ATTN_BANDWIDTH" val="1.8 GB/s" status="OPTIMAL" color="text-emerald-400" />
           <Metric label="INFERENCE_LATENCY" val="22ms" status="PEAK" color="text-cyan-400" />
           <Metric label="LOG_PROB_ENTROPY" val="0.0014" status="STABLE" color="text-purple-400" />
        </div>

        {/* Telemetry Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Execution_Log</span>
            <Activity size={12} className="text-blue-500 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            {telemetry.length === 0 ? (
              <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center opacity-30">
                 <span className="text-[8px] font-black uppercase">Awaiting_Neural_Handshake...</span>
              </div>
            ) : (
              telemetry.map((step) => (
                <div key={step.id} className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4 group transition-all hover:border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                          {getStepIcon(step.type)}
                       </div>
                       <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{step.label}</span>
                    </div>
                    <span className="text-[7px] text-slate-600 font-bold">{step.metrics?.latency?.toFixed(0)}ms</span>
                  </div>
                  {step.detail && (
                    <div className="text-[9px] text-slate-500 leading-relaxed font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                      {step.detail}
                    </div>
                  )}
                  {step.metrics && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <MetricStat icon={Gauge} label="TOKEN_VELOCITY" val={`${step.metrics.tokens_per_sec?.toFixed(1)}/s`} />
                       <MetricStat icon={Cpu} label="COMPUTE_LOAD" val={`${step.metrics.vram_usage?.toFixed(1)}%`} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Thought Trace Display */}
        {thinking && (
          <div className="space-y-4 pt-6 border-t border-white/5">
             <div className="flex items-center gap-3 px-1">
                <Brain size={12} className="text-purple-500" />
                <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Latent_State_Reasoning</span>
             </div>
             <div className="p-5 bg-purple-500/[0.03] border border-purple-500/10 rounded-2xl text-[10px] text-purple-300 leading-relaxed whitespace-pre-wrap font-medium shadow-inner italic">
                {thinking}
             </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/95 backdrop-blur-3xl border-t border-white/5">
         <div className="flex justify-between items-center mb-3">
            <span className="text-[8px] font-black uppercase tracking-widest">Global_Signal_Stability</span>
            <span className="text-[8px] font-black text-blue-500">99.82%_UPTIME</span>
         </div>
         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[92%] animate-pulse"></div>
         </div>
      </div>
    </div>
  );
}

function getStepIcon(type: TelemetryStep['type']) {
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
}

function Metric({ label, val, status, color }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1.5 group hover:border-blue-500/30 transition-all">
       <div className="flex justify-between items-center">
          <span className="text-[7px] font-black text-slate-500 uppercase">{label}</span>
          <span className={`text-[6px] font-black uppercase ${status === 'NOMINAL' || status === 'OPTIMAL' ? 'text-emerald-500' : 'text-blue-500'}`}>{status}</span>
       </div>
       <div className={`text-[12px] font-black ${color} tracking-tight`}>{val}</div>
    </div>
  );
}

function MetricStat({ icon: Icon, label, val }: any) {
  return (
    <div className="flex items-center gap-2">
       <Icon size={10} className="text-slate-600" />
       <div className="flex flex-col">
          <span className="text-[6px] font-black text-slate-700 uppercase">{label}</span>
          <span className="text-[9px] font-black text-slate-300">{val}</span>
       </div>
    </div>
  );
}
