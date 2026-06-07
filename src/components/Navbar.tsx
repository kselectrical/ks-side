import React, { useState } from 'react';
import { Phone, MapPin, ChevronDown, Search, ShoppingCart, Star, User, Settings, LogOut } from 'lucide-react';
import type { BusinessConfig } from '../data';
import { getAssetPath } from '../firebase';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  cartCount: number;
  onCartClick: () => void;
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  currentUser: { name: string; email: string; photoUrl: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onAdminPanelClick: () => void;
  businessConfig: BusinessConfig;
}

const LOCATIONS = [
  'H37, Block H, Saket, New Delhi',
  'Gaur City 1, Noida Extension, UP',
  'Gaur City 2, Noida Extension, UP',
  'Siddharth Vihar, Ghaziabad, UP',
  'Sector 62, Noida, UP'
];

const SUGGESTIONS = [
  { text: 'AC Repairs & Gas Leak Fix', category: 'AC Services' },
  { text: 'AC Jet Cleaning & Service', category: 'AC Services' },
  { text: 'Modular Board Switch Repair', category: 'Electrician Services' },
  { text: 'Ceiling & Exhaust Fan Repair', category: 'Electrician Services' },
  { text: 'RO Water Purifier Servicing', category: 'Appliance Repair' },
  { text: 'Balcony Pigeon Net Installation', category: 'Home Installations' }
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  cartCount,
  onCartClick,
  isLoggedIn,
  userRole,
  currentUser,
  onLoginClick,
  onLogoutClick,
  onAdminPanelClick,
  businessConfig
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm transition-transform hover:scale-105">
              <img 
                src={getAssetPath(businessConfig.logoUrl)} 
                alt="KS Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallbackSpan = document.createElement('span');
                    fallbackSpan.className = 'text-brand-blue font-extrabold text-sm';
                    fallbackSpan.innerText = 'KS';
                    parent.appendChild(fallbackSpan);
                  }
                }}
              />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-sans font-extrabold text-gray-900 tracking-tight text-base sm:text-lg leading-tight hover:text-brand-blue transition-colors">
                KS Electrical
              </span>
              <span className="font-sans text-[10px] text-gray-500 font-semibold tracking-wide">
                And AC Services
              </span>
            </div>
          </div>

          {/* Center Column: Location Selector & Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 relative">
            {/* Location Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-1.5 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-250 border-r-0 rounded-l-lg text-xs font-semibold text-gray-700 select-none cursor-pointer transition-colors max-w-[200px] truncate"
              >
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{selectedLocation}</span>
                <ChevronDown size={12} className="text-gray-400 shrink-0" />
              </button>

              {showLocationDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLocationDropdown(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-lg shadow-dropdown z-50 py-1 font-sans text-xs">
                    <div className="px-3 py-2 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                      Select Service Location
                    </div>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 font-semibold transition-colors flex items-center justify-between ${
                          selectedLocation === loc ? 'text-brand-blue bg-blue-50/20' : 'text-gray-700'
                        }`}
                      >
                        <span>{loc}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search Input with Auto-Suggestions */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services (AC repairs, switches, fans...)"
                className="w-full bg-white text-gray-800 border border-gray-250 rounded-r-lg pl-9 pr-8 py-2.5 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-blue-100 text-xs sm:text-sm font-semibold transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSuggestions(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-dropdown z-50 py-1 font-sans text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                      Popular Searches
                    </div>
                    {SUGGESTIONS.map((item) => (
                      <button
                        type="button"
                        key={item.text}
                        onClick={() => {
                          setSearchQuery(item.text);
                          setShowSuggestions(false);
                          // Scroll to services
                          const el = document.getElementById('services');
                          if (el) {
                            const offset = 80;
                            const bodyRect = document.body.getBoundingClientRect().top;
                            const elementRect = el.getBoundingClientRect().top;
                            const elementPosition = elementRect - bodyRect;
                            const offsetPosition = elementPosition - offset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                          }
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 font-semibold text-gray-700 transition-colors flex justify-between items-center cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <span>{item.text}</span>
                        <span className="text-[9px] text-brand-blue bg-blue-50 px-2 py-0.5 rounded font-extrabold uppercase">
                          {item.category.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Quick Contacts, Reviews & Shopping Cart */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* Google Rating Badge */}
            <a 
              href={businessConfig.reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 transition-colors select-none"
            >
              <Star size={12} fill="#F97316" className="text-brand-orange shrink-0" />
              <span className="font-extrabold text-slate-900">4.9</span>
              <span className="text-slate-300">|</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Google Rating</span>
            </a>

            {/* Direct Calls - Stronger Orange CTA */}
            <a 
              href={`tel:${businessConfig.contacts[0]}`}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 hover:scale-102 select-none"
            >
              <Phone size={13} fill="currentColor" className="shrink-0" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </a>

            {/* Login / Profile / Admin Widget */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                {userRole === 'admin' ? (
                  <>
                    {/* Admin Dashboard Trigger */}
                    <button
                      type="button"
                      onClick={onAdminPanelClick}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 hover:bg-red-100/70 border border-red-200 text-red-700 rounded-lg text-xs font-black select-none cursor-pointer transition-all shadow-sm active:scale-95"
                    >
                      <Settings size={13} className="animate-spin-slow" />
                      <span>Admin Panel</span>
                    </button>
                    
                    {/* Badge */}
                    <div className="hidden sm:flex items-center px-2 py-2 border border-slate-200 bg-slate-50 rounded-lg text-[10px] font-black text-slate-700 uppercase select-none">
                      Admin
                    </div>
                  </>
                ) : (
                  /* Customer Profile Info */
                  <div className="flex items-center space-x-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 select-none shadow-sm">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={currentUser?.photoUrl || getAssetPath('/profile.png')} alt="User" className="w-full h-full object-cover animate-in zoom-in duration-200" />
                    </div>
                    <span className="hidden sm:inline truncate max-w-[100px]">{currentUser?.name || 'Verified'}</span>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogoutClick}
                  className="p-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-full transition-colors cursor-pointer select-none"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-colors select-none cursor-pointer shadow-sm hover:scale-102 active:scale-98"
              >
                <User size={13} className="text-brand-orange" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Cart Icon Badge */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-700 transition-all select-none cursor-pointer hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-orange text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-md border border-white animate-in zoom-in duration-200">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
