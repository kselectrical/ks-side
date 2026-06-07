import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ACService } from './services/ACService';
import { ROService } from './services/ROService';
import { ElectricianService } from './services/ElectricianService';
import { WashingMachineRepair } from './services/WashingMachineRepair';
import { RefrigeratorRepair } from './services/RefrigeratorRepair';
import { ChimneyService } from './services/ChimneyService';
import type { TechnicalService, CartItem } from '../types';
import type { BusinessConfig } from '../data';

interface LocalLandingPageProps {
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

const SERVICE_PREFIXES = [
  'ac-service',
  'ro-service',
  'electrician-service',
  'electrician',
  'washing-machine-repair',
  'refrigerator-repair',
  'chimney-service'
];

const normalizeLocationName = (slug: string): string => {
  if (slug === 'gaur-city-1') return 'Gaur City 1';
  if (slug === 'gaur-city-2') return 'Gaur City 2';
  if (slug === 'noida-extension') return 'Noida Extension';
  if (slug === 'greater-noida-west') return 'Greater Noida West';
  
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const LocalLandingPage: React.FC<LocalLandingPageProps> = (props) => {
  const { serviceCitySlug } = useParams<{ serviceCitySlug: string }>();

  if (!serviceCitySlug) {
    return <Navigate to="/404" replace />;
  }

  let serviceSlug = '';
  let rawCity = '';

  for (const prefix of SERVICE_PREFIXES) {
    if (serviceCitySlug.startsWith(prefix + '-')) {
      serviceSlug = prefix;
      rawCity = serviceCitySlug.substring(prefix.length + 1);
      break;
    }
  }

  if (!serviceSlug || !rawCity) {
    return <Navigate to="/404" replace />;
  }

  const cityName = normalizeLocationName(rawCity);

  // Render correct service component dynamically with city scope
  switch (serviceSlug) {
    case 'ac-service':
      return <ACService {...props} cityName={cityName} />;
    case 'ro-service':
      return <ROService {...props} cityName={cityName} />;
    case 'electrician-service':
    case 'electrician':
      return <ElectricianService {...props} cityName={cityName} />;
    case 'washing-machine-repair':
      return <WashingMachineRepair {...props} cityName={cityName} />;
    case 'refrigerator-repair':
      return <RefrigeratorRepair {...props} cityName={cityName} />;
    case 'chimney-service':
      return <ChimneyService {...props} cityName={cityName} />;
    default:
      return <Navigate to="/404" replace />;
  }
};
export default LocalLandingPage;
