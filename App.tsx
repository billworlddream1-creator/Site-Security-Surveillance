
import React, { useState, useEffect } from 'react';
import { Website, TimeRange, SecurityEvent, UserProfile, PlanType } from './types';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import SiteList from './components/SiteList';
import SiteDetails from './components/SiteDetails';
import AddSiteModal from './components/AddSiteModal';
import SecurityEventsLog from './components/SecurityEventsLog';
import AuthModal from './components/AuthModal';
import ReportGenerator from './components/ReportGenerator';
import AdminPortal from './components/AdminPortal';
import UpgradeModal from './components/UpgradeModal';
import PaymentModal from './components/PaymentModal';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Hardcoded initial admin credentials as requested
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('sentinel_user');
    if (savedUser) return JSON.parse(savedUser);
    
    return {
      id: 'usr_admin',
      email: 'billworlddream1@gmail.com',
      password: 'Billadad!!',
      name: 'Global Admin',
      address: '123 Neural Way, Silicon Valley, CA',
      plan: 'monthly',
      walletBalance: 250.00
    };
  });

  const [websites, setWebsites] = useState<Website[]>([
    {
      id: '1',
      name: 'E-Commerce Store',
      url: 'https://myshop.com',
      status: 'online',
      uptime: 99.98,
      responseTime: 245,
      lastChecked: new Date().toISOString(),
      addedAt: '2023-10-01',
      uptimeSLA: 99.9,
      thresholds: { latencyMs: 300, errorRatePercent: 1.5, uptimePercent: 99.5 },
      tags: ['Retail', 'Production']
    },
    {
      id: '2',
      name: 'Portfolio Site',
      url: 'https://johardoe.me',
      status: 'warning',
      uptime: 98.5,
      responseTime: 850,
      lastChecked: new Date().toISOString(),
      addedAt: '2023-11-15',
      uptimeSLA: 99.95,
      thresholds: { latencyMs: 500, errorRatePercent: 2.0, uptimePercent: 99.0 },
      tags: ['Personal', 'Staging']
    }
  ]);

  const mockSecurityEvents: SecurityEvent[] = [
    { id: 'ev1', severity: 'critical', type: 'Database Injection', siteName: 'E-Commerce Store', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), description: 'Suspicious payload detected in /api/v1/orders' },
    { id: 'ev2', severity: 'high', type: 'DDoS Cluster Detected', siteName: 'Portfolio Site', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), description: 'Sudden spike of 50k requests from 3 regions' },
  ];

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'security' | 'reports' | 'admin'>('dashboard');
  
  const [pendingPlan, setPendingPlan] = useState<{plan: PlanType, price: number} | null>(null);

  // Persistence for user updates
  useEffect(() => {
    localStorage.setItem('sentinel_user', JSON.stringify(user));
  }, [user]);

  const handleAddWebsite = (newSite: Website) => {
    setWebsites(prev => [newSite, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateWebsite = (id: string, updates: Partial<Website>) => {
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const handleRemoveWebsite = (id: string) => {
    setWebsites(prev => prev.filter(s => s.id !== id));
    if (selectedSiteId === id) setSelectedSiteId(null);
  };

  const handleUpgradeSelect = (plan: PlanType, price: number) => {
    setPendingPlan({ plan, price });
    setIsUpgradeModalOpen(false);
  };

  const handlePaymentComplete = (plan: PlanType, price: number) => {
    setUser(prev => ({
      ...prev,
      plan,
      walletBalance: prev.walletBalance - (plan === 'free' ? 0 : price),
      subscriptionExpiry: new Date(Date.now() + (plan === 'weekly' ? 7 : plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
    }));
    setPendingPlan(null);
  };

  const handleResetPassword = (newPassword: string) => {
    setUser(prev => ({ ...prev, password: newPassword }));
  };

  const selectedSite = websites.find(s => s.id === selectedSiteId);

  useEffect(() => {
    const session = localStorage.getItem('sentinel_session');
    if (session) {
      setIsLoggedIn(true);
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('sentinel_session', 'true');
    setIsLoggedIn(true);
    setIsAdmin(true);
  };

  if (!isLoggedIn) {
    return (
      <AuthModal 
        onLogin={handleLogin} 
        adminEmail={user.email} 
        adminPassword={user.password || ''} 
        onResetPassword={handleResetPassword}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
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
        onUpgrade={() => setIsUpgradeModalOpen(true)}
        isOpen={isSidebarOpen}
        isAdmin={isAdmin}
        onClose={() => setIsSidebarOpen(false)}
        userPlan={user.plan}
      />

      <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 bg-white border-b border-slate-200 no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                {activeTab === 'dashboard' ? 'Security Dashboard' : 
                 activeTab === 'security' ? 'Threat Surveillance' : 
                 activeTab === 'admin' ? 'Admin Portal' : 'Intelligence Reports'}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Systems operational • Plan: <span className="uppercase font-bold text-indigo-600">{user.plan}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Wallet</span>
                <span className="text-sm font-bold text-slate-800">${user.walletBalance.toFixed(2)}</span>
             </div>
             <button onClick={() => setIsAddModalOpen(true)} className="hidden md:flex px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-200 items-center gap-2 font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Monitor Site
              </button>
          </div>
        </div>

        <div className="p-4 md:p-8 space-y-8 flex-1">
          {activeTab === 'dashboard' && (
            <div className="no-print space-y-8">
              {!selectedSiteId ? (
                <>
                  <StatsOverview websites={websites} />
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                      Active Properties
                    </h2>
                    <SiteList websites={websites} onSelectSite={setSelectedSiteId} onRemoveSite={handleRemoveWebsite} />
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <button onClick={() => setSelectedSiteId(null)} className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Overview
                  </button>
                  {selectedSite && <SiteDetails site={selectedSite} onUpdate={(updates) => handleUpdateWebsite(selectedSite.id, updates)} />}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Threat Level</p>
                  <p className="text-3xl font-bold text-slate-800">Nominal</p>
                  <div className="mt-2 text-xs text-green-500 font-medium">No active breaches</div>
                </div>
              </div>
              <SecurityEventsLog events={mockSecurityEvents} />
            </div>
          )}

          {activeTab === 'reports' && <ReportGenerator websites={websites} />}
          
          {activeTab === 'admin' && isAdmin && (
            <AdminPortal 
              websites={websites} 
              user={user} 
              onUpdateUser={(updates) => setUser(prev => ({ ...prev, ...updates }))}
              onRemoveSite={handleRemoveWebsite}
            />
          )}
        </div>
      </main>

      {isAddModalOpen && <AddSiteModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddWebsite} />}
      {isUpgradeModalOpen && <UpgradeModal currentPlan={user.plan} onClose={() => setIsUpgradeModalOpen(false)} onSelect={handleUpgradeSelect} />}
      {pendingPlan && <PaymentModal 
        plan={pendingPlan.plan} 
        price={pendingPlan.price} 
        walletBalance={user.walletBalance}
        websites={websites}
        onClose={() => setPendingPlan(null)} 
        onComplete={handlePaymentComplete} 
      />}
    </div>
  );
};

export default App;
