import React from 'react';
import { BOT_TEMPLATES } from '../constants';
import { BotService } from '../services/store';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ShieldCheck, Box, Package } from 'lucide-react';

export default function Marketplace() {
  const navigate = useNavigate();

  const handleUseTemplate = async (template: any) => {
    const newBot = BotService.createBotFromTemplate(template);
    await BotService.saveBot(newBot);
    navigate(`/edit/${newBot.id}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-tactical-border">
        <div>
           <div className="text-tactical-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2">Global Module Repository</div>
           <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Intelligence Blueprints</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-tactical-grey" size={14} />
          <input 
            type="text" 
            placeholder="FILTER MODULES..." 
            className="w-full mil-input pl-11 pr-4 py-3 text-[11px] uppercase tracking-widest"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BOT_TEMPLATES.map((template, idx) => (
          <div key={idx} className="mil-panel group flex flex-col h-full hover:border-tactical-blue transition-all">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 mil-border flex items-center justify-center text-xl bg-tactical-black">
                  {template.icon}
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-mono text-tactical-blue border border-tactical-blue/30 px-2 py-0.5 uppercase tracking-tighter">
                  <ShieldCheck size={8} /> Verified Asset
                </div>
              </div>
              
              <h3 className="font-mono text-[12px] font-bold text-white uppercase tracking-widest mb-2">MOD://{template.name.replace(/\s+/g, '_').toUpperCase()}</h3>
              <p className="text-[10px] text-tactical-grey uppercase leading-relaxed tracking-tight flex-1 mb-8">{template.description}</p>
              
              <div className="pt-6 border-t border-tactical-border space-y-4">
                 <div className="flex justify-between text-[8px] font-mono text-tactical-border uppercase tracking-widest">
                    <span>Complexity</span>
                    <span>High_Fidelity</span>
                 </div>
                 <button 
                  onClick={() => handleUseTemplate(template)}
                  className="w-full mil-border py-3 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-tactical-blue hover:text-white transition-all flex items-center justify-center gap-3"
                 >
                   <Download size={12} /> Sync Blueprint
                 </button>
              </div>
            </div>
            <div className="h-0.5 bg-tactical-border group-hover:bg-tactical-blue transition-colors"></div>
          </div>
        ))}

        {/* Placeholder for custom upload */}
        <div className="mil-panel border-dashed border-tactical-border flex flex-col items-center justify-center p-8 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
           <Package className="text-tactical-grey mb-4" size={24} />
           <span className="font-mono text-[10px] text-tactical-grey uppercase tracking-widest text-center">Contribute Proprietary Module</span>
        </div>
      </div>
    </div>
  );
}