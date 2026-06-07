import React, { useState } from 'react';
import { 
  Star, Clock, Power, Wind, Lightbulb, Bell, Cpu, Tv, UserCheck, 
  Droplets, Wrench, Settings, ShoppingCart, Plus, Minus, Percent, ShieldCheck, Check
} from 'lucide-react';
import type { TechnicalService, CartItem } from '../types';
import { BrandModal } from './BrandModal';
import { ServiceDetailsModal } from './ServiceDetailsModal';

interface ServiceGridProps {
  services: TechnicalService[];
  selectedCategory: string;
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  onProceedToCheckout: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  selectedCategory,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onProceedToCheckout
}) => {
  const [selectedServiceForBrand, setSelectedServiceForBrand] = useState<TechnicalService | null>(null);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState<TechnicalService | null>(null);

  if (services.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4 text-center border border-gray-200 rounded-lg bg-gray-55 font-sans text-sm mt-10">
        <p className="text-gray-500 font-bold">No services found matching your criteria</p>
        <p className="text-gray-400 text-xs mt-1">Try resetting the filter pills or searching alternative keywords.</p>
      </div>
    );
  }

  // Get total quantity of a service in the cart across all brands
  const getServiceQuantity = (serviceId: string) => {
    return Object.values(cart)
      .filter(item => item.serviceId === serviceId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get first cart item for a service to increment/decrement from the service card
  const getFirstCartItemKey = (serviceId: string) => {
    const found = Object.entries(cart).find(([_, item]) => item.serviceId === serviceId);
    return found ? found[0] : null;
  };

  // Handle click on "Add" button
  const handleAddClick = (service: TechnicalService) => {
    if (service.category === 'AC Services' || service.category === 'Appliance Repair') {
      setSelectedServiceForBrand(service);
    } else {
      onAddToCart(service);
    }
  };

  // Determine active groups (categories if 'ALL', else subcategories of selected category)
  const isAll = selectedCategory === 'ALL';
  const groupNames = isAll
    ? Array.from(new Set(services.map(s => s.category)))
    : Array.from(new Set(services.filter(s => s.category === selectedCategory).map(s => s.subcategory)));

  // Scroll to a specific section by its element ID
  const handleScrollToSection = (name: string) => {
    const id = `sec-${name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
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

  // Get subcategory or category circular icon
  const getGroupIcon = (name: string) => {
    switch (name.toLowerCase()) {
      // Main Categories
      case 'ac services': return <Wind size={18} className="text-blue-600 animate-pulse" />;
      case 'electrician services': return <Power size={18} className="text-orange-500" />;
      case 'appliance repair': return <Tv size={18} className="text-indigo-600" />;
      case 'home installations': return <Settings size={18} className="text-emerald-600" />;
      // Subcategories
      case 'service': return <Droplets size={18} className="text-blue-600" />;
      case 'repair & gas refill': return <Wrench size={18} className="text-orange-500" />;
      case 'installation/uninstallation': return <Settings size={18} className="text-purple-600" />;
      case 'switch & socket': return <Power size={18} className="text-indigo-600" />;
      case 'fan': return <Wind size={18} className="text-cyan-500" />;
      case 'light': return <Lightbulb size={18} className="text-amber-500" />;
      case 'wiring': return <Power size={18} className="text-emerald-500" />;
      case 'doorbell & security': return <Bell size={18} className="text-rose-500" />;
      case 'mcb/fuse': return <Cpu size={18} className="text-violet-500" />;
      case 'appliances': return <Tv size={18} className="text-teal-600" />;
      case 'book a consultation': return <UserCheck size={18} className="text-yellow-600" />;
      default: return <Settings size={18} className="text-gray-500" />;
    }
  };

  // Calculate cart total details
  const cartItems = Object.entries(cart);
  const cartSubtotal = cartItems.reduce((sum, [_, item]) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, [_, item]) => sum + item.quantity, 0);

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24 font-sans text-left">
      
      {/* Three-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        
        {/* Left Column (lg:col-span-2): Sticky "Select a service" menu */}
        <div className="lg:col-span-2 sticky top-24 hidden lg:block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="font-sans font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 pl-1.5">
            Select a Service
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {groupNames.map((name) => (
              <button
                key={name}
                onClick={() => handleScrollToSection(name)}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 text-center select-none cursor-pointer transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-1.5 transition-colors group-hover:bg-white border border-gray-200 shadow-sm shrink-0">
                  {getGroupIcon(name)}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 leading-tight group-hover:text-brand-blue transition-colors">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column (lg:col-span-5): Service lists grouped by sub-headings */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Main heading badge on Mobile */}
          <div className="lg:hidden flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 font-semibold text-xs text-brand-blue">
            <span>Scroll & Select Categories</span>
            <div className="flex space-x-1.5 overflow-x-auto max-w-[200px] no-scrollbar">
              {groupNames.map((name) => (
                <button
                  key={name}
                  onClick={() => handleScrollToSection(name)}
                  className="bg-white text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 whitespace-nowrap"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Grouped Listings */}
          {groupNames.map((groupName) => {
            const groupServices = services.filter(s => isAll ? s.category === groupName : s.subcategory === groupName);
            
            if (groupServices.length === 0) return null;

            return (
              <div 
                key={groupName} 
                id={`sec-${groupName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm scroll-mt-24"
              >
                {/* Heading */}
                <h2 className="font-extrabold text-gray-900 text-lg md:text-xl border-b border-gray-150 pb-3 mb-6 flex items-center space-x-2.5 select-none">
                  <span className="p-1.5 bg-gray-50 rounded-xl border border-gray-200 shrink-0">{getGroupIcon(groupName)}</span>
                  <span>{groupName}</span>
                </h2>

                {/* Service Row List */}
                <div className="space-y-6">
                  {groupServices.map((service) => {
                    const qtyInCart = getServiceQuantity(service.id);
                    const itemKey = getFirstCartItemKey(service.id);

                    // Dynamic Tag determination
                    const isPackage = service.price >= 790 || service.name.toLowerCase().includes('complete') || service.name.toLowerCase().includes('wiring');
                    const hasDiscount = service.price >= 290;

                    return (
                      <div 
                        key={service.id} 
                        className="flex flex-col sm:flex-row justify-between border-b border-gray-100 last:border-0 pb-6 last:pb-0 font-sans"
                      >
                        {/* Details Block (Left) */}
                        <div className="flex-1 text-left pr-2 space-y-2">
                          
                          {/* Offer tags & Package tags */}
                          <div className="flex items-center space-x-2 select-none">
                            {isPackage && (
                              <span className="bg-emerald-650 text-white font-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm scale-95 origin-left">
                                PACKAGE
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="text-green-600 font-extrabold text-[10px] tracking-wide flex items-center">
                                <Percent size={10} className="mr-0.5" />
                                10% OFF
                              </span>
                            )}
                          </div>

                          <h3 className="font-extrabold text-gray-900 text-sm md:text-base leading-tight">
                            {service.name}
                          </h3>
                          
                          {/* Rating Row */}
                          <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-semibold select-none">
                            <div className="flex items-center text-yellow-500">
                              <Star size={11} fill="currentColor" />
                            </div>
                            <span>{service.rating}</span>
                          </div>

                          {/* Price & Duration */}
                          <div className="flex items-center space-x-2 text-xs md:text-sm font-extrabold text-gray-900 select-none">
                            <span className="text-gray-900 font-black">₹{service.price}</span>
                            <span className="text-gray-300 font-normal">•</span>
                            <span className="text-gray-500 font-medium flex items-center">
                              <Clock size={11} className="mr-1 text-brand-blue" />
                              {service.duration}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-md">
                            {service.description}
                          </p>

                          {/* View details link */}
                          <button
                            onClick={() => setSelectedServiceForDetails(service)}
                            className="text-xs text-brand-blue hover:text-brand-blue-dark font-extrabold hover:underline cursor-pointer flex items-center space-x-0.5 select-none"
                          >
                            <span>View details</span>
                          </button>
                        </div>

                        {/* Image Block & Action Button (Right) */}
                        <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 mx-auto sm:mx-0 mt-4 sm:mt-0 ml-0 sm:ml-4 select-none">
                          <img 
                            src={service.imageUrl} 
                            alt={service.name} 
                            className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm"
                          />
                          
                          {/* OVERLAY ADD BUTTON */}
                          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 shrink-0">
                            {qtyInCart > 0 && itemKey ? (
                              // Quantity Adjuster Mode
                              <div className="bg-white text-brand-blue border border-brand-blue shadow-md rounded-lg py-1 px-2.5 text-xs font-black flex items-center justify-between min-w-[76px] h-7">
                                <button
                                  type="button"
                                  onClick={() => onRemoveFromCart(service.id, cart[itemKey]?.brand)}
                                  className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-0.5 rounded cursor-pointer transition-colors"
                                >
                                  <Minus size={11} strokeWidth={3} />
                                </button>
                                <span className="text-xs font-black text-gray-800 px-1.5">{qtyInCart}</span>
                                <button
                                  type="button"
                                  onClick={() => onAddToCart(service, cart[itemKey]?.brand)}
                                  className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-0.5 rounded cursor-pointer transition-colors"
                                >
                                  <Plus size={11} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              // Standard Add Button Mode
                              <button
                                type="button"
                                onClick={() => handleAddClick(service)}
                                className="bg-white hover:bg-blue-50/20 text-brand-blue hover:text-brand-blue-dark border border-gray-250 hover:border-brand-blue shadow-md rounded-lg py-1 px-4 text-xs font-black transition-all cursor-pointer min-w-[76px] h-7 flex items-center justify-center active:scale-95"
                              >
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (lg:col-span-3): Sticky Sidebar for Cart & Trust Badges */}
        <div className="lg:col-span-3 sticky top-24 space-y-4">
          
          {/* Discount / Coupon Box */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 flex items-center space-x-3 text-left font-sans select-none">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-650 shrink-0 shadow-sm border border-emerald-200">
              <Percent size={14} className="animate-spin-slow" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-900 leading-tight">Get visitation fee off</h4>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">On orders above ₹499. Applied on checkout.</p>
            </div>
          </div>

          {/* UC Promise Widget */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 text-left font-sans select-none">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">KS Promise</h3>
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck size={15} className="text-brand-blue" />
              </div>
            </div>
            <div className="space-y-2.5 text-xs text-gray-655 font-bold">
              <div className="flex items-start space-x-2">
                <Check size={13} className="text-green-500 mt-0.5 shrink-0" />
                <span>Verified Professionals only</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check size={13} className="text-green-500 mt-0.5 shrink-0" />
                <span>Hassle Free Doorstep Booking</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check size={13} className="text-green-500 mt-0.5 shrink-0" />
                <span>Transparent upfront pricing</span>
              </div>
            </div>
            
            {/* Assured seal visual */}
            <div className="pt-3 border-t border-gray-100 flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-yellow-200 text-yellow-600 text-[10px] font-bold shrink-0">
                ⭐ 100%
              </div>
              <div className="text-[10px] text-gray-450 leading-tight font-medium">
                Our technicians are strictly trained with 300+ hours in domestic repairs.
              </div>
            </div>
          </div>

          {/* Shopping Cart Widget */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 text-left font-sans">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center justify-between border-b border-gray-100 pb-3">
              <span>Shopping Cart</span>
              <span className="text-[11px] font-bold text-gray-450 uppercase">{cartCount} items</span>
            </h3>

            {cartCount === 0 ? (
              // Empty State
              <div className="py-8 flex flex-col items-center justify-center text-center select-none animate-in fade-in duration-200">
                <ShoppingCart size={32} className="text-gray-300 stroke-1" />
                <span className="text-xs text-gray-400 font-bold mt-2.5">No items in your cart</span>
                <span className="text-[10px] text-gray-400 mt-0.5 font-medium max-w-[150px]">Select services to begin booking.</span>
              </div>
            ) : (
              // Cart Items List
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="max-h-56 overflow-y-auto pr-1 space-y-3.5 divide-y divide-gray-100">
                  {cartItems.map(([key, item]) => (
                    <div key={key} className="flex justify-between items-start pt-3 first:pt-0">
                      <div className="flex-1 pr-2">
                        <h4 className="text-xs font-bold text-gray-800 leading-tight">
                          {item.serviceName}
                        </h4>
                        {item.brand && (
                          <span className="inline-block bg-blue-50 border border-blue-100 text-brand-blue text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1 select-none">
                            {item.brand}
                          </span>
                        )}
                        <div className="text-[10px] text-gray-455 font-bold mt-1">₹{item.price} each</div>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center space-x-1.5 shrink-0 select-none">
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(item.serviceId, item.brand)}
                          className="w-5 h-5 rounded border border-gray-250 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-55 cursor-pointer text-[10px]"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onAddToCart({ id: item.serviceId, name: item.serviceName, price: item.price } as TechnicalService, item.brand)}
                          className="w-5 h-5 rounded border border-gray-255 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-55 cursor-pointer text-[10px]"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Total Line Price */}
                      <div className="text-xs font-bold text-gray-900 ml-3 shrink-0 select-none">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Row */}
                <div className="border-t border-gray-150 pt-4 space-y-2 select-none">
                  <div className="flex justify-between text-xs text-gray-500 font-bold">
                    <span>Cart Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  
                  {/* Delivery / Visitation Fee discount promo */}
                  {cartSubtotal >= 499 && (
                    <div className="flex justify-between text-[11px] text-green-600 font-bold">
                      <span>Visitation Fee Discount</span>
                      <span>Free</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-900 font-black pt-1 border-t border-dashed border-gray-200">
                    <span>Total Estimate</span>
                    <span className="text-brand-blue">₹{cartSubtotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger button */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer select-none"
                >
                  Proceed to Book
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Brand Selection Modal */}
      {selectedServiceForBrand && (
        <BrandModal
          isOpen={selectedServiceForBrand !== null}
          onClose={() => setSelectedServiceForBrand(null)}
          onSelectBrand={(brand) => {
            if (selectedServiceForBrand) {
              onAddToCart(selectedServiceForBrand, brand);
            }
            setSelectedServiceForBrand(null);
          }}
          serviceName={selectedServiceForBrand.name}
        />
      )}

      {/* Service Details Modal */}
      {selectedServiceForDetails && (
        <ServiceDetailsModal
          isOpen={selectedServiceForDetails !== null}
          onClose={() => setSelectedServiceForDetails(null)}
          service={selectedServiceForDetails}
          qtyInCart={getServiceQuantity(selectedServiceForDetails.id)}
          onAddToCart={(srv) => {
            if (srv.category === 'AC Services' || srv.category === 'Appliance Repair') {
              setSelectedServiceForBrand(srv);
              setSelectedServiceForDetails(null);
            } else {
              onAddToCart(srv);
            }
          }}
          onRemoveFromCart={(srvId) => {
            const itemKey = getFirstCartItemKey(srvId);
            onRemoveFromCart(srvId, itemKey ? cart[itemKey]?.brand : undefined);
          }}
        />
      )}

    </section>
  );
};
