import React from 'react';
import { Star, ShieldCheck, Home, Users } from 'lucide-react';
import { getAssetPath } from '../firebase';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setSelectedCategory
}) => {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const element = document.getElementById('services');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative bg-slate-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100 font-sans">
      {/* Dynamic Background Blur Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl select-none pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl select-none pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Grid: Left side text, Right side promo cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
          
          {/* Left: Heading, Subheading & Trust Indicators */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-1.5 bg-brand-blue/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-blue select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping shrink-0" />
              <span className="font-extrabold uppercase tracking-wider text-[10px]">Verified Home Services in Gaur City & Noida Extension</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-brand-blue tracking-tight leading-[1.1] font-sans">
                AC, RO & Electrical <br />
                Services at Your Doorstep
              </h1>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl font-semibold leading-relaxed">
                Same-Day Service • Verified Technicians • Transparent Pricing • Genuine Spare Parts
              </p>
            </div>

            {/* Core Trust Indicators Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md pt-2 select-none">
              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 py-2.5 px-3.5 rounded-xl shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
                  <Star size={16} fill="#F97316" className="text-brand-orange" />
                </div>
                <div>
                  <span className="text-slate-900 font-extrabold text-sm block">4.9 Star Rating</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Google Review</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 py-2.5 px-3.5 rounded-xl shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <span className="text-slate-900 font-extrabold text-sm block">5000+ Services</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Completed</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 py-2.5 px-3.5 rounded-xl shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Home size={16} />
                </div>
                <div>
                  <span className="text-slate-900 font-extrabold text-sm block">Same-Day</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Doorstep Visit</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 py-2.5 px-3.5 rounded-xl shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-650 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="text-slate-900 font-extrabold text-sm block">30-Day Cover</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Service Warranty</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Premium UC Style Promo Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Promo Card 1: Super Saver */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-5 text-left flex flex-col justify-between h-52 shadow-sm relative overflow-hidden group select-none transition-premium hover:shadow-card hover:-translate-y-1">
              <div className="space-y-2 relative z-10">
                <span className="bg-brand-orange text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                  Super Saver
                </span>
                <h3 className="text-brand-blue font-extrabold text-lg sm:text-xl tracking-tight leading-snug pt-1">
                  Affordable repairs <br />starting at ₹49
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold leading-normal max-w-[150px]">
                  Fuses, modular switches, and general consultation diagnostics.
                </p>
              </div>
              
              <div className="absolute right-[-10px] bottom-[-10px] w-28 h-28 opacity-90 group-hover:scale-105 transition-transform duration-500 shrink-0">
                <img 
                  src={getAssetPath('/electric_switch.png')} 
                  alt="Repair illustration" 
                  className="w-full h-full object-cover rounded-tl-3xl border border-white shadow-md"
                />
              </div>
            </div>

            {/* Promo Card 2: Safe & Verified */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 rounded-2xl p-5 text-left flex flex-col justify-between h-52 shadow-sm relative overflow-hidden group select-none transition-premium hover:shadow-card hover:-translate-y-1">
              <div className="space-y-2 relative z-10">
                <span className="bg-brand-blue text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                  KS Certified
                </span>
                <h3 className="text-brand-blue font-extrabold text-lg sm:text-xl tracking-tight leading-snug pt-1">
                  100% Background <br />Verified Experts
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold leading-normal max-w-[150px]">
                  Strict training program under certified skill programs.
                </p>
              </div>

              {/* Action image replacing generic portrait */}
              <div className="absolute right-[-10px] bottom-[-10px] w-28 h-28 opacity-90 group-hover:scale-105 transition-transform duration-500 shrink-0">
                <img 
                  src={getAssetPath('/ro_service.png')} 
                  alt="Technician working" 
                  className="w-full h-full object-cover rounded-tl-3xl border border-white shadow-md"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Quick Links: Grid of category cards */}
        <div className="pt-8 border-t border-slate-200 text-left">
          <h3 className="font-extrabold text-brand-blue text-xs uppercase tracking-widest mb-5">
            Browse Core Specialties
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'AC Services', name: 'AC Services', desc: 'Gas leaks, jet cleaning & install', img: '/ac_service.png', label: 'AC Services' },
              { id: 'Electrician Services', name: 'Electrician Services', desc: 'Wiring, MCBs, lighting fitting', img: '/electrical_safety_service.png', label: 'Electrician Services' },
              { id: 'Appliance Repair', name: 'RO & Appliance Repair', desc: 'RO servicing, fridges & geysers', img: '/refrigerator_service.png', label: 'RO & Appliance Repair' },
              { id: 'Home Installations', name: 'Home Installations', desc: 'Chimney wash, balcony nets, locks', img: '/geyser_service.png', label: 'Home Installations' }
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-card hover:-translate-y-1 transition-premium active:scale-98 select-none"
              >
                <img 
                  src={getAssetPath(cat.img)} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.65]"
                />
                {/* Category Dark overlay */}
                <div className="absolute inset-0 category-card-overlay" />
                <div className="absolute bottom-4 left-4 text-left right-4">
                  <span className="bg-brand-orange text-white font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded block w-max mb-1.5 shadow-xs select-none">
                    {cat.label}
                  </span>
                  <span className="text-white text-xs sm:text-sm font-black leading-tight block">
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-slate-300 font-semibold block leading-tight mt-1 truncate max-w-full">
                    {cat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
export default Hero;
