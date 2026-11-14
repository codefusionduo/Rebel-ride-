export interface CarGearRatio {
  [gear: number]: number; // Gear number -> ratio
}

export interface CarConfig {
  id: string;
  name: string;
  type: 'hatchback' | 'sedan' | 'sports' | 'suv' | 'supercar';
  description: string;
  levelRequired: number;
  xpRequired: number;
  topSpeedKmH: number;
  horsePower: number;
  massKg: number;
  accentColor: string;
  secondaryColor: string;
  isAutomaticDefault: boolean;
  maxGears: number;
  gearRatios: CarGearRatio;
  redlineRpm: number;
  idleRpm: number;
  steeringAngleMax: number; // degrees
  interiorStyle: {
    dashboardColor: string;
    trimMaterial: 'plastic' | 'wood' | 'carbon' | 'leather';
    wheelType: 'standard' | 'sports' | 'luxury' | 'race';
    clusterType: 'analog' | 'hybrid' | 'digital';
    pedalStyle: 'rubber' | 'aluminum' | 'titanium';
  };
}

export const CAR_CATALOG: CarConfig[] = [
  {
    id: 'hatchback_swift',
    name: 'Swift City Hatch',
    type: 'hatchback',
    description: 'Nippy urban hatchback. Perfect for learning manual clutch bite points and city lane navigation.',
    levelRequired: 1,
    xpRequired: 0,
    topSpeedKmH: 140,
    horsePower: 110,
    massKg: 1050,
    accentColor: '#3b82f6', // Vivid Blue
    secondaryColor: '#1e293b',
    isAutomaticDefault: false, // Manual by default
    maxGears: 5,
    gearRatios: {
      [-1]: -3.4, // Reverse
      0: 0,       // Neutral
      1: 3.5,
      2: 2.1,
      3: 1.4,
      4: 1.0,
      5: 0.8,
    },
    redlineRpm: 6500,
    idleRpm: 800,
    steeringAngleMax: 35,
    interiorStyle: {
      dashboardColor: '#1e293b',
      trimMaterial: 'plastic',
      wheelType: 'standard',
      clusterType: 'analog',
      pedalStyle: 'rubber',
    },
  },
  {
    id: 'sedan_executive',
    name: 'Executive Sedan 2.0T',
    type: 'sedan',
    description: 'Smooth and refined 6-speed manual sedan with premium leather interior and digital cluster.',
    levelRequired: 2,
    xpRequired: 500,
    topSpeedKmH: 195,
    horsePower: 210,
    massKg: 1450,
    accentColor: '#0ea5e9', // Sky Blue
    secondaryColor: '#0f172a',
    isAutomaticDefault: false,
    maxGears: 6,
    gearRatios: {
      [-1]: -3.5,
      0: 0,
      1: 3.6,
      2: 2.2,
      3: 1.5,
      4: 1.1,
      5: 0.85,
      6: 0.68,
    },
    redlineRpm: 6800,
    idleRpm: 800,
    steeringAngleMax: 32,
    interiorStyle: {
      dashboardColor: '#0f172a',
      trimMaterial: 'wood',
      wheelType: 'luxury',
      clusterType: 'hybrid',
      pedalStyle: 'aluminum',
    },
  },
  {
    id: 'sports_coupe',
    name: 'GT Turbo Sport Coupe',
    type: 'sports',
    description: 'High-revving sports coupe with carbon interior, sports suspension and aggressive exhaust tone.',
    levelRequired: 3,
    xpRequired: 1500,
    topSpeedKmH: 250,
    horsePower: 380,
    massKg: 1380,
    accentColor: '#ef4444', // Red
    secondaryColor: '#111827',
    isAutomaticDefault: false,
    maxGears: 6,
    gearRatios: {
      [-1]: -3.6,
      0: 0,
      1: 3.8,
      2: 2.3,
      3: 1.6,
      4: 1.2,
      5: 0.92,
      6: 0.72,
    },
    redlineRpm: 7500,
    idleRpm: 900,
    steeringAngleMax: 28,
    interiorStyle: {
      dashboardColor: '#111827',
      trimMaterial: 'carbon',
      wheelType: 'sports',
      clusterType: 'digital',
      pedalStyle: 'aluminum',
    },
  },
  {
    id: 'suv_luxury_cruiser',
    name: 'Vanguard Luxury SUV (Auto)',
    type: 'suv',
    description: 'Ultra-smooth 8-speed Automatic luxury SUV. Panoramic glass cockpit and seamless gear transitions.',
    levelRequired: 4,
    xpRequired: 3000,
    topSpeedKmH: 220,
    horsePower: 450,
    massKg: 2100,
    accentColor: '#10b981', // Emerald
    secondaryColor: '#064e3b',
    isAutomaticDefault: true, // Automatic by default
    maxGears: 8,
    gearRatios: {
      [-1]: -3.5,
      0: 0,
      1: 4.2,
      2: 2.8,
      3: 1.9,
      4: 1.4,
      5: 1.0,
      6: 0.82,
      7: 0.68,
      8: 0.55,
    },
    redlineRpm: 6500,
    idleRpm: 750,
    steeringAngleMax: 34,
    interiorStyle: {
      dashboardColor: '#064e3b',
      trimMaterial: 'leather',
      wheelType: 'luxury',
      clusterType: 'digital',
      pedalStyle: 'aluminum',
    },
  },
  {
    id: 'supercar_hyperion',
    name: 'Hyperion V10 Supercar',
    type: 'supercar',
    description: 'Flagship V10 dual-clutch hypercar. Extreme acceleration, race track telemetry, active aerodynamics.',
    levelRequired: 5,
    xpRequired: 5000,
    topSpeedKmH: 330,
    horsePower: 750,
    massKg: 1280,
    accentColor: '#f59e0b', // Gold / Amber
    secondaryColor: '#18181b',
    isAutomaticDefault: true,
    maxGears: 7,
    gearRatios: {
      [-1]: -3.8,
      0: 0,
      1: 4.1,
      2: 2.6,
      3: 1.8,
      4: 1.35,
      5: 1.05,
      6: 0.85,
      7: 0.70,
    },
    redlineRpm: 8500,
    idleRpm: 1000,
    steeringAngleMax: 26,
    interiorStyle: {
      dashboardColor: '#18181b',
      trimMaterial: 'titanium' as 'carbon', // Titanium finish
      wheelType: 'race',
      clusterType: 'digital',
      pedalStyle: 'titanium',
    },
  },
];
