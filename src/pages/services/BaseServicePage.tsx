import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ServiceGrid } from '../../components/ServiceGrid';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface SEOOverride {
  title: string;
  description: string;
  keyword: string;
  heading: string;
  intro: string;
}

const getSEOContent = (
  serviceSlug: string,
  serviceName: string,
  cityName: string,
  businessName: string,
  fallbackOverview: string
): SEOOverride => {
  const normCity = cityName ? cityName.trim() : '';
  const locationHeader = normCity ? `in ${normCity}` : '';
  
  const defaultOverride: SEOOverride = {
    title: `${serviceName} Service ${locationHeader} | ${businessName}`,
    description: `Professional ${serviceName.toLowerCase()} installation, cleaning, and repair services ${locationHeader}. Certified technicians, transparent rates, and 30-day warranty.`,
    keyword: `${serviceName} ${locationHeader}`,
    heading: `${serviceName} Services ${locationHeader}`,
    intro: fallbackOverview || `Get premium Split & Window AC water jet washing, capillary diagnostics, compressor relays replacements, leak welds, and expert wall installations at clear upfront rates.`
  };

  if (!normCity) return defaultOverride;

  let cleanServiceSlug = serviceSlug;
  if (cleanServiceSlug === 'electrician-service') {
    cleanServiceSlug = 'electrician';
  }
  const key = `${cleanServiceSlug}-${normCity.toLowerCase().replace(/\s+/g, '-')}`;

  const overrides: Record<string, Partial<SEOOverride>> = {
    'ac-service-gaur-city-1': {
      title: 'AC Service in Gaur City 1 | Premium AC Repair & Jet Wash',
      description: 'Need AC service in Gaur City 1? Get professional split & window AC wet jet wash, diagnostic inspection, and gas refilling by certified local technicians.',
      keyword: 'AC Service in Gaur City 1',
      heading: 'Professional AC Service in Gaur City 1',
      intro: 'Looking for prompt AC service in Gaur City 1? Our certified team is located right here in Sector 4 to dispatch expert technicians to your home within 90 minutes. We offer deep high-pressure jet washing and general maintenance at transparent, upfront rates.'
    },
    'ac-service-gaur-city-2': {
      title: 'AC Repair in Gaur City 2 | Fast AC Gas Refill & Diagnostics',
      description: 'Get reliable AC Repair in Gaur City 2. Experienced engineers resolving cooling issues, gas leakages, capacitor faults, and coil welds. 30-day warranty.',
      keyword: 'AC Repair in Gaur City 2',
      heading: 'Expert AC Repair in Gaur City 2',
      intro: 'If your AC is not cooling properly, book expert AC repair in Gaur City 2. We resolve all major issues including compressor faults, copper pipe welding, gas leaks, and fan motor repairs with official 30-day warranty coverage.'
    },
    'ac-service-noida-extension': {
      title: 'AC Jet Wash in Noida Extension | High Pressure Deep Cleaning',
      description: 'Improve cooling efficiency with AC Jet Wash in Noida Extension. Deep eco chemical wash for split and window AC coils. Save on power bills today.',
      keyword: 'AC Jet Wash in Noida Extension',
      heading: 'Eco-Friendly AC Jet Wash in Noida Extension',
      intro: 'Ensure cleaner air and maximum cooling with our specialized AC Jet Wash in Noida Extension. Using 120-Bar high-pressure jet pumps, we flush out deep-seated mold, dirt, and dust from indoor cooling coils and outdoor condenser units.'
    },
    'ac-service-greater-noida-west': {
      title: 'AC Installation in Greater Noida West | Split & Window Setup',
      description: 'Certified AC Installation in Greater Noida West. Safe wall mounting, copper pipe layout, gas pressure testing, and removal services by professionals.',
      keyword: 'AC Installation in Greater Noida West',
      heading: 'AC Installation & Uninstall in Greater Noida West',
      intro: 'Get seamless AC installation in Greater Noida West by expert HVAC technicians. We handle secure bracket mounting, copper piping layout, nitrogen leak checks, and outdoor unit placement for window and split air conditioners.'
    },
    'ro-service-gaur-city-1': {
      title: 'RO Repair in Gaur City | Water Purifier Service Gaur City 1',
      description: 'Get fast RO Repair in Gaur City 1. We replace filters, membranes, pumps, and repair water purifier leakages for Kent, Aquaguard, and all major brands.',
      keyword: 'RO Repair in Gaur City',
      heading: 'Water Purifier RO Repair in Gaur City 1',
      intro: 'Ensure safe drinking water for your family with our expert RO repair in Gaur City. Our local technicians diagnose membrane choking, TDS imbalances, pump failures, and electrical faults, restoring pure water instantly.'
    },
    'ro-service-gaur-city-2': {
      title: 'RO Repair in Gaur City 2 | Water Purifier Service & Filter Change',
      description: 'Book RO Repair in Gaur City 2. Filter replacement, TDS adjustment, membrane cleaning, and leak repairs by local service experts at affordable rates.',
      keyword: 'RO Repair in Gaur City',
      heading: 'Doorstep RO Repair & Service in Gaur City 2',
      intro: 'In need of trusted water purifier help? We provide professional RO repair in Gaur City 2, handling Kent, Aquaguard, Havells, and local custom systems with authentic replacement filters and pumps.'
    },
    'ro-service-noida-extension': {
      title: 'RO Service in Noida Extension | Water Purifier Maintenance',
      description: 'Trusted RO Service in Noida Extension. Complete checkup, sediment & carbon filter replacements, TDS tuning, and membrane flushing. Book online.',
      keyword: 'RO Service in Noida Extension',
      heading: 'Reliable RO Service in Noida Extension',
      intro: 'Keep your water purifier working in top condition with professional RO service in Noida Extension. We clean filter housings, adjust TDS levels, flush the reverse osmosis membrane, and verify UV/UF chamber performance.'
    },
    'electrician-gaur-city-1': {
      title: 'Electrician in Gaur City 1 | Doorstep Electrical Repair',
      description: 'Need a professional Electrician in Gaur City 1? We repair short circuits, switches, MCBs, install fans, lights, geysers. Safe and certified help.',
      keyword: 'Electrician in Gaur City 1',
      heading: 'Safe & Certified Electrician in Gaur City 1',
      intro: 'For any urgent electrical faults, hire a safe, certified electrician in Gaur City 1. We handle short circuit troubleshooting, light fittings, geyser installations, fan repair, and inverter setups with premium quality safety standards.'
    },
    'electrician-gaur-city-2': {
      title: 'Electrician in Gaur City 2 | Switch, Fan & Geyser Repairs',
      description: 'Hire local Electrician in Gaur City 2. Expert circuit diagnostics, geyser installation, socket repair, MCB trip fixes. Fast 90-min doorstep service.',
      keyword: 'Electrician in Gaur City 2',
      heading: 'Professional Electrician in Gaur City 2',
      intro: 'Don\'t let electrical failures disrupt your home. Hire our expert electrician in Gaur City 2 for immediate switch replacement, power socket rewiring, MCB box upgrades, and geyser/inverter checks.'
    },
    'electrician-noida-extension': {
      title: 'Electrician in Noida Extension | Emergency Electrical Help',
      description: 'Looking for a certified Electrician in Greater Noida West & Noida Extension? Certified technicians for geysers, fans, smart switches, & rewiring.',
      keyword: 'Electrician in Greater Noida West',
      heading: 'Certified Electrician in Greater Noida West / Noida Extension',
      intro: 'We provide prompt, licensed electricians in Greater Noida West and Noida Extension. Our crew handles residential wiring faults, MCB trip diagnostics, ceiling fan installs, geyser maintenance, and fancy light fittings safely.'
    },
    'washing-machine-repair-gaur-city-1': {
      title: 'Washing Machine Repair in Noida Extension | Gaur City 1 Fixes',
      description: 'Expert Washing Machine Repair in Noida Extension & Gaur City 1. Resolving drum noise, water drain issues, motor failure in front & top load washers.',
      keyword: 'Washing Machine Repair in Noida Extension',
      heading: 'Washing Machine Repair in Noida Extension / Gaur City 1',
      intro: 'Get reliable washing machine repair in Noida Extension and Gaur City 1. Our technician team repairs all top-load, front-load, automatic, and semi-automatic models, solving drain pipe issues, drum noise, and motherboard errors.'
    },
    'refrigerator-repair-gaur-city-1': {
      title: 'Refrigerator Repair in Gaur City | Gaur City 1 Fridge Repair',
      description: 'Hire local Fridge Repair technician in Gaur City 1. Resolving cooling failure, gas charging, compressor relay replacement, single/double door fridge.',
      keyword: 'Refrigerator Repair in Gaur City',
      heading: 'Doorstep Refrigerator Repair in Gaur City 1',
      intro: 'Keep your food fresh with professional refrigerator repair in Gaur City 1. We resolve issues like AC compressor failure, gas leaks, defrost timer faults, thermostat calibration, and door gasket replacements.'
    },
    'chimney-service-gaur-city-1': {
      title: 'Chimney Service in Gaur City 1 | Deep Kitchen Chimney Clean',
      description: 'Kitchen Chimney Service in Gaur City 1. Deep filter degreasing, motor oil check, ducting setup, and blower repair. Certified doorstep service.',
      keyword: 'Chimney Service in Gaur City 1',
      heading: 'Deep Kitchen Chimney Service in Gaur City 1',
      intro: 'Remove tough oil grime and grease with professional chimney service in Gaur City 1. We disassemble filters, clean blowers with specialized chemicals, and verify suction speed to keep your kitchen smoke-free.'
    }
  };

  const override = overrides[key];
  if (override) {
    return {
      ...defaultOverride,
      ...override
    };
  }

  return defaultOverride;
};

