
import React, { useState, useMemo } from 'react';
import { Website } from '../types';

interface SiteListProps {
  websites: Website[];
  onSelectSite: (id: string) => void;
  onRemoveSite: (id: string) => void;
}

type SortOption = 'name' | 'uptime' | 'latency' | 'status';

const SiteList: React.FC<SiteListProps> = ({ websites, onSelectSite, onRemoveSite }) => {
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const sortedWebsites = useMemo(() => {
    return [...websites].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'uptime':
          return b.uptime - a.uptime;
        case 'latency':
          return a.responseTime - b.responseTime;
        case 'status':
          const statusOrder = { online: 0, warning: 1, offline: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  }, [websites, sortBy]);

  const getStatusBadge = (status: Website['status']) => {
    switch (status) {
      case 'online':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-md border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase rounded-md border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Warning
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase rounded-md border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Offline
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Properties</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{websites.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase">Sort by:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="name">Alpha (A-Z)</option>
            <option value="uptime">Uptime (High-Low)</option>
            <option value="latency">Latency (Fastest)</option>
            <option value="status">Status (Health)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedWebsites.map((site) => (
          <div 
            key={site.id} 
            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 relative"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-800 truncate max-w-[160px]">{site.name}</h3>
                    {getStatusBadge(site.status)}
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-[200px] font-medium">{site.url}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveSite(site.id); }}
                  className="text-slate-300 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-all"
                  title="Remove property"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Uptime</p>
                  <p className={`text-lg font-black ${site.uptime < 99 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {site.uptime}%
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Latency</p>
                  <p className="text-lg font-black text-slate-700">
                    {site.responseTime}ms
                  </p>
                </div>
              </div>

              <button 
                onClick={() => onSelectSite(site.id)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold text-sm flex items-center justify-center gap-2 group-hover:shadow-xl group-hover:shadow-indigo-200"
              >
                Intelligence Hub
                <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </div>
            
            <div className="h-1 w-full bg-slate-100 group-hover:bg-indigo-100 overflow-hidden">
               <div 
                className={`h-full transition-all duration-1000 ${site.status === 'online' ? 'bg-green-500' : site.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${site.uptime}%` }}
               ></div>
            </div>
          </div>
        ))}

        {websites.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <p className="font-bold uppercase text-xs tracking-widest">No properties monitored</p>
            <p className="text-sm mt-1">Add a website to start surveillance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteList;
