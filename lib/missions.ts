export interface MissionWaypoint {
  x: number;
  z: number;
  label: string;
}

export interface DrivingMission {
  id: string;
  title: string;
  description: string;
  category: 'takeoff' | 'traffic' | 'parking' | 'highway' | 'weather';
  xpReward: number;
  targetObjective: string;
  isCompleted: boolean;
  waypoint: MissionWaypoint;
}

export const INITIAL_MISSIONS: DrivingMission[] = [
  {
    id: 'm1_takeoff',
    title: 'Mission 1: Smooth Clutch Takeoff',
    description: 'Depress the clutch pedal, engage 1st gear, smoothly release the clutch while pressing throttle without stalling the engine.',
    category: 'takeoff',
    xpReward: 200,
    targetObjective: 'Drive forward to the Central Avenue Checkpoint.',
    isCompleted: false,
    waypoint: { x: 4.5, z: 75, label: 'Central Ave Checkpoint' },
  },
  {
    id: 'm2_gear_shifting',
    title: 'Mission 2: Sequential Gear Upshift',
    description: 'Accelerate and smoothly shift up through 1st, 2nd, and 3rd gear in manual mode.',
    category: 'takeoff',
    xpReward: 300,
    targetObjective: 'Reach 40 km/h and drive to North Intersection.',
    isCompleted: false,
    waypoint: { x: 4.5, z: 240, label: 'North Ave Intersection' },
  },
  {
    id: 'm3_traffic_lights',
    title: 'Mission 3: City Traffic & Stop Sign',
    description: 'Navigate city streets and bring your vehicle to a complete smooth stop at a red traffic light or stop zone.',
    category: 'traffic',
    xpReward: 400,
    targetObjective: 'Stop within the green marked stopping box at West Signal.',
    isCompleted: false,
    waypoint: { x: -120, z: 120, label: 'West Traffic Signal' },
  },
  {
    id: 'm4_parallel_parking',
    title: 'Mission 4: Reverse Bay Parking',
    description: 'Engage Reverse gear (R), check your mirrors, and back smoothly into the designated yellow parking bay.',
    category: 'parking',
    xpReward: 600,
    targetObjective: 'Park inside the designated yellow parking bay on Central Ave.',
    isCompleted: false,
    waypoint: { x: 6.5, z: 165, label: 'Yellow Parking Bay' },
  },
  {
    id: 'm5_highway_cruise',
    title: 'Mission 5: High-Speed Highway Cruise',
    description: 'Cruising at speed! Accelerate to 90+ km/h on the outer ring road and test Automatic transmission mode.',
    category: 'highway',
    xpReward: 800,
    targetObjective: 'Cruise to the East Highway Corridor at 90+ km/h.',
    isCompleted: false,
    waypoint: { x: 240, z: 120, label: 'East Highway Corridor' },
  },
];

export interface DriverStats {
  xp: number;
  coins: number;
  level: number;
  totalDistanceMeters: number;
  cleanTakeoffs: number;
  perfectShifts: number;
  stallsCount: number;
  collisionsCount: number;
  redLightsObeyed: number;
  selectedCarId: string;
  unlockedCarIds: string[];
  transmissionMode: 'manual' | 'automatic';
}

export const DEFAULT_DRIVER_STATS: DriverStats = {
  xp: 0,
  coins: 10,
  level: 1,
  totalDistanceMeters: 0,
  cleanTakeoffs: 0,
  perfectShifts: 0,
  stallsCount: 0,
  collisionsCount: 0,
  redLightsObeyed: 0,
  selectedCarId: 'hatchback_swift',
  unlockedCarIds: [
    'hatchback_swift',
    'sedan_executive',
    'sports_coupe',
    'suv_luxury_cruiser',
    'supercar_apex',
  ],
  transmissionMode: 'manual',
};

export function calculateLevelFromXP(xp: number): number {
  if (xp >= 5000) return 5;
  if (xp >= 3000) return 4;
  if (xp >= 1500) return 3;
  if (xp >= 500) return 2;
  return 1;
}