const getCityInternalLinks = (currentServiceSlug: string, currentCityName: string) => {
  const citySlug = currentCityName.toLowerCase().replace(/\s+/g, '-');
  const linksList: { label: string; path: string }[] = [];

  const addLink = (slug: string, label: string) => {
    const prefix = slug === 'electrician-service' ? 'electrician' : slug;
    
    if (slug !== currentServiceSlug && prefix !== currentServiceSlug) {
      linksList.push({
        label,
        path: `/${prefix}-${citySlug}`
      });
    }
  };

  if (citySlug === 'gaur-city-1') {
    addLink('ac-service', 'AC Service in Gaur City 1');
    addLink('ro-service', 'RO Repair in Gaur City 1');
    addLink('electrician', 'Electrician in Gaur City 1');
    addLink('washing-machine-repair', 'Washing Machine Repair');
    addLink('refrigerator-repair', 'Refrigerator Repair');
    addLink('chimney-service', 'Chimney Service');
  } else if (citySlug === 'gaur-city-2') {
    addLink('ac-service', 'AC Repair in Gaur City 2');
    addLink('ro-service', 'RO Repair in Gaur City 2');
    addLink('electrician', 'Electrician in Gaur City 2');
  } else if (citySlug === 'noida-extension') {
    addLink('ac-service', 'AC Jet Wash in Noida Extension');
    addLink('ro-service', 'RO Service in Noida Extension');
    addLink('electrician', 'Electrician in Noida Extension');
  } else if (citySlug === 'greater-noida-west') {
    addLink('ac-service', 'AC Installation in Greater Noida West');
    linksList.push({
      label: 'Electrician in Greater Noida West',
      path: '/electrician-noida-extension'
    });
  }

  return linksList;
};

