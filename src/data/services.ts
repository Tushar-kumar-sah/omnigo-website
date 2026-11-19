import { ServiceItem } from '../types';

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'TOW_FLATBED',
    title: 'Flatbed Heavy Towing',
    description: 'Damage-free hydraulic flatbed transport for Luxury, AWD, Low-clearance & EV vehicles.',
    basePrice: 2500,
    perMilePrice: 50,
    iconName: 'Truck',
    badge: 'Popular',
    popular: true
  },
  {
    id: 'BATTERY_JUMP',
    title: 'Battery Jump & Diagnostics',
    description: 'Instant 12V/48V boost, alternator load test, and optional on-site battery replacement.',
    basePrice: 600,
    perMilePrice: 0,
    iconName: 'Zap',
    badge: '12 min ETA',
    popular: true
  },
  {
    id: 'EV_CHARGING',
    title: 'Mobile EV Fast Charging',
    description: 'On-demand high-speed DC mobile charger dispatched directly to your depleted EV.',
    basePrice: 1200,
    perMilePrice: 30,
    iconName: 'BatteryCharging',
    badge: 'OMNIGO Exclusive',
    popular: true
  },
  {
    id: 'FLAT_TIRE',
    title: 'Flat Tire Change & Plug',
    description: 'On-site spare wheel swap, puncture repair plug, and tire pressure inflation.',
    basePrice: 800,
    perMilePrice: 0,
    iconName: 'Disc'
  },
  {
    id: 'LOCKOUT',
    title: 'Vehicle Lockout Rescue',
    description: 'Damage-free air-wedge unlocking for lost or locked-in key fobs.',
    basePrice: 1000,
    perMilePrice: 0,
    iconName: 'Key'
  },
  {
    id: 'FUEL_DELIVERY',
    title: 'Emergency Fuel & AdBlue',
    description: 'Delivery of up to 10 liters of Premium Petrol, Diesel or AdBlue.',
    basePrice: 500,
    perMilePrice: 0,
    iconName: 'Fuel'
  },
  {
    id: 'WINCHING',
    title: 'Winching & Mud Extraction',
    description: 'Heavy duty steel cable recovery for off-road stuck vehicles in snow, mud or ditches.',
    basePrice: 1500,
    perMilePrice: 50,
    iconName: 'Anchor'
  },
  {
    id: 'ACCIDENT_RECOVERY',
    title: 'Crash & Accident Recovery',
    description: 'Specialized emergency clearing, police lot towing, and insurance documentation.',
    basePrice: 2500,
    perMilePrice: 50,
    iconName: 'ShieldAlert',
    badge: '24/7 Priority'
  },
  {
    id: 'BIKE_TRANSPORT',
    title: 'Motorcycle & Superbike Tow',
    description: 'Soft-strap specialized wheel cradles for sports, cruiser & touring motorcycles.',
    basePrice: 1800,
    perMilePrice: 50,
    iconName: 'Bike'
  },
  {
    id: 'FLEET_LOGISTICS',
    title: 'Enterprise Fleet & Logistics',
    description: 'Commercial multi-vehicle transport, scheduled carrier routes & telemetry monitoring.',
    basePrice: 8000,
    perMilePrice: 60,
    iconName: 'Briefcase'
  }
];

