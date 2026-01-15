
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

  // Generate dynamic performance data for the chart based on TimeRange
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
      
      // Generate latency with some variance
      const baseLatency = site.status === 'warning' ? 600 : 150;
      const avgLatency = Math.floor(Math.random() * 200) + baseLatency;
      const peakLatency = Math.floor(avgLatency * (1.2 + Math.random() * 0.5));

      return {
        date: `${labelPrefix} ${i + 1}`,
        visitors: Math.floor(Math.random() * 500) + 200,
        loadTime: avgLatency,
        peakLatency: peakLatency,
        errorRate: Math.random() * 1.5,
        conversions: Math.floor(Math.random() * 50) + 10,
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

    // Simulate multi-step patch deployment with visual timeline updates
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
      setVulnerabilities(prev => prev.map(v => 
        v.id === vuln.id ? { ...v, status: 'fixing' } : v
      ));
      await new Promise(r => setTimeout(r, 1200));
      setVulnerabilities(prev => prev.map(v => 
        v.id === vuln.id ? { ...v, status: 'patched', fixedAt: new Date().toISOString() } : v
      ));
    }
    setIsFixingAll(false);
  };

  useEffect(() => {
    setAnalysis(null);
    setVulnerabilities([]);
    setExpandedVuln(null);
  }, [site.id]);

  const toggleExpand = (id: string) => {
    setExpandedVuln(expandedVuln === id ? null : id);
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', darkBorder: 'border-red-500', label: 'CRITICAL THREAT' };
      case 'high':
        return { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', darkBorder: 'border-orange-500', label: 'HIGH RISK' };
      case 'medium':
        return { text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', darkBorder: 'border-yellow-500', label: 'MEDIUM RISK' };
      case 'low':
      default:
        return { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', darkBorder: 'border-blue-500', label: 'LOW RISK' };
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
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Export Audit
          </button>
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
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

      {/* Surveillance Controls */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Surveillance Controls</h3>
              <p className="text-xs text-slate-500 font-medium">Configure alert triggers and service level agreements.</p>
            </div>
          </div>
          <button 
            onClick={() => isEditingThresholds ? handleSaveThresholds() : setIsEditingThresholds(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isEditingThresholds ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isEditingThresholds ? 'Save Config' : 'Modify Limits'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-5 rounded-2xl border transition-all ${isSLABreach ? 'border-red-200 bg-red-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Uptime SLA Target</p>
            {isEditingThresholds ? (
              <div className="flex items-center gap-2">
                <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold outline-none" value={localSLA} onChange={(e) => setLocalSLA(parseFloat(e.target.value))}/>
                <span className="text-sm font-bold text-slate-400">%</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black text-slate-800">{localSLA}%</p>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${isSLABreach ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {isSLABreach ? 'Breached' : 'Passing'}
                </span>
              </div>
            )}
            <div className="mt-3 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isSLABreach ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${site.uptime}%` }}></div></div>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isLatencyBreach ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Latency Warning</p>
            {isEditingThresholds ? (
              <div className="flex items-center gap-2">
                <input type="number" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold outline-none" value={localThresholds.latencyMs} onChange={(e) => setLocalThresholds({...localThresholds, latencyMs: parseInt(e.target.value)})}/>
                <span className="text-sm font-bold text-slate-400">ms</span>
              </div>
            ) : (
              <p className="text-2xl font-black text-slate-800">{localThresholds.latencyMs}ms</p>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Error Alert Trigger</p>
            {isEditingThresholds ? (
              <div className="flex items-center gap-2">
                <input type="number" step="0.1" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold outline-none" value={localThresholds.errorRatePercent} onChange={(e) => setLocalThresholds({...localThresholds, errorRatePercent: parseFloat(e.target.value)})}/>
                <span className="text-sm font-bold text-slate-400">%</span>
              </div>
            ) : (
              <p className="text-2xl font-black text-slate-800">{localThresholds.errorRatePercent}%</p>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Critical Uptime Alert</p>
            {isEditingThresholds ? (
              <div className="flex items-center gap-2">
                <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold outline-none" value={localThresholds.uptimePercent} onChange={(e) => setLocalThresholds({...localThresholds, uptimePercent: parseFloat(e.target.value)})}/>
                <span className="text-sm font-bold text-slate-400">%</span>
              </div>
            ) : (
              <p className="text-2xl font-black text-slate-800">{localThresholds.uptimePercent}%</p>
            )}
          </div>
        </div>
      </section>

      {/* Historical Trends */}
      <section className="space-y-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
          Historical Performance & Uptime Trends
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Visitor Traffic</h3>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Traffic Load</span></div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Historical Uptime Trend</h3>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Integrity</span></div>
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

        {/* Latency Performance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Latency Performance</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Latency</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peak Latency</span>
               </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="ms" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="loadTime" stroke="#6366f1" strokeWidth={3} dot={false} name="Avg Latency" />
                <Line type="monotone" dataKey="peakLatency" stroke="#ec4899" strokeWidth={3} dot={false} strokeDasharray="5 5" name="Peak Latency" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* NEURAL VULNERABILITY SHIELD */}
      <div className="page-break bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="p-8 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl no-print shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Neural Vulnerability Shield</h3>
              <p className="text-slate-400 text-sm italic">AI-driven breach detection and autonomous correction.</p>
            </div>
          </div>
          <div className="flex gap-3 no-print">
            {!loadingAnalysis && (
              <button 
                onClick={runAnalysis}
                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {analysis ? 'Rescan Property' : 'Scan Vulnerabilities'}
              </button>
            )}
            {analysis && unfixedCount > 0 && (
              <button 
                onClick={handleFixAll}
                disabled={isFixingAll}
                className={`px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95 ${isFixingAll ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isFixingAll ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                )}
                Correct All Threats ({unfixedCount})
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {loadingAnalysis ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-indigo-500/20 rounded-full animate-pulse"></div></div>
              </div>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs animate-pulse">Neural Perimeter Scan in Progress...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">Architecture Strengths</h4>
                  <div className="space-y-2">
                    {analysis.strengths.map((s, i) => <div key={i} className="bg-slate-800/40 p-3 rounded-xl border border-green-500/20 text-xs text-slate-300">{s}</div>)}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">Detected Weaknesses</h4>
                  <div className="space-y-2">
                    {analysis.weaknesses.map((w, i) => <div key={i} className="bg-slate-800/40 p-3 rounded-xl border border-amber-500/20 text-xs text-slate-300">{w}</div>)}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">Security Concerns</h4>
                  <div className="space-y-2">
                    {analysis.securityConcerns.map((sc, i) => <div key={i} className="bg-slate-800/40 p-3 rounded-xl border border-red-500/20 text-xs text-slate-300">{sc}</div>)}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-1 mb-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest tracking-[0.2em]">Property Vulnerability Audit</h4>
                  <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Critical</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> High</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Med</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Low</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {vulnerabilities.map((v) => {
                    const isExpanded = expandedVuln === v.id;
                    const severityStyle = getSeverityConfig(v.severity);
                    
                    return (
                      <div key={v.id} className={`group bg-slate-800/40 border transition-all duration-300 rounded-2xl overflow-hidden ${
                        v.status === 'patched' ? 'border-green-500/30 bg-green-500/5' : 
                        isExpanded ? severityStyle.darkBorder + ' bg-slate-800/60' : 'border-slate-700'
                      }`}>
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-2.5 rounded-xl shrink-0 border ${
                                v.status === 'patched' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                v.status === 'fixing' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                                severityStyle.bg + ' ' + severityStyle.text + ' ' + severityStyle.border
                              }`}>
                                {v.status === 'patched' ? (
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                ) : v.status === 'fixing' ? (
                                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                ) : (
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                  <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{v.title}</span>
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${severityStyle.darkBorder} ${severityStyle.text}`}>{severityStyle.label}</span>
                                  {v.status === 'patched' && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/30">Corrected</span>}
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{v.description}</p>
                                
                                {isExpanded && (
                                  <div className="mt-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
                                    {/* Remediation Timeline Section */}
                                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50">
                                      <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        Remediation Timeline
                                      </h5>
                                      <div className="relative ml-2 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-700">
                                        {/* Stage 1: Detection */}
                                        <div className="relative pl-10">
                                          <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-4 border-slate-900 z-10 flex items-center justify-center ${severityStyle.bg.replace('/10', '')} ${severityStyle.text}`}>
                                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
                                          </div>
                                          <div>
                                            <p className="text-sm font-bold text-slate-200">Incident Detected</p>
                                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(v.detectedAt).toLocaleString()}</p>
                                            <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">Neural fingerprinting identified potential breach signature in property perimeter logs.</p>
                                          </div>
                                        </div>

                                        {/* Stage 2: Corrective Action Initiation */}
                                        {(v.status === 'fixing' || v.status === 'patched') && (
                                          <div className="relative pl-10">
                                            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-indigo-600 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center text-white">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                            </div>
                                            <div>
                                              <p className="text-sm font-bold text-indigo-400">Autonomous Remediation Initialized</p>
                                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                                {v.status === 'fixing' ? 'Process Active...' : 'Remediation Step Completed'}
                                              </p>
                                              <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">Global fix deployment started. Generating multi-layer patches for edge nodes.</p>
                                            </div>
                                          </div>
                                        )}

                                        {/* Stage 3: Patched */}
                                        {v.status === 'patched' && (
                                          <div className="relative pl-10">
                                            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-green-500 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center text-white">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
                                            </div>
                                            <div>
                                              <p className="text-sm font-bold text-green-400">Threat Neutralized</p>
                                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{v.fixedAt ? new Date(v.fixedAt).toLocaleString() : 'Just now'}</p>
                                              <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">Remediation verified. Property integrity restored and monitored for recurring patterns.</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Detailed Blueprint Steps */}
                                    <div className="space-y-4">
                                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Correction Logic Blueprint</h5>
                                      <div className="grid grid-cols-1 gap-3">
                                        {v.detailedSteps.map((step, sIdx) => (
                                          <div key={sIdx} className="flex gap-4 text-xs text-slate-300 bg-slate-800/20 p-4 rounded-xl border border-slate-700/30 hover:border-indigo-500/30 transition-all">
                                            <span className="font-bold text-indigo-500 shrink-0">{sIdx + 1}.</span>
                                            <span className="leading-relaxed">{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="no-print flex flex-col items-end gap-3 min-w-[140px]">
                              {v.status === 'detected' ? (
                                <button onClick={() => handleFixVulnerability(v.id)} className={`w-full px-5 py-3 ${v.severity === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : v.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xl active:scale-95 text-white`}>Apply Fix</button>
                              ) : v.status === 'fixing' ? (
                                <div className="w-full px-5 py-3 bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-wider rounded-xl border border-indigo-500/20 flex items-center justify-center gap-3"><div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>Fixing...</div>
                              ) : (
                                <div className="w-full px-5 py-3 bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-wider rounded-xl border border-green-500/20 flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Fixed</div>
                              )}
                              <button onClick={() => toggleExpand(v.id)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1.5 p-1">{isExpanded ? 'Hide Blueprint' : 'Inspect Timeline'}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">Cyber-Pattern Intelligence</h4>
                  <div className="bg-slate-800/20 p-6 rounded-3xl border border-slate-700/50">
                    <p className="text-sm text-indigo-100 italic leading-relaxed">"{analysis.cyberCrimeDetection}"</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">Strategic Roadmap</h4>
                  <div className="space-y-2.5">
                    {analysis.recommendations.map((r, i) => (
                      <div key={i} className="flex gap-4 text-xs text-slate-300 bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 hover:border-indigo-500/30 transition-all group">
                        <span className="text-indigo-500 font-black">{i+1}.</span>
                        <span className="leading-relaxed">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-slate-700 shadow-xl"><svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
              <p className="font-bold uppercase tracking-widest text-xs mb-2">Shield Status: Inactive</p>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">Initiate a global intelligence audit to enable real-time perimeter protection and autonomous threat correction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
