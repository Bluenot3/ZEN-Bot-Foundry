import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Terminal, Shield, BarChart2, Briefcase, Activity, Power, Layers, ChevronRight, BookOpen } from 'lucide-react';
import { AuthService } from '../services/store';

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative mx-2 rounded-2xl mb-1 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
        <span className="font-sans text-[13px] font-semibold tracking-wide">{label}</span>
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
    <div className="min-h-screen flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 liquid-glass border-r border-white/20 z-40 flex flex-col m-4 rounded-[2rem] shadow-xl">
        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 tracking-tight leading-none">Zen Foundry</h1>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 inline-block">v4.0.2 Premium</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2">
          <div className="px-6 py-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase">Platform</div>
          <SidebarItem to="/dashboard" icon={Terminal} label="Command Center" />
          <SidebarItem to="/knowledge" icon={BookOpen} label="Knowledge Vault" />
          <SidebarItem to="/marketplace" icon={Briefcase} label="Module Library" />
          <SidebarItem to="/analytics" icon={BarChart2} label="Live Telemetry" />
          
          <div className="px-6 py-4 mt-6 text-[11px] font-bold text-slate-400 tracking-widest uppercase">Security</div>
          <SidebarItem to="/keys" icon={Shield} label="Credential Vault" />
          <SidebarItem to="/subscription" icon={Activity} label="System Resources" />
        </nav>

        <div className="p-8 border-t border-slate-200/50">
          <div className="mb-6 bg-white/40 p-4 rounded-2xl border border-white/40">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-2">
              <span>Uplink Status</span>
              <span className="text-blue-600">Secure</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[85%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            </div>
          </div>

          <button 
            onClick={AuthService.logout}
            className="flex items-center gap-3 font-bold text-[13px] text-slate-400 hover:text-red-500 transition-colors w-full px-4"
          >
            <Power className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/20 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
              <span>System</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-slate-900">{location.pathname.substring(1).replace('/', ' / ')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 py-2 px-4 rounded-2xl bg-white/60 border border-white shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[13px] font-bold text-slate-700">{user?.email.split('@')[0]}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}