
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BotService } from '../services/store';
import { BotConfig } from '../types';
import ChatInterface from '../components/ChatInterface';
import { Terminal, ArrowLeft, Settings, Database, Activity, Share2, Eye, Shield, Layers, ChevronRight } from 'lucide-react';

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const b = BotService.getBot(id || '');
    if (b) setBot(b);
    else navigate('/dashboard');
  }, [id]);

  if (!bot) return null;

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8 animate-in fade-in duration-700">
      {/* Left: Configuration / Stats Summary - Toggleable for massive chat view */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-1/4'} transition-all duration-500 flex flex-col gap-6 overflow-hidden pb-8`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-4 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <button onClick={() => navigate('/dashboard')} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">{bot.name}</h1>
          </div>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <Settings size={18} />}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2 animate-in slide-in-from-left-4 duration-500">
            <div className="mil-panel p-6 space-y-6 bg-white/60">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Layers size={16} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Manifest</span>
              </div>
              <div className="space-y-4">
                 <TelemetryRow label="Neural Engine" value={bot.model_config.primary_model.split('-')[1].toUpperCase()} />
                 <TelemetryRow label="Logic Signal" value={bot.features.dual_response_mode ? 'DUAL_AB' : 'LINEAR'} />
                 <TelemetryRow label="Swarm Status" value={bot.features.multi_agent_consult ? 'CONNECTED' : 'ISOLATED'} />
              </div>
            </div>

            <div className="mil-panel p-6 space-y-6 bg-white/60">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Activity size={16} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Telemetry</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Neural Latency</div>
                    <div className="text-2xl font-black text-slate-900">42ms</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Signal Fidelity</div>
                    <div className="text-2xl font-black text-emerald-600">0.998</div>
                 </div>
              </div>
            </div>

            <div className="mt-auto p-6 rounded-3xl bg-slate-900 text-white flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield size={60} />
               </div>
               <div className="flex items-center gap-3">
                 <Shield size={16} className="text-blue-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Shield Active</span>
               </div>
               <p className="text-[11px] opacity-70 font-medium leading-relaxed">Agent is operational under military-grade glass encryption protocols.</p>
               <button onClick={() => navigate(`/edit/${bot.id}`)} className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">Reconfigure Agent</button>
            </div>
          </div>
        )}
      </div>

      {/* Right: The High-Fidelity App / Chat Interface - Occupies majority of screen */}
      <div className="flex-1 h-full shadow-2xl transition-all duration-500">
        <ChatInterface bot={bot} className="rounded-[3rem] border-white/80" />
      </div>
    </div>
  );
}

function TelemetryRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
      <span className="text-[10px] font-black text-slate-900 tracking-tight">{value}</span>
    </div>
  );
}
