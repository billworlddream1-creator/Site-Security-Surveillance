
import React from 'react';
import { PlanType } from '../types';

interface UpgradeModalProps {
  currentPlan: PlanType;
  onClose: () => void;
  onSelect: (plan: PlanType, price: number) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ currentPlan, onClose, onSelect }) => {
  const plans = [
    { id: 'weekly' as PlanType, name: 'Sentry Core', period: 'Week', price: 2, features: ['Unlimited Sites', '7-Day History', 'Email Alerts'] },
    { id: 'monthly' as PlanType, name: 'Neural Nexus', period: 'Month', price: 5, features: ['Vulnerability Shield', '30-Day History', 'Neural Reports', 'AI Insights'], highlighted: true },
    { id: 'yearly' as PlanType, name: 'Sentinel Prime', period: 'Year', price: 25, features: ['Global Audit Hub', '365-Day History', 'API Access', 'Enterprise Support'], badge: 'Best Value' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-8 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Strategic Upgrade Programs</h2>
          <p className="text-indigo-100 text-sm mt-2 font-medium">Activate autonomous neural surveillance capabilities</p>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                plan.highlighted 
                ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-2xl shadow-indigo-200 bg-white scale-105 z-10' 
                : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                <span className="text-slate-400 font-bold text-sm uppercase">/ {plan.period}</span>
              </div>
              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onSelect(plan.id, plan.price)}
                disabled={currentPlan === plan.id}
                className={`mt-10 w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
                  currentPlan === plan.id 
                  ? 'bg-slate-100 text-slate-400 cursor-default' 
                  : plan.highlighted 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {currentPlan === plan.id ? 'Active Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
