
import React, { useEffect, useState } from 'react';
import { BotService, AnalyticsService } from '../services/store';
import { BotConfig } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Terminal, Eye, Edit3, Trash2, Cpu, Database, Activity, Shield, Radio, Server, Boxes, Zap } from 'lucide-react';

function MetricBox({ label, value, sub, icon: Icon, color = "text-blue-400" }: any) {
  return (
    <div className="mil-panel p-5 flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute -top-4 -right-4 p-6 opacity-[0.03] text-blue-500 group-hover:scale-110 transition-transform">
        <Icon size={60} />
      </div>
      <div className="flex items-center gap-3">
         <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 group-hover:text-blue-400 transition-colors">
            <Icon size={12} />
         </div>
         <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{label}</span>
      </div>
      <div className="space-y-0.5">
        <div className={`text-3xl font-black tracking-tighter ${color} glow-text leading-none`}>{value}</div>
        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{sub}</div>
      </div>
    </div>
  );
}

const BotAssetCard: React.FC<{ bot: BotConfig, onDelete: (id: string) => void }> = ({ bot, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="mil-panel group relative flex flex-col h-full bg-slate-900/40 hover:bg-slate-900/60 transition-all border-white/5 hover:border-blue-500/30 overflow-hidden">
      {/* Gradient Scan Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center relative shadow-inner">
            {bot.avatar_url ? (
              <img src={bot.avatar_url} className="w-full h-full object-cover rounded-xl" alt="Bot Avatar" />
            ) : (
              <Terminal size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
            )}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
          <div className="flex gap-1">
            <Link to={`/edit/${bot.id}`} className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-blue-400 hover:bg-white/10 transition-all">
              <Edit3 size={12} />
            </Link>
            <button onClick={() => onDelete(bot.id)} className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <div className="space-y-1 mb-4 flex-1">
           <h3 className="text-[15px] font-black text-slate-100 tracking-tight uppercase truncate leading-tight">{bot.name}</h3>
           <p className="text-[11px] text-slate-500 line-clamp-2 font-medium leading-snug">{bot.description || 'Unit pending manifest instructions...'}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-5">
          <div className="px-2 py-0.5 bg-black/30 border border-white/5 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest shrink-0">{bot.model_config.primary_model.split('-')[1]}</div>
          <div className="px-2 py-0.5 bg-black/30 border border-white/5 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest shrink-0">{bot.publish_state}</div>
          {bot.features.dual_response_mode && (
             <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[7px] font-black text-blue-400 uppercase tracking-widest shrink-0">DUAL_CORE</div>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/workspace/${bot.id}`)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            LAUNCH_LINK
          </button>
          <Link
            to={`/bot/${bot.slug}`}
            target="_blank"
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-slate-100 transition-all flex items-center justify-center"
          >
            <Radio size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const usage = AnalyticsService.getUsage();
  const totalTokens = usage.reduce((acc, curr) => acc + curr.tokens, 0);

  useEffect(() => {
    setBots(BotService.getBots());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('TERMINATE NEURAL ASSET PERMANENTLY?')) {
      BotService.deleteBot(id);
      setBots(BotService.getBots());
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 status-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <div className="text-blue-500 font-mono text-[9px] font-bold tracking-[0.4em] uppercase">Tactical Neural Hub</div>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter uppercase leading-none">Command Center</h1>
        </div>
        <Link 
          to="/create"
          className="bg-white text-black px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-2 active:scale-95 group"
        >
          <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          INITIALIZE_UNIT
        </Link>
      </div>

      {/* Metrics HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricBox label="Neural Units" value={bots.length.toString().padStart(2, '0')} sub="Deployed Assets" icon={Boxes} />
        <MetricBox label="TKN_THROUGHPUT" value={`${(totalTokens / 1000).toFixed(1)}K`} sub="Current Network Load" icon={Zap} color="text-cyan-400" />
        <MetricBox label="Efficiency" value="99.4%" sub="Logic Accuracy" icon={Database} color="text-emerald-400" />
        <MetricBox label="Uplink Security" value="X-LEVEL" sub="Military Grade" icon={Shield} color="text-amber-400" />
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bots.length === 0 ? (
          <div className="sm:col-span-full h-64 mil-panel flex flex-col items-center justify-center bg-white/[0.02] border-dashed border-white/10">
            <Terminal className="text-slate-800 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-600 tracking-[0.4em] uppercase">No Neutral Assets Identified</p>
            <Link to="/create" className="mt-6 text-blue-500 font-bold hover:text-blue-400 transition-colors uppercase tracking-widest text-[9px] border-b border-blue-500/30 pb-0.5">Begin First Synthesis &rarr;</Link>
          </div>
        ) : (
          bots.map(bot => (
            <BotAssetCard key={bot.id} bot={bot} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
