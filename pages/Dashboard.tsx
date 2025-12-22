
import React, { useEffect, useState } from 'react';
import { BotService, AnalyticsService, ArenaService } from '../services/store';
import { BotConfig, ArenaConfig } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Terminal, Eye, Edit3, Trash2, Cpu, Database, 
  Activity, Shield, Radio, Server, Boxes, Zap, Layout 
} from 'lucide-react';

function MetricBox({ label, value, sub, icon: Icon, color = "text-blue-400" }: any) {
  return (
    <div className="mil-panel p-4 flex flex-col gap-2.5 relative overflow-hidden group border border-white/5">
      <div className="absolute -top-3 -right-3 p-4 opacity-[0.03] text-blue-500 group-hover:scale-110 transition-transform">
        <Icon size={48} />
      </div>
      <div className="flex items-center gap-2.5">
         <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 group-hover:text-blue-400 transition-colors">
            <Icon size={10} />
         </div>
         <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">{label}</span>
      </div>
      <div className="space-y-0.5">
        <div className={`text-2xl font-black tracking-tighter ${color} glow-text leading-none`}>{value}</div>
        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{sub}</div>
      </div>
    </div>
  );
}

const ArenaCard: React.FC<{ arena: ArenaConfig, onDelete: (id: string) => void }> = ({ arena, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="mil-panel group relative flex flex-col h-full bg-blue-600/[0.02] hover:bg-blue-600/[0.04] transition-all border-blue-500/10 hover:border-blue-500/40 overflow-hidden rounded-2xl">
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-blue-500/20 flex items-center justify-center relative shadow-inner">
             <Layout size={18} className="text-blue-400" />
          </div>
          <div className="flex gap-1">
            <Link to={`/arena/edit/${arena.id}`} className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-blue-400 hover:bg-white/10 transition-all">
              <Edit3 size={11} />
            </Link>
            <button onClick={() => onDelete(arena.id)} className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        <div className="space-y-1 mb-4 flex-1">
           <h3 className="text-[13px] font-black text-slate-100 tracking-tight uppercase truncate leading-tight">{arena.name}</h3>
           <p className="text-[10px] text-slate-500 line-clamp-2 font-medium leading-relaxed">{arena.description || 'Arena manifest active...'}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[7px] font-black text-blue-400 uppercase tracking-widest">
             {arena.bot_ids.length} AGENTS
          </div>
          <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest">
             {arena.theme.animation_style.toUpperCase()}
          </div>
        </div>

        <button 
          onClick={() => navigate(`/bot/${arena.slug}`)}
          className="w-full bg-white text-black py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] hover:bg-blue-600 hover:text-white"
        >
          DEPLOY_ARENA
        </button>
      </div>
    </div>
  );
}

