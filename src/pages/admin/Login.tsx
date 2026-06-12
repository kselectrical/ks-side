import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';

interface LoginProps {
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  onLoginSuccess: (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string }) => void;
}

export const Login: React.FC<LoginProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans select-none text-center">
      <Helmet>
        <title>Portal Access | KS Electrical</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-white border border-gray-250 rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-dropdown animate-in zoom-in-95 duration-200">
        
        {/* Shield Logo */}
        <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-sm shrink-0">
          <ShieldCheck size={24} className="text-brand-orange" />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-gray-900 font-black text-xl tracking-tight leading-none uppercase">
            Portal Access
          </h1>
          <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mt-1.5">
            Form cleared successfully
          </p>
        </div>

        {/* Information Message */}
        <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-150">
          All login page inputs, database credentials, and authentication logic have been removed from this page as requested.
        </p>

        <p className="text-[10px] text-gray-450 font-bold mt-4">
          Waiting for your prompt to replace the Login Icon.
        </p>

      </div>
    </div>
  );
};

export default Login;
