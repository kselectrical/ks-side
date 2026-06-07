import React, { useState } from 'react';
import { X, Lock, User, Sparkles, Loader } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { adminCredentials } from '../data';
import { auth, googleProvider, isFirebaseConfigured, isAdminEmail } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  
  // Customer State
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Admin State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');

    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        if (user) {
          const email = user.email || '';
          const name = user.displayName || 'Google User';
          const photoUrl = user.photoURL || '/profile.png';
          
          // Check admin status dynamically in admins collection
          const isAdmin = await isAdminEmail(email);
          const role = isAdmin ? 'admin' : 'customer';
          
          onLoginSuccess(role, { name, email, photoUrl });
          onClose();
        }
      } catch (e: any) {
        console.error("Firebase Sign-In failed:", e);
        setError(e.message || "Google Authentication failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      // Simulate Google Authentication verification (Local Fallback)
      setTimeout(() => {
        setIsGoogleLoading(false);
        onLoginSuccess('customer', {
          name: 'A (Customer)',
          email: 'customer@gmail.com',
          photoUrl: '/profile.png'
        });
        onClose();
      }, 1000);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminUser.trim() === adminCredentials.username &&
      adminPass === adminCredentials.password
    ) {
      setError('');
      onLoginSuccess('admin');
      onClose();
      // Reset fields
      setAdminUser('');
      setAdminPass('');
    } else {
      setError('Invalid admin username or password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      {/* Backdrop Click Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative z-10 shadow-dropdown font-sans text-center border border-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-50 transition-all cursor-pointer select-none"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div className="mb-6 mt-2">
          <div className="w-11 h-11 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-sm mb-2">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <h2 className="text-gray-900 font-black text-lg tracking-tight">KS Portal Access</h2>
          <p className="text-[10px] text-gray-450 font-bold uppercase tracking-wider mt-0.5">Secure authentication gate</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-gray-50 p-1 rounded-lg mb-6 border border-gray-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('customer');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-gray-550 hover:text-gray-800'
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-gray-550 hover:text-gray-800'
            }`}
          >
            Admin Panel
          </button>
        </div>

        {/* Login Tabs View */}
        <div className="min-h-[190px] flex flex-col justify-between">
          {activeTab === 'customer' ? (
            /* Customer View: Google Sign In */
            <div className="space-y-5 py-2">
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-gray-900 text-sm leading-snug">
                  Sign in with Google Account
                </h3>
                <p className="text-[11px] text-gray-450 font-semibold leading-normal max-w-xs mx-auto">
                  Log in to access automated WhatsApp notifications, custom invoice rates, and order history.
                </p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-gray-50 border border-gray-250 hover:border-gray-350 shadow-sm rounded-lg py-2.5 px-4 text-xs font-bold text-gray-700 transition-all select-none cursor-pointer active:scale-98"
              >
                {isGoogleLoading ? (
                  <Loader size={16} className="text-brand-blue animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15.01 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.31 7.55 8.94 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.43 3.58l3.77 2.92c2.2-2.03 3.69-5.01 3.69-8.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.96 0 13.2s.54 4.38 1.5 6.3l3.86-3z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.77-2.92c-1.11.75-2.53 1.19-4.19 1.19-3.06 0-5.69-2.51-6.64-5.46L1.5 15.9C3.4 19.75 7.35 23 12 23z"
                    />
                  </svg>
                )}
                <span>{isGoogleLoading ? 'Verifying Google Account...' : 'Continue with Google'}</span>
              </button>

              <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                By signing in, you agree to receive automated reservation summaries via WhatsApp link.
              </p>
            </div>
          ) : (
            /* Admin View: Username & Password */
            <form onSubmit={handleAdminSubmit} className="space-y-4 py-1">
              
              <div className="space-y-3.5 text-left">
                {/* Username */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Username</label>
                  <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
                    <div className="border-r border-gray-200 px-2.5 py-2 text-gray-400 flex items-center bg-gray-50">
                      <User size={13} />
                    </div>
                    <input
                      type="text"
                      required
                      value={adminUser}
                      onChange={(e) => {
                        setAdminUser(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter admin username"
                      className="flex-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-2 focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Password</label>
                  <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
                    <div className="border-r border-gray-200 px-2.5 py-2 text-gray-400 flex items-center bg-gray-50">
                      <Lock size={13} />
                    </div>
                    <input
                      type="password"
                      required
                      value={adminPass}
                      onChange={(e) => {
                        setAdminPass(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter admin password"
                      className="flex-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-2 focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-[10px] text-red-500 font-extrabold text-center animate-shake">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer select-none active:scale-98"
              >
                Log In as Admin
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
