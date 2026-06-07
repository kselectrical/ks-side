import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface RefrigeratorRepairProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const RefrigeratorRepair: React.FC<RefrigeratorRepairProps> = (props) => {
  const benefits = [
    "Certified Compressor Experts: Technicians trained in linear inverter and standard refrigerator compressors.",
    "Eco R134a/R600a Gas Refill: Complete vacuuming and nitrogen leak testing before precise gas charging.",
    "Quick Thermostat Tuning: Defrost timers, fan motors, and thermal cutouts are calibrated perfectly."
  ];

  const processSteps = [
    "Thermal Auditing: Assessing ice buildup, freezer temperatures, and thermostat relays.",
    "Gas Leakage Check: Using pressure checks to locate leaks in the condenser coil or capillary tubes.",
    "Filter Dryer Install: Soldering a new filter dryer, leak patching, and deep vacuuming.",
    "Gas Refilling & Load Test: Precision charging using digital scales and verifying starting currents."
  ];

  const faqs = [
    {
      q: "Why is the freezer cooling but the lower compartment is not?",
      a: "This is usually caused by a blocked air damper, a faulty defrost fan motor, or a failed defrost heater/timer."
    },
    {
      q: "How long does refrigerator gas charging take?",
      a: "A complete gas charging session, including vacuuming, leak sealing, and recharging, takes about 1.5 to 2 hours."
    },
    {
      q: "Do you offer warranty on gas charging?",
      a: "Yes, we offer an official 90-Day warranty cover on refrigerator gas charging and leak seal repairs."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="refrigerator-repair"
      serviceName="Refrigerator Repair"
      overviewText="Fix cooling failure, capillary leaks, condenser fan noise, automatic defrost timers, and get eco-friendly gas charging for single/double-door refrigerators."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Appliance Repair"
    />
  );
};
export default RefrigeratorRepair;
