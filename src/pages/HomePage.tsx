import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { ServiceGrid } from '../components/ServiceGrid';
import type { TechnicalService, CartItem } from '../types';
import type { BusinessConfig } from '../data';

interface HomePageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  setSearchQuery,
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
  
  // LocalBusiness Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessConfig.name,
    "image": businessConfig.logoUrl,
    "telephone": `+91-${businessConfig.contacts[0]}`,
    "email": businessConfig.email,
    "url": businessConfig.website,
    "priceRange": "₹49 - ₹2500",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gaur City 1, Greater Noida West",
      "addressLocality": "Noida Extension",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
    },
    "areaServed": businessConfig.serviceAreas
  };

  return (
    <>
      <Helmet>
        <title>{`${businessConfig.name} | Expert Doorstep Service Portal`}</title>
        <meta name="description" content={`Book professional AC Installation, RO filter service, certified Electrician, Washing Machine repair, Refrigerator maintenance, and Kitchen Chimney cleaning in Gurgaon, Noida, and NCR.`} />
        <link rel="canonical" href="https://ks-demo.web.app/" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Hero Header Search */}
      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* Dynamic Category Pill Filters & Services Matrix */}
      <div className="bg-gray-50 py-12 border-b border-gray-200 relative text-center">
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
export default HomePage;
