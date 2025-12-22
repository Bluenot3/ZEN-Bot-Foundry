
import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles, Check } from 'lucide-react';
import { ModelRouter } from '../services/llm';

interface MagicEnhancerProps {
  value: string;
  onEnhance: (newValue: string) => void;
  className?: string;
}

export default function MagicEnhancer({ value, onEnhance, className = "" }: MagicEnhancerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnhance = async () => {
    if (!value.trim() || loading) return;
    setLoading(true);
    try {
      const enhanced = await ModelRouter.enhance(value);
      onEnhance(enhanced);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Enhance failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnhance}
      disabled={loading || !value.trim()}
      className={`p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all group relative ${className}`}
      title="AI Enhance"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : success ? (
        <Check size={14} />
      ) : (
        <Sparkles size={14} className="group-hover:animate-pulse" />
      )}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 shadow-2xl">
        AI Intelligence Upgrade
      </div>
    </button>
  );
}
