
import React from 'react';
import { Website } from '../types';

interface StatsOverviewProps {
  websites: Website[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ websites }) => {
  const avgUptime = websites.reduce((acc, s) => acc + s.uptime, 0) / (websites.length || 1);
  const avgResponse = websites.reduce((acc, s) => acc + s.responseTime, 0) / (websites.length || 1);
  const totalWarnings = websites.filter(s => s.status === 'warning' || s.status === 'offline').length;

  const stats = [
    { 
      label: 'Avg. Global Uptime', 
      value: `${avgUptime.toFixed(2)}%`, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    { 
      label: 'Avg. Latency', 
      value: `${avgResponse.toFixed(0)}ms`, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    { 
      label: 'Security Alerts', 
      value: totalWarnings.toString(), 
      color: totalWarnings > 0 ? 'text-amber-600' : 'text-slate-600', 
      bg: totalWarnings > 0 ? 'bg-amber-50' : 'bg-slate-50',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    { 
      label: 'Active Properties', 
      value: websites.length.toString(), 
      color: 'text-slate-800', 
      bg: 'bg-slate-100',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
          <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}/></svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
