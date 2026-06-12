import React, { useState } from 'react';
import { X, Lock, User, Sparkles, Loader } from 'lucide-react';
import { adminCredentials } from '../data';
import { auth, isFirebaseConfigured } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string; phone?: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  
  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);

  // Admin State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim().length < 2) {
      setError('Please enter a valid name (at least 2 characters).');
      return;
    }
    if (customerPhone.trim().length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsCustomerLoading(true);
    setError('');

    try {
      const phone = customerPhone.trim();
      const email = `${phone}@kselectrical.in`;
      const password = phone;
      const name = customerName.trim();
      const photoUrl = '/profile.png';

      const user = {
        name,
        email,
        photoUrl,
        phone
      };

      if (isFirebaseConfigured && auth) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          const authError = err as { code?: string; message?: string };
          // If the user doesn't exist, register them
          if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/invalid-email') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
          } else {
            throw err;
          }
        }
      }

      onLoginSuccess('customer', user);
      onClose();
      
      setCustomerName('');
      setCustomerPhone('');
    } catch (err) {
      const authError = err as { message?: string };
      console.error("Customer Auth failed:", err);
      setError(authError.message || 'Login failed. Please try again.');
    } finally {
      setIsCustomerLoading(false);
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
            /* Customer View: Name & Mobile Number Login */
            <form onSubmit={handleCustomerSubmit} className="space-y-4 py-1 text-left">
              <div className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Your Name</label>
                  <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
                    <div className="border-r border-gray-200 px-2.5 py-2 text-gray-400 flex items-center bg-gray-50">
                      <User size={13} />
                    </div>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your name"
                      className="flex-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-2 focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Mobile Number</label>
                  <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
                    <div className="border-r border-gray-200 px-2.5 py-2 text-gray-400 flex items-center bg-gray-50">
                      <span className="text-xs font-bold text-gray-400">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setCustomerPhone(val);
                        if (error) setError('');
                      }}
                      placeholder="10-digit mobile number"
                      className="flex-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-2 focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-[10px] text-red-500 font-extrabold text-center animate-shake">{error}</p>}

              <button
                type="submit"
                disabled={isCustomerLoading}
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer select-none active:scale-98 flex items-center justify-center"
              >
                {isCustomerLoading ? (
                  <>
                    <Loader size={13} className="animate-spin mr-1" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Login / Register</span>
                )}
              </button>

              <p className="text-[9px] text-gray-450 font-semibold leading-normal text-center">
                Your data is fully secure. No OTP required. Same-day service activation.
              </p>
            </form>
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
