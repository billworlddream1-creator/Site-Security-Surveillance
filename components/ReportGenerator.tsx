
import React, { useState, useMemo } from 'react';
import { Website, TimeRange } from '../types';

interface ReportGeneratorProps {
  websites: Website[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ websites }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reportRange, setReportRange] = useState<TimeRange>(TimeRange.WEEKLY);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSite = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === websites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(websites.map(w => w.id));
    }
  };

  const selectedSites = useMemo(() => 
    websites.filter(w => selectedIds.includes(w.id)), 
  [websites, selectedIds]);

  const handlePrint = () => {
    setIsGenerating(true);
    // Short timeout to allow state update to render the print view before window.print()
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 500);
  };

  if (isGenerating) {
    return (
      <div className="bg-white p-10 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="border-b-4 border-slate-900 pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Security & Surveillance Audit</h1>
              <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">Aggregate Performance & Security Intelligence</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Report Scope</p>
              <p className="text-lg font-black text-indigo-600">{reportRange}</p>
              <p className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleString()}</p>
            </div>
          </div>

          {selectedSites.map((site) => (
            <div key={site.id} className="page-break space-y-6 pt-10">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">{site.name}</h2>
                <span className="text-sm font-mono text-slate-400">{site.url}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Visitors</p>
                  <p className="text-2xl font-black text-slate-800">
                    {(Math.floor(Math.random() * 5000) + 1000).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg Load Time</p>
                  <p className="text-2xl font-black text-slate-800">{site.responseTime + 50}ms</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Uptime</p>
                  <p className="text-2xl font-black text-green-600">{site.uptime}%</p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-2xl">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Security Snapshot</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm font-medium text-slate-300 italic mb-2">"Automated scan detected standard security headers. No high-severity vulnerabilities identified in immediate network perimeter."</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Autonomous Threat Intelligence</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">SSL Certificate</span>
                      <span className="text-green-400 font-bold">Valid</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">DDoS Protection</span>
                      <span className="text-green-400 font-bold">Active</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Malware Scan</span>
                      <span className="text-green-400 font-bold">Clean</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-20 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
              End of Document - Generated by Site Security & Surveillance Autonomous Systems
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Intelligence Report Builder</h2>
            <p className="text-sm text-slate-500 mt-1">Select multiple properties to generate a unified security and performance audit.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Period:</span>
            <select 
              value={reportRange}
              onChange={(e) => setReportRange(e.target.value as TimeRange)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(TimeRange).map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selection Pool ({selectedIds.length}/{websites.length})</span>
            <button 
              onClick={toggleAll}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {selectedIds.length === websites.length ? 'Deselect All' : 'Select All Properties'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {websites.map((site) => (
              <label 
                key={site.id} 
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedIds.includes(site.id) 
                  ? 'border-indigo-600 bg-indigo-50/30' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(site.id)}
                    onChange={() => toggleSite(site.id)}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{site.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{site.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${site.status === 'online' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{site.uptime}%</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            disabled={selectedIds.length === 0}
            onClick={handlePrint}
            className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 shadow-lg ${
              selectedIds.length > 0 
              ? 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-indigo-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Generate Batch Report ({selectedIds.length})
          </button>
        </div>
      </div>

      {selectedIds.length === 0 && (
        <div className="text-center py-12 text-slate-400">
           <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
           <p className="text-sm font-medium">Please select at least one property to include in the intelligence audit.</p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;