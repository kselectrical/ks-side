import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, User, Lock, AlertCircle, Loader } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { adminCredentials } from '../../data';
import { auth, googleProvider, isFirebaseConfigured, isAdminEmail } from '../../firebase';

interface LoginProps {
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  onLoginSuccess: (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ isLoggedIn, userRole, onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If already logged in as admin, redirect to catalog
  if (isLoggedIn && userRole === 'admin') {
    const from = (location.state as any)?.from?.pathname || '/admin/catalog';
    return <Navigate to={from} replace />;
  }

  // Handle standard credentials submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setError('');
      onLoginSuccess('admin', {
        name: 'Kaushindra Singh',
        email: 'kselectrical004@gmail.com',
        photoUrl: '/profile.png'
      });
      navigate('/admin/catalog');
    } else {
      setError('Invalid administrator username or password credentials.');
    }
  };

  // Handle Google OAuth and search Firestore admins collection
  const handleGoogleAdminLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        if (user) {
          const email = user.email || '';
          const name = user.displayName || 'Google Admin';
          const photoUrl = user.photoURL || '/profile.png';
          
          // Verify admin role status in 'admins' collection
          const isAdmin = await isAdminEmail(email);
          if (isAdmin) {
            onLoginSuccess('admin', { name, email, photoUrl });
            navigate('/admin/catalog');
          } else {
            // Un-authorize instantly if not registered
            await auth.signOut();
            setError('Access Denied: Your Google account email is not registered in the admins collection.');
          }
        }
      } catch (e: any) {
        console.error("Admin Google Login failed:", e);
        setError(e.message || "Google Authentication failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      setError('Firebase keys are missing in the .env file. Please authenticate using the credentials form.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans select-none text-left">
      <Helmet>
        <title>Admin Console Login | KS Electrical</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-white border border-gray-250 rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-dropdown animate-in zoom-in-95 duration-200">
        
        {/* Shield Logo */}
        <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-sm shrink-0">
          <ShieldCheck size={24} />
        </div>

        {/* Titles */}
        <div className="text-center mb-6">
          <h1 className="text-gray-900 font-black text-xl tracking-tight leading-none">
            Admin Console Login
          </h1>
          <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mt-1.5">
            Log in to manage live site configurations
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs font-semibold p-3.5 rounded-xl border border-red-150 flex items-start space-x-2 mb-5">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication (Google Sign-In) */}
        {isFirebaseConfigured && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-gray-55 border border-gray-250 hover:border-gray-350 shadow-sm rounded-xl py-2.5 px-4 text-xs font-bold text-gray-700 transition-all cursor-pointer active:scale-98"
            >
              {isGoogleLoading ? (
                <Loader size={15} className="text-brand-blue animate-spin" />
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
              <span>{isGoogleLoading ? 'Verifying Admin Email...' : 'Continue with Google'}</span>
            </button>
            
            <div className="flex items-center my-5 select-none">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase px-3.5 tracking-wider">Or credentials</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Username</label>
            <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue transition-all bg-white">
              <div className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-gray-400 flex items-center shrink-0">
                <User size={14} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Password</label>
            <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue transition-all bg-white">
              <div className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-gray-400 flex items-center shrink-0">
                <Lock size={14} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer mt-2"
          >
            <span>Authenticate Login</span>
          </button>

        </form>

      </div>
    </div>
  );
};
export default Login;
