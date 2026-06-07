import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SearchBar } from '../components/SearchBar';
import { ServiceGrid } from '../components/ServiceGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { TechnicalService, CartItem } from '../types';
import type { BusinessConfig } from '../data';

interface ServicesPageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  filteredServices: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  onProceedToCheckout: () => void;
  businessConfig: BusinessConfig;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredServices,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onProceedToCheckout,
  businessConfig
}) => {
  return (
    <>
      <Helmet>
        <title>{`All Doorstep Repair Services | ${businessConfig.name}`}</title>
        <meta name="description" content={`Browse our full list of technical home services: AC repair, RO service, electrical wiring, washing machine troubleshooting, refrigerator maintenance, and chimney cleaning.`} />
        <link rel="canonical" href="https://ks-demo.web.app/services" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Our Services' }]} />

      <div className="bg-gray-50 py-12 border-b border-gray-200 relative text-center">
        <div className="max-w-4xl mx-auto px-6 text-left mb-8">
          <h1 className="text-3xl font-black text-gray-900 leading-none">Our Handyman & Repair Services</h1>
          <p className="text-[10px] text-gray-550 font-bold uppercase tracking-wider mt-1.5">Upfront rates, same-day scheduling, and certified technicians</p>
        </div>

        <SearchBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        <ServiceGrid 
          services={filteredServices} 
          selectedCategory={selectedCategory}
          cart={cart}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onProceedToCheckout={onProceedToCheckout}
        />
      </div>
    </>
  );
};
export default ServicesPage;
