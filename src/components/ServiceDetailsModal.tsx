import React from 'react';
import { X, Star, Check, Clock, Plus, Minus } from 'lucide-react';
import type { TechnicalService } from '../types';

interface ServiceDetailsModalProps {
  service: TechnicalService | null;
  isOpen: boolean;
  onClose: () => void;
  qtyInCart: number;
  onAddToCart: (service: TechnicalService) => void;
  onRemoveFromCart: (serviceId: string) => void;
}

const REVIEWS = [
  {
    name: 'Jitesh Hassani',
    date: 'May 30, 2026',
    rating: 5,
    service: 'For Home Service Repair',
    text: 'Very professional and knowledgeable technician. Arrived on time, completed the work efficiently, and ensured everything was working perfectly. Highly satisfied.'
  },
  {
    name: 'Sanitha',
    date: 'May 28, 2026',
    rating: 5,
    service: 'For Appliance Diagnostics & Repair',
    text: 'The service is excellent and so genuine in feedback. The technician guided us honestly regarding spare parts and repairs that were not required, saving us money. Really appreciate his work ethic and morals.'
  },
  {
    name: 'Rajesh Kumar',
    date: 'May 15, 2026',
    rating: 5,
    service: 'For AC Maintenance & Gas Check',
    text: 'Amazing experience! He diagnosed the leakage quickly and fixed it right away. The cooling is back to normal now. Professional behaviour throughout.'
  }
];

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  isOpen,
  onClose,
  qtyInCart,
  onAddToCart,
  onRemoveFromCart
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative z-10 shadow-dropdown font-sans text-left flex flex-col">
        
        {/* Header Sticky */}
        <div className="p-4 border-b border-gray-150 flex justify-between items-center sticky top-0 bg-white z-20">
          <h3 className="font-extrabold text-gray-900 text-base">
            Service Details
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Main Info */}
          <div className="flex justify-between items-start">
            <div className="space-y-1.5 flex-1 pr-4">
              <h2 className="font-extrabold text-gray-900 text-xl leading-snug">
                {service.name}
              </h2>
              
              {/* Rating */}
              <div className="flex items-center space-x-1.5 text-xs text-gray-550 font-bold select-none">
                <div className="flex items-center text-yellow-500">
                  <Star size={12} fill="currentColor" />
                </div>
                <span>{service.rating}</span>
              </div>

              {/* Price & Duration */}
              <div className="flex items-center space-x-2 text-sm font-extrabold text-gray-900 pt-1 select-none">
                <span>Starts at ₹{service.price}</span>
                <span className="text-gray-300 font-normal">•</span>
                <span className="text-gray-500 font-medium flex items-center">
                  <Clock size={12} className="mr-1 text-brand-blue" />
                  {service.duration}
                </span>
              </div>
            </div>

            {/* Overlaid Add Button on right */}
            <div className="shrink-0 select-none">
              {qtyInCart > 0 ? (
                <div className="bg-white text-brand-blue border border-brand-blue shadow-sm rounded-lg py-1 px-2.5 text-xs font-black flex items-center justify-between min-w-[76px] h-8">
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(service.id)}
                    className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-0.5 rounded cursor-pointer transition-colors"
                  >
                    <Minus size={11} strokeWidth={3} />
                  </button>
                  <span className="text-xs font-black text-gray-800 px-1.5">{qtyInCart}</span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(service)}
                    className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-0.5 rounded cursor-pointer transition-colors"
                  >
                    <Plus size={11} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddToCart(service)}
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-1.5 px-5 text-xs font-extrabold shadow transition-all cursor-pointer select-none"
                >
                  Add Service
                </button>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Our Process Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base uppercase tracking-wider">
              Our Process
            </h3>
            <div className="space-y-4 relative pl-4 border-l border-gray-150 ml-1.5 select-none">
              <div className="relative">
                <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-brand-blue border border-white" />
                <h4 className="text-xs font-bold text-gray-900">1. Safe Inspection</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Technician visits and inspects the appliance to identify wiring or performance issues.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-brand-blue border border-white" />
                <h4 className="text-xs font-bold text-gray-900">2. Transparent Quote Approval</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">We share the pricing matrix and work starts only upon your approval.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-brand-blue border border-white" />
                <h4 className="text-xs font-bold text-gray-900">3. Repair & Spares</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Replacement of elements or compressors with genuine, high-grade parts.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-brand-blue border border-white" />
                <h4 className="text-xs font-bold text-gray-900">4. Clean & Delivery</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Thorough cleaning of the service area and testing of operations before leaving.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-emerald-500 border border-white animate-pulse" />
                <h4 className="text-xs font-bold text-green-600">5. 30-Day Guarantee Activation</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Hassle-free guarantee takes effect instantly for peace of mind.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Top Technicians Badge */}
          <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 flex items-center justify-between select-none">
            <div className="space-y-2.5">
              <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
                Top Technicians
              </h3>
              <div className="space-y-1.5 text-xs text-gray-700 font-bold">
                <div className="flex items-center space-x-1.5">
                  <Check size={12} className="text-green-500 shrink-0" />
                  <span>100% Background verified</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Check size={12} className="text-green-500 shrink-0" />
                  <span>300+ Hours of strict training</span>
                </div>
              </div>
            </div>
            
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0 ml-4">
              <img 
                src="https://images.unsplash.com/photo-1622044939413-0b829c342434?auto=format&fit=crop&w=150&q=80" 
                alt="Verified Technician" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Reviews Rating Chart */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base uppercase tracking-wider">
              Customer Reviews
            </h3>

            {/* Stars break-down */}
            <div className="flex items-center space-x-6 select-none bg-gray-50 p-4 rounded-xl border border-gray-150">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">4.8</span>
                <span className="text-xs text-gray-450 block font-bold mt-1">out of 5</span>
              </div>
              <div className="flex-1 space-y-1">
                {[
                  { star: 5, pct: '80%' },
                  { star: 4, pct: '14%' },
                  { star: 3, pct: '4%' },
                  { star: 2, pct: '1%' },
                  { star: 1, pct: '1%' }
                ].map((row) => (
                  <div key={row.star} className="flex items-center text-[10px] sm:text-xs font-bold text-gray-500">
                    <span className="w-2.5">{row.star}</span>
                    <Star size={8} fill="currentColor" className="text-yellow-500 ml-0.5 mr-2" />
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-800 rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-right ml-2 text-gray-400">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {REVIEWS.map((rev, index) => (
                <div key={index} className="space-y-2 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">{rev.name}</span>
                    <span className="text-gray-400 font-medium">{rev.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">{rev.service}</span>
                  </div>
                  <p className="text-xs text-gray-650 leading-relaxed font-medium">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
