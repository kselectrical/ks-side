import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface ROServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const ROService: React.FC<ROServiceProps> = (props) => {
  const benefits = [
    "Certified Purifier Experts: Technicians trained in RO, UV, and UF filtration systems.",
    "TDS Level Calibration: Precise water quality adjustments to maintain levels between 80-120 ppm.",
    "High-Grade Spares: Imported sediment filters, activated pre-carbon units, and RO membranes."
  ];

  const processSteps = [
    "Pre-Filter Inspections: Assessing water pressure, solenoid valve circuits, and booster pumps.",
    "Carbon & Sediment Wash: Deep flush or replacement of clogged cartridges to ensure safe water flow.",
    "Membrane Diagnostics: Checking the RO membrane and adjusting output flow rates.",
    "TDS Testing: Post-assembly water purity scans to confirm safe mineral consumption."
  ];

  const faqs = [
    {
      q: "When should I replace my RO filters?",
      a: "For safe drinking water, pre-filters should be replaced every 6 months, and complete inline carbon/sediment kits annually."
    },
    {
      q: "What is TDS, and what level is safe?",
      a: "TDS stands for Total Dissolved Solids. A safe and healthy TDS level for drinking water is between 80 and 150 ppm."
    },
    {
      q: "Do you service all RO brands?",
      a: "Yes, our certified experts service all major brands, including Kent, Aquaguard, Pureit, Livpure, and Havells."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="ro-service"
      serviceName="RO Service"
      overviewText="Maintain pure, safe drinking water. Book expert RO purifier filter replacements, booster pump repairs, water leak sealing, and TDS calibrations."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Appliance Repair"
    />
  );
};
export default ROService;
