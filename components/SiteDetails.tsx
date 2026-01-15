
import React, { useState, useEffect, useMemo } from 'react';
import { Website, AIAnalysis, TimeRange, Vulnerability, AlertThresholds } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { performAIAnalysis } from '../services/geminiService';

interface SiteDetailsProps {
  site: Website;
  onUpdate?: (updates: Partial<Website>) => void;
}

const SiteDetails: React.FC<SiteDetailsProps> = ({ site, onUpdate }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.DAILY);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);
  const [isFixingAll, setIsFixingAll] = useState(false);
  
  // Fix: Added toggleExpand function to manage the expanded/collapsed state of vulnerability items
  const toggleExpand = (id: string) => {
    setExpandedVuln(prev => prev === id ? null : id);
  };

  // Alert Thresholds & SLA States
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [localThresholds, setLocalThresholds] = useState<AlertThresholds>(site.thresholds || {
    latencyMs: 500,
    errorRatePercent: 1.0,
    uptimePercent: 99.0
  });
  const [localSLA, setLocalSLA] = useState<number>(site.uptimeSLA || 99.9);

  // Breach Detection
  const isLatencyBreach = site.responseTime > localThresholds.latencyMs;
  const isSLABreach = site.uptime < localSLA;

  const handleSaveThresholds = () => {
    if (onUpdate) {
      onUpdate({ thresholds: localThresholds, uptimeSLA: localSLA });
    }
    setIsEditingThresholds(false);
  };

  // Performance Grading
  const getSpeedGrade = (responseTime: number) => {
    if (responseTime < 200) return { grade: 'A+', text: 'Superior', color: 'text-green-500', border: 'border-green-500/20' };
    if (responseTime < 400) return { grade: 'A', text: 'Excellent', color: 'text-emerald-500', border: 'border-emerald-500/20' };
    if (responseTime < 600) return { grade: 'B', text: 'Good', color: 'text-blue-500', border: 'border-blue-500/20' };
    if (responseTime < 800) return { grade: 'C', text: 'Average', color: 'text-yellow-500', border: 'border-yellow-500/20' };
    return { grade: 'F', text: 'Critical Delay', color: 'text-red-500', border: 'border-red-500/20' };
  };

  const speedProfile = getSpeedGrade(site.responseTime || 200);

  // Simulated Core Web Vitals
  const coreWebVitals = useMemo(() => {
    const seed = site.responseTime || 200;
    return {
      lcp: ((seed * 1.5) / 1000).toFixed(2), 
      fid: (seed * 0.1).toFixed(0),
      cls: (Math.random() * 0.1).toFixed(3),
      speedIndex: ((seed * 1.8) / 1000).toFixed(2),
    };
  }, [site.responseTime]);

  // Load Time Breakdown Simulation
  const loadBreakdown = useMemo(() => {
    const total = site.responseTime || 200;
    return [
      { name: 'DNS Lookup', value: Math.floor(total * 0.05), color: 'bg-indigo-400' },
      { name: 'TCP Connect', value: Math.floor(total * 0.1), color: 'bg-indigo-500' },
      { name: 'SSL Handshake', value: Math.floor(total * 0.15), color: 'bg-indigo-600' },
      { name: 'Server Response', value: Math.floor(total * 0.4), color: 'bg-indigo-700' },
      { name: 'Content Download', value: Math.floor(total * 0.3), color: 'bg-indigo-800' },
    ];
  }, [site.responseTime]);

  // Global Edge Speed Simulation
  const regionalSpeeds = useMemo(() => {
    const base = site.responseTime || 200;
    return [
      { city: 'London', region: 'UK', speed: Math.floor(base * (0.8 + Math.random() * 0.4)) },
      { city: 'New York', region: 'USA', speed: Math.floor(base * (1.1 + Math.random() * 0.3)) },
      { city: 'Tokyo', region: 'JP', speed: Math.floor(base * (1.5 + Math.random() * 0.5)) },
      { city: 'Singapore', region: 'SG', speed: Math.floor(base * (1.4 + Math.random() * 0.4)) },
      { city: 'Sydney', region: 'AU', speed: Math.floor(base * (1.8 + Math.random() * 0.6)) },
      { city: 'Frankfurt', region: 'DE', speed: Math.floor(base * (0.9 + Math.random() * 0.2)) },
    ];
  }, [site.responseTime]);

  const chartData = useMemo(() => {
    let points = 24;
    let labelPrefix = 'Point';
    if (timeRange === TimeRange.DAILY) { points = 24; labelPrefix = 'Hour'; }
    else if (timeRange === TimeRange.WEEKLY) { points = 7; labelPrefix = 'Day'; }
    else if (timeRange === TimeRange.MONTHLY) { points = 30; labelPrefix = 'Day'; }
    else if (timeRange === TimeRange.YEARLY) { points = 12; labelPrefix = 'Month'; }

    return Array.from({ length: points }, (_, i) => {
      const uptimeBase = site.status === 'warning' ? 97 : 99.8;
      const uptime = Math.min(100, uptimeBase + (Math.random() * 0.5) - 0.2);
      const baseLatency = site.status === 'warning' ? 600 : 150;
      const avgLatency = Math.floor(Math.random() * 200) + baseLatency;
      const peakLatency = Math.floor(avgLatency * (1.2 + Math.random() * 0.5));
      return {
        date: `${labelPrefix} ${i + 1}`,
        visitors: Math.floor(Math.random() * 500) + 200,
        loadTime: avgLatency,
        peakLatency: peakLatency,
        uptime: parseFloat(uptime.toFixed(2))
      };
    });
  }, [timeRange, site.id, site.status]);

  const runAnalysis = async () => {
    setLoadingAnalysis(true);
    setAnalysis(null);
    setVulnerabilities([]);
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
    setTimeout(() => {
      setVulnerabilities(prev => prev.map(v => 
        v.id === id ? { ...v, status: 'patched', fixedAt: new Date().toISOString() } : v
      ));
    }, 3000);
  };

  const handleFixAll = async () => {
    setIsFixingAll(true);
    const unfixed = vulnerabilities.filter(v => v.status === 'detected');
    for (const vuln of unfixed) {
      setVulnerabilities(prev => prev.map(v => v.id === vuln.id ? { ...v, status: 'fixing' } : v));
      await new Promise(r => setTimeout(r, 1200));
      setVulnerabilities(prev => prev.map(v => v.id === vuln.id ? { ...v, status: 'patched', fixedAt: new Date().toISOString() } : v));
    }
    setIsFixingAll(false);
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return { 
          text: 'text-red-500', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/50', 
          darkBorder: 'border-red-600', 
          cardBg: 'bg-red-950/20',
          accent: 'bg-red-500',
          label: 'CRITICAL THREAT',
          shadow: 'shadow-red-900/10'
        };
      case 'high':
        return { 
          text: 'text-orange-500', 
          bg: 'bg-orange-500/10', 
          border: 'border-orange-500/50', 
          darkBorder: 'border-orange-600', 
          cardBg: 'bg-orange-950/20',
          accent: 'bg-orange-500',
          label: 'HIGH RISK',
          shadow: 'shadow-orange-900/10'
        };
      case 'medium':
        return { 
          text: 'text-yellow-500', 
          bg: 'bg-yellow-500/10', 
          border: 'border-yellow-500/50', 
          darkBorder: 'border-yellow-600', 
          cardBg: 'bg-yellow-950/10',
          accent: 'bg-yellow-500',
          label: 'MEDIUM RISK',
          shadow: 'shadow-yellow-900/10'
        };
      case 'low':
      default:
        return { 
          text: 'text-blue-500', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/50', 
          darkBorder: 'border-blue-600', 
          cardBg: 'bg-blue-950/10',
          accent: 'bg-blue-500',
          label: 'LOW RISK',
          shadow: 'shadow-blue-900/10'
        };
    }
  };

  const unfixedCount = vulnerabilities.filter(v => v.status === 'detected').length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 site-details-container">
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
          </a>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Export Audit
          </button>
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {Object.values(TimeRange).map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEURAL SPEED PERFORMANCE HUB */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
             </div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Neural Speed Performance</h3>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Status:</span>
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${speedProfile.color} bg-white border ${speedProfile.border}`}>
               {speedProfile.text}
             </span>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-12">
           {/* Speed Grade Card */}
           <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl text-white shadow-xl">
             <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Integrity Grade</p>
             <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md">
                   <span className="text-6xl font-black italic">{speedProfile.grade}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-slate-900 px-4 py-1 rounded-full text-[10px] font-black shadow-lg">TOP 5%</div>
             </div>
             <p className="mt-8 text-sm font-bold text-indigo-100 text-center leading-snug">Site outperforms 95% of monitored assets in your region.</p>
           </div>

           {/* Metrics Grid */}
           <div className="lg:col-span-3 space-y-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { label: 'LCP', val: `${coreWebVitals.lcp}s`, sub: 'Excellent', color: 'text-green-500' },
                   { label: 'FID', val: `${coreWebVitals.fid}ms`, sub: 'Responsive', color: 'text-green-500' },
                   { label: 'CLS', val: coreWebVitals.cls, sub: 'Stable', color: 'text-green-500' },
                   { label: 'Total Load', val: `${site.responseTime}ms`, sub: 'Global Check', color: 'text-indigo-500' },
                 ].map((m, i) => (
                   <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:shadow-md transition-all">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{m.label}</p>
                      <p className="text-2xl font-black text-slate-800">{m.val}</p>
                      <p className={`text-[9px] font-bold ${m.color} uppercase mt-1`}>{m.sub}</p>
                   </div>
                 ))}
              </div>

              {/* Waterfall/Breakdown */}
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Stage Waterfall</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total TTL: {site.responseTime}ms</p>
                 </div>
                 <div className="flex h-5 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner p-1">
                    {loadBreakdown.map((s, i) => (
                      <div key={i} className={`${s.color} h-full transition-all duration-1000 first:rounded-l-full last:rounded-r-full hover:brightness-110 cursor-help`} style={{ width: `${(s.value / site.responseTime) * 100}%` }} title={`${s.name}: ${s.value}ms`}></div>
                    ))}
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                    {loadBreakdown.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                         <div className={`w-2.5 h-2.5 rounded-full ${s.color}`}></div>
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{s.name}</span>
                         <span className="text-[9px] font-mono text-slate-400 ml-auto">{s.value}ms</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Global Edge Speed Benchmarks */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Global Edge Benchmarks</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Pulse Check</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regionalSpeeds.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xl filter drop-shadow-sm">{r.region === 'UK' ? '🇬🇧' : r.region === 'USA' ? '🇺🇸' : r.region === 'JP' ? '🇯🇵' : r.region === 'SG' ? '🇸🇬' : r.region === 'AU' ? '🇦🇺' : '🇩🇪'}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{r.city}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase">{r.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${r.speed < 300 ? 'text-green-600' : r.speed < 600 ? 'text-indigo-600' : 'text-amber-600'}`}>{r.speed}ms</p>
                  <div className="w-24 h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${r.speed < 300 ? 'bg-green-500' : r.speed < 600 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (r.speed / 1000) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Neural Optimization</h3>
          </div>
          <div className="flex-1 space-y-4">
            {[
              { id: '01', title: 'Brotli Compression', sub: 'Reduce payload by ~20% over Gzip.', color: 'text-green-400', bg: 'bg-green-500/10' },
              { id: '02', title: 'Critical CSS Extraction', sub: 'Eliminate render-blocking delays.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { id: '03', title: 'WebP Asset Pipeline', sub: 'Save ~3.2MB per mobile session.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(o => (
              <div key={o.id} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all cursor-default group">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-7 h-7 ${o.bg} ${o.color} rounded-lg flex items-center justify-center text-[10px] font-black border border-white/5`}>{o.id}</div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{o.title}</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{o.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VULNERABILITY AUDIT (COLOR-CODED) */}
      <div className="page-break bg-slate-950 text-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800/50">
        <div className="p-8 border-b border-slate-800/50 bg-gradient-to-br from-slate-950 to-indigo-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Neural Vulnerability Shield</h3>
              <p className="text-slate-400 text-sm italic font-medium">Real-time perimeter surveillance & autonomous correction.</p>
            </div>
          </div>
          <div className="flex gap-3 no-print">
            {!loadingAnalysis && (
              <button onClick={runAnalysis} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 active:scale-95 shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {analysis ? 'Rescan Property' : 'Initiate Scan'}
              </button>
            )}
            {analysis && unfixedCount > 0 && (
              <button onClick={handleFixAll} disabled={isFixingAll} className={`px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg ${isFixingAll ? 'opacity-50 cursor-wait' : ''}`}>
                {isFixingAll ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                Correct All Threats ({unfixedCount})
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {loadingAnalysis ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 bg-indigo-500/20 rounded-full animate-pulse"></div></div>
              </div>
              <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Deep Intelligence Perimeter Scan In Progress...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{ l: 'Architecture Strengths', c: 'text-green-500', b: 'border-green-500/20', data: analysis.strengths }, { l: 'Structural Weaknesses', c: 'text-amber-500', b: 'border-amber-500/20', data: analysis.weaknesses }, { l: 'Security Perimeter', c: 'text-red-500', b: 'border-red-500/20', data: analysis.securityConcerns }].map((col, i) => (
                  <div key={i} className="space-y-4">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${col.c}`}>{col.l}</h4>
                    <div className="space-y-2">
                      {col.data.map((s, idx) => <div key={idx} className={`bg-slate-900/60 p-3.5 rounded-2xl border ${col.b} text-xs text-slate-300 font-medium leading-relaxed`}>{s}</div>)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-1 border-b border-slate-800 pb-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Audit Vulnerability Map</h4>
                  <div className="flex items-center gap-5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {['Critical', 'High', 'Medium', 'Low'].map(s => (
                      <div key={s} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full bg-${s === 'Critical' ? 'red' : s === 'High' ? 'orange' : s === 'Medium' ? 'yellow' : 'blue'}-500 shadow-lg`}></div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {vulnerabilities.map((v) => {
                    const isExpanded = expandedVuln === v.id;
                    const sc = getSeverityConfig(v.severity);
                    const isPatched = v.status === 'patched';
                    
                    return (
                      <div key={v.id} className={`group relative border-l-[6px] transition-all duration-300 rounded-2xl overflow-hidden ${isPatched ? 'border-green-500 bg-green-950/10' : `${sc.darkBorder.replace('border', 'border-l')} ${sc.cardBg} ${sc.shadow} border-slate-800 border`}`}>
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex items-start gap-5 flex-1">
                              <div className={`p-3 rounded-xl shrink-0 border shadow-inner transition-colors duration-500 ${isPatched ? 'bg-green-500 text-white' : `${sc.bg} ${sc.text} ${sc.border}`}`}>
                                {isPatched ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg> : v.status === 'fixing' ? <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h5 className="text-sm font-black text-white">{v.title}</h5>
                                  {!isPatched && <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${sc.border} ${sc.text} bg-black/40`}>{sc.label}</span>}
                                  {isPatched && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-green-500 text-slate-950">System Restored</span>}
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">{v.description}</p>
                                
                                {isExpanded && (
                                  <div className="mt-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                                    <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50 shadow-inner">
                                      <h6 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        Remediation Timeline
                                      </h6>
                                      <div className="relative ml-2 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                                        <div className="relative pl-12">
                                          <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-4 border-slate-950 z-10 flex items-center justify-center ${sc.accent} text-white`}><svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg></div>
                                          <div>
                                            <p className="text-sm font-bold text-slate-200">Incident Detected</p>
                                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(v.detectedAt).toLocaleString()}</p>
                                            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed italic">Neural pattern analysis identified unauthorized perimeter traversal attempt.</p>
                                          </div>
                                        </div>
                                        {v.status !== 'detected' && (
                                          <div className="relative pl-12">
                                            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-indigo-600 rounded-full border-4 border-slate-950 z-10 flex items-center justify-center text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
                                            <div>
                                              <p className="text-sm font-bold text-indigo-400">Correction Logic Initialized</p>
                                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Execution Active...</p>
                                              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed italic">Global patch deployment started. Edge node verification in progress.</p>
                                            </div>
                                          </div>
                                        )}
                                        {isPatched && (
                                          <div className="relative pl-12">
                                            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-green-500 rounded-full border-4 border-slate-950 z-10 flex items-center justify-center text-slate-950"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg></div>
                                            <div>
                                              <p className="text-sm font-bold text-green-500">Integrity Verified</p>
                                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{v.fixedAt ? new Date(v.fixedAt).toLocaleString() : 'Just now'}</p>
                                              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed italic">Threat neutralized. Perimeter logs indicate restored property integrity.</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Remediation Blueprint</h6>
                                      <div className="grid grid-cols-1 gap-3">
                                        {v.detailedSteps.map((step, sIdx) => (
                                          <div key={sIdx} className="flex gap-4 text-xs text-slate-300 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all group/step">
                                            <span className="font-black text-indigo-500 shrink-0 select-none">STEP {sIdx + 1}</span>
                                            <span className="leading-relaxed font-medium">{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="no-print flex flex-col items-end gap-3 min-w-[150px]">
                              {!isPatched ? (
                                <button onClick={() => handleFixVulnerability(v.id)} className={`w-full px-5 py-3.5 ${v.severity === 'critical' ? 'bg-red-600 hover:bg-red-700 shadow-red-900/30' : v.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/30'} text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95 text-white`}>Apply Corrective Fix</button>
                              ) : (
                                <div className="w-full px-5 py-3.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-green-500/30 flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Restored</div>
                              )}
                              <button onClick={() => toggleExpand(v.id)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 p-1">{isExpanded ? 'Hide Blueprint' : 'Inspect Details'}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-800">
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Cyber-Pattern Detection</h4>
                  <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
                    <p className="text-sm text-indigo-100 italic leading-relaxed font-medium">"{analysis.cyberCrimeDetection}"</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Strategic Roadmap</h4>
                  <div className="space-y-3">
                    {analysis.recommendations.map((r, i) => (
                      <div key={i} className="flex gap-4 text-xs text-slate-300 bg-slate-900/30 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                        <span className="text-indigo-500 font-black">{i+1}.</span>
                        <span className="font-medium leading-relaxed">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 border-2 border-slate-800 shadow-2xl"><svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2 text-slate-500">Shield Offline</p>
              <p className="text-sm text-slate-600 max-w-sm mx-auto font-medium">Initiate a property intelligence audit to activate autonomous perimeter protection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
