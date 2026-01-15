
import React, { useState } from 'react';
import { Website, UserProfile } from '../types';

interface AdminPortalProps {
  websites: Website[];
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onRemoveSite: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ websites, user, onUpdateUser, onRemoveSite }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [localAddress, setLocalAddress] = useState(user.address);

  const handleSaveAddress = () => {
    onUpdateUser({ address: localAddress });
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Account Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800">User Management</h2>
          </div>
          <button 
            onClick={() => isEditingProfile ? handleSaveAddress() : setIsEditingProfile(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase"
          >
            {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Account Holder</label>
              <p className="font-bold text-slate-800">{user.name}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
              <p className="font-bold text-slate-800">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Account Address</label>
              {isEditingProfile ? (
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={3}
                  value={localAddress}
                  onChange={(e) => setLocalAddress(e.target.value)}
                />
              ) : (
                <p className="font-bold text-slate-800">{user.address}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Site Inventory */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Monitored Inventory</h2>
          </div>
          <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {websites.length} Assets
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Site Name</th>
                <th className="px-6 py-4">Endpoint</th>
                <th className="px-6 py-4 text-center">Health</th>
                <th className="px-6 py-4 text-center">Added</th>
                <th className="px-6 py-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {websites.map(site => (
                <tr key={site.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-700">{site.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600">{site.url}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      site.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-400 font-medium">{site.addedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onRemoveSite(site.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {websites.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 text-sm italic">No assets registered in the central inventory.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPortal;
