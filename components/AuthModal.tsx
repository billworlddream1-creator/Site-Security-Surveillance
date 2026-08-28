import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { Language, translations } from '../translations';

interface AuthModalProps {
  onLogin: () => void;
  onResetPassword: (newPassword: string) => void;
  adminEmail: string;
  adminPassword: string;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

type AuthView = 'login' | 'signup' | 'forgot';
type RecoveryStep = 'email' | 'otp' | 'new-password' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({
  onLogin,
  onResetPassword,
  adminEmail,
  adminPassword,
  currentLanguage = 'en',
  onLanguageChange
}) => {
  const t = translations[currentLanguage];

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
        
        {/* Header Section */}
        <div className={`p-8 text-white text-center transition-colors duration-500 relative ${view === 'forgot' ? 'bg-indigo-800' : 'bg-indigo-600'}`}>
          {onLanguageChange && (
            <div className="absolute top-4 right-4">
              <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
            </div>
          )}
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
            {view === 'forgot' ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            )}
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight">{t.loginTitle}</h2>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.emailLabel}</label>
                    <input 
                      required
                      type="email" 
                      placeholder="admin@gmtsss.io"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {recoveryStep === 'otp' && (
                  <div className="space-y-4">
                    <div className="text-center">
                       <p className="text-xs text-slate-500 font-medium leading-relaxed">Enter bypass code <span className="font-black text-indigo-600">123456</span></p>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Establish New Key</label>
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
                    {recoveryStep === 'email' ? t.resetPassword : recoveryStep === 'otp' ? 'Validate' : 'Update Credentials'}
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
                  {t.loginButton}
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.emailLabel}</label>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.passwordLabel}</label>
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
                  {t.loginButton}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
