
import React, { useEffect, useState } from 'react';
import { BotService, AnalyticsService, ArenaService } from '../services/store';
import { BotConfig, ArenaConfig } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Terminal, Eye, Edit3, Trash2, Cpu, Database, 
  Activity, Shield, Radio, Server, Boxes, Zap, Layout,
  Flame, Globe, ShieldCheck, Waves, Target, Binary
} from 'lucide-react';

function MetricBox({ label, value, sub, icon: Icon, color = "text-blue-400" }: any) {
  return (
    <div className="liquid-glass p-8 flex flex-col gap-6 relative overflow-hidden group border-white/10 hover:border-blue-500/60 transition-all duration-700 hover:shadow-[0_0_80px_rgba(59,130,246,0.15)] rounded-[2.5rem]">
      <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] text-blue-500 group-hover:scale-150 group-hover:opacity-[0.12] transition-all duration-1000">
        <Icon size={160} />
      </div>
      <div className="flex items-center gap-4">
         <div className="p-3.5 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-500 shadow-[inset_0_0_25px_rgba(59,130,246,0.15)] group-hover:text-cyan-400 transition-colors">
            <Icon size={20} />
         </div>
         <span className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">{label}</span>
      </div>
      <div className="space-y-3 relative z-10">
        <div className={`text-6xl font-black tracking-tighter ${color} drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] leading-none`}>{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</div>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-6 relative">
        <div className={`h-full bg-current ${color} w-[85%] opacity-50 animate-pulse`}></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [arenas, setArenas] = useState<ArenaConfig[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBots(BotService.getBots());
    setArenas(ArenaService.getArenas());
  }, []);

  const handleDeleteBot = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      BotService.deleteBot(id);
      setBots(BotService.getBots());
    }
  };

  const handleDeleteArena = (id: string) => {
    if (confirm('Are you sure you want to delete this arena?')) {
      ArenaService.deleteArena(id);
      setArenas(ArenaService.getArenas());
    }
  };

  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-40">
      <div className="flex flex-col 2xl:flex-row 2xl:items-end justify-between gap-16">
        <div className="space-y-8">
           <div className="flex items-center gap-5">
              <div className="w-4 h-4 rounded-full bg-blue-600 status-pulse shadow-[0_0_30px_rgba(59,130,246,1)]"></div>
              <div className="text-blue-500 font-mono text-[11px] font-bold tracking-[0.2em] uppercase">Zen Foundry v7.2</div>
           </div>
           <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-[0_0_80px_rgba(255,255,255,0.15)]">Agent <br/> Command</h1>
           <p className="text-slate-500 text-lg font-medium max-w-3xl border-l-2 border-blue-600 pl-8">
             Orchestrate your AI workforce. Build custom agents, deploy them to arenas, and manage your intelligence assets.
           </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link 
            to="/create"
            className="bg-white text-black px-12 py-6 rounded-[2rem] font-black text-[14px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center gap-4 active:scale-95 group border border-white/30"
          >
            <Plus size={20} strokeWidth={3} />
            Create Agent
          </Link>
          <Link 
            to="/arena/new"
            className="bg-blue-600/10 text-blue-400 px-12 py-6 rounded-[2rem] font-black text-[14px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center gap-4 active:scale-95 group border border-blue-400/30"
          >
            <Target size={20} strokeWidth={3} />
            Create Arena
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <MetricBox label="Active Agents" value={bots.length.toString().padStart(2, '0')} sub="Deployed Units" icon={Boxes} />
        <MetricBox label="Arenas" value={arenas.length.toString().padStart(2, '0')} sub="Active Environments" icon={Layout} color="text-cyan-400" />
        <MetricBox label="System Health" value="100%" sub="All Systems Nominal" icon={Zap} color="text-amber-400" />
        <MetricBox label="Security" value="Active" sub="Encrypted Vault" icon={ShieldCheck} color="text-emerald-400" />
      </div>

      {/* Arena Hub */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
           <div className="flex items-center gap-6">
              <Globe size={32} className="text-blue-500 animate-pulse-slow" />
              <h2 className="text-[18px] font-black text-white uppercase tracking-widest">Arenas</h2>
           </div>
           <Link to="/arena/new" className="text-[11px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-widest">Create New +</Link>
        </div>
        
        {arenas.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600 bg-white/[0.02]">
            <p className="text-sm font-bold uppercase tracking-widest mb-4">No Arenas Deployed</p>
            <Link to="/arena/new" className="text-blue-500 hover:underline text-sm">Create your first arena</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            {arenas.map(arena => (
              <div key={arena.id} className="liquid-glass group rounded-[3.5rem] p-1.5 border-white/5 hover:border-blue-500/60 transition-all duration-1000 overflow-hidden relative shadow-2xl">
                 <div className="p-10 bg-black/50 rounded-[3.3rem] space-y-8 relative z-10">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <Layout size={28} />
                       </div>
                       <div className="flex gap-3">
                          <Link to={`/arena/edit/${arena.id}`} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                             <Edit3 size={18} />
                          </Link>
                          <button onClick={() => handleDeleteArena(arena.id)} className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate">{arena.name}</h3>
                       <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Cpu size={14} className="text-blue-600" /> {arena.bot_ids.length} Agents
                       </p>
                    </div>
                    <Link to={`/bot/${arena.slug}`} className="w-full py-5 bg-white text-black rounded-3xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
                       Enter Arena <Radio size={16} />
                    </Link>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Asset Repository */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
           <div className="flex items-center gap-6">
              <Server size={32} className="text-slate-700" />
              <h2 className="text-[18px] font-black text-slate-500 uppercase tracking-widest">My Agents</h2>
           </div>
        </div>
        
        {bots.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600 bg-white/[0.02]">
            <p className="text-sm font-bold uppercase tracking-widest mb-4">No Agents Found</p>
            <Link to="/create" className="text-blue-500 hover:underline text-sm">Create your first agent</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            {bots.map(bot => (
              <div key={bot.id} className="liquid-glass group rounded-[3.5rem] p-1.5 border-white/5 hover:border-blue-500/60 transition-all duration-1000 shadow-2xl">
                 <div className="p-10 bg-black/50 rounded-[3.3rem] space-y-10">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden relative">
                          {bot.avatar_url ? (
                             <img src={bot.avatar_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                             <Terminal size={24} className="text-slate-600" />
                          )}
                       </div>
                       <div className="flex gap-3">
                          <Link to={`/edit/${bot.id}`} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                             <Edit3 size={18} />
                          </Link>
                          <button onClick={() => handleDeleteBot(bot.id)} className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-tight">{bot.name}</h3>
                       <div className="flex gap-2">
                          <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-blue-600/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest truncate max-w-[150px]">{bot.model_config.primary_model}</span>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button 
                         onClick={() => navigate(`/workspace/${bot.id}`)}
                         className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                       >
                          Chat
                       </button>
                       <Link to={`/bot/${bot.slug}`} target="_blank" className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-500 hover:text-white rounded-3xl transition-all group-hover:border-blue-500/40">
                          <Globe size={20} />
                       </Link>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
