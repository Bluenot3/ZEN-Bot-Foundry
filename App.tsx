
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import BotBuilder from './pages/BotBuilder';
import KeysVault from './pages/KeysVault';
import Analytics from './pages/Analytics';
import BotPublic from './pages/BotPublic';
import Workspace from './pages/Workspace';
import Marketplace from './pages/Marketplace';
import Subscription from './pages/Subscription';
import KnowledgeVault from './pages/KnowledgeVault';
import ArenaDesigner from './pages/ArenaDesigner';
import { AuthService } from './services/store';

// WalletConnect / Reown Integration
const PROJECT_ID = 'eaf0cf5bfb50b695c5c47f42a191bcca';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = AuthService.getUser();
    setIsAuthenticated(!!user);
    setLoading(false);
    
    // Log project ID for verification
    console.debug(`[ZEN_COMMERCE] Initializing Reown Gateway: ${PROJECT_ID}`);
  }, []);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-mono text-sm tracking-widest uppercase">Initializing Neural Core...</div>;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/bot/:slug" element={<BotPublic />} />

        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/knowledge" element={<KnowledgeVault />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create" element={<BotBuilder />} />
          <Route path="/edit/:id" element={<BotBuilder />} />
          <Route path="/arena/new" element={<ArenaDesigner />} />
          <Route path="/arena/edit/:id" element={<ArenaDesigner />} />
          <Route path="/keys" element={<KeysVault />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/subscription" element={<Subscription />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
