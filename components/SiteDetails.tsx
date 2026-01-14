
import React, { useState, useEffect, useMemo } from 'react';
import { Website, PerformanceMetric, AIAnalysis, TimeRange, Vulnerability } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { performAIAnalysis } from '../services/geminiService';

interface SiteDetailsProps {
  site: Website;
}

const SiteDetails: React.FC<SiteDetailsProps> = ({ site }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.DAILY);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);

  // Generate dynamic performance data for the chart based on TimeRange
  const chartData = useMemo(() => {
    let points = 7;
    let labelPrefix = 'Day';
    
    if (timeRange === TimeRange.DAILY) { points = 24; labelPrefix = 'Hour'; }
    else if (timeRange === TimeRange.WEEKLY) { points = 7; labelPrefix = 'Day'; }
    else if (timeRange === TimeRange.MONTHLY) { points = 30; labelPrefix = 'Day'; }
    else if (timeRange === TimeRange.YEARLY) { points = 12; labelPrefix = 'Month'; }

    return Array.from({ length: points }, (_, i) => {
      // Create slight uptime fluctuations
      const uptimeBase = site.status === 'warning' ? 97 : 99.8;
      const uptime = Math.min(100, uptimeBase + (Math.random() * 0.5) - 0.2);
      
      return {
        date: `${labelPrefix} ${i + 1}`,
        visitors: Math.floor(Math.random() * 500) + 200,
        loadTime: Math.floor(Math.random() * 200) + (site.status === 'warning' ? 600 : 150),
        errorRate: Math.random() * 1.5,
        conversions: Math.floor(Math.random() * 50) + 10,
        uptime: parseFloat(uptime.toFixed(2))
      };
    });
  }, [timeRange, site.id, site.status]);

  // Comprehensive Aggregated Snapshots for Weekly, Monthly, and Yearly intervals
  const performanceStats = useMemo(() => {
    const generatePeriodStats = (days: number) => {
      const baseVisitors = days > 30 ? 5000 * (days / 30) : 1200 * days;
      const visitors = Math.floor(Math.random() * (baseVisitors * 0.5)) + baseVisitors;
      const avgLoad = Math.round(Math.random() * 150) + (site.status === 'warning' ? 480 : 180);
      const peakLoad = avgLoad + Math.floor(Math.random() * 400);
      const errorRate = (Math.random() * (days > 30 ? 0.5 : 0.9)).toFixed(2);
      const uptime = (99.5 + Math.random() * 0.49).toFixed(2);
      return { visitors, avgLoad, peakLoad, errorRate, uptime };
    };

    return {
      daily: generatePeriodStats(1),
      weekly: generatePeriodStats(7),
      monthly: generatePeriodStats(30),
      yearly: generatePeriodStats(365)
    };
  }, [site.id, site.status]);

  const runAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const result = await performAIAnalysis(site.url);
      setAnalysis(result);
      setVulnerabilities(result.vulnerabilities || []);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleFixVulnerability = (id: string) => {
    setVulnerabilities(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'fixing' } : v
    ));

    // Simulate fixing process
    setTimeout(() => {
      setVulnerabilities(prev => prev.map(v => 
        v.id === id ? { ...v, status: 'patched' } : v
      ));
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    setAnalysis(null);
    setVulnerabilities([]);
  }, [site.id]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 site-details-container">
      {/* Print-Only Header */}
      <div className="print-only mb-10 border-b-2 border-slate-900 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Security & Surveillance Report</h1>
            <p className="text-sm font-bold text-slate-600 mt-1">Property: {site.name}</p>
            <p className="text-xs text-slate-500">{site.url}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-slate-400">Generated On</p>
            <p className="text-sm font-bold">{new Date().toLocaleString()}</p>
            <p className="text-[10px] text-indigo-600 font-bold mt-1 tracking-widest uppercase">Confidential Status: Internal Use Only</p>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">{site.name}</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${site.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {site.status}
            </span>
          </div>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 text-sm font-medium mt-1">
            {site.url}
            <svg className="w-3 h-3 no-print" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="no-print px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Export Report
          </button>
          <div className="flex bg-slate-200/50 p-1 rounded-lg self-start no-print">
            {Object.values(TimeRange).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  timeRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STRATEGIC PERFORMANCE BREAKDOWN */}
      <section className="space-y-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Strategic Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Weekly Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Weekly Metrics</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Visitors</p>
                <p className="text-xl font-black">{performanceStats.weekly.visitors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Uptime</p>
                <p className="text-xl font-black text-green-600">{performanceStats.weekly.uptime}%</p>
              </div>
            </div>
          </div>
          {/* Monthly Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Monthly Metrics</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Visitors</p>
                <p className="text-xl font-black">{performanceStats.monthly.visitors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Uptime</p>
                <p className="text-xl font-black text-green-600">{performanceStats.monthly.uptime}%</p>
              </div>
            </div>
          </div>
          {/* Yearly Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Yearly Metrics</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Visitors</p>
                <p className="text-xl font-black">{performanceStats.yearly.visitors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Uptime</p>
                <p className="text-xl font-black text-green-600">{performanceStats.yearly.uptime}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TREND ANALYSIS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Visitor & Engagement Trend</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-400">
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Traffic</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Uptime Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Historical Uptime Integrity</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-green-500">
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Service Availability</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[95, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Line type="stepAfter" dataKey="uptime" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* VULNERABILITY & AUTO-FIX MODULE */}
      <div className="page-break bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="p-8 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl no-print">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Neural Vulnerability Shield</h3>
              <p className="text-slate-400 text-sm italic">AI-powered perimeter scan & autonomous remediation</p>
            </div>
          </div>
          {!analysis && !loadingAnalysis && (
            <button 
              onClick={runAnalysis}
              className="no-print px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Scan Security Perimeter
            </button>
          )}
        </div>

        <div className="p-8">
          {loadingAnalysis ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs animate-pulse">Running Neural Diagnostics...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 gap-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Detected Security Risks & Auto-Patches</h4>
                {vulnerabilities.length > 0 ? vulnerabilities.map((v) => (
                  <div key={v.id} className={`group bg-slate-800/40 border ${v.status === 'patched' ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700'} p-5 rounded-2xl transition-all duration-300`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          v.severity === 'critical' ? 'bg-rose-500/20 text-rose-500' : 
                          v.severity === 'high' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">{v.title}</span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${
                              v.severity === 'critical' ? 'border-rose-500 text-rose-500' : 'border-slate-600 text-slate-400'
                            }`}>{v.severity}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{v.description}</p>
                          {v.status === 'patched' && (
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase">
                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                               Remediated via AI Virtual Patching
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="no-print">
                        {v.status === 'detected' && (
                          <button 
                            onClick={() => handleFixVulnerability(v.id)}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Apply AI Patch
                          </button>
                        )}
                        {v.status === 'fixing' && (
                          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            Injecting Remediation...
                          </div>
                        )}
                        {v.status === 'patched' && (
                          <div className="px-5 py-2.5 bg-green-500/20 text-green-500 text-xs font-bold rounded-xl border border-green-500/20 flex items-center gap-2">
                             Secure
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 border border-dashed border-slate-700 rounded-3xl">
                     <p className="text-slate-500 text-sm">No critical vulnerabilities detected in recent perimeter scan.</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Cyber-Pattern Intelligence</h4>
                  <div className="bg-slate-800/20 p-6 rounded-2xl border border-slate-700/50">
                    <p className="text-sm text-indigo-100 italic leading-relaxed">"{analysis.cyberCrimeDetection}"</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Recommendations Roadmap</h4>
                  <div className="space-y-2">
                    {analysis.recommendations.map((r, i) => (
                      <div key={i} className="flex gap-3 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-lg border border-slate-700/30">
                        <span className="text-indigo-500 font-bold">{i+1}.</span>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <p className="font-medium">Active defense system standing by. Initiate scan for site-specific intelligence.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer disclaimer for print */}
      <div className="print-only mt-10 text-[10px] text-slate-400 border-t border-slate-200 pt-4 text-center">
        Security & Surveillance AI Audit - Proprietary analysis provided for {site.name}. 
        This report contains automated findings and should be verified by professional security personnel.
      </div>
    </div>
  );
};

export default SiteDetails;