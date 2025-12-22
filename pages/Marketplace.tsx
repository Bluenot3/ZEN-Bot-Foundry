
import React from 'react';
import { BOT_TEMPLATES } from '../constants';
import { BotService } from '../services/store';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ShieldCheck, Box, Package, Globe, Cpu, Layers } from 'lucide-react';

export default function Marketplace() {
  const navigate = useNavigate();

  const handleUseTemplate = async (template: any) => {
    const newBot = BotService.createBotFromTemplate(template);
    await BotService.saveBot(newBot);
    // Directly launch into workspace for instant use
    navigate(`/workspace/${newBot.id}`);
  };

  const handleEditTemplate = async (template: any) => {
    const newBot = BotService.createBotFromTemplate(template);
    await BotService.saveBot(newBot);
    navigate(`/edit/${newBot.id}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 pb-8 border-b border-slate-200">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <Layers size={20} className="text-blue-600" />
              <div className="text-blue-600 font-bold text-[10px] tracking-[0.4em] uppercase">Global Foundry Repository</div>
           </div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">Intelligence Blueprints</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="FILTER MODULES..." 
            className="w-full mil-input pl-14 pr-6 py-5 text-[14px] font-medium tracking-wide uppercase"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {BOT_TEMPLATES.map((template, idx) => (
          <div key={idx} className="mil-panel group flex flex-col h-full hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl mil-border flex items-center justify-center text-3xl bg-white shadow-sm transition-transform group-hover:scale-110">
                  {template.icon}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                  <ShieldCheck size={10} /> Certified
                </div>
              </div>
              
              <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-3">MOD://{template.name.replace(/\s+/g, '_').toUpperCase()}</h3>
              <p className="text-[12px] text-slate-500 uppercase leading-relaxed tracking-tight flex-1 mb-10 font-medium">{template.description}</p>
              
              <div className="pt-8 border-t border-slate-100 space-y-4">
                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Complexity</span>
                    <span className="text-blue-600">High_Fidelity</span>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      <Download size={12} /> Launch
                    </button>
                    <button 
                      onClick={() => handleEditTemplate(template)}
                      className="px-4 bg-slate-100 text-slate-500 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Configure
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mil-panel border-dashed border-slate-300 flex flex-col items-center justify-center p-12 opacity-50 hover:opacity-100 transition-all cursor-pointer bg-white/30 group">
           <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Package size={28} className="text-slate-400 group-hover:text-blue-600" />
           </div>
           <span className="font-bold text-[11px] text-slate-400 uppercase tracking-widest text-center group-hover:text-slate-600">Contribute Custom<br/>Foundry Module</span>
        </div>
      </div>
    </div>
  );
}
