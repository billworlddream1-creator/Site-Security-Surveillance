
import React, { useState } from 'react';
import { Website } from '../types';

interface AddSiteModalProps {
  onClose: () => void;
  onSubmit: (site: Website) => void;
}

const AddSiteModal: React.FC<AddSiteModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    tags: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameToValidate = formData.name.trim();

    // Validation: Check if empty
    if (!nameToValidate) {
      setError('Property Name cannot be empty.');
      return;
    }

    // Validation: Alphanumeric and spaces only
    const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
    if (!alphanumericRegex.test(nameToValidate)) {
      setError('Property Name must contain only alphanumeric characters and spaces.');
      return;
    }

    if (!formData.url) return;

    // Process tags
    const tags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newSite: Website = {
      id: Math.random().toString(36).substr(2, 9),
      name: nameToValidate,
      url: formData.url,
      status: 'online',
      uptime: 100,
      responseTime: 0,
      lastChecked: new Date().toISOString(),
      addedAt: new Date().toISOString().split('T')[0],
      tags: tags.length > 0 ? tags : undefined
    };

    onSubmit(newSite);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Monitor New Asset</h2>
            <p className="text-indigo-100 text-xs mt-1">Configure global monitoring for your web property</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-indigo-500 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Property Name</label>
            <input 
              autoFocus
              required
              type="text" 
              placeholder="e.g. My Portfolio"
              className={`w-full p-4 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} focus:border-transparent transition-all`}
              value={formData.name}
              onChange={e => {
                setFormData({...formData, name: e.target.value});
                if (error) setError(null);
              }}
            />
            {error && <p className="text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Public URL</label>
            <input 
              required
              type="url" 
              placeholder="https://example.com"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tags (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Retail, Production, Marketing"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
            <p className="text-[10px] text-slate-400 font-medium">Separate multiple tags with commas.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Start Monitoring
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteModal;
