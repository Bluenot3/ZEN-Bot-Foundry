import React, { useState } from 'react';
import { CreditCard, Copy, Check, Bitcoin, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/store';

const BTC_ADDRESS = "bc1q0zhdtrtudt6rzp40cgdkn32xed3jmxj069egty";

export default function Subscription() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const user = AuthService.getUser();

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    setVerifying(true);
    // Simulate payment verification
    setTimeout(() => {
      AuthService.setSubscription(true);
      setVerifying(false);
      alert("Payment verification initiated. Your subscription will update within 1-2 block confirmations.");
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">ZEN Native Access</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Rent a managed high-performance API key directly from ZEN. No cloud setup required.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Plan Details */}
        <div className="glass-panel p-8 rounded-3xl border-t-4 border-neon-cyan">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Premium</span>
              <h2 className="text-2xl font-bold text-white mt-2">Native Rental</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">$10</p>
              <p className="text-gray-500 text-sm">per month</p>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-300">
              <Check size={18} className="text-green-500" /> Managed GPT-5 & Gemini 3 access
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check size={18} className="text-green-500" /> Priority model routing
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check size={18} className="text-green-500" /> Enhanced rate limits
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <Check size={18} className="text-green-500" /> Private knowledge base (RAG)
            </li>
          </ul>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <ShieldCheck className="text-neon-purple" size={24} />
            <p className="text-xs text-gray-400">
              Payments are verified automatically on the blockchain. Subscription active for 30 days per transaction.
            </p>
          </div>
        </div>

        {/* Payment Logic */}
        <div className="glass-panel p-8 rounded-3xl bg-black/40">
          <div className="flex items-center gap-2 mb-6">
            <Bitcoin className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-white">Crypto Checkout</h3>
          </div>

          <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-tight">Step 1: Send $10 BTC (approx. 0.00015 BTC)</p>
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 relative group">
              <p className="text-[10px] text-gray-500 mb-1">Bitcoin Address (SegWit)</p>
              <p className="font-mono text-xs text-white break-all pr-10">{BTC_ADDRESS}</p>
              <button 
                onClick={handleCopy}
                className="absolute right-3 bottom-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-all"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="flex justify-center py-4">
               {/* Mock QR Code */}
               <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center opacity-80">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoin:bc1q0zhdtrtudt6rzp40cgdkn32xed3jmxj069egty?amount=0.00015" alt="QR" className="w-full h-full" />
               </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-tight">Step 2: Confirm Transaction</p>
          <button 
            onClick={handleVerify}
            disabled={verifying}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            {verifying ? "Verifying..." : "Confirm & Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}