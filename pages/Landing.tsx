import React, { useEffect, useState } from 'react';
import { Terminal, Shield, Zap, Activity, ChevronRight, Radar, Cpu, Globe } from 'lucide-react';
import { AuthService } from '../services/store';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Landing({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsShortScreen(window.innerHeight < 820);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = async () => {
    const user = await AuthService.login();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col bg-transparent selection:bg-blue-600/30 selection:text-blue-100">
      
      {/* 1. TOP NAVIGATION */}
      <nav className="z-[100] p-6 md:p-10 lg:px-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 bg-[#020617]/80 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)]">
            <Logo className="text-white w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[14px] font-black text-white tracking-tighter leading-none uppercase">Zen Foundry</h1>
            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-1 inline-block">Pro Intelligence Suite</span>
          </div>
        </div>

        <button 
          onClick={handleLogin}
          className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-md px-7 py-4 rounded-2xl border border-white/10 transition-all duration-300 active:scale-95"
        >
          <div className="flex items-center gap-3 relative z-10">
            <Terminal size={18} className="text-blue-400" />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Initialize Session</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
      </nav>

      {/* 2. MAIN HERO SECTION - Centered and Elevated */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-[90] min-h-0 overflow-hidden -mt-20">
        <div className={`text-center w-full max-w-7xl transition-all duration-700 ${isShortScreen ? 'space-y-4' : 'space-y-10'}`}>
          <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-5 py-2 rounded-full animate-pulse-slow">
            <Radar size={16} className="text-blue-400" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Signal Uplink: OS.ZEN.v5.1.0 Ready</span>
          </div>

          <div className={`relative transition-all duration-75 ${glitch ? 'skew-x-1 translate-x-1 opacity-90' : ''}`}>
             <h2 className={`font-black tracking-tighter uppercase leading-[0.8] mb-4 transition-all ${isShortScreen ? 'text-6xl md:text-8xl lg:text-9xl' : 'text-7xl md:text-9xl lg:text-[12rem]'}`}>
               <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] shimmer-text">
                 Zen Agent
               </span>
               <br />
               <span className="text-blue-600 drop-shadow-[0_0_60px_rgba(37,99,235,0.6)] inline-block mt-4">Foundry</span>
             </h2>
          </div>

          <p className={`text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed uppercase tracking-widest opacity-80 px-4 transition-all ${isShortScreen ? 'text-[11px] md:text-sm' : 'text-sm md:text-xl'}`}>
            Architect, orchestrate, and deploy high-fidelity AI agents. <br className="hidden md:block" /> Unified model routing with <span className="text-white font-black">Military-Grade Liquid Glass Encryption</span>.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10 relative z-[200]">
            <button 
              onClick={handleLogin}
              className="bg-white text-black px-16 py-7 rounded-[2rem] font-black text-[18px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_100px_rgba(255,255,255,0.2)] active:scale-95 group flex items-center gap-5"
            >
              Access Command Center
              <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-10 px-10 py-6 rounded-[2rem] bg-[#020617]/70 border border-white/10 backdrop-blur-3xl shadow-2xl">
              <Stat label="Nodes" value="12.4K" />
              <div className="w-px h-10 bg-white/10"></div>
              <Stat label="Neural" value="0.999" />
              <div className="w-px h-10 bg-white/10"></div>
              <Stat label="SEC" value="X-LEVEL" />
            </div>
          </div>
        </div>
      </main>

      {/* 3. SMART FOOTER - Adaptive Visibility */}
      <footer className={`fixed bottom-0 left-0 w-full transition-all duration-1000 z-[10] ${isShortScreen ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0 bg-[#010409]/90 backdrop-blur-3xl border-t border-white/5 px-6 py-6 md:px-12 md:py-12'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 mb-10">
          <Feature icon={Shield} title="Sovereign Vault" desc="Encrypted credential management." />
          <Feature icon={Activity} title="Real-time Telemetry" desc="Sub-ms latency monitoring." />
          <Feature icon={Cpu} title="Adaptive Routing" desc="Dynamic core scaling." />
          <Feature icon={Globe} title="Arena Network" desc="Global distribution layer." />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] pt-8 border-t border-white/5">
          <span>© 2025 ZEN FOUNDRY PROTOCOL | OS.ZEN.CORE.v5.1</span>
          <div className="flex gap-10">
            <SocialLink label="Docs" />
            <SocialLink label="Arena" />
            <SocialLink label="Uplink" />
          </div>
        </div>
      </footer>

      <style>{`
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #3b82f6 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 5s linear infinite;
        }
        @keyframes shimmerText {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[22px] font-black text-white leading-none tracking-tight glow-text">{value}</span>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2.5">{label}</span>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-6 group cursor-default">
      <div className="w-14 h-14 shrink-0 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-all shadow-inner group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
        <Icon size={24} />
      </div>
      <div className="overflow-hidden">
        <h4 className="text-[12px] font-black text-white uppercase tracking-widest truncate">{title}</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-tight font-medium group-hover:text-slate-300 transition-colors mt-2 line-clamp-2">
          {desc}
        </p>
      </div>
    </div>
  );
}

function SocialLink({ label }: any) {
  return (
    <a href="#" className="hover:text-blue-400 transition-all duration-300 hover:tracking-[0.6em]">
      {label}
    </a>
  );
}