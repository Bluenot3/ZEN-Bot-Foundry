
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
import { AuthService } from './services/store';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = AuthService.getUser();
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-sm tracking-widest uppercase">Initializing Foundry Core...</div>;

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
          <Route path="/keys" element={<KeysVault />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/subscription" element={<Subscription />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
