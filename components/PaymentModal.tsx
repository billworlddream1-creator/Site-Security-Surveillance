
import React, { useState } from 'react';
import { PlanType, Website } from '../types';

interface PaymentModalProps {
  plan: PlanType;
  price: number;
  walletBalance: number;
  websites: Website[];
  onClose: () => void;
  onComplete: (plan: PlanType, price: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, price, walletBalance, websites, onClose, onComplete }) => {
  const [method, setMethod] = useState<'paypal' | 'wallet'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  const hasInsufficientFunds = method === 'wallet' && walletBalance < price;

  const handlePay = () => {
    if (hasInsufficientFunds) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      onComplete(plan, price);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Checkout</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Order Summary */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upgrade To</p>
              <p className="font-bold text-slate-800 uppercase tracking-tight">{plan} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-indigo-600">${price.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global License</p>
            </div>
          </div>

          {/* Websites Listing */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Managed Assets ({websites.length})</label>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {websites.map(site => (
                <div key={site.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${site.status === 'online' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span className="text-xs font-bold text-slate-700">{site.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">{site.url}</span>
                </div>
              ))}
              {websites.length === 0 && (
                <p className="text-xs text-slate-400 italic py-2">No monitored properties in inventory.</p>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Choose Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMethod('paypal')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  method === 'paypal' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M20.067 8.478c.492.88.556 2.014.307 3.233-.526 2.583-2.618 4.606-5.234 4.606h-1.638l-.634 3.123h-3.328l1.638-8.066h3.402c1.928 0 3.328-.865 3.487-2.896zm-9.566 3.123l-.408 2.008h1.832c1.373 0 2.47-1.062 2.748-2.428.148-.73-.024-1.332-.387-1.74l-.066.32c-.159 2.031-1.559 2.896-3.487 2.896h-.232zM21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
                </div>
                <span className="text-xs font-bold text-slate-700">PayPal</span>
              </button>
              <button 
                onClick={() => setMethod('wallet')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative ${
                  method === 'wallet' 
                    ? (walletBalance < price ? 'border-red-500 bg-red-50/50' : 'border-indigo-600 bg-indigo-50/50') 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center ${walletBalance < price ? 'text-red-500' : 'text-amber-500'}`}>
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <div className="text-center">
                   <span className="text-xs font-bold text-slate-700">Neural Wallet</span>
                   <p className={`text-[9px] font-black uppercase ${walletBalance < price ? 'text-red-600' : 'text-slate-400'}`}>
                     ${walletBalance.toFixed(2)}
                   </p>
                </div>
              </button>
            </div>
          </div>

          {/* Insufficient Funds Warning */}
          {hasInsufficientFunds && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <div>
                <p className="text-xs font-bold text-red-800">INSUFFICIENT BALANCE</p>
                <p className="text-[10px] text-red-600 mt-0.5">Your wallet balance is ${walletBalance.toFixed(2)}. You need ${(price - walletBalance).toFixed(2)} more to complete this transaction.</p>
              </div>
            </div>
          )}

          <button 
            onClick={handlePay}
            disabled={isProcessing || hasInsufficientFunds}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
              hasInsufficientFunds 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing Security Link...
              </>
            ) : (
              <>
                Authorize License Upgrade
              </>
            )}
          </button>
          
          <p className="text-[10px] text-slate-400 text-center font-medium">Transaction secured via GMT Neural Payment Gateway • End-to-end encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
