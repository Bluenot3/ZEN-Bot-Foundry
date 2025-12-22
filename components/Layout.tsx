
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Terminal, Shield, BarChart2, Briefcase, Activity, Power, ChevronRight, BookOpen, Layers, Radar } from 'lucide-react';
import { AuthService } from '../services/store';
import Logo from './Logo';

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 transition-all duration-300 group relative mx-2 rounded-xl mb-1 ${
        isActive
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-blue-400' : 'group-hover:scale-110'}`} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest">{label}</span>
        {isActive && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
        )}
      </>
    )}
  </NavLink>
);

export default function Layout() {
  const user = AuthService.getUser();
  const location = useLocation();
  const isPublic = location.pathname.startsWith('/bot/');

  if (isPublic) return <Outlet />;

  return (
    <div className="h-screen w-screen flex selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-3xl border-r border-white/5 z-40 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Logo className="text-white w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-[13px] font-black text-slate-100 tracking-tighter leading-none uppercase">Zen Foundry</h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse"></div>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Core Secure</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar">
          <section>
            <div className="px-6 pb-2 text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Intelligence</div>
            <SidebarItem to="/dashboard" icon={Terminal} label="Command" />
            <SidebarItem to="/knowledge" icon={BookOpen} label="Vault" />
            <SidebarItem to="/marketplace" icon={Briefcase} label="Arena" />
            <SidebarItem to="/analytics" icon={Radar} label="Telemetry" />
          </section>
          
          <section>
            <div className="px-6 pb-2 text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Resources</div>
            <SidebarItem to="/keys" icon={Shield} label="Credentials" />
            <SidebarItem to="/subscription" icon={Activity} label="System" />
          </section>
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase">
              <span>Sync Status</span>
              <span className="text-blue-400">98.2%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[98%] shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
            </div>
          </div>

          <button 
            onClick={AuthService.logout}
            className="flex items-center gap-3 font-mono text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors w-full px-2"
          >
            <Power className="w-3.5 h-3.5" />
            LOGOUT_SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617]/50 relative overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <Layers size={14} className="text-blue-500" />
            <span>Foundry</span>
            <ChevronRight size={10} className="text-slate-700" />
            <span className="text-slate-200">{location.pathname.substring(1).split('/')[0] || 'Dashboard'}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400">OP_ID:</span>
              <span className="text-[10px] font-mono font-bold text-blue-400">{user?.email.split('@')[0].toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