const BotAssetCard: React.FC<{ bot: BotConfig, onDelete: (id: string) => void }> = ({ bot, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="mil-panel group relative flex flex-col h-full bg-slate-900/40 hover:bg-slate-900/60 transition-all border-white/5 hover:border-blue-500/30 overflow-hidden rounded-2xl">
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center relative shadow-inner">
            {bot.avatar_url ? (
              <img src={bot.avatar_url} className="w-full h-full object-cover rounded-xl" alt="Bot Avatar" />
            ) : (
              <Terminal size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
            )}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          </div>
          <div className="flex gap-1">
            <Link to={`/edit/${bot.id}`} className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-blue-400 hover:bg-white/10 transition-all">
              <Edit3 size={11} />
            </Link>
            <button onClick={() => onDelete(bot.id)} className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        <div className="space-y-1 mb-3 flex-1">
           <h3 className="text-[13px] font-black text-slate-100 tracking-tight uppercase truncate leading-tight">{bot.name}</h3>
           <p className="text-[10px] text-slate-500 line-clamp-2 font-medium leading-relaxed">{bot.description || 'Unit pending manifest instructions...'}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="px-1.5 py-0.5 bg-black/30 border border-white/5 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest shrink-0">{bot.model_config.primary_model.split('-')[1]}</div>
          <div className="px-1.5 py-0.5 bg-black/30 border border-white/5 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest shrink-0">{bot.publish_state}</div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/workspace/${bot.id}`)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
          >
            LAUNCH_UNIT
          </button>
          <Link
            to={`/bot/${bot.slug}`}
            target="_blank"
            className="px-2.5 py-2 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-slate-100 transition-all flex items-center justify-center"
          >
            <Radio size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [arenas, setArenas] = useState<ArenaConfig[]>([]);
  const usage = AnalyticsService.getUsage();
  const totalTokens = usage.reduce((acc, curr) => acc + curr.tokens, 0);

  useEffect(() => {
    setBots(BotService.getBots());
    setArenas(ArenaService.getArenas());
  }, []);

  const handleDeleteBot = (id: string) => {
    if (confirm('TERMINATE NEURAL ASSET PERMANENTLY?')) {
      BotService.deleteBot(id);
      setBots(BotService.getBots());
    }
  };

  const handleDeleteArena = (id: string) => {
    if (confirm('TERMINATE ARENA SPACE PERMANENTLY?')) {
      ArenaService.deleteArena(id);
      setArenas(ArenaService.getArenas());
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 status-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <div className="text-blue-500 font-mono text-[9px] font-bold tracking-[0.4em] uppercase">Tactical Command Protocol</div>
           </div>
           <h1 className="text-4xl font-black text-slate-100 tracking-tighter uppercase leading-none">Command Center</h1>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/create"
            className="bg-white text-black px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center gap-2 active:scale-95 group border border-white/10"
          >
            <Plus size={12} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            SYNTHESIZE_BOT
          </Link>
          <Link 
            to="/arena/new"
            className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl flex items-center gap-2 active:scale-95 group border border-blue-400/30"
          >
            <Layout size={12} strokeWidth={3} />
            CREATE_ARENA
          </Link>
        </div>
      </div>

      {/* Metrics HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <MetricBox label="Neural Units" value={bots.length.toString().padStart(2, '0')} sub="Deployed Assets" icon={Boxes} />
        <MetricBox label="Arena Spaces" value={arenas.length.toString().padStart(2, '0')} sub="UX Deployments" icon={Layout} color="text-cyan-400" />
        <MetricBox label="Efficiency" value="99.4%" sub="Logic Accuracy" icon={Database} color="text-emerald-400" />
        <MetricBox label="Security" value="X-LEVEL" sub="Military Grade" icon={Shield} color="text-amber-400" />
      </div>

      {/* Arena Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
           <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Active Intelligence Arenas</h2>
           <Link to="/arena/new" className="text-[9px] font-bold text-blue-500 hover:text-white transition-colors uppercase tracking-widest">Add Space +</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {arenas.length === 0 ? (
            <div className="col-span-full h-40 mil-panel flex flex-col items-center justify-center bg-white/[0.02] border-dashed border-white/10 rounded-2xl opacity-40">
              <Layout className="text-slate-700 mb-3" size={28} />
              <p className="text-[9px] font-black text-slate-600 tracking-[0.4em] uppercase">No Arenas Synthesized</p>
            </div>
          ) : (
            arenas.map(arena => (
              <ArenaCard key={arena.id} arena={arena} onDelete={handleDeleteArena} />
            ))
          )}
        </div>
      </section>

      {/* Bot Asset Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
           <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Agent Asset Bank</h2>
           <Link to="/create" className="text-[9px] font-bold text-blue-500 hover:text-white transition-colors uppercase tracking-widest">Synthesize +</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bots.length === 0 ? (
            <div className="col-span-full h-40 mil-panel flex flex-col items-center justify-center bg-white/[0.02] border-dashed border-white/10 rounded-2xl opacity-40">
              <Terminal className="text-slate-700 mb-3" size={28} />
              <p className="text-[9px] font-black text-slate-600 tracking-[0.4em] uppercase">No Agents Identified</p>
            </div>
          ) : (
            bots.map(bot => (
              <BotAssetCard key={bot.id} bot={bot} onDelete={handleDeleteBot} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
