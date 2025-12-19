import React, { useState, useEffect } from 'react';
import { KnowledgeService } from '../services/store';
import { KnowledgeAsset } from '../types';
import { 
  FileText, Link as LinkIcon, Upload, Trash2, Search, Plus, 
  Globe, File, Image as ImageIcon, CheckCircle2, RefreshCcw, 
  MoreVertical, Info, HardDrive
} from 'lucide-react';

export default function KnowledgeVault() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setAssets(KnowledgeService.getAssets());
  }, []);

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    setIsUploading(true);
    
    const newAsset: KnowledgeAsset = {
      id: crypto.randomUUID(),
      name: urlInput.replace(/^https?:\/\//, '').split('/')[0],
      type: 'url',
      source: urlInput,
      status: 'indexed',
      created_at: new Date().toISOString()
    };

    await KnowledgeService.saveAsset(newAsset);
    setAssets(KnowledgeService.getAssets());
    setUrlInput('');
    setIsUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const type = file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc';
    
    const newAsset: KnowledgeAsset = {
      id: crypto.randomUUID(),
      name: file.name,
      type: type as any,
      source: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      status: 'indexed',
      created_at: new Date().toISOString()
    };

    await KnowledgeService.saveAsset(newAsset);
    setAssets(KnowledgeService.getAssets());
    setIsUploading(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently wipe this asset from the neural bank?')) {
      KnowledgeService.deleteAsset(id);
      setAssets(KnowledgeService.getAssets());
    }
  };

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <HardDrive size={18} className="text-blue-600" />
            <div className="text-blue-600 font-bold text-[12px] tracking-widest uppercase">Memory Bank Architecture</div>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-none">Knowledge Vault</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full mil-input pl-14 pr-6 py-5 text-[15px] font-medium"
          />
        </div>
      </div>

      {/* Uploaders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="mil-panel p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remote Uplink Scraper</h3>
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="https://source-intel.uri/data" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 mil-input p-5 font-medium"
            />
            <button 
              onClick={handleUrlSubmit}
              disabled={isUploading || !urlInput}
              className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isUploading ? 'Indexing...' : 'Inject'}
            </button>
          </div>
          <p className="text-[12px] font-medium text-slate-400">Automated indexing for documentation, reports, and real-time feeds.</p>
        </div>

        <div className="mil-panel p-10 space-y-8 border-dashed border-slate-300 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
              <Upload size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Local Data Upload</h3>
          </div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] h-32 hover:border-blue-500 hover:bg-white transition-all cursor-pointer group">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            <div className="flex items-center gap-4 text-slate-400 group-hover:text-blue-600">
              <Plus size={24} />
              <span className="font-bold text-[14px]">PDF / Image / Text Archive</span>
            </div>
          </label>
        </div>
      </div>

      {/* Asset Display */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <h2 className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Active Neural Assets</h2>
          <div className="flex items-center gap-3 text-[12px] font-bold text-blue-600">
            <RefreshCcw size={14} className="animate-spin-slow" />
            <span>Sync Engine Active</span>
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="mil-panel h-80 flex flex-col items-center justify-center text-slate-300 bg-white/30 border-dashed">
            <Info size={60} className="mb-6 opacity-10" />
            <span className="text-[14px] font-bold uppercase tracking-[0.3em]">Vault Memory Empty</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const AssetCard: React.FC<{ asset: KnowledgeAsset, onDelete: (id: string) => void }> = ({ asset, onDelete }) => {
  const Icon = asset.type === 'url' ? Globe : asset.type === 'pdf' ? FileText : asset.type === 'image' ? ImageIcon : File;

  return (
    <div className="mil-panel group hover:shadow-2xl hover:-translate-y-1 transition-all p-8 bg-white/60 border-white">
      <div className="flex justify-between items-start mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${asset.status === 'indexed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
          <Icon size={24} />
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
            <MoreVertical size={18} />
          </button>
          <button onClick={() => onDelete(asset.id)} className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 truncate">{asset.name}</h3>
          <p className="text-[12px] font-medium text-slate-400 truncate mt-1">{asset.source}</p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">{asset.status}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{asset.size || 'Web Link'}</span>
        </div>
      </div>
    </div>
  );
}