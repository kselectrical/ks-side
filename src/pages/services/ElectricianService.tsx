import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface ElectricianServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const ElectricianService: React.FC<ElectricianServiceProps> = (props) => {
  const benefits = [
    "Background-Verified Electricians: Safety-first professionals vetted through background checks.",
    "Advanced Leak Testing: Short-circuit testing, Megger grid isolations, and earthing scans.",
    "Shock-Proof Spares: Standard IS-Mark modular grids, RCCBs, and fire-retardant cabling."
  ];

  const processSteps = [
    "Safety Isolation: We switch off main breakers and isolate the grid zone before testing.",
    "Diagnostics & Locate: Running load meters to track earth leakages or short-circuits.",
    "Modular Repair/Wiring: Replacing components or pulling heavy load conduit wires.",
    "Load Load Testing: Digital testing under peak equipment load ensures 100% stable runs."
  ];

  const faqs = [
    {
      q: "Why is my home inverter not charging?",
      a: "This is usually caused by battery terminal corrosion, dry acid levels, or a tripped inverter output fuse. Our experts resolve this easily."
    },
    {
      q: "What is an RCCB and why do I need it?",
      a: "An RCCB is a Residual Current Circuit Breaker that instantly trips during human shock contact or earth leaks, saving lives and appliances."
    },
    {
      q: "Do you install heavy chandeliers?",
      a: "Yes, we install heavy chandeliers with double-anchor ceiling toggle bolts to support the weight safely."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="electrician-service"
      serviceName="Electrician Service"
      overviewText="Hire certified safety-first electricians for complete home wiring, modular board repair, smart lighting installation, MCB distributor upgrades, and inverter battery acid refilling."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Electrician Services"
    />
  );
};
export default ElectricianService;
