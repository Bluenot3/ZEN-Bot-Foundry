import React from 'react';
import { Bot, Sparkles, Zap, Shield, ChevronRight, Terminal, Crosshair, Layers, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/store';
import { useNavigate } from 'react-router-dom';

export default function Landing({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async (destination: string = '/dashboard') => {
    const user = await AuthService.login();
    onLogin();
    navigate(destination);
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <nav className="flex items-center justify-between p-8 max-w-7xl mx-auto sticky top-0 z-50">
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Layers className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[18px] font-black tracking-tight leading-none">Zen Foundry</h1>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 inline-block">Pro Intelligence Suite</span>
          </div>
        </div>
        <button 
          onClick={() => handleGoogleLogin()}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-[14px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3"
        >
          <Terminal size={18} />
          Terminal Access
        </button>
      </nav>

      <div className="max-w-7xl mx-auto pt-24 pb-48 px-8 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[12px] font-bold uppercase tracking-widest mb-12 shadow-sm animate-bounce">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
          <span>Uplink v4.0.2 Operational</span>
        </div>
        
        <h1 className="text-7xl md:text-[9rem] font-black leading-[0.85] tracking-tight mb-12 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
          NEURAL<br />ARCHITECTURE
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-16 font-medium">
          Architect, orchestrate, and deploy high-fidelity AI agents. 
          Unified model routing with military-grade liquid glass encryption.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button 
            onClick={() => handleGoogleLogin('/create')}
            className="w-full sm:w-auto bg-blue-600 text-white px-14 py-7 rounded-[2rem] font-bold text-[17px] hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-500/40 flex items-center gap-4 active:scale-95"
          >
            Initialize Project <ChevronRight size={24} />
          </button>
          <button 
            onClick={() => handleGoogleLogin('/marketplace')}
            className="w-full sm:w-auto bg-white text-slate-900 px-14 py-7 rounded-[2rem] font-bold text-[17px] hover:bg-slate-50 transition-all border border-slate-200 shadow-xl flex items-center gap-4 active:scale-95"
          >
            Explore Library <ArrowRight size={24} />
          </button>
        </div>

        <div className="mt-40 grid md:grid-cols-3 gap-12 text-left">
          <FeatureCard 
            icon={<Shield className="w-8 h-8" />}
            title="Liquid Vault"
            description="AES-256 encrypted hardware level security for your most sensitive model credentials. Total data sovereignty."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8" />}
            title="Neural Warp"
            description="Sub-millisecond signal switching between multi-cloud backends. Intelligent auto-fallback for zero downtime."
          />
          <FeatureCard 
            icon={<Sparkles className="w-8 h-8" />}
            title="Artifact Studio"
            description="Real-time synthesis and live execution of code modules. Build complete web apps within the neural loop."
          />
        </div>
      </div>

      <footer className="border-t border-slate-200 py-24 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="text-[18px] font-black tracking-tight text-slate-900 mb-2">Zen Foundry</div>
            <div className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              © 2025 // DEFENSE_CORE_v4.2
            </div>
          </div>
          <div className="flex gap-12 text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Protocol</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="mil-panel p-12 hover:shadow-2xl transition-all duration-500 bg-white/40 border-white group">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight text-slate-900">{title}</h3>
    <p className="text-slate-500 text-[15px] leading-relaxed font-medium">{description}</p>
  </div>
);