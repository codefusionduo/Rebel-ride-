'use client';

import React, { useState, useEffect } from 'react';
import { DrivingCanvas, CameraViewMode } from '@/components/3d/DrivingCanvas';
import { CockpitOverlay } from '@/components/CockpitOverlay';
import { DrivingAcademyModal } from '@/components/DrivingAcademyModal';
import { GarageModal } from '@/components/GarageModal';
import { RebelRideIntro, IntroStage } from '@/components/RebelRideIntro';
import { CAR_CATALOG, CarConfig } from '@/lib/cars';
import { HINDI_HUMAN_DIALOGUES, HumanHindiDialogue } from '@/lib/city-builder';
import {
  INITIAL_MISSIONS,
  DEFAULT_DRIVER_STATS,
  DrivingMission,
  DriverStats,
  calculateLevelFromXP,
} from '@/lib/missions';
import { audioEngine } from '@/lib/audio';
import { BookOpen, ShieldCheck, Play } from 'lucide-react';

export default function DrivingSimulatorPage() {
  // Game & Driver State
  const [stats, setStats] = useState<DriverStats>(DEFAULT_DRIVER_STATS);
  const [selectedCar, setSelectedCar] = useState<CarConfig>(CAR_CATALOG[0]);
  const [missions, setMissions] = useState<DrivingMission[]>(INITIAL_MISSIONS);

  // Opening Cinematic Intro Sequence: 'city_drive' -> 'logo_reveal' -> 'driving'
  const [introStage, setIntroStage] = useState<IntroStage>('city_drive');

  // Camera & Weather State
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('cockpit');
  const [isRainy, setIsRainy] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Modals & Rule Toast Notification
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [ruleNotification, setRuleNotification] = useState<{
    id: number;
    deltaCoins: number;
    message: string;
  } | null>(null);
  const [humanDialogue, setHumanDialogue] = useState<HumanHindiDialogue | null>(
    HINDI_HUMAN_DIALOGUES.ambient[0]
  );

  // Cycle to the next Hindi dialogue when the player taps the speech bubble
  const handleCycleHumanDialogue = () => {
    const allDialogues = [
      ...HINDI_HUMAN_DIALOGUES.ambient,
      ...HINDI_HUMAN_DIALOGUES.praise,
      ...HINDI_HUMAN_DIALOGUES.horn,
      ...HINDI_HUMAN_DIALOGUES.fast,
      ...HINDI_HUMAN_DIALOGUES.angry,
    ];
    const currentIndex = allDialogues.findIndex(
      (d) => d.hindi === humanDialogue?.hindi
    );
    const nextDialogue = allDialogues[(currentIndex + 1) % allDialogues.length];
    setHumanDialogue(nextDialogue);
    audioEngine.speakHindiDialogue(nextDialogue.hindi);
  };

  // Automatically cycle ambient pedestrian Hindi dialogues every 6 seconds while driving
  useEffect(() => {
    if (introStage !== 'driving') return;
    const interval = setInterval(() => {
      setHumanDialogue((prev) => {
        const pool = [
          ...HINDI_HUMAN_DIALOGUES.ambient,
          ...HINDI_HUMAN_DIALOGUES.praise,
        ];
        const idx = pool.findIndex((d) => d.hindi === prev?.hindi);
        const next = pool[(idx + 1 + Math.floor(Math.random() * 3)) % pool.length];
        audioEngine.speakHindiDialogue(next.hindi);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [introStage]);

  // Progress through Intro Sequence: City Driving Showcase (3.3s) -> Rebel Ride Logo Reveal (3.4s) -> Driving Screen
  useEffect(() => {
    if (introStage === 'city_drive') {
      const t1 = setTimeout(() => {
        setIntroStage('logo_reveal');
      }, 3300);
      return () => clearTimeout(t1);
    }
    if (introStage === 'logo_reveal') {
      const t2 = setTimeout(() => {
        setIntroStage('driving');
      }, 3400);
      return () => clearTimeout(t2);
    }
  }, [introStage]);

  // Telemetry updated per frame from 3D canvas
  const [telemetry, setTelemetry] = useState<{
    speedKmH: number;
    rpm: number;
    gear: number;
    clutch: number;
    brake: number;
    accel: number;
    isStalled: boolean;
    isEngineRunning: boolean;
    steeringAngle: number;
    distanceDrivenMeters: number;
    carX: number;
    carZ: number;
    carHeadingRad: number;
    trafficSignalState: 'red' | 'yellow' | 'green';
    trafficSignalDist: number;
    trafficSignalSeconds: number;
    roadName: string;
    cityName: string;
    isHighway: boolean;
    speedLimitKmH: number;
  }>({
    speedKmH: 0,
    rpm: 800,
    gear: 1,
    clutch: 0,
    brake: 0,
    accel: 0,
    isStalled: false,
    isEngineRunning: true,
    steeringAngle: 0,
    distanceDrivenMeters: 0,
    carX: 4.5,
    carZ: 0,
    carHeadingRad: 0,
    trafficSignalState: 'green',
    trafficSignalDist: 60,
    trafficSignalSeconds: 8,
    roadName: 'Embassy Central Ave',
    cityName: 'Capital Embassy City',
    isHighway: false,
    speedLimitKmH: 105,
  });

  // User Interactive Control Inputs
  const [controlInputs, setControlInputs] = useState({
    clutch: 0,
    brake: 0,
    accel: 0,
    steering: 0,
    gear: 1,
    horn: false,
    headlights: true,
    highBeam: false,
    hazardLights: false,
    turnSignalLeft: false,
    turnSignalRight: false,
    wipers: false,
    isEngineRunning: true,
  });

  // Handle Control Value Changes from Cockpit Overlay or Keyboard
  const handleControlChange = (key: string, value: any) => {
    if (key === 'transmissionMode') {
      setStats((prev) => ({ ...prev, transmissionMode: value }));
      return;
    }
    setControlInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Restart Engine (Ignition) after stall
  const handleIgnitionStart = () => {
    audioEngine.playStarter();
    setControlInputs((prev) => ({ ...prev, isEngineRunning: true }));
    setTelemetry((prev) => ({ ...prev, isStalled: false, isEngineRunning: true }));
  };

  // Engine Stall Callback
  const handleStallOccurred = () => {
    setStats((prev) => ({ ...prev, stallsCount: prev.stallsCount + 1 }));
  };

  // Traffic Rule Followed / Broken Coins Handler
  const handleRuleEvent = (deltaCoins: number, message: string) => {
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + deltaCoins,
      redLightsObeyed: deltaCoins > 0 ? prev.redLightsObeyed + 1 : prev.redLightsObeyed,
      collisionsCount: deltaCoins < 0 ? prev.collisionsCount + 1 : prev.collisionsCount,
    }));
    const id = Date.now();
    setRuleNotification({ id, deltaCoins, message });
    setTimeout(() => {
      setRuleNotification((curr) => (curr && curr.id === id ? null : curr));
    }, 2800);
  };

  // Mission Progress Handler
  const handleMissionProgress = (type: string, deltaMeters: number) => {
    setStats((prev) => {
      const newDist = prev.totalDistanceMeters + deltaMeters;
      const newXP = prev.xp + Math.floor(deltaMeters * 0.1); // 1 XP per 10m driven
      const newLevel = calculateLevelFromXP(newXP);

      return {
        ...prev,
        totalDistanceMeters: newDist,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  // Select Car from Garage or Top-Left Car Switcher
  const handleSelectCar = (car: CarConfig) => {
    setSelectedCar(car);
    setStats((prev) => ({
      ...prev,
      selectedCarId: car.id,
      transmissionMode: car.isAutomaticDefault ? 'automatic' : 'manual',
    }));
    setControlInputs((prev) => ({
      ...prev,
      gear: 1,
    }));
  };

  // Cycle to the next car when clicking the Top-Left Car Info Badge
  const handleCycleCar = () => {
    const currentIndex = CAR_CATALOG.findIndex((c) => c.id === selectedCar.id);
    const nextCar = CAR_CATALOG[(currentIndex + 1) % CAR_CATALOG.length];
    handleSelectCar(nextCar);
    setRuleNotification({
      id: Date.now(),
      deltaCoins: 1,
      message: `Car Changed: ${nextCar.name} (${nextCar.topSpeedKmH} KM/H)`,
    });
  };

  // Unlock Car with XP
  const handleUnlockCar = (carId: string) => {
    setStats((prev) => {
      if (prev.unlockedCarIds.includes(carId)) return prev;
      return {
        ...prev,
        unlockedCarIds: [...prev.unlockedCarIds, carId],
      };
    });
  };

  const handleToggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
    return muted;
  };

  return (
    <main className="relative w-full h-screen h-dvh overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D Scene Canvas */}
      <DrivingCanvas
        stats={stats}
        selectedCar={selectedCar}
        onUpdateTelemetry={setTelemetry}
        onStallOccurred={handleStallOccurred}
        onMissionProgress={handleMissionProgress}
        onRuleEvent={handleRuleEvent}
        onHumanDialogue={setHumanDialogue}
        controlInputs={controlInputs}
        cameraMode={cameraMode}
        introStage={introStage}
        isRainy={isRainy}
        isNight={isNight}
        onIgnitionStart={handleIgnitionStart}
      />

      {/* Cockpit HUD Overlay (visible when in Driving Screen) */}
      <div
        className={`transition-opacity duration-500 ${
          introStage === 'driving' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <CockpitOverlay
          telemetry={telemetry}
          selectedCar={selectedCar}
          stats={stats}
          missions={missions}
          activeMissionId={activeMissionId}
          ruleNotification={ruleNotification}
          humanDialogue={humanDialogue}
          onTriggerHumanDialogue={handleCycleHumanDialogue}
          cameraMode={cameraMode}
          onCameraChange={setCameraMode}
          onControlChange={handleControlChange}
          onIgnitionStart={handleIgnitionStart}
          onOpenMissions={() => setIsMissionsOpen(true)}
          onOpenGarage={() => setIsGarageOpen(true)}
          onCycleCar={handleCycleCar}
          onOpenHelp={() => setIsHelpOpen(true)}
          isRainy={isRainy}
          isNight={isNight}
          onToggleRain={() => {
            setIsRainy(!isRainy);
            setControlInputs((prev) => ({ ...prev, wipers: !isRainy }));
          }}
          onToggleNight={() => setIsNight(!isNight)}
          onToggleAudio={handleToggleAudio}
          isAudioMuted={isAudioMuted}
          controlInputs={controlInputs}
        />
      </div>

      {/* Opening Cinematic Animation: 1) 3D City Driving Showcase -> 2) REBEL RIDE Logo -> 3) Driving Screen */}
      <RebelRideIntro
        stage={introStage}
        onSkipOrStart={() => setIntroStage('driving')}
        carName={selectedCar.name}
        carAccentColor={selectedCar.accentColor}
      />

      {/* Desktop Floating Help Guide & Intro Replay Trigger Buttons */}
      {introStage === 'driving' && (
        <div className="hidden xl:flex absolute bottom-6 left-6 z-30 items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>How to Drive &amp; Traffic Rules</span>
          </button>
          <button
            onClick={() => setIntroStage('city_drive')}
            className="p-3 bg-slate-900/90 hover:bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/40 shadow-2xl flex items-center gap-1.5 text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
            title="Replay Rebel Ride Opening Animation"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400" />
            <span>Replay Intro</span>
          </button>
        </div>
      )}

      {/* Driving Academy Missions Modal */}
      <DrivingAcademyModal
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        missions={missions}
        stats={stats}
        onSelectMission={(m) => {
          setActiveMissionId(m.id);
        }}
      />

      {/* Car Garage Showcase Modal */}
      <GarageModal
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        stats={stats}
        selectedCar={selectedCar}
        onSelectCar={handleSelectCar}
        onUnlockCar={handleUnlockCar}
      />

      {/* Driving Guide & Traffic Rules Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn pointer-events-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-slate-100">Traffic Rules, Coins & Driving Guide</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                <strong className="text-emerald-400">1. Earn Coins (+1 / +2 Coins):</strong> Stop before the stop line at a{' '}
                <span className="text-red-400 font-bold">RED Traffic Light (+2 Coins)</span>, cross intersections on a{' '}
                <span className="text-emerald-400 font-bold">GREEN Light (+2 Coins)</span>, and drive cleanly on the road within the 85 KM/H speed limit{' '}
                <span className="text-amber-300 font-bold">(+1 Coin every 55m)</span>!
              </p>
              <p>
                <strong className="text-red-400">2. Rule Penalties (Minus Coins):</strong> Jumping a{' '}
                <span className="text-red-400 font-bold">RED Traffic Light (-3 Coins)</span>, crashing into road curbs or AI traffic cars{' '}
                <span className="text-red-400 font-bold">(-2 Coins)</span>, or overspeeding above 105 KM/H{' '}
                <span className="text-red-400 font-bold">(-1 Coin)</span> will deduct your coins!
              </p>
              <p>
                <strong className="text-blue-400">3. Clutch & Gear Shifting:</strong> Press Clutch (Shift) before selecting gears (1-6, N, R). Use R + Gas to reverse, and Brake (S) to stop at 0 KM/H.
              </p>
              <p>
                <strong className="text-amber-400">4. Landmarks & Day/Night:</strong> Visit the Grand Embassy Plaza with classical pillars, dome, and flags, and toggle Day/Night mode anytime from the top bar!
              </p>
            </div>

            <button
              onClick={() => setIsHelpOpen(false)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Got it, let&apos;s drive!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
