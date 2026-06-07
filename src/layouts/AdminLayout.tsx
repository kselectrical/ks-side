import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, FolderOpen, Palette, Users, ShoppingBag, FileText, ArrowLeft, LogOut } from 'lucide-react';
import type { BusinessConfig } from '../data';

interface AdminLayoutProps {
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  onLogout: () => void;
  businessConfig: BusinessConfig;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  isLoggedIn,
  userRole,
  onLogout,
  businessConfig
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route Guard Logic: redirect to admin login if not admin
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/catalog', label: 'Manage Service Rates', icon: Settings },
    { path: '/admin/categories', label: 'Manage Categories', icon: FolderOpen },
    { path: '/admin/branding', label: 'Branding Customizer', icon: Palette },
    { path: '/admin/customers', label: 'Customer Directory', icon: Users },
    { path: '/admin/requests', label: 'Customer Requests', icon: ShoppingBag },
    { path: '/admin/billbook', label: 'Bill Book', icon: FileText, isNew: true }
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        
        {/* Sidebar Header Branding */}
        <div className="px-6 py-5 border-b border-gray-150 flex flex-col text-left">
          <span className="text-gray-900 font-black text-base tracking-tight truncate">
            {businessConfig.name}
          </span>
          <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mt-0.5">
            Admin Console
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/admin/billbook' && location.pathname.startsWith('/admin/billbook'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full text-left px-3 py-3 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? item.isNew
                      ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'bg-blue-50/70 text-brand-blue border border-blue-100 shadow-sm'
                    : 'text-gray-550 hover:bg-gray-50 border border-transparent hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon size={15} className={isActive ? item.isNew ? 'text-emerald-600' : 'text-brand-blue' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="bg-emerald-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full select-none animate-pulse">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-gray-150 space-y-2">
          <Link
            to="/"
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2.5 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Return to Site</span>
          </Link>
          <button
            onClick={handleLogoutClick}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout Account</span>
          </button>
        </div>

      </aside>

      {/* Admin Content Area Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Admin Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between shrink-0 select-none">
          <div className="text-left">
            <h2 className="text-gray-900 font-black text-sm uppercase tracking-wide">
              {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Administration Control'}
            </h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Live pricing updates and database records synchronization
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-gray-800 font-extrabold text-xs block">{businessConfig.owner}</span>
              <span className="text-[9px] text-gray-450 font-bold block">{businessConfig.email}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue font-black shadow-inner">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Sub-Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
