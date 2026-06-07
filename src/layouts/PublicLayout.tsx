import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import type { BusinessConfig } from '../data';

interface PublicLayoutProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  cartCount: number;
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  currentUser: { name: string; email: string; photoUrl: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  businessConfig: BusinessConfig;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  cartCount,
  isLoggedIn,
  userRole,
  currentUser,
  onLoginClick,
  onLogoutClick,
  businessConfig
}) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/checkout');
  };

  const handleAdminPanelClick = () => {
    navigate('/admin/catalog');
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-150 selection:text-brand-blue-dark">
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        cartCount={cartCount}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
        onAdminPanelClick={handleAdminPanelClick}
        businessConfig={businessConfig}
      />
      <main className="w-full pt-20">
        <Outlet />
      </main>
      <Footer businessConfig={businessConfig} />
    </div>
  );
};
