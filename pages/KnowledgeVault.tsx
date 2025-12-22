
import React, { useState, useEffect } from 'react';
import { KnowledgeService, KeyService } from '../services/store';
import { KnowledgeAsset, TOONChunk } from '../types';
import { 
  FileText, Link as LinkIcon, Upload, Trash2, Search, Plus, 
  Globe, File, Image as ImageIcon, CheckCircle2, RefreshCcw, 
  MoreVertical, Info, HardDrive, Database, Type, Layout,
  Table as TableIcon, Tag, Brain, Sliders, Edit3, X, Zap, 
  FileCode, Clipboard, MousePointer2, AlertTriangle, Loader2
} from 'lucide-react';

type IngestType = 'file' | 'url' | 'text' | 'toon' | 'firecrawl';

export default function KnowledgeVault() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [activeTab, setActiveTab] = useState<IngestType>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('');
  const [editingAsset, setEditingAsset] = useState<KnowledgeAsset | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [url, setUrl] = useState('');
  const [firecrawlKeyPresent, setFirecrawlKeyPresent] = useState(false);

  useEffect(() => {
    setAssets(KnowledgeService.getAssets());
    const keys = KeyService.getKeys();
    setFirecrawlKeyPresent(keys.some(k => k.provider_id === 'firecrawl'));
  }, []);

  const handleIngest = async () => {
    if (!name.trim()) return alert("Asset callsign required.");
    setIsProcessing(true);

    try {
      // Simulate processing latency
      await new Promise(r => setTimeout(r, 1500));

      let finalContent = content;
      let finalType: KnowledgeAsset['type'] = 'text';
      let chunks: TOONChunk[] = [];

      if (activeTab === 'url') {
        finalContent = `[SCRAPED_DATA_FROM: ${url}]\n` + (content || "Neural scan completed on " + url);
        finalType = 'url';
      } else if (activeTab === 'firecrawl') {
        finalContent = `[DEEP_SCRAPE_MANIFEST: ${url}]\nRECURSIVE_DEPTH: 3\n` + (content || "Advanced Firecrawl extraction finalized.");
        finalType = 'url';
      } else if (activeTab === 'toon') {
        finalType = 'toon';
        chunks = content.split('\n\n').filter(Boolean).map(c => ({
          id: crypto.randomUUID(),
          text: c,
          tags: tags.split(',').map(t => t.trim()),
          token_count: Math.ceil(c.length / 4)
        }));
      } else if (activeTab === 'file') {
        finalType = 'pdf'; // Default to PDF for simulation
      }

      const newAsset: KnowledgeAsset = {
        id: crypto.randomUUID(),
        name,
        type: finalType,
        source: activeTab === 'file' ? 'Local System' : url || 'Manual Input',
        content: finalContent,
        toon_chunks: chunks.length > 0 ? chunks : undefined,
        tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
        status: 'indexed',
        created_at: new Date().toISOString()
      };

      await KnowledgeService.saveAsset(newAsset);
      setAssets(KnowledgeService.getAssets());
      
      // Reset forms
      setName('');
      setContent('');
      setUrl('');
      setTags('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('PERMANENTLY TERMINATE ASSET FROM VAULT?')) {
      KnowledgeService.deleteAsset(id);
      setAssets(KnowledgeService.getAssets());
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(filter.toLowerCase()) || 
    a.tags.some(t => t.includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-500" />
            <div className="text-blue-500 font-black text-[9px] tracking-[0.4em] uppercase">Foundry Vault OS v5.2</div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Knowledge Bank</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" placeholder="Filter by keyword..." 
            value={filter} onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-[11px] font-mono focus:border-blue-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingestion Hub */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="liquid-glass rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl">
            {/* Tab Nav */}
            <div className="grid grid-cols-5 border-b border-white/5 bg-white/5">
               <IngestTab active={activeTab === 'file'} onClick={() => setActiveTab('file')} icon={Upload} label="File" />
               <IngestTab active={activeTab === 'url'} onClick={() => setActiveTab('url')} icon={Globe} label="URL" />
               <IngestTab active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={Clipboard} label="Text" />
               <IngestTab active={activeTab === 'toon'} onClick={() => setActiveTab('toon')} icon={Brain} label="TOON" />
               <IngestTab active={activeTab === 'firecrawl'} onClick={() => setActiveTab('firecrawl')} icon={Zap} label="Deep" />
            </div>

            <div className="p-8 space-y-6">
               <div className="space-y-4">
                  <input 
                    type="text" placeholder="Asset Callsign (e.g. Q4_PROJECTIONS)" 
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-white outline-none focus:border-blue-500/30"
                  />
                  
                  {activeTab === 'file' && (
                    <div className="border-2 border-dashed border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                       <Upload className="text-blue-500" size={32} />
                       <div className="text-center">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Deploy Local Asset</p>
                          <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">PDF, JPG, PNG, DOC, TXT supported</p>
                       </div>
                    </div>
                  )}

                  {(activeTab === 'url' || activeTab === 'firecrawl') && (
                    <div className="space-y-4">
                       <input 
                          type="text" placeholder="Uplink URL (https://...)" 
                          value={url} onChange={e => setUrl(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-blue-400 outline-none focus:border-blue-500/30"
                       />
                       {activeTab === 'firecrawl' && (
                          <div className={`p-4 rounded-xl flex items-start gap-4 ${firecrawlKeyPresent ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                             {firecrawlKeyPresent ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <AlertTriangle size={16} className="text-rose-500 shrink-0" />}
                             <p className="text-[8px] font-bold uppercase tracking-tight leading-relaxed text-slate-400">
                                {firecrawlKeyPresent 
                                  ? "Firecrawl API Active. Deep recursive scraping enabled for this session." 
                                  : "Firecrawl key missing. Navigate to Credentials to enable deep recursive intelligence."}
                             </p>
                          </div>
                       )}
                    </div>
                  )}

                  {(activeTab === 'text' || activeTab === 'toon') && (
                    <textarea 
                       placeholder={activeTab === 'toon' ? "Inject logic to be auto-chunked..." : "Paste raw intel content here..."}
                       value={content} onChange={e => setContent(e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[11px] font-mono text-slate-300 h-48 focus:border-blue-500/30 outline-none resize-none"
                    />
                  )}

                  <input 
                    type="text" placeholder="Tags (comma separated)..." 
                    value={tags} onChange={e => setTags(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-slate-500 outline-none focus:border-blue-500/30"
                  />
               </div>

               <button 
                  onClick={handleIngest}
                  disabled={isProcessing || !name}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-500/20"
               >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
                  {activeTab === 'firecrawl' ? 'Execute Deep Scrape' : 'Inject Asset to Vault'}
               </button>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                 <HardDrive size={18} className="text-slate-600" />
                 <h2 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Vault_Inventory [{assets.length}]</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssets.length === 0 ? (
                <div className="col-span-full h-80 mil-panel border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center opacity-30">
                   <Database size={48} className="mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Vault_Is_Empty</p>
                </div>
              ) : (
                filteredAssets.map(asset => (
                  <div key={asset.id} className="liquid-glass p-6 rounded-[2rem] border-white/5 hover:border-blue-500/40 transition-all group flex flex-col justify-between">
                     <div className="space-y-4">
                        <div className="flex justify-between items-start">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${asset.type === 'toon' ? 'bg-purple-600/10 border-purple-500/30 text-purple-400' : 'bg-blue-600/10 border-blue-500/30 text-blue-400'}`}>
                              {asset.type === 'toon' ? <Brain size={20} /> : <FileText size={20} />}
                           </div>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingAsset(asset)} className="p-2 text-slate-500 hover:text-white"><Edit3 size={14} /></button>
                              <button onClick={() => handleDelete(asset.id)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={14} /></button>
                           </div>
                        </div>
                        <div>
                           <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate">{asset.name}</h4>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Source: {asset.source}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                           {asset.tags.map((t, i) => (
                             <span key={i} className="text-[7px] font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 uppercase">{t}</span>
                           ))}
                        </div>
                     </div>
                     <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{asset.type} NODE</span>
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse"></div>
                           <span className="text-[8px] font-black text-emerald-500 uppercase">INDEXED</span>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      {/* Quick Edit Overlay */}
      {editingAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
           <div className="w-full max-w-2xl liquid-glass rounded-[2.5rem] p-10 border-blue-500/30">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-white uppercase tracking-widest">Edit_Vault_Asset</h2>
                 <button onClick={() => setEditingAsset(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Name</label>
                    <input 
                      type="text" value={editingAsset.name} 
                      onChange={e => setEditingAsset({...editingAsset, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[12px] font-mono text-white outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source Context</label>
                    <input 
                      type="text" value={editingAsset.source} 
                      onChange={e => setEditingAsset({...editingAsset, source: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[12px] font-mono text-white outline-none"
                    />
                 </div>
                 <button 
                   onClick={() => {
                     const updated = assets.map(a => a.id === editingAsset.id ? editingAsset : a);
                     localStorage.setItem('zen_knowledge', JSON.stringify(updated));
                     setAssets(updated);
                     setEditingAsset(null);
                   }}
                   className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl"
                 >
                   Sync Changes to Vault
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function IngestTab({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`py-4 flex flex-col items-center justify-center gap-1.5 transition-all border-r last:border-r-0 border-white/5 ${active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={14} />
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