interface FAQ {
  q: string;
  a: string;
}

interface BaseServicePageProps {
  serviceSlug: string;
  serviceName: string;
  cityName?: string;
  overviewText: string;
  benefits: string[];
  processSteps: string[];
  faqs: FAQ[];
  catalogCategory: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const BaseServicePage: React.FC<BaseServicePageProps> = ({
  serviceSlug,
  serviceName,
  cityName,
  overviewText,
  benefits,
  processSteps,
  faqs,
  catalogCategory,
  services,
  cart,
  onAddToCart,
  onRemoveFromCart,
  businessConfig
}) => {
  const navigate = useNavigate();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Filter services belonging to this category
  const activeCategoryServices = services.filter(s => s.category === catalogCategory);

  const displayCity = cityName || '';

  // Resolve dynamic SEO Content overrides
  const seo = getSEOContent(serviceSlug, serviceName, displayCity, businessConfig.name, overviewText);
  const siteDomain = businessConfig.website.startsWith('http') ? businessConfig.website : `https://${businessConfig.website}`;
  const canonicalUrl = `${siteDomain}${window.location.pathname}`;

  // JSON-LD structured schemas
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "provider": {
      "@type": "LocalBusiness",
      "name": businessConfig.name,
      "image": `${siteDomain}${businessConfig.logoUrl}`,
      "telephone": `+91-${businessConfig.contacts[0]}`,
      "url": siteDomain
    },
    "areaServed": displayCity ? [displayCity] : businessConfig.serviceAreas,
    "description": seo.description,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": activeCategoryServices.length > 0 ? Math.min(...activeCategoryServices.map(s => s.price)) : 199,
      "highPrice": activeCategoryServices.length > 0 ? Math.max(...activeCategoryServices.map(s => s.price)) : 1499
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessConfig.name,
    "image": `${siteDomain}${businessConfig.logoUrl}`,
    "telephone": `+91-${businessConfig.contacts[0]}`,
    "email": businessConfig.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sector 4",
      "addressLocality": "Greater Noida West",
      "addressRegion": "UP",
      "postalCode": "201306",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5997,
      "longitude": 77.4526
    },
    "url": siteDomain,
    "priceRange": "₹₹",
    "areaServed": displayCity ? [displayCity] : businessConfig.serviceAreas
  };

  const breadcrumbsList = [
    { label: 'Services', path: '/services' },
    { label: serviceName, path: `/services/${serviceSlug}` }
  ];

  if (displayCity) {
    breadcrumbsList.push({ label: displayCity, path: window.location.pathname });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.label,
      "item": item.path ? `${siteDomain}${item.path}` : `${siteDomain}${window.location.pathname}`
    }))
  };

  // Handle CTA Booking Action
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Breadcrumb path navigation */}
      <Breadcrumbs items={breadcrumbsList} />

      {/* Service Hero section */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16 px-6 sm:px-12 text-left relative overflow-hidden font-sans">
        
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
            Verified Doorstep Utility
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            {seo.heading}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-semibold leading-relaxed max-w-2xl">
            {seo.intro}
          </p>
          <div className="flex flex-wrap gap-4 pt-2 select-none">
            <a 
              href="#pricing"
              className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer inline-flex items-center space-x-1.5"
            >
              <span>View Service Rates</span>
              <ArrowRight size={13} />
            </a>
            <a 
              href={`tel:${businessConfig.contacts[0]}`}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              📞 Call +91 {businessConfig.contacts[0]}
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="bg-gray-50 py-12 border-b border-gray-200" id="pricing">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="text-left">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none">
              Service Rates Matrix
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              Select specific tasks to add to your service booking card
            </p>
          </div>

          <ServiceGrid 
            services={activeCategoryServices} 
            selectedCategory={catalogCategory}
            cart={cart}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </div>
      </div>

      {/* Narrative Info Sections */}
      <div className="bg-white py-16 border-b border-gray-150 text-left font-sans">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Benefits */}
          <div className="space-y-6">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none border-b border-gray-100 pb-3">
              Why Book With Us
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">{benefit.split(':')[0]}</h3>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{benefit.split(':')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process steps */}
          <div className="space-y-6">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none border-b border-gray-100 pb-3">
              Our Service Process
            </h2>
            <div className="space-y-5 relative pl-6 border-l-2 border-gray-150">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[33px] top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white select-none">
                    {idx + 1}
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900">{step.split(':')[0]}</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{step.split(':')[1]}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FAQs Segment */}
      <div className="bg-gray-50 py-16 border-b border-gray-200 text-left font-sans">
        <div className="max-w-3xl mx-auto px-6 space-y-8 select-none">
          <div className="text-center sm:text-left">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none">
              Service FAQs
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              Common questions answered regarding {serviceName.toLowerCase()} repairs
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 font-bold text-gray-900 text-xs sm:text-sm hover:bg-gray-50/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <HelpCircle size={16} className="text-brand-blue shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 bg-gray-50/20 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local Internal Links Cluster */}
      {displayCity && (
        <div className="bg-white py-12 border-b border-gray-150 text-left font-sans select-none">
          <div className="max-w-4xl mx-auto px-6 space-y-4">
            <h3 className="text-gray-900 font-extrabold text-lg">
              Other Doorstep Services in {displayCity}
            </h3>
            <p className="text-xs text-gray-500 font-semibold">
              Find reliable certified technicians and transparent billing rates in your neighborhood:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {getCityInternalLinks(serviceSlug, displayCity).map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-brand-blue rounded-xl px-4 py-2 text-xs font-black transition-all shadow-xs cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Google Ads CTA banner */}
      <div className="bg-slate-900 text-white py-14 px-6 text-center relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 to-emerald-600/30 opacity-70" />
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <Shield className="mx-auto text-emerald-400 animate-pulse" size={40} />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            Ready to book your {serviceName.toLowerCase()}?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-relaxed max-w-lg mx-auto">
            Book now and get dispatch assignments within 90 minutes. Backed by our official 30-Day Service Warranty cover.
          </p>
          <button
            type="button"
            onClick={() => {
              // Add a default item if cart is empty to help them check out
              if (activeCategoryServices.length > 0 && Object.keys(cart).length === 0) {
                onAddToCart(activeCategoryServices[0]);
              }
              navigate('/checkout');
            }}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center space-x-1.5"
          >
            <span>Book Service Now</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </>
  );
};
