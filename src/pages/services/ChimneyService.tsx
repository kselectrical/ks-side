import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface ChimneyServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const ChimneyService: React.FC<ChimneyServiceProps> = (props) => {
  const benefits = [
    "Caustic Soda Deep Degreasing: Specialized chemical bath dissolves thick oil, soot, and grease on filters.",
    "Rotor Blower Servicing: Balancing and oiling the blower unit to maximize suction power.",
    "Auto-Clean Diagnostics: Troubleshooting heating coils in modern filter-less auto-clean chimneys."
  ];

  const processSteps = [
    "Dismount & Access: Safely dismounting panels and removing baffle or mesh filter grids.",
    "Caustic Clean: Soaking filters in a caustic soda solution to remove grease.",
    "Blower Oiling: Cleaning internal fan blades, oiling motor bearings, and inspecting ducts.",
    "Reassemble & Suction Test: Mounting components back and verifying flow suction using digital gauges."
  ];

  const faqs = [
    {
      q: "How often should I clean my kitchen chimney filters?",
      a: "For standard Indian cooking with high spices/oils, chimney filters should be cleaned every 2 to 3 months to prevent motor load."
    },
    {
      q: "Why has the suction power of my chimney decreased?",
      a: "This is usually caused by heavy grease deposits blocking the filter mesh, fan blade dirt buildup, or exhaust duct blockages."
    },
    {
      q: "Do you repair chimney motor problems?",
      a: "Yes, we diagnose motor capacitor failures, winding faults, and replace motor bearings or complete motors if required."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="chimney-service"
      serviceName="Chimney Service"
      overviewText="Restore suction power and remove grease. Book expert kitchen chimney baffle filter degreasing, carbon filter replacements, and auto-clean blower diagnostics."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Appliance Repair"
    />
  );
};
export default ChimneyService;
