
import React, { useState } from 'react';

interface AuthModalProps {
  onLogin: () => void;
  onResetPassword: (newPassword: string) => void;
  adminEmail: string;
  adminPassword: string;
}

type AuthView = 'login' | 'signup' | 'forgot';
type RecoveryStep = 'email' | 'otp' | 'new-password' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onResetPassword, adminEmail, adminPassword }) => {
  const [view, setView] = useState<AuthView>('login');
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('email');
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Use current admin credentials (which might have been reset)
      const storedUser = localStorage.getItem('sentinel_user');
      const currentAdmin = storedUser ? JSON.parse(storedUser) : { email: adminEmail, password: adminPassword };

      if (email.toLowerCase() === currentAdmin.email.toLowerCase() && password === currentAdmin.password) {
        onLogin();
      } else {
        setError('Unauthorized access: Credentials do not match our global database.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (recoveryStep === 'email') {
        const storedUser = localStorage.getItem('sentinel_user');
        const currentAdmin = storedUser ? JSON.parse(storedUser) : { email: adminEmail };

        if (email.toLowerCase() === currentAdmin.email.toLowerCase()) {
          setRecoveryStep('otp');
        } else {
          setError('Entity not found: This identity is not registered in GMT SSS.');
        }
      } else if (recoveryStep === 'otp') {
        if (otp === '123456') { // Simulated global reset token
          setRecoveryStep('new-password');
        } else {
          setError('Invalid Token: Neural key verification failed.');
        }
      } else if (recoveryStep === 'new-password') {
        if (newPassword.length < 8) {
          setError('Insecure: Neural keys must be at least 8 characters long.');
        } else {
          onResetPassword(newPassword);
          setRecoveryStep('success');
          setSuccessMsg('Neural Key Re-established. Access restored.');
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1200);
  };

  const resetRecovery = () => {
    setRecoveryStep('email');
    setView('login');
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
        
        {/* Header Section */}
        <div className={`p-8 text-white text-center transition-colors duration-500 ${view === 'forgot' ? 'bg-indigo-800' : 'bg-indigo-600'}`}>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
            {view === 'forgot' ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            )}
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">GMT SSS Central Access</h2>
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
            {view === 'forgot' ? 'Neural Key Recovery System' : 'Strategic AI Site Surveillance'}
          </p>
        </div>

        <div className="p-8">
          {view === 'forgot' ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={resetRecovery} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </button>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  {recoveryStep === 'email' ? 'Identification' : recoveryStep === 'otp' ? 'Verification' : recoveryStep === 'new-password' ? 'Key Reset' : 'Restored'}
                </h3>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-in fade-in">{error}</div>}
              {successMsg && <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-xl animate-in fade-in">{successMsg}</div>}

              <form onSubmit={handleForgotSubmit} className="space-y-5">
                {recoveryStep === 'email' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Entity Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="admin@gmtsss.io"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 px-1">Identity validation required to trigger reset sequence.</p>
                  </div>
                )}

                {recoveryStep === 'otp' && (
                  <div className="space-y-4">
                    <div className="text-center">
                       <p className="text-xs text-slate-500 font-medium leading-relaxed">A temporary neural reset token has been simulated for your identity. <br/>Enter the bypass code <span className="font-black text-indigo-600">123456</span> to continue.</p>
                    </div>
                    <input 
                      required
                      maxLength={6}
                      type="text" 
                      placeholder="000000"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}

                {recoveryStep === 'new-password' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Establish New Secure Key</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                )}

                {recoveryStep !== 'success' && (
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    {recoveryStep === 'email' ? 'Trigger Reset Sequence' : recoveryStep === 'otp' ? 'Validate Token' : 'Update Credentials'}
                  </button>
                )}

                {recoveryStep === 'success' && (
                  <button 
                    type="button"
                    onClick={resetRecovery}
                    className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-800 shadow-xl transition-all active:scale-[0.98]"
                  >
                    Return to Hub Login
                  </button>
                )}
              </form>
            </div>
          ) : (
            <>
              <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] mb-8">
                <button 
                  onClick={() => setView('login')}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Authorized Entry
                </button>
                <button 
                  onClick={() => setView('signup')}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  New Identity
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-in fade-in">{error}</div>}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Entity Identifier</label>
                  <input 
                    required
                    type="email" 
                    placeholder="admin@gmtsss.io"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
                    <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input 
                      required
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••••••"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  Initialize Secure Session
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]"><span className="bg-white px-3 text-slate-400">Alternative Bypass</span></div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-700 active:scale-[0.98] group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Neural Identity Provider
                </button>
              </form>
            </>
          )}
          
          <p className="mt-8 text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
            Strategic assets are protected by GMT Neural Encryption. <br/>
            Unauthorized access attempts are logged and prosecuted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
