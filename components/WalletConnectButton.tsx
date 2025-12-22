
import React, { useState } from 'react';
import { Wallet, Globe, LogOut, CheckCircle2, ShieldCheck, ChevronDown } from 'lucide-react';
import { CommerceService } from '../services/store';
import { WalletLink } from '../types';

export default function WalletConnectButton() {
  const [wallet, setWallet] = useState<WalletLink | null>(CommerceService.getWallet());
  const [isOpen, setIsOpen] = useState(false);

  const connectWallet = async () => {
    // Simulating Reown / WalletConnect Flow
    console.log("Opening Reown Modal for project eaf0cf5bfb50b695c5c47f42a191bcca");
    
    // In actual implementation: 
    // const { address, chainId } = await appKit.open();
    
    const mockWallet: WalletLink = {
      address: '0x71C7...f9a1',
      chain_id: 1,
      provider: 'metamask',
      connected_at: new Date().toISOString()
    };
    
    CommerceService.setWallet(mockWallet);
    setWallet(mockWallet);
  };

  const disconnect = () => {
    CommerceService.setWallet(null);
    setWallet(null);
    setIsOpen(false);
  };

  if (!wallet) {
    return (
      <button 
        onClick={connectWallet}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all group"
      >
        <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 transition-all"
      >
        <ShieldCheck size={16} className="status-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase">{wallet.address}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 mil-panel p-4 z-50 animate-in slide-in-from-top-2">
          <div className="space-y-4">
             <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                <span>Network</span>
                <span className="text-blue-400">Ethereum Mainnet</span>
             </div>
             <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 size={14} />
                <span className="text-[11px] font-bold uppercase">Ready for Checkout</span>
             </div>
             <button 
               onClick={disconnect}
               className="w-full py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
             >
               Disconnect
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