export const MEMBERSHIP_PLANS = [
  {
    id: 'ESSENTIAL',
    name: 'OMNIGO Essential',
    tagline: 'Ideal for individual commuters & daily drivers.',
    monthlyPrice: 499,
    annualPrice: 4999,
    features: [
      '3 Free Roadside Rescues per Year',
      'Up to 25 Km Free Towing per Incident',
      'Free Battery Jump Starts & Lockouts',
      '15-Minute Priority Dispatch Guarantee',
      'Mobile App Real-time Driver GPS Track',
      'Standard Member Discounts on Repairs'
    ],
    highlight: false,
    cta: 'Select Essential'
  },
  {
    id: 'PREMIUM',
    name: 'OMNIGO Diamond',
    tagline: 'Unmatched peace of mind for families & luxury vehicle owners.',
    monthlyPrice: 999,
    annualPrice: 9999,
    features: [
      'Unlimited Roadside Assistance Claims',
      'Up to 150 Km Free Towing per Incident',
      'Free EV Mobile Fast Charging Top-Ups',
      '5-Minute Ultra Emergency SOS Dispatch',
      'Zero Deductible Key Replacement Cover',
      'Full Trip Interruption Expense Coverage (₹75,000)',
      'Dedicated VIP Concierge Hotline'
    ],
    highlight: true,
    badge: 'MOST POPULAR',
    cta: 'Upgrade to Diamond'
  },
  {
    id: 'ENTERPRISE',
    name: 'OMNIGO Fleet Command',
    tagline: 'Tailored for corporate fleets, car rentals & logistics operators.',
    monthlyPrice: 1999,
    annualPrice: 19999,
    features: [
      'Multi-Vehicle Fleet Telemetry Integration',
      'Unlimited Commercial Towing & Heavy Winching',
      'Dedicated Fleet Operations Dashboard',
      'Automated Consolidated Invoicing & GST Reports',
      'Custom SLA with Guaranteed Sub-10 Min Response',
      'API Access for Custom ERP / Fleet Software',
      '24/7 Enterprise Dedicated Account Manager'
    ],
    highlight: false,
    cta: 'Contact Fleet Sales'
  }
];

export const TESTIMONIALS = [
  {
    name: 'David K. Chen',
    role: 'Tesla Model S Plaid Owner',
    company: 'Silicon Valley Founder',
    comment: 'When my EV battery dropped unexpectedly on Highway 101 at 11 PM, OMNIGO arrived in 7 minutes with a mobile DC fast charger. Their live GPS tracking in the app is sleeker than Uber.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Fleet Manager',
    company: 'Apex Logistics & Express',
    comment: 'Managing a fleet of 45 delivery vans used to be a roadside nightmare. OMNIGO Fleet Command dashboard gives us total live telemetry, instant dispatch, and zero operational downtime.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Marcus Thorne',
    role: 'Commercial Driver Captain',
    company: 'OMNIGO Certified Tow Operator',
    comment: 'The Partner Driver app is light years ahead of old radio dispatchers. I get instant job details, turn-by-turn routing, customer OTP check-ins, and direct daily wallet payouts.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const TRUSTED_COMPANIES = [
  { name: 'TESLA FLEET', logo: '⚡ TESLA' },
  { name: 'RIVIAN MOBILITY', logo: '⚡ RIVIAN' },
  { name: 'UBER FREIGHT', logo: '📦 UBER FREIGHT' },
  { name: 'HERTZ RENTALS', logo: '🚗 HERTZ' },
  { name: 'ALPHABET LOGISTICS', logo: '🌐 ALPHABET' },
  { name: 'STRIPE CORPORATE', logo: '💳 STRIPE' }
];

export const FAQS = [
  {
    question: 'How fast does an OMNIGO Towing or Service Unit arrive?',
    answer: 'Our proprietary AI dispatch engine matches your exact breakdown coordinates with the closest active OMNIGO captain. Across metropolitan zones, our average response time is 7 to 12 minutes.'
  },
  {
    question: 'Does OMNIGO support Low-Clearance EVs & Luxury Sports Cars?',
    answer: 'Yes! All OMNIGO towing captains operate zero-angle hydraulic flatbeds fitted with soft-strap wheel cradles specifically designed to prevent undercarriage damage on low ground clearance sports cars, EVs, and exotic vehicles.'
  },
  {
    question: 'How does Mobile EV Fast Charging work?',
    answer: 'Our mobile charging units carry high-density DC fast batteries capable of adding 30–50 km of EV range in under 15 minutes, allowing you to easily reach the nearest Supercharger or destination.'
  },
  {
    question: 'Can I track my rescue vehicle in real-time?',
    answer: 'Absolutely. Once a job is accepted, your mobile or web app displays live turn-by-turn GPS tracking of the dispatched unit, driver contact details, vehicle plate number, and estimated arrival clock.'
  },
  {
    question: 'How do payments work?',
    answer: 'You can pay instantly via credit/debit card, Apple Pay, Google Pay, Razorpay, or your pre-funded OMNIGO Wallet. Members receive automatic complimentary coverage applied directly to invoice totals.'
  }
];
