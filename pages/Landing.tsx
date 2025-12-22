
import React, { useEffect, useState } from 'react';
import { Terminal, Shield, Crosshair, Zap, Activity, ChevronRight, Radar, Cpu, Globe } from 'lucide-react';
import { AuthService } from '../services/store';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Landing({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    const user = await AuthService.login();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* HUD Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-10 w-full relative z-50 shrink-0">
        <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.6)]">
            <Logo className="text-white w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[14px] font-black text-white tracking-tighter leading-none uppercase">Zen Foundry</h1>
            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-1 inline-block">Pro Intelligence Suite</span>
          </div>
        </div>

        <button 
          onClick={handleLogin}
          className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-md px-6 md:px-8 py-3.5 rounded-xl border border-white/10 transition-all duration-300 active:scale-95"
        >
          <div className="flex items-center gap-3 relative z-10">
            <Terminal size={18} className="text-blue-400" />
            <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Initialize Terminal</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 overflow-hidden min-h-0">
        {/* Tactical Crosshair Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 border border-white rounded-full"></div>
          <div className="absolute inset-[15%] border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white"></div>
        </div>

        <div className="text-center space-y-4 md:space-y-6 max-w-5xl animate-in zoom-in-95 duration-1000">
          <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-2 animate-pulse-slow">
            <Radar size={14} className="text-blue-400" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Signal Uplink: OS.ZEN.v4.0.2 Ready</span>
          </div>

          <h2 className={`text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] transition-all duration-75 ${glitch ? 'skew-x-2 translate-x-0.5' : ''}`}>
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 shimmer-text">
              Zen Agent
            </span>
            <br />
            <span className="text-blue-600 glow-text inline-block mt-1">Foundry</span>
          </h2>

          <p className="text-slate-400 text-base md:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-wide opacity-80 px-4">
            Architect, orchestrate, and deploy high-fidelity AI agents. Unified model routing with <span className="text-white font-black">Military-Grade Liquid Glass Encryption</span>.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={handleLogin}
              className="bg-white text-black px-10 py-5 rounded-2xl font-black text-[15px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 group flex items-center gap-4"
            >
              Access Command Center
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <Stat label="Nodes" value="2.4K" />
              <div className="w-px h-6 bg-white/10"></div>
              <Stat label="Neural" value="0.998" />
              <div className="w-px h-6 bg-white/10"></div>
              <Stat label="SEC" value="X-LEVEL" />
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid / Tactical Footer */}
      <footer className="relative z-10 w-full bg-slate-900/60 backdrop-blur-3xl border-t border-white/5 px-6 py-6 md:px-12 md:py-8 shrink-0">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <Feature 
            icon={Shield} 
            title="Sovereign Vault" 
            desc="Encrypted credential management."
          />
          <Feature 
            icon={Activity} 
            title="Real-time Telemetry" 
            desc="Sub-ms latency monitoring."
          />
          <Feature 
            icon={Cpu} 
            title="Adaptive Routing" 
            desc="Dynamic core scaling."
          />
          <Feature 
            icon={Globe} 
            title="Arena Network" 
            desc="Global distribution layer."
          />
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          <span>© 2025 ZEN FOUNDRY PROTOCOL | OS.ZEN.CORE.v4</span>
          <div className="hidden sm:flex gap-6">
            <SocialLink label="Docs" />
            <SocialLink label="Arena" />
            <SocialLink label="Uplink" />
          </div>
        </div>
      </footer>

      <style>{`
        .shimmer-text {
          background-size: 200% auto;
          animation: shimmer 12s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[14px] font-black text-white leading-none">{value}</span>
      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{label}</span>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
  return (
    <div className="space-y-2 group cursor-default">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <Icon size={16} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h4>
        <p className="hidden md:block text-[9px] text-slate-500 leading-tight uppercase tracking-tight font-medium group-hover:text-slate-400 transition-colors mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}

function SocialLink({ label }: any) {
  return (
    <a href="#" className="hover:text-white transition-colors">
      {label}
    </a>
  );
}
