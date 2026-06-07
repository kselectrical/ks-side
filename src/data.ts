import type { TechnicalService } from './types';

export const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

export interface BusinessConfig {
  name: string;
  tagline: string;
  owner: string;
  contacts: string[];
  email: string;
  website: string;
  reviewLink: string;
  serviceAreas: string[];
  logoUrl: string;
  profileUrl: string;
}

export const businessConfig: BusinessConfig = {
  name: 'KS Electrical And AC Services',
  tagline: 'Powering Your Home, Safely',
  owner: 'Kaushindra Singh',
  contacts: ['7895321472', '9625724903'],
  email: 'kselectrical004@gmail.com',
  website: 'www.kselectrical.in',
  reviewLink: 'https://reviewthis.biz/b4d5f51f',
  serviceAreas: ['Gaur City 1', 'Gaur City 2', 'Noida Extension', 'Ghaziabad'],
  logoUrl: '/log.png',
  profileUrl: '/profile.png'
};

export const servicesData: TechnicalService[] = [
  // 1. AC Services (Core Focus)
  {
    id: 'ac-repair',
    name: 'AC Repairs & Gas Leak Fix',
    code: 'AC-REP',
    category: 'AC Services',
    subcategory: 'Repair & gas refill',
    description: 'Expert diagnostics for AC cooling failure, compressor repair, capillary replacement, and R32/R22 gas leak checking.',
    iconName: 'Wind',
    duration: '45 mins',
    rating: '4.8 ★ (1.2k reviews)',
    price: 349,
    warranty: '30 Days Warranty',
    imageUrl: '/ac_service.png',
    specifications: [
      { label: 'Cooling Guarantee', value: '30 Days' },
      { label: 'Technician Skill', value: 'Certified Expert' },
      { label: 'Gas Leak Check', value: 'Halogen sensor test' }
    ]
  },
  {
    id: 'ac-installation',
    name: 'AC Installation & Removal',
    code: 'AC-INST',
    category: 'AC Services',
    subcategory: 'Installation/uninstallation',
    description: 'Wall-mounting split ACs, outdoor bracket setup, piping insulation, drain ducting, and window AC fitting.',
    iconName: 'Settings',
    duration: '1-2 hours',
    rating: '4.9 ★ (840 reviews)',
    price: 799,
    warranty: '90 Days Warranty',
    imageUrl: '/ac_service.png',
    specifications: [
      { label: 'Gas Top-up Check', value: 'Included' },
      { label: 'Bracket Material', value: 'Galvanized steel' },
      { label: 'Pipe Insulation', value: 'Included' }
    ]
  },
  {
    id: 'ac-wet-clean',
    name: 'AC Jet Cleaning & Service',
    code: 'AC-WET',
    category: 'AC Services',
    subcategory: 'Service',
    description: 'Deep high-pressure water jet wash of AC coils, blower drums, filter mats, and outdoor cooling fins.',
    iconName: 'Droplets',
    duration: '40 mins',
    rating: '4.9 ★ (2.1k reviews)',
    price: 399,
    warranty: '30 Days Warranty',
    imageUrl: '/ac_service.png',
    specifications: [
      { label: 'Jet Pressure', value: '120 Bar' },
      { label: 'Sanitizer Spray', value: 'Eco-friendly' },
      { label: 'Airflow Boost', value: 'Up to +35%' }
    ]
  },

  // 2. Electrician Services (Core Focus & Expanded)
  {
    id: 'elec-wiring',
    name: 'Complete House Wiring & Trace',
    code: 'ELE-WIRE',
    category: 'Electrician Services',
    subcategory: 'Wiring',
    description: 'Full residential wiring trace, tracing earth leaks, repairing open circuits, short-circuit diagnostics, and conduit channel setups.',
    iconName: 'Activity',
    duration: '2-4 hours',
    rating: '4.9 ★ (1.6k reviews)',
    price: 999,
    warranty: '90 Days Warranty',
    imageUrl: '/electrical_safety_service.png',
    specifications: [
      { label: 'Wire Grade', value: 'FR-LSH Grade 1' },
      { label: 'Isolation check', value: 'Megger digital scan' },
      { label: 'Earthing check', value: 'Included' }
    ]
  },
  {
    id: 'elec-modular-board',
    name: 'Modular Board Switch Repair',
    code: 'ELE-SWT',
    category: 'Electrician Services',
    subcategory: 'Switch & socket',
    description: 'Replacing modular switches, multi-pin sockets, main switch boards, indicator lights, and modular grid box repairs.',
    iconName: 'Zap',
    duration: '30 mins',
    rating: '4.9 ★ (920 reviews)',
    price: 119,
    warranty: '30 Days Warranty',
    imageUrl: '/electric_switch.png',
    specifications: [
      { label: 'Safety standard', value: 'IS-Mark certified' },
      { label: 'Load threshold', value: 'Up to 16A slots' },
      { label: 'Grid testing', value: 'Included' }
    ]
  },
  {
    id: 'elec-inverter',
    name: 'Inverter & Battery Diagnostics',
    code: 'ELE-INV',
    category: 'Electrician Services',
    subcategory: 'MCB/fuse',
    description: 'Installing double-battery inverters, acid refilling, terminal corrosion cleaning, backup checks, and circuit repairs.',
    iconName: 'Activity',
    duration: '45 mins',
    rating: '4.9 ★ (510 reviews)',
    price: 249,
    warranty: '30 Days Warranty',
    imageUrl: '/electrical_safety_service.png',
    specifications: [
      { label: 'Backup Test', value: 'Load checked' },
      { label: 'Battery terminal', value: 'Anti-corrosion spray' },
      { label: 'Acid level top-up', value: 'Included' }
    ]
  },
  {
    id: 'elec-mcb',
    name: 'MCB & Distribution Box Upgrade',
    code: 'ELE-MCB',
    category: 'Electrician Services',
    subcategory: 'MCB/fuse',
    description: 'Replacing old fuses with smart MCBs, RCCB shock protector installation, sub-distribution board fitting.',
    iconName: 'Settings',
    duration: '1 hour',
    rating: '4.9 ★ (720 reviews)',
    price: 399,
    warranty: '90 Days Warranty',
    imageUrl: '/electrical_safety_service.png',
    specifications: [
      { label: 'Trip response time', value: '< 30ms verified' },
      { label: 'MCB Rating', value: 'B-Curve residential' },
      { label: 'DB Box grade', value: 'Double-door metal' }
    ]
  },
  {
    id: 'elec-lighting',
    name: 'Smart LED & Chandelier Fitting',
    code: 'ELE-LGT',
    category: 'Electrician Services',
    subcategory: 'Light',
    description: 'Hanging heavy chandeliers, smart LED strip fittings, wall brackets, track lights, and profile lamp layouts.',
    iconName: 'Zap',
    duration: '1 hour',
    rating: '4.9 ★ (880 reviews)',
    price: 299,
    warranty: '30 Days Warranty',
    imageUrl: '/tube_light.jpg',
    specifications: [
      { label: 'Mount anchor', value: 'High strength toggle' },
      { label: 'Ceiling bracket', value: 'Weight support tested' },
      { label: 'Wiring sync', value: 'Included' }
    ]
  },
  {
    id: 'elec-doorbell',
    name: 'Doorbell & Intercom Diagnostics',
    code: 'ELE-BEL',
    category: 'Electrician Services',
    subcategory: 'Doorbell & security',
    description: 'Repairing multi-tune doorbells, wiring checks for digital doorlocks, and troubleshooting intercom lines.',
    iconName: 'Phone',
    duration: '30 mins',
    rating: '4.9 ★ (310 reviews)',
    price: 99,
    warranty: '15 Days Warranty',
    imageUrl: '/electric_switch.png',
    specifications: [
      { label: 'Intercom lines', value: '2-core/4-core tested' },
      { label: 'Bell transformer', value: 'Checked' },
      { label: 'Switch replacement', value: 'IS-Mark water-proof' }
    ]
  },
  {
    id: 'elec-fan-repair',
    name: 'Ceiling & Exhaust Fan Repair',
    code: 'ELE-FAN',
    category: 'Electrician Services',
    subcategory: 'Fan',
    description: 'Servicing ceiling fans, winding diagnostics, exhaust fan installations, capacitor switches, and noise elimination.',
    iconName: 'Zap',
    duration: '40 mins',
    rating: '4.9 ★ (1.1k reviews)',
    price: 119,
    warranty: '30 Days Warranty',
    imageUrl: '/fan_repair_service.png',
    specifications: [
      { label: 'Capacitor Spec', value: '2.5 mfd heavy-duty' },
      { label: 'Motor Winding', value: 'Copper-wire checked' },
      { label: 'Noise standard', value: '< 45 dB silent run' }
    ]
  },

  // 3. Appliance Repair (Sub-Categories)
  {
    id: 'app-ro-water',
    name: 'RO Water Purifier Servicing',
    code: 'APP-RO',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Filter membrane replacement, pre-carbon wash, sediment clean, and TDS levels calibration.',
    iconName: 'Droplets',
    duration: '1 hour',
    rating: '4.8 ★ (1.1k reviews)',
    price: 299,
    warranty: '30 Days Warranty',
    imageUrl: '/ro_service.png',
    specifications: [
      { label: 'Sediment Filter', value: 'Replaced standard' },
      { label: 'TDS Adjustment', value: 'Target 80-120 ppm' },
      { label: 'Solenoid Valve', value: 'Checked' }
    ]
  },
  {
    id: 'app-washing',
    name: 'Washing Machine Servicing',
    code: 'APP-WASH',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Fixing drum vibration, drainage locks, belt failures, sensor faults, and inlet water blockage repairs.',
    iconName: 'Cpu',
    duration: '1.5 hours',
    rating: '4.8 ★ (910 reviews)',
    price: 349,
    warranty: '30 Days Warranty',
    imageUrl: '/washing_machine_service.png',
    specifications: [
      { label: 'Spare Parts', value: 'OEM replacement' },
      { label: 'Drum alignment', value: 'Balanced check' },
      { label: 'Vibration limit', value: 'Under 1.2G' }
    ]
  },
  {
    id: 'app-fridge',
    name: 'Refrigerator Gas Charging',
    code: 'APP-REF',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Gas checks and refilling, capillary leaks seal, cooling thermostat replacements, and condenser fan repair.',
    iconName: 'Snowflake',
    duration: '2 hours',
    rating: '4.9 ★ (760 reviews)',
    price: 999,
    warranty: '90 Days Warranty',
    imageUrl: '/refrigerator_service.png',
    specifications: [
      { label: 'Gas Code', value: 'Eco R134a/R600a' },
      { label: 'Leak detection', value: 'Halogen gas trace' },
      { label: 'Thermostat', value: 'Calibrated' }
    ]
  },
  {
    id: 'app-microwave',
    name: 'Microwave Oven Repair',
    code: 'APP-MCR',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Replacing burnt magnetrons, turntable motor replacements, door switches, and control board repairs.',
    iconName: 'Zap',
    duration: '45 mins',
    rating: '4.7 ★ (410 reviews)',
    price: 299,
    warranty: '30 Days Warranty',
    imageUrl: '/microwave_service.png',
    specifications: [
      { label: 'Magnetron', value: 'Genuine OEM' },
      { label: 'Radiation test', value: 'Safe under 5 mW/cm²' },
      { label: 'Thermostat fuse', value: 'Checked' }
    ]
  },
  {
    id: 'app-geyser',
    name: 'Geyser Heating Element Fixing',
    code: 'APP-GEY',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Thermostat replacement, heating element scale removal, pressure release valve check, and wiring insulation tests.',
    iconName: 'Flame',
    duration: '40 mins',
    rating: '4.8 ★ (890 reviews)',
    price: 249,
    warranty: '30 Days Warranty',
    imageUrl: '/geyser_service.png',
    specifications: [
      { label: 'Heating Jacket', value: 'Heavy copper' },
      { label: 'Safety cutout', value: 'Verified at 65°C' },
      { label: 'Earth current', value: '0.00 mA safe' }
    ]
  },
  {
    id: 'app-pcb',
    name: 'Appliance Control PCB Repair',
    code: 'APP-PCB',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Motherboard soldering, resolving display errors, inverter card repairs for washing machines and HVAC units.',
    iconName: 'Cpu',
    duration: '24 hours',
    rating: '4.9 ★ (320 reviews)',
    price: 499,
    warranty: '30 Days Warranty',
    imageUrl: '/electrical_safety_service.png',
    specifications: [
      { label: 'Soldering core', value: 'Silver compound' },
      { label: 'IC Programming', value: 'Original firmware' },
      { label: 'Coating', value: 'Anti-humidity lacquer' }
    ]
  },
  {
    id: 'app-chimney',
    name: 'Kitchen Chimney Deep Servicing',
    code: 'APP-CHM',
    category: 'Appliance Repair',
    subcategory: 'Appliances',
    description: 'Baffle filter caustic soda wash, motor blower degreasing, carbon filter diagnostics, and suction load alignment.',
    iconName: 'Flame',
    duration: '1.5 hours',
    rating: '4.9 ★ (680 reviews)',
    price: 499,
    warranty: '30 Days Warranty',
    imageUrl: '/microwave_service.png',
    specifications: [
      { label: 'Grease extraction', value: 'Caustic soda deep wash' },
      { label: 'Suction check', value: 'Anemometer measured' },
      { label: 'Blower balance', value: 'Vibration dampening' }
    ]
  },

  // 4. Home Installations
  {
    id: 'home-pigeon',
    name: 'Balcony Pigeon Net Installation',
    code: 'HOM-NET',
    category: 'Home Installations',
    subcategory: 'Book a consultation',
    description: 'Robust HDPE nylon safety nets, stainless steel anchor hooks, and pigeon bird proofing layout grids.',
    iconName: 'Shield',
    duration: '3 hours',
    rating: '4.9 ★ (640 reviews)',
    price: 1200,
    warranty: '3 Year Warranty',
    imageUrl: '/geyser_service.png',
    specifications: [
      { label: 'Net Mesh', value: 'HDPE UV Stabilized Nylon' },
      { label: 'Hook Anchors', value: 'Stainless steel 304' },
      { label: 'Warranty Scope', value: '3 Years full coverage' }
    ]
  },
  {
    id: 'home-plumber',
    name: 'Doorstep Plumbing Utilities',
    code: 'HOM-PLM',
    category: 'Home Installations',
    subcategory: 'Book a consultation',
    description: 'Faucet leaks repair, sink pipe blockages, washbasin installations, and toilet flush valve checkups.',
    iconName: 'Wrench',
    duration: '1 hour',
    rating: '4.7 ★ (1.1k reviews)',
    price: 199,
    warranty: '15 Days Warranty',
    imageUrl: '/geyser_service.png',
    specifications: [
      { label: 'Pipe Sealants', value: 'Teflon and anaerobic paste' },
      { label: 'Fitting Grade', value: 'ASTM UPVC / CPVC' },
      { label: 'Flow Pressure', value: 'Up to 8 Bar' }
    ]
  },
  {
    id: 'home-carpenter',
    name: 'Carpentry Adjustments & Repairs',
    code: 'HOM-CRP',
    category: 'Home Installations',
    subcategory: 'Book a consultation',
    description: 'Replacing door locks, drawer slider fittings, kitchen cabinet hinge realignments, and minor wood fixes.',
    iconName: 'Hammer',
    duration: '1.5 hours',
    rating: '4.8 ★ (820 reviews)',
    price: 249,
    warranty: '15 Days Warranty',
    imageUrl: '/geyser_service.png',
    specifications: [
      { label: 'SS Hinge Check', value: 'Soft-close checked' },
      { label: 'Cutting accuracy', value: 'Under ±0.5 mm' },
      { label: 'Polishing Touch', value: 'Included for repairs' }
    ]
  },
  {
    id: 'home-ceiling',
    name: 'Gypsum False Ceiling Service',
    code: 'HOM-CLG',
    category: 'Home Installations',
    subcategory: 'Book a consultation',
    description: 'Designing false ceilings, G.I. metallic support grids, gypsum paneling, and cove light fittings.',
    iconName: 'Layout',
    duration: '2-3 Days',
    rating: '4.9 ★ (210 reviews)',
    price: 4999,
    warranty: '5 Year Warranty',
    imageUrl: '/geyser_service.png',
    specifications: [
      { label: 'Gypsum Board', value: 'Saint-Gobain Gyproc' },
      { label: 'Metal Grid Frame', value: 'Galvanized iron' },
      { label: 'Fire Rating', value: 'Class 0 certified' }
    ]
  }
];

export const mockSuggestions = [
  'AC Wet Cleaning service',
  'Electrician wiring fitting',
  'Geyser heating element fixing',
  'Pigeon Net balcony installation',
  'RO Purifier filter replacement'
];
