
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
  const [localUser, setLocalUser] = useState<Partial<UserProfile>>({
    email: user.email,
    password: user.password,
    name: user.name,
    address: user.address
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveProfile = () => {
    onUpdateUser(localUser);
    setIsEditingProfile(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalUser(prev => ({ ...prev, [name]: value }));
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
            <h2 className="text-lg font-bold text-slate-800">Credential Management</h2>
          </div>
          <button 
            onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${isEditingProfile ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-600 hover:bg-indigo-50'}`}
          >
            {isEditingProfile ? 'Commit Changes' : 'Update Credentials'}
          </button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Identity Name</label>
                {isEditingProfile ? (
                  <input 
                    name="name"
                    type="text"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={localUser.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="font-bold text-slate-800 p-1">{user.name}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Surveillance Work Email</label>
                {isEditingProfile ? (
                  <input 
                    name="email"
                    type="email"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={localUser.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="font-bold text-slate-800 p-1">{user.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Secure Password</label>
                {isEditingProfile ? (
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={localUser.password}
                      onChange={handleChange}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="font-bold text-slate-800 p-1">••••••••••••</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Operational Physical Address</label>
                {isEditingProfile ? (
                  <textarea 
                    name="address"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    rows={2}
                    value={localUser.address}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="font-bold text-slate-800 p-1">{user.address}</p>
                )}
              </div>
            </div>
          </div>
          
          {isEditingProfile && (
            <div className="mt-8 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex-1 h-px bg-slate-100"></div>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase"
              >
                Discard Changes
              </button>
            </div>
          )}
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
