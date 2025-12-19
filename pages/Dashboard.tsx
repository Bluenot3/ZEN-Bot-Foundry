
import React, { useEffect, useState } from 'react';
import { BotService, AnalyticsService } from '../services/store';
import { BotConfig } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Terminal, Eye, Edit3, Trash2, Cpu, Database, Activity, Shield, Radio, Server } from 'lucide-react';

function MetricBox({ label, value, sub, icon: Icon, color = "text-slate-900" }: any) {
  return (
    <div className="mil-panel p-8 flex flex-col gap-4 relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute -top-4 -right-4 p-8 opacity-5 text-blue-600 group-hover:scale-110 transition-transform">
        <Icon size={80} />
      </div>
      <div className="flex items-center gap-4">
         <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Icon size={18} />
         </div>
         <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">{label}</span>
      </div>
      <div className="space-y-1">
        <div className={`text-5xl font-extrabold tracking-tighter ${color}`}>{value}</div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{sub}</div>
      </div>
    </div>
  );
}

const BotAssetCard: React.FC<{ bot: BotConfig, onDelete: (id: string) => void }> = ({ bot, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="mil-panel group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-transparent hover:border-blue-200">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-bold relative group-hover:bg-blue-50 transition-colors">
            {bot.avatar_url ? (
              <img src={bot.avatar_url} className="w-full h-full object-cover rounded-[1.25rem]" alt="Bot Avatar" />
            ) : (
              <Terminal size={28} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            )}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
          <div className="flex gap-2">
            <Link to={`/edit/${bot.id}`} className="p-3 rounded-xl bg-white/50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-white transition-all">
              <Edit3 size={18} />
            </Link>
            <button onClick={() => onDelete(bot.id)} className="p-3 rounded-xl bg-white/50 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-10">
           <h3 className="text-2xl font-bold text-slate-900 tracking-tight truncate">{bot.name}</h3>
           <p className="text-[14px] text-slate-500 line-clamp-2 h-10 leading-relaxed font-medium">{bot.description || 'System idle. Waiting for deployment directives.'}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-10">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bot.model_config.primary_model.split('-')[1]} Model</div>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bot.publish_state}</div>
          {bot.features.dual_response_mode && (
             <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-wider">Dual Link</div>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/workspace/${bot.id}`)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-[13px] text-center transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Launch Interface
          </button>
          <Link
            to={`/bot/${bot.slug}`}
            target="_blank"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-all"
          >
            <Radio size={20} />
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
    if (confirm('Permanently deconstruct this neural asset?')) {
      BotService.deleteBot(id);
      setBots(BotService.getBots());
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Server size={18} className="text-blue-600" />
              <div className="text-blue-600 font-bold text-[12px] tracking-widest uppercase">System Operational Control</div>
           </div>
           <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-none">Neural Hub</h1>
        </div>
        <Link 
          to="/create"
          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-[15px] hover:bg-blue-600 transition-all shadow-2xl flex items-center gap-4 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Initialise Unit
        </Link>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <MetricBox label="Deployment Units" value={bots.length.toString().padStart(2, '0')} sub="Active Agents" icon={Cpu} />
        <MetricBox label="Network Load" value={`${(totalTokens / 1000).toFixed(1)}K`} sub="Neural Signals" icon={Activity} />
        <MetricBox label="Efficiency" value="98.2%" sub="Optimized Pipeline" icon={Database} color="text-emerald-600" />
        <MetricBox label="Security" value="AES-X" sub="Full Shield" icon={Shield} />
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {bots.length === 0 ? (
          <div className="lg:col-span-full h-96 mil-panel flex flex-col items-center justify-center bg-white/30 border-dashed">
            <Terminal className="text-slate-200 mb-6" size={80} />
            <p className="text-[13px] font-bold text-slate-400 tracking-[0.3em] uppercase">No Assets Initialized</p>
            <Link to="/create" className="mt-8 text-blue-600 font-bold hover:text-blue-700 transition-colors uppercase tracking-widest border-b-2 border-blue-100 pb-1">Start First Project &rarr;</Link>
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
