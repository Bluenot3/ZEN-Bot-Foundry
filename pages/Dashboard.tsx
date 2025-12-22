
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
         <span className="text-[11px] font-black text-slate-500 tracking-[0.5em] uppercase">{label}</span>
      </div>
      <div className="space-y-3 relative z-10">
        <div className={`text-6xl font-black tracking-tighter ${color} drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] leading-none`}>{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</div>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-6 relative">
        <div className={`h-full bg-current ${color} w-[85%] opacity-50 animate-pulse`}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [arenas, setArenas] = useState<ArenaConfig[]>([]);
  // Fix: Added missing navigate hook for programmatic navigation to workspaces
  const navigate = useNavigate();

  useEffect(() => {
    setBots(BotService.getBots());
    setArenas(ArenaService.getArenas());
  }, []);

  const handleDeleteBot = (id: string) => {
    if (confirm('PERMANENTLY TERMINATE NEURAL ASSET?')) {
      BotService.deleteBot(id);
      setBots(BotService.getBots());
    }
  };

  const handleDeleteArena = (id: string) => {
    if (confirm('PERMANENTLY DISMANTLE ARENA DEPLOYMENT?')) {
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
              <div className="text-blue-500 font-mono text-[11px] font-black tracking-[0.8em] uppercase">Tactical Foundry Protocol v7.2.1-SEC</div>
           </div>
           <h1 className="text-8xl font-black text-white tracking-tighter uppercase leading-[0.75] drop-shadow-[0_0_80px_rgba(255,255,255,0.15)]">Foundry <br/> Command</h1>
           <p className="text-slate-500 text-xl uppercase tracking-[0.2em] font-medium max-w-3xl border-l-2 border-blue-600 pl-8">Sovereign intelligence management. Orchestrating the next generation of neural nodes across the decentralized lattice.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link 
            to="/create"
            className="bg-white text-black px-16 py-8 rounded-[2.5rem] font-black text-[16px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl flex items-center gap-5 active:scale-95 group border border-white/30"
          >
            <Binary size={24} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700" />
            SYNTH_NODE
          </Link>
          <Link 
            to="/arena/new"
            className="bg-blue-600/10 text-blue-400 px-16 py-8 rounded-[2.5rem] font-black text-[16px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-5 active:scale-95 group border border-blue-400/30"
          >
            <Target size={24} strokeWidth={3} />
            FORGE_ARENA
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <MetricBox label="Neural Units" value={bots.length.toString().padStart(2, '0')} sub="ACTIVE_OPERATIVES" icon={Boxes} />
        <MetricBox label="Arenas" value={arenas.length.toString().padStart(2, '0')} sub="LIVE_ENVIRONMENTS" icon={Layout} color="text-cyan-400" />
        <MetricBox label="Fidelity" value="99.99%" sub="SIGNAL_STABILITY" icon={Zap} color="text-amber-400" />
        <MetricBox label="Encryption" value="Sovereign" sub="DATA_MANIFEST_LOCKED" icon={ShieldCheck} color="text-emerald-400" />
      </div>

      {/* Arena Hub */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
           <div className="flex items-center gap-6">
              <Globe size={32} className="text-blue-500 animate-pulse-slow" />
              <h2 className="text-[18px] font-black text-white uppercase tracking-[0.8em]">Arena Deployments</h2>
           </div>
           <Link to="/arena/new" className="text-[11px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-widest">EXPAND_NETWORK +</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          {arenas.map(arena => (
            <div key={arena.id} className="liquid-glass group rounded-[3.5rem] p-1.5 border-white/5 hover:border-blue-500/60 transition-all duration-1000 overflow-hidden relative shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-1000 scale-150">
                  <Waves size={120} className="text-blue-400" />
               </div>
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
                        <Cpu size={14} className="text-blue-600" /> {arena.bot_ids.length} AGENTS ONLINE
                     </p>
                  </div>
                  <Link to={`/bot/${arena.slug}`} className="w-full py-5 bg-white text-black rounded-3xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
                     Enter Space <Radio size={16} className="animate-pulse" />
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Asset Repository */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
           <div className="flex items-center gap-6">
              <Server size={32} className="text-slate-700" />
              <h2 className="text-[18px] font-black text-slate-500 uppercase tracking-[0.8em]">Neural Asset Repository</h2>
           </div>
        </div>
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
                        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-950 status-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
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
                        <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-blue-600/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest">{bot.model_config.primary_model.split('-').pop()?.toUpperCase() || 'NODE'}</span>
                        <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-white/5 text-slate-500 border border-white/10 uppercase tracking-widest">S-7</span>
                     </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button 
                       onClick={() => navigate(`/workspace/${bot.id}`)}
                       className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                     >
                        Launch
                     </button>
                     <Link to={`/bot/${bot.slug}`} target="_blank" className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-500 hover:text-white rounded-3xl transition-all group-hover:border-blue-500/40">
                        <Globe size={20} />
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
