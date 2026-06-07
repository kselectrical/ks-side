import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <Helmet>
        <title>Page Not Found | 404 Error</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center shadow-dropdown animate-in zoom-in-95 duration-200">
        
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm shrink-0">
          <AlertCircle size={32} />
        </div>

        {/* Message */}
        <h1 className="text-gray-900 font-black text-3xl tracking-tight leading-none mb-3">
          404 - Page Not Found
        </h1>
        <p className="text-gray-500 text-sm font-semibold leading-relaxed mb-8">
          The requested page url does not exist or has been moved to a different path in our portal.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Home size={14} />
          <span>Return to Homepage</span>
        </Link>

      </div>
    </div>
  );
};
export default NotFound;
