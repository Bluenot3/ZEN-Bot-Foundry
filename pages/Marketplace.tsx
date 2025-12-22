
import React from 'react';
import { BOT_TEMPLATES, AVAILABLE_TOOLS } from '../constants';
import { BotService } from '../services/store';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ShieldCheck, Box, Package, Globe, Cpu, Layers, Edit3, Zap } from 'lucide-react';

export default function Marketplace() {
  const navigate = useNavigate();

  const handleUseTemplate = async (template: any) => {
    const newBot = BotService.createBotFromTemplate(template);
    
    // Explicitly add the specified tools from the template to the bot config
    if (template.tools) {
      newBot.tools = AVAILABLE_TOOLS
        .filter(t => template.tools.includes(t.tool_id))
        .map(t => ({ ...t, enabled: true }));
    }
    
    await BotService.saveBot(newBot);
    // Directly launch into workspace for instant use
    navigate(`/workspace/${newBot.id}`);
  };

  const handleEditTemplate = async (template: any) => {
    const newBot = BotService.createBotFromTemplate(template);
    
    // Explicitly add the specified tools from the template to the bot config
    if (template.tools) {
      newBot.tools = AVAILABLE_TOOLS
        .filter(t => template.tools.includes(t.tool_id))
        .map(t => ({ ...t, enabled: true }));
    }

    await BotService.saveBot(newBot);
    navigate(`/edit/${newBot.id}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 pb-8 border-b border-white/5">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <Layers size={20} className="text-blue-500" />
              <div className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase">Global Foundry Repository</div>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tight uppercase leading-none">Intelligence Blueprints</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="FILTER MODULES..." 
            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-[14px] font-black tracking-widest uppercase text-white focus:border-blue-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {BOT_TEMPLATES.map((template, idx) => (
          <div key={idx} className="liquid-glass group flex flex-col h-full hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] rounded-[2.5rem] border border-white/5">
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-4xl shadow-inner transition-transform group-hover:scale-110">
                  {template.icon}
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                     <ShieldCheck size={10} /> Certified
                   </div>
                   <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{template.industry}</div>
                </div>
              </div>
              
              <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em] mb-3">MOD://{template.name.replace(/\s+/g, '_').toUpperCase()}</h3>
              <p className="text-[11px] text-slate-400 uppercase leading-relaxed tracking-tight flex-1 mb-10 font-medium">{template.description}</p>
              
              <div className="pt-8 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Active Tools</span>
                    <span className="text-blue-400">{template.tools?.length || 0} Nodes</span>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                      <Zap size={12} fill="currentColor" /> Deploy
                    </button>
                    <button 
                      onClick={() => handleEditTemplate(template)}
                      className="px-4 bg-white/5 text-slate-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}

        <div className="liquid-glass border-dashed border-white/10 flex flex-col items-center justify-center p-12 opacity-30 hover:opacity-100 transition-all cursor-pointer bg-white/[0.02] group rounded-[2.5rem]">
           <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-600/10 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
              <Package size={32} className="text-slate-600 group-hover:text-blue-400" />
           </div>
           <span className="font-black text-[10px] text-slate-500 uppercase tracking-[0.4em] text-center group-hover:text-slate-200">
             Contribute Custom<br/>Foundry Module
           </span>
        </div>
      </div>
    </div>
  );
}
