import React from 'react';
import { X, Check } from 'lucide-react';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBrand: (brand: string) => void;
  serviceName: string;
}

const BRANDS = [
  { name: 'LG', color: 'text-red-650 font-bold font-sans' },
  { name: 'VOLTAS', color: 'text-blue-900 italic font-extrabold tracking-tight' },
  { name: 'Haier', color: 'text-blue-500 font-extrabold font-serif' },
  { name: 'HITACHI', color: 'text-black font-black font-mono tracking-tighter' },
  { name: 'Panasonic', color: 'text-blue-800 font-bold' },
  { name: 'MITSUBISHI', color: 'text-red-600 font-extrabold tracking-wider' },
  { name: 'BLUE STAR', color: 'text-blue-700 font-extrabold' },
  { name: 'DAIKIN', color: 'text-sky-500 font-extrabold italic' },
  { name: 'SAMSUNG', color: 'text-blue-800 font-extrabold font-sans tracking-wide' },
  { name: 'Godrej', color: 'text-emerald-600 font-bold font-serif italic' },
  { name: 'TOSHIBA', color: 'text-red-700 font-black' },
  { name: '& more', color: 'text-gray-400 font-bold' }
];

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  onSelectBrand,
  serviceName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-dropdown animate-in fade-in zoom-in duration-200 text-left font-sans">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-base">
            Select Brand for {serviceName}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Brands Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3">
            {BRANDS.map((brand) => (
              <button
                type="button"
                key={brand.name}
                onClick={() => onSelectBrand(brand.name)}
                className="h-14 rounded-xl border border-gray-200 hover:border-brand-blue bg-white hover:bg-blue-50/20 flex items-center justify-center p-2 transition-all cursor-pointer shadow-sm active:scale-95 select-none"
              >
                <span className={brand.color}>{brand.name}</span>
              </button>
            ))}
          </div>

          {/* Trademark Disclaimer note */}
          <p className="text-[10px] text-gray-400 leading-relaxed mt-4 text-center font-medium">
            These trademarks and/or logos are used for illustration purposes only. KS Electrical and AC Services is an independent contractor servicing all leading appliance brands.
          </p>
        </div>

        {/* Top Professionals Verified Banner */}
        <div className="border-t border-gray-150 p-6 bg-blue-50/30 flex items-center space-x-6 relative">
          <div className="flex-1 space-y-3">
            <h4 className="font-bold text-gray-900 text-base">Top service technicians</h4>
            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check size={10} className="text-green-600" />
                </div>
                <span>Background verified professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check size={10} className="text-green-600" />
                </div>
                <span>300+ hours of strict training</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check size={10} className="text-green-600" />
                </div>
                <span>Certified under Skill India Programme</span>
              </div>
            </div>
          </div>
          
          {/* Tech Graphic photo */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=250&q=80" 
              alt="Technician Expert" 
              className="w-full h-full object-cover scale-102"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
