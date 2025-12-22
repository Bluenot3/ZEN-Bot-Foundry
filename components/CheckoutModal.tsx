
import React, { useState } from 'react';
import { X, CreditCard, Bitcoin, ShoppingBag, ShieldCheck, Zap, ArrowRight, Loader2, Check } from 'lucide-react';
import { Product, PricePlan } from '../types';
import WalletConnectButton from './WalletConnectButton';
import { CommerceService, AuthService } from '../services/store';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ product, onClose, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'complete'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null);
  const [method, setMethod] = useState<'stripe' | 'gumroad' | 'crypto'>('stripe');

  const handleProcess = async () => {
    setStep('processing');
    
    // Simulation logic based on method
    await new Promise(r => setTimeout(r, 2000));
    
    const user = AuthService.getUser();
    if (user && selectedPlan) {
      CommerceService.addEntitlement({
        id: crypto.randomUUID(),
        user_id: user.id,
        type: 'agent_access',
        resource_id: product.resource_ids[0],
        status: 'active',
        metadata: {
          source: method,
          transaction_id: `TX_${Date.now()}`
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    setStep('complete');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl mil-panel relative overflow-hidden bg-slate-900 shadow-[0_0_100px_rgba(59,130,246,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500"></div>
        
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Secure Checkout</h3>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{product.name}</h2>
             </div>
             <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
             </button>
          </div>

          {step === 'plan' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="space-y-3">
                  {product.price_plans.map(plan => (
                    <button 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full p-5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                        selectedPlan?.id === plan.id 
                          ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                       <div>
                          <div className="text-[14px] font-black text-white uppercase tracking-widest">{plan.type.replace('_', ' ')} Access</div>
                          <div className="text-[10px] text-slate-500 uppercase mt-1 font-bold">{plan.interval ? `${plan.interval}ly cycle` : 'Permanent license'}</div>
                       </div>
                       <div className="text-xl font-black text-white">${plan.amount}</div>
                    </button>
                  ))}
               </div>
               <button 
                 disabled={!selectedPlan}
                 onClick={() => setStep('payment')}
                 className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
               >
                 Confirm Plan <ArrowRight size={18} />
               </button>
            </div>
          )}

          {step === 'payment' && (
             <div className="space-y-8 animate-in slide-in-from-right-4">
                <div className="grid grid-cols-3 gap-3">
                   <PaymentMethodBtn 
                      active={method === 'stripe'} 
                      onClick={() => setMethod('stripe')} 
                      icon={CreditCard} 
                      label="Stripe" 
                   />
                   <PaymentMethodBtn 
                      active={method === 'crypto'} 
                      onClick={() => setMethod('crypto')} 
                      icon={Bitcoin} 
                      label="Crypto" 
                   />
                   <PaymentMethodBtn 
                      active={method === 'gumroad'} 
                      onClick={() => setMethod('gumroad')} 
                      icon={ShoppingBag} 
                      label="Gumroad" 
                   />
                </div>

                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 min-h-[160px] flex flex-col justify-center items-center text-center">
                   {method === 'crypto' ? (
                      <div className="space-y-4">
                         <div className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Connect your wallet to pay with ETH/SOL</div>
                         <WalletConnectButton />
                      </div>
                   ) : method === 'stripe' ? (
                      <div className="space-y-4">
                         <ShieldCheck size={40} className="text-blue-500 mx-auto" />
                         <p className="text-[12px] text-slate-400 font-medium max-w-xs mx-auto uppercase tracking-tight">Redirecting to encrypted Stripe session for secure handling.</p>
                      </div>
                   ) : (
                      <div className="space-y-4">
                         <Zap size={40} className="text-rose-500 mx-auto" />
                         <p className="text-[12px] text-slate-400 font-medium max-w-xs mx-auto uppercase tracking-tight">One-click license redemption via Gumroad digital ecosystem.</p>
                      </div>
                   )}
                </div>

                <button 
                   onClick={handleProcess}
                   className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20"
                >
                   Execute Payment Manifest
                </button>
             </div>
          )}

          {step === 'processing' && (
             <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95">
                <Loader2 size={60} className="text-blue-500 animate-spin" />
                <div className="text-center">
                   <h4 className="text-[16px] font-black text-white uppercase tracking-widest">Validating Chain Data</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">DO NOT CLOSE TERMINAL...</p>
                </div>
             </div>
          )}

          {step === 'complete' && (
             <div className="py-12 text-center space-y-8 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                   <Check size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Entitlement Granted</h3>
                   <p className="text-slate-500 text-[12px] font-medium uppercase tracking-widest">Neural asset unlocked in your command center.</p>
                </div>
                <button 
                  onClick={() => { onSuccess(); onClose(); }}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                >
                  Enter Workspace
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentMethodBtn({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
        active 
          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
          : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
      }`}
    >
      <Icon size={20} />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
