
import React, { useState } from 'react';
import { X, Code, Play, Download, Maximize2, Minimize2, Smartphone, Monitor, FileText, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { Artifact } from '../types';

interface ArtifactPaneProps {
  artifacts: Artifact[];
  onClose: () => void;
}

export default function ArtifactPane({ artifacts, onClose }: ArtifactPaneProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'mobile'>('desktop');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const current = artifacts[selectedIndex];
  if (!current) return null;

  const handleDownload = () => {
    const blob = new Blob([current.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zen_asset_${current.id.substring(0, 8)}.${current.language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPreviewContent = () => {
    if (current.language === 'html') {
      return current.content;
    }
    // Simple mock runner for React-like code if it contains HTML/Tailwind
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              background: #f8fafc; 
              color: #0f172a; 
              font-family: 'Inter', sans-serif; 
              margin: 0; 
              padding: 0;
            }
            #app-container { min-height: 100vh; display: flex; flex-direction: column; }
          </style>
        </head>
        <body>
          <div id="app-container">
            ${current.content.includes('<') ? current.content : `<div class="p-10 text-center"><h1 class="text-3xl font-bold mb-4">Neural Artifact v1.0</h1><p class="text-slate-500">Executing ${current.language.toUpperCase()} core logic...</p><pre class="mt-8 p-6 bg-slate-900 text-blue-400 rounded-2xl text-left overflow-auto max-w-2xl mx-auto">${current.content}</pre></div>`}
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 flex flex-col transition-all duration-500 ease-in-out liquid-glass m-4 rounded-[2.5rem] shadow-2xl border border-white/40 ${isExpanded ? 'left-0' : 'w-full lg:w-[65%] xl:w-[75%]'}`}>
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-200/50 bg-white/60 px-8 flex items-center justify-between rounded-t-[2.5rem]">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Play className="text-white w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-[15px] font-black text-slate-900 tracking-tight uppercase">Asset Preview Engine</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest`}>{current.language}</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">● Virtual Environment Ready</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mr-4">
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-6 py-2 rounded-xl text-[12px] font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              App Preview
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-6 py-2 rounded-xl text-[12px] font-bold transition-all ${viewMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              Source Code
            </button>
          </div>

          {/* Breakpoint Simulation */}
          {viewMode === 'preview' && (
            <div className="flex gap-1 mr-4 border-r border-slate-200 pr-4">
              <button 
                onClick={() => setViewportSize('mobile')}
                className={`p-2.5 rounded-xl transition-all ${viewportSize === 'mobile' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Mobile View"
              >
                <Smartphone size={20} />
              </button>
              <button 
                onClick={() => setViewportSize('desktop')}
                className={`p-2.5 rounded-xl transition-all ${viewportSize === 'desktop' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Desktop View"
              >
                <Monitor size={20} />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              title={isExpanded ? "Minimize" : "Full Scale"}
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={handleDownload} 
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
              title="Download Package"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onClose} 
              className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Artifact Multi-Selector */}
      {artifacts.length > 1 && (
        <div className="bg-white/40 border-b border-slate-200/50 flex items-center px-8 py-3 gap-3 overflow-x-auto no-scrollbar">
          {artifacts.map((a, idx) => (
            <button 
              key={a.id}
              onClick={() => setSelectedIndex(idx)}
              className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${selectedIndex === idx ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
            >
              {a.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50/50 flex items-center justify-center p-6">
        {viewMode === 'code' ? (
          <div className="w-full h-full bg-slate-900 rounded-3xl shadow-inner relative overflow-hidden flex flex-col group">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{current.language} // Internal Logic</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "COPIED" : "COPY CODE"}
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-8 font-mono text-[14px] text-blue-400 leading-relaxed custom-scrollbar">
              <code>{current.content}</code>
            </pre>
          </div>
        ) : (
          <div className={`h-full transition-all duration-500 ease-in-out relative ${viewportSize === 'mobile' ? 'w-[375px]' : 'w-full'}`}>
            <div className={`w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative ${viewportSize === 'mobile' ? 'ring-8 ring-slate-900/5' : ''}`}>
              <iframe 
                srcDoc={getPreviewContent()}
                className="w-full h-full border-none"
                title="Embedded Environment"
              />
              
              {/* Overlay simulation for Mobile frame */}
              {viewportSize === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
              )}
            </div>
            
            {viewportSize === 'mobile' && (
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-slate-300">
                <div className="w-1 h-12 bg-slate-300 rounded-full"></div>
                <div className="w-1 h-20 bg-slate-300 rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info HUD */}
      <div className="h-14 border-t border-slate-200/50 bg-white/60 flex items-center justify-between px-10 rounded-b-[2.5rem]">
         <div className="flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Status: Synchronized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Hash: {current.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <span>Core: OS.ZEN.v4</span>
         </div>
         <div className="flex items-center gap-4">
            <button 
              disabled={selectedIndex === 0}
              onClick={() => setSelectedIndex(s => Math.max(0, s - 1))}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[12px] font-black text-slate-900 tracking-widest">{selectedIndex + 1} / {artifacts.length}</span>
            <button 
              disabled={selectedIndex === artifacts.length - 1}
              onClick={() => setSelectedIndex(s => Math.min(artifacts.length - 1, s + 1))}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
}
