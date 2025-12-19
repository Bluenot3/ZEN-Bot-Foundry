import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BotService } from '../services/store';
import ChatInterface from '../components/ChatInterface';
import { Bot, AlertTriangle } from 'lucide-react';

export default function BotPublic() {
  const { slug } = useParams();
  // In a real app, fetch by slug. Here we iterate mock bots.
  const bots = BotService.getBots();
  // Just grab the first one or find by slug if we had slugs properly in mock data
  const bot = bots.find(b => b.slug === slug) || bots[0]; 

  if (!bot && bots.length > 0) return <div>Bot not found</div>;
  // If no bots at all, show fallback
  if (!bot) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Bot Not Found</h1>
        <Link to="/" className="text-neon-cyan hover:underline">Go Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
       <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 glass-panel">
          <Link to="/" className="flex items-center gap-2">
             <Bot className="text-neon-cyan" />
             <span className="font-bold text-white tracking-tight">ZEN Bot</span>
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Build your own</Link>
       </header>

       <main className="flex-1 p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-4xl">
             <ChatInterface bot={bot} className="h-[80vh]" />
          </div>
       </main>
    </div>
  );
}