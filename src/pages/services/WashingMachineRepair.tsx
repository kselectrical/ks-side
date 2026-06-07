import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface WashingMachineRepairProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const WashingMachineRepair: React.FC<WashingMachineRepairProps> = (props) => {
  const benefits = [
    "OEM Components Only: Gearboxes, inlet valves, timers, and belts are replaced with original brand spares.",
    "Suspension Tuning: Balanced drum calibration to eliminate heavy spin noise and walking issues.",
    "Control PCB Repair: Soldering and microchip program flashing for display errors and water locks."
  ];

  const processSteps = [
    "Error Logs Scan: Checking control board codes to identify inlet, drain, or rotation failures.",
    "Drum & Motor Check: Inspecting carbon brushes, drain pumps, tension belts, and shock dampers.",
    "OEM Part Install: Fitting high-quality replacements with proper silicone seals and terminal clamps.",
    "Spin Run Test: Calibrating rotation under wet load to guarantee quiet, smooth runs."
  ];

  const faqs = [
    {
      q: "Why is my washing machine not draining water?",
      a: "This is usually caused by a coin or lint block in the drain pump filter, or a burnt drain pump motor. Our experts can clean or replace it."
    },
    {
      q: "My machine makes loud noise during spin. What is the issue?",
      a: "Loud noise during spin cycle is caused by worn drum bearings, a broken tub suspension spring, or damaged shock absorbers."
    },
    {
      q: "Do you repair both top load and front load washers?",
      a: "Yes, our certified technicians are trained to repair all top load, front load, semi-automatic, and fully automatic washing machines."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="washing-machine-repair"
      serviceName="Washing Machine Repair"
      overviewText="Solve drum vibration, spin noise, water drainage blockages, control card display errors, and inlet valve leaks with our professional washing machine technicians."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Appliance Repair"
    />
  );
};
export default WashingMachineRepair;
