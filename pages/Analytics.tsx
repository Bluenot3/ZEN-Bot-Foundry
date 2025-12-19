
import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../services/store';
import { UsageEvent } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Activity, ShieldCheck, Database, Zap, Cpu } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<UsageEvent[]>([]);

  useEffect(() => {
    const fakeData: UsageEvent[] = [];
    const models = ['GPT-o3-MINI', 'GEMINI-3-PRO', 'CLAUDE-4.5-SONNET', 'NANO-B-ULTRA'];
    const days = 30;
    
    for (let i = 0; i < days; i++) {
       const date = new Date();
       date.setDate(date.getDate() - (days - 1 - i));
       const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
       
       const eventsCount = Math.floor(Math.random() * 15) + 3;
       for (let j = 0; j < eventsCount; j++) {
          fakeData.push({
             date: dateStr,
             tokens: Math.floor(Math.random() * 3000) + 200,
             cost_est: Math.random() * 0.08,
             model: models[Math.floor(Math.random() * models.length)],
             status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILURE'
          });
       }
    }
    setData(fakeData);
  }, []);

  const groupedByDate = data.reduce((acc, curr) => {
     if (!acc[curr.date]) acc[curr.date] = { date: curr.date, val: 0, cost: 0 };
     acc[curr.date].val += curr.tokens;
     acc[curr.date].cost += curr.cost_est;
     return acc;
  }, {} as Record<string, any>);
  const timelineData = Object.values(groupedByDate);

  const modelDist = data.reduce((acc, curr) => {
     const found = acc.find(x => x.name === curr.model);
     if (found) found.value += curr.tokens;
     else acc.push({ name: curr.model, value: curr.tokens });
     return acc;
  }, [] as any[]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-tactical-border">
        <div>
           <div className="text-tactical-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2">Signal Intelligence Suite</div>
           <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase">Operational Data</h1>
        </div>
        <div className="flex gap-2">
           <div className="mil-border bg-white/40 px-4 py-2 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 rounded-xl">
             <Activity size={12} className="text-green-500" /> System: Nominal
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 mil-panel p-8 space-y-6 bg-white/60">
           <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Neural Load Distribution</h3>
              <span className="text-[9px] font-mono text-slate-400">30D Window // TKN_FLUX</span>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={timelineData}>
                    <XAxis dataKey="date" stroke="#e2e8f0" fontSize={9} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '1rem', color: '#000' }}
                    />
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fill="url(#colorVal)" />
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           <div className="mil-panel p-8 bg-blue-600 text-white">
              <div className="flex items-center gap-3 mb-4">
                 <Zap size={16} />
                 <h3 className="text-[11px] font-bold uppercase tracking-widest">Resource Allocation</h3>
              </div>
              <div className="space-y-4">
                 <AllocRow label="CLAUDE 4.5" val="62%" />
                 <AllocRow label="GPT o3" val="28%" />
                 <AllocRow label="GEMINI CORE" val="10%" />
              </div>
              <button className="w-full mt-8 bg-white/20 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/30 transition-all">Optimize Uplink</button>
           </div>

           <div className="mil-panel p-8 flex flex-col gap-2 bg-white/60">
              <span className="text-[9px] text-slate-400 tracking-[0.2em] uppercase">Est. Operational Cost</span>
              <div className="text-4xl font-black tracking-tighter text-slate-900">${data.reduce((a,b) => a+b.cost_est, 0).toFixed(2)}</div>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">-4.2% Efficiency Bonus</span>
           </div>
        </div>
      </div>
    </div>
  );
}

const AllocRow = ({ label, val }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[9px] font-bold tracking-widest">
      <span>{label}</span>
      <span>{val}</span>
    </div>
    <div className="h-1 bg-white/20 w-full overflow-hidden rounded-full">
      <div className="h-full bg-white" style={{width: val}}></div>
    </div>
  </div>
);
