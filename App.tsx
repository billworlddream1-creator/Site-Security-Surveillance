
import React, { useState, useEffect } from 'react';
import { Website, TimeRange, SecurityEvent } from './types';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import SiteList from './components/SiteList';
import SiteDetails from './components/SiteDetails';
import AddSiteModal from './components/AddSiteModal';
import SecurityEventsLog from './components/SecurityEventsLog';
import AuthModal from './components/AuthModal';
import ReportGenerator from './components/ReportGenerator';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([
    {
      id: '1',
      name: 'E-Commerce Store',
      url: 'https://myshop.com',
      status: 'online',
      uptime: 99.98,
      responseTime: 245,
      lastChecked: new Date().toISOString(),
      addedAt: '2023-10-01'
    },
    {
      id: '2',
      name: 'Portfolio Site',
      url: 'https://johndoe.me',
      status: 'warning',
      uptime: 98.5,
      responseTime: 850,
      lastChecked: new Date().toISOString(),
      addedAt: '2023-11-15'
    }
  ]);

  const mockSecurityEvents: SecurityEvent[] = [
    { id: 'ev1', severity: 'critical', type: 'Database Injection', siteName: 'E-Commerce Store', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), description: 'Suspicious payload detected in /api/v1/orders' },
    { id: 'ev2', severity: 'high', type: 'DDoS Cluster Detected', siteName: 'Portfolio Site', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), description: 'Sudden spike of 50k requests from 3 regions' },
    { id: 'ev3', severity: 'medium', type: 'Brute Force Attempt', siteName: 'E-Commerce Store', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), description: 'Multiple failed login attempts on admin panel' },
    { id: 'ev4', severity: 'low', type: 'Outdated Library', siteName: 'Portfolio Site', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), description: 'Lodash 4.17.15 has known vulnerabilities' },
  ];

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'security' | 'reports'>('dashboard');

  const handleAddWebsite = (newSite: Website) => {
    setWebsites(prev => [newSite, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleRemoveWebsite = (id: string) => {
    setWebsites(prev => prev.filter(s => s.id !== id));
    if (selectedSiteId === id) setSelectedSiteId(null);
  };

  const selectedSite = websites.find(s => s.id === selectedSiteId);

  useEffect(() => {
    const session = localStorage.getItem('sentinel_session');
    if (session) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('sentinel_session', 'true');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        onAddSite={() => {
          setIsAddModalOpen(true);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 flex flex-col w-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Site Security</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
          </button>
        </div>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8 flex-1">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 no-print">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                {activeTab === 'dashboard' ? 'Security Dashboard' : 
                 activeTab === 'security' ? 'Threat Surveillance' : 'Intelligence Reports'}
              </h1>
              <p className="text-sm md:text-base text-slate-500">Real-time monitoring across {websites.length} properties</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Monitor Site
              </button>
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <div className="no-print space-y-8">
              {!selectedSiteId ? (
                <>
                  <StatsOverview websites={websites} />
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                      Web Properties
                    </h2>
                    <SiteList 
                      websites={websites} 
                      onSelectSite={setSelectedSiteId}
                      onRemoveSite={handleRemoveWebsite}
                    />
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <button 
                    onClick={() => setSelectedSiteId(null)}
                    className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Overview
                  </button>
                  {selectedSite && <SiteDetails site={selectedSite} />}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 no-print">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Threats</p>
                  <p className="text-3xl font-bold text-slate-800">4</p>
                  <div className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                    12% from yesterday
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">DDoS Mitigation</p>
                  <p className="text-3xl font-bold text-green-600">Active</p>
                  <p className="mt-2 text-xs text-slate-400">All edge nodes functioning</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Firewall Efficiency</p>
                  <p className="text-3xl font-bold text-slate-800">99.8%</p>
                  <p className="mt-2 text-xs text-slate-400">0.02% false positive rate</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cyber Crime Risk</p>
                  <p className="text-3xl font-bold text-amber-500">Moderate</p>
                  <p className="mt-2 text-xs text-slate-400">Industry baseline +2%</p>
                </div>
              </div>
              
              <SecurityEventsLog events={mockSecurityEvents} />
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportGenerator websites={websites} />
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <AddSiteModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddWebsite} 
        />
      )}
    </div>
  );
};

export default App;