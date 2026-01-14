
import React from 'react';
import { SecurityEvent } from '../types';

interface SecurityEventsLogProps {
  events: SecurityEvent[];
}

const SecurityEventsLog: React.FC<SecurityEventsLogProps> = ({ events }) => {
  const getSeverityStyles = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Global Security Event Log</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">Source Property</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getSeverityStyles(event.severity)}`}>
                    {event.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-700">{event.type}</p>
                  <p className="text-xs text-slate-400">{event.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {event.siteName}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityEventsLog;
